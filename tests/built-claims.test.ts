import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { OPERATIONAL_CLAIMS, claimsFoundIn } from '../src/lib/claims';

/**
 * How many BUILT PAGES publish each unconfirmed operational claim, read from
 * rendered text. A ceiling, so the numbers may fall but never rise.
 *
 * ## Why this exists alongside the source-level claims guard
 *
 * `src/lib/claims.test.ts` reads source through `runtime-text.ts`, which
 * reconstructs what a page paints from the TypeScript AST. That reconstruction
 * is necessary — the register's job is naming WHICH SOURCE FILE publishes a
 * claim, because that list is the owner's retraction worklist, and rendered
 * HTML cannot attribute a phrase back to a module.
 *
 * But it cannot be complete. Four review rounds on #148 each found another
 * construction it missed — `${expr}` interpolations, expression-valued
 * attributes, concatenation, and text either side of a conditional — and the
 * supply of constructions is unbounded: a `.join()`, a helper returning a
 * literal, a `.map()`. Each was a real false negative, and none of them was in
 * the codebase.
 *
 * So completeness comes from here instead. This reads what the browser
 * receives, which is construction-independent by definition: however the copy
 * was assembled, if a page shows it, this sees it. That changes what a gap in
 * the AST scan costs — it can no longer let a claim reach a homeowner
 * unnoticed, only make the retraction worklist incomplete. Attribution from
 * the AST, completeness from the build.
 *
 * ## Why counts rather than a page list
 *
 * The warranty line is on 148 of 182 pages. Pinning the list would be a
 * 148-entry fixture that churns on every new page and tells the reader
 * nothing; the number is the fact that matters — and it is the fact the
 * owner needs, because it is the size of the exposure.
 *
 * ## These numbers are the argument for resolving the claims
 *
 * The source inventory counts 21 FILES. That understates the position badly.
 * At page level, 148 pages tell a homeowner there is a written workmanship
 * warranty and 143 name a dedicated project lead — none of it confirmed by the
 * owner. Against a $250k Great Falls basement that is contract-dispute
 * material. See `src/lib/claims.ts` for the register and the retraction
 * worklist.
 */

const ROOT = '.next/server/app';

/**
 * Pages publishing each claim, as of 2026-09-18 on the Tier C build.
 *
 * An EXACT SNAPSHOT, not a ceiling, and the difference matters. A ceiling only
 * fails when the count rises above it, which leaves headroom: retract a claim
 * from ten pages, then later add it to ten different ones, and both changes
 * pass while the recorded number never moves. That is a fixed maximum wearing
 * a ratchet's name — Codex found the gap on #148, in wording I had written
 * myself.
 *
 * Requiring equality makes it a real ratchet: a reduction fails too, and the
 * only way to clear that failure is to write the smaller number here, so
 * progress is locked in and cannot be spent later.
 *
 * Lowering a number is therefore routine and good — it records a retraction or
 * a retired page. RAISING one is legitimate only when the owner has confirmed
 * that claim, at which point its status in `claims.ts` changes and it leaves
 * this table entirely. Raising it to silence a failure is the move
 * `claims.ts`'s howToFix forbids.
 */
const PAGE_COUNTS: Readonly<Record<string, number>> = {
  'written-workmanship-warranty': 148,
  'named-project-lead': 143,
  'daily-updates': 140,
  'clean-job-site': 135,
  'active-work-timeline': 16,
  'daily-progress-photos': 13,
  'same-day-response': 8,
};

/**
 * Text a visitor can perceive: body copy plus the attribute values that reach
 * people through assistive technology or a tooltip.
 *
 * Attributes must be lifted out BEFORE tags are stripped. Removing `<[^>]+>`
 * deletes `alt`, `aria-label` and `title` along with the markup, so a claim
 * added only through one of those would leave every count below unchanged and
 * this guard would pass — while `runtime-text.ts` counts exactly those
 * attributes as published copy, having been fixed to do so earlier in this
 * same PR. The two guards disagreeing about what "published" means, with the
 * backstop being the weaker one, defeats the point of having a backstop.
 * Codex found it on #148.
 *
 * Each value becomes its own chunk, newline-separated, so an attribute cannot
 * fuse with the body text beside it into a phrase no one reads. The register's
 * patterns use literal spaces rather than `\s+`, so a newline reliably breaks
 * a match.
 */
const PERCEIVABLE_ATTRS = /\b(?:alt|aria-label|aria-description|title|placeholder)="([^"]*)"/gi;

function visibleText(html: string): string {
  const withoutCode = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ');

  const chunks = [withoutCode.replace(/<[^>]+>/g, ' ')];
  for (const m of withoutCode.matchAll(PERCEIVABLE_ATTRS)) chunks.push(m[1]);

  return chunks
    .map((c) => c.replace(/&[a-z]+;|&#\d+;/gi, ' ').replace(/[^\S\n]+/g, ' ').trim())
    .join('\n');
}

function builtPages(): string[] {
  const out: string[] = [];
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.html')) out.push(full);
    }
  };
  walk(ROOT);
  return out;
}

describe('unconfirmed claims in rendered pages', () => {
  const hasBuild = fs.existsSync(ROOT);

  it('has build output to read', () => {
    expect(
      hasBuild,
      `${ROOT} is missing — run \`npm run build\` first. This suite asserts nothing without it.`
    ).toBe(true);
  });

  if (!hasBuild) return;

  const pages = builtPages();
  const counts = new Map<string, number>();
  const examples = new Map<string, string>();
  for (const file of pages) {
    const route = file.slice(ROOT.length).replace(/\.html$/, '') || '/';
    for (const claim of claimsFoundIn(visibleText(fs.readFileSync(file, 'utf8')))) {
      counts.set(claim.id, (counts.get(claim.id) ?? 0) + 1);
      if (!examples.has(claim.id)) examples.set(claim.id, route);
    }
  }

  /**
   * Proves the scan before concluding from it. A walker that found no pages, or
   * a stripper that removed everything, would make the ceilings below pass
   * silently — which is how two unfalsifiable tests shipped earlier in this
   * feature.
   */
  it('reads the built pages and finds the claims it is counting', () => {
    expect(pages.length, 'built pages').toBeGreaterThan(100);
    expect(counts.size, 'distinct claims found in rendered text').toBeGreaterThan(4);
    // The sitewide warranty line must be found on most of the site, or the
    // stripper is eating content rather than markup.
    expect(counts.get('written-workmanship-warranty') ?? 0).toBeGreaterThan(100);
  });

  it('records a page count for every unconfirmed claim in the register', () => {
    const unconfirmed = OPERATIONAL_CLAIMS.filter((c) => c.status === 'unconfirmed').map((c) => c.id);
    const missing = unconfirmed.filter((id) => !(id in PAGE_COUNTS));
    expect(
      missing,
      `unconfirmed claims with no recorded page count: ${missing.join(', ')} — add one, measured, or this claim can spread unwatched`
    ).toEqual([]);
    // And no stale entry for a claim that has been confirmed or removed.
    const stale = Object.keys(PAGE_COUNTS).filter((id) => !unconfirmed.includes(id));
    expect(
      stale,
      `page counts for claims no longer unconfirmed: ${stale.join(', ')} — remove them`
    ).toEqual([]);
  });

  /**
   * Equality in both directions. A rise is new copy inheriting an unconfirmed
   * claim. A fall is progress, and it must be recorded rather than banked as
   * headroom for a future rise.
   */
  it('publishes each unconfirmed claim on exactly the recorded number of pages', () => {
    const drift = Object.entries(PAGE_COUNTS).flatMap(([id, recorded]) => {
      const actual = counts.get(id) ?? 0;
      if (actual === recorded) return [];
      return actual > recorded
        ? `${id} now renders on ${actual} pages, up from ${recorded} (e.g. ${examples.get(id)}) — new copy inherited a claim the owner has not confirmed. Remove it; only a confirmation from the owner justifies a higher number, and that moves the claim out of this table entirely`
        : `${id} now renders on ${actual} pages, down from ${recorded} — good. Record ${actual} here so the reduction is locked in and cannot be spent on a later page`;
    });
    expect(drift, drift.join('; ')).toEqual([]);
  });
});

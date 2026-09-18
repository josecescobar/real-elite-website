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
 * Everything on a page that can put a claim in front of a person.
 *
 * Three surfaces beyond the body copy, and all three are invisible to a naive
 * tag strip:
 *
 *   - PERCEIVABLE ATTRIBUTES — `alt`, `aria-label`, `title` and friends reach
 *     people through assistive technology and tooltips. `runtime-text.ts`
 *     counts them as published copy, and this file stripping them meant the
 *     two guards disagreed, with the backstop being the weaker one.
 *   - META CONTENT — a description is read by a homeowner in the search
 *     result, before they ever load the page. This one matters most for
 *     `content/blog`, which the source-level claims scan does not walk at all
 *     (it walks `src`), so blog frontmatter has no other guard anywhere.
 *   - JSON-LD — structured data surfaces in rich results.
 *
 * Codex found the attribute gap and then the metadata gap on #148. JSON-LD is
 * included in the same pass rather than left as a stated bound, because the
 * argument for it is identical and a bound I have to remember is a bound I
 * will forget — this PR has two examples of exactly that.
 *
 * Meta `content` is captured WITHOUT an allowlist of names. An allowlist would
 * be one more list to keep current, which is the failure mode the claims
 * register's prose scope list already demonstrated; and a machine-directive
 * meta like `viewport` cannot match a claim pattern, since those are specific
 * English phrases. Over-capturing here is safe, under-capturing is not.
 *
 * Each value is its own newline-separated chunk so nothing fuses with its
 * neighbour into a phrase no one reads. The register's patterns use literal
 * spaces rather than `\s+`, so a newline reliably breaks a match.
 */
const PERCEIVABLE_ATTRS = /\b(?:alt|aria-label|aria-description|title|placeholder)="([^"]*)"/gi;
const META_CONTENT = /<meta[^>]+content="([^"]*)"[^>]*>/gi;
const JSON_LD = /<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi;

function visibleText(html: string): string {
  const chunks: string[] = [];

  // Before scripts are dropped: structured data is user-facing via rich results.
  for (const m of html.matchAll(JSON_LD)) chunks.push(m[1]);

  const withoutCode = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ');

  // Before tags are dropped: metadata and attribute text live inside them.
  for (const m of withoutCode.matchAll(META_CONTENT)) chunks.push(m[1]);
  for (const m of withoutCode.matchAll(PERCEIVABLE_ATTRS)) chunks.push(m[1]);

  chunks.push(withoutCode.replace(/<[^>]+>/g, ' '));

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

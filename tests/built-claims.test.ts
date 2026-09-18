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
 * A CEILING. Lower is the goal — the number falls when the owner retracts a
 * claim or a page stops carrying it. It rises only when new copy inherits one,
 * which is the thing this exists to catch.
 *
 * Raising a number here is legitimate ONLY when the owner has confirmed that
 * claim, in which case its status in `claims.ts` changes and it leaves this
 * table entirely. Raising it to make a failure go away is the move
 * `claims.ts`'s howToFix forbids.
 */
const PAGE_CEILINGS: Readonly<Record<string, number>> = {
  'written-workmanship-warranty': 148,
  'named-project-lead': 143,
  'daily-updates': 140,
  'clean-job-site': 135,
  'active-work-timeline': 16,
  'daily-progress-photos': 13,
  'same-day-response': 8,
};

/** Text a visitor can read: tags, scripts, styles and entities removed. */
function visibleText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;|&#\d+;/gi, ' ')
    .replace(/\s+/g, ' ');
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

  it('counts a ceiling for every unconfirmed claim in the register', () => {
    const unconfirmed = OPERATIONAL_CLAIMS.filter((c) => c.status === 'unconfirmed').map((c) => c.id);
    const missing = unconfirmed.filter((id) => !(id in PAGE_CEILINGS));
    expect(
      missing,
      `unconfirmed claims with no page ceiling: ${missing.join(', ')} — add one, measured, or this claim can spread unwatched`
    ).toEqual([]);
    // And no stale entry for a claim that has been confirmed or removed.
    const stale = Object.keys(PAGE_CEILINGS).filter((id) => !unconfirmed.includes(id));
    expect(
      stale,
      `page ceilings for claims no longer unconfirmed: ${stale.join(', ')} — remove them`
    ).toEqual([]);
  });

  it('does not publish an unconfirmed claim on more pages than before', () => {
    const risen = Object.entries(PAGE_CEILINGS)
      .filter(([id, ceiling]) => (counts.get(id) ?? 0) > ceiling)
      .map(
        ([id, ceiling]) =>
          `${id} now renders on ${counts.get(id)} pages, up from ${ceiling} (e.g. ${examples.get(id)}) — new copy inherited a claim the owner has not confirmed. Remove it, or raise the ceiling only once the owner confirms the claim`
      );
    expect(risen, risen.join('; ')).toEqual([]);
  });
});

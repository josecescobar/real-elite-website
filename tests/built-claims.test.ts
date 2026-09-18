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
 * The pages publishing each unconfirmed claim, as `tests/claim-pages.json`.
 *
 * A SET OF ROUTES, not a count, and the difference is the point. An exact count
 * still passes an atomic relocation: retract a claim from one page while
 * another starts publishing it in the same change and `148 === 148` holds, so a
 * new page inherits an unconfirmed promise with nothing failing. That is most
 * reachable exactly where there is no other guard — blog metadata and
 * dynamically assembled copy, which the source-level inventory does not walk.
 * Codex found it on #148, one round after the count itself replaced a ceiling
 * for a related reason.
 *
 * Additions and removals are reported SEPARATELY, because they mean opposite
 * things: an addition is a defect to remove, a removal is progress to record.
 *
 * It doubles as the owner's page-level retraction worklist. `claims.ts` names
 * the 21 source FILES carrying each claim, which is what you edit; this names
 * the 603 rendered PAGES, which is what a homeowner actually sees — and for
 * `content/blog` it is the only such list that exists, since the source scan
 * walks `src` alone.
 *
 * ## Updating it
 *
 * `UPDATE_CLAIM_PAGES=1 npm run test:built` rewrites the file. That is a
 * convenience, not an escape hatch: the result is a committed diff, and a diff
 * that ADDS routes to an unconfirmed claim is the guard reporting a problem in
 * the most reviewable form there is. Regenerating to silence a failure is the
 * move `claims.ts`'s howToFix forbids.
 */
/**
 * Which claims belong in the snapshot. ONE definition, used by both the
 * validation and the regenerator.
 *
 * They decided this independently before, and drifted: the regenerator wrote
 * every registered claim while the validation rejected any that was no longer
 * unconfirmed, so confirming a claim produced a file that could not pass. Two
 * places deciding the same thing is the defect; this is the fix.
 */
const snapshotClaimIds = (): string[] =>
  OPERATIONAL_CLAIMS.filter((c) => c.status === 'unconfirmed').map((c) => c.id);

const SNAPSHOT_PATH = 'tests/claim-pages.json';
const SNAPSHOT: Record<string, string[]> = JSON.parse(fs.readFileSync(SNAPSHOT_PATH, 'utf8'));

/**
 * Update mode replaces the snapshot, so nothing may be ASSERTED against the old
 * one in the same run.
 *
 * The regenerator alone was not enough: the stale-entry and unknown-route
 * checks still compared against the file being replaced, so the documented
 * command exited 1 while correctly rewriting it — and the result only passed on
 * a second invocation. An owner following the instructions would have seen a
 * failure and reasonably concluded it had not worked.
 *
 * Codex found it on #148, one round after I claimed to have verified this exact
 * flow end to end. I had, except that I ran the update step as
 * `... >/dev/null 2>&1` and never looked at its exit code — the same mistake as
 * the `npm run build | grep -c error; echo BUILD_OK` at the start of this PR,
 * where an unconditional echo printed success over a failing build. Twice in
 * one PR I threw away the exit status of the thing I was checking.
 */
const UPDATING = Boolean(process.env.UPDATE_CLAIM_PAGES);

/**
 * Everything on a page that can put a claim in front of a person.
 *
 * Body copy is the obvious surface and the only one a naive tag strip keeps.
 * Three more reach people and were each found missing in turn on #148:
 *
 *   - ATTRIBUTE VALUES — `alt` and `aria-label` through assistive technology,
 *     `title` through a tooltip, `value` on a submit button as the button's
 *     own label, `aria-valuetext` on a widget. `runtime-text.ts` counts
 *     attributes as published copy, so this file dropping them meant the two
 *     guards disagreed, with the backstop being the weaker one.
 *   - META CONTENT — a description is read in the search result before the
 *     page loads. This matters most for `content/blog`, which the source-level
 *     claims scan does not walk at all, so blog frontmatter has no other guard.
 *   - JSON-LD — structured data surfaces in rich results.
 *
 * NO ALLOWLIST, and that is the lesson of the three rounds rather than a
 * shortcut. Two successive versions enumerated the attributes that count, and
 * the second was found incomplete for exactly the reason I had given one round
 * earlier when declining to enumerate meta names: a list of what counts is a
 * list to keep current, and this PR has already shown the claims register's
 * prose scope list going stale and missing five files. Every attribute value
 * is captured instead.
 *
 * Over-capturing is safe HERE specifically because the register's patterns are
 * English phrases separated by literal spaces. A class token, a URL slug or a
 * data attribute cannot match `/workmanship warranty/i` — slugs hyphenate. And
 * the failure directions are not symmetric: a false positive on this guard is
 * a page to go and look at, a false negative is an unconfirmed promise reaching
 * a homeowner.
 *
 * Each value is its own newline-separated chunk so nothing fuses with its
 * neighbour into a phrase no one reads; the patterns use literal spaces rather
 * than `\s+`, so a newline reliably breaks a match.
 */
const ANY_ATTRIBUTE = /\s[a-zA-Z_:][-a-zA-Z0-9_:.]*="([^"]*)"/g;
const JSON_LD = /<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi;

function visibleText(html: string): string {
  const chunks: string[] = [];

  // Before scripts are dropped: structured data is user-facing via rich results.
  for (const m of html.matchAll(JSON_LD)) chunks.push(m[1]);

  const withoutCode = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ');

  // Before tags are dropped: metadata and label text live inside them.
  for (const m of withoutCode.matchAll(ANY_ATTRIBUTE)) chunks.push(m[1]);

  chunks.push(withoutCode.replace(/<[^>]+>/g, ' '));

  // Collapse ALL whitespace inside a chunk, newlines included. An earlier
  // version preserved internal newlines, which bought nothing — the join below
  // already separates chunks — while a value containing a literal newline, say
  // an aria-label of `Written workmanship\nwarranty`, is presented by the
  // browser and by accessible-name computation as a space and so escaped the
  // pattern. Codex found it on #148.
  return chunks
    .map((c) => c.replace(/&[a-z]+;|&#\d+;/gi, ' ').replace(/\s+/g, ' ').trim())
    .join('\n');
}

/**
 * The route a built artifact serves.
 *
 * Next writes the homepage as `index.html`, which the naive derivation turned
 * into `/index` — a route this app does not have. The snapshot then listed
 * `/index` under four claims and omitted `/`, so the retraction worklist
 * pointed the owner at a page that does not exist while leaving out the
 * homepage, which is the most-read page carrying those promises. Codex found
 * it on #148, in data I had just handed over as a deliverable.
 */
function routeOf(file: string): string {
  const path = file.slice(ROOT.length).replace(/\.html$/, '');
  return path === '/index' || path === '' ? '/' : path;
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
  /** claim id -> the routes whose rendered output publishes it. */
  const actual = new Map<string, Set<string>>();
  for (const file of pages) {
    const route = routeOf(file);
    for (const claim of claimsFoundIn(visibleText(fs.readFileSync(file, 'utf8')))) {
      if (!actual.has(claim.id)) actual.set(claim.id, new Set());
      actual.get(claim.id)!.add(route);
    }
  }

  /**
   * Proves the scan before concluding from it — WITHOUT requiring that any
   * claim still be published.
   *
   * The first version asserted a floor on the number of claims found and on the
   * warranty's page count. Both were anti-vacuity checks written as fixed
   * minimums on quantities this project exists to drive to zero: retract three
   * of the seven claims and the suite failed, verify the last one and it failed
   * permanently, in update mode too, so the owner could not even record the
   * progress. The guard punished the outcome it was built to reach. Codex found
   * both on #148.
   *
   * What actually needs proving is that the WALKER and the STRIPPER work. Both
   * are checked against content that has nothing to do with claims, so the
   * check keeps its force as the claims go away.
   */
  it('reads the built pages and extracts their text', () => {
    expect(pages.length, 'built pages').toBeGreaterThan(100);

    // The stripper must yield real prose from a real page. `Real Elite
    // Contracting` is the business name, present sitewide and independent of
    // every claim, so this holds after the last retraction.
    const home = pages.find((f) => routeOf(f) === '/');
    expect(home, 'the homepage must be built').toBeDefined();
    const homeText = visibleText(fs.readFileSync(home!, 'utf8'));
    expect(homeText.length, 'extracted homepage text').toBeGreaterThan(2000);
    expect(homeText).toMatch(/Real Elite Contracting/i);

    // And the matcher must be wired to the register: a phrase from a claim's
    // own label is found when it is present in text we supply here, which
    // tests claimsFoundIn without depending on the site still publishing it.
    // The matcher is exercised only when there IS a claim to match. An empty
    // register is the all-retracted terminal state — the documented workflow
    // deletes the entry — and indexing [0] there throws, so the fix for one
    // terminal state blocked the other. Codex found it on #148, in code I had
    // written one round earlier to stop exactly this kind of blocking, and
    // duplicated across two files in the same commit where I wrote about
    // duplication.
    //
    // Guarding rather than asserting is honest here: with no claims registered
    // there is nothing for the matcher to find, and a synthetic fixture would
    // test a pattern the register does not contain.
    const [sample] = OPERATIONAL_CLAIMS;
    if (sample) {
      expect(claimsFoundIn(sample.label).map((c) => c.id)).toContain(sample.id);
    }
  });

  it.skipIf(UPDATING)('records a page list for every unconfirmed claim in the register', () => {
    const unconfirmed = snapshotClaimIds();
    const missing = unconfirmed.filter((id) => !(id in SNAPSHOT));
    expect(
      missing,
      `unconfirmed claims with no recorded page list: ${missing.join(', ')} — regenerate the snapshot, or this claim can spread unwatched`
    ).toEqual([]);
    const stale = Object.keys(SNAPSHOT).filter((id) => !unconfirmed.includes(id));
    expect(
      stale,
      `page lists for claims no longer unconfirmed: ${stale.join(', ')} — remove them`
    ).toEqual([]);
  });

  /**
   * The worklist must point at pages that exist.
   *
   * It listed `/index` under four claims and omitted `/`, because Next writes
   * the homepage as `index.html`. An owner following that list would have gone
   * looking for a page this app does not have, and would not have been told
   * about the homepage — which carries four of the seven claims.
   */
  it.skipIf(UPDATING)('names only routes the site actually serves', () => {
    const built = new Set(pages.map(routeOf));
    const unknown = [...new Set(Object.values(SNAPSHOT).flat())]
      .filter((route) => !built.has(route))
      .sort();
    expect(
      unknown,
      `the retraction worklist names ${unknown.length} route(s) with no built page: ${unknown.join(', ')}`
    ).toEqual([]);
    // The homepage carries claims and must be named as `/`.
    expect(built.has('/'), 'the homepage must resolve to /').toBe(true);
    expect(built.has('/index'), '/index is not a route').toBe(false);
  });

  /**
   * The regenerator and the validation must agree on which claims belong in
   * the file, or confirming a claim yields a snapshot that cannot pass.
   */
  it('scopes the snapshot to unconfirmed claims only', () => {
    const ids = snapshotClaimIds();
    // NO floor. Zero unconfirmed claims is the terminal state this register
    // exists to reach — every claim confirmed or retracted, snapshot `{}` —
    // and requiring a nonempty list made that state permanently unreachable.
    for (const id of ids) {
      const claim = OPERATIONAL_CLAIMS.find((c) => c.id === id);
      expect(claim?.status).toBe('unconfirmed');
    }
    // Every claim in the register is either snapshotted or verified — no third
    // state that would fall between the two.
    const accounted = OPERATIONAL_CLAIMS.every(
      (c) => ids.includes(c.id) || c.status === 'verified'
    );
    expect(accounted, 'a claim is neither snapshotted nor verified').toBe(true);
  });

  /**
   * Set equality, with the two directions reported apart. A relocation — one
   * page losing the claim while another gains it — leaves the totals identical
   * and is caught here as one addition and one removal.
   */
  /**
   * Update mode: rewrite the file and assert nothing. UNCONFIRMED claims only —
   * writing every registered claim put a newly verified one straight back, so
   * the confirmation workflow could not produce a valid file at all.
   */
  it.runIf(UPDATING)('regenerates the snapshot from the current build', () => {
    const next: Record<string, string[]> = {};
    for (const id of snapshotClaimIds()) {
      // EMPTY ARRAY, not omission. A claim whose last occurrence has been
      // retracted has no routes, and skipping it wrote a file the next normal
      // run rejected as missing an unconfirmed claim — so the updater exited 0
      // and produced something broken. That is the retraction case, which is
      // the outcome this register exists to reach. Codex found it on #148.
      next[id] = [...(actual.get(id) ?? [])].sort();
    }
    fs.writeFileSync(SNAPSHOT_PATH, `${JSON.stringify(next, null, 2)}\n`);
    // Every unconfirmed claim must be a key, including one with no pages left,
    // or the file this just wrote fails the next ordinary run.
    expect(Object.keys(next).sort()).toEqual(snapshotClaimIds().sort());
  });

  it.skipIf(UPDATING)('publishes each unconfirmed claim on exactly the recorded pages', () => {
    const problems: string[] = [];
    for (const [id, recorded] of Object.entries(SNAPSHOT)) {
      const now = actual.get(id) ?? new Set<string>();
      const added = [...now].filter((r) => !recorded.includes(r)).sort();
      const removed = recorded.filter((r) => !now.has(r)).sort();

      if (added.length) {
        problems.push(
          `${id} is now published on ${added.length} page(s) it was not before — ${added.slice(0, 5).join(', ')}${added.length > 5 ? ', …' : ''} — new copy inherited a claim the owner has not confirmed. Remove it; only a confirmation justifies more pages, and that moves the claim out of this snapshot entirely`
        );
      }
      if (removed.length) {
        problems.push(
          `${id} is no longer published on ${removed.length} page(s) — ${removed.slice(0, 5).join(', ')}${removed.length > 5 ? ', …' : ''} — good. Run UPDATE_CLAIM_PAGES=1 npm run test:built so the reduction is locked in and cannot be spent on a later page`
        );
      }
    }
    expect(problems, problems.join(' | ')).toEqual([]);
  });
});

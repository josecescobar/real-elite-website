import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { CONTENT, RETIRED_COMBOS } from '@/lib/service-city-content';
import { SERVICES, SERVICE_AREA_CATALOG } from '@/lib/constants';

/**
 * The site must not link to its own retired, unbuilt, or misspelled
 * service+area pages.
 *
 * Tier C retired ten combos and left five links in four live blog articles
 * pointing at three of the removed URLs — every click and crawl from those
 * articles took a 308 to a page the same change had just declared retired.
 * `/services/[service]/[city]` sets `dynamicParams = false`, so a link to
 * anything without a CONTENT key and without a redirect is a hard 404 the site
 * advertises itself.
 *
 * ## Three holes Codex found in the first version of this file
 *
 *   1. Unknown service slugs were SILENTLY DROPPED. A typo like
 *      `/services/kithens/vienna-va` was matched by the regex and then
 *      discarded because `kithens` is not a service — so the worst case, a
 *      guaranteed 404, was the one case that passed. The slug filter existed to
 *      suppress false positives from module import paths; once the scan was
 *      narrowed to link syntax it was doing harm instead.
 *   2. URL SUFFIXES were ignored. The patterns required `)` or a quote
 *      immediately after the area slug, so `?ref=article`, `#estimate` and the
 *      trailing-slash form all escaped.
 *   3. The "proves its own scan" assertion DID NOT constrain both extractors.
 *      Markdown supplies 17 keys on its own, so breaking the `href` extractor
 *      still left the aggregate above its threshold. A guard against vacuity
 *      that is itself partly vacuous.
 *
 * So the extractor now captures the URL and parses it, each supported syntax is
 * pinned by its own fixture rather than by an aggregate count, and an
 * unrecognised service slug is an offender rather than a skip.
 *
 * ## Why prose needs its own check
 *
 * Template links are derived from CONTENT and cannot go stale —
 * `serviceHrefForArea` and `CityPageTemplate.links.test.tsx` cover those.
 * Hand-written markdown cannot be derived, so it has to be scanned.
 *
 * ## A STATED BOUND: only link syntax is captured
 *
 * The scan reads markdown `](...)` and inline `href=...`. A path built into a
 * variable first — `const to = '/services/roofing/mclean-va'; <a href={to}>` —
 * is invisible to it. That is a real false negative, and it is stated here
 * rather than left implicit, because twice in this PR a hole I noticed and did
 * not write down became the next finding.
 *
 * It is not live: the tree contains no `href={identifier}` at all, and every
 * other `/services/x/y` literal outside link syntax sits in a declaration file
 * below or in a docblock. Widening the capture is deliberately NOT done here —
 * two of the four findings against this file came from widening capture and
 * then getting the gate wrong, so the cost of covering a shape nobody writes
 * is another gate bug. If that shape appears, this is the place to fix.
 */

/** Files ALLOWED to name a retired path, because they declare or assert it. */
const DECLARATION_FILES = new Set([
  'src/lib/retired-combos.ts',
  'next.config.ts',
  'src/lib/service-city-content.test.ts',
  'src/lib/internal-links.test.ts',
]);

const SERVICE_SLUGS = new Set<string>(SERVICES.map((s) => s.slug));
/**
 * Every area slug the catalog declares, active or consolidated.
 *
 * Used to decide whether the area segment of an interpolated URL is a COMPLETE
 * slug or the prefix of a derived one. The catalog is the right set rather than
 * the published-combo keys: `roofing/mclean-va` names a real service and a real
 * area but was never published, which makes it a hard 404 — exactly what the
 * unpublished-combo check exists to catch.
 */
const AREA_SLUGS = new Set<string>(SERVICE_AREA_CATALOG.map((a) => a.slug));
const PUBLISHED = new Set(Object.keys(CONTENT));
const RETIRED = new Set(Object.keys(RETIRED_COMBOS));
const BASE = 'https://www.realelitecontracting.com';

type ComboLink = {
  key: string;
  service: string;
  area: string;
  raw: string;
  /** Path segments under `/services/`. Only 2 can resolve; more is a 404. */
  depth: number;
};

/**
 * Every link in `source` whose path is `/services/<something>/<something>`.
 *
 * Captures the URL from link syntax and then PARSES it, so query strings,
 * fragments and trailing slashes resolve to the same key as the bare path.
 * Two syntaxes are supported:
 *
 *   - markdown  `](/services/kitchens/vienna-va)` — optional "title" allowed
 *   - literal   `href="…"`, `href='…'`, `href={`…`}`
 *
 * Interpolated hrefs are deliberately NOT matched: those are derived from
 * CONTENT and covered by CityPageTemplate.links.test.tsx. This file exists for
 * the links that cannot be derived.
 */
export function extractComboLinks(source: string): ComboLink[] {
  const urls: string[] = [];
  // Markdown: stop at whitespace or the closing paren.
  for (const m of source.matchAll(/\]\((\/[^\s)]+)/g)) urls.push(m[1]);
  // Literal href, any of the three quote forms.
  // `\{?` because JSX writes href={`/...`} — the brace sits between `href=`
  // and the quote. Omitting it made the backtick form silently unmatched,
  // which the per-syntax fixture below caught on its first run.
  for (const m of source.matchAll(/href=\{?["'`](\/[^"'`]+)["'`]/g)) urls.push(m[1]);

  const out: ComboLink[] = [];
  for (const raw of urls) {
    // Where the interpolation sits decides whether the PATH is derived.
    //
    // THREE earlier versions were wrong, each one narrower than the last:
    //
    //   1. Skip the URL if `${` appears anywhere. Dropped
    //      `/services/kitchens/middleburg-va?campaign=${c}` — a hand-written
    //      retired link with a derived query. False negative.
    //   2. Skip if `${` appears before the first literal `?` or `#`. Dropped
    //      `/services/kitchens/middleburg-va${suffix}`, where the suffix
    //      supplies its own `?`. Same false negative, one layer down.
    //   3. Require the literal prefix to form a combo key the repo PUBLISHES
    //      OR RETIRES. Dropped `/services/roofing/mclean-va${suffix}` — both
    //      segments complete and real, the combo never published, so the URL
    //      is a hard 404. That gate could only ever preserve combos already
    //      known, which defeated the never-published check specifically.
    //
    // A purely lexical rule cannot separate "suffix appended after a complete
    // slug" from "slug partially derived" — `/services/kitchens/middleburg${x}`
    // looks identical to the first but the area slug is really derived. What
    // distinguishes them is whether the literal area segment is a slug the
    // CATALOG knows, which is resolvable and does not presume the combo exists.
    // The service segment needs no such test: a `/` follows it, so it is always
    // complete (an interpolation inside it would leave the prefix one segment
    // short and fail the path shape below).
    // SEGMENT COUNT is the rule, rather than a regex that happens to match two.
    // `/services` and `/services/<service>` are real routes; the combo route is
    // exactly two; NOTHING is deeper. So depth alone decides whether a URL can
    // resolve, and `/services/kitchens/vienna-va/${id}/details` is a 404 no
    // matter what `id` holds. The previous version truncated at the first `${`,
    // stripped the trailing slash and read that as the published combo
    // `kitchens-vienna-va`, so the deepest, most certain 404 passed. It also
    // skipped a purely literal `/services/kitchens/vienna-va/details`, which
    // nothing had ever caught.
    const interp = raw.indexOf('${');
    const firstSuffix = raw.search(/[?#]/);
    // An interpolation only bears on the PATH if it sits before the first
    // literal `?` or `#`. One inside a query string cannot add a segment and
    // cannot make the path derived — and treating it as if it could was a
    // second defect in the previous gate: `/services/roofing/nowhere-zz?x=${c}`
    // has a fully literal path and was skipped for failing the area test.
    const interpInPath = interp !== -1 && (firstSuffix === -1 || interp < firstSuffix);
    const literalPath = (interpInPath ? raw.slice(0, interp) : raw).split(/[?#]/)[0];

    let pathname: string;
    try {
      // Parsed from the literal path, so nothing derived affects parsing.
      pathname = new URL(literalPath, BASE).pathname;
    } catch {
      continue;
    }
    const segments = pathname.replace(/\/+$/, '').split('/').filter(Boolean);
    if (segments[0] !== 'services') continue;
    const after = segments.slice(1);

    // The interpolation begins a new segment when the literal path ended on a
    // slash, and adds further ones when the remainder carries a slash of its
    // own. Both are measured against the path portion only.
    const restPath = interpInPath ? raw.slice(interp).split(/[?#]/)[0] : '';
    const addsSegment = interpInPath && (/\/$/.test(literalPath) || restPath.includes('/'));
    const depth = after.length + (addsSegment ? 1 : 0);

    // A service pillar or the index — real routes, nothing to check.
    if (depth <= 1) continue;

    const [service, area] = after;
    if (depth > 2) {
      // Too deep for any route, whatever the derived parts hold.
      out.push({ key: `${service}-${area ?? ''}`, service, area: area ?? '', raw, depth });
      continue;
    }

    // Exactly two, but the second is the interpolation itself — a derived area
    // segment, which CityPageTemplate.links.test.tsx covers.
    if (addsSegment) continue;
    // With an interpolation inside the path, the area segment must be a slug
    // the catalog knows; otherwise that segment was itself partly derived.
    if (interpInPath && !AREA_SLUGS.has(area)) continue;

    out.push({ key: `${service}-${area}`, service, area, raw, depth });
  }
  return out;
}

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!entry.name.startsWith('.') && entry.name !== 'node_modules') walk(full, out);
    } else if (/\.(md|mdx|ts|tsx)$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

function sourceFiles(): string[] {
  const out: string[] = [];
  for (const root of ['content', 'src']) if (fs.existsSync(root)) walk(root, out);
  out.push('next.config.ts');
  return out;
}

/**
 * Each supported syntax and suffix form, pinned individually.
 *
 * The aggregate "the repo contains more than ten links" assertion this
 * replaces could not tell which extractor was working: markdown alone cleared
 * the threshold, so the `href` extractor could have been broken or deleted
 * with nothing failing. Fixtures constrain each form regardless of what the
 * repo happens to contain.
 */
describe('extractComboLinks', () => {
  const cases: [string, string, string | null][] = [
    ['markdown', '[Vienna](/services/kitchens/vienna-va)', 'kitchens-vienna-va'],
    ['markdown with title', '[V](/services/kitchens/vienna-va "Kitchens")', 'kitchens-vienna-va'],
    ['href double quote', '<a href="/services/kitchens/vienna-va">V</a>', 'kitchens-vienna-va'],
    ['href single quote', "<a href='/services/kitchens/vienna-va'>V</a>", 'kitchens-vienna-va'],
    ['href backtick', 'href={`/services/kitchens/vienna-va`}', 'kitchens-vienna-va'],
    ['query string', '[V](/services/kitchens/vienna-va?ref=article)', 'kitchens-vienna-va'],
    ['fragment', '[V](/services/kitchens/vienna-va#estimate)', 'kitchens-vienna-va'],
    ['trailing slash', '[V](/services/kitchens/vienna-va/)', 'kitchens-vienna-va'],
    ['query and fragment', '[V](/services/kitchens/vienna-va/?a=1#b)', 'kitchens-vienna-va'],
    ['misspelled service', '[K](/services/kithens/vienna-va)', 'kithens-vienna-va'],
    ['service pillar, not a combo', '[K](/services/kitchens)', null],
    ['area page, not a combo', '[V](/service-areas/vienna-va)', null],
    ['module import path', "import X from '@/app/services/roofing/page';", null],
    ['interpolated path is skipped', 'href={`/services/${s}/${c}`}', null],
    ['interpolated area segment is skipped', 'href={`/services/kitchens/${city}`}', null],
    // Hard-coded path, interpolated SUFFIX: still a hand-written link, and
    // nothing else covers it. The blanket `${` skip used to drop these.
    [
      'hard-coded path with interpolated query',
      'href={`/services/kitchens/middleburg-va?campaign=${c}`}',
      'kitchens-middleburg-va',
    ],
    [
      'hard-coded path with interpolated fragment',
      'href={`/services/kitchens/middleburg-va#${anchor}`}',
      'kitchens-middleburg-va',
    ],
    // The suffix supplies its own delimiter, so there is no literal `?` or
    // `#` to split on. Resolving the literal prefix is what catches it.
    [
      'hard-coded path with an interpolated suffix that carries its own ?',
      'href={`/services/kitchens/middleburg-va${suffix}`}',
      'kitchens-middleburg-va',
    ],
    // Looks the same lexically, but the area slug is genuinely derived —
    // `middleburg` is not an area slug the catalog knows.
    [
      'partially derived area slug is skipped',
      'href={`/services/kitchens/middleburg${rest}`}',
      null,
    ],
    // A literal segment AFTER an interpolated one. Truncating at the first
    // `${` and stripping the trailing slash read this as the published combo
    // `kitchens-vienna-va`, so the deepest 404 in the set passed.
    [
      'interpolated segment followed by more literal path',
      'href={`/services/kitchens/vienna-va/${id}/details`}',
      'deep:3',
    ],
    [
      'interpolated trailing segment',
      'href={`/services/kitchens/vienna-va/${id}`}',
      'deep:3',
    ],
    [
      'interpolation that carries its own extra segment',
      'href={`/services/kitchens/vienna-va${rest}/details`}',
      'deep:3',
    ],
    // Purely literal and too deep — no interpolation involved at all. Nothing
    // had ever caught this one.
    ['literal path deeper than the combo route', '[V](/services/kitchens/vienna-va/details)', 'deep:3'],
    // A slash inside a QUERY STRING is not a path segment.
    [
      'slash in an interpolated query is not a segment',
      'href={`/services/kitchens/middleburg-va?to=${a}/b`}',
      'kitchens-middleburg-va',
    ],
    // Fully literal path, interpolation only in the query. The area test must
    // not apply here — it made this unknown area silently skip.
    [
      'literal path with an unknown area and an interpolated query',
      'href={`/services/roofing/nowhere-zz?x=${c}`}',
      'roofing-nowhere-zz',
    ],
    // Both segments complete and real, the combo NEVER PUBLISHED. The gate
    // that only preserved known combos dropped this — the worst case again,
    // since a suffix that is a query, a fragment or the empty string leaves a
    // hard 404. It must reach the unpublished-combo check.
    [
      'hard-coded unpublished combo with an interpolated suffix',
      'href={`/services/roofing/mclean-va${suffix}`}',
      'roofing-mclean-va',
    ],
    // Same shape, misspelled service. The area slug is complete, so the path
    // is not derived and the typo is reportable.
    [
      'misspelled service with an interpolated suffix',
      'href={`/services/kithens/vienna-va${suffix}`}',
      'kithens-vienna-va',
    ],
  ];

  it.each(cases)('%s', (_name, source, expected) => {
    // A resolvable link reports its key; a too-deep one reports its depth, so
    // the table cannot read a 404 as a valid combo.
    const got = extractComboLinks(source).map((l) =>
      l.depth === 2 ? l.key : `deep:${l.depth}`
    );
    if (expected === null) expect(got).toEqual([]);
    else expect(got).toEqual([expected]);
  });

  /**
   * The interpolation gate is only as wide as AREA_SLUGS, so a combo whose
   * area the catalog does not declare would be silently dropped when written
   * with a suffix. Nothing else asserts that dependency from this side.
   */
  it('covers every published and retired combo area with a catalog slug', () => {
    const areas = [...PUBLISHED, ...RETIRED].map((key) => key.slice(key.indexOf('-') + 1));
    const missing = [...new Set(areas)].filter((a) => !AREA_SLUGS.has(a));
    expect(missing, `areas absent from SERVICE_AREA_CATALOG: ${missing.join(', ')}`).toEqual([]);
    expect(areas.length).toBeGreaterThan(50);
  });

  it('keeps a misspelled service slug rather than discarding it', () => {
    // The first version filtered these out, so a guaranteed 404 was the one
    // case that passed. It must survive extraction to be reportable.
    const [link] = extractComboLinks('[K](/services/kithens/vienna-va)');
    expect(link).toBeDefined();
    expect(SERVICE_SLUGS.has(link.service)).toBe(false);
  });
});

describe('internal links to service+area pages', () => {
  const files = sourceFiles();
  const scanned = files
    .filter((f) => !DECLARATION_FILES.has(f))
    .map((f) => ({ file: f, links: extractComboLinks(fs.readFileSync(f, 'utf8')) }));

  it('actually walks the tree and finds combo links in prose', () => {
    expect(files.length).toBeGreaterThan(50);
    expect(files.some((f) => f.startsWith('content/blog/'))).toBe(true);
    // Markdown prose specifically — the surface this file exists for.
    const fromProse = scanned.filter((s) => s.file.endsWith('.md')).flatMap((s) => s.links);
    expect(fromProse.length).toBeGreaterThan(10);
  });

  it('never links to a retired combo', () => {
    const offenders = scanned.flatMap(({ file, links }) =>
      links
        .filter((l) => l.depth === 2 && RETIRED.has(l.key))
        .map(
          (l) =>
            `${file} links ${l.raw} — retired, so this click takes a 308. Point it at ${RETIRED_COMBOS[l.key]} or at whatever the anchor text actually names`
        )
    );
    expect(offenders, offenders.join('; ')).toEqual([]);
  });

  it('never links to a combo that was never published', () => {
    const offenders = scanned.flatMap(({ file, links }) =>
      links
        .filter(
          (l) =>
            l.depth === 2 &&
            SERVICE_SLUGS.has(l.service) &&
            !PUBLISHED.has(l.key) &&
            !RETIRED.has(l.key)
        )
        .map(
          (l) =>
            `${file} links ${l.raw}, which is neither published in CONTENT nor retired with a redirect — dynamicParams is false, so that is a hard 404`
        )
    );
    expect(offenders, offenders.join('; ')).toEqual([]);
  });

  /**
   * Too many path segments to resolve at all. `/services` and
   * `/services/<service>` are real routes and the combo route is exactly two;
   * nothing is deeper, so a third segment is a 404 regardless of what any
   * interpolation in it holds.
   */
  it('never links deeper than the combo route', () => {
    const offenders = scanned.flatMap(({ file, links }) =>
      links
        .filter((l) => l.depth > 2)
        .map(
          (l) =>
            `${file} links ${l.raw}, which has ${l.depth} path segments under /services/ — the deepest route is /services/[service]/[city] at two, so that URL cannot resolve`
        )
    );
    expect(offenders, offenders.join('; ')).toEqual([]);
  });

  /**
   * A link whose service segment is not a real service can never resolve, so
   * it is the most certain 404 of the three — and it was the one the first
   * version of this file silently skipped.
   */
  it('never links to an unknown service', () => {
    const offenders = scanned.flatMap(({ file, links }) =>
      links
        .filter((l) => l.depth === 2 && !SERVICE_SLUGS.has(l.service))
        .map(
          (l) =>
            `${file} links ${l.raw}, but "${l.service}" is not a service slug — that URL cannot resolve`
        )
    );
    expect(offenders, offenders.join('; ')).toEqual([]);
  });
});

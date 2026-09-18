import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { CONTENT, RETIRED_COMBOS } from '@/lib/service-city-content';
import { SERVICES } from '@/lib/constants';

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
 */

/** Files ALLOWED to name a retired path, because they declare or assert it. */
const DECLARATION_FILES = new Set([
  'src/lib/retired-combos.ts',
  'next.config.ts',
  'src/lib/service-city-content.test.ts',
  'src/lib/internal-links.test.ts',
]);

const SERVICE_SLUGS = new Set<string>(SERVICES.map((s) => s.slug));
const PUBLISHED = new Set(Object.keys(CONTENT));
const RETIRED = new Set(Object.keys(RETIRED_COMBOS));
const BASE = 'https://www.realelitecontracting.com';

type ComboLink = { key: string; service: string; area: string; raw: string };

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
    // Two earlier versions were both wrong, in opposite directions:
    //
    //   1. Skip the URL if `${` appears anywhere. Dropped
    //      `/services/kitchens/middleburg-va?campaign=${c}` — a hand-written
    //      retired link with a derived query. False negative.
    //   2. Skip if `${` appears before the first literal `?` or `#`. Dropped
    //      `/services/kitchens/middleburg-va${suffix}`, where the suffix
    //      supplies its own `?`. Same false negative, one layer down.
    //
    // A purely lexical rule cannot separate "suffix appended after a complete
    // slug" from "slug partially derived" — `/services/kitchens/middleburg${x}`
    // looks identical to the first but the area slug is really derived. So
    // when an interpolation is present, the literal prefix is RESOLVED: it
    // counts only if it already forms a combo key this repo knows. That is
    // sound in both directions, and it declines to guess where it cannot know.
    const interp = raw.indexOf('${');
    const literalPath = (interp === -1 ? raw : raw.slice(0, interp)).split(/[?#]/)[0];

    let pathname: string;
    try {
      // Parsed from the literal path, so nothing derived affects parsing.
      pathname = new URL(literalPath, BASE).pathname;
    } catch {
      continue;
    }
    const trimmed = pathname.replace(/\/+$/, '');
    const m = /^\/services\/([^/]+)\/([^/]+)$/.exec(trimmed);
    if (!m) continue;

    const key = `${m[1]}-${m[2]}`;
    // With an interpolation present the prefix must resolve to a real combo,
    // otherwise the segment itself was derived and this is a template link
    // that CityPageTemplate.links.test.tsx already covers.
    if (interp !== -1 && !RETIRED.has(key) && !PUBLISHED.has(key)) continue;

    out.push({ key, service: m[1], area: m[2], raw });
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
    // `middleburg` is not a combo this repo publishes or retires.
    [
      'partially derived area slug is skipped',
      'href={`/services/kitchens/middleburg${rest}`}',
      null,
    ],
  ];

  it.each(cases)('%s', (_name, source, expected) => {
    const keys = extractComboLinks(source).map((l) => l.key);
    if (expected === null) expect(keys).toEqual([]);
    else expect(keys).toEqual([expected]);
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
        .filter((l) => RETIRED.has(l.key))
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
        .filter((l) => SERVICE_SLUGS.has(l.service) && !PUBLISHED.has(l.key) && !RETIRED.has(l.key))
        .map(
          (l) =>
            `${file} links ${l.raw}, which is neither published in CONTENT nor retired with a redirect — dynamicParams is false, so that is a hard 404`
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
        .filter((l) => !SERVICE_SLUGS.has(l.service))
        .map(
          (l) =>
            `${file} links ${l.raw}, but "${l.service}" is not a service slug — that URL cannot resolve`
        )
    );
    expect(offenders, offenders.join('; ')).toEqual([]);
  });
});

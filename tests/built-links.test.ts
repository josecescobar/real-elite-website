import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Every internal link the SITE ACTUALLY RENDERS must resolve, and must not be
 * pointed at a redirect.
 *
 * ## Why this replaces a source-level scan
 *
 * `src/lib/internal-links.test.ts` (deleted with this file's arrival) answered
 * "does this link resolve?" by pattern-matching link syntax in `.md`, `.ts` and
 * `.tsx` sources. Six review rounds landed on that logic, each one a case the
 * lexical rules could not express:
 *
 *   - `?query`, `#fragment` and trailing slashes broke the match
 *   - an unknown service slug was silently dropped — the certain 404 passed
 *   - `${...}` anywhere in a URL discarded the whole link
 *   - then only a literal `?`/`#` before it was handled
 *   - then a gate on known combos dropped never-published ones
 *   - then path depth was never checked at all
 *   - and a JS ternary's `?` inside an interpolation read as a query delimiter
 *
 * A link's destination is a fact about the RENDERED PAGE, and the build already
 * emits every page. Reading the output removes the lexical rules entirely: no
 * capture patterns, no interpolation gate, no depth arithmetic. It also sees
 * what no source scan can — derived hrefs, values assembled through variables,
 * and whichever branch of a conditional actually renders.
 *
 * It found a live defect on its first run that the source scan never could:
 * `/services/paving` on all 26 service-area pages and the `/services` index,
 * 308-ing to `/paving`. The href is built from a service slug, so the string
 * appears nowhere in `src`. See `servicePillarHref` in constants.ts.
 *
 * ## Why this is not in `npm test`
 *
 * It needs `.next/`, so it runs as `npm run test:built` after the build. The
 * default vitest config only includes `src/**`, so it cannot run accidentally
 * against a stale or missing build — and the first assertion below fails loudly
 * rather than passing vacuously if the output is not there.
 *
 * ## What it does NOT cover
 *
 * Only prerendered pages, which here is all of them. A runtime-rendered route
 * would need a request to inspect. `next build` is the boundary.
 */

const APP = '.next/server/app';
const ROUTES_MANIFEST = '.next/routes-manifest.json';
const PRERENDER_MANIFEST = '.next/prerender-manifest.json';

/** Trailing slashes are not meaningful here; `/a/` and `/a` are one route. */
const norm = (p: string): string => p.replace(/\/+$/, '') || '/';

function builtPages(): string[] {
  const out: string[] = [];
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.html')) out.push(full);
    }
  };
  walk(APP);
  return out;
}

const pageRoute = (file: string): string =>
  norm(file.slice(APP.length).replace(/\.html$/, ''));

/**
 * Every internal href a page renders. Only build output is excluded here.
 *
 * Deciding what is an "asset" is deliberately NOT done in this function. It
 * used to drop any path with a file extension, which silently swallowed the
 * six legacy `.html` redirect sources this site still configures —
 * `/about.html`, `/services.html`, `/reviews.html` and friends. Those are
 * redirects, not assets, so a reintroduced link to one would have been dropped
 * before either assertion ran. Codex found it on #148. The caller now consults
 * the redirect set first, where that set is in scope.
 */
function internalHrefs(html: string): string[] {
  const out: string[] = [];
  for (const m of html.matchAll(/href="(\/[^"]*)"/g)) {
    const raw = m[1];
    if (raw.startsWith('/_next') || raw.startsWith('//')) continue;
    out.push(raw);
  }
  return out;
}

/** A path that is a file rather than a route — but never a configured redirect. */
const isAssetPath = (p: string, redirects: ReadonlySet<string>): boolean =>
  !redirects.has(p) && /\.[a-z0-9]{2,5}$/i.test(p);

describe('rendered internal links', () => {
  const hasBuild = fs.existsSync(APP) && fs.existsSync(ROUTES_MANIFEST);

  it('has build output to read', () => {
    expect(
      hasBuild,
      `${APP} or ${ROUTES_MANIFEST} is missing — run \`npm run build\` first. This suite asserts nothing without it, so it fails rather than passing empty.`
    ).toBe(true);
  });

  if (!hasBuild) return;

  const routesManifest = JSON.parse(fs.readFileSync(ROUTES_MANIFEST, 'utf8'));
  const prerender = JSON.parse(fs.readFileSync(PRERENDER_MANIFEST, 'utf8'));

  // Every URL the app can serve: prerendered pages, static routes, and the
  // regexes Next generates for dynamic ones.
  const routes = new Set<string>(
    [
      ...Object.keys(prerender.routes ?? {}),
      ...(routesManifest.staticRoutes ?? []).map((r: { page: string }) => r.page),
    ].map(norm)
  );
  // A dynamic route's regex proves only that a pathname has the right SHAPE,
  // not that its parameters resolve. `/blog/nonexistent-post` matches
  // `/blog/[slug]`, and that page calls notFound(); `/services/roofing/mclean-va`
  // matches the combo route, which sets dynamicParams = false. Accepting either
  // by shape let a hard 404 pass — Codex found it on #148.
  //
  // Every PAGE route here is prerendered with `fallback: null` or `false`, so an
  // unlisted parameter 404s and its valid URLs are already enumerated in the
  // prerender manifest above. Only routes with NO prerender entry are served at
  // runtime (the three /api/* handlers and a metadata image route), and those
  // are the only ones whose shape can stand in for their parameters.
  const prerenderedDynamic = new Set(Object.keys(prerender.dynamicRoutes ?? {}));
  const runtimeDynamic = (routesManifest.dynamicRoutes ?? []).filter(
    (r: { page: string }) => !prerenderedDynamic.has(r.page)
  );
  const dynamic: RegExp[] = runtimeDynamic.map(
    (r: { regex: string }) => new RegExp(r.regex)
  );
  const redirects = new Map<string, string>(
    (routesManifest.redirects ?? []).map((r: { source: string; destination: string }) => [
      norm(r.source),
      r.destination,
    ])
  );

  const pages = builtPages();
  const redirectSources: ReadonlySet<string> = new Set(redirects.keys());
  const links = pages
    .flatMap((file) =>
      internalHrefs(fs.readFileSync(file, 'utf8')).map((raw) => ({
        page: pageRoute(file),
        raw,
        target: norm(raw.split(/[?#]/)[0]),
      }))
    )
    // The site root is always fine; assets are files, and a configured
    // redirect is never treated as one.
    .filter((l) => l.target !== '/' && !isAssetPath(l.target, redirectSources));

  /**
   * Proves the scan before anything is concluded from it. A walker that found
   * no pages, or a page set with no links, would make every assertion below
   * pass silently — which is how two unfalsifiable tests shipped earlier in
   * this feature.
   */
  it('reads a plausible amount of the site', () => {
    expect(pages.length, 'built pages').toBeGreaterThan(100);
    expect(links.length, 'internal page links').toBeGreaterThan(1000);
    expect(routes.size, 'known routes').toBeGreaterThan(100);
    expect(redirects.size, 'configured redirects').toBeGreaterThan(10);
    // The Tier C retirement must be present, or the redirect assertions below
    // are checking a build that predates it.
    expect(redirects.has('/services/basements/middleburg-va')).toBe(true);
  });

  /**
   * The strict dynamic rule, asserted directly.
   *
   * If `dynamic` ever went back to accepting every dynamic route's shape, the
   * resolvability check below would pass for any URL of the right form and this
   * suite would go quiet without failing. So the rule is pinned rather than
   * trusted: a real prerendered page resolves, and an unlisted parameter of the
   * same shape does not.
   */
  it('rejects an unresolvable parameter on a prerendered dynamic route', () => {
    const resolves = (p: string) =>
      routes.has(p) || redirects.has(p) || dynamic.some((re) => re.test(p));

    // Real pages, enumerated in the prerender manifest.
    expect(resolves('/services/basements/northern-virginia')).toBe(true);
    expect(resolves('/service-areas/martinsburg-wv')).toBe(true);

    // Same shapes, parameters that were never generated. Each 404s.
    expect(resolves('/blog/nonexistent-post')).toBe(false);
    expect(resolves('/services/roofing/mclean-va')).toBe(false);
    expect(resolves('/projects/not-a-project')).toBe(false);
    expect(resolves('/service-areas/nowhere-zz')).toBe(false);

    // And no page route may be accepted by shape alone.
    expect(
      runtimeDynamic.every((r: { page: string }) => r.page.startsWith('/api/') || r.page.includes('opengraph-image')),
      `a page route is being accepted by shape: ${runtimeDynamic.map((r: { page: string }) => r.page).join(', ')}`
    ).toBe(true);
  });

  /**
   * The six legacy `.html` paths are redirects, and must not be mistaken for
   * static assets. Pinned because the old extension filter dropped them before
   * either assertion, so reintroducing such a link would have gone unnoticed.
   */
  it('treats a configured redirect as a link, not an asset', () => {
    // These are real redirect sources in next.config.ts.
    expect(redirects.has('/about.html')).toBe(true);
    expect(redirects.has('/reviews.html')).toBe(true);
    expect(isAssetPath('/about.html', redirectSources)).toBe(false);
    expect(isAssetPath('/reviews.html', redirectSources)).toBe(false);
    // A genuine asset still is one.
    expect(isAssetPath('/images/hero.jpg', redirectSources)).toBe(true);
    expect(isAssetPath('/sitemap.xml', redirectSources)).toBe(true);
  });

  it('resolves every internal link it renders', () => {
    const seen = new Map<string, string>();
    for (const l of links) {
      if (routes.has(l.target) || redirects.has(l.target)) continue;
      if (dynamic.some((re) => re.test(l.target))) continue;
      if (!seen.has(l.raw)) seen.set(l.raw, l.page);
    }
    const offenders = [...seen].map(
      ([raw, page]) => `${page} renders ${raw}, which matches no route, no dynamic route and no redirect — that is a 404 the site links to itself`
    );
    expect(offenders, offenders.join('; ')).toEqual([]);
  });

  /**
   * A link that resolves only via a redirect is not a 404, but it spends a
   * 308 on every click and crawl and leaks link equity to a URL we have
   * already retired. Retiring a page and leaving the links pointing at it is
   * the specific mistake the Tier C change made.
   */
  it('never points a rendered link at a redirect', () => {
    const seen = new Map<string, { page: string; to: string }>();
    for (const l of links) {
      const to = redirects.get(l.target);
      if (to && !seen.has(l.raw)) seen.set(l.raw, { page: l.page, to });
    }
    const offenders = [...seen].map(
      ([raw, { page, to }]) => `${page} renders ${raw}, which redirects to ${to} — link there directly rather than spending a 308`
    );
    expect(offenders, offenders.join('; ')).toEqual([]);
  });
});

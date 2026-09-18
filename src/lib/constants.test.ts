import { describe, it, expect } from 'vitest';
import {
  SERVICES,
  servicePillarHref,
  SERVICE_AREA_CATALOG,
  PRIMARY_SERVICE_AREAS,
  SECONDARY_SERVICE_AREAS,
  EXPANSION_SERVICE_AREAS,
  ALL_SERVICE_AREAS,
  CONSOLIDATED_SERVICE_AREAS,
  LUXURY_CITY_SLUGS,
  getServiceArea,
  activeAreas,
  isLocalityArea,
  formatAreaPlace,
  areaSchemaType,
  childAreasOf,
  areaAncestors,
  areaRegionLabel,
  CITY_DATA,
  GALLERY_IMAGES,
  selectGalleryFor,
  BUSINESS,
  VERIFIED_PROFILE_URLS,
} from '@/lib/constants';

const SERVICE_SLUGS = new Set<string>(SERVICES.map((s) => s.slug));

describe('SERVICES catalog', () => {
  it('has unique, kebab-case slugs', () => {
    const slugs = SERVICES.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9-]+$/);
  });

  it('gives every service a non-empty title and description', () => {
    for (const s of SERVICES) {
      expect(s.title.trim().length).toBeGreaterThan(0);
      expect(s.description.trim().length).toBeGreaterThan(0);
    }
  });
});

describe('service areas', () => {
  it('has globally unique slugs across primary and secondary tiers', () => {
    const slugs = [...PRIMARY_SERVICE_AREAS, ...SECONDARY_SERVICE_AREAS].map((a) => a.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  /**
   * `/services/paving` 308s to `/paving`, and interpolating `/services/${slug}`
   * put that redirect on all 26 area pages and the /services index. The link
   * is derived, so it appears nowhere in source — only the built-HTML
   * assertion could see it. This pins the helper that fixes it; the rendered
   * check in tests/built-links.test.ts is what guards the call sites.
   */
  it('maps a service slug to its canonical pillar, honouring overrides', () => {
    expect(servicePillarHref('kitchens')).toBe('/services/kitchens');
    expect(servicePillarHref('paving')).toBe('/paving');
    // Every service must produce a href, and none may point back at a slug
    // whose pillar was moved.
    for (const s of SERVICES) {
      expect(servicePillarHref(s.slug).startsWith('/')).toBe(true);
    }
    expect(SERVICES.some((s) => s.slug === 'paving')).toBe(true);
  });

  it('exposes a deduplicated ALL_SERVICE_AREAS list', () => {
    const slugs = ALL_SERVICE_AREAS.map((a) => a.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  /**
   * EVERY active row, not just the primary and secondary legacy tiers.
   *
   * /service-areas/[slug] calls notFound() when CITY_DATA has no entry, while
   * the footer, the service-areas index and childAreasOf all render links from
   * ALL_SERVICE_AREAS — so a row without an entry is the site advertising a
   * link to its own 404. That is the bug class #145 fixed for consolidated
   * rows, and the tier-scoped version of this test could not see it: the
   * `northern-virginia` region row carries `legacyTiers: []`, so its own
   * CITY_DATA entry was covered by nothing.
   */
  it('has a CITY_DATA entry for every active service area', () => {
    const missing = ALL_SERVICE_AREAS.filter((area) => !CITY_DATA[area.slug]).map((a) => a.slug);
    expect(
      missing,
      `these areas render as links but /service-areas/[slug] would notFound(): ${missing.join(', ')}`
    ).toEqual([]);
  });
});

/**
 * The catalog replaced four overlapping hand-written arrays. These pin the
 * derived views to exactly what those arrays produced — membership AND order,
 * because order drives generateStaticParams and the rendered order of several
 * area grids. A row whose `legacyTiers` or position changes fails here rather
 * than silently reordering a page or dropping a route.
 *
 * The literals below are the pre-refactor lists, transcribed from the arrays
 * as they stood at commit 32e6856. Do not regenerate them from the catalog —
 * that would make the test tautological.
 */
describe('SERVICE_AREA_CATALOG derived views', () => {
  const PRIMARY_AT_32E6856 = [
    'martinsburg-wv', 'inwood-wv', 'charles-town-wv', 'ranson-wv', 'hedgesville-wv',
    'frederick-md', 'hagerstown-md', 'winchester-va', 'leesburg-va', 'ashburn-va',
    'mclean-va', 'alexandria-va', 'vienna-va', 'great-falls-va', 'reston-va',
    'burke-va', 'fairfax-station-va', 'clifton-va', 'middleburg-va',
  ];
  const SECONDARY_AT_32E6856 = [
    'spring-mills-wv', 'falling-waters-wv', 'berkeley-springs-wv', 'shepherdstown-wv',
    'loudoun-county-va', 'brambleton-va',
  ];
  const LUXURY_AT_32E6856 = [
    'mclean-va', 'alexandria-va', 'vienna-va', 'great-falls-va', 'reston-va',
    'burke-va', 'fairfax-station-va', 'clifton-va', 'middleburg-va', 'leesburg-va',
    'ashburn-va', 'loudoun-county-va', 'brambleton-va',
  ];

  it('reproduces the primary and secondary tiers in their original order', () => {
    expect(PRIMARY_SERVICE_AREAS.map((a) => a.slug)).toEqual(PRIMARY_AT_32E6856);
    expect(SECONDARY_SERVICE_AREAS.map((a) => a.slug)).toEqual(SECONDARY_AT_32E6856);
  });

  it('reproduces ALL_SERVICE_AREAS as primary, secondary, then rows added since', () => {
    // 'northern-virginia' is the one row added after 32e6856 (PR for Phase 2
    // of the altitude plan). It carries no legacy tier, which is why the two
    // pins above still hold unchanged. Listed by name rather than regenerated:
    // anything else appearing here should fail until someone says why.
    expect(ALL_SERVICE_AREAS.map((a) => a.slug)).toEqual([
      ...PRIMARY_AT_32E6856,
      ...SECONDARY_AT_32E6856,
      'northern-virginia',
    ]);
  });

  it('keeps the expansion alias a subset of the catalog, VA/MD only', () => {
    const slugs = new Set(SERVICE_AREA_CATALOG.map((a) => a.slug));
    expect(EXPANSION_SERVICE_AREAS.length).toBe(15);
    for (const area of EXPANSION_SERVICE_AREAS) {
      expect(slugs.has(area.slug)).toBe(true);
      expect(area.state, `${area.slug} is not VA/MD`).not.toBe('WV');
    }
  });

  it('derives LUXURY_CITY_SLUGS from market: premium', () => {
    // Same historical set plus the region row, which is a premium market and
    // so routes to /design-consultation like the towns inside it.
    expect([...LUXURY_CITY_SLUGS].sort()).toEqual(
      [...LUXURY_AT_32E6856, 'northern-virginia'].sort()
    );
  });

  it('gives every row a unique slug', () => {
    const slugs = SERVICE_AREA_CATALOG.map((a) => a.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe('SERVICE_AREA_CATALOG integrity', () => {
  it('resolves every parent to a real row that is broader than its child', () => {
    for (const area of SERVICE_AREA_CATALOG) {
      if (!area.parent) continue;
      expect(area.parent, `${area.slug} is its own parent`).not.toBe(area.slug);
      const parent = getServiceArea(area.parent);
      expect(parent, `${area.slug} → unknown parent "${area.parent}"`).not.toBeNull();
      // A locality cannot contain another area. Only counties and regions may parent.
      expect(
        isLocalityArea(parent!),
        `${area.slug} → parent "${area.parent}" is a ${parent!.kind}, not a county or region`
      ).toBe(false);
      expect(parent!.state, `${area.slug} → parent is in another state`).toBe(area.state);
    }
  });

  /**
   * Two hops, not one.
   *
   * This capped chains at one hop when the catalog landed, because breadcrumbs
   * assumed Home › Service Areas › parent › area. Adding the Northern Virginia
   * region made that cap a falsehood: Leesburg is in Loudoun County, and
   * Loudoun County is in Northern Virginia. Keeping the cap would have meant
   * either a two-level model or a claim that Loudoun is not in the region —
   * the same kind of error as telling Vienna it sits in the Shenandoah. So the
   * breadcrumb renders the full chain from `areaAncestors` and the cap moved.
   */
  it('keeps parent chains within two hops and free of cycles', () => {
    for (const area of SERVICE_AREA_CATALOG) {
      if (!area.parent) continue;
      const chain = areaAncestors(area);
      expect(
        chain.length,
        `${area.slug} → ${chain.map((a) => a.slug).join(' → ')} is deeper than town › county › region`
      ).toBeLessThanOrEqual(2);
      // areaAncestors stops on a repeat, so a cycle shows up as a chain that
      // does not terminate at a parentless row.
      expect(
        chain[chain.length - 1].parent,
        `${area.slug} sits in a parent cycle: ${chain.map((a) => a.slug).join(' → ')}`
      ).toBeUndefined();
    }
  });

  /**
   * Named "resolves" and meaning it.
   *
   * The first version of this only checked that `redirectTo` began with a
   * slash, which let two whole classes through: a row pointing at its own URL
   * (an infinite redirect that satisfies every other assertion, because the
   * configured and declared destinations agree), and a row pointing at an area
   * that is itself retired or does not exist (a chain, a loop, or a 404).
   */
  it('gives every consolidated row a redirect target that actually resolves', () => {
    for (const area of CONSOLIDATED_SERVICE_AREAS) {
      const source = `/service-areas/${area.slug}`;

      expect(area.redirectTo, `${area.slug} is consolidated with no redirectTo`).toBeTruthy();
      expect(area.redirectTo, `${area.slug} redirects off-site`).toMatch(/^\//);

      // Parse once, then check the ORIGIN before trusting the pathname.
      //
      // A leading slash is not enough: '//other.example/service-areas/foo' is a
      // network-path reference that passes the regex above, and resolving it
      // yields the pathname '/service-areas/foo' — so every later check passed
      // while a browser would leave the site. The assertion above literally
      // says "redirects off-site"; this is what makes that true.
      const LOCAL_BASE = 'https://example.invalid';
      const parsed = new URL(area.redirectTo!, LOCAL_BASE);
      expect(
        parsed.origin,
        `${area.slug} redirects to ${area.redirectTo}, which leaves the site (host "${parsed.host}"). A protocol-relative or absolute URL satisfies a leading-slash check but sends visitors to another origin`
      ).toBe(LOCAL_BASE);

      // Compare PATHNAMES, not raw strings. Next matches redirect sources by
      // pathname, so '/service-areas/foo?from=legacy' targets the same route as
      // '/service-areas/foo' and loops — while a raw-string comparison sees two
      // different values and an anchored path regex skips the catalog lookup
      // entirely. Parsing once fixes both, and covers trailing slashes and
      // fragments for free.
      const destination = parsed.pathname;

      expect(
        destination,
        `${area.slug} redirects to its own URL (${area.redirectTo}), which is an infinite redirect`
      ).not.toBe(source);

      // A retired area's replacement must be another area page — and this is
      // required, not conditional. Skipping the checks for any other local
      // path meant a destination like '/does-not-exist' passed while the
      // retired URL 404'd, because nothing validates an arbitrary path.
      const target = /^\/service-areas\/([a-z0-9-]+)\/?$/.exec(destination);
      expect(
        target,
        `${area.slug} redirects to ${destination}, which is not an area page. A retired area's replacement has to be another area page so this test can prove the destination exists; an arbitrary local path cannot be verified here and a typo or a removed route turns the retired URL into a 404. If a non-area destination is genuinely needed, add a check that resolves it rather than widening this pattern`
      ).not.toBeNull();

      // Named `destinationArea`, not `destination`: an earlier version of this
      // edit shadowed the destination PATH with the resolved row, so the
      // failure message below interpolated an object instead of the URL.
      const destinationArea = getServiceArea(target![1]);
      expect(
        destinationArea,
        `${area.slug} redirects to ${destination}, which is not an area in the catalog`
      ).not.toBeNull();
      expect(
        destinationArea!.status,
        `${area.slug} redirects to ${target![1]}, which is itself consolidated — that chains or loops instead of landing`
      ).toBe('active');
    }
  });

  /**
   * The real invariant, not a proxy for it.
   *
   * Two earlier versions of this test each checked a weaker thing than the
   * comment beside it claimed, so both are spelled out here:
   *
   * 1. Checking that `redirectTo` starts with a slash says nothing about
   *    whether next.config.ts redirects anything. A consolidated row drops out
   *    of ALL_SERVICE_AREAS, so with no redirect configured its old URL is a
   *    404 and the string check passes regardless.
   * 2. Checking only that a redirect *source* exists leaves `redirectTo`
   *    decorative: a stale or unrelated redirect from the same source would
   *    pass while sending visitors somewhere the catalog never declared.
   * 3. Indexing the rules into a Map by source reads the LAST rule for a
   *    source. Next evaluates `redirects()` as an ordered list and the FIRST
   *    match wins, so a stale rule earlier in the array with the correct one
   *    appended after it would send visitors to the stale destination while
   *    this test read the correct one and passed.
   *
   * 4. Filtering on literal source equality still misses a dynamic rule. Next
   *    treats `/service-areas/:slug` or a catch-all as a match, so one sitting
   *    earlier in the list would preempt the exact consolidation rule while a
   *    literal filter never saw it.
   *
   * The root cause running through all four is that this is config data being
   * used to predict a routing outcome. Verifying the outcome properly means
   * exercising Next's router, which is an integration test and out of
   * proportion here.
   *
   * 5. A hand-written type for the rules hid the fields that decide whether a
   *    redirect fires at all. Next supports `has` and `missing` predicates on
   *    a redirect; one carrying either is conditional, and a normal request
   *    that fails the predicate falls through to the retired route and 404s.
   *    The narrow cast meant those fields were invisible here, so the
   *    "sufficient condition" below did not actually establish an
   *    unconditional redirect.
   *
   *    Root-cause fix: the rules are typed from the config's own signature
   *    rather than by hand, so no supported field can be silently omitted
   *    again.
   *
   * The root cause running through all five is that this is config data being
   * used to predict a routing outcome. Verifying the outcome properly means
   * exercising Next's router, which is an integration test and out of
   * proportion here.
   *
   * So the assertion below proves a SUFFICIENT CONDITION instead, and says so
   * rather than implying more:
   *
   *   (a) no redirect in the list has a dynamic source that could match
   *       anything under `/service-areas/`,
   *   (b) exactly one rule's source is the retired area's literal path, with
   *       the declared destination and `permanent: true`, and
   *   (c) that rule is unconditional — no `has`, no `missing`.
   *
   * Given (a) literal matching IS Next's behaviour for these paths, and given
   * (c) the matched rule always fires, so (b) decides the outcome. No
   * path-to-regexp reimplementation, and every assumption is named.
   */
  it('redirects every consolidated area URL to its declared destination', async () => {
    const { default: nextConfig } = await import('../../next.config');
    // Typed from the config's own signature, not by hand. A hand-written shape
    // omitted `has`/`missing` and so hid the conditional-redirect hole that
    // finding 5 found.
    const redirects = await nextConfig.redirects!();

    // (a) Nothing dynamic may overlap /service-areas/. Only checked when a row
    // is actually consolidated, so this does not constrain unrelated config.
    if (CONSOLIDATED_SERVICE_AREAS.length > 0) {
      const DYNAMIC = /[:*(]/;
      for (const rule of redirects.filter((r) => DYNAMIC.test(r.source))) {
        const staticPrefix = rule.source.split(DYNAMIC)[0];
        const couldOverlap =
          '/service-areas/'.startsWith(staticPrefix) ||
          staticPrefix.startsWith('/service-areas/');
        expect(
          couldOverlap,
          `redirect "${rule.source}" is dynamic and could match paths under /service-areas/, so it may preempt a consolidation redirect. This test cannot predict which rule Next picks once that is true — make the overlapping rule specific, or order it after the consolidation rules and narrow this check`
        ).toBe(false);
      }
    }

    // (b) Exactly one literal rule per retired area, pointing where declared.
    for (const area of CONSOLIDATED_SERVICE_AREAS) {
      const source = `/service-areas/${area.slug}`;
      const matching = redirects.filter((r) => r.source === source);

      expect(
        matching.length,
        `${area.slug} is consolidated but next.config.ts has no redirect from ${source}, so that URL is a 404`
      ).toBeGreaterThan(0);

      expect(
        matching.length,
        `${source} has ${matching.length} redirect rules. Next uses the first match, so a stale duplicate would silently win over the correct one — remove the extras`
      ).toBe(1);

      // Index 0 rather than the Map lookup this replaced: with exactly one rule
      // the two agree, and reading the first keeps it correct by Next's own
      // precedence if the count assertion above is ever loosened.
      const configured = matching[0];

      expect(
        configured.destination,
        `${source} redirects to "${configured.destination}" but the catalog declares redirectTo: "${area.redirectTo}" — one of the two is wrong`
      ).toBe(area.redirectTo);

      // Permanent, not temporary: a retired area's ranking signals should pass
      // to the page that replaced it. Note Next emits 308 for
      // `permanent: true`, not the 301 the altitude plan's prose says; Google
      // treats both as permanent for canonicalisation, so the plan's intent
      // holds. Corrected here because the comment asserted a status code the
      // config does not actually produce.
      expect(
        configured.permanent,
        `${source} is a temporary redirect; a retired area should redirect permanently so the destination inherits its ranking signals`
      ).toBe(true);

      // (c) Unconditional. A `has`/`missing` predicate means the redirect only
      // fires for some requests; every other request falls through to a route
      // that no longer exists and 404s.
      expect(
        configured.has,
        `${source} redirects only when its \`has\` conditions match; every other request 404s on the retired route`
      ).toBeUndefined();
      expect(
        configured.missing,
        `${source} redirects only when its \`missing\` conditions match; every other request 404s on the retired route`
      ).toBeUndefined();
    }
  });

  it('never lists a consolidated row as active', () => {
    const active = new Set(ALL_SERVICE_AREAS.map((a) => a.slug));
    for (const area of CONSOLIDATED_SERVICE_AREAS) {
      expect(active.has(area.slug), `${area.slug} is both active and consolidated`).toBe(false);
    }
  });

  /**
   * The legacy tier views are rendered as links by the service-areas index,
   * the homepage area map, the footer and LocalAreasServed, while
   * ALL_SERVICE_AREAS decides what gets generated. If a consolidated row
   * survives in the tier views, the site links to its own 404.
   */
  it('keeps consolidated rows out of the legacy tier views', () => {
    for (const [name, view] of [
      ['PRIMARY_SERVICE_AREAS', PRIMARY_SERVICE_AREAS],
      ['SECONDARY_SERVICE_AREAS', SECONDARY_SERVICE_AREAS],
      ['EXPANSION_SERVICE_AREAS', EXPANSION_SERVICE_AREAS],
    ] as const) {
      for (const area of view) {
        expect(area.status, `${name} still lists consolidated area ${area.slug}`).toBe('active');
      }
    }
  });
});

/**
 * Tested against synthetic rows on purpose. Nothing in the real catalog is
 * consolidated yet, so an assertion over SERVICE_AREA_CATALOG would pass
 * whether or not the filtering works — which is exactly how this shipped
 * missing from the legacy tier views in the first place.
 */
describe('activeAreas', () => {
  const rows = [
    { slug: 'kept', status: 'active' as const },
    { slug: 'retired', status: 'consolidated' as const },
    { slug: 'also-kept', status: 'active' as const },
  ];

  it('drops consolidated rows and preserves the order of the rest', () => {
    expect(activeAreas(rows).map((r) => r.slug)).toEqual(['kept', 'also-kept']);
  });

  it('returns an empty list when every row is consolidated', () => {
    expect(activeAreas([{ slug: 'gone', status: 'consolidated' as const }])).toEqual([]);
  });

  it('leaves an all-active list untouched', () => {
    const allActive = [rows[0], rows[2]];
    expect(activeAreas(allActive)).toEqual(allActive);
  });
});

describe('areaRegionLabel', () => {
  it('names the Eastern Panhandle for the WV home market', () => {
    expect(areaRegionLabel(getServiceArea('martinsburg-wv')!)).toBe('Eastern Panhandle');
  });

  it('names Loudoun County for the county and everything inside it', () => {
    expect(areaRegionLabel(getServiceArea('loudoun-county-va')!)).toBe('Loudoun County area');
    expect(areaRegionLabel(getServiceArea('brambleton-va')!)).toBe('Loudoun County area');
    expect(areaRegionLabel(getServiceArea('leesburg-va')!)).toBe('Loudoun County area');
  });

  /**
   * The bug this function exists to fix: keying the regional phrase off
   * `state` alone told Fairfax-County homeowners they were in the "Northern
   * Shenandoah Valley and Loudoun County area".
   */
  it('names Northern Virginia for the Fairfax-County towns, not the Shenandoah', () => {
    for (const slug of ['vienna-va', 'mclean-va', 'reston-va', 'great-falls-va', 'clifton-va']) {
      expect(areaRegionLabel(getServiceArea(slug)!), slug).toBe('Northern Virginia');
    }
  });

  it('still names the Shenandoah for Winchester', () => {
    expect(areaRegionLabel(getServiceArea('winchester-va')!)).toBe('Northern Shenandoah Valley');
  });

  it('covers every row in the catalog', () => {
    for (const area of SERVICE_AREA_CATALOG) {
      expect(areaRegionLabel(area).trim().length, area.slug).toBeGreaterThan(0);
    }
  });

  it('does not give a region a surrounding region', () => {
    // "Northern Virginia and the surrounding Northern Virginia" is what the
    // callers must not render; they gate on isLocalityArea. This pins the
    // value they would otherwise interpolate.
    const nova = getServiceArea('northern-virginia')!;
    expect(areaRegionLabel(nova)).toBe('Northern Virginia');
  });
});

describe('the Northern Virginia region row', () => {
  const nova = () => getServiceArea('northern-virginia')!;

  it('exists as a premium region with no parent of its own', () => {
    expect(nova().kind).toBe('region');
    expect(nova().market).toBe('premium');
    expect(nova().state).toBe('VA');
    expect(nova().parent).toBeUndefined();
  });

  it('is not a locality, so it takes AdministrativeArea in schema', () => {
    expect(isLocalityArea(nova())).toBe(false);
    expect(areaSchemaType(nova())).toBe('AdministrativeArea');
    expect(areaSchemaType(getServiceArea('loudoun-county-va')!)).toBe('AdministrativeArea');
  });

  /**
   * Localities stay `Place`. An earlier version of this promoted every `town`
   * row to `City`, which is false for the half of them that are census-
   * designated places or planned communities — Reston, McLean, Great Falls,
   * Burke, Fairfax Station, Brambleton. That traded an accurate generic type
   * for a false specific one.
   */
  it('leaves localities on the generic Place type rather than claiming City', () => {
    for (const slug of ['vienna-va', 'reston-va', 'brambleton-va', 'martinsburg-wv']) {
      expect(areaSchemaType(getServiceArea(slug)!), slug).toBe('Place');
    }
  });

  it('omits the state from its display name and keeps it everywhere else', () => {
    expect(formatAreaPlace(nova())).toBe('Northern Virginia');
    expect(formatAreaPlace(getServiceArea('vienna-va')!)).toBe('Vienna, VA');
    expect(formatAreaPlace(getServiceArea('loudoun-county-va')!)).toBe('Loudoun County, VA');
  });

  it('holds the Fairfax-County towns, Alexandria and Loudoun County directly', () => {
    expect(childAreasOf('northern-virginia').map((a) => a.slug)).toEqual([
      'mclean-va',
      'alexandria-va',
      'vienna-va',
      'great-falls-va',
      'reston-va',
      'burke-va',
      'fairfax-station-va',
      'clifton-va',
      'loudoun-county-va',
    ]);
  });

  it('reaches the Loudoun towns through the county, two hops up', () => {
    for (const slug of ['leesburg-va', 'ashburn-va', 'brambleton-va', 'middleburg-va']) {
      expect(areaAncestors(getServiceArea(slug)!).map((a) => a.slug), slug).toEqual([
        'loudoun-county-va',
        'northern-virginia',
      ]);
    }
  });

  it('leaves the home market and the Shenandoah unparented', () => {
    for (const slug of ['martinsburg-wv', 'frederick-md', 'winchester-va', 'hagerstown-md']) {
      expect(areaAncestors(getServiceArea(slug)!), slug).toEqual([]);
    }
  });

  it('gives childAreasOf nothing for a leaf', () => {
    expect(childAreasOf('vienna-va')).toEqual([]);
  });
});

describe('CITY_DATA', () => {
  it('gives every city a description, neighborhoods, and market emphasis', () => {
    for (const [slug, city] of Object.entries(CITY_DATA)) {
      expect(city.description.trim().length, slug).toBeGreaterThan(0);
      expect(city.neighborhoods.length, slug).toBeGreaterThan(0);
      expect(city.marketEmphasis.length, slug).toBeGreaterThan(0);
    }
  });

  it('only references real service slugs in marketEmphasis', () => {
    for (const [slug, city] of Object.entries(CITY_DATA)) {
      for (const svc of city.marketEmphasis) {
        expect(SERVICE_SLUGS.has(svc), `${slug} → unknown service "${svc}"`).toBe(true);
      }
    }
  });
});

describe('GALLERY_IMAGES', () => {
  it('gives every image a src, alt text, and category', () => {
    for (const img of GALLERY_IMAGES) {
      expect(img.src).toMatch(/^\//);
      expect(img.alt.trim().length).toBeGreaterThan(0);
      expect(img.category.trim().length).toBeGreaterThan(0);
    }
  });
});

describe('selectGalleryFor', () => {
  it('returns images tagged with the requested state when available', () => {
    const result = selectGalleryFor('martinsburg-wv', 'WV');
    expect(result.length).toBeGreaterThan(0);
    for (const img of result) expect(img.state).toBe('WV');
  });

  it('falls back to the full gallery when no local matches exist', () => {
    const result = selectGalleryFor('frederick-md', 'MD');
    expect(result).toEqual(GALLERY_IMAGES.slice(0, 6));
  });

  it('never returns more images than the limit', () => {
    expect(selectGalleryFor('martinsburg-wv', 'WV', 3)).toHaveLength(3);
    expect(selectGalleryFor('martinsburg-wv', 'WV').length).toBeLessThanOrEqual(6);
  });
});

describe('BUSINESS', () => {
  it('has a name, a valid email, and a digit-only raw phone number', () => {
    expect(BUSINESS.name.length).toBeGreaterThan(0);
    expect(BUSINESS.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    expect(BUSINESS.phoneRaw).toMatch(/^\+?\d+$/);
  });
});

describe('VERIFIED_PROFILE_URLS', () => {
  // `sameAs` asserts that this business owns these profiles. An unverified
  // URL in it claims an external identity that may belong to someone else,
  // which is why the 404'd LinkedIn and Thumbtack URLs were removed rather
  // than left in place. Yelp 403s bots and has never been confirmed, so it
  // must stay out until a human checks it — at which point this test is the
  // thing to delete, deliberately, alongside adding the URL.
  it('excludes the unverified Yelp URL', () => {
    expect(VERIFIED_PROFILE_URLS).not.toContain(BUSINESS.social.yelp);
  });

  it('only contains URLs that exist in BUSINESS.social', () => {
    const known = new Set<string>(Object.values(BUSINESS.social));
    for (const url of VERIFIED_PROFILE_URLS) {
      expect(known).toContain(url);
    }
  });

  it('is non-empty and free of duplicates', () => {
    expect(VERIFIED_PROFILE_URLS.length).toBeGreaterThan(0);
    expect(new Set(VERIFIED_PROFILE_URLS).size).toBe(VERIFIED_PROFILE_URLS.length);
  });
});

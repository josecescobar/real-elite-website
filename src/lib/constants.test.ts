import { describe, it, expect } from 'vitest';
import {
  SERVICES,
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
  areaRegionLabel,
  CITY_DATA,
  GALLERY_IMAGES,
  selectGalleryFor,
  BUSINESS,
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

  it('exposes a deduplicated ALL_SERVICE_AREAS list', () => {
    const slugs = ALL_SERVICE_AREAS.map((a) => a.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('has a CITY_DATA entry for every primary and secondary service area', () => {
    for (const area of [...PRIMARY_SERVICE_AREAS, ...SECONDARY_SERVICE_AREAS]) {
      expect(CITY_DATA[area.slug], `missing CITY_DATA for ${area.slug}`).toBeDefined();
    }
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

  it('reproduces ALL_SERVICE_AREAS as primary followed by secondary', () => {
    expect(ALL_SERVICE_AREAS.map((a) => a.slug)).toEqual([
      ...PRIMARY_AT_32E6856,
      ...SECONDARY_AT_32E6856,
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

  it('derives LUXURY_CITY_SLUGS from market: premium, unchanged', () => {
    expect([...LUXURY_CITY_SLUGS].sort()).toEqual([...LUXURY_AT_32E6856].sort());
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

  it('has no parent chains longer than one hop', () => {
    // Breadcrumbs assume Home › Service Areas › [parent] › [area]. A
    // grandparent would silently drop out of the trail.
    for (const area of SERVICE_AREA_CATALOG) {
      if (!area.parent) continue;
      expect(getServiceArea(area.parent)!.parent, `${area.slug} has a grandparent`).toBeUndefined();
    }
  });

  it('gives every consolidated row a redirect target that resolves', () => {
    for (const area of CONSOLIDATED_SERVICE_AREAS) {
      expect(area.redirectTo, `${area.slug} is consolidated with no redirectTo`).toBeTruthy();
      expect(area.redirectTo, `${area.slug} redirects off-site`).toMatch(/^\//);
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
   * The root cause of all three was modelling `next.config.ts` as a lookup
   * table. It is an ordered rule list, so the assertion below reads it as one:
   * it collects every rule matching the source, requires exactly one — which
   * makes the precedence question moot rather than relying on this test to
   * reimplement Next's matching — and then checks its destination and
   * permanence.
   */
  it('redirects every consolidated area URL to its declared destination', async () => {
    const { default: nextConfig } = await import('../../next.config');
    const redirects = (await nextConfig.redirects!()) as {
      source: string;
      destination: string;
      permanent?: boolean;
    }[];

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

      // 301, not 302: a retired area's ranking signals should pass to the page
      // that replaced it. The altitude plan specifies 301 for consolidation.
      expect(
        configured.permanent,
        `${source} is a temporary redirect; a retired area should 301 so the destination inherits its ranking signals`
      ).toBe(true);
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

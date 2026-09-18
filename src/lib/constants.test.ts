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

  it('never lists a consolidated row as active', () => {
    const active = new Set(ALL_SERVICE_AREAS.map((a) => a.slug));
    for (const area of CONSOLIDATED_SERVICE_AREAS) {
      expect(active.has(area.slug), `${area.slug} is both active and consolidated`).toBe(false);
    }
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

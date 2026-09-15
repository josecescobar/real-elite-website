import { describe, it, expect } from 'vitest';
import {
  CONTENT,
  COMBO_CITY_SLUGS,
  FEATURED_SERVICE_SLUGS,
} from '@/lib/service-city-content';
import { SERVICES, ALL_SERVICE_AREAS, CITY_DATA, LUXURY_CITY_SLUGS } from '@/lib/constants';
import { TITLE_MAX } from '@/lib/seo';

const SERVICE_SLUGS = new Set<string>(SERVICES.map((s) => s.slug));
const AREA_SLUGS = new Set<string>(ALL_SERVICE_AREAS.map((a) => a.slug));

/** Split a CONTENT key on its first dash, the same way the route does. */
function splitKey(key: string) {
  const dashIdx = key.indexOf('-');
  return { service: key.slice(0, dashIdx), city: key.slice(dashIdx + 1) };
}

describe('service+city combo coverage', () => {
  /**
   * The route resolves a combo's city against ALL_SERVICE_AREAS and calls
   * notFound() when the lookup misses. A combo whose city is absent from that
   * list therefore ships as a hard 404 even though generateStaticParams built
   * it — which is exactly how the WV cities were unreachable before: the
   * lookup ran against EXPANSION_SERVICE_AREAS, which holds VA/MD only.
   */
  it('resolves every CONTENT key to a real service and a real service area', () => {
    for (const key of Object.keys(CONTENT)) {
      const { service, city } = splitKey(key);
      expect(SERVICE_SLUGS, `${key}: unknown service "${service}"`).toContain(service);
      expect(AREA_SLUGS, `${key}: city "${city}" is not in ALL_SERVICE_AREAS`).toContain(city);
    }
  });

  it('keeps every combo city slug resolvable and unique', () => {
    expect(new Set(COMBO_CITY_SLUGS).size).toBe(COMBO_CITY_SLUGS.length);
    for (const slug of COMBO_CITY_SLUGS) {
      expect(AREA_SLUGS, `combo city "${slug}" is not a known service area`).toContain(slug);
    }
  });

  it('only keys combos off featured services', () => {
    const featured = new Set<string>(FEATURED_SERVICE_SLUGS);
    for (const key of Object.keys(CONTENT)) {
      expect(featured).toContain(splitKey(key).service);
    }
  });
});

describe('home-turf WV roofing pages', () => {
  // The Eastern Panhandle towns are the closest, highest-intent markets and
  // the reason these combos exist. Losing them would be a silent regression.
  it.each(['martinsburg-wv', 'charles-town-wv'])(
    'publishes roofing for %s',
    (city) => {
      expect(Object.keys(CONTENT)).toContain(`roofing-${city}`);
    }
  );

  it.each(['martinsburg-wv', 'charles-town-wv'])(
    'answers the cost query on %s with a real price range',
    (city) => {
      const entry = CONTENT[`roofing-${city}` as keyof typeof CONTENT];
      const body = entry!.paragraphs.join(' ');
      expect(body).toMatch(/\$[\d,]+ to \$[\d,]+/);
    }
  );
});

describe('service-area / city-data contract', () => {
  /**
   * /service-areas/[slug] builds its params from ALL_SERVICE_AREAS but calls
   * notFound() when CITY_DATA has no matching entry, so an area added without
   * one ships as a generated 404. Adding Brambleton is exactly the change that
   * could trip this.
   */
  it('gives every service area a CITY_DATA entry', () => {
    const missing = ALL_SERVICE_AREAS.filter((a) => !CITY_DATA[a.slug]).map((a) => a.slug);
    expect(missing, 'these areas would build a 404 page').toEqual([]);
  });

  it('leaves no CITY_DATA entry without a service area', () => {
    const slugs = new Set<string>(ALL_SERVICE_AREAS.map((a) => a.slug));
    const orphans = Object.keys(CITY_DATA).filter((s) => !slugs.has(s));
    expect(orphans, 'unreachable CITY_DATA entries').toEqual([]);
  });

  it('keeps service-area slugs unique after dedupe', () => {
    const slugs = ALL_SERVICE_AREAS.map((a) => a.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe('Loudoun luxury outdoor living', () => {
  // Decks are the only luxury line holding top-10 positions in Loudoun, so the
  // deck combos there must route to the consultation funnel, not a free
  // estimate. That depends on the city being flagged luxury.
  it.each(['brambleton-va', 'ashburn-va', 'leesburg-va', 'loudoun-county-va'])(
    'treats %s as a luxury market',
    (city) => {
      expect(LUXURY_CITY_SLUGS.has(city)).toBe(true);
    }
  );

  it('publishes a dedicated Brambleton deck page', () => {
    expect(Object.keys(CONTENT)).toContain('decks-brambleton-va');
  });

  it('gives every Loudoun deck page its own snippet', () => {
    const titles = ['brambleton-va', 'ashburn-va', 'leesburg-va', 'loudoun-county-va'].map(
      (city) => CONTENT[`decks-${city}` as keyof typeof CONTENT]?.metaTitle
    );
    for (const t of titles) expect(t, 'missing metaTitle override').toBeTruthy();
    // Distinct titles are what keep the neighbouring pages from competing.
    expect(new Set(titles).size).toBe(titles.length);
  });
});

describe('combo content shape', () => {
  it('gives every combo non-empty paragraphs', () => {
    for (const [key, entry] of Object.entries(CONTENT)) {
      expect(entry!.paragraphs.length, `${key} has no paragraphs`).toBeGreaterThan(0);
      for (const p of entry!.paragraphs) {
        expect(p.trim().length, `${key} has an empty paragraph`).toBeGreaterThan(0);
      }
    }
  });

  it('keeps any metaTitle override within the search-snippet budget', () => {
    for (const [key, entry] of Object.entries(CONTENT)) {
      if (entry!.metaTitle) {
        expect(entry!.metaTitle.length, `${key} metaTitle is too long`).toBeLessThanOrEqual(
          TITLE_MAX
        );
      }
    }
  });

  it('keeps any metaDescription override non-empty', () => {
    for (const [key, entry] of Object.entries(CONTENT)) {
      if (entry!.metaDescription !== undefined) {
        expect(entry!.metaDescription.trim().length, `${key} metaDescription is empty`)
          .toBeGreaterThan(0);
      }
    }
  });
});

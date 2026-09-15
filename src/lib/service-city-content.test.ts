import { describe, it, expect } from 'vitest';
import {
  CONTENT,
  COMBO_CITY_SLUGS,
  FEATURED_SERVICE_SLUGS,
} from '@/lib/service-city-content';
import { SERVICES, ALL_SERVICE_AREAS } from '@/lib/constants';
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

describe('Eastern Panhandle home-turf coverage', () => {
  /**
   * These carry the site's best commercial positions — basement queries in
   * Ranson at 3.2 and Inwood at 5.7 — and were previously answered by generic
   * /service-areas/ pages. Every home-turf combo gets its own snippet; the
   * generic "Expert X services in Y" template is what lost the clicks.
   */
  const WV_COMBOS = [
    'roofing-martinsburg-wv',
    'roofing-charles-town-wv',
    'basements-ranson-wv',
    'basements-inwood-wv',
    'basements-charles-town-wv',
    'decks-martinsburg-wv',
  ];

  it.each(WV_COMBOS)('publishes %s', (key) => {
    expect(Object.keys(CONTENT)).toContain(key);
  });

  it.each(WV_COMBOS)('%s overrides both snippet fields', (key) => {
    const entry = CONTENT[key as keyof typeof CONTENT];
    expect(entry!.metaTitle, `${key} has no metaTitle`).toBeTruthy();
    expect(entry!.metaDescription, `${key} has no metaDescription`).toBeTruthy();
  });

  it.each(WV_COMBOS)('%s leads with a concrete published figure', (key) => {
    // Every home-turf snippet quotes a number the site already publishes
    // elsewhere: the roof range, the deck per-square-foot rates, or the egress
    // window cost. None of them invents a figure that appears nowhere else.
    expect(CONTENT[key as keyof typeof CONTENT]!.metaDescription).toMatch(/\$[\d,]+/);
  });
});

describe('basement snippets lead with price', () => {
  /**
   * Basements are the site's strongest cluster by position: 38 queries, 7 in
   * the top 10 and 22 in the top 20, on 351 impressions and zero clicks. Each
   * page body already publishes a real range, so the snippet quotes it rather
   * than falling back to "Expert basement finishing services in X".
   */
  const basementKeys = Object.keys(CONTENT).filter((k) => k.startsWith('basements-'));

  it('has basement combos to check', () => {
    expect(basementKeys.length).toBeGreaterThanOrEqual(10);
  });

  it.each(basementKeys)('%s quotes a dollar figure in its description', (key) => {
    const entry = CONTENT[key as keyof typeof CONTENT];
    expect(entry!.metaDescription, `${key} has no metaDescription override`).toBeTruthy();
    expect(entry!.metaDescription).toMatch(/\$[\d,]+/);
  });

  it.each(basementKeys)('%s keeps its description within snippet length', (key) => {
    // Google truncates around 160 characters; past that the price is lost.
    expect(CONTENT[key as keyof typeof CONTENT]!.metaDescription!.length).toBeLessThanOrEqual(165);
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

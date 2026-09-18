import { describe, it, expect } from 'vitest';
import {
  CONTENT,
  COMBO_CITY_SLUGS,
  FEATURED_SERVICE_SLUGS,
  defaultComboTitle,
  defaultComboDescription,
  serviceHrefForArea,
  comboPublishesPricing,
} from '@/lib/service-city-content';
import {
  SERVICES,
  ALL_SERVICE_AREAS,
  CITY_DATA,
  LUXURY_CITY_SLUGS,
  formatAreaPlace,
} from '@/lib/constants';
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

describe('snippet overrides earn their place', () => {
  /**
   * An override that reproduces the fallback word for word costs a
   * maintenance burden and buys nothing — the page renders the same string
   * either way. Three WV basement combos shipped exactly that: a metaTitle
   * byte-identical to defaultComboTitle(). Truthiness checks pass on those,
   * so compare against the real template instead.
   */
  const overrides = Object.entries(CONTENT).flatMap(([key, entry]) => {
    const { service, city } = splitKey(key);
    const serviceTitle = SERVICES.find((s) => s.slug === service)?.title;
    const area = ALL_SERVICE_AREAS.find((a) => a.slug === city);
    return serviceTitle && area ? [{ key, entry: entry!, serviceTitle, area }] : [];
  });

  it('checks every published combo', () => {
    expect(overrides.length).toBe(Object.keys(CONTENT).length);
  });

  it.each(overrides.map((o) => o.key))('%s does not restate the default title', (key) => {
    const { entry, serviceTitle, area } = overrides.find((o) => o.key === key)!;
    if (entry.metaTitle === undefined) return;
    expect(
      entry.metaTitle,
      `${key} overrides metaTitle with the generic template — drop it or say something`
    ).not.toBe(defaultComboTitle(serviceTitle, formatAreaPlace(area)));
  });

  it.each(overrides.map((o) => o.key))('%s does not restate the default description', (key) => {
    const { entry, serviceTitle, area } = overrides.find((o) => o.key === key)!;
    if (entry.metaDescription === undefined) return;
    expect(
      entry.metaDescription,
      `${key} overrides metaDescription with the generic template`
    ).not.toBe(defaultComboDescription(serviceTitle, formatAreaPlace(area)));
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

describe('Northern Virginia at region altitude', () => {
  /**
   * The altitude decision this whole change exists for. Keyword data pulled
   * 2026-09-18: "basement remodeling northern virginia" 110/mo, "basement
   * finishing northern virginia" 90, against every town-level basement term in
   * the same market below the reporting floor bar Alexandria (70) and McLean
   * (30). See docs/site-altitude-architecture-2026-09-18.md §1.5.
   */
  it('publishes the regional basement combo', () => {
    expect(Object.keys(CONTENT)).toContain('basements-northern-virginia');
  });

  /**
   * The load-bearing assertion, and the one most likely to be broken by good
   * intentions. "kitchen remodeling mclean va" is 260/mo and Vienna 140, so
   * kitchens and bathrooms stay at TOWN altitude in this market — one market,
   * two altitudes, decided per trade.
   *
   * Fanning the region out across the other trades would manufacture pages for
   * demand that does not exist at that altitude, which is the exact failure
   * the altitude doc accuses the original site build of. If a future keyword
   * pull shows regional volume for another trade, delete this test and cite
   * the pull — do not just add the key.
   */
  it('keeps the region to basements only', () => {
    const regionCombos = Object.keys(CONTENT).filter((k) => k.endsWith('-northern-virginia'));
    expect(regionCombos).toEqual(['basements-northern-virginia']);
  });

  /**
   * The towns are deliberately NOT consolidated into the region for the trades
   * where they carry their own demand. A consolidation that removed these
   * would be trading reported volume for a hub that has none yet.
   */
  it.each(['kitchens-mclean-va', 'kitchens-vienna-va', 'bathrooms-mclean-va'])(
    'keeps %s at town altitude',
    (key) => {
      expect(Object.keys(CONTENT)).toContain(key);
    }
  );

  /**
   * CLAUDE.md: basement snippets must quote a dollar figure the site already
   * publishes elsewhere, and prices must not be invented. A REGIONAL page is
   * where that rule is easiest to break — there is no single regional number,
   * so the temptation is to make one up. Every figure on the regional page has
   * to be an endpoint some other page already publishes.
   */
  it('quotes only dollar figures published elsewhere on the site', () => {
    const entry = CONTENT['basements-northern-virginia']!;
    const own = JSON.stringify(entry);
    const figures = [...new Set(own.match(/\$[\d,]+/g) ?? [])];
    expect(figures.length, 'the regional page quotes no figure at all').toBeGreaterThan(0);

    const elsewhere = Object.entries(CONTENT)
      .filter(([key]) => key !== 'basements-northern-virginia')
      .map(([, e]) => JSON.stringify(e))
      .join(' ');

    for (const figure of figures) {
      expect(
        elsewhere.includes(figure),
        `the regional page quotes ${figure}, which no other page publishes — either it is invented (CLAUDE.md forbids that) or the page that published it was removed`
      ).toBe(true);
    }
  });

  /**
   * The bug this altitude change had to fix before it could ship. Both
   * fallbacks interpolated `${city}, ${state}`, which reads "Northern
   * Virginia, VA". Pinned in both directions: unchanged for a locality, and
   * state-free for the region.
   */
  it('formats a region without appending its state', () => {
    const region = ALL_SERVICE_AREAS.find((a) => a.slug === 'northern-virginia')!;
    const town = ALL_SERVICE_AREAS.find((a) => a.slug === 'vienna-va')!;

    expect(defaultComboTitle('Basements', formatAreaPlace(region))).toBe(
      'Basements in Northern Virginia | Real Elite'
    );
    expect(defaultComboTitle('Basements', formatAreaPlace(town))).toBe(
      'Basements in Vienna, VA | Real Elite'
    );
    expect(defaultComboDescription('Basements', formatAreaPlace(region))).toContain(
      'services in Northern Virginia.'
    );
  });

  it('never says "Northern Virginia, VA" in a snippet override', () => {
    const entry = CONTENT['basements-northern-virginia']!;
    expect(entry.metaTitle).not.toContain('Northern Virginia, VA');
    expect(entry.metaDescription).not.toContain('Northern Virginia, VA');
  });
});

describe('serviceHrefForArea', () => {
  /**
   * An area page should send visitors — and its internal links — to its own
   * service+area page when one is published, not to the generic pillar.
   *
   * CityPageTemplate decided this with a hardcoded allowlist: four service
   * slugs crossed with ['winchester-va', 'frederick-md', 'leesburg-va',
   * 'ashburn-va']. Twenty areas have published service+area pages, so most of
   * them linked past their own local page. The tests below are written to fail
   * against that allowlist, not merely to restate the current implementation:
   * the completeness assertion is the one that catches it.
   */
  it('links to the published service+area page when one exists', () => {
    expect(serviceHrefForArea('basements', 'northern-virginia')).toBe(
      '/services/basements/northern-virginia'
    );
    expect(serviceHrefForArea('bathrooms', 'vienna-va')).toBe('/services/bathrooms/vienna-va');
  });

  it('falls back to the service pillar when no combo is published', () => {
    // No roofing content for Vienna, and none is planned — the NoVA markets
    // are positioned on interior remodels.
    expect(CONTENT).not.toHaveProperty('roofing-vienna-va');
    expect(serviceHrefForArea('roofing', 'vienna-va')).toBe('/services/roofing');
    expect(serviceHrefForArea('handyman', 'martinsburg-wv')).toBe('/services/handyman');
  });

  /**
   * Completeness OF THE HELPER, and the assertion the allowlist failed.
   *
   * Scoped deliberately in the name, because the first version was called
   * "deep-links every published combo and nothing else" — a claim about the
   * PAGE, which this cannot make. It calls the helper for every service, so it
   * says nothing about which call sites use it, and it passed while seven
   * published combos went unlinked: CityPageTemplate's ServiceCard renders
   * only the first six services and its overflow list hardcoded the pillar
   * path. Inwood's only published page, and siding on all three Loudoun pages,
   * were among them. Codex caught it.
   *
   * Page-level coverage is CityPageTemplate.links.test.tsx, which reads the
   * rendered anchors. This one stays because it pins the helper's own contract
   * cheaply, and because it is what fails if the allowlist ever comes back.
   */
  it('returns a deep link for exactly the combos published for an area', () => {
    for (const area of ALL_SERVICE_AREAS) {
      const published = Object.keys(CONTENT)
        .filter((k) => k.endsWith(`-${area.slug}`))
        .map((k) => k.slice(0, k.length - area.slug.length - 1))
        .sort();

      const deepLinked = SERVICES.map((s) => s.slug)
        .filter((slug) => serviceHrefForArea(slug, area.slug) !== `/services/${slug}`)
        .sort();

      expect(deepLinked, `${area.slug} does not deep-link its published combos`).toEqual(
        published
      );
    }
  });

  /**
   * A deep link must never point at a combo the route did not build:
   * /services/[service]/[city] sets dynamicParams = false, so an unpublished
   * combo is a hard 404, and an area page advertising one would be linking to
   * its own 404 — the same failure #145 fixed for consolidated area rows.
   */
  it('never returns a path the combo route did not publish', () => {
    for (const area of ALL_SERVICE_AREAS) {
      for (const service of SERVICES) {
        const href = serviceHrefForArea(service.slug, area.slug);
        if (href === `/services/${service.slug}`) continue;
        expect(
          Object.keys(CONTENT),
          `${href} is linked but not published`
        ).toContain(`${service.slug}-${area.slug}`);
      }
    }
  });
});

describe('comboPublishesPricing', () => {
  /**
   * Decides whether the generic SERVICE_DATA investment tiers may render
   * beside a combo's own copy. The tiers describe the Eastern Panhandle home
   * market: basements top out at "$90k – $140k+" while the Great Falls page
   * publishes $250,000–$350,000 as a TYPICAL build, and bathrooms top out at
   * "$45k – $75k+" against Great Falls' published $100,000–$200,000+. Both on
   * one page tells a $250,000 buyer two incompatible things.
   *
   * Codex found it on the regional basement page. It had already shipped on
   * thirty-seven premium combos.
   */
  it('is true for a premium page that quotes its own figures', () => {
    expect(comboPublishesPricing('basements', 'northern-virginia')).toBe(true);
    expect(comboPublishesPricing('basements', 'great-falls-va')).toBe(true);
    expect(comboPublishesPricing('bathrooms', 'great-falls-va')).toBe(true);
  });

  /**
   * The nine that must keep the generic tiers. These are the Loudoun exterior
   * trades; the tiers are in the right band for them and are the only pricing
   * those pages carry, so suppressing them would remove information rather
   * than a contradiction. A blanket premium gate would have done exactly that
   * — the reason this is not one.
   */
  it.each([
    ['roofing', 'leesburg-va'],
    ['roofing', 'ashburn-va'],
    ['decks', 'leesburg-va'],
    ['decks', 'brambleton-va'],
    ['decks', 'ashburn-va'],
    ['remodeling', 'leesburg-va'],
    ['remodeling', 'ashburn-va'],
    ['siding', 'leesburg-va'],
    ['siding', 'ashburn-va'],
  ])('is false for %s-%s, which publishes no figures of its own', (service, area) => {
    expect(CONTENT).toHaveProperty(`${service}-${area}`);
    expect(comboPublishesPricing(service, area)).toBe(false);
  });

  it('is false for a combo that does not exist', () => {
    expect(comboPublishesPricing('roofing', 'nowhere-va')).toBe(false);
  });

  /**
   * The count is pinned so that adding a figure to one of those nine pages —
   * which would silently drop its investment block — shows up as a decision
   * rather than a side effect. If you add one, update the number and say which
   * page gained pricing.
   */
  it('leaves exactly nine premium combos relying on the generic tiers', () => {
    const relying = Object.keys(CONTENT).filter((key) => {
      const area = ALL_SERVICE_AREAS.find((a) => key.endsWith(`-${a.slug}`));
      if (!area || area.market !== 'premium') return false;
      const service = key.slice(0, key.length - area.slug.length - 1);
      return !comboPublishesPricing(service, area.slug);
    });
    expect(relying.sort()).toEqual(
      [
        'decks-ashburn-va',
        'decks-brambleton-va',
        'decks-leesburg-va',
        'remodeling-ashburn-va',
        'remodeling-leesburg-va',
        'roofing-ashburn-va',
        'roofing-leesburg-va',
        'siding-ashburn-va',
        'siding-leesburg-va',
      ].sort()
    );
  });
});

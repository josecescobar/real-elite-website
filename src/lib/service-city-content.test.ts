import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import nodePath from 'node:path';
import {
  CONTENT,
  COMBO_CITY_SLUGS,
  FEATURED_SERVICE_SLUGS,
  defaultComboTitle,
  defaultComboDescription,
  serviceHrefForArea,
  comboPublishesPricing,
  unconfirmedClaimIdsInCombo,
  splitComboKey,
  RETIRED_COMBOS,
} from '@/lib/service-city-content';
import {
  SERVICES,
  ALL_SERVICE_AREAS,
  SERVICE_AREA_CATALOG,
  CITY_DATA,
  LUXURY_CITY_SLUGS,
  formatAreaPlace,
  servicePillarHref,
} from '@/lib/constants';
import { TITLE_MAX } from '@/lib/seo';
import { getAllPosts } from '@/lib/blog';

const SERVICE_SLUGS = new Set<string>(SERVICES.map((s) => s.slug));
const AREA_SLUGS = new Set<string>(ALL_SERVICE_AREAS.map((a) => a.slug));
const BLOG_SLUGS = new Set<string>(getAllPosts().map((p) => p.slug));

/** Split a CONTENT key the same way the route and the sitemap redirects do. */
function splitKey(key: string) {
  return splitComboKey(key);
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
    // Staged rows keep their copy so flipping status back to active republishes
    // the page. They are catalog rows, not orphans. A key with no catalog row
    // is still a failure.
    const slugs = new Set<string>(SERVICE_AREA_CATALOG.map((a) => a.slug));
    const orphans = Object.keys(CITY_DATA).filter((s) => !slugs.has(s));
    expect(orphans, 'CITY_DATA entries with no catalog row').toEqual([]);
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

describe('REA-791 home-turf service pages', () => {
  const PAGES = [
    'kitchens-martinsburg-wv',
    'kitchens-charles-town-wv',
    'bathrooms-martinsburg-wv',
    'bathrooms-charles-town-wv',
    'basements-martinsburg-wv',
    'additions-martinsburg-wv',
    'additions-charles-town-wv',
    'decks-charles-town-wv',
  ] as const;

  it.each(PAGES)('publishes %s with WV062432 and no banned claims', (key) => {
    const entry = CONTENT[key];
    expect(entry, key).toBeTruthy();
    const body = entry!.paragraphs.join('\n');
    expect(body).toContain('WV Contractor License WV062432');
    expect(body).not.toMatch(/veteran-owned|24\/7|years of experience|\bawards?\b/i);
    expect(entry!.metaTitle!.length, entry!.metaTitle).toBeLessThanOrEqual(60);
    expect(entry!.metaDescription!.length, entry!.metaDescription).toBeGreaterThanOrEqual(50);
    expect(entry!.metaDescription!.length, entry!.metaDescription).toBeLessThanOrEqual(160);
  });

  it('deep-links each page from the town hub helper', () => {
    for (const key of PAGES) {
      const dash = key.indexOf('-');
      const service = key.slice(0, dash);
      const city = key.slice(dash + 1);
      expect(serviceHrefForArea(service, city)).toBe(`/services/${service}/${city}`);
    }
  });

  it('does not spin one opening across the eight pages', () => {
    const openings = PAGES.map((key) => CONTENT[key]!.paragraphs[0].slice(0, 90));
    expect(new Set(openings).size).toBe(PAGES.length);
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
    // Exactly 10 after Tier C retired four of the original 14, so this floor
    // now has ZERO margin: retiring one more basement page fails here. That is
    // deliberate — basements are the site's strongest cluster by position
    // (§1 of the altitude doc), so thinning them further should be a decision,
    // not something a cleanup notices after the fact.
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

  /**
   * A related-guide slug that does not resolve does NOT fail loudly at runtime.
   * `RelatedGuides` drops the unresolved slug and, with nothing left, falls
   * back to the three most recent posts — so a typo on a hiring page publishes
   * whatever was written last week, silently and forever. The route passes
   * `fallbackCount={0}` to blunt that, but the honest fix is for a bad slug to
   * never reach the route at all.
   *
   * This is the same check `services-data.test.ts` runs over its own
   * `relatedGuideSlugs`, against the same source of truth.
   */
  it('only links related guides that point at real blog posts', () => {
    for (const [key, entry] of Object.entries(CONTENT)) {
      for (const guideSlug of entry!.relatedGuideSlugs ?? []) {
        expect(
          BLOG_SLUGS.has(guideSlug),
          `${key} → unknown guide "${guideSlug}". The page would silently fall back to the three most recent posts.`
        ).toBe(true);
      }
    }
  });

  it('does not pair a combo with the same guide twice', () => {
    for (const [key, entry] of Object.entries(CONTENT)) {
      const slugs = entry!.relatedGuideSlugs ?? [];
      expect(new Set(slugs).size, `${key} lists a guide more than once`).toBe(slugs.length);
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

      // "Not the pillar" rather than "not `/services/<slug>`": paving's pillar
      // is `/paving`, so comparing against the interpolated shape counted it
      // as a deep link. servicePillarHref is the single definition of what the
      // fallback is, which is the point of having it.
      const deepLinked = SERVICES.map((s) => s.slug)
        .filter((slug) => serviceHrefForArea(slug, area.slug) !== servicePillarHref(slug))
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
        if (href === servicePillarHref(service.slug)) continue;
        expect(
          Object.keys(CONTENT),
          `${href} is linked but not published`
        ).toContain(`${service.slug}-${area.slug}`);
      }
    }
  });
});

describe('REA-2292 basement keywords and Winchester kitchen', () => {
  const COST_GUIDE = '/blog/basement-remodeling-cost-ashburn-leesburg-2026';
  const LUXURY_GUIDE = '/blog/luxury-basement-finishing-loudoun-northern-virginia-2026';

  it.each([
    ['leesburg-va', 'basement finishing leesburg va'],
    ['loudoun-county-va', 'basement finishing loudoun county'],
  ])('%s uses the exact keyword in title, H1, and meta', (city, keyword) => {
    const entry = CONTENT[`basements-${city}` as keyof typeof CONTENT];
    expect(entry?.h1?.toLowerCase()).toBe(keyword);
    expect(entry?.metaTitle?.toLowerCase()).toContain(keyword);
    expect(entry?.metaDescription?.toLowerCase()).toContain(keyword);
    expect(entry?.metaTitle?.length).toBeLessThanOrEqual(60);
    expect(entry?.metaDescription).toMatch(/\$[\d,]+/);
  });

  it.each(['leesburg-va', 'loudoun-county-va'])(
    '%s has cost, timeline, egress, and permit sections linked to both Loudoun basement guides',
    (city) => {
      const entry = CONTENT[`basements-${city}` as keyof typeof CONTENT];
      expect(entry?.sections?.map((section) => section.id)).toEqual([
        'cost',
        'timeline',
        'egress',
        'permit',
      ]);
      const hrefs = (entry?.sections ?? []).flatMap((section) =>
        (section.links ?? []).map((link) => link.href)
      );
      expect(hrefs).toContain(COST_GUIDE);
      expect(hrefs).toContain(LUXURY_GUIDE);
      expect(entry?.relatedGuideSlugs).toEqual(
        expect.arrayContaining([
          'basement-remodeling-cost-ashburn-leesburg-2026',
          'luxury-basement-finishing-loudoun-northern-virginia-2026',
        ])
      );
      expect(comboPublishesPricing('basements', city)).toBe(true);
    }
  );

  it('does not clone section copy between Leesburg and Loudoun County', () => {
    const leesburg = CONTENT['basements-leesburg-va']!;
    const loudoun = CONTENT['basements-loudoun-county-va']!;
    const leesburgSections = leesburg.sections!.map((section) => section.paragraphs.join('\n'));
    const loudounSections = loudoun.sections!.map((section) => section.paragraphs.join('\n'));
    expect(leesburgSections).not.toEqual(loudounSections);
    for (const paragraph of loudounSections) {
      expect(leesburgSections).not.toContain(paragraph);
    }
  });

  it('publishes the Winchester kitchen page on the existing combo route', () => {
    const entry = CONTENT['kitchens-winchester-va'];
    expect(entry?.h1?.toLowerCase()).toBe('kitchen remodel winchester va');
    expect(entry?.metaTitle?.toLowerCase()).toContain('kitchen remodel winchester va');
    expect(entry?.metaDescription?.toLowerCase()).toContain('kitchen remodel winchester va');
    expect(serviceHrefForArea('kitchens', 'winchester-va')).toBe(
      '/services/kitchens/winchester-va'
    );
    expect(CITY_DATA['winchester-va']?.marketEmphasis).toContain('kitchens');
    expect(entry?.paragraphs.join('\n')).not.toMatch(/maryland license|MHIC/i);
  });

  it('links both Loudoun basement guides back to both hiring pages', () => {
    for (const file of [
      'content/blog/basement-remodeling-cost-ashburn-leesburg-2026.md',
      'content/blog/luxury-basement-finishing-loudoun-northern-virginia-2026.md',
    ]) {
      const markdown = fs.readFileSync(nodePath.join(process.cwd(), file), 'utf8');
      expect(markdown, file).toContain('/services/basements/leesburg-va');
      expect(markdown, file).toContain('/services/basements/loudoun-county-va');
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
   * Loudoun pages that publish only official permit fees, or no dollars at
   * all, must keep the generic tiers. A `$265` Typical Deck fee is not a job
   * range; treating it as one hid the investment block. A blanket premium
   * gate would have done the same — the reason this is not one.
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

  /**
   * Permit fees must not suppress the investment block. `comboPublishesPricing`
   * ignores figures at or under $25,000 so a Typical Deck / Typical Basement /
   * addition fee can live on the page. The test still fails if a premium page
   * trips the predicate on nothing larger than that floor — that would mean
   * the helper started counting incidental dollars as job pricing again.
   */
  it('never suppresses a premium investment block on an incidental figure', () => {
    const INCIDENTAL_CEILING = 25_000;
    const offenders: string[] = [];

    for (const [key, entry] of Object.entries(CONTENT)) {
      const area = ALL_SERVICE_AREAS.find((a) => key.endsWith(`-${a.slug}`));
      if (!area || area.market !== 'premium') continue;
      const service = key.slice(0, key.length - area.slug.length - 1);
      if (!comboPublishesPricing(service, area.slug)) continue;

      const figures = (JSON.stringify(entry).match(/\$[\d,]+/g) ?? []).map((f) =>
        Number(f.replace(/[$,]/g, ''))
      );
      const top = Math.max(...figures);
      if (top <= INCIDENTAL_CEILING) {
        offenders.push(`${key} suppresses its investment block on a top figure of only $${top}`);
      }
    }

    expect(offenders, offenders.join('; ')).toEqual([]);
  });

  it('is false for a combo that does not exist', () => {
    expect(comboPublishesPricing('roofing', 'nowhere-va')).toBe(false);
  });

  /**
   * Pinned so that adding a real job-range figure — which would silently drop
   * the investment block — shows up as a decision rather than a side effect.
   * Loudoun additions and Middleburg decks stay here because they publish
   * county fees, not project bands. kitchens-ashburn-va left this list on
   * purpose: its copy cites the HomeAdvisor kitchen ranges already published
   * on the kitchen cost guide ($41,559 and $65,000+), which are job figures,
   * not permit fees. Leesburg and Loudoun County basement pages left this
   * list when they quoted the existing cost-guide ranges.
   */
  it('leaves the premium combos that have no job-range figure on the generic tiers', () => {
    const relying = Object.keys(CONTENT).filter((key) => {
      const area = ALL_SERVICE_AREAS.find((a) => key.endsWith(`-${a.slug}`));
      if (!area || area.market !== 'premium') return false;
      const service = key.slice(0, key.length - area.slug.length - 1);
      return !comboPublishesPricing(service, area.slug);
    });
    expect(relying.sort()).toEqual(
      [
        'additions-ashburn-va',
        'additions-leesburg-va',
        'additions-loudoun-county-va',
        'additions-middleburg-va',
        'basements-ashburn-va',
        'bathrooms-ashburn-va',
        'bathrooms-berryville-va',
        'bathrooms-hamilton-va',
        'bathrooms-lansdowne-va',
        'bathrooms-leesburg-va',
        'bathrooms-loudoun-county-va',
        'bathrooms-marshall-va',
        'bathrooms-purcellville-va',
        'bathrooms-the-plains-va',
        'bathrooms-upperville-va',
        'bathrooms-warrenton-va',
        'bathrooms-waterford-va',
        'bathrooms-arlington-va',
        'bathrooms-bethesda-md',
        'bathrooms-cabin-john-md',
        'bathrooms-catharpin-va',
        'bathrooms-chevy-chase-md',
        'bathrooms-garrett-park-md',
        'bathrooms-potomac-md',
        'bathrooms-west-friendship-md',
        'decks-ashburn-va',
        'decks-brambleton-va',
        'decks-leesburg-va',
        'decks-middleburg-va',
        'kitchens-leesburg-va',
        'kitchens-loudoun-county-va',
        'kitchens-middleburg-va',
        'outdoor-living-ashburn-va',
        'outdoor-living-leesburg-va',
        'outdoor-living-loudoun-county-va',
        'outdoor-living-middleburg-va',
        'outdoor-living-purcellville-va',
        'outdoor-living-waterford-va',
        'remodeling-ashburn-va',
        'remodeling-leesburg-va',
        'remodeling-loudoun-county-va',
        'roofing-ashburn-va',
        'roofing-leesburg-va',
        'roofing-loudoun-county-va',
        'siding-ashburn-va',
        'siding-leesburg-va',
        'siding-loudoun-county-va',
        'stairs-loudoun-county-va',
      ].sort()
    );
  });
});

describe('unconfirmedClaimIdsInCombo', () => {
  /**
   * Feeds the combo template's per-bullet trust gate: a bullet renders only
   * when the page's own copy already makes every claim it would introduce.
   *
   * Two earlier predicates were refuted on review. `market === 'premium'`
   * alone ignored that 36 of 47 premium combos already publish these promises
   * in their own paragraphs. Replacing it with "makes ANY unconfirmed claim"
   * then let a page carrying only `active-work-timeline` be handed all four
   * bullets — which defeated the new-page boundary the gate exists for.
   */
  it('is empty for the regional page, whose copy was written clean', () => {
    expect(unconfirmedClaimIdsInCombo('basements', 'northern-virginia')).toEqual([]);
  });

  it('keeps previously claim-bearing pages clear after REA-55', () => {
    expect(unconfirmedClaimIdsInCombo('bathrooms', 'mclean-va')).toEqual([]);
    expect(unconfirmedClaimIdsInCombo('basements', 'great-falls-va')).toEqual([]);
  });

  it('is empty for a premium page whose own copy makes none', () => {
    expect(unconfirmedClaimIdsInCombo('decks', 'ashburn-va')).toEqual([]);
    expect(unconfirmedClaimIdsInCombo('roofing', 'leesburg-va')).toEqual([]);
  });

  it('is empty for a combo that does not exist', () => {
    expect(unconfirmedClaimIdsInCombo('roofing', 'nowhere-va')).toEqual([]);
  });

  /**
   * How many premium pages the trust-bullet rule bites on, pinned.
   *
   * I told the reviewer on #147 that this split was "pinned by count" — and it
   * was not: the pin was dropped in the same commit that said so, when the
   * predicate changed from a boolean to an id list. Tier C then moved it from
   * 36/11 to 26/11 with nothing failing. Restored, because the count IS the
   * site's published-claim footprint and the register exists to track it.
   *
   * 26 premium combos publish an unconfirmed claim in their own copy; 11 do
   * not. It was 36/11 before Tier C retired ten pages — a reduction of ten
   * pages carrying these promises, which is the direction that matters.
   *
   * Correctness does not rest on this number: `trust-bullets.test.ts` asserts
   * per claim that no page is handed one its copy does not make. This is the
   * visible measure, so a copy edit or a retirement that changes the footprint
   * surfaces as a decision rather than a side effect.
   */
  it('publishes no registered unconfirmed claims on premium combos', () => {
    let carrying = 0;
    let clean = 0;
    for (const key of Object.keys(CONTENT)) {
      const area = ALL_SERVICE_AREAS.find((a) => key.endsWith(`-${a.slug}`));
      if (!area || area.market !== 'premium') continue;
      const service = key.slice(0, key.length - area.slug.length - 1);
      if (unconfirmedClaimIdsInCombo(service, area.slug).length > 0) carrying += 1;
      else clean += 1;
    }
    // 0/104 after round 6: eight premium towns, three combos each (kitchens,
    // bathrooms, basements), all clean. Martinsburg and Charles Town are
    // home-market and are not in this count. Shepherdstown stays home-market.
    expect({ carrying, clean }).toEqual({ carrying: 0, clean: 104 });
  });

  /**
   * The exact case Codex used to refute the any-claim predicate. This page's
   * copy carries `active-work-timeline` and NONE of the four the trust bullets
   * publish, so a predicate that only asked "any claim?" would have handed it
   * all four.
   */
  it('does not report the trust bullets\u2019 claims for a page carrying only an unrelated one', () => {
    const ids = unconfirmedClaimIdsInCombo('bathrooms', 'ashburn-va');
    expect(ids).toEqual([]);
    for (const id of [
      'named-project-lead',
      'daily-updates',
      'clean-job-site',
      'written-workmanship-warranty',
    ]) {
      expect(ids, `${id} should not be reported for bathrooms-ashburn-va`).not.toContain(id);
    }
  });
});

describe('Tier C retired combos', () => {
  /**
   * Ten service+area pages retired 2026-09-18 (§3.3 of the altitude doc): zero
   * mobile impressions in six months AND no Ads row in any trade.
   *
   * The combo route builds generateStaticParams from CONTENT keys and sets
   * dynamicParams = false, so a key removed from CONTENT is a HARD 404 unless
   * next.config.ts redirects it. These tests are what stop a retirement
   * shipping half-done.
   */
  /**
   * Hagerstown's five service+city combos stay retired. The area page is
   * published (REA-2283). These combos share RETIRED_COMBOS and land on that
   * area page, so they are split out of the Tier C destination checks.
   */
  const HAGERSTOWN_COMBOS = [
    'bathrooms-hagerstown-md',
    'decks-hagerstown-md',
    'remodeling-hagerstown-md',
    'roofing-hagerstown-md',
    'siding-hagerstown-md',
  ];
  const isHagerstown = (key: string) => key.endsWith('-hagerstown-md');

  it('retires the remaining Tier C combos plus the five Hagerstown ones', () => {
    expect(Object.keys(RETIRED_COMBOS).sort()).toEqual(
      [
        ...HAGERSTOWN_COMBOS,
        'basements-burke-va',
        'basements-clifton-va',
        'basements-fairfax-station-va',
        'basements-middleburg-va',
        'bathrooms-clifton-va',
        'bathrooms-fairfax-station-va',
        'bathrooms-middleburg-va',
        'kitchens-clifton-va',
        'kitchens-fairfax-station-va',
      ].sort()
    );
  });

  /**
   * A page cannot be both published and retired. If it is, CONTENT wins (the
   * route builds it) and the 301 never fires, so the retirement is a no-op
   * that looks done.
   */
  it('publishes nothing it has retired', () => {
    for (const key of Object.keys(RETIRED_COMBOS)) {
      expect(CONTENT, `${key} is retired but still published in CONTENT`).not.toHaveProperty(key);
    }
  });

  /**
   * McLean was in an earlier draft of this list and was withdrawn: Ads rows in
   * all three trades (basements 30/mo, kitchens 260, bathrooms 140). Pinned
   * because re-adding it would delete pages for reported demand, which is the
   * error the altitude doc exists to stop repeating.
   */
  it.each(['basements-mclean-va', 'kitchens-mclean-va', 'bathrooms-mclean-va'])(
    'keeps %s — McLean was withdrawn from Tier C',
    (key) => {
      expect(RETIRED_COMBOS).not.toHaveProperty(key);
      expect(Object.keys(CONTENT)).toContain(key);
    }
  );

  /**
   * Burke keeps its kitchen and bathroom combos (10/mo apiece — tiny, but
   * reported) and lost only its basement page.
   */
  it('retires only the basement page in Burke', () => {
    expect(RETIRED_COMBOS).toHaveProperty('basements-burke-va');
    expect(Object.keys(CONTENT)).toContain('kitchens-burke-va');
    expect(Object.keys(CONTENT)).toContain('bathrooms-burke-va');
  });

  /**
   * The destination rule: the most specific SURVIVING page that still serves
   * the query. Basements keep the trade and widen the place to the region;
   * kitchens and bathrooms have no regional page by design, so they keep the
   * place and drop to the area page.
   */
  it('sends basements to the regional page and the rest to the area page', () => {
    for (const [key, destination] of Object.entries(RETIRED_COMBOS)) {
      if (isHagerstown(key)) continue;
      if (key.startsWith('basements-')) {
        expect(destination, `${key} should keep its trade`).toBe(
          '/services/basements/northern-virginia'
        );
      } else {
        const area = key.slice(key.indexOf('-') + 1);
        expect(destination, `${key} should keep its place`).toBe(`/service-areas/${area}`);
      }
    }
  });

  /**
   * The redirect assertion, carrying the conditions the AREA-level version in
   * constants.test.ts took nine rounds of review to arrive at. Read its
   * docblock before changing this one; the holes it closed were, in order:
   * proxy-not-invariant, Map-vs-ordered-list, literal-vs-dynamic matching,
   * hand-written types hiding has/missing, self-redirects, query-string
   * bypass, non-resolving targets, and protocol-relative origins.
   *
   * It proves a named sufficient condition rather than predicting Next's
   * router:
   *
   *   (a) no redirect has a dynamic source that could overlap `/services/`,
   *   (b) exactly one rule's source is the retired combo's literal path, with
   *       the declared destination and `permanent: true`,
   *   (c) that rule is unconditional — no `has`, no `missing`, and
   *   (d) the destination resolves to a page that exists: same-origin, not
   *       itself, and either an active area page or a published combo.
   *
   * Given (a), literal matching is Next's behaviour for these paths; given
   * (c) the rule always fires; so (b) and (d) decide the outcome.
   */
  it('redirects every retired combo to a page that exists', async () => {
    const { default: nextConfig } = await import('../../next.config');
    // Typed from the config's own signature, never by hand: a hand-written
    // shape is what hid the has/missing hole in the area-level version.
    const redirects = await nextConfig.redirects!();
    const retired = Object.entries(RETIRED_COMBOS);

    // (a) Nothing dynamic may overlap /services/.
    if (retired.length > 0) {
      const DYNAMIC = /[:*(]/;
      for (const rule of redirects.filter((r) => DYNAMIC.test(r.source))) {
        const staticPrefix = rule.source.split(DYNAMIC)[0];
        const couldOverlap =
          '/services/'.startsWith(staticPrefix) || staticPrefix.startsWith('/services/');
        expect(
          couldOverlap,
          `redirect "${rule.source}" is dynamic and could match paths under /services/, so it may preempt a retirement redirect. This test cannot predict which rule Next picks once that is true — make the overlapping rule specific, or order it after these and narrow this check`
        ).toBe(false);
      }
    }

    const BASE = 'https://www.realelitecontracting.com';
    const activeAreaSlugs = new Set(ALL_SERVICE_AREAS.map((a) => a.slug));
    const publishedCombos = new Set(Object.keys(CONTENT));

    for (const [key, declared] of retired) {
      const { service, city } = splitComboKey(key);
      const source = `/services/${service}/${city}`;

      // (b) Exactly one literal rule, declared destination, 301.
      const matching = redirects.filter((r) => r.source === source);
      expect(
        matching.length,
        `${key} is retired but next.config.ts has no redirect from ${source}, so that URL is a hard 404 (dynamicParams = false)`
      ).toBeGreaterThan(0);
      expect(
        matching.length,
        `${source} has ${matching.length} redirect rules. Next uses the first match, so a stale duplicate would silently win — remove the extras`
      ).toBe(1);

      const configured = matching[0];
      expect(
        configured.destination,
        `${source} redirects to "${configured.destination}" but RETIRED_COMBOS declares "${declared}" — one of the two is wrong`
      ).toBe(declared);
      // Permanent, not temporary. Next emits 308 for `permanent: true`, not
      // 301; Google treats both as permanent for canonicalisation, so the
      // destination inherits the retired page's signals either way.
      expect(
        configured.permanent,
        `${source} is a temporary redirect; a retired page should redirect permanently so the destination inherits its ranking signals`
      ).toBe(true);

      // (c) Unconditional, or every non-matching request 404s on the dead route.
      expect(
        configured.has,
        `${source} redirects only when its \`has\` conditions match; every other request 404s on the retired route`
      ).toBeUndefined();
      expect(
        configured.missing,
        `${source} redirects only when its \`missing\` conditions match; every other request 404s on the retired route`
      ).toBeUndefined();

      // (d) The destination resolves. Parse once and check the origin BEFORE
      // trusting the pathname: '//other.example/x' passes a leading-slash test
      // and resolves to a local-looking pathname while sending visitors
      // off-site. That was finding 9 on the area-level version.
      expect(
        declared.startsWith('/'),
        `${key} redirects to "${declared}", which is not a site-relative path`
      ).toBe(true);
      const url = new URL(declared, BASE);
      expect(
        url.origin,
        `${key} redirects off-site to ${url.host} — "${declared}" is not same-origin`
      ).toBe(BASE);

      const path = url.pathname.replace(/\/$/, '');
      expect(path, `${key} redirects to itself, which is an infinite redirect`).not.toBe(source);

      // Either an active area page or a published combo. Anything else — a
      // typo, a removed route, another retired combo — is a link to a 404.
      const areaMatch = /^\/service-areas\/([a-z0-9-]+)$/.exec(path);
      const comboMatch = /^\/services\/([a-z0-9-]+)\/([a-z0-9-]+)$/.exec(path);
      const pillarMatch = /^\/services\/([a-z0-9-]+)$/.exec(path);

      if (areaMatch) {
        expect(
          activeAreaSlugs.has(areaMatch[1]),
          `${key} redirects to ${path}, but "${areaMatch[1]}" is not an active service area, so the destination 404s`
        ).toBe(true);
      } else if (comboMatch) {
        const targetKey = `${comboMatch[1]}-${comboMatch[2]}`;
        expect(
          publishedCombos.has(targetKey),
          `${key} redirects to ${path}, but "${targetKey}" is not published in CONTENT, so the destination 404s`
        ).toBe(true);
      } else if (pillarMatch) {
        // A service pillar is a static route, so it exists iff its page file does.
        const pillarPage = nodePath.join(process.cwd(), 'src/app/services', pillarMatch[1], 'page.tsx');
        expect(
          fs.existsSync(pillarPage),
          `${key} redirects to ${path}, but src/app/services/${pillarMatch[1]}/page.tsx does not exist, so the destination 404s`
        ).toBe(true);
      } else {
        throw new Error(
          `${key} redirects to ${path}, which is neither an area page, a service+area page, nor a service pillar. Those are the two shapes this test can prove resolve. If another destination is genuinely needed, extend this check to prove THAT route exists — do not widen the pattern and lose the guarantee.`
        );
      }
    }
  });

  /**
   * The area pages the kitchen and bathroom redirects land on are Tier D —
   * kept deliberately, not retired. Clifton's holds 48 impressions at position
   * 15.2. If one were ever consolidated, these 301s would chain into another
   * 301 or a 404, which (d) above cannot see because it only checks the
   * immediate destination.
   */
  it.each(['clifton-va', 'fairfax-station-va', 'middleburg-va', 'burke-va'])(
    'keeps the %s area page, which retirement redirects depend on',
    (slug) => {
      const area = ALL_SERVICE_AREAS.find((a) => a.slug === slug);
      expect(area, `${slug} is a redirect destination but is no longer an active area`).toBeDefined();
      expect(area!.status).toBe('active');
    }
  );
});

describe('REA-2342 Purcellville and Lansdowne pages', () => {
  const PAGES = [
    ['kitchens', 'purcellville-va', 'Kitchen Remodeling in Purcellville, VA'],
    ['bathrooms', 'purcellville-va', 'Bathroom Remodeling in Purcellville, VA'],
    ['basements', 'purcellville-va', 'Basement Finishing in Purcellville, VA'],
    ['kitchens', 'lansdowne-va', 'Kitchen Remodeling in Lansdowne, VA'],
    ['bathrooms', 'lansdowne-va', 'Bathroom Remodeling in Lansdowne, VA'],
    ['basements', 'lansdowne-va', 'Basement Finishing in Lansdowne, VA'],
  ] as const;

  it.each(PAGES)('%s-%s uses the exact H1 and a FAQ', (service, city, h1) => {
    const entry = CONTENT[`${service}-${city}`];
    expect(entry?.h1).toBe(h1);
    expect(entry?.faqs?.length).toBeGreaterThanOrEqual(3);
    expect(entry?.paragraphs.join('\n')).not.toMatch(/hiring page|maryland license|MHIC/i);
    expect(serviceHrefForArea(service, city)).toBe(`/services/${service}/${city}`);
  });

  it('does not publish Brambleton kitchen, bath, or basement pages', () => {
    expect(CONTENT).not.toHaveProperty('kitchens-brambleton-va');
    expect(CONTENT).not.toHaveProperty('bathrooms-brambleton-va');
    expect(CONTENT).not.toHaveProperty('basements-brambleton-va');
  });

  it('keeps Middleburg bath and basement combos retired', () => {
    expect(CONTENT).toHaveProperty('kitchens-middleburg-va');
    expect(CONTENT).not.toHaveProperty('bathrooms-middleburg-va');
    expect(CONTENT).not.toHaveProperty('basements-middleburg-va');
    expect(RETIRED_COMBOS).not.toHaveProperty('kitchens-middleburg-va');
    expect(RETIRED_COMBOS['bathrooms-middleburg-va']).toBe('/service-areas/middleburg-va');
    expect(RETIRED_COMBOS['basements-middleburg-va']).toBe(
      '/services/basements/northern-virginia'
    );
  });

  it('publishes the Middleburg kitchen with the exact keyword', () => {
    const entry = CONTENT['kitchens-middleburg-va'];
    expect(entry?.h1).toBe('Kitchen Remodel Middleburg VA');
    expect(entry?.metaTitle).toBe('Kitchen Remodel Middleburg VA | Real Elite');
    expect(entry?.metaDescription?.toLowerCase()).toContain('kitchen remodel middleburg va');
    expect(entry?.includeLocalBusiness).toBe(true);
    expect(entry?.townTaggedPhotosOnly).toBe(true);
    expect(entry?.faqs?.length).toBeGreaterThanOrEqual(3);
    expect(entry?.relatedGuideSlugs).toContain('loudoun-county-permits-hoa-guide-2026');
    expect(serviceHrefForArea('kitchens', 'middleburg-va')).toBe(
      '/services/kitchens/middleburg-va'
    );
    const body = [...(entry?.paragraphs ?? []), ...(entry?.faqs ?? []).map((faq) => faq.answer)].join(
      '\n'
    );
    expect(body).toMatch(/Route 50/);
    expect(body).toMatch(/Zoning Location Permit/);
    expect(body).toMatch(/Certificate of Appropriateness/);
    expect(body).toMatch(/Atoka/);
    expect(body).toMatch(/Foxcroft/);
    expect(body).toMatch(/Goose Creek/);
    expect(body).toMatch(/well and septic/i);
    expect(body).not.toMatch(/\$[\d,]+/);
    expect(body).not.toMatch(/WV062432|2705198604|MHIC|maryland license/i);
  });

  it('links the permits guide back to published combo pages only', () => {
    const markdown = fs.readFileSync(
      nodePath.join(process.cwd(), 'content/blog/loudoun-county-permits-hoa-guide-2026.md'),
      'utf8'
    );
    for (const href of [
      '/services/kitchens/purcellville-va',
      '/services/bathrooms/purcellville-va',
      '/services/basements/purcellville-va',
      '/services/kitchens/lansdowne-va',
      '/services/bathrooms/lansdowne-va',
      '/services/basements/lansdowne-va',
      '/services/kitchens/middleburg-va',
    ]) {
      expect(markdown, href).toContain(href);
    }
    expect(markdown).not.toContain('/services/kitchens/brambleton-va');
    expect(markdown).not.toContain('/services/bathrooms/brambleton-va');
    expect(markdown).not.toContain('/services/basements/brambleton-va');
  });

  it('does not clone the six new openings', () => {
    const openings = PAGES.map(([service, city]) =>
      CONTENT[`${service}-${city}`]!.paragraphs[0].slice(0, 80)
    );
    expect(new Set(openings).size).toBe(PAGES.length);
  });

  it('links both Loudoun basement guides to Purcellville and Lansdowne', () => {
    for (const file of [
      'content/blog/basement-remodeling-cost-ashburn-leesburg-2026.md',
      'content/blog/luxury-basement-finishing-loudoun-northern-virginia-2026.md',
    ]) {
      const markdown = fs.readFileSync(nodePath.join(process.cwd(), file), 'utf8');
      expect(markdown, file).toContain('/services/basements/purcellville-va');
      expect(markdown, file).toContain('/services/basements/lansdowne-va');
    }
  });

  it('gives the rewritten Fairfax basement pages their own FAQ', () => {
    for (const city of ['mclean-va', 'vienna-va', 'great-falls-va']) {
      const entry = CONTENT[`basements-${city}` as keyof typeof CONTENT];
      expect(entry?.faqs?.length, city).toBeGreaterThanOrEqual(3);
      expect(entry?.h1).toBe(
        `Basement Finishing in ${
          city === 'mclean-va' ? 'McLean' : city === 'vienna-va' ? 'Vienna' : 'Great Falls'
        }, VA`
      );
    }
    expect(CONTENT['kitchens-vienna-va']?.faqs?.length).toBeGreaterThanOrEqual(3);
    expect(CONTENT['kitchens-mclean-va']?.faqs).toBeUndefined();
    expect(CONTENT['bathrooms-great-falls-va']?.faqs).toBeUndefined();
  });
});

describe('REA-2358 close-in established towns', () => {
  const PAGES = [
    ['kitchens', 'waterford-va', 'Kitchen Remodeling in Waterford, VA'],
    ['bathrooms', 'waterford-va', 'Bathroom Remodeling in Waterford, VA'],
    ['basements', 'waterford-va', 'Basement Finishing in Waterford, VA'],
    ['kitchens', 'hamilton-va', 'Kitchen Remodeling in Hamilton, VA'],
    ['bathrooms', 'hamilton-va', 'Bathroom Remodeling in Hamilton, VA'],
    ['basements', 'hamilton-va', 'Basement Finishing in Hamilton, VA'],
    ['kitchens', 'berryville-va', 'Kitchen Remodeling in Berryville, VA'],
    ['bathrooms', 'berryville-va', 'Bathroom Remodeling in Berryville, VA'],
    ['basements', 'berryville-va', 'Basement Finishing in Berryville, VA'],
    ['kitchens', 'shepherdstown-wv', 'Kitchen Remodeling in Shepherdstown, WV'],
    ['bathrooms', 'shepherdstown-wv', 'Bathroom Remodeling in Shepherdstown, WV'],
    ['basements', 'shepherdstown-wv', 'Basement Finishing in Shepherdstown, WV'],
    ['kitchens', 'the-plains-va', 'Kitchen Remodeling in The Plains, VA'],
    ['bathrooms', 'the-plains-va', 'Bathroom Remodeling in The Plains, VA'],
    ['basements', 'the-plains-va', 'Basement Finishing in The Plains, VA'],
    ['kitchens', 'upperville-va', 'Kitchen Remodeling in Upperville, VA'],
    ['bathrooms', 'upperville-va', 'Bathroom Remodeling in Upperville, VA'],
    ['basements', 'upperville-va', 'Basement Finishing in Upperville, VA'],
    ['kitchens', 'marshall-va', 'Kitchen Remodeling in Marshall, VA'],
    ['bathrooms', 'marshall-va', 'Bathroom Remodeling in Marshall, VA'],
    ['basements', 'marshall-va', 'Basement Finishing in Marshall, VA'],
    ['kitchens', 'warrenton-va', 'Kitchen Remodeling in Warrenton, VA'],
    ['bathrooms', 'warrenton-va', 'Bathroom Remodeling in Warrenton, VA'],
    ['basements', 'warrenton-va', 'Basement Finishing in Warrenton, VA'],
  ] as const;

  it.each(PAGES)('%s-%s uses the exact H1 and a FAQ', (service, city, h1) => {
    const entry = CONTENT[`${service}-${city}`];
    expect(entry?.h1).toBe(h1);
    expect(entry?.faqs?.length).toBeGreaterThanOrEqual(3);
    expect(entry?.paragraphs.join('\n')).not.toMatch(/this page|maryland license|MHIC|veteran-owned/i);
    expect(serviceHrefForArea(service, city)).toBe(`/services/${service}/${city}`);
  });

  it('does not clone the 24 openings', () => {
    const openings = PAGES.map(([service, city]) =>
      CONTENT[`${service}-${city}`]!.paragraphs[0].slice(0, 90)
    );
    expect(new Set(openings).size).toBe(PAGES.length);
  });

  it('keeps Brambleton kitchen, bath, and basement pages unpublished', () => {
    expect(CONTENT).not.toHaveProperty('kitchens-brambleton-va');
    expect(CONTENT).not.toHaveProperty('bathrooms-brambleton-va');
    expect(CONTENT).not.toHaveProperty('basements-brambleton-va');
  });

  it('names the county or town permit office on every new basement page', () => {
    const offices: Record<string, RegExp> = {
      'waterford-va': /LandMARC/,
      'hamilton-va': /Town of Hamilton|town zoning/i,
      'berryville-va': /Clarke County Building Department/,
      'shepherdstown-wv': /104 North King Street/,
      'the-plains-va': /16 Courthouse Square/,
      'upperville-va': /16 Courthouse Square/,
      'marshall-va': /16 Courthouse Square/,
      'warrenton-va': /347-1101/,
    };
    for (const [city, pattern] of Object.entries(offices)) {
      const entry = CONTENT[`basements-${city}` as keyof typeof CONTENT];
      const text = [
        ...(entry?.paragraphs ?? []),
        ...(entry?.faqs ?? []).map((faq) => faq.answer),
      ].join('\n');
      expect(text, city).toMatch(pattern);
    }
  });
});

describe('outdoor living and stairs combos stay off Brambleton', () => {
  it('never names Brambleton or links a Brambleton guide', () => {
    const hits = Object.entries(CONTENT)
      .filter(([key]) => key.startsWith('outdoor-living-') || key.startsWith('stairs-'))
      .filter(([, entry]) => /brambleton/i.test(JSON.stringify(entry)))
      .map(([key]) => key);
    expect(hits).toEqual([]);
  });
});

describe('customer copy never reads like an editor note', () => {
  function renderedCopy(entry: (typeof CONTENT)[keyof typeof CONTENT]) {
    if (!entry) return [];
    return [
      entry.h1,
      entry.metaTitle,
      entry.metaDescription,
      ...entry.paragraphs,
      ...(entry.faqs ?? []).flatMap((faq) => [faq.question, faq.answer]),
      ...(entry.notes ?? []).flatMap((note) => [note.heading, note.body, note.linkLabel]),
      ...(entry.sections ?? []).flatMap((section) => [
        section.title,
        ...section.paragraphs,
        ...(section.links ?? []).map((link) => link.label),
      ]),
    ].filter((text): text is string => typeof text === 'string');
  }

  it('fails when rendered copy pairs "this page" with publish, quote, uses, or does not', () => {
    const verb = /publish|quote|uses|does not/i;
    const hits: string[] = [];
    for (const [key, entry] of Object.entries(CONTENT)) {
      for (const text of renderedCopy(entry)) {
        if (/this page/i.test(text) && verb.test(text)) hits.push(`${key}: ${text}`);
      }
    }
    expect(hits).toEqual([]);
  });

  it('fails on gallery-tagging or estimate-line notes in rendered copy', () => {
    const leak = /tagged to|so none is shown|in the gallery|stays separate on the estimate/i;
    const hits: string[] = [];
    for (const [key, entry] of Object.entries(CONTENT)) {
      for (const text of renderedCopy(entry)) {
        if (leak.test(text)) hits.push(`${key}: ${text}`);
      }
    }
    expect(hits).toEqual([]);
  });
});

describe('REA-2371 outdoor living and stairs combos', () => {
  const PAGES = [
    ['outdoor-living', 'loudoun-county-va', 'Outdoor Living Loudoun County VA'],
    ['outdoor-living', 'leesburg-va', 'Outdoor Living Leesburg VA'],
    ['outdoor-living', 'ashburn-va', 'Outdoor Living Ashburn VA'],
    ['outdoor-living', 'purcellville-va', 'Outdoor Living Purcellville VA'],
    ['outdoor-living', 'middleburg-va', 'Screened Porch & Outdoor Living Middleburg VA'],
    ['outdoor-living', 'waterford-va', 'Outdoor Living Waterford VA'],
    ['outdoor-living', 'martinsburg-wv', 'Outdoor Living Martinsburg WV'],
    ['outdoor-living', 'charles-town-wv', 'Outdoor Living Charles Town WV'],
    ['stairs', 'loudoun-county-va', 'Stair Remodeling Loudoun County VA'],
    ['stairs', 'martinsburg-wv', 'Stair Remodeling Martinsburg WV'],
  ] as const;

  it.each(PAGES)('%s-%s publishes the exact H1, FAQs, and town-tagged photos', (service, city, h1) => {
    const entry = CONTENT[`${service}-${city}`];
    expect(entry?.h1).toBe(h1);
    expect(entry?.metaTitle).toContain(h1);
    expect(entry?.metaDescription?.toLowerCase()).toContain(h1.toLowerCase());
    expect(entry?.paragraphs.length).toBeGreaterThanOrEqual(3);
    expect(entry?.paragraphs.length).toBeLessThanOrEqual(4);
    expect(entry?.faqs?.length).toBeGreaterThanOrEqual(2);
    expect(entry?.faqs?.length).toBeLessThanOrEqual(3);
    expect(entry?.townTaggedPhotosOnly).toBe(true);
    expect(entry?.includeLocalBusiness).toBe(true);
    expect(entry?.relatedGuideSlugs?.length).toBeGreaterThan(0);
    expect(serviceHrefForArea(service, city)).toBe(`/services/${service}/${city}`);
    const { service: parsedService, city: parsedCity } = splitComboKey(`${service}-${city}`);
    expect(parsedService).toBe(service);
    expect(parsedCity).toBe(city);
  });

  it('does not publish outdoor living or stairs for any other town, including Brambleton', () => {
    const allowed = new Set(PAGES.map(([service, city]) => `${service}-${city}`));
    for (const key of Object.keys(CONTENT)) {
      if (key.startsWith('outdoor-living-') || key.startsWith('stairs-')) {
        expect(allowed.has(key), key).toBe(true);
      }
    }
    expect(CONTENT).not.toHaveProperty('outdoor-living-brambleton-va');
    expect(CONTENT).not.toHaveProperty('stairs-brambleton-va');
  });

  it('keeps the ten openings unique and the copy customer-facing', () => {
    const openings = PAGES.map(([service, city]) =>
      CONTENT[`${service}-${city}`]!.paragraphs[0].slice(0, 90)
    );
    expect(new Set(openings).size).toBe(PAGES.length);
    const banned =
      /this page|tagged to|in the gallery|no photo is shown|so none is shown|stays separate on the estimate|we do not publish|WV062432|2705198604|MHIC|maryland license|inspiration/i;
    for (const [service, city] of PAGES) {
      const entry = CONTENT[`${service}-${city}`]!;
      const body = [
        entry.h1,
        entry.metaTitle,
        entry.metaDescription,
        ...entry.paragraphs,
        ...(entry.faqs ?? []).flatMap((faq) => [faq.question, faq.answer]),
      ].join('\n');
      expect(body, `${service}-${city}`).not.toMatch(banned);
    }
  });

  it('limits the outdoor-living price to the published full-build range', () => {
    const loudoun = CONTENT['outdoor-living-loudoun-county-va']!;
    const loudounBody = [...loudoun.paragraphs, ...loudoun.faqs!.map((faq) => faq.answer)].join('\n');
    expect(loudounBody).toContain('$35k–$80k+');
    for (const [service, city] of PAGES) {
      if (service === 'outdoor-living' && city === 'loudoun-county-va') continue;
      const entry = CONTENT[`${service}-${city}`]!;
      const body = [...entry.paragraphs, ...(entry.faqs ?? []).map((faq) => faq.answer)].join('\n');
      expect(body, `${service}-${city}`).not.toMatch(/\$[\d,]+/);
      expect(body).toMatch(/free written estimate after a site walk/i);
    }
  });

  it('states the stair permit rule on both stair pages', () => {
    for (const city of ['loudoun-county-va', 'martinsburg-wv'] as const) {
      const entry = CONTENT[`stairs-${city}`]!;
      const body = [...entry.paragraphs, ...entry.faqs!.map((faq) => faq.answer)].join('\n');
      expect(body).toMatch(/treads, risers, or balusters on a sound stair usually needs no permit/i);
      expect(body).toMatch(/structural or layout changes, and new exterior stairs, do/i);
      expect(body).toMatch(/we confirm with the county before work starts/i);
    }
  });
});

describe('REA-2385 round 6 Tier A towns', () => {
  const PAGES = [
    ['kitchens', 'garrett-park-md', 'Kitchen Remodeling in Garrett Park, MD'],
    ['bathrooms', 'garrett-park-md', 'Bathroom Remodeling in Garrett Park, MD'],
    ['basements', 'garrett-park-md', 'Basement Finishing in Garrett Park, MD'],
    ['kitchens', 'bethesda-md', 'Kitchen Remodeling in Bethesda, MD'],
    ['bathrooms', 'bethesda-md', 'Bathroom Remodeling in Bethesda, MD'],
    ['basements', 'bethesda-md', 'Basement Finishing in Bethesda, MD'],
    ['kitchens', 'arlington-va', 'Kitchen Remodeling in Arlington, VA'],
    ['bathrooms', 'arlington-va', 'Bathroom Remodeling in Arlington, VA'],
    ['basements', 'arlington-va', 'Basement Finishing in Arlington, VA'],
    ['kitchens', 'potomac-md', 'Kitchen Remodeling in Potomac, MD'],
    ['bathrooms', 'potomac-md', 'Bathroom Remodeling in Potomac, MD'],
    ['basements', 'potomac-md', 'Basement Finishing in Potomac, MD'],
    ['kitchens', 'cabin-john-md', 'Kitchen Remodeling in Cabin John, MD'],
    ['bathrooms', 'cabin-john-md', 'Bathroom Remodeling in Cabin John, MD'],
    ['basements', 'cabin-john-md', 'Basement Finishing in Cabin John, MD'],
    ['kitchens', 'west-friendship-md', 'Kitchen Remodeling in West Friendship, MD'],
    ['bathrooms', 'west-friendship-md', 'Bathroom Remodeling in West Friendship, MD'],
    ['basements', 'west-friendship-md', 'Basement Finishing in West Friendship, MD'],
    ['kitchens', 'chevy-chase-md', 'Kitchen Remodeling in Chevy Chase, MD'],
    ['bathrooms', 'chevy-chase-md', 'Bathroom Remodeling in Chevy Chase, MD'],
    ['basements', 'chevy-chase-md', 'Basement Finishing in Chevy Chase, MD'],
    ['kitchens', 'catharpin-va', 'Kitchen Remodeling in Catharpin, VA'],
    ['bathrooms', 'catharpin-va', 'Bathroom Remodeling in Catharpin, VA'],
    ['basements', 'catharpin-va', 'Basement Finishing in Catharpin, VA'],
  ] as const;

  it.each(PAGES)('%s-%s uses the exact H1, FAQs, and town-tagged photos', (service, city, h1) => {
    const entry = CONTENT[`${service}-${city}`];
    expect(entry?.h1).toBe(h1);
    expect(entry?.metaDescription?.toLowerCase()).toContain(h1.toLowerCase());
    expect(entry?.paragraphs.length).toBeGreaterThanOrEqual(3);
    expect(entry?.paragraphs.length).toBeLessThanOrEqual(4);
    expect(entry?.faqs?.length).toBeGreaterThanOrEqual(2);
    expect(entry?.faqs?.length).toBeLessThanOrEqual(3);
    expect(entry?.townTaggedPhotosOnly).toBe(true);
    expect(serviceHrefForArea(service, city)).toBe(`/services/${service}/${city}`);
    const body = [
      entry?.h1,
      entry?.metaDescription,
      ...(entry?.paragraphs ?? []),
      ...(entry?.faqs ?? []).flatMap((faq) => [faq.question, faq.answer]),
    ].join('\n');
    expect(body).not.toMatch(
      /this page|tagged to|in the gallery|no photo is shown|we do not publish|WV062432|2705198604|MHIC|maryland license|inspiration|veteran-owned|brambleton/i
    );
    expect(body).toMatch(/free written estimate after a site walk/i);
  });

  it('does not clone the 24 openings', () => {
    const openings = PAGES.map(([service, city]) =>
      CONTENT[`${service}-${city}`]!.paragraphs[0].slice(0, 90)
    );
    expect(new Set(openings).size).toBe(PAGES.length);
  });

  it('publishes no other combo for these towns', () => {
    const allowed = new Set(PAGES.map(([service, city]) => `${service}-${city}`));
    for (const city of [
      'garrett-park-md',
      'bethesda-md',
      'arlington-va',
      'potomac-md',
      'cabin-john-md',
      'west-friendship-md',
      'chevy-chase-md',
      'catharpin-va',
    ]) {
      for (const key of Object.keys(CONTENT)) {
        if (key.endsWith(`-${city}`)) expect(allowed.has(key), key).toBe(true);
      }
    }
    expect(CONTENT).not.toHaveProperty('kitchens-brambleton-va');
    expect(CONTENT).not.toHaveProperty('outdoor-living-bethesda-md');
    expect(CONTENT).not.toHaveProperty('stairs-arlington-va');
  });

  it('names the sourced permit office on every new basement page', () => {
    const offices: Record<string, RegExp> = {
      'garrett-park-md': /301-933-7488/,
      'bethesda-md': /240-777-0311/,
      'arlington-va': /2100 Clarendon Boulevard/,
      'potomac-md': /240-777-0311/,
      'cabin-john-md': /240-777-0311/,
      'west-friendship-md': /410-313-2455/,
      'chevy-chase-md': /301-654-7144/,
      'catharpin-va': /792-4311/,
    };
    for (const [city, pattern] of Object.entries(offices)) {
      const entry = CONTENT[`basements-${city}` as keyof typeof CONTENT];
      const text = [
        ...(entry?.paragraphs ?? []),
        ...(entry?.faqs ?? []).map((faq) => faq.answer),
        ...(entry?.sections ?? []).flatMap((section) => section.paragraphs),
      ].join('\n');
      expect(text, city).toMatch(pattern);
    }
  });

  it('keeps the new copy off the site and off the copied basement tiers', () => {
    const siteTalk =
      /own pages|has its own page|county hub|no fee is copied|copied here|left out|not repeated here|nokesville's page|cost guide/i;
    const tiers = /\$65,000|\$85,000|\$110,000|\$150,000|\$300,000|mayflower/i;
    for (const [service, city] of PAGES) {
      const entry = CONTENT[`${service}-${city}`]!;
      const text = [
        entry.metaDescription,
        ...entry.paragraphs,
        ...(entry.faqs ?? []).flatMap((faq) => [faq.question, faq.answer]),
        ...(entry.sections ?? []).flatMap((section) => [
          section.title,
          ...section.paragraphs,
          ...(section.links ?? []).map((link) => link.label),
        ]),
      ].join('\n');
      expect(text, `${service}-${city}`).not.toMatch(siteTalk);
      if (service === 'basements') {
        expect(text, city).toMatch(/\$55,000/);
        expect(text, city).toMatch(/free written estimate after a site walk/i);
        expect(text, city).not.toMatch(tiers);
      }
    }
    for (const slug of [
      'garrett-park-md',
      'bethesda-md',
      'arlington-va',
      'potomac-md',
      'cabin-john-md',
      'west-friendship-md',
      'chevy-chase-md',
      'catharpin-va',
    ]) {
      const area = CITY_DATA[slug];
      const text = [
        area?.description,
        ...(area?.faqs ?? []).flatMap((faq) => [faq.question, faq.answer]),
      ].join('\n');
      expect(text, slug).not.toMatch(siteTalk);
      expect(text, slug).not.toMatch(/town approval is still|town step is still required/i);
    }
    const garrettKitchen = CONTENT['kitchens-garrett-park-md']!;
    const garrettCabinet = [
      ...garrettKitchen.paragraphs,
      ...garrettKitchen.faqs!.flatMap((faq) => [faq.question, faq.answer]),
      CITY_DATA['garrett-park-md']?.faqs?.map((faq) => faq.answer).join('\n'),
    ].join('\n');
    expect(garrettCabinet).toMatch(/only when the scope/i);
    expect(garrettCabinet).not.toMatch(/town step is still required|town approval is still a separate step/i);
  });
});

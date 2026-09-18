import { describe, it, expect } from 'vitest';
import {
  CONTENT,
  COMBO_CITY_SLUGS,
  FEATURED_SERVICE_SLUGS,
  defaultComboTitle,
  defaultComboDescription,
  serviceHrefForArea,
  comboPublishesPricing,
  unconfirmedClaimIdsInCombo,
  RETIRED_COMBOS,
} from '@/lib/service-city-content';
import {
  SERVICES,
  ALL_SERVICE_AREAS,
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

  /**
   * The hole in the predicate, closed. `comboPublishesPricing` matches any
   * `$`-figure anywhere in the entry, so a number mentioned in passing — a
   * permit fee, a deposit — would suppress a premium page's investment block
   * and leave it with no pricing at all.
   *
   * No premium combo does that today: the lowest top figure among those that
   * trip the predicate is $40,000, on roofing-loudoun-county-va, which is a
   * real project range. The threshold is set well under that so ordinary copy
   * edits do not trip it, and it exists so that adding a small incidental
   * figure to a premium page fails here instead of silently dropping the
   * block. If this fails, do not raise the threshold — either the figure is
   * incidental and should not be there, or the page needs real pricing.
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

  it('lists the claims a page makes in its own paragraphs', () => {
    expect(unconfirmedClaimIdsInCombo('bathrooms', 'mclean-va')).toContain('named-project-lead');
    expect(unconfirmedClaimIdsInCombo('basements', 'great-falls-va')).toContain(
      'written-workmanship-warranty'
    );
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
  it('splits the premium combos 27 carrying claims to 10 not', () => {
    let carrying = 0;
    let clean = 0;
    for (const key of Object.keys(CONTENT)) {
      const area = ALL_SERVICE_AREAS.find((a) => key.endsWith(`-${a.slug}`));
      if (!area || area.market !== 'premium') continue;
      const service = key.slice(0, key.length - area.slug.length - 1);
      if (unconfirmedClaimIdsInCombo(service, area.slug).length > 0) carrying += 1;
      else clean += 1;
    }
    // 27/10 as of 2026-09-18, was 26/11. One combo moved from clean to
    // carrying when the warranty pattern widened to cover "workmanship
    // guarantee" and the plural "workmanship warranties" — the copy dates to
    // 2026-07-06 (#63) and never changed; only detection did. A rise here
    // caused by NEW copy is a defect; this one is the scan catching up.
    expect({ carrying, clean }).toEqual({ carrying: 27, clean: 10 });
  });

  /**
   * The exact case Codex used to refute the any-claim predicate. This page's
   * copy carries `active-work-timeline` and NONE of the four the trust bullets
   * publish, so a predicate that only asked "any claim?" would have handed it
   * all four.
   */
  it('does not report the trust bullets\u2019 claims for a page carrying only an unrelated one', () => {
    const ids = unconfirmedClaimIdsInCombo('bathrooms', 'ashburn-va');
    expect(ids).toContain('active-work-timeline');
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
  it('retires exactly the ten combos the doc names', () => {
    expect(Object.keys(RETIRED_COMBOS).sort()).toEqual(
      [
        'basements-burke-va',
        'basements-clifton-va',
        'basements-fairfax-station-va',
        'basements-middleburg-va',
        'bathrooms-clifton-va',
        'bathrooms-fairfax-station-va',
        'bathrooms-middleburg-va',
        'kitchens-clifton-va',
        'kitchens-fairfax-station-va',
        'kitchens-middleburg-va',
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
      const dash = key.indexOf('-');
      const source = `/services/${key.slice(0, dash)}/${key.slice(dash + 1)}`;

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
      } else {
        throw new Error(
          `${key} redirects to ${path}, which is neither an area page nor a service+area page. Those are the two shapes this test can prove resolve. If another destination is genuinely needed, extend this check to prove THAT route exists — do not widen the pattern and lose the guarantee.`
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

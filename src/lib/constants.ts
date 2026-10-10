/**
 * Owner / author identity used by the blog AuthorBox and any future
 * "About the owner" surface. Drop a real portrait at
 * /public/images/team/owner.jpg and set portrait: '/images/team/owner.jpg'
 * here to replace the placeholder. Set name/title once finalized.
 */
export const OWNER = {
  name: 'Real Elite Contracting Team',
  title: 'Family-Run · Built With Military Precision',
  /** Set to '/images/team/owner.jpg' once the real portrait lands. */
  portrait: null as string | null,
} as const;

export const BUSINESS = {
  name: 'Real Elite Contracting',
  tagline: 'Family-Run Remodeling Contractor',
  phone: '(681) 534-5515',
  phoneRaw: '+16815345515',
  email: 'info@realelitecontracting.com',
  address: {
    /**
     * HQ street is also the home address. Never publish it on the site,
     * in schema, or in llms.txt. Treat this as a service-area business.
     */
    street: null as string | null,
    city: 'Martinsburg',
    state: 'WV',
    zip: '25405',
    region: 'Eastern Panhandle, WV',
  },
  url: 'https://www.realelitecontracting.com',
  /**
   * Social URLs. LinkedIn and Thumbtack profiles were previously listed but
   * returned 404 — removed to avoid broken trust signals in the footer and
   * broken sameAs references in JSON-LD. Add them back here once the real
   * profiles exist.
   *
   * Yelp is left in because Yelp blocks automated checks (403 on bots), so it
   * has never been confirmed to be Real Elite's profile. It is therefore
   * UNVERIFIED and is deliberately absent from `VERIFIED_PROFILE_URLS` below.
   * Verify it manually in a browser, then add it there to enable the sameAs
   * assertion. The footer needs a SECOND edit: an entry in `SOCIAL_LINKS` in
   * Footer.tsx carrying an icon, since a bare URL has nothing to render.
   */
  social: {
    facebook: 'https://www.facebook.com/realelitecontracting',
    instagram: 'https://www.instagram.com/realelitecontracting',
    google: 'https://share.google/yuA4SUQ5zDrSKAyHm',
    /** UNVERIFIED — see the note above. Not in `VERIFIED_PROFILE_URLS`. */
    yelp: 'https://www.yelp.com/biz/real-elite-contracting',
  },
  hours: 'Mon–Fri: 7:00 AM – 6:00 PM | Sat: 8:00 AM – 2:00 PM',
} as const;

/**
 * Who runs the company, as Jose stated on 2026-09-28.
 * The ownership split is undocumented, and no federal veteran certification
 * is held. Publish the sentence below. Miguel's service and Purple Heart are
 * facts about him. No branch of service is documented.
 */
export const FAMILY_RUN = {
  short: 'Family-Run',
  sentence:
    'Family-run by brothers Jose and Miguel. Miguel is a U.S. military veteran and Purple Heart recipient.',
} as const;

/**
 * The subset of `BUSINESS.social` confirmed to belong to Real Elite, and
 * therefore safe to assert as an external identity in the sitewide
 * LocalBusiness `sameAs`.
 *
 * `sameAs` is a machine-readable claim that this business owns these
 * profiles. An unverified URL in it tells Google the business owns a page
 * that may belong to someone else — which is why the 404'd LinkedIn and
 * Thumbtack URLs were removed rather than left in place.
 *
 * Yelp is absent for the same reason: Yelp 403s bots, so its URL has never
 * been confirmed. Once a human opens it and confirms it is Real Elite's, add
 * `BUSINESS.social.yelp` here.
 *
 * Footer.tsx gates `SOCIAL_LINKS` on this same list, so removing a URL here
 * withdraws it from both the footer and `sameAs` at once. Adding one is not
 * symmetric: a new platform also needs a `SOCIAL_LINKS` entry with an icon
 * before the footer can show it. An earlier version of this comment claimed
 * one edit covered both, and it did not.
 */
export const VERIFIED_PROFILE_URLS = [
  BUSINESS.social.facebook,
  BUSINESS.social.instagram,
  BUSINESS.social.google,
] as const;

/**
 * Social-proof / trust signals — single source of truth for the rating,
 * review count, badges, and aggregate numbers shown across the site
 * (TrustBar, /reviews, footer, LocalBusiness JSON-LD).
 *
 * Everything here ships as honest placeholders. The site renders its
 * existing generic copy until real numbers land. To go live with real
 * social proof, edit ONLY this object:
 *
 *   1. Set `googleRating` / `googleReviewCount` to the real Google
 *      Business Profile figures and flip `verified` to true. This upgrades
 *      the TrustBar tile, the /reviews rating block, AND emits the
 *      AggregateRating JSON-LD (rich-result stars). Do NOT set `verified`
 *      true with invented numbers — self-serving review markup that does
 *      not mirror the real profile violates Google's policy (see the
 *      TESTIMONIALS warning below) and risks a manual action.
 *   2. Add a real, live profile URL to a badge's `href` to make it appear.
 *      Badges with `href: null` never render (no fake trust badges).
 *   3. `projectsCompleted` displays only when set to a real number.
 */
export const SOCIAL_PROOF = {
  /** Gates the rating display AND the review JSON-LD. Keep false until the
   *  numbers below mirror the real Google Business Profile. */
  verified: false,
  googleRating: null as number | null, // e.g. 4.9
  googleReviewCount: null as number | null, // e.g. 127
  projectsCompleted: null as number | null, // e.g. 500
  /** Third-party trust badges. Each renders ONLY when `href` is a real,
   *  live profile URL — keep `null` for any platform not yet verified. */
  badges: [
    { name: 'Google', label: 'Google Reviews', href: BUSINESS.social.google as string | null },
    { name: 'BBB', label: 'BBB Accredited', href: null as string | null },
    { name: 'Angi', label: 'Angi Certified', href: null as string | null },
  ],
} as const;

/**
 * Financing. Until a lending partner (Hearth, Sunlight Financial,
 * Service Finance, GreenSky, etc.) is signed, `applyUrl` stays null and
 * the /financing page routes homeowners to the estimate form, where the
 * team walks through options in person. The moment a partner is live,
 * set `applyUrl` to their co-branded application link (and `partnerName`
 * for the byline) — every CTA on /financing switches over automatically.
 *
 * IMPORTANT: never advertise specific APRs, "as low as" rates, or fixed
 * monthly figures here without written substantiation from the lender —
 * those are regulated credit-advertising claims (TILA / Reg Z). The page
 * is intentionally written without rate numbers.
 */
export const FINANCING = {
  applyUrl: null as string | null,
  partnerName: null as string | null,
} as const;

/**
 * Service catalog — ordered by homepage / mega-menu priority.
 * Premium remodeling categories lead; small-job services trail.
 */
/**
 * Services whose pillar page does NOT live under `/services/`.
 *
 * Paving was consolidated into a dedicated `/paving` pillar — hub, service
 * templates and location pages — and `/services/paving` redirects there. But
 * the row stays in SERVICES because the trade is still offered, so every
 * caller deriving a link from the slug produced `/services/paving` and sent
 * the visitor through a 308. It was on 27 live pages: all 26 service-area
 * pages and the `/services` index.
 *
 * Found by the built-HTML link assertion in `tests/built-links.test.ts` on its
 * first run. No source-level scan could have seen it — the href is derived
 * from the slug, so the string `/services/paving` appears nowhere in `src`.
 * That is the argument for asserting over rendered output, made concrete.
 */
const PILLAR_HREF_OVERRIDES: Readonly<Record<string, string>> = {
  paving: '/paving',
};

/**
 * The canonical pillar URL for a service slug.
 *
 * Every caller that turns a service slug into a link must use this rather than
 * interpolating `/services/${slug}` — that is what produced the 27-page
 * redirect above.
 */
export const servicePillarHref = (slug: string): string =>
  PILLAR_HREF_OVERRIDES[slug] ?? `/services/${slug}`;

export const SERVICES = [
  {
    title: 'Bathroom Remodeling',
    slug: 'bathrooms',
    description:
      'Walk-in showers, tile work, vanities, and full master-bath transformations across the WV–MD–VA region.',
    icon: 'Bath' as const,
  },
  {
    title: 'Kitchen Remodeling',
    slug: 'kitchens',
    description:
      'Custom cabinetry, islands, layout changes, and full kitchen transformations. Premium kitchens for families who actually cook.',
    icon: 'ChefHat' as const,
  },
  {
    title: 'Basement Finishing',
    slug: 'basements',
    description:
      'Finished family rooms, in-law suites, basement bars. Done to code with proper moisture control.',
    icon: 'Home' as const,
  },
  {
    title: 'Whole-Home Remodeling',
    slug: 'remodeling',
    description:
      'Interior and exterior remodels — kitchens, bathrooms, basements, and full home renovations with a coordinated scope.',
    icon: 'Hammer' as const,
  },
  {
    title: 'Decks',
    slug: 'decks',
    description:
      'Composite and pressure-treated decks, railings, and built-ins using premium materials.',
    icon: 'Fence' as const,
  },
  {
    title: 'Outdoor Living',
    slug: 'outdoor-living',
    description:
      'Screened porches, covered patios, pergolas, and outdoor living spaces tied into the house.',
    icon: 'Fence' as const,
  },
  {
    title: 'Stairs & Railings',
    slug: 'stairs',
    description:
      'Staircase remodels, new treads and balusters, handrails, and deck and porch stairs built to code.',
    icon: 'Hammer' as const,
  },
  {
    title: 'Roofing',
    slug: 'roofing',
    description:
      'Architectural shingle replacement, valley flashing, storm-damage repair, and complete tear-offs.',
    icon: 'Home' as const,
  },
  {
    title: 'Siding & Stone Exteriors',
    slug: 'siding',
    description:
      'Vinyl, fiber cement, and stone veneer that elevates every facade — the highest-ROI exterior upgrade.',
    icon: 'Layers' as const,
  },
  {
    title: 'Paving & Seal Coating',
    slug: 'paving',
    description:
      'Driveways, parking lots, repairs, and seal coating — asphalt, concrete, and tar-and-chip — across the Eastern Panhandle.',
    icon: 'Construction' as const,
  },
  {
    title: 'Home Additions',
    slug: 'additions',
    description:
      'Bump-outs, single rooms, second stories, and in-law suites — engineered to look like they were always part of the home.',
    icon: 'Plus' as const,
  },
  {
    title: 'Exterior Repairs',
    slug: 'exterior-repairs',
    description:
      'Stone veneer detail work, foundation repair, trim, and exterior maintenance — same craft, smaller scope.',
    icon: 'Wrench' as const,
  },
  {
    title: 'General Repairs & Maintenance',
    slug: 'general-repairs',
    description:
      'Doors, drywall, trim, deck fixes, and the smaller jobs that keep your home in great shape.',
    icon: 'Paintbrush' as const,
  },
  {
    title: 'Handyman Services',
    slug: 'handyman',
    description:
      'Drywall, doors, pressure washing, gutter cleaning, fence repair, TV mounting — the small-job catalog, done right.',
    icon: 'Hammer' as const,
  },
] as const;

/* --------------------------------------------------------------------- */
/*  Service Areas                                                        */
/*                                                                       */
/*  ONE catalog, several derived views. Every area the site publishes a   */
/*  page for is a row in SERVICE_AREA_CATALOG below, and the exported     */
/*  lists (PRIMARY_/SECONDARY_/EXPANSION_SERVICE_AREAS, ALL_SERVICE_AREAS,*/
/*  LUXURY_CITY_SLUGS) are computed from it. A market's tier is stated    */
/*  once on its row instead of being inferred from which of four          */
/*  overlapping arrays it happened to appear in.                          */
/*                                                                       */
/*  Why the catalog carries `kind` and `parent`: the demand this site     */
/*  serves is not all at one altitude. See                                */
/*  docs/site-altitude-architecture-2026-09-18.md — the name people type   */
/*  after a trade is a town in the Eastern Panhandle, a city in MD and     */
/*  the Shenandoah, and a region or county in Northern Virginia. A model   */
/*  that only knows about cities cannot express that, which is how a       */
/*  county (Loudoun) and a planned community (Brambleton) both ended up    */
/*  in a field called `city`.                                             */
/* --------------------------------------------------------------------- */

/**
 * What kind of place a row names. Drives JSON-LD (`City` vs
 * `AdministrativeArea`), heading phrasing, and which template sections a
 * page renders.
 *
 * `town` and `city` behave identically today and are kept apart because the
 * distinction is real — Vienna is an incorporated town, Reston a
 * census-designated place, Alexandria an independent city — and because
 * consumers key off `isLocalityArea` rather than the literal, so adding a
 * kind later does not mean visiting call sites.
 */
export type AreaKind = 'town' | 'city' | 'county' | 'region';

/**
 * Which buying psychology a market has, and therefore which conversion path
 * its pages use: `premium` routes to /design-consultation (calibrated for
 * $50k+ intake), `home` routes to the free-estimate path. This is the single
 * source for that decision — LUXURY_CITY_SLUGS is now derived from it.
 */
export type AreaMarket = 'home' | 'premium';

/**
 * `active` — the area gets its own pages.
 * `consolidated` — the area's own pages are retired in favour of a broader
 *   page, and `redirectTo` says where they go.
 * `staged` — the row is in the catalog but must not publish. No pages, no
 *   sitemap entry, no nav or internal link. Used for markets that are not
 *   licensed yet (Maryland MHIC, Pennsylvania HICPA). It is not a redirect:
 *   the URL 404s until the row is flipped to `active`.
 *
 * This is AREA-level retirement. Retiring one service+city combo while
 * keeping the area's overview page is a different operation: remove the key
 * from CONTENT in src/lib/service-city-content.ts and add the matching
 * redirect in next.config.ts. Because that route sets `dynamicParams = false`,
 * removing a key without the redirect ships a hard 404, so the two have to
 * land in the same deploy.
 */
export type AreaStatus = 'active' | 'consolidated' | 'staged';

/** Postal abbreviation stored on a catalog row. */
export type AreaState = 'WV' | 'MD' | 'VA' | 'PA';

export type ServiceArea = {
  slug: string;
  /**
   * The place name as it appears in copy.
   *
   * Named `city` for historical reasons: roughly sixty call sites read
   * `.city`, and the name is also load-bearing in the unrelated paving and
   * sales modules. It holds a place name of any `kind`, not necessarily a
   * city. Renaming it to `name` is worthwhile follow-up debt, deliberately
   * not bundled into the tiering change.
   */
  city: string;
  state: AreaState;
  kind: AreaKind;
  market: AreaMarket;
  status: AreaStatus;
  /**
   * The broader area this one sits inside, as a slug in this catalog. Sets
   * the breadcrumb trail and the hub/child link graph.
   *
   * Left unset where no parent row exists. The Fairfax-County towns get one
   * when the Northern Virginia region is added; the WV towns deliberately get
   * none, because `roofing berkeley county wv` and every other Eastern
   * Panhandle regional phrasing returns no measurable search volume, so a
   * county row would only generate pages nobody looks for.
   */
  parent?: string;
  /** Required when `status` is 'consolidated'. Enforced by constants.test.ts. */
  redirectTo?: string;
  /**
   * Which of the legacy exported lists this row belonged to, so those lists
   * can be derived rather than hand-maintained. A compatibility shim: prefer
   * `kind`, `market` and `parent` for new work.
   */
  legacyTiers: readonly ('primary' | 'secondary' | 'expansion')[];
};

/**
 * The catalog. Order is load-bearing: ALL_SERVICE_AREAS preserves it, and it
 * drives generateStaticParams plus the rendered order of several area grids.
 * Home-market WV first, then MD/Shenandoah, then the Northern Virginia
 * premium markets, then the secondary rows.
 */
export const SERVICE_AREA_CATALOG: readonly ServiceArea[] = [
  /* ---------- Eastern Panhandle WV — the home market ---------- */
  { slug: 'martinsburg-wv', city: 'Martinsburg', state: 'WV', kind: 'city', market: 'home', status: 'active', legacyTiers: ['primary'] },
  { slug: 'inwood-wv', city: 'Inwood', state: 'WV', kind: 'town', market: 'home', status: 'active', legacyTiers: ['primary'] },
  { slug: 'charles-town-wv', city: 'Charles Town', state: 'WV', kind: 'city', market: 'home', status: 'active', legacyTiers: ['primary'] },
  { slug: 'ranson-wv', city: 'Ranson', state: 'WV', kind: 'city', market: 'home', status: 'active', legacyTiers: ['primary'] },
  { slug: 'hedgesville-wv', city: 'Hedgesville', state: 'WV', kind: 'town', market: 'home', status: 'active', legacyTiers: ['primary'] },

  /* ---------- MD and the Northern Shenandoah — first-class markets ---------- */
  { slug: 'frederick-md', city: 'Frederick', state: 'MD', kind: 'city', market: 'home', status: 'active', legacyTiers: ['primary', 'expansion'] },
  { slug: 'winchester-va', city: 'Winchester', state: 'VA', kind: 'city', market: 'home', status: 'active', legacyTiers: ['primary', 'expansion'] },

  /* ---------- Loudoun County — premium, and the one NoVA county with a row ---------- */
  { slug: 'leesburg-va', city: 'Leesburg', state: 'VA', kind: 'city', market: 'premium', status: 'active', parent: 'loudoun-county-va', legacyTiers: ['primary', 'expansion'] },
  { slug: 'ashburn-va', city: 'Ashburn', state: 'VA', kind: 'town', market: 'premium', status: 'active', parent: 'loudoun-county-va', legacyTiers: ['primary', 'expansion'] },

  /* ---------- Fairfax County and the inner NoVA suburbs — premium ----------
   * Towns sit under `fairfax-county-va`. Alexandria stays on the region:
   * it is an independent city, and Fairfax County Land Development Services
   * does not issue its building permits.
   *
   * The region row still exists because basement demand here is regional:
   * "basement remodeling northern virginia" reports 110/mo and "basement
   * finishing northern virginia" 90/mo, while every town-level basement term
   * except Alexandria (70) and McLean (30) is below the reporting floor.
   * Kitchen and bathroom pages stay town-level — "kitchen remodeling mclean
   * va" is 260/mo and "vienna va" 140. See
   * docs/site-altitude-architecture-2026-09-18.md §1.5.
   */
  { slug: 'mclean-va', city: 'McLean', state: 'VA', kind: 'town', market: 'premium', status: 'active', parent: 'fairfax-county-va', legacyTiers: ['primary', 'expansion'] },
  { slug: 'alexandria-va', city: 'Alexandria', state: 'VA', kind: 'city', market: 'premium', status: 'active', parent: 'northern-virginia', legacyTiers: ['primary', 'expansion'] },
  { slug: 'vienna-va', city: 'Vienna', state: 'VA', kind: 'town', market: 'premium', status: 'active', parent: 'fairfax-county-va', legacyTiers: ['primary', 'expansion'] },
  { slug: 'great-falls-va', city: 'Great Falls', state: 'VA', kind: 'town', market: 'premium', status: 'active', parent: 'fairfax-county-va', legacyTiers: ['primary', 'expansion'] },
  { slug: 'reston-va', city: 'Reston', state: 'VA', kind: 'town', market: 'premium', status: 'active', parent: 'fairfax-county-va', legacyTiers: ['primary', 'expansion'] },
  { slug: 'burke-va', city: 'Burke', state: 'VA', kind: 'town', market: 'premium', status: 'active', parent: 'fairfax-county-va', legacyTiers: ['primary', 'expansion'] },
  { slug: 'fairfax-station-va', city: 'Fairfax Station', state: 'VA', kind: 'town', market: 'premium', status: 'active', parent: 'fairfax-county-va', legacyTiers: ['primary', 'expansion'] },
  { slug: 'clifton-va', city: 'Clifton', state: 'VA', kind: 'town', market: 'premium', status: 'active', parent: 'fairfax-county-va', legacyTiers: ['primary', 'expansion'] },
  { slug: 'middleburg-va', city: 'Middleburg', state: 'VA', kind: 'town', market: 'premium', status: 'active', parent: 'loudoun-county-va', legacyTiers: ['primary', 'expansion'] },

  /* ---------- Secondary rows ---------- */
  { slug: 'spring-mills-wv', city: 'Spring Mills', state: 'WV', kind: 'town', market: 'home', status: 'active', legacyTiers: ['secondary'] },
  { slug: 'falling-waters-wv', city: 'Falling Waters', state: 'WV', kind: 'town', market: 'home', status: 'active', legacyTiers: ['secondary'] },
  { slug: 'berkeley-springs-wv', city: 'Berkeley Springs', state: 'WV', kind: 'town', market: 'home', status: 'active', legacyTiers: ['secondary'] },
  { slug: 'shepherdstown-wv', city: 'Shepherdstown', state: 'WV', kind: 'town', market: 'home', status: 'active', legacyTiers: ['secondary'] },
  { slug: 'loudoun-county-va', city: 'Loudoun County', state: 'VA', kind: 'county', market: 'premium', status: 'active', parent: 'northern-virginia', legacyTiers: ['secondary', 'expansion'] },
  // Brambleton is a planned community inside Ashburn's orbit rather than a
  // town, but it earns its own row: Search Console shows seven distinct
  // "deck builder / composite decking brambleton va" queries at positions
  // 9-23, all otherwise answered by the Ashburn page. It is the strongest
  // named-place demand signal in Loudoun with no page of its own.
  { slug: 'brambleton-va', city: 'Brambleton', state: 'VA', kind: 'town', market: 'premium', status: 'active', parent: 'loudoun-county-va', legacyTiers: ['secondary'] },

  /* ---------- The region ----------
   * The one row at region altitude, and the reason the catalog has a `kind`
   * at all. It carries no legacy tier: the three compatibility views reproduce
   * the pre-catalog arrays exactly, and this row did not exist then. It is
   * reached through ALL_SERVICE_AREAS, its own hub page, and the parent links
   * on the rows above.
   */
  { slug: 'northern-virginia', city: 'Northern Virginia', state: 'VA', kind: 'region', market: 'premium', status: 'active', legacyTiers: [] },

  /* ---------- Loudoun towns added 2026-09-27 ----------
   * Western corridor (Route 9 from Martinsburg, then Route 7) and the
   * eastern planned communities that did not have their own rows.
   * Empty legacyTiers, same as northern-virginia: these publish pages and
   * appear as Loudoun County children without rewriting the pre-catalog
   * primary/secondary arrays pinned in constants.test.ts.
   *
   * `town` here includes incorporated towns and unincorporated places.
   * Localities stay schema.org Place either way — see areaSchemaType.
   */
  { slug: 'purcellville-va', city: 'Purcellville', state: 'VA', kind: 'town', market: 'premium', status: 'active', parent: 'loudoun-county-va', legacyTiers: [] },
  { slug: 'round-hill-va', city: 'Round Hill', state: 'VA', kind: 'town', market: 'premium', status: 'active', parent: 'loudoun-county-va', legacyTiers: [] },
  { slug: 'lovettsville-va', city: 'Lovettsville', state: 'VA', kind: 'town', market: 'premium', status: 'active', parent: 'loudoun-county-va', legacyTiers: [] },
  { slug: 'waterford-va', city: 'Waterford', state: 'VA', kind: 'town', market: 'premium', status: 'active', parent: 'loudoun-county-va', legacyTiers: [] },
  { slug: 'hamilton-va', city: 'Hamilton', state: 'VA', kind: 'town', market: 'premium', status: 'active', parent: 'loudoun-county-va', legacyTiers: [] },
  { slug: 'aldie-va', city: 'Aldie', state: 'VA', kind: 'town', market: 'premium', status: 'active', parent: 'loudoun-county-va', legacyTiers: [] },
  { slug: 'lansdowne-va', city: 'Lansdowne', state: 'VA', kind: 'town', market: 'premium', status: 'active', parent: 'loudoun-county-va', legacyTiers: [] },
  { slug: 'south-riding-va', city: 'South Riding', state: 'VA', kind: 'town', market: 'premium', status: 'active', parent: 'loudoun-county-va', legacyTiers: [] },
  { slug: 'sterling-va', city: 'Sterling', state: 'VA', kind: 'town', market: 'premium', status: 'active', parent: 'loudoun-county-va', legacyTiers: [] },

  /* ---------- Fairfax County + Prince William County, added 2026-09-27 ----------
   * Empty legacyTiers, same as the Loudoun towns above, so the pre-catalog
   * primary/secondary pins in constants.test.ts stay put.
   *
   * Fairfax towns that already had rows (McLean, Vienna, Great Falls, Reston,
   * Burke, Fairfax Station, Clifton) keep those rows and now parent here.
   * Oakton, Dunn Loring, and Fort Hunt are the wealthy ZIPs that had no row.
   * Alexandria stays a child of Northern Virginia: independent city.
   *
   * Prince William pages are the western ZIPs along I-66 and Route 15.
   * Dumfries still has no row. Lake Ridge and Woodbridge were added later,
   * from the 2026-09-29 research, as two separate CDPs.
   */
  { slug: 'fairfax-county-va', city: 'Fairfax County', state: 'VA', kind: 'county', market: 'premium', status: 'active', parent: 'northern-virginia', legacyTiers: [] },
  { slug: 'prince-william-county-va', city: 'Prince William County', state: 'VA', kind: 'county', market: 'premium', status: 'active', parent: 'northern-virginia', legacyTiers: [] },
  { slug: 'oakton-va', city: 'Oakton', state: 'VA', kind: 'town', market: 'premium', status: 'active', parent: 'fairfax-county-va', legacyTiers: [] },
  { slug: 'dunn-loring-va', city: 'Dunn Loring', state: 'VA', kind: 'town', market: 'premium', status: 'active', parent: 'fairfax-county-va', legacyTiers: [] },
  { slug: 'fort-hunt-va', city: 'Fort Hunt', state: 'VA', kind: 'town', market: 'premium', status: 'active', parent: 'fairfax-county-va', legacyTiers: [] },
  { slug: 'haymarket-va', city: 'Haymarket', state: 'VA', kind: 'town', market: 'premium', status: 'active', parent: 'prince-william-county-va', legacyTiers: [] },
  { slug: 'gainesville-va', city: 'Gainesville', state: 'VA', kind: 'town', market: 'premium', status: 'active', parent: 'prince-william-county-va', legacyTiers: [] },
  { slug: 'bristow-va', city: 'Bristow', state: 'VA', kind: 'town', market: 'premium', status: 'active', parent: 'prince-william-county-va', legacyTiers: [] },
  { slug: 'nokesville-va', city: 'Nokesville', state: 'VA', kind: 'town', market: 'premium', status: 'active', parent: 'prince-william-county-va', legacyTiers: [] },

  /* ---------- Virginia batch, 2026-09-29 ----------
   * Facts are from AI-SHARED/Website/local-pages/. Empty legacyTiers.
   * Occoquan stays deferred. Broad Run publishes in the round-7 block.
   * The West Virginia towns
   * Jose checked are in the block after Pennsylvania.
   * Berryville, The Plains, Upperville, and Marshall publish as of 2026-10-09.
   * Stephens City and Middletown stay staged until their permit process is verified.
   * Fauquier and Clarke towns stay unparented: there is no county row yet.
   */
  { slug: 'springfield-va', city: 'Springfield', state: 'VA', kind: 'town', market: 'premium', status: 'active', parent: 'fairfax-county-va', legacyTiers: [] },
  // Staged: herndon-va.gov returned 403, so the town permit process is unverified.
  // County rules in the note are not a substitute. Flip back to active once the town source is in the note.
  { slug: 'herndon-va', city: 'Herndon', state: 'VA', kind: 'town', market: 'premium', status: 'staged', parent: 'fairfax-county-va', legacyTiers: [] },
  { slug: 'chantilly-va', city: 'Chantilly', state: 'VA', kind: 'town', market: 'premium', status: 'active', parent: 'fairfax-county-va', legacyTiers: [] },
  { slug: 'centreville-va', city: 'Centreville', state: 'VA', kind: 'town', market: 'premium', status: 'active', parent: 'fairfax-county-va', legacyTiers: [] },
  { slug: 'falls-church-va', city: 'Falls Church', state: 'VA', kind: 'city', market: 'premium', status: 'active', parent: 'northern-virginia', legacyTiers: [] },
  // Active 2026-10-10. Jose approved the City of Fairfax. City limits, not ZIPs, decide jurisdiction.
  // ZIPs 22030, 22031 and 22032 each mix city and Fairfax County parcels.
  { slug: 'fairfax-va', city: 'Fairfax', state: 'VA', kind: 'city', market: 'premium', status: 'active', parent: 'northern-virginia', legacyTiers: [] },
  { slug: 'manassas-va', city: 'Manassas', state: 'VA', kind: 'city', market: 'premium', status: 'active', parent: 'northern-virginia', legacyTiers: [] },
  { slug: 'lake-ridge-va', city: 'Lake Ridge', state: 'VA', kind: 'town', market: 'premium', status: 'active', parent: 'prince-william-county-va', legacyTiers: [] },
  { slug: 'woodbridge-va', city: 'Woodbridge', state: 'VA', kind: 'town', market: 'premium', status: 'active', parent: 'prince-william-county-va', legacyTiers: [] },
  { slug: 'warrenton-va', city: 'Warrenton', state: 'VA', kind: 'town', market: 'premium', status: 'active', legacyTiers: [] },
  { slug: 'berryville-va', city: 'Berryville', state: 'VA', kind: 'town', market: 'premium', status: 'active', legacyTiers: [] },
  { slug: 'the-plains-va', city: 'The Plains', state: 'VA', kind: 'town', market: 'premium', status: 'active', legacyTiers: [] },
  { slug: 'upperville-va', city: 'Upperville', state: 'VA', kind: 'town', market: 'premium', status: 'active', legacyTiers: [] },
  { slug: 'marshall-va', city: 'Marshall', state: 'VA', kind: 'town', market: 'premium', status: 'active', legacyTiers: [] },
  // Staged: town site and Frederick County VA building pages were unread.
  { slug: 'stephens-city-va', city: 'Stephens City', state: 'VA', kind: 'town', market: 'home', status: 'staged', legacyTiers: [] },
  // Staged: the town zoning form is not a verified building-permit process.
  { slug: 'middletown-va', city: 'Middletown', state: 'VA', kind: 'town', market: 'home', status: 'staged', legacyTiers: [] },

  /* ---------- Pennsylvania, Franklin County, 2026-09-29 ----------
   * Jose confirmed the PA home-improvement registration is already held, so
   * these rows are active. The public line is PA HIC #PA225060, existing-house
   * home improvement only. Maryland towns are active below, per Jose 2026-10-09.
   * Optional later markets (Shippensburg, Carlisle, Mechanicsburg, Gettysburg)
   * are not in this list. `market: 'home'` keeps the estimate hero. It does
   * not mean the same-week radius promise —
   * areaQuotesSameWeek withholds that for Pennsylvania.
   */
  { slug: 'greencastle-pa', city: 'Greencastle', state: 'PA', kind: 'town', market: 'home', status: 'active', legacyTiers: [] },
  { slug: 'chambersburg-pa', city: 'Chambersburg', state: 'PA', kind: 'town', market: 'home', status: 'active', legacyTiers: [] },
  { slug: 'fort-loudon-pa', city: 'Fort Loudon', state: 'PA', kind: 'town', market: 'home', status: 'active', legacyTiers: [] },
  { slug: 'mercersburg-pa', city: 'Mercersburg', state: 'PA', kind: 'town', market: 'home', status: 'active', legacyTiers: [] },
  { slug: 'waynesboro-pa', city: 'Waynesboro', state: 'PA', kind: 'town', market: 'home', status: 'active', legacyTiers: [] },
  { slug: 'fayetteville-pa', city: 'Fayetteville', state: 'PA', kind: 'town', market: 'home', status: 'active', legacyTiers: [] },

  /* ---------- West Virginia, checked 2026-10-10 (REA-402) ----------
   * Harpers Ferry, Kearneysville, and Bunker Hill only. Gerrardstown,
   * Shenandoah Junction, and Summit Point stay out. Facts are from
   * AI-SHARED/Website/local-pages/. Empty legacyTiers. `market: 'home'`
   * keeps the estimate hero and does not grant the same-week visit sentence.
   */
  { slug: 'harpers-ferry-wv', city: 'Harpers Ferry', state: 'WV', kind: 'town', market: 'home', status: 'active', legacyTiers: [] },
  { slug: 'kearneysville-wv', city: 'Kearneysville', state: 'WV', kind: 'town', market: 'home', status: 'active', legacyTiers: [] },
  { slug: 'bunker-hill-wv', city: 'Bunker Hill', state: 'WV', kind: 'town', market: 'home', status: 'active', legacyTiers: [] },

  /* ---------- Maryland towns — active 2026-10-09 (Jose, REA-2283) ----------
   * Maryland is in the service area. These rows publish. Frederick, MD was
   * already active and is not repeated here. Fulton stays omitted.
   * Clarksville and Glenwood publish in the round-7 block. Potomac, Bethesda, Garrett Park, Cabin John, Chevy Chase,
   * and West Friendship publish in the round-6 block. Empty legacyTiers
   * so the pinned primary/secondary lists do not move. `market: 'home'`
   * keeps the estimate hero and does not grant the same-week radius promise.
   * Do not print a Maryland license caveat.
   */
  { slug: 'monrovia-md', city: 'Monrovia', state: 'MD', kind: 'town', market: 'home', status: 'active', legacyTiers: [] },
  { slug: 'ijamsville-md', city: 'Ijamsville', state: 'MD', kind: 'town', market: 'home', status: 'active', legacyTiers: [] },
  { slug: 'new-market-md', city: 'New Market', state: 'MD', kind: 'town', market: 'home', status: 'active', legacyTiers: [] },
  { slug: 'urbana-md', city: 'Urbana', state: 'MD', kind: 'town', market: 'home', status: 'active', legacyTiers: [] },
  { slug: 'mount-airy-md', city: 'Mount Airy', state: 'MD', kind: 'town', market: 'home', status: 'active', legacyTiers: [] },
  { slug: 'middletown-md', city: 'Middletown', state: 'MD', kind: 'town', market: 'home', status: 'active', legacyTiers: [] },
  { slug: 'adamstown-md', city: 'Adamstown', state: 'MD', kind: 'town', market: 'home', status: 'active', legacyTiers: [] },
  { slug: 'point-of-rocks-md', city: 'Point of Rocks', state: 'MD', kind: 'town', market: 'home', status: 'active', legacyTiers: [] },
  { slug: 'brunswick-md', city: 'Brunswick', state: 'MD', kind: 'town', market: 'home', status: 'active', legacyTiers: [] },
  { slug: 'hagerstown-md', city: 'Hagerstown', state: 'MD', kind: 'city', market: 'home', status: 'active', legacyTiers: [] },
  { slug: 'boonsboro-md', city: 'Boonsboro', state: 'MD', kind: 'town', market: 'home', status: 'active', legacyTiers: [] },
  { slug: 'sharpsburg-md', city: 'Sharpsburg', state: 'MD', kind: 'town', market: 'home', status: 'active', legacyTiers: [] },
  { slug: 'williamsport-md', city: 'Williamsport', state: 'MD', kind: 'town', market: 'home', status: 'active', legacyTiers: [] },

  /* ---------- Round 6 Tier A towns, 2026-10-10 ----------
   * Maryland is in the service area. Empty legacyTiers, so the pinned
   * primary and secondary lists do not move. Premium, same as the round-4
   * close-in towns. No Montgomery or Howard county hub is added: those
   * towns stay unparented and areaRegionLabel names the county. Arlington
   * parents to Northern Virginia. Catharpin parents to Prince William
   * County. Do not print a Maryland license caveat.
   */
  { slug: 'garrett-park-md', city: 'Garrett Park', state: 'MD', kind: 'town', market: 'premium', status: 'active', legacyTiers: [] },
  { slug: 'bethesda-md', city: 'Bethesda', state: 'MD', kind: 'town', market: 'premium', status: 'active', legacyTiers: [] },
  { slug: 'arlington-va', city: 'Arlington', state: 'VA', kind: 'town', market: 'premium', status: 'active', parent: 'northern-virginia', legacyTiers: [] },
  { slug: 'potomac-md', city: 'Potomac', state: 'MD', kind: 'town', market: 'premium', status: 'active', legacyTiers: [] },
  { slug: 'cabin-john-md', city: 'Cabin John', state: 'MD', kind: 'town', market: 'premium', status: 'active', legacyTiers: [] },
  { slug: 'west-friendship-md', city: 'West Friendship', state: 'MD', kind: 'town', market: 'premium', status: 'active', legacyTiers: [] },
  { slug: 'chevy-chase-md', city: 'Chevy Chase', state: 'MD', kind: 'town', market: 'premium', status: 'active', legacyTiers: [] },
  { slug: 'catharpin-va', city: 'Catharpin', state: 'VA', kind: 'town', market: 'premium', status: 'active', parent: 'prince-william-county-va', legacyTiers: [] },

  /* ---------- Round 7 Tier A/B towns, 2026-10-10 ----------
   * Maryland is in the service area. Empty legacyTiers, so the pinned
   * primary and secondary lists do not move. Premium, same as round 6.
   * Howard and Montgomery towns stay unparented. Broad Run parents to
   * Loudoun County. fairfax-va publishes as the City of Fairfax.
   * ZIPs 22030, 22031 and 22032 each include city and county parcels.
   * Do not print a Maryland
   * license caveat. Fulton stays omitted. No Brambleton.
   */
  { slug: 'glenwood-md', city: 'Glenwood', state: 'MD', kind: 'town', market: 'premium', status: 'active', legacyTiers: [] },
  { slug: 'clarksville-md', city: 'Clarksville', state: 'MD', kind: 'town', market: 'premium', status: 'active', legacyTiers: [] },
  { slug: 'brookeville-md', city: 'Brookeville', state: 'MD', kind: 'town', market: 'premium', status: 'active', legacyTiers: [] },
  { slug: 'broad-run-va', city: 'Broad Run', state: 'VA', kind: 'town', market: 'premium', status: 'active', parent: 'loudoun-county-va', legacyTiers: [] },
  { slug: 'kensington-md', city: 'Kensington', state: 'MD', kind: 'town', market: 'premium', status: 'active', legacyTiers: [] },
  { slug: 'woodbine-md', city: 'Woodbine', state: 'MD', kind: 'town', market: 'premium', status: 'active', legacyTiers: [] },
  { slug: 'dickerson-md', city: 'Dickerson', state: 'MD', kind: 'town', market: 'premium', status: 'active', legacyTiers: [] },

  /* ---------- Round 8 richest-county towns, 2026-10-10 ----------
   * Howard, Montgomery, and Fauquier. Empty legacyTiers, so the pinned
   * primary and secondary lists do not move. Premium, same as round 7.
   * Howard and Montgomery towns stay unparented. Delaplane stays
   * unparented because there is no Fauquier county row; areaRegionLabel
   * names Fauquier. Ellicott City is one row for ZIP 21042 and ZIP 21043.
   * Do not print a Maryland license caveat. No Brambleton.
   */
  { slug: 'delaplane-va', city: 'Delaplane', state: 'VA', kind: 'town', market: 'premium', status: 'active', legacyTiers: [] },
  { slug: 'marriottsville-md', city: 'Marriottsville', state: 'MD', kind: 'town', market: 'premium', status: 'active', legacyTiers: [] },
  { slug: 'ellicott-city-md', city: 'Ellicott City', state: 'MD', kind: 'town', market: 'premium', status: 'active', legacyTiers: [] },
  { slug: 'laytonsville-md', city: 'Laytonsville', state: 'MD', kind: 'town', market: 'premium', status: 'active', legacyTiers: [] },
  { slug: 'barnesville-md', city: 'Barnesville', state: 'MD', kind: 'town', market: 'premium', status: 'active', legacyTiers: [] },
  { slug: 'olney-md', city: 'Olney', state: 'MD', kind: 'town', market: 'premium', status: 'active', legacyTiers: [] },
  { slug: 'ashton-md', city: 'Ashton', state: 'MD', kind: 'town', market: 'premium', status: 'active', legacyTiers: [] },
  { slug: 'north-potomac-md', city: 'North Potomac', state: 'MD', kind: 'town', market: 'premium', status: 'active', legacyTiers: [] },
];

/**
 * Keep only the rows that still publish pages.
 *
 * EVERY derived view runs through this, and that is not incidental. The legacy
 * tier views are rendered as links — the service-areas index, the homepage
 * service-area map, the footer, LocalAreasServed — while `ALL_SERVICE_AREAS`
 * decides which pages get generated. If the two disagree about a consolidated
 * or staged row, the site advertises a link to its own 404.
 * `/service-areas/[slug]` sets `dynamicParams = false`, so a slug missing
 * from generateStaticParams is a hard 404 and is not pre-rendered.
 *
 * `staged` is excluded here on purpose. A row waiting on a license is not a
 * page, a sitemap URL, or a link. Flipping it to `active` is what publishes it.
 *
 * Generic over the row type so it can be unit-tested against synthetic rows
 * rather than only against the real catalog, where a missing filter would
 * otherwise stay invisible.
 */
export const activeAreas = <T extends { status: AreaStatus }>(rows: readonly T[]): T[] =>
  rows.filter((row) => row.status === 'active');

const byLegacyTier = (tier: 'primary' | 'secondary' | 'expansion'): ServiceArea[] =>
  activeAreas(SERVICE_AREA_CATALOG.filter((a) => a.legacyTiers.includes(tier)));

/**
 * Derived compatibility views. Each preserves the membership and the order
 * the hand-written array had, so no consumer changed when the catalog landed;
 * `constants.test.ts` pins both. All three are active-only — see `activeAreas`.
 */
export const PRIMARY_SERVICE_AREAS = byLegacyTier('primary');
export const SECONDARY_SERVICE_AREAS = byLegacyTier('secondary');
/** Legacy VA/MD growth-market alias. Entirely a subset of the catalog. */
export const EXPANSION_SERVICE_AREAS = byLegacyTier('expansion');

/**
 * Per-city marketEmphasis encodes the service slugs we lead with on
 * each city page. Order matters — the first service is featured as the
 * hero card, the rest in priority order. From the rebuild plan v2:
 *
 *   Loudoun / Ashburn / Leesburg VA -> luxury decks, outdoor living,
 *     kitchens, bathrooms
 *   Frederick MD -> bathrooms, basements, kitchens, roofing
 *   Winchester VA -> decks, roofing, whole-home remodeling
 *   Eastern Panhandle WV -> all services, home market
 */
export type CityDataEntry = {
  description: string;
  neighborhoods: string[];
  marketEmphasis: string[];
  /** Town-specific questions. Omitted on older rows, which keep the shared FAQ. */
  faqs?: readonly { question: string; answer: string }[];
  /** Other published area pages this town should link. */
  nearbySlugs?: readonly string[];
  /** Exact title when the generic "Contractor in {place}" title is not the query. */
  seoTitle?: string;
  seoDescription?: string;
  seoH1?: string;
};

export const CITY_DATA: Record<string, CityDataEntry> = {
  /* ---------- Eastern Panhandle WV (home market) ---------- */
  'martinsburg-wv': {
    seoTitle: 'General Contractor Martinsburg WV | Real Elite Contracting',
    seoH1: 'General Contractor Martinsburg WV',
    seoDescription:
      'General contractor Martinsburg WV. WV Contractor License WV062432. Kitchens, bathrooms, decks, roofing, and additions. Free written estimate.',
    faqs: [
      {
        question: 'Are you a general contractor in Martinsburg, WV?',
        answer:
          'Yes. Real Elite Contracting is based in Martinsburg. WV Contractor License WV062432. Virginia Class A Contractor 2705198604 covers residential work in Virginia. The written estimate names the scope before any work starts.',
      },
      {
        question: 'Which services do you offer in Martinsburg?',
        answer:
          'Kitchens, bathrooms, decks, roofing, basements, additions, siding, and remodeling.',
      },
    ],
    description:
      "Real Elite Contracting is a general contractor in Martinsburg, WV. WV Contractor License WV062432. Martinsburg is the county seat of Berkeley County and the largest city in the Eastern Panhandle. Located along the I-81 corridor, it serves as the regional hub for commerce, services, and community life. Berkeley County is the fastest-growing county in West Virginia, and Martinsburg sits at the center of that growth — attracting families and professionals drawn by affordable housing, a revitalizing historic downtown, and easy commuter access to the Washington, D.C. metro via MARC train. Homes here range from beautifully preserved Victorian-era properties in the historic district to modern developments in the surrounding suburbs. Real Elite Contracting has deep roots in Martinsburg and is the contractor neighbors trust for quality craftsmanship that protects and enhances their most valuable investment.",
    neighborhoods: ['South Martinsburg', 'North End', 'Pikeside', 'Foxcroft Area', 'Burke Street Historic District'],
    marketEmphasis: ['roofing', 'kitchens', 'bathrooms', 'basements', 'decks', 'additions', 'remodeling', 'siding'],
  },
  'inwood-wv': {
    description:
      "Inwood is an unincorporated community in Berkeley County experiencing a remarkable residential boom. Located near I-81 and just minutes from Martinsburg, Inwood offers a blend of rural charm and convenient access to regional amenities. The Route 51 corridor has become a focal point of new housing development, with subdivisions and single-family homes replacing farmland as the area transitions from a quiet rural crossroads to a thriving suburban community. Real Elite Contracting understands the specific building codes and conditions in this part of Berkeley County and brings that local knowledge to every project.",
    neighborhoods: ['Route 51 Corridor', 'Ridge Road Area', 'Highway 9 Community', 'Inwood Orchards', 'Gerrardstown Road Area'],
    marketEmphasis: ['roofing', 'decks', 'siding', 'remodeling', 'additions', 'bathrooms'],
  },
  'charles-town-wv': {
    description:
      "Charles Town is the county seat of Jefferson County and boasts a rich historical downtown dating back to its founding by Charles Washington, brother of George Washington. Jefferson County has seen significant growth as a commuter destination, with many residents working in Northern Virginia while enjoying the lower cost of living and scenic beauty of the Eastern Panhandle. Many properties in the historic downtown require contractors who understand period-appropriate materials and techniques. Real Elite Contracting is proud to serve this community — helping preserve the character of historic homes while modernizing living spaces.",
    neighborhoods: ['Historic Downtown', 'Ranson Border', 'Jefferson Orchards Area', 'Cavaland', 'Flowing Springs Road Area'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'additions', 'decks', 'remodeling', 'roofing', 'siding'],
  },
  'ranson-wv': {
    description:
      "Ranson is rapidly transforming from a small community into one of the Eastern Panhandle's most dynamic residential destinations, with new developments and growing infrastructure reshaping the landscape. The Flowing Springs and Powhatan Place developments have brought hundreds of new homes to the area, and along Fairfax Boulevard, urban renewal has revitalized commercial spaces. Real Elite Contracting serves the many construction and remodeling needs of Ranson's expanding population — from finishing new construction details to updating established homes.",
    neighborhoods: ['Old Town Ranson', 'Flowing Springs Development', 'Harpers Ferry Road Area', 'Powhatan Place', 'Fairfax Boulevard Corridor'],
    marketEmphasis: ['decks', 'remodeling', 'basements', 'roofing', 'siding', 'additions'],
  },
  'hedgesville-wv': {
    description:
      "Hedgesville is a rural community in Berkeley County known for its family-oriented atmosphere, peaceful surroundings, and one of the most highly regarded school districts in the state. Properties here tend to sit on larger lots — often an acre or more — which means homeowners face unique exterior maintenance challenges. The rolling terrain and wooded parcels also expose homes to more wind, debris, and moisture. Real Elite Contracting understands the specific needs of rural homeowners in the Hedgesville area and delivers dependable, high-quality service.",
    neighborhoods: ['Hedgesville Pike Area', 'Route 9 Community', 'Mill Creek District', 'Shanghai Road Area', 'Back Creek Valley'],
    marketEmphasis: ['roofing', 'siding', 'decks', 'additions', 'exterior-repairs', 'remodeling'],
  },
  'spring-mills-wv': {
    description:
      "Spring Mills is one of the fastest-growing communities in West Virginia. What was once a quiet stretch of Route 11 south of Martinsburg has evolved into a thriving suburban corridor anchored by Spring Mills High School and a wave of residential construction. New subdivisions like Sunridge and Spring Ridge feature modern homes with composite decks, vinyl and fiber cement siding, and architectural shingle roofs. Real Elite Contracting actively serves homeowners in Spring Mills building and improving their dream properties.",
    neighborhoods: ['Sunridge Development', 'Spring Ridge Area', 'Route 11 Corridor', 'Eagle School Road Area', 'Spring Mills High School Community'],
    marketEmphasis: ['decks', 'roofing', 'siding', 'remodeling', 'bathrooms', 'additions'],
  },
  'falling-waters-wv': {
    description:
      "Falling Waters is a scenic rural community nestled along the Potomac River in Berkeley County, offering some of the most picturesque residential settings in the Eastern Panhandle. Properties near the river enjoy stunning views but also come with practical considerations — flood zone designations, higher moisture exposure, and the need for durable exterior materials. Real Elite Contracting understands the specific challenges of building near water and delivers results that are both beautiful and built to last.",
    neighborhoods: ['Potomac Riverside', 'Route 9 Corridor', 'Woods Edge Area', 'River Country Estates', 'Dam Number 5 Road Area'],
    marketEmphasis: ['decks', 'roofing', 'siding', 'exterior-repairs', 'remodeling'],
  },
  'berkeley-springs-wv': {
    description:
      "Berkeley Springs is the county seat of Morgan County, famous for its warm mineral springs and vibrant tourism industry. The charming historic downtown draws visitors year-round, while the surrounding hills are dotted with cabins, vacation rentals, and full-time residences. Seasonal property maintenance is a major consideration here, particularly for vacation homes that must stay in top condition. Real Elite Contracting serves both permanent residents and absentee property owners with craftsmanship that preserves the area's historic character.",
    neighborhoods: ['Historic Downtown', 'Warm Springs Area', 'Market Street District', 'Cacapon Road Corridor', 'Ridge Road Community'],
    marketEmphasis: ['roofing', 'siding', 'exterior-repairs', 'decks', 'remodeling'],
  },
  'shepherdstown-wv': {
    description:
      'Shepherdstown is the oldest town in West Virginia, founded in 1762, and home to Shepherd University. German Street is the historic commercial corridor. Inside the corporation, a project permit comes from the Town at Town Hall, 104 North King Street. Much of the town is in a historic district, and exterior work there needs a Certificate of Appropriateness from the Historic Landmarks Commission before the building permit. A Shepherdstown mailing address is not automatically inside the corporation. Outside town limits, Jefferson County Office of Building Permits and Inspections is at 116 East Washington Street, Suite 100, in Charles Town, phone (304) 725-2998. That office requires a county permit for remodeling, additions, and finished basements. The drive from Martinsburg is Route 45 east. Real Elite remodels kitchens, bathrooms, basements, and roofing on older houses.',
    neighborhoods: ['Historic Downtown', 'German Street', 'University Area', 'Potomac Riverfront', 'Shepherd Grade Road Area'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'remodeling', 'roofing', 'decks'],
    nearbySlugs: ['charles-town-wv', 'martinsburg-wv', 'sharpsburg-md', 'berryville-va', 'harpers-ferry-wv', 'kearneysville-wv'],
    faqs: [
      {
        question: 'Who permits a remodel inside the Town of Shepherdstown?',
        answer:
          'The Town. A project permit is filed at Town Hall, 104 North King Street. Much of the town is in a historic district. Exterior work there needs a Certificate of Appropriateness from the Historic Landmarks Commission before the building permit. The combined application covers a project that is both inside the corporation and inside the historic district.',
      },
      {
        question: 'Does a Shepherdstown mailing address mean the town permit office?',
        answer:
          'No. Outside the corporation, Jefferson County Office of Building Permits and Inspections takes the permit at 116 East Washington Street, Suite 100, in Charles Town. Phone (304) 725-2998. That office requires a county permit for remodeling, additions, and finished basements. Applications are not taken in after 4:30 p.m.',
      },
      {
        question: 'Does the historic certificate apply to every Shepherdstown ZIP?',
        answer:
          'No. The town says much of the town is in the historic district, and the certificate comes before the town building permit for exterior work there. County land outside the corporation is a Jefferson County permit, not the town Historic Landmarks Commission.',
      },
    ],
  },
  'harpers-ferry-wv': {
    description:
      "Harpers Ferry homeowners usually mean ZIP 25425, which reaches well beyond the small historic town itself. Across the ZIP, about 13,332 people live mostly in detached houses built from the 1970s through the 2000s (median year built 1986), so the typical project here is a kitchen, bath, basement, or deck on a house that is now 25 to 50 years old. The first thing we check is the parcel, because a 25425 address can be inside the town or on county land. On unincorporated county land, permits go to the Jefferson County Office of Building Permits and Inspections at 116 East Washington Street, Suite 100, in Charles Town, phone (304) 725-2998. That office covers remodeling, additions, finished basements, and decks. Inside the town limits, the town's own land-use code applies (Article 1701), and designated historic buildings and the historic district fall under the Harpers Ferry Historic Landmarks Commission. The National Park Service site is not the private-permit office for a home project on county land. We confirm which rules apply to your parcel before the estimate.",
    neighborhoods: ['Corporation of Harpers Ferry', 'ZIP 25425', 'Jefferson County'],
    marketEmphasis: ['remodeling', 'bathrooms', 'kitchens', 'decks', 'roofing', 'additions'],
    nearbySlugs: ['charles-town-wv', 'shepherdstown-wv', 'kearneysville-wv', 'ranson-wv'],
    faqs: [
      {
        question: "Does every 25425 address follow the town's historic rules?",
        answer:
          "No. A 25425 address may be inside town limits or on unincorporated county land. The town's land-use rules and the Historic Landmarks Commission apply inside the town limits, so we check the parcel first.",
      },
      {
        question: "Who permits a finished basement or a deck on county land in this ZIP?",
        answer:
          "The Jefferson County Office of Building Permits and Inspections, 116 East Washington Street, Suite 100, Charles Town, (304) 725-2998. The county lists finished basements, additions, and remodeling, and has a separate deck application.",
      },
      {
        question: "Who issues the permit for a home in Harpers Ferry?",
        answer:
          "On unincorporated county land, the Jefferson County Office of Building Permits and Inspections. Inside town limits, the town's land-use code applies, so we confirm the right office for your address with the town before work starts.",
      },
    ],
  },
  'kearneysville-wv': {
    description:
      "Kearneysville is not a town. It is an unincorporated community in Jefferson County, ZIP 25430, so there is no Kearneysville permit counter. Permits go to the Jefferson County Office of Building Permits and Inspections at 116 East Washington Street, Suite 100, in Charles Town, phone (304) 725-2998, open 9:00 a.m. to 5:00 p.m. on weekdays (building permits are taken in until 4:30 p.m.). About 8,954 people live in the ZIP, mostly in detached houses built in the 1970s, 1980s, and 2000s (median year built 1987). That makes Kearneysville a steady market for finished basements, bathroom and kitchen updates, decks, and additions. The county lists finished basements, remodeling, additions, and decks as permitted work, with separate applications for basement and interior renovations and for decks.",
    neighborhoods: ['ZIP 25430', 'Jefferson County'],
    marketEmphasis: ['remodeling', 'bathrooms', 'kitchens', 'decks', 'roofing', 'additions'],
    nearbySlugs: ['charles-town-wv', 'shepherdstown-wv', 'harpers-ferry-wv', 'martinsburg-wv'],
    faqs: [
      {
        question: "Is there a Kearneysville permit office?",
        answer:
          "No. Kearneysville is unincorporated Jefferson County. Permits go to the county Office of Building Permits and Inspections in Charles Town, (304) 725-2998.",
      },
      {
        question: "Does a finished basement need a county permit?",
        answer:
          "Yes. Jefferson County lists finished basements as permitted work and has a basement and interior renovations application.",
      },
      ],
  },
  'bunker-hill-wv': {
    description:
      "Bunker Hill is an unincorporated community in Berkeley County, ZIP 25413. The City of Martinsburg and the Town of Hedgesville are separate municipalities, so we confirm which side of the line a parcel is on. About 9,618 people live here, and the homes are relatively new: median year built 2001, mostly detached houses from the 1990s through the 2010s. Many of those houses are now ready for their first basement finish, bathroom update, or deck. Permits go to the Berkeley County Department of Building Permits and Inspections at 400 West Stephen Street, Suite 202, Martinsburg, WV 25401, phone (304) 264-1966, open 8 a.m. to 5 p.m. on weekdays. The county requires a permit to build, enlarge, alter, or repair a building, and that includes decks. Applications run through the county One Stop portal at onestop.berkeleywv.org.",
    neighborhoods: ['ZIP 25413', 'Berkeley County'],
    marketEmphasis: ['remodeling', 'bathrooms', 'kitchens', 'decks', 'roofing', 'additions'],
    nearbySlugs: ['martinsburg-wv', 'inwood-wv', 'hedgesville-wv', 'charles-town-wv'],
    faqs: [
      {
        question: "Where do Bunker Hill permits come from?",
        answer:
          "Berkeley County Department of Building Permits and Inspections, 400 West Stephen Street, Suite 202, Martinsburg, (304) 264-1966. The online portal is onestop.berkeleywv.org.",
      },
      {
        question: "Does a deck need a Berkeley County permit?",
        answer:
          "Yes. The county's permit requirement includes decks. A residential application includes plans, a plot plan, and the contractor's license number.",
      },
      {
        question: "Is Bunker Hill inside the City of Martinsburg?",
        answer:
          "Bunker Hill is unincorporated Berkeley County. The City of Martinsburg and the Town of Hedgesville are separate municipalities, so we confirm your parcel before any permit is filed.",
      },
    ],
  },

  /* ---------- Frederick County MD ---------- */
  'frederick-md': {
    description:
      "Frederick is the county seat and largest city in Frederick County, Maryland — a rapidly growing community of over 75,000 residents that has transformed from a historic market town into one of the Mid-Atlantic's most desirable places to live. The revitalization of Carroll Creek and the Market Street corridor has breathed new life into Frederick's historic downtown, while the I-70 growth corridor continues to attract new developments in Urbana, Jefferson, and New Market. Real Elite Contracting serves Frederick homeowners who want professional-grade results on bathrooms, kitchens, basements, and roofing — the projects that drive the most value in this market.",
    neighborhoods: ['Historic Downtown Frederick', 'Ballenger Creek', 'Urbana', 'Jefferson', 'New Market', 'Buckeystown'],
    marketEmphasis: ['bathrooms', 'basements', 'kitchens', 'roofing', 'remodeling', 'additions'],
  },
  'monrovia-md': {
    description:
      'Monrovia is an unincorporated place in eastern Frederick County, on MD 75 between the I-70 interchange and New Market. It is not a town, and it does not have a municipal permit office. Building permits go through Frederick County Department of Permits and Inspections at 30 North Market Street in Frederick. The houses are a mix of newer subdivisions off MD 75 and older lots closer to the pike. The drive from Martinsburg is I-81 south to I-70 east, then MD 75. Downtown Frederick is a short hop west on I-70. Real Elite remodels kitchens, bathrooms, basements, and roofing.',
    neighborhoods: ['MD 75 corridor', 'I-70 interchange', 'Green Valley Road', 'East of New Market'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'roofing'],
    nearbySlugs: ['frederick-md', 'new-market-md', 'ijamsville-md', 'charles-town-wv'],
    faqs: [
      {
        question: 'Who issues a building permit in Monrovia?',
        answer:
          'Frederick County Department of Permits and Inspections. Monrovia is not an incorporated town, so there is no municipal zoning step before the county application.',
      },
      {
        question: 'How do you reach Monrovia from Martinsburg?',
        answer:
          'I-81 south to I-70 east, then MD 75. Frederick is the next stop west on I-70.',
      },
    ],
  },
  'ijamsville-md': {
    description:
      'Ijamsville is an unincorporated community in Frederick County along MD 80, between Frederick and the Urbana and New Market growth corridor. It is not a municipality. Building permits go through Frederick County Department of Permits and Inspections, not a town hall. Houses sit on older rural lots and on newer subdivisions off MD 80 and MD 75. The drive from Martinsburg is I-81 south to I-70 east, then south on MD 75 or MD 80. Frederick is west. Urbana is south, toward I-270. Real Elite remodels bathrooms, kitchens, basements, and additions.',
    neighborhoods: ['MD 80 corridor', 'MD 75 south of I-70', 'West of Urbana', 'East of Ballenger Creek'],
    marketEmphasis: ['bathrooms', 'kitchens', 'basements', 'additions'],
    nearbySlugs: ['frederick-md', 'urbana-md', 'monrovia-md', 'martinsburg-wv'],
    faqs: [
      {
        question: 'Is Ijamsville inside the City of Frederick?',
        answer:
          'No. Ijamsville is unincorporated Frederick County. A Frederick mailing address does not put the parcel in the city permit office.',
      },
      {
        question: 'Which road is Ijamsville on?',
        answer:
          'MD 80, between Frederick and the Urbana and New Market corridor, with MD 75 as the north-south connector to I-70.',
      },
    ],
  },
  'new-market-md': {
    description:
      'New Market is an incorporated town in eastern Frederick County, on the Old National Pike just south of I-70. Main Street is the historic pike, not a county subdivision road. Zoning for work inside town limits is a municipal step before the Frederick County building permit. The county says a zoning certificate for a property in a municipality is applied for before the building-permit application at the Department of Permits and Inspections. The City of Frederick and Mount Airy are the municipalities that issue their own building permits. New Market is not on that list. The drive from Martinsburg is I-81 south to I-70 east. Frederick is a short drive west on I-70. Real Elite remodels kitchens, bathrooms, roofing, and additions on the older pike houses and the newer lots around town.',
    neighborhoods: ['Old National Pike', 'Main Street', 'I-70 east of Frederick', 'Town limits'],
    marketEmphasis: ['kitchens', 'bathrooms', 'roofing', 'additions'],
    nearbySlugs: ['frederick-md', 'monrovia-md', 'mount-airy-md', 'martinsburg-wv'],
    faqs: [
      {
        question: 'Does New Market issue its own building permit?',
        answer:
          'No. The City of Frederick and Mount Airy issue their own. Inside New Market town limits, town zoning comes before the Frederick County building permit.',
      },
      {
        question: 'Where is New Market relative to Frederick?',
        answer:
          'East of Frederick on I-70 and the Old National Pike. Monrovia is the unincorporated area on MD 75 just west of town.',
      },
    ],
  },
  'urbana-md': {
    description:
      'Urbana is an unincorporated planned community in southern Frederick County, along I-270 and MD 355 south of the city. It is not a town. A Frederick mailing address does not make a parcel part of the City of Frederick, and it does not send the permit to the city office. Building permits go through Frederick County Department of Permits and Inspections. Villages of Urbana and the subdivisions along MD 355 commonly have an HOA architectural review in addition to the county permit. A county permit is not HOA approval. The drive from Martinsburg is I-81 south to I-70 east, then I-270 south. Downtown Frederick is north on I-270. Real Elite remodels bathrooms, kitchens, basements, and decks in the villages along MD 355.',
    neighborhoods: ['Villages of Urbana', 'MD 355', 'I-270 south of Frederick', 'Worthington Boulevard'],
    marketEmphasis: ['bathrooms', 'kitchens', 'basements', 'decks'],
    nearbySlugs: ['frederick-md', 'ijamsville-md', 'adamstown-md', 'charles-town-wv'],
    faqs: [
      {
        question: 'Who permits a remodel in Urbana?',
        answer:
          'Frederick County, because Urbana is unincorporated. An HOA architectural review, where the village has one, is separate from that county permit.',
      },
      {
        question: 'How far is Urbana from downtown Frederick?',
        answer:
          'South on I-270 and MD 355, a short drive. It is not the same jurisdiction as the City of Frederick.',
      },
    ],
  },
  'mount-airy-md': {
    description:
      'Mount Airy is an incorporated town on the Frederick and Carroll county line, at I-70 and MD 27. Town limits include parcels in both counties. Except for signs, fences, driveways, banners, and zoning certificates, building-permit review for work inside town limits — including the Frederick County side — goes through the Carroll County Bureau of Permits and Inspections in Westminster, after a town zoning review. That is not the Frederick County counter at 30 North Market Street, and it is not the City of Frederick’s office. The drive from Martinsburg is I-81 south to I-70 east. Frederick is west on I-70. New Market is the last Frederick County town before the line. Real Elite remodels kitchens, bathrooms, additions, and roofing.',
    neighborhoods: ['I-70 and MD 27', 'Main Street', 'Frederick County side of town', 'Carroll County side of town'],
    marketEmphasis: ['kitchens', 'bathrooms', 'additions', 'roofing'],
    nearbySlugs: ['frederick-md', 'new-market-md', 'martinsburg-wv'],
    faqs: [
      {
        question: 'Does Frederick County issue Mount Airy building permits?',
        answer:
          'Not for work inside town limits. Mount Airy routes those permits, including parcels on the Frederick County side of the line, through the Carroll County Bureau of Permits and Inspections after town zoning review. Signs, fences, driveways, banners, and zoning certificates stay with the town.',
      },
      {
        question: 'Which county is Mount Airy in?',
        answer:
          'Both. The town straddles the Frederick and Carroll line at I-70 and MD 27.',
      },
    ],
  },
  'middletown-md': {
    description:
      'Middletown, Maryland is an incorporated town in western Frederick County, on US 40 Alternate in the valley between Catoctin Mountain and South Mountain. This is not Middletown, Virginia. The municipal center is on West Main Street. Zoning inside town limits is a town step before the Frederick County building permit. The county’s municipality list names Middletown separately from the City of Frederick, which issues its own building permits. The drive from Martinsburg is I-81 south to I-70 east, then US 40 Alternate west from Frederick. Boonsboro is the next town west, over South Mountain on the same pike, in Washington County. Real Elite remodels kitchens, bathrooms, roofing, and additions on the older Main Street houses and the lots along the valley.',
    neighborhoods: ['West Main Street', 'US 40 Alternate', 'Valley between the mountains', 'East of South Mountain'],
    marketEmphasis: ['kitchens', 'bathrooms', 'roofing', 'additions'],
    nearbySlugs: ['frederick-md', 'boonsboro-md', 'shepherdstown-wv'],
    faqs: [
      {
        question: 'Is this Middletown, Virginia?',
        answer:
          'No. Middletown, Maryland is on US 40 Alternate in Frederick County. Middletown, Virginia is a different town.',
      },
      {
        question: 'Who permits work inside Middletown, Maryland?',
        answer:
          'Town zoning first, then the Frederick County building permit. The City of Frederick’s permit office does not cover Middletown.',
      },
    ],
  },
  'adamstown-md': {
    description:
      'Adamstown is an unincorporated community in southern Frederick County, along MD 85 south of Ballenger Creek and Buckeystown. It is not a town. Building permits go through Frederick County Department of Permits and Inspections. The MARC Brunswick Line stops here, and the houses are older village lots plus newer subdivisions off MD 85. Point of Rocks and Brunswick are farther south along the Potomac. The drive from Martinsburg is I-81 south to I-70 east into Frederick, then MD 85 south. Real Elite remodels bathrooms, kitchens, basements, and roofing.',
    neighborhoods: ['MD 85', 'MARC Brunswick Line stop', 'South of Buckeystown', 'Ballenger Creek to the Potomac'],
    marketEmphasis: ['bathrooms', 'kitchens', 'basements', 'roofing'],
    nearbySlugs: ['frederick-md', 'point-of-rocks-md', 'brunswick-md', 'charles-town-wv'],
    faqs: [
      {
        question: 'Is Adamstown an incorporated town?',
        answer:
          'No. It is unincorporated Frederick County. Permits go to the county office in Frederick, not to a town hall.',
      },
      {
        question: 'What is the drive from Frederick to Adamstown?',
        answer:
          'MD 85 south, past Ballenger Creek and Buckeystown. Point of Rocks and Brunswick are the next communities toward the river.',
      },
    ],
  },
  'point-of-rocks-md': {
    description:
      'Point of Rocks is an unincorporated community in southern Frederick County where US 15 meets the Potomac. The railroad bridge and the MARC station sit at the river. It is not a municipality. Building permits go through Frederick County Department of Permits and Inspections. The US 15 bridge crosses into Loudoun County, Virginia. The Maryland side of the village is still Frederick County. Brunswick is the next incorporated city east along the river. Charles Town, West Virginia is nearby across the Potomac via US 340. The drive from Martinsburg is Route 9 to Charles Town, then US 340 east, or I-81 south to I-70 east and down US 15. Real Elite remodels kitchens, bathrooms, roofing, and additions on the older river-village houses.',
    neighborhoods: ['US 15 at the Potomac', 'MARC station', 'Point of Rocks bridge', 'River village'],
    marketEmphasis: ['kitchens', 'bathrooms', 'roofing', 'additions'],
    nearbySlugs: ['frederick-md', 'brunswick-md', 'charles-town-wv'],
    faqs: [
      {
        question: 'Is the Virginia side of the Point of Rocks bridge in Frederick County?',
        answer:
          'No. The bridge crosses into Loudoun County, Virginia. The Maryland village is in Frederick County, and Frederick County is the permit office.',
      },
      {
        question: 'Which West Virginia town is closest?',
        answer:
          'Charles Town, via US 340. Brunswick is the next Maryland city along the river.',
      },
    ],
  },
  'brunswick-md': {
    description:
      'Brunswick is an incorporated city in southern Frederick County, on the Potomac along US 340, with a MARC station on the Brunswick Line. It is not unincorporated county. The city’s planning office takes the municipal application. The county’s municipality sheet lists Brunswick separately from the City of Frederick, which issues its own building permits. Zoning inside the city is a municipal step before the Frederick County building permit. Charles Town, West Virginia is the next city west on US 340. Point of Rocks is east along the river. The drive from Martinsburg is Route 9 to Charles Town, then US 340 east. Real Elite remodels kitchens, bathrooms, roofing, and additions.',
    neighborhoods: ['US 340', 'MARC Brunswick station', 'Potomac riverfront', 'Downtown Brunswick'],
    marketEmphasis: ['kitchens', 'bathrooms', 'roofing', 'additions'],
    nearbySlugs: ['frederick-md', 'point-of-rocks-md', 'charles-town-wv', 'shepherdstown-wv'],
    faqs: [
      {
        question: 'Does the City of Frederick permit Brunswick?',
        answer:
          'No. Brunswick has its own planning office for the municipal application. The building permit after that zoning step is Frederick County, not the City of Frederick.',
      },
      {
        question: 'How do you reach Brunswick from Martinsburg?',
        answer:
          'Route 9 to Charles Town, then US 340 east along the Potomac. That is a different drive from the I-70 route into Frederick.',
      },
    ],
  },
  'hagerstown-md': {
    description:
      'Hagerstown is the county seat of Washington County and the largest city in Maryland’s Cumberland Valley, at the crossing of I-81 and I-70. The city issues its own building permits. That is a different office from Washington County’s Division of Permits and Inspections, which covers the county outside the city, and a different sequence from Boonsboro, Funkstown, and Williamsport, where the town zones and the county reviews the building code. A Hagerstown mailing address is not always inside the city. Williamsport is south on US 11. Boonsboro is east on US 40 Alternate. Falling Waters and Martinsburg, West Virginia are south and southwest on I-81. The drive from Martinsburg is I-81 south, about half an hour. Real Elite remodels kitchens, bathrooms, basements, roofing, and additions.',
    neighborhoods: ['Downtown Hagerstown', 'I-81 and I-70', 'US 11 south toward Williamsport', 'East end toward US 40 Alternate'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'roofing', 'additions'],
    nearbySlugs: ['frederick-md', 'williamsport-md', 'boonsboro-md', 'falling-waters-wv', 'martinsburg-wv'],
    faqs: [
      {
        question: 'Does Washington County permit work inside the City of Hagerstown?',
        answer:
          'No. The city issues its own building permits. The county office at 80 West Baltimore Street covers the county outside the city, including the sequence used in Boonsboro and Williamsport.',
      },
      {
        question: 'How do you reach Hagerstown from Martinsburg?',
        answer:
          'I-81 south. Williamsport is the next town south on US 11. Frederick is east on I-70, a separate drive.',
      },
    ],
  },
  'boonsboro-md': {
    description:
      'Boonsboro is an incorporated town in Washington County, at the west foot of South Mountain on US 40 Alternate, the old National Pike. It is not in Frederick County. Washington County’s permit arrangement for Boonsboro, Funkstown, and Williamsport is town zoning first, then building-code review by the county Division of Permits and Inspections at 80 West Baltimore Street in Hagerstown, then issuance by the town. The City of Hagerstown runs its own permit office and is a different process. Middletown is the next town east, over the mountain, in Frederick County. Shepherdstown, West Virginia is south toward the Potomac. The drive from Martinsburg is I-81 south to I-70 east, then south toward US 40 Alternate. Real Elite remodels kitchens, bathrooms, roofing, and decks.',
    neighborhoods: ['US 40 Alternate', 'Main Street', 'West foot of South Mountain', 'South toward MD 67'],
    marketEmphasis: ['kitchens', 'bathrooms', 'roofing', 'decks'],
    nearbySlugs: ['frederick-md', 'middletown-md', 'hagerstown-md', 'shepherdstown-wv'],
    faqs: [
      {
        question: 'Who issues a Boonsboro building permit?',
        answer:
          'The town, after town zoning and a building-code review by Washington County at 80 West Baltimore Street in Hagerstown. That is not the City of Hagerstown’s permit office, and it is not Frederick County.',
      },
      {
        question: 'What is on the other side of South Mountain?',
        answer:
          'Middletown, Maryland, on the same US 40 Alternate pike, in Frederick County.',
      },
    ],
  },
  'sharpsburg-md': {
    description:
      'Sharpsburg is an incorporated town in southern Washington County, on the high ground above the Potomac, beside Antietam National Battlefield. MD 34 is Main Street. MD 65 is the road north toward the battlefield and Hagerstown. Sharpsburg is not one of the three towns — Boonsboro, Funkstown, and Williamsport — whose permit sequence the county describes as town zoning, county code review, and town issuance. Confirm town zoning with Sharpsburg before assuming a county-only permit. The county permit office is in Hagerstown. Shepherdstown, West Virginia is a short drive west on MD 34 across the river. Boonsboro is north. The drive from Martinsburg is I-81 south toward MD 65, or Route 9 to Shepherdstown and east on MD 34. Real Elite remodels kitchens, bathrooms, roofing, and additions on the older village houses.',
    neighborhoods: ['MD 34 Main Street', 'MD 65', 'Antietam battlefield edge', 'Potomac side of town'],
    marketEmphasis: ['kitchens', 'bathrooms', 'roofing', 'additions'],
    nearbySlugs: ['frederick-md', 'boonsboro-md', 'shepherdstown-wv'],
    faqs: [
      {
        question: 'Is Sharpsburg on the same permit path as Boonsboro?',
        answer:
          'No. The county’s published town-then-county sequence names Boonsboro, Funkstown, and Williamsport. Sharpsburg is a separate incorporated town. Confirm town zoning before treating it as a county-only permit.',
      },
      {
        question: 'Which West Virginia town is next to Sharpsburg?',
        answer:
          'Shepherdstown, west on MD 34 across the Potomac. That is a shorter hop than the drive back to Martinsburg.',
      },
    ],
  },
  'williamsport-md': {
    description:
      'Williamsport is an incorporated town in Washington County, where the Conococheague Creek meets the Potomac and the C&O Canal, just south of Hagerstown on US 11 and I-81. Like Boonsboro and Funkstown, the county’s published sequence is town zoning approval, then building-code review at the county annex in Hagerstown, then issuance by the town. The City of Hagerstown issues its own permits and is not this process. Falling Waters, West Virginia is the next community south on I-81, across the state line. The drive from Martinsburg is I-81 south, past Falling Waters. Real Elite remodels kitchens, bathrooms, basements, and roofing.',
    neighborhoods: ['US 11', 'I-81 south of Hagerstown', 'Conococheague Creek', 'C&O Canal'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'roofing'],
    nearbySlugs: ['frederick-md', 'hagerstown-md', 'falling-waters-wv'],
    faqs: [
      {
        question: 'Does the City of Hagerstown permit Williamsport?',
        answer:
          'No. Williamsport follows the town-zoning, county-code-review, town-issuance sequence. The city permit office covers the City of Hagerstown only.',
      },
      {
        question: 'What is the first West Virginia town south of Williamsport?',
        answer:
          'Falling Waters, on I-81 across the state line. Martinsburg is farther south on the same interstate.',
      },
    ],
  },

  /* ---------- Northern Shenandoah Valley + Loudoun County VA ---------- */
  'winchester-va': {
    description:
      "Winchester is the historic gateway to Virginia's Shenandoah Valley — a city that blends a vibrant, walkable Old Town with rapidly growing residential neighborhoods along Route 7, Route 522, and the Senseny Road corridor. As the largest city in the Northern Shenandoah Valley, Winchester draws families and professionals who appreciate its small-city character, proximity to the mountains, and access to both Northern Virginia jobs and a lower cost of living. Real Elite Contracting is proud to serve Winchester homeowners with the high-quality craftsmanship we deliver throughout the region.",
    neighborhoods: ['Old Town Winchester', 'Shawnee District', 'Senseny Road Corridor', 'Millwood Avenue Area', 'Route 7 Corridor'],
    marketEmphasis: ['decks', 'kitchens', 'roofing', 'remodeling', 'siding', 'bathrooms', 'additions'],
  },
  'leesburg-va': {
    description:
      "Leesburg is Loudoun County's seat and an incorporated town. Town limits cover Old Town and the streets around it. A Leesburg mailing address is not Town zoning: Lansdowne and River Creek sit in unincorporated county. Exterior work in the Old and Historic District goes through the Town Board of Architectural Review. Inside town limits, town zoning is approved before Loudoun County issues the building permit. The drive from Martinsburg is Route 9, which meets Route 7 in Leesburg. Real Elite remodels kitchens, primary suites, finished lower levels, additions, and outdoor living.",
    neighborhoods: ['Historic Old Town Leesburg', 'West of Route 15', 'Lansdowne on the Potomac', 'River Creek'],
    marketEmphasis: ['basements', 'kitchens', 'bathrooms', 'decks', 'additions', 'remodeling'],
  },
  'ashburn-va': {
    description:
      'Ashburn is unincorporated Loudoun County. Building and zoning run through LandMARC, and nearly every master-planned community also requires HOA architectural review. A county permit is not HOA approval. Most of the housing is 1990s through 2010s production and custom homes on public water and sewer, with unfinished basements and builder-grade kitchens and primary baths. Brambleton, Broadlands, Ashburn Farm, One Loudoun, Loudoun Valley Estates, and Belmont Greene are the communities we serve in Ashburn. The drive from Martinsburg is Route 9 to Leesburg, then Route 7 east. Real Elite remodels basements, kitchens, primary suites, outdoor living, and additions.',
    neighborhoods: ['Brambleton', 'Broadlands', 'Ashburn Farm', 'One Loudoun', 'Loudoun Valley Estates', 'Belmont Greene'],
    marketEmphasis: ['basements', 'kitchens', 'bathrooms', 'decks', 'additions', 'remodeling'],
  },
  'brambleton-va': {
    description:
      "Brambleton is one of Loudoun County's largest planned communities, a walkable collection of villages built around Brambleton Town Center with the Dulles Greenway and the Silver Line's Ashburn station a short drive away. Homes here are newer, closely spaced, and held to an active architectural review process, which makes the back yard the one place a family can genuinely make their own. That is why outdoor living is the dominant project type in Brambleton: composite decks, covered porches, and multi-zone entertaining space rather than wholesale exterior changes. Real Elite Contracting builds those spaces to Loudoun County code and carries the HOA design submission from drawing to approval.",
    neighborhoods: ['Brambleton Town Center', 'Birchwood at Brambleton', 'West Park at Brambleton', 'Summerfield at Brambleton'],
    marketEmphasis: ['decks', 'bathrooms', 'kitchens', 'remodeling', 'basements', 'siding'],
  },
  /**
   * The region row's page data. Its `neighborhoods` are the counties and the
   * independent city the site actually serves, not subdivisions — for a region
   * that is the useful granularity, and every name here is real and is a place
   * the business already publishes pages for.
   *
   * No operational claims in this copy. The seven promises registered in
   * src/lib/claims.ts are unconfirmed, and this is the page a Fairfax County
   * homeowner reads before a six-figure decision.
   */
  'northern-virginia': {
    description:
      "Northern Virginia is the largest remodeling market Real Elite Contracting serves, and the one where the work is most often a lower level. Fairfax and Loudoun counties and the city of Alexandria hold a housing stock built largely between the 1960s and the 2000s, much of it on full-height unfinished basements. Prince William's western communities — Haymarket, Gainesville, and Bristow — are newer planned neighborhoods along I-66 and Route 15. Homeowners search for a Northern Virginia or county contractor first and narrow down afterwards. Family-run by brothers Jose and Miguel. Miguel is a U.S. military veteran and Purple Heart recipient. Real Elite Contracting is licensed in West Virginia and Virginia, and works this market from its Eastern Panhandle base. The drive from Martinsburg is Route 9 to Leesburg, then Route 7, Route 15, or Route 28 onto I-66.",
    neighborhoods: [
      'Fairfax County',
      'Loudoun County',
      'Prince William County',
      'Alexandria',
      'McLean',
      'Great Falls',
    ],
    marketEmphasis: ['basements', 'kitchens', 'bathrooms', 'remodeling', 'additions', 'decks'],
  },
  'loudoun-county-va': {
    description:
      'Loudoun County is two remodeling markets. Eastern communities such as Ashburn, Lansdowne, South Riding, and Sterling are mostly 1990s–2010s houses on public water and sewer. Exterior work there also needs HOA architectural review, and many basements were left unfinished. Western and southern places — Purcellville, Round Hill, Hamilton, Lovettsville, Waterford, and Aldie — are older village houses or custom homes on acreage, often on well and septic. A bedroom addition on a well-and-septic lot needs Loudoun Health Department approval before the building permit. Waterford and Aldie sit in county historic districts, so exterior changes need a Certificate of Appropriateness from the Historic District Review Committee. Incorporated towns, including Leesburg, Purcellville, Hamilton, Round Hill, Lovettsville, and Middleburg, approve their own zoning before the county issues the building permit. County deck review still has a published fast path (Typical Deck Detail, $265) and a full-plan path at $395 when a roof or screen is added; the county treats a screened porch as an addition. The drive from Martinsburg is Route 9 to Leesburg, then Route 7. Real Elite remodels basements, kitchens, primary suites, outdoor living, and additions.',
    neighborhoods: ['Purcellville', 'Round Hill', 'Waterford', 'Aldie', 'Lansdowne', 'South Riding', 'Sterling', 'Hamilton', 'Lovettsville', 'Leesburg', 'Ashburn'],
    marketEmphasis: ['basements', 'kitchens', 'bathrooms', 'decks', 'additions', 'remodeling'],
  },

  /* ---------- Fairfax County, VA ---------- */
  'fairfax-county-va': {
    description:
      "Fairfax County building permits go through Land Development Services, including inside the towns of Vienna and Clifton. Vienna reviews its own zoning and site plans; the county is the building official. Inside Clifton, a project needs a town use permit, a certificate of appropriateness from the Clifton Architectural Review Board, and the mayor's signature before Land Development Services will accept the building permit. Outside those towns, county zoning and the building permit are both Fairfax County's. Planned communities such as Reston and Burke Centre also require their own architectural review. A county permit is not HOA approval. Where a lot is on a private well or septic system, a bedroom addition also needs Fairfax County Health Department approval before the building permit. The housing runs from McLean and Great Falls estates to Vienna and Oakton colonials, Dunn Loring near the Metro, Fort Hunt along the parkway, and larger-lot houses in Fairfax Station and Clifton. The drive from Martinsburg is Route 9 to Leesburg, then Route 7, or Route 7 to Route 28 and I-66. ZIP codes served: 22101 and 22102 McLean, 22066 Great Falls, 22180, 22181, and 22182 Vienna, 22124 Oakton, 22027 Dunn Loring, 22039 Fairfax Station, 20124 Clifton, 22308 Fort Hunt, 20190, 20191, and 20194 Reston, and 22015 Burke.",
    neighborhoods: [
      '22101 McLean',
      '22066 Great Falls',
      '22039 Fairfax Station',
      '22027 Dunn Loring',
      '22124 Oakton',
      '20124 Clifton',
      '22181 Vienna',
      '22182 Vienna',
      '22308 Fort Hunt',
      '22015 Burke',
    ],
    marketEmphasis: ['basements', 'kitchens', 'bathrooms', 'decks', 'additions', 'remodeling'],
  },
  'mclean-va': {
    description:
      'McLean is unincorporated Fairfax County. ZIP 22101 covers the estate streets along Georgetown Pike, Old Dominion Drive, and Chain Bridge Road: large lots and one-off custom houses. ZIP 22102 is closer to Tysons and Route 123, with more attached housing around the commercial core. Building permits go through Fairfax County Land Development Services. Some neighborhoods require HOA architectural review, and many estate streets do not. A county permit is not HOA approval. The drive from Martinsburg is Route 9 to Leesburg, then Route 7 east, or Route 7 to Route 28 and I-66 to the Beltway. Real Elite remodels kitchens, primary suites, finished lower levels, and additions.',
    neighborhoods: ['Georgetown Pike', 'Old Dominion Drive', 'Chain Bridge Road', 'Langley', 'Chesterbrook', 'ZIP 22102'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'remodeling', 'additions'],
  },
  'alexandria-va': {
    description:
      "Alexandria is an independent city, not Fairfax County. Building permits are issued by the city's Code Administration. Exterior work in the Old and Historic Alexandria District or the Parker-Gray District, and on buildings the council has designated as 100-year-old, needs a Certificate of Appropriateness from the Board of Architectural Review when the change is visible from a public way. Interior kitchens and baths do not need that review unless the work changes the outside. Demolition of more than 25 square feet of material needs a Permit to Demolish regardless of visibility. Belle Haven, Rosemont, and North Ridge are later neighborhoods inside the city. Fort Hunt, ZIP 22308, uses an Alexandria mailing address and is mostly Fairfax County. The drive from Martinsburg is Route 9 to Leesburg, then Route 7 east to I-495. Real Elite remodels kitchens, primary suites, careful additions, and finished lower levels.",
    neighborhoods: ['Old Town', 'Parker-Gray', 'Belle Haven', 'Rosemont', 'North Ridge', 'Del Ray'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'remodeling', 'additions'],
  },
  'vienna-va': {
    description:
      'Vienna is an incorporated town in Fairfax County. A Vienna mailing address is not always inside town limits: Oakton and Dunn Loring are separate communities. Inside town, Fairfax County Land Development Services is the building official. The town reviews zoning and site plans, including grading, against the town code. ZIPs 22180, 22181, and 22182 cover the town and its edges: mid-century houses on tree-lined streets, later colonials, and newer infill along Maple Avenue and Hunter Mill Road. The drive from Martinsburg is Route 9 to Leesburg, then Route 7 to I-66 or Route 123. Real Elite remodels kitchens, primary suites, finished lower levels, and additions.',
    neighborhoods: ['Maple Avenue', 'Hunter Mill Road', 'ZIP 22180', 'ZIP 22181', 'ZIP 22182', 'Town limits'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'remodeling', 'additions'],
  },
  'great-falls-va': {
    description:
      'Great Falls is an unincorporated community in northern Fairfax County, ZIP 22066. The housing is large-lot custom houses along Georgetown Pike, Riverbend Road, and Seneca Road. It is not one master-planned community. Building permits go through Fairfax County Land Development Services. Where a lot is on a private well or septic system, a bedroom addition also needs Fairfax County Health Department approval before the building permit. The drive from Martinsburg is Route 9 to Leesburg, then Route 7 east toward Georgetown Pike. Real Elite remodels kitchens, primary suites, additions, and outdoor living.',
    neighborhoods: ['Georgetown Pike', 'Riverbend Road', 'Seneca Road', 'ZIP 22066', 'Walker Road', 'Springvale Road'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'remodeling', 'additions'],
  },
  'reston-va': {
    description:
      'Reston is an unincorporated planned community in Fairfax County. Building permits go through Land Development Services. Exterior changes also go through Reston Association design review. A county permit is not that approval. The original villages and the houses around Lake Anne and Lake Audubon are mostly 1960s through 1980s, on public water and sewer, with later housing toward Reston Town Center and the Silver Line. ZIPs 20190, 20191, and 20194 cover the community. The drive from Martinsburg is Route 9 to Leesburg, then Route 7 to Route 28 and the Dulles Toll Road, or I-66 to Route 28. Real Elite remodels kitchens, primary suites, finished lower levels, and outdoor living.',
    neighborhoods: ['Lake Anne', 'Lake Audubon', 'Hunters Woods', 'South Lakes', 'Reston Town Center', 'North Point'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'remodeling', 'additions'],
  },
  'burke-va': {
    description:
      'Burke is unincorporated Fairfax County, ZIP 22015. Burke Centre, Lake Braddock, and the streets around Burke Lake are mostly 1970s through 1990s single-family houses on public water and sewer. Burke Centre has its own architectural review, separate from the Fairfax County building permit through Land Development Services. A county permit is not HOA approval. The drive from Martinsburg is Route 9 to Leesburg, then Route 7 to Route 28 and I-66, then south on the Fairfax County Parkway. Real Elite remodels kitchens, primary suites, finished lower levels, and additions.',
    neighborhoods: ['Burke Centre', 'Lake Braddock', 'Burke Lake', 'ZIP 22015', 'Burke Station', 'Longwood Knolls'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'remodeling', 'additions'],
  },
  'fairfax-station-va': {
    description:
      'Fairfax Station is a mailing name in ZIP 22039, south of the county core, including Crosspointe, the South Run corridor, and the roads toward Clifton. The parcel decides the permit office. A Fairfax Station address is not, by itself, a county permit or a Town of Clifton permit. If the home is inside the Town of Clifton, town sign-off comes before the Fairfax County building permit. Town questions go to 12641 Chapel Road, Clifton, VA 20124, phone 571-781-2404, or clerk@cliftonva.gov. If the parcel is outside the town, questions go to Land Development Services, 12055 Government Center Parkway, Suite 324, Fairfax, VA 22035, phone 703-222-0801. Some subdivisions have an HOA architectural review. A county permit is not HOA approval. If the house is on a private well or septic system, the Health Department may review the package. Those questions go to 703-246-2201. The drive from Martinsburg is Route 9 to Leesburg, then Route 7 to Route 28 and I-66. Real Elite remodels kitchens, primary suites, additions, and outdoor living. We confirm the permit steps for the parcel before work starts.',
    nearbySlugs: ['clifton-va', 'burke-va', 'springfield-va', 'fairfax-county-va'],
    neighborhoods: ['Crosspointe', 'South Run', 'ZIP 22039', 'Burke Lake Road', 'Hampton Road', 'Clifton Road'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'remodeling', 'additions'],
  },
  'clifton-va': {
    description:
      "Clifton is both a mailing name for ZIP 20124 and an incorporated town. The town charter was granted March 10, 1902, and the town is one-quarter of a square mile, so a Clifton address is not the same thing as a parcel inside the town. On the Fairfax County parcel profile, the District field says Springfield Town of Clifton when the address is inside the town. If the home is inside the Town of Clifton and the work is purely internal, such as plumbing or drywall, the town does not issue that permit or inspect it. Email drawings to clerk@cliftonva.gov for the sign-off Fairfax County needs before it will take the building-permit application. Construction or renovation of a building is a separate path: that work needs a use permit from the Planning Commission and Town Council, a certificate of appropriateness from the Architectural Review Board, and a Fairfax County building permit. The county will not accept that construction application without those town approvals and the mayor's signature. If the parcel is outside the town, questions go to Land Development Services, 12055 Government Center Parkway, Suite 324, Fairfax, VA 22035, phone 703-222-0801. Town questions go to 12641 Chapel Road, Clifton, VA 20124, phone 571-781-2404. If the house is on a private well or septic system, Health Department questions go to 703-246-2201. The drive from Martinsburg is Route 9 to Leesburg, then Route 7 to Route 28 and I-66, then south toward Clifton Road. Real Elite remodels kitchens, primary suites, additions, and outdoor living. We confirm the permit steps for the parcel before work starts.",
    nearbySlugs: ['fairfax-station-va', 'burke-va', 'fairfax-county-va', 'springfield-va'],
    neighborhoods: ['Clifton village', 'Main Street', 'ZIP 20124', 'Clifton Road', 'Compton Road', 'Newman Road'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'remodeling', 'additions'],
  },
  'middleburg-va': {
    description:
      "Middleburg is an incorporated Loudoun town on Route 50. A Middleburg mailing address is not automatically Town limits — parcels along Atoka, Foxcroft, and Goose Creek are often unincorporated county, and many of those lots are on well and septic. A bedroom addition on a well-and-septic lot needs Loudoun Health Department approval before the building permit. Inside Town, a Zoning Location Permit is required for a deck, shed, fence, detached garage, or any work that also needs a Loudoun County building permit; the county issues building permits county-wide and still expects Town zoning first. Exterior work in the Historic District also needs a Certificate of Appropriateness from the Historic District Review Committee — complete applications are due 14 days before the meeting, and decks are on the Town's published COA list. Outside Town, county building and zoning apply (Typical Deck $265 / full plans $395 under 1,000 sq ft). The drive from Martinsburg is Route 9 to Leesburg, then south to Route 50. Real Elite remodels kitchens, primary suites, additions, and outdoor living.",
    neighborhoods: ['Historic District', 'Main Street', 'Atoka Road', 'Foxcroft Road', 'Goose Creek'],
    marketEmphasis: ['kitchens', 'bathrooms', 'additions', 'decks', 'remodeling'],
  },
  'purcellville-va': {
    description:
      "Purcellville is an incorporated town on Route 7 in western Loudoun. A Purcellville mailing address is not always inside town limits: Wright Farm and Mayfair sit in the county's Joint Land Management Area beside the town. Inside town limits, town zoning is approved before Loudoun County issues the building permit. The housing is a late-19th and early-20th century village along Main Street (Business Route 7), plus later subdivisions. Lots outside the town sewer are often on well and septic, and a bedroom addition on those lots needs Loudoun Health Department approval before the building permit. The drive from Martinsburg is Route 9 to Leesburg, then Route 7 west. Real Elite remodels kitchens, primary suites, basements, additions, and outdoor living.",
    neighborhoods: ['Historic downtown', 'Main Street', 'Route 7', 'Wright Farm', 'Mayfair'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'additions', 'decks', 'remodeling'],
  },
  'round-hill-va': {
    description:
      "Round Hill is an incorporated town on Route 7, west of Purcellville. The village core is small. Newer houses sit on larger lots toward the county line, and many of those lots are on well and septic rather than town utilities. A bedroom addition on a well-and-septic lot needs Loudoun Health Department approval before the building permit. Inside town limits, town zoning is approved before the county issues the building permit. Round Hill is not one of the county's six historic overlay districts. The drive from Martinsburg is Route 9 to Leesburg, then Route 7 west. Real Elite remodels kitchens, primary suites, additions, basements, and outdoor living.",
    neighborhoods: ['Historic village', 'Loudoun Street', 'Route 7', 'West of town'],
    marketEmphasis: ['kitchens', 'bathrooms', 'additions', 'basements', 'decks', 'remodeling'],
  },
  'lovettsville-va': {
    description:
      "Lovettsville is an incorporated town in northern Loudoun, near the Potomac and the Maryland line. The approach from the south is Route 287, the Berlin Turnpike, off Route 9. The town is a 19th-century village with later houses on lots that are often on well and septic. A bedroom addition on a well-and-septic lot needs Loudoun Health Department approval before the building permit. Inside town limits, town zoning is approved before the county issues the building permit. Lovettsville is not one of the county's six historic overlay districts. The drive from Martinsburg is Route 9, then north on Route 287. Real Elite remodels kitchens, primary suites, additions, basements, and outdoor living.",
    neighborhoods: ['Historic downtown', 'Berlin Turnpike', 'Route 287', 'North of Route 9'],
    marketEmphasis: ['kitchens', 'bathrooms', 'additions', 'basements', 'decks', 'remodeling'],
  },
  'waterford-va': {
    description:
      "Waterford is an unincorporated village northwest of Leesburg. Loudoun County's Waterford Historic and Cultural Conservation District covers the central village, and most exterior changes there — additions, porches, new accessory buildings, and material changes — need a Certificate of Appropriateness from the Historic District Review Committee before work starts. Ordinary repairs that do not change design, material, or appearance are the exception the county publishes. The National Historic Landmark boundary is larger than the county district, which is limited to the central village. Interior kitchens, primary baths, and lower levels do not need that exterior review unless the work changes the outside. Many village and edge lots are on well and septic, so a bedroom addition also needs Loudoun Health Department approval before the building permit. The drive from Martinsburg is Route 9 through Hillsboro, then the local roads north of Leesburg. Real Elite remodels kitchens, primary suites, careful additions, and outdoor living that can pass historic review.",
    neighborhoods: ['Main Street', 'Second Street', 'The mill', 'Village edge'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'additions', 'decks', 'remodeling'],
    nearbySlugs: ['hamilton-va', 'purcellville-va', 'leesburg-va', 'lovettsville-va'],
  },
  'hamilton-va': {
    description:
      "Hamilton is an incorporated town on Route 7 between Purcellville and Leesburg. The core is a small 19th-century village. Houses toward the edges often sit on well and septic rather than town utilities. A bedroom addition on a well-and-septic lot needs Loudoun Health Department approval before the building permit. Inside town limits, town zoning is approved before the county issues the building permit. Hamilton is not one of the county's six historic overlay districts. The drive from Martinsburg is Route 9 to Leesburg, then Route 7 west. Real Elite remodels kitchens, primary suites, basements, additions, and outdoor living.",
    neighborhoods: ['Historic downtown', 'Route 7', 'East toward Leesburg', 'West toward Purcellville'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'additions', 'decks', 'remodeling'],
    nearbySlugs: ['purcellville-va', 'waterford-va', 'leesburg-va', 'round-hill-va'],
  },
  'aldie-va': {
    description:
      "Aldie is an unincorporated village on Route 50 in southern Loudoun. The village and its mill sit in the Aldie Historic and Cultural Conservation District. Exterior changes there — additions, porches, accessory buildings, and material changes — need a Certificate of Appropriateness from the Historic District Review Committee before work starts. Newer communities nearby, including Willowsford, are a separate review from the village overlay: county permits, and the community's own architectural standards where those apply. Acreage lots are often on well and septic. A bedroom addition on a well-and-septic lot needs Loudoun Health Department approval before the building permit. The drive from Martinsburg is Route 9 to Leesburg, then south to Route 50. Real Elite remodels kitchens, primary suites, additions, and outdoor living.",
    neighborhoods: ['Aldie village', 'The mill', 'Route 50', 'Willowsford'],
    marketEmphasis: ['kitchens', 'bathrooms', 'additions', 'decks', 'remodeling'],
  },
  'lansdowne-va': {
    description:
      "Lansdowne is a planned community on the Potomac, east of Leesburg along Route 7. It is unincorporated Loudoun County. Many houses use a Leesburg mailing address, which does not make the parcel Town of Leesburg zoning. County building and zoning run through LandMARC, and exterior changes also go through the community's architectural review. The housing is mostly 1990s and 2000s production and custom homes on public water and sewer, with unfinished basements and builder-grade kitchens and primary baths. This is not a well-and-septic market. The drive from Martinsburg is Route 9 to Leesburg, then Route 7 east. Real Elite remodels basements, kitchens, primary suites, outdoor living, and additions.",
    neighborhoods: ['Lansdowne on the Potomac', 'Resort corridor', 'Route 7', 'Residential villages'],
    marketEmphasis: ['basements', 'kitchens', 'bathrooms', 'decks', 'additions', 'remodeling'],
  },
  'south-riding-va': {
    description:
      "South Riding is a planned community in southeastern Loudoun, along Route 50. The Board of Supervisors approved it in 1993, and houses have been built since the mid-1990s. It is unincorporated county: schools and building permits are Loudoun's, and the South Riding Proprietary — incorporated in 1995 — governs common areas and architectural standards. Exterior changes need that review as well as the county permit. Homes are on public water and sewer, and many still have unfinished basements and builder-grade kitchens and primary baths. The drive from Martinsburg is Route 9 to Leesburg, then south to Route 50. Real Elite remodels basements, kitchens, primary suites, outdoor living, and additions.",
    neighborhoods: ['Town Center', 'Center Street', 'Route 50', 'Residential sections'],
    marketEmphasis: ['basements', 'kitchens', 'bathrooms', 'decks', 'additions', 'remodeling'],
  },
  'sterling-va': {
    description:
      'Sterling is an unincorporated community in eastern Loudoun, between Route 7 and Route 28. Sterling Park dates from the early 1960s. Later planned communities — Cascades, Potomac Falls, Sugarland Run, Countryside, and Lowes Island — are mostly 1980s through 2000s houses on public water and sewer. Several of those communities require HOA architectural review for exterior work, separate from the county permit through LandMARC. Older Sterling Park houses are the ones most often opened up for a new kitchen, a primary suite, or a finished lower level. The drive from Martinsburg is Route 9 to Leesburg, then Route 7 east. Real Elite remodels basements, kitchens, primary suites, outdoor living, and additions.',
    neighborhoods: ['Sterling Park', 'Cascades', 'Potomac Falls', 'Sugarland Run', 'Countryside', 'Lowes Island'],
    marketEmphasis: ['basements', 'kitchens', 'bathrooms', 'decks', 'additions', 'remodeling'],
  },

  /* ---------- Prince William County + Fairfax towns added 2026-09-27 ---------- */
  'prince-william-county-va': {
    description:
      "Western Prince William County runs, along I-66, Route 15, and Route 28. Haymarket, Gainesville, and Bristow are mostly 1990s through 2010s houses in planned communities on public water and sewer. Those communities also require HOA architectural review. A county permit is not HOA approval. Nokesville is more acreage, and many of those lots are on well and septic. Building permits are issued by the Prince William County Department of Development Services. Haymarket is an incorporated town: since January 15, 2018 the county issues the building permit, and the town still requires zoning approval first. A bedroom addition on a well-and-septic lot needs Prince William Health District approval before the building permit. The drive from Martinsburg is Route 9 to Leesburg, then Route 15 south, or Route 7 to Route 28 and I-66 west. We work across 20169 Haymarket, 20155 Gainesville, 20136 Bristow, 20181 Nokesville, and 20143 Catharpin. ZIP 20112 uses a Manassas mailing address on the county side of the independent city.",
    neighborhoods: ['20169 Haymarket', '20155 Gainesville', '20136 Bristow', '20181 Nokesville', '20112 Manassas', '20143 Catharpin'],
    marketEmphasis: ['basements', 'kitchens', 'bathrooms', 'decks', 'additions', 'remodeling'],
  },
  'oakton-va': {
    description:
      'Oakton is a mailing name along Route 123 between Vienna and Fairfax, ZIP 22124. The parcel decides the permit office. The Oakton name does not place the house in the Town of Vienna. If the home is inside the Town of Vienna, Fairfax County is the building official, and town review follows the county application. Town questions go to Town Hall at 127 Center Street South, Vienna, VA 22180, phone 703-255-6300. If the parcel is outside the town, questions go to Land Development Services, 12055 Government Center Parkway, Suite 324, Fairfax, VA 22035, phone 703-222-0801. Houses along Route 123 sit on wooded lots, with later infill closer to I-66. Some clusters have an HOA architectural review. A county permit is not that approval. The drive from Martinsburg is Route 9 to Leesburg, then Route 7 to I-66 or Route 123. Real Elite remodels kitchens, primary suites, finished lower levels, and additions. We confirm the permit steps for the parcel before work starts.',
    nearbySlugs: ['dunn-loring-va', 'vienna-va', 'fairfax-va', 'falls-church-va'],
    neighborhoods: ['Route 123', 'ZIP 22124', 'Hunter Mill', 'Jermantown Road', 'Oakton', 'I-66'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'remodeling', 'additions'],
  },
  'dunn-loring-va': {
    description:
      'Dunn Loring is a mailing name in ZIP 22027, at I-66 and the Beltway beside the Dunn Loring-Merrifield Metro. The parcel decides the permit office. An address near the Town of Vienna is not, by itself, inside the town. If the home is inside the Town of Vienna, Fairfax County is the building official, and materials go to the county before the town review. Town questions go to 127 Center Street South, Vienna, VA 22180, phone 703-255-6300. If the parcel is outside the town, questions go to Land Development Services, 12055 Government Center Parkway, Suite 324, Fairfax, VA 22035, phone 703-222-0801. The streets mix ramblers, later colonials, and townhouses. Some communities require HOA architectural review. A county permit is not that approval. The drive from Martinsburg is Route 9 to Leesburg, then Route 7 to I-66. Real Elite remodels kitchens, primary suites, finished lower levels, and additions. We confirm the permit steps for the parcel before work starts.',
    nearbySlugs: ['oakton-va', 'vienna-va', 'falls-church-va', 'fairfax-va'],
    neighborhoods: ['ZIP 22027', 'Gallows Road', 'Idylwood', 'I-66', 'Prosperity Avenue', 'Merrifield'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'remodeling', 'additions'],
  },
  'fort-hunt-va': {
    description:
      'Fort Hunt is a mailing name along Fort Hunt Road and the George Washington Memorial Parkway. ZIP 22308 uses an Alexandria mailing name, which does not decide the jurisdiction. If the parcel is in the City of Alexandria, questions go to Code Administration, 301 King Street, Suite 4200, Alexandria, VA 22314, phone 703-746-4200. If the parcel is in Fairfax County, questions go to Land Development Services, 12055 Government Center Parkway, Suite 324, Fairfax, VA 22035, phone 703-222-0801. Houses along the parkway sit on larger lots, including Hollin Hills. The drive from Martinsburg is Route 9 to Leesburg, then Route 7 east to I-495 and the parkway. Real Elite remodels kitchens, primary suites, additions, and finished lower levels. We confirm the permit steps for the parcel before work starts.',
    nearbySlugs: ['alexandria-va', 'springfield-va', 'fairfax-county-va', 'burke-va'],
    neighborhoods: ['Fort Hunt Road', 'Hollin Hills', 'ZIP 22308', 'Wellington', 'Collingwood', 'George Washington Parkway'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'remodeling', 'additions'],
  },
  'haymarket-va': {
    description:
      'Haymarket is an incorporated town in western Prince William County, ZIP 20169, at I-66 and Route 15. The incorporated town is the village along Washington Street. Piedmont and Dominion Valley sit in the county around it and use the same ZIP. Since January 15, 2018, the Prince William County Department of Development Services issues building permits inside the town, and the town still requires zoning approval before that application. Outside town, county building and zoning apply, and the planned communities require HOA architectural review. A county permit is not HOA approval. The houses are mostly 1990s through 2010s production and custom homes on public water and sewer. The drive from Martinsburg is Route 9 to Leesburg, then Route 15 south. Real Elite remodels basements, kitchens, primary suites, outdoor living, and additions.',
    neighborhoods: ['Washington Street', 'Piedmont', 'Dominion Valley', 'Route 15', 'I-66', 'ZIP 20169'],
    marketEmphasis: ['basements', 'kitchens', 'bathrooms', 'decks', 'additions', 'remodeling'],
  },
  'gainesville-va': {
    description:
      'Gainesville is unincorporated Prince William County, ZIP 20155, along I-66 and Route 29. Heritage Hunt and the subdivisions off Route 29 and Virginia Gateway are mostly 1990s through 2010s houses on public water and sewer. Building permits go through the Prince William County Department of Development Services, and most of those communities also require HOA architectural review. A county permit is not HOA approval. The drive from Martinsburg is Route 9 to Leesburg, then Route 15 south to I-66, or Route 7 to Route 28 and I-66 west. Real Elite remodels basements, kitchens, primary suites, outdoor living, and additions.',
    neighborhoods: ['Heritage Hunt', 'Route 29', 'Virginia Gateway', 'I-66', 'ZIP 20155', 'Heathcote'],
    marketEmphasis: ['basements', 'kitchens', 'bathrooms', 'decks', 'additions', 'remodeling'],
  },
  'bristow-va': {
    description:
      'Bristow is unincorporated Prince William County, ZIP 20136, along Linton Hall Road between Gainesville and Nokesville. Braemar, Victory Lakes, and the Linton Hall subdivisions are mostly 1990s and 2000s houses on public water and sewer, many with unfinished basements. Building permits go through the Prince William County Department of Development Services. Those communities also require HOA architectural review. A county permit is not HOA approval. The drive from Martinsburg is Route 9 to Leesburg, then Route 15 south to I-66 and Linton Hall, or Route 7 to Route 28. Real Elite remodels basements, kitchens, primary suites, outdoor living, and additions.',
    neighborhoods: ['Linton Hall Road', 'Braemar', 'Victory Lakes', 'ZIP 20136', 'Route 28', 'I-66'],
    marketEmphasis: ['basements', 'kitchens', 'bathrooms', 'decks', 'additions', 'remodeling'],
  },
  'nokesville-va': {
    description:
      'Nokesville is an unincorporated rural community in southwestern Prince William County, ZIP 20181. Houses sit on larger lots along Route 28 and Aden Road, and many of those lots are on well and septic rather than public sewer. A bedroom addition on a well-and-septic lot needs Prince William Health District approval before the building permit. Building permits otherwise go through the Prince William County Department of Development Services. This is not a master-planned HOA market. The drive from Martinsburg is Route 9 to Leesburg, then Route 15 south to Route 28. Real Elite remodels kitchens, primary suites, additions, and outdoor living.',
    neighborhoods: ['Route 28', 'Aden Road', 'ZIP 20181', 'Bristow Road', 'Nokesville village', 'Marsteller Road'],
    marketEmphasis: ['kitchens', 'bathrooms', 'additions', 'decks', 'remodeling'],
  },
  'springfield-va': {
    description:
      "Springfield is unincorporated Fairfax County, not its own city. The Springfield ZIPs we serve are Newington Forest (22153, median year built 1981), West Springfield (22152, 1975), North Springfield (22151, 1962), and Springfield (22150, 1978). Building permits go through Fairfax County Land Development Services and the PLUS system. Fairfax County requires a permit for finished basements, kitchen renovations, bathroom remodels, and decks. A detached shed of 256 square feet or less and one story does not. The county's named historic-overlay list does not make the whole Springfield area a historic district.",
    neighborhoods: ['Newington Forest', 'West Springfield', 'North Springfield', 'ZIP 22150', 'ZIP 22151', 'ZIP 22153'],
    marketEmphasis: ['basements', 'kitchens', 'bathrooms', 'decks', 'additions', 'remodeling'],
    faqs: [
      {
        question: 'Does Springfield have its own building department?',
        answer:
          'No. Springfield is unincorporated Fairfax County. Building permits go through Fairfax County Land Development Services.',
      },
      {
        question: 'Does a finished basement in Springfield need a county permit?',
        answer:
          'Yes. Fairfax County requires a permit for finished basements as an interior alteration. We confirm the parcel is in the county before applying.',
      },
      {
        question: 'Is all of Springfield in a historic district?',
        answer:
          'Not according to Fairfax County\'s named historic-overlay list. Check the county map before assuming an overlay applies to a house.',
      },
    ],
  },
  'herndon-va': {
    description:
      "A Herndon mailing address is not automatically inside the Town of Herndon. ZIP 20170 is centered on Dranesville in Fairfax County, and ZIP 20171 is centered on Franklin Farm in Fairfax County. County parcels use Fairfax County Land Development Services. Fairfax County requires a permit for finished basements and decks. Inside the Town of Herndon, we confirm the permit steps with the town before work starts. Fairfax County's named historic overlays do not include a Herndon or Franklin Farm district. Dranesville Tavern is a named overlay site, which does not mean ZIP 20170 sits inside it.",
    neighborhoods: ['ZIP 20170', 'ZIP 20171', 'Dranesville', 'Franklin Farm'],
    marketEmphasis: ['basements', 'kitchens', 'bathrooms', 'decks', 'additions', 'remodeling'],
    faqs: [
      {
        question: 'Which office permits a Herndon address?',
        answer:
          'If the parcel is in Fairfax County, it is Land Development Services. Inside the Town of Herndon, we confirm the permit steps with the town before work starts.',
      },
      {
        question: 'Does a county finished basement need a permit?',
        answer:
          'Yes. Fairfax County requires a permit for finished basements. That rule is for county land, not a substitute for the town code.',
      },
    ],
  },
  'chantilly-va': {
    description:
      'Chantilly here is Fairfax County ZIP 20151, with a median year built of 1988. ZIP 20152 is South Riding in Loudoun County. County permits go through Fairfax County Land Development Services. Fairfax County requires a permit for decks, which it counts among additions, and for finished basements, which it counts as interior work. The Sully Historic Overlay is about the Sully house, which Richard Bland Lee began in 1793 and which the county park authority now runs as a museum. Nothing about the overlay says it covers Chantilly houses. We check the map before treating a house as inside it.',
    neighborhoods: ['ZIP 20151', 'Chantilly'],
    marketEmphasis: ['basements', 'kitchens', 'bathrooms', 'decks', 'additions', 'remodeling'],
    faqs: [
      {
        question: 'Which part of Chantilly do you serve?',
        answer:
          'Fairfax County ZIP 20151. ZIP 20152 is South Riding in Loudoun County.',
      },
      {
        question: 'Who permits a deck in ZIP 20151?',
        answer:
          'Fairfax County Land Development Services. The county requires a permit for decks, which it counts among additions and structures.',
      },
      {
        question: 'Is Chantilly inside the Sully Historic Overlay?',
        answer:
          'The Sully overlay is about the historic house and its district, now a county museum. Nothing about it says it covers Chantilly houses generally. Check the map.',
      },
    ],
  },
  'centreville-va': {
    description:
      "Centreville here is Fairfax County, not a town government. ZIP 20120 is centered on Bull Run (median year built 1992) and ZIP 20121 is centered on Centreville (median year built 1991). Most of that housing is 1980s and 1990s. Building permits for county land go through Fairfax County Land Development Services, and Fairfax County requires a permit for finished basements. There is a real Centreville Historic Overlay District. The county traces it to the old village on Braddock's Road, platted after a 1792 petition, not to the modern community as a whole. Work inside a county historic overlay goes to the Architectural Review Board. We check the map to see whether a house sits inside that overlay.",
    neighborhoods: ['ZIP 20120', 'ZIP 20121', 'Bull Run', 'Centreville'],
    marketEmphasis: ['basements', 'kitchens', 'bathrooms', 'decks', 'additions', 'remodeling'],
    faqs: [
      {
        question: 'Who permits a basement in Centreville?',
        answer:
          'For county land, Fairfax County Land Development Services. Fairfax County requires a permit for finished basements. Both Centreville ZIPs are county land.',
      },
      {
        question: 'Is all of Centreville in the historic district?',
        answer:
          'No. The county describes the Centreville overlay as old Centreville. Most housing in ZIPs 20120 and 20121 was built in the 1980s and 1990s.',
      },
      {
        question: 'Does the historic overlay change a kitchen that never touches the outside?',
        answer:
          'The Architectural Review Board exists for overlay districts. Read the ARB procedure before assuming an interior project is covered.',
      },
    ],
  },
  'falls-church-va': {
    description:
      'The City of Falls Church is an independent city. A Falls Church mailing address extends far outside the city limits, so the parcel decides the permit office. If the home is inside the city, questions go to the permit counter at 300 Park Avenue, Falls Church, VA 22046, phone 703-248-5080, email permits@fallschurchva.gov. The counter is open Monday through Friday, 8 a.m. to 5 p.m., and closed to the public on the last Wednesday of the month. If the parcel is in Fairfax County, questions go to Land Development Services, 12055 Government Center Parkway, Suite 324, Fairfax, VA 22035, phone 703-222-0801. If the home is inside the city, any work on a gas appliance needs a permit, including a direct replacement of a furnace or stove, and anything that involves framing needs a permit. Paint, patch, carpet, and drywall replacement do not. In a single-family house, replacing a plumbing fixture, a roof, or windows does not need a city permit. Real Elite does not take electrical work or gas work. The drive from Martinsburg is Route 9 to Leesburg, then Route 7 east. We confirm the permit steps with the city or the county before work starts.',
    neighborhoods: ['ZIP 22046', 'Park Avenue', 'City of Falls Church'],
    marketEmphasis: ['basements', 'kitchens', 'bathrooms', 'decks', 'additions', 'remodeling'],
    nearbySlugs: ['dunn-loring-va', 'fairfax-va', 'arlington-va', 'vienna-va'],
    faqs: [
      {
        question: 'Does a Falls Church mailing address mean the city permit counter?',
        answer:
          'Not by itself. The mailing address extends far outside the city. If the home is inside the city, questions go to 300 Park Avenue, phone 703-248-5080. If the parcel is in Fairfax County, questions go to Land Development Services, phone 703-222-0801.',
      },
      {
        question: 'Does replacing a gas stove in the city need a permit?',
        answer:
          'If the home is inside the city, any work on a gas appliance needs a permit, including a direct replacement of a furnace or stove. Real Elite does not take gas work.',
      },
      {
        question: 'What can be replaced in a city house without a permit?',
        answer:
          'Paint, patch, carpet, and drywall replacement do not need a permit. In a single-family house, replacing a plumbing fixture, a roof, or windows does not. Framing does. We confirm the steps for the parcel before work starts.',
      },
    ],
  },
  'fairfax-va': {
    seoTitle: 'Remodeling Contractor in Fairfax, VA | Real Elite',
    seoH1: 'Remodeling Contractor in Fairfax, VA',
    seoDescription:
      'Remodeling contractor in the City of Fairfax, VA. City Code Administration permits inside city limits. Free written estimate after a site walk.',
    description:
      "The City of Fairfax is an independent city. Fairfax addresses in ZIPs 22030, 22031 and 22032 can be inside the city or in Fairfax County, so the parcel decides the permit office. A county parcel uses Fairfax County Land Development Services, not the city office. The drive from Martinsburg is I-81 south to I-66 east.\n\nInside the city, questions go to the Office of Code Administration and Fire Marshal, 10455 Armstrong Street, Suite 208, Fairfax, VA 22030, phone (703) 385-7830. The phone is answered Monday through Friday, 7:00 a.m. to 5:00 p.m. The office is open Monday through Friday, 8:30 a.m. to 5:00 p.m. A residential building permit covers demolition, new construction, additions, alterations, and relocatable buildings. Repairs and alterations are $93.60 plus 1% of the project cost over $1,000. Those are city fees, not the project price.\n\nThe city requires a building permit for a wall change, whether the wall is load-bearing or not, and for a deck. A shower pan needs a plumbing permit even when it is replaced in the same place. Electrical work and gas work are separately licensed trades. Real Elite does not take electrical work. We confirm the permit steps with the city before work starts. The price is a free written estimate after a site walk.",
    neighborhoods: ['Old Town Fairfax', 'Main Street', 'Armstrong Street'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'remodeling', 'additions'],
    nearbySlugs: ['falls-church-va', 'fairfax-county-va', 'springfield-va', 'vienna-va'],
    faqs: [
      {
        question: 'Who permits a remodel in the City of Fairfax?',
        answer:
          'The Office of Code Administration, 10455 Armstrong Street, Suite 208, Fairfax, VA 22030, phone (703) 385-7830. A residential building permit covers additions and alterations.',
      },
      {
        question: 'Does a Fairfax ZIP code tell you whether a home is in the city?',
        answer:
          'No. ZIPs 22030, 22031 and 22032 each include city and county addresses. A parcel inside city limits uses the City of Fairfax Office of Code Administration. A Fairfax County parcel uses Fairfax County Land Development Services. We confirm which one applies before work starts.',
      },
      {
        question: 'What does remodeling in the City of Fairfax cost?',
        answer:
          'Every City of Fairfax kitchen, bathroom, and lower level is a free written estimate after a site walk. The city fee for repairs and alterations is $93.60 plus 1% of the project cost over $1,000. That fee is not the project price.',
      },
    ],
  },
  'manassas-va': {
    description:
      'The City of Manassas is an independent city. ZIP 20110 is centered on the city (median year built 1986). Development Services is at 9027 Center Street, 2nd Floor, Manassas, VA 20110, phone 703-257-8278. The city lists building, trade, occupancy, site, utility, zoning, and demolition permits, and it names Walk Through Wednesdays for limited-scope projects such as decks or fences. ZIP 20109 is centered on Bull Run in Prince William County. ZIP 20112 is centered in Prince William County and is not the city. ZIP 20111 is centered on the City of Manassas Park, a different city. County parcels use Prince William County Development Services. Prince William County requires a permit for a deck when the floor is 16.5 inches or more above finished grade. That county number does not apply inside the city; we confirm the city threshold before work starts. The county says Buckland is currently its only historic overlay district.',
    neighborhoods: ['ZIP 20110', 'Center Street', 'City of Manassas'],
    marketEmphasis: ['basements', 'kitchens', 'bathrooms', 'decks', 'additions', 'remodeling'],
    faqs: [
      {
        question: 'Does a Manassas mailing address use the city permit office?',
        answer:
          'Only if the parcel is in the City of Manassas. ZIPs 20109 and 20112 are centered in Prince William County. ZIP 20111 is centered on the City of Manassas Park. Check the parcel.',
      },
      {
        question: 'What deck height needs a Prince William County permit?',
        answer:
          'Prince William County requires a permit when the floor is 16.5 inches or more above finished grade. We confirm the figure with the city for parcels inside the City of Manassas.',
      },
    ],
  },
  'lake-ridge-va': {
    description:
      'Lake Ridge is a community in Prince William County. ZIP 22192 is centered on Lake Ridge (median year built 1987), even though the postal name on that ZIP is Woodbridge. It is not the Woodbridge area of ZIP 22191, and it is not Dale City. Building permits for these county parcels go through Prince William County Development Services. Prince William County requires a permit for a deck when the floor is 16.5 inches or more above finished grade, and requires zoning approval for accessory structures such as decks, additions, and garages even when a separate question is whether a building permit is required. The county tells owners to check whether their HOA has covenants. Buckland is the only historic overlay the county names. Lake Ridge is not on that list.',
    neighborhoods: ['ZIP 22192', 'Lake Ridge'],
    marketEmphasis: ['basements', 'kitchens', 'bathrooms', 'decks', 'additions', 'remodeling'],
    faqs: [
      {
        question: 'Are Lake Ridge and Woodbridge the same place?',
        answer:
          'No. ZIP 22192 is centered on Lake Ridge. ZIP 22191 is centered on Woodbridge. Both are in Prince William County.',
      },
      {
        question: 'When does a deck need a Prince William County permit?',
        answer:
          'Prince William County requires a permit when the floor is 16.5 inches or more above finished grade. Zoning approval can still be required for exterior work.',
      },
      {
        question: 'Does the county require HOA approval?',
        answer:
          'Prince William County tells owners to check whether their HOA has covenants. A county permit is not HOA approval.',
      },
    ],
  },
  'woodbridge-va': {
    description:
      'Woodbridge here is the Woodbridge area of Prince William County, ZIP 22191 (median year built 1999). ZIP 22192 is Lake Ridge. ZIP 22193 is Dale City. County permits go through Prince William County Development Services. Prince William County requires a permit for a deck when the floor is 16.5 inches or more above finished grade, and says exterior projects may need zoning approval even when no building permit is required. The county tells owners to check HOA covenants. Buckland is the only historic overlay the county names. Woodbridge is not on that list. The Town of Occoquan is a different permit path.',
    neighborhoods: ['ZIP 22191', 'Woodbridge'],
    marketEmphasis: ['basements', 'kitchens', 'bathrooms', 'decks', 'additions', 'remodeling'],
    faqs: [
      {
        question: 'Which ZIP is Woodbridge, Virginia?',
        answer:
          'ZIP 22191, the Woodbridge area of Prince William County. ZIP 22192 is Lake Ridge. ZIP 22193 is Dale City.',
      },
      {
        question: 'When does a deck need a county permit?',
        answer:
          'Prince William County says a permit is required when the floor is 16.5 inches or more above finished grade.',
      },
      {
        question: 'Is Occoquan part of Woodbridge?',
        answer:
          'No. Occoquan is a town with its own zoning step. Woodbridge here is the area in the county.',
      },
    ],
  },
  'berryville-va': {
    description:
      'Berryville is the county seat of Clarke County, ZIP 22611. Clarke County Building Department reviews permits throughout the county, including the incorporated towns of Berryville and Boyce. The office is on the first floor of the Berryville-Clarke County Government Center at 101 Chalmers Court, phone (540) 955-5112, and applications go to permits@clarkecounty.gov. The county asks for 20 to 30 business days for plan review. A zoning permit from the Planning Department, on the second floor of the same building, is a prerequisite for a building permit, and the two reviews can run at the same time. Inside the Town of Berryville, owners may also need the Town Planner at 101 Chalmers Court, Suite A, phone (540) 955-4081. Exterior work inside the Berryville Historic District needs a Certificate of Appropriateness from the town Architectural Review Board before the town issues its zoning permit. The county still issues the building permit. The historic district is not the whole ZIP. The median year built for ZIP 22611 is 1981, so the housing is established rather than a new-build subdivision. The drive from Martinsburg is Route 9 west to Route 7, then south into Clarke County. Real Elite remodels kitchens, primary baths, and lower levels in older houses.',
    neighborhoods: ['Town of Berryville', 'Berryville Historic District', 'ZIP 22611', 'Clarke County'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'additions', 'remodeling'],
    nearbySlugs: ['winchester-va', 'hamilton-va', 'shepherdstown-wv', 'purcellville-va'],
    faqs: [
      {
        question: 'Who issues the building permit in Berryville?',
        answer:
          'Clarke County Building Department, including for houses inside the Town of Berryville and the Town of Boyce. The counter is 101 Chalmers Court, first floor, phone (540) 955-5112.',
      },
      {
        question: 'When does the Berryville Architectural Review Board apply?',
        answer:
          'For a Certificate of Appropriateness inside the Berryville Historic District. After that approval, town staff issue the zoning permit. The county issues the building permit. The district is not the whole 22611 ZIP.',
      },
      {
        question: 'Is a Berryville address always inside the town?',
        answer:
          'No. ZIP 22611 is larger than the town. County land uses the county Planning Department for zoning and the same Building Department for the building permit, without the town planner step.',
      },
    ],
  },
  'the-plains-va': {
    description:
      'The Plains is an incorporated town in Fauquier County. The Virginia charter is the Town of The Plains, County of Fauquier, with the current charter dated 1972. A Plains mailing address is not automatically inside the town: ZIP 20198 is centered in Fauquier County, outside an incorporated place. Inside town, the zoning and sign permit is required before a building permit and the published fee is $50. Fauquier County provides the building inspections. The town Historic District includes all properties within the town, and improvements there need Architectural Review Board approval. The ARB application has no fee. Town Hall is at 6451 Main Street, phone (540) 364-4945. Outside town limits, the building permit goes to Fauquier County Department of Community Development at 16 Courthouse Square in Warrenton, phone (540) 422-8230. The county zoning fee is $110, including the technology fee. For ZIP 20198 as a whole, the median year built is 1982, and the largest single year-built group is 1939 or earlier. That is a mix of older and later houses, not one style. The drive from Martinsburg is Route 9 to Leesburg, then south toward Route 50. Real Elite remodels kitchens, primary baths, and lower levels.',
    neighborhoods: ['Town of The Plains', 'Historic District', 'ZIP 20198', 'Fauquier County'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'additions', 'remodeling'],
    nearbySlugs: ['middleburg-va', 'upperville-va', 'marshall-va', 'warrenton-va'],
    faqs: [
      {
        question: 'Who issues the building permit in The Plains?',
        answer:
          'Fauquier County. The town requires an approved zoning permit first. The published town zoning and sign permit fee is $50. County building permits are filed with Community Development at 16 Courthouse Square in Warrenton.',
      },
      {
        question: 'Does every Plains address need Architectural Review Board approval?',
        answer:
          'The town says the Historic District includes all properties within the town, and improvements there need ARB approval. There is no ARB fee. Land outside the town is county zoning, not the town historic district.',
      },
      {
        question: 'Is The Plains the same permit path as Warrenton?',
        answer:
          'No. Warrenton has its own town building counter. The Plains sends the building inspection to Fauquier County after the town zoning permit.',
      },
    ],
  },
  'upperville-va': {
    description:
      "Upperville is an unincorporated village in northern Fauquier County, on Route 50 at the Loudoun County line, ZIP 20184. It is not a town and it does not have a municipal permit office. Building permits go to the Fauquier County Department of Community Development at 16 Courthouse Square in Warrenton, phone (540) 422-8230. Office hours are Monday through Friday, 8:00 a.m. to 4:30 p.m., and in-person applications are not accepted after 4:00 p.m. The county zoning permit fee is $110, including the technology fee, and the county uses a combined building and zoning application. The Virginia Department of Historic Resources lists the Upperville Historic District on the National Register. Fauquier County says National Register listing does not restrict private property, and that the Board of Supervisors has not adopted a local historic overlay district in the county. The towns of Warrenton and The Plains, which are separate jurisdictions, have their own historic overlay districts. Upperville is not one of those towns. The drive from Martinsburg is Route 9 to Leesburg, then south to Route 50. Real Elite remodels kitchens, primary baths, and lower levels in the village and on the surrounding acreage.",
    neighborhoods: ['Upperville Historic District', 'Route 50', 'ZIP 20184', 'Fauquier County'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'additions', 'remodeling'],
    nearbySlugs: ['middleburg-va', 'the-plains-va', 'marshall-va', 'warrenton-va'],
    faqs: [
      {
        question: 'Who permits a remodel in Upperville?',
        answer:
          'Fauquier County Department of Community Development, 16 Courthouse Square, Warrenton, phone (540) 422-8230. Upperville is unincorporated. There is no town zoning step.',
      },
      {
        question: 'Does the National Register district control exterior work?',
        answer:
          'No. The county says National Register listing does not impose restrictions on private property, and the Board has not adopted a local historic overlay in the county. Warrenton and The Plains are the towns with their own historic overlay districts.',
      },
      {
        question: 'Is Upperville in Loudoun County?',
        answer:
          'The village sits on the Loudoun line along Route 50, in Fauquier County. Loudoun LandMARC is the wrong counter. Confirm the parcel before filing.',
      },
    ],
  },
  'marshall-va': {
    description:
      "Marshall is an unincorporated community in Fauquier County, ZIP 20115. Building permits for Marshall come from the county, not a town office. Building permits go to the Fauquier County Department of Community Development at 16 Courthouse Square in Warrenton, phone (540) 422-8230. Office hours are Monday through Friday, 8:00 a.m. to 4:30 p.m., and in-person applications are not accepted after 4:00 p.m. The county zoning permit fee is $110, including the technology fee. A building permit is required for additions and for renovations or alterations to an existing house, and a zoning permit is required for most work, including some interior renovations. The county's online portal accepts finished-basement permits and residential trade permits. For ZIP 20115 as a whole, the median year built is 1983 and the houses are mostly one-unit detached. That is established housing, not a new-build subdivision, and it is not one architectural style. The Town of Warrenton's 30-inch deck rule and historic-district certificate do not apply here. The drive from Martinsburg is Route 9 to Leesburg, then south through The Plains toward Route 17. Real Elite remodels kitchens, primary baths, and lower levels.",
    neighborhoods: ['ZIP 20115', 'Unincorporated Fauquier', 'Fauquier County'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'additions', 'remodeling'],
    nearbySlugs: ['the-plains-va', 'warrenton-va', 'upperville-va', 'middleburg-va'],
    faqs: [
      {
        question: 'Is Marshall a town with its own permits?',
        answer:
          'Marshall is an unincorporated community in Fauquier County. The permit counter is the county office at 16 Courthouse Square in Warrenton.',
      },
      {
        question: 'What does a Fauquier County zoning permit cost?',
        answer:
          'The county publishes a zoning permit fee of $110, including the technology fee. Building and zoning are filed on one combined application.',
      },
      {
        question: 'Does Warrenton historic review apply in Marshall?',
        answer:
          'No. The Certificate of Appropriateness is for property in the Warrenton Historic District. Marshall is a different place in the same county.',
      },
    ],
  },
  'warrenton-va': {
    description:
      "Warrenton is an incorporated town in Fauquier County. The charter dates to 1816. A Warrenton mailing address is not automatically inside the town: ZIP 20186 and ZIP 20187 are both centered in Fauquier County, outside an incorporated place. Inside the town, the Department of Community Development handles applications at the town site, phone (540) 347-1101. The town requires a building permit for decks whose floor is 30 inches or more above finished grade, for finishing a basement, and for additions, garages, or carports. An areaway or egress window on a basement needs additional zoning review. A Certificate of Appropriateness is required before exterior alterations inside the Warrenton Historic District. Outside town limits, building permits go to the Fauquier County Department of Community Development at 16 Courthouse Square, Warrenton, phone (540) 422-8230. Office hours are Monday through Friday, 8:00 a.m. to 4:30 p.m., and in-person applications are not accepted after 4:00 p.m. The county zoning permit fee is $110, including the technology fee. The county uses a combined building and zoning application. ZIP 20187's housing is mostly detached (median year built 1991). ZIP 20186 is a different mix (median year built 1987) and should not be averaged into one house type.",
    neighborhoods: ['Town of Warrenton', 'ZIP 20186', 'ZIP 20187', 'Fauquier County'],
    marketEmphasis: ['basements', 'kitchens', 'bathrooms', 'decks', 'additions', 'remodeling'],
    nearbySlugs: ['the-plains-va', 'marshall-va', 'upperville-va', 'middleburg-va'],
    faqs: [
      {
        question: 'Does every Warrenton address use the town\'s 30-inch deck rule?',
        answer:
          'Only inside the town. Both ZIPs are centered in Fauquier County, outside an incorporated place. Outside town, Fauquier County Department of Community Development at 16 Courthouse Square takes the building permit. Phone (540) 422-8230. The county zoning fee is $110, including the technology fee.',
      },
      {
        question: 'Does a basement finish need a permit in town?',
        answer:
          'Yes. The town requires a permit to finish a basement, and an areaway or egress window needs additional zoning review.',
      },
      {
        question: 'When is the historic certificate required?',
        answer:
          'Before exterior alterations of property in the Warrenton Historic District. It applies inside the district, not across the whole ZIP.',
      },
    ],
  },
  'stephens-city-va': {
    description:
      'Stephens City is a chartered town in Frederick County, Virginia. It is not Winchester. ZIP 22655 is centered in unincorporated Frederick County, so the ZIP is larger than the town. A Stephens City mailing address is not automatically inside the town. We confirm the permit steps with the town or Frederick County before work starts. Confirm the parcel before choosing a counter. For ZIP 22655 as a whole, the median year built is 1996.',
    neighborhoods: ['Town of Stephens City', 'ZIP 22655', 'Frederick County, VA'],
    marketEmphasis: ['decks', 'roofing', 'remodeling', 'bathrooms', 'kitchens', 'additions'],
    faqs: [
      {
        question: 'Does ZIP 22655 equal the town?',
        answer:
          'No. ZIP 22655 is centered in unincorporated Frederick County. The town exists under its charter. Check the parcel.',
      },
      {
        question: 'Which office permits work in Stephens City?',
        answer:
          'It depends on whether the parcel is inside the town or in Frederick County. We confirm the permit steps with the right office before work starts.',
      },
      {
        question: 'Is Stephens City part of Winchester?',
        answer:
          'No. Winchester is a separate city.',
      },
    ],
  },
  'middletown-va': {
    description:
      'Middletown is a town in Frederick County, Virginia, not Middletown, Maryland, and not Frederick, Maryland. The town office is at 7875 Church Street, Middletown, VA 22645, and the town has a zoning application for zoning review of building permits. That is a zoning review. We confirm with the town and Frederick County who issues the building permit before work starts. ZIP 22645 as a whole has a population of 4,639 and a median year built of 1985. The Frederick, Maryland permit process does not apply to this town.',
    neighborhoods: ['Church Street', 'ZIP 22645', 'Town of Middletown, VA'],
    marketEmphasis: ['decks', 'roofing', 'remodeling', 'bathrooms', 'kitchens', 'additions'],
    faqs: [
      {
        question: 'Does the town review a building project?',
        answer:
          'The town has a zoning application for zoning review of building permits, filed through the office at 7875 Church Street. That is a zoning review, separate from the building permit itself.',
      },
      {
        question: 'Who issues the building permit?',
        answer:
          'We confirm that with the town and Frederick County before work starts.',
      },
      {
        question: 'Is this Middletown, Maryland?',
        answer:
          'No. This is Middletown, Virginia. The Frederick, Maryland permit article is a different jurisdiction.',
      },
    ],
  },
  /* ---------- Franklin County, Pennsylvania. Sources read 2026-09-29. ---------- */
  'greencastle-pa': {
    description:
      'Greencastle is a borough in Franklin County, Pennsylvania, ZIP 17225. It is not a township. Work inside borough limits needs a land-use/zoning permit from the borough zoning officer before a building permit. The borough office is 60 North Washington Street, Greencastle, PA 17225, phone 717-597-7143. After that permit, the building permit goes to PA Municipal Code Alliance at 1013 Wayne Avenue, Chambersburg, phone 717-496-4996. The borough refers to Historic District Maps. We check the parcel against them.',
    neighborhoods: ['Borough of Greencastle', 'ZIP 17225', 'Franklin County'],
    marketEmphasis: ['remodeling', 'bathrooms', 'kitchens', 'decks', 'roofing', 'additions'],
    faqs: [
      {
        question: 'Which permit comes first in the borough?',
        answer:
          'The land-use/zoning permit from the borough zoning officer. The building permit from PA Municipal Code Alliance comes after it, and the agency will want the borough permit in hand.',
      },
      {
        question: 'Where is the borough office?',
        answer:
          '60 North Washington Street, Greencastle, PA 17225. Phone 717-597-7143.',
      },
      {
        question: 'Does the historic-district map cover the whole ZIP?',
        answer:
          'The borough refers to Historic District Maps. Check the parcel.',
      },
    ],
  },
  'chambersburg-pa': {
    description:
      'Chambersburg is a borough and the county seat of Franklin County. It is not the rest of the county. A land-use permit from Land Use and Community Development comes first. That office is on the second floor of Borough Hall, 100 South Second Street, Chambersburg, PA 17201, phone 717-251-2417. After the borough approves, the applicant contacts PA Municipal Code Alliance at 717-496-4996 for the construction permit. Chapter 113 of the borough code adopts the Pennsylvania Uniform Construction Code.',
    neighborhoods: ['Borough of Chambersburg', 'Borough Hall', 'Franklin County'],
    marketEmphasis: ['remodeling', 'bathrooms', 'kitchens', 'decks', 'roofing', 'additions'],
    faqs: [
      {
        question: 'Does the county issue the Chambersburg land-use permit?',
        answer:
          'No. Inside the borough, land use starts at Borough Hall. The construction permit is the next step, through PA Municipal Code Alliance.',
      },
      {
        question: 'What code does the borough say it enforces?',
        answer:
          'Chapter 113 adopts the Pennsylvania Uniform Construction Code and says a land-use permit is required before a construction-permit application is accepted.',
      },
      {
        question: 'Is every Franklin County address a Chambersburg borough address?',
        answer:
          'No. The borough is not the rest of the county.',
      },
    ],
  },
  'fort-loudon-pa': {
    description:
      'Fort Loudon is a community in Peters Township, Franklin County. It is not a borough. Peters Township lists Fort Loudon with Upton, Lemasters, Markes, and Cove Gap as places under the township supervisors, and Mercersburg is a separate borough. The municipal office is 5000 Steel Avenue, Lemasters, PA 17231, open Monday, Tuesday, and Thursday, 8:00 AM to 4:00 PM. We confirm the building-code agency with the township before work starts. Fort Loudon is not in Loudoun County, Virginia.',
    neighborhoods: ['Fort Loudon', 'Peters Township', 'Lemasters'],
    marketEmphasis: ['remodeling', 'bathrooms', 'kitchens', 'decks', 'roofing', 'additions'],
    faqs: [
      {
        question: 'Is Fort Loudon its own borough?',
        answer:
          'No. Peters Township lists it as a community under the township supervisors. Mercersburg is the borough with its own government.',
      },
      {
        question: 'Which office handles permits for Fort Loudon?',
        answer:
          'The township office at 5000 Steel Avenue, Lemasters. We confirm the inspection agency with the township before work starts.',
      },
      {
        question: 'Is this Loudoun County, Virginia?',
        answer:
          'No. Fort Loudon is in Franklin County, Pennsylvania, not Loudoun County, Virginia.',
      },
    ],
  },
  'mercersburg-pa': {
    description:
      'Mercersburg is a borough in Franklin County, and it has its own government. Land use is handled by borough staff under the subdivision and land-use ordinance, and PA Municipal Code Alliance is the building-code agency for the borough. A project needs the borough land-use permit first, then the building permit from that agency. Other borough permits, such as sidewalk or curb work, can also apply.',
    neighborhoods: ['Borough of Mercersburg', 'Franklin County'],
    marketEmphasis: ['remodeling', 'bathrooms', 'kitchens', 'decks', 'roofing', 'additions'],
    faqs: [
      {
        question: 'Does Peters Township permit a house inside the borough?',
        answer:
          'No. The township site says Mercersburg has its own government. Borough staff issue the land-use permit. PA Municipal Code Alliance issues the building permit.',
      },
      {
        question: 'What is the order of the two permits?',
        answer:
          'Land-use permit from the borough, then the building permit from PA Municipal Code Alliance.',
      },
      {
        question: 'Is sidewalk work included in the land-use permit?',
        answer:
          'Not necessarily. Sidewalk or curb work can require an additional borough permit.',
      },
    ],
  },
  'waynesboro-pa': {
    description:
      'Waynesboro is a borough in Franklin County. Most projects need a zoning/land-use permit from the borough before a building permit, and the borough permit or an exemption is required first. Building permits are issued by PA Municipal Code Alliance at 380 Wayne Avenue, Chambersburg, phone 717-496-4996, or by Commonwealth Code Inspection Services at 1102 Sheller Avenue, Chambersburg, phone 717-264-9191. Check the deed for restrictions.',
    neighborhoods: ['Borough of Waynesboro', 'Franklin County'],
    marketEmphasis: ['remodeling', 'bathrooms', 'kitchens', 'decks', 'roofing', 'additions'],
    faqs: [
      {
        question: 'Can the building permit be pulled first?',
        answer:
          'No. The borough says a land-use permit or a land-use exemption has to come first, and the building-permit office will require it.',
      },
      {
        question: 'Who issues the building permit?',
        answer:
          'The borough names two agencies: PA Municipal Code Alliance at 380 Wayne Avenue, and Commonwealth Code Inspection Services at 1102 Sheller Avenue, both in Chambersburg.',
      },
    ],
  },
  'fayetteville-pa': {
    description:
      "Fayetteville is an unincorporated community in Franklin County. It is not a borough. The place sits in Greene Township and Guilford Township, so one mailing address is not one permit counter. Greene Township's land-use office is at 1145 Garver Lane, Chambersburg. After a land-use permit, the applicant contacts PA Municipal Code Alliance at 1013 Wayne Avenue, Chambersburg, phone 717-496-4996. Guilford Township's zoning office, 115 Spring Valley Road, Chambersburg, handles land-use and driveway permit requests, phone 717-264-0077. Check the parcel before choosing an office.",
    neighborhoods: ['Fayetteville', 'Greene Township', 'Guilford Township'],
    marketEmphasis: ['remodeling', 'bathrooms', 'kitchens', 'decks', 'roofing', 'additions'],
    faqs: [
      {
        question: 'Is Fayetteville one township?',
        answer:
          'No. It sits in Greene Township and Guilford Township. The parcel decides which office applies.',
      },
      {
        question: 'What does Greene Township publish?',
        answer:
          'A land-use permit first, from the office at 1145 Garver Lane. After that, the applicant contacts PA Municipal Code Alliance at 1013 Wayne Avenue.',
      },
      {
        question: 'What does Guilford Township publish?',
        answer:
          'Land-use and driveway permit requests go through the zoning office at 115 Spring Valley Road, phone 717-264-0077.',
      },
    ],
  },
  'garrett-park-md': {
    seoTitle: 'Remodeling Contractor in Garrett Park, MD | Real Elite',
    seoH1: 'Remodeling Contractor in Garrett Park, MD',
    seoDescription:
      'Remodeling contractor in Garrett Park, MD. County and town approval both apply. Kitchens, bathrooms, and basements. Free written estimate after a site walk.',
    description:
      "Garrett Park is an incorporated town in Montgomery County, ZIP 20896, a small grid of late-19th-century houses beside the MARC station. Kenilworth Avenue and Waverly Avenue are the streets most people mean. The drive from Martinsburg is I-81 south to I-70 east, then I-270 south.\n\nMontgomery County lists Garrett Park as needing both county and town approval. The county building permit and the town approval are both required. The town office is P.O. Box 84, Garrett Park, MD 20896, phone 301-933-7488. County permit questions go to the Department of Permitting Services at 2425 Reedie Drive, 7th floor, Wheaton, phone 240-777-0311, Monday through Friday, 7:30 a.m. to 4 p.m.\n\nThe county home-improvements list says an interior alteration will likely need a permit, and that installing, repairing, or replacing cabinets most likely will not. Electrical work is on the likely-permit list. Plumbing questions go to WSSC. Electrical work is a separately licensed trade. Real Elite does not take electrical work. The remodeling here is kitchens, bathrooms, and finished lower levels. The price is a free written estimate after a site walk.",
    neighborhoods: ['Kenilworth Avenue', 'Waverly Avenue', 'MARC station', 'ZIP 20896', 'Strathmore edge'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'remodeling', 'additions'],
    nearbySlugs: ['bethesda-md', 'chevy-chase-md', 'potomac-md', 'cabin-john-md'],
    faqs: [
      {
        question: 'Who permits a remodel in Garrett Park, MD?',
        answer:
          'Both. Garrett Park needs both county and city approval. The town contact is P.O. Box 84, Garrett Park, MD 20896, phone 301-933-7488. County questions go to 240-777-0311.',
      },
      {
        question: 'Does a cabinet replacement in Garrett Park need a county permit?',
        answer:
          'Installing, repairing, or replacing cabinets most likely will not need a permit. An interior alteration likely will. Municipal rules are separate from that guidance. A town approval applies only when the scope and Garrett Park\'s rules require it. A homeowners association has its own rules.',
      },
      {
        question: 'What does remodeling in Garrett Park cost?',
        answer:
          'Every Garrett Park kitchen, bathroom, and lower level is a free written estimate after a site walk. The written estimate names the scope for that house.',
      },
    ],
  },
  'bethesda-md': {
    seoTitle: 'Remodeling Contractor in Bethesda, MD | Real Elite',
    seoH1: 'Remodeling Contractor in Bethesda, MD',
    seoDescription:
      'Remodeling contractor in Bethesda, MD for ZIPs 20816, 20817, and 20814. Montgomery County permits. Free written estimate after a site walk.',
    description:
      "We work in three Bethesda ZIPs, not just downtown. ZIP 20816 is the Westmoreland and Kenwood side. ZIP 20817 runs toward Bradley Boulevard. ZIP 20814 is closer to downtown and NIH. A Bethesda mailing address is not one municipality. The drive from Martinsburg is I-81 south to I-70 east, then I-270 south toward the Beltway.\n\nBuilding permits go through the Montgomery County Department of Permitting Services, 2425 Reedie Drive, 7th floor, Wheaton, phone 240-777-0311. The lobby is open 7:30 a.m. to 4 p.m. Monday through Friday, and the county says no appointment is necessary. Bethesda is not one of the towns that add a municipal permit. The Town of Oakmont, which has a Bethesda 20817 mailing address, is county permit only.\n\nThe county home-improvements list puts interior alteration and electrical work on the likely-permit side, and cabinets, floor coverings, and bathroom caulking on the likely-no-permit side. Plumbing questions go to WSSC. Electrical work is a separately licensed trade. Real Elite does not take electrical work. The remodeling here is kitchens, bathrooms, and finished lower levels. The price is a free written estimate after a site walk.",
    neighborhoods: ['ZIP 20816', 'Westmoreland', 'Kenwood', 'ZIP 20817', 'Bradley Boulevard', 'ZIP 20814'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'remodeling', 'additions'],
    nearbySlugs: ['potomac-md', 'chevy-chase-md', 'garrett-park-md', 'cabin-john-md'],
    faqs: [
      {
        question: 'Which office permits a Bethesda kitchen or bath?',
        answer:
          'Montgomery County Department of Permitting Services, 2425 Reedie Drive, 7th floor, Wheaton, phone 240-777-0311. Hours are 7:30 a.m. to 4 p.m. Monday through Friday. Bethesda itself is not on the county list of towns that add a municipal permit.',
      },
      {
        question: 'Is every Bethesda 20817 address the same permit path?',
        answer:
          'No. The county lists the Town of Oakmont, which uses a Bethesda 20817 mailing address, as county permit only. A Bethesda mailing address is not automatically Oakmont. The parcel decides.',
      },
      {
        question: 'What does remodeling in Bethesda, MD cost?',
        answer:
          'Every Bethesda kitchen, bathroom, and lower level is a free written estimate after a site walk. ZIPs 20816, 20817, and 20814 are not one layout, and the estimate is for the house in front of us.',
      },
    ],
  },
  'arlington-va': {
    seoTitle: 'Remodeling Contractor in Arlington, VA | Real Elite',
    seoH1: 'Remodeling Contractor in Arlington, VA',
    seoDescription:
      'Remodeling contractor in Arlington, VA for ZIPs 22207, 22205, and 22213. Permit Arlington Center. Free written estimate after a site walk.',
    description:
      "In Arlington we work in the north-county ZIPs 22207, 22205, and 22213. ZIP 22207 is the northern residential band. ZIP 22205 includes the Westover and Bluemont side. ZIP 22213 is the smaller pocket. These are established houses, not a new subdivision. The drive from Martinsburg is Route 9 to Leesburg, then Route 7 east to I-66 and the Roosevelt Bridge approaches, or I-81 to I-66 east.\n\nArlington County says a permit is the official document that gives permission for construction or demolition of a building or structure, and for installing plumbing, among other work. The published permit types include a residential building permit, a deck permit, an electrical permit, a plumbing and gas permit, a mechanical permit, and waterproofing a basement. The county permits contact is the Ellen M. Bozman Government Center, 2100 Clarendon Boulevard, Arlington, VA 22201, through the Permit Arlington Center.\n\nElectrical work and gas work are separately licensed trades. Real Elite does not take electrical work. The remodeling here is kitchens, bathrooms, and finished lower levels. The price is a free written estimate after a site walk.",
    neighborhoods: ['ZIP 22207', 'ZIP 22205', 'Westover', 'Bluemont', 'ZIP 22213', 'Clarendon edge'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'remodeling', 'additions'],
    nearbySlugs: ['falls-church-va', 'alexandria-va', 'mclean-va', 'chevy-chase-md'],
    faqs: [
      {
        question: 'Who permits a remodel in Arlington, VA?',
        answer:
          'Arlington County, through the Permit Arlington Center. The county permits contact address is 2100 Clarendon Boulevard. Listed types include a residential building permit, plumbing and gas, electrical, mechanical, and waterproofing a basement.',
      },
      {
        question: 'Do ZIPs 22207, 22205, and 22213 use a different county?',
        answer:
          'No. They are Arlington County ZIPs. A Falls Church or Alexandria mailing address is a different jurisdiction and a different permit office.',
      },
      {
        question: 'What does remodeling in Arlington cost?',
        answer:
          'Every Arlington kitchen, bathroom, and lower level is a free written estimate after a site walk. The estimate names the scope for that house.',
      },
    ],
  },
  'potomac-md': {
    seoTitle: 'Remodeling Contractor in Potomac, MD | Real Elite',
    seoH1: 'Remodeling Contractor in Potomac, MD',
    seoDescription:
      'Remodeling contractor in Potomac, MD, ZIP 20854. Montgomery County permits along River Road and Falls Road. Free written estimate after a site walk.',
    description:
      "Potomac is a large-lot Montgomery County community, ZIP 20854, along River Road, Falls Road, and Glen Road. The houses are mostly later colonials and custom homes on wooded lots, not a town grid. It is not the Town of Garrett Park and it is not downtown Bethesda. The drive from Martinsburg is I-81 south to I-70 east, then I-270 south and River Road.\n\nPotomac is not on Montgomery County's list of municipalities that add a town permit. Building permits go through the Department of Permitting Services at 2425 Reedie Drive, 7th floor, Wheaton, phone 240-777-0311, Monday through Friday, 7:30 a.m. to 4 p.m. The county says an interior alteration will likely need a permit. Cabinets, floor coverings, and bathroom caulking are on the likely-no-permit list. Electrical work is on the likely-permit list. Plumbing questions go to WSSC.\n\nThe county lists do not cover homeowners-association rules. A county permit is not association approval. Electrical work is a separately licensed trade. Real Elite does not take electrical work. The remodeling here is kitchens, bathrooms, and finished lower levels. The price is a free written estimate after a site walk.",
    neighborhoods: ['River Road', 'Falls Road', 'Glen Road', 'ZIP 20854', 'Piney Meetinghouse', 'Travillah'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'remodeling', 'additions'],
    nearbySlugs: ['bethesda-md', 'cabin-john-md', 'great-falls-va', 'mclean-va'],
    faqs: [
      {
        question: 'Does Potomac have its own building department?',
        answer:
          'Not on the county municipalities list. Potomac is not among the towns that add a municipal permit. The county office is the Department of Permitting Services in Wheaton, phone 240-777-0311.',
      },
      {
        question: 'Does an interior kitchen change in Potomac need a permit?',
        answer:
          'An interior alteration will likely need a permit. Cabinet install, repair, or replacement most likely will not. Electrical work is on the likely-permit list. Plumbing questions go to WSSC.',
      },
      {
        question: 'What does remodeling in Potomac, MD cost?',
        answer:
          'Every Potomac kitchen, bathroom, and lower level is a free written estimate after a site walk. A River Road house and a Falls Road house are not the same scope.',
      },
    ],
  },
  'cabin-john-md': {
    seoTitle: 'Remodeling Contractor in Cabin John, MD | Real Elite',
    seoH1: 'Remodeling Contractor in Cabin John, MD',
    seoDescription:
      'Remodeling contractor in Cabin John, MD, ZIP 20818, along MacArthur Boulevard. Montgomery County permits. Free written estimate after a site walk.',
    description:
      "Cabin John is a narrow Montgomery County community along MacArthur Boulevard, ZIP 20818, between the Potomac and the Cabin John Parkway. Houses sit close to the road and to the canal. It is not Potomac's large-lot interior and it is not Glen Echo's town hall. The drive from Martinsburg is I-81 south to I-70 east, then I-270 south to the Beltway and the Cabin John Parkway.\n\nCabin John is not on Montgomery County's list of municipalities that add a town permit. The county office is the Department of Permitting Services, 2425 Reedie Drive, 7th floor, Wheaton, phone 240-777-0311. Hours are 7:30 a.m. to 4 p.m. Monday through Friday. Interior alteration and electrical work are on the county's likely-permit list. Cabinets and bathroom caulking are on the likely-no-permit list. Plumbing questions go to WSSC.\n\nHomeowners-association rules, where a lot has them, are separate from the county guidance. The county says to check them separately. Electrical work is a separately licensed trade. Real Elite does not take electrical work. The remodeling here is kitchens, bathrooms, and finished lower levels. The price is a free written estimate after a site walk.",
    neighborhoods: ['MacArthur Boulevard', 'ZIP 20818', 'Cabin John Parkway', 'Canal edge', '79th Street', 'Tomlinson Avenue'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'remodeling', 'additions'],
    nearbySlugs: ['bethesda-md', 'potomac-md', 'garrett-park-md', 'great-falls-va'],
    faqs: [
      {
        question: 'Who permits work in Cabin John?',
        answer:
          'Montgomery County Department of Permitting Services. Cabin John is not on the county list of municipalities that require a town permit in addition to the county permit. The county phone is 240-777-0311.',
      },
      {
        question: 'Is Cabin John the same permit path as Glen Echo?',
        answer:
          'No. The county lists Glen Echo under county permit before city approval. Cabin John is not on that list. A Glen Echo address is a different filing from a Cabin John address.',
      },
      {
        question: 'What does remodeling in Cabin John cost?',
        answer:
          'Every Cabin John kitchen, bathroom, and lower level is a free written estimate after a site walk. A house tight to MacArthur Boulevard is not a Potomac acreage plan.',
      },
    ],
  },
  'west-friendship-md': {
    seoTitle: 'Remodeling Contractor in West Friendship, MD | Real Elite',
    seoH1: 'Remodeling Contractor in West Friendship, MD',
    seoDescription:
      'Remodeling contractor in West Friendship, MD, ZIP 21794. Howard County permits through DILP in Ellicott City. Free written estimate after a site walk.',
    description:
      "West Friendship is western Howard County, ZIP 21794, along MD 32 between the Frederick County line and the more suburban county to the east. Houses are detached homes on rural and semi-rural lots, not a Columbia village and not a Frederick city street. The drive from Martinsburg is I-81 south to I-70 east, then south on MD 32.\n\nHoward County's Department of Inspections, Licenses and Permits approves and issues permits and enforces the county building codes. The office is at 3430 Courthouse Drive, Ellicott City, MD 21043, phone 410-313-2455. The Licenses and Permits Division publishes the same number, option 4. Residential building permits require electronic submission. Filing fees are nonrefundable and payable when the application is made. The county has separate electrical, plumbing, and mechanical permit applications. Fee amounts stay on the county fee schedule.\n\nElectrical work and gas work are separately licensed trades. Real Elite does not take electrical work. The remodeling here is kitchens, bathrooms, and finished lower levels. The price is a free written estimate after a site walk.",
    neighborhoods: ['MD 32', 'ZIP 21794', 'Triadelphia Road', 'West of MD 32', 'Frederick County line'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'remodeling', 'additions'],
    nearbySlugs: ['frederick-md', 'mount-airy-md', 'ijamsville-md', 'monrovia-md'],
    faqs: [
      {
        question: 'Who permits a remodel in West Friendship?',
        answer:
          'Howard County Department of Inspections, Licenses and Permits, 3430 Courthouse Drive, Ellicott City, phone 410-313-2455. Residential building permits require electronic submission.',
      },
      {
        question: 'Does West Friendship use the Frederick County permit office?',
        answer:
          'No. West Friendship is Howard County. A Frederick County town uses a different permit office. The Howard County counter is in Ellicott City.',
      },
      {
        question: 'What does remodeling in West Friendship cost?',
        answer:
          'Every West Friendship kitchen, bathroom, and lower level is a free written estimate after a site walk. County filing fees are on the published fee schedule and are not a project price.',
      },
    ],
  },
  'chevy-chase-md': {
    seoTitle: 'Remodeling Contractor in Chevy Chase, MD | Real Elite',
    seoH1: 'Remodeling Contractor in Chevy Chase, MD',
    seoDescription:
      'Remodeling contractor in Chevy Chase, MD, ZIP 20815. Town and county approval order depends on the municipality. Free written estimate after a site walk.',
    description:
      "Chevy Chase in ZIP 20815 is several municipalities along Connecticut Avenue, not one town hall. The Town of Chevy Chase, Chevy Chase Village, Section 3, Section 5, the Village of North Chevy Chase, Martin's Additions, and Friendship Heights can share a mailing area and still file in a different order. The drive from Martinsburg is I-81 south to I-70 east, then I-270 south to Connecticut Avenue.\n\nMontgomery County says several municipalities require a building permit in addition to the required county building permit. It lists the Town of Chevy Chase, Chevy Chase Section 3, Chevy Chase Section 5, and the Village of Martin's Additions as county permit before city approval. It lists the Village of North Chevy Chase as both county and city approval. Friendship Heights is county permit only. Chevy Chase Village appears on both the city-first list and the county-first list, so the parcel is confirmed with the village at 5906 Connecticut Avenue, phone 301-654-7300, before a sequence is assumed. The Town of Chevy Chase office is 4301 Willow Lane, phone 301-654-7144.\n\nCounty questions go to the Department of Permitting Services, 2425 Reedie Drive, 7th floor, Wheaton, phone 240-777-0311. The home-improvements list still says an interior alteration will likely need a permit, and that the list does not include municipal rules. Electrical work is a separately licensed trade. Real Elite does not take electrical work. The price is a free written estimate after a site walk.",
    neighborhoods: ['Connecticut Avenue', 'ZIP 20815', 'Town of Chevy Chase', 'Chevy Chase Village', 'Section 3', 'Section 5'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'remodeling', 'additions'],
    nearbySlugs: ['bethesda-md', 'garrett-park-md', 'arlington-va', 'potomac-md'],
    faqs: [
      {
        question: 'Does every Chevy Chase address use the same approval order?',
        answer:
          "No. For the Town of Chevy Chase, Section 3, Section 5, and Martin's Additions, the order is county permit before city approval. North Chevy Chase is listed as both. Friendship Heights is county permit only. Chevy Chase Village is listed on both sequence lists, so the village is asked before a sequence is assumed.",
      },
      {
        question: 'Where is the county permit office for a Chevy Chase house?',
        answer:
          'Montgomery County Department of Permitting Services, 2425 Reedie Drive, 7th floor, Wheaton, phone 240-777-0311. The town or village step is additional. It does not replace the county permit where the county says both are required.',
      },
      {
        question: 'What does remodeling in Chevy Chase cost?',
        answer:
          'Every Chevy Chase kitchen, bathroom, and lower level is a free written estimate after a site walk. The municipality on the parcel is named in that estimate before any filing.',
      },
    ],
  },
  'catharpin-va': {
    seoTitle: 'Remodeling Contractor in Catharpin, VA | Real Elite',
    seoH1: 'Remodeling Contractor in Catharpin, VA',
    seoDescription:
      'Remodeling contractor in Catharpin, VA, ZIP 20143. Prince William County building permits. Free written estimate after a site walk.',
    description:
      "Catharpin is western Prince William County, ZIP 20143, on the rural side of the county toward Route 15 and Catharpin Road. It is not Haymarket's incorporated village and it is not a Gainesville subdivision. The drive from Martinsburg is Route 9 to Leesburg, then Route 15 south.\n\nBuilding permits are issued by the Prince William County Building Development Division. The division phone is (703) 792-4311. Residential projects are one-family and two-family dwellings and townhouses. The county says a permit is always required for finishing a basement, for an addition, and for removing or altering structural members or altering plumbing, electrical, or heating and air conditioning. Installation or replacement of cabinetry or trim does not require a permit. Replacing existing plumbing fixtures does not, when the supply and the drain, waste, and vent stay as they are.\n\nZoning approval is a separate counter for exterior work and for a secondary food-preparation area in a basement. An association covenant is not a county permit. Electrical work and gas work are separately licensed trades. Real Elite does not take electrical work. The price is a free written estimate after a site walk.",
    neighborhoods: ['Catharpin Road', 'Route 15', 'ZIP 20143', 'Waterfall Road', 'John Marshall Highway', 'Aden Road edge'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'remodeling', 'additions'],
    nearbySlugs: ['haymarket-va', 'gainesville-va', 'nokesville-va', 'bristow-va'],
    faqs: [
      {
        question: 'Who permits a remodel in Catharpin, VA?',
        answer:
          'Prince William County Building Development Division, phone (703) 792-4311. Catharpin is not an incorporated town with its own building department.',
      },
      {
        question: 'Does finishing a basement in Catharpin need a permit?',
        answer:
          'Yes. The county residential list says a permit is always required for finishing a basement. Applications go through the county ePortal. Zoning comes first, and the zoning counter does not issue approvals after 4 p.m.',
      },
      {
        question: 'What does remodeling in Catharpin cost?',
        answer:
          'Every Catharpin kitchen, bathroom, and lower level is a free written estimate after a site walk. Permit fees come from the county fee schedule and are not a project price.',
      },
    ],
  },
  'glenwood-md': {
    seoTitle: 'Remodeling Contractor in Glenwood, MD | Real Elite',
    seoH1: 'Remodeling Contractor in Glenwood, MD',
    seoDescription:
      'Remodeling contractor in Glenwood, MD, ZIP 21737. Howard County permits through DILP in Ellicott City. Free written estimate after a site walk.',
    description:
      "Glenwood is western Howard County, ZIP 21737, where MD 97 meets Ten Oaks Road and Burntwoods Road. The houses are detached homes on larger lots, not a Columbia village and not Ellicott City's historic downtown. The drive from Martinsburg is I-81 south to I-70 east, then south on MD 97.\n\nHoward County's Department of Inspections, Licenses and Permits approves and issues permits and enforces the county building codes, including building, mechanical, plumbing, and electrical. The office is at 3430 Courthouse Drive, Ellicott City, MD 21043, phone 410-313-2455. General permit questions use option 4. The front counter closes at 5:00 p.m., and the county asks visitors to arrive by 4:00 p.m. Residential building permits require electronic submission. Filing fees are nonrefundable and payable when the application is made.\n\nA house on a private well and septic needs Health Department approval before the permit. That number is 410-313-6300. Electrical work is a separately licensed trade. Real Elite does not take electrical work. The remodeling here is kitchens, bathrooms, and finished lower levels. The price is a free written estimate after a site walk.",
    neighborhoods: ['MD 97', 'Ten Oaks Road', 'Burntwoods Road', 'ZIP 21737'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'remodeling', 'additions'],
    nearbySlugs: ['west-friendship-md', 'woodbine-md', 'clarksville-md', 'frederick-md'],
    faqs: [
      {
        question: 'Who permits a remodel in Glenwood, MD?',
        answer:
          'Howard County Department of Inspections, Licenses and Permits, 3430 Courthouse Drive, Ellicott City, phone 410-313-2455, option 4. Residential building permits require electronic submission.',
      },
      {
        question: 'Does a Glenwood house on a well use a different first step?',
        answer:
          'Yes, when the house is on a private well and septic. The county requires Health Department approval first. The Health Department number is 410-313-6300.',
      },
      {
        question: 'What does remodeling in Glenwood cost?',
        answer:
          'Every Glenwood kitchen, bathroom, and lower level is a free written estimate after a site walk. County filing fees are on the published fee schedule and are not a project price.',
      },
    ],
  },
  'clarksville-md': {
    seoTitle: 'Remodeling Contractor in Clarksville, MD | Real Elite',
    seoH1: 'Remodeling Contractor in Clarksville, MD',
    seoDescription:
      'Remodeling contractor in Clarksville, MD, ZIP 21029. Howard County permits through DILP. Free written estimate after a site walk.',
    description:
      "Clarksville is southern Howard County, ZIP 21029, around the crossing of MD 108 and MD 32. River Hill lots and the older Clarksville streets share that ZIP and still use the county office in Ellicott City. The drive from Martinsburg is I-81 south to I-70 east, then MD 32 south.\n\nThe Department of Inspections, Licenses and Permits is at 3430 Courthouse Drive, Ellicott City, MD 21043. Residential building permits require electronic submission. The resources list keeps electrical, plumbing, and mechanical applications separate from the residential building permit. Filing fees are nonrefundable and payable when the application is made. Questions go to 410-313-2455, option 4. The front counter closes at 5:00 p.m. Arrive by 4:00 p.m.\n\nElectrical work is a separately licensed trade. Real Elite does not take electrical work. The remodeling here is kitchens, bathrooms, and finished lower levels. The price is a free written estimate after a site walk.",
    neighborhoods: ['MD 108', 'MD 32', 'ZIP 21029', 'Clarksville Pike', 'Ten Oaks Road'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'remodeling', 'additions'],
    nearbySlugs: ['glenwood-md', 'west-friendship-md', 'woodbine-md', 'frederick-md'],
    faqs: [
      {
        question: 'Who permits a remodel in Clarksville, MD?',
        answer:
          'Howard County Department of Inspections, Licenses and Permits, phone 410-313-2455, option 4. The office is 3430 Courthouse Drive, Ellicott City. Residential building permits require electronic submission.',
      },
      {
        question: 'Does Clarksville file at a town hall?',
        answer:
          'No. Clarksville uses the county department in Ellicott City. Electrical, plumbing, and mechanical applications are listed separately from the residential building permit.',
      },
      {
        question: 'What does remodeling in Clarksville cost?',
        answer:
          'Every Clarksville kitchen, bathroom, and lower level is a free written estimate after a site walk. Filing fees are nonrefundable and due when the application is made. They are not the project price.',
      },
    ],
  },
  'brookeville-md': {
    seoTitle: 'Remodeling Contractor in Brookeville, MD | Real Elite',
    seoH1: 'Remodeling Contractor in Brookeville, MD',
    seoDescription:
      'Remodeling contractor in Brookeville, MD, ZIP 20833. Inside town limits, town approval comes before the county application. Free written estimate after a site walk.',
    description:
      "Brookeville is a small town in northern Montgomery County at MD 97 and High Street. Many ZIP 20833 addresses are outside the town, so the parcel decides. Inside the Town of Brookeville, town approval comes before the county application; a ZIP 20833 home outside town limits goes straight to Montgomery County. Town questions go to 5 High Street, Brookeville, MD 20833, phone 301-570-4465. The drive from Martinsburg is I-81 south to I-70 east, then MD 97 south.\n\nCounty questions go to the Department of Permitting Services, 2425 Reedie Drive, 7th floor, Wheaton, phone 240-777-0311. Hours are 7:30 a.m. to 4 p.m. Monday through Friday, and no appointment is necessary. An interior alteration will likely need a permit. Installing, repairing, or replacing cabinets most likely will not. Municipality rules and homeowners-association rules are separate from that guidance. Electrical work is on the likely-permit list. Plumbing questions go to WSSC.\n\nElectrical work is a separately licensed trade. Real Elite does not take electrical work. The remodeling here is kitchens, bathrooms, and finished lower levels. The price is a free written estimate after a site walk.",
    neighborhoods: ['High Street', 'MD 97', 'ZIP 20833', 'Market Street', 'Brookeville Road'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'remodeling', 'additions'],
    nearbySlugs: ['dickerson-md', 'kensington-md', 'bethesda-md', 'potomac-md'],
    faqs: [
      {
        question: 'Who permits a remodel in Brookeville, MD?',
        answer:
          'If the home is inside the Town of Brookeville, the town first, then the county. Outside town limits, the county alone. Town questions go to 5 High Street, Brookeville, MD 20833, phone 301-570-4465. County questions go to 240-777-0311.',
      },
      {
        question: 'Does a cabinet replacement in Brookeville skip the town?',
        answer:
          'Installing, repairing, or replacing cabinets most likely will not need a permit. Municipality rules are separate from that guidance. An interior alteration likely will. Town questions go to 301-570-4465 before a sequence is assumed.',
      },
      {
        question: 'What does remodeling in Brookeville cost?',
        answer:
          'Every Brookeville kitchen, bathroom, and lower level is a free written estimate after a site walk. The written estimate names the scope for that house.',
      },
    ],
  },
  'broad-run-va': {
    seoTitle: 'Remodeling Contractor in Broad Run, VA | Real Elite',
    seoH1: 'Remodeling Contractor in Broad Run, VA',
    seoDescription:
      'Remodeling contractor in Broad Run, VA, ZIP 20137. Loudoun County permits through Building and Development in Leesburg. Free written estimate after a site walk.',
    description:
      "Broad Run is western Loudoun County, ZIP 20137, along Evergreen Mills Road south of Leesburg. The houses are established homes on county lots. The drive from Martinsburg is Route 9 to Leesburg, then south on Evergreen Mills Road.\n\nLoudoun County says permits come from the appropriate county agencies and towns before construction starts. Renovations, alterations, and finished basements are on the county's typical residential permit list. If the parcel is inside an incorporated town, the county asks for an approved town zoning permit with the application. Questions go to Building and Development at the Loudoun County Government Center, 1 Harrison Street SE, Leesburg, VA 20175, phone 703-777-0220. The counter is open Monday through Friday, 8:30 a.m. to 5 p.m. Applications go online in LandMARC or in person.\n\nA residential alteration uses a building permit fee based on 1% of construction costs, plus a $130 plan review fee. Those are county fees, not a project price. Electrical, gas, mechanical, and plumbing are separate trade permits. A lot on a well and septic needs Health Department approval before the application. That number is (703) 777-0234. Electrical work and gas work are separately licensed trades. Real Elite does not take electrical work. The price is a free written estimate after a site walk.",
    neighborhoods: ['Evergreen Mills Road', 'ZIP 20137', 'Route 621', 'south of Leesburg'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'remodeling', 'additions'],
    nearbySlugs: ['leesburg-va', 'hamilton-va', 'purcellville-va', 'middleburg-va'],
    faqs: [
      {
        question: 'Who permits a remodel in Broad Run, VA?',
        answer:
          'Loudoun County Building and Development, 1 Harrison Street SE, Leesburg, phone 703-777-0220. Renovations and alterations are on the typical residential permit list. Applications go through LandMARC or the Leesburg counter.',
      },
      {
        question: 'What if a Broad Run mailing address sits inside a town?',
        answer:
          'The county says a parcel inside an incorporated town needs an approved town zoning permit with the application. We confirm the permit steps with the county before work starts.',
      },
      {
        question: 'What does remodeling in Broad Run cost?',
        answer:
          'Every Broad Run kitchen, bathroom, and lower level is a free written estimate after a site walk. The alteration fee of 1% of construction costs plus $130 for plan review is a county fee, not the project price.',
      },
    ],
  },
  'kensington-md': {
    seoTitle: 'Remodeling Contractor in Kensington, MD | Real Elite',
    seoH1: 'Remodeling Contractor in Kensington, MD',
    seoDescription:
      'Remodeling contractor in Kensington, MD, ZIP 20895. The county permit comes before town approval. Free written estimate after a site walk.',
    description:
      "Kensington in ZIP 20895 includes the Town of Kensington along Connecticut Avenue and Mitchell Street. For the Town of Kensington, the county permit is required prior to city approval. Town questions go to 3710 Mitchell Street, Kensington, MD 20895, phone 301-949-2424. The drive from Martinsburg is I-81 south to I-70 east, then I-270 south toward Connecticut Avenue.\n\nChevy Chase View uses a Kensington mailing address, P.O. Box 136, Kensington, MD 20895, and the county lists Chevy Chase View under both county and city approval. A Kensington 20895 address is not automatically the Town of Kensington. The parcel decides. County questions go to the Department of Permitting Services, 2425 Reedie Drive, 7th floor, Wheaton, phone 240-777-0311, Monday through Friday, 7:30 a.m. to 4 p.m.\n\nAn interior alteration will likely need a permit. Municipality rules and homeowners-association rules are separate from that guidance. Cabinets most likely will not need a permit. Electrical work likely will. Plumbing questions go to WSSC. Electrical work is a separately licensed trade. Real Elite does not take electrical work. The price is a free written estimate after a site walk.",
    neighborhoods: ['Connecticut Avenue', 'Mitchell Street', 'ZIP 20895', 'Plyers Mill Road', 'Howard Avenue'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'remodeling', 'additions'],
    nearbySlugs: ['bethesda-md', 'chevy-chase-md', 'brookeville-md', 'garrett-park-md'],
    faqs: [
      {
        question: 'Who permits a remodel in Kensington, MD?',
        answer:
          'The county permit first, then the Town of Kensington. Kensington requires the county permit prior to city approval. Town questions go to 3710 Mitchell Street, phone 301-949-2424. County questions go to 240-777-0311.',
      },
      {
        question: 'Is every Kensington 20895 address the Town of Kensington?',
        answer:
          'No. Chevy Chase View uses P.O. Box 136, Kensington, MD 20895, and the county lists it under both county and city approval. The parcel decides which order applies.',
      },
      {
        question: 'What does remodeling in Kensington cost?',
        answer:
          'Every Kensington kitchen, bathroom, and lower level is a free written estimate after a site walk. The municipality on the parcel is named in that estimate before any filing.',
      },
    ],
  },
  'woodbine-md': {
    seoTitle: 'Remodeling Contractor in Woodbine, MD | Real Elite',
    seoH1: 'Remodeling Contractor in Woodbine, MD',
    seoDescription:
      'Remodeling contractor in Woodbine, MD, ZIP 21797. The parcel decides the county permit office. Free written estimate after a site walk.',
    description:
      "Woodbine, ZIP 21797, sits along MD 94 between Lisbon and the Carroll County line. Carroll County zoning cases include Woodbine addresses in that ZIP, including 5407 Woodbine Road. A Howard County parcel and a Carroll County parcel are not the same filing. The drive from Martinsburg is I-81 south to I-70 east, then north on MD 94.\n\nWhen the parcel is in Howard County, permits go through the Department of Inspections, Licenses and Permits at 3430 Courthouse Drive, Ellicott City, MD 21043, phone 410-313-2455, option 4. Residential building permits require electronic submission. Filing fees are nonrefundable and payable when the application is made. A plumbing permit for a water heater, gas or electric, must be pulled by a master plumber, and an inspection is required. A house on a private well and septic needs Health Department approval first, at 410-313-6300. We confirm the county and the permit office for the parcel before work starts.\n\nElectrical work is a separately licensed trade. Real Elite does not take electrical work. The remodeling here is kitchens, bathrooms, and finished lower levels. The price is a free written estimate after a site walk.",
    neighborhoods: ['MD 94', 'ZIP 21797', 'Lisbon edge', 'Woodbine Road', 'Carroll County line'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'remodeling', 'additions'],
    nearbySlugs: ['glenwood-md', 'west-friendship-md', 'mount-airy-md', 'frederick-md'],
    faqs: [
      {
        question: 'Who permits a remodel in Woodbine, MD?',
        answer:
          'The parcel decides. A Howard County parcel uses the Department of Inspections, Licenses and Permits, 3430 Courthouse Drive, Ellicott City, phone 410-313-2455, option 4. Carroll County zoning cases also list Woodbine addresses in ZIP 21797. We confirm the office before work starts.',
      },
      {
        question: 'Is every Woodbine address the same county office?',
        answer:
          'No. ZIP 21797 includes Woodbine addresses in Carroll County zoning cases, including 5407 Woodbine Road. A Howard County parcel uses the Ellicott City counter, and visitors should arrive by 4:00 p.m. We confirm the office for the parcel before work starts.',
      },
      {
        question: 'What does remodeling in Woodbine cost?',
        answer:
          'Every Woodbine kitchen, bathroom, and lower level is a free written estimate after a site walk. County filing fees are on the published fee schedule and are not a project price.',
      },
    ],
  },
  'dickerson-md': {
    seoTitle: 'Remodeling Contractor in Dickerson, MD | Real Elite',
    seoH1: 'Remodeling Contractor in Dickerson, MD',
    seoDescription:
      'Remodeling contractor in Dickerson, MD, ZIP 20842. Montgomery County permits in Wheaton. Free written estimate after a site walk.',
    description:
      "Dickerson is western Montgomery County, ZIP 20842, along MD 28 toward the Potomac and the Monocacy. It is farm and village lots, not a Bethesda street and not the Town of Poolesville. The drive from Martinsburg is I-81 south to I-70 east, then south toward MD 28.\n\nCounty questions go to the Department of Permitting Services at 2425 Reedie Drive, 7th floor, Wheaton, phone 240-777-0311, Monday through Friday, 7:30 a.m. to 4 p.m. We confirm the permit steps for the parcel before work starts. An interior alteration will likely need a permit. Cabinet install, repair, or replacement most likely will not. Bathroom caulking most likely will not. Electrical work likely will. Plumbing questions go to WSSC. A well or a septic system likely needs a permit.\n\nHomeowners-association rules, where a lot has them, are separate from the county guidance. Electrical work is a separately licensed trade. Real Elite does not take electrical work. The remodeling here is kitchens, bathrooms, and finished lower levels. The price is a free written estimate after a site walk.",
    neighborhoods: ['MD 28', 'ZIP 20842', 'Monocacy edge', 'Dickerson Road', 'Potomac edge'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'remodeling', 'additions'],
    nearbySlugs: ['brookeville-md', 'potomac-md', 'kensington-md', 'bethesda-md'],
    faqs: [
      {
        question: 'Who permits a remodel in Dickerson, MD?',
        answer:
          'County questions go to the Department of Permitting Services, 2425 Reedie Drive, 7th floor, Wheaton, phone 240-777-0311. We confirm the permit steps for the parcel before work starts.',
      },
      {
        question: 'Does an interior kitchen change in Dickerson need a permit?',
        answer:
          'The county says an interior alteration will likely need a permit, and that cabinet install, repair, or replacement most likely will not. Electrical work is on the likely-permit list. Plumbing questions go to WSSC.',
      },
      {
        question: 'What does remodeling in Dickerson cost?',
        answer:
          'Every Dickerson kitchen, bathroom, and lower level is a free written estimate after a site walk. An MD 28 farmhouse and a smaller village house are not the same scope.',
      },
    ],
  },
  'delaplane-va': {
    seoTitle: 'Remodeling Contractor in Delaplane, VA | Real Elite',
    seoH1: 'Remodeling Contractor in Delaplane, VA',
    seoDescription:
      'Remodeling contractor in Delaplane, VA, ZIP 20144. Fauquier County permits in Warrenton. Free written estimate after a site walk.',
    description:
      "Delaplane is Fauquier County, ZIP 20144, along Route 17 between Upperville and Marshall. The houses are established homes on county lots. The drive from Martinsburg is Route 9 to Leesburg, then Route 17 south.\n\nA building permit is required for renovations and alterations to an existing house. Building and trade permits are required for a kitchen or bath remodel and for a wall or partition change. A zoning permit is required for most work, including some interior renovations. On an interior renovation the zoning permit is typically not required, and it may be required when the work is a basement, so the parcel and the scope decide. The walk-through program is suspended indefinitely. Questions go to 16 Courthouse Square, Warrenton, VA 20186, phone 540-422-8230. Office hours are Monday through Friday, 8:00 a.m. to 4:30 p.m. In-person applications are not accepted after 4 p.m. We confirm the permit steps for the parcel before work starts.\n\nAdding bedrooms on a private well and septic needs a Health Department construction permit or the SAP form. A new bathroom on public water and sewer needs the public utility's approval. If the parcel is in a conservation easement, the county attorney's compliance form is required with the application. Electrical work and gas work are separately licensed trades. Real Elite does not take electrical work. The remodeling here is kitchens, bathrooms, and finished lower levels. The price is a free written estimate after a site walk.",
    neighborhoods: ['Route 17', 'ZIP 20144', 'John S. Mosby Highway', 'between Upperville and Marshall'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'remodeling', 'additions'],
    nearbySlugs: ['upperville-va', 'marshall-va', 'the-plains-va', 'warrenton-va'],
    faqs: [
      {
        question: 'Who permits a remodel in Delaplane, VA?',
        answer:
          'Fauquier County Community Development, 16 Courthouse Square, Warrenton, VA 20186, phone 540-422-8230. A building permit is required for renovations and alterations. We confirm the permit steps for the parcel before work starts.',
      },
      {
        question: 'Does a Delaplane basement use the same permit as a kitchen?',
        answer:
          'A kitchen or bath remodel needs building and trade permits. A zoning permit may be required when the work is a basement. The walk-through program is suspended indefinitely. The parcel and the scope decide.',
      },
      {
        question: 'What does remodeling in Delaplane cost?',
        answer:
          'Every Delaplane kitchen, bathroom, and lower level is a free written estimate after a site walk. County fees are not that price.',
      },
    ],
  },
  'marriottsville-md': {
    seoTitle: 'Remodeling Contractor in Marriottsville, MD | Real Elite',
    seoH1: 'Remodeling Contractor in Marriottsville, MD',
    seoDescription:
      'Remodeling contractor in Marriottsville, MD, ZIP 21104. The parcel decides the county before any permit office. Free written estimate after a site walk.',
    description:
      "Marriottsville remodeling is ZIP 21104, along Marriottsville Road near the Patapsco. The houses are detached homes on county lots, not Ellicott City's Main Street. A 21104 mailing address does not decide the county. We confirm the parcel's county before any permit steps. The drive from Martinsburg is I-81 south to I-70 east, then south on Marriottsville Road.\n\nWhen the parcel is in Howard County, questions go to the Department of Inspections, Licenses and Permits, 3430 Courthouse Drive, Ellicott City, MD 21043, phone 410-313-2455, option 4. The front counter closes at 5:00 p.m. Arrive by 4:00 p.m. A Howard County house on a private well and septic needs Health Department approval before the permit. That number is 410-313-6300.\n\nWhen the parcel is in Howard County, a plumbing permit for a water heater, gas or electric, must be pulled by a master plumber, and an inspection is required. Electrical work is a separately licensed trade. Real Elite does not take electrical work. The remodeling here is kitchens, bathrooms, and finished lower levels. The price is a free written estimate after a site walk.",
    neighborhoods: ['Marriottsville Road', 'ZIP 21104', 'Patapsco edge', 'Old Frederick Road'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'remodeling', 'additions'],
    nearbySlugs: ['west-friendship-md', 'glenwood-md', 'woodbine-md', 'ellicott-city-md'],
    faqs: [
      {
        question: 'Who permits a remodel in Marriottsville, MD?',
        answer:
          'The parcel decides the county. When it is Howard County, questions go to the Department of Inspections, Licenses and Permits, 3430 Courthouse Drive, Ellicott City, phone 410-313-2455, option 4. We confirm the permit steps for the parcel before work starts.',
      },
      {
        question: 'Does a Marriottsville house on a well use a different first step?',
        answer:
          'When the parcel is in Howard County and the house is on a private well and septic, Health Department approval comes before the permit. That number is 410-313-6300. We confirm that sequence for the parcel before work starts.',
      },
      {
        question: 'What does remodeling in Marriottsville cost?',
        answer:
          'Every Marriottsville kitchen, bathroom, and lower level is a free written estimate after a site walk. A water-heater permit is a plumbing permit, not the project price.',
      },
    ],
  },
  'ellicott-city-md': {
    seoTitle: 'Remodeling Contractor in Ellicott City, MD | Real Elite',
    seoH1: 'Remodeling Contractor in Ellicott City, MD',
    seoDescription:
      'Remodeling contractor in Ellicott City, MD, ZIP 21042 and ZIP 21043. The parcel decides the county before a permit office is named. Free written estimate after a site walk.',
    description:
      "Ellicott City remodeling covers ZIP 21042 and ZIP 21043. Main Street and the Patapsco are one part of that mailing area. Those ZIPs do not, by themselves, name the county. We confirm the parcel's county before a permit office is assigned. The drive from Martinsburg is I-81 south to I-70 east, then into Ellicott City.\n\nWhen the parcel is in Howard County, questions go to the Department of Inspections, Licenses and Permits, 3430 Courthouse Drive, Ellicott City, MD 21043, phone 410-313-2455, option 4. The front counter closes at 5:00 p.m. Arrive by 4:00 p.m. A Howard County house on a private well and septic needs Health Department approval first, at 410-313-6300. We confirm the permit steps for the parcel before work starts.\n\nA water-heater replacement in Howard County needs a plumbing permit pulled by a master plumber, and an inspection is required. Electrical work is a separately licensed trade. Real Elite does not take electrical work. The remodeling here is kitchens, bathrooms, and finished lower levels. The price is a free written estimate after a site walk.",
    neighborhoods: ['Main Street', 'ZIP 21042', 'ZIP 21043', 'Courthouse Drive', 'Patapsco', 'Frederick Road'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'remodeling', 'additions'],
    nearbySlugs: ['clarksville-md', 'west-friendship-md', 'marriottsville-md', 'glenwood-md'],
    faqs: [
      {
        question: 'Who permits a remodel in Ellicott City, MD?',
        answer:
          'The parcel decides the county. When it is Howard County, questions go to 3430 Courthouse Drive, Ellicott City, MD 21043, phone 410-313-2455, option 4. ZIP 21042 and ZIP 21043 are the mailing area, not the permit office.',
      },
      {
        question: 'Do ZIP 21042 and ZIP 21043 file at different counters?',
        answer:
          'No single counter is assumed from the ZIP. ZIP 21042 and ZIP 21043 are both Ellicott City mailing areas. When the parcel is in Howard County, questions go to 3430 Courthouse Drive. The front counter closes at 5:00 p.m. Arrive by 4:00 p.m. A Howard County well and septic house needs Health Department approval first.',
      },
      {
        question: 'What does remodeling in Ellicott City cost?',
        answer:
          'Every Ellicott City kitchen, bathroom, and lower level is a free written estimate after a site walk. A Main Street house and a house in ZIP 21042 are not the same scope.',
      },
    ],
  },
  'laytonsville-md': {
    seoTitle: 'Remodeling Contractor in Laytonsville, MD | Real Elite',
    seoH1: 'Remodeling Contractor in Laytonsville, MD',
    seoDescription:
      'Remodeling contractor in Laytonsville, MD, ZIP 20882. Town approval comes first only when the parcel is in the town. Free written estimate after a site walk.',
    description:
      "Laytonsville remodeling is ZIP 20882, along MD 108. ZIP 20882 does not, by itself, put the house inside the Town of Laytonsville. We confirm the parcel before a filing order is assumed. The drive from Martinsburg is I-81 south to I-70 east, then south toward MD 108.\n\nWhen the parcel is in the Town of Laytonsville, city approval is required before the county application. Town questions go to P.O. Box 5158, Laytonsville, MD 20882, phone 301-869-0042. When the parcel is in the county's permit area, questions go to the Department of Permitting Services, 2425 Reedie Drive, 7th floor, Wheaton, phone 240-777-0311. Hours are 7:30 a.m. to 4 p.m. Monday through Friday, and no appointment is necessary.\n\nAn interior alteration will likely need a permit. Installing, repairing, or replacing cabinets most likely will not. A renovation other than a repair needs a permit before work starts. Municipality rules and homeowners-association rules are separate from that guidance. Plumbing questions go to WSSC. A well or a septic system likely needs a permit. Electrical work is a separately licensed trade. Real Elite does not take electrical work. The price is a free written estimate after a site walk.",
    neighborhoods: ['MD 108', 'ZIP 20882', 'Laytonsville Road', 'Sundown Road', 'Brink Road'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'remodeling', 'additions'],
    nearbySlugs: ['brookeville-md', 'olney-md', 'barnesville-md', 'dickerson-md'],
    faqs: [
      {
        question: 'Who permits a remodel in Laytonsville, MD?',
        answer:
          'The parcel decides. When it is in the Town of Laytonsville, city approval is required before the county application. Town questions go to P.O. Box 5158, Laytonsville, MD 20882, phone 301-869-0042. A county parcel uses 240-777-0311. We confirm the office before work starts.',
      },
      {
        question: 'Does a cabinet replacement in Laytonsville skip the town?',
        answer:
          'Installing, repairing, or replacing cabinets most likely will not need a permit. Municipality rules are separate from that guidance. An interior alteration likely will. Town questions go to 301-869-0042 before a sequence is assumed.',
      },
      {
        question: 'What does remodeling in Laytonsville cost?',
        answer:
          'Every Laytonsville kitchen, bathroom, and lower level is a free written estimate after a site walk. The county filing fee is not that price.',
      },
    ],
  },
  'barnesville-md': {
    seoTitle: 'Remodeling Contractor in Barnesville, MD | Real Elite',
    seoH1: 'Remodeling Contractor in Barnesville, MD',
    seoDescription:
      'Remodeling contractor in Barnesville, MD, ZIP 20837. The parcel decides the town or the county office. Free written estimate after a site walk.',
    description:
      "Barnesville remodeling is western Montgomery County, ZIP 20837, along Barnesville Road. ZIP 20837 can be the Town of Barnesville, the Town of Poolesville, or a county parcel in neither town. We confirm the parcel before a filing order is assumed. The drive from Martinsburg is I-81 south to I-70 east, then south toward Barnesville Road.\n\nWhen the parcel is in the Town of Barnesville, city approval is required before the county application. Town questions go to P.O. Box 95, Barnesville, MD 20838, phone 240-415-1659. When the parcel is in the Town of Poolesville, city approval is also required first. Poolesville questions go to P.O. Box 158, Poolesville, MD 20837, phone 301-428-8927. A county parcel that is in neither town uses the Department of Permitting Services, 2425 Reedie Drive, 7th floor, Wheaton, phone 240-777-0311, Monday through Friday, 7:30 a.m. to 4 p.m.\n\nAn interior alteration will likely need a permit. Cabinets most likely will not. A renovation other than a repair needs a permit before work starts. Municipality rules and homeowners-association rules are separate from that guidance. Plumbing questions go to WSSC. A well or a septic system likely needs a permit. Electrical work is a separately licensed trade. Real Elite does not take electrical work. We confirm the permit steps for the parcel before work starts. The price is a free written estimate after a site walk.",
    neighborhoods: ['Barnesville Road', 'ZIP 20837', 'Beallsville edge', 'MD 109', 'Poolesville edge'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'remodeling', 'additions'],
    nearbySlugs: ['dickerson-md', 'brookeville-md', 'laytonsville-md', 'potomac-md'],
    faqs: [
      {
        question: 'Who permits a remodel in Barnesville, MD?',
        answer:
          'The parcel decides. A parcel in the Town of Barnesville needs city approval before the county application. Town questions go to P.O. Box 95, Barnesville, MD 20838, phone 240-415-1659. A county parcel that is not in Barnesville or Poolesville uses 240-777-0311.',
      },
      {
        question: 'Is every ZIP 20837 address the Town of Barnesville?',
        answer:
          'No. ZIP 20837 can be the Town of Barnesville, the Town of Poolesville, or a county parcel in neither town. Poolesville questions go to 301-428-8927. Town-first approval applies when the parcel is in one of those towns.',
      },
      {
        question: 'What does remodeling in Barnesville cost?',
        answer:
          'Every Barnesville kitchen, bathroom, and lower level is a free written estimate after a site walk. The town on the parcel is named in that estimate before any filing.',
      },
    ],
  },
  'olney-md': {
    seoTitle: 'Remodeling Contractor in Olney, MD | Real Elite',
    seoH1: 'Remodeling Contractor in Olney, MD',
    seoDescription:
      'Remodeling contractor in Olney, MD, ZIP 20832. Montgomery County permits in Wheaton. Free written estimate after a site walk.',
    description:
      "Olney is Montgomery County, ZIP 20832, where Georgia Avenue (MD 97) meets MD 108. The houses are established neighborhoods off that crossing. The drive from Martinsburg is I-81 south to I-70 east, then I-270 south toward MD 97. We confirm the permit steps for the parcel before work starts.\n\nCounty questions go to the Department of Permitting Services, 2425 Reedie Drive, 7th floor, Wheaton, phone 240-777-0311. Hours are 7:30 a.m. to 4 p.m. Monday through Friday, and no appointment is necessary. A renovation other than a repair needs a permit before work starts. Painting, wallpapering, a faucet replacement, countertops, and floor coverings do not, when no structural change is made. An interior alteration will likely need a permit. Cabinets most likely will not. Municipality rules and homeowners-association rules are separate from that guidance.\n\nPlumbing questions go to WSSC. A house on its own well and septic has additional requirements. Electrical work is a separately licensed trade. Real Elite does not take electrical work. The remodeling here is kitchens, bathrooms, and finished lower levels. The price is a free written estimate after a site walk.",
    neighborhoods: ['Georgia Avenue', 'MD 108', 'ZIP 20832', 'Cashell Road', 'Olney-Laytonsville Road'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'remodeling', 'additions'],
    nearbySlugs: ['laytonsville-md', 'brookeville-md', 'ashton-md', 'kensington-md'],
    faqs: [
      {
        question: 'Who permits a remodel in Olney, MD?',
        answer:
          'County questions go to the Department of Permitting Services, 2425 Reedie Drive, 7th floor, Wheaton, phone 240-777-0311. We confirm the permit steps for the parcel before work starts.',
      },
      {
        question: 'Does an interior kitchen change in Olney need a permit?',
        answer:
          'An interior alteration will likely need a permit. Installing, repairing, or replacing cabinets most likely will not. A renovation other than a repair needs a permit before work starts. Plumbing questions go to WSSC.',
      },
      {
        question: 'What does remodeling in Olney cost?',
        answer:
          'Every Olney kitchen, bathroom, and lower level is a free written estimate after a site walk. A Georgia Avenue house and a house off MD 108 are not the same scope.',
      },
    ],
  },
  'ashton-md': {
    seoTitle: 'Remodeling Contractor in Ashton, MD | Real Elite',
    seoH1: 'Remodeling Contractor in Ashton, MD',
    seoDescription:
      'Remodeling contractor in Ashton, MD, ZIP 20861. Montgomery County permits in Wheaton. Free written estimate after a site walk.',
    description:
      "Ashton is eastern Montgomery County, ZIP 20861, along MD 108 toward New Hampshire Avenue. Sandy Spring shares that ZIP. The drive from Martinsburg is I-81 south to I-70 east, then east on MD 108. We confirm the permit steps for the parcel before work starts.\n\nCounty questions go to the Department of Permitting Services, 2425 Reedie Drive, 7th floor, Wheaton, phone 240-777-0311, Monday through Friday, 7:30 a.m. to 4 p.m. A renovation other than a repair needs a permit before work starts. An interior alteration will likely need a permit. Bathroom caulking most likely will not. Cabinets most likely will not. A house on its own well and septic has additional requirements. Municipality rules and homeowners-association rules are separate from that guidance.\n\nPlumbing questions go to WSSC. A well or a septic system likely needs a permit. Permits are applied for electronically. Electrical work is a separately licensed trade. Real Elite does not take electrical work. The remodeling here is kitchens, bathrooms, and finished lower levels. The price is a free written estimate after a site walk.",
    neighborhoods: ['MD 108', 'ZIP 20861', 'New Hampshire Avenue', 'Sandy Spring', 'Norwood Road'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'remodeling', 'additions'],
    nearbySlugs: ['olney-md', 'brookeville-md', 'laytonsville-md', 'kensington-md'],
    faqs: [
      {
        question: 'Who permits a remodel in Ashton, MD?',
        answer:
          'County questions go to the Department of Permitting Services, 2425 Reedie Drive, 7th floor, Wheaton, phone 240-777-0311. We confirm the permit steps for the parcel before work starts. Sandy Spring shares ZIP 20861.',
      },
      {
        question: 'Does an Ashton house on a well change the permit?',
        answer:
          'A house on its own well and septic has additional requirements. A well or a septic system likely needs a permit. Plumbing questions go to WSSC. We confirm the permit steps for the parcel before work starts.',
      },
      {
        question: 'What does remodeling in Ashton cost?',
        answer:
          'Every Ashton kitchen, bathroom, and lower level is a free written estimate after a site walk. The written estimate names the scope for that house.',
      },
    ],
  },
  'north-potomac-md': {
    seoTitle: 'Remodeling Contractor in North Potomac, MD | Real Elite',
    seoH1: 'Remodeling Contractor in North Potomac, MD',
    seoDescription:
      'Remodeling contractor in North Potomac, MD, ZIP 20878. Montgomery County permits in Wheaton. Free written estimate after a site walk.',
    description:
      "North Potomac is Montgomery County, ZIP 20878, along Darnestown Road. The City of Gaithersburg is city permit only, so a Darnestown Road address is confirmed before a filing office is assumed. The drive from Martinsburg is I-81 south to I-70 east, then I-270 south toward Darnestown Road. We confirm the permit steps for the parcel before work starts.\n\nWhen the parcel is in the county's permit area, questions go to the Department of Permitting Services, 2425 Reedie Drive, 7th floor, Wheaton, phone 240-777-0311, Monday through Friday, 7:30 a.m. to 4 p.m. A renovation other than a repair needs a permit before work starts. An interior alteration will likely need a permit. Cabinets most likely will not. The county does not enforce deed restrictions. A common-ownership community is asked separately. Municipality rules are separate from that guidance.\n\nPlumbing questions go to WSSC. Eligible applications can use Fast Track review. Other applications are reviewed by the county, and by WSSC when plumbing is in the scope. Electrical work is a separately licensed trade. Real Elite does not take electrical work. The price is a free written estimate after a site walk.",
    neighborhoods: ['Darnestown Road', 'ZIP 20878', 'Quince Orchard Road', 'Travilah edge', 'MD 28'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'remodeling', 'additions'],
    nearbySlugs: ['potomac-md', 'bethesda-md', 'cabin-john-md', 'kensington-md'],
    faqs: [
      {
        question: 'Who permits a remodel in North Potomac, MD?',
        answer:
          'The parcel decides. The City of Gaithersburg is city permit only. A county parcel uses the Department of Permitting Services, 2425 Reedie Drive, 7th floor, Wheaton, phone 240-777-0311. We confirm the office before work starts.',
      },
      {
        question: 'Does a North Potomac kitchen need a permit for new cabinets only?',
        answer:
          'Installing, repairing, or replacing cabinets most likely will not need a permit. An interior alteration likely will. A renovation other than a repair needs a permit before work starts. Plumbing questions go to WSSC.',
      },
      {
        question: 'What does remodeling in North Potomac cost?',
        answer:
          'Every North Potomac kitchen, bathroom, and lower level is a free written estimate after a site walk. The county filing fee is not that price.',
      },
    ],
  },
};

/**
 * Every area that currently publishes its own pages. Drives
 * generateStaticParams on /service-areas/[slug] and the city lookup on
 * /services/[service]/[city].
 *
 * Reads straight off the catalog now — the old version concatenated three
 * overlapping arrays and de-duplicated by slug, which is what the catalog
 * removes the need for. Consolidated and staged rows drop out here, which is
 * how an area stops generating pages or stays unpublished.
 */
export const ALL_SERVICE_AREAS: readonly ServiceArea[] = activeAreas(SERVICE_AREA_CATALOG);

/**
 * Areas whose own pages have been retired. Each must carry `redirectTo`, and
 * `next.config.ts` must actually redirect `/service-areas/<slug>` — without
 * that the retired URL is a 404, not a redirect. `constants.test.ts` reads the
 * real redirect list out of the config and fails the build on a row that is
 * missing one, rather than only checking that `redirectTo` looks like a path.
 */
export const CONSOLIDATED_SERVICE_AREAS: readonly ServiceArea[] =
  SERVICE_AREA_CATALOG.filter((a) => a.status === 'consolidated');

/**
 * Rows held out of the site until a license gate clears. They stay in the
 * catalog so the place list is reviewable, and `activeAreas` keeps them out
 * of pages, the sitemap, and internal links.
 */
export const STAGED_SERVICE_AREAS: readonly ServiceArea[] =
  SERVICE_AREA_CATALOG.filter((a) => a.status === 'staged');

/** Look a row up by slug, across active, consolidated, and staged rows. */
export const getServiceArea = (slug: string): ServiceArea | null =>
  SERVICE_AREA_CATALOG.find((a) => a.slug === slug) ?? null;

/**
 * True for rows that name a single settlement, as opposed to a county or a
 * region. Consumers test this rather than enumerating `kind` literals, so a
 * new kind does not mean editing call sites.
 */
export const isLocalityArea = (area: Pick<ServiceArea, 'kind'>): boolean =>
  area.kind === 'town' || area.kind === 'city';

/**
 * The regional phrase for copy like "across {city} and the surrounding
 * {region}".
 *
 * Derived from the catalog rather than from `state`, because keying off state
 * alone described the Fairfax-County towns as the "Northern Shenandoah Valley
 * and Loudoun County area" — Vienna, McLean, Reston and Great Falls are in
 * none of those.
 */
export function areaRegionLabel(area: ServiceArea): string {
  // A region has no surrounding region. Callers that phrase this as
  // "{place} and the surrounding {region}" must gate on `isLocalityArea`
  // first, or they render "Northern Virginia and the surrounding Northern
  // Virginia" — CityPageTemplate does exactly that gating.
  if (area.kind === 'region') return area.city;
  if (area.state === 'WV') return 'Eastern Panhandle';
  if (area.state === 'MD') {
    if (
      area.slug === 'hagerstown-md' ||
      area.slug === 'boonsboro-md' ||
      area.slug === 'sharpsburg-md' ||
      area.slug === 'williamsport-md'
    ) {
      return 'Washington County area';
    }
    if (area.slug === 'mount-airy-md') return 'Frederick and Carroll county area';
    if (area.slug === 'woodbine-md') return 'Howard and Carroll county area';
    if (
      area.slug === 'garrett-park-md' ||
      area.slug === 'bethesda-md' ||
      area.slug === 'potomac-md' ||
      area.slug === 'cabin-john-md' ||
      area.slug === 'chevy-chase-md' ||
      area.slug === 'brookeville-md' ||
      area.slug === 'kensington-md' ||
      area.slug === 'dickerson-md' ||
      area.slug === 'laytonsville-md' ||
      area.slug === 'barnesville-md' ||
      area.slug === 'olney-md' ||
      area.slug === 'ashton-md' ||
      area.slug === 'north-potomac-md'
    ) {
      return 'Montgomery County area';
    }
    if (
      area.slug === 'west-friendship-md' ||
      area.slug === 'glenwood-md' ||
      area.slug === 'clarksville-md' ||
      area.slug === 'marriottsville-md' ||
      area.slug === 'ellicott-city-md'
    ) {
      return 'Howard County area';
    }
    return 'Frederick County area';
  }
  // Every current Pennsylvania row is Franklin County. A later county needs
  // its own label before that row is added; this must not fall through to
  // "Northern Virginia".
  if (area.state === 'PA') return 'Franklin County area';
  if (area.slug === 'loudoun-county-va' || area.parent === 'loudoun-county-va') {
    return 'Loudoun County area';
  }
  if (area.slug === 'fairfax-county-va' || area.parent === 'fairfax-county-va') {
    return 'Fairfax County area';
  }
  if (area.slug === 'prince-william-county-va' || area.parent === 'prince-william-county-va') {
    return 'Prince William County area';
  }
  // No Fauquier or Clarke county row yet. These towns must not inherit
  // "Northern Virginia" or the Shenandoah label.
  if (
    area.slug === 'warrenton-va' ||
    area.slug === 'the-plains-va' ||
    area.slug === 'upperville-va' ||
    area.slug === 'marshall-va' ||
    area.slug === 'delaplane-va'
  ) {
    return 'Fauquier County area';
  }
  if (area.slug === 'berryville-va') return 'Clarke County area';
  // Winchester is the one VA row on the home-market side of the split.
  return area.market === 'home' ? 'Northern Shenandoah Valley' : 'Northern Virginia';
}

/**
 * The place name as copy should say it.
 *
 * A locality or a county takes its state ("Vienna, VA", "Loudoun County, VA").
 * A region does not, because the state is already inside the name — the
 * generic templates produced "Northern Virginia, VA" in headings, breadcrumbs
 * and titles before this existed.
 */
export const formatAreaPlace = (area: ServiceArea): string =>
  area.kind === 'region' ? area.city : `${area.city}, ${area.state}`;

/**
 * The schema.org type for a row.
 *
 * A county or region is an `AdministrativeArea` — emitting `City` for
 * "Northern Virginia" tells Google the wrong kind of thing about the page,
 * and that is the whole reason this helper exists.
 *
 * Localities keep the generic `Place` the template already emitted, and
 * deliberately do NOT become `City`. Half the `town` rows here are not
 * municipalities: Reston, McLean, Great Falls, Burke and Fairfax Station are
 * census-designated places and Brambleton is a planned community, as their
 * own comments in the catalog say. Classifying them as `City` would trade an
 * accurate generic type for a false specific one. Splitting incorporated
 * towns from CDPs would need the incorporation status of twenty-odd places
 * verified one by one, which CLAUDE.md requires before it goes in the repo —
 * so it is a separate, evidence-backed change, not a guess made here.
 */
export const areaSchemaType = (area: ServiceArea): 'Place' | 'AdministrativeArea' =>
  isLocalityArea(area) ? 'Place' : 'AdministrativeArea';

/** Active rows sitting directly inside this one, in catalog order. */
export const childAreasOf = (slug: string): ServiceArea[] =>
  ALL_SERVICE_AREAS.filter((a) => a.parent === slug);

/**
 * Ancestors, nearest first — Middleburg gives
 * `[Loudoun County, Northern Virginia]`. Used for the breadcrumb trail, which
 * is why the order matters.
 *
 * The catalog allows a town inside a county inside a region, so this walks
 * rather than reading `parent` once. The loop is bounded: `constants.test.ts`
 * caps the chain at two hops and rejects cycles, and the guard here means a
 * bad row cannot hang a build even so.
 */
export function areaAncestors(area: ServiceArea): ServiceArea[] {
  const chain: ServiceArea[] = [];
  const seen = new Set<string>([area.slug]);
  let current = area.parent;
  while (current && !seen.has(current) && chain.length < 8) {
    const next = getServiceArea(current);
    if (!next) break;
    chain.push(next);
    seen.add(next.slug);
    current = next.parent;
  }
  return chain;
}

export type AreaHeroLane = 'consultation' | 'estimate';

/**
 * Which hero a town or county page leads with.
 *
 * The two-lane rule: Loudoun, Fairfax and Prince William (and the places
 * inside those counties) open on a design consultation. West Virginia and
 * the other home-market rows keep the free estimate.
 *
 * The county row decides. A town inherits the lane of the county above it
 * in the catalog, so the template never carries a slug list. A row with no
 * county ancestor — the Eastern Panhandle towns, Frederick, Winchester,
 * Alexandria, the Northern Virginia region — follows its own `market`,
 * except West Virginia, which stays on the estimate even if a later edit
 * marks a Panhandle row premium.
 */
export function areaHeroLane(area: ServiceArea): AreaHeroLane {
  if (area.state === 'WV') return 'estimate';
  const county = [area, ...areaAncestors(area)].find((row) => row.kind === 'county');
  if (county) return county.market === 'premium' ? 'consultation' : 'estimate';
  return area.market === 'premium' ? 'consultation' : 'estimate';
}

/**
 * Towns that already published the same-week visit sentence before this
 * expansion. That is every `market: 'home'` row on the base of this branch:
 * the Eastern Panhandle, plus Winchester and Frederick, which already
 * carried the sentence. New rows do not inherit it.
 */
const SAME_WEEK_VISIT_SLUGS: ReadonlySet<string> = new Set([
  'martinsburg-wv',
  'inwood-wv',
  'charles-town-wv',
  'ranson-wv',
  'hedgesville-wv',
  'frederick-md',
  'winchester-va',
  'spring-mills-wv',
  'falling-waters-wv',
  'berkeley-springs-wv',
  'shepherdstown-wv',
]);

/**
 * Whether the city-page quote FAQ may promise a same-week visit.
 *
 * Allowlist only. `market: 'home'` is not enough: Stephens City and
 * Middletown are home-market rows and still must not say it. Pennsylvania
 * is absent from the list for the same reason.
 */
export function areaQuotesSameWeek(area: Pick<ServiceArea, 'slug'>): boolean {
  return SAME_WEEK_VISIT_SLUGS.has(area.slug);
}

/** Legacy flat list (primary + secondary city names) for simple iterations */
export const SERVICE_AREAS = [
  ...PRIMARY_SERVICE_AREAS.map((a) => a.city),
  ...SECONDARY_SERVICE_AREAS.map((a) => a.city),
] as const;

/** Format an area record as the `"City, ST"` label used in JSON-LD areaServed. */
export const formatAreaLabel = (a: { city: string; state: string }): string =>
  `${a.city}, ${a.state}`;

/**
 * `areaServed` lists for JSON-LD, centralized here so the served-area claim
 * lives in one place instead of being hand-typed inside component files.
 *
 * The two lists are INTENTIONALLY distinct and are NOT merged:
 *  - GENERAL_CONTRACTOR_AREA_SERVED advertises the full home-market footprint
 *    on the site-wide Organization/GeneralContractor schema, including small
 *    Eastern Panhandle communities, including Kearneysville, Harpers Ferry,
 *    and Bunker Hill.
 *  - SERVICE_PAGE_AREA_SERVED is the curated tri-state highlight used as the
 *    default `areaServed` on per-service Service schema when a service has no
 *    narrower `areaScope`.
 * Forcing them into one derived list would change the served-area set each
 * schema reports, so they stay separate by design. Edit these arrays to change
 * what the site claims to serve.
 */
export const GENERAL_CONTRACTOR_AREA_SERVED: string[] = [
  'Martinsburg, WV',
  'Inwood, WV',
  'Hedgesville, WV',
  'Charles Town, WV',
  'Ranson, WV',
  'Kearneysville, WV',
  'Shepherdstown, WV',
  'Harpers Ferry, WV',
  'Bunker Hill, WV',
  'Berkeley Springs, WV',
  'Spring Mills, WV',
  'Falling Waters, WV',
  'Winchester, VA',
  'Leesburg, VA',
  'Ashburn, VA',
  'Loudoun County, VA',
  'Fairfax County, VA',
  'Prince William County, VA',
  'Frederick, MD',
];

export const SERVICE_PAGE_AREA_SERVED: string[] = [
  'Martinsburg, WV',
  'Charles Town, WV',
  'Shepherdstown, WV',
  'Inwood, WV',
  'Frederick, MD',
  'Winchester, VA',
  'Leesburg, VA',
  'Ashburn, VA',
  'Loudoun County, VA',
  'Fairfax County, VA',
  'Prince William County, VA',
];

/**
 * Premium-market slugs — the areas whose pages swap the standard estimate
 * rail for the /design-consultation path, calibrated for $50k+ project
 * intake (pre-qualification, designer status, budget tier, in-home booking).
 *
 * Derived from `market: 'premium'` on active rows rather than maintained by
 * hand, so a row's tier and its conversion path cannot drift apart. Staged
 * rows are excluded: a premium market that is not licensed yet must not swap
 * a CTA onto a page that does not exist. It rewires the CTAs on
 * /service-areas/[slug] and /services/[service]/[slug].
 */
export const LUXURY_CITY_SLUGS: ReadonlySet<string> = new Set<string>(
  activeAreas(SERVICE_AREA_CATALOG)
    .filter((a) => a.market === 'premium')
    .map((a) => a.slug)
);

/**
 * Client reviews moved to the unified Review contract and single source at
 * `src/lib/reviews/` (Review Center, homepage, and service/city proof modules
 * all read from there). The same integrity rule still holds: first-party
 * reviews render as on-page social proof only and never emit AggregateRating /
 * Review JSON-LD — that's gated to verified Google reviews in
 * `src/lib/social-proof.ts`.
 */

/**
 * Primary navigation — 6 top-level items.
 * Process, Reviews, and FAQ move to the footer utility row.
 * Services and Service Areas open mega-menus on desktop; accordions on mobile.
 */
export const NAV_LINKS = [
  {
    label: 'Services',
    href: '/services',
    children: SERVICES.map((s) => ({
      label: s.title,
      href: `/services/${s.slug}`,
    })),
  },
  {
    label: 'Service Areas',
    href: '/service-areas',
  },
  { label: 'Paving', href: '/paving' },
  { label: 'Our Work', href: '/projects' },
  { label: 'Resources', href: '/resources' },
  { label: 'Roof Quote', href: '/instant-roof-quote' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
] as const;

/** Utility links surfaced in footer + mobile nav drawer */
export const UTILITY_LINKS = [
  { label: 'Get an Estimate', href: '/estimate' },
  { label: 'Design Consultation', href: '/design-consultation' },
  { label: 'Our Process', href: '/process' },
  { label: 'Financing', href: '/financing' },
  { label: 'Reviews', href: '/reviews' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Family-Run', href: '/veterans' },
  { label: 'Capability Statement', href: '/capability-statement' },
  { label: 'Storm Damage', href: '/storm-damage' },
  { label: 'Full Property Bundle', href: '/full-property-perimeter' },
  { label: 'Photo Gallery', href: '/gallery' },
] as const;

/**
 * Services mega-menu — grouped into 3 editorial columns.
 */
export const SERVICES_MEGA_MENU = [
  {
    heading: 'Remodeling',
    items: [
      { label: 'Bathroom Remodeling', href: '/services/bathrooms', description: 'Walk-in showers, tile, vanities, master baths' },
      { label: 'Kitchen Remodeling', href: '/services/kitchens', description: 'Custom cabinetry, islands, layout changes' },
      { label: 'Basement Finishing', href: '/services/basements', description: 'Family rooms, in-law suites, basement bars' },
      { label: 'Whole-Home Remodeling', href: '/services/remodeling', description: 'Full interior renovations with a coordinated scope' },
      { label: 'Home Additions', href: '/services/additions', description: 'Bump-outs, single rooms, second stories' },
    ],
  },
  {
    heading: 'Exteriors',
    items: [
      { label: 'Decks', href: '/services/decks', description: 'Composite and pressure-treated decks, railings' },
      { label: 'Outdoor Living', href: '/services/outdoor-living', description: 'Screened porches, covered patios, pergolas' },
      { label: 'Stairs & Railings', href: '/services/stairs', description: 'Staircase remodels, balusters, deck stairs' },
      { label: 'Roofing', href: '/services/roofing', description: 'Architectural shingle replacement & repair' },
      { label: 'Siding & Stone', href: '/services/siding', description: 'Vinyl, fiber cement, and stone veneer exteriors' },
      { label: 'Paving & Seal Coating', href: '/paving', description: 'Driveways, lots, repairs & seal coating' },
      { label: 'Exterior Repairs', href: '/services/exterior-repairs', description: 'Trim, foundation, stone veneer detail work' },
    ],
  },
  {
    heading: 'Repairs',
    items: [
      { label: 'General Repairs', href: '/services/general-repairs', description: 'Doors, drywall, trim, deck fixes' },
      { label: 'Handyman Services', href: '/services/handyman', description: 'Small-job specialists — done right' },
    ],
  },
] as const;

/**
 * Featured services for the homepage editorial grid (6 cards).
 * Asymmetric layout: hero tile + 5 supporting tiles.
 * All images use existing real project photography.
 */
export const HOMEPAGE_FEATURED_SERVICES = [
  {
    title: 'Remodeling & Interiors',
    eyebrow: 'Premium Interior',
    scope: 'Kitchens, bathrooms, flooring, and full interior renovations finished to a higher standard.',
    href: '/services/remodeling',
    image: '/images/flooring-dark-living.jpg',
    imageAlt: 'Dark laminate flooring installed in a remodeled living room',
    span: 'hero', // large editorial card
  },
  {
    title: 'Decks & Outdoor Living',
    eyebrow: 'Outdoor',
    scope: 'Composite decks, railings, lighting, and full backyard transformations.',
    href: '/services/decks',
    image: '/images/deck-night-lights.jpg',
    imageAlt: 'Finished composite deck with solar post lights at night',
    span: 'standard',
  },
  {
    title: 'Roofing',
    eyebrow: 'Exterior',
    scope: 'Architectural shingle replacement, valley flashing, and complete tear-offs.',
    href: '/services/roofing',
    image: '/images/roofing-slope.jpg',
    imageAlt: 'New charcoal architectural shingle roof with clean valley lines',
    span: 'standard',
  },
  {
    title: 'Siding & Stone Exteriors',
    eyebrow: 'Curb Appeal',
    scope: 'Vinyl, fiber cement, and stone veneer that elevates every facade.',
    href: '/services/siding',
    image: '/images/stone-facade-finished.jpg',
    imageAlt: 'Finished stone veneer porch facade with custom railings',
    span: 'standard',
  },
  {
    title: 'Home Additions',
    eyebrow: 'New Space',
    scope: 'Additions that seamlessly extend your existing home — engineered to last.',
    href: '/services/additions',
    image: '/images/new-build-weather-barrier.webp',
    imageAlt: 'New home under construction with weather barrier and exposed roof trusses',
    span: 'standard',
  },
  {
    title: 'Stone & Specialty Work',
    eyebrow: 'Detail Craft',
    scope: 'Stone veneer foundations, custom trim, and the small details that finish a project right.',
    href: '/services/exterior-repairs',
    image: '/images/stone-veneer-detail.jpg',
    imageAlt: 'Stone veneer foundation detail on a home exterior',
    span: 'standard',
  },
  {
    title: 'Paving & Seal Coating',
    eyebrow: 'Driveways',
    scope: 'Asphalt, concrete & tar-and-chip driveways, parking lots, and seal coating across the Eastern Panhandle.',
    href: '/paving',
    image: '/images/inspiration/paving-aplus-driveway.jpg',
    imageAlt: 'A freshly finished residential driveway',
    span: 'standard',
  },
] as const;

/**
 * The four-step Military Precision Process — homepage + /process page.
 */
export const PRECISION_PROCESS = [
  {
    step: '01',
    title: 'Recon',
    summary: 'On-site assessment, scope walkthrough, and a clear picture of what your project actually needs — at no cost.',
  },
  {
    step: '02',
    title: 'Plan',
    summary: 'Written scope, transparent line-item pricing, financing options, and a project lead assigned before we break ground.',
  },
  {
    step: '03',
    title: 'Execute',
    summary: "Discuss site supervision, communication, and cleanup arrangements during the estimate.",
  },
  {
    step: '04',
    title: 'Inspect',
    summary: "Review the proposed scope and warranty terms before signing. You only sign off when the project is right.",
  },
] as const;

/**
 * Featured single project spotlight on the homepage.
 * Rotates manually — update to surface your strongest current project.
 */
export const HOMEPAGE_PROJECT_SPOTLIGHT = {
  title: 'Custom Addition, Framed to Spec',
  location: 'Eastern Panhandle, WV',
  scope: 'Custom addition framing — joists, walls, and roof structure squared, braced, and built to spec. The kind of work that keeps going after the sun drops, because the schedule said this stage finishes today.',
  image: '/images/crew-dusk.jpg',
  imageAlt: 'Real Elite crew member framing a custom addition by work light at dusk',
  href: '/projects',
} as const;

/**
 * "In progress -> finished" pairs for the homepage cinematic slider.
 *
 * These are intentionally NOT before/after pairs in the strict sense
 * (same angle, same framing of an existing structure). They're paired
 * mid-construction and post-construction shots of real Real Elite
 * projects — a build-to-finished reveal. The slider UI labels and
 * homepage copy reflect that framing.
 *
 * If genuine before/after photography (same angle, pre-work vs.
 * post-work) is shot later, swap pairs in and rename the labels back
 * to "Before / After" in BeforeAfter.tsx + the home section header.
 */
export const BEFORE_AFTER_PAIRS = [
  {
    label: 'Composite deck transformation',
    category: 'Decks',
    before: { src: '/images/deck-construction.jpg', alt: 'Deck framing during construction phase' },
    after: { src: '/images/deck-finished-railings.jpg', alt: 'Finished composite deck with white horizontal railings' },
  },
  {
    label: 'Stone facade upgrade',
    category: 'Exterior',
    before: { src: '/images/stone-veneer-detail.jpg', alt: 'Stone veneer installation in progress' },
    after: { src: '/images/stone-facade-finished.jpg', alt: 'Completed stone facade with railings and trim' },
  },
] as const;

/**
 * Top 5 FAQs surfaced on the homepage.
 * Full list lives on /faq.
 */
export const HOME_FAQ = [
  {
    question: 'Are you licensed and insured?',
    answer:
      "Yes — Real Elite Contracting is fully licensed and insured across West Virginia and Virginia. General liability coverage is on file. Request current insurance documentation for your project.",
  },
  {
    question: 'How long does a typical remodel take?',
    answer:
      "Most full bathroom remodels run 3–5 weeks. Kitchens run 6–10 weeks. Decks take 1–3 weeks. Discuss site supervision, communication, and cleanup arrangements during the estimate.",
  },
  {
    question: 'Do you offer financing?',
    answer:
      "Yes. We work with several home-improvement financing partners that offer monthly payment plans on qualified projects. We'll walk you through the options on your free estimate so the numbers make sense before you commit.",
  },
  {
    question: 'What does your warranty cover?',
    answer:
      "Review the proposed scope and warranty terms before signing. Manufacturer coverage depends on the selected product and installation requirements.",
  },
  {
    question: 'Do you pull permits?',
    answer:
      "Yes. We handle the full permitting process for every project that requires one — county and municipal — and document each inspection. You shouldn't have to chase paperwork on your own remodel.",
  },
] as const;

/**
 * Project gallery — the /projects "photo wall", related-project rails, and
 * the city-page gallery (via selectGalleryFor).
 *
 * HONESTY RULE: every entry must be a photograph of Real Elite's own work.
 * No stock, no AI imagery, no manufacturer catalogue shots — those belong in
 * /images/inspiration with an "inspiration" label, never here.
 *
 * `state` / `citySlug` are set only where the job location is verified
 * (photo EXIF GPS matched against the job file in AI-SHARED/Jobs). Leave them
 * undefined rather than guess; the city filter must not over-claim local work.
 *
 * Order matters: selectGalleryFor falls back to the first six entries, so the
 * strongest finished-work photos lead.
 */
export type GalleryImage = {
  src: string;
  alt: string;
  category: string;
  state?: AreaState;
  citySlug?: string;
};

export const GALLERY_IMAGES: GalleryImage[] = [
  // Bethesda MD townhome (Bethesda Project folder). Color-corrected and sharpened only.
  { src: '/images/work/bath-bethesda-chevron-shower.jpg', alt: 'Floor-to-ceiling marble chevron shower with frameless glass, tiled bench, hex floor, and matte black fixtures', category: 'Bathrooms', state: 'MD' },
  { src: '/images/work/kitchen-bethesda-waterfall-island.jpg', alt: 'White shaker kitchen with a black waterfall-edge quartz island, black pendants, and double wall ovens', category: 'Kitchens', state: 'MD' },
  { src: '/images/work/deck-night-full-house.jpg', alt: 'Composite deck at night with white vinyl railings and glowing post-cap lights below lit French doors', category: 'Decks' },
  // Primary bath remodel, Frederick MD (completed Aug 2026).
  { src: '/images/work/bath-primary-frameless-shower.webp', alt: 'Walk-in shower with frameless glass, blue subway tile, marble-look hex floor, and matte black fixtures', category: 'Bathrooms', state: 'MD', citySlug: 'frederick-md' },
  // Composite deck with vinyl railings, Fairfax County VA (June 2024).
  { src: '/images/work/deck-composite-stairs-front.webp', alt: 'Composite deck with white vinyl railings and a wide stair down to the patio', category: 'Decks', state: 'VA' },
  { src: '/images/work/deck-composite-surface.webp', alt: 'Brown composite decking with a curved run of white vinyl railing', category: 'Decks', state: 'VA' },
  { src: '/images/work/deck-night-rail-moon.jpg', alt: 'Deck stair and railings lit by post-cap lights at night', category: 'Decks', state: 'VA' },
  { src: '/images/work/roofing-finished-overhead.webp', alt: 'Completed architectural shingle roof seen from the ridge', category: 'Roofing', state: 'WV' },
  { src: '/images/deck-lounge.jpg', alt: 'Composite deck set up with outdoor lounge furniture', category: 'Decks', state: 'VA' },
  { src: '/images/work/roof-charcoal-gable.jpg', alt: 'Completed dark architectural shingle roof with clean ridge cap', category: 'Roofing', state: 'WV' },
  { src: '/images/stone-facade-finished.jpg', alt: 'Finished stone veneer porch facade with railings', category: 'Exterior', state: 'WV' },
  { src: '/images/work/living-bethesda-lvp-fireplace.jpg', alt: 'Open living room with wide-plank luxury vinyl plank flooring, a linear fireplace, and sliding doors to the balcony', category: 'Remodeling', state: 'MD' },
];

/**
 * Filter helper used by CityPageTemplate to surface the most-local
 * projects available, falling back to state then to all.
 *   1. Prefer photos tagged with this exact city slug
 *   2. Else prefer photos tagged with this state
 *   3. Else fall back to the full gallery
 */
export function selectGalleryFor(citySlug: string, state: AreaState, limit = 6): GalleryImage[] {
  const byCity = GALLERY_IMAGES.filter((g) => g.citySlug === citySlug);
  if (byCity.length >= 3) return byCity.slice(0, limit);
  const byState = GALLERY_IMAGES.filter((g) => g.state === state);
  if (byState.length >= 3) return byState.slice(0, limit);
  return GALLERY_IMAGES.slice(0, limit);
}

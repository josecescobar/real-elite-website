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
    title: 'Decks & Outdoor Living',
    slug: 'decks',
    description:
      'Composite decks, railings, lighting, pergolas, and full backyard transformations using premium materials.',
    icon: 'Fence' as const,
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
   * Deferred or dropped on purpose: Broad Run, Marshall, The Plains, Occoquan,
   * and every West Virginia gap town (Jose reviews that list before a build).
   * Stephens City and Middletown stay staged until their permit process is verified.
   * Warrenton is unparented: there is no Fauquier County row yet.
   */
  { slug: 'springfield-va', city: 'Springfield', state: 'VA', kind: 'town', market: 'premium', status: 'active', parent: 'fairfax-county-va', legacyTiers: [] },
  // Staged: herndon-va.gov returned 403, so the town permit process is unverified.
  // County rules in the note are not a substitute. Flip back to active once the town source is in the note.
  { slug: 'herndon-va', city: 'Herndon', state: 'VA', kind: 'town', market: 'premium', status: 'staged', parent: 'fairfax-county-va', legacyTiers: [] },
  { slug: 'chantilly-va', city: 'Chantilly', state: 'VA', kind: 'town', market: 'premium', status: 'active', parent: 'fairfax-county-va', legacyTiers: [] },
  { slug: 'centreville-va', city: 'Centreville', state: 'VA', kind: 'town', market: 'premium', status: 'active', parent: 'fairfax-county-va', legacyTiers: [] },
  { slug: 'falls-church-va', city: 'Falls Church', state: 'VA', kind: 'city', market: 'premium', status: 'active', parent: 'northern-virginia', legacyTiers: [] },
  // Staged: fairfaxva.gov returned 403, so the city permit process is unverified.
  { slug: 'fairfax-va', city: 'Fairfax', state: 'VA', kind: 'city', market: 'premium', status: 'staged', parent: 'northern-virginia', legacyTiers: [] },
  { slug: 'manassas-va', city: 'Manassas', state: 'VA', kind: 'city', market: 'premium', status: 'active', parent: 'northern-virginia', legacyTiers: [] },
  { slug: 'lake-ridge-va', city: 'Lake Ridge', state: 'VA', kind: 'town', market: 'premium', status: 'active', parent: 'prince-william-county-va', legacyTiers: [] },
  { slug: 'woodbridge-va', city: 'Woodbridge', state: 'VA', kind: 'town', market: 'premium', status: 'active', parent: 'prince-william-county-va', legacyTiers: [] },
  { slug: 'warrenton-va', city: 'Warrenton', state: 'VA', kind: 'town', market: 'premium', status: 'active', legacyTiers: [] },
  // Staged: town site and Frederick County VA building pages were unread.
  { slug: 'stephens-city-va', city: 'Stephens City', state: 'VA', kind: 'town', market: 'home', status: 'staged', legacyTiers: [] },
  // Staged: the town zoning form is not a verified building-permit process.
  { slug: 'middletown-va', city: 'Middletown', state: 'VA', kind: 'town', market: 'home', status: 'staged', legacyTiers: [] },

  /* ---------- Pennsylvania, Franklin County, 2026-09-29 ----------
   * Jose confirmed the PA home-improvement registration is already held, so
   * these rows are active. The public line is PA HIC #PA225060, existing-house
   * home improvement only. Maryland gap towns stay staged below.
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

  /* ---------- STAGED Maryland — do not publish ----------
   * TODO(MHIC): keep status 'staged' until Jose confirms a Maryland MHIC
   * license. activeAreas excludes these rows, so they do not render, are not
   * in the sitemap, and are not linked. Do not flip them to 'active' here.
   * Frederick, MD is already active and is intentionally not in this list.
   * Hagerstown stays omitted. Far-market places (Potomac, Bethesda,
   * Clarksville, Glenwood, Fulton) stay omitted until Jose says the drive
   * is in range.
   * Empty legacyTiers so the pinned primary/secondary lists do not move.
   */
  { slug: 'monrovia-md', city: 'Monrovia', state: 'MD', kind: 'town', market: 'home', status: 'staged', legacyTiers: [] },
  { slug: 'ijamsville-md', city: 'Ijamsville', state: 'MD', kind: 'town', market: 'home', status: 'staged', legacyTiers: [] },
  { slug: 'new-market-md', city: 'New Market', state: 'MD', kind: 'town', market: 'home', status: 'staged', legacyTiers: [] },
  { slug: 'urbana-md', city: 'Urbana', state: 'MD', kind: 'town', market: 'home', status: 'staged', legacyTiers: [] },
  { slug: 'mount-airy-md', city: 'Mount Airy', state: 'MD', kind: 'town', market: 'home', status: 'staged', legacyTiers: [] },
  { slug: 'middletown-md', city: 'Middletown', state: 'MD', kind: 'town', market: 'home', status: 'staged', legacyTiers: [] },
  { slug: 'adamstown-md', city: 'Adamstown', state: 'MD', kind: 'town', market: 'home', status: 'staged', legacyTiers: [] },
  { slug: 'point-of-rocks-md', city: 'Point of Rocks', state: 'MD', kind: 'town', market: 'home', status: 'staged', legacyTiers: [] },
  { slug: 'brunswick-md', city: 'Brunswick', state: 'MD', kind: 'town', market: 'home', status: 'staged', legacyTiers: [] },
  { slug: 'boonsboro-md', city: 'Boonsboro', state: 'MD', kind: 'town', market: 'home', status: 'staged', legacyTiers: [] },
  { slug: 'sharpsburg-md', city: 'Sharpsburg', state: 'MD', kind: 'town', market: 'home', status: 'staged', legacyTiers: [] },
  { slug: 'williamsport-md', city: 'Williamsport', state: 'MD', kind: 'town', market: 'home', status: 'staged', legacyTiers: [] },
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
};

export const CITY_DATA: Record<string, CityDataEntry> = {
  /* ---------- Eastern Panhandle WV (home market) ---------- */
  'martinsburg-wv': {
    description:
      "Martinsburg is the county seat of Berkeley County and the largest city in the Eastern Panhandle. Located along the I-81 corridor, it serves as the regional hub for commerce, services, and community life. Berkeley County is the fastest-growing county in West Virginia, and Martinsburg sits at the center of that growth — attracting families and professionals drawn by affordable housing, a revitalizing historic downtown, and easy commuter access to the Washington, D.C. metro via MARC train. Homes here range from beautifully preserved Victorian-era properties in the historic district to modern developments in the surrounding suburbs. Real Elite Contracting has deep roots in Martinsburg and is the contractor neighbors trust for quality craftsmanship that protects and enhances their most valuable investment.",
    neighborhoods: ['South Martinsburg', 'North End', 'Pikeside', 'Foxcroft Area', 'Burke Street Historic District'],
    marketEmphasis: ['roofing', 'siding', 'decks', 'remodeling', 'bathrooms', 'kitchens', 'additions'],
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
    marketEmphasis: ['remodeling', 'roofing', 'decks', 'bathrooms', 'siding', 'additions'],
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
      "Shepherdstown is the oldest town in West Virginia, founded in 1762, and home to Shepherd University — giving it a unique blend of historic charm and youthful vitality. The picturesque German Street corridor attracts professionals, academics, and families who value quality living. Many properties require contractors experienced with older construction methods and historic preservation. Real Elite Contracting brings the expertise and attention to detail that Shepherdstown homeowners expect.",
    neighborhoods: ['Historic Downtown', 'University Area', 'Potomac Riverfront', 'Moler Crossroads', 'Shepherd Grade Road Area'],
    marketEmphasis: ['remodeling', 'roofing', 'bathrooms', 'kitchens', 'decks', 'exterior-repairs'],
  },

  /* ---------- Frederick County MD ---------- */
  'frederick-md': {
    description:
      "Frederick is the county seat and largest city in Frederick County, Maryland — a rapidly growing community of over 75,000 residents that has transformed from a historic market town into one of the Mid-Atlantic's most desirable places to live. The revitalization of Carroll Creek and the Market Street corridor has breathed new life into Frederick's historic downtown, while the I-70 growth corridor continues to attract new developments in Urbana, Jefferson, and New Market. Real Elite Contracting serves Frederick homeowners who want professional-grade results on bathrooms, kitchens, basements, and roofing — the projects that drive the most value in this market.",
    neighborhoods: ['Historic Downtown Frederick', 'Ballenger Creek', 'Urbana', 'Jefferson', 'New Market', 'Buckeystown'],
    marketEmphasis: ['bathrooms', 'basements', 'kitchens', 'roofing', 'remodeling', 'additions'],
  },

  /* ---------- Northern Shenandoah Valley + Loudoun County VA ---------- */
  'winchester-va': {
    description:
      "Winchester is the historic gateway to Virginia's Shenandoah Valley — a city that blends a vibrant, walkable Old Town with rapidly growing residential neighborhoods along Route 7, Route 522, and the Senseny Road corridor. As the largest city in the Northern Shenandoah Valley, Winchester draws families and professionals who appreciate its small-city character, proximity to the mountains, and access to both Northern Virginia jobs and a lower cost of living. Real Elite Contracting is proud to serve Winchester homeowners with the high-quality craftsmanship we deliver throughout the region.",
    neighborhoods: ['Old Town Winchester', 'Shawnee District', 'Senseny Road Corridor', 'Millwood Avenue Area', 'Route 7 Corridor'],
    marketEmphasis: ['decks', 'roofing', 'remodeling', 'siding', 'bathrooms', 'additions'],
  },
  'leesburg-va': {
    description:
      "Leesburg is Loudoun County's seat and an incorporated town. Town limits cover Old Town and the streets around it. A Leesburg mailing address is not Town zoning: Lansdowne and River Creek sit in unincorporated county and have their own pages. Exterior work in the Old and Historic District goes through the Town Board of Architectural Review. Inside town limits, town zoning is approved before Loudoun County issues the building permit. The drive from Martinsburg is Route 9, which meets Route 7 in Leesburg. The remodeling this page is for is kitchens, primary suites, finished lower levels, additions, and outdoor living.",
    neighborhoods: ['Historic Old Town Leesburg', 'West of Route 15', 'Lansdowne on the Potomac', 'River Creek'],
    marketEmphasis: ['basements', 'kitchens', 'bathrooms', 'decks', 'additions', 'remodeling'],
  },
  'ashburn-va': {
    description:
      "Ashburn is unincorporated Loudoun County. Building and zoning run through LandMARC, and nearly every master-planned community also requires HOA architectural review. A county permit is not HOA approval. Most of the housing is 1990s through 2010s production and custom homes on public water and sewer, with unfinished basements and builder-grade kitchens and primary baths. Brambleton, Broadlands, Ashburn Farm, One Loudoun, Loudoun Valley Estates, and Belmont Greene are the communities this page covers. The drive from Martinsburg is Route 9 to Leesburg, then Route 7 east. The remodeling this page is for is basements, kitchens, primary suites, outdoor living, and additions.",
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
      "Loudoun County is two remodeling markets. Eastern communities such as Ashburn, Lansdowne, South Riding, and Sterling are mostly 1990s–2010s houses on public water and sewer. Exterior work there also needs HOA architectural review, and many basements were left unfinished. Western and southern places — Purcellville, Round Hill, Hamilton, Lovettsville, Waterford, and Aldie — are older village houses or custom homes on acreage, often on well and septic. A bedroom addition on a well-and-septic lot needs Loudoun Health Department approval before the building permit. Waterford and Aldie sit in county historic districts, so exterior changes need a Certificate of Appropriateness from the Historic District Review Committee. Incorporated towns, including Leesburg, Purcellville, Hamilton, Round Hill, Lovettsville, and Middleburg, approve their own zoning before the county issues the building permit. County deck review still has a published fast path (Typical Deck Detail, $265) and a full-plan path at $395 when a roof or screen is added; the county treats a screened porch as an addition. The drive from Martinsburg is Route 9 to Leesburg, then Route 7. The remodeling this page is for is basements, kitchens, primary suites, outdoor living, and additions.",
    neighborhoods: ['Purcellville', 'Round Hill', 'Waterford', 'Aldie', 'Lansdowne', 'South Riding', 'Sterling', 'Hamilton', 'Lovettsville', 'Leesburg', 'Ashburn'],
    marketEmphasis: ['basements', 'kitchens', 'bathrooms', 'decks', 'additions', 'remodeling'],
  },

  /* ---------- Fairfax County, VA ---------- */
  'fairfax-county-va': {
    description:
      "Fairfax County building permits go through Land Development Services, including inside the towns of Vienna and Clifton. Vienna reviews its own zoning and site plans; the county is the building official. Inside Clifton, a project needs a town use permit, a certificate of appropriateness from the Clifton Architectural Review Board, and the mayor's signature before Land Development Services will accept the building permit. Outside those towns, county zoning and the building permit are both Fairfax County's. Planned communities such as Reston and Burke Centre also require their own architectural review. A county permit is not HOA approval. Where a lot is on a private well or septic system, a bedroom addition also needs Fairfax County Health Department approval before the building permit. The housing this page covers runs from McLean and Great Falls estates to Vienna and Oakton colonials, Dunn Loring near the Metro, Fort Hunt along the parkway, and larger-lot houses in Fairfax Station and Clifton. The drive from Martinsburg is Route 9 to Leesburg, then Route 7, or Route 7 to Route 28 and I-66. ZIP codes served: 22101 and 22102 McLean, 22066 Great Falls, 22180, 22181, and 22182 Vienna, 22124 Oakton, 22027 Dunn Loring, 22039 Fairfax Station, 20124 Clifton, 22308 Fort Hunt, 20190, 20191, and 20194 Reston, and 22015 Burke.",
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
      "McLean is unincorporated Fairfax County. ZIP 22101 covers the estate streets along Georgetown Pike, Old Dominion Drive, and Chain Bridge Road: large lots and one-off custom houses. ZIP 22102 is closer to Tysons and Route 123, with more attached housing around the commercial core. Building permits go through Fairfax County Land Development Services. Some neighborhoods require HOA architectural review, and many estate streets do not. A county permit is not HOA approval. The drive from Martinsburg is Route 9 to Leesburg, then Route 7 east, or Route 7 to Route 28 and I-66 to the Beltway. The remodeling this page is for is kitchens, primary suites, finished lower levels, and additions.",
    neighborhoods: ['Georgetown Pike', 'Old Dominion Drive', 'Chain Bridge Road', 'Langley', 'Chesterbrook', 'ZIP 22102'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'remodeling', 'additions'],
  },
  'alexandria-va': {
    description:
      "Alexandria is an independent city, not Fairfax County. Building permits are issued by the city's Code Administration. Exterior work in the Old and Historic Alexandria District or the Parker-Gray District, and on buildings the council has designated as 100-year-old, needs a Certificate of Appropriateness from the Board of Architectural Review when the change is visible from a public way. Interior kitchens and baths do not need that review unless the work changes the outside. Demolition of more than 25 square feet of material needs a Permit to Demolish regardless of visibility. Belle Haven, Rosemont, and North Ridge are later neighborhoods inside the city. Fort Hunt, ZIP 22308, uses an Alexandria mailing address and is mostly Fairfax County; it has its own page. The drive from Martinsburg is Route 9 to Leesburg, then Route 7 east to I-495. The remodeling this page is for is kitchens, primary suites, careful additions, and finished lower levels.",
    neighborhoods: ['Old Town', 'Parker-Gray', 'Belle Haven', 'Rosemont', 'North Ridge', 'Del Ray'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'remodeling', 'additions'],
  },
  'vienna-va': {
    description:
      "Vienna is an incorporated town in Fairfax County. A Vienna mailing address is not always inside town limits: Oakton and Dunn Loring have their own pages. Inside town, Fairfax County Land Development Services is the building official. The town reviews zoning and site plans, including grading, against the town code. ZIPs 22180, 22181, and 22182 cover the town and its edges: mid-century houses on tree-lined streets, later colonials, and newer infill along Maple Avenue and Hunter Mill Road. The drive from Martinsburg is Route 9 to Leesburg, then Route 7 to I-66 or Route 123. The remodeling this page is for is kitchens, primary suites, finished lower levels, and additions.",
    neighborhoods: ['Maple Avenue', 'Hunter Mill Road', 'ZIP 22180', 'ZIP 22181', 'ZIP 22182', 'Town limits'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'remodeling', 'additions'],
  },
  'great-falls-va': {
    description:
      "Great Falls is an unincorporated community in northern Fairfax County, ZIP 22066. The housing is large-lot custom houses along Georgetown Pike, Riverbend Road, and Seneca Road. It is not one master-planned community. Building permits go through Fairfax County Land Development Services. Where a lot is on a private well or septic system, a bedroom addition also needs Fairfax County Health Department approval before the building permit. The drive from Martinsburg is Route 9 to Leesburg, then Route 7 east toward Georgetown Pike. The remodeling this page is for is kitchens, primary suites, additions, and outdoor living.",
    neighborhoods: ['Georgetown Pike', 'Riverbend Road', 'Seneca Road', 'ZIP 22066', 'Walker Road', 'Springvale Road'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'remodeling', 'additions'],
  },
  'reston-va': {
    description:
      "Reston is an unincorporated planned community in Fairfax County. Building permits go through Land Development Services. Exterior changes also go through Reston Association design review. A county permit is not that approval. The original villages and the houses around Lake Anne and Lake Audubon are mostly 1960s through 1980s, on public water and sewer, with later housing toward Reston Town Center and the Silver Line. ZIPs 20190, 20191, and 20194 cover the community. The drive from Martinsburg is Route 9 to Leesburg, then Route 7 to Route 28 and the Dulles Toll Road, or I-66 to Route 28. The remodeling this page is for is kitchens, primary suites, finished lower levels, and outdoor living.",
    neighborhoods: ['Lake Anne', 'Lake Audubon', 'Hunters Woods', 'South Lakes', 'Reston Town Center', 'North Point'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'remodeling', 'additions'],
  },
  'burke-va': {
    description:
      "Burke is unincorporated Fairfax County, ZIP 22015. Burke Centre, Lake Braddock, and the streets around Burke Lake are mostly 1970s through 1990s single-family houses on public water and sewer. Burke Centre has its own architectural review, separate from the Fairfax County building permit through Land Development Services. A county permit is not HOA approval. The drive from Martinsburg is Route 9 to Leesburg, then Route 7 to Route 28 and I-66, then south on the Fairfax County Parkway. The remodeling this page is for is kitchens, primary suites, finished lower levels, and additions.",
    neighborhoods: ['Burke Centre', 'Lake Braddock', 'Burke Lake', 'ZIP 22015', 'Burke Station', 'Longwood Knolls'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'remodeling', 'additions'],
  },
  'fairfax-station-va': {
    description:
      "Fairfax Station is unincorporated Fairfax County, ZIP 22039. The housing is larger-lot custom houses south of the county core, including Crosspointe and the South Run corridor, with more acreage toward Clifton. Building permits go through Fairfax County Land Development Services. Some subdivisions have an HOA architectural review. Where a lot is on a private well or septic system, a bedroom addition also needs Fairfax County Health Department approval before the building permit. The drive from Martinsburg is Route 9 to Leesburg, then Route 7 to Route 28 and I-66. The remodeling this page is for is kitchens, primary suites, additions, and outdoor living.",
    neighborhoods: ['Crosspointe', 'South Run', 'ZIP 22039', 'Burke Lake Road', 'Hampton Road', 'Clifton Road'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'remodeling', 'additions'],
  },
  'clifton-va': {
    description:
      "Clifton is an incorporated town in southern Fairfax County, and most of ZIP 20124 is unincorporated county around the village, not inside the town. A Clifton mailing address is not Town zoning. Inside the town, a project needs a use permit from the Planning Commission and Town Council, a certificate of appropriateness from the Clifton Architectural Review Board, and a building permit from Fairfax County Land Development Services. The county will not accept the building-permit application without those town approvals and the mayor's signature. Outside town limits, county building and zoning apply. Where a lot is on a private well or septic system, a bedroom addition also needs Fairfax County Health Department approval before the building permit. The drive from Martinsburg is Route 9 to Leesburg, then Route 7 to Route 28 and I-66, then south toward Clifton Road. The remodeling this page is for is kitchens, primary suites, additions, and outdoor living.",
    neighborhoods: ['Clifton village', 'Main Street', 'ZIP 20124', 'Clifton Road', 'Compton Road', 'Newman Road'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'remodeling', 'additions'],
  },
  'middleburg-va': {
    description:
      "Middleburg is an incorporated Loudoun town on Route 50. A Middleburg mailing address is not automatically Town limits — parcels along Atoka, Foxcroft, and Goose Creek are often unincorporated county, and many of those lots are on well and septic. A bedroom addition on a well-and-septic lot needs Loudoun Health Department approval before the building permit. Inside Town, a Zoning Location Permit is required for a deck, shed, fence, detached garage, or any work that also needs a Loudoun County building permit; the county issues building permits county-wide and still expects Town zoning first. Exterior work in the Historic District also needs a Certificate of Appropriateness from the Historic District Review Committee — complete applications are due 14 days before the meeting, and decks are on the Town's published COA list. Outside Town, county building and zoning apply (Typical Deck $265 / full plans $395 under 1,000 sq ft). The drive from Martinsburg is Route 9 to Leesburg, then south to Route 50. The remodeling this page is for is kitchens, primary suites, additions, and outdoor living.",
    neighborhoods: ['Historic District', 'Main Street', 'Atoka Road', 'Foxcroft Road', 'Goose Creek'],
    marketEmphasis: ['kitchens', 'bathrooms', 'additions', 'decks', 'remodeling'],
  },
  'purcellville-va': {
    description:
      "Purcellville is an incorporated town on Route 7 in western Loudoun. A Purcellville mailing address is not always inside town limits: Wright Farm and Mayfair sit in the county's Joint Land Management Area beside the town. Inside town limits, town zoning is approved before Loudoun County issues the building permit. The housing is a late-19th and early-20th century village along Main Street (Business Route 7), plus later subdivisions. Lots outside the town sewer are often on well and septic, and a bedroom addition on those lots needs Loudoun Health Department approval before the building permit. The drive from Martinsburg is Route 9 to Leesburg, then Route 7 west. The remodeling this page is for is kitchens, primary suites, basements, additions, and outdoor living.",
    neighborhoods: ['Historic downtown', 'Main Street', 'Route 7', 'Wright Farm', 'Mayfair'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'additions', 'decks', 'remodeling'],
  },
  'round-hill-va': {
    description:
      "Round Hill is an incorporated town on Route 7, west of Purcellville. The village core is small. Newer houses sit on larger lots toward the county line, and many of those lots are on well and septic rather than town utilities. A bedroom addition on a well-and-septic lot needs Loudoun Health Department approval before the building permit. Inside town limits, town zoning is approved before the county issues the building permit. Round Hill is not one of the county's six historic overlay districts. The drive from Martinsburg is Route 9 to Leesburg, then Route 7 west. The remodeling this page is for is kitchens, primary suites, additions, basements, and outdoor living.",
    neighborhoods: ['Historic village', 'Loudoun Street', 'Route 7', 'West of town'],
    marketEmphasis: ['kitchens', 'bathrooms', 'additions', 'basements', 'decks', 'remodeling'],
  },
  'lovettsville-va': {
    description:
      "Lovettsville is an incorporated town in northern Loudoun, near the Potomac and the Maryland line. The approach from the south is Route 287, the Berlin Turnpike, off Route 9. The town is a 19th-century village with later houses on lots that are often on well and septic. A bedroom addition on a well-and-septic lot needs Loudoun Health Department approval before the building permit. Inside town limits, town zoning is approved before the county issues the building permit. Lovettsville is not one of the county's six historic overlay districts. The drive from Martinsburg is Route 9, then north on Route 287. The remodeling this page is for is kitchens, primary suites, additions, basements, and outdoor living.",
    neighborhoods: ['Historic downtown', 'Berlin Turnpike', 'Route 287', 'North of Route 9'],
    marketEmphasis: ['kitchens', 'bathrooms', 'additions', 'basements', 'decks', 'remodeling'],
  },
  'waterford-va': {
    description:
      "Waterford is an unincorporated village northwest of Leesburg. Loudoun County's Waterford Historic and Cultural Conservation District covers the central village, and most exterior changes there — additions, porches, new accessory buildings, and material changes — need a Certificate of Appropriateness from the Historic District Review Committee before work starts. Ordinary repairs that do not change design, material, or appearance are the exception the county publishes. The National Historic Landmark boundary is larger than the county district, which is limited to the central village. Interior kitchens, primary baths, and lower levels do not need that exterior review unless the work changes the outside. Many village and edge lots are on well and septic, so a bedroom addition also needs Loudoun Health Department approval before the building permit. The drive from Martinsburg is Route 9 through Hillsboro, then the local roads north of Leesburg. The remodeling this page is for is kitchens, primary suites, careful additions, and outdoor living that can pass historic review.",
    neighborhoods: ['Main Street', 'Second Street', 'The mill', 'Village edge'],
    marketEmphasis: ['kitchens', 'bathrooms', 'additions', 'decks', 'remodeling'],
  },
  'hamilton-va': {
    description:
      "Hamilton is an incorporated town on Route 7 between Purcellville and Leesburg. The core is a small 19th-century village. Houses toward the edges often sit on well and septic rather than town utilities. A bedroom addition on a well-and-septic lot needs Loudoun Health Department approval before the building permit. Inside town limits, town zoning is approved before the county issues the building permit. Hamilton is not one of the county's six historic overlay districts. The drive from Martinsburg is Route 9 to Leesburg, then Route 7 west. The remodeling this page is for is kitchens, primary suites, basements, additions, and outdoor living.",
    neighborhoods: ['Historic downtown', 'Route 7', 'East toward Leesburg', 'West toward Purcellville'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'additions', 'decks', 'remodeling'],
  },
  'aldie-va': {
    description:
      "Aldie is an unincorporated village on Route 50 in southern Loudoun. The village and its mill sit in the Aldie Historic and Cultural Conservation District. Exterior changes there — additions, porches, accessory buildings, and material changes — need a Certificate of Appropriateness from the Historic District Review Committee before work starts. Newer communities nearby, including Willowsford, are a separate review from the village overlay: county permits, and the community's own architectural standards where those apply. Acreage lots are often on well and septic. A bedroom addition on a well-and-septic lot needs Loudoun Health Department approval before the building permit. The drive from Martinsburg is Route 9 to Leesburg, then south to Route 50. The remodeling this page is for is kitchens, primary suites, additions, and outdoor living.",
    neighborhoods: ['Aldie village', 'The mill', 'Route 50', 'Willowsford'],
    marketEmphasis: ['kitchens', 'bathrooms', 'additions', 'decks', 'remodeling'],
  },
  'lansdowne-va': {
    description:
      "Lansdowne is a planned community on the Potomac, east of Leesburg along Route 7. It is unincorporated Loudoun County. Many houses use a Leesburg mailing address, which does not make the parcel Town of Leesburg zoning. County building and zoning run through LandMARC, and exterior changes also go through the community's architectural review. The housing is mostly 1990s and 2000s production and custom homes on public water and sewer, with unfinished basements and builder-grade kitchens and primary baths. This is not a well-and-septic market. The drive from Martinsburg is Route 9 to Leesburg, then Route 7 east. The remodeling this page is for is basements, kitchens, primary suites, outdoor living, and additions.",
    neighborhoods: ['Lansdowne on the Potomac', 'Resort corridor', 'Route 7', 'Residential villages'],
    marketEmphasis: ['basements', 'kitchens', 'bathrooms', 'decks', 'additions', 'remodeling'],
  },
  'south-riding-va': {
    description:
      "South Riding is a census-designated planned community in southeastern Loudoun, along Route 50. The Board of Supervisors approved it in 1993, and houses have been built since the mid-1990s. It is unincorporated county: schools and building permits are Loudoun's, and the South Riding Proprietary — incorporated in 1995 — governs common areas and architectural standards. Exterior changes need that review as well as the county permit. Homes are on public water and sewer, and many still have unfinished basements and builder-grade kitchens and primary baths. The drive from Martinsburg is Route 9 to Leesburg, then south to Route 50. The remodeling this page is for is basements, kitchens, primary suites, outdoor living, and additions.",
    neighborhoods: ['Town Center', 'Center Street', 'Route 50', 'Residential sections'],
    marketEmphasis: ['basements', 'kitchens', 'bathrooms', 'decks', 'additions', 'remodeling'],
  },
  'sterling-va': {
    description:
      "Sterling is an unincorporated community in eastern Loudoun, between Route 7 and Route 28. Sterling Park dates from the early 1960s. Later planned communities — Cascades, Potomac Falls, Sugarland Run, Countryside, and Lowes Island — are mostly 1980s through 2000s houses on public water and sewer. Several of those communities require HOA architectural review for exterior work, separate from the county permit through LandMARC. Older Sterling Park houses are the ones most often opened up for a new kitchen, a primary suite, or a finished lower level. The drive from Martinsburg is Route 9 to Leesburg, then Route 7 east. The remodeling this page is for is basements, kitchens, primary suites, outdoor living, and additions.",
    neighborhoods: ['Sterling Park', 'Cascades', 'Potomac Falls', 'Sugarland Run', 'Countryside', 'Lowes Island'],
    marketEmphasis: ['basements', 'kitchens', 'bathrooms', 'decks', 'additions', 'remodeling'],
  },

  /* ---------- Prince William County + Fairfax towns added 2026-09-27 ---------- */
  'prince-william-county-va': {
    description:
      "Prince William County on this page is the western end of the county, along I-66, Route 15, and Route 28. Haymarket, Gainesville, and Bristow are mostly 1990s through 2010s houses in planned communities on public water and sewer. Those communities also require HOA architectural review. A county permit is not HOA approval. Nokesville is more acreage, and many of those lots are on well and septic. Building permits are issued by the Prince William County Department of Development Services. Haymarket is an incorporated town: since January 15, 2018 the county issues the building permit, and the town still requires zoning approval first. A bedroom addition on a well-and-septic lot needs Prince William Health District approval before the building permit. The drive from Martinsburg is Route 9 to Leesburg, then Route 15 south, or Route 7 to Route 28 and I-66 west. ZIP codes with their own pages: 20169 Haymarket, 20155 Gainesville, 20136 Bristow, and 20181 Nokesville. ZIP 20112 uses a Manassas mailing address on the county side of the independent city, and ZIP 20143 is Catharpin. Both sit in this western band and do not have their own pages. Woodbridge and Dumfries are a different market and are not listed here.",
    neighborhoods: ['20169 Haymarket', '20155 Gainesville', '20136 Bristow', '20181 Nokesville', '20112 Manassas', '20143 Catharpin'],
    marketEmphasis: ['basements', 'kitchens', 'bathrooms', 'decks', 'additions', 'remodeling'],
  },
  'oakton-va': {
    description:
      "Oakton is an unincorporated community in Fairfax County, ZIP 22124, between Vienna and Fairfax along Route 123. It is not part of the Town of Vienna. Building and zoning run through Fairfax County Land Development Services. The housing is mostly 1960s through 1990s colonials on wooded lots, with newer infill closer to I-66. Some clusters have an HOA architectural review. A county permit is not that approval. The drive from Martinsburg is Route 9 to Leesburg, then Route 7 to I-66 or Route 123. The remodeling this page is for is kitchens, primary suites, finished lower levels, and additions.",
    neighborhoods: ['Route 123', 'ZIP 22124', 'Hunter Mill', 'Jermantown Road', 'Oakton', 'I-66'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'remodeling', 'additions'],
  },
  'dunn-loring-va': {
    description:
      "Dunn Loring is an unincorporated community in Fairfax County, ZIP 22027, at I-66 and the Beltway beside the Dunn Loring-Merrifield Metro. The housing is a mix of mid-century ramblers, later colonials, and townhouses, on public water and sewer. Building permits go through Fairfax County Land Development Services. Some communities require HOA architectural review. A county permit is not that approval. The drive from Martinsburg is Route 9 to Leesburg, then Route 7 to I-66. The remodeling this page is for is kitchens, primary suites, finished lower levels, and additions.",
    neighborhoods: ['ZIP 22027', 'Gallows Road', 'Idylwood', 'I-66', 'Prosperity Avenue', 'Merrifield'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'remodeling', 'additions'],
  },
  'fort-hunt-va': {
    description:
      "Fort Hunt is an unincorporated community in southeastern Fairfax County. ZIP 22308 uses an Alexandria mailing address, which does not make the parcel part of the City of Alexandria. Building permits go through Fairfax County Land Development Services, not Alexandria Code Administration. The housing is mostly mid-century houses on larger lots along Fort Hunt Road and the George Washington Memorial Parkway, including Hollin Hills. Hollin Hills is a historic overlay, so exterior changes there are a separate county review from a typical building permit. The drive from Martinsburg is Route 9 to Leesburg, then Route 7 east to I-495 and the parkway. The remodeling this page is for is kitchens, primary suites, additions, and finished lower levels.",
    neighborhoods: ['Fort Hunt Road', 'Hollin Hills', 'ZIP 22308', 'Wellington', 'Collingwood', 'George Washington Parkway'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'remodeling', 'additions'],
  },
  'haymarket-va': {
    description:
      "Haymarket is an incorporated town in western Prince William County, ZIP 20169, at I-66 and Route 15. The incorporated town is the village along Washington Street. Piedmont and Dominion Valley sit in the county around it and use the same ZIP. Since January 15, 2018, the Prince William County Department of Development Services issues building permits inside the town, and the town still requires zoning approval before that application. Outside town, county building and zoning apply, and the planned communities require HOA architectural review. A county permit is not HOA approval. The houses are mostly 1990s through 2010s production and custom homes on public water and sewer. The drive from Martinsburg is Route 9 to Leesburg, then Route 15 south. The remodeling this page is for is basements, kitchens, primary suites, outdoor living, and additions.",
    neighborhoods: ['Washington Street', 'Piedmont', 'Dominion Valley', 'Route 15', 'I-66', 'ZIP 20169'],
    marketEmphasis: ['basements', 'kitchens', 'bathrooms', 'decks', 'additions', 'remodeling'],
  },
  'gainesville-va': {
    description:
      "Gainesville is unincorporated Prince William County, ZIP 20155, along I-66 and Route 29. Heritage Hunt and the subdivisions off Route 29 and Virginia Gateway are mostly 1990s through 2010s houses on public water and sewer. Building permits go through the Prince William County Department of Development Services, and most of those communities also require HOA architectural review. A county permit is not HOA approval. The drive from Martinsburg is Route 9 to Leesburg, then Route 15 south to I-66, or Route 7 to Route 28 and I-66 west. The remodeling this page is for is basements, kitchens, primary suites, outdoor living, and additions.",
    neighborhoods: ['Heritage Hunt', 'Route 29', 'Virginia Gateway', 'I-66', 'ZIP 20155', 'Heathcote'],
    marketEmphasis: ['basements', 'kitchens', 'bathrooms', 'decks', 'additions', 'remodeling'],
  },
  'bristow-va': {
    description:
      "Bristow is unincorporated Prince William County, ZIP 20136, along Linton Hall Road between Gainesville and Nokesville. Braemar, Victory Lakes, and the Linton Hall subdivisions are mostly 1990s and 2000s houses on public water and sewer, many with unfinished basements. Building permits go through the Prince William County Department of Development Services. Those communities also require HOA architectural review. A county permit is not HOA approval. The drive from Martinsburg is Route 9 to Leesburg, then Route 15 south to I-66 and Linton Hall, or Route 7 to Route 28. The remodeling this page is for is basements, kitchens, primary suites, outdoor living, and additions.",
    neighborhoods: ['Linton Hall Road', 'Braemar', 'Victory Lakes', 'ZIP 20136', 'Route 28', 'I-66'],
    marketEmphasis: ['basements', 'kitchens', 'bathrooms', 'decks', 'additions', 'remodeling'],
  },
  'nokesville-va': {
    description:
      "Nokesville is an unincorporated rural community in southwestern Prince William County, ZIP 20181. Houses sit on larger lots along Route 28 and Aden Road, and many of those lots are on well and septic rather than public sewer. A bedroom addition on a well-and-septic lot needs Prince William Health District approval before the building permit. Building permits otherwise go through the Prince William County Department of Development Services. This is not a master-planned HOA market. The drive from Martinsburg is Route 9 to Leesburg, then Route 15 south to Route 28. The remodeling this page is for is kitchens, primary suites, additions, and outdoor living.",
    neighborhoods: ['Route 28', 'Aden Road', 'ZIP 20181', 'Bristow Road', 'Nokesville village', 'Marsteller Road'],
    marketEmphasis: ['kitchens', 'bathrooms', 'additions', 'decks', 'remodeling'],
  },
  'springfield-va': {
    description:
      "Springfield is unincorporated Fairfax County, not its own city. The four ZIP centroids checked on 2026-09-29 all landed in the county: Newington Forest (22153, median year built 1981), West Springfield (22152, 1975), North Springfield (22151, 1962), and Springfield CDP (22150, 1978). Building permits go through Fairfax County Land Development Services and the PLUS system. The county's permit page lists finished basements, kitchen renovations, bathroom remodels, and decks among work that needs a permit. A detached shed of 256 square feet or less and one story does not. The county's named historic-overlay list does not make the whole Springfield area a historic district. Subdivision and HOA names for these ZIPs were not verified.",
    neighborhoods: ['Newington Forest', 'West Springfield', 'North Springfield', 'ZIP 22150', 'ZIP 22151', 'ZIP 22153'],
    marketEmphasis: ['basements', 'kitchens', 'bathrooms', 'decks', 'additions', 'remodeling'],
    faqs: [
      {
        question: 'Does Springfield have its own building department?',
        answer:
          'No. The ZIP centroids that were checked are unincorporated Fairfax County. Building permits go through Fairfax County Land Development Services.',
      },
      {
        question: 'Does a finished basement in Springfield need a county permit?',
        answer:
          'The county page lists finished basements under interior alterations that need a permit. Confirm the parcel is in the county before applying.',
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
      "A Herndon mailing address is not automatically inside the Town of Herndon. The 20170 centroid is Dranesville CDP in Fairfax County, and the 20171 centroid is Franklin Farm CDP in Fairfax County. County parcels use Fairfax County Land Development Services. The county page lists finished basements and decks as work that needs a permit. Town permit steps were not retrieved: herndon-va.gov returned HTTP 403, so this page does not describe the town's rules. Do not treat the census name Franklin Farm as an HOA. Fairfax County's named historic overlays do not include a Herndon or Franklin Farm district. Dranesville Tavern is a named overlay site, and that is not a finding that ZIP 20170 sits inside it.",
    neighborhoods: ['ZIP 20170', 'ZIP 20171', 'Dranesville CDP', 'Franklin Farm CDP'],
    marketEmphasis: ['basements', 'kitchens', 'bathrooms', 'decks', 'additions', 'remodeling'],
    faqs: [
      {
        question: 'Which office permits a Herndon address?',
        answer:
          'If the parcel is in Fairfax County, it is Land Development Services. The ZIP centroids that were checked are in the county. Town-limit steps were not available from the town site.',
      },
      {
        question: 'Does a county finished basement need a permit?',
        answer:
          'Yes, on Fairfax County\'s "when a permit is required" page. That rule is for county land, not a substitute for the town code.',
      },
      {
        question: 'Is Franklin Farm an HOA this page can explain?',
        answer:
          'Franklin Farm is the census place name at the 20171 centroid. Any association rules are unverified, so this page does not describe them.',
      },
    ],
  },
  'chantilly-va': {
    description:
      "This page is Fairfax County Chantilly, ZIP 20151. That centroid is Chantilly CDP in Fairfax County, median year built 1988. ZIP 20152 is South Riding in Loudoun County and already has its own page; its income is not Chantilly's. County permits go through Fairfax County Land Development Services. The county page lists decks among additions that need a permit, and finished basements among interior work that needs a permit. The Sully Historic Overlay page is about the Sully house, which Richard Bland Lee began in 1793 and which the county park authority now runs as a museum. It does not say the overlay covers Chantilly houses. Check the map before claiming a house is inside it.",
    neighborhoods: ['ZIP 20151', 'Chantilly CDP'],
    marketEmphasis: ['basements', 'kitchens', 'bathrooms', 'decks', 'additions', 'remodeling'],
    faqs: [
      {
        question: 'Which Chantilly is this page?',
        answer:
          'Fairfax County ZIP 20151. ZIP 20152 is South Riding in Loudoun County and has its own service-area page.',
      },
      {
        question: 'Who permits a deck in ZIP 20151?',
        answer:
          'Fairfax County Land Development Services. The county page lists decks among additions and structures that need a permit.',
      },
      {
        question: 'Is Chantilly inside the Sully Historic Overlay?',
        answer:
          'The Sully page describes the historic house and its district, now a county museum. It does not say the overlay covers Chantilly houses. Check the map.',
      },
    ],
  },
  'centreville-va': {
    description:
      "Centreville here is Fairfax County, not a town government. ZIP 20120's centroid is Bull Run CDP (median year built 1992) and ZIP 20121's centroid is Centreville CDP (median year built 1991). Most of that housing is 1980s and 1990s. Building permits for county land go through Fairfax County Land Development Services, and the county page lists finished basements as work that needs a permit. There is a real Centreville Historic Overlay District. The county page traces it to the old village on Braddock's Road, platted after a 1792 petition, not to the modern CDP as a whole. Work inside a county historic overlay goes to the Architectural Review Board. Which modern houses sit inside that overlay was not read off the map. HOA names were not verified.",
    neighborhoods: ['ZIP 20120', 'ZIP 20121', 'Bull Run CDP', 'Centreville CDP'],
    marketEmphasis: ['basements', 'kitchens', 'bathrooms', 'decks', 'additions', 'remodeling'],
    faqs: [
      {
        question: 'Who permits a basement in Centreville?',
        answer:
          'For county land, Fairfax County Land Development Services. The county page lists finished basements as work that needs a permit. These ZIP centroids are county land.',
      },
      {
        question: 'Is all of Centreville in the historic district?',
        answer:
          'No. The county describes the Centreville overlay as old Centreville. Most housing in ZIPs 20120 and 20121 was built in the 1980s and 1990s.',
      },
      {
        question: 'Does the historic overlay change a kitchen that never touches the outside?',
        answer:
          'That interior-only rule was not verified from the pages that were read. The Architectural Review Board exists for overlay districts. Read the ARB procedure before assuming an interior project is covered.',
      },
    ],
  },
  'falls-church-va': {
    description:
      "This page is the City of Falls Church, an independent city. ZIP 22046's centroid is the city (median year built 1969). ZIPs 22042 and 22043 use a Falls Church mailing name, but their centroids are Fairfax County: West Falls Church CDP and Idylwood CDP. Those county parcels use Fairfax County Land Development Services, not the city. Inside the city, the permit counter listed on the city's requirements page is 300 Park Avenue, Falls Church, VA 22046. The city's \"when a permit is required\" page says any wall change needs a permit, moving or adding a plumbing fixture needs a permit, and any gas work, including replacing a stove or fireplace insert, needs a permit. Paint, carpet, tile, cabinet replacement, and a roof replacement that does not replace rafters or a major portion of the decking do not. The city's Historic Architectural Review Board reviews permits to demolish or move protected structures. Protected residences are those built during or before 1910, plus others the ordinance names. That board does not apply to the county ZIPs. HOA names were not verified.",
    neighborhoods: ['ZIP 22046', 'Park Avenue', 'City of Falls Church'],
    marketEmphasis: ['basements', 'kitchens', 'bathrooms', 'decks', 'additions', 'remodeling'],
    faqs: [
      {
        question: 'Does "Falls Church" on an envelope mean the city building department?',
        answer:
          'Not always. ZIP 22046\'s centroid is the city. ZIP 22042 and 22043 centroids are Fairfax County. Check the parcel.',
      },
      {
        question: 'Does replacing a gas stove in the city need a permit?',
        answer:
          'The city page says any gas work, including replacing a stove or fireplace insert, requires a permit.',
      },
      {
        question: 'Does every city house go through HARB for a kitchen?',
        answer:
          'The HARB page that was read covers permits to demolish or move protected structures. Protected residences are those built during or before 1910, plus others the ordinance names. It does not say ordinary interior work goes to HARB.',
      },
    ],
  },
  'fairfax-va': {
    description:
      "This page is the City of Fairfax, an independent city. ZIP 22030's centroid is the city (median year built 1992). ZIP 22031's centroid is Mantua CDP in Fairfax County. ZIP 22032's centroid is Kings Park West CDP in Fairfax County, and that higher-income ZIP is not the city's income. County parcels use Fairfax County Land Development Services. City permit steps were not published here: the city site returned HTTP 403, so this page does not name a city department, address, or city permit checklist. Kings Park West and Mantua are census place names at those centroids, not verified HOA documents. The county historic-overlay list that was read does not include those two names.",
    neighborhoods: ['ZIP 22030', 'City of Fairfax'],
    marketEmphasis: ['basements', 'kitchens', 'bathrooms', 'decks', 'additions', 'remodeling'],
    faqs: [
      {
        question: 'Is the higher-income Fairfax ZIP the city?',
        answer:
          'No. ZIP 22032\'s centroid is Kings Park West in Fairfax County. The city centroid that was checked is ZIP 22030.',
      },
      {
        question: 'Can this page explain city basement permits?',
        answer:
          'Not yet. The city site did not serve its permit pages in the 2026-09-29 research. County basement rules apply to county parcels only.',
      },
      {
        question: 'Is Kings Park West an HOA?',
        answer:
          'The census place name is verified. Any association rules are unverified, so this page does not describe them.',
      },
    ],
  },
  'manassas-va': {
    description:
      "This page is the City of Manassas, an independent city. ZIP 20110's centroid is the city (median year built 1986). Development Services is at 9027 Center Street, 2nd Floor, Manassas, VA 20110, phone 703-257-8278. The city lists building, trade, occupancy, site, utility, zoning, and demolition permits, and it names Walk Through Wednesdays for limited-scope projects such as decks or fences. ZIP 20109's centroid is Bull Run CDP in Prince William County. ZIP 20112's centroid is Prince William County and is not the city. ZIP 20111's centroid is the City of Manassas Park, a different city. County parcels use Prince William County Development Services. The county page says a deck needs a permit when the floor is 16.5 inches or more above finished grade. Do not apply that county number inside the city; the city threshold was not extracted. The county says Buckland is currently its only historic overlay district. No HOA name was verified for these ZIPs.",
    neighborhoods: ['ZIP 20110', 'Center Street', 'City of Manassas'],
    marketEmphasis: ['basements', 'kitchens', 'bathrooms', 'decks', 'additions', 'remodeling'],
    faqs: [
      {
        question: 'Does a Manassas mailing address use the city permit office?',
        answer:
          'Only if the parcel is in the City of Manassas. ZIP 20109 and 20112 centroids are Prince William County. ZIP 20111\'s centroid is the City of Manassas Park. Check the parcel.',
      },
      {
        question: 'What deck height needs a Prince William County permit?',
        answer:
          'The county page says a permit is required when the floor is 16.5 inches or more above finished grade. That figure was not verified for parcels inside the City of Manassas.',
      },
      {
        question: 'Should this page name a Manassas HOA?',
        answer:
          'No association name was verified for these ZIPs. This page does not name one.',
      },
    ],
  },
  'lake-ridge-va': {
    description:
      "Lake Ridge is a census-designated place in Prince William County. ZIP 22192's centroid is Lake Ridge CDP (median year built 1987), even though the postal name on that ZIP is Woodbridge. It is not the Woodbridge CDP, which is ZIP 22191, and it is not Dale City. Building permits for these county parcels go through Prince William County Development Services. The county page says a deck needs a permit when the floor is 16.5 inches or more above finished grade, and that zoning approval is required for accessory structures such as decks, additions, and garages even when a separate question is whether a building permit is required. The county tells owners to check whether their HOA has covenants. It does not name an association, and the name Lake Ridge is not, in the research, an HOA charter. Buckland is the only county historic overlay the ARB page named. Lake Ridge is not on that list.",
    neighborhoods: ['ZIP 22192', 'Lake Ridge CDP'],
    marketEmphasis: ['basements', 'kitchens', 'bathrooms', 'decks', 'additions', 'remodeling'],
    faqs: [
      {
        question: 'Are Lake Ridge and Woodbridge the same place?',
        answer:
          'No. ZIP 22192\'s centroid is Lake Ridge CDP. ZIP 22191\'s centroid is Woodbridge CDP. Both are Prince William County, and each has its own page.',
      },
      {
        question: 'When does a deck need a Prince William County permit?',
        answer:
          'The county page says when the floor is 16.5 inches or more above finished grade. Zoning approval can still be required for exterior work.',
      },
      {
        question: 'Does the county require HOA approval?',
        answer:
          'The county page tells owners to check whether their HOA has covenants. It does not name an association, and it does not say the county enforces the covenants.',
      },
    ],
  },
  'woodbridge-va': {
    description:
      "Woodbridge on this page is the Woodbridge census-designated place in Prince William County. ZIP 22191's centroid is that CDP (median year built 1999). ZIP 22192 is Lake Ridge CDP and has its own page. ZIP 22193's centroid is Dale City and is not this page. County permits go through Prince William County Development Services. The county page says a deck needs a permit when the floor is 16.5 inches or more above finished grade, and that exterior projects may need zoning approval even when no building permit is required. The county tells owners to check HOA covenants and does not name an association. Buckland is the only county historic overlay named on the ARB page. Woodbridge is not on that list. The Town of Occoquan is a different permit path and is not included here.",
    neighborhoods: ['ZIP 22191', 'Woodbridge CDP'],
    marketEmphasis: ['basements', 'kitchens', 'bathrooms', 'decks', 'additions', 'remodeling'],
    faqs: [
      {
        question: 'Which Woodbridge ZIP is this page?',
        answer:
          'ZIP 22191, whose centroid is Woodbridge CDP in Prince William County. ZIP 22192 is Lake Ridge. ZIP 22193 is Dale City and is not this page.',
      },
      {
        question: 'When does a deck need a county permit?',
        answer:
          'Prince William County says a permit is required when the floor is 16.5 inches or more above finished grade.',
      },
      {
        question: 'Is Occoquan part of this page?',
        answer:
          'No. Occoquan is a town with its own zoning step. This page is the Woodbridge CDP in the county.',
      },
    ],
  },
  'warrenton-va': {
    description:
      "Warrenton is an incorporated town in Fauquier County. The charter dates to 1816. A Warrenton mailing address is not automatically inside the town: the centroids of ZIP 20186 and ZIP 20187 both landed in Fauquier County, outside an incorporated place. Inside the town, the Department of Community Development handles applications at the town site, phone (540) 347-1101. The town building page says a building permit is required for decks whose floor is 30 inches or more above finished grade, for finishing a basement, and for additions, garages, or carports. An areaway or egress window on a basement needs additional zoning review. A Certificate of Appropriateness is required before exterior alterations inside the Warrenton Historic District. Which streets are inside that district was not read off the map. County permit steps outside town limits were not retrieved. HOA names outside the historic district were not verified. ZIP 20187's housing is mostly detached (median year built 1991). ZIP 20186 is a different mix (median year built 1987) and should not be averaged into one house type.",
    neighborhoods: ['Town of Warrenton', 'ZIP 20186', 'ZIP 20187', 'Fauquier County'],
    marketEmphasis: ['basements', 'kitchens', 'bathrooms', 'decks', 'additions', 'remodeling'],
    faqs: [
      {
        question: 'Does every Warrenton address use the town\'s 30-inch deck rule?',
        answer:
          'Only inside the town. Both ZIP centroids that were checked landed in Fauquier County, outside an incorporated place. County rules were not readable in the research pass.',
      },
      {
        question: 'Does a basement finish need a permit in town?',
        answer:
          'Yes. The town building page lists finishing a basement, and it says an areaway or egress window needs additional zoning review.',
      },
      {
        question: 'When is the historic certificate required?',
        answer:
          'Before exterior alterations of property in the Warrenton Historic District. The page does not say the certificate applies to the whole ZIP.',
      },
    ],
  },
  'stephens-city-va': {
    description:
      "Stephens City is a chartered town in Frederick County, Virginia. It is not Winchester, which already has its own page. ZIP 22655's centroid is unincorporated Frederick County, so the ZIP is larger than the town. A Stephens City mailing address is not automatically inside the town. Town and county permit pages were not retrieved in the 2026-09-29 research, so this page does not list permit steps. Confirm the parcel before choosing a counter. No historic district or HOA name was verified. Census figures for the ZIP, not the town boundary, show a median year built of 1996.",
    neighborhoods: ['Town of Stephens City', 'ZIP 22655', 'Frederick County, VA'],
    marketEmphasis: ['decks', 'roofing', 'remodeling', 'bathrooms', 'kitchens', 'additions'],
    faqs: [
      {
        question: 'Does ZIP 22655 equal the town?',
        answer:
          'No. The centroid is unincorporated Frederick County. The town exists under its charter. Check the parcel.',
      },
      {
        question: 'Which permit steps does this page publish?',
        answer:
          'None. Both the town site and the Frederick County, Virginia site were unread in the research pass. Do not use Middletown\'s zoning form or Winchester\'s process for this town.',
      },
      {
        question: 'Is this the Winchester page?',
        answer:
          'No. Winchester is a separate city and already has a live service-area page.',
      },
    ],
  },
  'middletown-va': {
    description:
      "Middletown is a town in Frederick County, Virginia, not Middletown, Maryland, and not Frederick, Maryland. The town forms page lists the office at 7875 Church Street, Middletown, VA 22645, and links a zoning application titled for zoning review of building permits. That is a zoning review. It does not name the building official. Who issues the building permit, the town or Frederick County, was not verified. ZIP 22645's census figures, which are the ZIP and not the town boundary, show a population of 4,639 and a median year built of 1985. No historic-district page or HOA name was extracted. Do not use the Frederick, Maryland permit article as this town's process.",
    neighborhoods: ['Church Street', 'ZIP 22645', 'Town of Middletown, VA'],
    marketEmphasis: ['decks', 'roofing', 'remodeling', 'bathrooms', 'kitchens', 'additions'],
    faqs: [
      {
        question: 'Does the town review a building project?',
        answer:
          'The town forms page has a zoning application for zoning review of building permits, filed through the office at 7875 Church Street. That is a zoning review, not proof of who issues the building permit.',
      },
      {
        question: 'Who issues the building permit?',
        answer:
          'That was not verified. This page does not guess Frederick County or the town.',
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
      "Greencastle is a borough in Franklin County, Pennsylvania, ZIP 17225. It is not a township. The borough permits page says work inside borough limits needs a land-use/zoning permit from the borough zoning officer before a building permit. The borough office is 60 North Washington Street, Greencastle, PA 17225, phone 717-597-7143. After that permit, the building permit goes to PA Municipal Code Alliance at 1013 Wayne Avenue, Chambersburg, phone 717-496-4996. The zoning page points at Historic District Maps. This page does not name which parcels those maps cover, and it does not name an HOA.",
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
          'The zoning page references Historic District Maps. Check the parcel.',
      },
    ],
  },
  'chambersburg-pa': {
    description:
      "Chambersburg is a borough and the county seat of Franklin County. It is not the rest of the county. The borough permits page says a land-use permit from Land Use and Community Development comes first. That office is on the second floor of Borough Hall, 100 South Second Street, Chambersburg, PA 17201, phone 717-251-2417. After the borough approves, the applicant contacts PA Municipal Code Alliance at 717-496-4996 for the construction permit. Chapter 113 of the borough code adopts the Pennsylvania Uniform Construction Code. This page does not name neighborhoods or HOAs.",
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
      "Fort Loudon is a community in Peters Township, Franklin County. It is not a borough. The township site lists Fort Loudon with Upton, Lemasters, Markes, and Cove Gap as places under the township supervisors, and it says Mercersburg is a separate borough. The municipal office is 5000 Steel Avenue, Lemasters, PA 17231, open Monday, Tuesday, and Thursday, 8:00 AM to 4:00 PM. Permit steps were not on the township homepage retrieved on 2026-09-29, so this page does not name a building-code agency for Fort Loudon. It is not Loudoun County, Virginia.",
    neighborhoods: ['Fort Loudon', 'Peters Township', 'Lemasters'],
    marketEmphasis: ['remodeling', 'bathrooms', 'kitchens', 'decks', 'roofing', 'additions'],
    faqs: [
      {
        question: 'Is Fort Loudon its own borough?',
        answer:
          'No. Peters Township lists it as a community under the township supervisors. Mercersburg, which the same page names, is the borough with its own government.',
      },
      {
        question: 'Which permit office does this page name?',
        answer:
          'The township office at 5000 Steel Avenue, Lemasters. The homepage did not publish the building-permit steps, so this page does not guess an inspection agency.',
      },
      {
        question: 'Is this Loudoun County, Virginia?',
        answer:
          'No. Fort Loudon is in Franklin County, Pennsylvania. Loudoun County, Virginia already has its own pages.',
      },
    ],
  },
  'mercersburg-pa': {
    description:
      "Mercersburg is a borough in Franklin County, and it has its own government. The borough permits page says land use is handled by borough staff under the subdivision and land-use ordinance, and that PA Municipal Code Alliance is the building-code agency for the borough. A project needs the borough land-use permit first, then the building permit from that agency. The page also says other borough permits, such as sidewalk or curb work, can apply. This page does not name an HOA or a historic district.",
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
          'Not necessarily. The borough page says sidewalk or curb work can require an additional borough permit.',
      },
    ],
  },
  'waynesboro-pa': {
    description:
      "Waynesboro is a borough in Franklin County. The borough zoning page says most projects need a zoning/land-use permit from the borough before a building permit, and that the borough permit or an exemption is required first. Building permits are issued by PA Municipal Code Alliance at 380 Wayne Avenue, Chambersburg, phone 717-496-4996, or by Commonwealth Code Inspection Services at 1102 Sheller Avenue, Chambersburg, phone 717-264-9191. The page says to check the deed for restrictions. This page does not name an HOA.",
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
      {
        question: 'Does the borough page name an HOA?',
        answer:
          'No. It says to check the deed for restrictions. This page does not add an association name.',
      },
    ],
  },
  'fayetteville-pa': {
    description:
      "Fayetteville is an unincorporated community and census-designated place in Franklin County. It is not a borough. The place sits in Greene Township and Guilford Township, so one mailing address is not one permit counter. Greene Township's land-use page lists the office at 1145 Garver Lane, Chambersburg. After a land-use permit, the applicant contacts PA Municipal Code Alliance at 1013 Wayne Avenue, Chambersburg, phone 717-496-4996. Guilford Township's zoning page, 115 Spring Valley Road, Chambersburg, says land-use and driveway permit requests go through that office, phone 717-264-0077. This page does not name an HOA. Check the parcel before choosing an office.",
    neighborhoods: ['Fayetteville', 'Greene Township', 'Guilford Township'],
    marketEmphasis: ['remodeling', 'bathrooms', 'kitchens', 'decks', 'roofing', 'additions'],
    faqs: [
      {
        question: 'Is Fayetteville one township?',
        answer:
          'No. It is a census-designated place in Greene Township and Guilford Township. The parcel decides which office applies.',
      },
      {
        question: 'What does Greene Township publish?',
        answer:
          'A land-use permit first, from the office at 1145 Garver Lane. After that, the applicant contacts PA Municipal Code Alliance at 1013 Wayne Avenue.',
      },
      {
        question: 'What does Guilford Township publish?',
        answer:
          'Land-use and driveway permit requests go through the zoning office at 115 Spring Valley Road, phone 717-264-0077. This page does not copy Greene Township\'s building-code step onto Guilford.',
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
  if (area.state === 'MD') return 'Cumberland Valley and Frederick County area';
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
  // No Fauquier County row yet. Warrenton must not inherit "Northern Virginia"
  // or the Shenandoah label.
  if (area.slug === 'warrenton-va') return 'Fauquier County area';
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
 *    Eastern Panhandle communities (Kearneysville, Harpers Ferry) that don't
 *    have their own pages.
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
      { label: 'Decks & Outdoor Living', href: '/services/decks', description: 'Composite decks, railings, outdoor spaces' },
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
  { src: '/images/work/roofing-finished-dormer.webp', alt: 'New charcoal architectural shingles finished around a dormer', category: 'Roofing', state: 'WV' },
  { src: '/images/work/deck-composite-surface.webp', alt: 'Brown composite decking with a curved run of white vinyl railing', category: 'Decks', state: 'VA' },
  { src: '/images/work/deck-night-rail-moon.jpg', alt: 'Deck stair and railings lit by post-cap lights at night', category: 'Decks', state: 'VA' },
  { src: '/images/work/roofing-finished-overhead.webp', alt: 'Completed architectural shingle roof seen from the ridge', category: 'Roofing', state: 'WV' },
  { src: '/images/work/bath-primary-navy-vanity.webp', alt: 'Navy shaker vanity with matte black pulls and a quartz top', category: 'Bathrooms', state: 'MD', citySlug: 'frederick-md' },
  { src: '/images/deck-lounge.jpg', alt: 'Composite deck set up with outdoor lounge furniture', category: 'Decks', state: 'VA' },
  { src: '/images/work/roof-charcoal-gable.jpg', alt: 'Completed dark architectural shingle roof with clean ridge cap', category: 'Roofing', state: 'WV' },
  { src: '/images/stone-facade-finished.jpg', alt: 'Finished stone veneer porch facade with railings', category: 'Exterior', state: 'WV' },
  { src: '/images/work/flooring-laminate-finished.webp', alt: 'Newly installed light wood-look laminate flooring', category: 'Remodeling', state: 'WV' },
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

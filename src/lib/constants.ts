/**
 * Owner / author identity used by the blog AuthorBox and any future
 * "About the owner" surface. Drop a real portrait at
 * /public/images/team/owner.jpg and set portrait: '/images/team/owner.jpg'
 * here to replace the placeholder. Set name/title once finalized.
 */
export const OWNER = {
  name: 'Real Elite Contracting Team',
  title: 'Veteran-Owned · Built With Military Precision',
  /** Set to '/images/team/owner.jpg' once the real portrait lands. */
  portrait: null as string | null,
} as const;

export const BUSINESS = {
  name: 'Real Elite Contracting',
  tagline: "Eastern Panhandle's Most Trusted Contractor",
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
  veteranOwned: true,
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
      'Interior and exterior remodels — kitchens, bathrooms, basements, and full home renovations under one project lead.',
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
 *
 * This is AREA-level retirement. Retiring one service+city combo while
 * keeping the area's overview page is a different operation: remove the key
 * from CONTENT in src/lib/service-city-content.ts and add the matching
 * redirect in next.config.ts. Because that route sets `dynamicParams = false`,
 * removing a key without the redirect ships a hard 404, so the two have to
 * land in the same deploy.
 */
export type AreaStatus = 'active' | 'consolidated';

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
  state: 'WV' | 'MD' | 'VA';
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
  { slug: 'hagerstown-md', city: 'Hagerstown', state: 'MD', kind: 'city', market: 'home', status: 'active', legacyTiers: ['primary', 'expansion'] },
  { slug: 'winchester-va', city: 'Winchester', state: 'VA', kind: 'city', market: 'home', status: 'active', legacyTiers: ['primary', 'expansion'] },

  /* ---------- Loudoun County — premium, and the one NoVA county with a row ---------- */
  { slug: 'leesburg-va', city: 'Leesburg', state: 'VA', kind: 'city', market: 'premium', status: 'active', parent: 'loudoun-county-va', legacyTiers: ['primary', 'expansion'] },
  { slug: 'ashburn-va', city: 'Ashburn', state: 'VA', kind: 'town', market: 'premium', status: 'active', parent: 'loudoun-county-va', legacyTiers: ['primary', 'expansion'] },

  /* ---------- Fairfax County and the inner NoVA suburbs — premium ----------
   * Parented to the `northern-virginia` region row below. That row exists
   * because the basement demand in this market is regional: "basement
   * remodeling northern virginia" reports 110/mo and "basement finishing
   * northern virginia" 90/mo, while every town-level basement term here except
   * Alexandria (70) and McLean (30) is below the reporting floor.
   *
   * Their kitchen and bathroom pages are a different story and stay town-level
   * on purpose — "kitchen remodeling mclean va" is 260/mo and "vienna va" 140.
   * See docs/site-altitude-architecture-2026-09-18.md §1.5.
   */
  { slug: 'mclean-va', city: 'McLean', state: 'VA', kind: 'town', market: 'premium', status: 'active', parent: 'northern-virginia', legacyTiers: ['primary', 'expansion'] },
  { slug: 'alexandria-va', city: 'Alexandria', state: 'VA', kind: 'city', market: 'premium', status: 'active', parent: 'northern-virginia', legacyTiers: ['primary', 'expansion'] },
  { slug: 'vienna-va', city: 'Vienna', state: 'VA', kind: 'town', market: 'premium', status: 'active', parent: 'northern-virginia', legacyTiers: ['primary', 'expansion'] },
  { slug: 'great-falls-va', city: 'Great Falls', state: 'VA', kind: 'town', market: 'premium', status: 'active', parent: 'northern-virginia', legacyTiers: ['primary', 'expansion'] },
  { slug: 'reston-va', city: 'Reston', state: 'VA', kind: 'town', market: 'premium', status: 'active', parent: 'northern-virginia', legacyTiers: ['primary', 'expansion'] },
  { slug: 'burke-va', city: 'Burke', state: 'VA', kind: 'town', market: 'premium', status: 'active', parent: 'northern-virginia', legacyTiers: ['primary', 'expansion'] },
  { slug: 'fairfax-station-va', city: 'Fairfax Station', state: 'VA', kind: 'town', market: 'premium', status: 'active', parent: 'northern-virginia', legacyTiers: ['primary', 'expansion'] },
  { slug: 'clifton-va', city: 'Clifton', state: 'VA', kind: 'town', market: 'premium', status: 'active', parent: 'northern-virginia', legacyTiers: ['primary', 'expansion'] },
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
];

/**
 * Keep only the rows that still publish pages.
 *
 * EVERY derived view runs through this, and that is not incidental. The legacy
 * tier views are rendered as links — the service-areas index, the homepage
 * service-area map, the footer, LocalAreasServed — while `ALL_SERVICE_AREAS`
 * decides which pages get generated. If the two disagree about a consolidated
 * row, the site advertises a link to its own 404. `/service-areas/[slug]` sets
 * no `dynamicParams`, so a slug missing from generateStaticParams renders on
 * demand and hits `notFound()`.
 *
 * Generic over the row type so it can be unit-tested against synthetic rows
 * rather than only against the real catalog, where nothing is consolidated yet
 * and the bug would therefore stay invisible.
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
 *   Hagerstown MD -> roofing, siding, bathrooms
 *   Eastern Panhandle WV -> all services, home market
 */
export type CityDataEntry = {
  description: string;
  neighborhoods: string[];
  marketEmphasis: string[];
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
  'hagerstown-md': {
    description:
      "Hagerstown is the county seat of Washington County, Maryland and the largest city in the Cumberland Valley — a strategically located commercial hub at the intersection of I-70 and I-81. With a mix of historic neighborhoods near Public Square and growing suburban development along the Halfway and Robinwood corridors, Hagerstown's housing stock spans turn-of-the-century brick homes to newer single-family construction. Real Elite Contracting brings premium roofing, siding, and bathroom remodels to Hagerstown homeowners who want craftsmanship that respects both the historic character and modern demands of the region.",
    neighborhoods: ['Public Square Historic District', 'North End', 'Halfway', 'Robinwood', 'South End', 'Fountain Head Heights'],
    marketEmphasis: ['roofing', 'siding', 'bathrooms', 'remodeling', 'decks', 'exterior-repairs'],
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
      "Leesburg is Loudoun County's seat — Town limits around Old Town and the western approach from Route 7 and Route 9, plus Leesburg-address neighborhoods that sit in unincorporated county (Lansdowne, River Creek). A Leesburg mailing address is not automatically Town zoning. We lead here with decks and outdoor living, then kitchens, baths, room additions, and in-law basement finish, and we file Town zoning before the county building permit when the parcel is inside Town. Real Elite Contracting works western Leesburg first from Martinsburg.",
    neighborhoods: ['Historic Old Town Leesburg', 'West of Route 15', 'Lansdowne on the Potomac', 'River Creek'],
    marketEmphasis: ['decks', 'kitchens', 'bathrooms', 'basements', 'additions', 'roofing'],
  },
  'ashburn-va': {
    description:
      "Ashburn is unincorporated Loudoun County — county building and zoning through LandMARC, plus HOA architectural review in nearly every master-planned community. We lead here with decks and outdoor living, then kitchens, baths, room additions, and in-law basement finish. A county permit is not HOA approval; we file both tracks in parallel. Real Elite Contracting works Brambleton, Broadlands, Ashburn Farm, and One Loudoun from Martinsburg.",
    neighborhoods: ['Brambleton', 'Broadlands', 'Ashburn Farm', 'One Loudoun', 'Loudoun Valley Estates', 'Belmont Greene'],
    marketEmphasis: ['decks', 'kitchens', 'bathrooms', 'basements', 'additions', 'roofing'],
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
      "Northern Virginia is the largest remodeling market Real Elite Contracting serves, and the one where the work is most often a lower level. Fairfax and Loudoun counties and the city of Alexandria hold a housing stock built largely between the 1960s and the 2000s, much of it on full-height unfinished basements with walkout or areaway access — space the house already has and is not using. That is why the regional demand here concentrates on basements rather than on any single town: homeowners search for a Northern Virginia or Fairfax County contractor first and narrow down afterwards. Real Elite Contracting is veteran-owned and licensed in West Virginia, Maryland and Virginia, and works this market from its Eastern Panhandle base.",
    neighborhoods: [
      'Fairfax County',
      'Loudoun County',
      'Alexandria',
      'McLean',
      'Vienna',
      'Great Falls',
    ],
    marketEmphasis: ['basements', 'kitchens', 'bathrooms', 'remodeling', 'additions', 'decks'],
  },
  'loudoun-county-va': {
    description:
      "Loudoun County decks run two tracks: county building and zoning through LandMARC, plus HOA review in most master-planned communities. Typical Deck Detail is the published fast path at $265 with 2-day building and 2-day zoning review when the design qualifies; a roof or screen drops you onto full plans at $395 — the county publishes a screened porch as a residential addition. Leesburg, Purcellville, and Middleburg permit separately. We lead the western corridor first — Purcellville, Round Hill, Lovettsville, western Leesburg, selected Middleburg — then kitchens, baths, room additions, and in-law basement finish. A county permit is not HOA approval. Real Elite Contracting works Loudoun from Martinsburg.",
    neighborhoods: ['Purcellville', 'Leesburg', 'Middleburg', 'Ashburn', 'Brambleton', 'Lansdowne'],
    marketEmphasis: ['decks', 'kitchens', 'bathrooms', 'basements', 'additions', 'roofing'],
  },

  /* ---------- Fairfax County, VA (luxury Northern Virginia) ---------- */
  'mclean-va': {
    description:
      "McLean is one of the most affluent communities in the United States — a Fairfax County address known for estate homes, gracious mid-century properties, and discreet, executive-class neighborhoods inside the Beltway. From the long-established streets of Langley Forest and Salona Village to the newer estates along Old Dominion Drive and the wooded enclaves bordering the Potomac, McLean homes are large, architecturally distinct, and held to a standard. Real Elite Contracting brings veteran-led precision and luxury interior work to McLean — primary-bath spa renovations, designer kitchens, finished lower-level entertainment suites, and whole-home renovations executed with the discretion and attention to detail this market expects.",
    neighborhoods: ['Langley Forest', 'Salona Village', 'Chesterbrook', 'Franklin Park', 'Kent Gardens', 'McLean Hamlet'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'remodeling', 'additions'],
  },
  'alexandria-va': {
    description:
      "Alexandria is one of the most architecturally distinctive cities in the country — a historic Potomac River port whose Old Town district carries one of the most concentrated collections of 18th- and 19th-century homes in the United States, alongside premium 20th-century neighborhoods like Belle Haven, Rosemont, North Ridge, and Beverley Hills. Alexandria homeowners care deeply about period accuracy and finish quality, and many of the most beautiful interior renovations in the city are done inside historic envelopes that demand a contractor who can work to museum-grade detail. Real Elite Contracting brings that level of care to Alexandria — historic-respectful kitchens and primary baths, sensitively finished lower levels, and whole-home renovations that honor the architectural pedigree of the address.",
    neighborhoods: ['Old Town', 'Belle Haven', 'Rosemont', 'North Ridge', 'Beverley Hills', 'Del Ray'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'remodeling', 'additions'],
  },

  /* ---------- Fairfax County, VA — Phase 2 luxury cities ---------- */
  'vienna-va': {
    description:
      "Vienna is one of the most desirable interior-renovation markets in Northern Virginia — a Fairfax County town whose homes range from refined mid-century properties on tree-lined streets to substantial newer custom builds along the Maple Avenue corridor and west into Hunter Mill. Vienna homeowners are well-informed, design-conscious, and serious about doing things right; the typical Vienna primary kitchen or primary bath is a thoughtful, designer-collaborative project where finish quality and execution discipline matter more than any single line item. Real Elite Contracting brings veteran-led precision to Vienna — custom kitchens, primary-suite renovations, finished lower-level entertainment suites, and whole-home renovations executed to the standard the address expects.",
    neighborhoods: ['Hunter Mill', 'Tysons-adjacent', 'Wolftrap', 'Maple Avenue corridor', 'Vienna Woods', 'Country Club Manor'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'remodeling', 'additions'],
  },
  'great-falls-va': {
    description:
      "Great Falls is one of the most exclusive addresses in Fairfax County — a community of large lots, mature trees, and discreet estate homes ranging from refined mid-century properties to substantial custom builds with multi-acre privacy. Great Falls projects are some of the most ambitious residential remodels in our service area: primary suites that read as private wings, kitchens designed around catering and entertaining rather than weeknight family dinners, and finished lower levels that include media rooms, wine cellars, gyms, and guest suites under one envelope. Real Elite Contracting brings the craft, the discretion, and the project discipline this market expects.",
    neighborhoods: ['Falls Estates', 'Riverbend', 'Hickory Hill', 'Potomac River corridor', 'Old Dominion Drive', 'Georgetown Pike'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'remodeling', 'additions'],
  },
  'reston-va': {
    description:
      "Reston is a uniquely large premium-remodel market — a planned community that has matured into one of the most active high-end renovation pipelines in Fairfax County. The original master-planned villages, the lakefront homes around Lake Anne and Lake Audubon, and the larger custom properties west of Reston Parkway all share a common dynamic: design-conscious owners renovating homes that were architecturally distinctive on day one and now deserve current-spec interiors. Real Elite Contracting renovates Reston kitchens, primary baths, and lower levels with the design sensitivity these homes were built to live up to.",
    neighborhoods: ['Lake Anne', 'Lake Audubon', 'Hunters Woods', 'North Point', 'South Lakes', 'Reston Town Center area'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'remodeling', 'additions'],
  },
  'burke-va': {
    description:
      "Burke is one of the strongest mid-to-upper-tier remodeling markets in Fairfax County — a well-established community of substantial homes on generous lots, with neighborhoods like Burke Centre, Lake Braddock, and Burke Lake Park drawing families who tend to stay for the long term and invest in the home accordingly. Burke kitchens, primary baths, and lower-level family rooms are bread-and-butter premium remodels — well-specified, beautifully executed, and built to add real value at resale or simply to make the home work better for the family living in it. Real Elite Contracting brings the same craft we bring to the Mclean / Great Falls market, calibrated to the Burke project brief.",
    neighborhoods: ['Burke Centre', 'Lake Braddock', 'Longwood Knolls', 'Burke Station', 'Burke Lake Park area', 'Kings Park West'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'remodeling', 'additions'],
  },
  'fairfax-station-va': {
    description:
      "Fairfax Station is a community of larger lots and substantial custom homes south of the Fairfax County core — a quieter, more private corner of the county where one-acre and multi-acre properties are common, equestrian neighbors are not unusual, and the home itself is treated as a long-term family asset. Fairfax Station projects skew larger and more architecturally ambitious than typical Fairfax County remodels — full primary-suite expansions, kitchens designed around catering and entertaining, lower-level builds that include guest suites, gyms, and media rooms. Real Elite Contracting brings the craft this market expects.",
    neighborhoods: ['Burke Lake Road corridor', 'Lake Braddock-adjacent', 'Hampton Forest', 'South Run', 'Hooes Road area', 'Pohick Road area'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'remodeling', 'additions'],
  },
  'clifton-va': {
    description:
      "Clifton is the small-town heart of southern Fairfax County — an old railroad village whose historic downtown and surrounding country estates form one of the most distinctive luxury enclaves in the area. Clifton properties trend large, private, and architecturally substantial: refined historic homes in the village proper, custom estates on multi-acre parcels along the rural corridors, and a homeowner population that values craft, character, and long-term ownership. Real Elite Contracting renovates Clifton kitchens, primary baths, and lower levels with the discretion and craft this market expects.",
    neighborhoods: ['Historic Clifton Village', 'Clifton Forest', 'Bull Run Estates', 'Compton Road corridor', 'Ridge Road area', 'Yates Ford Road area'],
    marketEmphasis: ['kitchens', 'bathrooms', 'basements', 'remodeling', 'additions'],
  },
  'middleburg-va': {
    description:
      "Middleburg is an incorporated Loudoun town. A Middleburg mailing address is not automatically Town limits — parcels along Atoka, Foxcroft, and Goose Creek are often unincorporated county. Inside Town, a Zoning Location Permit is required for a deck, shed, fence, detached garage, or any work that also needs a Loudoun County building permit; the county issues building permits county-wide and still expects Town zoning first. Exterior work in the Historic District also needs a Certificate of Appropriateness from the Historic District Review Committee — complete applications are due 14 days before the meeting, and decks are on the Town's published COA list. Outside Town, county building and zoning apply (Typical Deck $265 / full plans $395 under 1,000 sq ft). We lead here with decks and outdoor living, then additions, kitchens, and baths, and we work selected Middleburg from Martinsburg.",
    neighborhoods: ['Historic District', 'Main Street', 'Atoka Road', 'Foxcroft Road', 'Goose Creek'],
    marketEmphasis: ['decks', 'additions', 'kitchens', 'bathrooms', 'remodeling'],
  },
};

/**
 * Every area that currently publishes its own pages. Drives
 * generateStaticParams on /service-areas/[slug] and the city lookup on
 * /services/[service]/[city].
 *
 * Reads straight off the catalog now — the old version concatenated three
 * overlapping arrays and de-duplicated by slug, which is what the catalog
 * removes the need for. Consolidated rows drop out here, which is how an
 * area stops generating pages.
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

/** Look a row up by slug, across active and consolidated rows alike. */
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
  if (area.slug === 'loudoun-county-va' || area.parent === 'loudoun-county-va') {
    return 'Loudoun County area';
  }
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
  'Hagerstown, MD',
  'Frederick, MD',
];

export const SERVICE_PAGE_AREA_SERVED: string[] = [
  'Martinsburg, WV',
  'Charles Town, WV',
  'Shepherdstown, WV',
  'Inwood, WV',
  'Frederick, MD',
  'Hagerstown, MD',
  'Winchester, VA',
  'Leesburg, VA',
  'Ashburn, VA',
  'Loudoun County, VA',
];

/**
 * Premium-market slugs — the areas whose pages swap the standard estimate
 * rail for the /design-consultation path, calibrated for $50k+ project
 * intake (pre-qualification, designer status, budget tier, in-home booking).
 *
 * Derived from `market: 'premium'` on the catalog rather than maintained by
 * hand, so a row's tier and its conversion path cannot drift apart. It
 * rewires the CTAs on /service-areas/[slug] and /services/[service]/[slug].
 */
export const LUXURY_CITY_SLUGS: ReadonlySet<string> = new Set<string>(
  SERVICE_AREA_CATALOG.filter((a) => a.market === 'premium').map((a) => a.slug)
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
  { label: 'Veteran-Owned', href: '/veterans' },
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
      { label: 'Whole-Home Remodeling', href: '/services/remodeling', description: 'Full interior renovations under one project lead' },
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
    summary: 'Daily updates from your project lead. Clean job site. 24-hour response standard. The crew that started your job is the crew that finishes it.',
  },
  {
    step: '04',
    title: 'Inspect',
    summary: 'Final walkthrough, punch list cleared, workmanship warranty issued in writing. You only sign off when the project is right.',
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
      "Yes — Real Elite Contracting is fully licensed and insured across West Virginia, Maryland, and Virginia. We carry general liability and workers' compensation, and we'll send copies of every certificate before work begins.",
  },
  {
    question: 'How long does a typical remodel take?',
    answer:
      "Most full bathroom remodels run 3–5 weeks. Kitchens run 6–10 weeks. Decks take 1–3 weeks. We give you a written timeline before we break ground and update you daily — if anything shifts, you hear it from us first.",
  },
  {
    question: 'Do you offer financing?',
    answer:
      "Yes. We work with several home-improvement financing partners that offer monthly payment plans on qualified projects. We'll walk you through the options on your free estimate so the numbers make sense before you commit.",
  },
  {
    question: 'What does your warranty cover?',
    answer:
      "Every project includes our written workmanship warranty. Material warranties from our manufacturers (architectural shingles, composite decking, fiber cement siding) stack on top of that and we register them on your behalf.",
  },
  {
    question: 'Do you pull permits?',
    answer:
      "Yes. We handle the full permitting process for every project that requires one — county and municipal — and document each inspection. You shouldn't have to chase paperwork on your own remodel.",
  },
] as const;

/**
 * Project gallery — every entry tagged with category + state (the
 * region the project was completed in). The optional `citySlug` field
 * is for true city-specific tagging once new shoots come in for
 * Frederick/Loudoun/etc. — at that point the city page filter on
 * CityPageTemplate prefers exact-city matches over state-level matches.
 *
 * Existing photos are all from the WV Eastern Panhandle home market;
 * leaving citySlug undefined keeps the city page filter from over-
 * claiming specific localized work that didn't happen there.
 */
export type GalleryImage = {
  src: string;
  alt: string;
  category: string;
  state?: 'WV' | 'MD' | 'VA';
  citySlug?: string;
};

export const GALLERY_IMAGES: GalleryImage[] = [
  // Roofing
  { src: '/images/roofing-hero.jpg', alt: 'Completed dark architectural shingle roof with clean ridge cap', category: 'Roofing', state: 'WV' },
  { src: '/images/roofing-valley.jpg', alt: 'Architectural shingle roof valley and flashing detail', category: 'Roofing', state: 'WV' },
  { src: '/images/roofing-slope.jpg', alt: 'New charcoal shingle roof with clean valley lines', category: 'Roofing', state: 'WV' },
  { src: '/images/roofing-crew.jpg', alt: 'Roofing crew working on full tear-off and re-roof', category: 'Roofing', state: 'WV' },
  { src: '/images/roofing-victorian-reroof.jpg', alt: 'Crew re-roofing a Victorian home with porch and dormers', category: 'Roofing', state: 'WV' },
  { src: '/images/roofing-shingle-install.jpg', alt: 'Close-up of architectural shingle install with nail gun', category: 'Roofing', state: 'WV' },
  { src: '/images/roofing-tearoff.jpg', alt: 'Full roof tear-off in progress with ABC Pro Guard underlayment', category: 'Roofing', state: 'WV' },
  // Decks
  { src: '/images/deck-night-lights.jpg', alt: 'Finished deck with solar post lights at night', category: 'Decks', state: 'WV' },
  { src: '/images/deck-lounge.jpg', alt: 'Deck with outdoor lounge furniture set', category: 'Decks', state: 'WV' },
  { src: '/images/deck-finished-railings.jpg', alt: 'Composite deck with white horizontal railings and stairs', category: 'Decks', state: 'WV' },
  { src: '/images/deck-railing-install.jpg', alt: 'Installing white railing on composite deck', category: 'Decks', state: 'WV' },
  { src: '/images/deck-screened-porch.jpg', alt: 'Screened porch with stained wood ceiling, black railings, and wooded view', category: 'Decks' },
  { src: '/images/deck-multilevel-step-lights.jpg', alt: 'Multi-level wood deck with built-in bench, recessed step lights, and landscaped garden', category: 'Decks' },
  { src: '/images/deck-ipe-modern.jpg', alt: 'IPE hardwood deck wrapping a modern glass-walled home with white woven dining chairs', category: 'Decks' },
  { src: '/images/deck-pebble-detail.jpg', alt: 'Weathered wood deck corner with white pebble accent inlay and grass edge', category: 'Decks' },
  { src: '/images/deck-garden-path-view.jpg', alt: 'Low-angle dark-stained deck looking out to a landscaped garden path', category: 'Decks' },
  // Bathrooms
  { src: '/images/projects/bathrooms/hero.jpg', alt: 'Custom marble walk-in shower with frameless glass enclosure', category: 'Bathrooms' },
  { src: '/images/projects/bathrooms/shower-stone-accent.jpg', alt: 'Modern bathroom with stone accent wall and walk-in glass shower', category: 'Bathrooms' },
  { src: '/images/projects/bathrooms/shower-black-frame.jpg', alt: 'Contemporary walk-in shower with black-frame glass and wood-look tile', category: 'Bathrooms' },
  { src: '/images/projects/bathrooms/tub-shower-tile.jpg', alt: 'Tile tub-and-shower combination with frameless glass', category: 'Bathrooms' },
  // Kitchens
  { src: '/images/projects/kitchens/hero.jpg', alt: 'Editorial white kitchen with double islands and lantern pendant lighting', category: 'Kitchens' },
  { src: '/images/projects/kitchens/island-lantern-pendants.jpg', alt: 'White kitchen with marble-topped island and lantern pendants', category: 'Kitchens' },
  { src: '/images/projects/kitchens/gray-marble-waterfall.jpg', alt: 'Modern gray kitchen with marble waterfall island and chrome chandelier', category: 'Kitchens' },
  { src: '/images/projects/kitchens/white-herringbone.jpg', alt: 'White kitchen with herringbone backsplash and shiplap ceiling', category: 'Kitchens' },
  { src: '/images/projects/kitchens/white-island-chairs.jpg', alt: 'Open white kitchen with center island and navy chairs', category: 'Kitchens' },
  { src: '/images/projects/kitchens/two-tone-black-hood.jpg', alt: 'Two-tone kitchen with dark cabinetry, warm wood uppers, and black hood', category: 'Kitchens' },
  // Basements
  { src: '/images/projects/basements/hero-framing.jpg', alt: 'Basement build in framing phase — stud walls and floor joists before finishes', category: 'Basements' },
  // Siding & Exterior
  { src: '/images/stone-facade-finished.jpg', alt: 'Finished stone veneer porch facade with railings', category: 'Exterior', state: 'WV' },
  { src: '/images/siding-window-work.webp', alt: 'Siding and window replacement in progress', category: 'Siding', state: 'WV' },
  { src: '/images/stone-veneer-detail.jpg', alt: 'Stone veneer foundation detail on home exterior', category: 'Exterior', state: 'WV' },
  { src: '/images/exterior-brick-victorian.jpg', alt: 'Brick Victorian-style home with multiple gables and dark architectural shingle roof', category: 'Exterior' },
  // Remodeling / Interior
  { src: '/images/flooring-dark-living.jpg', alt: 'Dark laminate flooring installed in living room', category: 'Remodeling', state: 'WV' },
  { src: '/images/flooring-light-hallway.jpg', alt: 'Light wood laminate flooring in hallway', category: 'Remodeling', state: 'WV' },
  { src: '/images/flooring-light-living.jpg', alt: 'Light vinyl plank flooring in living space', category: 'Remodeling', state: 'WV' },
  // New Construction
  { src: '/images/framing-walls-work.webp', alt: 'Timber wall framing with window openings on a home under construction', category: 'New Construction', state: 'WV' },
  { src: '/images/new-build-weather-barrier.webp', alt: 'New home under construction with weather barrier and exposed roof trusses', category: 'New Construction', state: 'WV' },
  { src: '/images/foundation-block.jpg', alt: 'Block foundation piers for new construction', category: 'New Construction', state: 'WV' },
  // Additions
  { src: '/images/shed-trim-upright.webp', alt: 'Custom built shed with trim and siding', category: 'Additions', state: 'WV' },
];

/**
 * Filter helper used by CityPageTemplate to surface the most-local
 * projects available, falling back to state then to all.
 *   1. Prefer photos tagged with this exact city slug
 *   2. Else prefer photos tagged with this state
 *   3. Else fall back to the full gallery
 */
export function selectGalleryFor(citySlug: string, state: 'WV' | 'MD' | 'VA', limit = 6): GalleryImage[] {
  const byCity = GALLERY_IMAGES.filter((g) => g.citySlug === citySlug);
  if (byCity.length >= 3) return byCity.slice(0, limit);
  const byState = GALLERY_IMAGES.filter((g) => g.state === state);
  if (byState.length >= 3) return byState.slice(0, limit);
  return GALLERY_IMAGES.slice(0, limit);
}

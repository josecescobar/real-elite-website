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
    street: 'Martinsburg',
    city: 'Martinsburg',
    state: 'WV',
    zip: '25401',
    region: 'Eastern Panhandle, WV',
  },
  url: 'https://www.realelitecontracting.com',
  /**
   * Social URLs are verified-live links. LinkedIn and Thumbtack profiles
   * were previously listed but returned 404 — removed to avoid broken
   * trust signals in the footer and broken sameAs references in JSON-LD.
   * Add them back here once the real profiles exist.
   *
   * Yelp is left in because Yelp blocks automated checks (403 on bots);
   * verify the profile manually in a browser before linking it from the
   * footer.
   */
  social: {
    facebook: 'https://www.facebook.com/realelitecontracting',
    instagram: 'https://www.instagram.com/realelitecontracting',
    google: 'https://share.google/yuA4SUQ5zDrSKAyHm',
    yelp: 'https://www.yelp.com/biz/real-elite-contracting',
  },
  hours: 'Mon–Fri: 7:00 AM – 6:00 PM | Sat: 8:00 AM – 2:00 PM',
  veteranOwned: true,
} as const;

/**
 * Service catalog — ordered by homepage / mega-menu priority.
 * Premium remodeling categories lead; small-job services trail.
 */
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
/*  Tiers reflect actual market emphasis, not "expansion." Frederick MD, */
/*  Winchester VA, Leesburg VA, Ashburn VA, and Hagerstown MD are        */
/*  first-class primary markets alongside the Eastern Panhandle WV.      */
/* --------------------------------------------------------------------- */

export const PRIMARY_SERVICE_AREAS = [
  { city: 'Martinsburg', state: 'WV', slug: 'martinsburg-wv' },
  { city: 'Inwood', state: 'WV', slug: 'inwood-wv' },
  { city: 'Charles Town', state: 'WV', slug: 'charles-town-wv' },
  { city: 'Ranson', state: 'WV', slug: 'ranson-wv' },
  { city: 'Hedgesville', state: 'WV', slug: 'hedgesville-wv' },
  { city: 'Frederick', state: 'MD', slug: 'frederick-md' },
  { city: 'Hagerstown', state: 'MD', slug: 'hagerstown-md' },
  { city: 'Winchester', state: 'VA', slug: 'winchester-va' },
  { city: 'Leesburg', state: 'VA', slug: 'leesburg-va' },
  { city: 'Ashburn', state: 'VA', slug: 'ashburn-va' },
] as const;

export const SECONDARY_SERVICE_AREAS = [
  { city: 'Spring Mills', state: 'WV', slug: 'spring-mills-wv' },
  { city: 'Falling Waters', state: 'WV', slug: 'falling-waters-wv' },
  { city: 'Berkeley Springs', state: 'WV', slug: 'berkeley-springs-wv' },
  { city: 'Shepherdstown', state: 'WV', slug: 'shepherdstown-wv' },
  { city: 'Loudoun County', state: 'VA', slug: 'loudoun-county-va' },
] as const;

/**
 * VA / MD growth-market cities. A distinct subset — not a duplicate of
 * PRIMARY_SERVICE_AREAS. Drives the "VA / MD" grouping in the regional
 * grid and the service+city combo pages under /services/[service]/[city].
 */
export const EXPANSION_SERVICE_AREAS = [
  { city: 'Winchester', state: 'VA', slug: 'winchester-va' },
  { city: 'Frederick', state: 'MD', slug: 'frederick-md' },
  { city: 'Leesburg', state: 'VA', slug: 'leesburg-va' },
  { city: 'Ashburn', state: 'VA', slug: 'ashburn-va' },
  { city: 'Hagerstown', state: 'MD', slug: 'hagerstown-md' },
  { city: 'Loudoun County', state: 'VA', slug: 'loudoun-county-va' },
] as const;

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
      "Leesburg is the historic county seat of Loudoun County, Virginia — one of the wealthiest counties in the United States and one of the fastest-growing. Its walkable, brick-lined historic downtown along King Street, its proximity to Dulles International Airport, and its stunning setting in the Loudoun Valley make it one of Northern Virginia's most desirable addresses. From estate homes in Lansdowne on the Potomac to restored historic properties in the Old Town district, Leesburg homeowners demand premium craftsmanship. Real Elite Contracting delivers it.",
    neighborhoods: ['Historic Old Town Leesburg', 'Lansdowne on the Potomac', 'Cascades', 'Countryside', 'River Creek'],
    marketEmphasis: ['decks', 'kitchens', 'bathrooms', 'remodeling', 'additions', 'roofing'],
  },
  'ashburn-va': {
    description:
      "Ashburn is at the heart of Loudoun County's explosive growth — a master-planned tech corridor and residential powerhouse housing thousands of data centers alongside growing young families. Communities like Broadlands, Brambleton, One Loudoun, and Ashburn Farm offer modern homes in well-maintained neighborhoods where curb appeal and property values are taken seriously. With the Silver Line Metro now connecting Ashburn directly to Washington, D.C., this market only continues to appreciate. Real Elite Contracting is Ashburn's trusted partner for premium decks, outdoor living, kitchens, and bathroom remodels.",
    neighborhoods: ['One Loudoun', 'Broadlands', 'Brambleton', 'Ashburn Farm', 'Loudoun Valley Estates', 'Belmont Greene'],
    marketEmphasis: ['decks', 'kitchens', 'bathrooms', 'remodeling', 'additions', 'roofing'],
  },
  'loudoun-county-va': {
    description:
      "Loudoun County is one of the wealthiest and fastest-growing counties in the United States — home to Leesburg, Ashburn, Sterling, Purcellville, and a network of master-planned communities reshaping Northern Virginia. From estate properties in horse country west of Route 15 to data-center-adjacent neighborhoods along the Silver Line Metro corridor, Loudoun homeowners share an expectation of premium craftsmanship and clean execution. Real Elite Contracting brings veteran-led precision and high-end remodeling to Loudoun County — luxury decks and outdoor living, custom kitchens, premium bathrooms, and full home transformations done to the standard this market expects.",
    neighborhoods: ['Leesburg', 'Ashburn', 'Lansdowne', 'Brambleton', 'One Loudoun', 'Cascades', 'Purcellville', 'Sterling'],
    marketEmphasis: ['decks', 'kitchens', 'bathrooms', 'remodeling', 'additions', 'roofing'],
  },
};

/** Flat list of all service areas for convenience */
/**
 * De-duplicated flat list. Several VA/MD cities now live in
 * PRIMARY_SERVICE_AREAS and also in the legacy EXPANSION_SERVICE_AREAS
 * alias, so we dedupe by slug here.
 */
const _seen = new Set<string>();
export const ALL_SERVICE_AREAS = [
  ...PRIMARY_SERVICE_AREAS,
  ...SECONDARY_SERVICE_AREAS,
  ...EXPANSION_SERVICE_AREAS,
].filter((a) => {
  if (_seen.has(a.slug)) return false;
  _seen.add(a.slug);
  return true;
});

/** Legacy flat list (primary + secondary city names) for simple iterations */
export const SERVICE_AREAS = [
  ...PRIMARY_SERVICE_AREAS.map((a) => a.city),
  ...SECONDARY_SERVICE_AREAS.map((a) => a.city),
] as const;

export const TESTIMONIALS = [
  {
    name: 'Mike & Sarah T.',
    location: 'Martinsburg, WV',
    rating: 5,
    text: 'Real Elite replaced our entire roof in just two days. The crew was professional, cleaned up everything, and the new architectural shingles look incredible. Best contractor experience we\'ve ever had.',
  },
  {
    name: 'Jennifer R.',
    location: 'Charles Town, WV',
    rating: 5,
    text: 'We hired them for a full deck build and couldn\'t be happier. The craftsmanship is outstanding — every detail was perfect. They communicated every step of the way and finished on schedule.',
  },
  {
    name: 'David & Linda K.',
    location: 'Shepherdstown, WV',
    rating: 5,
    text: 'The stone veneer work on our front porch is absolutely stunning. Everyone who visits compliments it. Real Elite\'s attention to detail sets them apart from every other contractor in the area.',
  },
] as const;

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
  { label: 'Our Work', href: '/gallery' },
  { label: 'Guides', href: '/guides' },
  { label: 'Roof Quote', href: '/instant-roof-quote' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
] as const;

/** Utility links surfaced in footer + mobile nav drawer */
export const UTILITY_LINKS = [
  { label: 'Our Process', href: '/process' },
  { label: 'Reviews', href: '/reviews' },
  { label: 'FAQ', href: '/faq' },
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
    image: '/images/new-build-sunset.jpg',
    imageAlt: 'New construction with house wrap at sunset',
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
  title: 'Custom Stone Facade & Outdoor Living',
  location: 'Eastern Panhandle, WV',
  scope: 'Full stone veneer facade, custom front-porch rebuild, and matching outdoor living transition. Architectural shingle re-roof on the same project.',
  investmentRange: '$45k – $65k',
  image: '/images/stone-facade-finished.jpg',
  imageAlt: 'Finished custom stone veneer facade with new front porch and matching exterior',
  href: '/gallery',
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
    label: 'New-build exterior',
    category: 'Exterior',
    before: { src: '/images/house-wrap-worker.jpg', alt: 'House wrap and framing in progress before siding install' },
    after: { src: '/images/new-build-sunset.jpg', alt: 'Finished new construction exterior at sunset' },
  },
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
  { src: '/images/siding-windows.jpg', alt: 'Siding and window replacement in progress', category: 'Siding', state: 'WV' },
  { src: '/images/stone-veneer-detail.jpg', alt: 'Stone veneer foundation detail on home exterior', category: 'Exterior', state: 'WV' },
  { src: '/images/exterior-brick-victorian.jpg', alt: 'Brick Victorian-style home with multiple gables and dark architectural shingle roof', category: 'Exterior' },
  // Remodeling / Interior
  { src: '/images/flooring-dark-living.jpg', alt: 'Dark laminate flooring installed in living room', category: 'Remodeling', state: 'WV' },
  { src: '/images/flooring-light-hallway.jpg', alt: 'Light wood laminate flooring in hallway', category: 'Remodeling', state: 'WV' },
  { src: '/images/flooring-light-living.jpg', alt: 'Light vinyl plank flooring in living space', category: 'Remodeling', state: 'WV' },
  // New Construction
  { src: '/images/framing-crew.jpg', alt: 'Interior framing crew working on scaffolding', category: 'New Construction', state: 'WV' },
  { src: '/images/new-build-sunset.jpg', alt: 'New construction house wrap at sunset', category: 'New Construction', state: 'WV' },
  { src: '/images/foundation-block.jpg', alt: 'Block foundation piers for new construction', category: 'New Construction', state: 'WV' },
  // Additions
  { src: '/images/shed-trim.jpg', alt: 'Custom built shed with trim and siding', category: 'Additions', state: 'WV' },
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

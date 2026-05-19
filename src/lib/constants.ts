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
  social: {
    facebook: 'https://www.facebook.com/realelitecontracting',
    instagram: 'https://www.instagram.com/realelitecontracting',
    google: 'https://share.google/yuA4SUQ5zDrSKAyHm',
    linkedin: 'https://www.linkedin.com/company/real-elite-contracting',
    yelp: 'https://www.yelp.com/biz/real-elite-contracting',
    thumbtack: 'https://www.thumbtack.com/wv/martinsburg/general-contractors/real-elite-contracting',
  },
  hours: 'Mon–Fri: 7:00 AM – 6:00 PM | Sat: 8:00 AM – 2:00 PM',
  veteranOwned: true,
} as const;

export const SERVICES = [
  {
    title: 'Roofing',
    slug: 'roofing',
    description:
      'Complete roof replacement and repair with premium architectural shingles. Protect your home with expert installation.',
    icon: 'Home' as const,
  },
  {
    title: 'Siding',
    slug: 'siding',
    description:
      'Vinyl, fiber cement, and wood siding installation that transforms your home\'s exterior and boosts curb appeal.',
    icon: 'Layers' as const,
  },
  {
    title: 'Decks',
    slug: 'decks',
    description:
      'Custom deck design and construction using premium materials. Expand your living space with a beautiful outdoor area.',
    icon: 'Fence' as const,
  },
  {
    title: 'Remodeling',
    slug: 'remodeling',
    description:
      'Interior and exterior remodeling that modernizes your home. Kitchens, bathrooms, and full home renovations.',
    icon: 'Hammer' as const,
  },
  {
    title: 'Additions',
    slug: 'additions',
    description:
      'Home additions that seamlessly blend with your existing structure. Add the space your family needs.',
    icon: 'Plus' as const,
  },
  {
    title: 'Exterior Repairs',
    slug: 'exterior-repairs',
    description:
      'Stone veneer, foundation repair, trim work, and general exterior maintenance to keep your home in top shape.',
    icon: 'Wrench' as const,
  },
  {
    title: 'General Repairs & Maintenance',
    slug: 'general-repairs',
    description:
      'Door and window repairs, drywall patching, trim work, deck fixes, and all the smaller jobs that keep your home in great shape.',
    icon: 'Paintbrush' as const,
  },
  {
    title: 'Handyman Services',
    slug: 'handyman',
    description:
      'Drywall repair, door installation, pressure washing, gutter cleaning, fence repair, TV mounting, and dozens of other fast, reliable home repairs.',
    icon: 'Hammer' as const,
  },
] as const;

// --- Service Area Tiers ---
export const PRIMARY_SERVICE_AREAS = [
  { city: 'Martinsburg', state: 'WV', slug: 'martinsburg-wv' },
  { city: 'Inwood', state: 'WV', slug: 'inwood-wv' },
  { city: 'Charles Town', state: 'WV', slug: 'charles-town-wv' },
  { city: 'Ranson', state: 'WV', slug: 'ranson-wv' },
  { city: 'Hedgesville', state: 'WV', slug: 'hedgesville-wv' },
] as const;

export const SECONDARY_SERVICE_AREAS = [
  { city: 'Spring Mills', state: 'WV', slug: 'spring-mills-wv' },
  { city: 'Falling Waters', state: 'WV', slug: 'falling-waters-wv' },
  { city: 'Berkeley Springs', state: 'WV', slug: 'berkeley-springs-wv' },
  { city: 'Shepherdstown', state: 'WV', slug: 'shepherdstown-wv' },
] as const;

export const EXPANSION_SERVICE_AREAS = [
  { city: 'Winchester', state: 'VA', slug: 'winchester-va' },
  { city: 'Frederick', state: 'MD', slug: 'frederick-md' },
  { city: 'Leesburg', state: 'VA', slug: 'leesburg-va' },
  { city: 'Ashburn', state: 'VA', slug: 'ashburn-va' },
] as const;

/** Rich city data for expansion service areas */
export const EXPANSION_CITY_DATA: Record<string, { description: string; neighborhoods: string[] }> = {
  'winchester-va': {
    description:
      "Winchester is the historic gateway to Virginia's Shenandoah Valley — a city that blends a vibrant, walkable Old Town with rapidly growing residential neighborhoods along Route 7, Route 522, and the Senseny Road corridor. As the largest city in the Northern Shenandoah Valley, Winchester draws families and professionals who appreciate its small-city character, proximity to the mountains, and access to both Northern Virginia jobs and a lower cost of living. Real Elite Contracting is proud to serve Winchester homeowners with the same high-quality craftsmanship we deliver throughout the Eastern Panhandle.",
    neighborhoods: ['Old Town Winchester', 'Shawnee District', 'Senseny Road Corridor', 'Millwood Avenue Area'],
  },
  'frederick-md': {
    description:
      "Frederick is the county seat and largest city in Frederick County, Maryland — a rapidly growing community of over 75,000 residents that has transformed from a historic market town into one of the Mid-Atlantic's most desirable places to live. The revitalization of Carroll Creek and the Market Street corridor has breathed new life into Frederick's historic downtown, while the I-70 growth corridor continues to attract new developments in Urbana, Jefferson, and New Market. Real Elite Contracting serves Frederick homeowners who want professional-grade results for their most important asset.",
    neighborhoods: ['Historic Downtown Frederick', 'Ballenger Creek', 'Urbana', 'Jefferson'],
  },
  'leesburg-va': {
    description:
      "Leesburg is the historic county seat of Loudoun County, Virginia — one of the wealthiest counties in the United States and one of the fastest-growing. Its walkable, brick-lined historic downtown along King Street, its proximity to Dulles International Airport, and its stunning setting in the Loudoun Valley make it one of Northern Virginia's most desirable addresses. From estate homes in Lansdowne on the Potomac to restored historic properties in the Old Town district, Leesburg homeowners demand quality craftsmanship. Real Elite Contracting delivers it.",
    neighborhoods: ['Historic Old Town Leesburg', 'Lansdowne on the Potomac', 'Cascades', 'Countryside'],
  },
  'ashburn-va': {
    description:
      "Ashburn is at the heart of Loudoun County's explosive growth — a master-planned tech corridor and residential powerhouse that houses thousands of data centers alongside growing young families. Communities like Broadlands, Brambleton, One Loudoun, and Ashburn Farm offer modern homes in well-maintained neighborhoods where curb appeal and property values are taken seriously. With the Silver Line Metro now connecting Ashburn directly to Washington, D.C., this market only continues to appreciate. Real Elite Contracting is Ashburn's trusted partner for home improvements done right.",
    neighborhoods: ['One Loudoun', 'Broadlands', 'Brambleton', 'Ashburn Farm'],
  },
};

/** Flat list of all service areas for convenience */
export const ALL_SERVICE_AREAS = [
  ...PRIMARY_SERVICE_AREAS,
  ...SECONDARY_SERVICE_AREAS,
  ...EXPANSION_SERVICE_AREAS,
] as const;

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
  { label: 'Guides', href: '/blog' },
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
 * Bathrooms / Kitchens / Basements are intentionally omitted here until
 * their dedicated routes ship in Phase 4 with real photography.
 */
export const SERVICES_MEGA_MENU = [
  {
    heading: 'Remodeling',
    items: [
      { label: 'Whole-Home Remodeling', href: '/services/remodeling', description: 'Kitchens, bathrooms, full interior renovations' },
      { label: 'Home Additions', href: '/services/additions', description: 'Seamless additions that match your existing home' },
    ],
  },
  {
    heading: 'Exteriors',
    items: [
      { label: 'Roofing', href: '/services/roofing', description: 'Architectural shingle replacement & repair' },
      { label: 'Siding & Stone', href: '/services/siding', description: 'Vinyl, fiber cement, and stone veneer exteriors' },
      { label: 'Decks & Outdoor Living', href: '/services/decks', description: 'Composite decks, railings, outdoor spaces' },
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
 * Before/after pairs for the homepage cinematic slider.
 * NOTE: Until actual paired before/after photography is shot, the
 * "before" slot here uses framing/in-progress shots that thematically
 * pair with the finished result. Replace with true paired shots
 * (same angle, same framing, before vs. after) as projects are shot.
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

export const GALLERY_IMAGES = [
  // Roofing
  { src: '/images/roofing-hero.jpg', alt: 'Completed dark architectural shingle roof with clean ridge cap', category: 'Roofing' },
  { src: '/images/roofing-valley.jpg', alt: 'Architectural shingle roof valley and flashing detail', category: 'Roofing' },
  { src: '/images/roofing-slope.jpg', alt: 'New charcoal shingle roof with clean valley lines', category: 'Roofing' },
  { src: '/images/roofing-crew.jpg', alt: 'Roofing crew working on full tear-off and re-roof', category: 'Roofing' },
  // Decks
  { src: '/images/deck-night-lights.jpg', alt: 'Finished deck with solar post lights at night', category: 'Decks' },
  { src: '/images/deck-lounge.jpg', alt: 'Deck with outdoor lounge furniture set', category: 'Decks' },
  { src: '/images/deck-finished-railings.jpg', alt: 'Composite deck with white horizontal railings and stairs', category: 'Decks' },
  { src: '/images/deck-railing-install.jpg', alt: 'Installing white railing on composite deck', category: 'Decks' },
  // Siding & Exterior
  { src: '/images/stone-facade-finished.jpg', alt: 'Finished stone veneer porch facade with railings', category: 'Exterior' },
  { src: '/images/siding-windows.jpg', alt: 'Siding and window replacement in progress', category: 'Siding' },
  { src: '/images/stone-veneer-detail.jpg', alt: 'Stone veneer foundation detail on home exterior', category: 'Exterior' },
  // Remodeling / Interior
  { src: '/images/flooring-dark-living.jpg', alt: 'Dark laminate flooring installed in living room', category: 'Remodeling' },
  { src: '/images/flooring-light-hallway.jpg', alt: 'Light wood laminate flooring in hallway', category: 'Remodeling' },
  { src: '/images/flooring-light-living.jpg', alt: 'Light vinyl plank flooring in living space', category: 'Remodeling' },
  // New Construction
  { src: '/images/framing-crew.jpg', alt: 'Interior framing crew working on scaffolding', category: 'New Construction' },
  { src: '/images/new-build-sunset.jpg', alt: 'New construction house wrap at sunset', category: 'New Construction' },
  { src: '/images/foundation-block.jpg', alt: 'Block foundation piers for new construction', category: 'New Construction' },
  // Additions
  { src: '/images/shed-trim.jpg', alt: 'Custom built shed with trim and siding', category: 'Additions' },
] as const;

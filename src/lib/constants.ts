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

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  {
    label: 'Services',
    href: '/services',
    children: SERVICES.map((s) => ({
      label: s.title,
      href: `/services/${s.slug}`,
    })),
  },
  { label: 'About', href: '/about' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Reviews', href: '/reviews' },
  { label: 'Service Areas', href: '/service-areas' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
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

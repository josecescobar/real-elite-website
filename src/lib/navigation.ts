/**
 * Primary navigation for the luxury design-build positioning.
 *
 * Lives apart from `constants.ts` on purpose: the legacy `NAV_LINKS` /
 * `UTILITY_LINKS` / `SERVICES_MEGA_MENU` there still feed the footer and are
 * edited by the claims and town-page work in parallel. The header reads from
 * here instead.
 *
 * Two lanes, one header. The site LEADS with design-build for Loudoun County
 * (signature projects, portfolio, process, investment) and keeps the standard
 * remodeling and exterior lanes reachable one level down in the same menu, so
 * no existing route loses its way in.
 */

export type NavItem = { label: string; href: string };
export type NavColumn = {
  heading: string;
  /** Muted columns render smaller, for the secondary lane. */
  tone?: 'primary' | 'muted';
  items: (NavItem & { description?: string })[];
};

/** Top-level order is the positioning: design-build first, contact last. */
export const PRIMARY_NAV: readonly (NavItem & { mega?: boolean })[] = [
  { label: 'Design-Build', href: '/services', mega: true },
  { label: 'Portfolio', href: '/projects' },
  { label: 'Process', href: '/process' },
  { label: 'Investment', href: '/investment' },
  { label: 'Service Areas', href: '/service-areas' },
  { label: 'About', href: '/about' },
] as const;

/** The header CTA. Consultation, not "free estimate". */
export const NAV_CTA = { label: 'Consultation', href: '/design-consultation' } as const;

/**
 * The Design-Build mega-menu. Column one is the signature work; column two
 * is the exterior and repair lane; column three is everything else a visitor
 * might have bookmarked. Every href here is a live route.
 */
export const DESIGN_BUILD_MENU: readonly NavColumn[] = [
  {
    heading: 'Signature Projects',
    tone: 'primary',
    items: [
      { label: 'Lower Levels & Basements', href: '/services/basements', description: 'Media rooms, bars, guest suites, home gyms' },
      { label: 'Kitchens', href: '/services/kitchens', description: 'Custom cabinetry, stone, open-plan layouts' },
      { label: 'Primary Suites & Baths', href: '/services/bathrooms', description: 'Curbless showers, stone, heated floors' },
      { label: 'Outdoor Living', href: '/services/decks', description: 'Composite decks, screened porches, pergolas' },
      { label: 'Additions', href: '/services/additions', description: 'Bump-outs, family rooms, second stories' },
      { label: 'Whole-Home Renovation', href: '/services/remodeling', description: 'One design, one contract, one team' },
    ],
  },
  {
    heading: 'Exteriors & Repairs',
    tone: 'muted',
    items: [
      { label: 'Roofing', href: '/services/roofing' },
      { label: 'Siding & Stone', href: '/services/siding' },
      { label: 'Paving & Seal Coating', href: '/paving' },
      { label: 'Exterior Repairs', href: '/services/exterior-repairs' },
      { label: 'General Repairs', href: '/services/general-repairs' },
      { label: 'Handyman Services', href: '/services/handyman' },
    ],
  },
  {
    heading: 'Plan & Learn',
    tone: 'muted',
    items: [
      { label: 'Investment Guide', href: '/investment' },
      { label: 'Our Process', href: '/process' },
      { label: 'Homeowner Guides', href: '/resources' },
      { label: 'Reviews', href: '/reviews' },
      { label: 'Financing', href: '/financing' },
      { label: 'FAQ', href: '/faq' },
    ],
  },
] as const;

/**
 * Secondary links for the mobile drawer. Keeps every route the old header
 * reached (Contact, Roof Quote, Estimate, Gallery, and the one-off pages)
 * reachable from the phone.
 */
export const MOBILE_UTILITY_NAV: readonly NavItem[] = [
  { label: 'Contact', href: '/contact' },
  { label: 'Request an Estimate', href: '/estimate' },
  { label: 'Instant Roof Quote', href: '/instant-roof-quote' },
  { label: 'Photo Gallery', href: '/gallery' },
  { label: 'Homeowner Guides', href: '/resources' },
  { label: 'Reviews', href: '/reviews' },
  { label: 'Financing', href: '/financing' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Family-Run', href: '/veterans' },
  { label: 'Capability Statement', href: '/capability-statement' },
  { label: 'Storm Damage', href: '/storm-damage' },
  { label: 'Full Property Bundle', href: '/full-property-perimeter' },
] as const;

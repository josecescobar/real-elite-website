import { ALL_SERVICE_AREAS, areaAncestors } from '@/lib/constants';

/**
 * Loudoun County guide pairings, authored per service.
 *
 * The six Loudoun cost and permit guides (PR #165) link out to the service and
 * town pages; this map is the link back. It is a hand-written judgement about
 * which guide a Loudoun buyer on a given service page would still want, not a
 * tag match (see the note on `relatedGuideSlugs` in service-city-content.ts).
 * Every slug must resolve to a published post; loudoun-guides.test.ts fails
 * the build otherwise.
 */
export const LOUDOUN_PERMIT_GUIDE = 'loudoun-county-permits-hoa-guide-2026';
export const LOUDOUN_HOA_GUIDE = 'hoa-approval-remodels-brambleton-lansdowne-ashburn-farm-2026';

export const LOUDOUN_GUIDES_BY_SERVICE: Readonly<Record<string, readonly string[]>> = {
  kitchens: [
    'kitchen-remodel-cost-loudoun-county-2026',
    'luxury-kitchen-renovation-loudoun-northern-virginia-2026',
    LOUDOUN_HOA_GUIDE,
  ],
  bathrooms: [
    'primary-bathroom-remodel-cost-loudoun-county-2026',
    'luxury-bathroom-renovation-loudoun-northern-virginia-2026',
    LOUDOUN_PERMIT_GUIDE,
  ],
  basements: [
    'basement-remodeling-cost-ashburn-leesburg-2026',
    'luxury-basement-finishing-loudoun-northern-virginia-2026',
    LOUDOUN_PERMIT_GUIDE,
  ],
  additions: [
    'home-addition-cost-loudoun-county-2026',
    'home-additions-in-law-suites-loudoun-northern-virginia-2026',
    LOUDOUN_HOA_GUIDE,
  ],
  decks: [
    'covered-patio-outdoor-living-cost-loudoun-county-2026',
    'composite-vs-pressure-treated-decks-loudoun-county-va',
    LOUDOUN_HOA_GUIDE,
  ],
  remodeling: [
    'whole-home-luxury-renovation-loudoun-northern-virginia-2026',
    LOUDOUN_HOA_GUIDE,
    LOUDOUN_PERMIT_GUIDE,
  ],
  roofing: [LOUDOUN_PERMIT_GUIDE, LOUDOUN_HOA_GUIDE],
  siding: [LOUDOUN_HOA_GUIDE, LOUDOUN_PERMIT_GUIDE],
};

/** The cost guide for each service, the first link a Loudoun town page shows. */
export const LOUDOUN_COST_GUIDE_BY_SERVICE: Readonly<Record<string, string>> = {
  kitchens: 'kitchen-remodel-cost-loudoun-county-2026',
  bathrooms: 'primary-bathroom-remodel-cost-loudoun-county-2026',
  basements: 'basement-remodeling-cost-ashburn-leesburg-2026',
  additions: 'home-addition-cost-loudoun-county-2026',
  decks: 'covered-patio-outdoor-living-cost-loudoun-county-2026',
};

/** True for Loudoun County itself and every catalog area inside it. */
export function isLoudounArea(citySlug: string): boolean {
  const area = ALL_SERVICE_AREAS.find((a) => a.slug === citySlug);
  if (!area) return false;
  return [area, ...areaAncestors(area)].some((a) => a.slug === 'loudoun-county-va');
}

/** Authored Loudoun guides for a service page in a Loudoun area, else []. */
export function loudounGuidesFor(serviceSlug: string, citySlug: string): readonly string[] {
  if (!isLoudounArea(citySlug)) return [];
  return LOUDOUN_GUIDES_BY_SERVICE[serviceSlug] ?? [];
}

/**
 * Guides for a Loudoun town page: the county permit guide, then the cost
 * guides for the town's most-emphasized services, three in all.
 */
export function loudounTownGuides(marketEmphasis: readonly string[]): string[] {
  const costGuides = marketEmphasis
    .map((service) => LOUDOUN_COST_GUIDE_BY_SERVICE[service])
    .filter((slug): slug is string => Boolean(slug));
  return [LOUDOUN_PERMIT_GUIDE, ...new Set(costGuides)].slice(0, 3);
}

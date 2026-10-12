/**
 * Town ↔ county permit-guide links, derived from each guide's `areaSlugs`.
 * Batch 3 guides pick this up when they join PERMIT_GUIDES. Do not add a
 * second town-to-county table here.
 */

import { ALL_SERVICE_AREAS } from '@/lib/constants';
import { PERMIT_GUIDES, getPermitGuide, permitGuidePath } from '@/lib/permit-guides';

export type PermitGuideForArea = {
  slug: string;
  county: string;
  stateName: string;
  href: string;
};

export type TownPageForGuide = {
  slug: string;
  city: string;
  state: string;
  href: string;
};

const guidesByArea = new Map<string, string[]>();
for (const guide of PERMIT_GUIDES) {
  for (const areaSlug of guide.areaSlugs) {
    const claimed = guidesByArea.get(areaSlug);
    if (claimed) claimed.push(guide.slug);
    else guidesByArea.set(areaSlug, [guide.slug]);
  }
}

const activeBySlug = new Map(ALL_SERVICE_AREAS.map((area) => [area.slug, area]));

/** Inverse of `areaSlugs`. Undefined for unknown, staged, inactive, or a town claimed by two guides. */
export function permitGuideForArea(areaSlug: string): PermitGuideForArea | undefined {
  if (!activeBySlug.has(areaSlug)) return undefined;
  const claimed = guidesByArea.get(areaSlug);
  if (!claimed || claimed.length !== 1) return undefined;
  const guide = getPermitGuide(claimed[0]);
  if (!guide) return undefined;
  return {
    slug: guide.slug,
    county: guide.county,
    stateName: guide.stateName,
    href: permitGuidePath(guide.slug),
  };
}

/** Active town overview pages linked from a guide. Staged and unknown slugs drop out. */
export function townPagesForGuide(guideSlug: string): TownPageForGuide[] {
  const guide = getPermitGuide(guideSlug);
  if (!guide) return [];
  const pages: TownPageForGuide[] = [];
  for (const areaSlug of guide.areaSlugs) {
    const area = activeBySlug.get(areaSlug);
    if (!area) continue;
    pages.push({
      slug: area.slug,
      city: area.city,
      state: area.state,
      href: `/service-areas/${area.slug}`,
    });
  }
  return pages;
}

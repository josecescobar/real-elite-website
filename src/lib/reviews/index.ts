/**
 * The Review System — query helpers over the review corpus.
 *
 * This is the single read surface every consumer uses: the Review Center
 * (/reviews), the homepage, and the service/city proof modules. Helpers are
 * pure and synchronous, mirroring src/lib/projects/index.ts. "Author once in
 * data.ts, surface everywhere through these helpers."
 */

import type { Review } from './types';
import { REVIEWS } from './data';

export type { Review, ReviewSource } from './types';
export { REVIEWS } from './data';

/** All reviews, in authored order (strongest first). */
export function getAllReviews(): Review[] {
  return [...REVIEWS];
}

/** Reviews for a given service slug, newest/ordered as authored. */
export function getReviewsByService(serviceSlug: string, limit?: number): Review[] {
  const matches = REVIEWS.filter((r) => r.serviceSlug === serviceSlug);
  return typeof limit === 'number' ? matches.slice(0, limit) : [...matches];
}

/** Reviews tied to a given city slug. */
export function getReviewsByCity(citySlug: string, limit?: number): Review[] {
  const matches = REVIEWS.filter((r) => r.citySlug === citySlug);
  return typeof limit === 'number' ? matches.slice(0, limit) : [...matches];
}

/** The review linked to a given project, if any. */
export function getReviewForProject(projectSlug: string): Review | null {
  return REVIEWS.find((r) => r.projectSlug === projectSlug) ?? null;
}

/** The strongest reviews for the homepage strip (authored order). */
export function getFeaturedReviews(count = 3): Review[] {
  return REVIEWS.slice(0, count);
}

/**
 * The distinct service slugs that actually have at least one review — used to
 * render only meaningful filter chips (never an empty facet).
 */
export function getReviewedServiceSlugs(): string[] {
  return [...new Set(REVIEWS.map((r) => r.serviceSlug).filter((s): s is string => Boolean(s)))];
}

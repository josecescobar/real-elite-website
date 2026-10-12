/**
 * Choose which published reviews a page may show.
 *
 * A roof quote is allowed only on a roofing page. A kitchen page prefers
 * kitchen and other interior reviews; a deck page prefers deck and other
 * outdoor reviews. When nothing matches, the page falls back to a general
 * review (no service tag, and not a roof quote). A wrong quote is worse than
 * no quote, so an empty list is the last resort.
 *
 * This function does not invent reviews. Callers pass the corpus.
 */
import type { Review } from './types';

const INTERIOR = new Set(['kitchens', 'bathrooms', 'basements', 'remodeling']);
const OUTDOOR = new Set(['decks', 'outdoor-living', 'stairs']);

export type ReviewPageQuery = {
  serviceSlug?: string;
  citySlug?: string;
};

function familyOf(slug: string): 'interior' | 'outdoor' | null {
  if (INTERIOR.has(slug)) return 'interior';
  if (OUTDOOR.has(slug)) return 'outdoor';
  return null;
}

export function isRoofQuote(review: Review): boolean {
  if (review.serviceSlug === 'roofing') return true;
  return /\broofs?\b/i.test(review.quote);
}

function cityOk(review: Review, citySlug?: string): boolean {
  if (!citySlug || !review.citySlug) return true;
  return review.citySlug === citySlug;
}

function sameFamily(pageSlug: string, reviewSlug: string): boolean {
  const pageFamily = familyOf(pageSlug);
  const reviewFamily = familyOf(reviewSlug);
  return pageFamily !== null && pageFamily === reviewFamily;
}

function isGeneral(review: Review): boolean {
  return !review.serviceSlug && !isRoofQuote(review);
}

/**
 * Reviews for this page, in corpus order. Exact service matches come before
 * other reviews in the same interior or outdoor family.
 */
export function selectReviewsForPage(
  reviews: readonly Review[],
  opts: ReviewPageQuery = {},
): Review[] {
  const pool = reviews.filter((review) => cityOk(review, opts.citySlug));

  if (!opts.serviceSlug) {
    return pool.filter((review) => !isRoofQuote(review));
  }

  if (opts.serviceSlug === 'roofing') {
    const tagged = pool.filter((review) => review.serviceSlug === 'roofing');
    if (tagged.length > 0) return tagged;
    const untaggedRoof = pool.filter((review) => !review.serviceSlug && isRoofQuote(review));
    if (untaggedRoof.length > 0) return untaggedRoof;
    return pool.filter(isGeneral);
  }

  const exact = pool.filter(
    (review) => review.serviceSlug === opts.serviceSlug && !isRoofQuote(review),
  );
  const family = pool.filter(
    (review) =>
      Boolean(review.serviceSlug) &&
      review.serviceSlug !== opts.serviceSlug &&
      sameFamily(opts.serviceSlug!, review.serviceSlug!) &&
      !isRoofQuote(review),
  );
  if (exact.length > 0 || family.length > 0) return [...exact, ...family];

  return pool.filter(isGeneral);
}

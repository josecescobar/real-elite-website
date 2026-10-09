import { SOCIAL_PROOF } from './constants';
import type { Review } from './reviews/types';

/**
 * Derived trust-signal display logic. The UI never hardcodes rating/badge
 * rules — it asks these pure helpers, so every surface degrades gracefully
 * to the existing generic copy until real numbers land in `SOCIAL_PROOF`.
 *
 * All helpers accept an optional `config` (defaulting to the live
 * `SOCIAL_PROOF`) purely so they can be unit-tested against each branch.
 */

export type Badge = { name: string; label: string; href: string | null };

export type SocialProofConfig = {
  verified: boolean;
  googleRating: number | null;
  googleReviewCount: number | null;
  projectsCompleted: number | null;
  badges: readonly Badge[];
};

/** True only when the config is marked verified AND has a real rating + count. */
export function hasVerifiedReviews(config: SocialProofConfig = SOCIAL_PROOF): boolean {
  return (
    config.verified && config.googleRating != null && config.googleReviewCount != null
  );
}

/**
 * The rating tile for the TrustBar. Returns `null` when reviews aren't
 * verified — callers fall back to their existing copy, so output is
 * unchanged until real numbers exist.
 */
export function ratingLabel(
  config: SocialProofConfig = SOCIAL_PROOF
): { number: string; label: string } | null {
  if (!hasVerifiedReviews(config)) return null;
  return {
    number: `${config.googleRating!.toFixed(1)}★`,
    label: `${config.googleReviewCount} Google Reviews`,
  };
}

/** Badges with a real, live `href` — anything still `null` never renders. */
export function liveBadges(config: SocialProofConfig = SOCIAL_PROOF): Badge[] {
  return config.badges.filter((b): b is Badge => Boolean(b.href));
}

/**
 * Schema.org AggregateRating fragment for the LocalBusiness JSON-LD, emitted
 * ONLY when reviews are verified. Returns `undefined` otherwise so callers can
 * spread it conditionally and never ship self-serving review markup that
 * doesn't mirror the real Google Business Profile.
 */
export function aggregateRatingSchema(
  config: SocialProofConfig = SOCIAL_PROOF
): Record<string, unknown> | undefined {
  if (!hasVerifiedReviews(config)) return undefined;
  return {
    '@type': 'AggregateRating',
    ratingValue: config.googleRating,
    reviewCount: config.googleReviewCount,
    bestRating: 5,
    worstRating: 1,
  };
}

type ReviewJsonLdInput = Pick<Review, 'source' | 'verified' | 'author' | 'quote' | 'rating' | 'date'>;

/**
 * Review JSON-LD is Google-only. Thumbtack and every other source are
 * excluded even if `verified` is flipped. This helper never emits
 * AggregateRating — that fragment comes only from Google profile fields in
 * `aggregateRatingSchema()`, not from review rows.
 */
export function isEligibleForReviewJsonLd(
  review: Pick<Review, 'source' | 'verified'>
): boolean {
  return review.source === 'google' && review.verified === true;
}

export function reviewJsonLdNodes(
  reviews: readonly ReviewJsonLdInput[]
): Record<string, unknown>[] {
  return reviews.filter(isEligibleForReviewJsonLd).map(review => ({
    '@type': 'Review',
    author: { '@type': 'Person', name: review.author },
    reviewBody: review.quote,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: String(review.rating),
      bestRating: '5',
    },
    ...(review.date ? { datePublished: review.date } : {}),
  }));
}

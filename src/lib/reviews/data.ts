/**
 * The review corpus — the single source of truth for every review the site
 * renders (Review Center, homepage, service pages, city pages). Consumers read
 * ONLY through `src/lib/reviews/index.ts`; they never hardcode a quote.
 *
 * These are the real first-party testimonials the site has always shown
 * (previously `TESTIMONIALS` in constants.ts), migrated verbatim to the unified
 * `Review` contract and enriched with the canonical `serviceSlug` / `citySlug`
 * relationships that let a review surface on its matching service and city
 * pages. Where a review maps to a published Project, `projectSlug` links it —
 * "a review you can see the work behind" (V2 Blueprint §6).
 *
 * INTEGRITY (enforced by reviews.test.ts): every relationship slug is validated
 * against its source-of-truth catalog, and `verified` stays false for all
 * first-party reviews so NO Review/AggregateRating JSON-LD is ever emitted for
 * them (only third-party 'google' reviews mirrored from the live profile may be
 * verified — see src/lib/reviews/types.ts and src/lib/social-proof.ts).
 * Thumbtack reviews may publish on-page with a "via Thumbtack" label. They
 * are not Google reviews and are never eligible for Review/AggregateRating
 * JSON-LD. Do not change googleRating or googleReviewCount from these rows.
 *
 * Google reviews land here as they're collected via the /review-request tool,
 * with `source: 'google'`, a `sourceUrl`, and `verified: true` only once the
 * numbers mirror the live Google Business Profile.
 */

import type { Review } from './types';

/** Live Thumbtack reviews page. Badge links and publication evidence use this URL only. */
export const THUMBTACK_REVIEWS_URL =
  'https://www.thumbtack.com/profile/services/560701006958788617/reviews';

export const REVIEW_DRAFTS: readonly Review[] = [
  {
    id: 'mike-sarah-t-martinsburg-roofing',
    author: 'Mike & Sarah T.',
    location: 'Martinsburg, WV',
    rating: 5,
    quote:
      "Real Elite replaced our entire roof in just two days. The crew was professional, cleaned up everything, and the new architectural shingles look incredible. Best contractor experience we've ever had.",
    source: 'first-party',
    verified: false,
    // This homeowner's roof is a published Project — the review links to it.
    projectSlug: 'victorian-roof-replacement-martinsburg-wv',
    serviceSlug: 'roofing',
    citySlug: 'martinsburg-wv',
  },
  {
    id: 'jennifer-r-charles-town-decks',
    author: 'Jennifer R.',
    location: 'Charles Town, WV',
    rating: 5,
    quote:
      "We hired them for a full deck build and couldn't be happier. The craftsmanship is outstanding — every detail was perfect. They communicated every step of the way and finished on schedule.",
    source: 'first-party',
    verified: false,
    serviceSlug: 'decks',
    citySlug: 'charles-town-wv',
  },
  {
    id: 'david-linda-k-shepherdstown-siding',
    author: 'David & Linda K.',
    location: 'Shepherdstown, WV',
    rating: 5,
    quote:
      "The stone veneer work on our front porch is absolutely stunning. Everyone who visits compliments it. Real Elite's attention to detail sets them apart from every other contractor in the area.",
    source: 'first-party',
    verified: false,
    serviceSlug: 'siding',
    citySlug: 'shepherdstown-wv',
  },
  {
    id: 'thumbtack-l-p-2025-12-04',
    author: 'L. P.',
    location: '',
    rating: 5,
    quote:
      'Realelite showed up on time, did a good job on repair of roof. I would highly recommend them for a the professional job they did.',
    date: '2025-12-04',
    source: 'thumbtack',
    sourceUrl: THUMBTACK_REVIEWS_URL,
    serviceSlug: 'roofing',
    verified: false,
  },
  {
    id: 'thumbtack-customer-2026-01-14',
    author: 'Thumbtack customer',
    location: '',
    rating: 5,
    quote: 'Super fast & easy to schedule with. Thank you :)',
    date: '2026-01-14',
    source: 'thumbtack',
    sourceUrl: THUMBTACK_REVIEWS_URL,
    verified: false,
  },
];

/** Source/consent evidence must be recorded before a quote is published. */
export const REVIEW_PUBLICATION_EVIDENCE: Readonly<Record<string, string>> = {
  'thumbtack-l-p-2025-12-04':
    `Verified 2026-10-09 via the Thumbtack connector. Profile ${THUMBTACK_REVIEWS_URL} (business ID 560701006958788617). Quote copied verbatim.`,
  'thumbtack-customer-2026-01-14':
    `Verified 2026-10-09 via the Thumbtack connector. Profile ${THUMBTACK_REVIEWS_URL} (business ID 560701006958788617). No reviewer name was shown; displayed as Thumbtack customer. Quote copied verbatim.`,
};
export const REVIEWS: readonly Review[] = REVIEW_DRAFTS.filter(
  review => Boolean(REVIEW_PUBLICATION_EVIDENCE[review.id]?.trim())
);

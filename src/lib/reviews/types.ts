/**
 * The Review — the unified review contract for the Real Elite ecosystem.
 *
 * This is the settled shape the Review Center (v2 blueprint §6, Project Object
 * spec §6 "Review Capture") will be built on. It reconciles the three review
 * shapes that exist in the codebase today:
 *
 *  - `TESTIMONIALS` (src/lib/constants.ts) — first-party marketing quotes
 *    shown on /reviews and the homepage. Never emitted as JSON-LD.
 *  - `ProjectReview` (src/lib/projects/types.ts) — the review attached to a
 *    project record ("provenance-linked social proof").
 *  - `SOCIAL_PROOF` (src/lib/constants.ts) — the aggregate-rating gate; see
 *    src/lib/social-proof.ts.
 *
 * INTEGRITY RULE (non-negotiable, inherited from the existing codebase):
 * Review or AggregateRating JSON-LD is emitted ONLY for reviews whose
 * `source` is 'google' AND whose numbers mirror the live Google profile —
 * the same gate `aggregateRatingSchema()` enforces today. JSON-LD stays
 * Google-only. `source: 'thumbtack'` is third-party and may render on-page
 * with a "via Thumbtack" label, but it is never eligible for Review or
 * AggregateRating JSON-LD, even if `verified` is flipped.
 * First-party and project reviews render as visible content, never as
 * self-serving structured data. Google's policy prohibits self-serving
 * review markup; the Google-only gate lives in social-proof.ts.
 *
 * Public lens: `author` is first name + last initial at most; no contact
 * info, no address. Location is "City, ST" display text plus optional
 * canonical slugs for filtering.
 *
 * This file is intentionally consumer-free in this PR — it is the contract
 * the follow-up Review Center PR builds against (Operating Manual: "one
 * contract, many consumers — define it before the second system is built").
 */

/** Where a review originated. Determines display treatment and JSON-LD eligibility. */
export type ReviewSource = 'google' | 'thumbtack' | 'first-party' | 'project';

export type Review = {
  /** Stable id (e.g. slug-style); never reused. */
  id: string;

  // ── The voice ────────────────────────────────────────────────────────────
  /** Public-lens author: first name + last initial at most (e.g. "Mike & Sarah T."). */
  author: string;
  /** Display location, e.g. "Martinsburg, WV". */
  location: string;
  /** 1–5. */
  rating: number;
  /** The review text, verbatim. Never edited beyond trimming. */
  quote: string;
  /** ISO date (YYYY-MM-DD) the review was left, when known. */
  date?: string;

  // ── Provenance & relationships (what makes a review checkable) ──────────
  source: ReviewSource;
  /**
   * True only after the text and rating were checked against the live Google
   * Business Profile. Gates Review/AggregateRating JSON-LD together with
   * `source: 'google'`. First-party, project, and Thumbtack reviews must keep
   * this false. Thumbtack stays ineligible for JSON-LD even if this flag is
   * flipped.
   */
  verified: boolean;
  /** Link to the project this review is about — the Review Center's core differentiator. */
  projectSlug?: string;
  /** Service slug (validated against SERVICES) for service-page filtering. */
  serviceSlug?: string;
  /** City slug (validated against ALL_SERVICE_AREAS) for city-page filtering. */
  citySlug?: string;
  /** Source URL on the third-party platform (e.g. the Google review), when public. */
  sourceUrl?: string;

  // ── Media (future: video reviews per the blueprint) ─────────────────────
  /** Video testimonial URL/path, when the customer consented to one. */
  videoUrl?: string;
};

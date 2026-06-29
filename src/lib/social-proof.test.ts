import { describe, it, expect } from 'vitest';
import {
  hasVerifiedReviews,
  ratingLabel,
  liveBadges,
  aggregateRatingSchema,
  type SocialProofConfig,
} from './social-proof';
import { SOCIAL_PROOF } from './constants';

const base: SocialProofConfig = {
  verified: false,
  googleRating: null,
  googleReviewCount: null,
  projectsCompleted: null,
  badges: [
    { name: 'Google', label: 'Google Reviews', href: 'https://example.com/google' },
    { name: 'BBB', label: 'BBB Accredited', href: null },
  ],
};

const verified: SocialProofConfig = {
  ...base,
  verified: true,
  googleRating: 4.9,
  googleReviewCount: 127,
  projectsCompleted: 500,
};

describe('hasVerifiedReviews', () => {
  it('is false when not verified', () => {
    expect(hasVerifiedReviews(base)).toBe(false);
  });

  it('is false when verified but missing rating or count (partial data)', () => {
    expect(hasVerifiedReviews({ ...base, verified: true })).toBe(false);
    expect(
      hasVerifiedReviews({ ...base, verified: true, googleRating: 4.9 })
    ).toBe(false);
    expect(
      hasVerifiedReviews({ ...base, verified: true, googleReviewCount: 127 })
    ).toBe(false);
  });

  it('is true only when verified with both rating and count', () => {
    expect(hasVerifiedReviews(verified)).toBe(true);
  });
});

describe('ratingLabel', () => {
  it('returns null when unverified (callers keep existing copy)', () => {
    expect(ratingLabel(base)).toBeNull();
  });

  it('formats rating and count when verified', () => {
    expect(ratingLabel(verified)).toEqual({
      number: '4.9★',
      label: '127 Google Reviews',
    });
  });

  it('always shows one decimal place', () => {
    expect(ratingLabel({ ...verified, googleRating: 5 })?.number).toBe('5.0★');
  });
});

describe('liveBadges', () => {
  it('returns only badges with a real href', () => {
    const result = liveBadges(base);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Google');
  });

  it('returns nothing when no badge is configured', () => {
    expect(
      liveBadges({ ...base, badges: [{ name: 'BBB', label: 'BBB', href: null }] })
    ).toEqual([]);
  });
});

describe('aggregateRatingSchema', () => {
  it('is undefined when unverified (no self-serving review markup)', () => {
    expect(aggregateRatingSchema(base)).toBeUndefined();
  });

  it('emits a valid AggregateRating fragment when verified', () => {
    expect(aggregateRatingSchema(verified)).toEqual({
      '@type': 'AggregateRating',
      ratingValue: 4.9,
      reviewCount: 127,
      bestRating: 5,
      worstRating: 1,
    });
  });
});

describe('live SOCIAL_PROOF config (ships honest by default)', () => {
  it('is unverified so the site keeps generic copy and emits no rating schema', () => {
    expect(hasVerifiedReviews(SOCIAL_PROOF)).toBe(false);
    expect(ratingLabel(SOCIAL_PROOF)).toBeNull();
    expect(aggregateRatingSchema(SOCIAL_PROOF)).toBeUndefined();
  });
});

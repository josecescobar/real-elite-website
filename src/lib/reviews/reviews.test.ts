import { describe, it, expect } from 'vitest';
import { REVIEW_DRAFTS, REVIEW_PUBLICATION_EVIDENCE, THUMBTACK_REVIEWS_URL } from './data';
import { SERVICES, ALL_SERVICE_AREAS } from '@/lib/constants';
import { getProjectBySlug } from '@/lib/projects';
import {
  REVIEWS,
  getAllReviews,
  getReviewsByService,
  getReviewsByCity,
  getReviewForProject,
  getFeaturedReviews,
  getReviewedServiceSlugs,
} from '@/lib/reviews';
import { aggregateRatingSchema, reviewJsonLdNodes } from '@/lib/social-proof';

const SERVICE_SLUGS = new Set<string>(SERVICES.map((s) => s.slug));
const CITY_SLUGS = new Set<string>(ALL_SERVICE_AREAS.map((a) => a.slug));

describe('review corpus integrity', () => {
  it('has unique, stable ids', () => {
    const ids = REVIEWS.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('rates every review 1–5', () => {
    for (const r of REVIEW_DRAFTS) {
      expect(r.rating).toBeGreaterThanOrEqual(1);
      expect(r.rating).toBeLessThanOrEqual(5);
    }
  });

  it('references only real service slugs', () => {
    for (const r of REVIEW_DRAFTS) {
      if (r.serviceSlug) expect(SERVICE_SLUGS.has(r.serviceSlug)).toBe(true);
    }
  });

  it('references only real city slugs', () => {
    for (const r of REVIEW_DRAFTS) {
      if (r.citySlug) expect(CITY_SLUGS.has(r.citySlug)).toBe(true);
    }
  });

  it('links only to published projects', () => {
    for (const r of REVIEWS) {
      if (r.projectSlug) expect(getProjectBySlug(r.projectSlug)).not.toBeNull();
    }
  });

  it('never marks a non-Google review as verified (no self-serving schema)', () => {
    for (const r of REVIEW_DRAFTS) {
      if (r.verified) expect(r.source).toBe('google');
    }
  });
});

describe('review helpers', () => {
  it('getAllReviews returns a copy of the corpus', () => {
    const all = getAllReviews();
    expect(all).toHaveLength(REVIEWS.length);
    all.push({ ...REVIEW_DRAFTS[0] });
    expect(getAllReviews()).toHaveLength(REVIEWS.length); // not mutated
  });

  it('getReviewsByService filters by service slug', () => {
    expect(getReviewsByService('roofing').every((r) => r.serviceSlug === 'roofing')).toBe(true);
    expect(getReviewsByService('roofing')).toEqual(REVIEWS.filter(r => r.serviceSlug === 'roofing'));
    expect(getReviewsByService('nonexistent-service')).toEqual([]);
  });

  it('getReviewsByCity filters by city slug', () => {
    expect(getReviewsByCity('martinsburg-wv').every((r) => r.citySlug === 'martinsburg-wv')).toBe(true);
  });

  it('getReviewForProject returns the linked review or null', () => {
    const linked = getReviewForProject('victorian-roof-replacement-martinsburg-wv');
    expect(linked).toBeNull();
    expect(getReviewForProject('no-such-project')).toBeNull();
  });

  it('getFeaturedReviews caps to the requested count', () => {
    expect(getFeaturedReviews(2)).toHaveLength(Math.min(2, REVIEWS.length));
  });

  it('getReviewedServiceSlugs lists only services that have reviews', () => {
    const slugs = getReviewedServiceSlugs();
    expect(slugs).toEqual([...new Set(REVIEWS.map(r => r.serviceSlug).filter(Boolean))]);
    for (const slug of slugs) expect(getReviewsByService(slug).length).toBeGreaterThan(0);
  });
});

describe('publication evidence', () => {
  it('withholds unsourced legacy quotes and publishes only the evidenced Thumbtack reviews', () => {
    const legacy = REVIEW_DRAFTS.filter((r) => r.source !== 'thumbtack');
    expect(legacy).toHaveLength(3);
    for (const review of legacy) {
      expect(REVIEW_PUBLICATION_EVIDENCE[review.id]).toBeUndefined();
      expect(REVIEWS.find((published) => published.id === review.id)).toBeUndefined();
    }
    expect(REVIEWS.map((r) => r.id)).toEqual([
      'thumbtack-l-p-2025-12-04',
      'thumbtack-customer-2026-01-14',
    ]);
    expect(REVIEWS.every((r) => REVIEW_PUBLICATION_EVIDENCE[r.id]?.trim())).toBe(true);
  });
});

describe('thumbtack reviews', () => {
  const thumbtack = REVIEWS.filter((r) => r.source === 'thumbtack');

  it('publishes the two verified quotes verbatim, labeled for Thumbtack', () => {
    expect(thumbtack).toHaveLength(2);
    expect(thumbtack[0]).toMatchObject({
      author: 'L. P.',
      rating: 5,
      date: '2025-12-04',
      serviceSlug: 'roofing',
      source: 'thumbtack',
      sourceUrl: THUMBTACK_REVIEWS_URL,
      verified: false,
      quote:
        'Realelite showed up on time, did a good job on repair of roof. I would highly recommend them for a the professional job they did.',
    });
    expect(thumbtack[1]).toMatchObject({
      author: 'Thumbtack customer',
      rating: 5,
      date: '2026-01-14',
      source: 'thumbtack',
      sourceUrl: THUMBTACK_REVIEWS_URL,
      verified: false,
      quote: 'Super fast & easy to schedule with. Thank you :)',
    });
    expect(thumbtack[1].serviceSlug).toBeUndefined();
    expect(getReviewsByService('roofing').map((r) => r.id)).toEqual(['thumbtack-l-p-2025-12-04']);
  });

  it('never produces Review or AggregateRating JSON-LD', () => {
    expect(reviewJsonLdNodes(REVIEWS)).toEqual([]);
    expect(reviewJsonLdNodes(thumbtack.map((r) => ({ ...r, verified: true })))).toEqual([]);
    expect(JSON.stringify(reviewJsonLdNodes(REVIEW_DRAFTS))).not.toContain('AggregateRating');
    expect(JSON.stringify(reviewJsonLdNodes(REVIEW_DRAFTS))).not.toContain('Thumbtack');

    const googleOnly = reviewJsonLdNodes([
      {
        source: 'google',
        verified: true,
        author: 'A. B.',
        quote: 'Checked against Google.',
        rating: 5,
        date: '2026-01-01',
      },
    ]);
    expect(googleOnly).toHaveLength(1);
    expect(googleOnly[0]['@type']).toBe('Review');
    expect(JSON.stringify(googleOnly)).not.toContain('AggregateRating');
    expect(JSON.stringify(googleOnly)).not.toContain('Thumbtack');

    // AggregateRating stays on Google profile fields, which are still unverified.
    expect(aggregateRatingSchema()).toBeUndefined();
  });
});

import { describe, it, expect } from 'vitest';
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

const SERVICE_SLUGS = new Set<string>(SERVICES.map((s) => s.slug));
const CITY_SLUGS = new Set<string>(ALL_SERVICE_AREAS.map((a) => a.slug));

describe('review corpus integrity', () => {
  it('has unique, stable ids', () => {
    const ids = REVIEWS.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('rates every review 1–5', () => {
    for (const r of REVIEWS) {
      expect(r.rating).toBeGreaterThanOrEqual(1);
      expect(r.rating).toBeLessThanOrEqual(5);
    }
  });

  it('references only real service slugs', () => {
    for (const r of REVIEWS) {
      if (r.serviceSlug) expect(SERVICE_SLUGS.has(r.serviceSlug)).toBe(true);
    }
  });

  it('references only real city slugs', () => {
    for (const r of REVIEWS) {
      if (r.citySlug) expect(CITY_SLUGS.has(r.citySlug)).toBe(true);
    }
  });

  it('links only to published projects', () => {
    for (const r of REVIEWS) {
      if (r.projectSlug) expect(getProjectBySlug(r.projectSlug)).not.toBeNull();
    }
  });

  it('never marks a non-Google review as verified (no self-serving schema)', () => {
    for (const r of REVIEWS) {
      if (r.verified) expect(r.source).toBe('google');
    }
  });
});

describe('review helpers', () => {
  it('getAllReviews returns a copy of the corpus', () => {
    const all = getAllReviews();
    expect(all).toHaveLength(REVIEWS.length);
    all.push({ ...all[0] });
    expect(getAllReviews()).toHaveLength(REVIEWS.length); // not mutated
  });

  it('getReviewsByService filters by service slug', () => {
    expect(getReviewsByService('roofing').every((r) => r.serviceSlug === 'roofing')).toBe(true);
    expect(getReviewsByService('roofing').length).toBeGreaterThan(0);
    expect(getReviewsByService('nonexistent-service')).toEqual([]);
  });

  it('getReviewsByCity filters by city slug', () => {
    expect(getReviewsByCity('martinsburg-wv').every((r) => r.citySlug === 'martinsburg-wv')).toBe(true);
  });

  it('getReviewForProject returns the linked review or null', () => {
    const linked = getReviewForProject('victorian-roof-replacement-martinsburg-wv');
    expect(linked).not.toBeNull();
    expect(linked?.projectSlug).toBe('victorian-roof-replacement-martinsburg-wv');
    expect(getReviewForProject('no-such-project')).toBeNull();
  });

  it('getFeaturedReviews caps to the requested count', () => {
    expect(getFeaturedReviews(2)).toHaveLength(Math.min(2, REVIEWS.length));
  });

  it('getReviewedServiceSlugs lists only services that have reviews', () => {
    const slugs = getReviewedServiceSlugs();
    expect(slugs).toContain('roofing');
    for (const slug of slugs) expect(getReviewsByService(slug).length).toBeGreaterThan(0);
  });
});

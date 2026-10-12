import { describe, expect, it } from 'vitest';
import { REVIEWS } from '@/lib/reviews';
import { isVerifiedWorkImage } from '@/lib/stock-images';
import {
  proofPhotosForArea,
  proofPhotosForService,
  proofPhotosForTown,
  proofReviewsFor,
} from '@/lib/proof-package';

describe('proof package', () => {
  it('uses only verified work photos, and does not call regional photos Ashburn or Martinsburg jobs', () => {
    const kitchens = proofPhotosForService('kitchens', 8);
    const baths = proofPhotosForService('bathrooms', 8);
    const decks = proofPhotosForService('decks', 8);

    expect(kitchens.length).toBeGreaterThan(0);
    expect(baths.length).toBeGreaterThan(0);
    expect(decks).toHaveLength(8);

    for (const photo of [...kitchens, ...baths, ...decks]) {
      expect(isVerifiedWorkImage(photo.src), photo.src).toBe(true);
      expect(photo.caption.toLowerCase()).not.toContain('ashburn');
      expect(photo.caption.toLowerCase()).not.toContain('martinsburg');
      expect(photo.caption.length).toBeGreaterThan(0);
    }

    expect(kitchens.some((photo) => photo.caption.includes('Maryland'))).toBe(true);
    expect(baths.some((photo) => photo.caption.includes('Frederick, MD'))).toBe(true);
  });

  it('returns no photo for a town that has none tagged', () => {
    expect(proofPhotosForTown('middleburg-va')).toEqual([]);
  });

  it('does not invent a Martinsburg tag for state-only gallery photos', () => {
    const local = proofPhotosForArea('martinsburg-wv', 'WV', 6);
    expect(local.length).toBeGreaterThan(0);
    for (const photo of local) {
      // State-only photos say West Virginia; photos tagged to another real town keep that town.
      expect(photo.caption).toMatch(/West Virginia|Falling Waters, WV/);
      expect(photo.caption.toLowerCase()).not.toContain('martinsburg');
    }
  });

  it('matches a published review to the page and never invents a quote', () => {
    const kitchen = proofReviewsFor({ serviceSlug: 'kitchens', citySlug: 'ashburn-va' });
    const decks = proofReviewsFor({ serviceSlug: 'decks', citySlug: 'martinsburg-wv' });
    const martinsburg = proofReviewsFor({ citySlug: 'martinsburg-wv' });
    const roofing = proofReviewsFor({ serviceSlug: 'roofing', citySlug: 'martinsburg-wv' });
    const ids = new Set(REVIEWS.map((review) => review.id));
    const generalId = 'thumbtack-customer-2026-01-14';

    // No published kitchen or deck review, so the general (non-roof) quote is the fallback.
    expect(kitchen.map((review) => review.id)).toEqual([generalId]);
    expect(decks.map((review) => review.id)).toEqual([generalId]);
    expect(martinsburg.map((review) => review.id)).toEqual([generalId]);
    expect(roofing.map((review) => review.id)).toEqual(['thumbtack-l-p-2025-12-04']);
    for (const review of [...kitchen, ...decks, ...martinsburg, ...roofing]) {
      expect(ids.has(review.id)).toBe(true);
      expect(review.quote).toBe(REVIEWS.find((row) => row.id === review.id)?.quote);
    }
    for (const review of martinsburg) {
      expect(review.citySlug ?? 'martinsburg-wv').toBe('martinsburg-wv');
    }
    expect(martinsburg.some((review) => review.source === 'thumbtack')).toBe(true);
    expect(kitchen.some((review) => /\broof\b/i.test(review.quote))).toBe(false);
    expect(decks.some((review) => /\broof\b/i.test(review.quote))).toBe(false);
  });
});

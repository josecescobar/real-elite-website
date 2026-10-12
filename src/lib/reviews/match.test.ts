import { describe, expect, it } from 'vitest';
import { SERVICES } from '@/lib/constants';
import { REVIEW_DRAFTS, REVIEWS } from '@/lib/reviews/data';
import { isRoofQuote, selectReviewsForPage } from '@/lib/reviews/match';
import { reviewsForPage } from '@/lib/reviews';
import type { Review } from '@/lib/reviews/types';

const roof = REVIEWS.find((review) => review.id === 'thumbtack-l-p-2025-12-04');
const general = REVIEWS.find((review) => review.id === 'thumbtack-customer-2026-01-14');
const deckDraft = REVIEW_DRAFTS.find((review) => review.serviceSlug === 'decks');

function quoteIsRoof(review: Review): boolean {
  return review.serviceSlug === 'roofing' || isRoofQuote(review);
}

describe('review-to-service matching', () => {
  it('never gives a kitchen page a roof quote', () => {
    expect(roof).toBeTruthy();
    const kitchen = reviewsForPage({ serviceSlug: 'kitchens' });
    expect(kitchen.length).toBeGreaterThan(0);
    expect(kitchen.every((review) => !quoteIsRoof(review))).toBe(true);
    expect(kitchen.map((review) => review.id)).not.toContain(roof!.id);
  });

  it('gives a deck page the deck review when that review is in the set', () => {
    expect(deckDraft?.serviceSlug).toBe('decks');
    const selected = selectReviewsForPage([roof!, general!, deckDraft!], { serviceSlug: 'decks' });
    expect(selected.map((review) => review.id)).toEqual([deckDraft!.id]);
    expect(selected.some(quoteIsRoof)).toBe(false);
  });

  it('gives a roofing page the roof review', () => {
    const roofing = reviewsForPage({ serviceSlug: 'roofing' });
    expect(roofing.map((review) => review.id)).toEqual(['thumbtack-l-p-2025-12-04']);
    expect(roofing.every((review) => review.serviceSlug === 'roofing')).toBe(true);
  });

  it('falls back to a general review, not a roof quote, when nothing matches', () => {
    const paving = reviewsForPage({ serviceSlug: 'paving' });
    expect(paving.map((review) => review.id)).toEqual(['thumbtack-customer-2026-01-14']);
    expect(paving.every((review) => !review.serviceSlug)).toBe(true);
    expect(paving.some(quoteIsRoof)).toBe(false);
  });

  it('keeps a roof quote off a town page that has no single service', () => {
    const town = reviewsForPage({ citySlug: 'potomac-md' });
    expect(town.map((review) => review.id)).toEqual(['thumbtack-customer-2026-01-14']);
    expect(town.some(quoteIsRoof)).toBe(false);
  });

  it('never returns a roofing review for a non-roofing service in the catalog', () => {
    for (const service of SERVICES) {
      if (service.slug === 'roofing') continue;
      const selected = reviewsForPage({ serviceSlug: service.slug });
      expect(selected.some((review) => review.serviceSlug === 'roofing'), service.slug).toBe(false);
      expect(selected.some(quoteIsRoof), service.slug).toBe(false);
    }
  });

  it('does not render a quote when the only available review is a roof quote', () => {
    const selected = selectReviewsForPage([roof!], { serviceSlug: 'kitchens' });
    expect(selected).toEqual([]);
  });

  it('prefers an interior review on a kitchen page over the general fallback', () => {
    const interior: Review = {
      ...general!,
      id: 'interior-bath',
      serviceSlug: 'bathrooms',
      quote: general!.quote,
    };
    const selected = selectReviewsForPage([roof!, general!, interior], { serviceSlug: 'kitchens' });
    expect(selected.map((review) => review.id)).toEqual(['interior-bath']);
  });
});

import { describe, it, expect } from 'vitest';
import { getAllPosts } from '@/lib/blog';
import { SERVICES } from '@/lib/constants';
import {
  LOUDOUN_COST_GUIDE_BY_SERVICE,
  LOUDOUN_GUIDES_BY_SERVICE,
  LOUDOUN_PERMIT_GUIDE,
  isLoudounArea,
  loudounGuidesFor,
  loudounTownGuides,
} from './loudoun-guides';

const POSTS = new Set(getAllPosts().map((p) => p.slug));
const SERVICE_SLUGS = new Set<string>(SERVICES.map((s) => s.slug));

describe('Loudoun guide pairings', () => {
  it('points only at published posts and real services', () => {
    const maps = [LOUDOUN_GUIDES_BY_SERVICE, LOUDOUN_COST_GUIDE_BY_SERVICE];
    for (const map of maps) {
      for (const [service, slugs] of Object.entries(map)) {
        expect(SERVICE_SLUGS.has(service), service).toBe(true);
        for (const slug of [slugs].flat()) {
          expect(POSTS.has(slug), `${service} → ${slug}`).toBe(true);
        }
      }
    }
  });

  it('recognises Loudoun areas from the catalog, Brambleton included', () => {
    expect(isLoudounArea('loudoun-county-va')).toBe(true);
    expect(isLoudounArea('brambleton-va')).toBe(true);
    expect(isLoudounArea('ashburn-va')).toBe(true);
    expect(isLoudounArea('mclean-va')).toBe(false);
    expect(isLoudounArea('martinsburg-wv')).toBe(false);
    expect(isLoudounArea('not-a-place')).toBe(false);
  });

  it('gives Loudoun service pages their cost guide and nothing elsewhere', () => {
    expect(loudounGuidesFor('kitchens', 'leesburg-va')[0]).toBe(
      'kitchen-remodel-cost-loudoun-county-2026'
    );
    expect(loudounGuidesFor('kitchens', 'mclean-va')).toEqual([]);
  });

  it('leads a town page with the permit guide, then its lead services’ cost guides', () => {
    expect(loudounTownGuides(['basements', 'kitchens', 'bathrooms'])).toEqual([
      LOUDOUN_PERMIT_GUIDE,
      'basement-remodeling-cost-ashburn-leesburg-2026',
      'kitchen-remodel-cost-loudoun-county-2026',
    ]);
  });
});

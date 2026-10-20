import { describe, it, expect } from 'vitest';
import { ALL_SERVICE_AREAS } from '@/lib/constants';
import { claimsFoundIn } from '@/lib/claims';
import { selectTrustBullets, trustBullets } from '@/lib/trust-bullets';

describe('shared trust bullets', () => {
  it('publishes no unconfirmed operational promises in any market', () => {
    for (const area of ALL_SERVICE_AREAS) {
      const copy = selectTrustBullets(area, 'kitchens', 'Kitchen Remodeling');
      expect(copy.length).toBeGreaterThan(0);
      expect(claimsFoundIn(copy.join(' ')), area.slug).toEqual([]);
    }
  });

  it('uses the specific residential VA license and WV license', () => {
    expect(trustBullets('Leesburg', 'Kitchens', 'VA').map(b => b.text).join(' ')).toContain('2705198604 (HIC)');
    expect(trustBullets('Martinsburg', 'Kitchens', 'WV').map(b => b.text).join(' ')).toContain('WV062432');
  });

  it('uses the Pennsylvania HIC registration on Pennsylvania pages', () => {
    expect(trustBullets('Chambersburg', 'Kitchens', 'PA').map(b => b.text).join(' ')).toContain('PA HIC #PA225060');
  });

  it('does not derive Maryland licensing from a Maryland service area', () => {
    const copy = trustBullets('Frederick', 'Kitchens', 'MD').map((bullet) => bullet.text).join(' ');
    expect(copy).toContain('Serving Frederick and Frederick County, Maryland.');
    expect(copy).not.toMatch(/no Maryland contractor license/i);
    expect(copy).not.toMatch(/licensed.*(?:MD|Maryland)/i);
  });

  it('names Montgomery and Howard without a Frederick fallback or a license caveat', () => {
    for (const city of ['Montgomery County', 'Howard County']) {
      const copy = trustBullets(city, 'Kitchens', 'MD').map((bullet) => bullet.text).join(' ');
      expect(copy).toContain(`Serving ${city}, Maryland.`);
      expect(copy).not.toMatch(/Frederick County/);
      expect(copy).not.toMatch(/no Maryland contractor license/i);
      expect(copy).not.toMatch(/licensed.*(?:MD|Maryland)/i);
    }
  });
});

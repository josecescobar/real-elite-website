import { describe, expect, it } from 'vitest';
import { primaryCtaForPath, primaryCtaForService } from './cta-intent';

describe('CTA intent routing', () => {
  it('routes roofing intent to the instant quote', () => {
    expect(primaryCtaForPath('/blog/roof-replacement-cost-2026').intent).toBe('roof-quote');
    expect(primaryCtaForService('roofing').href).toBe('/instant-roof-quote');
  });

  it('keeps general pages on the written estimate flow', () => {
    expect(primaryCtaForPath('/services/decks')).toMatchObject({
      intent: 'estimate',
      href: '/contact#estimate',
    });
    expect(primaryCtaForPath('/')).toMatchObject({ intent: 'estimate', href: '#estimate' });
  });

  it('routes authored luxury markets to a preselected consultation', () => {
    expect(
      primaryCtaForService('kitchens', {
        luxuryMarket: true,
        consultationType: 'kitchen',
      })
    ).toMatchObject({
      intent: 'consultation',
      href: '/design-consultation?type=kitchen',
    });
  });
});

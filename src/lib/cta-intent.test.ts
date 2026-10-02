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
      href: '#estimate',
      label: 'Free Estimate',
    });
    expect(primaryCtaForPath('/services/kitchens')).toMatchObject({ href: '#estimate' });
    expect(primaryCtaForPath('/services/bathrooms/leesburg-va')).toMatchObject({ href: '#estimate' });
    expect(primaryCtaForPath('/services')).toMatchObject({
      intent: 'estimate',
      href: '/contact#estimate',
    });
    expect(primaryCtaForPath('/contact')).toMatchObject({ intent: 'estimate', href: '#estimate' });
    expect(primaryCtaForPath('/contact/')).toMatchObject({ href: '#estimate' });
  });

  it('keeps roofing and the instant quote off the in-page estimate anchor', () => {
    expect(primaryCtaForPath('/services/roofing')).toMatchObject({
      intent: 'roof-quote',
      href: '/instant-roof-quote',
    });
    expect(primaryCtaForPath('/services/roofing/martinsburg-wv').href).toBe('/instant-roof-quote');
    expect(primaryCtaForPath('/instant-roof-quote').href).toBe('/instant-roof-quote');
  });

  it('routes the design-build surfaces to the consultation', () => {
    for (const path of ['/', '/investment', '/projects', '/projects/some-slug', '/process', '/design-consultation']) {
      expect(primaryCtaForPath(path)).toMatchObject({
        intent: 'consultation',
        href: '/design-consultation',
      });
    }
    // A prefix is not a match: /processes would be a different page.
    expect(primaryCtaForPath('/projects-archive').intent).toBe('estimate');
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

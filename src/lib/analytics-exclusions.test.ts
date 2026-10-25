import { describe, expect, it } from 'vitest';
import { isAnalyticsExcludedPath } from './analytics-exclusions';

describe('isAnalyticsExcludedPath', () => {
  it.each(['/sales', '/sales/', '/sales/anything', '/review-request', '/review-request/', '/sales?bucket=hot'])(
    'excludes %s',
    (path) => expect(isAnalyticsExcludedPath(path)).toBe(true)
  );

  it.each(['/', '/services', '/salesforce', '/sales-tax-guide', '/reviews', '/review-requests', null, undefined, ''])(
    'keeps analytics on %s',
    (path) => expect(isAnalyticsExcludedPath(path)).toBe(false)
  );
});

describe('trackEvent on internal tools', () => {
  it('creates no GA globals on /sales', async () => {
    const { trackEvent } = await import('./analytics');
    const w = window as Window & { gtag?: unknown; dataLayer?: unknown };
    delete w.gtag;
    delete w.dataLayer;
    window.history.replaceState(null, '', '/sales');
    try {
      trackEvent('phone_click');
      expect(w.gtag).toBeUndefined();
      expect(w.dataLayer).toBeUndefined();
    } finally {
      window.history.replaceState(null, '', '/');
    }
  });
});

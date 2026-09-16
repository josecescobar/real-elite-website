import { describe, it, expect, vi, afterEach } from 'vitest';
import { trackEvent, trackEstimateStep, trackLead } from '@/lib/analytics';

function stubWindow(gtag?: unknown) {
  vi.stubGlobal('window', {
    gtag,
    dataLayer: [],
    location: { pathname: '/test-page' },
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('trackEvent', () => {
  it('is a no-op (no throw) when window is unavailable', () => {
    expect(() => trackEvent('estimate_submit')).not.toThrow();
  });

  it('queues the event on dataLayer when gtag.js has not loaded yet', () => {
    stubWindow(undefined);
    expect(() => trackEvent('estimate_submit')).not.toThrow();
    expect(typeof window.gtag).toBe('function');
    expect(window.dataLayer?.length).toBeGreaterThan(0);
  });

  it('forwards the event name and current path to gtag', () => {
    const gtag = vi.fn();
    stubWindow(gtag);
    trackEvent('estimate_submit');
    expect(gtag).toHaveBeenCalledWith('event', 'estimate_submit', {
      page_path: '/test-page',
    });
  });

  it('merges caller params alongside the page path', () => {
    const gtag = vi.fn();
    stubWindow(gtag);
    trackEvent('cta_click', { location: 'hero' });
    expect(gtag).toHaveBeenCalledWith('event', 'cta_click', {
      page_path: '/test-page',
      location: 'hero',
    });
  });
});

describe('trackEstimateStep', () => {
  it('namespaces the action and includes the step number', () => {
    const gtag = vi.fn();
    stubWindow(gtag);
    trackEstimateStep('advance', 2, 'estimate', { service: 'roofing' });
    expect(gtag).toHaveBeenCalledWith('event', 'estimate_step_advance', {
      page_path: '/test-page',
      step: 2,
      form: 'estimate',
      service: 'roofing',
    });
  });

  /**
   * Both intakes emit these event names. Without the discriminator a GA4
   * report cannot separate the two funnels — which is how "17 form views, 0
   * advances" became unreadable: some of those views were the single-step
   * consultation form, which never emits an advance at all.
   */
  it('tags every event with the funnel it came from', () => {
    const gtag = vi.fn();
    stubWindow(gtag);
    trackEstimateStep('view', 1, 'luxury_consultation');
    expect(gtag).toHaveBeenCalledWith('event', 'estimate_step_view', {
      page_path: '/test-page',
      step: 1,
      form: 'luxury_consultation',
    });
  });

  it('emits a distinct start event for first interaction', () => {
    const gtag = vi.fn();
    stubWindow(gtag);
    trackEstimateStep('start', 1, 'estimate');
    expect(gtag).toHaveBeenCalledWith('event', 'estimate_step_start', {
      page_path: '/test-page',
      step: 1,
      form: 'estimate',
    });
  });
});

describe('trackLead', () => {
  it('fires the canonical generate_lead event with its params', () => {
    const gtag = vi.fn();
    stubWindow(gtag);
    trackLead({ lead_type: 'estimate', service: 'roofing', value_band: '$25k – $50k' });
    expect(gtag).toHaveBeenCalledWith('event', 'generate_lead', {
      page_path: '/test-page',
      lead_type: 'estimate',
      service: 'roofing',
      value_band: '$25k – $50k',
    });
  });

  it('works with only the required lead_type', () => {
    const gtag = vi.fn();
    stubWindow(gtag);
    trackLead({ lead_type: 'roof_quote' });
    expect(gtag).toHaveBeenCalledWith('event', 'generate_lead', {
      page_path: '/test-page',
      lead_type: 'roof_quote',
    });
  });
});

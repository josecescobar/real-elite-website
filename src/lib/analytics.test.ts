import { describe, it, expect, vi, afterEach } from 'vitest';
import { trackEvent, trackEstimateStep, trackLead } from '@/lib/analytics';

function stubWindow(gtag?: unknown) {
  vi.stubGlobal('window', {
    gtag,
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

  it('is a no-op when window.gtag is not a function', () => {
    stubWindow(undefined);
    expect(() => trackEvent('estimate_submit')).not.toThrow();
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
    trackEstimateStep('advance', 2, { service: 'roofing' });
    expect(gtag).toHaveBeenCalledWith('event', 'estimate_step_advance', {
      page_path: '/test-page',
      step: 2,
      service: 'roofing',
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

type GtagParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (command: 'event', eventName: string, params?: GtagParams) => void;
  }
}

export function trackEvent(name: string, params: GtagParams = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', name, {
    page_path: window.location.pathname,
    ...params,
  });
}

/**
 * Convenience tracker for multi-step estimate form progress.
 * Fires `estimate_step_view`, `estimate_step_advance`, `estimate_submit`,
 * and `estimate_abandon` depending on action.
 */
export function trackEstimateStep(
  action: 'view' | 'advance' | 'submit' | 'abandon',
  step: number,
  params: GtagParams = {}
) {
  trackEvent(`estimate_step_${action}`, { step, ...params });
}

/** Which intake produced the lead. */
export type LeadType = 'estimate' | 'roof_quote' | 'luxury_consultation';

/**
 * The ONE canonical "a lead happened" event, fired on every successful form
 * submission across all three intakes (standard estimate, instant roof quote,
 * luxury consultation). It is emitted *alongside* the existing form-specific
 * events (`form_submit`, `roof_quote_submit`, `estimate_step_submit`) — those
 * stay for funnel analysis; this one is the single event to mark as a GA4 key
 * event / conversion and to import into Google Ads. Uses GA4's recommended
 * `generate_lead` event name.
 *
 * `value_band` carries the budget-range *label* (e.g. "$25k – $50k"), not a
 * number — it is intentionally NOT GA4's reserved numeric `value` param, so it
 * can never be misread as monetized revenue.
 */
export function trackLead(params: {
  lead_type: LeadType;
  service?: string;
  city?: string;
  value_band?: string;
}) {
  trackEvent('generate_lead', params);
}

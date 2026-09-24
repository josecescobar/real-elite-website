type GtagParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Official GA4 dataLayer stub. Events pushed here before `gtag.js` arrives
 * are flushed when the library loads, so we can delay the third-party
 * download past first paint without dropping `estimate_*` / `generate_lead`.
 */
export function ensureGtagStub() {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag === 'function') return;
  window.gtag = function gtag() {
    // GA's own snippet uses `arguments`, not rest params.
    window.dataLayer!.push(arguments);
  };
}

export function trackEvent(name: string, params: GtagParams = {}) {
  if (typeof window === 'undefined') return;
  ensureGtagStub();
  window.gtag!('event', name, {
    page_path: window.location.pathname,
    ...params,
  });
}

/** Which intake produced the lead. */
export type LeadType = 'estimate' | 'roof_quote' | 'luxury_consultation';

/**
 * Which stepped intake a funnel event belongs to. Derived from LeadType so the
 * two vocabularies cannot drift; the roof quote is excluded because it is a
 * single-shot tool with no step funnel.
 */
export type EstimateFunnel = Extract<LeadType, 'estimate' | 'luxury_consultation'>;

/**
 * Funnel tracker for the stepped intake forms. Fires
 * `estimate_step_view`, `estimate_step_start`, `estimate_step_advance`,
 * `estimate_step_submit` and `estimate_step_abandon`.
 *
 * `form` is required because both intakes share these event names: without it
 * a GA4 report cannot tell the standard estimate funnel from the luxury
 * consultation one, and the consultation form — being single-step — never
 * emits `advance`, which makes a combined advance rate meaningless.
 *
 * The two early actions mean different things and are easy to confuse:
 *
 * - `view` fires when the form mounts. These forms render on the homepage,
 *   /contact, /paving, /storm-damage and every service+city page, so `view` is
 *   a form *impression* — roughly a page view, not an intent signal.
 * - `start` fires on the first real interaction with a field. This is the
 *   engagement signal. Measure the funnel from `start`, not from `view`.
 */
export function trackEstimateStep(
  action: 'view' | 'start' | 'advance' | 'submit' | 'abandon',
  step: number,
  form: EstimateFunnel,
  params: GtagParams = {}
) {
  trackEvent(`estimate_step_${action}`, { step, form, ...params });
}

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

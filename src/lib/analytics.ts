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

/**
 * First-touch attribution — how did this visitor find us?
 *
 * Captured ONCE per browser session (sessionStorage) the first time any page
 * loads, then attached to every lead submission so the owner email and the
 * lead ledger can answer "which channel produced this lead?" — the number
 * that makes paid spend (Google LSA/Ads, Meta) optimizable instead of blind.
 *
 * First-touch, not last-touch: the landing page carries the `utm_*` params
 * and the external referrer, and that is the acquisition signal we want. A
 * later same-session navigation (which loses the params) must NOT overwrite
 * it — so `captureFirstTouch()` is a no-op once a record exists.
 *
 * Privacy: this stores only campaign tags, the referring host, and the landing
 * path — never anything the visitor types, and it clears when the tab closes.
 * Client-only (reads `window`); safe no-op during SSR.
 */

const STORAGE_KEY = 'realelite-attribution';

export type Attribution = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  /** Referring host only (e.g. "google.com"), never the full URL. */
  referrer?: string;
  /** The path (+ query) the visitor first landed on. */
  landingPath?: string;
};

/** Cap every stored value so a crafted URL can't bloat sessionStorage. */
const MAX_LEN = 200;
const clip = (s: string) => s.slice(0, MAX_LEN);

/**
 * Capture first-touch attribution if none exists yet for this session.
 * Idempotent and safe to call on every page load.
 */
export function captureFirstTouch(): void {
  if (typeof window === 'undefined') return;
  try {
    if (window.sessionStorage.getItem(STORAGE_KEY)) return; // first-touch wins

    const params = new URLSearchParams(window.location.search);
    const pick = (k: string) => {
      const v = params.get(k);
      return v ? clip(v) : undefined;
    };

    let referrer: string | undefined;
    if (document.referrer) {
      try {
        const refHost = new URL(document.referrer).host;
        // Ignore our own domain — an internal navigation isn't a source.
        if (refHost && refHost !== window.location.host) referrer = clip(refHost);
      } catch {
        /* malformed referrer — ignore */
      }
    }

    const record: Attribution = {
      utmSource: pick('utm_source'),
      utmMedium: pick('utm_medium'),
      utmCampaign: pick('utm_campaign'),
      utmTerm: pick('utm_term'),
      utmContent: pick('utm_content'),
      referrer,
      landingPath: clip(window.location.pathname + window.location.search),
    };

    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {
    /* sessionStorage blocked (private mode / cookies off) — attribution is
       best-effort and must never break the page. */
  }
}

/**
 * Read the captured attribution for this session, or `null` if none/blocked.
 * Fields with no value are omitted, so the return is either a populated object
 * or (when only the landing path was known) a minimal one.
 */
export function getAttribution(): Attribution | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Attribution;
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Flatten attribution into the flat string fields the /api/estimate payload
 * accepts (and that the lead email + ledger read). Undefined fields are
 * dropped so the request body stays clean.
 */
export function attributionPayload(): Record<string, string> {
  const a = getAttribution();
  if (!a) return {};
  const out: Record<string, string> = {};
  if (a.utmSource) out.utmSource = a.utmSource;
  if (a.utmMedium) out.utmMedium = a.utmMedium;
  if (a.utmCampaign) out.utmCampaign = a.utmCampaign;
  if (a.referrer) out.referrer = a.referrer;
  if (a.landingPath) out.landingPath = a.landingPath;
  return out;
}

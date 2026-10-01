/**
 * TCPA disclosure for quote and contact forms.
 *
 * The checkbox is optional and starts unchecked. A lead is consent=true only
 * when the visitor checked the box AND the submitted text version matches the
 * copy rendered on the page. The server stamps the time, IP, and user agent.
 */

export const SMS_CONSENT_TEXT_VERSION = '2026-09-30';

/** Verbatim web-form checkbox. "SMS Terms" and "Privacy Policy" are links on the form. */
export const SMS_CONSENT_TEXT =
  'Yes, Real Elite Contracting may text me at the number above about my project, including estimate scheduling and updates. Msg frequency varies. Msg & data rates may apply. Reply STOP to opt out, HELP for help. Consent is not a condition of purchase. See our SMS Terms and Privacy Policy.';

/** Verbatim script the phone assistant reads before texting a caller. */
export const SMS_VERBAL_OPT_IN_SCRIPT =
  'One more thing: is it okay if Real Elite Contracting sends you text messages at this number about your project? Message frequency varies, message and data rates may apply, and you can reply STOP anytime to opt out.';

const PAGE_URL_MAX = 2000;

export type SmsConsentPayload = {
  smsConsent: boolean;
  smsConsentTextVersion: string;
  pageUrl: string;
};

export type StoredSmsConsent = {
  consent: boolean;
  timestamp: string;
  pageUrl: string;
  textVersion: string;
  text: string;
  ip: string;
  userAgent: string;
};

/** Fields the browser sends with every quote/contact submit. */
export function smsConsentPayload(checked: boolean): SmsConsentPayload {
  const pageUrl = typeof window === 'undefined' ? '' : window.location.href;
  return {
    smsConsent: checked,
    smsConsentTextVersion: SMS_CONSENT_TEXT_VERSION,
    pageUrl,
  };
}

function pageUrlFrom(value: unknown): string {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim().slice(0, PAGE_URL_MAX);
  if (!/^https?:\/\//i.test(trimmed)) return '';
  return trimmed;
}

/**
 * Record what the visitor agreed to. Missing or mismatched text versions
 * stay consent=false so an old client cannot invent a yes.
 */
export function readSmsConsent(
  body: unknown,
  meta: { ip: string; userAgent: string; now?: Date }
): StoredSmsConsent {
  const record =
    body && typeof body === 'object' ? (body as Record<string, unknown>) : {};
  const version =
    typeof record.smsConsentTextVersion === 'string'
      ? record.smsConsentTextVersion.trim()
      : '';
  const checked = record.smsConsent === true;
  return {
    consent: checked && version === SMS_CONSENT_TEXT_VERSION,
    timestamp: (meta.now ?? new Date()).toISOString(),
    pageUrl: pageUrlFrom(record.pageUrl),
    textVersion: SMS_CONSENT_TEXT_VERSION,
    text: SMS_CONSENT_TEXT,
    ip: meta.ip,
    userAgent: meta.userAgent.slice(0, 500),
  };
}

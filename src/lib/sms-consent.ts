/**
 * TCPA disclosure for quote and contact forms.
 *
 * The checkbox is optional and starts unchecked. A lead is consent=true only
 * when the visitor checked the box AND the submitted text version matches the
 * copy rendered on the page. The server stamps the time, IP, and user agent.
 */

export const SMS_CONSENT_TEXT_VERSION = '2026-09-29';

export const SMS_CONSENT_TEXT =
  'I agree that Real Elite Contracting may call or text me at this number about my project, including with automated technology or an AI assistant. Consent is not required to get a quote. Msg & data rates may apply. Reply STOP to opt out.';

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

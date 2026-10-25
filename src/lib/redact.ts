/**
 * Log redaction for upstream error bodies (Twilio, Resend, Supabase, lead
 * webhook, AI gateway). Those bodies often echo the request, so they can
 * carry a lead's phone number or email. Phone numbers keep only their last
 * 4 digits; email addresses are replaced outright.
 */

const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
// A run of 7+ digits, optionally split by spaces, dots, dashes or brackets,
// optionally prefixed by + (E.164) or URL-encoded + (%2B).
const PHONE_RE = /(?:\+|%2B)?\(?\d(?:[\s().-]*\d){6,}/gi;

const MAX_LOG_CHARS = 2_000;

export function redactPii(value: string): string {
  return value.replace(EMAIL_RE, '[email]').replace(PHONE_RE, (match) => {
    const digits = match.replace(/%2B/gi, '').replace(/\D/g, '');
    if (digits.length < 7) return match;
    return `***${digits.slice(-4)}`;
  });
}

/**
 * Redact any logged value (string, object, Error) to a capped string.
 * The FULL text is redacted first and only then truncated, so a phone
 * number or email that straddles the cut can never survive half-masked.
 * Callers must pass the untruncated value and use `maxChars` to shorten it.
 */
export function redactForLog(value: unknown, maxChars = MAX_LOG_CHARS): string {
  let text: string;
  if (typeof value === 'string') text = value;
  else if (value instanceof Error) text = `${value.name}: ${value.message}`;
  else {
    try {
      text = JSON.stringify(value) ?? String(value);
    } catch {
      text = String(value);
    }
  }
  const redacted = redactPii(text);
  return redacted.length > maxChars ? `${redacted.slice(0, maxChars)}…` : redacted;
}

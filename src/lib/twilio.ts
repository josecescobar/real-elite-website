import { createHmac, timingSafeEqual } from 'crypto';
import { env } from './env';

/**
 * Twilio helpers shared by the voice/SMS webhooks.
 *
 * The signature check is the important one: a public webhook that sends
 * SMS is an SMS-pumping fraud target, so every inbound Twilio request is
 * verified against X-Twilio-Signature before we act on it.
 */

/** Escape a string for safe inclusion in TwiML/XML. */
export function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Validate a Twilio request signature.
 *
 * Algorithm (per Twilio docs): take the exact webhook URL, append each
 * POST param — sorted by key — as `key + value` with no separators,
 * HMAC-SHA1 with the auth token, base64-encode, and compare to the
 * X-Twilio-Signature header in constant time.
 */
export function validateTwilioSignature(opts: {
  authToken: string;
  signature: string | null;
  url: string;
  params: Record<string, string>;
}): boolean {
  const { authToken, signature, url, params } = opts;
  if (!signature) return false;

  const data = Object.keys(params)
    .sort()
    .reduce((acc, key) => acc + key + params[key], url);

  const expected = createHmac('sha1', authToken).update(Buffer.from(data, 'utf-8')).digest('base64');

  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * Reconstruct the public URL Twilio used to reach this route, so the
 * signature check hashes the same string Twilio signed. TWILIO_WEBHOOK_BASE_URL
 * overrides header reconstruction when set (most reliable behind proxies).
 */
export function webhookUrl(request: Request, pathname: string): string {
  const base = env.twilioWebhookBaseUrl();
  if (base) return `${base.replace(/\/$/, '')}${pathname}`;
  const host =
    request.headers.get('x-forwarded-host') || request.headers.get('host') || '';
  return `https://${host}${pathname}`;
}

/**
 * Send an SMS via the Twilio REST API. Returns whether Twilio accepted
 * it; never throws. Reads TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN /
 * TWILIO_FROM_NUMBER from the environment.
 */
export async function sendSms(to: string, body: string): Promise<boolean> {
  const sid = env.twilioAccountSid();
  const token = env.twilioAuthToken();
  const from = env.twilioFromNumber();
  if (!sid || !token || !from) return false;

  try {
    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ From: from, To: to, Body: body }).toString(),
      }
    );
    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      console.error('Twilio SMS failed', { status: res.status, detail });
    }
    return res.ok;
  } catch (err) {
    console.error('Twilio SMS network error', err);
    return false;
  }
}

const xmlHeaders = { 'Content-Type': 'text/xml; charset=utf-8' };

/** Wrap TwiML in a proper text/xml Response. */
export function twiml(body: string, status = 200): Response {
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>${body}`, {
    status,
    headers: xmlHeaders,
  });
}

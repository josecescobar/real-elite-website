/**
 * Posts a website lead to the Job Board in the same JSON shape elite-agent
 * uses for phone leads (see elite-agent SETUP.md, LEAD_WEBHOOK_URL).
 *
 * LEAD_WEBHOOK_URL unset → no-op. A bearer secret is sent when
 * LEAD_WEBHOOK_SECRET is set. Failures are logged and never thrown: email
 * delivery stays the path that must succeed.
 *
 * `call_sid` is a website idempotency key (`web-<uuid>`). The Job Board
 * intake requires that field today; the `web-` prefix keeps form leads
 * distinct from Twilio call SIDs.
 */

import { env } from '@/lib/env';
import type { StoredSmsConsent } from '@/lib/sms-consent';

const POST_TIMEOUT_MS = 2500;

export type WebsiteLeadForWebhook = {
  name: string;
  phone: string;
  email: string;
  service: string;
  message?: string;
  zip?: string;
  town?: string;
  address?: string;
  howHeard?: string;
  consent: StoredSmsConsent;
};

export function websiteLeadCallSid(): string {
  return `web-${crypto.randomUUID()}`;
}

export function buildLeadWebhookPayload(
  input: WebsiteLeadForWebhook,
  callSid: string
): Record<string, unknown> {
  return {
    source: 'real_elite_contracting',
    company_name: 'Real Elite Contracting',
    name: input.name,
    phone: input.phone,
    callback_number: input.phone,
    called_number: '',
    email: input.email,
    address: input.address ?? '',
    town: input.town ?? '',
    county: '',
    zip: input.zip ?? '',
    job_type: input.service,
    urgency: 'normal',
    how_heard: input.howHeard || 'website',
    summary: input.message ?? '',
    spam: false,
    urgent: false,
    outcome: 'website_form',
    recording_link: null,
    transcript_link: null,
    call_sid: callSid,
    timestamp: input.consent.timestamp,
    consent: input.consent.consent,
    consent_timestamp: input.consent.timestamp,
    consent_page_url: input.consent.pageUrl,
    consent_text_version: input.consent.textVersion,
    consent_text: input.consent.text,
    ip: input.consent.ip,
    user_agent: input.consent.userAgent,
  };
}

export async function postLeadWebhook(payload: Record<string, unknown>): Promise<void> {
  const url = env.leadWebhookUrl()?.trim();
  if (!url) return;

  const secret = env.leadWebhookSecret()?.trim();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (secret) headers.Authorization = `Bearer ${secret}`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(POST_TIMEOUT_MS),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      console.error('Lead webhook failed', { status: res.status, body: body.slice(0, 500) });
    }
  } catch (err) {
    console.error('Lead webhook error', err);
  }
}

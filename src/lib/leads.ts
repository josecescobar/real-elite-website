/**
 * The Lead ledger — a durable record of every inquiry, so lead volume, source,
 * and mix are queryable instead of buried in an inbox. Email + SMS remain the
 * source of truth for *delivery*; this is the source of truth for *counting*.
 *
 * Storage is Supabase (Postgres) written over its PostgREST endpoint with
 * `fetch` — the same dependency-free, env-gated pattern the app already uses
 * for Twilio and Upstash. No `@supabase/supabase-js` client is added.
 *
 * Fully env-gated: with `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` unset
 * (today's default), `recordLead` reports `unconfigured` and writes nothing.
 * When configured, it inserts one row per lead. It NEVER throws. The caller
 * runs it after the owner email is already sent. A request timeout guarantees
 * a hung database can't stall the HTTP response. Customer enrollment SMS is
 * allowed only when this insert succeeds and returns a consent id. The owner
 * speed-to-lead text is a separate credential-gated alert and does not use
 * that consent id.
 *
 * One-time setup to turn it on: create the `leads` table (SQL in
 * `docs/LEAD_LEDGER_SETUP.md`) and set the two env vars in Vercel.
 */

import { env } from '@/lib/env';
import type { StoredSmsConsent } from '@/lib/sms-consent';

export type LeadType = 'estimate' | 'roof_quote' | 'luxury_consultation';

/** First-touch attribution attached to a lead (all optional). */
export type LeadAttribution = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referrer?: string;
  landingPath?: string;
};

/** Everything needed to record a lead; id + timestamp are generated here. */
export type LeadInput = {
  leadType: LeadType;
  /** True for the high-value luxury-consultation intake. */
  luxury: boolean;
  fullName: string;
  email: string;
  phone: string;
  service: string;
  zip?: string;
  budgetRange?: string;
  timeline?: string;
  propertyType?: string;
  message?: string;
  attribution?: LeadAttribution;
  /** Optional AI-generated "heads up" blurb (see src/lib/ai-lead-summary.ts).
   *  Omitted/undefined when the AI Gateway key isn't set or the call failed. */
  aiSummary?: string;
  /** TCPA consent captured with the lead. See src/lib/sms-consent.ts. */
  consent?: StoredSmsConsent;
};

/** How long to wait on the insert before giving up (never stall the response). */
const INSERT_TIMEOUT_MS = 2500;

const LEAD_ID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** The id counts only when the response echoes the row we inserted. */
function echoedLead(
  body: string,
  expected: string
): { id: string; smsConsent: boolean } | null {
  if (!body || !LEAD_ID.test(expected)) return null;
  try {
    const parsed = JSON.parse(body) as unknown;
    const row = Array.isArray(parsed) ? parsed[0] : parsed;
    if (!row || typeof row !== 'object') return null;
    const record = row as { id?: unknown; sms_consent?: unknown };
    if (record.id !== expected) return null;
    return { id: expected, smsConsent: record.sms_consent === true };
  } catch {
    return null;
  }
}

/**
 * Infer the intake from the service label the forms send. Robust to copy
 * tweaks: the luxury prefix and "instant quote" are the load-bearing tokens.
 */
export function inferLeadType(service: string): LeadType {
  if (service.startsWith('[Luxury Consultation]')) return 'luxury_consultation';
  if (/instant\s+quote/i.test(service)) return 'roof_quote';
  return 'estimate';
}

export type LeadWriteResult =
  | { ok: false; reason: 'unconfigured' | 'failed' }
  | { ok: true; leadId: string; consentId: string | null };

/**
 * Append a lead to the ledger. `unconfigured` when Supabase env vars are absent.
 * Resolves (never rejects) whether the write succeeds, fails, or is skipped.
 * `consentId` is the stored lead id only when the insert succeeded AND the row
 * recorded affirmative consent. Callers must not text the customer without it.
 */
export async function recordLead(input: LeadInput): Promise<LeadWriteResult> {
  const url = env.supabaseUrl();
  const key = env.supabaseServiceRoleKey();
  if (!url || !key) return { ok: false, reason: 'unconfigured' };

  // snake_case to match the Postgres column names (see setup doc).
  const row = {
    id: crypto.randomUUID(),
    ts: new Date().toISOString(),
    lead_type: input.leadType,
    luxury: input.luxury,
    full_name: input.fullName,
    email: input.email,
    phone: input.phone,
    service: input.service,
    zip: input.zip ?? null,
    budget_range: input.budgetRange ?? null,
    timeline: input.timeline ?? null,
    property_type: input.propertyType ?? null,
    message: input.message ?? null,
    utm_source: input.attribution?.utmSource ?? null,
    utm_medium: input.attribution?.utmMedium ?? null,
    utm_campaign: input.attribution?.utmCampaign ?? null,
    referrer: input.attribution?.referrer ?? null,
    landing_path: input.attribution?.landingPath ?? null,
    ai_summary: input.aiSummary ?? null,
    // Copied onto the lead row for reporting. Not an acknowledgment that
    // consent was stored, and not permission to text the customer.
    sms_consent: input.consent?.consent ?? null,
    sms_consent_at: input.consent?.timestamp ?? null,
    sms_consent_page_url: input.consent?.pageUrl ?? null,
    sms_consent_text_version: input.consent?.textVersion ?? null,
    sms_consent_text: input.consent?.text ?? null,
    client_ip: input.consent?.ip ?? null,
    user_agent: input.consent?.userAgent ?? null,
  };

  try {
    const res = await fetch(`${url.replace(/\/$/, '')}/rest/v1/leads`, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(row),
      signal: AbortSignal.timeout(INSERT_TIMEOUT_MS),
    });
    const body = await res.text().catch(() => '');
    if (!res.ok) {
      console.error('Lead ledger insert failed', { status: res.status, body });
      return { ok: false, reason: 'failed' };
    }
    const echoed = echoedLead(body, row.id);
    if (!echoed) {
      console.error('Lead ledger insert was not acknowledged', { status: res.status });
      return { ok: false, reason: 'failed' };
    }
    return {
      ok: true,
      leadId: echoed.id,
      consentId: input.consent?.consent && echoed.smsConsent ? echoed.id : null,
    };
  } catch (err) {
    // Network error / timeout / abort — the email already delivered the lead.
    console.error('Lead ledger insert error', err);
    return { ok: false, reason: 'failed' };
  }
}

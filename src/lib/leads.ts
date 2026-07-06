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
 * (today's default), `recordLead` is a silent no-op and nothing changes. When
 * configured, it inserts one row per lead. It NEVER throws and NEVER delays the
 * email/SMS path: the caller runs it after the owner email is already sent, and
 * a request timeout guarantees a hung database can't stall the HTTP response.
 *
 * One-time setup to turn it on: create the `leads` table (SQL in
 * `docs/LEAD_LEDGER_SETUP.md`) and set the two env vars in Vercel.
 */

import { env } from '@/lib/env';

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
};

/** How long to wait on the insert before giving up (never stall the response). */
const INSERT_TIMEOUT_MS = 2500;

/**
 * Infer the intake from the service label the forms send. Robust to copy
 * tweaks: the luxury prefix and "instant quote" are the load-bearing tokens.
 */
export function inferLeadType(service: string): LeadType {
  if (service.startsWith('[Luxury Consultation]')) return 'luxury_consultation';
  if (/instant\s+quote/i.test(service)) return 'roof_quote';
  return 'estimate';
}

/**
 * Append a lead to the ledger. No-op when Supabase env vars are absent.
 * Resolves (never rejects) whether the write succeeds, fails, or is skipped —
 * failures are logged, not surfaced, so lead capture is never affected.
 */
export async function recordLead(input: LeadInput): Promise<void> {
  const url = env.supabaseUrl();
  const key = env.supabaseServiceRoleKey();
  if (!url || !key) return; // ledger not configured — silent no-op

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
  };

  try {
    const res = await fetch(`${url.replace(/\/$/, '')}/rest/v1/leads`, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(row),
      signal: AbortSignal.timeout(INSERT_TIMEOUT_MS),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      console.error('Lead ledger insert failed', { status: res.status, body });
    }
  } catch (err) {
    // Network error / timeout / abort — the email already delivered the lead.
    console.error('Lead ledger insert error', err);
  }
}

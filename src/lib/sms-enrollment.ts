import { env } from '@/lib/env';
import { toE164 } from '@/lib/review-request';
import type { StoredSmsConsent } from '@/lib/sms-consent';

const RPC_TIMEOUT_MS = 2500;

/** Customer-SMS flags default off. Only the exact strings "true" and "1" enable a path. */
export function explicitSmsFlagOn(raw: string | undefined): boolean {
  const value = raw?.trim().toLowerCase();
  return value === 'true' || value === '1';
}

type SupabaseConfig = { url: string; key: string };

function supabase(): SupabaseConfig | null {
  const url = env.supabaseUrl()?.replace(/\/$/, '');
  const key = env.supabaseServiceRoleKey();
  if (!url || !key) return null;
  return { url, key };
}

function authHeaders(key: string): Record<string, string> {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
}

/**
 * Insert consent evidence and require the database to echo that row back.
 * A client-generated id is not proof until this response contains it.
 */
export async function storeSmsConsentEvidence(input: {
  evidenceId: string;
  phoneE164: string;
  consent: StoredSmsConsent;
}): Promise<boolean> {
  const db = supabase();
  if (!db || !input.consent.consent) return false;
  try {
    const res = await fetch(`${db.url}/rest/v1/sms_consent_evidence`, {
      method: 'POST',
      headers: {
        ...authHeaders(db.key),
        Prefer: 'return=representation',
      },
      body: JSON.stringify({
        id: input.evidenceId,
        phone_e164: input.phoneE164,
        consent: true,
        text_version: input.consent.textVersion,
        consent_text: input.consent.text,
        consented_at: input.consent.timestamp,
        page_url: input.consent.pageUrl || null,
        client_ip: input.consent.ip || null,
        user_agent: input.consent.userAgent || null,
      }),
      signal: AbortSignal.timeout(RPC_TIMEOUT_MS),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error('sms consent evidence insert failed', { status: res.status, body: text });
      return false;
    }
    const rows = (await res.json().catch(() => null)) as
      | { id?: unknown; consent?: unknown; phone_e164?: unknown }[]
      | null;
    const row = Array.isArray(rows) ? rows[0] : null;
    return Boolean(
      row &&
        row.id === input.evidenceId &&
        row.consent === true &&
        row.phone_e164 === input.phoneE164
    );
  } catch (err) {
    console.error('sms consent evidence insert error', err);
    return false;
  }
}

export type EnrollmentClaim =
  | { claimed: true; evidenceId: string }
  | { claimed: false; reason: string };

/**
 * One winner per phone. Send only when `claimed` is true for this evidence id.
 * `replay` and `no_evidence` must not text.
 */
export async function claimSmsEnrollmentSend(input: {
  phoneE164: string;
  evidenceId: string;
  textVersion: string;
}): Promise<EnrollmentClaim> {
  const db = supabase();
  if (!db) return { claimed: false, reason: 'persistence_failed' };
  try {
    const res = await fetch(`${db.url}/rest/v1/rpc/claim_sms_enrollment_send`, {
      method: 'POST',
      headers: authHeaders(db.key),
      body: JSON.stringify({
        p_phone: input.phoneE164,
        p_evidence_id: input.evidenceId,
        p_text_version: input.textVersion,
      }),
      signal: AbortSignal.timeout(RPC_TIMEOUT_MS),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error('sms enrollment claim failed', { status: res.status, body: text });
      return { claimed: false, reason: 'persistence_failed' };
    }
    const row = (await res.json().catch(() => null)) as {
      claimed?: unknown;
      reason?: unknown;
      evidence_id?: unknown;
    } | null;
    if (
      row?.claimed === true &&
      row.reason === 'claimed' &&
      row.evidence_id === input.evidenceId
    ) {
      return { claimed: true, evidenceId: input.evidenceId };
    }
    return {
      claimed: false,
      reason: typeof row?.reason === 'string' ? row.reason : 'persistence_failed',
    };
  } catch (err) {
    console.error('sms enrollment claim error', err);
    return { claimed: false, reason: 'persistence_failed' };
  }
}

/** Record provider acceptance, or release the claim to `failed`. Never throws. */
export async function finishSmsEnrollmentSend(input: {
  phoneE164: string;
  evidenceId: string;
  ok: boolean;
  providerSid: string | null;
}): Promise<void> {
  const db = supabase();
  if (!db) return;
  const filter =
    `phone_e164=eq.${encodeURIComponent(input.phoneE164)}` +
    `&claimed_evidence_id=eq.${encodeURIComponent(input.evidenceId)}` +
    '&send_status=eq.claimed';
  try {
    const res = await fetch(`${db.url}/rest/v1/sms_phone_state?${filter}`, {
      method: 'PATCH',
      headers: {
        ...authHeaders(db.key),
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        send_status: input.ok ? 'accepted' : 'failed',
        provider_sid: input.ok ? input.providerSid : null,
        updated_at: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(RPC_TIMEOUT_MS),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error('sms enrollment finish failed', { status: res.status, body: text });
    }
  } catch (err) {
    console.error('sms enrollment finish error', err);
  }
}

export type CustomerSmsGate =
  | { allowed: true; phone: string }
  | {
      allowed: false;
      reason: 'disabled' | 'unconfigured' | 'invalid_phone' | 'no_consent' | 'stopped' | 'lookup_failed';
    };

/**
 * Missed-call and review-request customer texts. The shared flag defaults
 * off. A stored consent row that is not stopped is affirmative consent.
 * Owner alerts do not call this.
 */
export async function customerSmsAllowed(phone: string): Promise<CustomerSmsGate> {
  if (!explicitSmsFlagOn(env.smsConsentConfirmationEnabled())) {
    return { allowed: false, reason: 'disabled' };
  }
  const normalized = toE164(phone);
  if (!normalized) return { allowed: false, reason: 'invalid_phone' };
  const db = supabase();
  if (!db) return { allowed: false, reason: 'unconfigured' };
  try {
    const url =
      `${db.url}/rest/v1/sms_phone_state?phone_e164=eq.${encodeURIComponent(normalized)}` +
      '&select=consent,stopped,send_status';
    const res = await fetch(url, {
      method: 'GET',
      headers: authHeaders(db.key),
      signal: AbortSignal.timeout(RPC_TIMEOUT_MS),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error('sms consent lookup failed', { status: res.status, body: text });
      return { allowed: false, reason: 'lookup_failed' };
    }
    const rows = (await res.json().catch(() => null)) as
      | { consent?: unknown; stopped?: unknown }[]
      | null;
    const row = Array.isArray(rows) ? rows[0] : null;
    if (!row) return { allowed: false, reason: 'no_consent' };
    if (row.stopped === true) return { allowed: false, reason: 'stopped' };
    if (row.consent === true) return { allowed: true, phone: normalized };
    return { allowed: false, reason: 'no_consent' };
  } catch (err) {
    console.error('sms consent lookup error', err);
    return { allowed: false, reason: 'lookup_failed' };
  }
}

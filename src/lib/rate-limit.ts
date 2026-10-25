/**
 * Fixed-window rate limiter for the lead-capture API routes.
 *
 * On Vercel, each serverless instance gets its own memory, so a plain
 * in-process Map under-counts whenever traffic fans out across
 * instances (or an instance recycles). When UPSTASH_REDIS_REST_URL +
 * UPSTASH_REDIS_REST_TOKEN are set, counting happens in Redis via the
 * Upstash REST API so the limit holds globally. Without those vars the
 * limiter falls back to the in-memory Map — same behavior as before.
 *
 * Redis errors fail OPEN: a broken limiter must never block a real
 * lead from reaching the inbox.
 */

import { env } from './env';

export type RateLimitVerdict = {
  allowed: boolean;
  retryAfter: number;
  /** Set when the shared counter could not be read or incremented. */
  counterError?: true;
};

const DAY_MS = 24 * 60 * 60 * 1000;

function upstashCredentials(): { url: string; token: string } | null {
  const url = env.upstashRedisUrl();
  const token = env.upstashRedisToken();
  if (!url || !token) return null;
  return { url, token };
}

/** True when both Upstash REST vars are set. Read live so tests can toggle it. */
export function isUpstashConfigured(): boolean {
  return upstashCredentials() !== null;
}

/**
 * Vercel production, or a local `next start` that is not a preview deploy.
 * Preview (VERCEL_ENV=preview) keeps today's in-memory behavior.
 */
export function isProductionRuntime(): boolean {
  if (env.vercelEnv() === 'production') return true;
  return process.env.NODE_ENV === 'production' && !env.vercelEnv();
}

const memoryHits = new Map<string, { count: number; resetAt: number }>();

function memoryLimit(key: string, max: number, windowMs: number): RateLimitVerdict {
  const now = Date.now();
  const entry = memoryHits.get(key);
  if (!entry || entry.resetAt < now) {
    memoryHits.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }
  if (entry.count >= max) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }
  entry.count += 1;
  return { allowed: true, retryAfter: 0 };
}

async function upstashLimit(
  url: string,
  token: string,
  key: string,
  max: number,
  windowMs: number
): Promise<RateLimitVerdict> {
  // One pipeline round-trip: bump the counter, start the window on
  // first hit (NX = only when no TTL exists yet), read time remaining.
  const res = await fetch(`${url}/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([
      ['INCR', key],
      ['PEXPIRE', key, windowMs, 'NX'],
      ['PTTL', key],
    ]),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Upstash responded ${res.status}`);

  // Upstash answers HTTP 200 even when a command fails; each entry is then
  // { error } instead of { result }. Treat anything but a numeric INCR result
  // as an unreadable counter rather than as zero hits.
  const results = (await res.json().catch(() => null)) as
    | { result?: unknown; error?: unknown }[]
    | null;
  if (!Array.isArray(results)) throw new Error('Upstash returned a non-array pipeline body');
  const failed = results.find((entry) => entry && entry.error !== undefined);
  if (failed) throw new Error('Upstash pipeline command failed');
  const count = results[0]?.result;
  if (typeof count !== 'number' || !Number.isFinite(count)) {
    throw new Error('Upstash INCR result missing');
  }
  const ttlRaw = results[2]?.result;
  const ttlMs = typeof ttlRaw === 'number' && ttlRaw > 0 ? ttlRaw : windowMs;

  if (count > max) {
    return { allowed: false, retryAfter: Math.max(1, Math.ceil(ttlMs / 1000)) };
  }
  return { allowed: true, retryAfter: 0 };
}

/**
 * Returns whether a request identified by `key` is within `max` hits
 * per `windowMs`. Namespace the key per route, e.g. `estimate:<ip>`.
 *
 * On an Upstash failure the default is to fail OPEN (the per-IP lead limit
 * must never block a real lead). Pass `{ failClosed: true }` for optional
 * outbound messages: the verdict is then `allowed: false, counterError`.
 */
export async function rateLimit(
  key: string,
  max: number,
  windowMs: number,
  opts: { failClosed?: boolean } = {}
): Promise<RateLimitVerdict> {
  const creds = upstashCredentials();
  if (creds) {
    try {
      return await upstashLimit(creds.url, creds.token, key, max, windowMs);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (opts.failClosed) {
        console.error(`rate-limit: Upstash counter unavailable, failing closed: ${message}`);
        return { allowed: false, retryAfter: 0, counterError: true };
      }
      console.error(`rate-limit: Upstash unavailable, failing open: ${message}`);
      return { allowed: true, retryAfter: 0 };
    }
  }
  return memoryLimit(key, max, windowMs);
}

export type OutboundDecision = {
  send: boolean;
  reason?: 'upstash-unset' | 'counter-error' | 'email' | 'phone' | 'daily';
};

export function normalizeConfirmEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function normalizeConfirmPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('1')) return digits.slice(1);
  return digits;
}

function capFromEnv(raw: string | undefined, fallback: number): number {
  if (raw === undefined || raw.trim() === '') return fallback;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1) return fallback;
  return n;
}

/**
 * One fail-closed counter check for an optional outbound message. A counter
 * that cannot be read or incremented skips the message (the lead itself is
 * still accepted by the caller).
 */
async function outboundGate(
  key: string,
  max: number,
  label: string,
  reason: 'email' | 'phone' | 'daily'
): Promise<OutboundDecision> {
  const hit = await rateLimit(key, max, DAY_MS, { failClosed: true });
  if (hit.counterError) {
    console.warn(`estimate: ${label} skipped; cap counter unavailable`);
    return { send: false, reason: 'counter-error' };
  }
  if (!hit.allowed) {
    console.warn(`estimate: ${label} skipped; ${reason} cap reached`);
    return { send: false, reason };
  }
  return { send: true };
}

/**
 * Customer confirmation gate.
 * In production with Upstash unset, skip the confirmation (owner email,
 * owner SMS, and the lead webhook still go out). Otherwise enforce
 * 1 per normalized email per 24h, 1 per normalized phone per 24h, and
 * a global daily cap (ESTIMATE_CONFIRM_DAILY_CAP, default 150).
 * Over a cap: skip only this message. The lead is still accepted.
 */
export async function reserveCustomerConfirmation(
  email: string,
  phone: string
): Promise<OutboundDecision> {
  if (isProductionRuntime() && !isUpstashConfigured()) {
    console.warn(
      'estimate: UPSTASH_REDIS_REST_URL/TOKEN unset in production; skipping customer confirmation email'
    );
    return { send: false, reason: 'upstash-unset' };
  }

  const checks: [string, number, 'email' | 'phone' | 'daily'][] = [
    [`estimate:confirm:email:${normalizeConfirmEmail(email)}`, 1, 'email'],
    [`estimate:confirm:phone:${normalizeConfirmPhone(phone)}`, 1, 'phone'],
    ['estimate:confirm:daily', capFromEnv(env.estimateConfirmDailyCap(), 150), 'daily'],
  ];
  for (const [key, max, reason] of checks) {
    const decision = await outboundGate(key, max, 'customer confirmation', reason);
    if (!decision.send) return decision;
  }

  return { send: true };
}

/**
 * Owner SMS gate. Global daily cap (ESTIMATE_SMS_DAILY_CAP, default 40)
 * when a shared counter exists. In production with Upstash unset the SMS
 * still goes out: a per-instance counter must not drop a real alert.
 */
export async function reserveOwnerSms(): Promise<OutboundDecision> {
  if (isProductionRuntime() && !isUpstashConfigured()) {
    return { send: true };
  }

  return outboundGate(
    'estimate:sms:daily',
    capFromEnv(env.estimateSmsDailyCap(), 40),
    'owner SMS',
    'daily'
  );
}

/** Best-effort client IP from proxy headers (Vercel sets x-forwarded-for). */
export function getClientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

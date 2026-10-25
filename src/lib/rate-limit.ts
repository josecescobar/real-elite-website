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

export type RateLimitVerdict = { allowed: boolean; retryAfter: number };

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

  const results = (await res.json()) as { result: number }[];
  const count = results[0]?.result ?? 0;
  const ttlMs = results[2]?.result ?? windowMs;

  if (count > max) {
    return { allowed: false, retryAfter: Math.max(1, Math.ceil(ttlMs / 1000)) };
  }
  return { allowed: true, retryAfter: 0 };
}

/**
 * Returns whether a request identified by `key` is within `max` hits
 * per `windowMs`. Namespace the key per route, e.g. `estimate:<ip>`.
 */
export async function rateLimit(
  key: string,
  max: number,
  windowMs: number
): Promise<RateLimitVerdict> {
  const creds = upstashCredentials();
  if (creds) {
    try {
      return await upstashLimit(creds.url, creds.token, key, max, windowMs);
    } catch (err) {
      console.error('rate-limit: Upstash unavailable, failing open:', err);
      return { allowed: true, retryAfter: 0 };
    }
  }
  return memoryLimit(key, max, windowMs);
}

export type OutboundDecision = {
  send: boolean;
  reason?: 'upstash-unset' | 'email' | 'phone' | 'daily';
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

  const emailHit = await rateLimit(
    `estimate:confirm:email:${normalizeConfirmEmail(email)}`,
    1,
    DAY_MS
  );
  if (!emailHit.allowed) {
    console.warn('estimate: customer confirmation skipped; email cap reached');
    return { send: false, reason: 'email' };
  }

  const phoneHit = await rateLimit(
    `estimate:confirm:phone:${normalizeConfirmPhone(phone)}`,
    1,
    DAY_MS
  );
  if (!phoneHit.allowed) {
    console.warn('estimate: customer confirmation skipped; phone cap reached');
    return { send: false, reason: 'phone' };
  }

  const dailyCap = capFromEnv(env.estimateConfirmDailyCap(), 150);
  const dailyHit = await rateLimit('estimate:confirm:daily', dailyCap, DAY_MS);
  if (!dailyHit.allowed) {
    console.warn('estimate: customer confirmation skipped; daily cap reached');
    return { send: false, reason: 'daily' };
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

  const dailyCap = capFromEnv(env.estimateSmsDailyCap(), 40);
  const hit = await rateLimit('estimate:sms:daily', dailyCap, DAY_MS);
  if (!hit.allowed) {
    console.warn('estimate: owner SMS skipped; daily cap reached');
    return { send: false, reason: 'daily' };
  }
  return { send: true };
}

/** Best-effort client IP from proxy headers (Vercel sets x-forwarded-for). */
export function getClientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

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

const UPSTASH_URL = env.upstashRedisUrl();
const UPSTASH_TOKEN = env.upstashRedisToken();

export type RateLimitVerdict = { allowed: boolean; retryAfter: number };

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
  key: string,
  max: number,
  windowMs: number
): Promise<RateLimitVerdict> {
  // One pipeline round-trip: bump the counter, start the window on
  // first hit (NX = only when no TTL exists yet), read time remaining.
  const res = await fetch(`${UPSTASH_URL}/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
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
  if (UPSTASH_URL && UPSTASH_TOKEN) {
    try {
      return await upstashLimit(key, max, windowMs);
    } catch (err) {
      console.error('rate-limit: Upstash unavailable, failing open:', err);
      return { allowed: true, retryAfter: 0 };
    }
  }
  return memoryLimit(key, max, windowMs);
}

/** Best-effort client IP from proxy headers (Vercel sets x-forwarded-for). */
export function getClientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

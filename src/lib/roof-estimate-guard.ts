/**
 * Address cache and global daily cap for /api/roof-estimate Google calls.
 *
 * Cache: Upstash when configured (7-day TTL). In-memory only outside
 * production, so a dev machine still dedupes without Redis. Production
 * without Upstash does not keep a per-instance cache.
 *
 * Cap: ROOF_ESTIMATE_DAILY_CAP (default 300) counts each Google HTTP call.
 * A full measurement is one Geocoding call plus one Solar call. A
 * definitive not-found stops after Geocoding and counts one. Cache hits
 * count zero. In production without Upstash the shared counter does not
 * exist, so the route must not call Google, but the homeowner still
 * continues to the manual questions.
 */

import { env } from './env';
import { isProductionRuntime, isUpstashConfigured, rateLimit } from './rate-limit';

export const ROOF_CACHE_TTL_SECONDS = 7 * 24 * 60 * 60;
export const ROOF_ESTIMATE_DAILY_CAP_DEFAULT = 300;

const DAY_MS = 24 * 60 * 60 * 1000;
const DAILY_KEY = 'roof:google:daily';

export type CachedRoofResult =
  | { covered: true; squares: number; formattedAddress: string }
  | { covered: false; reason: 'address_not_found' | 'no_roof_data' };

type MemoryEntry = { json: string; expiresAt: number };

const memoryCache = new Map<string, MemoryEntry>();

export function normalizeRoofAddress(address: string): string {
  return address.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function roofEstimateDailyCap(): number {
  const raw = env.roofEstimateDailyCap();
  if (raw === undefined || raw.trim() === '') return ROOF_ESTIMATE_DAILY_CAP_DEFAULT;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1) return ROOF_ESTIMATE_DAILY_CAP_DEFAULT;
  return n;
}

function cacheKey(address: string): string {
  return `roof:cache:${normalizeRoofAddress(address)}`;
}

function memoryGet(key: string): string | null {
  const hit = memoryCache.get(key);
  if (!hit) return null;
  if (hit.expiresAt <= Date.now()) {
    memoryCache.delete(key);
    return null;
  }
  return hit.json;
}

async function upstashCommand(command: unknown[]): Promise<unknown> {
  const url = env.upstashRedisUrl();
  const token = env.upstashRedisToken();
  if (!url || !token) throw new Error('Upstash is not configured');
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Upstash responded ${res.status}`);
  const data = (await res.json().catch(() => null)) as { result?: unknown; error?: unknown } | null;
  if (!data || typeof data !== 'object' || data.error !== undefined) {
    throw new Error('Upstash command failed');
  }
  return data.result;
}

function parseCached(raw: string): CachedRoofResult | null {
  try {
    const parsed = JSON.parse(raw) as CachedRoofResult;
    if (
      parsed?.covered === true &&
      typeof parsed.squares === 'number' &&
      Number.isFinite(parsed.squares) &&
      typeof parsed.formattedAddress === 'string'
    ) {
      return parsed;
    }
    if (
      parsed?.covered === false &&
      (parsed.reason === 'address_not_found' || parsed.reason === 'no_roof_data')
    ) {
      return parsed;
    }
  } catch {
    return null;
  }
  return null;
}

export async function readRoofCache(address: string): Promise<CachedRoofResult | null> {
  const key = cacheKey(address);
  let raw: string | null = null;
  if (isUpstashConfigured()) {
    try {
      const result = await upstashCommand(['GET', key]);
      raw = typeof result === 'string' ? result : null;
    } catch {
      console.error('roof-estimate: cache read failed');
      return null;
    }
  } else if (!isProductionRuntime()) {
    raw = memoryGet(key);
  }
  return raw ? parseCached(raw) : null;
}

export async function writeRoofCache(address: string, result: CachedRoofResult): Promise<void> {
  const key = cacheKey(address);
  const json = JSON.stringify(result);
  if (isUpstashConfigured()) {
    try {
      await upstashCommand(['SET', key, json, 'EX', ROOF_CACHE_TTL_SECONDS]);
    } catch {
      console.error('roof-estimate: cache write failed');
    }
    return;
  }
  if (!isProductionRuntime()) {
    memoryCache.set(key, { json, expiresAt: Date.now() + ROOF_CACHE_TTL_SECONDS * 1000 });
  }
}

export type RoofGoogleReservation =
  | { allowed: true }
  | { allowed: false; reason: 'cap_reached' | 'counter_unavailable' };

/**
 * Reserve one Google HTTP call. Call this immediately before each
 * Geocoding or Solar fetch. Cache hits must not call this.
 *
 * `allowed: false` means skip Google. The route still returns
 * `covered: false` so the manual quote can continue.
 */
export async function reserveRoofGoogleCall(): Promise<RoofGoogleReservation> {
  if (isProductionRuntime() && !isUpstashConfigured()) {
    console.warn(
      'roof-estimate: UPSTASH_REDIS_REST_URL/TOKEN unset in production; skipping Google calls'
    );
    return { allowed: false, reason: 'counter_unavailable' };
  }

  const hit = await rateLimit(DAILY_KEY, roofEstimateDailyCap(), DAY_MS, { failClosed: true });
  if (hit.counterError) return { allowed: false, reason: 'counter_unavailable' };
  if (!hit.allowed) return { allowed: false, reason: 'cap_reached' };
  return { allowed: true };
}

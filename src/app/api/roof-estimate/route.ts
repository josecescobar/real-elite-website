import { NextResponse } from 'next/server';
import { squaresFromAreaMeters2 } from '@/lib/roof-estimate';
import { env } from '@/lib/env';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { verifyTurnstile } from '@/lib/turnstile';
import {
  readRoofCache,
  reserveRoofGoogleCall,
  writeRoofCache,
  type CachedRoofResult,
} from '@/lib/roof-estimate-guard';

/**
 * Roof measurement endpoint.
 *
 * Geocodes a US street address, then asks the Google Solar API for the
 * building's roof area and converts it to roofing squares.
 *
 * Env-gated: without GOOGLE_SOLAR_API_KEY (or when an address has no Solar
 * coverage) it returns `{ covered: false }` so the UI falls back to a few
 * quick questions instead. Nothing 500s.
 *
 * Turnstile matches /api/estimate: inert when TURNSTILE_SECRET_KEY is unset.
 * Repeated addresses are cached (Upstash, 7 days; in-memory in dev only).
 * Only definitive not-found / no-coverage results are cached. Upstream
 * 429/5xx responses, and a Solar HTTP 200 that is not valid JSON, not a
 * building-insights envelope, or carries a negative / non-finite roof
 * area, are not. The daily cap (ROOF_ESTIMATE_DAILY_CAP,
 * default 300) counts each Google HTTP call: Geocoding, then Solar.
 * Over the cap, or in production without Upstash, Google is skipped and
 * the response is covered:false so the manual quote can continue.
 */

const RATE_LIMIT = { max: 12, windowMs: 10 * 60 * 1000 };

type Result =
  | { covered: true; squares: number; formattedAddress: string }
  | {
      covered: false;
      reason:
        | 'not_configured'
        | 'address_not_found'
        | 'no_roof_data'
        | 'error'
        | 'cap_reached'
        | 'counter_unavailable';
    };

function manualContinue(reason: 'cap_reached' | 'counter_unavailable' | 'error') {
  return NextResponse.json({ covered: false, reason } satisfies Result);
}

/** Google 429/5xx is a temporary outage, not a fact about this address. */
function isTransientHttp(status: number): boolean {
  return status === 429 || status >= 500;
}

/**
 * Roof area from a Solar building-insights body.
 * `undefined` means the body is not a valid envelope (do not cache).
 * A finite number at or above zero is a real measurement; zero is
 * definitive no coverage. A negative, NaN, or non-finite area is a
 * malformed answer, not a fact about this address.
 */
function solarRoofAreaMeters2(body: unknown): number | undefined {
  if (!body || typeof body !== 'object') return undefined;
  const stats = (body as { solarPotential?: { wholeRoofStats?: { areaMeters2?: unknown } } })
    .solarPotential?.wholeRoofStats;
  const area = stats?.areaMeters2;
  if (typeof area !== 'number' || !Number.isFinite(area) || area < 0) return undefined;
  return area;
}

/**
 * True only for Google's structured NOT_FOUND body. A proxy or HTML 404
 * says nothing about this address, so it must not be cached.
 */
function isSolarNotFoundBody(body: unknown): boolean {
  if (!body || typeof body !== 'object') return false;
  const error = (body as { error?: { code?: unknown; status?: unknown } }).error;
  return error?.code === 404 && error?.status === 'NOT_FOUND';
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);

    const limit = await rateLimit(`roof:${ip}`, RATE_LIMIT.max, RATE_LIMIT.windowMs);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } }
      );
    }

    const body = await request.json().catch(() => null);
    const address = typeof body?.address === 'string' ? body.address.trim() : '';
    if (address.length < 5 || address.length > 200) {
      return NextResponse.json(
        { error: 'Please enter a full street address.' },
        { status: 400 }
      );
    }

    const turnstile = await verifyTurnstile(
      typeof body?.turnstileToken === 'string' ? body.turnstileToken : undefined,
      ip
    );
    if (!turnstile.ok) {
      return NextResponse.json(
        { error: 'Verification failed. Please try again.' },
        { status: 400 }
      );
    }

    const solarKey = env.googleSolarApiKey();
    // No key configured — UI falls back to the quick-question flow.
    if (!solarKey) {
      return NextResponse.json({ covered: false, reason: 'not_configured' } satisfies Result);
    }

    const cached = await readRoofCache(address);
    if (cached) {
      return NextResponse.json(cached satisfies Result);
    }

    const geoSlot = await reserveRoofGoogleCall();
    if (!geoSlot.allowed) {
      return manualContinue(geoSlot.reason);
    }

    // 1. Geocode the address to lat/lng.
    const geoUrl =
      'https://maps.googleapis.com/maps/api/geocode/json' +
      `?address=${encodeURIComponent(address)}&components=country:US&key=${solarKey}`;
    const geoRes = await fetch(geoUrl);
    if (isTransientHttp(geoRes.status)) {
      return manualContinue('error');
    }
    const geo = await geoRes.json().catch(() => null);
    const place = geo?.results?.[0];
    if (geo?.status === 'ZERO_RESULTS') {
      const missed: CachedRoofResult = { covered: false, reason: 'address_not_found' };
      await writeRoofCache(address, missed);
      return NextResponse.json(missed satisfies Result);
    }
    if (geo?.status !== 'OK' || !place?.geometry?.location) {
      return manualContinue('error');
    }
    const { lat, lng } = place.geometry.location as { lat: number; lng: number };
    const formattedAddress: string = place.formatted_address ?? address;

    const solarSlot = await reserveRoofGoogleCall();
    if (!solarSlot.allowed) {
      return manualContinue(solarSlot.reason);
    }

    // 2. Ask the Solar API for this building's roof.
    const solarUrl =
      'https://solar.googleapis.com/v1/buildingInsights:findClosest' +
      `?location.latitude=${lat}&location.longitude=${lng}&key=${solarKey}`;
    const solarRes = await fetch(solarUrl);
    if (isTransientHttp(solarRes.status)) {
      return manualContinue('error');
    }
    if (solarRes.status === 404) {
      const notFound = await solarRes.json().catch(() => null);
      if (!isSolarNotFoundBody(notFound)) {
        return manualContinue('error');
      }
      const missed: CachedRoofResult = { covered: false, reason: 'no_roof_data' };
      await writeRoofCache(address, missed);
      return NextResponse.json(missed satisfies Result);
    }
    if (!solarRes.ok) {
      return manualContinue('error');
    }
    let solar: unknown;
    try {
      solar = await solarRes.json();
    } catch {
      return manualContinue('error');
    }
    const areaM2 = solarRoofAreaMeters2(solar);
    if (areaM2 === undefined) {
      return manualContinue('error');
    }
    if (areaM2 === 0) {
      const missed: CachedRoofResult = { covered: false, reason: 'no_roof_data' };
      await writeRoofCache(address, missed);
      return NextResponse.json(missed satisfies Result);
    }

    const measured: CachedRoofResult = {
      covered: true,
      squares: squaresFromAreaMeters2(areaM2),
      formattedAddress,
    };
    await writeRoofCache(address, measured);
    return NextResponse.json(measured satisfies Result);
  } catch (error) {
    console.error('roof-estimate error:', error);
    return NextResponse.json({ covered: false, reason: 'error' } satisfies Result);
  }
}

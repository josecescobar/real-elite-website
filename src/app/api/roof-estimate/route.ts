import { NextResponse } from 'next/server';
import { squaresFromAreaMeters2 } from '@/lib/roof-estimate';
import { env } from '@/lib/env';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { verifyTurnstile } from '@/lib/turnstile';
import { BUSINESS } from '@/lib/constants';
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
 * Google calls share a daily cap (ROOF_ESTIMATE_DAILY_CAP, default 300).
 */

const RATE_LIMIT = { max: 12, windowMs: 10 * 60 * 1000 };

type Result =
  | { covered: true; squares: number; formattedAddress: string }
  | {
      covered: false;
      reason: 'not_configured' | 'address_not_found' | 'no_roof_data' | 'error';
    };

function callUsResponse() {
  return NextResponse.json(
    {
      error: `We've reached today's roof measurement limit. Call ${BUSINESS.phone} and we'll measure it with you.`,
    },
    { status: 429 }
  );
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

    const reservation = await reserveRoofGoogleCall();
    if (!reservation.allowed) {
      return callUsResponse();
    }

    // 1. Geocode the address to lat/lng.
    const geoUrl =
      'https://maps.googleapis.com/maps/api/geocode/json' +
      `?address=${encodeURIComponent(address)}&components=country:US&key=${solarKey}`;
    const geoRes = await fetch(geoUrl);
    const geo = await geoRes.json().catch(() => null);
    const place = geo?.results?.[0];
    if (geo?.status !== 'OK' || !place?.geometry?.location) {
      const missed: CachedRoofResult = { covered: false, reason: 'address_not_found' };
      await writeRoofCache(address, missed);
      return NextResponse.json(missed satisfies Result);
    }
    const { lat, lng } = place.geometry.location as { lat: number; lng: number };
    const formattedAddress: string = place.formatted_address ?? address;

    // 2. Ask the Solar API for this building's roof.
    const solarUrl =
      'https://solar.googleapis.com/v1/buildingInsights:findClosest' +
      `?location.latitude=${lat}&location.longitude=${lng}&key=${solarKey}`;
    const solarRes = await fetch(solarUrl);
    if (!solarRes.ok) {
      const missed: CachedRoofResult = { covered: false, reason: 'no_roof_data' };
      await writeRoofCache(address, missed);
      return NextResponse.json(missed satisfies Result);
    }
    const solar = await solarRes.json().catch(() => null);
    const areaM2: number | undefined = solar?.solarPotential?.wholeRoofStats?.areaMeters2;
    if (!areaM2 || areaM2 <= 0) {
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

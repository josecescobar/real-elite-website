import { NextResponse } from 'next/server';
import { squaresFromAreaMeters2 } from '@/lib/roof-estimate';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

/**
 * Roof measurement endpoint.
 *
 * Geocodes a US street address, then asks the Google Solar API for the
 * building's roof area and converts it to roofing squares.
 *
 * Env-gated: without GOOGLE_SOLAR_API_KEY (or when an address has no Solar
 * coverage) it returns `{ covered: false }` so the UI falls back to a few
 * quick questions instead. Nothing 500s.
 */

const SOLAR_KEY = process.env.GOOGLE_SOLAR_API_KEY;

const RATE_LIMIT = { max: 12, windowMs: 10 * 60 * 1000 };

type Result =
  | { covered: true; squares: number; formattedAddress: string }
  | {
      covered: false;
      reason: 'not_configured' | 'address_not_found' | 'no_roof_data' | 'error';
    };

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

    // No key configured — UI falls back to the quick-question flow.
    if (!SOLAR_KEY) {
      return NextResponse.json({ covered: false, reason: 'not_configured' } satisfies Result);
    }

    // 1. Geocode the address to lat/lng.
    const geoUrl =
      'https://maps.googleapis.com/maps/api/geocode/json' +
      `?address=${encodeURIComponent(address)}&components=country:US&key=${SOLAR_KEY}`;
    const geoRes = await fetch(geoUrl);
    const geo = await geoRes.json().catch(() => null);
    const place = geo?.results?.[0];
    if (geo?.status !== 'OK' || !place?.geometry?.location) {
      return NextResponse.json({ covered: false, reason: 'address_not_found' } satisfies Result);
    }
    const { lat, lng } = place.geometry.location as { lat: number; lng: number };
    const formattedAddress: string = place.formatted_address ?? address;

    // 2. Ask the Solar API for this building's roof.
    const solarUrl =
      'https://solar.googleapis.com/v1/buildingInsights:findClosest' +
      `?location.latitude=${lat}&location.longitude=${lng}&key=${SOLAR_KEY}`;
    const solarRes = await fetch(solarUrl);
    if (!solarRes.ok) {
      return NextResponse.json({ covered: false, reason: 'no_roof_data' } satisfies Result);
    }
    const solar = await solarRes.json().catch(() => null);
    const areaM2: number | undefined = solar?.solarPotential?.wholeRoofStats?.areaMeters2;
    if (!areaM2 || areaM2 <= 0) {
      return NextResponse.json({ covered: false, reason: 'no_roof_data' } satisfies Result);
    }

    return NextResponse.json({
      covered: true,
      squares: squaresFromAreaMeters2(areaM2),
      formattedAddress,
    } satisfies Result);
  } catch (error) {
    console.error('roof-estimate error:', error);
    return NextResponse.json({ covered: false, reason: 'error' } satisfies Result);
  }
}

import { NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

/**
 * Satellite view of the roof `/api/roof-estimate` just measured.
 *
 * This is a **proxy on purpose.** The obvious implementation — pointing an
 * `<img src>` straight at Google Static Maps — would ship the API key to every
 * visitor's browser, where anyone can lift it and bill our project. Fetching
 * server-side keeps the key here, and has the side benefit of making the image
 * same-origin, so it needs no `img-src` entry in the CSP.
 *
 * Env-gated and fail-soft, matching `/api/roof-estimate`: with no key, no
 * Static Maps entitlement on the key, or any upstream error, this answers 204
 * and the quote tool simply renders no image. The estimate itself never
 * depends on it.
 *
 * NOTE FOR THE OWNER: Google Static Maps is billed per request. Until the
 * Static Maps API is enabled on the same key that powers the Solar lookup,
 * this route returns 204 and the feature stays dark — so enabling it is a
 * deliberate, cost-aware choice rather than something that silently starts
 * charging.
 */

const KEY = env.googleSolarApiKey();

/** Tighter than the estimate limit: one quote can pull a couple of images. */
const RATE_LIMIT = { max: 24, windowMs: 10 * 60 * 1000 };

/** Zoom 20 frames a typical residential lot; 640x400 is the free tier's max edge. */
const ZOOM = 20;
const SIZE = '640x400';

function parseCoord(raw: string | null, max: number): number | null {
  if (!raw) return null;
  const n = Number(raw);
  if (!Number.isFinite(n) || Math.abs(n) > max) return null;
  return n;
}

export async function GET(request: Request) {
  if (!KEY) return new NextResponse(null, { status: 204 });

  try {
    const ip = getClientIp(request);
    const limit = await rateLimit(`roofaerial:${ip}`, RATE_LIMIT.max, RATE_LIMIT.windowMs);
    if (!limit.allowed) {
      return new NextResponse(null, {
        status: 429,
        headers: { 'Retry-After': String(limit.retryAfter) },
      });
    }

    const { searchParams } = new URL(request.url);
    const lat = parseCoord(searchParams.get('lat'), 90);
    const lng = parseCoord(searchParams.get('lng'), 180);
    if (lat === null || lng === null) {
      return new NextResponse(null, { status: 400 });
    }

    const url =
      'https://maps.googleapis.com/maps/api/staticmap' +
      `?center=${lat},${lng}&zoom=${ZOOM}&size=${SIZE}&scale=2` +
      `&maptype=satellite&key=${KEY}`;

    const res = await fetch(url);
    // A key without the Static Maps API enabled answers 403 here. That is a
    // configuration state, not an outage — degrade quietly.
    if (!res.ok) return new NextResponse(null, { status: 204 });

    const contentType = res.headers.get('content-type') ?? '';
    if (!contentType.startsWith('image/')) {
      return new NextResponse(null, { status: 204 });
    }

    return new NextResponse(res.body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        // The imagery for a given roof does not change between page loads.
        'Cache-Control': 'private, max-age=86400',
      },
    });
  } catch (error) {
    console.error('roof-aerial error:', error);
    return new NextResponse(null, { status: 204 });
  }
}

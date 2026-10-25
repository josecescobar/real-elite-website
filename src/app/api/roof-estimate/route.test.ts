import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

/**
 * route.ts captures GOOGLE_SOLAR_API_KEY into a const at module-eval time, so
 * each test re-imports the module after setting the env it needs.
 * vi.resetModules() also gives every test a fresh in-memory rate-limit map.
 */
async function loadPOST(
  opts: {
    solarKey?: string | null;
    dailyCap?: string;
    turnstileSecret?: string;
    upstash?: boolean;
    production?: boolean;
  } = {}
) {
  vi.resetModules();
  delete process.env.ROOF_ESTIMATE_DAILY_CAP;
  delete process.env.TURNSTILE_SECRET_KEY;
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.UPSTASH_REDIS_REST_TOKEN;
  delete process.env.VERCEL_ENV;
  if (opts.solarKey === null) {
    delete process.env.GOOGLE_SOLAR_API_KEY;
  } else {
    process.env.GOOGLE_SOLAR_API_KEY = opts.solarKey ?? 'test_solar_key';
  }
  if (opts.dailyCap !== undefined) process.env.ROOF_ESTIMATE_DAILY_CAP = opts.dailyCap;
  if (opts.turnstileSecret) process.env.TURNSTILE_SECRET_KEY = opts.turnstileSecret;
  if (opts.upstash) {
    process.env.UPSTASH_REDIS_REST_URL = 'https://upstash.example';
    process.env.UPSTASH_REDIS_REST_TOKEN = 'token';
  }
  if (opts.production) process.env.VERCEL_ENV = 'production';
  return (await import('@/app/api/roof-estimate/route')).POST;
}

function makeRequest(body: unknown, ip = '203.0.113.1') {
  return new Request('http://localhost/api/roof-estimate', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

const validAddress = { address: '123 Main St, Charleston, WV 25301' };

/** A geocode success followed by a Solar success with the given roof area. */
const SEVEN_DAYS_SECONDS = 7 * 24 * 60 * 60;

function googleCalls(fetchMock: ReturnType<typeof vi.fn>) {
  return fetchMock.mock.calls.filter((call) => String(call[0]).includes('googleapis.com'));
}

/** Geocode + Solar succeed for every Google call. Upstash pipeline and cache commands are honored when present. */
function mockGoogleAndUpstash() {
  const cache = new Map<string, string>();
  const counts = new Map<string, number>();
  const setEx: number[] = [];
  const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    if (url.endsWith('/pipeline')) {
      const commands = JSON.parse(String(init?.body)) as unknown[][];
      const key = String(commands[0]?.[1] ?? '');
      const count = (counts.get(key) ?? 0) + 1;
      counts.set(key, count);
      return Response.json([
        { result: count },
        { result: 1 },
        { result: 86_400_000 },
      ]);
    }
    if (url === 'https://upstash.example') {
      const cmd = JSON.parse(String(init?.body)) as unknown[];
      if (cmd[0] === 'GET') {
        return Response.json({ result: cache.get(String(cmd[1])) ?? null });
      }
      if (cmd[0] === 'SET') {
        setEx.push(Number(cmd[4]));
        cache.set(String(cmd[1]), String(cmd[2]));
        return Response.json({ result: 'OK' });
      }
    }
    if (url.includes('maps.googleapis.com/maps/api/geocode')) {
      return new Response(
        JSON.stringify({
          status: 'OK',
          results: [
            {
              formatted_address: '123 Main St, Charleston, WV 25301, USA',
              geometry: { location: { lat: 38.34, lng: -81.63 } },
            },
          ],
        }),
        { status: 200 }
      );
    }
    if (url.includes('solar.googleapis.com')) {
      return new Response(
        JSON.stringify({ solarPotential: { wholeRoofStats: { areaMeters2: 200 } } }),
        { status: 200 }
      );
    }
    throw new Error(`unexpected fetch ${url}`);
  });
  vi.stubGlobal('fetch', fetchMock);
  return { fetchMock, setEx };
}

function mockGeoThenSolar(areaMeters2: number) {
  const fetchMock = vi
    .fn()
    .mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          status: 'OK',
          results: [
            {
              formatted_address: '123 Main St, Charleston, WV 25301, USA',
              geometry: { location: { lat: 38.34, lng: -81.63 } },
            },
          ],
        }),
        { status: 200 }
      )
    )
    .mockResolvedValueOnce(
      new Response(
        JSON.stringify({ solarPotential: { wholeRoofStats: { areaMeters2 } } }),
        { status: 200 }
      )
    );
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  delete process.env.GOOGLE_SOLAR_API_KEY;
  delete process.env.ROOF_ESTIMATE_DAILY_CAP;
  delete process.env.TURNSTILE_SECRET_KEY;
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.UPSTASH_REDIS_REST_TOKEN;
  delete process.env.VERCEL_ENV;
});

describe('POST /api/roof-estimate — validation', () => {
  it('rejects a too-short address with 400', async () => {
    const POST = await loadPOST();
    const res = await POST(makeRequest({ address: '123' }, '203.0.113.10'));
    expect(res.status).toBe(400);
  });

  it('rejects a missing address with 400', async () => {
    const POST = await loadPOST();
    const res = await POST(makeRequest({}, '203.0.113.11'));
    expect(res.status).toBe(400);
  });

  it('returns 500-safe (covered:false error) when the body is not JSON', async () => {
    // body parse fails → address = '' → 400 (the catch is only for thrown errors)
    const POST = await loadPOST();
    const res = await POST(makeRequest('}{not json', '203.0.113.12'));
    expect(res.status).toBe(400);
  });
});

describe('POST /api/roof-estimate — env gating', () => {
  it('returns covered:false / not_configured when no Solar key is set', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const POST = await loadPOST({ solarKey: null });
    const res = await POST(makeRequest(validAddress, '203.0.113.20'));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ covered: false, reason: 'not_configured' });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('POST /api/roof-estimate — geocode + solar pipeline', () => {
  it('returns squares + formatted address on a fully covered address', async () => {
    mockGeoThenSolar(200);
    const POST = await loadPOST();
    const res = await POST(makeRequest(validAddress, '203.0.113.30'));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.covered).toBe(true);
    expect(json.formattedAddress).toBe('123 Main St, Charleston, WV 25301, USA');
    expect(json.squares).toBeGreaterThan(0);
  });

  it('falls back to address_not_found when geocoding returns no result', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ status: 'ZERO_RESULTS', results: [] }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    const POST = await loadPOST();
    const res = await POST(makeRequest(validAddress, '203.0.113.31'));
    expect(await res.json()).toEqual({ covered: false, reason: 'address_not_found' });
  });

  it('falls back to no_roof_data when the Solar API responds non-OK', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({ status: 'OK', results: [{ geometry: { location: { lat: 1, lng: 2 } } }] }),
          { status: 200 }
        )
      )
      .mockResolvedValueOnce(new Response('not found', { status: 404 }));
    vi.stubGlobal('fetch', fetchMock);
    const POST = await loadPOST();
    const res = await POST(makeRequest(validAddress, '203.0.113.32'));
    expect(await res.json()).toEqual({ covered: false, reason: 'no_roof_data' });
  });

  it('falls back to no_roof_data when Solar returns zero roof area', async () => {
    mockGeoThenSolar(0);
    const POST = await loadPOST();
    const res = await POST(makeRequest(validAddress, '203.0.113.33'));
    expect(await res.json()).toEqual({ covered: false, reason: 'no_roof_data' });
  });

  it('falls back to reason:error when a fetch throws', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('network down'));
    vi.stubGlobal('fetch', fetchMock);
    const POST = await loadPOST();
    const res = await POST(makeRequest(validAddress, '203.0.113.34'));
    expect(await res.json()).toEqual({ covered: false, reason: 'error' });
  });
});

describe('POST /api/roof-estimate — rate limiting', () => {
  it('returns 429 after the per-IP limit (12) is exceeded', async () => {
    const POST = await loadPOST({ solarKey: null }); // not_configured short-circuit keeps it fast
    const ip = '203.0.113.40';
    for (let i = 0; i < 12; i++) {
      expect((await POST(makeRequest(validAddress, ip))).status).toBe(200);
    }
    const blocked = await POST(makeRequest(validAddress, ip));
    expect(blocked.status).toBe(429);
    expect(blocked.headers.get('Retry-After')).toBeTruthy();
  });
});

describe('POST /api/roof-estimate — Turnstile', () => {
  it('rejects a missing token when the secret is set and does not call Google', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const POST = await loadPOST({ turnstileSecret: 'turnstile-secret-do-not-log' });
    const res = await POST(makeRequest(validAddress, '203.0.113.50'));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: 'Verification failed. Please try again.' });
    expect(googleCalls(fetchMock)).toHaveLength(0);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects an invalid token without calling Google', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ success: false }), { status: 200 })
    );
    vi.stubGlobal('fetch', fetchMock);
    const POST = await loadPOST({ turnstileSecret: 'turnstile-secret-do-not-log' });
    const res = await POST(
      makeRequest({ ...validAddress, turnstileToken: 'bad-token' }, '203.0.113.51')
    );
    expect(res.status).toBe(400);
    expect(googleCalls(fetchMock)).toHaveLength(0);
    expect(String(fetchMock.mock.calls[0][0])).toContain('challenges.cloudflare.com');
  });

  it('still measures when TURNSTILE_SECRET_KEY is unset', async () => {
    mockGeoThenSolar(200);
    const POST = await loadPOST();
    const res = await POST(makeRequest(validAddress, '203.0.113.52'));
    expect(res.status).toBe(200);
    expect((await res.json()).covered).toBe(true);
  });
});

describe('POST /api/roof-estimate — address cache', () => {
  it('serves a normalized-address Upstash hit with zero further Google calls and a 7-day TTL', async () => {
    const { fetchMock, setEx } = mockGoogleAndUpstash();
    const POST = await loadPOST({ upstash: true });
    const first = await POST(makeRequest(validAddress, '203.0.113.60'));
    expect(first.status).toBe(200);
    expect(setEx).toEqual([SEVEN_DAYS_SECONDS]);
    expect(googleCalls(fetchMock)).toHaveLength(2);

    const second = await POST(
      makeRequest({ address: '  123   MAIN st, charleston, wv 25301 ' }, '203.0.113.60')
    );
    expect(second.status).toBe(200);
    expect(await second.json()).toMatchObject({ covered: true, squares: expect.any(Number) });
    expect(googleCalls(fetchMock)).toHaveLength(2);
  });

  it('uses an in-memory cache in dev when Upstash is unset', async () => {
    const { fetchMock } = mockGoogleAndUpstash();
    const POST = await loadPOST();
    await POST(makeRequest(validAddress, '203.0.113.61'));
    const second = await POST(
      makeRequest({ address: '123 main st, charleston, wv 25301' }, '203.0.113.61')
    );
    expect(second.status).toBe(200);
    expect((await second.json()).covered).toBe(true);
    expect(googleCalls(fetchMock)).toHaveLength(2);
  });
});

describe('POST /api/roof-estimate — daily Google cap', () => {
  it('counts a Geocoding call and a Solar call, then continues manually', async () => {
    const { fetchMock } = mockGoogleAndUpstash();
    const POST = await loadPOST({ dailyCap: '2' });
    const first = await POST(makeRequest(validAddress, '203.0.113.70'));
    expect(first.status).toBe(200);
    expect((await first.json()).covered).toBe(true);
    expect(googleCalls(fetchMock)).toHaveLength(2);

    const second = await POST(
      makeRequest({ address: '456 Oak Ave, Martinsburg, WV 25401' }, '203.0.113.71')
    );
    expect(second.status).toBe(200);
    expect(await second.json()).toEqual({ covered: false, reason: 'cap_reached' });
    expect(googleCalls(fetchMock)).toHaveLength(2);
  });

  it('does not make the Solar call when only one cap slot remains', async () => {
    const { fetchMock } = mockGoogleAndUpstash();
    const POST = await loadPOST({ dailyCap: '1' });
    const res = await POST(makeRequest(validAddress, '203.0.113.75'));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ covered: false, reason: 'cap_reached' });
    const urls = googleCalls(fetchMock).map((call) => String(call[0]));
    expect(urls).toHaveLength(1);
    expect(urls[0]).toContain('geocode');
    expect(urls.some((url) => url.includes('solar.googleapis.com'))).toBe(false);
  });

  it('does not spend a Google call on a cache hit after the cap is exhausted', async () => {
    const { fetchMock } = mockGoogleAndUpstash();
    const POST = await loadPOST({ dailyCap: '2' });
    expect((await POST(makeRequest(validAddress, '203.0.113.72'))).status).toBe(200);
    const cached = await POST(
      makeRequest({ address: '123 MAIN St, Charleston, WV 25301' }, '203.0.113.73')
    );
    expect(cached.status).toBe(200);
    expect((await cached.json()).covered).toBe(true);
    expect(googleCalls(fetchMock)).toHaveLength(2);

    const blocked = await POST(
      makeRequest({ address: '456 Oak Ave, Martinsburg, WV 25401' }, '203.0.113.76')
    );
    expect(await blocked.json()).toEqual({ covered: false, reason: 'cap_reached' });
    expect(googleCalls(fetchMock)).toHaveLength(2);
  });

  it('does not call Google in production when Upstash is unset, and continues manually', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const POST = await loadPOST({ production: true });
    const res = await POST(makeRequest(validAddress, '203.0.113.74'));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ covered: false, reason: 'counter_unavailable' });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('POST /api/roof-estimate — transient Google errors are not cached', () => {
  const geoOk = () =>
    new Response(
      JSON.stringify({
        status: 'OK',
        results: [
          {
            formatted_address: '123 Main St, Charleston, WV 25301, USA',
            geometry: { location: { lat: 38.34, lng: -81.63 } },
          },
        ],
      }),
      { status: 200 }
    );

  const solarOk = () =>
    new Response(
      JSON.stringify({ solarPotential: { wholeRoofStats: { areaMeters2: 200 } } }),
      { status: 200 }
    );

  it('retries Google after a Geocoding 429 instead of caching a miss', async () => {
    let geoAttempts = 0;
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes('geocode')) {
        geoAttempts += 1;
        if (geoAttempts === 1) return new Response('slow down', { status: 429 });
        return geoOk();
      }
      if (url.includes('solar.googleapis.com')) return solarOk();
      throw new Error(`unexpected fetch ${url}`);
    });
    vi.stubGlobal('fetch', fetchMock);
    const POST = await loadPOST();
    const first = await POST(makeRequest(validAddress, '203.0.113.80'));
    expect(first.status).toBe(200);
    expect(await first.json()).toEqual({ covered: false, reason: 'error' });

    const second = await POST(makeRequest(validAddress, '203.0.113.81'));
    expect((await second.json()).covered).toBe(true);
    expect(geoAttempts).toBe(2);
    expect(googleCalls(fetchMock)).toHaveLength(3);
  });

  it('retries Google after a Solar 503 instead of caching no coverage', async () => {
    let solarAttempts = 0;
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes('geocode')) return geoOk();
      if (url.includes('solar.googleapis.com')) {
        solarAttempts += 1;
        if (solarAttempts === 1) return new Response('unavailable', { status: 503 });
        return solarOk();
      }
      throw new Error(`unexpected fetch ${url}`);
    });
    vi.stubGlobal('fetch', fetchMock);
    const POST = await loadPOST();
    const first = await POST(makeRequest(validAddress, '203.0.113.82'));
    expect(await first.json()).toEqual({ covered: false, reason: 'error' });

    const second = await POST(makeRequest(validAddress, '203.0.113.83'));
    expect((await second.json()).covered).toBe(true);
    expect(solarAttempts).toBe(2);
    expect(googleCalls(fetchMock)).toHaveLength(4);
  });

  it('does not cache a Geocoding OVER_QUERY_LIMIT status', async () => {
    let geoAttempts = 0;
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes('geocode')) {
        geoAttempts += 1;
        if (geoAttempts === 1) {
          return new Response(JSON.stringify({ status: 'OVER_QUERY_LIMIT', results: [] }), { status: 200 });
        }
        return geoOk();
      }
      if (url.includes('solar.googleapis.com')) return solarOk();
      throw new Error(`unexpected fetch ${url}`);
    });
    vi.stubGlobal('fetch', fetchMock);
    const POST = await loadPOST();
    const first = await POST(makeRequest(validAddress, '203.0.113.84'));
    expect(await first.json()).toEqual({ covered: false, reason: 'error' });
    const second = await POST(makeRequest(validAddress, '203.0.113.85'));
    expect((await second.json()).covered).toBe(true);
    expect(geoAttempts).toBe(2);
  });

  it('caches a definitive ZERO_RESULTS miss', async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes('geocode')) {
        return new Response(JSON.stringify({ status: 'ZERO_RESULTS', results: [] }), { status: 200 });
      }
      throw new Error(`unexpected fetch ${url}`);
    });
    vi.stubGlobal('fetch', fetchMock);
    const POST = await loadPOST();
    const first = await POST(makeRequest(validAddress, '203.0.113.86'));
    expect(await first.json()).toEqual({ covered: false, reason: 'address_not_found' });
    const second = await POST(makeRequest({ address: '123 main st, charleston, wv 25301' }, '203.0.113.87'));
    expect(await second.json()).toEqual({ covered: false, reason: 'address_not_found' });
    expect(googleCalls(fetchMock)).toHaveLength(1);
  });

  it('caches a definitive Solar 404 and does not retry Google', async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes('geocode')) return geoOk();
      if (url.includes('solar.googleapis.com')) return new Response('not found', { status: 404 });
      throw new Error(`unexpected fetch ${url}`);
    });
    vi.stubGlobal('fetch', fetchMock);
    const POST = await loadPOST();
    const first = await POST(makeRequest(validAddress, '203.0.113.88'));
    expect(await first.json()).toEqual({ covered: false, reason: 'no_roof_data' });
    const second = await POST(makeRequest(validAddress, '203.0.113.89'));
    expect(await second.json()).toEqual({ covered: false, reason: 'no_roof_data' });
    expect(googleCalls(fetchMock)).toHaveLength(2);
  });
});

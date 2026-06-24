import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

/**
 * route.ts captures GOOGLE_SOLAR_API_KEY into a const at module-eval time, so
 * each test re-imports the module after setting the env it needs.
 * vi.resetModules() also gives every test a fresh in-memory rate-limit map.
 */
async function loadPOST(opts: { solarKey?: string | null } = {}) {
  vi.resetModules();
  if (opts.solarKey === null) {
    delete process.env.GOOGLE_SOLAR_API_KEY;
  } else {
    process.env.GOOGLE_SOLAR_API_KEY = opts.solarKey ?? 'test_solar_key';
  }
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
    const POST = await loadPOST({ solarKey: null });
    const res = await POST(makeRequest(validAddress, '203.0.113.20'));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ covered: false, reason: 'not_configured' });
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

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

/**
 * Mirrors roof-estimate/route.test.ts: the route captures
 * GOOGLE_SOLAR_API_KEY at module-eval time, so each test re-imports after
 * setting env. vi.resetModules() also hands every test a fresh in-memory
 * rate-limit map.
 */
async function loadGET(opts: { solarKey?: string | null } = {}) {
  vi.resetModules();
  if (opts.solarKey === null) {
    delete process.env.GOOGLE_SOLAR_API_KEY;
  } else {
    process.env.GOOGLE_SOLAR_API_KEY = opts.solarKey ?? 'test_solar_key';
  }
  return (await import('@/app/api/roof-aerial/route')).GET;
}

function makeRequest(query: string, ip = '203.0.113.1') {
  return new Request(`http://localhost/api/roof-aerial${query}`, {
    headers: { 'x-forwarded-for': ip },
  });
}

const OK_QUERY = '?lat=38.34&lng=-81.63';

function stubImageResponse() {
  const fetchMock = vi.fn().mockResolvedValue(
    new Response(new Uint8Array([137, 80, 78, 71]), {
      status: 200,
      headers: { 'content-type': 'image/png' },
    })
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

describe('GET /api/roof-aerial — env gating', () => {
  it('returns 204 with no key, without calling Google', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const GET = await loadGET({ solarKey: null });
    const res = await GET(makeRequest(OK_QUERY, '203.0.113.20'));
    expect(res.status).toBe(204);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('GET /api/roof-aerial — coordinate validation', () => {
  it.each([
    ['missing both', ''],
    ['missing lng', '?lat=38.34'],
    ['non-numeric lat', '?lat=abc&lng=-81.63'],
    ['lat out of range', '?lat=91&lng=-81.63'],
    ['lng out of range', '?lat=38.34&lng=181'],
  ])('rejects %s with 400', async (_label, query) => {
    stubImageResponse();
    const GET = await loadGET();
    const res = await GET(makeRequest(query, '203.0.113.21'));
    expect(res.status).toBe(400);
  });

  it('accepts valid coordinates', async () => {
    stubImageResponse();
    const GET = await loadGET();
    const res = await GET(makeRequest(OK_QUERY, '203.0.113.22'));
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toBe('image/png');
  });
});

describe('GET /api/roof-aerial — key safety', () => {
  it('never puts the API key in the response', async () => {
    stubImageResponse();
    const GET = await loadGET({ solarKey: 'super_secret_key' });
    const res = await GET(makeRequest(OK_QUERY, '203.0.113.23'));
    const body = await res.text();
    expect(body).not.toContain('super_secret_key');
    expect(JSON.stringify([...res.headers])).not.toContain('super_secret_key');
  });

  it('sends the key to Google server-side, not to the client', async () => {
    const fetchMock = stubImageResponse();
    const GET = await loadGET({ solarKey: 'super_secret_key' });
    await GET(makeRequest(OK_QUERY, '203.0.113.24'));
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(String(fetchMock.mock.calls[0][0])).toContain('super_secret_key');
  });
});

describe('GET /api/roof-aerial — fail-soft', () => {
  it('returns 204 when Static Maps is not enabled on the key (403)', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('denied', { status: 403 })));
    const GET = await loadGET();
    const res = await GET(makeRequest(OK_QUERY, '203.0.113.30'));
    expect(res.status).toBe(204);
  });

  it('returns 204 when the upstream answers with a non-image body', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response('{"error":"nope"}', {
          status: 200,
          headers: { 'content-type': 'application/json' },
        })
      )
    );
    const GET = await loadGET();
    const res = await GET(makeRequest(OK_QUERY, '203.0.113.31'));
    expect(res.status).toBe(204);
  });

  it('returns 204 when the fetch throws', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')));
    const GET = await loadGET();
    const res = await GET(makeRequest(OK_QUERY, '203.0.113.32'));
    expect(res.status).toBe(204);
  });
});

describe('GET /api/roof-aerial — rate limiting', () => {
  it('returns 429 after the per-IP limit (24) is exceeded', async () => {
    stubImageResponse();
    const GET = await loadGET();
    const ip = '203.0.113.40';
    for (let i = 0; i < 24; i++) {
      expect((await GET(makeRequest(OK_QUERY, ip))).status).toBe(200);
    }
    const blocked = await GET(makeRequest(OK_QUERY, ip));
    expect(blocked.status).toBe(429);
    expect(blocked.headers.get('Retry-After')).toBeTruthy();
  });
});

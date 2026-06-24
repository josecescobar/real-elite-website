import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

/**
 * route.ts captures ADMIN_TOOLS_KEY and the Twilio vars into consts at
 * module-eval time, so each test re-imports after setting the env it needs.
 * vi.resetModules() also gives every test a fresh in-memory rate-limit map.
 */
const ADMIN_KEY = 'super-secret-admin-key';

async function loadPOST(
  opts: { adminKey?: string | null; twilio?: boolean } = {}
) {
  vi.resetModules();
  if (opts.adminKey === null) {
    delete process.env.ADMIN_TOOLS_KEY;
  } else {
    process.env.ADMIN_TOOLS_KEY = opts.adminKey ?? ADMIN_KEY;
  }
  if (opts.twilio === false) {
    delete process.env.TWILIO_ACCOUNT_SID;
    delete process.env.TWILIO_AUTH_TOKEN;
    delete process.env.TWILIO_FROM_NUMBER;
  } else {
    process.env.TWILIO_ACCOUNT_SID = 'AC_test';
    process.env.TWILIO_AUTH_TOKEN = 'token_test';
    process.env.TWILIO_FROM_NUMBER = '+13045550100';
  }
  return (await import('@/app/api/review-request/route')).POST;
}

function makeRequest(body: unknown, ip = '203.0.113.1') {
  return new Request('http://localhost/api/review-request', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

const validBody = { key: ADMIN_KEY, firstName: 'Dana', phone: '(304) 555-0142' };

function mockTwilioOk() {
  const fetchMock = vi.fn().mockResolvedValue(new Response('{"sid":"SM1"}', { status: 201 }));
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  delete process.env.ADMIN_TOOLS_KEY;
  delete process.env.TWILIO_ACCOUNT_SID;
  delete process.env.TWILIO_AUTH_TOKEN;
  delete process.env.TWILIO_FROM_NUMBER;
});

describe('POST /api/review-request — auth', () => {
  it('returns 503 when ADMIN_TOOLS_KEY is not configured', async () => {
    const POST = await loadPOST({ adminKey: null });
    const res = await POST(makeRequest(validBody, '203.0.113.10'));
    expect(res.status).toBe(503);
  });

  it('rejects a wrong access key with 401 and sends nothing', async () => {
    const fetchMock = mockTwilioOk();
    const POST = await loadPOST();
    const res = await POST(makeRequest({ ...validBody, key: 'wrong-key' }, '203.0.113.11'));
    expect(res.status).toBe(401);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects a missing access key with 401', async () => {
    const POST = await loadPOST();
    const res = await POST(makeRequest({ firstName: 'Dana', phone: '3045550142' }, '203.0.113.12'));
    expect(res.status).toBe(401);
  });
});

describe('POST /api/review-request — validation', () => {
  it('rejects a missing first name with 400', async () => {
    const POST = await loadPOST();
    const res = await POST(makeRequest({ key: ADMIN_KEY, phone: '3045550142' }, '203.0.113.20'));
    expect(res.status).toBe(400);
  });

  it('rejects an over-length first name with 400', async () => {
    const POST = await loadPOST();
    const res = await POST(
      makeRequest({ ...validBody, firstName: 'a'.repeat(41) }, '203.0.113.21')
    );
    expect(res.status).toBe(400);
  });

  it('rejects an invalid phone number with 400', async () => {
    const POST = await loadPOST();
    const res = await POST(makeRequest({ ...validBody, phone: '123' }, '203.0.113.22'));
    expect(res.status).toBe(400);
  });
});

describe('POST /api/review-request — Twilio gating + delivery', () => {
  it('returns 503 when Twilio env vars are absent', async () => {
    const POST = await loadPOST({ twilio: false });
    const res = await POST(makeRequest(validBody, '203.0.113.30'));
    expect(res.status).toBe(503);
  });

  it('sends the SMS and returns a confirmation on success', async () => {
    const fetchMock = mockTwilioOk();
    const POST = await loadPOST();
    const res = await POST(makeRequest(validBody, '203.0.113.31'));
    expect(res.status).toBe(200);
    expect((await res.json()).message).toContain('Dana');
    expect(fetchMock).toHaveBeenCalledOnce();
    // Posts to the Twilio Messages endpoint with the normalized E.164 number.
    expect(fetchMock.mock.calls[0][0]).toContain('api.twilio.com');
    expect((fetchMock.mock.calls[0][1].body as string)).toContain('%2B13045550142');
  });

  it('returns 502 when Twilio rejects the message', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('bad number', { status: 400 }));
    vi.stubGlobal('fetch', fetchMock);
    const POST = await loadPOST();
    const res = await POST(makeRequest(validBody, '203.0.113.32'));
    expect(res.status).toBe(502);
  });
});

describe('POST /api/review-request — rate limiting', () => {
  it('returns 429 after the per-IP limit (30) is exceeded', async () => {
    mockTwilioOk();
    const POST = await loadPOST();
    const ip = '203.0.113.40';
    for (let i = 0; i < 30; i++) {
      expect((await POST(makeRequest(validBody, ip))).status).toBe(200);
    }
    const blocked = await POST(makeRequest(validBody, ip));
    expect(blocked.status).toBe(429);
  });
});

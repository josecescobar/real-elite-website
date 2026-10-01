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

function allowCustomerSms() {
  process.env.SMS_CONSENT_CONFIRMATION_ENABLED = 'true';
  process.env.SUPABASE_URL = 'https://proj.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'service_key';
}

function mockConsent(rows: unknown, twilioStatus = 201) {
  const fetchMock = vi.fn().mockImplementation((url: string) => {
    if (String(url).includes('sms_phone_state')) {
      return Promise.resolve(new Response(JSON.stringify(rows), { status: 200 }));
    }
    const body = twilioStatus === 201 ? '{"sid":"SM1"}' : 'bad number';
    return Promise.resolve(new Response(body, { status: twilioStatus }));
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

function mockTwilioOk() {
  allowCustomerSms();
  return mockConsent([{ consent: true, stopped: false }]);
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
  delete process.env.SMS_CONSENT_CONFIRMATION_ENABLED;
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
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

  it('does not send from the admin key and Twilio credentials alone', async () => {
    const fetchMock = mockConsent([{ consent: true, stopped: false }]);
    const POST = await loadPOST();
    const res = await POST(makeRequest(validBody, '203.0.113.33'));
    expect(res.status).toBe(403);
    expect(fetchMock.mock.calls.some(([url]) => String(url).includes('api.twilio.com'))).toBe(
      false
    );
  });

  it('does not send when the number is stopped', async () => {
    allowCustomerSms();
    const fetchMock = mockConsent([{ consent: true, stopped: true }]);
    const POST = await loadPOST();
    const res = await POST(makeRequest(validBody, '203.0.113.34'));
    expect(res.status).toBe(409);
    expect(fetchMock.mock.calls.some(([url]) => String(url).includes('api.twilio.com'))).toBe(
      false
    );
  });

  it('sends the SMS and returns a confirmation on success', async () => {
    const fetchMock = mockTwilioOk();
    const POST = await loadPOST();
    const res = await POST(makeRequest(validBody, '203.0.113.31'));
    expect(res.status).toBe(200);
    expect((await res.json()).message).toContain('Dana');
    const twilio = fetchMock.mock.calls.filter(([url]) => String(url).includes('api.twilio.com'));
    expect(twilio).toHaveLength(1);
    expect((twilio[0][1].body as string)).toContain('%2B13045550142');
  });

  it('returns 502 when Twilio rejects the message', async () => {
    allowCustomerSms();
    vi.stubGlobal('fetch', mockConsent([{ consent: true, stopped: false }], 400));
    const POST = await loadPOST();
    const res = await POST(makeRequest(validBody, '203.0.113.32'));
    expect(res.status).toBe(502);
  });
});

describe('POST /api/review-request — rate limiting', () => {
  it('returns 429 after the per-IP limit (30) is exceeded', async () => {
    process.env.SMS_CONSENT_CONFIRMATION_ENABLED = 'true';
    process.env.SUPABASE_URL = 'https://proj.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service_key';
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(async (url: string) => {
        if (String(url).includes('sms_phone_state')) {
          return new Response(JSON.stringify([{ consent: true, stopped: false }]), { status: 200 });
        }
        return new Response('{"sid":"SM1"}', { status: 201 });
      })
    );
    const POST = await loadPOST();
    const ip = '203.0.113.40';
    for (let i = 0; i < 30; i++) {
      expect((await POST(makeRequest(validBody, ip))).status).toBe(200);
    }
    const blocked = await POST(makeRequest(validBody, ip));
    expect(blocked.status).toBe(429);
  });
});

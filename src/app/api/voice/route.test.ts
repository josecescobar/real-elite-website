import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createHmac } from 'crypto';

/**
 * The voice webhook reads all Twilio env vars at request time, but pins the
 * signature against the exact webhook URL. We set TWILIO_WEBHOOK_BASE_URL so
 * that URL is deterministic, then sign each request the same way Twilio does:
 * url + each param (sorted by key) as key+value, HMAC-SHA1, base64.
 */
const AUTH_TOKEN = 'test_auth_token';
const BASE_URL = 'https://example.com';
const WEBHOOK_URL = `${BASE_URL}/api/voice`;

function fullConfig() {
  process.env.TWILIO_AUTH_TOKEN = AUTH_TOKEN;
  process.env.TWILIO_ACCOUNT_SID = 'AC_test';
  process.env.TWILIO_FROM_NUMBER = '+13045550100';
  process.env.TWILIO_TO_NUMBER = '+13045559999';
  process.env.TWILIO_WEBHOOK_BASE_URL = BASE_URL;
}

function clearConfig() {
  delete process.env.TWILIO_AUTH_TOKEN;
  delete process.env.TWILIO_ACCOUNT_SID;
  delete process.env.TWILIO_FROM_NUMBER;
  delete process.env.TWILIO_TO_NUMBER;
  delete process.env.MISSED_CALL_FORWARD_NUMBER;
  delete process.env.TWILIO_WEBHOOK_BASE_URL;
  delete process.env.SMS_CONSENT_CONFIRMATION_ENABLED;
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
}

async function loadPOST() {
  vi.resetModules();
  return (await import('@/app/api/voice/route')).POST;
}

function signature(params: Record<string, string>): string {
  const data = Object.keys(params)
    .sort()
    .reduce((acc, key) => acc + key + params[key], WEBHOOK_URL);
  return createHmac('sha1', AUTH_TOKEN).update(Buffer.from(data, 'utf-8')).digest('base64');
}

/** Build a Twilio-style signed form POST. Pass signValid:false to corrupt it. */
function makeRequest(params: Record<string, string>, opts: { signValid?: boolean } = {}) {
  const sig = opts.signValid === false ? 'bad-signature' : signature(params);
  return new Request(WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'x-twilio-signature': sig,
    },
    body: new URLSearchParams(params).toString(),
  });
}

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  clearConfig();
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  clearConfig();
});

describe('POST /api/voice — configuration gate', () => {
  it('rejects the call with 503 when Twilio is not fully configured', async () => {
    // Only the auth token set — SMS vars missing → refuse.
    process.env.TWILIO_AUTH_TOKEN = AUTH_TOKEN;
    process.env.TWILIO_WEBHOOK_BASE_URL = BASE_URL;
    const POST = await loadPOST();
    const res = await POST(makeRequest({ From: '+15555550123', CallSid: 'CA1' }));
    expect(res.status).toBe(503);
    expect(await res.text()).toContain('<Reject');
  });
});

describe('POST /api/voice — signature verification', () => {
  it('rejects an invalid signature with 403', async () => {
    fullConfig();
    const POST = await loadPOST();
    const res = await POST(
      makeRequest({ From: '+15555550123', CallSid: 'CA1' }, { signValid: false })
    );
    expect(res.status).toBe(403);
  });

  it('rejects a missing signature header with 403', async () => {
    fullConfig();
    const POST = await loadPOST();
    const req = new Request(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ From: '+15555550123', CallSid: 'CA1' }).toString(),
    });
    const res = await POST(req);
    expect(res.status).toBe(403);
  });
});

describe('POST /api/voice — first leg (inbound call)', () => {
  it('greets and dials the owner with a valid signature', async () => {
    fullConfig();
    const POST = await loadPOST();
    const res = await POST(makeRequest({ From: '+15555550123', CallSid: 'CA1' }));
    expect(res.status).toBe(200);
    const xml = await res.text();
    expect(xml).toContain('<Say');
    expect(xml).toContain('<Dial');
    expect(xml).toContain('+13045559999'); // forwards to the owner number
  });
});

describe('POST /api/voice — second leg (dial result)', () => {
  function consentRows(rows: unknown) {
    process.env.SMS_CONSENT_CONFIRMATION_ENABLED = 'true';
    process.env.SUPABASE_URL = 'https://proj.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service_key';
    const fetchMock = vi.fn().mockImplementation((url: string) => {
      if (String(url).includes('sms_phone_state')) {
        return Promise.resolve(new Response(JSON.stringify(rows), { status: 200 }));
      }
      return Promise.resolve(new Response('{"sid":"SM1"}', { status: 201 }));
    });
    vi.stubGlobal('fetch', fetchMock);
    return fetchMock;
  }

  function toValues(fetchMock: ReturnType<typeof vi.fn>) {
    return fetchMock.mock.calls
      .filter(([url]) => String(url).includes('api.twilio.com'))
      .map((call) => new URLSearchParams(call[1].body as string).get('To'));
  }

  it('does not text the caller from credentials alone, and still alerts the owner', async () => {
    fullConfig();
    const fetchMock = vi.fn().mockResolvedValue(new Response('{"sid":"SM1"}', { status: 201 }));
    vi.stubGlobal('fetch', fetchMock);
    const POST = await loadPOST();
    const res = await POST(
      makeRequest({ From: '+15555550123', CallSid: 'CA1', DialCallStatus: 'no-answer' })
    );
    expect(res.status).toBe(200);
    expect(toValues(fetchMock)).toEqual(['+13045559999']);
  });

  it('texts the caller only when the flag is on and the confirmation was accepted', async () => {
    fullConfig();
    const fetchMock = consentRows([{ consent: true, stopped: false, send_status: 'accepted' }]);
    const POST = await loadPOST();
    const res = await POST(
      makeRequest({ From: '+15555550123', CallSid: 'CA1', DialCallStatus: 'no-answer' })
    );
    expect(res.status).toBe(200);
    expect(toValues(fetchMock).sort()).toEqual(['+13045559999', '+15555550123']);
  });

  it.each(['claimed', 'failed'])(
    'does not text the caller while enrollment is %s, and still alerts the owner',
    async (send_status) => {
      fullConfig();
      const fetchMock = consentRows([{ consent: true, stopped: false, send_status }]);
      const POST = await loadPOST();
      const res = await POST(
        makeRequest({ From: '+15555550123', CallSid: 'CA1', DialCallStatus: 'no-answer' })
      );
      expect(res.status).toBe(200);
      const customer = fetchMock.mock.calls
        .filter(([url]) => String(url).includes('api.twilio.com'))
        .map((call) => new URLSearchParams(call[1].body as string))
        .filter((params) => params.get('To') === '+15555550123');
      expect(customer).toEqual([]);
      expect(toValues(fetchMock)).toEqual(['+13045559999']);
    }
  );

  it('does not text a stopped caller, and still alerts the owner', async () => {
    fullConfig();
    const fetchMock = consentRows([{ consent: true, stopped: true }]);
    const POST = await loadPOST();
    const res = await POST(
      makeRequest({ From: '+15555550123', CallSid: 'CA1', DialCallStatus: 'no-answer' })
    );
    expect(res.status).toBe(200);
    expect(toValues(fetchMock)).toEqual(['+13045559999']);
  });

  it('sends no SMS when the owner answered', async () => {
    fullConfig();
    const fetchMock = vi.fn().mockResolvedValue(new Response('{}', { status: 201 }));
    vi.stubGlobal('fetch', fetchMock);
    const POST = await loadPOST();
    const res = await POST(
      makeRequest({ From: '+15555550123', CallSid: 'CA1', DialCallStatus: 'completed' })
    );
    expect(res.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

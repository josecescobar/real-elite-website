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
  it('texts the caller back and alerts the owner on a missed call', async () => {
    fullConfig();
    const fetchMock = vi.fn().mockResolvedValue(new Response('{"sid":"SM1"}', { status: 201 }));
    vi.stubGlobal('fetch', fetchMock);
    const POST = await loadPOST();
    const res = await POST(
      makeRequest({ From: '+15555550123', CallSid: 'CA1', DialCallStatus: 'no-answer' })
    );
    expect(res.status).toBe(200);
    // Two SMS sends: caller text-back + owner alert.
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const toNumbers = fetchMock.mock.calls.map((c) => c[1].body as string);
    expect(toNumbers.some((b) => b.includes('%2B15555550123'))).toBe(true); // caller
    expect(toNumbers.some((b) => b.includes('%2B13045559999'))).toBe(true); // owner
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

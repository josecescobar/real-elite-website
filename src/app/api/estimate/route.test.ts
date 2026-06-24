import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

/**
 * route.ts captures RESEND_API_KEY into a const at module-eval time, so each
 * test re-imports the module after setting the env it needs. vi.resetModules()
 * also gives every test a fresh in-memory rate-limit map.
 */
async function loadPOST(opts: { resendKey?: string | null } = {}) {
  vi.resetModules();
  if (opts.resendKey === null) {
    delete process.env.RESEND_API_KEY;
  } else {
    process.env.RESEND_API_KEY = opts.resendKey ?? 'test_resend_key';
  }
  return (await import('@/app/api/estimate/route')).POST;
}

function makeRequest(body: unknown, ip = '203.0.113.1') {
  return new Request('http://localhost/api/estimate', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

const validBody = {
  fullName: 'Jane Homeowner',
  email: 'jane@example.com',
  phone: '(681) 555-0142',
  service: 'Bathroom Remodeling',
};

function mockResendOk() {
  const fetchMock = vi.fn().mockResolvedValue(new Response('{"id":"e1"}', { status: 200 }));
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  delete process.env.RESEND_API_KEY;
});

describe('POST /api/estimate — validation', () => {
  it('rejects a missing required field with 400', async () => {
    const POST = await loadPOST();
    const { fullName, ...noName } = validBody;
    void fullName;
    const res = await POST(makeRequest(noName, '203.0.113.10'));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('Required fields are missing');
  });

  it('rejects a blank (whitespace-only) required field with 400', async () => {
    const POST = await loadPOST();
    const res = await POST(makeRequest({ ...validBody, service: '   ' }, '203.0.113.11'));
    expect(res.status).toBe(400);
  });

  it('rejects an over-length required field with 400', async () => {
    const POST = await loadPOST();
    const res = await POST(
      makeRequest({ ...validBody, fullName: 'a'.repeat(101) }, '203.0.113.12')
    );
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('fullName is too long');
  });

  it('rejects an invalid email with 400', async () => {
    const POST = await loadPOST();
    const res = await POST(makeRequest({ ...validBody, email: 'not-an-email' }, '203.0.113.13'));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('Invalid email address');
  });

  it('rejects an invalid phone with 400', async () => {
    const POST = await loadPOST();
    const res = await POST(makeRequest({ ...validBody, phone: '123' }, '203.0.113.14'));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('Invalid phone number');
  });

  it('rejects an invalid ZIP with 400', async () => {
    const POST = await loadPOST();
    const res = await POST(makeRequest({ ...validBody, zip: 'ABCDE' }, '203.0.113.15'));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('Invalid ZIP code');
  });

  it('rejects an optional field of the wrong type with 400', async () => {
    const POST = await loadPOST();
    const res = await POST(makeRequest({ ...validBody, message: 12345 }, '203.0.113.16'));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('message is invalid');
  });

  it('rejects an over-length optional field with 400', async () => {
    const POST = await loadPOST();
    const res = await POST(
      makeRequest({ ...validBody, message: 'a'.repeat(2001) }, '203.0.113.17')
    );
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('message is too long');
  });

  it('accepts a 5-digit and a ZIP+4 ZIP code', async () => {
    mockResendOk();
    let POST = await loadPOST();
    expect((await POST(makeRequest({ ...validBody, zip: '25401' }, '203.0.113.18'))).status).toBe(
      200
    );
    POST = await loadPOST();
    expect(
      (await POST(makeRequest({ ...validBody, zip: '25401-1234' }, '203.0.113.19'))).status
    ).toBe(200);
  });

  it('returns 500 when the request body is not valid JSON', async () => {
    const POST = await loadPOST();
    const res = await POST(makeRequest('}{not json', '203.0.113.20'));
    expect(res.status).toBe(500);
  });
});

describe('POST /api/estimate — anti-spam', () => {
  it('silently succeeds (200) and sends nothing when the honeypot is filled', async () => {
    const fetchMock = mockResendOk();
    const POST = await loadPOST();
    const res = await POST(
      makeRequest({ ...validBody, website: 'http://spam.example' }, '203.0.113.30')
    );
    expect(res.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rate-limits after 5 requests from the same IP', async () => {
    mockResendOk();
    const POST = await loadPOST();
    const ip = '203.0.113.31';
    for (let i = 0; i < 5; i++) {
      expect((await POST(makeRequest(validBody, ip))).status).toBe(200);
    }
    const blocked = await POST(makeRequest(validBody, ip));
    expect(blocked.status).toBe(429);
    expect(blocked.headers.get('Retry-After')).toBeTruthy();
  });
});

describe('POST /api/estimate — delivery', () => {
  it('returns 503 with a graceful message when RESEND_API_KEY is not configured', async () => {
    const POST = await loadPOST({ resendKey: null });
    const res = await POST(makeRequest(validBody, '203.0.113.40'));
    expect(res.status).toBe(503);
    expect((await res.json()).error).toMatch(/call .*\(681\) 534-5515/i);
  });

  it('returns 500 when the Resend API call fails', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response('{"error":"bad"}', { status: 422 }));
    vi.stubGlobal('fetch', fetchMock);
    const POST = await loadPOST();
    const res = await POST(makeRequest(validBody, '203.0.113.41'));
    expect(res.status).toBe(500);
    expect((await res.json()).error).toBe('Failed to send email');
  });

  it('posts to the Resend API and returns 200 on a valid submission', async () => {
    const fetchMock = mockResendOk();
    const POST = await loadPOST();
    const res = await POST(makeRequest(validBody, '203.0.113.42'));
    expect(res.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock.mock.calls[0][0]).toBe('https://api.resend.com/emails');
  });

  it('HTML-escapes user input in the email body to prevent injection', async () => {
    const fetchMock = mockResendOk();
    const POST = await loadPOST();
    const res = await POST(
      makeRequest(
        {
          ...validBody,
          fullName: '<script>alert(1)</script>',
          message: 'Line one\nLine two & <b>bold</b>',
        },
        '203.0.113.43'
      )
    );
    expect(res.status).toBe(200);
    const sent = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(sent.html).not.toContain('<script>');
    expect(sent.html).toContain('&lt;script&gt;');
    expect(sent.html).toContain('&amp;');
    expect(sent.html).toContain('Line one<br>Line two');
  });
});

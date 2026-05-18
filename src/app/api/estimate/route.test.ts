import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

type FetchMock = ReturnType<typeof vi.fn>;

const VALID_BODY = {
  fullName: 'Jane Homeowner',
  email: 'jane@example.com',
  phone: '(304) 555-0123',
  service: 'roofing',
  message: 'I need a new roof, please send help.',
};

// Each test loads a fresh copy of the route module so the in-memory
// rate-limit Map starts empty.
async function loadRoute() {
  vi.resetModules();
  return await import('./route');
}

function makeRequest(body: unknown, ip = `10.0.0.${Math.floor(Math.random() * 254) + 1}`) {
  return new Request('https://example.com/api/estimate', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-forwarded-for': ip,
    },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

function mockResendOk(): FetchMock {
  const fetchMock = vi.fn(async () =>
    new Response(JSON.stringify({ id: 'mocked' }), { status: 200 }),
  );
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

function mockResendFailure(): FetchMock {
  const fetchMock = vi.fn(async () =>
    new Response(JSON.stringify({ message: 'denied' }), { status: 422 }),
  );
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

beforeEach(() => {
  vi.stubEnv('RESEND_API_KEY', 'test-key');
  vi.stubEnv('ESTIMATE_TO_EMAIL', 'info@example.com');
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('validation', () => {
  it('rejects when any required field is missing', async () => {
    const { POST } = await loadRoute();
    mockResendOk();

    for (const field of ['fullName', 'email', 'phone', 'service', 'message'] as const) {
      const body = { ...VALID_BODY, [field]: '' };
      const res = await POST(makeRequest(body));
      expect(res.status, `missing ${field}`).toBe(400);
      expect(await res.json()).toEqual({ error: 'All fields are required' });
    }
  });

  it('rejects when a field exceeds its max length', async () => {
    const { POST } = await loadRoute();
    mockResendOk();

    const res = await POST(
      makeRequest({ ...VALID_BODY, fullName: 'a'.repeat(101) }),
    );
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: 'fullName is too long' });
  });

  it('rejects malformed email addresses', async () => {
    const { POST } = await loadRoute();
    mockResendOk();

    const res = await POST(
      makeRequest({ ...VALID_BODY, email: 'not-an-email' }),
    );
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: 'Invalid email address' });
  });

  it('rejects malformed phone numbers', async () => {
    const { POST } = await loadRoute();
    mockResendOk();

    const res = await POST(
      makeRequest({ ...VALID_BODY, phone: 'call-me-maybe' }),
    );
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: 'Invalid phone number' });
  });

  it('rejects phone numbers shorter than 7 characters', async () => {
    const { POST } = await loadRoute();
    mockResendOk();

    const res = await POST(makeRequest({ ...VALID_BODY, phone: '12345' }));
    expect(res.status).toBe(400);
  });
});

describe('honeypot', () => {
  it('silently succeeds (200) without calling Resend when the honeypot is filled', async () => {
    const { POST } = await loadRoute();
    const fetchMock = mockResendOk();

    const res = await POST(
      makeRequest({ ...VALID_BODY, website: 'http://spam.example' }),
    );

    expect(res.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('email delivery', () => {
  it('returns 500 when RESEND_API_KEY is not configured', async () => {
    vi.stubEnv('RESEND_API_KEY', '');
    const { POST } = await loadRoute();
    const fetchMock = mockResendOk();

    const res = await POST(makeRequest(VALID_BODY));

    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({
      error: 'Email service is not configured',
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('posts to the Resend API and returns 200 on success', async () => {
    const { POST } = await loadRoute();
    const fetchMock = mockResendOk();

    const res = await POST(makeRequest(VALID_BODY));

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      message: 'Estimate request sent successfully',
    });

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://api.resend.com/emails');
    expect((init as RequestInit).method).toBe('POST');

    const headers = (init as RequestInit).headers as Record<string, string>;
    expect(headers.Authorization).toBe('Bearer test-key');

    const payload = JSON.parse((init as RequestInit).body as string);
    expect(payload.to).toEqual(['info@example.com']);
    expect(payload.reply_to).toBe(VALID_BODY.email);
    expect(payload.subject).toContain(VALID_BODY.service);
    expect(payload.subject).toContain(VALID_BODY.fullName);
  });

  it('returns 500 when Resend rejects the request', async () => {
    const { POST } = await loadRoute();
    mockResendFailure();

    const res = await POST(makeRequest(VALID_BODY));

    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: 'Failed to send email' });
  });
});

describe('HTML escaping', () => {
  it('escapes user-supplied HTML in the rendered email body', async () => {
    const { POST } = await loadRoute();
    const fetchMock = mockResendOk();

    const res = await POST(
      makeRequest({
        ...VALID_BODY,
        fullName: 'Jane <script>alert(1)</script>',
        message: 'Quotes: "double" & \'single\' & <b>bold</b>',
      }),
    );

    expect(res.status).toBe(200);
    const payload = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    const html = payload.html as string;

    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('&amp;');
    expect(html).toContain('&quot;');
    expect(html).toContain('&#39;');
    // & must be escaped first so we don't double-escape entities like &lt;
    expect(html).not.toMatch(/&amp;lt;|&amp;gt;|&amp;quot;|&amp;#39;/);
  });

  it('converts newlines in the message to <br>', async () => {
    const { POST } = await loadRoute();
    const fetchMock = mockResendOk();

    await POST(
      makeRequest({ ...VALID_BODY, message: 'line one\nline two\nline three' }),
    );

    const payload = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(payload.html as string).toContain('line one<br>line two<br>line three');
  });
});

describe('rate limiting', () => {
  it('allows up to 5 requests from the same IP, then blocks with 429', async () => {
    const { POST } = await loadRoute();
    mockResendOk();
    const ip = '198.51.100.42';

    for (let i = 0; i < 5; i++) {
      const res = await POST(makeRequest(VALID_BODY, ip));
      expect(res.status, `request ${i + 1}`).toBe(200);
    }

    const blocked = await POST(makeRequest(VALID_BODY, ip));
    expect(blocked.status).toBe(429);
    expect(await blocked.json()).toEqual({
      error: 'Too many requests. Please try again later.',
    });
    expect(blocked.headers.get('Retry-After')).toMatch(/^\d+$/);
  });

  it('tracks rate limits per IP independently', async () => {
    const { POST } = await loadRoute();
    mockResendOk();

    for (let i = 0; i < 5; i++) {
      const res = await POST(makeRequest(VALID_BODY, '203.0.113.1'));
      expect(res.status).toBe(200);
    }

    const otherIp = await POST(makeRequest(VALID_BODY, '203.0.113.2'));
    expect(otherIp.status).toBe(200);
  });

  it('resets the limit once the window has expired', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));

    const { POST } = await loadRoute();
    mockResendOk();
    const ip = '198.51.100.7';

    for (let i = 0; i < 5; i++) {
      await POST(makeRequest(VALID_BODY, ip));
    }
    const blocked = await POST(makeRequest(VALID_BODY, ip));
    expect(blocked.status).toBe(429);

    // Advance past the 10-minute window
    vi.advanceTimersByTime(10 * 60 * 1000 + 1);

    const res = await POST(makeRequest(VALID_BODY, ip));
    expect(res.status).toBe(200);
  });

  it('uses the first IP in a comma-separated x-forwarded-for header', async () => {
    const { POST } = await loadRoute();
    mockResendOk();

    const req = new Request('https://example.com/api/estimate', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-forwarded-for': '198.51.100.99, 10.0.0.1, 10.0.0.2',
      },
      body: JSON.stringify(VALID_BODY),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);

    // Subsequent requests with the same client IP (different proxy chain)
    // should still hit the same bucket.
    for (let i = 0; i < 4; i++) {
      const next = new Request('https://example.com/api/estimate', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-forwarded-for': '198.51.100.99',
        },
        body: JSON.stringify(VALID_BODY),
      });
      const r = await POST(next);
      expect(r.status).toBe(200);
    }

    const blocked = await POST(
      new Request('https://example.com/api/estimate', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-forwarded-for': '198.51.100.99',
        },
        body: JSON.stringify(VALID_BODY),
      }),
    );
    expect(blocked.status).toBe(429);
  });
});

describe('malformed input', () => {
  it('returns 500 when the body is not valid JSON', async () => {
    const { POST } = await loadRoute();
    mockResendOk();

    const res = await POST(makeRequest('this is not json'));
    expect(res.status).toBe(500);
  });
});

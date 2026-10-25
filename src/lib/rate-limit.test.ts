import { describe, it, expect, vi, afterEach } from 'vitest';
import { rateLimit, rateLimitPeek, getClientIp } from './rate-limit';

afterEach(() => {
  vi.useRealTimers();
});

describe('rateLimit (in-memory fallback)', () => {
  it('allows up to max hits within the window', async () => {
    const key = `test:${Math.random()}`;
    for (let i = 0; i < 3; i++) {
      expect((await rateLimit(key, 3, 60_000)).allowed).toBe(true);
    }
  });

  it('blocks the hit after max and reports retryAfter', async () => {
    const key = `test:${Math.random()}`;
    for (let i = 0; i < 2; i++) await rateLimit(key, 2, 60_000);
    const verdict = await rateLimit(key, 2, 60_000);
    expect(verdict.allowed).toBe(false);
    expect(verdict.retryAfter).toBeGreaterThan(0);
    expect(verdict.retryAfter).toBeLessThanOrEqual(60);
  });

  it('resets after the window elapses', async () => {
    vi.useFakeTimers();
    const key = `test:${Math.random()}`;
    for (let i = 0; i < 2; i++) await rateLimit(key, 2, 60_000);
    expect((await rateLimit(key, 2, 60_000)).allowed).toBe(false);

    vi.advanceTimersByTime(61_000);
    expect((await rateLimit(key, 2, 60_000)).allowed).toBe(true);
  });

  it('peeks a full window without incrementing the counter', async () => {
    const key = `peek:${Math.random()}`;
    expect((await rateLimitPeek(key, 1, 60_000)).allowed).toBe(true);
    expect((await rateLimitPeek(key, 1, 60_000)).allowed).toBe(true);
    expect((await rateLimit(key, 1, 60_000)).allowed).toBe(true);
    const full = await rateLimitPeek(key, 1, 60_000);
    expect(full.allowed).toBe(false);
    expect(full.retryAfter).toBeGreaterThan(0);
    expect((await rateLimitPeek(key, 1, 60_000)).allowed).toBe(false);
  });

  it('tracks keys independently', async () => {
    const a = `test:${Math.random()}`;
    const b = `test:${Math.random()}`;
    await rateLimit(a, 1, 60_000);
    expect((await rateLimit(a, 1, 60_000)).allowed).toBe(false);
    expect((await rateLimit(b, 1, 60_000)).allowed).toBe(true);
  });
});

describe('getClientIp', () => {
  it('takes the first x-forwarded-for entry', () => {
    const req = new Request('http://localhost', {
      headers: { 'x-forwarded-for': '1.2.3.4, 5.6.7.8' },
    });
    expect(getClientIp(req)).toBe('1.2.3.4');
  });

  it('falls back to x-real-ip, then "unknown"', () => {
    const real = new Request('http://localhost', { headers: { 'x-real-ip': '9.9.9.9' } });
    expect(getClientIp(real)).toBe('9.9.9.9');
    expect(getClientIp(new Request('http://localhost'))).toBe('unknown');
  });
});

async function loadFreshLimiter() {
  vi.resetModules();
  return import('./rate-limit');
}

describe('outbound caps', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    delete process.env.VERCEL_ENV;
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    delete process.env.ESTIMATE_CONFIRM_DAILY_CAP;
    delete process.env.ESTIMATE_SMS_DAILY_CAP;
  });

  it('allows one confirmation per normalized email per 24h', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { reserveCustomerConfirmation } = await loadFreshLimiter();
    expect((await reserveCustomerConfirmation('A@Example.com', '6815550101')).send).toBe(true);
    expect(await reserveCustomerConfirmation('a@example.com', '6815550102')).toEqual({
      send: false,
      reason: 'email',
    });
  });

  it('allows one confirmation per normalized phone per 24h', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { reserveCustomerConfirmation } = await loadFreshLimiter();
    expect((await reserveCustomerConfirmation('a@example.com', '(681) 555-0142')).send).toBe(true);
    expect(await reserveCustomerConfirmation('b@example.com', '16815550142')).toEqual({
      send: false,
      reason: 'phone',
    });
  });

  it('enforces the global confirmation cap from ESTIMATE_CONFIRM_DAILY_CAP', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    process.env.ESTIMATE_CONFIRM_DAILY_CAP = '1';
    const { reserveCustomerConfirmation } = await loadFreshLimiter();
    expect((await reserveCustomerConfirmation('a@example.com', '6815550111')).send).toBe(true);
    expect(await reserveCustomerConfirmation('b@example.com', '6815550112')).toEqual({
      send: false,
      reason: 'daily',
    });
  });

  it('defaults the confirmation cap to 150 and the SMS cap to 40', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    delete process.env.ESTIMATE_CONFIRM_DAILY_CAP;
    delete process.env.ESTIMATE_SMS_DAILY_CAP;
    const { reserveCustomerConfirmation, reserveOwnerSms } = await loadFreshLimiter();
    for (let i = 0; i < 150; i++) {
      const decision = await reserveCustomerConfirmation(
        `user${i}@example.com`,
        `681555${String(1000 + i)}`
      );
      expect(decision.send).toBe(true);
    }
    expect(await reserveCustomerConfirmation('over@example.com', '6815559999')).toEqual({
      send: false,
      reason: 'daily',
    });
    for (let i = 0; i < 40; i++) {
      expect((await reserveOwnerSms()).send).toBe(true);
    }
    expect(await reserveOwnerSms()).toEqual({ send: false, reason: 'daily' });
  });

  it('skips customer confirmation in production when Upstash is unset and still allows owner SMS', async () => {
    process.env.VERCEL_ENV = 'production';
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    process.env.ESTIMATE_SMS_DAILY_CAP = '1';
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { reserveCustomerConfirmation, reserveOwnerSms } = await loadFreshLimiter();
    expect(await reserveCustomerConfirmation('a@example.com', '6815550120')).toEqual({
      send: false,
      reason: 'upstash-unset',
    });
    expect(warn).toHaveBeenCalledWith(expect.stringMatching(/UPSTASH_REDIS_REST_URL\/TOKEN unset/));
    expect((await reserveOwnerSms()).send).toBe(true);
    expect((await reserveOwnerSms()).send).toBe(true);
  });

  it('enforces the SMS cap through Upstash when it is configured', async () => {
    process.env.VERCEL_ENV = 'production';
    process.env.UPSTASH_REDIS_REST_URL = 'https://upstash.example';
    process.env.UPSTASH_REDIS_REST_TOKEN = 'token';
    process.env.ESTIMATE_SMS_DAILY_CAP = '40';
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify([{ result: 41 }, { result: 1 }, { result: 1000 }]), {
        status: 200,
      })
    );
    vi.stubGlobal('fetch', fetchMock);
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { reserveOwnerSms } = await loadFreshLimiter();
    expect(await reserveOwnerSms()).toEqual({ send: false, reason: 'daily' });
    expect(fetchMock).toHaveBeenCalledWith(
      'https://upstash.example/pipeline',
      expect.objectContaining({ method: 'POST' })
    );
    const body = JSON.parse(String(fetchMock.mock.calls[0][1].body)) as string[][];
    expect(body[0]).toEqual(['INCR', 'estimate:sms:daily']);
  });
});

describe('outbound caps fail closed on Upstash errors', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    delete process.env.VERCEL_ENV;
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
  });

  const failures: [string, () => Promise<Response>][] = [
    ['a thrown network error', () => Promise.reject(new Error('ECONNRESET'))],
    [
      'a missing INCR result',
      async () => new Response(JSON.stringify([{}, { result: 1 }, { result: 1000 }]), { status: 200 }),
    ],
    [
      'an HTTP-200 command error',
      async () =>
        new Response(
          JSON.stringify([{ error: 'WRONGTYPE Operation against a key' }, { result: 1 }, { result: 1 }]),
          { status: 200 }
        ),
    ],
    ['a non-200 response', async () => new Response('oops', { status: 500 })],
    [
      'a truncated pipeline response',
      async () => new Response(JSON.stringify([{ result: 1 }]), { status: 200 }),
    ],
    [
      'a missing PEXPIRE result',
      async () => new Response(JSON.stringify([{ result: 1 }, {}, { result: 1000 }]), { status: 200 }),
    ],
    [
      'a missing PTTL result',
      async () => new Response(JSON.stringify([{ result: 1 }, { result: 1 }, {}]), { status: 200 }),
    ],
    [
      'a non-numeric PTTL result',
      async () =>
        new Response(JSON.stringify([{ result: 1 }, { result: 1 }, { result: 'soon' }]), {
          status: 200,
        }),
    ],
  ];

  for (const [label, respond] of failures) {
    it(`skips the customer confirmation and owner SMS on ${label}`, async () => {
      process.env.VERCEL_ENV = 'production';
      process.env.UPSTASH_REDIS_REST_URL = 'https://upstash.example';
      process.env.UPSTASH_REDIS_REST_TOKEN = 'token';
      vi.stubGlobal('fetch', vi.fn().mockImplementation(respond));
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});
      const { reserveCustomerConfirmation, reserveOwnerSms, rateLimit } = await loadFreshLimiter();

      expect(await reserveCustomerConfirmation('a@example.com', '6815550130')).toEqual({
        send: false,
        reason: 'counter-error',
      });
      expect(await reserveOwnerSms()).toEqual({ send: false, reason: 'counter-error' });
      expect(warn).toHaveBeenCalledWith(expect.stringMatching(/cap counter unavailable/));
      expect(error).toHaveBeenCalledWith(expect.stringMatching(/failing closed/));

      // The per-IP lead limit still fails open so a real lead is never blocked.
      expect((await rateLimit('estimate:203.0.113.9', 5, 60_000)).allowed).toBe(true);
    });
  }
});

describe('agent counters fail closed; public lead limiter stays open', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
  });

  function upstashEnv() {
    process.env.UPSTASH_REDIS_REST_URL = 'https://upstash.example';
    process.env.UPSTASH_REDIS_REST_TOKEN = 'token';
  }

  const outages: [string, () => Promise<Response>][] = [
    ['Upstash throws', () => Promise.reject(new Error('ECONNRESET'))],
    [
      'Upstash returns a malformed body',
      async () => new Response(JSON.stringify([{ error: 'WRONGTYPE' }]), { status: 200 }),
    ],
  ];

  for (const [label, respond] of outages) {
    it(`keeps rateLimit fail-open for lead capture when ${label}`, async () => {
      upstashEnv();
      vi.stubGlobal('fetch', vi.fn().mockImplementation(respond));
      vi.spyOn(console, 'error').mockImplementation(() => {});
      const { rateLimit } = await loadFreshLimiter();
      const verdict = await rateLimit('estimate:203.0.113.10', 5, 60_000);
      expect(verdict.allowed).toBe(true);
      expect(verdict.counterError).toBeUndefined();
    });

    it(`denies rateLimit and rateLimitPeek when ${label} and failClosed is set`, async () => {
      upstashEnv();
      vi.stubGlobal('fetch', vi.fn().mockImplementation(respond));
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});
      const { rateLimit, rateLimitPeek } = await loadFreshLimiter();
      expect(await rateLimit('agent-burst:203.0.113.11', 20, 60_000, { failClosed: true })).toEqual({
        allowed: false,
        retryAfter: 0,
        counterError: true,
      });
      expect(await rateLimitPeek('agent-fail:203.0.113.11', 5, 60_000, { failClosed: true })).toEqual({
        allowed: false,
        retryAfter: 0,
        counterError: true,
      });
      expect(error).toHaveBeenCalledWith(expect.stringMatching(/failing closed/));
    });
  }

  it('still fail-opens a peek that did not ask to fail closed', async () => {
    upstashEnv();
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('ECONNRESET')));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const { rateLimitPeek } = await loadFreshLimiter();
    expect(await rateLimitPeek('agent-fail:203.0.113.12', 5, 60_000)).toMatchObject({
      allowed: true,
    });
  });
});

describe('rateLimitPeek validates every Upstash pipeline entry', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
  });

  function peekResponds(body: unknown) {
    process.env.UPSTASH_REDIS_REST_URL = 'https://upstash.example';
    process.env.UPSTASH_REDIS_REST_TOKEN = 'token';
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(async () => new Response(JSON.stringify(body), { status: 200 }))
    );
  }

  const malformed: [string, unknown][] = [
    ['an empty PTTL entry', [{ result: '0' }, {}]],
    ['a missing count result', [{}, { result: 1000 }]],
    ['an error entry on GET', [{ error: 'WRONGTYPE' }, { result: 1000 }]],
    ['an error entry on PTTL', [{ result: '0' }, { error: 'ERR' }]],
    ['a non-numeric count', [{ result: 'lots' }, { result: 1000 }]],
    ['a fractional count', [{ result: '1.5' }, { result: 1000 }]],
    ['a negative count', [{ result: '-1' }, { result: 1000 }]],
    ['a non-numeric PTTL', [{ result: '0' }, { result: 'soon' }]],
    ['a null PTTL', [{ result: '0' }, { result: null }]],
    ['a non-object entry', [null, { result: 1000 }]],
  ];

  for (const [label, body] of malformed) {
    it(`denies a failClosed peek on ${label}`, async () => {
      peekResponds(body);
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});
      const { rateLimitPeek } = await loadFreshLimiter();
      expect(await rateLimitPeek('agent-fail:203.0.113.70', 5, 60_000, { failClosed: true })).toEqual({
        allowed: false,
        retryAfter: 0,
        counterError: true,
      });
      expect(error).toHaveBeenCalledWith(expect.stringMatching(/failing closed/));
    });

    it(`fails open on ${label} when failClosed is not set`, async () => {
      peekResponds(body);
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});
      const { rateLimitPeek } = await loadFreshLimiter();
      expect(await rateLimitPeek('agent-fail:203.0.113.71', 5, 60_000)).toEqual({
        allowed: true,
        retryAfter: 0,
      });
      expect(error).toHaveBeenCalledWith(expect.stringMatching(/failing open/));
    });
  }

  it('treats a missing key (GET null, PTTL -2) as zero hits', async () => {
    peekResponds([{ result: null }, { result: -2 }]);
    const { rateLimitPeek } = await loadFreshLimiter();
    expect(await rateLimitPeek('agent-fail:203.0.113.72', 5, 60_000, { failClosed: true })).toEqual({
      allowed: true,
      retryAfter: 0,
    });
  });

  it('allows a valid count under the limit', async () => {
    peekResponds([{ result: '4' }, { result: 30_000 }]);
    const { rateLimitPeek } = await loadFreshLimiter();
    expect(await rateLimitPeek('agent-fail:203.0.113.73', 5, 60_000, { failClosed: true })).toEqual({
      allowed: true,
      retryAfter: 0,
    });
  });

  it('denies a full window with retryAfter from PTTL', async () => {
    peekResponds([{ result: '5' }, { result: 30_000 }]);
    const { rateLimitPeek } = await loadFreshLimiter();
    expect(await rateLimitPeek('agent-fail:203.0.113.74', 5, 60_000, { failClosed: true })).toEqual({
      allowed: false,
      retryAfter: 30,
    });
  });
});

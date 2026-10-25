import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { authorizeAgentRequest, agentGateDenied } from './guard';

const ADMIN = 'test-admin-key-value';

function pipeline(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status });
}

let ip = 20;

function request(key: string): Request {
  ip += 1;
  return new Request('http://localhost/api/sales/leads', {
    headers: {
      authorization: `Bearer ${key}`,
      'x-forwarded-for': `203.0.113.${ip}`,
    },
  });
}

beforeEach(() => {
  process.env.ADMIN_TOOLS_KEY = ADMIN;
  process.env.GROKBOT_API_KEY = 'test-grokbot-key-value';
  delete process.env.GROKBOT_SCOPES;
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.UPSTASH_REDIS_REST_TOKEN;
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  delete process.env.ADMIN_TOOLS_KEY;
  delete process.env.GROKBOT_API_KEY;
  delete process.env.GROKBOT_SCOPES;
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.UPSTASH_REDIS_REST_TOKEN;
});

function useUpstash() {
  process.env.UPSTASH_REDIS_REST_URL = 'https://upstash.example';
  process.env.UPSTASH_REDIS_REST_TOKEN = 'token';
  vi.spyOn(console, 'error').mockImplementation(() => {});
}

describe('authorizeAgentRequest Upstash outage', () => {
  it('allows a valid admin key when Upstash is unset (in-memory limiter)', async () => {
    const auth = await authorizeAgentRequest(request(ADMIN));
    expect(agentGateDenied(auth)).toBe(false);
    expect(auth).toMatchObject({ ok: true, via: 'admin' });
  });

  it('allows a valid admin key when Upstash answers', async () => {
    useUpstash();
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce(pipeline([{ result: null }, { result: -1 }]))
        .mockResolvedValueOnce(pipeline([{ result: 1 }, { result: 1 }, { result: 60_000 }]))
    );
    const auth = await authorizeAgentRequest(request(ADMIN));
    expect(auth).toMatchObject({ ok: true, via: 'admin' });
  });

  it.each([
    ['Upstash throws', () => Promise.reject(new Error('ECONNRESET'))],
    ['Upstash returns a malformed body', async () => pipeline([{ error: 'WRONGTYPE' }])],
  ])('denies a valid admin key when the lockout peek fails because %s', async (_label, respond) => {
    useUpstash();
    vi.stubGlobal('fetch', vi.fn().mockImplementation(respond));
    const auth = await authorizeAgentRequest(request(ADMIN));
    expect(agentGateDenied(auth)).toBe(true);
    if (!agentGateDenied(auth)) return;
    expect(auth.status).toBe(503);
    expect(await auth.json()).toEqual({ error: 'Agent API temporarily unavailable.' });
  });

  it('denies a valid admin key when the burst counter fails closed', async () => {
    useUpstash();
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce(pipeline([{ result: null }, { result: -1 }]))
        .mockRejectedValueOnce(new Error('ECONNRESET'))
    );
    const auth = await authorizeAgentRequest(request(ADMIN));
    expect(agentGateDenied(auth)).toBe(true);
    if (!agentGateDenied(auth)) return;
    expect(auth.status).toBe(503);
  });

  it('denies a failed login when the 401 lockout counter cannot be written', async () => {
    useUpstash();
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce(pipeline([{ result: null }, { result: -1 }]))
        .mockResolvedValueOnce(pipeline([{ result: 1 }, { result: 1 }, { result: 60_000 }]))
        .mockRejectedValueOnce(new Error('ECONNRESET'))
    );
    const auth = await authorizeAgentRequest(request('wrong-key'));
    expect(agentGateDenied(auth)).toBe(true);
    if (!agentGateDenied(auth)) return;
    expect(auth.status).toBe(503);
    expect(await auth.json()).toEqual({ error: 'Agent API temporarily unavailable.' });
  });
});

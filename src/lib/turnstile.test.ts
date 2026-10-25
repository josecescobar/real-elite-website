import { afterEach, describe, expect, it, vi } from 'vitest';
import { TURNSTILE_SITEVERIFY_URL, TURNSTILE_TIMEOUT_MS } from './turnstile';

const SECRET = 'turnstile-secret-do-not-log';

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  delete process.env.TURNSTILE_SECRET_KEY;
  vi.resetModules();
});

async function loadVerify() {
  vi.resetModules();
  return (await import('./turnstile')).verifyTurnstile;
}

describe('verifyTurnstile', () => {
  it('is inert when TURNSTILE_SECRET_KEY is unset and warns once', async () => {
    delete process.env.TURNSTILE_SECRET_KEY;
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const verify = await loadVerify();

    const first = await verify(undefined, '203.0.113.1');
    const second = await verify('', '203.0.113.1');

    expect(first).toEqual({ ok: true, enforced: false });
    expect(second).toEqual({ ok: true, enforced: false });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toMatch(/TURNSTILE_SECRET_KEY unset/);
  });

  it('requires a token when the secret is set and does not call siteverify if it is missing', async () => {
    process.env.TURNSTILE_SECRET_KEY = SECRET;
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const verify = await loadVerify();

    expect(await verify(undefined, '203.0.113.2')).toEqual({
      ok: false,
      enforced: true,
      reason: 'missing',
    });
    expect(await verify('   ', '203.0.113.2')).toEqual({
      ok: false,
      enforced: true,
      reason: 'missing',
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('accepts a token Cloudflare marks successful', async () => {
    process.env.TURNSTILE_SECRET_KEY = SECRET;
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ success: true }), { status: 200 })
    );
    vi.stubGlobal('fetch', fetchMock);
    const verify = await loadVerify();

    expect(await verify('token-ok', '203.0.113.3')).toEqual({ ok: true, enforced: true });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe(TURNSTILE_SITEVERIFY_URL);
    const init = fetchMock.mock.calls[0][1] as RequestInit;
    const params = new URLSearchParams(init.body as string);
    expect(params.get('secret')).toBe(SECRET);
    expect(params.get('response')).toBe('token-ok');
    expect(params.get('remoteip')).toBe('203.0.113.3');
    expect(init.signal).toBeInstanceOf(AbortSignal);
    expect(TURNSTILE_TIMEOUT_MS).toBeLessThanOrEqual(5_000);
  });

  it('rejects an invalid token, a non-200 response, and a network failure without logging the secret', async () => {
    process.env.TURNSTILE_SECRET_KEY = SECRET;
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ success: false }), { status: 200 }))
      .mockResolvedValueOnce(new Response('nope', { status: 500 }))
      .mockRejectedValueOnce(new Error('timeout'));
    vi.stubGlobal('fetch', fetchMock);
    const verify = await loadVerify();

    expect(await verify('bad', '203.0.113.4')).toEqual({
      ok: false,
      enforced: true,
      reason: 'invalid',
    });
    expect(await verify('bad', 'unknown')).toEqual({
      ok: false,
      enforced: true,
      reason: 'invalid',
    });
    expect(await verify('bad', '203.0.113.4')).toEqual({
      ok: false,
      enforced: true,
      reason: 'invalid',
    });

    const noIp = new URLSearchParams(fetchMock.mock.calls[1][1].body as string);
    expect(noIp.get('remoteip')).toBeNull();
    expect(JSON.stringify(error.mock.calls)).not.toContain(SECRET);
  });
});

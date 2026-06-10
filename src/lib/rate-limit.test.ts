import { describe, it, expect, vi, afterEach } from 'vitest';
import { rateLimit, getClientIp } from './rate-limit';

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

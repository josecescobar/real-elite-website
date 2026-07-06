import { describe, it, expect, vi, afterEach } from 'vitest';
import { captureFirstTouch, getAttribution, attributionPayload } from '@/lib/attribution';

/** Minimal in-memory sessionStorage stand-in. */
function makeStorage() {
  const m = new Map<string, string>();
  return {
    getItem: (k: string) => (m.has(k) ? m.get(k)! : null),
    setItem: (k: string, v: string) => void m.set(k, v),
    removeItem: (k: string) => void m.delete(k),
    clear: () => m.clear(),
  };
}

function stubEnv(opts: {
  search?: string;
  referrer?: string;
  host?: string;
  pathname?: string;
  storage?: ReturnType<typeof makeStorage>;
}) {
  const storage = opts.storage ?? makeStorage();
  vi.stubGlobal('window', {
    sessionStorage: storage,
    location: {
      search: opts.search ?? '',
      host: opts.host ?? 'www.realelitecontracting.com',
      pathname: opts.pathname ?? '/',
    },
  });
  vi.stubGlobal('document', { referrer: opts.referrer ?? '' });
  return storage;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('captureFirstTouch', () => {
  it('captures utm params and the landing path', () => {
    stubEnv({
      search: '?utm_source=google&utm_medium=lsa&utm_campaign=spring',
      pathname: '/services/roofing',
    });
    captureFirstTouch();
    expect(getAttribution()).toEqual({
      utmSource: 'google',
      utmMedium: 'lsa',
      utmCampaign: 'spring',
      utmTerm: undefined,
      utmContent: undefined,
      referrer: undefined,
      landingPath: '/services/roofing?utm_source=google&utm_medium=lsa&utm_campaign=spring',
    });
  });

  it('records an external referrer host but ignores our own domain', () => {
    stubEnv({ referrer: 'https://www.bing.com/search?q=roofer', host: 'www.realelitecontracting.com' });
    captureFirstTouch();
    expect(getAttribution()?.referrer).toBe('www.bing.com');

    vi.unstubAllGlobals();
    stubEnv({ referrer: 'https://www.realelitecontracting.com/about', host: 'www.realelitecontracting.com' });
    captureFirstTouch();
    expect(getAttribution()?.referrer).toBeUndefined();
  });

  it('is first-touch: a later call never overwrites the stored record', () => {
    const storage = stubEnv({ search: '?utm_source=google' });
    captureFirstTouch();
    // Simulate a same-session navigation that lost the params.
    vi.unstubAllGlobals();
    stubEnv({ search: '?utm_source=facebook', storage });
    captureFirstTouch();
    expect(getAttribution()?.utmSource).toBe('google');
  });

  it('clips over-long values to 200 chars', () => {
    stubEnv({ search: `?utm_campaign=${'x'.repeat(500)}` });
    captureFirstTouch();
    expect(getAttribution()?.utmCampaign).toHaveLength(200);
  });
});

describe('getAttribution', () => {
  it('returns null when nothing was captured', () => {
    stubEnv({});
    expect(getAttribution()).toBeNull();
  });

  it('returns null during SSR (no window)', () => {
    expect(getAttribution()).toBeNull();
  });
});

describe('attributionPayload', () => {
  it('flattens to string fields and drops undefined ones', () => {
    stubEnv({ search: '?utm_source=google&utm_medium=cpc', pathname: '/' });
    captureFirstTouch();
    expect(attributionPayload()).toEqual({
      utmSource: 'google',
      utmMedium: 'cpc',
      landingPath: '/?utm_source=google&utm_medium=cpc',
    });
  });

  it('is an empty object when there is no attribution', () => {
    stubEnv({});
    expect(attributionPayload()).toEqual({});
  });
});

describe('SSR safety', () => {
  it('captureFirstTouch does not throw without a window', () => {
    expect(() => captureFirstTouch()).not.toThrow();
  });
});

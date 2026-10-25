import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  ADMIN_KEY_STORAGE,
  purgeLegacyAdminKey,
  readSessionAdminKey,
  saveSessionAdminKey,
  stripKeyFromUrl,
} from './admin-key-storage';

afterEach(() => {
  window.localStorage.clear();
  window.sessionStorage.clear();
  window.history.replaceState(null, '', '/');
  vi.restoreAllMocks();
});

describe('admin key storage (audit M1)', () => {
  it('purges a legacy localStorage key', () => {
    window.localStorage.setItem(ADMIN_KEY_STORAGE, 'old-key');
    purgeLegacyAdminKey();
    expect(window.localStorage.getItem(ADMIN_KEY_STORAGE)).toBeNull();
  });

  it('saves to sessionStorage only, trimmed', () => {
    saveSessionAdminKey('  k1  ');
    expect(readSessionAdminKey()).toBe('k1');
    expect(window.localStorage.getItem(ADMIN_KEY_STORAGE)).toBeNull();
  });

  it('survives blocked storage', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(readSessionAdminKey()).toBeNull();
    expect(() => saveSessionAdminKey('k')).not.toThrow();
    expect(() => purgeLegacyAdminKey()).not.toThrow();
  });

  it('strips ?key= from the address bar and keeps other params', () => {
    window.history.replaceState(null, '', '/sales?key=secret&bucket=hot#x');
    stripKeyFromUrl();
    expect(window.location.search).toBe('?bucket=hot');
    expect(window.location.hash).toBe('#x');
    expect(window.location.href).not.toContain('secret');
  });
});

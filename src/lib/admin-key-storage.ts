/**
 * Where the internal tools (/sales, /review-request) keep the access key.
 *
 * sessionStorage only: the key lives for this tab and is gone when it
 * closes. It is never written to localStorage, where it would persist on
 * the device indefinitely and be readable by any script that ever runs on
 * the marketing origin (security audit 2026-10-24, finding M1). Older
 * builds did write it to localStorage, so `purgeLegacyAdminKey()` removes
 * that entry when either tool loads.
 *
 * Every access is wrapped: storage can throw (private mode, blocked site
 * data), and the tools must still work with the key held in memory only.
 */

export const ADMIN_KEY_STORAGE = 'realelite-admin-key';

export function purgeLegacyAdminKey(): void {
  try {
    window.localStorage.removeItem(ADMIN_KEY_STORAGE);
  } catch {
    /* storage blocked — nothing persisted to remove */
  }
}

export function readSessionAdminKey(): string | null {
  try {
    return window.sessionStorage.getItem(ADMIN_KEY_STORAGE);
  } catch {
    return null;
  }
}

export function saveSessionAdminKey(key: string): void {
  const trimmed = key.trim();
  if (!trimmed) return;
  try {
    window.sessionStorage.setItem(ADMIN_KEY_STORAGE, trimmed);
  } catch {
    /* storage blocked — key stays in memory for this page view */
  }
}

/** Old bookmarks may still carry `?key=`. Drop it from the address bar. */
export function stripKeyFromUrl(): void {
  try {
    const url = new URL(window.location.href);
    if (!url.searchParams.has('key')) return;
    url.searchParams.delete('key');
    window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
  } catch {
    /* non-browser environment */
  }
}

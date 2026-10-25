'use client';

import { useEffect } from 'react';

/**
 * Document boundary for the internal tools (/sales, /review-request).
 *
 * The path checks in DeferredAnalytics / GoogleTagManager stop GA4, GTM
 * and Clarity from loading in a document that STARTS on an internal tool.
 * They cannot unload tags that already started on a marketing page, so a
 * client-side (soft) navigation into a tool would keep them running there
 * (security audit 2026-10-24, M1; PR-B review). Nothing on the site links
 * to these tools (a regression test enforces that); this guard is the
 * backstop for any soft navigation that still happens.
 *
 * On mount: if any analytics global or tag script is present, reload the
 * page once with `location.replace` so the tool runs in a fresh document,
 * where the path checks keep every tag off. A sessionStorage marker keyed
 * to the path makes a second reload impossible, so it can never loop; if
 * sessionStorage is unavailable it does not reload at all.
 */

export const ANALYTICS_RELOAD_MARKER = 'realelite-analytics-free-reload';

const ANALYTICS_SCRIPT_HOSTS = ['googletagmanager.com', 'google-analytics.com', 'clarity.ms'];

export function analyticsPresent(): boolean {
  const w = window as Window & {
    gtag?: unknown;
    dataLayer?: unknown;
    clarity?: unknown;
    google_tag_manager?: unknown;
  };
  if (w.gtag !== undefined || w.dataLayer !== undefined || w.clarity !== undefined || w.google_tag_manager !== undefined) {
    return true;
  }
  return Array.from(document.querySelectorAll<HTMLScriptElement>('script[src]')).some((script) =>
    ANALYTICS_SCRIPT_HOSTS.some((host) => {
      try {
        const { hostname } = new URL(script.src, window.location.href);
        return hostname === host || hostname.endsWith(`.${host}`);
      } catch {
        return false;
      }
    })
  );
}

export default function AnalyticsFreeDocumentGuard() {
  useEffect(() => {
    const path = window.location.pathname;
    try {
      if (!analyticsPresent()) {
        // Clean document: clear the marker so a later soft navigation
        // back into a tool can trigger its one reload again.
        window.sessionStorage.removeItem(ANALYTICS_RELOAD_MARKER);
        return;
      }
      if (window.sessionStorage.getItem(ANALYTICS_RELOAD_MARKER) === path) return; // already reloaded once
      window.sessionStorage.setItem(ANALYTICS_RELOAD_MARKER, path);
    } catch {
      return; // no storage → no loop guard → never reload
    }
    window.location.replace(window.location.href);
  }, []);

  return null;
}

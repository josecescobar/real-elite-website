'use client';

import { useEffect } from 'react';
import { ensureGtagStub } from '@/lib/analytics';

type DeferredAnalyticsProps = {
  gaId?: string;
  clarityId?: string;
};

const INTERACTION_EVENTS = ['pointerdown', 'keydown', 'scroll', 'touchstart'] as const;
/** Fallback so heatmaps still start if the visitor never interacts. Long
 *  enough that lab LCP/FCP are not waiting on gtag.js / Clarity. */
const FALLBACK_TIMEOUT_MS = 6000;

function injectScript(src: string) {
  const existing = document.querySelector(`script[src="${src}"]`);
  if (existing) return;
  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  document.head.appendChild(script);
}

function loadClarity(id: string) {
  const src = `https://www.clarity.ms/tag/${id}`;
  if (document.querySelector(`script[src="${src}"]`)) return;

  type ClarityFn = ((...args: unknown[]) => void) & { q?: unknown[] };
  const w = window as Window & { clarity?: ClarityFn };
  w.clarity =
    w.clarity ||
    function clarity() {
      // Official Clarity snippet queues calls until the tag arrives.
      (w.clarity!.q = w.clarity!.q || []).push(arguments);
    };

  injectScript(src);
}

/**
 * Loads GA4 (gtag, not GTM) and Microsoft Clarity after first paint.
 *
 * `next/script strategy="afterInteractive"` preloads gtag.js in `<head>`,
 * which contended with the LCP hero on Slow 4G and showed up as unused JS
 * in the Aug 22 2026 mobile PSI lab. We keep the tags — we just wait for
 * first input or 6s — and `ensureGtagStub()` queues events so estimate /
 * lead hits still fire once gtag.js lands.
 */
export default function DeferredAnalytics({ gaId, clarityId }: DeferredAnalyticsProps) {
  useEffect(() => {
    if (!gaId && !clarityId) return;

    if (gaId) {
      ensureGtagStub();
    }

    let loaded = false;
    const load = () => {
      if (loaded) return;
      loaded = true;
      cleanup();

      if (gaId) {
        ensureGtagStub();
        window.gtag!('js', new Date());
        window.gtag!('config', gaId);
        injectScript(`https://www.googletagmanager.com/gtag/js?id=${gaId}`);
      }

      if (clarityId) {
        loadClarity(clarityId);
      }
    };

    const onInteract = () => load();
    for (const event of INTERACTION_EVENTS) {
      window.addEventListener(event, onInteract, { once: true, passive: true });
    }

    const timeoutId = window.setTimeout(load, FALLBACK_TIMEOUT_MS);

    function cleanup() {
      for (const event of INTERACTION_EVENTS) {
        window.removeEventListener(event, onInteract);
      }
      window.clearTimeout(timeoutId);
    }

    return cleanup;
  }, [gaId, clarityId]);

  return null;
}

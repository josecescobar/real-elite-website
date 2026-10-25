'use client';

import { useEffect, useRef } from 'react';

type TurnstileApi = {
  render: (element: HTMLElement, options: Record<string, unknown>) => string;
  remove: (widgetId: string) => void;
  reset: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_ID = 'cf-turnstile-api';
const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

/** Literal NEXT_PUBLIC access so Next can inline it in the client bundle. */
export function turnstileSiteKey(): string | undefined {
  const key = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
  return key || undefined;
}

export function turnstilePayload(token: string): { turnstileToken?: string } {
  return token ? { turnstileToken: token } : {};
}

type Props = {
  onToken: (token: string) => void;
  /**
   * Bump after a failed submit. Turnstile tokens are single-use, so the
   * widget is reset and the stale token cleared before the next attempt.
   */
  resetSignal?: number;
};

/**
 * Cloudflare Turnstile widget. The script is injected after idle, and only
 * once this component is mounted (the estimate form mounts it on the last
 * step), so it stays off the initial page load.
 * Renders nothing when NEXT_PUBLIC_TURNSTILE_SITE_KEY is unset.
 *
 * The widget never blocks submission: the browser cannot know whether the
 * server secret is set, so the form posts with or without a token and
 * /api/estimate decides.
 */
export default function TurnstileWidget({ onToken, resetSignal = 0 }: Props) {
  const siteKey = turnstileSiteKey();
  const hostRef = useRef<HTMLDivElement>(null);
  const onTokenRef = useRef(onToken);
  const widgetIdRef = useRef<string | null>(null);
  const lastResetRef = useRef(resetSignal);

  useEffect(() => {
    onTokenRef.current = onToken;
  }, [onToken]);

  useEffect(() => {
    if (!siteKey) return;
    let cancelled = false;
    let widgetId: string | null = null;
    let script: HTMLScriptElement | null = null;

    const renderWidget = () => {
      if (cancelled || widgetId || !hostRef.current || !window.turnstile) return;
      widgetId = window.turnstile.render(hostRef.current, {
        sitekey: siteKey,
        callback: (token: string) => onTokenRef.current(token),
        'expired-callback': () => onTokenRef.current(''),
        'error-callback': () => onTokenRef.current(''),
      });
      widgetIdRef.current = widgetId;
    };

    const start = () => {
      if (cancelled) return;
      if (window.turnstile) {
        renderWidget();
        return;
      }
      script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement('script');
        script.id = SCRIPT_ID;
        script.src = SCRIPT_SRC;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
      script.addEventListener('load', renderWidget);
    };

    const useIdle =
      typeof window.requestIdleCallback === 'function' &&
      typeof window.cancelIdleCallback === 'function';
    const idleId = useIdle ? window.requestIdleCallback(start) : window.setTimeout(start, 1);

    return () => {
      cancelled = true;
      if (useIdle) window.cancelIdleCallback(idleId);
      else window.clearTimeout(idleId);
      script?.removeEventListener('load', renderWidget);
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
      widgetIdRef.current = null;
    };
  }, [siteKey]);

  useEffect(() => {
    if (resetSignal === lastResetRef.current) return;
    lastResetRef.current = resetSignal;
    onTokenRef.current('');
    const widgetId = widgetIdRef.current;
    if (widgetId && window.turnstile) window.turnstile.reset(widgetId);
  }, [resetSignal]);

  if (!siteKey) return null;

  return <div ref={hostRef} className="mt-4 min-h-[65px]" data-testid="turnstile-widget" />;
}

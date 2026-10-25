import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import AnalyticsFreeDocumentGuard, { ANALYTICS_RELOAD_MARKER, analyticsPresent } from './AnalyticsFreeDocumentGuard';
import DeferredAnalytics from './DeferredAnalytics';
import GoogleTagManager from './GoogleTagManager';
import { isAnalyticsExcludedPath } from '@/lib/analytics-exclusions';

/**
 * Navigation regression for audit M1 / PR-B review: tags that started on a
 * marketing page must not keep running on /sales or /review-request after a
 * client-side transition. jsdom has no real reload, so `location` is stubbed
 * and "reload" is modelled as a fresh document (globals + scripts cleared).
 */

const nav = vi.hoisted(() => ({ pathname: '/' }));
vi.mock('next/navigation', () => ({ usePathname: () => nav.pathname }));
vi.mock('next/script', () => ({
  // Mirrors what the real GTM snippet leaves behind once it runs.
  default: ({ id }: { id?: string; children?: ReactNode }) => {
    if (id === 'gtm-init' && typeof window !== 'undefined') {
      (window as Window & { google_tag_manager?: unknown }).google_tag_manager = {};
    }
    return null;
  },
}));

const replace = vi.fn();

function goTo(pathname: string) {
  nav.pathname = pathname;
  vi.stubGlobal('location', {
    pathname,
    href: `https://www.realelitecontracting.com${pathname}`,
    search: '',
    hash: '',
    replace,
  });
}

/** What a full page load gives you: no tag globals, no tag scripts. */
function freshDocument() {
  document.head.querySelectorAll('script').forEach((node) => node.remove());
  const w = window as unknown as Record<string, unknown>;
  for (const name of ['gtag', 'dataLayer', 'clarity', 'google_tag_manager']) delete w[name];
}

function Shell() {
  // Root layout pieces + whichever page the router is on.
  return (
    <>
      <GoogleTagManager gtmId="GTM-TEST" />
      <DeferredAnalytics gaId="G-W9QH965H3Y" clarityId="y6j2ghobe7" />
      {isAnalyticsExcludedPath(nav.pathname) ? <AnalyticsFreeDocumentGuard key={nav.pathname} /> : <p>marketing</p>}
    </>
  );
}

beforeEach(() => {
  replace.mockReset();
  freshDocument();
  window.sessionStorage.clear();
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  freshDocument();
  window.sessionStorage.clear();
});

async function loadMarketingPageWithAnalytics() {
  goTo('/services');
  const view = render(<Shell />);
  window.dispatchEvent(new Event('pointerdown'));
  await waitFor(() => {
    expect(document.querySelector('script[src*="googletagmanager.com/gtag/js"]')).toBeTruthy();
    expect(document.querySelector('script[src*="clarity.ms/tag"]')).toBeTruthy();
  });
  expect(analyticsPresent()).toBe(true);
  return view;
}

describe.each(['/sales', '/review-request'])('client navigation into %s', (tool) => {
  it('reloads into a fresh document when tags are already running', async () => {
    const view = await loadMarketingPageWithAnalytics();

    goTo(tool);
    act(() => view.rerender(<Shell />));

    expect(replace).toHaveBeenCalledTimes(1);
    expect(replace).toHaveBeenCalledWith(`https://www.realelitecontracting.com${tool}`);
    expect(window.sessionStorage.getItem(ANALYTICS_RELOAD_MARKER)).toBe(tool);
  });

  it('the fresh load has no analytics and does not reload again', async () => {
    vi.useFakeTimers();
    goTo(tool);
    render(<Shell />);
    window.dispatchEvent(new Event('pointerdown'));
    vi.advanceTimersByTime(10_000);

    expect(analyticsPresent()).toBe(false);
    expect(document.querySelectorAll('script[src]')).toHaveLength(0);
    expect(replace).not.toHaveBeenCalled();
    expect(window.sessionStorage.getItem(ANALYTICS_RELOAD_MARKER)).toBeNull();
  });

  it('never loops: a second mount with tags still present does not reload', async () => {
    const view = await loadMarketingPageWithAnalytics();
    goTo(tool);
    act(() => view.rerender(<Shell />));
    expect(replace).toHaveBeenCalledTimes(1);

    // Simulate the reload landing in a document that somehow still has tags.
    view.unmount();
    render(<AnalyticsFreeDocumentGuard />);
    render(<AnalyticsFreeDocumentGuard />);
    expect(replace).toHaveBeenCalledTimes(1);
  });
});

describe('AnalyticsFreeDocumentGuard', () => {
  it.each([
    ['gtag', () => ((window as Window & { gtag?: unknown }).gtag = () => {})],
    ['dataLayer', () => ((window as Window & { dataLayer?: unknown[] }).dataLayer = [])],
    ['clarity', () => ((window as Window & { clarity?: unknown }).clarity = () => {})],
    ['google_tag_manager', () => ((window as Window & { google_tag_manager?: unknown }).google_tag_manager = {})],
    ['google-analytics.com script', () => {
      const s = document.createElement('script');
      s.src = 'https://www.google-analytics.com/analytics.js';
      document.head.appendChild(s);
    }],
    ['clarity.ms script', () => {
      const s = document.createElement('script');
      s.src = 'https://scripts.clarity.ms/0.8/clarity.js';
      document.head.appendChild(s);
    }],
  ])('detects %s', (_name, plant) => {
    goTo('/sales');
    plant();
    render(<AnalyticsFreeDocumentGuard />);
    expect(replace).toHaveBeenCalledTimes(1);
  });

  it('ignores unrelated scripts and lookalike hosts', () => {
    goTo('/sales');
    const s = document.createElement('script');
    s.src = 'https://evilclarity.ms.example.com/x.js';
    document.head.appendChild(s);
    render(<AnalyticsFreeDocumentGuard />);
    expect(replace).not.toHaveBeenCalled();
  });

  it('does not reload when sessionStorage is unavailable (no loop guard)', () => {
    goTo('/sales');
    (window as Window & { gtag?: unknown }).gtag = () => {};
    const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    render(<AnalyticsFreeDocumentGuard />);
    expect(replace).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});

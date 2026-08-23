import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import DeferredAnalytics from './DeferredAnalytics';

afterEach(() => {
  document.head.querySelectorAll('script').forEach((node) => node.remove());
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('DeferredAnalytics', () => {
  it('does not inject gtag or Clarity until idle or interaction', () => {
    render(<DeferredAnalytics gaId="G-W9QH965H3Y" clarityId="y6j2ghobe7" />);

    expect(
      document.querySelector('script[src*="googletagmanager.com/gtag/js"]')
    ).toBeNull();
    expect(document.querySelector('script[src*="clarity.ms/tag"]')).toBeNull();
  });

  it('loads both tags on the first user interaction', async () => {
    render(<DeferredAnalytics gaId="G-W9QH965H3Y" clarityId="y6j2ghobe7" />);

    window.dispatchEvent(new Event('pointerdown'));

    await waitFor(() => {
      expect(
        document.querySelector('script[src="https://www.googletagmanager.com/gtag/js?id=G-W9QH965H3Y"]')
      ).toBeTruthy();
      expect(
        document.querySelector('script[src="https://www.clarity.ms/tag/y6j2ghobe7"]')
      ).toBeTruthy();
    });

    expect(typeof window.gtag).toBe('function');
  });

  it('is a no-op when no measurement IDs are provided', () => {
    render(<DeferredAnalytics />);
    window.dispatchEvent(new Event('pointerdown'));
    expect(document.querySelectorAll('script[src]')).toHaveLength(0);
  });
});

import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import BookEstimateVisitButton, {
  BOOKING_BUTTON_LABEL,
  BOOKING_EMBED_READY_TIMEOUT_MS,
  BOOKING_NAMESPACE,
} from './BookEstimateVisitButton';

/**
 * Uses the real vendored getCalApi. The embed host is the reserved
 * booking.example.com name and jsdom does not load the script.
 */

const PILOT = 'https://booking.example.com/real-elite/free-estimate-visit';
const EMBED_SRC = 'https://booking.example.com/embed/embed.js';
const FALLBACK = 'The booking calendar did not open. Call or use the estimate form.';

type NamespaceQueue = { q?: ArrayLike<unknown>[] };

function calGlobal(): { loaded?: boolean; ns?: Record<string, NamespaceQueue> } | undefined {
  return (window as unknown as { Cal?: { loaded?: boolean; ns?: Record<string, NamespaceQueue> } }).Cal;
}

function embedScript(): HTMLScriptElement | null {
  const found = document.querySelector(`script[src="${EMBED_SRC}"]`);
  return found instanceof HTMLScriptElement ? found : null;
}

function modalQueued(): boolean {
  const queue = calGlobal()?.ns?.[BOOKING_NAMESPACE]?.q;
  if (!queue) return false;
  return Array.from(queue).some((entry) => entry[0] === 'modal');
}

afterEach(() => {
  delete process.env.NEXT_PUBLIC_BOOKING_URL;
  delete (window as unknown as { Cal?: unknown }).Cal;
  document.querySelectorAll('script').forEach((node) => {
    if (node instanceof HTMLScriptElement && node.src.includes('/embed/embed.js')) node.remove();
  });
  vi.useRealTimers();
});

describe('BookEstimateVisitButton embed load failure', () => {
  it('shows the fallback when the embed script errors, then a later click can load it', async () => {
    process.env.NEXT_PUBLIC_BOOKING_URL = PILOT;
    const user = userEvent.setup();
    render(<BookEstimateVisitButton />);

    await user.click(screen.getByRole('button', { name: BOOKING_BUTTON_LABEL }));

    const failed = embedScript();
    expect(failed).not.toBeNull();
    expect(modalQueued()).toBe(false);

    failed?.dispatchEvent(new Event('error'));

    expect(await screen.findByRole('alert')).toHaveTextContent(FALLBACK);
    expect(embedScript()).toBeNull();
    expect(calGlobal()?.loaded).toBe(false);
    expect(modalQueued()).toBe(false);

    await user.click(screen.getByRole('button', { name: BOOKING_BUTTON_LABEL }));

    const retried = embedScript();
    expect(retried).not.toBeNull();
    expect(retried).not.toBe(failed);
    expect(modalQueued()).toBe(false);

    retried?.dispatchEvent(new Event('load'));

    await act(async () => {
      await Promise.resolve();
    });

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(modalQueued()).toBe(true);
    expect(calGlobal()?.loaded).toBe(true);
  });

  it('shows the fallback when the embed script does not become ready before the timeout', async () => {
    vi.useFakeTimers();
    process.env.NEXT_PUBLIC_BOOKING_URL = PILOT;
    render(<BookEstimateVisitButton />);

    await act(async () => {
      screen.getByRole('button', { name: BOOKING_BUTTON_LABEL }).click();
    });

    expect(embedScript()).not.toBeNull();
    expect(modalQueued()).toBe(false);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(BOOKING_EMBED_READY_TIMEOUT_MS);
    });

    expect(screen.getByRole('alert')).toHaveTextContent(FALLBACK);
    expect(embedScript()).toBeNull();
    expect(calGlobal()?.loaded).toBe(false);
    expect(modalQueued()).toBe(false);

    await act(async () => {
      screen.getByRole('button', { name: BOOKING_BUTTON_LABEL }).click();
    });

    expect(embedScript()).not.toBeNull();
    expect(calGlobal()?.loaded).toBe(true);
  });
});

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import SalesCommandCenter from './SalesCommandCenter';
import { ADMIN_KEY_STORAGE } from '@/lib/admin-key-storage';

const fetchMock = vi.fn();

beforeEach(() => {
  fetchMock.mockReset();
  fetchMock.mockResolvedValue(new Response(JSON.stringify({ leads: [] }), { status: 200 }));
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  window.localStorage.clear();
  window.sessionStorage.clear();
  window.history.replaceState(null, '', '/');
  vi.unstubAllGlobals();
});

describe('SalesCommandCenter key handling (audit M1)', () => {
  it('clears a legacy localStorage key and strips ?key= from the URL on load', () => {
    window.localStorage.setItem(ADMIN_KEY_STORAGE, 'legacy-key');
    window.history.replaceState(null, '', '/sales?key=legacy-key&bucket=hot');
    render(<SalesCommandCenter />);
    expect(window.localStorage.getItem(ADMIN_KEY_STORAGE)).toBeNull();
    expect(window.location.href).not.toContain('legacy-key');
    expect(window.location.search).toBe('?bucket=hot');
    // The legacy key is not silently reused.
    expect((screen.getByLabelText('Access key') as HTMLInputElement).value).toBe('');
  });

  it('sends the key as a Bearer header, never in the URL, and keeps it in sessionStorage', async () => {
    render(<SalesCommandCenter />);
    fireEvent.change(screen.getByLabelText('Access key'), { target: { value: 'typed-key' } });
    fireEvent.click(screen.getByRole('button', { name: /open pipeline/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('/api/sales/leads?bucket=all');
    expect(url).not.toContain('key');
    expect((init.headers as Record<string, string>).authorization).toBe('Bearer typed-key');

    await waitFor(() => expect(window.sessionStorage.getItem(ADMIN_KEY_STORAGE)).toBe('typed-key'));
    expect(window.localStorage.getItem(ADMIN_KEY_STORAGE)).toBeNull();
    expect(window.location.href).not.toContain('typed-key');
  });

  it('prefills from sessionStorage', () => {
    window.sessionStorage.setItem(ADMIN_KEY_STORAGE, 'session-key');
    render(<SalesCommandCenter />);
    expect((screen.getByLabelText('Access key') as HTMLInputElement).value).toBe('session-key');
  });

  it('asks for a key instead of calling the API with none', () => {
    render(<SalesCommandCenter />);
    fireEvent.click(screen.getByRole('button', { name: /open pipeline/i }));
    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.getByText('Enter the access key.')).toBeInTheDocument();
  });
});

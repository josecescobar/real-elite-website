import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ReviewRequestTool from './ReviewRequestTool';
import { ADMIN_KEY_STORAGE } from '@/lib/admin-key-storage';

const fetchMock = vi.fn();

beforeEach(() => {
  fetchMock.mockReset();
  fetchMock.mockResolvedValue(new Response(JSON.stringify({ message: 'Review request sent.' }), { status: 200 }));
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  window.localStorage.clear();
  window.sessionStorage.clear();
  vi.unstubAllGlobals();
});

describe('ReviewRequestTool key handling (audit M1)', () => {
  it('clears a legacy localStorage key on load and does not reuse it', () => {
    window.localStorage.setItem(ADMIN_KEY_STORAGE, 'legacy-key');
    render(<ReviewRequestTool />);
    expect(window.localStorage.getItem(ADMIN_KEY_STORAGE)).toBeNull();
    expect((screen.getByLabelText('Access key') as HTMLInputElement).value).toBe('');
  });

  it('posts the key in the body and keeps it in sessionStorage, not localStorage', async () => {
    render(<ReviewRequestTool />);
    fireEvent.change(screen.getByLabelText('Access key'), { target: { value: 'typed-key' } });
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'Pat' } });
    fireEvent.change(screen.getByLabelText(/customer phone/i), { target: { value: '3045550100' } });
    fireEvent.submit(screen.getByLabelText('Access key').closest('form')!);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('/api/review-request');
    expect(init.method).toBe('POST');
    expect(JSON.parse(String(init.body)).key).toBe('typed-key');

    await waitFor(() => expect(window.sessionStorage.getItem(ADMIN_KEY_STORAGE)).toBe('typed-key'));
    expect(window.localStorage.getItem(ADMIN_KEY_STORAGE)).toBeNull();
  });
});

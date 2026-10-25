import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import RoofQuoteTool from './RoofQuoteTool';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function stubMeasure(status: number, body: unknown) {
  vi.stubGlobal(
    'fetch',
    vi.fn(
      async () =>
        new Response(JSON.stringify(body), {
          status,
          headers: { 'content-type': 'application/json' },
        })
    )
  );
}

async function submitAddress() {
  render(<RoofQuoteTool />);
  fireEvent.change(screen.getByLabelText(/home address/i), {
    target: { value: '123 Main St, Martinsburg, WV 25401' },
  });
  fireEvent.click(screen.getByRole('button', { name: /measure my roof/i }));
}

describe('RoofQuoteTool when Google cannot measure', () => {
  it('continues from a reached daily cap into the questions and the lead form', async () => {
    stubMeasure(200, { covered: false, reason: 'cap_reached' });
    await submitAddress();

    expect(await screen.findByRole('heading', { name: /quick questions/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /find your roof/i })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /under 1,500 sq ft/i }));
    fireEvent.click(screen.getByRole('button', { name: '1 story' }));
    fireEvent.click(screen.getByRole('button', { name: /^simple/i }));
    fireEvent.click(screen.getByRole('button', { name: /see my estimate/i }));

    expect(await screen.findByRole('heading', { name: /pick your roofing material/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /architectural shingles/i }));
    fireEvent.click(screen.getByRole('button', { name: /get this in writing/i }));

    expect(await screen.findByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it('leaves the address step when the shared counter is unavailable, even on 429', async () => {
    stubMeasure(429, {
      error:
        "We've reached today's roof measurement limit. Call (681) 534-5515 and we'll measure it with you.",
      reason: 'counter_unavailable',
    });
    await submitAddress();

    expect(await screen.findByRole('heading', { name: /quick questions/i })).toBeInTheDocument();
    expect(screen.queryByText(/roof measurement limit/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /find your roof/i })).not.toBeInTheDocument();
  });

  it('stays on the address step for a per-IP rate limit', async () => {
    stubMeasure(429, { error: 'Too many requests. Please try again later.' });
    await submitAddress();

    expect(await screen.findByText(/too many requests/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /find your roof/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /quick questions/i })).not.toBeInTheDocument();
  });
});

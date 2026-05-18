// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EstimateForm from './EstimateForm';

function mockFetchOk() {
  const fetchMock = vi.fn(async () =>
    new Response(JSON.stringify({ message: 'ok' }), { status: 200 }),
  );
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

function mockFetchFail() {
  const fetchMock = vi.fn(async () =>
    new Response(JSON.stringify({ error: 'nope' }), { status: 500 }),
  );
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/full name/i), 'Jane Homeowner');
  await user.type(screen.getByLabelText(/email/i), 'jane@example.com');
  await user.type(screen.getByLabelText(/phone/i), '(304) 555-0123');
  await user.selectOptions(screen.getByLabelText(/service/i), 'roofing');
  await user.type(
    screen.getByLabelText(/project details/i),
    'Need a new roof, please send help.',
  );
}

beforeEach(() => {
  vi.useRealTimers();
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('EstimateForm', () => {
  it('renders every required field with proper labels and autocomplete', () => {
    render(<EstimateForm />);
    expect(screen.getByLabelText(/full name/i)).toHaveAttribute('autocomplete', 'name');
    expect(screen.getByLabelText(/email/i)).toHaveAttribute('autocomplete', 'email');
    expect(screen.getByLabelText(/phone/i)).toHaveAttribute('autocomplete', 'tel');
    expect(screen.getByLabelText(/service/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/project details/i)).toBeInTheDocument();
  });

  it('keeps the honeypot field present but visually hidden', () => {
    const { container } = render(<EstimateForm />);
    const honeypot = container.querySelector('input[name="website"]');
    expect(honeypot).not.toBeNull();
    // The honeypot wrapper carries aria-hidden so SRs skip it.
    expect(honeypot?.closest('[aria-hidden="true"]')).not.toBeNull();
  });

  it('pre-selects the service prop when provided', () => {
    render(<EstimateForm service="decks" />);
    expect((screen.getByLabelText(/service/i) as HTMLSelectElement).value).toBe('decks');
  });

  it('shows validation errors and marks inputs invalid when submitting empty', async () => {
    const user = userEvent.setup();
    const fetchMock = mockFetchOk();
    render(<EstimateForm />);

    await user.click(screen.getByRole('button', { name: /book free estimate/i }));

    expect(screen.getByText(/full name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/phone number is required/i)).toBeInTheDocument();
    expect(screen.getByText(/please select a service/i)).toBeInTheDocument();
    expect(screen.getByText(/message is required/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/full name/i)).toHaveAttribute('aria-invalid', 'true');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects malformed email addresses', async () => {
    const user = userEvent.setup();
    mockFetchOk();
    render(<EstimateForm />);

    await fillValidForm(user);
    const email = screen.getByLabelText(/email/i);
    await user.clear(email);
    await user.type(email, 'not-an-email');

    await user.click(screen.getByRole('button', { name: /book free estimate/i }));
    expect(screen.getByText(/valid email address/i)).toBeInTheDocument();
  });

  it('clears a field error as soon as the user edits that field', async () => {
    const user = userEvent.setup();
    mockFetchOk();
    render(<EstimateForm />);

    await user.click(screen.getByRole('button', { name: /book free estimate/i }));
    expect(screen.getByText(/full name is required/i)).toBeInTheDocument();

    await user.type(screen.getByLabelText(/full name/i), 'J');
    expect(screen.queryByText(/full name is required/i)).not.toBeInTheDocument();
  });

  it('submits to /api/estimate with the right payload and shows the success state', async () => {
    const user = userEvent.setup();
    const fetchMock = mockFetchOk();
    render(<EstimateForm service="siding" />);

    await user.type(screen.getByLabelText(/full name/i), 'Jane Homeowner');
    await user.type(screen.getByLabelText(/email/i), 'jane@example.com');
    await user.type(screen.getByLabelText(/phone/i), '(304) 555-0123');
    // service is pre-filled by the prop
    await user.type(
      screen.getByLabelText(/project details/i),
      'Need a new roof, please send help.',
    );

    await user.click(screen.getByRole('button', { name: /book free estimate/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledOnce();
    });
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('/api/estimate');
    const body = JSON.parse(init.body as string);
    expect(body).toMatchObject({
      fullName: 'Jane Homeowner',
      email: 'jane@example.com',
      phone: '(304) 555-0123',
      service: 'siding',
      website: '',
    });

    expect(await screen.findByRole('status')).toHaveTextContent(/thank you/i);
  });

  it('shows a recovery message and keeps the form when the API fails', async () => {
    const user = userEvent.setup();
    mockFetchFail();
    render(<EstimateForm />);
    await fillValidForm(user);

    await user.click(screen.getByRole('button', { name: /book free estimate/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/something went wrong/i);
    // Form is still present, not replaced by the success state.
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
  });
});

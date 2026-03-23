import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EstimateForm from './EstimateForm';

// Mock the constants module
vi.mock('@/lib/constants', () => ({
  SERVICES: [
    { title: 'Roofing', slug: 'roofing', description: 'Roofing services', icon: 'Home' },
    { title: 'Siding', slug: 'siding', description: 'Siding services', icon: 'Layers' },
  ],
}));

const fillForm = async (user: ReturnType<typeof userEvent.setup>, overrides: Record<string, string> = {}) => {
  const defaults = {
    fullName: 'John Smith',
    email: 'john@example.com',
    phone: '(304) 555-0123',
    service: 'Roofing',
    message: 'I need a new roof installed on my home.',
  };
  const values = { ...defaults, ...overrides };

  if (values.fullName) await user.type(screen.getByLabelText(/full name/i), values.fullName);
  if (values.email) await user.type(screen.getByLabelText(/email/i), values.email);
  if (values.phone) await user.type(screen.getByLabelText(/phone/i), values.phone);
  if (values.service) await user.selectOptions(screen.getByLabelText(/service/i), values.service);
  if (values.message) await user.type(screen.getByLabelText(/project details/i), values.message);
};

describe('EstimateForm', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it('renders all form fields', () => {
    render(<EstimateForm />);

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/service/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/project details/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /book free estimate/i })).toBeInTheDocument();
  });

  it('pre-selects service when passed as prop', () => {
    render(<EstimateForm service="roofing" />);

    const select = screen.getByLabelText(/service/i) as HTMLSelectElement;
    expect(select.value).toBe('roofing');
  });

  it('renders service options from constants', () => {
    render(<EstimateForm />);

    const select = screen.getByLabelText(/service/i);
    expect(select).toContainHTML('Roofing');
    expect(select).toContainHTML('Siding');
  });

  describe('validation - required fields', () => {
    it('shows error when full name is empty', async () => {
      render(<EstimateForm />);

      await user.click(screen.getByRole('button', { name: /book free estimate/i }));

      expect(screen.getByText('Full name is required')).toBeInTheDocument();
    });

    it('shows error when email is empty', async () => {
      render(<EstimateForm />);

      await user.click(screen.getByRole('button', { name: /book free estimate/i }));

      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });

    it('shows error when phone is empty', async () => {
      render(<EstimateForm />);

      await user.click(screen.getByRole('button', { name: /book free estimate/i }));

      expect(screen.getByText('Phone number is required')).toBeInTheDocument();
    });

    it('shows error when service is not selected', async () => {
      render(<EstimateForm />);

      await user.click(screen.getByRole('button', { name: /book free estimate/i }));

      expect(screen.getByText('Please select a service')).toBeInTheDocument();
    });

    it('shows error when message is empty', async () => {
      render(<EstimateForm />);

      await user.click(screen.getByRole('button', { name: /book free estimate/i }));

      expect(screen.getByText('Message is required')).toBeInTheDocument();
    });

    it('shows all errors at once when all fields are empty', async () => {
      render(<EstimateForm />);

      await user.click(screen.getByRole('button', { name: /book free estimate/i }));

      expect(screen.getByText('Full name is required')).toBeInTheDocument();
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Phone number is required')).toBeInTheDocument();
      expect(screen.getByText('Please select a service')).toBeInTheDocument();
      expect(screen.getByText('Message is required')).toBeInTheDocument();
    });
  });

  describe('validation - email format', () => {
    it('rejects email without @ symbol', async () => {
      render(<EstimateForm />);

      // Use fireEvent.change + fireEvent.submit to bypass jsdom's native
      // constraint validation on type="email" inputs
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'invalidemail', name: 'email' },
      });
      fireEvent.submit(screen.getByRole('button', { name: /book free estimate/i }).closest('form')!);

      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });

    it('rejects email without domain', async () => {
      render(<EstimateForm />);

      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'user@', name: 'email' },
      });
      fireEvent.submit(screen.getByRole('button', { name: /book free estimate/i }).closest('form')!);

      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });

    it('accepts a valid email', async () => {
      render(<EstimateForm />);

      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.click(screen.getByRole('button', { name: /book free estimate/i }));

      expect(screen.queryByText('Please enter a valid email address')).not.toBeInTheDocument();
      expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
    });
  });

  describe('validation - phone format', () => {
    it('rejects phone with letters', async () => {
      render(<EstimateForm />);

      await user.type(screen.getByLabelText(/phone/i), 'abc-def-ghij');
      await user.click(screen.getByRole('button', { name: /book free estimate/i }));

      expect(screen.getByText('Please enter a valid phone number')).toBeInTheDocument();
    });

    it('accepts phone with parentheses and dashes', async () => {
      render(<EstimateForm />);

      await user.type(screen.getByLabelText(/phone/i), '(304) 555-0123');
      await user.click(screen.getByRole('button', { name: /book free estimate/i }));

      expect(screen.queryByText('Please enter a valid phone number')).not.toBeInTheDocument();
      expect(screen.queryByText('Phone number is required')).not.toBeInTheDocument();
    });

    it('accepts phone with plus and country code', async () => {
      render(<EstimateForm />);

      await user.type(screen.getByLabelText(/phone/i), '+1-304-555-0123');
      await user.click(screen.getByRole('button', { name: /book free estimate/i }));

      expect(screen.queryByText('Please enter a valid phone number')).not.toBeInTheDocument();
    });
  });

  describe('validation - message length', () => {
    it('rejects message shorter than 10 characters', async () => {
      render(<EstimateForm />);

      await user.type(screen.getByLabelText(/project details/i), 'Short');
      await user.click(screen.getByRole('button', { name: /book free estimate/i }));

      expect(screen.getByText('Message must be at least 10 characters')).toBeInTheDocument();
    });

    it('accepts message with exactly 10 characters', async () => {
      render(<EstimateForm />);

      await user.type(screen.getByLabelText(/project details/i), '1234567890');
      await user.click(screen.getByRole('button', { name: /book free estimate/i }));

      expect(screen.queryByText('Message must be at least 10 characters')).not.toBeInTheDocument();
      expect(screen.queryByText('Message is required')).not.toBeInTheDocument();
    });
  });

  describe('error clearing', () => {
    it('clears field error when user starts typing', async () => {
      render(<EstimateForm />);

      // Trigger validation
      await user.click(screen.getByRole('button', { name: /book free estimate/i }));
      expect(screen.getByText('Full name is required')).toBeInTheDocument();

      // Type in the field
      await user.type(screen.getByLabelText(/full name/i), 'J');

      expect(screen.queryByText('Full name is required')).not.toBeInTheDocument();
    });
  });

  describe('form submission', () => {
    it('shows success message after valid submission', async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      const timedUser = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<EstimateForm />);

      await timedUser.type(screen.getByLabelText(/full name/i), 'John Smith');
      await timedUser.type(screen.getByLabelText(/email/i), 'john@example.com');
      await timedUser.type(screen.getByLabelText(/phone/i), '3045550123');
      await timedUser.selectOptions(screen.getByLabelText(/service/i), 'roofing');
      await timedUser.type(screen.getByLabelText(/project details/i), 'I need a new roof installed.');

      await timedUser.click(screen.getByRole('button', { name: /book free estimate/i }));

      // Advance past the simulated API call
      await vi.advanceTimersByTimeAsync(1100);

      await waitFor(() => {
        expect(screen.getByText('Thank You!')).toBeInTheDocument();
      });

      vi.useRealTimers();
    });

    it('shows "Sending..." text while submitting', async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      const timedUser = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<EstimateForm />);

      await timedUser.type(screen.getByLabelText(/full name/i), 'John Smith');
      await timedUser.type(screen.getByLabelText(/email/i), 'john@example.com');
      await timedUser.type(screen.getByLabelText(/phone/i), '3045550123');
      await timedUser.selectOptions(screen.getByLabelText(/service/i), 'roofing');
      await timedUser.type(screen.getByLabelText(/project details/i), 'I need a new roof installed.');

      await timedUser.click(screen.getByRole('button', { name: /book free estimate/i }));

      expect(screen.getByRole('button', { name: /sending/i })).toBeInTheDocument();

      await vi.advanceTimersByTimeAsync(1100);
      vi.useRealTimers();
    });

    it('does not submit when validation fails', async () => {
      const consoleSpy = vi.spyOn(console, 'log');
      render(<EstimateForm />);

      await user.click(screen.getByRole('button', { name: /book free estimate/i }));

      expect(consoleSpy).not.toHaveBeenCalledWith('Form submitted:', expect.anything());
      consoleSpy.mockRestore();
    });
  });
});

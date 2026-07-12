import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MultiStepEstimateForm from './MultiStepEstimateForm';

vi.mock('lucide-react', () => ({
  ArrowLeft: () => <span data-testid="arrow-left">←</span>,
  ArrowRight: () => <span data-testid="arrow-right">→</span>,
  Check: () => <span data-testid="check">✓</span>,
  BookOpen: () => <span data-testid="book-open">📖</span>,
  Phone: () => <span data-testid="phone">📞</span>,
}));

vi.mock('@/lib/analytics', () => ({
  trackEvent: vi.fn(),
  trackEstimateStep: vi.fn(),
  trackLead: vi.fn(),
}));

vi.mock('@/lib/constants', () => ({
  BUSINESS: { phone: '(681) 534-5515', phoneRaw: '+16815345515' },
}));

const fillStep1 = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.selectOptions(screen.getByLabelText(/service/i), 'roofing');
  fireEvent.change(screen.getByLabelText(/zip/i), { target: { value: '25401' } });
};

const advancePastStep1 = async (user: ReturnType<typeof userEvent.setup>) => {
  await fillStep1(user);
  await user.click(screen.getByRole('button', { name: /continue/i }));
};

const fillStep2 = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole('button', { name: /single-family/i }));
  await user.selectOptions(screen.getByLabelText(/timeline/i), 'asap');
};

const advancePastStep2 = async (user: ReturnType<typeof userEvent.setup>) => {
  await fillStep2(user);
  await user.click(screen.getByRole('button', { name: /continue/i }));
};

const fillStep3 = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByLabelText(/full name/i), 'John Smith');
  await user.type(screen.getByLabelText(/phone/i), '3045550123');
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
};

describe('MultiStepEstimateForm', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    vi.restoreAllMocks();
    vi.stubGlobal('fetch', vi.fn());
  });

  describe('step 1 - service & ZIP', () => {
    it('renders step 1 by default', () => {
      render(<MultiStepEstimateForm />);
      expect(screen.getByText(/what can we build/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/service/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/zip/i)).toBeInTheDocument();
      expect(screen.getByText('Step 1 of 3')).toBeInTheDocument();
    });

    it('shows service options in dropdown', () => {
      render(<MultiStepEstimateForm />);
      expect(screen.getByRole('option', { name: /roofing/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /kitchen remodel/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /decks/i })).toBeInTheDocument();
    });

    it('pre-selects service when initialService is passed', () => {
      render(<MultiStepEstimateForm initialService="roofing" />);
      expect((screen.getByLabelText(/service/i) as HTMLSelectElement).value).toBe('roofing');
    });

    it('shows error when service is not selected', async () => {
      render(<MultiStepEstimateForm />);
      await user.click(screen.getByRole('button', { name: /continue/i }));
      expect(document.getElementById('service-error')).toHaveTextContent(/pick the service/i);
    });

    it('shows error when ZIP is empty', async () => {
      render(<MultiStepEstimateForm />);
      await user.selectOptions(screen.getByLabelText(/service/i), 'roofing');
      await user.click(screen.getByRole('button', { name: /continue/i }));
      expect(screen.getByText(/zip code is required/i)).toBeInTheDocument();
    });

    it('shows error for invalid ZIP format', async () => {
      render(<MultiStepEstimateForm />);
      await user.selectOptions(screen.getByLabelText(/service/i), 'roofing');
      fireEvent.change(screen.getByLabelText(/zip/i), { target: { value: '123' } });
      await user.click(screen.getByRole('button', { name: /continue/i }));
      expect(screen.getByText(/enter a valid zip/i)).toBeInTheDocument();
    });

    it('accepts ZIP+4 format', async () => {
      render(<MultiStepEstimateForm />);
      await user.selectOptions(screen.getByLabelText(/service/i), 'roofing');
      fireEvent.change(screen.getByLabelText(/zip/i), { target: { value: '25401-1234' } });
      await user.click(screen.getByRole('button', { name: /continue/i }));
      expect(screen.queryByText(/enter a valid zip/i)).not.toBeInTheDocument();
      expect(screen.getByText(/a few project details/i)).toBeInTheDocument();
    });

    it('advances to step 2 when valid', async () => {
      render(<MultiStepEstimateForm />);
      await advancePastStep1(user);
      expect(screen.getByText(/a few project details/i)).toBeInTheDocument();
      expect(screen.getByText('Step 2 of 3')).toBeInTheDocument();
    });

    it('clears error when user corrects the field', async () => {
      render(<MultiStepEstimateForm />);
      await user.click(screen.getByRole('button', { name: /continue/i }));
      expect(document.getElementById('service-error')).toHaveTextContent(/pick the service/i);

      await user.selectOptions(screen.getByLabelText(/service/i), 'roofing');
      expect(document.getElementById('service-error')).not.toBeInTheDocument();
    });

    it('does not show Back button on step 1', () => {
      render(<MultiStepEstimateForm />);
      expect(screen.queryByRole('button', { name: /back/i })).not.toBeInTheDocument();
    });
  });

  describe('step 2 - project details', () => {
    it('renders property type, timeline, budget, and scope fields', async () => {
      render(<MultiStepEstimateForm />);
      await advancePastStep1(user);

      expect(screen.getByRole('button', { name: /single-family/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /townhouse/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/timeline/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/budget range/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/tell us about the project/i)).toBeInTheDocument();
    });

    it('shows error when property type is not selected', async () => {
      render(<MultiStepEstimateForm />);
      await advancePastStep1(user);
      await user.click(screen.getByRole('button', { name: /continue/i }));
      expect(screen.getByText(/pick a property type/i)).toBeInTheDocument();
    });

    it('shows error when timeline is not selected', async () => {
      render(<MultiStepEstimateForm />);
      await advancePastStep1(user);
      await user.click(screen.getByRole('button', { name: /single-family/i }));
      await user.click(screen.getByRole('button', { name: /continue/i }));
      expect(screen.getByText(/roughly when/i)).toBeInTheDocument();
    });

    it('highlights the selected property type button', async () => {
      render(<MultiStepEstimateForm />);
      await advancePastStep1(user);

      const btn = screen.getByRole('button', { name: /single-family/i });
      expect(btn).toHaveAttribute('aria-pressed', 'false');

      await user.click(btn);
      expect(btn).toHaveAttribute('aria-pressed', 'true');
    });

    it('does not require budget or scope', async () => {
      render(<MultiStepEstimateForm />);
      await advancePastStep1(user);
      await fillStep2(user);
      await user.click(screen.getByRole('button', { name: /continue/i }));
      expect(screen.getByText(/where do we send/i)).toBeInTheDocument();
    });

    it('shows Back button and navigates back to step 1', async () => {
      render(<MultiStepEstimateForm />);
      await advancePastStep1(user);

      await user.click(screen.getByRole('button', { name: /back/i }));
      expect(screen.getByText(/what can we build/i)).toBeInTheDocument();
    });

    it('advances to step 3 when valid', async () => {
      render(<MultiStepEstimateForm />);
      await advancePastStep1(user);
      await advancePastStep2(user);
      expect(screen.getByText(/where do we send/i)).toBeInTheDocument();
      expect(screen.getByText('Step 3 of 3')).toBeInTheDocument();
    });
  });

  describe('step 3 - contact info & submission', () => {
    const goToStep3 = async () => {
      render(<MultiStepEstimateForm />);
      await advancePastStep1(user);
      await advancePastStep2(user);
    };

    it('renders name, phone, and email fields', async () => {
      await goToStep3();
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });

    it('shows submit button instead of continue', async () => {
      await goToStep3();
      expect(screen.getByRole('button', { name: /get my free estimate/i })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /continue/i })).not.toBeInTheDocument();
    });

    it('shows error when name is empty', async () => {
      await goToStep3();
      fireEvent.submit(screen.getByRole('button', { name: /get my free estimate/i }).closest('form')!);
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    });

    it('shows error when phone is empty', async () => {
      await goToStep3();
      fireEvent.submit(screen.getByRole('button', { name: /get my free estimate/i }).closest('form')!);
      expect(screen.getByText(/phone is required/i)).toBeInTheDocument();
    });

    it('shows error for invalid phone', async () => {
      await goToStep3();
      await user.type(screen.getByLabelText(/full name/i), 'John');
      await user.type(screen.getByLabelText(/phone/i), '123');
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
      fireEvent.submit(screen.getByRole('button', { name: /get my free estimate/i }).closest('form')!);
      expect(screen.getByText(/enter a valid phone/i)).toBeInTheDocument();
    });

    it('shows error when email is empty', async () => {
      await goToStep3();
      fireEvent.submit(screen.getByRole('button', { name: /get my free estimate/i }).closest('form')!);
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });

    it('shows error for invalid email', async () => {
      await goToStep3();
      await user.type(screen.getByLabelText(/full name/i), 'John');
      await user.type(screen.getByLabelText(/phone/i), '3045550123');
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'notanemail' } });
      fireEvent.submit(screen.getByRole('button', { name: /get my free estimate/i }).closest('form')!);
      expect(screen.getByText(/enter a valid email/i)).toBeInTheDocument();
    });

    it('submits successfully and shows confirmation', async () => {
      vi.mocked(fetch).mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), { status: 200 }));
      await goToStep3();
      await fillStep3(user);

      fireEvent.submit(screen.getByRole('button', { name: /get my free estimate/i }).closest('form')!);

      await waitFor(() => {
        expect(screen.getByRole('status')).toHaveTextContent(/request received/i);
        expect(screen.getByRole('status')).toHaveFocus();
      });
    });

    it('links the contact disclosure to the privacy policy', async () => {
      await goToStep3();
      expect(screen.getByRole('link', { name: /privacy policy/i })).toHaveAttribute(
        'href',
        '/privacy'
      );
    });

    it('shows "Sending…" while submitting', async () => {
      let resolveReq: (v: Response) => void;
      vi.mocked(fetch).mockReturnValueOnce(new Promise((r) => { resolveReq = r; }));
      await goToStep3();
      await fillStep3(user);

      fireEvent.submit(screen.getByRole('button', { name: /get my free estimate/i }).closest('form')!);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /sending/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sending/i })).toBeDisabled();
      });

      resolveReq!(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    });

    it('shows error message on API failure', async () => {
      vi.mocked(fetch).mockResolvedValueOnce(new Response(JSON.stringify({ error: 'Server error' }), { status: 500 }));
      await goToStep3();
      await fillStep3(user);

      fireEvent.submit(screen.getByRole('button', { name: /get my free estimate/i }).closest('form')!);

      await waitFor(() => {
        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
      });
    });

    it('shows error message on network failure', async () => {
      vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));
      await goToStep3();
      await fillStep3(user);

      fireEvent.submit(screen.getByRole('button', { name: /get my free estimate/i }).closest('form')!);

      await waitFor(() => {
        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
      });
    });

    it('sends correct payload to API', async () => {
      vi.mocked(fetch).mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), { status: 200 }));
      await goToStep3();
      await fillStep3(user);

      fireEvent.submit(screen.getByRole('button', { name: /get my free estimate/i }).closest('form')!);

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/estimate', expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }));
        const body = JSON.parse((fetch as ReturnType<typeof vi.fn>).mock.calls[0][1].body);
        expect(body.fullName).toBe('John Smith');
        expect(body.phone).toBe('3045550123');
        expect(body.email).toBe('john@example.com');
        expect(body.service).toBe('Roofing');
        expect(body.zip).toBe('25401');
        expect(body.propertyType).toBe('Single-family home');
        expect(body.timeline).toBe('ASAP / Within a month');
      });
    });
  });

  describe('progress bar', () => {
    it('shows correct progress for each step', async () => {
      render(<MultiStepEstimateForm />);
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1');

      await advancePastStep1(user);
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '2');

      await advancePastStep2(user);
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '3');
    });
  });
});

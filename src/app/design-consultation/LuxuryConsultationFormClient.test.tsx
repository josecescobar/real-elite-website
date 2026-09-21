import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { trackEstimateStep, trackEvent, trackLead } from '@/lib/analytics';
import { primaryCtaForService } from '@/lib/cta-intent';
import LuxuryConsultationFormClient from './LuxuryConsultationFormClient';

const navigation = vi.hoisted(() => ({ query: '' }));

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(navigation.query),
}));

vi.mock('@/lib/analytics', () => ({
  trackEvent: vi.fn(),
  trackEstimateStep: vi.fn(),
  trackLead: vi.fn(),
}));

vi.mock('@/lib/attribution', () => ({
  attributionPayload: () => ({
    utm_source: 'loudoun-campaign',
    landing_page: '/services/decks/loudoun-county-va',
  }),
}));

function renderDeckConsultation() {
  const cta = primaryCtaForService('decks', {
    luxuryMarket: true,
    consultationType: 'outdoor-living',
  });
  navigation.query = new URL(cta.href, 'https://www.realelitecontracting.com').search;
  render(<LuxuryConsultationFormClient />);
}

function completeIntake(budget: string) {
  fireEvent.change(screen.getByLabelText('Investment range'), { target: { value: budget } });
  fireEvent.change(screen.getByLabelText('Project timeline'), { target: { value: '3-6' } });
  fireEvent.click(screen.getByRole('button', { name: 'Undecided / open to it' }));
  fireEvent.change(screen.getByLabelText("When's a good time to call?"), {
    target: { value: 'next-week' },
  });
  fireEvent.change(screen.getByLabelText('Project ZIP code'), { target: { value: '20147' } });
  fireEvent.change(screen.getByLabelText('Full name'), { target: { value: 'Test Homeowner' } });
  fireEvent.change(screen.getByLabelText('Phone'), { target: { value: '2025550123' } });
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByLabelText(/Project brief/), {
    target: { value: 'A covered deck for our backyard.' },
  });
}

beforeEach(() => {
  navigation.query = '';
  vi.clearAllMocks();
  vi.stubGlobal('fetch', vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('consultation query preselection', () => {
  it.each([
    ['kitchen', 'Kitchen Renovation'],
    ['bathroom', 'Primary Bath / Suite'],
    ['basement', 'Lower-Level Finishing'],
    ['whole-home', 'Whole-Home Renovation'],
    ['addition', 'Addition or Expansion'],
    ['outdoor-living', 'Outdoor Living / Custom Deck'],
    ['other', 'Other Premium Project'],
  ])('preselects %s in the rendered form', (type, label) => {
    navigation.query = `type=${type}`;
    render(<LuxuryConsultationFormClient />);

    const projectChoices = within(screen.getByRole('group', { name: 'Project type' }));
    expect(projectChoices.getByRole('button', { name: label })).toHaveAttribute('aria-pressed', 'true');
    expect(projectChoices.getAllByRole('button', { pressed: true })).toHaveLength(1);
  });

  it.each(['', 'type=', 'type=unknown-project'])('leaves unsupported or absent query %j unselected', (query) => {
    navigation.query = query;
    render(<LuxuryConsultationFormClient />);

    const projectChoices = within(screen.getByRole('group', { name: 'Project type' }));
    expect(projectChoices.queryAllByRole('button', { pressed: true })).toHaveLength(0);
  });
});

describe('outdoor-living consultation submission', () => {
  it.each([
    ['under-25', 'Under $25k'],
    ['25-50', '$25k – $50k'],
  ])('submits the %s budget through the existing lead contract', async (budget, budgetLabel) => {
    vi.mocked(fetch).mockResolvedValue(new Response('{}', { status: 200 }));
    renderDeckConsultation();
    completeIntake(budget);

    fireEvent.click(screen.getByRole('button', { name: 'Request Phone Consultation' }));

    const success = await screen.findByRole('status');
    expect(success).toHaveTextContent("We'll call you.");
    await waitFor(() => expect(success).toHaveFocus());
    expect(fetch).toHaveBeenCalledOnce();
    const [url, request] = vi.mocked(fetch).mock.calls[0];
    expect(url).toBe('/api/estimate');
    expect(request).toMatchObject({ method: 'POST', headers: { 'Content-Type': 'application/json' } });
    expect(JSON.parse(request?.body as string)).toEqual({
      fullName: 'Test Homeowner',
      email: 'test@example.com',
      phone: '2025550123',
      service: '[Luxury Consultation] Outdoor Living / Custom Deck',
      zip: '20147',
      propertyType: 'Designer: Undecided / open to it · Call window: Sometime next week',
      timeline: '3–6 months',
      budgetRange: budgetLabel,
      message: 'A covered deck for our backyard.',
      utm_source: 'loudoun-campaign',
      landing_page: '/services/decks/loudoun-county-va',
      website: '',
    });
    expect(trackEvent).toHaveBeenCalledWith('form_submit', {
      form: 'luxury_consultation', projectType: 'outdoor-living', budget,
    });
    expect(trackLead).toHaveBeenCalledExactlyOnceWith({
      lead_type: 'luxury_consultation',
      service: 'Outdoor Living / Custom Deck',
      value_band: budgetLabel,
    });
    expect(trackEstimateStep).toHaveBeenCalledWith('submit', 1, 'luxury_consultation', {
      projectType: 'outdoor-living', budget,
    });
  });

  it('retains the existing budget options', () => {
    renderDeckConsultation();
    expect(within(screen.getByLabelText('Investment range')).getAllByRole('option').map((option) => [
      (option as HTMLOptionElement).value, option.textContent,
    ])).toEqual([
      ['', 'Select an investment tier…'],
      ['under-25', 'Under $25k'],
      ['25-50', '$25k – $50k'],
      ['50-100', '$50k – $100k'],
      ['100-200', '$100k – $200k'],
      ['200-500', '$200k – $500k'],
      ['500-plus', '$500k+'],
      ['unsure', 'Not sure yet'],
    ]);
  });

  it('keeps the intake after a failed request and records a lead only after a successful retry', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(fetch)
      .mockResolvedValueOnce(new Response('{"error":"Try again"}', { status: 503 }))
      .mockResolvedValueOnce(new Response('{}', { status: 200 }));
    renderDeckConsultation();
    completeIntake('25-50');

    fireEvent.click(screen.getByRole('button', { name: 'Request Phone Consultation' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Something went wrong. Please call');
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Investment range')).toHaveValue('25-50');
    expect(screen.getByLabelText('Full name')).toHaveValue('Test Homeowner');
    expect(trackLead).not.toHaveBeenCalled();
    expect(trackEvent).not.toHaveBeenCalledWith('form_submit', expect.anything());

    const retry = screen.getByRole('button', { name: 'Request Phone Consultation' });
    expect(retry).toBeEnabled();
    fireEvent.click(retry);

    await screen.findByRole('status');
    await waitFor(() => expect(trackLead).toHaveBeenCalledOnce());
    expect(fetch).toHaveBeenCalledTimes(2);
  });
});

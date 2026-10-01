import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const { getCalApi, cal } = vi.hoisted(() => {
  const cal = vi.fn();
  return { cal, getCalApi: vi.fn(async () => cal) };
});

vi.mock('@real-elite/cal-embed', () => ({
  getCalApi,
}));

vi.mock('next/link', () => ({
  default: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => (
    <a {...props}>{children}</a>
  ),
}));

vi.mock('next/image', () => ({
  default: ({ alt }: { alt: string }) => <span role="img" aria-label={alt} />,
}));

import BookEstimateVisitButton, { BOOKING_BUTTON_LABEL } from './BookEstimateVisitButton';

const PILOT = 'http://127.0.0.1:3340/real-elite/free-estimate-visit';

beforeEach(() => {
  delete process.env.NEXT_PUBLIC_BOOKING_URL;
  cal.mockReset();
  getCalApi.mockClear();
  getCalApi.mockResolvedValue(cal);
});

afterEach(() => {
  delete process.env.NEXT_PUBLIC_BOOKING_URL;
});

describe('BookEstimateVisitButton', () => {
  it('renders nothing when NEXT_PUBLIC_BOOKING_URL is unset', () => {
    const { container } = render(<BookEstimateVisitButton />);
    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByRole('button', { name: BOOKING_BUTTON_LABEL })).not.toBeInTheDocument();
  });

  it('opens the Cal.diy modal for the event on the flag URL', async () => {
    process.env.NEXT_PUBLIC_BOOKING_URL = PILOT;
    const user = userEvent.setup();
    render(<BookEstimateVisitButton />);

    await user.click(screen.getByRole('button', { name: BOOKING_BUTTON_LABEL }));

    expect(getCalApi).toHaveBeenCalledWith({
      embedJsUrl: 'http://127.0.0.1:3340/embed/embed.js',
      namespace: 'free-estimate-visit',
    });
    expect(cal).toHaveBeenCalledWith('modal', {
      calLink: 'real-elite/free-estimate-visit',
      calOrigin: 'http://127.0.0.1:3340',
      config: {
        layout: 'month_view',
        useSlotsViewOnSmallScreen: 'true',
      },
    });
  });

  it('stays off the contact page until the flag is set', async () => {
    const { default: ContactPage } = await import('@/app/contact/page');
    render(<ContactPage />);
    expect(screen.queryByRole('button', { name: BOOKING_BUTTON_LABEL })).not.toBeInTheDocument();
  });

  it('shows the button on a main service page when the flag is set', async () => {
    process.env.NEXT_PUBLIC_BOOKING_URL = PILOT;
    const { default: ServicePageTemplate } = await import('@/components/services/ServicePageTemplate');
    const { SERVICE_DATA } = await import('@/lib/services-data');
    render(<ServicePageTemplate data={SERVICE_DATA.roofing} />);
    expect(screen.getAllByRole('button', { name: BOOKING_BUTTON_LABEL }).length).toBeGreaterThan(0);
  });
});

import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { PA_HIC_EXPIRES, PA_HIC_REGISTRATION_NUMBER, paHicRegistrationLine } from '@/lib/claims';
import { CITY_DATA, getServiceArea } from '@/lib/constants';
import { SALES_PA_HIC } from '@/lib/sales/company';
import CityPageTemplate from '@/components/services/CityPageTemplate';

vi.mock('next/link', () => ({
  default: ({ children, ...props }: { children: React.ReactNode; [k: string]: unknown }) => (
    <a {...props}>{children}</a>
  ),
}));

vi.mock('next/image', () => ({
  default: ({ alt }: { alt: string }) => <span role="img" aria-label={alt} />,
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
  notFound: vi.fn(),
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

const PA_TOWNS = [
  'greencastle-pa',
  'chambersburg-pa',
  'fort-loudon-pa',
  'mercersburg-pa',
  'waynesboro-pa',
  'fayetteville-pa',
] as const;

const REGISTRATION_LINE = 'PA HIC #PA225060. Existing-house home improvement only. Expires 2028-09-02.';

describe('Pennsylvania HIC registration', () => {
  it('publishes the number Jose confirmed, and only for existing houses', () => {
    expect(PA_HIC_REGISTRATION_NUMBER).toBe('PA225060');
    expect(PA_HIC_EXPIRES).toBe('2028-09-02');
    expect(paHicRegistrationLine()).toBe(REGISTRATION_LINE);
    expect(paHicRegistrationLine()).not.toMatch(/commercial/i);
  });

  it('uses that same line for contracts and ads', () => {
    expect(SALES_PA_HIC.number).toBe(PA_HIC_REGISTRATION_NUMBER);
    expect(SALES_PA_HIC.line).toBe(paHicRegistrationLine());
  });

  it.each(PA_TOWNS)('shows PA HIC #PA225060 on the %s page', (slug) => {
    const city = getServiceArea(slug);
    expect(city?.status).toBe('active');
    expect(city?.state).toBe('PA');
    const data = CITY_DATA[slug];
    expect(data).toBeTruthy();
    const { container } = render(<CityPageTemplate city={city!} data={data} />);
    const text = container.textContent ?? '';
    expect(text).toContain('PA HIC #PA225060');
    expect(text).toContain('Existing-house home improvement only');
    expect(text).not.toMatch(/commercial (contractor|license|construction)/i);
  });
});

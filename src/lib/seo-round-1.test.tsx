/**
 * Round-1 ranking pages: the title, H1, permit note, and hub link have to be
 * what the page renders, not only what the content file stores.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('next/link', () => ({
  default: ({ children, ...props }: { children: React.ReactNode; [k: string]: unknown }) => (
    <a {...props}>{children}</a>
  ),
}));

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string; [k: string]: unknown }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

vi.mock('next/navigation', () => ({
  notFound: () => {
    throw new Error('notFound');
  },
}));

vi.mock('@/lib/analytics', () => ({
  trackEvent: vi.fn(),
  trackEstimateStep: vi.fn(),
  trackLead: vi.fn(),
}));

const { stub } = vi.hoisted(() => {
  const stub = (name: string) => {
    const Stub = () => <div data-testid={`mock-${name}`} />;
    Stub.displayName = `Stub(${name})`;
    return Stub;
  };
  return { stub };
});

vi.mock('@/components/home/PrecisionProcess', () => ({ default: stub('PrecisionProcess') }));
vi.mock('@/components/home/AssurancesBand', () => ({ default: stub('AssurancesBand') }));
vi.mock('@/components/services/StickyEstimateRail', () => ({ default: stub('StickyEstimateRail') }));
vi.mock('@/components/services/LuxuryConsultationRail', () => ({
  default: stub('LuxuryConsultationRail'),
}));
vi.mock('@/components/services/InvestmentRanges', () => ({ default: stub('InvestmentRanges') }));
vi.mock('@/components/services/RelatedGuides', () => ({ default: stub('RelatedGuides') }));
vi.mock('@/components/blog/RelatedGuides', () => ({ default: stub('RelatedGuides') }));
vi.mock('@/components/projects/RelatedProjectsRail', () => ({
  default: stub('RelatedProjectsRail'),
}));
vi.mock('@/components/reviews/ReviewsSection', () => ({ default: stub('ReviewsSection') }));
vi.mock('@/components/services/OutdoorLivingInspiration', () => ({
  default: stub('OutdoorLivingInspiration'),
}));

import LocalAreasServed from '@/components/services/LocalAreasServed';
import CityPageTemplate from '@/components/services/CityPageTemplate';
import { generateMetadata as cityMetadata } from '@/app/service-areas/[slug]/page';
import { generateMetadata as comboMetadata } from '@/app/services/[service]/[city]/page';
import ComboPage from '@/app/services/[service]/[city]/page';
import { ALL_SERVICE_AREAS, CITY_DATA } from '@/lib/constants';

describe('SEO round 1 ranking pages', () => {
  it('links Martinsburg decks from the decks hub as a visible combo, not only a town URL', () => {
    const { container } = render(
      <LocalAreasServed serviceSlug="decks" serviceTitle="Decks & Outdoor Living" />
    );
    const visible = container.querySelector('a[href="/services/decks/martinsburg-wv"]');
    expect(visible).toBeTruthy();
    expect(visible?.closest('details')).toBeNull();
  });

  it('links Ashburn kitchens and bathrooms from those hubs', () => {
    const kitchens = render(
      <LocalAreasServed serviceSlug="kitchens" serviceTitle="Kitchen Remodeling" />
    );
    expect(
      kitchens.container.querySelector('a[href="/services/kitchens/ashburn-va"]')
    ).toBeTruthy();
    kitchens.unmount();
    const baths = render(
      <LocalAreasServed serviceSlug="bathrooms" serviceTitle="Bathroom Remodeling" />
    );
    expect(
      baths.container.querySelector('a[href="/services/bathrooms/ashburn-va"]')
    ).toBeTruthy();
  });

  it('uses the authored Martinsburg contractor title and H1', async () => {
    const meta = await cityMetadata({ params: Promise.resolve({ slug: 'martinsburg-wv' }) });
    expect(meta.title).toBe('General Contractor Martinsburg WV | Real Elite Contracting');
    expect(String(meta.description).toLowerCase()).toContain('general contractor martinsburg wv');
    expect(String(meta.description).length).toBeLessThanOrEqual(160);

    const area = ALL_SERVICE_AREAS.find((row) => row.slug === 'martinsburg-wv');
    if (!area) throw new Error('missing Martinsburg catalog row');
    render(<CityPageTemplate city={area} data={CITY_DATA['martinsburg-wv']} />);
    expect(
      screen.getByRole('heading', { level: 1, name: 'General Contractor Martinsburg WV' })
    ).toBeTruthy();
    expect(screen.getAllByText(/WV062432/).length).toBeGreaterThan(0);
    expect(screen.queryByText(/no Maryland contractor license/i)).toBeNull();
  });

  it('emits exact-keyword titles for the three combo routes', async () => {
    const kitchen = await comboMetadata({
      params: Promise.resolve({ service: 'kitchens', city: 'ashburn-va' }),
    });
    const bath = await comboMetadata({
      params: Promise.resolve({ service: 'bathrooms', city: 'ashburn-va' }),
    });
    const decks = await comboMetadata({
      params: Promise.resolve({ service: 'decks', city: 'martinsburg-wv' }),
    });
    expect(kitchen.title).toBe('Kitchen Remodel Ashburn VA | Real Elite Contracting');
    expect(bath.title).toBe('Bathroom Remodel Ashburn VA | Real Elite Contracting');
    expect(decks.title).toBe('Deck Builders Martinsburg WV | Real Elite Contracting');
    expect(decks.alternates?.canonical).toBe(
      'https://www.realelitecontracting.com/services/decks/martinsburg-wv'
    );
  });

  it('renders the decks page H1 and the Berkeley County permit note', async () => {
    const page = await ComboPage({
      params: Promise.resolve({ service: 'decks', city: 'martinsburg-wv' }),
    });
    render(page);
    expect(
      screen.getByRole('heading', { level: 1, name: 'Deck Builders Martinsburg WV' })
    ).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Berkeley County permits' })).toBeTruthy();
    expect(screen.getByRole('link', { name: /Berkeley County OneStop permitting/i })).toHaveAttribute(
      'href',
      'https://onestop.berkeleywv.org'
    );
  });

  it('renders the Ashburn kitchen FAQ that the schema is built from', async () => {
    const page = await ComboPage({
      params: Promise.resolve({ service: 'kitchens', city: 'ashburn-va' }),
    });
    render(page);
    expect(
      screen.getByRole('heading', { level: 1, name: 'Kitchen Remodel Ashburn VA' })
    ).toBeTruthy();
    expect(screen.getByText(/Do you remodel kitchens in Brambleton and Broadlands/i)).toBeTruthy();
  });
});

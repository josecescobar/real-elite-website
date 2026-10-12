import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { ALL_SERVICE_AREAS, CITY_DATA, STAGED_SERVICE_AREAS, areaRegionLabel } from '@/lib/constants';
import { PERMIT_GUIDES, getPermitGuide } from '@/lib/permit-guides';
import { permitGuideForArea, townPagesForGuide } from '@/lib/permit-guide-links';
import * as permitGuideLinks from '@/lib/permit-guide-links';
import PermitGuideLink from '@/components/PermitGuideLink';
import CityPageTemplate from '@/components/services/CityPageTemplate';
import { generateStaticParams as areaStaticParams } from '@/app/service-areas/[slug]/page';
import { generateStaticParams as townServiceStaticParams } from '@/app/service-areas/[slug]/[service]/page';
import TownServiceRoute from '@/app/service-areas/[slug]/[service]/page';
import { generateStaticParams as comboStaticParams } from '@/app/services/[service]/[city]/page';
import ServiceCityPage from '@/app/services/[service]/[city]/page';

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
  notFound: vi.fn(() => {
    throw new Error('notFound');
  }),
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

const GUIDE_HREFS = new Set(PERMIT_GUIDES.map((guide) => `/permit-guides/${guide.slug}`));
const AREA_HREFS = new Set(areaStaticParams().map((params) => `/service-areas/${params.slug}`));
const TOWN_SERVICE_HREFS = new Set(
  townServiceStaticParams().map((params) => `/service-areas/${params.slug}/${params.service}`),
);
const COMBO_HREFS = new Set(
  comboStaticParams().map((params) => `/services/${params.service}/${params.city}`),
);

function guideLinks(container: HTMLElement): HTMLAnchorElement[] {
  return [...container.querySelectorAll<HTMLAnchorElement>('a[href^="/permit-guides/"]')];
}

describe('permit guide links', () => {
  it('maps every areaSlug to exactly one guide', () => {
    const owner = new Map<string, string>();
    for (const guide of PERMIT_GUIDES) {
      for (const areaSlug of guide.areaSlugs) {
        const prior = owner.get(areaSlug);
        expect(prior, `${areaSlug} is on ${prior} and ${guide.slug}`).toBeUndefined();
        owner.set(areaSlug, guide.slug);
      }
    }
  });

  it('points town pages only at guides that exist', () => {
    for (const area of ALL_SERVICE_AREAS) {
      const guide = permitGuideForArea(area.slug);
      if (!guide) continue;
      expect(GUIDE_HREFS.has(guide.href), guide.href).toBe(true);
      expect(getPermitGuide(guide.slug)?.county).toBe(guide.county);
      expect(guide.href).toBe(`/permit-guides/${guide.slug}`);
    }
  });

  it('points guides only at published service-area pages', () => {
    for (const guide of PERMIT_GUIDES) {
      for (const town of townPagesForGuide(guide.slug)) {
        expect(AREA_HREFS.has(town.href), town.href).toBe(true);
        expect(town.href).toBe(`/service-areas/${town.slug}`);
      }
    }
  });

  it('keeps staged and inactive areas out of both directions', () => {
    expect(STAGED_SERVICE_AREAS.length).toBeGreaterThan(0);
    for (const staged of STAGED_SERVICE_AREAS) {
      expect(permitGuideForArea(staged.slug), staged.slug).toBeUndefined();
      expect(AREA_HREFS.has(`/service-areas/${staged.slug}`), staged.slug).toBe(false);
    }
    for (const guide of PERMIT_GUIDES) {
      for (const town of townPagesForGuide(guide.slug)) {
        expect(STAGED_SERVICE_AREAS.some((area) => area.slug === town.slug), town.slug).toBe(false);
        expect(ALL_SERVICE_AREAS.some((area) => area.slug === town.slug), town.slug).toBe(true);
      }
    }
  });

  it('links active children and county rows, and leaves Brambleton unlinked', () => {
    const guideSlugs = new Set(PERMIT_GUIDES.map((guide) => guide.slug));
    expect(permitGuideForArea('brambleton-va')).toBeUndefined();
    for (const area of ALL_SERVICE_AREAS) {
      if (area.slug === 'brambleton-va') continue;
      if (guideSlugs.has(area.slug)) {
        expect(permitGuideForArea(area.slug)?.slug, area.slug).toBe(area.slug);
      }
      if (area.parent && guideSlugs.has(area.parent)) {
        expect(permitGuideForArea(area.slug)?.slug, area.slug).toBe(area.parent);
      }
      const labelMatches = PERMIT_GUIDES.filter((guide) => areaRegionLabel(area) === `${guide.county} area`);
      if (labelMatches.length === 1) {
        expect(permitGuideForArea(area.slug)?.slug, area.slug).toBe(labelMatches[0].slug);
      }
    }
  });

  it('only emits town-service and service-city hrefs that those routes publish', () => {
    for (const href of TOWN_SERVICE_HREFS) {
      const slug = href.split('/')[2];
      if (!permitGuideForArea(slug)) continue;
      expect(TOWN_SERVICE_HREFS.has(href), href).toBe(true);
    }
    for (const href of COMBO_HREFS) {
      const city = href.split('/')[3];
      const guide = permitGuideForArea(city);
      if (!guide) continue;
      expect(GUIDE_HREFS.has(guide.href), href).toBe(true);
      expect(COMBO_HREFS.has(href), href).toBe(true);
    }
  });
});

describe('town templates render one permit-guide link', () => {
  it('renders one link on a covered town page and none on an uncovered town page', () => {
    const covered = render(
      <CityPageTemplate city={ALL_SERVICE_AREAS.find((area) => area.slug === 'leesburg-va')!} data={CITY_DATA['leesburg-va']} />,
    );
    const coveredLinks = guideLinks(covered.container);
    expect(covered.container.querySelectorAll('[data-permit-guide-link]')).toHaveLength(1);
    expect(coveredLinks).toHaveLength(1);
    expect(coveredLinks[0].getAttribute('href')).toBe('/permit-guides/loudoun-county-va');
    expect(coveredLinks[0].textContent).toBe('Permits in Loudoun County: what to expect');
    covered.unmount();

    const uncovered = render(
      <CityPageTemplate city={ALL_SERVICE_AREAS.find((area) => area.slug === 'winchester-va')!} data={CITY_DATA['winchester-va']} />,
    );
    expect(uncovered.container.querySelectorAll('[data-permit-guide-link]')).toHaveLength(0);
    expect(guideLinks(uncovered.container)).toHaveLength(0);
    uncovered.unmount();
  });

  it('renders one link on a covered service+city page and none on an uncovered one', async () => {
    const covered = render(
      await ServiceCityPage({ params: Promise.resolve({ service: 'kitchens', city: 'leesburg-va' }) }),
    );
    const coveredLinks = guideLinks(covered.container);
    expect(covered.container.querySelectorAll('[data-permit-guide-link]')).toHaveLength(1);
    expect(coveredLinks).toHaveLength(1);
    expect(coveredLinks[0].getAttribute('href')).toBe('/permit-guides/loudoun-county-va');
    covered.unmount();

    const uncovered = render(
      await ServiceCityPage({ params: Promise.resolve({ service: 'kitchens', city: 'winchester-va' }) }),
    );
    expect(uncovered.container.querySelectorAll('[data-permit-guide-link]')).toHaveLength(0);
    expect(guideLinks(uncovered.container)).toHaveLength(0);
    uncovered.unmount();
  });

  it('renders one link on a covered town-service page and none when the town is uncovered', async () => {
    const covered = render(
      await TownServiceRoute({ params: Promise.resolve({ slug: 'ashburn-va', service: 'basements' }) }),
    );
    const coveredLinks = guideLinks(covered.container);
    expect(covered.container.querySelectorAll('[data-permit-guide-link]')).toHaveLength(1);
    expect(coveredLinks).toHaveLength(1);
    expect(coveredLinks[0].getAttribute('href')).toBe('/permit-guides/loudoun-county-va');
    covered.unmount();

    const spy = vi.spyOn(permitGuideLinks, 'permitGuideForArea').mockReturnValue(undefined);
    const uncovered = render(
      await TownServiceRoute({ params: Promise.resolve({ slug: 'ashburn-va', service: 'basements' }) }),
    );
    expect(uncovered.container.querySelectorAll('[data-permit-guide-link]')).toHaveLength(0);
    expect(guideLinks(uncovered.container)).toHaveLength(0);
    uncovered.unmount();
    spy.mockRestore();

    const { container, unmount } = render(<PermitGuideLink areaSlug="winchester-va" />);
    expect(container.querySelectorAll('[data-permit-guide-link]')).toHaveLength(0);
    unmount();
  });
});

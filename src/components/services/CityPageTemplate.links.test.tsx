/**
 * What the area-page template actually RENDERS, as opposed to what its href
 * helper returns.
 *
 * `serviceHrefForArea` is unit-tested in src/lib/service-city-content.test.ts,
 * and that test passed while four published combos stayed unlinked — Inwood's
 * only one among them. The helper was correct; `ServiceCard` only renders the
 * first six services, and the "Show all services" overflow hardcoded
 * `/services/{slug}`. A test that calls the helper cannot see that, because
 * the gap is in which call sites use it.
 *
 * So this test renders the template and reads the anchors. It is the second
 * time on this feature that an assertion has been weaker than the comment
 * beside it (see the docblock on the consolidated-redirect test in
 * constants.test.ts for the first, and its eight successors).
 */
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';

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

vi.mock('lucide-react', async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  const mocked: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(actual)) {
    mocked[key] =
      typeof val === 'object' || typeof val === 'function'
        ? (props: Record<string, unknown>) => <svg data-testid={`icon-${key}`} {...props} />
        : val;
  }
  return mocked;
});

vi.mock('@/lib/analytics', () => ({
  trackEvent: vi.fn(),
  trackEstimateStep: vi.fn(),
  trackLead: vi.fn(),
}));

const stub = (name: string) => {
  const Stub = () => <div data-testid={`mock-${name}`} />;
  Stub.displayName = `Stub(${name})`;
  return Stub;
};

// Everything that is either a client component or irrelevant to the link
// graph. CityPageTemplate itself, the catalog, and CONTENT stay real — they
// are what is under test.
vi.mock('@/components/home/PrecisionProcess', () => ({ default: stub('PrecisionProcess') }));
vi.mock('@/components/home/AssurancesBand', () => ({ default: stub('AssurancesBand') }));
vi.mock('@/components/services/StickyEstimateRail', () => ({ default: stub('StickyEstimateRail') }));
vi.mock('@/components/services/LuxuryConsultationRail', () => ({
  default: stub('LuxuryConsultationRail'),
}));
vi.mock('@/components/blog/RelatedGuides', () => ({ default: stub('RelatedGuides') }));
vi.mock('@/components/projects/RelatedProjectsRail', () => ({
  default: stub('RelatedProjectsRail'),
}));
vi.mock('@/components/reviews/ReviewsSection', () => ({ default: stub('ReviewsSection') }));
vi.mock('@/components/seo/JsonLd', () => ({ default: () => null }));
vi.mock('@/components/seo/FAQSchema', () => ({ default: () => null }));
vi.mock('@/components/analytics/PhoneLink', () => ({
  default: ({ children }: { children: React.ReactNode }) => <a href="tel:+16815345515">{children}</a>,
}));

const { default: CityPageTemplate } = await import('@/components/services/CityPageTemplate');
const { ALL_SERVICE_AREAS, CITY_DATA, SERVICES } = await import('@/lib/constants');
const { CONTENT } = await import('@/lib/service-city-content');

/** Every `/services/<service>/<area>` href the rendered page contains. */
function renderedComboLinks(slug: string): string[] {
  const area = ALL_SERVICE_AREAS.find((a) => a.slug === slug);
  if (!area) throw new Error(`no catalog row for ${slug}`);
  const data = CITY_DATA[slug];
  if (!data) throw new Error(`no CITY_DATA for ${slug}`);

  const { container, unmount } = render(<CityPageTemplate city={area} data={data} />);
  const hrefs = [...container.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')!);
  unmount();

  const serviceSlugs = new Set<string>(SERVICES.map((s) => s.slug));
  return [
    ...new Set(
      hrefs.filter((href) => {
        const parts = href.split('/');
        return parts.length === 4 && parts[1] === 'services' && serviceSlugs.has(parts[2]) && parts[3] === slug;
      })
    ),
  ].sort();
}

/** Combos CONTENT publishes for an area, as `/services/<service>/<area>`. */
function publishedComboLinks(slug: string): string[] {
  return Object.keys(CONTENT)
    .filter((key) => key.endsWith(`-${slug}`))
    .map((key) => `/services/${key.slice(0, key.length - slug.length - 1)}/${slug}`)
    .sort();
}

describe('CityPageTemplate links to every combo published for its area', () => {
  /**
   * Named individually because these are the cases the helper-level test
   * missed, and because Inwood and Charles Town carry the site's strongest
   * commercial positions — "basement remodeling ranson wv" at 3.2 and
   * "basement remodeling inwood wv" at 5.7, per the altitude doc §1. Inwood's
   * basement combo was its ONLY published page and it had no link from its own
   * area page.
   */
  it.each(['inwood-wv', 'charles-town-wv', 'frederick-md'])(
    '%s links its own combos, including ones that sort into the overflow list',
    (slug) => {
      expect(renderedComboLinks(slug)).toEqual(publishedComboLinks(slug));
    }
  );

  /**
   * The general case, over every area that has a CITY_DATA entry. This is the
   * assertion the helper-level completeness test was standing in for, and
   * could not make: it checks the anchors, so a call site that bypasses
   * `serviceHrefForArea` fails here.
   */
  it('renders exactly the published combo links on every area page', () => {
    const offenders: string[] = [];

    for (const area of ALL_SERVICE_AREAS) {
      if (!CITY_DATA[area.slug]) continue;
      const rendered = renderedComboLinks(area.slug);
      const published = publishedComboLinks(area.slug);

      const missing = published.filter((href) => !rendered.includes(href));
      const extra = rendered.filter((href) => !published.includes(href));
      if (missing.length) offenders.push(`${area.slug} does not link ${missing.join(', ')}`);
      // An extra link is worse than a missing one: /services/[service]/[city]
      // sets dynamicParams = false, so it would be a link to a hard 404.
      if (extra.length) offenders.push(`${area.slug} links unpublished ${extra.join(', ')}`);
    }

    expect(offenders, offenders.join('; ')).toEqual([]);
  });
});

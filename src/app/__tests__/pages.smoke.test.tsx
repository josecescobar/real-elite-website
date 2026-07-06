/**
 * Page-level smoke tests: verify every page renders without crashing.
 *
 * These do NOT test visual output — they catch broken imports, missing
 * data, and runtime errors that would cause a 500 in production.
 */
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render } from '@testing-library/react';

/* ------------------------------------------------------------------ */
/*  Global mocks for Next.js / third-party modules                    */
/* ------------------------------------------------------------------ */

vi.mock('next/link', () => ({
  default: ({ children, ...props }: { children: React.ReactNode; [k: string]: unknown }) => (
    <a {...props}>{children}</a>
  ),
}));

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string; [k: string]: unknown }) => (
    <img src={src} alt={alt} {...props} />
  ),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
  notFound: vi.fn(),
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Keep all lucide-react icon exports as lightweight stubs
vi.mock('lucide-react', async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  const mocked: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(actual)) {
    if (typeof val === 'object' || typeof val === 'function') {
      mocked[key] = (props: Record<string, unknown>) => <svg data-testid={`icon-${key}`} {...props} />;
    } else {
      mocked[key] = val;
    }
  }
  return mocked;
});

vi.mock('@/lib/analytics', () => ({
  trackEvent: vi.fn(),
  trackEstimateStep: vi.fn(),
  trackLead: vi.fn(),
}));

/* ------------------------------------------------------------------ */
/*  Home page components (mock to isolate page-level rendering)       */
/* ------------------------------------------------------------------ */

const stubComponent = (name: string) => {
  const Stub = () => <div data-testid={`mock-${name}`} />;
  Stub.displayName = `Stub(${name})`;
  return Stub;
};

vi.mock('@/components/home/Hero', () => ({ default: stubComponent('Hero') }));
vi.mock('@/components/home/TrustBar', () => ({ default: stubComponent('TrustBar') }));
vi.mock('@/components/home/FeaturedServices', () => ({ default: stubComponent('FeaturedServices') }));
vi.mock('@/components/home/PrecisionProcess', () => ({ default: stubComponent('PrecisionProcess') }));
vi.mock('@/components/home/ProjectSpotlight', () => ({ default: stubComponent('ProjectSpotlight') }));
vi.mock('@/components/home/BeforeAfter', () => ({ default: stubComponent('BeforeAfter') }));
vi.mock('@/components/home/FeaturedGuides', () => ({ default: stubComponent('FeaturedGuides') }));
vi.mock('@/components/home/Testimonials', () => ({ default: stubComponent('Testimonials') }));
vi.mock('@/components/home/ServiceAreaMap', () => ({ default: stubComponent('ServiceAreaMap') }));
vi.mock('@/components/home/AssurancesBand', () => ({ default: stubComponent('AssurancesBand') }));
vi.mock('@/components/home/HomeEstimate', () => ({ default: stubComponent('HomeEstimate') }));
vi.mock('@/components/home/HomeFAQ', () => ({ default: stubComponent('HomeFAQ') }));
vi.mock('@/components/home/CTASection', () => ({ default: stubComponent('CTASection') }));

vi.mock('@/components/shared/Container', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/components/shared/SectionHeader', () => ({
  default: ({ title }: { title: string }) => <h2>{title}</h2>,
}));

vi.mock('@/components/shared/MultiStepEstimateForm', () => ({
  default: () => <div data-testid="mock-estimate-form" />,
}));

vi.mock('@/components/shared/GalleryGrid', () => ({
  default: () => <div data-testid="mock-gallery-grid" />,
}));

vi.mock('@/components/services/ServicePageTemplate', () => ({
  default: ({ data }: { data: { title: string } }) => <div data-testid="service-page">{data.title}</div>,
}));

vi.mock('@/components/services/CityPageTemplate', () => ({
  default: () => <div data-testid="mock-city-page" />,
}));

vi.mock('@/components/blog/GuideTemplate', () => ({
  default: () => <div data-testid="mock-guide-template" />,
}));

vi.mock('@/components/seo/JsonLd', () => ({
  default: () => null,
}));

vi.mock('@/components/seo/FAQSchema', () => ({
  default: () => null,
}));

vi.mock('@/components/seo/ServiceSchema', () => ({
  default: () => null,
}));

vi.mock('@/components/seo/ArticleSchema', () => ({
  default: () => null,
}));

vi.mock('@/components/faq/FaqAccordion', () => ({
  default: () => <div data-testid="mock-faq-accordion" />,
}));

vi.mock('@/components/shared/InlineCTA', () => ({
  default: () => <div data-testid="mock-inline-cta" />,
}));

vi.mock('@/components/shared/StatCallout', () => ({
  default: () => <div data-testid="mock-stat-callout" />,
}));

vi.mock('@/components/shared/PullQuote', () => ({
  default: () => <div data-testid="mock-pull-quote" />,
}));

vi.mock('@/components/shared/GuideCard', () => ({
  default: () => <div data-testid="mock-guide-card" />,
}));

/* ------------------------------------------------------------------ */
/*  Static page smoke tests                                           */
/* ------------------------------------------------------------------ */

describe('static page smoke tests', () => {
  it('Home page renders', async () => {
    const { default: Home } = await import('@/app/page');
    expect(() => render(<Home />)).not.toThrow();
  });

  it('About page renders', async () => {
    const { default: AboutPage } = await import('@/app/about/page');
    expect(() => render(<AboutPage />)).not.toThrow();
  });

  it('Contact page renders', async () => {
    const { default: ContactPage } = await import('@/app/contact/page');
    expect(() => render(<ContactPage />)).not.toThrow();
  });

  it('Gallery page renders', async () => {
    const { default: GalleryPage } = await import('@/app/gallery/page');
    expect(() => render(<GalleryPage />)).not.toThrow();
  });

  it('Reviews page renders', async () => {
    const { default: ReviewsPage } = await import('@/app/reviews/page');
    const el = await ReviewsPage({ searchParams: Promise.resolve({}) });
    expect(() => render(el)).not.toThrow();
  });

  it('Reviews page renders filtered by service', async () => {
    const { default: ReviewsPage } = await import('@/app/reviews/page');
    const el = await ReviewsPage({ searchParams: Promise.resolve({ service: 'roofing' }) });
    expect(() => render(el)).not.toThrow();
  });

  it('Services page renders', async () => {
    const { default: ServicesPage } = await import('@/app/services/page');
    expect(() => render(<ServicesPage />)).not.toThrow();
  });

  it('Service Areas page renders', async () => {
    const { default: ServiceAreasPage } = await import('@/app/service-areas/page');
    expect(() => render(<ServiceAreasPage />)).not.toThrow();
  });

  it('FAQ page renders', async () => {
    const { default: FAQPage } = await import('@/app/faq/page');
    expect(() => render(<FAQPage />)).not.toThrow();
  });

  it('Process page renders', async () => {
    const { default: ProcessPage } = await import('@/app/process/page');
    expect(() => render(<ProcessPage />)).not.toThrow();
  });

  it('Financing page renders', async () => {
    const { default: FinancingPage } = await import('@/app/financing/page');
    expect(() => render(<FinancingPage />)).not.toThrow();
  });

  it('Veterans page renders', async () => {
    const { default: VeteransPage } = await import('@/app/veterans/page');
    expect(() => render(<VeteransPage />)).not.toThrow();
  });

  it('Storm Damage page renders', async () => {
    const { default: StormDamagePage } = await import('@/app/storm-damage/page');
    expect(() => render(<StormDamagePage />)).not.toThrow();
  });

  it('Resources hub renders', async () => {
    const { default: ResourcesPage } = await import('@/app/resources/page');
    expect(() => render(<ResourcesPage />)).not.toThrow();
  });

  it('Resources category page renders', async () => {
    const { default: CategoryPage } = await import('@/app/resources/[category]/page');
    const el = await CategoryPage({ params: Promise.resolve({ category: 'roofing' }) });
    expect(() => render(el)).not.toThrow();
  });

  it('Instant Roof Quote page renders', async () => {
    const { default: RoofQuotePage } = await import('@/app/instant-roof-quote/page');
    expect(() => render(<RoofQuotePage />)).not.toThrow();
  });

  it('Design Consultation page renders', async () => {
    const { default: DesignPage } = await import('@/app/design-consultation/page');
    expect(() => render(<DesignPage />)).not.toThrow();
  });

  it('Paving hub page renders', async () => {
    const { default: PavingPage } = await import('@/app/paving/page');
    expect(() => render(<PavingPage />)).not.toThrow();
  });
});

/* ------------------------------------------------------------------ */
/*  Service pages (all use ServicePageTemplate)                       */
/* ------------------------------------------------------------------ */

describe('service page smoke tests', () => {
  it('/services/roofing page renders', async () => {
    const { default: Page } = await import('@/app/services/roofing/page');
    expect(() => render(<Page />)).not.toThrow();
  });

  it('/services/siding page renders', async () => {
    const { default: Page } = await import('@/app/services/siding/page');
    expect(() => render(<Page />)).not.toThrow();
  });

  it('/services/decks page renders', async () => {
    const { default: Page } = await import('@/app/services/decks/page');
    expect(() => render(<Page />)).not.toThrow();
  });

  it('/services/additions page renders', async () => {
    const { default: Page } = await import('@/app/services/additions/page');
    expect(() => render(<Page />)).not.toThrow();
  });

  it('/services/remodeling page renders', async () => {
    const { default: Page } = await import('@/app/services/remodeling/page');
    expect(() => render(<Page />)).not.toThrow();
  });

  it('/services/exterior-repairs page renders', async () => {
    const { default: Page } = await import('@/app/services/exterior-repairs/page');
    expect(() => render(<Page />)).not.toThrow();
  });

  it('/services/general-repairs page renders', async () => {
    const { default: Page } = await import('@/app/services/general-repairs/page');
    expect(() => render(<Page />)).not.toThrow();
  });

  it('/services/basements page renders', async () => {
    const { default: Page } = await import('@/app/services/basements/page');
    expect(() => render(<Page />)).not.toThrow();
  });

  it('/services/bathrooms page renders', async () => {
    const { default: Page } = await import('@/app/services/bathrooms/page');
    expect(() => render(<Page />)).not.toThrow();
  });

  it('/services/kitchens page renders', async () => {
    const { default: Page } = await import('@/app/services/kitchens/page');
    expect(() => render(<Page />)).not.toThrow();
  });

  it('/services/handyman page renders', async () => {
    const { default: Page } = await import('@/app/services/handyman/page');
    expect(() => render(<Page />)).not.toThrow();
  });
});

/* ------------------------------------------------------------------ */
/*  Blog redirect                                                     */
/* ------------------------------------------------------------------ */

describe('blog index', () => {
  it('/blog redirects to /resources', async () => {
    const { redirect } = await import('next/navigation');
    const { default: BlogIndex } = await import('@/app/blog/page');
    BlogIndex();
    expect(redirect).toHaveBeenCalledWith('/resources');
  });
});

/* ------------------------------------------------------------------ */
/*  Project System                                                    */
/* ------------------------------------------------------------------ */

describe('project system smoke tests', () => {
  const SAMPLE = 'victorian-roof-replacement-martinsburg-wv';

  it('/projects index renders', async () => {
    const { default: ProjectsPage } = await import('@/app/projects/page');
    const el = await ProjectsPage({ searchParams: Promise.resolve({}) });
    expect(() => render(el)).not.toThrow();
  });

  it('/projects index renders filtered by service', async () => {
    const { default: ProjectsPage } = await import('@/app/projects/page');
    const el = await ProjectsPage({ searchParams: Promise.resolve({ service: 'roofing' }) });
    expect(() => render(el)).not.toThrow();
  });

  it('/projects/[slug] exposes the sample project via generateStaticParams', async () => {
    const { generateStaticParams } = await import('@/app/projects/[slug]/page');
    const params = generateStaticParams();
    expect(params.some((p) => p.slug === SAMPLE)).toBe(true);
  });

  it('renders the exemplary project through ProjectPageTemplate', async () => {
    const { default: ProjectPageTemplate } = await import('@/components/projects/ProjectPageTemplate');
    const { getProjectBySlug } = await import('@/lib/projects');
    const project = getProjectBySlug(SAMPLE);
    expect(project).not.toBeNull();
    expect(() => render(<ProjectPageTemplate project={project!} />)).not.toThrow();
  });
});

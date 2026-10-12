/**
 * Filtered /reviews and /projects URLs must return the matching subset in the
 * server HTML. The public pages do not read searchParams, so they stay
 * prerenderable. The dynamic routes below are what the beforeFiles rewrite
 * renders for those query URLs.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { getReviewedServiceSlugs } from '@/lib/reviews';

const { fixtureProjects } = vi.hoisted(() => ({
  fixtureProjects: [
    {
      slug: 'roof-alpha',
      title: 'Roof Alpha',
      summary: 'Roof alpha summary',
      service: 'roofing',
      citySlug: 'martinsburg-wv',
      hero: { image: { src: '/images/roof-alpha.jpg', alt: 'Roof alpha photo' } },
    },
    {
      slug: 'deck-with-roof',
      title: 'Deck With Roof',
      summary: 'Deck summary',
      service: 'decks',
      secondaryServices: ['roofing'],
      citySlug: 'inwood-wv',
      hero: { image: { src: '/images/deck-with-roof.jpg', alt: 'Deck photo' } },
    },
    {
      slug: 'kitchen-beta',
      title: 'Kitchen Beta',
      summary: 'Kitchen summary',
      service: 'kitchens',
      citySlug: 'frederick-md',
      hero: { image: { src: '/images/kitchen-beta.jpg', alt: 'Kitchen photo' } },
    },
  ],
}));

vi.mock('@/lib/projects', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/projects')>();
  return {
    ...actual,
    getAllProjects: () => fixtureProjects,
    getProjectsByService: (serviceSlug: string) =>
      fixtureProjects.filter(
        (project) =>
          project.service === serviceSlug ||
          (project.secondaryServices ?? []).includes(serviceSlug),
      ),
    getProjectsByCity: (citySlug: string) =>
      fixtureProjects.filter((project) => project.citySlug === citySlug),
  };
});

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

vi.mock('lucide-react', async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  const mocked: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(actual)) {
    if (typeof val === 'object' || typeof val === 'function') {
      mocked[key] = (props: Record<string, unknown>) => <svg {...props} />;
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

afterEach(() => cleanup());

const ROOFING_QUOTE =
  'Realelite showed up on time, did a good job on repair of roof. I would highly recommend them for a the professional job they did.';
const UNTAGGED_QUOTE = 'Super fast & easy to schedule with. Thank you :)';

function pageText(): string {
  return document.body.textContent ?? '';
}

function expectProjectSubset(shown: { slug: string; title: string }[], all: { slug: string; title: string }[]) {
  for (const project of shown) {
    expect(screen.getByRole('heading', { name: project.title })).toBeInTheDocument();
  }
  for (const project of all) {
    if (shown.some((match) => match.slug === project.slug)) continue;
    expect(screen.queryByRole('heading', { name: project.title })).not.toBeInTheDocument();
  }
}

describe('reviews filtered server HTML', () => {
  it('publishes only roofing, so the untagged Thumbtack quote is the extra row', () => {
    expect(getReviewedServiceSlugs()).toEqual(['roofing']);
  });

  it('shows every published review when the query is empty', async () => {
    const { default: ReviewsPage } = await import('@/app/reviews/page');
    render(ReviewsPage());
    expect(pageText()).toContain(ROOFING_QUOTE);
    expect(pageText()).toContain(UNTAGGED_QUOTE);
    expect(screen.queryByRole('group', { name: 'Filter reviews by service' })).not.toBeInTheDocument();
  });

  it('returns only the roofing review for ?service=roofing even with a single facet', async () => {
    const { default: ReviewsFilteredPage } = await import('@/app/reviews/filtered/page');
    render(await ReviewsFilteredPage({ searchParams: Promise.resolve({ service: 'roofing' }) }));
    expect(pageText()).toContain(ROOFING_QUOTE);
    expect(pageText()).not.toContain(UNTAGGED_QUOTE);
    expect(screen.queryByRole('group', { name: 'Filter reviews by service' })).not.toBeInTheDocument();
  });

  it('ignores an unknown service and shows every published review', async () => {
    const { default: ReviewsFilteredPage } = await import('@/app/reviews/filtered/page');
    render(await ReviewsFilteredPage({ searchParams: Promise.resolve({ service: 'electrical' }) }));
    expect(pageText()).toContain(ROOFING_QUOTE);
    expect(pageText()).toContain(UNTAGGED_QUOTE);
  });
});

describe('projects filtered server HTML', () => {
  const roofing = fixtureProjects.filter(
    (project) => project.service === 'roofing' || project.secondaryServices?.includes('roofing'),
  );

  it('returns the roofing subset, including a secondary-service match', async () => {
    const { default: ProjectsFilteredPage } = await import('@/app/projects/filtered/page');
    render(await ProjectsFilteredPage({ searchParams: Promise.resolve({ service: 'roofing' }) }));
    expectProjectSubset(roofing, fixtureProjects);
    expect(roofing.map((project) => project.title).sort()).toEqual(['Deck With Roof', 'Roof Alpha']);
  });

  it('returns only the matching city subset', async () => {
    const { default: ProjectsFilteredPage } = await import('@/app/projects/filtered/page');
    const inCity = fixtureProjects.filter((project) => project.citySlug === 'martinsburg-wv');
    render(await ProjectsFilteredPage({ searchParams: Promise.resolve({ city: 'martinsburg-wv' }) }));
    expectProjectSubset(inCity, fixtureProjects);
  });

  it('prefers a known service over a city', async () => {
    const { default: ProjectsFilteredPage } = await import('@/app/projects/filtered/page');
    render(
      await ProjectsFilteredPage({
        searchParams: Promise.resolve({ service: 'roofing', city: 'frederick-md' }),
      }),
    );
    expectProjectSubset(roofing, fixtureProjects);
  });

  it('shows every project for an unknown service', async () => {
    const { default: ProjectsFilteredPage } = await import('@/app/projects/filtered/page');
    render(await ProjectsFilteredPage({ searchParams: Promise.resolve({ service: 'electrical' }) }));
    expectProjectSubset(fixtureProjects, fixtureProjects);
  });

  it('shows every project when the query is empty', async () => {
    const { default: ProjectsPage } = await import('@/app/projects/page');
    render(ProjectsPage());
    expectProjectSubset(fixtureProjects, fixtureProjects);
  });
});

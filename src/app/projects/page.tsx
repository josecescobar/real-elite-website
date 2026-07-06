import Link from 'next/link';
import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import AssurancesBand from '@/components/home/AssurancesBand';
import ProjectCard from '@/components/projects/ProjectCard';
import { buildMetadata } from '@/lib/seo';
import { BUSINESS, SERVICES } from '@/lib/constants';
import {
  getAllProjects,
  getProjectsByService,
  getProjectsByCity,
  resolveCity,
} from '@/lib/projects';

export const metadata = buildMetadata({
  path: '/projects',
  title: `Our Projects | ${BUSINESS.name}`,
  description:
    'Completed remodeling and exterior projects across WV, MD, and VA — real homes, real before-and-afters, and the craftsmanship behind every Real Elite job.',
  keywords: ['contractor projects', 'before and after', 'remodeling portfolio', 'Eastern Panhandle'],
});

const SERVICE_LABEL = new Map<string, string>(SERVICES.map((s) => [s.slug, s.title]));

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string; city?: string }>;
}) {
  const { service, city } = await searchParams;
  const all = getAllProjects();

  // Facets that actually have at least one project — never an empty filter.
  const serviceFacets = [...new Set(all.map((p) => p.service))];
  const cityFacets = [...new Set(all.map((p) => p.citySlug))];

  const activeService = service && serviceFacets.includes(service) ? service : null;
  const activeCity = !activeService && city && cityFacets.includes(city) ? city : null;

  const projects = activeService
    ? getProjectsByService(activeService)
    : activeCity
      ? getProjectsByCity(activeCity)
      : all;

  const hasFilters = serviceFacets.length > 1 || cityFacets.length > 1;

  return (
    <>
      <section className="bg-navy-900 text-white py-20 md:py-28">
        <Container size="wide">
          <SectionHeader
            eyebrow="Our Work"
            title="Projects"
            subtitle="Real homes across the Eastern Panhandle and beyond — the work itself, start to finish."
            tone="light"
          />
        </Container>
      </section>

      <section className="bg-white py-16 md:py-24">
        <Container size="wide">
          {hasFilters && (
            <div
              className="mb-10 flex flex-wrap gap-2"
              role="group"
              aria-label="Filter projects"
            >
              <FacetChip href="/projects" label="All" active={!activeService && !activeCity} />
              {serviceFacets.map((slug) => (
                <FacetChip
                  key={`s-${slug}`}
                  href={`/projects?service=${slug}`}
                  label={SERVICE_LABEL.get(slug) ?? slug}
                  active={activeService === slug}
                />
              ))}
              {cityFacets.map((slug) => {
                const c = resolveCity(slug);
                return (
                  <FacetChip
                    key={`c-${slug}`}
                    href={`/projects?city=${slug}`}
                    label={c ? `${c.city}, ${c.state}` : slug}
                    active={activeCity === slug}
                  />
                );
              })}
            </div>
          )}

          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          ) : (
            <p className="text-charcoal-600 text-lg">New projects are being added soon.</p>
          )}
        </Container>
      </section>

      <AssurancesBand />
    </>
  );
}

function FacetChip({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      aria-current={active ? 'true' : undefined}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors focus-ring ${
        active
          ? 'bg-navy-800 text-white'
          : 'bg-white text-navy-800 border border-charcoal-200 hover:border-navy-400'
      }`}
    >
      {label}
    </Link>
  );
}

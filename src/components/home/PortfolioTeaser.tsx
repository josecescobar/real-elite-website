import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import Container from '@/components/shared/Container';
import { getAllProjects, resolveCity, type Project } from '@/lib/projects';
import { SERVICES } from '@/lib/constants';

/**
 * Three projects from the registry, signature services first.
 *
 * Reads the same Project records that power /projects, so nothing here can be
 * a project the site does not actually publish. Signature-service projects
 * (kitchens, baths, lower levels, outdoor living, additions, whole-home) are
 * preferred over exterior work; the remainder fills in newest-first.
 */
const SIGNATURE = new Set(['kitchens', 'bathrooms', 'basements', 'decks', 'additions', 'remodeling']);

export function selectPortfolioTeaser(projects: readonly Project[], count = 3): Project[] {
  const signature = projects.filter((p) => SIGNATURE.has(p.service));
  const rest = projects.filter((p) => !SIGNATURE.has(p.service));
  return [...signature, ...rest].slice(0, count);
}

export default function PortfolioTeaser() {
  const projects = selectPortfolioTeaser(getAllProjects());
  if (projects.length === 0) return null;
  const serviceTitle = (slug: string) => SERVICES.find((s) => s.slug === slug)?.title ?? slug;

  return (
    <section className="bg-steel-50 py-20 md:py-28 border-y border-steel-200">
      <Container size="wide">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
          <div className="max-w-2xl">
            <p className="text-brand-red text-xs uppercase tracking-[0.22em] font-semibold mb-4">
              Selected work
            </p>
            <h2 className="font-heading text-4xl md:text-5xl text-navy-900 leading-[1.05]">
              Built to the drawing.
            </h2>
            <p className="text-charcoal-600 mt-4 leading-relaxed">
              Case studies from the registry, with the brief, the build and the outcome. Loudoun
              projects are added as they complete.
            </p>
          </div>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-semibold text-navy-900 link-editorial self-start md:self-auto"
          >
            All projects
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {projects.map((project, i) => {
            const city = resolveCity(project.citySlug);
            return (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className={`group block reveal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-navy-400 rounded-lg ${i === 1 ? 'md:mt-12' : ''}`}
              >
                <div className="photo-editorial relative aspect-[4/5] overflow-hidden rounded-lg bg-navy-900">
                  <Image
                    src={project.hero.image.src}
                    alt={project.hero.image.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="pt-5">
                  <p className="text-[0.65rem] uppercase tracking-[0.18em] font-semibold text-charcoal-500">
                    {serviceTitle(project.service)}
                    {city ? ` · ${city.city}, ${city.state}` : ''}
                  </p>
                  <h3 className="font-heading text-2xl text-navy-900 mt-2 leading-tight group-hover:text-brand-red transition-colors flex items-start gap-2">
                    {project.title}
                    <ArrowUpRight className="w-4 h-4 mt-2 text-charcoal-300 group-hover:text-brand-red transition-colors flex-shrink-0" aria-hidden="true" />
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

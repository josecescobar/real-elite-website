import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Star } from 'lucide-react';
import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import PrecisionProcess from '@/components/home/PrecisionProcess';
import AssurancesBand from '@/components/home/AssurancesBand';
import ServiceFAQ from '@/components/services/ServiceFAQ';
import JsonLd from '@/components/seo/JsonLd';
import FAQSchema from '@/components/seo/FAQSchema';
import ProjectCard from './ProjectCard';
import { buildBreadcrumbSchema } from '@/lib/seo';
import { BUSINESS, SERVICES } from '@/lib/constants';
import { resolveCity, getRelatedProjects, type Project } from '@/lib/projects';

export default function ProjectPageTemplate({ project }: { project: Project }) {
  const city = resolveCity(project.citySlug);
  const location = city ? `${city.city}, ${city.state}` : undefined;
  const serviceTitle = SERVICES.find((s) => s.slug === project.service)?.title ?? project.service;
  const related = getRelatedProjects(project.slug, 3);
  const url = `${BUSINESS.url}/projects/${project.slug}`;

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', item: BUSINESS.url },
    { name: 'Projects', item: `${BUSINESS.url}/projects` },
    { name: project.title, item: url },
  ]);

  // schema.org has no perfect "contractor project" type; CreativeWork with a
  // GeneralContractor creator + Place location is the most accurate, valid fit.
  const projectSchema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.summary,
    url,
    image: project.hero.image.src.startsWith('http')
      ? project.hero.image.src
      : `${BUSINESS.url}${project.hero.image.src}`,
    dateCreated: project.completedOn,
    about: serviceTitle,
    ...(location
      ? { locationCreated: { '@type': 'Place', name: location } }
      : {}),
    creator: {
      '@type': 'GeneralContractor',
      name: BUSINESS.name,
      url: `${BUSINESS.url}/`,
    },
  };

  return (
    <>
      <JsonLd schema={breadcrumbSchema} />
      <JsonLd schema={projectSchema} />
      {project.faqs && project.faqs.length > 0 && <FAQSchema items={project.faqs} />}

      {/* Cinematic hero */}
      <section className="relative isolate overflow-hidden bg-navy-900 text-white">
        <div className="absolute inset-0 -z-10">
          <Image
            src={project.hero.image.src}
            alt={project.hero.image.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div aria-hidden="true" className="absolute inset-0 gradient-navy-overlay" />
          <div aria-hidden="true" className="absolute inset-0 bg-navy-900/45" />
        </div>

        <Container size="wide" className="py-20 md:py-28 lg:py-32">
          <nav aria-label="Breadcrumb" className="text-xs sm:text-sm text-charcoal-300 mb-6 flex items-center gap-2 flex-wrap">
            <Link href="/projects" className="hover:text-white transition-colors">Projects</Link>
            <span className="text-charcoal-500">/</span>
            <span className="text-white">{project.title}</span>
          </nav>
          <div className="max-w-3xl">
            {project.hero.eyebrow && (
              <p className="text-brand-red-light text-xs uppercase tracking-[0.18em] font-semibold mb-4">
                {project.hero.eyebrow}
              </p>
            )}
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[0.95] tracking-tight">
              {project.hero.heading}
            </h1>
            <p className="text-charcoal-200 text-lg md:text-xl mt-6 max-w-2xl leading-relaxed">
              {project.hero.sub}
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <a
                href="/contact#estimate"
                className="bg-brand-red text-white px-7 py-3.5 rounded-md font-bold text-sm hover:bg-brand-red-dark transition-colors shadow-lg shadow-navy-950/40 focus-ring-on-navy"
              >
                Start a Project Like This →
              </a>
              <a
                href={`tel:${BUSINESS.phoneRaw}`}
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-7 py-3.5 rounded-md font-bold text-sm hover:bg-white/20 transition-colors"
              >
                Call {BUSINESS.phone}
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* Body + facts rail */}
      <section className="bg-white py-16 md:py-24">
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            {/* Main column */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-16">
              {/* Summary / answer block */}
              <p className="text-charcoal-800 text-lg md:text-xl leading-relaxed border-l-4 border-brand-red pl-5">
                {project.summary}
              </p>

              {/* The brief */}
              <div>
                <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-navy-800 mb-5">The brief</h2>
                {project.brief.map((p, i) => (
                  <p key={i} className="text-charcoal-700 text-base md:text-lg leading-relaxed mb-5 last:mb-0">{p}</p>
                ))}
              </div>

              {/* The challenge */}
              {project.challenge && project.challenge.length > 0 && (
                <div>
                  <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-navy-800 mb-5">The challenge</h2>
                  {project.challenge.map((p, i) => (
                    <p key={i} className="text-charcoal-700 text-base md:text-lg leading-relaxed mb-5 last:mb-0">{p}</p>
                  ))}
                </div>
              )}

              {/* Before / after reveal */}
              {project.beforeAfter && project.beforeAfter.length > 0 && (
                <div>
                  <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-navy-800 mb-6">Before &amp; after</h2>
                  <div className="space-y-8">
                    {project.beforeAfter.map((pair) => (
                      <figure key={pair.label}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {([['Before', pair.before], ['After', pair.after]] as const).map(([label, img]) => (
                            <div key={label} className="relative aspect-[3/2] overflow-hidden rounded-lg shadow-md">
                              <Image
                                src={img.src}
                                alt={img.alt}
                                fill
                                sizes="(max-width: 640px) 100vw, 40vw"
                                className="object-cover"
                              />
                              <span className="absolute top-3 left-3 bg-navy-900/85 text-white text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                                {label}
                              </span>
                            </div>
                          ))}
                        </div>
                        <figcaption className="text-charcoal-500 text-sm mt-3">{pair.label}</figcaption>
                      </figure>
                    ))}
                  </div>
                </div>
              )}

              {/* The build */}
              <div>
                <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-navy-800 mb-5">The build</h2>
                {project.solution.map((p, i) => (
                  <p key={i} className="text-charcoal-700 text-base md:text-lg leading-relaxed mb-5 last:mb-0">{p}</p>
                ))}
                {project.outcome && project.outcome.length > 0 && (
                  <div className="mt-6 space-y-3">
                    {project.outcome.map((o, i) => (
                      <p key={i} className="font-heading text-xl md:text-2xl font-bold text-navy-800 leading-snug">“{o}”</p>
                    ))}
                  </div>
                )}
              </div>

              {/* Gallery */}
              {project.gallery.length > 0 && (
                <div>
                  <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-navy-800 mb-6">From the job site</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {project.gallery.map((img) => (
                      <div key={img.src} className="relative aspect-square overflow-hidden rounded-lg shadow-sm">
                        <Image
                          src={img.src}
                          alt={img.alt}
                          fill
                          sizes="(max-width: 768px) 50vw, 30vw"
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Customer's words */}
              {project.review && (
                <figure className="bg-steel-50 rounded-lg p-8 border-l-4 border-brand-red">
                  <div className="flex gap-1 mb-4" aria-label={`${project.review.rating} out of 5 stars`}>
                    {Array.from({ length: project.review.rating }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-gold-400 text-gold-400" aria-hidden="true" />
                    ))}
                  </div>
                  <blockquote className="text-charcoal-800 text-lg md:text-xl leading-relaxed">
                    “{project.review.quote}”
                  </blockquote>
                  <figcaption className="text-charcoal-600 text-sm font-semibold mt-4">
                    — {project.review.author}, {project.review.location}
                  </figcaption>
                </figure>
              )}

              {/* FAQ */}
              {project.faqs && project.faqs.length > 0 && <ServiceFAQ items={project.faqs} />}
            </div>

            {/* Facts rail */}
            <div className="lg:col-span-5 xl:col-span-4">
              <div className="lg:sticky lg:top-24 bg-navy-900 text-white rounded-lg p-7 shadow-card-elevated">
                <h2 className="font-heading text-lg font-extrabold mb-5">Project facts</h2>
                <dl className="space-y-3 text-sm">
                  <FactRow label="Service" value={serviceTitle} />
                  {location && <FactRow label="Location" value={location} />}
                  {project.budgetBand && <FactRow label="Investment" value={project.budgetBand} />}
                  {project.durationLabel && <FactRow label="Timeline" value={project.durationLabel} />}
                  {project.style && <FactRow label="Style" value={project.style} />}
                </dl>

                {project.materials && project.materials.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-white/15">
                    <p className="text-charcoal-300 text-xs uppercase tracking-wider font-semibold mb-3">Materials</p>
                    <ul className="space-y-2 text-sm">
                      {project.materials.map((m) => (
                        <li key={m.name} className="text-charcoal-100">
                          {m.name}
                          {m.manufacturer && <span className="text-charcoal-400"> · {m.manufacturer}</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <a
                  href="/contact#estimate"
                  className="mt-7 inline-flex w-full items-center justify-center gap-2 bg-brand-red text-white px-6 py-3.5 rounded-md font-bold text-sm hover:bg-brand-red-dark transition-colors focus-ring-on-navy"
                >
                  Get My Free Estimate
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Process */}
      <PrecisionProcess />

      {/* Related projects */}
      {related.length > 0 && (
        <section className="bg-steel-50 py-16 md:py-24">
          <Container size="wide">
            <SectionHeader
              eyebrow="More of our work"
              title="Related projects"
              subtitle="Recent work in the same service and area."
              className="mb-10"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.map((p) => (
                <ProjectCard key={p.slug} project={p} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Assurances */}
      <AssurancesBand />

      {/* Final CTA */}
      <section className="bg-navy-900 text-white py-16 md:py-24">
        <Container size="default" className="text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-extrabold mb-5">
            Ready to start your {serviceTitle.toLowerCase()} project?
          </h2>
          <p className="text-charcoal-300 mb-8 max-w-2xl mx-auto">
            Three short steps, about 60 seconds — a real project lead reaches out within 24 business
            hours to schedule your free on-site walk-through.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact#estimate"
              className="inline-flex items-center justify-center gap-2 bg-brand-red text-white px-8 py-4 rounded-md font-bold text-sm hover:bg-brand-red-dark transition-colors shadow-lg shadow-navy-950/40"
            >
              Get My Free Estimate
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </a>
            <a
              href={`tel:${BUSINESS.phoneRaw}`}
              className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-md font-bold text-sm hover:bg-white/20 transition-colors"
            >
              Call {BUSINESS.phone}
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}

function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-charcoal-400">{label}</dt>
      <dd className="text-white font-semibold text-right">{value}</dd>
    </div>
  );
}

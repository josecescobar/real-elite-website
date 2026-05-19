import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import Container from '@/components/shared/Container';
import { HOMEPAGE_PROJECT_SPOTLIGHT } from '@/lib/constants';

export default function ProjectSpotlight() {
  const project = HOMEPAGE_PROJECT_SPOTLIGHT;
  return (
    <section className="bg-white py-20 md:py-28">
      <Container size="wide">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Image — asymmetric, 7/12 on desktop */}
          <div className="relative lg:col-span-7 aspect-[4/3] lg:aspect-[5/4] overflow-hidden rounded-lg shadow-card-elevated">
            <Image
              src={project.image}
              alt={project.imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover"
            />
          </div>

          {/* Editorial copy — 5/12 on desktop */}
          <div className="lg:col-span-5">
            <p className="text-brand-red font-semibold text-xs uppercase tracking-[0.18em] mb-3">
              Project Spotlight
            </p>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-extrabold text-navy-800 leading-[1.05] tracking-tight mb-5">
              {project.title}
            </h2>
            <dl className="space-y-3 text-sm mb-6">
              <div className="flex gap-3">
                <dt className="text-charcoal-500 uppercase tracking-[0.12em] font-semibold text-xs w-24 pt-1 flex-shrink-0">
                  Location
                </dt>
                <dd className="text-navy-800 font-medium">{project.location}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="text-charcoal-500 uppercase tracking-[0.12em] font-semibold text-xs w-24 pt-1 flex-shrink-0">
                  Investment
                </dt>
                <dd className="text-navy-800 font-medium">{project.investmentRange}</dd>
              </div>
            </dl>
            <p className="text-charcoal-600 leading-relaxed mb-8">
              {project.scope}
            </p>
            <Link
              href={project.href}
              className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.15em] text-navy-800 hover:text-brand-red transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-navy-400 rounded-sm"
            >
              View Project Gallery
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import { HOMEPAGE_FEATURED_SERVICES } from '@/lib/constants';

/**
 * Editorial-asymmetric services grid.
 * Layout: 1 hero card (large) + 5 standard cards arranged across a 12-col grid.
 * Mobile collapses to a single column.
 */
export default function FeaturedServices() {
  const [hero, ...rest] = HOMEPAGE_FEATURED_SERVICES;

  return (
    <section className="bg-steel-50 py-20 md:py-28">
      <Container size="wide">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
          <SectionHeader
            eyebrow="What We Build"
            title="Premium remodeling. Honest exteriors. Real craftsmanship."
            subtitle="Every project — large or small — gets the same disciplined process, the same crew accountability, and the same warranty in writing."
          />
          <Link
            href="/services"
            className="hidden md:inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.15em] text-navy-800 hover:text-brand-red transition-colors group"
          >
            View All Services
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-6">
          {/* Hero card — spans 7 cols on desktop, 2 rows tall */}
          <Link
            href={hero.href}
            className="group relative md:col-span-7 md:row-span-2 overflow-hidden rounded-lg shadow-card-elevated bg-navy-900 min-h-[320px] md:min-h-[500px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-navy-400"
          >
            <Image
              src={hero.image}
              alt={hero.imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, 58vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-900/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-7 md:p-10 text-white">
              <p className="text-[0.7rem] uppercase tracking-[0.18em] font-semibold text-brand-red mb-3">
                {hero.eyebrow}
              </p>
              <h3 className="font-heading text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-3">
                {hero.title}
              </h3>
              <p className="text-charcoal-200 text-sm md:text-base max-w-md leading-relaxed mb-4">
                {hero.scope}
              </p>
              <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-white group-hover:text-brand-red transition-colors">
                See Projects
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </span>
            </div>
          </Link>

          {/* Standard cards — 5 cards spanning 5 cols each in pairs */}
          {rest.map((service) => (
            <Link
              key={service.title}
              href={service.href}
              className="group relative md:col-span-5 overflow-hidden rounded-lg shadow-md bg-navy-900 min-h-[200px] md:min-h-[240px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-navy-400"
            >
              <Image
                src={service.image}
                alt={service.imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 42vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-900/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <p className="text-[0.65rem] uppercase tracking-[0.18em] font-semibold text-brand-red mb-2">
                  {service.eyebrow}
                </p>
                <h3 className="font-heading text-xl md:text-2xl font-extrabold leading-tight mb-2">
                  {service.title}
                </h3>
                <p className="text-charcoal-200 text-xs md:text-sm leading-relaxed line-clamp-2 mb-3">
                  {service.scope}
                </p>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-white group-hover:text-brand-red transition-colors">
                  See Projects
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile "All Services" link */}
        <div className="md:hidden mt-8 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.15em] text-navy-800 hover:text-brand-red transition-colors"
          >
            View All Services
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}

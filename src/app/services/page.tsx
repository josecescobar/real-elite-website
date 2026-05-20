import type { Metadata } from 'next';
import Link from 'next/link';
import * as LucideIcons from 'lucide-react';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { BUSINESS, SERVICES } from '@/lib/constants';
import { SERVICE_DATA } from '@/lib/services-data';
import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import PrecisionProcess from '@/components/home/PrecisionProcess';
import AssurancesBand from '@/components/home/AssurancesBand';

export const metadata: Metadata = {
  title: `Services | ${BUSINESS.name}`,
  description:
    'Premium remodeling and exterior contracting — bathrooms, kitchens, basements, decks, roofing, siding, additions across the WV–MD–VA region.',
  keywords: [
    'contractor services',
    'bathroom remodeling',
    'kitchen remodeling',
    'basement finishing',
    'roofing',
    'siding',
    'decks',
    'home additions',
    'remodeling',
    'WV MD VA contractor',
  ],
  alternates: { canonical: `${BUSINESS.url}/services` },
  openGraph: {
    title: `Services | ${BUSINESS.name}`,
    description:
      'Premium remodeling + exteriors across the WV–MD–VA region. Veteran-owned. Built with military precision.',
    url: `${BUSINESS.url}/services`,
    type: 'website',
  },
};

type IconName =
  | 'Home'
  | 'Layers'
  | 'Fence'
  | 'Hammer'
  | 'Plus'
  | 'Wrench'
  | 'Paintbrush'
  | 'Bath'
  | 'ChefHat';

const getIcon = (iconName: IconName) => {
  const icons: Record<IconName, typeof LucideIcons.Home> = {
    Home: LucideIcons.Home,
    Layers: LucideIcons.Layers,
    Fence: LucideIcons.Fence,
    Hammer: LucideIcons.Hammer,
    Plus: LucideIcons.Plus,
    Wrench: LucideIcons.Wrench,
    Paintbrush: LucideIcons.Paintbrush,
    Bath: LucideIcons.Bath,
    ChefHat: LucideIcons.ChefHat,
  };
  return icons[iconName] ?? LucideIcons.Hammer;
};

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy-900 text-white pt-16 pb-20 md:pt-24 md:pb-28">
        <Container size="wide">
          <div className="max-w-3xl">
            <p className="text-brand-red text-xs uppercase tracking-[0.18em] font-semibold mb-4">
              Services
            </p>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.05] tracking-tight">
              What we build.
            </h1>
            <p className="text-charcoal-200 text-lg md:text-xl mt-6 leading-relaxed max-w-2xl">
              Premium remodeling and high-end exterior contracting across the WV–MD–VA region.
              Every project gets the same disciplined process, the same project lead, and the same
              workmanship warranty in writing.
            </p>
          </div>
        </Container>
      </section>

      {/* Services grid */}
      <section className="bg-white py-16 md:py-24">
        <Container size="wide">
          <SectionHeader
            eyebrow="Full Catalog"
            title="Every service, ordered by what homeowners hire us for most."
          />
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((service) => {
              const IconComponent = getIcon(service.icon as IconName);
              const startingAt = SERVICE_DATA[service.slug]?.investment?.startingAt;

              return (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="group bg-steel-50 hover:bg-white border border-charcoal-100 hover:border-brand-red hover:shadow-md transition-all rounded-lg p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-400"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="inline-flex items-center justify-center w-11 h-11 rounded-md bg-navy-800 text-white">
                      <IconComponent className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-charcoal-300 group-hover:text-brand-red transition-colors" />
                  </div>

                  <h3 className="font-heading text-xl font-extrabold text-navy-800 mb-2 group-hover:text-brand-red transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-charcoal-600 text-sm leading-relaxed mb-3">
                    {service.description}
                  </p>

                  {startingAt && (
                    <p className="text-[0.7rem] uppercase tracking-[0.12em] font-semibold text-charcoal-500">
                      Starting at{' '}
                      <span className="text-navy-800">{startingAt}</span>
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Process module */}
      <PrecisionProcess />

      {/* Assurances */}
      <AssurancesBand />

      {/* Final CTA */}
      <section className="bg-navy-900 text-white py-16 md:py-24">
        <Container size="default" className="text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-extrabold mb-5">
            Don&apos;t see your project type?
          </h2>
          <p className="text-charcoal-300 mb-8 max-w-2xl mx-auto">
            We specialize in custom solutions. Tell us what you&apos;re picturing and we&apos;ll
            tell you upfront whether we&apos;re the right fit.
          </p>
          <Link
            href="/#estimate"
            className="inline-flex items-center gap-2 bg-brand-red text-white px-8 py-4 rounded-md font-bold text-sm hover:bg-brand-red-dark transition-colors shadow-lg shadow-navy-950/40"
          >
            Get My Free Estimate
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Container>
      </section>
    </>
  );
}

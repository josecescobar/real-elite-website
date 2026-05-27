import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, MapPin } from 'lucide-react';
import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import {
  BUSINESS,
  PRIMARY_SERVICE_AREAS,
  SECONDARY_SERVICE_AREAS,
  CITY_DATA,
} from '@/lib/constants';

export const metadata: Metadata = {
  title: `Service Areas | ${BUSINESS.name}`,
  description:
    'Premium remodeling and exterior contracting across the WV–MD–VA region — Frederick MD, Winchester VA, Leesburg VA, Ashburn VA, Hagerstown MD, and the Eastern Panhandle WV.',
  keywords: [
    'service areas',
    'Eastern Panhandle',
    'Martinsburg WV',
    'Charles Town WV',
    'Frederick MD',
    'Winchester VA',
    'Leesburg VA',
    'Ashburn VA',
    'Hagerstown MD',
    'Loudoun County VA',
    'contractor service area',
    'WV contractor',
    'MD contractor',
    'VA contractor',
  ],
  alternates: { canonical: `${BUSINESS.url}/service-areas` },
  openGraph: {
    title: `Service Areas | ${BUSINESS.name}`,
    description:
      'Premium contracting across the WV–MD–VA region. Veteran-owned. Built with military precision.',
    url: `${BUSINESS.url}/service-areas`,
    type: 'website',
  },
};

/**
 * Regional groups for the index — equal-tier treatment per the rebuild
 * plan. No "expansion" gray tier; VA + MD are first-class alongside WV.
 */
const REGIONS = [
  {
    label: 'West Virginia',
    state: 'WV',
    blurb:
      'Our Eastern Panhandle home market. Headquartered in Martinsburg, serving Berkeley, Jefferson, and Morgan counties.',
    cities: [
      ...PRIMARY_SERVICE_AREAS.filter((a) => a.state === 'WV'),
      ...SECONDARY_SERVICE_AREAS.filter((a) => a.state === 'WV'),
    ],
  },
  {
    label: 'Maryland',
    state: 'MD',
    blurb:
      'Frederick County and the Cumberland Valley — bathrooms, kitchens, basements, and roofing for the I-70 corridor.',
    cities: [...PRIMARY_SERVICE_AREAS.filter((a) => a.state === 'MD')],
  },
  {
    label: 'Virginia',
    state: 'VA',
    blurb:
      'Loudoun County and the Northern Shenandoah Valley — premium decks, outdoor living, custom kitchens, and full remodels.',
    cities: [
      ...PRIMARY_SERVICE_AREAS.filter((a) => a.state === 'VA'),
      ...SECONDARY_SERVICE_AREAS.filter((a) => a.state === 'VA'),
    ],
  },
];

export default function ServiceAreasPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy-900 text-white pt-16 pb-20 md:pt-24 md:pb-28">
        <Container size="wide">
          <div className="max-w-3xl">
            <p className="text-brand-red text-xs uppercase tracking-[0.18em] font-semibold mb-4">
              Where We Work
            </p>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.05] tracking-tight">
              Premium contracting across
              <br />
              <span className="text-brand-red">WV, MD &amp; VA.</span>
            </h1>
            <p className="text-charcoal-200 text-lg md:text-xl mt-6 leading-relaxed max-w-2xl">
              Headquartered in Martinsburg. Trusted across the Eastern Panhandle, the
              Cumberland Valley, the Shenandoah Valley, Frederick County, and Loudoun County.
            </p>
          </div>
        </Container>
      </section>

      {/* Regional grids — equal-tier */}
      {REGIONS.map((region, idx) => (
        <section
          key={region.state}
          className={idx % 2 === 0 ? 'bg-white py-16 md:py-24' : 'bg-steel-50 py-16 md:py-24'}
        >
          <Container size="wide">
            <SectionHeader eyebrow={region.label} title={`${region.label}.`} subtitle={region.blurb} />

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {region.cities.map((c) => {
                const data = CITY_DATA[c.slug];
                const headline = data?.marketEmphasis?.slice(0, 3) ?? [];
                return (
                  <Link
                    key={c.slug}
                    href={`/service-areas/${c.slug}`}
                    className="group bg-white border border-charcoal-100 rounded-lg p-6 hover:border-brand-red hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <h3 className="font-heading text-xl md:text-2xl font-extrabold text-navy-800 group-hover:text-brand-red transition-colors">
                          {c.city}
                        </h3>
                        <p className="text-charcoal-500 text-xs uppercase tracking-[0.15em] font-semibold mt-1">
                          {c.state}
                        </p>
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-charcoal-300 group-hover:text-brand-red transition-colors flex-shrink-0" />
                    </div>
                    {headline.length > 0 && (
                      <p className="text-charcoal-500 text-xs mt-3">
                        Leads with:{' '}
                        <span className="text-charcoal-700 font-medium">
                          {headline.join(' · ')}
                        </span>
                      </p>
                    )}
                  </Link>
                );
              })}
            </div>
          </Container>
        </section>
      ))}

      {/* Final CTA */}
      <section className="bg-navy-900 text-white py-16 md:py-24">
        <Container size="default" className="text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-extrabold mb-6">
            Don&apos;t see your area?
          </h2>
          <p className="text-charcoal-300 mb-8 max-w-2xl mx-auto">
            We work across the broader WV–MD–VA region. If your project is nearby, we&apos;ll
            tell you upfront whether we&apos;re the right fit — no high-pressure sales calls.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact#estimate"
              className="bg-brand-red text-white px-8 py-4 rounded-md font-bold text-sm hover:bg-brand-red-dark transition-colors shadow-md inline-flex items-center justify-center gap-2"
            >
              Get a Free Estimate
              <ArrowUpRight className="w-4 h-4" />
            </a>
            <a
              href={`tel:${BUSINESS.phoneRaw}`}
              className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-md font-bold text-sm hover:bg-white/20 transition-colors inline-flex items-center justify-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              Call {BUSINESS.phone}
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}

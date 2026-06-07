import Link from 'next/link';
import { ArrowUpRight, CheckCircle2, MapPin, Phone } from 'lucide-react';

import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import StickyEstimateRail from '@/components/services/StickyEstimateRail';
import AssurancesBand from '@/components/home/AssurancesBand';
import JsonLd from '@/components/seo/JsonLd';
import FAQSchema from '@/components/seo/FAQSchema';

import { BUSINESS } from '@/lib/constants';
import {
  PAVING_ICONS,
  PAVING_SERVICES,
  getPavingLocation,
  type PavingLocation,
} from '@/lib/paving-data';

type Props = { location: PavingLocation };

export default function PavingLocationTemplate({ location }: Props) {
  const url = `${BUSINESS.url}/paving/locations/${location.slug}`;
  const regionLabel =
    location.state === 'WV'
      ? 'Eastern Panhandle'
      : location.state === 'MD'
        ? 'Cumberland Valley & Frederick County'
        : 'Northern Shenandoah Valley';

  const nearbyLocations = location.nearby
    .map((slug) => getPavingLocation(slug))
    .filter((l): l is PavingLocation => Boolean(l));

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BUSINESS.url },
      { '@type': 'ListItem', position: 2, name: 'Paving', item: `${BUSINESS.url}/paving` },
      { '@type': 'ListItem', position: 3, name: 'Locations', item: `${BUSINESS.url}/paving` },
      { '@type': 'ListItem', position: 4, name: `${location.city}, ${location.state}`, item: url },
    ],
  };

  const serviceAreaSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Asphalt Paving',
    provider: {
      '@type': 'GeneralContractor',
      name: BUSINESS.name,
      url: BUSINESS.url,
      telephone: BUSINESS.phone,
    },
    areaServed: {
      '@type': 'City',
      name: `${location.city}, ${location.state}`,
    },
    description: location.metaDescription,
  };

  return (
    <>
      <JsonLd schema={breadcrumbSchema} />
      <JsonLd schema={serviceAreaSchema} />
      <FAQSchema items={location.faqs} />

      {/* Hero */}
      <section className="bg-navy-900 text-white pt-16 pb-20 md:pt-24 md:pb-28">
        <Container size="wide">
          <nav aria-label="Breadcrumb" className="text-xs sm:text-sm text-charcoal-300 mb-6 flex items-center gap-2 flex-wrap">
            <Link href="/paving" className="hover:text-white transition-colors">Paving</Link>
            <span className="text-charcoal-500">/</span>
            <span className="text-white">{location.city}, {location.state}</span>
          </nav>

          <p className="text-brand-red text-xs uppercase tracking-[0.18em] font-semibold mb-4 inline-flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5" aria-hidden="true" /> Paving · {location.county}
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.05] tracking-tight">
            Paving in {location.city},
            <br />
            <span className="text-brand-red">{location.state}</span>
          </h1>
          <p className="text-charcoal-200 text-lg md:text-xl mt-6 leading-relaxed max-w-2xl">
            {location.heroSub}
          </p>

          {/* ZIP chips */}
          <ul className="flex flex-wrap gap-2 mt-8">
            {location.zips.map((z) => (
              <li key={z} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-3 py-1 text-xs text-charcoal-200">
                {z}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-4 mt-10">
            <a
              href="#estimate"
              className="bg-brand-red text-white px-7 py-3.5 rounded-md font-bold text-sm hover:bg-brand-red-dark transition-colors shadow-lg shadow-navy-950/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900 focus-visible:ring-brand-red"
            >
              Get My Free Estimate →
            </a>
            <a
              href={`tel:${BUSINESS.phoneRaw}`}
              className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-7 py-3.5 rounded-md font-bold text-sm hover:bg-white/20 transition-colors inline-flex items-center gap-2"
            >
              <Phone className="w-4 h-4" /> {BUSINESS.phone}
            </a>
          </div>
        </Container>
      </section>

      {/* About + sticky form rail */}
      <section className="bg-white py-16 md:py-24">
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-7 xl:col-span-8 space-y-16">
              {/* Local intro */}
              <div>
                <SectionHeader
                  eyebrow={`Paving in ${location.city}`}
                  title={`Asphalt paving for ${location.city}.`}
                />
                <div className="mt-6 space-y-5">
                  {location.intro.map((p) => (
                    <p key={p.slice(0, 32)} className="text-charcoal-700 text-base md:text-lg leading-relaxed">
                      {p}
                    </p>
                  ))}
                </div>
              </div>

              {/* Paving services in this city */}
              <div>
                <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-navy-800 mb-2">
                  Paving services in {location.city}
                </h2>
                <p className="text-charcoal-500 text-sm mb-6">
                  Every paving service we offer, available across {location.city} and {regionLabel}.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {PAVING_SERVICES.map((s) => {
                    const Icon = PAVING_ICONS[s.iconKey];
                    return (
                      <Link
                        key={s.slug}
                        href={`/paving/${s.slug}`}
                        className="group bg-steel-50 hover:bg-navy-800 rounded-lg p-5 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-md bg-navy-800 text-white group-hover:bg-brand-red transition-colors">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-heading text-base font-bold text-navy-800 group-hover:text-white transition-colors flex items-center gap-1">
                              {s.name} <ArrowUpRight className="w-3.5 h-3.5" />
                            </h3>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Local factors */}
              <div>
                <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-navy-800 mb-6">
                  What {location.city} paving takes
                </h2>
                <div className="space-y-4">
                  {location.localFactors.map((f) => (
                    <div key={f.title} className="bg-steel-50 border-l-4 border-brand-red rounded-r-lg p-6">
                      <h3 className="font-heading text-lg font-bold text-navy-800 mb-2">{f.title}</h3>
                      <p className="text-charcoal-600 text-sm md:text-base leading-relaxed">{f.body}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Why this market trusts us */}
              <div className="bg-steel-50 rounded-lg border-t-4 border-brand-red p-7 md:p-9">
                <p className="text-brand-red text-xs uppercase tracking-[0.18em] font-semibold mb-3">
                  Why {location.city} chooses Real Elite for paving
                </p>
                <ul className="space-y-3 text-charcoal-700">
                  {[
                    'Local and accountable — a named point of contact from estimate to final walk-through',
                    'Proper base prep and drainage-first grading, not just a thin top coat',
                    'Licensed and insured across West Virginia, Maryland, and Virginia',
                    'Honest repair-vs-replace advice and a sensible sealcoating cycle',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-brand-red flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right rail: sticky form preset to paving */}
            <div className="lg:col-span-5 xl:col-span-4">
              <StickyEstimateRail initialService="paving" />
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="bg-white py-16 md:py-24 border-t border-charcoal-100">
        <Container size="default">
          <SectionHeader
            eyebrow={`${location.city} Paving FAQ`}
            title={`Paving questions from ${location.city}.`}
            align="center"
            className="mx-auto"
          />
          <div className="mt-12 max-w-3xl mx-auto space-y-3">
            {location.faqs.map((item) => (
              <details
                key={item.question}
                className="group bg-steel-50 border border-charcoal-100 rounded-lg p-5 hover:border-brand-red transition-colors"
              >
                <summary className="cursor-pointer list-none flex items-start justify-between gap-4">
                  <span className="font-heading text-base md:text-lg font-bold text-navy-800">{item.question}</span>
                  <span className="text-brand-red font-bold text-xl leading-none group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-charcoal-700 text-sm md:text-base leading-relaxed mt-4">{item.answer}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      {/* Nearby areas */}
      <section className="bg-steel-50 py-16 md:py-24">
        <Container size="wide">
          <SectionHeader eyebrow="Nearby" title="Paving in neighboring communities." />
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {nearbyLocations.map((loc) => (
              <Link
                key={loc.slug}
                href={`/paving/locations/${loc.slug}`}
                className="group bg-white border border-charcoal-100 rounded-lg p-5 hover:border-brand-red hover:shadow-md transition-all"
              >
                <MapPin className="w-4 h-4 text-brand-red mb-2" aria-hidden="true" />
                <p className="font-heading font-bold text-navy-800 group-hover:text-brand-red transition-colors leading-tight">
                  {loc.city}, {loc.state}
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-4 text-sm">
            <Link href="/paving" className="text-navy-800 font-semibold hover:text-brand-red transition-colors inline-flex items-center gap-1">
              All paving services <ArrowUpRight className="w-4 h-4" />
            </Link>
            <span className="text-charcoal-300">·</span>
            <Link href="/service-areas" className="text-navy-800 font-semibold hover:text-brand-red transition-colors inline-flex items-center gap-1">
              Remodeling & exterior service areas <ArrowUpRight className="w-4 h-4" />
            </Link>
            <span className="text-charcoal-300">·</span>
            <Link href="/full-property-perimeter" className="text-navy-800 font-semibold hover:text-brand-red transition-colors inline-flex items-center gap-1">
              Full Property Perimeter bundle <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </Container>
      </section>

      <AssurancesBand />
    </>
  );
}

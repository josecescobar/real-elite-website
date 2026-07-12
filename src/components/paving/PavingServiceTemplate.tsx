import Link from 'next/link';
import { ArrowUpRight, CheckCircle2, MapPin, Phone } from 'lucide-react';

import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import StickyEstimateRail from '@/components/services/StickyEstimateRail';
import AssurancesBand from '@/components/home/AssurancesBand';
import JsonLd from '@/components/seo/JsonLd';
import FAQSchema from '@/components/seo/FAQSchema';

import { BUSINESS } from '@/lib/constants';
import { buildBreadcrumbSchema } from '@/lib/seo';
import {
  PAVING_ICONS,
  PAVING_SERVICES,
  PAVING_LOCATIONS,
  type PavingService,
} from '@/lib/paving-data';

type Props = { service: PavingService };

export default function PavingServiceTemplate({ service }: Props) {
  const url = `${BUSINESS.url}/paving/${service.slug}`;
  const Icon = PAVING_ICONS[service.iconKey];
  const otherServices = PAVING_SERVICES.filter((s) => s.slug !== service.slug);

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', item: BUSINESS.url },
    { name: 'Paving', item: `${BUSINESS.url}/paving` },
    { name: service.name, item: url },
  ]);

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: service.name,
    provider: {
      '@type': 'GeneralContractor',
      name: BUSINESS.name,
      url: BUSINESS.url,
      telephone: BUSINESS.phone,
    },
    areaServed: ['West Virginia', 'Maryland', 'Virginia'],
    description: service.metaDescription,
  };

  return (
    <>
      <JsonLd schema={breadcrumbSchema} />
      <JsonLd schema={serviceSchema} />
      <FAQSchema items={service.faqs} />

      {/* Hero */}
      <section className="bg-navy-900 text-white pt-16 pb-20 md:pt-24 md:pb-28">
        <Container size="wide">
          <nav aria-label="Breadcrumb" className="text-xs sm:text-sm text-charcoal-300 mb-6 flex items-center gap-2 flex-wrap">
            <Link href="/paving" className="hover:text-white transition-colors">Paving</Link>
            <span className="text-charcoal-500">/</span>
            <span className="text-white">{service.name}</span>
          </nav>

          <p className="text-brand-red-light text-xs uppercase tracking-[0.18em] font-semibold mb-4 inline-flex items-center gap-2">
            <Icon className="w-3.5 h-3.5" aria-hidden="true" /> {service.hero.eyebrow}
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.05] tracking-tight">
            {service.hero.line1}
            <br />
            <span className="text-brand-red-light">{service.hero.accent}</span>
          </h1>
          <p className="text-charcoal-200 text-lg md:text-xl mt-6 leading-relaxed max-w-2xl">
            {service.hero.sub}
          </p>

          <div className="flex flex-wrap gap-4 mt-10">
            <a
              href="#estimate"
              className="bg-brand-red text-white px-7 py-3.5 rounded-md font-bold text-sm hover:bg-brand-red-dark transition-colors shadow-lg shadow-navy-950/40 focus-ring-on-navy"
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

      {/* Intro + sticky form rail */}
      <section className="bg-white py-16 md:py-24">
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-7 xl:col-span-8 space-y-16">
              {/* Intro */}
              <div>
                <SectionHeader eyebrow={service.name} title={`${service.name} done to a standard.`} />
                <div className="mt-6 space-y-5">
                  {service.intro.map((p) => (
                    <p key={p.slice(0, 32)} className="text-charcoal-700 text-base md:text-lg leading-relaxed">
                      {p}
                    </p>
                  ))}
                </div>
              </div>

              {/* What's included */}
              <div>
                <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-navy-800 mb-6">
                  What&apos;s included
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {service.whatsIncluded.map((item) => (
                    <div key={item.title} className="bg-steel-50 border-t-4 border-brand-red rounded-lg p-6">
                      <h3 className="font-heading text-lg font-bold text-navy-800 mb-2">{item.title}</h3>
                      <p className="text-charcoal-600 text-sm leading-relaxed">{item.body}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Process */}
              <div>
                <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-navy-800 mb-6">
                  How the work runs
                </h2>
                <ol className="space-y-5">
                  {service.process.map((step, idx) => (
                    <li key={step.title} className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-red text-white flex items-center justify-center font-heading font-extrabold">
                        {idx + 1}
                      </div>
                      <div className="pt-1">
                        <h3 className="font-heading text-lg font-bold text-navy-800 mb-1">{step.title}</h3>
                        <p className="text-charcoal-600 text-sm md:text-base leading-relaxed">{step.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Investment */}
              <div className="bg-navy-900 text-white rounded-lg p-7 md:p-9 shadow-card-elevated">
                <p className="text-brand-red-light text-xs uppercase tracking-[0.18em] font-semibold mb-2">
                  Investment
                </p>
                <p className="font-heading text-2xl md:text-3xl font-extrabold mb-3">
                  {service.investment.range}
                </p>
                <p className="text-charcoal-200 text-sm leading-relaxed">{service.investment.note}</p>
              </div>

              {/* Why us */}
              <div className="bg-steel-50 rounded-lg border-t-4 border-brand-red p-7 md:p-9">
                <p className="text-brand-red-light text-xs uppercase tracking-[0.18em] font-semibold mb-3">
                  Why Real Elite
                </p>
                <ul className="space-y-3">
                  {service.signals.map((s) => (
                    <li key={s} className="flex items-start gap-3 text-charcoal-700">
                      <CheckCircle2 className="w-5 h-5 text-brand-red flex-shrink-0 mt-0.5" />
                      <span>{s}</span>
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

      {/* Locations served */}
      <section className="bg-steel-50 py-16 md:py-24">
        <Container size="wide">
          <SectionHeader
            eyebrow="Where We Pave"
            title={`${service.name} across WV, MD & VA.`}
            subtitle="Local, accountable paving throughout the Eastern Panhandle, Cumberland Valley, and Northern Shenandoah Valley."
          />
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {PAVING_LOCATIONS.map((loc) => (
              <Link
                key={loc.slug}
                href={`/paving/locations/${loc.slug}`}
                className="group bg-white border border-charcoal-100 rounded-lg p-4 hover:border-brand-red hover:shadow-md transition-all"
              >
                <MapPin className="w-4 h-4 text-brand-red mb-2" aria-hidden="true" />
                <p className="font-heading font-bold text-navy-800 text-sm group-hover:text-brand-red transition-colors leading-tight">
                  {loc.city}, {loc.state}
                </p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="bg-white py-16 md:py-24">
        <Container size="default">
          <SectionHeader
            eyebrow="Frequently Asked"
            title={`${service.name} questions, answered.`}
            align="center"
            className="mx-auto"
          />
          <div className="mt-12 max-w-3xl mx-auto space-y-3">
            {service.faqs.map((item) => (
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

      {/* Other paving services */}
      <section className="bg-steel-50 py-16 md:py-24">
        <Container size="wide">
          <SectionHeader eyebrow="More Paving Services" title="Explore the full paving lineup." />
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherServices.map((s) => {
              const OtherIcon = PAVING_ICONS[s.iconKey];
              return (
                <Link
                  key={s.slug}
                  href={`/paving/${s.slug}`}
                  className="group bg-white border border-charcoal-100 rounded-lg p-6 hover:border-brand-red hover:shadow-md transition-all"
                >
                  <div className="inline-flex items-center justify-center w-11 h-11 rounded-md bg-navy-800 text-white mb-4">
                    <OtherIcon className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-navy-800 group-hover:text-brand-red transition-colors flex items-center gap-1.5">
                    {s.name} <ArrowUpRight className="w-4 h-4" />
                  </h3>
                </Link>
              );
            })}
          </div>

          {/* Bundle cross-link */}
          <div className="mt-10 bg-navy-900 text-white rounded-lg p-7 md:p-9 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-brand-red-light text-xs uppercase tracking-[0.18em] font-semibold mb-2">
                Doing more than the driveway?
              </p>
              <h3 className="font-heading text-xl md:text-2xl font-extrabold">
                Roof, siding, deck & driveway — one coordinated project.
              </h3>
              <p className="text-charcoal-300 text-sm mt-2 max-w-xl">
                Our Full Property Perimeter bundle pairs Real Elite&apos;s exterior work with paving
                under one schedule and one point of contact.
              </p>
            </div>
            <Link
              href="/full-property-perimeter"
              className="flex-shrink-0 bg-brand-red text-white px-6 py-3 rounded-md font-bold text-sm hover:bg-brand-red-dark transition-colors inline-flex items-center gap-2 self-start md:self-auto"
            >
              See the Bundle <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </Container>
      </section>

      <AssurancesBand />
    </>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, ArrowRight, ArrowUpRight, MapPin } from 'lucide-react';
import {
  BUSINESS,
  SERVICES,
  EXPANSION_SERVICE_AREAS,
  LUXURY_CITY_SLUGS,
} from '@/lib/constants';
import { SERVICE_DATA } from '@/lib/services-data';
import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import StickyEstimateRail from '@/components/services/StickyEstimateRail';
import LuxuryConsultationRail from '@/components/services/LuxuryConsultationRail';
import InvestmentRanges from '@/components/services/InvestmentRanges';
import PrecisionProcess from '@/components/home/PrecisionProcess';
import AssurancesBand from '@/components/home/AssurancesBand';
import JsonLd from '@/components/seo/JsonLd';
import { buildBreadcrumbSchema } from '@/lib/seo';
import {
  CONTENT,
  type FeaturedServiceSlug,
  type ExpansionCitySlug,
} from '@/lib/service-city-content';

// ─── Data ────────────────────────────────────────────────────────────────────

/**
 * Maps a service slug to the project type the luxury design-consultation
 * form expects. Used on luxury markets so a Bathroom → McLean visitor lands
 * on /design-consultation?type=bathroom with the field pre-selected.
 */
const CONSULTATION_TYPE_FOR_SERVICE: Partial<
  Record<
    FeaturedServiceSlug,
    'kitchen' | 'bathroom' | 'basement' | 'whole-home' | 'addition'
  >
> = {
  bathrooms: 'bathroom',
  kitchens: 'kitchen',
  basements: 'basement',
  remodeling: 'whole-home',
};

// ─── Static Params ────────────────────────────────────────────────────────────

/**
 * Refuse to render service+city combos outside generateStaticParams.
 * Hagerstown MD + Loudoun County VA would otherwise be rendered
 * on-demand and hit notFound() at runtime — visible as soft 404s in
 * Search Console. With dynamicParams=false, Next returns a hard 404
 * for any combo not in the list.
 */
export const dynamicParams = false;

/**
 * Build params straight off the CONTENT keys so partial coverage is
 * safe — bathrooms/kitchens/basements only render in the markets where
 * a CONTENT entry exists. Adding a key to CONTENT auto-publishes the
 * route on next build.
 */
export function generateStaticParams() {
  return (Object.keys(CONTENT) as `${FeaturedServiceSlug}-${ExpansionCitySlug}`[]).map(
    (key) => {
      const dashIdx = key.indexOf('-');
      return {
        service: key.slice(0, dashIdx),
        city: key.slice(dashIdx + 1),
      };
    }
  );
}

// Cross-link helpers — derived from what's actually published in CONTENT.
function citiesForService(serviceSlug: string): readonly string[] {
  return (Object.keys(CONTENT) as `${FeaturedServiceSlug}-${ExpansionCitySlug}`[])
    .filter((k) => k.startsWith(`${serviceSlug}-`))
    .map((k) => k.slice(serviceSlug.length + 1));
}

function servicesForCity(citySlug: string): readonly string[] {
  return (Object.keys(CONTENT) as `${FeaturedServiceSlug}-${ExpansionCitySlug}`[])
    .filter((k) => k.endsWith(`-${citySlug}`))
    .map((k) => k.slice(0, k.length - citySlug.length - 1));
}

// ─── Metadata ────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ service: string; city: string }>;
}): Promise<Metadata> {
  const { service, city } = await params;
  const serviceData = SERVICES.find((s) => s.slug === service);
  const cityData = EXPANSION_SERVICE_AREAS.find((a) => a.slug === city);

  if (!serviceData || !cityData) return { title: 'Not Found' };

  const title = `${serviceData.title} in ${cityData.city}, ${cityData.state} | Real Elite`;
  const description = `Expert ${serviceData.title.toLowerCase()} services in ${cityData.city}, ${cityData.state}. Real Elite Contracting — veteran-owned, quality guaranteed. Get a free estimate today.`;

  return {
    title,
    description,
    keywords: [
      `${serviceData.title.toLowerCase()} ${cityData.city}`,
      `${cityData.city} ${serviceData.title.toLowerCase()}`,
      `${serviceData.title.toLowerCase()} contractor ${cityData.city} ${cityData.state}`,
      `${cityData.city} home improvement`,
      `${cityData.state} contractor`,
    ],
    alternates: {
      canonical: `${BUSINESS.url}/services/${service}/${city}`,
    },
    openGraph: {
      title,
      description,
      url: `${BUSINESS.url}/services/${service}/${city}`,
      type: 'website',
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ServiceCityPage({
  params,
}: {
  params: Promise<{ service: string; city: string }>;
}) {
  const { service, city } = await params;
  const serviceData = SERVICES.find((s) => s.slug === service);
  const cityData = EXPANSION_SERVICE_AREAS.find((a) => a.slug === city);
  const contentKey = `${service}-${city}` as keyof typeof CONTENT;
  const content = CONTENT[contentKey];

  if (!serviceData || !cityData || !content) {
    notFound();
  }

  // SEO: Service schema scoped to this specific city, plus a
  // BreadcrumbList. No per-market LocalBusiness duplication (the global
  // GeneralContractor in layout.tsx already covers areaServed).
  const richServiceData = SERVICE_DATA[serviceData.slug];
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${serviceData.title} in ${cityData.city}, ${cityData.state}`,
    serviceType: richServiceData?.serviceType ?? serviceData.title,
    description:
      richServiceData?.metaDescription ??
      `${serviceData.title} services for ${cityData.city}, ${cityData.state} homeowners by Real Elite Contracting.`,
    provider: {
      '@type': 'GeneralContractor',
      name: BUSINESS.name,
      url: `${BUSINESS.url}/`,
      telephone: '+1-681-534-5515',
    },
    areaServed: {
      '@type': 'City',
      name: cityData.city,
      containedInPlace: { '@type': 'State', name: cityData.state },
    },
    url: `${BUSINESS.url}/services/${service}/${city}`,
  };

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', item: BUSINESS.url },
    { name: 'Services', item: `${BUSINESS.url}/services` },
    { name: serviceData.title, item: `${BUSINESS.url}/services/${service}` },
    { name: `${cityData.city}, ${cityData.state}`, item: `${BUSINESS.url}/services/${service}/${city}` },
  ]);

  // Cross-link rails — derived from what's actually published in CONTENT.
  const publishedOtherCities = new Set(citiesForService(serviceData.slug));
  const otherCitiesForThisService = EXPANSION_SERVICE_AREAS.filter(
    (a) => a.slug !== cityData.slug && publishedOtherCities.has(a.slug)
  ).slice(0, 5);

  const publishedOtherServices = new Set(servicesForCity(cityData.slug));
  const otherServicesForThisCity = SERVICES.filter(
    (s) => s.slug !== serviceData.slug && publishedOtherServices.has(s.slug)
  );

  return (
    <>
      <JsonLd schema={serviceSchema} />
      <JsonLd schema={breadcrumbSchema} />

      {/* Hero — editorial navy with brand-red eyebrow + breadcrumb */}
      <section className="relative isolate bg-navy-900 text-white">
        <div aria-hidden="true" className="absolute inset-0 -z-10 gradient-navy-hero" />
        <Container size="wide" className="py-20 md:py-28 lg:py-32">
          <nav
            aria-label="Breadcrumb"
            className="text-xs sm:text-sm text-charcoal-300 mb-6 flex items-center gap-2 flex-wrap"
          >
            <Link href="/services" className="hover:text-white transition-colors">
              Services
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-charcoal-500" aria-hidden="true" />
            <Link
              href={`/services/${serviceData.slug}`}
              className="hover:text-white transition-colors"
            >
              {serviceData.title}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-charcoal-500" aria-hidden="true" />
            <Link
              href={`/service-areas/${cityData.slug}`}
              className="hover:text-white transition-colors"
            >
              {cityData.city}, {cityData.state}
            </Link>
          </nav>

          <p className="text-brand-red-light text-xs uppercase tracking-[0.18em] font-semibold mb-4 inline-flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5" aria-hidden="true" /> {cityData.city}, {cityData.state}
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight max-w-4xl">
            {serviceData.title}
            <br />
            <span className="text-brand-red">in {cityData.city}.</span>
          </h1>
          <p className="text-charcoal-200 text-lg md:text-xl mt-6 leading-relaxed max-w-2xl">
            {richServiceData?.hero?.sub ?? serviceData.description}
          </p>

          <div className="flex flex-wrap gap-4 mt-10">
            <a
              href="#estimate"
              className="bg-brand-red text-white px-7 py-3.5 rounded-md font-bold text-sm hover:bg-brand-red-dark transition-colors shadow-lg shadow-navy-950/40"
            >
              Get My Free Estimate →
            </a>
            <a
              href={`tel:${BUSINESS.phoneRaw}`}
              className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-7 py-3.5 rounded-md font-bold text-sm hover:bg-white/20 transition-colors"
            >
              Call {BUSINESS.phone}
            </a>
          </div>
        </Container>
      </section>

      {/* Body + sticky form rail */}
      <section className="bg-white py-16 md:py-24">
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-7 xl:col-span-8 space-y-16">
              {/* Localized prose */}
              <div>
                <SectionHeader
                  eyebrow={`${serviceData.title} · ${cityData.city}`}
                  title={`Why ${cityData.city} homeowners hire us.`}
                />
                <div className="mt-7 space-y-5">
                  {content.paragraphs.map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-charcoal-700 text-base md:text-lg leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Investment ranges (when SERVICE_DATA has them) */}
              {richServiceData?.investment && (
                <InvestmentRanges
                  startingAt={richServiceData.investment.startingAt}
                  tiers={richServiceData.investment.tiers}
                  note={richServiceData.investment.note}
                />
              )}

              {/* Why this city trusts us */}
              <div className="bg-steel-50 rounded-lg border-t-4 border-brand-red p-7 md:p-9">
                <p className="text-brand-red text-xs uppercase tracking-[0.18em] font-semibold mb-3">
                  Why {cityData.city} homeowners choose Real Elite
                </p>
                <ul className="space-y-3 text-charcoal-700">
                  <li className="flex items-start gap-3">
                    <span className="text-brand-red font-bold flex-shrink-0">·</span>
                    <span>
                      One named project lead on every {cityData.city}{' '}
                      {serviceData.title.toLowerCase()} job — from estimate through final walkthrough.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-brand-red font-bold flex-shrink-0">·</span>
                    <span>
                      Daily updates, clean job site, 24-hour response standard.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-brand-red font-bold flex-shrink-0">·</span>
                    <span>
                      Written workmanship warranty + manufacturer warranties registered on your behalf.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-brand-red font-bold flex-shrink-0">·</span>
                    <span>
                      Licensed and insured in {cityData.state} — local permitting + inspections handled.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Cross-links */}
              <div>
                <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-navy-800 mb-6">
                  Keep exploring
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Link
                    href={`/services/${serviceData.slug}`}
                    className="group bg-steel-50 hover:bg-navy-800 rounded-md p-5 transition-colors"
                  >
                    <p className="text-[0.65rem] uppercase tracking-[0.15em] font-semibold text-brand-red mb-1">
                      Service overview
                    </p>
                    <p className="font-heading text-base font-bold text-navy-800 group-hover:text-white transition-colors inline-flex items-center gap-1.5">
                      All {serviceData.title}
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </p>
                  </Link>
                  <Link
                    href={`/service-areas/${cityData.slug}`}
                    className="group bg-steel-50 hover:bg-navy-800 rounded-md p-5 transition-colors"
                  >
                    <p className="text-[0.65rem] uppercase tracking-[0.15em] font-semibold text-brand-red mb-1">
                      Service area
                    </p>
                    <p className="font-heading text-base font-bold text-navy-800 group-hover:text-white transition-colors inline-flex items-center gap-1.5">
                      All services in {cityData.city}
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </p>
                  </Link>
                </div>

                {otherServicesForThisCity.length > 0 && (
                  <div className="mt-8">
                    <p className="text-[0.65rem] uppercase tracking-[0.15em] font-semibold text-charcoal-500 mb-3">
                      Other services in {cityData.city}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {otherServicesForThisCity.map((s) => (
                        <Link
                          key={s.slug}
                          href={`/services/${s.slug}/${cityData.slug}`}
                          className="inline-flex items-center gap-1.5 bg-white border border-charcoal-200 hover:border-brand-red text-navy-800 hover:text-brand-red rounded-md px-3 py-2 text-sm font-medium transition-colors"
                        >
                          {s.title} <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {otherCitiesForThisService.length > 0 && (
                  <div className="mt-8">
                    <p className="text-[0.65rem] uppercase tracking-[0.15em] font-semibold text-charcoal-500 mb-3">
                      {serviceData.title} in other markets
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {otherCitiesForThisService.map((c) => (
                        <Link
                          key={c.slug}
                          href={`/services/${serviceData.slug}/${c.slug}`}
                          className="inline-flex items-center gap-1.5 bg-white border border-charcoal-200 hover:border-brand-red text-navy-800 hover:text-brand-red rounded-md px-3 py-2 text-sm font-medium transition-colors"
                        >
                          {c.city}, {c.state} <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sticky right rail — luxury markets see the design-consultation
                CTA with the project type pre-filled; everyone else gets the
                standard multi-step estimate form. */}
            <div className="lg:col-span-5 xl:col-span-4">
              {LUXURY_CITY_SLUGS.has(city) ? (
                <LuxuryConsultationRail
                  initialProjectType={
                    CONSULTATION_TYPE_FOR_SERVICE[serviceData.slug as FeaturedServiceSlug]
                  }
                />
              ) : (
                <StickyEstimateRail initialService={serviceData.slug} />
              )}
            </div>
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
            Ready to start your {cityData.city} project?
          </h2>
          <p className="text-charcoal-300 mb-8 max-w-2xl mx-auto">
            Three short steps, about 60 seconds — a real project lead reaches out within 24
            business hours to schedule your free on-site walkthrough.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#estimate"
              className="inline-flex items-center justify-center gap-2 bg-brand-red text-white px-8 py-4 rounded-md font-bold text-sm hover:bg-brand-red-dark transition-colors shadow-lg shadow-navy-950/40"
            >
              Get My Free Estimate
              <ArrowRight className="w-4 h-4" />
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

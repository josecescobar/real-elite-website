import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, MapPin } from 'lucide-react';

import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import PrecisionProcess from '@/components/home/PrecisionProcess';
import AssurancesBand from '@/components/home/AssurancesBand';
import StickyEstimateRail from '@/components/services/StickyEstimateRail';
import RelatedGuides from '@/components/blog/RelatedGuides';
import JsonLd from '@/components/seo/JsonLd';

import { SERVICES, BUSINESS, GALLERY_IMAGES, type CityDataEntry } from '@/lib/constants';
import { SERVICE_DATA } from '@/lib/services-data';
import { getRecentPosts } from '@/lib/blog';

const FEATURED_DEEP_LINK_SLUGS = new Set(['roofing', 'decks', 'remodeling', 'siding']);

type City = { city: string; state: string; slug: string };

type Props = {
  city: City;
  data: CityDataEntry;
};

export default function CityPageTemplate({ city, data }: Props) {
  const url = `${BUSINESS.url}/service-areas/${city.slug}`;

  // Order services by marketEmphasis, then append remaining for completeness
  const emphasized = data.marketEmphasis
    .map((slug) => SERVICES.find((s) => s.slug === slug))
    .filter((s): s is (typeof SERVICES)[number] => Boolean(s));
  const otherServices = SERVICES.filter(
    (s) => !data.marketEmphasis.includes(s.slug)
  );
  const orderedServices = [...emphasized, ...otherServices];
  const [heroService, ...restServices] = orderedServices;

  // Pull localized guide cross-links — for now, the latest 3 (Phase 5
  // introduced the service-areas category; once we author localized
  // articles tagged with that category they'll auto-surface).
  const guidePosts = getRecentPosts(3);

  // Localized projects: just use a curated subset of GALLERY_IMAGES
  const projectShots = GALLERY_IMAGES.slice(0, 6);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BUSINESS.url },
      { '@type': 'ListItem', position: 2, name: 'Service Areas', item: `${BUSINESS.url}/service-areas` },
      { '@type': 'ListItem', position: 3, name: `${city.city}, ${city.state}`, item: url },
    ],
  };

  // Per the plan, no per-market LocalBusiness — the global
  // GeneralContractor in layout.tsx carries areaServed for every city
  // we serve. The city page uses Place + Service schemas instead.
  const placeSchema = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: `${city.city}, ${city.state}`,
    containedInPlace: { '@type': 'AdministrativeArea', name: city.state },
  };

  return (
    <>
      <JsonLd schema={breadcrumbSchema} />
      <JsonLd schema={placeSchema} />

      {/* Hero */}
      <section className="bg-navy-900 text-white pt-16 pb-20 md:pt-24 md:pb-28">
        <Container size="wide">
          <nav aria-label="Breadcrumb" className="text-xs sm:text-sm text-charcoal-300 mb-6 flex items-center gap-2 flex-wrap">
            <Link href="/service-areas" className="hover:text-white transition-colors">
              Service Areas
            </Link>
            <span className="text-charcoal-500">/</span>
            <span className="text-white">{city.city}, {city.state}</span>
          </nav>

          <p className="text-brand-red text-xs uppercase tracking-[0.18em] font-semibold mb-4 inline-flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5" aria-hidden="true" /> Service Area
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.05] tracking-tight">
            {city.city},
            <br />
            <span className="text-brand-red">{city.state}</span>
          </h1>
          <p className="text-charcoal-200 text-lg md:text-xl mt-6 leading-relaxed max-w-2xl">
            Premium remodeling and exterior craftsmanship for {city.city} homeowners. Veteran-owned,
            communication-first, and the same project lead from estimate to final walk-through.
          </p>

          {/* Neighborhood chips */}
          <ul className="flex flex-wrap gap-2 mt-8">
            {data.neighborhoods.slice(0, 6).map((n) => (
              <li
                key={n}
                className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-3 py-1 text-xs text-charcoal-200"
              >
                {n}
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
              className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-7 py-3.5 rounded-md font-bold text-sm hover:bg-white/20 transition-colors"
            >
              Call {BUSINESS.phone}
            </a>
          </div>
        </Container>
      </section>

      {/* About + sticky form rail */}
      <section className="bg-white py-16 md:py-24">
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-7 xl:col-span-8 space-y-16">
              {/* About */}
              <div>
                <SectionHeader
                  eyebrow={`About ${city.city}`}
                  title={`Premium contracting in ${city.city}.`}
                />
                <p className="text-charcoal-700 text-base md:text-lg leading-relaxed mt-6">
                  {data.description}
                </p>
              </div>

              {/* Featured services (hero card + standard cards) */}
              <div>
                <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-navy-800 mb-3">
                  What we build in {city.city}
                </h2>
                <p className="text-charcoal-500 text-sm mb-7">
                  Services ordered by what {city.city} homeowners are actually investing in.
                </p>

                {/* Hero service card */}
                {heroService && (
                  <ServiceCard
                    citySlug={city.slug}
                    serviceSlug={heroService.slug}
                    title={heroService.title}
                    hero
                  />
                )}

                {/* Standard service grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  {restServices.slice(0, 5).map((s) => (
                    <ServiceCard
                      key={s.slug}
                      citySlug={city.slug}
                      serviceSlug={s.slug}
                      title={s.title}
                    />
                  ))}
                </div>

                <details className="mt-5 group">
                  <summary className="cursor-pointer text-sm font-semibold text-charcoal-700 hover:text-navy-800 list-none flex items-center gap-2">
                    <span className="inline-block w-4 h-4 rounded-full border-2 border-charcoal-400 flex-shrink-0 relative">
                      <span className="absolute inset-0 flex items-center justify-center text-charcoal-600 text-xs group-open:rotate-45 transition-transform">+</span>
                    </span>
                    Show all services we offer in {city.city}
                  </summary>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pl-6">
                    {orderedServices.slice(6).map((s) => (
                      <Link
                        key={s.slug}
                        href={`/services/${s.slug}`}
                        className="text-sm font-medium text-charcoal-700 hover:text-brand-red transition-colors"
                      >
                        {s.title} →
                      </Link>
                    ))}
                  </div>
                </details>
              </div>

              {/* Neighborhoods served */}
              <div>
                <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-navy-800 mb-6">
                  Neighborhoods we work in
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                  {data.neighborhoods.map((n) => (
                    <li key={n} className="flex items-center gap-2 text-charcoal-700">
                      <MapPin className="w-4 h-4 text-brand-red flex-shrink-0" aria-hidden="true" />
                      <span>{n}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recent projects */}
              <div>
                <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-navy-800 mb-3">
                  Recent project work
                </h2>
                <p className="text-charcoal-500 text-sm mb-6">
                  Real Real Elite jobs from across the WV–MD–VA region. {city.city}-specific
                  projects featured on our <Link href="/gallery" className="text-navy-800 underline hover:text-brand-red">gallery page</Link>.
                </p>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {projectShots.map((img) => (
                    <div
                      key={img.src}
                      className="relative aspect-[4/3] overflow-hidden rounded-md shadow-sm"
                    >
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        sizes="(max-width: 768px) 50vw, 240px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Why this market trusts us */}
              <div className="bg-steel-50 rounded-lg border-t-4 border-brand-red p-7 md:p-9">
                <p className="text-brand-red text-xs uppercase tracking-[0.18em] font-semibold mb-3">
                  Why {city.city} homeowners choose Real Elite
                </p>
                <ul className="space-y-3 text-charcoal-700">
                  <li className="flex items-start gap-3">
                    <span className="text-brand-red font-bold flex-shrink-0">·</span>
                    <span>One named project lead from estimate through final walk-through.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-brand-red font-bold flex-shrink-0">·</span>
                    <span>Daily updates, clean job site, 24-hour response standard.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-brand-red font-bold flex-shrink-0">·</span>
                    <span>Written workmanship warranty on every project, every time.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-brand-red font-bold flex-shrink-0">·</span>
                    <span>Licensed and insured across West Virginia, Maryland, and Virginia.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right rail: sticky form */}
            <div className="lg:col-span-5 xl:col-span-4">
              <StickyEstimateRail />
            </div>
          </div>
        </Container>
      </section>

      {/* Process module */}
      <PrecisionProcess />

      {/* Localized guides */}
      <section className="bg-white py-16 md:py-24">
        <Container size="wide">
          <SectionHeader
            eyebrow="Read first"
            title={`Guides for ${city.city} homeowners.`}
            subtitle="Pricing, permits, material choices — practical reading before you sign anything."
          />
          <div className="mt-10">
            <RelatedGuides posts={guidePosts} heading="" />
          </div>
        </Container>
      </section>

      {/* Assurances */}
      <AssurancesBand />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  ServiceCard — local sub-component                                         */
/* -------------------------------------------------------------------------- */

function ServiceCard({
  citySlug,
  serviceSlug,
  title,
  hero = false,
}: {
  citySlug: string;
  serviceSlug: string;
  title: string;
  hero?: boolean;
}) {
  // Deep-link service+city pages exist for roofing/decks/remodeling/siding
  // and the 4 expansion cities (winchester/frederick/leesburg/ashburn).
  const deepLinkAvailable =
    FEATURED_DEEP_LINK_SLUGS.has(serviceSlug) &&
    ['winchester-va', 'frederick-md', 'leesburg-va', 'ashburn-va'].includes(citySlug);

  const href = deepLinkAvailable
    ? `/services/${serviceSlug}/${citySlug}`
    : `/services/${serviceSlug}`;

  const svcData = SERVICE_DATA[serviceSlug];
  const heroImage = svcData?.hero?.image ?? svcData?.overview?.image;
  const eyebrow = svcData?.hero?.eyebrow;
  const startingAt = svcData?.investment?.startingAt;

  if (hero) {
    return (
      <Link
        href={href}
        className="group relative block overflow-hidden rounded-lg shadow-card-elevated bg-navy-900 min-h-[260px] sm:min-h-[300px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-navy-400"
      >
        {heroImage ? (
          <>
            <Image
              src={heroImage.src}
              alt={heroImage.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-900/30 to-transparent" />
          </>
        ) : (
          <div aria-hidden="true" className="absolute inset-0 gradient-navy-hero" />
        )}
        <div className="relative p-7 md:p-9 h-full flex flex-col justify-end text-white">
          {eyebrow && (
            <p className="text-[0.65rem] uppercase tracking-[0.18em] font-semibold text-brand-red mb-2">
              {eyebrow}
            </p>
          )}
          <h3 className="font-heading text-2xl md:text-3xl font-extrabold leading-tight">
            {title}
          </h3>
          {startingAt && (
            <p className="text-charcoal-200 text-sm mt-2">
              Starting at <span className="font-bold text-white">{startingAt}</span>
            </p>
          )}
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-white group-hover:text-brand-red transition-colors mt-4">
            See {title.toLowerCase()} <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="group bg-steel-50 hover:bg-navy-800 rounded-md p-5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-400"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-heading text-base sm:text-lg font-bold text-navy-800 group-hover:text-white transition-colors">
            {title}
          </h3>
          {startingAt && (
            <p className="text-xs text-charcoal-500 group-hover:text-charcoal-300 mt-1 transition-colors">
              Starting at <span className="font-semibold">{startingAt}</span>
            </p>
          )}
        </div>
        <ArrowUpRight className="w-4 h-4 text-charcoal-400 group-hover:text-white transition-colors flex-shrink-0 mt-1" />
      </div>
    </Link>
  );
}

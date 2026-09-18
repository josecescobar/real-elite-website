import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, MapPin } from 'lucide-react';

import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import PrecisionProcess from '@/components/home/PrecisionProcess';
import AssurancesBand from '@/components/home/AssurancesBand';
import StickyEstimateRail from '@/components/services/StickyEstimateRail';
import LuxuryConsultationRail from '@/components/services/LuxuryConsultationRail';
import RelatedGuides from '@/components/blog/RelatedGuides';
import JsonLd from '@/components/seo/JsonLd';
import FAQSchema from '@/components/seo/FAQSchema';

import {
  SERVICES,
  BUSINESS,
  LUXURY_CITY_SLUGS,
  selectGalleryFor,
  areaRegionLabel,
  formatAreaPlace,
  areaSchemaType,
  childAreasOf,
  areaAncestors,
  isLocalityArea,
  type CityDataEntry,
  type ServiceArea,
} from '@/lib/constants';
import { SERVICE_DATA } from '@/lib/services-data';
import { getRecentPosts, getPostBySlug } from '@/lib/blog';
import { buildBreadcrumbSchema } from '@/lib/seo';
import { getProjectsByCity } from '@/lib/projects';
import RelatedProjectsRail from '@/components/projects/RelatedProjectsRail';
import ReviewsSection from '@/components/reviews/ReviewsSection';
import { getReviewsByCity } from '@/lib/reviews';
import PhoneLink from '@/components/analytics/PhoneLink';

const FEATURED_DEEP_LINK_SLUGS = new Set(['roofing', 'decks', 'remodeling', 'siding']);

/**
 * Map a city to the permit guide that genuinely covers its jurisdiction, so
 * each city page surfaces accurate local permit content. Deliberately
 * conservative: only cities a guide truly covers are mapped — an unmapped city
 * simply shows recent guides instead of a permit guide for the wrong county.
 */
const BERKELEY_JEFFERSON_WV = new Set([
  'martinsburg-wv', 'inwood-wv', 'hedgesville-wv', 'falling-waters-wv', 'spring-mills-wv',
  'charles-town-wv', 'ranson-wv', 'shepherdstown-wv', 'kearneysville-wv', 'harpers-ferry-wv',
]);
const LOUDOUN_VA = new Set(['leesburg-va', 'ashburn-va', 'loudoun-county-va', 'middleburg-va']);

function permitGuideSlugForCity(citySlug: string): string | null {
  if (BERKELEY_JEFFERSON_WV.has(citySlug)) return 'deck-permits-berkeley-jefferson-county-wv-2026';
  if (citySlug === 'frederick-md') return 'frederick-md-home-improvement-permits-costs-2026';
  if (LOUDOUN_VA.has(citySlug)) return 'loudoun-county-permits-hoa-guide-2026';
  return null;
}

/**
 * The hero splits its heading across two lines with the second in brand red.
 * For a locality that is "Vienna," / "VA". A region already carries its state
 * inside the name, so splitting off the last word — "Northern" / "Virginia" —
 * keeps the same rhythm without rendering "Northern Virginia," / "VA".
 */
function heroLines(area: ServiceArea): [string, string] {
  if (area.kind !== 'region') return [`${area.city},`, area.state];
  const words = area.city.split(' ');
  if (words.length < 2) return [area.city, ''];
  return [words.slice(0, -1).join(' '), words[words.length - 1]];
}

type Props = {
  /**
   * The full catalog row, not a `{city, state, slug}` literal. The template
   * needs `market` to decide which service-level promises it may make, and
   * `kind`/`parent` to name the surrounding region correctly.
   */
  city: ServiceArea;
  data: CityDataEntry;
};

export default function CityPageTemplate({ city, data }: Props) {
  const url = `${BUSINESS.url}/service-areas/${city.slug}`;

  // A county or region lists the areas inside it; a town lists neighbourhoods.
  const children = isLocalityArea(city) ? [] : childAreasOf(city.slug);
  const [heroHead, heroTail] = heroLines(city);

  // "Why {place} homeowners choose Real Elite", gated by market.
  //
  // Three of these four are registered `unconfirmed` in src/lib/claims.ts —
  // named project lead, daily updates / clean job site, written workmanship
  // warranty. CLAUDE.md: claims about how the business operates go in only
  // once the owner has confirmed them, and the altitude doc calls these
  // "contract-dispute material" against a $250,000 Great Falls basement.
  //
  // They are therefore withheld in the premium markets, which is where the
  // exposure is. That includes the Northern Virginia hub this gate was added
  // for: a new URL making an unconfirmed promise is the claim spreading, and
  // "it was already on the other pages" is not a defence — it is thirteen
  // more pages that should not have carried it either.
  //
  // Only the licensing line is left there. It is verified and it is the one
  // an out-of-state homeowner most needs. Flip the three claims to
  // `verified` in claims.ts and delete this gate to restore them everywhere.
  const trustPoints =
    city.market === 'home'
      ? [
          'One named project lead from estimate through final walk-through.',
          'Daily updates, clean job site, 24-hour response standard.',
          'Written workmanship warranty on every project, every time.',
          'Licensed and insured across West Virginia, Maryland, and Virginia.',
        ]
      : ['Licensed and insured across West Virginia, Maryland, and Virginia.'];

  // The hero sub carried the same unconfirmed `named-project-lead` claim as
  // the trust block above — "the same project lead from estimate to final
  // walk-through" — and the first version of that gate missed it. Gated on the
  // same condition, with the verified licensing fact in its place so the
  // premium hero still says something concrete.
  const heroSub =
    city.market === 'home'
      ? `Premium remodeling and exterior craftsmanship for ${city.city} homeowners. Veteran-owned, communication-first, and the same project lead from estimate to final walk-through.`
      : `Premium remodeling and exterior craftsmanship for ${city.city} homeowners. Veteran-owned, and licensed and insured across West Virginia, Maryland and Virginia.`;

  // Order services by marketEmphasis, then append remaining for completeness
  const emphasized = data.marketEmphasis
    .map((slug) => SERVICES.find((s) => s.slug === slug))
    .filter((s): s is (typeof SERVICES)[number] => Boolean(s));
  const otherServices = SERVICES.filter(
    (s) => !data.marketEmphasis.includes(s.slug)
  );
  const orderedServices = [...emphasized, ...otherServices];
  const [heroService, ...restServices] = orderedServices;

  // Localized guide cross-links: surface this city's own jurisdiction permit
  // guide first (accurate local content = local SEO + trust), then fill with
  // recent guides. Only cities whose jurisdiction a permit guide actually
  // covers are mapped — never over-claim a guide for the wrong county.
  const permitSlug = permitGuideSlugForCity(city.slug);
  const permitPost = permitSlug ? getPostBySlug(permitSlug) : null;
  const guidePosts = [
    permitPost,
    ...getRecentPosts(4).filter((p) => p.slug !== permitPost?.slug),
  ]
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .slice(0, 3);

  // Localized projects: prefer city-tagged photos, fall back to
  // state-tagged, then the full gallery. selectGalleryFor handles
  // the cascade.
  const projectShots = selectGalleryFor(city.slug, city.state, 6);

  // Localized FAQ — answers the common pre-quote questions in a way
  // that AI Overviews / SGE can quote directly. Adds FAQPage structured
  // data on every city page for SEO + AI-search coverage.
  // Scheduling promise, gated on market.
  //
  // This FAQ used to tell every area that it "sits inside our primary service
  // radius, so on-site visits are typically scheduled within the same week."
  // That is plausible for the Eastern Panhandle home market and indefensible
  // sixty miles away in Fairfax County, where the business has no presence
  // beyond its pin. CLAUDE.md requires owner confirmation for claims about how
  // the business operates, and this one is unconfirmed for the premium markets,
  // so premium pages now answer the question without the radius promise.
  const quotePromise =
    city.market === 'home'
      ? ` ${city.city} sits inside our primary service radius, so on-site visits are typically scheduled within the same week.`
      : '';

  const localFaqs: { question: string; answer: string }[] = [
    {
      question: `Does Real Elite Contracting serve ${formatAreaPlace(city)}?`,
      // A region or county has no "surrounding region" — phrasing it that way
      // produced "Northern Virginia and the surrounding Northern Virginia" and
      // "Loudoun County and the surrounding Loudoun County area". They name
      // the areas inside them instead.
      answer:
        children.length > 0
          ? `Yes. Real Elite Contracting works across ${city.city}, including ${children
              .slice(0, 5)
              .map((a) => a.city)
              .join(', ')}. We are headquartered in Martinsburg, WV and are licensed and insured in West Virginia, Maryland, and Virginia.`
          : `Yes. Real Elite Contracting works across ${city.city} and the surrounding ${areaRegionLabel(city)}. We are headquartered in Martinsburg, WV and are licensed and insured in West Virginia, Maryland, and Virginia.`,
    },
    {
      question: `What services does Real Elite offer in ${city.city}?`,
      answer: `In ${city.city} we focus on ${data.marketEmphasis.slice(0, 5).map((s) => SERVICES.find((sv) => sv.slug === s)?.title ?? s).join(', ')}, plus general remodeling, additions, and exterior repairs. Our work is veteran-owned and built with military precision.`,
    },
    {
      question: `How fast can I get a quote in ${city.city}?`,
      answer: `For roofing, our AI Instant Roof Quote returns a ballpark price from your address in about 60 seconds — no ladder, no appointment. For other services, a project lead follows up within 24 business hours with a free written estimate.${quotePromise}`,
    },
    {
      question: `Is Real Elite Contracting really veteran-owned?`,
      answer: `Yes. Real Elite Contracting is veteran-owned and operated, with SDVOSB (Service-Disabled Veteran-Owned Small Business) federal certification in progress. Our tagline — "Military Precision. Civilian Excellence." — is grounded in the standards of service.`,
    },
  ];

  // Ancestors run nearest-first from the catalog, so reverse them for a trail
  // that reads outside-in: Home › Service Areas › Northern Virginia › Loudoun
  // County › Middleburg.
  const ancestors = [...areaAncestors(city)].reverse();

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', item: BUSINESS.url },
    { name: 'Service Areas', item: `${BUSINESS.url}/service-areas` },
    ...ancestors.map((a) => ({
      name: formatAreaPlace(a),
      item: `${BUSINESS.url}/service-areas/${a.slug}`,
    })),
    { name: formatAreaPlace(city), item: url },
  ]);

  // Real case-study projects located in this city (from the Project System).
  const cityProjects = getProjectsByCity(city.slug, 3);

  // Per the plan, no per-market LocalBusiness — the global
  // GeneralContractor in layout.tsx carries areaServed for every city
  // we serve. The city page uses Place + Service schemas instead.
  const placeSchema = {
    '@context': 'https://schema.org',
    '@type': areaSchemaType(city),
    name: formatAreaPlace(city),
    containedInPlace: { '@type': 'AdministrativeArea', name: city.state },
  };

  return (
    <>
      <JsonLd schema={breadcrumbSchema} />
      <JsonLd schema={placeSchema} />
      <FAQSchema items={localFaqs} />

      {/* Hero */}
      <section className="bg-navy-900 text-white pt-16 pb-20 md:pt-24 md:pb-28">
        <Container size="wide">
          <nav aria-label="Breadcrumb" className="text-xs sm:text-sm text-charcoal-300 mb-6 flex items-center gap-2 flex-wrap">
            <Link href="/service-areas" className="hover:text-white transition-colors">
              Service Areas
            </Link>
            {ancestors.map((a) => (
              <span key={a.slug} className="flex items-center gap-2">
                <span className="text-charcoal-500">/</span>
                <Link
                  href={`/service-areas/${a.slug}`}
                  className="hover:text-white transition-colors"
                >
                  {formatAreaPlace(a)}
                </Link>
              </span>
            ))}
            <span className="text-charcoal-500">/</span>
            <span className="text-white">{formatAreaPlace(city)}</span>
          </nav>

          <p className="text-brand-red-light text-xs uppercase tracking-[0.18em] font-semibold mb-4 inline-flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5" aria-hidden="true" /> Service Area
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.05] tracking-tight">
            {heroHead}
            <br />
            <span className="text-brand-red">{heroTail}</span>
          </h1>
          <p className="text-charcoal-200 text-lg md:text-xl mt-6 leading-relaxed max-w-2xl">
            {heroSub}
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
              className="bg-brand-red text-white px-7 py-3.5 rounded-md font-bold text-sm hover:bg-brand-red-dark transition-colors shadow-lg shadow-navy-950/40 focus-ring-on-navy"
            >
              Get My Free Estimate →
            </a>
            <PhoneLink
              location="city_page_cta"
              className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-7 py-3.5 rounded-md font-bold text-sm hover:bg-white/20 transition-colors"
            >
              Call {BUSINESS.phone}
            </PhoneLink>
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

              {/* Areas inside this one (region/county) or neighbourhoods (town). */}
              <div>
                <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-navy-800 mb-6">
                  {children.length > 0
                    ? `Where we work in ${city.city}`
                    : 'Neighborhoods we work in'}
                </h2>
                {children.length > 0 ? (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                    {children.map((a) => (
                      <li key={a.slug}>
                        <Link
                          href={`/service-areas/${a.slug}`}
                          className="group flex items-center gap-2 text-charcoal-700 hover:text-brand-red transition-colors"
                        >
                          <MapPin
                            className="w-4 h-4 text-brand-red flex-shrink-0"
                            aria-hidden="true"
                          />
                          <span>{formatAreaPlace(a)}</span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-charcoal-300 group-hover:text-brand-red transition-colors" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                    {data.neighborhoods.map((n) => (
                      <li key={n} className="flex items-center gap-2 text-charcoal-700">
                        <MapPin
                          className="w-4 h-4 text-brand-red flex-shrink-0"
                          aria-hidden="true"
                        />
                        <span>{n}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Real project case studies in this city (Project System) */}
              <RelatedProjectsRail
                projects={cityProjects}
                heading={`Recent projects in ${city.city}`}
              />

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
                  {trustPoints.map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <span className="text-brand-red font-bold flex-shrink-0">·</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right rail: luxury markets get the design-consultation CTA;
                everyone else gets the standard multi-step estimate form. */}
            <div className="lg:col-span-5 xl:col-span-4">
              {LUXURY_CITY_SLUGS.has(city.slug) ? (
                <LuxuryConsultationRail />
              ) : (
                <StickyEstimateRail />
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Process module */}
      <PrecisionProcess />

      {/* Reviews in this city — renders only when a matching review exists */}
      <ReviewsSection
        reviews={getReviewsByCity(city.slug)}
        eyebrow="Reviews"
        title={`What ${city.city} homeowners say.`}
      />

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

      {/* Localized FAQ — surfaces structured answers for AI Overview / SGE */}
      <section className="bg-steel-50 py-16 md:py-24">
        <Container size="default">
          <SectionHeader
            eyebrow={`${city.city} FAQ`}
            title={`Questions ${city.city} homeowners ask first.`}
            align="center"
            className="mx-auto"
          />
          <div className="mt-12 max-w-3xl mx-auto space-y-3">
            {localFaqs.map((item) => (
              <details
                key={item.question}
                className="group bg-white border border-charcoal-100 rounded-lg p-5 hover:border-brand-red transition-colors"
              >
                <summary className="cursor-pointer list-none flex items-start justify-between gap-4">
                  <span className="font-heading text-base md:text-lg font-bold text-navy-800">
                    {item.question}
                  </span>
                  <span className="text-brand-red font-bold text-xl leading-none group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <p className="text-charcoal-700 text-sm md:text-base leading-relaxed mt-4">
                  {item.answer}
                </p>
              </details>
            ))}
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

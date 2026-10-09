import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, MapPin } from 'lucide-react';

import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import PrecisionProcess from '@/components/home/PrecisionProcess';
import AssurancesBand from '@/components/home/AssurancesBand';
import StickyEstimateRail from '@/components/services/StickyEstimateRail';
import LuxuryConsultationRail from '@/components/services/LuxuryConsultationRail';
import OutdoorLivingInspiration from '@/components/services/OutdoorLivingInspiration';
import RelatedGuides from '@/components/blog/RelatedGuides';
import JsonLd from '@/components/seo/JsonLd';
import FAQSchema from '@/components/seo/FAQSchema';

import {
  SERVICES,
  BUSINESS,
  LUXURY_CITY_SLUGS,
  selectGalleryFor,
  areaRegionLabel,
  areaHeroLane,
  areaQuotesSameWeek,
  formatAreaPlace,
  areaSchemaType,
  childAreasOf,
  areaAncestors,
  isLocalityArea,
  ALL_SERVICE_AREAS,
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
import TrackedLink from '@/components/analytics/TrackedLink';
import { serviceHrefForArea } from '@/lib/service-city-content';
import { TownServiceLinksForTown } from '@/components/services/TownServiceCrossLinks';
import { LOUDOUN_PERMIT_GUIDE, isLoudounArea, loudounTownGuides } from '@/lib/loudoun-guides';
import { isVerifiedWorkImage } from '@/lib/stock-images';
import { paHicRegistrationLine } from '@/lib/claims';
import { mdServingLine } from '@/lib/trust-bullets';

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

function permitGuideSlugForCity(citySlug: string): string | null {
  if (BERKELEY_JEFFERSON_WV.has(citySlug)) return 'deck-permits-berkeley-jefferson-county-wv-2026';
  if (citySlug === 'frederick-md') return 'frederick-md-home-improvement-permits-costs-2026';
  if (isLoudounArea(citySlug)) return LOUDOUN_PERMIT_GUIDE;
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
  // The other county hubs, for the cross-link row on a county page.
  const siblingCounties =
    city.kind === 'county'
      ? ALL_SERVICE_AREAS.filter((a) => a.kind === 'county' && a.slug !== city.slug)
      : [];
  const nearbyAreas = (data.nearbySlugs ?? [])
    .map((slug) => ALL_SERVICE_AREAS.find((area) => area.slug === slug))
    .filter((area): area is ServiceArea => Boolean(area));
  const [heroHead, heroTail] = heroLines(city);

  // Shared trust copy uses credentials supplied in REA-55.
  const trustPoints = [
    'Family-run remodeling and exterior contracting.',
    city.state === 'MD'
      ? mdServingLine(city.city)
      : city.state === 'PA'
        ? paHicRegistrationLine()
        : 'WV Contractor License WV062432 · Virginia Class A Contractor 2705198604 (HIC).',
  ];

  // Consultation on the premium counties; the free estimate on the Panhandle
  // and the other home-market rows. The lane comes from the catalog county
  // (see areaHeroLane), not from a slug list in this template.
  const consultationHero = areaHeroLane(city) === 'consultation';
  const heroSub = consultationHero
    ? `Design-build remodeling for ${city.city} homes. Kitchens, primary suites, lower levels, additions and outdoor living, with one project lead from the first call to the final walkthrough.`
    : `Premium remodeling and exterior craftsmanship for ${city.city} homeowners. Family-run, with project scope discussed at the estimate.`;

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
  // Loudoun areas get authored pairings instead of "recent": the county
  // permit guide plus the cost guides for the town's lead services, so the
  // links survive the next blog post. The catalog decides what is Loudoun
  // (Brambleton was missing from the old hand-kept list).
  const permitSlug = permitGuideSlugForCity(city.slug);
  const permitPost = permitSlug ? getPostBySlug(permitSlug) : null;
  const guidePosts = (
    isLoudounArea(city.slug)
      ? loudounTownGuides(data.marketEmphasis).map((slug) => getPostBySlug(slug))
      : [permitPost, ...getRecentPosts(4).filter((p) => p.slug !== permitPost?.slug)]
  )
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .slice(0, 3);

  // Localized projects: prefer city-tagged photos, fall back to
  // state-tagged, then the full gallery. selectGalleryFor handles
  // the cascade.
  const projectShots = selectGalleryFor(city.slug, city.state, 6).filter((img) =>
    isVerifiedWorkImage(img.src),
  );

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
  const quotePromise = areaQuotesSameWeek(city)
    ? ` ${city.city} sits inside our primary service radius, so on-site visits are typically scheduled within the same week.`
    : '';

  const localFaqs: { question: string; answer: string }[] = [
    ...(data.faqs ?? []),
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
              .join(', ')}. We are headquartered in Martinsburg, WV and are licensed and insured in West Virginia and Virginia.`
          : `Yes. Real Elite Contracting works across ${city.city} and the surrounding ${areaRegionLabel(city)}. We are headquartered in Martinsburg, WV and are licensed and insured in West Virginia and Virginia.${city.state === 'PA' ? ` ${paHicRegistrationLine()}` : ''}`,
    },
    {
      question: `What services does Real Elite offer in ${city.city}?`,
      answer: `In ${city.city} we focus on ${data.marketEmphasis.slice(0, 5).map((s) => SERVICES.find((sv) => sv.slug === s)?.title ?? s).join(', ')}, plus general remodeling, additions, and exterior repairs. Our work is family-run and built with military precision.`,
    },
    {
      question: `How fast can I get a quote in ${city.city}?`,
      answer: `For roofing, our AI Instant Roof Quote returns a ballpark price from your address in about 60 seconds — no ladder, no appointment. For other services, a project lead follows up after reviewing your request with a free written estimate.${quotePromise}`,
    },
    {
      question: `Who runs Real Elite Contracting?`,
      answer: `Family-run by brothers Jose and Miguel. Miguel is a U.S. military veteran and Purple Heart recipient. The motto — "Military Precision. Civilian Excellence." — is how we talk about the standard of the work.`,
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
            {/* seoH1 is one text node so the target query is the heading, not
                a split city/state line. Other pages keep the two-line hero. */}
            {data.seoH1 ? (
              data.seoH1
            ) : (
              <>
                {consultationHero && (
                  <span className="block text-xl sm:text-2xl md:text-3xl font-bold text-charcoal-200 mb-3">
                    Remodeling contractor in
                  </span>
                )}
                {heroHead}
                <br />
                <span className="text-brand-red">{heroTail}</span>
              </>
            )}
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
            {consultationHero ? (
              <>
                <TrackedLink
                  href="/design-consultation"
                  eventName="consultation_cta_click"
                  eventParams={{ location: 'city_hero', area: city.slug }}
                  className="inline-flex items-center gap-2 bg-white text-navy-900 px-7 py-3.5 rounded-md font-semibold text-sm hover:bg-brand-red-light transition-colors focus-ring-on-navy"
                >
                  Schedule a design consultation
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </TrackedLink>
                <Link
                  href="/investment"
                  className="inline-flex items-center gap-2 border border-white/35 text-white px-7 py-3.5 rounded-md font-semibold text-sm hover:bg-white/10 transition-colors focus-ring-on-navy"
                >
                  View investment ranges
                </Link>
              </>
            ) : (
              <>
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
              </>
            )}
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
                    {/* Through the same helper as ServiceCard above. This list
                        hardcoded /services/{slug}, and ServiceCard renders only
                        the first six services — so seven published combos had
                        no link from their own area page, including Inwood's
                        only one and siding across all three Loudoun pages.
                        CityPageTemplate.links.test.tsx asserts the rendered
                        anchors rather than the helper's return value, because a
                        helper-level test cannot see a call site that bypasses
                        it. */}
                    {orderedServices.slice(6).map((s) => (
                      <Link
                        key={s.slug}
                        href={serviceHrefForArea(s.slug, city.slug)}
                        className="text-sm font-medium text-charcoal-700 hover:text-brand-red transition-colors"
                      >
                        {s.title} →
                      </Link>
                    ))}
                  </div>
                </details>
              </div>

              <TownServiceLinksForTown townSlug={city.slug} />

              {city.slug === 'loudoun-county-va' && <OutdoorLivingInspiration />}

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
                {/* County hubs cross-link the other counties served, so a
                    Loudoun reader who lives over the line finds Fairfax or
                    Prince William without going back to the index. */}
                {siblingCounties.length > 0 && (
                  <p className="mt-6 pt-4 border-t border-steel-200 text-sm text-charcoal-600">
                    <span className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-charcoal-500 mr-3">
                      Also serving
                    </span>
                    {siblingCounties.map((a, i) => (
                      <span key={a.slug}>
                        <Link
                          href={`/service-areas/${a.slug}`}
                          className="link-editorial font-medium text-navy-900"
                        >
                          {a.city}
                        </Link>
                        {i < siblingCounties.length - 1 ? ' · ' : ''}
                      </span>
                    ))}
                  </p>
                )}
                {nearbyAreas.length > 0 && (
                  <p className="mt-6 pt-4 border-t border-steel-200 text-sm text-charcoal-600">
                    <span className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-charcoal-500 mr-3">
                      Nearby service areas
                    </span>
                    {nearbyAreas.map((a, i) => (
                      <span key={a.slug}>
                        <Link
                          href={`/service-areas/${a.slug}`}
                          className="link-editorial font-medium text-navy-900"
                        >
                          {formatAreaPlace(a)}
                        </Link>
                        {i < nearbyAreas.length - 1 ? ' · ' : ''}
                      </span>
                    ))}
                  </p>
                )}
              </div>

              {/* Real project case studies in this city (Project System) */}
              <RelatedProjectsRail
                projects={cityProjects}
                heading={`Recent projects in ${city.city}`}
              />

              {/* Recent projects — stock and unverified photos never count as work. */}
              {projectShots.length > 0 && (
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
              )}

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
  // Deep-links to this area's own service+area page when one is published.
  // Was a hardcoded allowlist that had gone stale by a wide margin — see the
  // helper's docblock for what it was missing and why it lives in lib.
  const href = serviceHrefForArea(serviceSlug, citySlug);

  const svcData = SERVICE_DATA[serviceSlug];
  const heroCandidate = svcData?.hero?.image ?? svcData?.overview?.image;
  const heroImage =
    heroCandidate && isVerifiedWorkImage(heroCandidate.src) ? heroCandidate : undefined;
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

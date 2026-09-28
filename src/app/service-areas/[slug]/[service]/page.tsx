import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRight, ChevronRight, MapPin } from 'lucide-react';
import {
  BUSINESS,
  CITY_DATA,
  SERVICES,
  areaSchemaType,
  formatAreaPlace,
} from '@/lib/constants';
import { CONTENT } from '@/lib/service-city-content';
import { SERVICE_DATA } from '@/lib/services-data';
import { buildBreadcrumbSchema, buildMetadata } from '@/lib/seo';
import {
  TOWN_SERVICE_PAGES,
  consultationTypeFor,
  getTownServicePage,
  serviceFaqsFor,
  canonicalServicePath,
  townServiceArea,
  townServiceComboKey,
  townServicePath,
  type TownServicePage,
} from '@/lib/town-service-pages';
import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import JsonLd from '@/components/seo/JsonLd';
import FAQSchema from '@/components/seo/FAQSchema';
import PhoneLink from '@/components/analytics/PhoneLink';
import TrackedLink from '@/components/analytics/TrackedLink';

export const dynamicParams = false;

export function generateStaticParams() {
  return TOWN_SERVICE_PAGES.map((page) => ({
    slug: page.townSlug,
    service: page.serviceSlug,
  }));
}

function resolvePage(townSlug: string, serviceSlug: string): TownServicePage | null {
  const page = getTownServicePage(townSlug, serviceSlug);
  if (!page) return null;
  const combo = CONTENT[townServiceComboKey(page)];
  const town = CITY_DATA[page.townSlug];
  const service = SERVICE_DATA[page.serviceSlug];
  if (!combo || !town || !service) return null;
  return page;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; service: string }>;
}): Promise<Metadata> {
  const { slug, service } = await params;
  const page = resolvePage(slug, service);
  if (!page) return { title: 'Not Found', robots: { index: false } };

  return buildMetadata({
    path: canonicalServicePath(page),
    title: page.title,
    description: page.description,
  });
}

export default async function TownServiceRoute({
  params,
}: {
  params: Promise<{ slug: string; service: string }>;
}) {
  const { slug, service } = await params;
  const page = resolvePage(slug, service);
  if (!page) notFound();

  const area = townServiceArea(page);
  const town = CITY_DATA[page.townSlug];
  const combo = CONTENT[townServiceComboKey(page)];
  const serviceData = SERVICE_DATA[page.serviceSlug];
  const serviceNav = SERVICES.find((entry) => entry.slug === page.serviceSlug);
  if (!town || !combo || !serviceData || !serviceNav) notFound();

  const place = formatAreaPlace(area);
  const canonicalPath = canonicalServicePath(page);
  const url = `${BUSINESS.url}${canonicalPath}`;
  const townHref = `/service-areas/${page.townSlug}`;
  const serviceHref = `/services/${page.serviceSlug}`;
  const guideHref = `/blog/${page.costGuideSlug}`;
  const consultationHref = `/design-consultation?type=${consultationTypeFor(page.serviceSlug)}`;
  const faqs = [...serviceFaqsFor(page), ...page.guideFaqs];
  const siblings = TOWN_SERVICE_PAGES.filter(
    (other) => other !== page && (other.townSlug === page.townSlug || other.serviceSlug === page.serviceSlug)
  );

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: page.h1,
    serviceType: serviceData.serviceType,
    description: page.description,
    provider: { '@id': `${BUSINESS.url}/#business` },
    areaServed: {
      '@type': areaSchemaType(area),
      name: area.city,
      containedInPlace: { '@type': 'State', name: area.state },
    },
    url,
  };

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', item: BUSINESS.url },
    { name: 'Service Areas', item: `${BUSINESS.url}/service-areas` },
    { name: place, item: `${BUSINESS.url}${townHref}` },
    { name: serviceNav.title, item: url },
  ]);

  return (
    <>
      <JsonLd schema={serviceSchema} />
      <JsonLd schema={breadcrumbSchema} />
      <FAQSchema items={faqs} />

      <section className="relative isolate bg-navy-900 text-white">
        <div aria-hidden="true" className="absolute inset-0 -z-10 gradient-navy-hero" />
        <Container size="wide" className="py-20 md:py-28 lg:py-32">
          <nav
            aria-label="Breadcrumb"
            className="text-xs sm:text-sm text-charcoal-300 mb-6 flex items-center gap-2 flex-wrap"
          >
            <Link href="/service-areas" className="hover:text-white transition-colors">
              Service Areas
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-charcoal-500" aria-hidden="true" />
            <Link href={townHref} className="hover:text-white transition-colors">
              {place}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-charcoal-500" aria-hidden="true" />
            <span className="text-white">{serviceNav.title}</span>
          </nav>

          <p className="text-brand-red-light text-xs uppercase tracking-[0.18em] font-semibold mb-4 inline-flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5" aria-hidden="true" /> {place}
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.05] tracking-tight max-w-4xl">
            {page.h1}
          </h1>
          <p className="text-charcoal-200 text-lg md:text-xl mt-6 leading-relaxed max-w-2xl">
            {page.description}
          </p>

          <div className="flex flex-wrap gap-4 mt-10">
            <TrackedLink
              href={consultationHref}
              eventName="consultation_cta_click"
              eventParams={{ location: 'town_service_hero', service: page.serviceSlug, town: page.townSlug }}
              className="bg-brand-red text-white px-7 py-3.5 rounded-md font-bold text-sm hover:bg-brand-red-dark transition-colors shadow-lg shadow-navy-950/40"
            >
              Request a Consultation →
            </TrackedLink>
            <PhoneLink
              location="town_service_hero"
              className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-7 py-3.5 rounded-md font-bold text-sm hover:bg-white/20 transition-colors"
            >
              Call {BUSINESS.phone}
            </PhoneLink>
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 md:py-24">
        <Container size="wide">
          <div className="max-w-3xl space-y-16">
            <div>
              <SectionHeader
                eyebrow={`${area.city} · ${serviceNav.title}`}
                title={`${area.city}: permits, HOA, and neighborhoods.`}
              />
              <div className="mt-7 space-y-5">
                <p className="text-charcoal-700 text-base md:text-lg leading-relaxed">{town.description}</p>
              </div>
              <ul className="mt-6 flex flex-wrap gap-2">
                {town.neighborhoods.map((name) => (
                  <li
                    key={name}
                    className="bg-steel-50 border border-charcoal-200 text-navy-800 rounded-md px-3 py-2 text-sm font-medium"
                  >
                    {name}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <SectionHeader
                eyebrow="Permits and scope"
                title={`${serviceNav.title} in ${area.city}.`}
              />
              <div className="mt-7 space-y-5">
                {combo.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 48)} className="text-charcoal-700 text-base md:text-lg leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-navy-800 mb-6">
                {serviceData.scope.title ?? "What's in scope"}
              </h2>
              <ul className="space-y-3 text-charcoal-700">
                {serviceData.scope.items.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-brand-red font-bold flex-shrink-0">·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <SectionHeader eyebrow="Published ranges" title="What the cost guide already publishes." />
              <div className="mt-7 space-y-5">
                {page.costParagraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 48)} className="text-charcoal-700 text-base md:text-lg leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
              <p className="mt-6">
                <Link href={guideHref} className="text-brand-red font-semibold hover:underline">
                  Read {page.costGuideLabel}
                </Link>
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-navy-800 mb-6">
                Questions already answered on the site
              </h2>
              <div className="space-y-6">
                {faqs.map((faq) => (
                  <div key={faq.question}>
                    <h3 className="font-heading text-lg font-bold text-navy-800">{faq.question}</h3>
                    <p className="text-charcoal-700 mt-2 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-navy-800 mb-6">
                Keep reading
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link href={townHref} className="group bg-steel-50 hover:bg-navy-800 rounded-md p-5 transition-colors">
                  <p className="text-[0.65rem] uppercase tracking-[0.15em] font-semibold text-brand-red mb-1">
                    Town
                  </p>
                  <p className="font-heading text-base font-bold text-navy-800 group-hover:text-white transition-colors inline-flex items-center gap-1.5">
                    {place}
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </p>
                </Link>
                <Link href={serviceHref} className="group bg-steel-50 hover:bg-navy-800 rounded-md p-5 transition-colors">
                  <p className="text-[0.65rem] uppercase tracking-[0.15em] font-semibold text-brand-red mb-1">
                    Service
                  </p>
                  <p className="font-heading text-base font-bold text-navy-800 group-hover:text-white transition-colors inline-flex items-center gap-1.5">
                    {serviceNav.title}
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </p>
                </Link>
                <Link href={guideHref} className="group bg-steel-50 hover:bg-navy-800 rounded-md p-5 transition-colors">
                  <p className="text-[0.65rem] uppercase tracking-[0.15em] font-semibold text-brand-red mb-1">
                    Cost guide
                  </p>
                  <p className="font-heading text-base font-bold text-navy-800 group-hover:text-white transition-colors inline-flex items-center gap-1.5">
                    {page.costGuideLabel}
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </p>
                </Link>
                <Link
                  href="/design-consultation"
                  className="group bg-steel-50 hover:bg-navy-800 rounded-md p-5 transition-colors"
                >
                  <p className="text-[0.65rem] uppercase tracking-[0.15em] font-semibold text-brand-red mb-1">
                    Next step
                  </p>
                  <p className="font-heading text-base font-bold text-navy-800 group-hover:text-white transition-colors inline-flex items-center gap-1.5">
                    Design consultation
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </p>
                </Link>
              </div>

              {siblings.length > 0 && (
                <div className="mt-8">
                  <p className="text-[0.65rem] uppercase tracking-[0.15em] font-semibold text-charcoal-500 mb-3">
                    Related town pages
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {siblings.map((other) => (
                      <Link
                        key={townServicePath(other)}
                        href={townServicePath(other)}
                        className="inline-flex items-center gap-1.5 bg-white border border-charcoal-200 hover:border-brand-red text-navy-800 hover:text-brand-red rounded-md px-3 py-2 text-sm font-medium transition-colors"
                      >
                        {other.h1} <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

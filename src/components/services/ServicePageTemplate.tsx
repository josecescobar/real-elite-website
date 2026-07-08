import Image from 'next/image';
import Link from 'next/link';
import { Zap, ArrowRight } from 'lucide-react';
import Container from '@/components/shared/Container';
import PrecisionProcess from '@/components/home/PrecisionProcess';
import AssurancesBand from '@/components/home/AssurancesBand';
import ScopeChecklist from './ScopeChecklist';
import InvestmentRanges from './InvestmentRanges';
import StickyEstimateRail from './StickyEstimateRail';
import RelatedProjects from './RelatedProjects';
import RelatedGuides from './RelatedGuides';
import LocalAreasServed from './LocalAreasServed';
import ServiceFAQ from './ServiceFAQ';
import ServiceSchema from '@/components/seo/ServiceSchema';
import JsonLd from '@/components/seo/JsonLd';
import type { ServiceData } from '@/lib/services-data';
import { BUSINESS } from '@/lib/constants';

type Props = {
  data: ServiceData;
};

/**
 * Services that have a matching instant-quote tool get a banner under the
 * hero. Add an entry here when a new tool ships (e.g. siding).
 */
const INSTANT_QUOTE_TOOLS: Record<string, { href: string; label: string }> = {
  roofing: { href: '/instant-roof-quote', label: 'Get an instant roof quote' },
  decks: { href: '/instant-deck-quote', label: 'Get an instant deck quote' },
};

export default function ServicePageTemplate({ data }: Props) {
  const instantQuote = INSTANT_QUOTE_TOOLS[data.slug];
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  return (
    <>
      {/* JSON-LD: per-service Service + FAQPage */}
      <ServiceSchema
        serviceType={data.serviceType}
        serviceTitle={data.title}
        serviceSlug={data.slug}
        description={data.metaDescription}
        areaServed={[
          'Martinsburg, WV',
          'Charles Town, WV',
          'Shepherdstown, WV',
          'Inwood, WV',
          'Frederick, MD',
          'Hagerstown, MD',
          'Winchester, VA',
          'Leesburg, VA',
          'Ashburn, VA',
          'Loudoun County, VA',
        ]}
      />
      <JsonLd schema={faqSchema} />

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-navy-900 text-white">
        {data.hero.image ? (
          <>
            <div className="absolute inset-0 -z-10">
              <Image
                src={data.hero.image.src}
                alt={data.hero.image.alt}
                fill
                priority
                sizes="100vw"
                className="object-cover object-center"
              />
              <div aria-hidden="true" className="absolute inset-0 gradient-navy-overlay" />
              <div aria-hidden="true" className="absolute inset-0 bg-navy-900/45" />
            </div>
          </>
        ) : (
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 gradient-navy-hero"
          />
        )}

        <Container size="wide" className="py-20 md:py-28 lg:py-32">
          <div className="max-w-3xl">
            {data.hero.eyebrow && (
              <p className="text-brand-red text-xs uppercase tracking-[0.18em] font-semibold mb-4">
                {data.hero.eyebrow}
              </p>
            )}
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[0.95] tracking-tight">
              {data.hero.heading}
            </h1>
            <p className="text-charcoal-200 text-lg md:text-xl mt-6 max-w-2xl leading-relaxed">
              {data.hero.sub}
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
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
          </div>
        </Container>
      </section>

      {/* Instant quote banner — only for services with a matching tool */}
      {instantQuote && (
        <section className="bg-brand-red text-white">
          <Container size="wide" className="py-4">
            <Link
              href={instantQuote.href}
              className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm"
            >
              <span className="inline-flex items-center gap-2 font-bold text-sm">
                <Zap className="w-4 h-4" aria-hidden="true" />
                Skip the wait — see a ballpark price in about a minute.
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm font-bold underline underline-offset-4 group-hover:gap-2.5 transition-all">
                {instantQuote.label}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </span>
            </Link>
          </Container>
        </section>
      )}

      {/* Main content + sticky form rail */}
      <section className="bg-white py-16 md:py-24">
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            {/* Main column */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-16">
              {/* Overview */}
              <div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                  <div className={data.overview.image ? 'md:col-span-7' : 'md:col-span-12'}>
                    {data.overview.paragraphs.map((p, i) => (
                      <p key={i} className="text-charcoal-700 text-base md:text-lg leading-relaxed mb-5 last:mb-0">
                        {p}
                      </p>
                    ))}
                  </div>
                  {data.overview.image && (
                    <div className="md:col-span-5 relative aspect-[4/3] rounded-lg overflow-hidden shadow-md">
                      <Image
                        src={data.overview.image.src}
                        alt={data.overview.image.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 40vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Scope checklist */}
              <ScopeChecklist title={data.scope.title} items={data.scope.items} />

              {/* Investment ranges */}
              {data.investment && (
                <InvestmentRanges
                  startingAt={data.investment.startingAt}
                  tiers={data.investment.tiers}
                  note={data.investment.note}
                />
              )}

              {/* Related projects */}
              {data.gallery && data.gallery.length > 0 && (
                <RelatedProjects images={data.gallery} serviceTitle={data.title} />
              )}

              {/* Why choose us */}
              <div>
                <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-navy-800 mb-6">
                  Why homeowners choose Real Elite for {data.title.toLowerCase()}
                </h2>
                <ul className="space-y-4">
                  {data.whyChooseUs.map((reason) => (
                    <li
                      key={reason}
                      className="flex items-start gap-3 bg-steel-50 rounded-md px-5 py-4 border-l-4 border-brand-red"
                    >
                      <span className="text-charcoal-700 leading-relaxed">{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Local areas served */}
              <LocalAreasServed serviceSlug={data.slug} serviceTitle={data.title} />

              {/* FAQ */}
              <ServiceFAQ items={data.faqs} />
            </div>

            {/* Right rail: sticky form */}
            <div className="lg:col-span-5 xl:col-span-4">
              <StickyEstimateRail initialService={data.slug} />
            </div>
          </div>
        </Container>
      </section>

      {/* Process module */}
      <PrecisionProcess />

      {/* Related guides */}
      <section className="bg-white py-16 md:py-24">
        <Container size="wide">
          <RelatedGuides slugs={data.relatedGuideSlugs} />
        </Container>
      </section>

      {/* Assurances + final CTA */}
      <AssurancesBand />
    </>
  );
}

import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { BUSINESS } from '@/lib/constants';
import { buildMetadata, buildBreadcrumbSchema } from '@/lib/seo';
import {
  INVESTMENT_GUIDE,
  INVESTMENT_DISCLAIMER,
  INVESTMENT_FAQ,
  INVESTMENT_SOURCES,
  LOUDOUN_COST_FACTORS,
  DESIGN_BUILD_PRICE_INCLUDES,
  CONSULTATION_THRESHOLD_LABEL,
} from '@/lib/investment-guide';
import Container from '@/components/shared/Container';
import InvestmentSummary from '@/components/investment/InvestmentSummary';
import JsonLd from '@/components/seo/JsonLd';
import PhoneLink from '@/components/analytics/PhoneLink';

export const metadata: Metadata = buildMetadata({
  path: '/investment',
  title: 'Loudoun County Remodel Cost Guide 2026 | Real Elite',
  description:
    'Typical Loudoun County remodel investment ranges for lower levels, kitchens, primary suites, additions and outdoor living — market ranges, not quotes — plus what moves the number in Loudoun.',
  keywords: [
    'basement remodel cost Loudoun County',
    'kitchen remodel cost Ashburn VA',
    'primary bathroom remodel cost Leesburg',
    'home addition cost Northern Virginia',
    'deck cost Loudoun County',
    'remodel investment guide',
  ],
});

export default function InvestmentPage() {
  const breadcrumb = buildBreadcrumbSchema([
    { name: 'Home', item: BUSINESS.url },
    { name: 'Investment Guide', item: `${BUSINESS.url}/investment` },
  ]);
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: INVESTMENT_FAQ.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: { '@type': 'Answer', text: q.answer },
    })),
  };

  return (
    <>
      <JsonLd schema={breadcrumb} />
      <JsonLd schema={faqSchema} />

      {/* Hero — stone, editorial */}
      <section className="bg-steel-50 border-b border-steel-200">
        <Container size="wide" className="pt-16 pb-14 md:pt-24 md:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-8">
              <p className="text-brand-red text-xs uppercase tracking-[0.22em] font-semibold mb-5">
                Investment Guide · Loudoun County
              </p>
              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl text-navy-900 leading-[1.02]">
                What a Loudoun remodel <em>typically</em> costs.
              </h1>
              <p className="text-charcoal-600 text-lg md:text-xl mt-6 leading-relaxed max-w-2xl">
                Published ranges for the projects we design and build, so you know which lane
                you are in before the first conversation. These are typical market ranges for
                Loudoun County and Northern Virginia, not quotes.
              </p>
            </div>
            <div className="lg:col-span-4 lg:pb-2">
              <div className="border-l-2 border-brand-red pl-5">
                <p className="text-xs uppercase tracking-[0.18em] text-charcoal-500 font-semibold mb-2">
                  Design consultation
                </p>
                <p className="text-navy-800 leading-relaxed">
                  Calibrated for projects of {CONSULTATION_THRESHOLD_LABEL}. Smaller projects
                  and repairs move faster through the{' '}
                  <Link href="/estimate" className="link-editorial font-medium text-navy-900">
                    standard estimate
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Summary table */}
      <section className="bg-white py-16 md:py-24">
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-4">
              <p className="text-brand-red text-xs uppercase tracking-[0.22em] font-semibold mb-4">
                At a glance
              </p>
              <h2 className="font-heading text-3xl md:text-4xl text-navy-900 leading-tight">
                Six project types, one honest table.
              </h2>
              <p className="text-charcoal-600 mt-4 leading-relaxed">
                Each row opens the detail below: the tiers inside the range, what tends to move
                the number, and the service page for the work itself.
              </p>
            </div>
            <div className="lg:col-span-8">
              <InvestmentSummary />
            </div>
          </div>
        </Container>
      </section>

      {/* Per-category detail */}
      {INVESTMENT_GUIDE.map((cat, idx) => (
        <section
          key={cat.slug}
          id={cat.slug}
          className={`scroll-mt-24 py-16 md:py-24 ${idx % 2 === 0 ? 'bg-steel-50' : 'bg-white'} border-t border-steel-200`}
        >
          <Container size="wide">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
              <div className="lg:col-span-5 reveal">
                <div className="photo-editorial relative aspect-[4/3] overflow-hidden rounded-lg">
                  <Image
                    src={cat.image.src}
                    alt={cat.image.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                </div>
                <p className="text-charcoal-500 text-[0.65rem] uppercase tracking-[0.16em] mt-3">
                  Design inspiration
                </p>
                <div className="mt-8">
                  <p className="text-xs uppercase tracking-[0.18em] text-charcoal-500 font-semibold mb-3">
                    What moves the number
                  </p>
                  <ul className="space-y-2.5">
                    {cat.drivers.map((d) => (
                      <li key={d} className="flex gap-3 text-sm text-charcoal-700 leading-relaxed">
                        <span aria-hidden="true" className="mt-2 w-1 h-1 rounded-full bg-brand-red flex-shrink-0" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="lg:col-span-7">
                <p className="text-brand-red text-xs uppercase tracking-[0.22em] font-semibold mb-4">
                  {cat.eyebrow}
                </p>
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                  <h2 className="font-heading text-3xl md:text-4xl text-navy-900 leading-tight">
                    {cat.title}
                  </h2>
                  <p className="text-charcoal-600 tabular-nums">
                    {cat.from ? (
                      <>
                        <span className="text-xs uppercase tracking-[0.14em] text-charcoal-500 mr-2">Typically</span>
                        {cat.typical}
                      </>
                    ) : (
                      <span className="text-charcoal-500">{cat.typical}</span>
                    )}
                  </p>
                </div>
                <p className="text-charcoal-600 text-base md:text-lg mt-5 leading-relaxed">
                  {cat.summary}
                </p>

                <dl className="mt-8 divide-y divide-steel-200 border-y border-steel-200">
                  {cat.tiers.map((tier) => (
                    <div key={tier.name} className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-6 py-5">
                      <dt className="sm:col-span-5">
                        <span className="block font-heading text-lg text-navy-800 leading-snug">
                          {tier.name}
                        </span>
                        <span className="block text-navy-800 font-medium tabular-nums mt-1">
                          {tier.range}
                        </span>
                      </dt>
                      <dd className="sm:col-span-7 text-sm text-charcoal-600 leading-relaxed">
                        {tier.includes}
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 items-center">
                  <Link
                    href={`/design-consultation?type=${cat.consultationType}`}
                    className="inline-flex items-center gap-2 bg-navy-900 text-white px-6 py-3 rounded-md text-sm font-semibold hover:bg-brand-red transition-colors focus-ring"
                  >
                    Schedule a design consultation
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                  <Link
                    href={cat.href}
                    className="link-editorial inline-flex items-center gap-1.5 text-sm font-medium text-navy-800"
                  >
                    About our {cat.title.toLowerCase()} work
                    <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </Container>
        </section>
      ))}

      {/* Loudoun specifics */}
      <section className="bg-navy-900 text-white py-16 md:py-24 border-t border-navy-800">
        <Container size="wide">
          <div className="max-w-3xl">
            <p className="text-brand-red-light text-xs uppercase tracking-[0.22em] font-semibold mb-4">
              Loudoun specifics
            </p>
            <h2 className="font-heading text-3xl md:text-4xl leading-tight">
              What moves the number in Loudoun County.
            </h2>
            <p className="text-charcoal-300 mt-4 leading-relaxed">
              The house and the finishes set most of the price. These are the local factors that
              set the rest, and they are the ones a homeowner rarely hears about until the
              schedule slips.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
            {LOUDOUN_COST_FACTORS.map((f) => (
              <div key={f.title} className="reveal border-t border-white/15 pt-5">
                <h3 className="font-heading text-xl text-white mb-2">{f.title}</h3>
                <p className="text-charcoal-300 text-sm leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* What's inside a design-build price */}
      <section className="bg-white py-16 md:py-24">
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-5">
              <p className="text-brand-red text-xs uppercase tracking-[0.22em] font-semibold mb-4">
                Like for like
              </p>
              <h2 className="font-heading text-3xl md:text-4xl text-navy-900 leading-tight">
                What a design-build price usually contains.
              </h2>
              <p className="text-charcoal-600 mt-4 leading-relaxed">
                Two numbers for the same kitchen can differ by a third depending on what each
                one leaves out. When you compare ranges, compare what is inside them.
              </p>
            </div>
            <ol className="lg:col-span-7 divide-y divide-steel-200 border-y border-steel-200">
              {DESIGN_BUILD_PRICE_INCLUDES.map((item, i) => (
                <li key={item} className="flex gap-6 py-4">
                  <span className="font-heading text-brand-red text-lg tabular-nums w-8 flex-shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-charcoal-700 leading-relaxed">{item}</span>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="bg-steel-50 py-16 md:py-24 border-t border-steel-200">
        <Container size="default">
          <p className="text-brand-red text-xs uppercase tracking-[0.22em] font-semibold mb-4">
            Questions
          </p>
          <h2 className="font-heading text-3xl md:text-4xl text-navy-900 leading-tight max-w-2xl">
            The questions that usually come with the numbers.
          </h2>
          <div className="mt-10 divide-y divide-steel-200 border-y border-steel-200">
            {INVESTMENT_FAQ.map((item, idx) => (
              <details key={item.question} className="group" open={idx === 0}>
                <summary className="w-full py-5 flex items-start justify-between gap-6 text-left cursor-pointer list-none [&::-webkit-details-marker]:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-400 rounded-sm">
                  <span className="font-heading text-lg md:text-xl text-navy-800 group-hover:text-brand-red transition-colors">
                    {item.question}
                  </span>
                  <span aria-hidden="true" className="flex-shrink-0 mt-1 text-brand-red text-xl leading-none group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <p className="pb-6 pr-10 text-charcoal-600 leading-relaxed">{item.answer}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-white py-16 md:py-24">
        <Container size="default">
          <div className="border border-steel-200 rounded-lg p-8 md:p-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8">
              <h2 className="font-heading text-3xl md:text-4xl text-navy-900 leading-tight">
                Know your lane? Let&rsquo;s talk about the house.
              </h2>
              <p className="text-charcoal-600 mt-3 leading-relaxed">
                A short conversation about the rooms, the range and the timing. If it fits, we
                come out to measure. Or call{' '}
                <PhoneLink location="investment_cta" className="font-medium text-navy-900 link-editorial">
                  {BUSINESS.phone}
                </PhoneLink>
                .
              </p>
            </div>
            <div className="md:col-span-4 flex flex-col gap-3 md:items-end">
              <Link
                href="/design-consultation"
                className="inline-flex items-center justify-center gap-2 bg-navy-900 text-white px-6 py-3.5 rounded-md text-sm font-semibold hover:bg-brand-red transition-colors focus-ring"
              >
                Schedule a design consultation
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link href="/estimate" className="text-sm text-charcoal-500 hover:text-navy-900 transition-colors">
                Smaller project? Request a standard estimate →
              </Link>
            </div>
          </div>

          <div className="mt-12 text-xs text-charcoal-500 leading-relaxed max-w-3xl">
            <p className="mb-3">{INVESTMENT_DISCLAIMER}</p>
            <p className="font-semibold uppercase tracking-[0.14em] text-[0.65rem] text-charcoal-500 mb-2">
              Sources
            </p>
            <ul className="space-y-1">
              {INVESTMENT_SOURCES.map((s) => (
                <li key={s.label}>
                  {s.href ? (
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2 hover:text-navy-900 transition-colors"
                    >
                      {s.label}
                    </a>
                  ) : (
                    s.label
                  )}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>
    </>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { BUSINESS } from '@/lib/constants';
import { CONTRACTOR_LICENSES, LICENSED_STATES } from '@/lib/claims';
import { FREE_FIRST_VISIT_SENTENCE } from '@/lib/project-trust';
import {
  CLOSE_OUT_SENTENCE,
  HANDOVER_PACKAGE,
  MANUFACTURER_COVERAGE_SENTENCE,
  PROTECTION_POINTS,
  QUESTIONS_TO_ASK,
  WARRANTY_TERMS_SENTENCE,
} from '@/lib/warranty';
import Container from '@/components/shared/Container';
import JsonLd from '@/components/seo/JsonLd';
import PhoneLink from '@/components/analytics/PhoneLink';
import { buildBreadcrumbSchema, buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  path: '/warranty',
  title: `Warranty & How We Protect Your Home | ${BUSINESS.name}`,
  description:
    'How warranties work on a Real Elite project: written terms in your agreement, manufacturer registration, the handover package, and how the house is protected.',
  keywords: [
    'contractor warranty',
    'remodel warranty terms',
    'manufacturer warranty registration',
    'home renovation handover package',
    'Real Elite Contracting',
  ],
});

export default function WarrantyPage() {
  const breadcrumb = buildBreadcrumbSchema([
    { name: 'Home', item: BUSINESS.url },
    { name: 'Warranty', item: `${BUSINESS.url}/warranty` },
  ]);

  return (
    <>
      <JsonLd schema={breadcrumb} />

      {/* Hero */}
      <section className="bg-navy-900 text-white pt-20 pb-16 md:pt-28 md:pb-24">
        <Container size="wide">
          <div className="max-w-3xl">
            <p className="text-brand-red-light text-xs uppercase tracking-[0.22em] font-semibold mb-5">
              Warranty and protection
            </p>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl leading-[1.04]">
              How we protect your home, in writing.
            </h1>
            <p className="text-charcoal-300 text-lg md:text-xl mt-7 leading-relaxed">
              The warranty on your project is the one written into your agreement, and you see it
              before you sign. Here is what goes in writing, what you keep at the end, and how the
              house is looked after while the work is under way.
            </p>
          </div>
        </Container>
      </section>

      {/* Written terms */}
      <section className="bg-white py-16 md:py-24">
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-5">
              <p className="text-brand-red text-xs uppercase tracking-[0.22em] font-semibold mb-4">
                The written terms
              </p>
              <h2 className="font-heading text-3xl md:text-4xl text-navy-900 leading-tight">
                The agreement is the warranty.
              </h2>
              <p className="text-charcoal-600 mt-4 leading-relaxed">
                {WARRANTY_TERMS_SENTENCE} The scope says what will be built. The warranty terms say
                what happens after. Both are in the same document, so there is one place to look.
              </p>
              <p className="text-charcoal-600 mt-4 leading-relaxed">
                {MANUFACTURER_COVERAGE_SENTENCE}
              </p>
            </div>
            <div className="lg:col-span-7">
              <h3 className="font-heading text-xl text-navy-900">
                Questions to have answered in writing before you sign
              </h3>
              <ul className="mt-5 divide-y divide-steel-200 border-y border-steel-200">
                {QUESTIONS_TO_ASK.map((q) => (
                  <li key={q} className="py-3 text-charcoal-700 flex gap-4">
                    <span aria-hidden="true" className="mt-2.5 w-1.5 h-px bg-brand-red flex-shrink-0" />
                    {q}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-charcoal-500 mt-4 leading-relaxed">
                These are good questions for any contractor. Ask us all of them at the estimate.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Handover */}
      <section className="bg-steel-50 py-16 md:py-24 border-y border-steel-200">
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-5">
              <p className="text-brand-red text-xs uppercase tracking-[0.22em] font-semibold mb-4">
                At close-out
              </p>
              <h2 className="font-heading text-3xl md:text-4xl text-navy-900 leading-tight">
                What you keep when the job is done.
              </h2>
              <p className="text-charcoal-600 mt-4 leading-relaxed">{CLOSE_OUT_SENTENCE}</p>
              <p className="text-charcoal-600 mt-4 leading-relaxed">
                Keep the package with your house records. If a question comes up later, it has the
                product names, the permit record and the warranty terms in one place.
              </p>
            </div>
            <div className="lg:col-span-7">
              <ul className="divide-y divide-steel-200 border-y border-steel-200 bg-white rounded-md px-5">
                {HANDOVER_PACKAGE.map((item) => (
                  <li key={item} className="py-3 text-charcoal-700 flex gap-4">
                    <span aria-hidden="true" className="mt-2.5 w-1.5 h-px bg-brand-red flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* Protection during the work */}
      <section className="bg-white py-16 md:py-24">
        <Container size="wide">
          <div className="max-w-2xl mb-10">
            <p className="text-brand-red text-xs uppercase tracking-[0.22em] font-semibold mb-4">
              During the work
            </p>
            <h2 className="font-heading text-3xl md:text-4xl text-navy-900 leading-tight">
              How the house is looked after.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {PROTECTION_POINTS.map((p) => (
              <div key={p.title} className="border-t-4 border-brand-red bg-steel-50 rounded-lg p-6">
                <h3 className="font-heading text-xl text-navy-900">{p.title}</h3>
                <p className="text-charcoal-600 mt-2 leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* After the job */}
      <section className="bg-steel-50 py-16 md:py-24 border-y border-steel-200">
        <Container size="default">
          <div className="max-w-3xl">
            <p className="text-brand-red text-xs uppercase tracking-[0.22em] font-semibold mb-4">
              After the job
            </p>
            <h2 className="font-heading text-3xl md:text-4xl text-navy-900 leading-tight">
              If something needs a look later.
            </h2>
            <p className="text-charcoal-600 mt-4 leading-relaxed">
              Call{' '}
              <PhoneLink location="warranty_after_job" className="font-medium text-navy-900 link-editorial">
                {BUSINESS.phone}
              </PhoneLink>{' '}
              or use the{' '}
              <Link href="/contact" className="link-editorial font-medium text-navy-900">
                contact page
              </Link>
              . Tell us the address, what you are seeing, and when it started. A photo helps. Have
              your agreement and handover package nearby, because the warranty terms in the agreement
              decide what is covered.
            </p>
            <p className="text-charcoal-600 mt-4 leading-relaxed">
              {BUSINESS.name} is family-run by brothers Jose and Miguel. Miguel is a U.S. military
              veteran and Purple Heart recipient. Licensed and insured in {LICENSED_STATES.long}:{' '}
              {CONTRACTOR_LICENSES.summary}. We serve homeowners across West Virginia, Virginia,
              Maryland and Pennsylvania.
            </p>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-navy-900 text-white py-16 md:py-24">
        <Container size="default">
          <div className="max-w-2xl">
            <p className="text-brand-red-light text-xs uppercase tracking-[0.22em] font-semibold mb-4">
              Free site visit
            </p>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl leading-[1.05]">
              Read the terms before you commit.
            </h2>
            <p className="text-charcoal-300 mt-5 leading-relaxed">
              {FREE_FIRST_VISIT_SENTENCE} You see the proposed scope and warranty terms in writing
              before anything is signed.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link
                href="/design-consultation"
                className="inline-flex items-center gap-2 bg-white text-navy-900 px-7 py-4 rounded-md font-semibold text-sm hover:bg-brand-red-light transition-colors focus-ring-on-navy"
              >
                Book a free site visit
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                href="/process"
                className="inline-flex items-center gap-2 border border-white/35 text-white px-7 py-4 rounded-md font-semibold text-sm hover:bg-white/10 transition-colors focus-ring-on-navy"
              >
                See the full process
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

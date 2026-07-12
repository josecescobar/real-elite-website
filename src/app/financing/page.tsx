import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  CreditCard,
  FileCheck2,
  ShieldCheck,
  Wallet,
} from 'lucide-react';
import { BUSINESS, FINANCING } from '@/lib/constants';
import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import JsonLd from '@/components/seo/JsonLd';
import FAQSchema from '@/components/seo/FAQSchema';

export const metadata: Metadata = {
  title: `Home Improvement Financing | Monthly Payment Options | ${BUSINESS.name}`,
  description:
    'Spread your remodel, roof, or addition into manageable monthly payments. Real Elite Contracting offers financing options so you can start the project now — veteran-owned, licensed across WV, MD, and VA.',
  keywords: [
    'home improvement financing',
    'remodel financing',
    'roof financing',
    'monthly payment contractor',
    'home renovation loan',
    'financing Eastern Panhandle',
    'pay over time contractor WV',
  ],
  alternates: { canonical: `${BUSINESS.url}/financing` },
  openGraph: {
    title: `Home Improvement Financing | ${BUSINESS.name}`,
    description:
      'Start your project now and pay over time. Flexible financing options for roofing, remodeling, additions, and more.',
    url: `${BUSINESS.url}/financing`,
    type: 'website',
  },
};

// When a lending partner is signed, FINANCING.applyUrl flips the primary
// CTA from "get an estimate" to "apply now". Both paths are honest today.
const hasPartner = Boolean(FINANCING.applyUrl);
const primaryCta = hasPartner
  ? { label: 'Check Your Options', href: FINANCING.applyUrl as string, external: true }
  : { label: 'Get My Free Estimate', href: '/contact#estimate', external: false };

const HOW_IT_WORKS = [
  {
    icon: FileCheck2,
    title: 'Get your free estimate',
    body: 'We walk your project, then hand you a clear, line-itemed written estimate — no obligation, no pressure.',
  },
  {
    icon: CreditCard,
    title: 'Explore payment options',
    body: 'Want to spread the cost? We review the financing routes that fit your project and budget so the monthly number is clear before you commit.',
  },
  {
    icon: CalendarClock,
    title: 'Start the work',
    body: 'Once you choose how to pay, your project lead locks the schedule. No waiting years to save up for the home you want now.',
  },
];

const BENEFITS = [
  {
    icon: Wallet,
    title: 'Keep your savings intact',
    body: 'Leave your emergency fund where it belongs. Put the project on a predictable monthly plan instead of draining cash reserves.',
  },
  {
    icon: ShieldCheck,
    title: 'Fix it before it gets worse',
    body: 'A failing roof or water damage only costs more the longer it waits. Financing lets you handle it now, on your terms.',
  },
  {
    icon: CheckCircle2,
    title: 'Do it right the first time',
    body: 'Pick the materials and scope you actually want — not the stripped-down version — without the lump sum standing in the way.',
  },
];

const ELIGIBLE = [
  'Roofing & storm-damage replacement',
  'Kitchen & bathroom remodels',
  'Basement finishing',
  'Home additions & expansions',
  'Siding & exterior work',
  'Decks & outdoor living',
  'Whole-home remodels',
  'Driveway & paving projects',
];

const FAQ_ITEMS = [
  {
    question: 'How does financing a project with Real Elite work?',
    answer:
      'It starts with a free, no-obligation estimate. If you would like to pay over time rather than in a lump sum, we walk you through the financing options that fit your project and budget so you see the monthly picture before you decide anything. You are never required to finance — it is simply an option for homeowners who prefer predictable monthly payments.',
  },
  {
    question: 'Will checking my options affect my credit score?',
    answer:
      'Many financing programs offer a pre-qualification step that uses a soft credit check, which does not affect your score. A formal application later may involve a hard inquiry. We will tell you which step you are on before anything is submitted, so there are no surprises. Exact terms, rates, and approval depend on the lender and your credit profile.',
  },
  {
    question: 'What kinds of projects can be financed?',
    answer:
      'Most of our work qualifies — roofing, kitchen and bathroom remodels, basement finishing, additions, siding, decks, whole-home remodels, and paving. If you are unsure whether your project is a fit, just ask during your estimate.',
  },
  {
    question: 'Is there any obligation if I ask about financing?',
    answer:
      'None. Asking about payment options does not commit you to the project or to any loan. We are happy to lay out the numbers so you can make the decision that is right for your household.',
  },
  {
    question: 'Do you offer financing across WV, MD, and VA?',
    answer:
      'Yes. Real Elite Contracting is licensed and insured across West Virginia, Maryland, and Virginia, and we can discuss payment options with homeowners throughout our service area in the Eastern Panhandle and surrounding counties.',
  },
];

export default function FinancingPage() {
  return (
    <>
      <JsonLd
        schema={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: `Home Improvement Financing | ${BUSINESS.name}`,
          description:
            'Flexible monthly payment options for roofing, remodeling, additions, and exterior projects across the WV–MD–VA region.',
          url: `${BUSINESS.url}/financing`,
        }}
      />
      <FAQSchema items={FAQ_ITEMS} />

      {/* Hero */}
      <section className="bg-navy-900 text-white pt-16 pb-20 md:pt-24 md:pb-28">
        <Container size="wide">
          <div className="max-w-3xl">
            <p className="text-brand-red-light text-xs uppercase tracking-[0.18em] font-semibold mb-4">
              Flexible Payment Options
            </p>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.05] tracking-tight">
              The home you want now.
              <br />
              <span className="text-brand-red-light">On a monthly plan.</span>
            </h1>
            <p className="text-charcoal-200 text-lg md:text-xl mt-6 leading-relaxed max-w-2xl">
              A new roof, a finished basement, the kitchen you&apos;ve been putting
              off — you shouldn&apos;t have to wait years to save up for it. We help
              you spread qualifying projects into manageable monthly payments so you
              can start now.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row gap-4">
              <CtaButton {...primaryCta} variant="primary" />
              <Link
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white px-7 py-4 rounded-md font-bold text-sm hover:bg-white/15 transition-colors border border-white/15"
              >
                How It Works
              </Link>
            </div>
            <p className="text-charcoal-400 text-xs mt-6 max-w-xl leading-relaxed">
              Financing is provided through third-party lenders. Approval, rates, and
              terms depend on the lender and your creditworthiness.
            </p>
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-white py-16 md:py-24 scroll-mt-20">
        <Container size="wide">
          <SectionHeader
            eyebrow="How It Works"
            title="Three steps to get started."
            subtitle="No pressure, no obligation. Just a clear path from estimate to the project you actually want."
            align="center"
            className="mx-auto"
          />
          <ol className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {HOW_IT_WORKS.map((step, idx) => {
              const Icon = step.icon;
              return (
                <li
                  key={step.title}
                  className="bg-steel-50 rounded-lg p-7 border-t-4 border-brand-red relative"
                >
                  <span className="absolute top-6 right-6 font-heading text-5xl font-extrabold text-charcoal-100">
                    {idx + 1}
                  </span>
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-navy-800 text-white mb-5">
                    <Icon className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <h3 className="font-heading text-xl font-extrabold text-navy-800 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-charcoal-600 text-sm leading-relaxed">{step.body}</p>
                </li>
              );
            })}
          </ol>
        </Container>
      </section>

      {/* Why finance */}
      <section className="bg-steel-50 py-16 md:py-24 border-y border-charcoal-100">
        <Container size="wide">
          <SectionHeader
            eyebrow="Why Pay Over Time"
            title="Smart reasons homeowners finance."
            align="center"
            className="mx-auto"
          />
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {BENEFITS.map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.title} className="bg-white rounded-lg p-6 shadow-sm border-t-4 border-navy-800">
                  <div className="inline-flex items-center justify-center w-11 h-11 rounded-md bg-brand-red text-white mb-4">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <h3 className="font-heading text-lg font-extrabold text-navy-800 mb-2">
                    {b.title}
                  </h3>
                  <p className="text-charcoal-600 text-sm leading-relaxed">{b.body}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* What you can finance */}
      <section className="bg-white py-16 md:py-24">
        <Container size="default">
          <SectionHeader
            eyebrow="What You Can Finance"
            title="Most projects qualify."
            subtitle="If it adds value to your home, there's a good chance you can put it on a payment plan."
          />
          <ul className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
            {ELIGIBLE.map((item) => (
              <li key={item} className="flex items-start gap-3 text-charcoal-700">
                <CheckCircle2 className="w-5 h-5 text-brand-red flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* FAQ */}
      <section className="bg-steel-50 py-16 md:py-24 border-t border-charcoal-100">
        <Container size="default">
          <SectionHeader eyebrow="Financing FAQ" title="Questions homeowners ask." />
          <dl className="mt-10 space-y-6">
            {FAQ_ITEMS.map((item) => (
              <div key={item.question} className="bg-white rounded-lg p-6 border border-charcoal-100">
                <dt className="font-heading text-lg font-bold text-navy-800 mb-2">
                  {item.question}
                </dt>
                <dd className="text-charcoal-600 leading-relaxed">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-navy-900 text-white py-16 md:py-24">
        <Container size="default" className="text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-extrabold mb-5">
            Let&apos;s talk about your project.
          </h2>
          <p className="text-charcoal-300 mb-8 max-w-2xl mx-auto">
            Start with a free, no-obligation estimate. We&apos;ll lay out the scope,
            the price, and — if you want it — the monthly options. Then you decide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CtaButton {...primaryCta} variant="onDark" />
            <a
              href={`tel:${BUSINESS.phoneRaw}`}
              className="inline-flex items-center justify-center gap-2 bg-white/10 text-white px-8 py-4 rounded-md font-bold text-sm hover:bg-white/15 transition-colors border border-white/15"
            >
              Call {BUSINESS.phone}
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}

function CtaButton({
  label,
  href,
  external,
  variant,
}: {
  label: string;
  href: string;
  external?: boolean;
  variant: 'primary' | 'onDark';
}) {
  const className =
    'inline-flex items-center justify-center gap-2 bg-brand-red text-white px-8 py-4 rounded-md font-bold text-sm hover:bg-brand-red-dark transition-colors shadow-lg shadow-brand-red/20';
  const inner = (
    <>
      {label}
      <ArrowRight className="w-4 h-4" />
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {inner}
    </Link>
  );
}

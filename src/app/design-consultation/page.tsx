import type { Metadata } from 'next';
import { Suspense } from 'react';
import {
  Calendar,
  Clock,
  Home,
  Layers,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { BUSINESS } from '@/lib/constants';
import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import AssurancesBand from '@/components/home/AssurancesBand';
import JsonLd from '@/components/seo/JsonLd';
import LuxuryGallery from '@/components/consultation/LuxuryGallery';
import LuxuryConsultationFormClient from './LuxuryConsultationFormClient';

export const metadata: Metadata = {
  title: `Schedule a Phone Consultation — Luxury Kitchen, Bath & Basement | ${BUSINESS.name}`,
  description:
    'Schedule a phone consultation for a premium kitchen, suite, lower-level, addition, or covered outdoor project across Loudoun and the surrounding region.',
  keywords: [
    'luxury kitchen consultation Northern Virginia',
    'design build phone consultation McLean',
    'primary bathroom consultation Great Falls',
    'basement design consultation Fairfax',
    'luxury renovation Alexandria',
    'design build contractor phone consultation',
  ],
  alternates: { canonical: `${BUSINESS.url}/design-consultation` },
  openGraph: {
    title: `Phone Consultation | ${BUSINESS.name}`,
    description:
      'Schedule a phone consultation for substantial interior, addition, and covered outdoor-living projects across the region.',
    url: `${BUSINESS.url}/design-consultation`,
    type: 'website',
  },
};

const HOW_IT_RUNS = [
  {
    step: 1,
    title: 'Brief intake',
    body: 'You share the project type, address, budget tier, timeline, and the best window to be called.',
  },
  {
    step: 2,
    title: 'Phone consultation',
    body: 'A 20–30 minute call inside your requested window. We talk through the project, answer your questions, and confirm fit on both sides — no pressure, no quota.',
  },
  {
    step: 3,
    title: 'In-home walkthrough (only if it fits)',
    body: 'If the project, the budget, and the timing all line up, we schedule a no-charge in-home visit to measure, photograph, and write the scope.',
  },
  {
    step: 4,
    title: 'Build phase',
    body: 'A single project lead from contract through final walkthrough. Daily progress, clean job site, written workmanship warranty.',
  },
];

const FIT_ITEMS = [
  'Loudoun County (Leesburg, Ashburn, Brambleton, Lansdowne, Middleburg)',
  'Fairfax County (McLean, Great Falls, Vienna, Reston, Burke, Fairfax Station, Clifton)',
  'Alexandria (Old Town, Belle Haven, Rosemont, North Ridge, Beverley Hills)',
  'Kitchens · primary baths · lower-level finishing · whole-home renovation · additions · covered outdoor living',
  'Premium project planning bands from $40,000 through $500,000+',
  'Working with a designer, considering one, or open to a recommendation',
];

const FAQ_ITEMS = [
  {
    question: 'Is the consultation actually free?',
    answer:
      'Yes — both the initial conversation and the in-home consultation are at no charge. We use the in-home walkthrough to scope the project properly and to confirm fit on both sides before either party commits.',
  },
  {
    question: 'Do you work with designers and architects?',
    answer:
      'Yes, frequently. A meaningful portion of our luxury work is design-build collaboration with established Northern Virginia designers and architects. We execute to the spec the design calls for and respect that relationship through the build.',
  },
  {
    question: 'What if we have not chosen a designer yet?',
    answer:
      'We can recommend designers we have worked with successfully across the markets we serve. For projects where the homeowner prefers a single design-build relationship through us, we manage the design phase in-house.',
  },
  {
    question: 'What project size makes sense for this consultation path?',
    answer:
      'The design consultation path is designed for substantial kitchen, bath, basement, addition, whole-home, and covered outdoor projects. Most interior projects begin at a $50,000 planning band; covered outdoor-living briefs may begin at $40,000. For smaller-scope work, the standard estimate form is faster.',
  },
  {
    question: 'What is the typical response time?',
    answer:
      'Within 4 business hours during the work week, and same-day for inquiries submitted before 4 PM. The first conversation is typically a 20–30 minute call to confirm fit, talk through the brief, and schedule the in-home consultation.',
  },
];

export default function DesignConsultationPage() {
  return (
    <>
      <JsonLd
        schema={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'Luxury Design Consultation',
          provider: {
            '@type': 'GeneralContractor',
            name: BUSINESS.name,
            url: BUSINESS.url,
            telephone: BUSINESS.phone,
          },
          areaServed: ['Virginia', 'Maryland', 'West Virginia'],
          description:
            'Phone consultation for substantial kitchen, suite, basement, addition, whole-home, and outdoor-living projects across Loudoun and the surrounding region.',
        }}
      />
      <JsonLd
        schema={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: FAQ_ITEMS.map((q) => ({
            '@type': 'Question',
            name: q.question,
            acceptedAnswer: { '@type': 'Answer', text: q.answer },
          })),
        }}
      />

      {/* Hero */}
      <section className="bg-navy-900 text-white pt-16 pb-16 md:pt-24 md:pb-20">
        <Container size="wide">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-brand-red/15 backdrop-blur-sm border border-brand-red/40 rounded-full px-4 py-1.5 mb-6">
              <Star className="w-3 h-3 text-brand-red" />
              <span className="text-white text-[0.7rem] font-semibold tracking-[0.18em] uppercase">
                Phone Consultation · No Obligation
              </span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.05] tracking-tight">
              Pick a window.
              <br />
              <span className="text-brand-red">We&apos;ll call you.</span>
            </h1>
            <p className="text-charcoal-200 text-lg md:text-xl mt-6 leading-relaxed max-w-2xl">
              A 20–30 minute phone consultation for kitchens, primary baths, lower-level
              finishing, additions, whole-home renovations, and covered outdoor living. You
              tell us the brief and the best time to be called; we call inside the window. Only
              when the fit is right do we schedule an in-home visit.
            </p>

            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-charcoal-200">
              <li className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-brand-red" /> Phone First
              </li>
              <li aria-hidden="true" className="text-white/30">·</li>
              <li className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-brand-red" /> 4-Hour Response
              </li>
              <li aria-hidden="true" className="text-white/30">·</li>
              <li className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-brand-red" /> No In-Home Until It Fits
              </li>
              <li aria-hidden="true" className="text-white/30">·</li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-red" /> Licensed VA · MD · WV
              </li>
            </ul>

            <div className="flex flex-wrap gap-3 mt-10">
              <a
                href="#consult-form"
                className="bg-brand-red text-white px-7 py-3.5 rounded-md font-bold text-sm hover:bg-brand-red-dark transition-colors shadow-lg shadow-navy-950/40"
              >
                Request a Call →
              </a>
              <a
                href={`tel:${BUSINESS.phoneRaw}`}
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-7 py-3.5 rounded-md font-bold text-sm hover:bg-white/20 transition-colors inline-flex items-center gap-2"
              >
                <Phone className="w-4 h-4" /> {BUSINESS.phone}
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* Form + How it runs */}
      <section id="consult-form" className="bg-white py-16 md:py-24 scroll-mt-24">
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            {/* Form */}
            <div className="lg:col-span-7 order-2 lg:order-1">
              <SectionHeader
                eyebrow="Project Brief"
                title="Tell us about the project."
                subtitle="Fields are quick — five minutes total. Everything you share helps us prepare for the in-home consultation."
              />
              <div className="mt-10">
                <Suspense fallback={<div className="h-[800px]" />}>
                  <LuxuryConsultationFormClient />
                </Suspense>
              </div>
            </div>

            {/* How it runs */}
            <div className="lg:col-span-5 order-1 lg:order-2">
              <div className="lg:sticky lg:top-24">
                <p className="text-brand-red text-xs uppercase tracking-[0.18em] font-semibold mb-3">
                  How It Runs
                </p>
                <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-navy-800 leading-tight mb-6">
                  Four steps. One project lead.
                </h2>
                <ol className="space-y-5">
                  {HOW_IT_RUNS.map((s) => (
                    <li key={s.step} className="flex gap-4">
                      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-navy-800 text-white flex items-center justify-center font-heading font-extrabold text-sm">
                        {s.step}
                      </div>
                      <div className="pt-0.5">
                        <h3 className="font-heading text-base font-bold text-navy-800 mb-1">
                          {s.title}
                        </h3>
                        <p className="text-charcoal-600 text-sm leading-relaxed">{s.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>

                <div className="mt-8 bg-steel-50 border-l-4 border-brand-red rounded-r-lg p-5">
                  <p className="text-[0.65rem] uppercase tracking-[0.18em] text-brand-red font-bold mb-2">
                    Prefer a conversation first?
                  </p>
                  <p className="text-charcoal-700 text-sm leading-relaxed">
                    Direct line to the project lead:{' '}
                    <a
                      href={`tel:${BUSINESS.phoneRaw}`}
                      className="font-bold text-navy-800 hover:text-brand-red transition-colors"
                    >
                      {BUSINESS.phone}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Portfolio: recent work + design inspiration */}
      <LuxuryGallery />

      {/* Fit */}
      <section className="bg-steel-50 py-16 md:py-24">
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5">
              <p className="text-brand-red text-xs uppercase tracking-[0.18em] font-semibold mb-3">
                Best Fit
              </p>
              <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-navy-800 leading-tight">
                Is this the right path?
              </h2>
              <p className="text-charcoal-600 mt-4 text-base leading-relaxed">
                The design consultation path is calibrated for premium kitchen, bath, lower-level,
                addition, whole-home, and covered outdoor-living work. For smaller-scope repairs and quick estimates, our
                standard request form on each service page is faster.
              </p>
            </div>
            <div className="lg:col-span-7">
              <ul className="space-y-3">
                {FIT_ITEMS.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 bg-white border border-charcoal-100 rounded-lg p-4"
                  >
                    <MapPin className="w-5 h-5 text-brand-red flex-shrink-0 mt-0.5" />
                    <span className="text-charcoal-700 text-base leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* Three reasons */}
      <section className="bg-white py-16 md:py-24">
        <Container size="wide">
          <SectionHeader
            eyebrow="The Difference"
            title="What makes the consultation worthwhile."
            align="center"
            className="mx-auto"
          />
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                icon: Home,
                title: 'Project lead, not a salesperson',
                body: 'The person at your front door is the person who will run the build. No handoffs, no quota.',
              },
              {
                icon: Layers,
                title: 'Designer-collaborative',
                body: 'We are comfortable working alongside your designer or architect, and we have recommendations when you need one.',
              },
              {
                icon: ShieldCheck,
                title: 'A written brief, before the bid',
                body: 'You leave the consultation with a written scope, a realistic budget range, and a proposed timeline — not a one-line quote.',
              },
            ].map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title}
                  className="bg-steel-50 border-t-4 border-brand-red rounded-lg p-7 lg:p-8"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-navy-800 text-white mb-5">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading text-xl md:text-2xl font-extrabold text-navy-800 mb-3">
                    {p.title}
                  </h3>
                  <p className="text-charcoal-600 text-sm leading-relaxed">{p.body}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="bg-steel-50 py-16 md:py-24">
        <Container size="default">
          <SectionHeader
            eyebrow="Frequently Asked"
            title="A few common questions."
            align="center"
            className="mx-auto"
          />
          <div className="mt-12 max-w-3xl mx-auto space-y-3">
            {FAQ_ITEMS.map((item) => (
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

      <AssurancesBand />
    </>
  );
}

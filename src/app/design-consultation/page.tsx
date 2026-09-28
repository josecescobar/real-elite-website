import type { Metadata } from 'next';
import { buildMetadata, fitTitle } from '@/lib/seo';
import { Suspense } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Home,
  Layers,
  MapPin,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { BUSINESS } from '@/lib/constants';
import { CONSULTATION_THRESHOLD_LABEL } from '@/lib/investment-guide';
import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import AssurancesBand from '@/components/home/AssurancesBand';
import JsonLd from '@/components/seo/JsonLd';
import LuxuryGallery from '@/components/consultation/LuxuryGallery';
import LuxuryConsultationFormClient from './LuxuryConsultationFormClient';
import PhoneLink from '@/components/analytics/PhoneLink';

export const metadata: Metadata = {
  ...buildMetadata({
    path: '/design-consultation',
    title: `Design Consultation | ${BUSINESS.name}`,
    description:
      'A short call about the house, the rooms and the range. Design-build for Loudoun County: kitchens, primary suites, lower levels, additions and outdoor living.',
    keywords: [
      'design consultation Loudoun County',
      'design build consultation Leesburg VA',
      'kitchen design consultation Ashburn',
      'basement design consultation Loudoun',
      'primary suite consultation Northern Virginia',
      'design build contractor phone consultation',
    ],
  }),
  title: fitTitle(`Design Consultation — Loudoun County Design-Build | ${BUSINESS.name}`),
  description:
    'Start a Loudoun County design-build project with a short call about the house, the rooms and the range, then a site visit if it fits.',
};

const HOW_IT_RUNS = [
  {
    step: 1,
    title: 'The brief',
    body: 'You share the project type, the town, an investment range, a timeline, and the best window to be called. Five minutes.',
  },
  {
    step: 2,
    title: 'The call',
    body: 'A short conversation inside your window about the house, the rooms and the range. We tell you honestly whether it is a design-build fit or a project the standard estimate serves better.',
  },
  {
    step: 3,
    title: 'The site visit, if it fits',
    body: 'If the project, the range and the timing line up, we come out to measure, photograph and look at structure and mechanicals before anything is drawn.',
  },
  {
    step: 4,
    title: 'Design, approvals, build',
    body: 'Drawings and selections, then county and HOA approvals, then the build with one project lead from the first day to the walkthrough. Review the proposed scope and warranty terms before signing.',
  },
];

const FIT_ITEMS = [
  'Loudoun County first: Leesburg, Ashburn, Brambleton, Lansdowne, Middleburg, Purcellville, Waterford and Round Hill',
  'Fairfax County by conversation, and the Eastern Panhandle of West Virginia, where the company is based',
  'Kitchens · primary suites and baths · lower levels · additions · outdoor living · whole-home renovation',
  `Projects of ${CONSULTATION_THRESHOLD_LABEL}. Smaller projects and repairs are welcome through the standard estimate, which is faster for that work`,
  'Working with a designer or architect, considering one, or not sure whether the project needs one',
];

const FAQ_ITEMS = [
  {
    question: 'Is the consultation free?',
    answer:
      'The call and the first site visit are at no charge. They exist to decide, on both sides, whether the project is a fit before anyone commits to a design phase.',
  },
  {
    question: 'Do you work with designers and architects?',
    answer:
      'If you have a designer or an architect, we build their set. If you do not, we will tell you whether this project needs one before we pretend to be the design firm. Additions and structural changes need engineered drawings for the county either way.',
  },
  {
    question: 'What project size is this path for?',
    answer:
      `The consultation is calibrated for projects of ${CONSULTATION_THRESHOLD_LABEL}: kitchens, primary suites, lower levels, additions and outdoor living. If the number you have in mind is closer to a repair, we will say so on the call and point you to the standard estimate, which is the faster path for that work.`,
  },
  {
    question: 'How do Loudoun HOA and permit reviews affect the timeline?',
    answer:
      'They sit between design and construction. The county permit and the HOA architectural application run in parallel, and inside Leesburg, Purcellville and Middleburg the town zoning approval comes first. We sequence both before demolition so the start date is real.',
  },
  {
    question: 'When will we hear from you?',
    answer:
      'Inside the call window you choose on the form, during business hours. If you would rather talk now, the direct line is on this page.',
  },
];

export default function DesignConsultationPage() {
  return (
    <>
      <JsonLd
        schema={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'Design-Build Consultation',
          provider: {
            '@type': 'GeneralContractor',
            name: BUSINESS.name,
            url: BUSINESS.url,
            telephone: BUSINESS.phone,
          },
          areaServed: ['Loudoun County, VA', 'Fairfax County, VA', 'Eastern Panhandle, WV'],
          description:
            'Design-build consultation for kitchens, primary suites, lower levels, additions and outdoor living in Loudoun County, Virginia.',
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
      <section className="bg-navy-900 text-white pt-20 pb-16 md:pt-28 md:pb-20">
        <Container size="wide">
          <div className="max-w-3xl">
            <p className="text-brand-red-light text-xs uppercase tracking-[0.22em] font-semibold mb-5">
              Design consultation · Loudoun County
            </p>

            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.02]">
              Tell us about the house.
              <br />
              We&apos;ll call <em>inside your window</em>.
            </h1>
            <p className="text-charcoal-300 text-lg md:text-xl mt-7 leading-relaxed max-w-2xl">
              For Loudoun County projects we start with a short call about the rooms, the range
              and the timing. If the house, the scope and the investment fit, we come out to
              measure. If the number you have in mind is closer to a repair, we say so on the
              call and point you to the faster path.
            </p>

            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-8 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-charcoal-300">
              <li className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-brand-red-light" aria-hidden="true" /> Call first
              </li>
              <li aria-hidden="true" className="text-white/30">·</li>
              <li className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-brand-red-light" aria-hidden="true" /> Site visit only if it fits
              </li>
              <li aria-hidden="true" className="text-white/30">·</li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-red-light" aria-hidden="true" /> VA Class A HIC · WV062432
              </li>
            </ul>

            <div className="flex flex-wrap gap-3 mt-10">
              <a
                href="#consult-form"
                className="inline-flex items-center gap-2 bg-white text-navy-900 px-7 py-3.5 rounded-md font-semibold text-sm hover:bg-brand-red-light transition-colors focus-ring-on-navy"
              >
                Request a call →
              </a>
              <PhoneLink
                location="design_consult_hero"
                className="inline-flex items-center gap-2 border border-white/35 text-white px-7 py-3.5 rounded-md font-semibold text-sm hover:bg-white/10 transition-colors focus-ring-on-navy"
              >
                <Phone className="w-4 h-4" aria-hidden="true" /> {BUSINESS.phone}
              </PhoneLink>
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
                subtitle="Five minutes. The project type, the town and the range let us come to the call prepared, and let us tell you quickly whether a site visit makes sense."
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
                <h2 className="font-heading text-2xl md:text-3xl text-navy-800 leading-tight mb-6">
                  Four steps. One team.
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
                    <PhoneLink
                      location="design_consult_body"
                      className="font-bold text-navy-800 hover:text-brand-red transition-colors"
                    >
                      {BUSINESS.phone}
                    </PhoneLink>
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
              <h2 className="font-heading text-3xl md:text-4xl text-navy-800 leading-tight">
                Is this the right path?
              </h2>
              <p className="text-charcoal-600 mt-4 text-base leading-relaxed">
                This form starts a design-build conversation. If the scope or the range is still
                taking shape, say so; the{' '}
                <Link href="/investment" className="link-editorial font-medium text-navy-900">
                  investment guide
                </Link>{' '}
                shows typical Loudoun ranges for each project type before you decide.
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
                title: 'Your designer, or an honest answer',
                body: 'If you have a designer or architect, we build their set. If you do not, we tell you whether the project needs one before we pretend to be the design firm.',
              },
              {
                icon: ShieldCheck,
                title: 'A written scope, before the price',
                body: 'Design-build means the drawings and selections come first, so the number is built from what will actually be built, not from a one-line quote.',
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

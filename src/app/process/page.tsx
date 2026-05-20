import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ClipboardList,
  FileText,
  HardHat,
  CheckCircle2,
  MessageSquareText,
  Shield,
  Clock,
  Sparkles,
  DollarSign,
  CalendarClock,
  ArrowRight,
} from 'lucide-react';
import { BUSINESS, PRECISION_PROCESS } from '@/lib/constants';
import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import AssurancesBand from '@/components/home/AssurancesBand';

export const metadata: Metadata = {
  title: `Our Process | Built With Military Precision | ${BUSINESS.name}`,
  description:
    'Recon, Plan, Execute, Inspect — the disciplined four-step process behind every Real Elite project. Communication standards, daily cleanup, and what to expect during your remodel.',
  keywords: [
    'contractor process',
    'remodel process',
    'how we work',
    'project communication',
    'daily cleanup',
    'workmanship warranty',
    'Real Elite Contracting',
  ],
  alternates: { canonical: `${BUSINESS.url}/process` },
  openGraph: {
    title: `Our Process | ${BUSINESS.name}`,
    description:
      'The four-step Military Precision Process. Recon, Plan, Execute, Inspect.',
    url: `${BUSINESS.url}/process`,
    type: 'website',
  },
};

const STEP_ICONS = [ClipboardList, FileText, HardHat, CheckCircle2];

const STEP_DEEP_DIVE: Record<string, string[]> = {
  Recon: [
    'Free, no-pressure on-site walkthrough — typically 30–60 minutes.',
    'We listen first. What are you trying to solve, what have you already considered, what is the must-have list vs. the nice-to-have list.',
    'Photos, measurements, and any obvious red flags (moisture, structural, code) noted on the spot.',
    'Written, line-itemed estimate back to you within a few business days — not a single inflated number.',
  ],
  Plan: [
    'Final scope locked in writing — what is and is not included, with line items.',
    'Material selection: we bring real samples, suppliers, and tradeoffs (not just brand names).',
    'Financing walkthrough on qualified projects so the monthly number is clear before you commit.',
    'Project lead introduced. They are your point of contact from this moment to final walkthrough.',
    "Realistic timeline with milestones. We don't pad it; we don't shave it.",
  ],
  Execute: [
    'Crew arrives on the start date you were given — not a moving window.',
    'Daily updates from your project lead with progress photos.',
    'Dust containment, walked surfaces protected, clean job site at end of every day.',
    '24-hour response standard on any question or concern you raise.',
    "Sub-trades are people we've worked with for years. They're held to our standard, not theirs.",
  ],
  Inspect: [
    'Final walkthrough with you, your project lead, and a punch list.',
    'Every item on the punch list is cleared before we ask you to sign off.',
    'Workmanship warranty issued in writing.',
    'Manufacturer warranties (shingles, decking, siding, fixtures) registered on your behalf — you get the documentation.',
    'A real follow-up call from the office, not a marketing drip campaign.',
  ],
};

const STANDARDS = [
  {
    icon: MessageSquareText,
    title: 'Communication',
    body: 'Named project lead from day one. Daily updates with progress photos. 24-hour response standard on every question. No ghosting.',
  },
  {
    icon: Sparkles,
    title: 'Daily Cleanup',
    body: 'Dust containment in place before demo. Surfaces protected. Site swept end-of-day. Nail sweep on every roofing project. Your home stays livable.',
  },
  {
    icon: Clock,
    title: 'Response Time',
    body: "24-hour reply standard on calls, texts, and emails during business days. If we're going to be late on something, you hear it from us first.",
  },
  {
    icon: Shield,
    title: 'Workmanship Warranty',
    body: 'Written warranty on every project. Manufacturer warranties stacked on top and registered on your behalf.',
  },
  {
    icon: DollarSign,
    title: 'Transparent Pricing',
    body: 'Line-itemed written estimates. No moving target. Financing options walked through clearly before you commit.',
  },
  {
    icon: CalendarClock,
    title: 'Realistic Timelines',
    body: "We don't pad. We don't shave. We give you a real schedule with milestones and we hold ourselves to it.",
  },
];

const WHAT_TO_EXPECT = [
  {
    week: 'Before Day 1',
    body: 'Final scope, materials, timeline, and payment milestones confirmed in writing. Project lead introduces themselves. Permit timeline reviewed.',
  },
  {
    week: 'Week 1',
    body: "Site prep, dust containment, demo as needed. You'll hear the most noise this week — we coordinate around your schedule where we can.",
  },
  {
    week: 'Mid-project',
    body: 'Rough-in inspections, framing/structural work, materials staged. Daily progress updates. This is where most of the heavy work happens.',
  },
  {
    week: 'Finish phase',
    body: 'Tile, paint, trim, fixtures, final details. The site quiets down. You start to see the project come together.',
  },
  {
    week: 'Final walkthrough',
    body: 'You, your project lead, and a punch list. Every issue resolved before sign-off. Warranty documentation handed off. Final cleanup complete.',
  },
];

export default function ProcessPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy-900 text-white pt-16 pb-20 md:pt-24 md:pb-28">
        <Container size="wide">
          <div className="max-w-3xl">
            <p className="text-brand-red text-xs uppercase tracking-[0.18em] font-semibold mb-4">
              The Military Precision Process
            </p>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.05] tracking-tight">
              Four steps.
              <br />
              <span className="text-brand-red">No surprises.</span>
            </h1>
            <p className="text-charcoal-200 text-lg md:text-xl mt-6 leading-relaxed max-w-2xl">
              The same disciplined operating system every project follows — from the first phone
              call through the final walkthrough. Here&apos;s exactly what we do, in order, and
              what to expect from each phase.
            </p>
          </div>
        </Container>
      </section>

      {/* 4-step deep dive */}
      <section className="bg-white py-16 md:py-24">
        <Container size="wide">
          <SectionHeader
            eyebrow="The Four Steps"
            title="Recon. Plan. Execute. Inspect."
          />
          <ol className="mt-14 space-y-12 lg:space-y-16">
            {PRECISION_PROCESS.map((step, idx) => {
              const Icon = STEP_ICONS[idx] ?? ClipboardList;
              const detail = STEP_DEEP_DIVE[step.title] ?? [];
              return (
                <li
                  key={step.step}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start"
                >
                  <div className="lg:col-span-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-14 h-14 rounded-md bg-brand-red text-white font-heading font-extrabold text-xl shadow-md flex-shrink-0">
                        {step.step}
                      </div>
                      <div className="text-charcoal-400">
                        <Icon className="w-7 h-7" aria-hidden="true" />
                      </div>
                    </div>
                    <h3 className="font-heading text-3xl md:text-4xl font-extrabold text-navy-800 mt-5 leading-tight">
                      {step.title}
                    </h3>
                    <p className="text-charcoal-600 mt-3 leading-relaxed">{step.summary}</p>
                  </div>
                  <ul className="lg:col-span-8 bg-steel-50 rounded-lg border-l-4 border-brand-red p-7 md:p-8 space-y-3 text-charcoal-700">
                    {detail.map((line) => (
                      <li key={line} className="flex items-start gap-3">
                        <span className="text-brand-red font-bold flex-shrink-0 mt-0.5">·</span>
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ol>
        </Container>
      </section>

      {/* Standards strip */}
      <section className="bg-steel-50 py-16 md:py-24 border-y border-charcoal-100">
        <Container size="wide">
          <SectionHeader
            eyebrow="What You Can Count On"
            title="Six standards. Every project."
            subtitle="The stuff most contractors quietly skip — and why homeowners stop calling them. Here is exactly what we hold ourselves to."
            align="center"
            className="mx-auto"
          />
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {STANDARDS.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.title}
                  className="bg-white rounded-lg p-6 shadow-sm border-t-4 border-brand-red"
                >
                  <div className="inline-flex items-center justify-center w-11 h-11 rounded-md bg-navy-800 text-white mb-4">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <h3 className="font-heading text-lg font-extrabold text-navy-800 mb-2">
                    {s.title}
                  </h3>
                  <p
                    className="text-charcoal-600 text-sm leading-relaxed"
                  >{s.body}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* What to expect during your remodel */}
      <section className="bg-white py-16 md:py-24">
        <Container size="wide">
          <SectionHeader
            eyebrow="What To Expect"
            title="A typical remodel, week by week."
            subtitle="Most homeowners have never been through a project like this. Here is the rough cadence so you know what each phase will feel like in your home."
          />
          <ol className="mt-12 relative border-l-2 border-charcoal-200 ml-3">
            {WHAT_TO_EXPECT.map((phase) => (
              <li key={phase.week} className="pl-7 pb-10 relative last:pb-0">
                <span
                  aria-hidden="true"
                  className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-brand-red border-2 border-white shadow"
                />
                <p className="text-brand-red text-xs uppercase tracking-[0.18em] font-semibold mb-1">
                  {phase.week}
                </p>
                <p className="text-charcoal-700 leading-relaxed">{phase.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Assurances */}
      <AssurancesBand />

      {/* CTA */}
      <section className="bg-navy-900 text-white py-16 md:py-24">
        <Container size="default" className="text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-extrabold mb-5">
            See what this looks like for your project.
          </h2>
          <p className="text-charcoal-300 mb-8 max-w-2xl mx-auto">
            Three short steps. About 60 seconds. A real project lead reaches out within 24
            business hours.
          </p>
          <Link
            href="/#estimate"
            className="inline-flex items-center gap-2 bg-brand-red text-white px-8 py-4 rounded-md font-bold text-sm hover:bg-brand-red-dark transition-colors shadow-lg shadow-navy-950/40"
          >
            Get My Free Estimate
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Container>
      </section>
    </>
  );
}

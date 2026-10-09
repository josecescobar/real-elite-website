import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { BUSINESS } from '@/lib/constants';
import { DESIGN_BUILD_PROCESS } from '@/lib/design-build-process';
import Container from '@/components/shared/Container';
import AssurancesBand from '@/components/home/AssurancesBand';
import JsonLd from '@/components/seo/JsonLd';
import { buildBreadcrumbSchema, buildMetadata } from '@/lib/seo';
import PhoneLink from '@/components/analytics/PhoneLink';

export const metadata: Metadata = {
  ...buildMetadata({
    path: '/process',
    title: `Our Design-Build Process | ${BUSINESS.name}`,
    description:
      'Conversation, design and scope, approvals, build, walkthrough. How a design-build project runs.',
    keywords: [
      'design-build process',
      'remodeling process Loudoun County',
      'how design-build works',
      'HOA approval remodel Loudoun',
      'remodel permits Loudoun County',
      'Real Elite Contracting',
    ],
  }),
  description:
    'How a Real Elite design-build project runs in Loudoun County: conversation, design, county and HOA approvals, the build, and the walkthrough.',
};

/**
 * What the homeowner can expect across the calendar, written as the shape of
 * a project rather than as a promised duration. Loudoun approvals sit in the
 * middle of it, which is the part most homeowners are not told about.
 */
const CALENDAR = [
  {
    phase: 'Weeks one to three',
    title: 'Conversation and site visit',
    body: 'The first call, then the measure-and-photograph visit if the project fits. You see the investment guide range for your project type before we meet.',
  },
  {
    phase: 'Design phase',
    title: 'Drawings, selections, scope',
    body: 'Layout options, showroom selections and the engineered drawings the county will want. The length depends on how many decisions there are and how quickly they are made.',
  },
  {
    phase: 'Approvals',
    title: 'County, town and HOA',
    body: 'Loudoun permit review runs alongside the HOA architectural application, and inside Leesburg, Purcellville and Middleburg the town zoning approval comes first. Historic districts add a committee date to plan around.',
  },
  {
    phase: 'Construction',
    title: 'Protection, rough-ins, finish',
    body: 'The house is protected first, then demolition, structure and rough-ins, inspections, drywall, and the finish work where a project reads as custom. Changes are priced in writing before they are built.',
  },
  {
    phase: 'Close-out',
    title: 'Walkthrough, documents, follow-up',
    body: 'Punch list cleared, permit closed, warranties and as-builts handed over, and a visit after you have lived in the space.',
  },
];

const HANDOVER = [
  'Approved drawings and the as-built set',
  'Selections schedule with product names and finishes',
  'Closed permit and inspection record',
  'The warranty terms as written in your agreement',
  'Care instructions for stone, cabinetry and decking',
];

export default function ProcessPage() {
  const breadcrumb = buildBreadcrumbSchema([
    { name: 'Home', item: BUSINESS.url },
    { name: 'Process', item: `${BUSINESS.url}/process` },
  ]);

  return (
    <>
      <JsonLd schema={breadcrumb} />

      {/* Hero */}
      <section className="bg-navy-900 text-white pt-20 pb-20 md:pt-28 md:pb-28">
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-8">
              <p className="text-brand-red-light text-xs uppercase tracking-[0.22em] font-semibold mb-5">
                Our process
              </p>
              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.02]">
                Design first.
                <br />
                Then a price you can <em>hold us to</em>.
              </h1>
              <p className="text-charcoal-300 text-lg md:text-xl mt-7 leading-relaxed max-w-2xl">
                Design-build means the drawings, the selections and the approvals come before
                the construction price. The number is built from what will actually be built,
                and one team carries it from the first call to the walkthrough.
              </p>
            </div>
            <div className="lg:col-span-4 lg:pb-2">
              <ol className="space-y-2 border-l border-white/15 pl-5">
                {DESIGN_BUILD_PROCESS.map((s) => (
                  <li key={s.step} className="flex items-baseline gap-3">
                    <span className="font-heading text-brand-red-light tabular-nums text-sm">{s.step}</span>
                    <a href={`#step-${s.step}`} className="font-heading text-lg text-white hover:text-brand-red-light transition-colors">
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Container>
      </section>

      {/* Five steps, deep */}
      <section className="bg-white py-16 md:py-24">
        <Container size="wide">
          <ol className="divide-y divide-steel-200">
            {DESIGN_BUILD_PROCESS.map((step) => (
              <li
                key={step.step}
                id={`step-${step.step}`}
                className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 py-14 md:py-16 first:pt-0 reveal"
              >
                <div className="lg:col-span-5">
                  <p className="font-heading text-brand-red text-3xl tabular-nums">{step.step}</p>
                  <h2 className="font-heading text-3xl md:text-4xl text-navy-900 mt-3 leading-tight">
                    {step.title}
                  </h2>
                  <p className="text-charcoal-600 mt-4 leading-relaxed max-w-md">{step.summary}</p>
                </div>
                <div className="lg:col-span-7">
                  <ul className="space-y-4">
                    {step.detail.map((line) => (
                      <li key={line} className="flex gap-4 text-charcoal-700 leading-relaxed">
                        <span aria-hidden="true" className="mt-2.5 w-1.5 h-px bg-brand-red flex-shrink-0" />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 bg-steel-50 border-l-2 border-brand-red rounded-r-md px-5 py-4">
                    <p className="text-[0.65rem] uppercase tracking-[0.2em] text-charcoal-500 font-semibold mb-1">
                      What you have at the end
                    </p>
                    <p className="text-navy-900">{step.deliverable}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Calendar shape */}
      <section className="bg-steel-50 py-16 md:py-24 border-y border-steel-200">
        <Container size="wide">
          <div className="max-w-2xl mb-12">
            <p className="text-brand-red text-xs uppercase tracking-[0.22em] font-semibold mb-4">
              The shape of the calendar
            </p>
            <h2 className="font-heading text-3xl md:text-4xl text-navy-900 leading-tight">
              Where the time actually goes.
            </h2>
            <p className="text-charcoal-600 mt-4 leading-relaxed">
              Most of a Loudoun project&rsquo;s calendar is decided before demolition: design
              decisions, county review and the HOA. Knowing that up front is the difference
              between a schedule and a hope.
            </p>
          </div>
          <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {CALENDAR.map((c, i) => (
              <li key={c.title} className="reveal border-t border-steel-300 pt-4">
                <p className="text-[0.65rem] uppercase tracking-[0.2em] text-charcoal-500 font-semibold">
                  {c.phase}
                </p>
                <h3 className="font-heading text-xl text-navy-900 mt-2 leading-snug">
                  <span className="text-brand-red mr-2 tabular-nums">{i + 1}</span>
                  {c.title}
                </h3>
                <p className="text-charcoal-600 text-sm leading-relaxed mt-2">{c.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Designers, and the handover */}
      <section className="bg-white py-16 md:py-24">
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-6">
              <p className="text-brand-red text-xs uppercase tracking-[0.22em] font-semibold mb-4">
                Designers and architects
              </p>
              <h2 className="font-heading text-3xl md:text-4xl text-navy-900 leading-tight">
                If you have a designer, we build their set.
              </h2>
              <p className="text-charcoal-600 mt-4 leading-relaxed">
                If you do not, we will tell you whether this project needs one before we pretend
                to be the design firm. Kitchens and primary suites usually benefit from a
                designer at the selections stage; additions and structural changes need an
                architect or engineer for the drawings the county will ask for. Either way, the
                scope is written from the set, and the set is what gets built.
              </p>
            </div>
            <div className="lg:col-span-6">
              <p className="text-brand-red text-xs uppercase tracking-[0.22em] font-semibold mb-4">
                What you keep
              </p>
              <h2 className="font-heading text-3xl md:text-4xl text-navy-900 leading-tight">
                The handover package.
              </h2>
              <ul className="mt-6 divide-y divide-steel-200 border-y border-steel-200">
                {HANDOVER.map((item) => (
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

      <AssurancesBand />

      {/* CTA */}
      <section className="bg-navy-900 text-white py-16 md:py-24">
        <Container size="default">
          <div className="max-w-2xl">
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl leading-[1.05]">
              See what this looks like for your house.
            </h2>
            <p className="text-charcoal-300 mt-5 leading-relaxed">
              A short call about the rooms, the range and the timing. If it fits, we come out to
              measure. Or call{' '}
              <PhoneLink location="process_cta" className="text-white font-medium link-editorial">
                {BUSINESS.phone}
              </PhoneLink>
              .
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link
                href="/design-consultation"
                className="inline-flex items-center gap-2 bg-white text-navy-900 px-7 py-4 rounded-md font-semibold text-sm hover:bg-brand-red-light transition-colors focus-ring-on-navy"
              >
                Schedule a design consultation
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                href="/investment"
                className="inline-flex items-center gap-2 border border-white/35 text-white px-7 py-4 rounded-md font-semibold text-sm hover:bg-white/10 transition-colors focus-ring-on-navy"
              >
                Read the investment guide
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

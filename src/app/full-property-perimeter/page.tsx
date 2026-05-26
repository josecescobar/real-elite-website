import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Home,
  Layers,
  TreePine,
  Construction,
  Sprout,
  Calendar,
  Shield,
  ArrowUpRight,
  CheckCircle2,
} from 'lucide-react';
import { BUSINESS } from '@/lib/constants';
import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import AssurancesBand from '@/components/home/AssurancesBand';
import JsonLd from '@/components/seo/JsonLd';
import FAQSchema from '@/components/seo/FAQSchema';

export const metadata: Metadata = {
  title: `Full Property Perimeter — Roof to Road Bundle | ${BUSINESS.name}`,
  description:
    'Roof + siding + deck + driveway + landscaping under one coordinated project. Real Elite Contracting × A+ Paving & Landscaping. Tri-state WV / MD / VA. Veteran-owned. Built with military precision.',
  keywords: [
    'roof and driveway bundle',
    'full exterior renovation WV',
    'roofing and paving package',
    'exterior remodeling bundle WV MD VA',
    'Real Elite A+ Paving',
    'full property exterior contractor',
    'Eastern Panhandle exterior renovation',
  ],
  alternates: { canonical: `${BUSINESS.url}/full-property-perimeter` },
  openGraph: {
    title: `Full Property Perimeter | ${BUSINESS.name} × A+ Paving`,
    description:
      'From the roof to the road — one team, one standard, one warranty. Veteran-owned exterior renovation bundle.',
    url: `${BUSINESS.url}/full-property-perimeter`,
    type: 'website',
  },
};

const SCOPE_ITEMS = [
  {
    icon: Home,
    title: 'New Roof',
    by: 'Real Elite',
    body: 'Architectural shingle replacement, valley flashing, full tear-off, manufacturer warranty registered on your behalf.',
  },
  {
    icon: Layers,
    title: 'New Siding',
    by: 'Real Elite',
    body: 'Vinyl, fiber cement, or stone-veneer accents installed to match — refreshed facade with weather-tight installation.',
  },
  {
    icon: TreePine,
    title: 'New Deck',
    by: 'Real Elite',
    body: 'Composite or pressure-treated decks, lighting, premium railings, and outdoor living spaces engineered for the long term.',
  },
  {
    icon: Construction,
    title: 'New Driveway',
    by: 'A+ Paving',
    body: 'Asphalt paving and resurfacing — 3-4" base, professional sealcoating, edges cut clean to your landscape lines.',
  },
  {
    icon: Sprout,
    title: 'Landscaping',
    by: 'A+ Paving',
    body: 'Lawn refresh, plantings, mulch, hardscape — finishing the perimeter so the whole property reads as one project.',
  },
];

const WHY_PILLARS = [
  {
    icon: Calendar,
    title: 'One Coordinated Schedule',
    body:
      'Two crews on one master timeline. Roof goes on before driveway is cut. Driveway cures before final landscaping. No two-contractor finger-pointing.',
  },
  {
    icon: Shield,
    title: 'One Warranty Conversation',
    body:
      'You get a single point of contact for the entire scope. Workmanship warranty on every line item. Manufacturer warranties registered on your behalf.',
  },
  {
    icon: Home,
    title: 'One Bundled Price',
    body:
      'A transparent bundle discount vs. the sum of separate quotes — typically saving homeowners 5–8% across the full perimeter scope.',
  },
];

const TIMELINE = [
  {
    step: 'Week 1',
    title: 'Coordinated walk-through',
    body:
      'Real Elite and A+ visit together for a single estimate appointment. You walk the property once. You get one consolidated proposal.',
  },
  {
    step: 'Week 2',
    title: 'Approval & permits',
    body:
      'We handle WV / MD / VA permitting and HOA approval across all trades. One project lead, one set of paperwork.',
  },
  {
    step: 'Weeks 3–5',
    title: 'Roof, siding, deck',
    body:
      'Real Elite executes the building envelope first — clean job site every day, daily homeowner updates, military-precision finish work.',
  },
  {
    step: 'Weeks 5–6',
    title: 'Driveway & landscape',
    body:
      'A+ Paving installs the new driveway once the roof / siding work is clear, then closes out with landscape refresh.',
  },
  {
    step: 'Week 7',
    title: 'Final walk-through',
    body:
      'One final walk-through covers the whole property. One punch list. One warranty packet. One satisfied homeowner.',
  },
];

const FAQ_ITEMS = [
  {
    question: 'What is the Full Property Perimeter bundle?',
    answer:
      'It is a coordinated exterior renovation project where Real Elite Contracting handles your roof, siding, and deck, while our partner A+ Paving & Landscaping handles your driveway and landscaping. The whole scope runs on one shared schedule, with one point of contact for you. The bundle is designed for homeowners who want to do their entire exterior in one focused 5–7 week project rather than dragging it out over multiple seasons and multiple contractors.',
  },
  {
    question: 'How much money does the bundle actually save me?',
    answer:
      'Bundling saves 5–8% versus the sum of separately quoted projects. The savings come from shared mobilization, fewer separate estimate cycles, and one consolidated permit pull rather than three. You get the discount with no quality compromise — both companies are veteran-friendly, family-operated, and licensed/insured across the tri-state.',
  },
  {
    question: 'Who is A+ Paving & Landscaping?',
    answer:
      'A+ Paving & Landscaping is a local paving and landscaping company based in Gerrardstown, WV, serving the Eastern Panhandle for residential asphalt driveways, sealcoating, parking lots, and full landscaping packages. We chose A+ as our strategic partner because their scope finishes where ours ends — and because they share our standard for clean execution.',
  },
  {
    question: 'What if I only want part of the bundle?',
    answer:
      'Totally fine. You can hire Real Elite for any combination of the building-envelope scope (roof / siding / deck / additions / kitchens / baths) without the paving and landscaping. The bundle is a convenience offering for homeowners who want everything done at once — not a requirement.',
  },
  {
    question: 'Where do you offer the Full Property Perimeter bundle?',
    answer:
      'Currently across the Eastern Panhandle of WV (Berkeley, Jefferson, and Morgan counties), Frederick and Washington counties in MD, and Loudoun, Frederick, and Clarke counties in VA. Outside that radius, contact us and we will tell you upfront whether we can take the project.',
  },
  {
    question: 'How long does the full bundle take?',
    answer:
      'A typical full-perimeter project runs 5–7 weeks from approved estimate to final walk-through, weather permitting. Building-envelope work (roof / siding / deck) is sequenced first, with driveway and landscaping closing out the scope so heavy equipment never damages finished landscaping.',
  },
];

export default function FullPropertyPerimeterPage() {
  return (
    <>
      <FAQSchema items={FAQ_ITEMS} />
      <JsonLd
        schema={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'Full Property Perimeter — Exterior Renovation Bundle',
          provider: {
            '@type': 'GeneralContractor',
            name: BUSINESS.name,
            url: BUSINESS.url,
          },
          areaServed: ['West Virginia', 'Maryland', 'Virginia'],
          description:
            'Coordinated exterior renovation covering roofing, siding, decks, asphalt driveway paving, and landscaping under one project schedule and one warranty conversation.',
        }}
      />

      {/* Hero */}
      <section className="bg-navy-900 text-white pt-16 pb-20 md:pt-24 md:pb-28 relative overflow-hidden">
        <Container size="wide">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-brand-red/15 backdrop-blur-sm border border-brand-red/40 rounded-full px-4 py-1.5 mb-6">
              <span className="text-brand-red text-xs">●</span>
              <span className="text-white text-[0.7rem] font-semibold tracking-[0.18em] uppercase">
                Real Elite × A+ Paving & Landscaping
              </span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.05] tracking-tight">
              From the roof
              <br />
              <span className="text-brand-red">to the road.</span>
            </h1>
            <p className="text-charcoal-200 text-lg md:text-xl mt-6 leading-relaxed max-w-2xl">
              The Full Property Perimeter bundle — your roof, siding, deck, driveway, and
              landscaping under one coordinated project, one schedule, and one warranty
              conversation. Built with military precision across WV, MD, and VA.
            </p>

            <div className="flex flex-wrap gap-4 mt-10">
              <a
                href="/#estimate"
                className="bg-brand-red text-white px-7 py-3.5 rounded-md font-bold text-sm hover:bg-brand-red-dark transition-colors shadow-lg shadow-navy-950/40"
              >
                Get My Bundle Estimate →
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

      {/* Partner co-brand strip */}
      <section className="bg-white border-b border-charcoal-100 py-8">
        <Container size="wide">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 text-center">
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.18em] text-charcoal-500 font-semibold mb-1">
                Building Envelope
              </p>
              <p className="font-heading text-xl md:text-2xl font-extrabold text-navy-800">
                Real Elite Contracting
              </p>
              <p className="text-charcoal-500 text-xs mt-1">
                Veteran-Owned · Martinsburg, WV
              </p>
            </div>
            <div className="text-3xl text-brand-red font-light hidden md:block">×</div>
            <div className="text-3xl text-brand-red font-light md:hidden">+</div>
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.18em] text-charcoal-500 font-semibold mb-1">
                Driveway & Landscape
              </p>
              <p className="font-heading text-xl md:text-2xl font-extrabold text-navy-800">
                A+ Paving & Landscaping
              </p>
              <p className="text-charcoal-500 text-xs mt-1">
                Family-Operated · Gerrardstown, WV
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* What's in the bundle */}
      <section className="bg-white py-16 md:py-24">
        <Container size="wide">
          <SectionHeader
            eyebrow="What's In The Bundle"
            title="Five line items. One coordinated project."
            subtitle="Each piece on its own is its own headache. Together, they're one focused 5–7 week build."
          />

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SCOPE_ITEMS.map((s) => {
              const Icon = s.icon;
              const isPaving = s.by === 'A+ Paving';
              return (
                <div
                  key={s.title}
                  className="bg-steel-50 border border-charcoal-100 rounded-lg p-7 hover:border-brand-red transition-colors"
                >
                  <div className="flex items-start justify-between mb-5">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-navy-800 text-white">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span
                      className={`text-[0.6rem] font-bold uppercase tracking-[0.15em] px-2.5 py-1 rounded-full ${
                        isPaving ? 'bg-brand-red text-white' : 'bg-navy-800 text-white'
                      }`}
                    >
                      {s.by}
                    </span>
                  </div>
                  <h3 className="font-heading text-xl font-extrabold text-navy-800 mb-3">
                    {s.title}
                  </h3>
                  <p className="text-charcoal-600 text-sm leading-relaxed">{s.body}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Why bundle */}
      <section className="bg-steel-50 py-16 md:py-24">
        <Container size="wide">
          <SectionHeader
            eyebrow="Why Bundle"
            title="Three reasons homeowners do this."
            align="center"
            className="mx-auto"
          />

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {WHY_PILLARS.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title}
                  className="bg-white border-t-4 border-brand-red rounded-lg p-7 lg:p-8 shadow-sm"
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

      {/* Timeline */}
      <section className="bg-white py-16 md:py-24">
        <Container size="wide">
          <SectionHeader
            eyebrow="How It Runs"
            title="A 5–7 week sequence — start to final walk-through."
            subtitle="Building envelope first. Driveway and landscaping close it out. No heavy equipment crossing finished work."
          />

          <div className="mt-12 max-w-3xl">
            <ol className="space-y-6">
              {TIMELINE.map((t, idx) => (
                <li key={t.step} className="flex gap-5">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-brand-red text-white flex items-center justify-center font-heading font-extrabold text-lg">
                      {idx + 1}
                    </div>
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-brand-red text-[0.65rem] uppercase tracking-[0.18em] font-bold mb-1">
                      {t.step}
                    </p>
                    <h3 className="font-heading text-lg md:text-xl font-extrabold text-navy-800 mb-2">
                      {t.title}
                    </h3>
                    <p className="text-charcoal-600 text-sm md:text-base leading-relaxed">
                      {t.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* Who it's for */}
      <section className="bg-steel-50 py-16 md:py-24">
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5">
              <p className="text-brand-red text-xs uppercase tracking-[0.18em] font-semibold mb-3">
                Best Fit
              </p>
              <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-navy-800 leading-tight">
                Is the bundle right for your property?
              </h2>
              <p className="text-charcoal-600 mt-4 text-base leading-relaxed">
                The Full Property Perimeter works best when at least three of the line items
                need real work. If only your roof is failing, the standalone roof project is the
                right call. We will tell you which fits.
              </p>
            </div>
            <div className="lg:col-span-7">
              <ul className="space-y-4">
                {[
                  'Half-acre to two-acre rural / suburban lots with a real driveway run (Eastern Panhandle, Frederick County, Loudoun County are prime).',
                  'Roof at 15+ years old and a driveway with visible cracking or sealcoat fade.',
                  'A deck that is at end-of-life and landscaping that has not been refreshed in 5+ years.',
                  'Homeowners selling within 18 months who want maximum curb-appeal lift.',
                  'New buyers wanting to do everything once and not deal with contractor coordination across multiple summers.',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-brand-red flex-shrink-0 mt-0.5" />
                    <span className="text-charcoal-700 text-base leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="bg-white py-16 md:py-24">
        <Container size="default">
          <SectionHeader
            eyebrow="Frequently Asked"
            title="The bundle, in plain English."
            align="center"
            className="mx-auto"
          />
          <div className="mt-12 max-w-3xl mx-auto space-y-3">
            {FAQ_ITEMS.map((item) => (
              <details
                key={item.question}
                className="group bg-steel-50 border border-charcoal-100 rounded-lg p-5 hover:border-brand-red transition-colors"
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

      {/* Final CTA */}
      <section className="bg-navy-900 text-white py-16 md:py-24">
        <Container size="default" className="text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-extrabold mb-6">
            One team. One standard.
            <br />
            <span className="text-brand-red">From the roof to the road.</span>
          </h2>
          <p className="text-charcoal-300 mb-8 max-w-2xl mx-auto">
            Tell us about your property — we will tell you whether the bundle is the right call,
            or whether a focused single-trade project is the smarter move.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#estimate"
              className="bg-brand-red text-white px-8 py-4 rounded-md font-bold text-sm hover:bg-brand-red-dark transition-colors shadow-md inline-flex items-center justify-center gap-2"
            >
              Get a Bundle Estimate
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <a
              href={`tel:${BUSINESS.phoneRaw}`}
              className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-md font-bold text-sm hover:bg-white/20 transition-colors inline-flex items-center justify-center gap-2"
            >
              Call {BUSINESS.phone}
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}

import type { Metadata } from 'next';
import { FEDERAL_REGISTRATION } from '@/lib/claims';
import Link from 'next/link';
import {
  Award,
  Briefcase,
  CheckCircle2,
  FileText,
  MapPin,
  Phone,
  Mail,
  Building2,
  Shield,
  ArrowUpRight,
} from 'lucide-react';
import { BUSINESS } from '@/lib/constants';
import { buildMetadata } from '@/lib/seo';
import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import JsonLd from '@/components/seo/JsonLd';
import PhoneLink from '@/components/analytics/PhoneLink';

export const metadata: Metadata = {
  ...buildMetadata({
    path: '/capability-statement',
    title: `Capability Statement | ${BUSINESS.name}`,
    description:
      'Family-run by brothers Jose and Miguel. Miguel is a U.S. military veteran.',
    keywords: [
      'capability statement',
      'Real Elite Contracting capability statement',
      'Martinsburg contractor WV',
      'federal contractor Martinsburg',
      'VA Medical Center contractor capability',
      'NAICS 236118 238160 contractor',
      'GSA Schedule contractor WV',
    ],
  }),
  description:
    'Family-run by brothers Jose and Miguel. Miguel is a U.S. military veteran.',
};

const SNAPSHOT = [
  { label: 'Legal Name', value: 'Real Elite Contracting LLC' },
  { label: 'Established', value: 'West Virginia LLC · Family-Run' },
  {
    label: 'HQ',
    value: `${BUSINESS.address.city}, ${BUSINESS.address.state} ${BUSINESS.address.zip}`,
  },
  { label: 'Service Region', value: 'WV · MD · VA Tri-State' },
  { label: 'Business Type', value: 'Family-run LLC' },
  { label: 'Who runs it', value: 'Brothers Jose and Miguel' },
  { label: 'SAM.gov Registration', value: FEDERAL_REGISTRATION.summary },
];

const NAICS_CODES = FEDERAL_REGISTRATION.naics;

const COMPETENCIES = [
  {
    title: 'Roofing & Exterior Envelope',
    body:
      'Architectural shingle replacement, full tear-offs, valley flashing, ice-and-water shield, ridge venting, soffit / fascia, gutter systems. We install GAF and Owens Corning when the job calls for them. Review product coverage and registration requirements in the proposed agreement.',
  },
  {
    title: 'Siding & Facade',
    body:
      'Vinyl, fiber cement, and stone veneer installation when the job calls for them. Weather-resistant barrier (WRB) and air-sealing detail to current code. We do not advertise a James Hardie or CertainTeed certification we do not hold.',
  },
  {
    title: 'Interior Remodeling',
    body:
      'Kitchens, bathrooms, basement finishing, whole-home renovations. Permit pulling, sub-trade coordination (electrical, plumbing, HVAC), and code compliance across WV, MD, and VA.',
  },
  {
    title: 'Decks & Outdoor Structures',
    body:
      'Composite (Trex, TimberTech, Azek) and pressure-treated decks, premium railing systems, structural piers, lighting. HOA submission handling for managed communities.',
  },
  {
    title: 'Additions & Light Construction',
    body:
      'Bump-outs, single-room additions, second-story additions, ADU build-outs. Foundation work coordinated with licensed structural engineers as required.',
  },
  {
    title: 'Facility Maintenance & Repair',
    body:
      'Recurring exterior repair, roof inspection cycles, gutter cleaning, weather-event response. Applicable to federal / VA facility maintenance and IDIQ task orders.',
  },
];

const DIFFERENTIATORS = [
  {
    title: 'Family-Run · Military Precision Process',
    body:
      "Family-run by brothers Jose and Miguel. Miguel is a U.S. military veteran. Review the proposed scope and warranty terms before signing.",
  },
  {
    title: 'Geographic Advantage — 8 Miles From Martinsburg VAMC',
    body:
      'HQ in Martinsburg, WV positions us 8 miles from the Martinsburg VA Medical Center (175 acres, 7 outpatient clinics across WV/MD/VA/PA) and within 90 minutes of Fort Detrick, Aberdeen Proving Ground, MCB Quantico, Joint Base Andrews, and the Pentagon.',
  },
  {
    title: 'AI-Native Estimating',
    body:
      'Address-based roof quoting is available on the site. The written estimate is the number to plan from.',
  },
  {
    title: 'Virginia and West Virginia licenses',
    body:
      "Insured and licensed in Virginia (Class A Home Improvement Contractor) and West Virginia (WV062432). No Maryland contractor license is claimed. Discuss site supervision, communication, and cleanup arrangements during the estimate.",
  },
];

const PAST_PERFORMANCE = [
  {
    market: 'Eastern Panhandle WV',
    scope: 'Full exterior renovations (roof + siding + deck) for residential homeowners across Martinsburg, Inwood, Charles Town, Hedgesville, and Shepherdstown',
    detail: 'Home-market work across Martinsburg, Inwood, Charles Town, Hedgesville, and Shepherdstown. We do not publish an invented completed-project count.',
  },
  {
    market: 'Frederick County MD',
    scope: 'Bathroom, kitchen, and basement remodels along the I-70 growth corridor (Frederick, Urbana, Jefferson, New Market)',
    detail: 'Bathroom, kitchen, and basement work along the I-70 corridor. Line items go in the written estimate — we do not publish invented price bands here.',
  },
  {
    market: 'Loudoun County VA',
    scope: 'Decks, outdoor living, and additions in Loudoun — western corridor first (Purcellville, Round Hill, Lovettsville, western Leesburg, selected Middleburg)',
    detail: 'County Typical Deck and Typical Finished Basement paths, town zoning first in Leesburg / Purcellville / Middleburg, HOA packets in parallel. We do not invent a completed Loudoun project count.',
  },
];

const TEAMING = [
  'Prime contractor relationships welcomed for VA, DoD, and federal civilian construction opportunities in the WV/MD/VA corridor.',
  'Open to joint-venture conversations with other small-business primes.',
  'Subcontractor teaming on facilities maintenance, exterior envelope, and small construction task orders.',
  'Capability statements, capabilities briefs, and Past Performance Questionnaires (PPQ) provided on request.',
];

export default function CapabilityStatementPage() {
  return (
    <>
      <JsonLd
        schema={{
          '@context': 'https://schema.org',
          '@type': 'GeneralContractor',
          name: BUSINESS.name,
          url: `${BUSINESS.url}/capability-statement`,
          description:
            'Family-run by brothers Jose and Miguel. Miguel is a U.S. military veteran. Capability statement for Real Elite Contracting in Martinsburg, WV.',
          areaServed: ['West Virginia', 'Maryland', 'Virginia'],
          telephone: BUSINESS.phone,
          email: BUSINESS.email,
          address: {
            '@type': 'PostalAddress',
            addressLocality: BUSINESS.address.city,
            addressRegion: BUSINESS.address.state,
            postalCode: BUSINESS.address.zip,
            addressCountry: 'US',
          },
        }}
      />

      {/* Hero */}
      <section className="bg-navy-900 text-white pt-16 pb-16 md:pt-24 md:pb-20">
        <Container size="wide">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-brand-red/15 backdrop-blur-sm border border-brand-red/40 rounded-full px-4 py-1.5 mb-6">
              <FileText className="w-3.5 h-3.5 text-brand-red-light" />
              <span className="text-white text-[0.7rem] font-semibold tracking-[0.18em] uppercase">
                Federal Capability Statement
              </span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.05] tracking-tight">
              Real Elite Contracting
              <br />
              <span className="text-brand-red-light">Capability Statement.</span>
            </h1>
            <p className="text-charcoal-200 text-lg md:text-xl mt-6 leading-relaxed max-w-2xl">
              Family-run by brothers Jose and Miguel. Miguel is a U.S. military veteran.
              Based in Martinsburg, WV. No federal veteran certification
              is held. Available for teaming conversations across WV, MD, and VA.
            </p>

            <div className="flex flex-wrap gap-3 mt-8">
              <a
                href="/contact"
                className="bg-brand-red text-white px-6 py-3 rounded-md font-bold text-sm hover:bg-brand-red-dark transition-colors shadow-lg shadow-navy-950/40"
              >
                Federal / Teaming Inquiry →
              </a>
              <a
                href={`mailto:${BUSINESS.email}?subject=Capability%20Statement%20Inquiry`}
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-md font-bold text-sm hover:bg-white/20 transition-colors inline-flex items-center gap-2"
              >
                <Mail className="w-4 h-4" /> {BUSINESS.email}
              </a>
              <PhoneLink
                location="capability_hero"
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-md font-bold text-sm hover:bg-white/20 transition-colors inline-flex items-center gap-2"
              >
                <Phone className="w-4 h-4" /> {BUSINESS.phone}
              </PhoneLink>
            </div>
          </div>
        </Container>
      </section>

      {/* Company snapshot */}
      <section className="bg-white py-14 md:py-20 border-b border-charcoal-100">
        <Container size="wide">
          <SectionHeader
            eyebrow="Company Snapshot"
            title="At a glance."
          />
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-5">
            {SNAPSHOT.map((row) => (
              <div key={row.label} className="border-l-2 border-brand-red pl-4">
                <p className="text-[0.65rem] uppercase tracking-[0.18em] text-charcoal-500 font-semibold mb-1">
                  {row.label}
                </p>
                <p className="text-navy-800 font-bold text-sm md:text-base">{row.value}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* NAICS codes */}
      <section className="bg-steel-50 py-14 md:py-20">
        <Container size="wide">
          <SectionHeader
            eyebrow="NAICS Codes"
            title="What we're coded for."
            subtitle="Primary NAICS shown first. Additional codes carried for relevant task orders and prime/sub teaming."
          />
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-3">
            {NAICS_CODES.map((n) => (
              <div
                key={n.code}
                className={`flex items-start gap-4 bg-white border ${
                  n.primary ? 'border-brand-red' : 'border-charcoal-100'
                } rounded-lg p-5`}
              >
                <div
                  className={`flex-shrink-0 inline-flex items-center justify-center w-14 h-14 rounded-md font-heading font-extrabold text-sm ${
                    n.primary ? 'bg-brand-red text-white' : 'bg-navy-800 text-white'
                  }`}
                >
                  {n.code}
                </div>
                <div className="pt-1">
                  <p className="font-bold text-navy-800 text-base">{n.label}</p>
                  {n.primary && (
                    <p className="text-brand-red text-[0.65rem] uppercase tracking-[0.18em] font-bold mt-1">
                      Primary
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Core competencies */}
      <section className="bg-white py-14 md:py-20">
        <Container size="wide">
          <SectionHeader
            eyebrow="Core Competencies"
            title="What we deliver."
          />
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {COMPETENCIES.map((c) => (
              <div
                key={c.title}
                className="bg-steel-50 border-t-4 border-brand-red rounded-lg p-7"
              >
                <Briefcase className="w-6 h-6 text-navy-800 mb-4" />
                <h3 className="font-heading text-lg font-extrabold text-navy-800 mb-3">
                  {c.title}
                </h3>
                <p className="text-charcoal-600 text-sm leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Differentiators */}
      <section className="bg-navy-900 text-white py-14 md:py-20">
        <Container size="wide">
          <SectionHeader
            eyebrow="Differentiators"
            title="Why us, specifically."
            subtitle="Beyond the badge — the operational facts that translate into project performance."
            tone="light"
          />
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-5">
            {DIFFERENTIATORS.map((d) => (
              <div
                key={d.title}
                className="bg-navy-800/50 border border-white/10 rounded-lg p-7 backdrop-blur-sm"
              >
                <Award className="w-6 h-6 text-brand-red mb-4" />
                <h3 className="font-heading text-lg md:text-xl font-extrabold text-white mb-3">
                  {d.title}
                </h3>
                <p className="text-charcoal-200 text-sm leading-relaxed">{d.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Past performance */}
      <section className="bg-white py-14 md:py-20">
        <Container size="wide">
          <SectionHeader
            eyebrow="Past Performance"
            title="Representative work."
            subtitle="Client-specific project references, photographs, and Past Performance Questionnaires (PPQ) provided on request under appropriate confidentiality."
          />
          <div className="mt-12 space-y-5">
            {PAST_PERFORMANCE.map((p) => (
              <div
                key={p.market}
                className="bg-steel-50 border-l-4 border-brand-red rounded-r-lg p-6 md:p-7"
              >
                <p className="text-brand-red text-[0.65rem] uppercase tracking-[0.18em] font-bold mb-1 flex items-center gap-2">
                  <MapPin className="w-3 h-3" /> {p.market}
                </p>
                <h3 className="font-heading text-lg md:text-xl font-extrabold text-navy-800 mb-2">
                  {p.scope}
                </h3>
                <p className="text-charcoal-600 text-sm leading-relaxed">{p.detail}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Teaming */}
      <section className="bg-steel-50 py-14 md:py-20">
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5">
              <p className="text-brand-red text-xs uppercase tracking-[0.18em] font-semibold mb-3">
                Teaming
              </p>
              <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-navy-800 leading-tight">
                How we partner.
              </h2>
              <p className="text-charcoal-600 mt-4 text-base leading-relaxed">
                We are actively building prime, sub, and JV relationships across the Mid-Atlantic
                federal corridor. If you are pursuing VA, DoD, or facilities work in the
                WV/MD/VA region, we want to hear from you.
              </p>
            </div>
            <div className="lg:col-span-7">
              <ul className="space-y-4">
                {TEAMING.map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-brand-red flex-shrink-0 mt-0.5" />
                    <span className="text-charcoal-700 text-base leading-relaxed">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* Contact card */}
      <section className="bg-white py-14 md:py-20">
        <Container size="default">
          <div className="bg-navy-900 text-white rounded-lg p-8 md:p-10 shadow-card-elevated">
            <div className="flex items-start gap-4 mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-brand-red text-white">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-heading text-2xl md:text-3xl font-extrabold">
                  Federal & Teaming Contact
                </h2>
                <p className="text-charcoal-300 text-sm mt-1">
                  Single point of contact for federal opportunities, prime/sub teaming, and
                  capability briefings.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-[0.65rem] uppercase tracking-[0.18em] text-brand-red-light font-bold mb-1">
                  Point of contact
                </p>
                <p className="font-heading text-xl font-extrabold">Jose Escobar</p>
                <p className="text-charcoal-300 text-sm">Runs Real Elite with his brother Miguel</p>
              </div>
              <div className="space-y-3">
                <PhoneLink
                  location="capability_contact"
                  className="flex items-center gap-3 text-white hover:text-brand-red-light transition-colors"
                >
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span className="font-semibold">{BUSINESS.phone}</span>
                </PhoneLink>
                <a
                  href={`mailto:${BUSINESS.email}`}
                  className="flex items-center gap-3 text-white hover:text-brand-red-light transition-colors"
                >
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span className="font-semibold">{BUSINESS.email}</span>
                </a>
                <div className="flex items-center gap-3 text-charcoal-300">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">
                    {BUSINESS.address.city}, {BUSINESS.address.state} {BUSINESS.address.zip}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center gap-4 text-[0.65rem] uppercase tracking-[0.18em] font-bold text-charcoal-300">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3 h-3 text-brand-red-light" /> Family-Run
              </span>
              <span>·</span>
              <span>VA Class A HIC · WV062432</span>
              <span>·</span>
              <span>Registered in SAM.gov</span>
            </div>
          </div>
        </Container>
      </section>

      {/* Final CTA */}
      <section className="bg-navy-900 text-white py-14 md:py-20 border-t border-white/10">
        <Container size="default" className="text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-extrabold mb-5">
            Ready to talk teaming?
          </h2>
          <p className="text-charcoal-300 mb-7 max-w-2xl mx-auto">
            Primes and contracting officers — reach out for a capability briefing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-brand-red text-white px-7 py-3.5 rounded-md font-bold text-sm hover:bg-brand-red-dark transition-colors shadow-md inline-flex items-center justify-center gap-2"
            >
              Federal / Teaming Inquiry
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              href="/veterans"
              className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-7 py-3.5 rounded-md font-bold text-sm hover:bg-white/20 transition-colors inline-flex items-center justify-center gap-2"
            >
              View Veterans Page
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}

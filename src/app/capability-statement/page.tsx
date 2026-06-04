import type { Metadata } from 'next';
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
import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import JsonLd from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: `Capability Statement | ${BUSINESS.name}`,
  description:
    'Federal capability statement for Real Elite Contracting LLC — veteran-owned general contractor in Martinsburg, WV. NAICS codes, core competencies, differentiators, and contact for federal, VA, and prime/sub teaming opportunities.',
  keywords: [
    'capability statement',
    'veteran-owned contractor capability statement',
    'SDVOSB contractor WV',
    'federal contractor Martinsburg',
    'VA Medical Center contractor capability',
    'NAICS 236118 238160 contractor',
    'GSA Schedule contractor WV',
  ],
  alternates: { canonical: `${BUSINESS.url}/capability-statement` },
  openGraph: {
    title: `Capability Statement | ${BUSINESS.name}`,
    description:
      'Veteran-owned general contractor — federal capability statement for VA, DoD, and prime/sub teaming.',
    url: `${BUSINESS.url}/capability-statement`,
    type: 'website',
  },
};

const SNAPSHOT = [
  { label: 'Legal Name', value: 'Real Elite Contracting LLC' },
  { label: 'Established', value: 'West Virginia LLC · Veteran-Owned' },
  { label: 'HQ', value: 'Martinsburg, WV 25401' },
  { label: 'Service Region', value: 'WV · MD · VA Tri-State' },
  { label: 'Business Type', value: 'Veteran-Owned Small Business' },
  { label: 'SDVOSB Status', value: 'VetCert Application In Progress' },
  { label: 'SAM.gov UEI', value: 'Available On Request' },
  { label: 'CAGE Code', value: 'In Process' },
  { label: 'DUNS', value: 'Migrated to UEI (Apr 2022)' },
  { label: 'Bonding', value: 'Available On Request' },
];

const NAICS_CODES = [
  { code: '236118', label: 'Residential Remodelers', primary: true },
  { code: '236220', label: 'Commercial & Institutional Building Construction' },
  { code: '238160', label: 'Roofing Contractors' },
  { code: '238170', label: 'Siding Contractors' },
  { code: '238190', label: 'Other Foundation, Structure & Building Exterior' },
  { code: '238210', label: 'Electrical Contractors (Subcontract)' },
  { code: '238910', label: 'Site Preparation Contractors' },
  { code: '238990', label: 'All Other Specialty Trade Contractors' },
  { code: '561730', label: 'Landscaping Services (via partner)' },
];

const COMPETENCIES = [
  {
    title: 'Roofing & Exterior Envelope',
    body:
      'Architectural shingle replacement, full tear-offs, valley flashing, ice-and-water shield, ridge venting, soffit / fascia, gutter systems. GAF Master Elite track. Manufacturer warranties registered on behalf of the owner.',
  },
  {
    title: 'Siding & Facade',
    body:
      'Vinyl, fiber cement (James Hardie experience), and stone veneer installation. Weather-resistant barrier (WRB) and air-sealing detail to current code. CertainTeed and James Hardie certification path.',
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
    title: 'Veteran-Owned · Military Precision Process',
    body:
      'Owned and led by a US military veteran. Operational discipline shows up in three places, every project: a named project lead from estimate to final walk-through, daily updates with a 24-hour response standard, and a written workmanship warranty on every line item.',
  },
  {
    title: 'Geographic Advantage — 8 Miles From Martinsburg VAMC',
    body:
      'HQ in Martinsburg, WV positions us 8 miles from the Martinsburg VA Medical Center (175 acres, 7 outpatient clinics across WV/MD/VA/PA) and within 90 minutes of Fort Detrick, Aberdeen Proving Ground, MCB Quantico, Joint Base Andrews, and the Pentagon.',
  },
  {
    title: 'AI-Native Estimating',
    body:
      'First contractor in the tri-state region to deploy AI-powered address-based roof quoting (sub-60-second ballpark estimates via Google Solar API). Internal multi-AI estimating pipeline produces line-item written estimates with documented labor and material breakdowns.',
  },
  {
    title: 'Licensed Tri-State Coverage',
    body:
      'Licensed and insured in West Virginia, Maryland, and Virginia. Same crew quality and same project lead across all three states — not a referral-handoff model.',
  },
];

const PAST_PERFORMANCE = [
  {
    market: 'Eastern Panhandle WV',
    scope: 'Full exterior renovations (roof + siding + deck) for residential homeowners across Martinsburg, Inwood, Charles Town, Hedgesville, and Shepherdstown',
    detail: '200+ projects completed across the home market. Representative project documentation available on request under NDA.',
  },
  {
    market: 'Frederick County MD',
    scope: 'Bathroom, kitchen, and basement remodels along the I-70 growth corridor (Frederick, Urbana, Jefferson, New Market)',
    detail: 'Premium tier work ($30K–$90K project range) for homeowners in the Maryland Mid-Atlantic corridor.',
  },
  {
    market: 'Loudoun County VA',
    scope: 'Premium decks, outdoor living, and full home additions in Leesburg, Ashburn, Brambleton, Lansdowne, and Cascades',
    detail: 'High-spec work for one of the highest-income counties in the United States. HOA-submission discipline.',
  },
];

const TEAMING = [
  'Prime contractor relationships welcomed for VA, DoD, and federal civilian construction opportunities in the WV/MD/VA corridor.',
  'Open to JV / Mentor-Protégé arrangements with other SDVOSBs and small business primes.',
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
            'Veteran-owned general contractor in Martinsburg, WV — federal capability statement covering NAICS codes, core competencies, differentiators, and contact for VA, DoD, and prime/sub teaming.',
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
              <FileText className="w-3.5 h-3.5 text-brand-red" />
              <span className="text-white text-[0.7rem] font-semibold tracking-[0.18em] uppercase">
                Federal Capability Statement
              </span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.05] tracking-tight">
              Real Elite Contracting
              <br />
              <span className="text-brand-red">Capability Statement.</span>
            </h1>
            <p className="text-charcoal-200 text-lg md:text-xl mt-6 leading-relaxed max-w-2xl">
              Veteran-owned general contractor based in Martinsburg, WV — 8 miles from the
              Martinsburg VA Medical Center. SDVOSB certification in progress. Available for
              federal, VA, DoD, and prime/sub teaming opportunities across WV, MD, and VA.
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
              <a
                href={`tel:${BUSINESS.phoneRaw}`}
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-md font-bold text-sm hover:bg-white/20 transition-colors inline-flex items-center gap-2"
              >
                <Phone className="w-4 h-4" /> {BUSINESS.phone}
              </a>
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
                <p className="text-[0.65rem] uppercase tracking-[0.18em] text-brand-red font-bold mb-1">
                  Owner & Point Of Contact
                </p>
                <p className="font-heading text-xl font-extrabold">Jose Escobar</p>
                <p className="text-charcoal-300 text-sm">Owner · Veteran</p>
              </div>
              <div className="space-y-3">
                <a
                  href={`tel:${BUSINESS.phoneRaw}`}
                  className="flex items-center gap-3 text-white hover:text-brand-red transition-colors"
                >
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span className="font-semibold">{BUSINESS.phone}</span>
                </a>
                <a
                  href={`mailto:${BUSINESS.email}`}
                  className="flex items-center gap-3 text-white hover:text-brand-red transition-colors"
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
                <Shield className="w-3 h-3 text-brand-red" /> Veteran-Owned
              </span>
              <span>·</span>
              <span>Licensed WV · MD · VA</span>
              <span>·</span>
              <span>SDVOSB In Progress</span>
              <span>·</span>
              <span>SAM.gov Registration</span>
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
            Federal primes, contracting officers, and SDVOSB partners — reach out for capability
            briefings, past-performance references, and bonding capacity confirmation.
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

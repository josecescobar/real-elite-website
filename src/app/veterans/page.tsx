import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ShieldCheck,
  Award,
  Building2,
  Star,
  ArrowUpRight,
  CheckCircle2,
  MapPin,
} from 'lucide-react';
import { BUSINESS } from '@/lib/constants';
import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import AssurancesBand from '@/components/home/AssurancesBand';
import JsonLd from '@/components/seo/JsonLd';
import FAQSchema from '@/components/seo/FAQSchema';

export const metadata: Metadata = {
  title: `Veteran-Owned Contractor — SDVOSB · VA · Federal | ${BUSINESS.name}`,
  description:
    'Real Elite Contracting is a veteran-owned general contractor serving WV, MD, and VA — pursuing SDVOSB certification and federal contracting opportunities at the Martinsburg VA Medical Center, Fort Detrick, Aberdeen, Quantico, and the Pentagon.',
  keywords: [
    'veteran-owned contractor WV',
    'SDVOSB roofing contractor',
    'veteran roofer Martinsburg',
    'VA Medical Center contractor',
    'service-disabled veteran-owned',
    'military precision contractor',
    'federal contracting WV MD VA',
    'HUBZone contractor Martinsburg',
  ],
  alternates: { canonical: `${BUSINESS.url}/veterans` },
  openGraph: {
    title: `Veteran-Owned Contractor | ${BUSINESS.name}`,
    description:
      'Military Precision. Civilian Excellence. Veteran-owned contracting across WV, MD, and VA — with the discipline federal and VA work demands.',
    url: `${BUSINESS.url}/veterans`,
    type: 'website',
  },
};

const PILLARS = [
  {
    icon: ShieldCheck,
    eyebrow: 'Discipline',
    title: 'Veteran-Owned & Operated',
    body:
      'Owned and led by a veteran. Every crew lead carries the same standards we carried in uniform — accountability, time discipline, and finishing what we start.',
  },
  {
    icon: Award,
    eyebrow: 'Federal Track',
    title: 'SDVOSB Certification In Progress',
    body:
      'We are pursuing Service-Disabled Veteran-Owned Small Business (SDVOSB) certification through SBA VetCert — unlocking VA, DoD, and federal set-aside work for residential, light commercial, and facilities contracts.',
  },
  {
    icon: Building2,
    eyebrow: 'Geographic Edge',
    title: '8 Miles From The Martinsburg VAMC',
    body:
      'Our home market is the Eastern Panhandle of West Virginia — minutes from the Martinsburg VA Medical Center and within 90 minutes of Fort Detrick, Aberdeen Proving Ground, Quantico, and Joint Base Andrews.',
  },
];

const CERT_TRACKS = [
  {
    name: 'SDVOSB',
    full: 'Service-Disabled Veteran-Owned Small Business',
    status: 'Application In Progress',
    body:
      'SBA VetCert verifies veteran ownership and control. SDVOSBs are eligible for federal set-aside and sole-source contracts up to $5M at the Department of Veterans Affairs and $4.5M across other agencies.',
  },
  {
    name: 'SAM.gov',
    full: 'System for Award Management Registration',
    status: 'Active',
    body:
      'Real Elite is registered in the federal contracting system, the prerequisite for bidding on any federal opportunity and for prime/sub team-ups on larger projects.',
  },
  {
    name: 'GAF Master Elite',
    full: 'Top 2% Roofing Contractor Designation',
    status: 'Application In Progress',
    body:
      'Master Elite is GAF\'s top contractor tier — fewer than 2% of US roofers qualify. Pairs with our veteran-owned status for the highest-trust roofing offer in the Eastern Panhandle.',
  },
  {
    name: 'State Preferences',
    full: 'WV §5A-3-37 · MD VSBE · VA SDV / SWaM',
    status: 'On The Roadmap',
    body:
      'West Virginia resident-vendor + veteran preference (up to 5% bid edge), Maryland Veteran-Owned Small Business Enterprise (3% target), Virginia Service-Disabled Veteran designation — all free, all open new procurement lanes.',
  },
];

const FEDERAL_TARGETS = [
  {
    location: 'Martinsburg, WV',
    site: 'Martinsburg VA Medical Center',
    distance: '8 miles from HQ',
    body:
      '175 acres, 2,200+ employees, 7 outpatient clinics across WV/MD/VA/PA. Statutory SDVOSB priority with $5M sole-source authority per contract.',
  },
  {
    location: 'Frederick, MD',
    site: 'Fort Detrick',
    distance: '35 minutes',
    body:
      'Medical and biological research installation. Recurring facility maintenance, roofing, and renovation set-asides.',
  },
  {
    location: 'Aberdeen, MD',
    site: 'Aberdeen Proving Ground',
    distance: '90 minutes',
    body:
      'Major Army installation with continuous facilities, family-housing, and small-construction opportunities.',
  },
  {
    location: 'Quantico, VA',
    site: 'Marine Corps Base Quantico',
    distance: '90 minutes',
    body:
      'USMC and FBI Academy footprint with regular DoD facility and infrastructure contracts.',
  },
];

const FAQ_ITEMS = [
  {
    question: 'Is Real Elite Contracting really veteran-owned?',
    answer:
      'Yes. Real Elite Contracting LLC is owned and led by Jose Escobar, a US military veteran. Our brand promise — "Military Precision. Civilian Excellence." — is grounded in the standards of service.',
  },
  {
    question: 'What is SDVOSB and why does it matter?',
    answer:
      'SDVOSB stands for Service-Disabled Veteran-Owned Small Business. It is a federal certification administered by the SBA through VetCert that allows qualifying veteran-owned firms to compete for set-aside and sole-source federal contracts. At the Department of Veterans Affairs, SDVOSBs receive first priority, with sole-source authority up to $5 million per contract. SDVOSB status also signals discipline, ownership integrity, and federal accountability — values residential customers value too.',
  },
  {
    question: 'Do I need to be a federal customer to hire Real Elite?',
    answer:
      'No. The vast majority of our work is residential — roofing, siding, decks, remodeling, kitchens, baths, and exterior repairs for homeowners across the Eastern Panhandle of WV, Frederick County MD, and Loudoun County VA. The federal track is a parallel growth lane, not a requirement for working with us.',
  },
  {
    question: 'Which veteran certifications and designations does Real Elite hold?',
    answer:
      'Real Elite is veteran-owned in fact and is actively pursuing SDVOSB certification through SBA VetCert. We are registered in SAM.gov for federal contracting. We are also pursuing GAF Master Elite roofer status — the top 2% tier of US roofers — to pair with our veteran-owned identity.',
  },
  {
    question: 'How does "Military Precision" actually show up in our project?',
    answer:
      'Three places, every project: (1) a named project lead from estimate through final walk-through — no handoffs; (2) daily updates and a 24-hour response standard while we work; (3) a clean job site every day and a written workmanship warranty backing the result. The discipline shows up in the schedule, the cleanup, and the follow-through.',
  },
  {
    question: 'How can other veteran-owned contractors partner with Real Elite?',
    answer:
      'We are open to JV and teaming arrangements with other veteran-owned firms — particularly on Martinsburg VAMC and Mid-Atlantic federal opportunities. Reach out via our contact form with capability statement and SAM.gov UEI for a teaming conversation.',
  },
];

const govEntitySchema = {
  '@context': 'https://schema.org',
  '@type': 'GeneralContractor',
  name: BUSINESS.name,
  url: `${BUSINESS.url}/veterans`,
  description:
    'Veteran-owned general contractor based in Martinsburg, WV serving the WV/MD/VA tri-state. Pursuing SDVOSB federal certification.',
  founder: {
    '@type': 'Person',
    name: 'Jose Escobar',
    jobTitle: 'Owner & Veteran',
  },
  award: 'Veteran-Owned · SDVOSB Application In Progress',
  areaServed: ['West Virginia', 'Maryland', 'Virginia'],
};

export default function VeteransPage() {
  return (
    <>
      <JsonLd schema={govEntitySchema} />
      <FAQSchema items={FAQ_ITEMS} />

      {/* Hero */}
      <section className="bg-navy-900 text-white pt-16 pb-20 md:pt-24 md:pb-28">
        <Container size="wide">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-brand-red/15 backdrop-blur-sm border border-brand-red/40 rounded-full px-4 py-1.5 mb-6">
              <Star className="w-3 h-3 text-brand-red" />
              <span className="text-white text-[0.7rem] font-semibold tracking-[0.18em] uppercase">
                Military Precision · Civilian Excellence
              </span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.05] tracking-tight">
              The discipline of a unit.
              <br />
              <span className="text-brand-red">The craftsmanship of a custom shop.</span>
            </h1>
            <p className="text-charcoal-200 text-lg md:text-xl mt-6 leading-relaxed max-w-2xl">
              Real Elite Contracting is a veteran-owned general contractor headquartered in
              Martinsburg, WV — 8 miles from the Martinsburg VA Medical Center. We bring military
              standards of accountability, time discipline, and finish quality to every roof,
              kitchen, deck, and addition we build across WV, MD, and VA.
            </p>

            <div className="flex flex-wrap gap-4 mt-10">
              <Link
                href="/#estimate"
                className="bg-brand-red text-white px-7 py-3.5 rounded-md font-bold text-sm hover:bg-brand-red-dark transition-colors shadow-lg shadow-navy-950/40"
              >
                Get My Free Estimate →
              </Link>
              <a
                href="/contact"
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-7 py-3.5 rounded-md font-bold text-sm hover:bg-white/20 transition-colors"
              >
                Federal / Teaming Inquiry
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* Three Pillars */}
      <section className="bg-white py-16 md:py-24">
        <Container size="wide">
          <SectionHeader
            eyebrow="Why Veteran-Owned Matters Here"
            title="Three things you get with a veteran-led contractor."
            subtitle="Beyond the badge — the operating standards that come with the identity."
            align="center"
            className="mx-auto"
          />

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {PILLARS.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title}
                  className="bg-steel-50 border-t-4 border-brand-red rounded-lg p-7 lg:p-8 shadow-sm"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-navy-800 text-white mb-5">
                    <Icon className="w-6 h-6" />
                  </div>
                  <p className="text-brand-red-light text-[0.65rem] uppercase tracking-[0.18em] font-bold mb-2">
                    {p.eyebrow}
                  </p>
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

      {/* Certification Tracks */}
      <section className="bg-steel-50 py-16 md:py-24">
        <Container size="wide">
          <SectionHeader
            eyebrow="Certifications & Designations"
            title="Where we are on the credential roadmap."
            subtitle="We publish our certification status so customers and federal partners always know exactly where we stand."
          />

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-5">
            {CERT_TRACKS.map((c) => (
              <div
                key={c.name}
                className="bg-white border border-charcoal-100 rounded-lg p-7 hover:border-brand-red transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="font-heading text-xl font-extrabold text-navy-800">
                      {c.name}
                    </h3>
                    <p className="text-charcoal-500 text-xs uppercase tracking-[0.12em] font-semibold mt-1">
                      {c.full}
                    </p>
                  </div>
                  <span
                    className={`flex-shrink-0 text-[0.6rem] font-bold uppercase tracking-[0.15em] px-2.5 py-1 rounded-full ${
                      c.status === 'Active'
                        ? 'bg-brand-red text-white'
                        : 'bg-navy-800 text-white'
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
                <p className="text-charcoal-600 text-sm leading-relaxed mt-3">{c.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Federal Targets */}
      <section className="bg-white py-16 md:py-24">
        <Container size="wide">
          <SectionHeader
            eyebrow="Federal Footprint"
            title="The installations within reach."
            subtitle="Our home market is the Eastern Panhandle — but the federal demand sits right next door."
          />

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-5">
            {FEDERAL_TARGETS.map((t) => (
              <div
                key={t.site}
                className="bg-navy-900 text-white rounded-lg p-7 lg:p-8 shadow-card-elevated"
              >
                <div className="flex items-center gap-2 text-brand-red-light text-[0.65rem] uppercase tracking-[0.18em] font-bold mb-2">
                  <MapPin className="w-3.5 h-3.5" />
                  {t.location} · {t.distance}
                </div>
                <h3 className="font-heading text-xl md:text-2xl font-extrabold mb-3">
                  {t.site}
                </h3>
                <p className="text-charcoal-200 text-sm leading-relaxed">{t.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* What this means for homeowners */}
      <section className="bg-steel-50 py-16 md:py-24">
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5">
              <p className="text-brand-red text-xs uppercase tracking-[0.18em] font-semibold mb-3">
                For Homeowners
              </p>
              <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-navy-800 leading-tight">
                What military precision actually looks like on your project.
              </h2>
            </div>
            <div className="lg:col-span-7">
              <ul className="space-y-4">
                {[
                  'A named project lead from estimate to final walk-through — never bounced between phone numbers.',
                  'Daily updates while crews are on site. Job-site cleanup is non-negotiable.',
                  '24-hour response standard. If you call, text, or email, you hear back the same business day.',
                  'Written workmanship warranty on every project, every time. Manufacturer warranties stacked on top.',
                  'Licensed and insured across West Virginia, Maryland, and Virginia.',
                  'A digital quote experience that respects your time — including a 60-second AI roof quote for ballpark numbers before any sales conversation.',
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
            title="Veteran-owned, in plain English."
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
            <span className="text-brand-red">Military precision, every project.</span>
          </h2>
          <p className="text-charcoal-300 mb-8 max-w-2xl mx-auto">
            Residential homeowner, federal prime, or veteran-owned partner — get in touch.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#estimate"
              className="bg-brand-red text-white px-8 py-4 rounded-md font-bold text-sm hover:bg-brand-red-dark transition-colors shadow-md inline-flex items-center justify-center gap-2"
            >
              Get a Free Estimate
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

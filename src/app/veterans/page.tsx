import type { Metadata } from 'next';
import { FEDERAL_REGISTRATION } from '@/lib/claims';
import { buildMetadata, fitTitle } from '@/lib/seo';
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
import PhoneLink from '@/components/analytics/PhoneLink';

export const metadata: Metadata = {
  ...buildMetadata({
    path: '/veterans',
    title: `Family-Run Contractor | ${BUSINESS.name}`,
    description:
      'Family-run by brothers Jose and Miguel. Miguel is a U.S. military veteran and Purple Heart recipient. Remodeling across WV, MD, and VA.',
    keywords: [
      'family-run contractor WV',
      'Martinsburg remodeling contractor',
      'Purple Heart',
      'military precision contractor',
      'Loudoun design-build contractor',
    ],
  }),
  title: fitTitle(`Family-Run Contractor — WV · VA | ${BUSINESS.name}`),
  description:
    'Family-run by brothers Jose and Miguel. Miguel is a U.S. military veteran and Purple Heart recipient. Serving WV, MD, and VA.',
};

const PILLARS = [
  {
    icon: ShieldCheck,
    eyebrow: 'Who runs it',
    title: 'Two brothers',
    body:
      'Family-run by brothers Jose and Miguel. Miguel is a U.S. military veteran and Purple Heart recipient. The ownership split is not published, and the company does not hold a federal veteran certification.',
  },
  {
    icon: Award,
    eyebrow: 'Registration',
    title: 'Registered in SAM.gov',
    body:
      `${FEDERAL_REGISTRATION.summary}. That registration is not a veteran certification and does not expand the state licenses.`,
  },
  {
    icon: Building2,
    eyebrow: 'Home base',
    title: 'Based in Martinsburg, WV',
    body:
      'Based in the Eastern Panhandle of West Virginia, with a residential remodeling focus in Loudoun County and surrounding service areas.',
  },
];

const CERT_TRACKS = [
  {
    name: 'SAM.gov',
    full: 'System for Award Management Registration',
    status: 'Registered',
    body: `${FEDERAL_REGISTRATION.summary}. Primary NAICS: 236220. Additional NAICS: 238160, 238320, 238330, 238990, 236118. Registration does not establish a veteran certification or expand state license specialties.`,
  },
  {
    name: 'West Virginia',
    full: 'WV Contractor License WV062432',
    status: 'Active',
    body: 'State contractor license for work in West Virginia. This is a trade license, not a veteran certification.',
  },
  {
    name: 'Virginia',
    full: 'Class A Contractor 2705198604 (HIC)',
    status: 'Active',
    body: 'Virginia Class A, specialty HIC, residential. No Virginia veteran-program designation is claimed.',
  },
];

const FEDERAL_TARGETS = [
  {
    location: 'Martinsburg, WV',
    site: 'Martinsburg VA Medical Center',
    distance: '8 miles from HQ',
    body:
      '175 acres and 7 outpatient clinics across WV, MD, VA, and PA. Proximity is a fact about the drive. It is not a set-aside or a certification.',
  },
  {
    location: 'Frederick, MD',
    site: 'Fort Detrick',
    distance: '35 minutes',
    body:
      'Medical and biological research installation, about 35 minutes from Martinsburg.',
  },
  {
    location: 'Aberdeen, MD',
    site: 'Aberdeen Proving Ground',
    distance: '90 minutes',
    body:
      'A large installation about 90 minutes from Martinsburg.',
  },
  {
    location: 'Quantico, VA',
    site: 'Marine Corps Base Quantico',
    distance: '90 minutes',
    body:
      'About 90 minutes from Martinsburg.',
  },
];

const FAQ_ITEMS = [
  {
    question: 'Who runs Real Elite Contracting?',
    answer:
      'Family-run by brothers Jose and Miguel. Miguel is a U.S. military veteran and Purple Heart recipient. The motto — "Military Precision. Civilian Excellence." — is how we talk about the standard of the work.',
  },
  {
    question: 'Does Real Elite hold a federal veteran certification?',
    answer:
      `No. ${FEDERAL_REGISTRATION.summary}. Registration is not a veteran certification. No branch of service is stated.`,
  },
  {
    question: 'Do I need to be a federal customer to hire Real Elite?',
    answer:
      'No. Most of the work is residential — roofing, siding, decks, remodeling, kitchens, baths, and exterior repairs for homeowners across the Eastern Panhandle of WV, Frederick County MD, and Loudoun County VA.',
  },
  {
    question: 'Which licenses does Real Elite hold?',
    answer:
      `WV Contractor License WV062432 and Virginia Class A Contractor 2705198604 (HIC). ${FEDERAL_REGISTRATION.summary}. No Maryland contractor license is claimed.`,
  },
  {
    question: 'How does "Military Precision" actually show up in our project?',
    answer:
      'Review the proposed scope and warranty terms before signing. The discipline shows up in the schedule, the cleanup, and the follow-through.',
  },
  {
    question: 'How can another contractor partner with Real Elite?',
    answer:
      'Reach out through the contact form with a capability statement and a SAM.gov UEI if you have one. Teaming is a conversation, not a certification claim.',
  },
];

const govEntitySchema = {
  '@context': 'https://schema.org',
  '@type': 'GeneralContractor',
  name: BUSINESS.name,
  url: `${BUSINESS.url}/veterans`,
  description:
    'Family-run by brothers Jose and Miguel. Miguel is a U.S. military veteran and Purple Heart recipient. Based in Martinsburg, WV, serving WV, MD, and VA.',
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
              Family-run by brothers Jose and Miguel. Miguel is a U.S. military veteran and
              Purple Heart recipient. Real Elite Contracting is headquartered in Martinsburg, WV,
              and builds roofs, kitchens, decks, and additions across WV, MD, and VA.
            </p>

            <div className="flex flex-wrap gap-4 mt-10">
              <Link
                href="/contact#estimate"
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
            eyebrow="Who runs Real Elite"
            title="Two brothers. One standard of work."
            subtitle="Family-run by brothers Jose and Miguel. Miguel is a U.S. military veteran and Purple Heart recipient."
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
            eyebrow="What is on file"
            title="Licenses and registration, stated exactly."
            subtitle="These are the credentials Real Elite actually holds. A federal veteran certification is not one of them."
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
            eyebrow="Nearby"
            title="Installations within a short drive."
            subtitle="Distance from Martinsburg. Not a claim of eligibility for any set-aside."
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
                  'Family-run by brothers Jose and Miguel. Miguel is a U.S. military veteran and Purple Heart recipient.',
                  'Discuss the project scope, communication, and site arrangements before work begins.',
                  'Review license, insurance, and warranty documentation for the proposed work.',
                  'WV Contractor License WV062432 · Virginia Class A Contractor 2705198604 (HIC).',
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
            title="In plain English."
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
            Homeowner or teaming inquiry — get in touch.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact#estimate"
              className="bg-brand-red text-white px-8 py-4 rounded-md font-bold text-sm hover:bg-brand-red-dark transition-colors shadow-md inline-flex items-center justify-center gap-2"
            >
              Get a Free Estimate
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <PhoneLink
              location="veterans_cta"
              className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-md font-bold text-sm hover:bg-white/20 transition-colors inline-flex items-center justify-center gap-2"
            >
              Call {BUSINESS.phone}
            </PhoneLink>
          </div>
        </Container>
      </section>
    </>
  );
}

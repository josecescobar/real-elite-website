import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, MapPin, CheckCircle2, Phone } from 'lucide-react';

import { BUSINESS } from '@/lib/constants';
import { PAVING_ICONS, PAVING_SERVICES, PAVING_LOCATIONS } from '@/lib/paving-data';
import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import MultiStepEstimateForm from '@/components/shared/MultiStepEstimateForm';
import AssurancesBand from '@/components/home/AssurancesBand';
import JsonLd from '@/components/seo/JsonLd';
import FAQSchema from '@/components/seo/FAQSchema';
import { buildBreadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: `Paving Contractor — Asphalt, Driveways & Sealcoating | ${BUSINESS.name}`,
  description:
    'Veteran-owned paving across WV, MD & VA — asphalt paving, driveways, parking lots, sealcoating, asphalt repair, and commercial paving. Proper base, real drainage, accountable crews. Free estimate.',
  keywords: [
    'paving contractor WV',
    'asphalt paving Eastern Panhandle',
    'driveway paving near me',
    'sealcoating WV MD VA',
    'commercial paving Martinsburg',
    'parking lot paving',
  ],
  alternates: { canonical: `${BUSINESS.url}/paving` },
  openGraph: {
    title: `Paving Contractor — WV, MD & VA | ${BUSINESS.name}`,
    description:
      'Asphalt paving, driveways, parking lots, sealcoating, and repair across the Eastern Panhandle and Mid-Atlantic. Veteran-owned. Built with military precision.',
    url: `${BUSINESS.url}/paving`,
    type: 'website',
  },
};

const HUB_FAQS = [
  {
    question: 'What paving services does Real Elite offer?',
    answer:
      'We offer asphalt paving, residential driveway paving, commercial parking lot paving, sealcoating, asphalt repair (potholes, cracks, patching, and resurfacing), and full commercial paving. We handle new installations, replacements, gravel-to-asphalt conversions, and maintenance across WV, MD, and VA.',
  },
  {
    question: 'What areas do you serve for paving?',
    answer:
      'We pave across the Eastern Panhandle of West Virginia (Martinsburg, Inwood, Spring Mills, Hedgesville, Falling Waters, Charles Town, Shepherdstown), the Northern Shenandoah Valley in Virginia (Winchester), and the Cumberland Valley and I-70 corridor in Maryland (Hagerstown, Frederick). We are headquartered in Martinsburg and licensed in all three states.',
  },
  {
    question: 'Is paving really part of a remodeling and roofing company?',
    answer:
      'Yes. Real Elite Contracting delivers paving in partnership with A+ Paving & Landscaping, which lets us cover the full exterior of a property — roof, siding, deck, driveway, and landscaping. You get one accountable point of contact, and if you are doing multiple exterior projects you can bundle them under our Full Property Perimeter package.',
  },
  {
    question: 'How much does paving cost?',
    answer:
      'Residential asphalt runs roughly $4–$7 per square foot installed, so a typical Eastern Panhandle driveway lands around $4,000–$10,000. Sealcoating a driveway is often $300–$600. Commercial lots and repairs are quoted by scope. You always get an exact written price after a free on-site measure.',
  },
  {
    question: 'When is the paving season in the Mid-Atlantic?',
    answer:
      'Asphalt paving runs roughly April through October, when temperatures let hot-mix compact properly; sealcoating runs roughly May through October. We schedule around the weather to make sure the surface is installed and cured correctly. Reach out any time of year to get on the schedule.',
  },
];

export default function PavingHubPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', item: BUSINESS.url },
    { name: 'Paving', item: `${BUSINESS.url}/paving` },
  ]);

  return (
    <>
      <JsonLd schema={breadcrumbSchema} />
      <JsonLd
        schema={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          serviceType: 'Asphalt Paving',
          provider: {
            '@type': 'GeneralContractor',
            name: BUSINESS.name,
            url: BUSINESS.url,
            telephone: BUSINESS.phone,
          },
          areaServed: ['West Virginia', 'Maryland', 'Virginia'],
          description:
            'Asphalt paving, driveways, parking lots, sealcoating, asphalt repair, and commercial paving across the Eastern Panhandle and Mid-Atlantic.',
        }}
      />
      <FAQSchema items={HUB_FAQS} />

      {/* Hero */}
      <section className="bg-navy-900 text-white pt-16 pb-20 md:pt-24 md:pb-28">
        <Container size="wide">
          <div className="max-w-3xl">
            <p className="text-brand-red text-xs uppercase tracking-[0.18em] font-semibold mb-4">
              Paving · WV · MD · VA
            </p>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.05] tracking-tight">
              Paving done
              <br />
              <span className="text-brand-red">from the ground up.</span>
            </h1>
            <p className="text-charcoal-200 text-lg md:text-xl mt-6 leading-relaxed max-w-2xl">
              Asphalt paving, driveways, parking lots, sealcoating, and repair across the Eastern
              Panhandle and Mid-Atlantic. The smooth surface everyone sees only lasts as long as the
              base underneath — and the base is where we do our most disciplined work.
            </p>

            <div className="flex flex-wrap gap-4 mt-10">
              <a
                href="#estimate"
                className="bg-brand-red text-white px-7 py-3.5 rounded-md font-bold text-sm hover:bg-brand-red-dark transition-colors shadow-lg shadow-navy-950/40"
              >
                Get My Free Estimate →
              </a>
              <a
                href={`tel:${BUSINESS.phoneRaw}`}
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-7 py-3.5 rounded-md font-bold text-sm hover:bg-white/20 transition-colors inline-flex items-center gap-2"
              >
                <Phone className="w-4 h-4" /> {BUSINESS.phone}
              </a>
            </div>

            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-10 text-xs font-semibold uppercase tracking-[0.18em] text-charcoal-200">
              <li>Veteran-Owned</li>
              <li aria-hidden="true" className="text-white/30">·</li>
              <li>Licensed WV · MD · VA</li>
              <li aria-hidden="true" className="text-white/30">·</li>
              <li className="text-brand-red">Proper Base &amp; Drainage</li>
            </ul>
          </div>
        </Container>
      </section>

      {/* Services */}
      <section className="bg-white py-16 md:py-24">
        <Container size="wide">
          <SectionHeader
            eyebrow="Paving Services"
            title="Six services, one accountable contractor."
            subtitle="From a fresh residential driveway to a phased commercial lot — all built on proper base prep and real drainage."
          />
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PAVING_SERVICES.map((s) => {
              const Icon = PAVING_ICONS[s.iconKey];
              return (
                <Link
                  key={s.slug}
                  href={`/paving/${s.slug}`}
                  className="group bg-steel-50 border border-charcoal-100 rounded-lg p-7 hover:border-brand-red hover:shadow-md transition-all"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-navy-800 text-white mb-5 group-hover:bg-brand-red transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h2 className="font-heading text-xl font-extrabold text-navy-800 group-hover:text-brand-red transition-colors flex items-center gap-1.5">
                    {s.name} <ArrowUpRight className="w-4 h-4" />
                  </h2>
                  <p className="text-charcoal-600 text-sm leading-relaxed mt-2">{s.hero.sub}</p>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Locations */}
      <section className="bg-steel-50 py-16 md:py-24">
        <Container size="wide">
          <SectionHeader
            eyebrow="Where We Pave"
            title="Local paving across the tri-state."
            subtitle="Headquartered in Martinsburg, serving the Eastern Panhandle, Northern Shenandoah Valley, and Cumberland Valley."
          />
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {PAVING_LOCATIONS.map((loc) => (
              <Link
                key={loc.slug}
                href={`/paving/locations/${loc.slug}`}
                className="group bg-white border border-charcoal-100 rounded-lg p-5 hover:border-brand-red hover:shadow-md transition-all"
              >
                <MapPin className="w-4 h-4 text-brand-red mb-2" aria-hidden="true" />
                <p className="font-heading font-bold text-navy-800 text-sm group-hover:text-brand-red transition-colors leading-tight">
                  {loc.city}, {loc.state}
                </p>
                <p className="text-charcoal-500 text-xs mt-1">{loc.county}</p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Why us */}
      <section className="bg-white py-16 md:py-24">
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5">
              <p className="text-brand-red text-xs uppercase tracking-[0.18em] font-semibold mb-3">
                The Difference
              </p>
              <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-navy-800 leading-tight">
                Why our asphalt outlasts the cheap quote.
              </h2>
              <p className="text-charcoal-600 mt-4 text-base leading-relaxed">
                Anyone can spray a thin top coat that looks great for a season. We build paving that
                lasts — and we tell you the truth about repair versus replacement instead of selling
                you the bigger job.
              </p>
              <Link
                href="/full-property-perimeter"
                className="inline-flex items-center gap-2 mt-6 text-navy-800 font-semibold hover:text-brand-red transition-colors"
              >
                See the Full Property Perimeter bundle <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="lg:col-span-7">
              <ul className="space-y-4">
                {[
                  'Proper base prep and drainage-first grading — the part that actually determines lifespan.',
                  'Hot-mix asphalt placed and compacted to the right thickness for your actual use.',
                  'Cracks filled before sealcoating, always — never sealed over to hide a problem.',
                  'Honest repair-vs-replace advice from a contractor who has to live in this community.',
                  'Veteran-owned, with one named point of contact from estimate to final walk-through.',
                  'Licensed and insured across West Virginia, Maryland, and Virginia.',
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

      {/* Estimate form */}
      <section id="estimate" className="bg-steel-50 py-16 md:py-24 scroll-mt-24">
        <Container size="default">
          <SectionHeader
            eyebrow="Free Paving Estimate"
            title="Tell us about your project."
            subtitle={`Pre-set to paving so your request reaches the right crew. A project lead follows up within 24 business hours — or call ${BUSINESS.phone}.`}
            align="center"
            className="mx-auto"
          />
          <div className="mt-10 max-w-2xl mx-auto">
            <MultiStepEstimateForm initialService="paving" />
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="bg-white py-16 md:py-24">
        <Container size="default">
          <SectionHeader
            eyebrow="Frequently Asked"
            title="Paving, in plain English."
            align="center"
            className="mx-auto"
          />
          <div className="mt-12 max-w-3xl mx-auto space-y-3">
            {HUB_FAQS.map((item) => (
              <details
                key={item.question}
                className="group bg-steel-50 border border-charcoal-100 rounded-lg p-5 hover:border-brand-red transition-colors"
              >
                <summary className="cursor-pointer list-none flex items-start justify-between gap-4">
                  <span className="font-heading text-base md:text-lg font-bold text-navy-800">{item.question}</span>
                  <span className="text-brand-red font-bold text-xl leading-none group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-charcoal-700 text-sm md:text-base leading-relaxed mt-4">{item.answer}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      <AssurancesBand />
    </>
  );
}

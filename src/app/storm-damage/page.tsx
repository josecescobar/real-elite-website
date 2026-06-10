import type { Metadata } from 'next';
import {
  AlertTriangle,
  ShieldCheck,
  Camera,
  FileText,
  ClipboardCheck,
  Clock,
  Phone,
  ArrowUpRight,
  CheckCircle2,
} from 'lucide-react';
import { BUSINESS } from '@/lib/constants';
import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import AssurancesBand from '@/components/home/AssurancesBand';
import MultiStepEstimateForm from '@/components/shared/MultiStepEstimateForm';
import JsonLd from '@/components/seo/JsonLd';
import FAQSchema from '@/components/seo/FAQSchema';

export const metadata: Metadata = {
  title: `Storm Damage Roof Inspection (Free) — WV / MD / VA | ${BUSINESS.name}`,
  description:
    'Free post-storm roof inspection from a veteran-owned local roofer. Hail and wind damage documented for your insurance carrier. Same-week appointments across the Eastern Panhandle WV, Frederick MD, and Loudoun VA.',
  keywords: [
    'storm damage roof inspection',
    'hail damage roofer WV',
    'wind damage roof Frederick MD',
    'insurance roof claim help',
    'free storm roof inspection Martinsburg',
    'roof repair after storm Eastern Panhandle',
    'veteran-owned storm roofer',
    'emergency tarping WV MD VA',
  ],
  alternates: { canonical: `${BUSINESS.url}/storm-damage` },
  openGraph: {
    title: `Storm Damage Roof Inspection — Free | ${BUSINESS.name}`,
    description:
      'Hail and wind damage documented for your insurance carrier. Veteran-owned, licensed in WV / MD / VA.',
    url: `${BUSINESS.url}/storm-damage`,
    type: 'website',
  },
};

const WHAT_WE_CHECK = [
  {
    icon: AlertTriangle,
    title: 'Hail Bruising & Granule Loss',
    body:
      'Quarter-sized hail or larger bruises asphalt shingles in a way the homeowner cannot always see from the ground. We document every slope.',
  },
  {
    icon: AlertTriangle,
    title: 'Wind-Lifted & Missing Shingles',
    body:
      'Sustained gusts above 58 mph routinely break shingle seals. We photograph any lift, creasing, or outright missing tabs.',
  },
  {
    icon: AlertTriangle,
    title: 'Flashing, Vents, Valleys',
    body:
      'The places water actually gets in. Damaged ridge vents, bent step flashing, and cracked pipe boots are the leaks no one finds for six months.',
  },
  {
    icon: AlertTriangle,
    title: 'Decking & Interior Water Signs',
    body:
      'Soft decking, attic moisture, and visible ceiling stains — the symptoms that decide whether this is a repair, a partial replacement, or a full one.',
  },
];

const PROCESS = [
  {
    icon: Phone,
    step: '1',
    title: 'Call or book online',
    body:
      `One call to ${BUSINESS.phone} or one form on this page. We schedule a free inspection — usually same-week in the Eastern Panhandle.`,
  },
  {
    icon: Camera,
    step: '2',
    title: 'We document everything',
    body:
      'Roof walk, drone overheads, slope-by-slope photo log, attic check. Every photo is geo-tagged and date-stamped for your carrier.',
  },
  {
    icon: FileText,
    step: '3',
    title: 'Written damage report',
    body:
      "You get a plain-language damage report you can hand to your insurance adjuster. We don't promise claim outcomes — but we make sure nothing legitimate gets missed.",
  },
  {
    icon: ClipboardCheck,
    step: '4',
    title: 'Coordinated repair / replacement',
    body:
      'If a claim is approved, we coordinate scope, scheduling, and final inspection. Workmanship warranty on every project. Manufacturer warranties registered on your behalf.',
  },
];

const INSURANCE_DOCS = [
  'Address-level satellite imagery and pre-existing roof condition baseline',
  'Slope-by-slope photo documentation with timestamps and GPS metadata',
  'Hail-impact photo log with reference scale (chalk circles or ruler)',
  'Wind-damage photo log: lifted, creased, or missing shingles',
  'Flashing, ridge vent, and pipe-boot condition record',
  'Interior attic photos for any visible water intrusion',
  'Written narrative damage report you can include with your claim',
  'Scope-of-work estimate aligned to Xactimate line items where applicable',
];

const FAQ_ITEMS = [
  {
    question: 'How fast can you inspect my roof after a storm?',
    answer:
      `For confirmed storms in the Eastern Panhandle WV, Frederick County MD, or Loudoun County VA service area, we typically schedule a free inspection within the same week — often within 48 business hours. For active leaks or emergency tarping needs, call ${BUSINESS.phone} immediately and we will prioritize.`,
  },
  {
    question: 'Do you work directly with my insurance carrier?',
    answer:
      'Yes. We provide written damage documentation, slope-by-slope photo logs, and a scope-of-work estimate that aligns with Xactimate line items so your adjuster has what they need. We do not promise a specific claim outcome — that is the adjuster\'s decision — but we make sure legitimate damage is documented thoroughly.',
  },
  {
    question: 'Is the inspection really free?',
    answer:
      'Yes. No charge, no obligation, no pressure. You get a written report whether you decide to file a claim with us, file with another contractor, or do nothing at all. We earn the work by being honest, not by trapping homeowners into commitments.',
  },
  {
    question: 'What if my roof has no damage?',
    answer:
      'We tell you that, in writing, on the same report. Not every storm causes claim-worthy damage, and not every roof needs replacement. If your roof is in good shape, you walk away with peace of mind and a baseline document for the next storm.',
  },
  {
    question: 'How long do I have to file an insurance claim after a storm?',
    answer:
      'Most homeowner policies require notice within one year of the storm event, but many specify shorter windows — sometimes 60 or 90 days. Check your policy or call your carrier. The longer you wait, the harder it is to prove damage came from a specific storm rather than wear-and-tear, which is why same-week inspection matters.',
  },
  {
    question: 'Are you licensed and insured in WV, MD, and VA?',
    answer:
      'Yes. Real Elite Contracting is licensed and insured in West Virginia, Maryland, and Virginia. Veteran-owned and operated. Workmanship warranty on every project.',
  },
  {
    question: 'What about emergency tarping or temporary repairs?',
    answer:
      `For active leaks, partially missing roofs, or anything that exposes the interior to weather, call ${BUSINESS.phone} immediately. We coordinate emergency tarping and temporary repairs to prevent further damage while the claim process moves forward.`,
  },
];

export default function StormDamagePage() {
  return (
    <>
      <FAQSchema items={FAQ_ITEMS} />
      <JsonLd
        schema={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'Free Storm Damage Roof Inspection',
          provider: {
            '@type': 'GeneralContractor',
            name: BUSINESS.name,
            url: BUSINESS.url,
          },
          areaServed: ['West Virginia', 'Maryland', 'Virginia'],
          description:
            'Free post-storm roof inspection with written damage documentation for insurance carriers. Hail, wind, and ice damage assessment across the tri-state Mid-Atlantic.',
        }}
      />

      {/* Hero — emergency-tone */}
      <section className="bg-navy-900 text-white pt-16 pb-20 md:pt-24 md:pb-28 relative overflow-hidden">
        <Container size="wide">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-brand-red/15 backdrop-blur-sm border border-brand-red/40 rounded-full px-4 py-1.5 mb-6">
              <AlertTriangle className="w-3.5 h-3.5 text-brand-red-light" />
              <span className="text-white text-[0.7rem] font-semibold tracking-[0.18em] uppercase">
                Free Storm Inspection · 24-Hour Response
              </span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.05] tracking-tight">
              Storm hit your roof?
              <br />
              <span className="text-brand-red">We document it. Free.</span>
            </h1>
            <p className="text-charcoal-200 text-lg md:text-xl mt-6 leading-relaxed max-w-2xl">
              Hail and wind damage often isn&apos;t visible from the ground. Get a free, written
              roof inspection from a veteran-owned local roofer — documented slope-by-slope for
              your insurance carrier. Licensed in WV, MD, and VA.
            </p>

            <div className="flex flex-wrap gap-4 mt-10">
              <a
                href="#estimate"
                className="bg-brand-red text-white px-7 py-3.5 rounded-md font-bold text-sm hover:bg-brand-red-dark transition-colors shadow-lg shadow-navy-950/40"
              >
                Book Free Inspection →
              </a>
              <a
                href={`tel:${BUSINESS.phoneRaw}`}
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-7 py-3.5 rounded-md font-bold text-sm hover:bg-white/20 transition-colors inline-flex items-center gap-2"
              >
                <Phone className="w-4 h-4" /> Active Leak? Call {BUSINESS.phone}
              </a>
            </div>

            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-10 text-xs font-semibold uppercase tracking-[0.18em] text-charcoal-200">
              <li>Veteran-Owned</li>
              <li aria-hidden="true" className="text-white/30">·</li>
              <li>Licensed WV · MD · VA</li>
              <li aria-hidden="true" className="text-white/30">·</li>
              <li>Insurance-Friendly</li>
              <li aria-hidden="true" className="text-white/30">·</li>
              <li className="text-brand-red-light">Same-Week Inspections</li>
            </ul>
          </div>
        </Container>
      </section>

      {/* What we check */}
      <section className="bg-white py-16 md:py-24">
        <Container size="wide">
          <SectionHeader
            eyebrow="What We Look For"
            title="The damage homeowners can't see from the ground."
            subtitle="Storms leave fingerprints. We photograph every one and document them in a format your insurance adjuster understands."
          />
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {WHAT_WE_CHECK.map((c) => {
              const Icon = c.icon;
              return (
                <div
                  key={c.title}
                  className="bg-steel-50 border-t-4 border-brand-red rounded-lg p-7 hover:shadow-md transition-shadow"
                >
                  <Icon className="w-6 h-6 text-navy-800 mb-4" />
                  <h3 className="font-heading text-lg font-extrabold text-navy-800 mb-3">
                    {c.title}
                  </h3>
                  <p className="text-charcoal-600 text-sm leading-relaxed">{c.body}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Process — 4 step */}
      <section className="bg-steel-50 py-16 md:py-24">
        <Container size="wide">
          <SectionHeader
            eyebrow="How It Works"
            title="Four steps. No pressure."
          />
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {PROCESS.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title}
                  className="bg-white border border-charcoal-100 rounded-lg p-7"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-full bg-brand-red text-white flex items-center justify-center font-heading font-extrabold">
                      {p.step}
                    </div>
                    <Icon className="w-5 h-5 text-navy-800" />
                  </div>
                  <h3 className="font-heading text-lg font-extrabold text-navy-800 mb-3">
                    {p.title}
                  </h3>
                  <p className="text-charcoal-600 text-sm leading-relaxed">{p.body}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* What we document for your carrier */}
      <section className="bg-white py-16 md:py-24">
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5">
              <p className="text-brand-red-light text-xs uppercase tracking-[0.18em] font-semibold mb-3">
                For Your Insurance Carrier
              </p>
              <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-navy-800 leading-tight">
                What we document, every inspection.
              </h2>
              <p className="text-charcoal-600 mt-4 text-base leading-relaxed">
                A complete claim package is the difference between a denied claim and an approved
                one. Here is what your adjuster receives, in writing, after every Real Elite
                inspection.
              </p>
              <p className="text-charcoal-500 mt-4 text-sm leading-relaxed italic">
                Note: we never promise a specific claim outcome — that is your carrier&apos;s
                decision. We make sure legitimate damage is documented thoroughly.
              </p>
            </div>
            <div className="lg:col-span-7">
              <ul className="space-y-4">
                {INSURANCE_DOCS.map((item) => (
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

      {/* Urgency / claim window */}
      <section className="bg-navy-900 text-white py-14 md:py-20">
        <Container size="default" className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-brand-red text-white mb-6">
            <Clock className="w-7 h-7" />
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-extrabold mb-5">
            Your claim window is shorter than you think.
          </h2>
          <p className="text-charcoal-200 text-lg max-w-2xl mx-auto leading-relaxed">
            Most homeowner policies allow 1 year from the storm event to file a claim — but many
            specify <span className="text-white font-bold">60 to 90 days</span>. The longer you
            wait, the harder it is to prove damage came from a specific storm rather than
            wear-and-tear. Same-week inspection protects your claim.
          </p>
        </Container>
      </section>

      {/* Embedded storm-aware estimate form */}
      <section id="estimate" className="bg-steel-50 py-16 md:py-24 scroll-mt-24">
        <Container size="default">
          <SectionHeader
            eyebrow="Book Your Free Inspection"
            title="Tell us about the storm damage."
            subtitle={`Pre-set to storm damage so your request reaches us with the right urgency. A project lead follows up within 24 business hours — or call ${BUSINESS.phone} for an active leak.`}
            align="center"
            className="mx-auto"
          />
          <div className="mt-10 max-w-2xl mx-auto">
            <MultiStepEstimateForm initialService="storm-damage" />
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="bg-white py-16 md:py-24">
        <Container size="default">
          <SectionHeader
            eyebrow="Frequently Asked"
            title="Storm response, in plain English."
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
          <ShieldCheck className="w-12 h-12 text-brand-red mx-auto mb-6" />
          <h2 className="font-heading text-3xl md:text-4xl font-extrabold mb-6">
            Veteran-owned. Insurance-friendly.
            <br />
            <span className="text-brand-red">Free storm inspection.</span>
          </h2>
          <p className="text-charcoal-300 mb-8 max-w-2xl mx-auto">
            Same-week appointments across Martinsburg, Frederick, Winchester, Hagerstown,
            Leesburg, and the surrounding tri-state.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#estimate"
              className="bg-brand-red text-white px-8 py-4 rounded-md font-bold text-sm hover:bg-brand-red-dark transition-colors shadow-md inline-flex items-center justify-center gap-2"
            >
              Book Free Inspection
              <ArrowUpRight className="w-4 h-4" />
            </a>
            <a
              href={`tel:${BUSINESS.phoneRaw}`}
              className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-md font-bold text-sm hover:bg-white/20 transition-colors inline-flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" /> Call {BUSINESS.phone}
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}

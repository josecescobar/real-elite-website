import type { Metadata } from 'next';
import Link from 'next/link';
import { Phone, MessageSquare, Mail, MapPin, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { BUSINESS } from '@/lib/constants';
import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import MultiStepEstimateForm from '@/components/shared/MultiStepEstimateForm';
import AssurancesBand from '@/components/home/AssurancesBand';

/**
 * SMS link with a prefilled greeting so the customer's text app opens
 * ready to send. iOS and Android both honor the `?&body=` parameter.
 */
const SMS_URL = `sms:${BUSINESS.phoneRaw}?&body=${encodeURIComponent(
  "Hi, I'd like a free estimate from Real Elite Contracting."
)}`;

export const metadata: Metadata = {
  title: `Contact | ${BUSINESS.name}`,
  description:
    'Contact Real Elite Contracting — call, email, or request a free written estimate. Veteran-owned premium contractor serving the WV–MD–VA region.',
  keywords: [
    'contact Real Elite Contracting',
    'free estimate contractor',
    'WV contractor contact',
    'Eastern Panhandle contractor',
    'Frederick MD contractor contact',
    'Winchester VA contractor contact',
  ],
  alternates: { canonical: `${BUSINESS.url}/contact` },
  openGraph: {
    title: `Contact | ${BUSINESS.name}`,
    description:
      'Call, email, or request a free written estimate from Real Elite Contracting.',
    url: `${BUSINESS.url}/contact`,
    type: 'website',
  },
};

const CONTACT_BLOCKS = [
  {
    icon: Phone,
    label: 'Call',
    primary: BUSINESS.phone,
    href: `tel:${BUSINESS.phoneRaw}`,
    sub: "Real person, no call center. If I don't pick up, leave a voicemail and I'll call you back the same day.",
  },
  {
    icon: MessageSquare,
    label: 'Text',
    primary: BUSINESS.phone,
    href: SMS_URL,
    sub: 'Same number — texts often get the fastest reply.',
  },
  {
    icon: Mail,
    label: 'Email',
    primary: BUSINESS.email,
    href: `mailto:${BUSINESS.email}`,
    sub: 'Replies within 24 business hours.',
  },
  {
    icon: MapPin,
    label: 'Location',
    primary: `${BUSINESS.address.city}, ${BUSINESS.address.state} ${BUSINESS.address.zip}`,
    sub: `Serving ${BUSINESS.address.region} + WV/MD/VA`,
  },
  {
    icon: Clock,
    label: 'Hours',
    primary: BUSINESS.hours,
    sub: 'Estimates by appointment.',
  },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy-900 text-white pt-16 pb-20 md:pt-24 md:pb-28">
        <Container size="wide">
          <div className="max-w-3xl">
            <p className="text-brand-red text-xs uppercase tracking-[0.18em] font-semibold mb-4">
              Contact
            </p>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.05] tracking-tight">
              Talk to a real
              <br />
              <span className="text-brand-red">project lead.</span>
            </h1>
            <p className="text-charcoal-200 text-lg md:text-xl mt-6 leading-relaxed max-w-2xl">
              Call, text, email, or fill out the form — whichever is easiest. A real
              project lead reaches out within 24 business hours, no high-pressure sales calls.
            </p>
          </div>
        </Container>
      </section>

      {/* Contact blocks + form */}
      <section className="bg-white py-16 md:py-24">
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            {/* Left: contact methods */}
            <div className="lg:col-span-5 space-y-7">
              <SectionHeader eyebrow="Reach Us" title="How to get in touch." />
              <div className="space-y-6 mt-2">
                {CONTACT_BLOCKS.map((b) => {
                  const Icon = b.icon;
                  const wrapper = b.href ? (
                    <a
                      href={b.href}
                      className="text-navy-800 font-semibold text-base md:text-lg hover:text-brand-red transition-colors break-words"
                    >
                      {b.primary}
                    </a>
                  ) : (
                    <span className="text-navy-800 font-semibold text-base md:text-lg break-words">
                      {b.primary}
                    </span>
                  );
                  return (
                    <div key={b.label} className="flex gap-4">
                      <div className="flex items-center justify-center h-11 w-11 rounded-md bg-brand-red/10 flex-shrink-0">
                        <Icon className="h-5 w-5 text-brand-red" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-[0.65rem] uppercase tracking-[0.18em] font-semibold text-charcoal-500 mb-1">
                          {b.label}
                        </p>
                        {wrapper}
                        <p className="text-charcoal-500 text-xs mt-1">{b.sub}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-6 border-t border-charcoal-200">
                <p className="text-xs uppercase tracking-[0.15em] font-semibold text-charcoal-500 mb-3">
                  Prefer to talk?
                </p>
                <p className="text-sm text-charcoal-700 leading-relaxed">
                  Call <a href={`tel:${BUSINESS.phoneRaw}`} className="text-navy-800 hover:text-brand-red font-semibold underline transition-colors">{BUSINESS.phone}</a> and a real person picks up. If I miss you, leave a voicemail — I&apos;ll get back to you the same day.
                </p>
                <p className="text-sm text-charcoal-700 leading-relaxed mt-3">
                  You can also <a href={SMS_URL} className="text-navy-800 hover:text-brand-red font-semibold underline transition-colors">text the same number</a> — quick texts usually get the fastest reply.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-4">
                <span className="inline-flex items-center gap-1.5 bg-steel-50 border border-charcoal-100 rounded-md px-3 py-1.5 text-xs font-semibold text-navy-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-red" />
                  Licensed &amp; Insured
                </span>
                <span className="inline-flex items-center bg-steel-50 border border-charcoal-100 rounded-md px-3 py-1.5 text-xs font-semibold text-navy-800">
                  Veteran-Owned
                </span>
                <span className="inline-flex items-center bg-steel-50 border border-charcoal-100 rounded-md px-3 py-1.5 text-xs font-semibold text-navy-800">
                  WV · MD · VA
                </span>
              </div>
            </div>

            {/* Right: multi-step estimate form */}
            <div className="lg:col-span-7" id="estimate">
              <MultiStepEstimateForm />
            </div>
          </div>
        </Container>
      </section>

      {/* Map */}
      <section className="bg-steel-50 py-16 md:py-24">
        <Container size="wide">
          <SectionHeader
            eyebrow="Where We Work"
            title="Headquartered in Martinsburg, WV."
            subtitle="Active across the Eastern Panhandle, Frederick County MD, the Northern Shenandoah Valley, and Loudoun County VA."
          />
          <div className="rounded-lg h-96 overflow-hidden shadow-card-elevated mt-10">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d98304.34812693078!2d-77.93!3d39.46!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89b9a1e3b4c72f93%3A0x7c4e54e76f7d6b4e!2sMartinsburg%2C%20WV!5e0!3m2!1sen!2sus!4v1711000000000!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Real Elite Contracting — Martinsburg, WV service area"
            />
          </div>
        </Container>
      </section>

      {/* Assurances */}
      <AssurancesBand />

      {/* Final CTA */}
      <section className="bg-navy-900 text-white py-16 md:py-24">
        <Container size="default" className="text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-extrabold mb-5">
            Skip the back-and-forth.
          </h2>
          <p className="text-charcoal-300 mb-8 max-w-2xl mx-auto">
            The multi-step form above takes about 60 seconds and gets your project to a real
            lead. The phone number works too.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#estimate"
              className="inline-flex items-center justify-center gap-2 bg-brand-red text-white px-8 py-4 rounded-md font-bold text-sm hover:bg-brand-red-dark transition-colors shadow-lg shadow-navy-950/40"
            >
              Get My Free Estimate
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={`tel:${BUSINESS.phoneRaw}`}
              className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-md font-bold text-sm hover:bg-white/20 transition-colors"
            >
              Call {BUSINESS.phone}
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}

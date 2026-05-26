import Link from 'next/link';
import { Handshake, MapPin, Hammer, ArrowRight } from 'lucide-react';
import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';

const PARTNER_SERVICES = [
  'Asphalt driveways & sealcoating',
  'Concrete pads, walkways & curbs',
  'Hardscaping — patios & retaining walls',
  'Commercial parking lots',
];

const BUNDLE_INCLUDES = [
  { label: 'Roof', detail: 'Architectural shingle replacement by Real Elite.' },
  { label: 'Siding', detail: 'Vinyl, fiber cement, or stone veneer by Real Elite.' },
  { label: 'Driveway', detail: 'Fresh asphalt or concrete by A+ Paving.' },
];

export default function PartnershipBand() {
  return (
    <section className="bg-steel-50 py-20 md:py-28 border-t border-charcoal-100">
      <Container size="wide">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left — pitch */}
          <div className="lg:col-span-7">
            <SectionHeader
              eyebrow="Strategic Partnership"
              title="Roof, siding, deck — and a fresh driveway."
              subtitle="We partnered with A+ Paving & Landscaping so you can bid your entire exterior as one project. One coalition, one timeline, one standard — instead of three contractors blaming each other."
            />

            <div className="mt-10 rounded-lg border border-charcoal-200 bg-white p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-5">
                <span className="inline-flex w-9 h-9 items-center justify-center rounded-md bg-brand-red text-white">
                  <Handshake className="w-5 h-5" />
                </span>
                <p className="font-heading text-lg font-extrabold uppercase tracking-[0.12em] text-navy-800">
                  The Full Property Perimeter Bundle
                </p>
              </div>

              <ul className="space-y-4">
                {BUNDLE_INCLUDES.map((item) => (
                  <li key={item.label} className="flex items-start gap-4">
                    <span className="flex-shrink-0 mt-0.5 inline-flex items-center justify-center w-6 h-6 rounded-sm bg-navy-800 text-white text-[0.65rem] font-bold uppercase tracking-wide">
                      ✓
                    </span>
                    <div>
                      <p className="text-sm font-bold uppercase tracking-[0.12em] text-navy-800">
                        {item.label}
                      </p>
                      <p className="text-sm text-charcoal-600 leading-relaxed mt-1">
                        {item.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <Link
                href="/full-property-perimeter"
                className="mt-7 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-brand-red hover:text-brand-red-dark transition-colors"
              >
                See the Full Property Perimeter
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right — partner card */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="bg-navy-900 text-white rounded-lg p-7 lg:p-8 shadow-card-elevated">
              <p className="text-[0.65rem] uppercase tracking-[0.18em] font-semibold text-brand-red mb-2">
                Our Partner
              </p>
              <h3 className="font-heading text-2xl md:text-3xl font-extrabold leading-tight mb-4">
                A+ Paving &amp; Landscaping
              </h3>
              <p className="text-charcoal-200 text-sm leading-relaxed mb-6">
                The Eastern Panhandle&apos;s premier paving and hardscaping crew —
                known for clean asphalt work, concrete pads, curved entries, and
                commercial parking lots across WV and PA.
              </p>

              <div className="flex items-start gap-3 mb-5 pb-5 border-b border-navy-700">
                <MapPin className="w-4 h-4 text-brand-red flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs uppercase tracking-[0.12em] font-semibold text-charcoal-400">
                    Based In
                  </p>
                  <p className="text-sm text-white mt-1">
                    Gerrardstown, WV · serving WV &amp; PA
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Hammer className="w-4 h-4 text-brand-red flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs uppercase tracking-[0.12em] font-semibold text-charcoal-400 mb-2">
                    Core Services
                  </p>
                  <ul className="space-y-1.5">
                    {PARTNER_SERVICES.map((service) => (
                      <li key={service} className="text-sm text-charcoal-200 leading-snug">
                        · {service}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <p className="mt-5 text-xs text-charcoal-500 leading-relaxed">
              Bundled bids are quoted jointly and managed under a single project
              lead. You only sign off when both crews are clear.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

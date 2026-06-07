import Link from 'next/link';
import { ArrowUpRight, Calendar, Clock, ShieldCheck } from 'lucide-react';
import { BUSINESS } from '@/lib/constants';

/**
 * Right-rail block shown on luxury market pages (the McLean / Great Falls /
 * Vienna / Old Town / Middleburg etc. service-area and service-city deep-link
 * pages). Swaps the standard multi-step estimate form for a refined,
 * confidence-building CTA that routes high-ticket inquiries to the dedicated
 * /design-consultation intake.
 *
 * Why a separate component, not just a different form: the visual register
 * for a $300k buyer needs to feel curated, not transactional. A clean card
 * with the value proposition + a single high-intent CTA outperforms a long
 * estimate form on this audience.
 */
type Props = {
  /**
   * Optional project type to pre-select when the visitor lands on the
   * consultation page (set on service-city combo pages so a Bathroom →
   * McLean visitor lands with "Primary Bath / Suite" already filled).
   */
  initialProjectType?: 'kitchen' | 'bathroom' | 'basement' | 'whole-home' | 'addition';
};

export default function LuxuryConsultationRail({ initialProjectType }: Props) {
  const consultationHref = initialProjectType
    ? `/design-consultation?type=${initialProjectType}`
    : '/design-consultation';

  return (
    <aside aria-label="Design consultation" className="lg:sticky lg:top-24" id="estimate">
      <div className="bg-navy-900 text-white rounded-lg p-7 lg:p-8 shadow-card-elevated">
        <p className="text-brand-red text-[0.65rem] uppercase tracking-[0.18em] font-bold mb-3">
          For Premium Projects
        </p>
        <h3 className="font-heading text-2xl lg:text-3xl font-extrabold leading-tight mb-3">
          Schedule a Phone Consultation
        </h3>
        <p className="text-charcoal-200 text-sm leading-relaxed mb-7">
          A 20–30 minute call about the project, the vision, and the fit. Pick a window, we
          call you inside it — no pressure, no obligation.
        </p>

        <ul className="space-y-3 mb-7">
          <li className="flex items-start gap-3 text-sm">
            <Clock className="w-4 h-4 text-brand-red flex-shrink-0 mt-0.5" />
            <span className="text-charcoal-200">
              <span className="text-white font-semibold">4-hour response</span> to qualified
              inquiries
            </span>
          </li>
          <li className="flex items-start gap-3 text-sm">
            <Calendar className="w-4 h-4 text-brand-red flex-shrink-0 mt-0.5" />
            <span className="text-charcoal-200">
              <span className="text-white font-semibold">No in-home visit</span> until the brief
              and budget are right
            </span>
          </li>
          <li className="flex items-start gap-3 text-sm">
            <ShieldCheck className="w-4 h-4 text-brand-red flex-shrink-0 mt-0.5" />
            <span className="text-charcoal-200">
              <span className="text-white font-semibold">Discreet, professional</span> — designer
              and architect collaboration welcomed
            </span>
          </li>
        </ul>

        <Link
          href={consultationHref}
          className="block w-full text-center bg-brand-red text-white px-6 py-3.5 rounded-md font-bold text-sm hover:bg-brand-red-dark transition-colors shadow-lg shadow-navy-950/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900 focus-visible:ring-brand-red"
        >
          Request a Call →
        </Link>

        <div className="mt-5 pt-5 border-t border-white/10 text-center">
          <p className="text-[0.65rem] uppercase tracking-[0.15em] text-charcoal-300 font-semibold mb-2">
            Or speak directly
          </p>
          <a
            href={`tel:${BUSINESS.phoneRaw}`}
            className="inline-flex items-center gap-1.5 text-white font-bold hover:text-brand-red transition-colors"
          >
            {BUSINESS.phone}
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </aside>
  );
}

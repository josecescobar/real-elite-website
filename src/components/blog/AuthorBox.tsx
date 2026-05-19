import Image from 'next/image';
import { ShieldCheck } from 'lucide-react';

/**
 * Author box anchoring the veteran-owner positioning.
 * Uses the logo as the visual until a real owner portrait is added
 * to /public/images/team/owner.jpg.
 */
type Props = {
  authorName: string;
};

export default function AuthorBox({ authorName }: Props) {
  return (
    <aside className="mt-12 bg-steel-50 border-t-4 border-brand-red rounded-lg p-6 sm:p-7 flex items-start gap-5">
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-white shadow-sm flex-shrink-0">
        <Image
          src="/images/logo.png"
          alt={authorName}
          fill
          sizes="80px"
          className="object-contain p-2"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[0.65rem] uppercase tracking-[0.18em] font-semibold text-brand-red mb-1">
          About the author
        </p>
        <h3 className="font-heading text-lg sm:text-xl font-extrabold text-navy-800 mb-2">
          {authorName}
        </h3>
        <p className="text-charcoal-600 text-sm leading-relaxed">
          Veteran-owned and operated. Real Elite Contracting builds premium remodels and
          high-end exteriors across the Eastern Panhandle WV, Frederick MD, Winchester VA,
          and Loudoun County markets. Articles on this site are written by the same crew
          that runs the projects — no marketing fluff.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.65rem] uppercase tracking-[0.15em] font-semibold text-charcoal-500">
          <span className="inline-flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-red" />
            Licensed &amp; Insured
          </span>
          <span>Veteran-Owned</span>
          <span>WV · MD · VA</span>
        </div>
      </div>
    </aside>
  );
}

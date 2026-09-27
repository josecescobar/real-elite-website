import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { INVESTMENT_GUIDE, INVESTMENT_DISCLAIMER } from '@/lib/investment-guide';

type Props = {
  /** Link each row to its section on /investment (default) or to the service page. */
  linkTo?: 'guide' | 'service';
  className?: string;
};

/**
 * The typical-ranges table, shared by the homepage and /investment so the
 * numbers are published once. Rows are links; the disclaimer travels with it.
 */
export default function InvestmentSummary({ linkTo = 'guide', className = '' }: Props) {
  return (
    <div className={className}>
      <ul className="divide-y divide-steel-200 border-y border-steel-200">
        {INVESTMENT_GUIDE.map((cat) => {
          const href = linkTo === 'guide' ? `/investment#${cat.slug}` : cat.href;
          return (
            <li key={cat.slug}>
              <Link
                href={href}
                className="group grid grid-cols-12 items-baseline gap-x-4 py-5 md:py-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-400 rounded-sm"
              >
                <span className="col-span-7 md:col-span-5 font-heading text-xl md:text-2xl text-navy-800 group-hover:text-brand-red transition-colors leading-tight">
                  {cat.title}
                </span>
                <span className="col-span-5 md:col-span-3 text-right md:text-left text-sm md:text-base text-charcoal-700 tabular-nums">
                  {cat.from ? (
                    <>
                      <span className="text-charcoal-500 text-xs uppercase tracking-[0.14em] mr-2">
                        From
                      </span>
                      {cat.from}
                    </>
                  ) : (
                    <span className="text-charcoal-500">Scoped after design</span>
                  )}
                </span>
                <span className="hidden md:block md:col-span-3 text-sm text-charcoal-500 tabular-nums">
                  Typically {cat.typical}
                </span>
                <span className="hidden md:flex md:col-span-1 justify-end text-charcoal-300 group-hover:text-brand-red transition-colors">
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      <p className="text-charcoal-500 text-xs leading-relaxed mt-5 max-w-2xl">{INVESTMENT_DISCLAIMER}</p>
    </div>
  );
}

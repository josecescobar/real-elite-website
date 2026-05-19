import type { InvestmentTier } from '@/lib/services-data';

type Props = {
  startingAt: string;
  tiers: readonly InvestmentTier[] | InvestmentTier[];
  note?: string;
};

export default function InvestmentRanges({ startingAt, tiers, note }: Props) {
  return (
    <section className="bg-steel-50 rounded-lg border-t-4 border-brand-red p-7 md:p-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-7">
        <div>
          <p className="text-brand-red text-xs uppercase tracking-[0.18em] font-semibold mb-2">
            Typical Investment
          </p>
          <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-navy-800">
            Starting at <span className="text-brand-red">{startingAt}</span>
          </h2>
        </div>
        <p className="text-charcoal-500 text-xs uppercase tracking-[0.12em] font-semibold">
          Free, written, line-itemed estimate
        </p>
      </div>

      <ul className="divide-y divide-charcoal-200">
        {tiers.map((tier) => (
          <li
            key={tier.tier}
            className="py-4 grid grid-cols-1 sm:grid-cols-12 gap-2 items-baseline"
          >
            <span className="font-heading sm:col-span-3 text-navy-800 font-bold text-base md:text-lg">
              {tier.tier}
            </span>
            <span className="sm:col-span-3 text-navy-800 font-semibold">
              {tier.range}
            </span>
            {tier.notes && (
              <span className="sm:col-span-6 text-charcoal-600 text-sm">
                {tier.notes}
              </span>
            )}
          </li>
        ))}
      </ul>

      {note && (
        <p className="text-charcoal-500 text-xs mt-6 leading-relaxed">{note}</p>
      )}
    </section>
  );
}

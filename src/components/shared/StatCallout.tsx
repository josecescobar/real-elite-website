import React from 'react';

type StatCalloutProps = {
  value: string;
  label: string;
  tone?: 'dark' | 'light';
  align?: 'left' | 'center';
};

export default function StatCallout({ value, label, tone = 'dark', align = 'left' }: StatCalloutProps) {
  const valueColor = tone === 'light' ? 'text-brand-red' : 'text-brand-red';
  const labelColor = tone === 'light' ? 'text-charcoal-300' : 'text-charcoal-600';
  const alignment = align === 'center' ? 'text-center' : 'text-left';

  return (
    <div className={alignment}>
      <div className={`font-heading ${valueColor} text-4xl sm:text-5xl font-extrabold tracking-tight leading-none`}>
        {value}
      </div>
      <div className={`${labelColor} text-xs sm:text-sm uppercase tracking-[0.15em] font-semibold mt-2`}>
        {label}
      </div>
    </div>
  );
}

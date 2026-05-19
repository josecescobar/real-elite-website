import React from 'react';

type PullQuoteProps = {
  children: React.ReactNode;
  attribution?: string;
  tone?: 'dark' | 'light';
};

export default function PullQuote({ children, attribution, tone = 'dark' }: PullQuoteProps) {
  const text = tone === 'light' ? 'text-white' : 'text-navy-800';
  const accent = 'text-brand-red';

  return (
    <blockquote className="my-10 border-l-4 border-brand-red pl-6 sm:pl-8">
      <p className={`font-heading ${text} text-2xl sm:text-3xl leading-tight font-bold`}>
        <span className={accent}>“</span>
        {children}
        <span className={accent}>”</span>
      </p>
      {attribution && (
        <footer className="mt-3 text-sm uppercase tracking-[0.15em] text-charcoal-500 font-semibold">
          — {attribution}
        </footer>
      )}
    </blockquote>
  );
}

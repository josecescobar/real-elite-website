import React from 'react';

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  tone?: 'dark' | 'light';
  className?: string;
};

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  tone = 'dark',
  className = '',
}: SectionHeaderProps) {
  const alignment = align === 'center' ? 'text-center mx-auto' : 'text-left';
  const eyebrowColor = tone === 'light' ? 'text-brand-red' : 'text-brand-red';
  const titleColor = tone === 'light' ? 'text-white' : 'text-navy-800';
  const subtitleColor = tone === 'light' ? 'text-charcoal-300' : 'text-charcoal-500';

  return (
    <div className={`${alignment} ${className} max-w-3xl`}>
      {eyebrow && (
        <p className={`${eyebrowColor} font-semibold text-xs uppercase tracking-[0.18em] mb-3`}>
          {eyebrow}
        </p>
      )}
      <h2 className={`font-heading ${titleColor} font-extrabold text-3xl sm:text-4xl md:text-5xl leading-[1.05] tracking-tight`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`${subtitleColor} text-base sm:text-lg mt-4 leading-relaxed`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

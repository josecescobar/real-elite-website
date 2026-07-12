'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

type Props = {
  href: string;
  location: string;
  offer?: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
};

export default function CampaignLink({
  href,
  location,
  offer,
  children,
  variant = 'primary',
  className = '',
}: Props) {
  const styles =
    variant === 'primary'
      ? 'bg-brand-red text-white hover:bg-brand-red-dark focus-visible:ring-brand-red'
      : 'border border-white/30 bg-white/10 text-white hover:bg-white/20 focus-visible:ring-white';

  return (
    <Link
      href={href}
      onClick={() =>
        trackEvent('premium_campaign_cta_click', {
          location,
          offer,
        })
      }
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-md px-6 py-3 font-bold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${styles} ${className}`}
    >
      {children}
      <ArrowRight aria-hidden="true" className="h-4 w-4" />
    </Link>
  );
}


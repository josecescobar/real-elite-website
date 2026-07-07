'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { BUSINESS } from '@/lib/constants';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-navy-900 flex flex-col items-center justify-center px-6 text-center">
      <Link href="/" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red rounded-sm">
        <Image
          src="/images/logo.png"
          alt="Real Elite Contracting Logo"
          width={96}
          height={96}
          className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-8"
        />
      </Link>

      <h1 className="font-heading text-white font-extrabold text-3xl md:text-4xl mb-4">
        Something went wrong.
      </h1>

      <p className="text-charcoal-300 text-lg max-w-md mb-10">
        We hit a snag loading this page. It&apos;s on us — try again, or head back to the
        homepage.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex items-center justify-center gap-2 bg-brand-red text-white font-bold text-sm px-8 py-4 rounded-md hover:bg-brand-red-dark transition-colors shadow-lg shadow-navy-950/40"
        >
          Try Again
          <RotateCcw className="w-4 h-4" />
        </button>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold text-sm px-8 py-4 rounded-md hover:bg-white/20 transition-colors"
        >
          Back to Homepage
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <p className="text-charcoal-500 text-sm mt-12">
        Need help now?{' '}
        <a
          href={`tel:${BUSINESS.phoneRaw}`}
          className="text-charcoal-300 hover:text-white transition-colors"
        >
          {BUSINESS.phone}
        </a>
        {' · '}
        <a
          href={`mailto:${BUSINESS.email}`}
          className="text-charcoal-300 hover:text-white transition-colors"
        >
          {BUSINESS.email}
        </a>
      </p>
    </div>
  );
}

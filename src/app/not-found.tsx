import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { BUSINESS } from '@/lib/constants';

export default function NotFound() {
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

      <p className="text-brand-red font-heading font-extrabold text-8xl md:text-9xl leading-none mb-4 tracking-tight">
        404
      </p>

      <h1 className="font-heading text-white font-extrabold text-3xl md:text-4xl mb-4">
        Page not found.
      </h1>

      <p className="text-charcoal-300 text-lg max-w-md mb-10">
        Looks like this page got misplaced on the job site. Let&apos;s get you back on track.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 bg-brand-red text-white font-bold text-sm px-8 py-4 rounded-md hover:bg-brand-red-dark transition-colors shadow-lg shadow-navy-950/40"
        >
          Back to Homepage
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/#estimate"
          className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold text-sm px-8 py-4 rounded-md hover:bg-white/20 transition-colors"
        >
          Get a Free Estimate
        </Link>
      </div>

      <p className="text-charcoal-500 text-sm mt-12">
        Need help?{' '}
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

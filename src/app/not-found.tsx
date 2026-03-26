import Link from 'next/link';
import Image from 'next/image';
import { BUSINESS } from '@/lib/constants';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#1a2744] flex flex-col items-center justify-center px-6 text-center">
      {/* Logo */}
      <Link href="/">
        <Image
          src="/images/logo.png"
          alt="Real Elite Contracting Logo"
          width={96}
          height={96}
          className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-8"
        />
      </Link>

      {/* 404 Number */}
      <p className="text-[#c0392b] font-black text-8xl md:text-9xl leading-none mb-4">404</p>

      {/* Heading */}
      <h1 className="text-white font-black text-3xl md:text-4xl mb-4">Page Not Found</h1>

      {/* Description */}
      <p className="text-gray-400 text-lg max-w-md mb-10">
        Looks like this page got misplaced on the job site. Let's get you back on track.
      </p>

      {/* CTA Button */}
      <Link
        href="/"
        className="inline-block bg-[#c0392b] hover:bg-[#a93226] text-white font-bold text-lg px-10 py-4 rounded-lg transition-colors"
      >
        Back to Homepage
      </Link>

      {/* Footer info */}
      <p className="text-gray-600 text-sm mt-12">
        Need help?{' '}
        <a href={`tel:${BUSINESS.phoneRaw}`} className="text-gray-400 hover:text-white transition-colors">
          {BUSINESS.phone}
        </a>
        {' · '}
        <a href={`mailto:${BUSINESS.email}`} className="text-gray-400 hover:text-white transition-colors">
          {BUSINESS.email}
        </a>
      </p>
    </div>
  );
}

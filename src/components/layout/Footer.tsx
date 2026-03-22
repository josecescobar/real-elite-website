import Link from 'next/link';
import Image from 'next/image';
import { BUSINESS, SERVICES, NAV_LINKS } from '@/lib/constants';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1a2744] py-12">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <Image
          src="/images/logo.png"
          alt="Real Elite Contracting Logo"
          width={72}
          height={72}
          className="w-16 h-16 md:w-[72px] md:h-[72px] mx-auto mb-4"
        />
        <span className="text-white font-bold text-lg">{BUSINESS.name}</span>
        <p className="text-gray-400 text-sm mt-1">
          Veteran-Owned · {BUSINESS.address.region}
        </p>
        <p className="text-gray-400 text-sm mt-2">
          <a href={`tel:${BUSINESS.phoneRaw}`} className="hover:text-white transition-colors">
            {BUSINESS.phone}
          </a>
          {' · '}
          <a href={`mailto:${BUSINESS.email}`} className="hover:text-white transition-colors">
            {BUSINESS.email}
          </a>
        </p>

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-gray-500 hover:text-gray-300 text-xs transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-4">
          {SERVICES.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="text-gray-600 hover:text-gray-400 text-xs transition-colors"
            >
              {service.title}
            </Link>
          ))}
        </div>

        <p className="text-gray-600 text-xs mt-6">
          &copy; 2024–{currentYear} {BUSINESS.name}. Licensed &amp; Insured.
        </p>
      </div>
    </footer>
  );
}

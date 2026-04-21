import Link from 'next/link';
import Image from 'next/image';
import { BUSINESS, SERVICES, NAV_LINKS, PRIMARY_SERVICE_AREAS, SECONDARY_SERVICE_AREAS } from '@/lib/constants';

const SOCIAL_LINKS = [
  {
    label: 'Facebook',
    href: BUSINESS.social.facebook,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: BUSINESS.social.instagram,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: BUSINESS.social.linkedin,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: 'Yelp',
    href: BUSINESS.social.yelp,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z" />
      </svg>
    ),
  },
  {
    label: 'Thumbtack',
    href: BUSINESS.social.thumbtack,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M21.32 8.4L15.6 2.68a2.31 2.31 0 0 0-3.27 0L9.27 5.74a2.31 2.31 0 0 0 0 3.27l.69.69-4.54 4.54a.77.77 0 0 0 0 1.09l.35.35-2.12 2.12a.77.77 0 1 0 1.09 1.09l2.12-2.12.35.35a.77.77 0 0 0 1.09 0l4.54-4.54.69.69a2.31 2.31 0 0 0 3.27 0l3.06-3.06a2.31 2.31 0 0 0-.54-3.77z" />
        <line x1="12" y1="16" x2="12" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'Google Reviews',
    href: BUSINESS.social.google,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-4-4 1.41-1.41L11 14.17l6.59-6.59L19 9l-8 8z" />
      </svg>
    ),
  },
];

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
        <p className="text-gray-300 text-sm mt-1">
          Veteran-Owned · {BUSINESS.address.region}
        </p>
        <p className="text-gray-300 text-sm mt-2">
          <a href={`tel:${BUSINESS.phoneRaw}`} className="hover:text-white transition-colors">
            {BUSINESS.phone}
          </a>
          {' · '}
          <a href={`mailto:${BUSINESS.email}`} className="hover:text-white transition-colors">
            {BUSINESS.email}
          </a>
        </p>
        <p className="text-gray-300 text-xs mt-1">{BUSINESS.hours}</p>

        {/* Social Media Icons */}
        <div className="flex justify-center gap-4 mt-6">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="inline-flex items-center justify-center w-11 h-11 text-gray-300 hover:text-white transition-colors"
            >
              {link.icon}
            </a>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mt-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-gray-300 hover:text-white text-sm py-1 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-x-5 gap-y-3 mt-4">
          {SERVICES.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="text-gray-300 hover:text-white text-sm py-1 transition-colors"
            >
              {service.title}
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-x-5 gap-y-3 mt-4">
          {[...PRIMARY_SERVICE_AREAS, ...SECONDARY_SERVICE_AREAS].slice(0, 6).map((area) => (
            <Link
              key={area.slug}
              href={`/service-areas/${area.slug}`}
              className="text-gray-300 hover:text-white text-sm py-1 transition-colors"
            >
              {area.city}, {area.state}
            </Link>
          ))}
          <Link
            href="/service-areas"
            className="text-gray-300 hover:text-white text-sm py-1 transition-colors font-semibold"
          >
            View All Areas &rarr;
          </Link>
        </div>

        <p className="text-gray-300 text-xs mt-6">
          &copy; 2024–{currentYear} {BUSINESS.name}. Licensed &amp; Insured.
        </p>
      </div>
    </footer>
  );
}

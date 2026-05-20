'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  BUSINESS,
  NAV_LINKS,
  UTILITY_LINKS,
  PRIMARY_SERVICE_AREAS,
  SECONDARY_SERVICE_AREAS,
} from '@/lib/constants';
import { trackEvent } from '@/lib/analytics';

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
    label: 'Google Reviews',
    href: BUSINESS.social.google,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-4-4 1.41-1.41L11 14.17l6.59-6.59L19 9l-8 8z" />
      </svg>
    ),
  },
];

const FEATURED_FOOTER_SERVICES = [
  { label: 'Whole-Home Remodeling', href: '/services/remodeling' },
  { label: 'Home Additions', href: '/services/additions' },
  { label: 'Roofing', href: '/services/roofing' },
  { label: 'Siding & Stone', href: '/services/siding' },
  { label: 'Decks & Outdoor Living', href: '/services/decks' },
  { label: 'Exterior Repairs', href: '/services/exterior-repairs' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const featuredAreas = [
    { city: 'Frederick', state: 'MD', slug: 'frederick-md' },
    { city: 'Winchester', state: 'VA', slug: 'winchester-va' },
    { city: 'Leesburg', state: 'VA', slug: 'leesburg-va' },
    { city: 'Ashburn', state: 'VA', slug: 'ashburn-va' },
    ...PRIMARY_SERVICE_AREAS.slice(0, 3),
    ...SECONDARY_SERVICE_AREAS.slice(0, 1),
  ];

  return (
    <footer className="bg-navy-900 text-charcoal-300">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        {/* Main 4-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand + contact */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/images/logo.png"
                alt="Real Elite Contracting Logo"
                width={56}
                height={56}
                className="w-12 h-12"
              />
              <div className="font-heading text-white font-bold text-lg leading-tight">
                Real Elite
                <span className="block text-[0.6rem] tracking-[0.18em] uppercase text-charcoal-400 font-medium mt-0.5">
                  Contracting
                </span>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              Premium remodeling and exterior contracting across the WV–MD–VA region.
              Veteran-owned. Built with military precision.
            </p>
            <p className="text-sm">
              <a
                href={`tel:${BUSINESS.phoneRaw}`}
                onClick={() => trackEvent('phone_click', { location: 'footer' })}
                className="block hover:text-white transition-colors font-semibold"
              >
                {BUSINESS.phone}
              </a>
              <a
                href={`mailto:${BUSINESS.email}`}
                onClick={() => trackEvent('email_click', { location: 'footer' })}
                className="block hover:text-white transition-colors mt-1"
              >
                {BUSINESS.email}
              </a>
              <span className="block text-xs text-charcoal-400 mt-2">{BUSINESS.hours}</span>
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-heading text-white font-bold text-sm uppercase tracking-[0.15em] mb-4">
              Services
            </h3>
            <ul className="space-y-2 text-sm">
              {FEATURED_FOOTER_SERVICES.map((service) => (
                <li key={service.href}>
                  <Link
                    href={service.href}
                    className="hover:text-white transition-colors"
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/services" className="text-white font-semibold hover:text-brand-red transition-colors">
                  All Services →
                </Link>
              </li>
            </ul>
          </div>

          {/* Service Areas */}
          <div>
            <h3 className="font-heading text-white font-bold text-sm uppercase tracking-[0.15em] mb-4">
              Service Areas
            </h3>
            <ul className="space-y-2 text-sm">
              {featuredAreas.map((area) => (
                <li key={area.slug}>
                  <Link
                    href={`/service-areas/${area.slug}`}
                    className="hover:text-white transition-colors"
                  >
                    {area.city}, {area.state}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/service-areas" className="text-white font-semibold hover:text-brand-red transition-colors">
                  All Areas →
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-heading text-white font-bold text-sm uppercase tracking-[0.15em] mb-4">
              Company
            </h3>
            <ul className="space-y-2 text-sm">
              {NAV_LINKS.filter((l) => l.label !== 'Services' && l.label !== 'Service Areas').map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
              {UTILITY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex gap-3 mt-6">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-md text-charcoal-300 hover:text-white hover:bg-navy-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900 focus-visible:ring-navy-400"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Utility row */}
        <div className="mt-12 pt-8 border-t border-navy-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
          <p className="text-charcoal-400">
            &copy; 2024–{currentYear} {BUSINESS.name}. Licensed &amp; Insured across WV, MD, VA.
          </p>
          <p className="text-charcoal-500 uppercase tracking-[0.15em] font-semibold">
            Veteran-Owned · Built With Military Precision
          </p>
        </div>
      </div>
    </footer>
  );
}

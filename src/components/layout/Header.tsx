'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ChevronDown } from 'lucide-react';
import { NAV_LINKS, BUSINESS } from '@/lib/constants';
import { trackEvent } from '@/lib/analytics';

const CALENDLY_URL = 'https://calendly.com/realelitecontracting-info/free-estimate-call';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedService, setExpandedService] = useState(false);

  return (
    <header className="bg-white backdrop-blur-sm border-b border-charcoal-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 flex-shrink-0">
          <Image
            src="/images/logo.png"
            alt="Real Elite Contracting Logo"
            width={56}
            height={56}
            className="w-14 h-14"
          />
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="font-heading text-navy-800 font-bold text-xl tracking-tight">
              Real Elite
            </span>
            <span className="text-navy-800 font-medium text-xs tracking-widest uppercase">
              Contracting
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 text-sm text-charcoal-500">
          {NAV_LINKS.map((link) => (
            <div key={link.label} className="relative group">
              <Link
                href={link.href}
                className="hover:text-navy-800 flex items-center gap-1 transition-colors font-medium"
              >
                {link.label}
                {link.label === 'Services' && (
                  <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
                )}
              </Link>

              {link.label === 'Services' && link.children && (
                <div className="absolute left-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-charcoal-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-1">
                  {link.children.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href}
                      className="block px-4 py-2 text-sm text-charcoal-600 hover:text-navy-800 hover:bg-charcoal-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          <a
            href={`tel:${BUSINESS.phoneRaw}`}
            onClick={() => trackEvent('phone_click', { location: 'header_desktop' })}
            className="bg-navy-800 text-white px-5 py-2.5 rounded-md font-medium text-sm hover:bg-navy-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-navy-400"
          >
            {BUSINESS.phone}
          </a>
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('calendly_click', { location: 'header_desktop' })}
            className="bg-brand-red text-white px-5 py-2.5 rounded-md font-medium text-sm hover:bg-brand-red-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-red"
          >
            Free Estimate
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center gap-3">
          <a
            href={`tel:${BUSINESS.phoneRaw}`}
            onClick={() => trackEvent('phone_click', { location: 'header_mobile' })}
            className="bg-navy-800 text-white px-4 py-2 rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-navy-400"
          >
            Call
          </a>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-navy-800 hover:text-charcoal-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-400 rounded-md"
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-charcoal-100 bg-white">
          <nav className="flex flex-col py-4 max-w-6xl mx-auto px-6">
            {NAV_LINKS.map((link) => (
              <div key={link.label}>
                <div className="flex items-center justify-between">
                  <Link
                    href={link.href}
                    className="py-2.5 text-sm font-medium text-charcoal-600 hover:text-navy-800 transition-colors flex-1"
                    onClick={() => {
                      if (link.label !== 'Services') setIsMobileMenuOpen(false);
                    }}
                  >
                    {link.label}
                  </Link>
                  {link.label === 'Services' && link.children && (
                    <button
                      onClick={() => setExpandedService(!expandedService)}
                      className="py-2 px-1"
                      aria-expanded={expandedService}
                      aria-label="Toggle services menu"
                    >
                      <ChevronDown
                        className={`w-4 h-4 text-charcoal-400 transition-transform ${expandedService ? 'rotate-180' : ''}`}
                      />
                    </button>
                  )}
                </div>

                {link.label === 'Services' && link.children && expandedService && (
                  <div className="bg-charcoal-50 rounded-md mb-2">
                    {link.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="block px-4 py-2 text-sm text-charcoal-500 hover:text-navy-800 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="px-6 pb-4 flex flex-col gap-3 max-w-6xl mx-auto">
            <a
              href={`tel:${BUSINESS.phoneRaw}`}
              onClick={() => trackEvent('phone_click', { location: 'header_mobile_menu' })}
              className="flex items-center justify-center w-full py-3 bg-navy-800 text-white font-medium rounded-md text-sm hover:bg-navy-900 transition-colors"
            >
              Call {BUSINESS.phone}
            </a>
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('calendly_click', { location: 'header_mobile_menu' })}
              className="flex items-center justify-center w-full py-3 bg-brand-red text-white font-medium rounded-md text-sm hover:bg-brand-red-dark transition-colors"
            >
              Free Estimate
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

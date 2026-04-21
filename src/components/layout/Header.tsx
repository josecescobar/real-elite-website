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
    <header className="bg-white backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
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
            <span className="text-[#1a2744] font-bold text-xl tracking-tight">
              Real Elite
            </span>
            <span className="text-[#1a2744] font-medium text-xs tracking-widest uppercase">
              Contracting
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 text-sm text-gray-500">
          {NAV_LINKS.map((link) => (
            <div key={link.label} className="relative group">
              <Link
                href={link.href}
                className="hover:text-[#1a2744] flex items-center gap-1 transition-colors font-medium"
              >
                {link.label}
                {link.label === 'Services' && (
                  <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
                )}
              </Link>

              {link.label === 'Services' && link.children && (
                <div className="absolute left-0 top-full mt-2 w-44 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-1">
                  {link.children.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href}
                      className="block px-4 py-2 text-sm text-gray-600 hover:text-[#1a2744] hover:bg-gray-50 transition-colors first:rounded-t-xl last:rounded-b-xl"
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
            className="bg-[#1a2744] text-white px-5 py-2.5 rounded-full font-medium text-sm hover:bg-[#0f1b2d] transition-colors"
          >
            {BUSINESS.phone}
          </a>
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('calendly_click', { location: 'header_desktop' })}
            className="bg-[#c0392b] text-white px-5 py-2.5 rounded-full font-medium text-sm hover:bg-[#a93226] transition-colors"
          >
            Book Free Estimate
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center gap-3">
          <a
            href={`tel:${BUSINESS.phoneRaw}`}
            onClick={() => trackEvent('phone_click', { location: 'header_mobile' })}
            className="bg-[#1a2744] text-white px-4 py-2 rounded-full text-sm font-medium"
          >
            Call
          </a>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-[#1a2744] hover:text-gray-600 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white">
          <nav className="flex flex-col py-4 max-w-6xl mx-auto px-6">
            {NAV_LINKS.map((link) => (
              <div key={link.label}>
                <div className="flex items-center justify-between">
                  <Link
                    href={link.href}
                    className="py-2.5 text-sm font-medium text-gray-600 hover:text-[#1a2744] transition-colors flex-1"
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
                    >
                      <ChevronDown
                        className={`w-4 h-4 text-gray-400 transition-transform ${expandedService ? 'rotate-180' : ''}`}
                      />
                    </button>
                  )}
                </div>

                {link.label === 'Services' && link.children && expandedService && (
                  <div className="bg-gray-50 rounded-lg mb-2">
                    {link.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="block px-4 py-2 text-sm text-gray-500 hover:text-[#1a2744] transition-colors"
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
              className="flex items-center justify-center w-full py-3 bg-[#1a2744] text-white font-medium rounded-full text-sm"
            >
              Call {BUSINESS.phone}
            </a>
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('calendly_click', { location: 'header_mobile_menu' })}
              className="flex items-center justify-center w-full py-3 bg-[#c0392b] text-white font-medium rounded-full text-sm"
            >
              Book Free Estimate
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

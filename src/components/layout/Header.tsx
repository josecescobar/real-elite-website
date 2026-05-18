'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';
import { NAV_LINKS, BUSINESS } from '@/lib/constants';
import { trackEvent } from '@/lib/analytics';

const CALENDLY_URL = 'https://calendly.com/realelitecontracting-info/free-estimate-call';

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header() {
  const pathname = usePathname() ?? '/';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);

  // Close desktop services dropdown on outside click or Escape
  useEffect(() => {
    if (!isServicesOpen) return;
    function onClick(e: MouseEvent) {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) {
        setIsServicesOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsServicesOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [isServicesOpen]);

  // Close mobile menu on Escape
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isMobileMenuOpen]);

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
        <nav className="hidden lg:flex items-center gap-6 text-sm text-gray-500" aria-label="Primary">
          {NAV_LINKS.map((link) => {
            const active = isActive(pathname, link.href);
            const isServices = link.label === 'Services' && link.children;

            if (isServices) {
              return (
                <div key={link.label} className="relative" ref={servicesRef}>
                  <div className="flex items-center gap-1">
                    <Link
                      href={link.href}
                      className={`hover:text-[#1a2744] transition-colors font-medium ${active ? 'text-[#1a2744]' : ''}`}
                      aria-current={active ? 'page' : undefined}
                    >
                      {link.label}
                    </Link>
                    <button
                      type="button"
                      onClick={() => setIsServicesOpen((open) => !open)}
                      aria-expanded={isServicesOpen}
                      aria-controls="services-submenu"
                      aria-label={`${isServicesOpen ? 'Close' : 'Open'} Services submenu`}
                      className="p-1 rounded text-gray-500 hover:text-[#1a2744] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a2744]"
                    >
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform ${isServicesOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                  </div>

                  {isServicesOpen && (
                    <div
                      id="services-submenu"
                      role="menu"
                      className="absolute left-0 top-full mt-2 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1"
                    >
                      {link.children!.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          role="menuitem"
                          onClick={() => setIsServicesOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-600 hover:text-[#1a2744] hover:bg-gray-50 transition-colors first:rounded-t-xl last:rounded-b-xl"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={link.label}
                href={link.href}
                className={`hover:text-[#1a2744] transition-colors font-medium ${active ? 'text-[#1a2744]' : ''}`}
                aria-current={active ? 'page' : undefined}
              >
                {link.label}
              </Link>
            );
          })}

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
            type="button"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            className="text-[#1a2744] hover:text-gray-600 transition-colors"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div id="mobile-menu" className="lg:hidden border-t border-gray-100 bg-white">
          <nav className="flex flex-col py-4 max-w-6xl mx-auto px-6" aria-label="Mobile">
            {NAV_LINKS.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <div key={link.label}>
                  <div className="flex items-center justify-between">
                    <Link
                      href={link.href}
                      className={`py-2.5 text-sm font-medium hover:text-[#1a2744] transition-colors flex-1 ${active ? 'text-[#1a2744]' : 'text-gray-600'}`}
                      aria-current={active ? 'page' : undefined}
                      onClick={() => {
                        if (link.label !== 'Services') setIsMobileMenuOpen(false);
                      }}
                    >
                      {link.label}
                    </Link>
                    {link.label === 'Services' && link.children && (
                      <button
                        type="button"
                        onClick={() => setIsMobileServicesOpen((open) => !open)}
                        className="py-2 px-1"
                        aria-expanded={isMobileServicesOpen}
                        aria-controls="mobile-services-submenu"
                        aria-label={`${isMobileServicesOpen ? 'Collapse' : 'Expand'} Services`}
                      >
                        <ChevronDown
                          className={`w-4 h-4 text-gray-400 transition-transform ${isMobileServicesOpen ? 'rotate-180' : ''}`}
                        />
                      </button>
                    )}
                  </div>

                  {link.label === 'Services' && link.children && isMobileServicesOpen && (
                    <div id="mobile-services-submenu" className="bg-gray-50 rounded-lg mb-2">
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
              );
            })}
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

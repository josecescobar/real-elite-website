'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ChevronDown } from 'lucide-react';
import { NAV_LINKS, UTILITY_LINKS, BUSINESS, SERVICES_MEGA_MENU } from '@/lib/constants';
import { trackEvent } from '@/lib/analytics';
import ServicesMegaMenu from './MegaMenu';


export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  // Close the mobile menu on Escape (returning focus to the toggle button)
  // or when tapping/clicking anywhere outside the header.
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onPointerDown = (e: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [isMobileMenuOpen]);

  return (
    <header ref={headerRef} className="bg-white border-b border-charcoal-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-3 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-400 rounded-sm"
        >
          <Image
            src="/images/logo.png"
            alt="Real Elite Contracting Logo"
            width={56}
            height={56}
            className="w-12 h-12 lg:w-14 lg:h-14"
          />
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="font-heading text-navy-800 font-bold text-xl tracking-tight">
              Real Elite
            </span>
            <span className="text-navy-800 font-medium text-[0.65rem] tracking-[0.18em] uppercase">
              Contracting
            </span>
          </div>
        </Link>

        {/* Desktop Navigation — 6 items */}
        <nav className="hidden lg:flex items-center gap-7 text-sm">
          {NAV_LINKS.map((link) => {
            const hasMegaMenu = link.label === 'Services';
            return (
              <div
                key={link.label}
                className="relative group"
                // Escape closes the mega-menu whether focus is on the trigger
                // or inside the panel: the reveal is focus-within driven, so
                // blurring the focused element hides it. Lives on this shared
                // wrapper because trigger and panel are siblings.
                onKeyDown={
                  hasMegaMenu
                    ? (e) => {
                        if (e.key === 'Escape' && document.activeElement instanceof HTMLElement) {
                          document.activeElement.blur();
                        }
                      }
                    : undefined
                }
              >
                <Link
                  href={link.href}
                  className="text-charcoal-700 hover:text-navy-800 flex items-center gap-1 transition-colors font-medium py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-400 rounded-sm"
                  aria-haspopup={hasMegaMenu ? 'true' : undefined}
                >
                  {link.label}
                  {hasMegaMenu && (
                    <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
                  )}
                </Link>
                {hasMegaMenu && <ServicesMegaMenu />}
              </div>
            );
          })}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
          <a
            href={`tel:${BUSINESS.phoneRaw}`}
            onClick={() => trackEvent('phone_click', { location: 'header_desktop' })}
            className="text-navy-800 font-semibold text-sm hover:text-brand-red transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-400 rounded-sm px-2 py-1"
          >
            {BUSINESS.phone}
          </a>
          <a
            href="/estimate"
            onClick={() => trackEvent('estimate_cta_click', { location: 'header_desktop' })}
            className="bg-brand-red text-white px-5 py-2.5 rounded-md font-semibold text-sm hover:bg-brand-red-dark transition-colors shadow-md focus-ring"
          >
            Free Estimate
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center gap-3">
          <a
            href={`tel:${BUSINESS.phoneRaw}`}
            onClick={() => trackEvent('phone_click', { location: 'header_mobile' })}
            className="inline-flex items-center min-h-[44px] bg-navy-800 text-white px-4 py-2 rounded-md text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-navy-400"
          >
            Call
          </a>
          <button
            ref={toggleRef}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-navy-800 hover:text-charcoal-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-400 rounded-sm p-2.5 -mr-2.5"
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div id="mobile-menu" className="lg:hidden border-t border-charcoal-100 bg-white">
          <nav className="flex flex-col py-4 max-w-7xl mx-auto px-6">
            {NAV_LINKS.map((link) => {
              const isServices = link.label === 'Services';
              const isExpandedHere = expandedSection === link.label;
              return (
                <div key={link.label}>
                  <div className="flex items-center justify-between">
                    <Link
                      href={link.href}
                      className="py-2.5 text-sm font-medium text-charcoal-700 hover:text-navy-800 transition-colors flex-1"
                      onClick={() => {
                        if (!isServices) setIsMobileMenuOpen(false);
                      }}
                    >
                      {link.label}
                    </Link>
                    {isServices && (
                      <button
                        type="button"
                        onClick={() => setExpandedSection(isExpandedHere ? null : link.label)}
                        className="p-3 -m-1"
                        aria-expanded={isExpandedHere}
                        aria-label="Toggle services menu"
                      >
                        <ChevronDown
                          className={`w-4 h-4 text-charcoal-400 transition-transform ${isExpandedHere ? 'rotate-180' : ''}`}
                        />
                      </button>
                    )}
                  </div>

                  {isServices && isExpandedHere && (
                    <div className="bg-charcoal-50 rounded-md mb-2 p-2">
                      {SERVICES_MEGA_MENU.flatMap((column) =>
                        column.items.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-3 py-2 text-sm text-charcoal-700 hover:text-navy-800 transition-colors rounded-sm"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {child.label}
                          </Link>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Secondary utility links — footer parity so mobile users keep
              reaching pages like the photo gallery, process, and reviews. */}
          <nav className="flex flex-col pb-4 max-w-7xl mx-auto px-6 border-t border-charcoal-100 pt-3">
            {UTILITY_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-2 text-sm text-charcoal-500 hover:text-navy-800 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="px-6 pb-4 flex flex-col gap-3 max-w-7xl mx-auto">
            <a
              href={`tel:${BUSINESS.phoneRaw}`}
              onClick={() => trackEvent('phone_click', { location: 'header_mobile_menu' })}
              className="flex items-center justify-center w-full py-3 bg-navy-800 text-white font-semibold rounded-md text-sm hover:bg-navy-900 transition-colors"
            >
              Call {BUSINESS.phone}
            </a>
            <a
              href="/estimate"
              onClick={() => trackEvent('estimate_cta_click', { location: 'header_mobile_menu' })}
              className="flex items-center justify-center w-full py-3 bg-brand-red text-white font-semibold rounded-md text-sm hover:bg-brand-red-dark transition-colors"
            >
              Free Estimate
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

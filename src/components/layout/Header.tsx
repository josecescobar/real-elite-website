'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ChevronDown } from 'lucide-react';
import { BUSINESS } from '@/lib/constants';
import { ESTIMATE_SMS_HREF } from '@/lib/estimate-sms';
import { PRIMARY_NAV, NAV_CTA, DESIGN_BUILD_MENU, MOBILE_UTILITY_NAV } from '@/lib/navigation';
import { trackEvent } from '@/lib/analytics';
import ServicesMegaMenu from './MegaMenu';
import PhoneLink from '@/components/analytics/PhoneLink';
import TrackedLink from '@/components/analytics/TrackedLink';

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
    <header
      ref={headerRef}
      className="bg-white/95 backdrop-blur-sm border-b border-steel-200 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-3.5 flex items-center justify-between gap-6">
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
            sizes="48px"
            className="w-11 h-11 lg:w-12 lg:h-12"
          />
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="font-heading text-navy-800 text-[1.35rem] tracking-tight leading-none">
              Real Elite
            </span>
            <span className="text-charcoal-500 font-medium text-[0.6rem] tracking-[0.22em] uppercase mt-1">
              Contracting · Design-Build
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-7 text-[0.9rem]" aria-label="Primary">
          {PRIMARY_NAV.map((link) => {
            const hasMegaMenu = Boolean(link.mega);
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
                  className="text-charcoal-700 hover:text-navy-900 flex items-center gap-1 transition-colors font-medium py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-400 rounded-sm"
                  aria-haspopup={hasMegaMenu ? 'true' : undefined}
                >
                  {link.label}
                  {hasMegaMenu && (
                    <ChevronDown className="w-3.5 h-3.5 text-charcoal-400 transition-transform group-hover:rotate-180" />
                  )}
                </Link>
                {hasMegaMenu && <ServicesMegaMenu />}
              </div>
            );
          })}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
          <PhoneLink
            location="header_desktop"
            className="text-navy-800 font-medium text-sm hover:text-brand-red transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-400 rounded-sm px-1 py-1"
          >
            {BUSINESS.phone}
          </PhoneLink>
          <Link
            href="/estimate"
            className="text-navy-800 font-medium text-sm hover:text-brand-red transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-400 rounded-sm px-1 py-1"
          >
            Estimate
          </Link>
          <Link
            href={NAV_CTA.href}
            onClick={() => trackEvent('consultation_cta_click', { location: 'header_desktop' })}
            className="bg-navy-900 text-white px-5 py-2.5 rounded-md font-semibold text-sm hover:bg-brand-red transition-colors focus-ring"
          >
            {NAV_CTA.label}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center gap-3">
          <PhoneLink
            location="header_mobile"
            className="inline-flex items-center min-h-[44px] bg-navy-900 text-white px-4 py-2 rounded-md text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-navy-400"
          >
            Call
          </PhoneLink>
          <TrackedLink
            href={ESTIMATE_SMS_HREF}
            eventName="sms_click"
            eventParams={{ location: 'header_mobile' }}
            className="inline-flex items-center min-h-[44px] border border-navy-900 text-navy-900 px-3 py-2 rounded-md text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-navy-400"
          >
            Text
          </TrackedLink>
          <Link
            href="/estimate"
            className="inline-flex items-center min-h-[44px] text-navy-900 px-1 py-2 text-xs font-semibold underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-navy-400"
          >
            Estimate
          </Link>
          <button
            ref={toggleRef}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-navy-800 hover:text-charcoal-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-400 rounded-sm p-2.5 -mr-2.5"
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
        <div
          id="mobile-menu"
          className="lg:hidden border-t border-steel-200 bg-white max-h-[calc(100vh-4.5rem)] overflow-y-auto"
        >
          <nav className="flex flex-col py-4 max-w-7xl mx-auto px-6" aria-label="Primary (mobile)">
            {PRIMARY_NAV.map((link) => {
              const hasMegaMenu = Boolean(link.mega);
              const isExpandedHere = expandedSection === link.label;
              return (
                <div key={link.label}>
                  <div className="flex items-center justify-between">
                    <Link
                      href={link.href}
                      className="py-3 font-heading text-lg text-navy-800 hover:text-brand-red transition-colors flex-1"
                      onClick={() => {
                        if (!hasMegaMenu) setIsMobileMenuOpen(false);
                      }}
                    >
                      {link.label}
                    </Link>
                    {hasMegaMenu && (
                      <button
                        type="button"
                        onClick={() => setExpandedSection(isExpandedHere ? null : link.label)}
                        className="p-3 -m-1"
                        aria-expanded={isExpandedHere}
                        aria-label="Toggle design-build menu"
                      >
                        <ChevronDown
                          className={`w-4 h-4 text-charcoal-400 transition-transform ${isExpandedHere ? 'rotate-180' : ''}`}
                        />
                      </button>
                    )}
                  </div>

                  {hasMegaMenu && isExpandedHere && (
                    <div className="bg-steel-50 rounded-md mb-3 p-3 space-y-4">
                      {DESIGN_BUILD_MENU.map((column) => (
                        <div key={column.heading}>
                          <p className="px-2 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-charcoal-500 mb-1">
                            {column.heading}
                          </p>
                          {column.items.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block px-2 py-2 text-sm text-charcoal-700 hover:text-brand-red transition-colors rounded-sm"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Secondary utility links — every route the old header reached
              stays reachable from the phone. */}
          <nav
            className="grid grid-cols-2 gap-x-6 pb-4 max-w-7xl mx-auto px-6 border-t border-steel-200 pt-4"
            aria-label="More"
          >
            {MOBILE_UTILITY_NAV.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-2 text-sm text-charcoal-500 hover:text-navy-900 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="px-6 pb-5 flex flex-col gap-3 max-w-7xl mx-auto">
            <Link
              href={NAV_CTA.href}
              onClick={() => {
                trackEvent('consultation_cta_click', { location: 'header_mobile_menu' });
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center justify-center w-full py-3 bg-navy-900 text-white font-semibold rounded-md text-sm hover:bg-brand-red transition-colors"
            >
              Schedule a Design Consultation
            </Link>
            <PhoneLink
              location="header_mobile_menu"
              className="flex items-center justify-center w-full py-3 border border-navy-800 text-navy-800 font-semibold rounded-md text-sm hover:bg-steel-50 transition-colors"
            >
              Call {BUSINESS.phone}
            </PhoneLink>
            <TrackedLink
              href={ESTIMATE_SMS_HREF}
              eventName="sms_click"
              eventParams={{ location: 'header_mobile_menu' }}
              className="flex items-center justify-center w-full py-3 border border-navy-800 text-navy-800 font-semibold rounded-md text-sm hover:bg-steel-50 transition-colors"
            >
              Text {BUSINESS.phone}
            </TrackedLink>
          </div>
        </div>
      )}
    </header>
  );
}

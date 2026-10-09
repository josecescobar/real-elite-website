'use client';

import Link from 'next/link';
import { DESIGN_BUILD_MENU } from '@/lib/navigation';

/**
 * Desktop-only Design-Build mega-menu.
 * Hover/focus reveal; absolute-positioned beneath the trigger.
 * Mobile keeps the accordion in Header.
 *
 * Deliberately NOT role="menu": ARIA menus imply arrow-key/typeahead
 * interaction this link panel doesn't implement — a plain group of links is
 * the correct semantics. It IS a labeled `navigation` landmark, so screen
 * readers can jump to the list and announce it by name. Escape-to-close
 * lives on the shared trigger+panel wrapper in Header (trigger and panel are
 * siblings, so a handler here would miss Escape pressed while the trigger
 * itself is focused).
 *
 * Layout carries the positioning: the signature column is wide with
 * descriptions; the exterior/repair and planning columns are compact.
 */
export default function ServicesMegaMenu() {
  const [signature, ...secondary] = DESIGN_BUILD_MENU;

  return (
    <nav
      aria-label="Design-build services"
      className="absolute left-0 top-full pt-3 w-[min(880px,calc(100vw-2rem))] opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 transition-all duration-300"
    >
      <div className="bg-white rounded-lg shadow-xl border border-steel-200 overflow-hidden">
        <div className="grid grid-cols-12">
          {/* Signature projects */}
          <div className="col-span-6 p-7 border-r border-steel-200">
            <h3 className="font-body text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-red mb-5">
              {signature.heading}
            </h3>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-4">
              {signature.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block group/item focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-400 rounded-sm"
                  >
                    <div className="font-heading text-[1.05rem] text-navy-800 group-hover/item:text-brand-red transition-colors leading-snug">
                      {item.label}
                    </div>
                    {item.description && (
                      <div className="text-charcoal-500 text-xs mt-1 leading-snug">
                        {item.description}
                      </div>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Secondary lanes */}
          {secondary.map((column, idx) => (
            <div
              key={column.heading}
              className={`col-span-3 p-7 bg-steel-50 ${idx < secondary.length - 1 ? 'border-r border-steel-200' : ''}`}
            >
              <h3 className="font-body text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-charcoal-500 mb-5">
                {column.heading}
              </h3>
              <ul className="space-y-2.5">
                {column.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="block text-sm text-charcoal-700 hover:text-brand-red transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-400 rounded-sm"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="bg-navy-900 px-7 py-3.5 flex items-center justify-between gap-4">
          <span className="text-xs text-charcoal-300">
            Family-run · VA Class A HIC · WV062432 · Loudoun and the Eastern Panhandle
          </span>
          <div className="flex items-center gap-6">
            <Link
              href="/design-consultation"
              className="text-xs font-semibold text-white hover:text-brand-red-light transition-colors uppercase tracking-[0.14em]"
            >
              Design Consultation
            </Link>
            <Link
              href="/services"
              className="text-xs font-semibold text-charcoal-300 hover:text-white transition-colors uppercase tracking-[0.14em]"
            >
              All Services →
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

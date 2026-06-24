'use client';

import Link from 'next/link';
import { SERVICES_MEGA_MENU } from '@/lib/constants';

/**
 * Desktop-only services mega-menu.
 * Hover/focus reveal; absolute-positioned beneath the trigger.
 * Mobile keeps the existing accordion in Header.
 */
export default function ServicesMegaMenu() {
  return (
    <div
      role="menu"
      aria-label="Services"
      className="absolute left-0 top-full pt-4 w-[min(820px,calc(100vw-2rem))] opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200"
    >
      <div className="bg-white rounded-lg shadow-xl border border-charcoal-100 overflow-hidden">
        <div className="grid grid-cols-3 gap-0">
          {SERVICES_MEGA_MENU.map((column, idx) => (
            <div
              key={column.heading}
              className={`p-6 ${idx < SERVICES_MEGA_MENU.length - 1 ? 'border-r border-charcoal-100' : ''}`}
            >
              <h3 className="font-heading text-xs font-bold uppercase tracking-[0.15em] text-brand-red mb-4">
                {column.heading}
              </h3>
              <ul className="space-y-3">
                {column.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      role="menuitem"
                      className="block group/item focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-400 rounded-sm"
                    >
                      <div className="font-semibold text-navy-800 group-hover/item:text-brand-red transition-colors text-sm">
                        {item.label}
                      </div>
                      <div className="text-charcoal-500 text-xs mt-0.5 leading-snug">
                        {item.description}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="bg-charcoal-50 border-t border-charcoal-100 px-6 py-3 flex items-center justify-between">
          <span className="text-xs text-charcoal-600">
            Veteran-owned · Licensed across WV, MD, VA
          </span>
          <Link
            href="/services"
            className="text-xs font-semibold text-navy-800 hover:text-brand-red transition-colors uppercase tracking-[0.12em]"
          >
            All Services →
          </Link>
        </div>
      </div>
    </div>
  );
}

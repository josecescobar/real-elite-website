import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { PRIMARY_SERVICE_AREAS, SECONDARY_SERVICE_AREAS, EXPANSION_SERVICE_AREAS } from '@/lib/constants';

type Props = {
  serviceSlug: string;
  serviceTitle: string;
};

const PRIORITY_CITIES = [
  { city: 'Frederick', state: 'MD', slug: 'frederick-md' },
  { city: 'Winchester', state: 'VA', slug: 'winchester-va' },
  { city: 'Leesburg', state: 'VA', slug: 'leesburg-va' },
  { city: 'Ashburn', state: 'VA', slug: 'ashburn-va' },
];

/**
 * Service-area cross-link grid. Lists priority VA/MD markets first
 * (with deep links to /services/[service]/[city]) then the rest of
 * the WV Eastern Panhandle markets.
 */
export default function LocalAreasServed({ serviceSlug, serviceTitle }: Props) {
  const others = [...PRIMARY_SERVICE_AREAS, ...SECONDARY_SERVICE_AREAS];

  // Service-city deep links only exist for the featured (roofing/decks/remodeling/siding)
  // service × VA/MD city combinations. For the rest, link to the city overview page.
  const FEATURED_DEEP_LINK = ['roofing', 'decks', 'remodeling', 'siding'].includes(
    serviceSlug
  );

  return (
    <section>
      <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-navy-800 mb-2">
        {serviceTitle} across the WV–MD–VA region
      </h2>
      <p className="text-charcoal-600 text-sm mb-6">
        Premium markets we actively work in.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PRIORITY_CITIES.map((area) => {
          const href = FEATURED_DEEP_LINK
            ? `/services/${serviceSlug}/${area.slug}`
            : `/service-areas/${area.slug}`;
          return (
            <Link
              key={area.slug}
              href={href}
              className="group flex items-center gap-2 bg-steel-50 hover:bg-navy-800 hover:text-white rounded-md px-4 py-3 text-sm font-medium text-navy-800 transition-colors"
            >
              <MapPin className="w-4 h-4 text-brand-red group-hover:text-white transition-colors" />
              <span>{area.city}, {area.state}</span>
              <span className="ml-auto text-charcoal-400 group-hover:text-white">→</span>
            </Link>
          );
        })}
      </div>

      <details className="mt-5 group">
        <summary className="cursor-pointer text-sm font-semibold text-charcoal-700 hover:text-navy-800 list-none flex items-center gap-2">
          <span className="inline-block w-4 h-4 rounded-full border-2 border-charcoal-400 flex-shrink-0 relative">
            <span className="absolute inset-0 flex items-center justify-center text-charcoal-600 text-xs group-open:rotate-45 transition-transform">+</span>
          </span>
          See all areas we serve
        </summary>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 mt-4 pl-6 text-sm">
          {others.map((area) => (
            <Link
              key={area.slug}
              href={`/service-areas/${area.slug}`}
              className="text-charcoal-700 hover:text-brand-red transition-colors"
            >
              {area.city}, {area.state}
            </Link>
          ))}
        </div>
      </details>
    </section>
  );
}

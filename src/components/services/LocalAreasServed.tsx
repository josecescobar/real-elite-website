import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { ALL_SERVICE_AREAS, PRIMARY_SERVICE_AREAS, SECONDARY_SERVICE_AREAS } from '@/lib/constants';
import { serviceHrefForArea } from '@/lib/service-city-content';

type Props = {
  serviceSlug: string;
  serviceTitle: string;
  areaScope?: { label: string; cities: { city: string; state: string; slug: string }[] };
};

const HAGERSTOWN = { city: 'Hagerstown', state: 'MD', slug: 'hagerstown-md' };

const PRIORITY_CITIES = [
  { city: 'Frederick', state: 'MD', slug: 'frederick-md' },
  HAGERSTOWN,
  { city: 'Winchester', state: 'VA', slug: 'winchester-va' },
  { city: 'Leesburg', state: 'VA', slug: 'leesburg-va' },
  { city: 'Ashburn', state: 'VA', slug: 'ashburn-va' },
];

/**
 * Service-area cross-link grid. Priority markets stay first. Any other town
 * with a published page for this service is a visible combo link too, including
 * West Virginia and Maryland towns. The overflow list uses the same href.
 */
export default function LocalAreasServed({ serviceSlug, serviceTitle, areaScope }: Props) {
  const regionLabel = areaScope ? areaScope.label : 'the WV–MD–VA region';
  const priorityCities = areaScope ? areaScope.cities.slice(0, 4) : PRIORITY_CITIES;
  const catalogOthers = areaScope
    ? areaScope.cities.slice(4)
    : [...PRIMARY_SERVICE_AREAS, ...SECONDARY_SERVICE_AREAS];
  // Towns added with empty legacyTiers never land in the primary or secondary
  // lists. A published combo for this service still needs a hub link.
  const publishedExtras = areaScope
    ? []
    : ALL_SERVICE_AREAS.filter(
        (area) =>
          !priorityCities.some((priority) => priority.slug === area.slug) &&
          !catalogOthers.some((listed) => listed.slug === area.slug) &&
          serviceHrefForArea(serviceSlug, area.slug) ===
            `/services/${serviceSlug}/${area.slug}`,
      );
  const others = [...catalogOthers, ...publishedExtras];
  // Priority rows stay first. Any other town with a published combo for this
  // service is also a visible link — the overflow used to point at the town
  // page only, so /services/decks never linked /services/decks/martinsburg-wv.
  const comboCities = others.filter(
    (area) =>
      !priorityCities.some((priority) => priority.slug === area.slug) &&
      serviceHrefForArea(serviceSlug, area.slug) === `/services/${serviceSlug}/${area.slug}`
  );
  const visibleCities = [...priorityCities, ...comboCities];

  return (
    <section>
      <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-navy-800 mb-2">
        {serviceTitle} across {regionLabel}
      </h2>
      <p className="text-charcoal-600 text-sm mb-6">
        Maryland (Frederick and Hagerstown), Virginia, and West Virginia towns we serve. A town with its own page for this service links there.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {visibleCities.map((area) => {
          const href = serviceHrefForArea(serviceSlug, area.slug);
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
              href={serviceHrefForArea(serviceSlug, area.slug)}
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

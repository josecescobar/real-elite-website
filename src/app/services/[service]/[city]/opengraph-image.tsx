import { notFound } from 'next/navigation';
import { renderOgCard, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';
import { SERVICES, ALL_SERVICE_AREAS, formatAreaPlace, isLocalityArea } from '@/lib/constants';

/**
 * Resolve against ALL_SERVICE_AREAS, not EXPANSION_SERVICE_AREAS.
 *
 * The expansion alias holds VA/MD rows only, so every West Virginia combo
 * (/services/roofing/martinsburg-wv and the other five home-turf pages) fell
 * through to notFound() here and shipped with no social card. Same class of
 * bug as the city lookup the route itself had — see the note on the coverage
 * test in src/lib/service-city-content.test.ts.
 */

export const runtime = 'nodejs';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'Real Elite Contracting service area';

type Params = Promise<{ service: string; city: string }>;

export async function generateImageMetadata({ params }: { params: Params }) {
  const { service, city } = await params;
  const serviceData = SERVICES.find((s) => s.slug === service);
  const cityData = ALL_SERVICE_AREAS.find((a) => a.slug === city);
  return [
    {
      id: 'default',
      size: OG_SIZE,
      alt:
        serviceData && cityData
          ? `${serviceData.title} in ${formatAreaPlace(cityData)} · Real Elite Contracting`
          : alt,
      contentType: OG_CONTENT_TYPE,
    },
  ];
}

export default async function OG({ params }: { params: Params }) {
  const { service, city } = await params;
  const serviceData = SERVICES.find((s) => s.slug === service);
  const cityData = ALL_SERVICE_AREAS.find((a) => a.slug === city);
  if (!serviceData || !cityData) notFound();

  // A region or county has no "surrounding" communities of its own — it IS the
  // surrounding area, so the locality phrasing produced "in Northern Virginia
  // and surrounding VA communities". Same class of bug as the city FAQ #146
  // fixed on the area pages.
  const subtitle = isLocalityArea(cityData)
    ? `Veteran-owned, licensed & insured across WV, MD, and VA. Free estimates in ${cityData.city} and surrounding ${cityData.state} communities.`
    : `Veteran-owned, licensed & insured across WV, MD, and VA. Free estimates across ${cityData.city}.`;

  return renderOgCard({
    eyebrow: formatAreaPlace(cityData),
    title: `${serviceData.title} in ${cityData.city}`,
    subtitle,
  });
}

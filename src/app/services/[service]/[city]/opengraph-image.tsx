import { notFound } from 'next/navigation';
import { renderOgCard, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';
import { SERVICES, EXPANSION_SERVICE_AREAS } from '@/lib/constants';

export const runtime = 'nodejs';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'Real Elite Contracting service area';

type Params = Promise<{ service: string; city: string }>;

export async function generateImageMetadata({ params }: { params: Params }) {
  const { service, city } = await params;
  const serviceData = SERVICES.find((s) => s.slug === service);
  const cityData = EXPANSION_SERVICE_AREAS.find((a) => a.slug === city);
  return [
    {
      id: 'default',
      size: OG_SIZE,
      alt:
        serviceData && cityData
          ? `${serviceData.title} in ${cityData.city}, ${cityData.state} · Real Elite Contracting`
          : alt,
      contentType: OG_CONTENT_TYPE,
    },
  ];
}

export default async function OG({ params }: { params: Params }) {
  const { service, city } = await params;
  const serviceData = SERVICES.find((s) => s.slug === service);
  const cityData = EXPANSION_SERVICE_AREAS.find((a) => a.slug === city);
  if (!serviceData || !cityData) notFound();

  return renderOgCard({
    eyebrow: `${cityData.city}, ${cityData.state}`,
    title: `${serviceData.title} in ${cityData.city}`,
    subtitle: `Veteran-owned, licensed & insured across WV, MD, and VA. Free estimates in ${cityData.city} and surrounding ${cityData.state} communities.`,
  });
}

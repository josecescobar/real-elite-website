import { notFound } from 'next/navigation';
import { renderOgCard, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';
import { getPavingLocation } from '@/lib/paving-data';

export const runtime = 'nodejs';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'Real Elite Contracting paving location';

type Params = Promise<{ location: string }>;

export async function generateImageMetadata({ params }: { params: Params }) {
  const { location: slug } = await params;
  const location = getPavingLocation(slug);
  return [
    {
      id: 'default',
      size: OG_SIZE,
      alt: location
        ? `Paving in ${location.city}, ${location.state} · Real Elite Contracting`
        : alt,
      contentType: OG_CONTENT_TYPE,
    },
  ];
}

export default async function OG({ params }: { params: Params }) {
  const { location: slug } = await params;
  const location = getPavingLocation(slug);
  if (!location) notFound();

  return renderOgCard({
    eyebrow: `${location.county} · ${location.state}`,
    title: `Paving & Asphalt in ${location.city}`,
    subtitle: location.heroSub,
  });
}

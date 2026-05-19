import { notFound } from 'next/navigation';
import { renderOgCard, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';
import { SERVICE_DATA } from '@/lib/services-data';

export const runtime = 'nodejs';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'Real Elite Contracting service';

type Params = { service: string };

export async function generateImageMetadata({ params }: { params: Params }) {
  const data = SERVICE_DATA[params.service];
  return [
    {
      id: 'default',
      size: OG_SIZE,
      alt: data ? `${data.title} · Real Elite Contracting` : alt,
      contentType: OG_CONTENT_TYPE,
    },
  ];
}

export default async function OG({ params }: { params: Params }) {
  const data = SERVICE_DATA[params.service];
  if (!data) notFound();

  return renderOgCard({
    eyebrow: data.hero.eyebrow ?? 'Premium Contracting',
    title: data.title,
    subtitle: data.metaDescription,
  });
}

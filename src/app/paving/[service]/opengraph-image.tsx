import { notFound } from 'next/navigation';
import { renderOgCard, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';
import { getPavingService } from '@/lib/paving-data';

export const runtime = 'nodejs';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'Real Elite Contracting paving service';

type Params = Promise<{ service: string }>;

export async function generateImageMetadata({ params }: { params: Params }) {
  const { service: slug } = await params;
  const service = getPavingService(slug);
  return [
    {
      id: 'default',
      size: OG_SIZE,
      alt: service ? `${service.name} · Real Elite Contracting` : alt,
      contentType: OG_CONTENT_TYPE,
    },
  ];
}

export default async function OG({ params }: { params: Params }) {
  const { service: slug } = await params;
  const service = getPavingService(slug);
  if (!service) notFound();

  return renderOgCard({
    eyebrow: service.hero.eyebrow,
    title: service.name,
    subtitle: service.metaDescription,
  });
}

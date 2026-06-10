import { notFound } from 'next/navigation';
import { renderOgCard, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';
import { ALL_SERVICE_AREAS, CITY_DATA } from '@/lib/constants';

export const runtime = 'nodejs';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'Real Elite Contracting service area';

type Params = Promise<{ slug: string }>;

export default async function OG({ params }: { params: Params }) {
  const { slug } = await params;
  const city = ALL_SERVICE_AREAS.find((c) => c.slug === slug);
  const data = CITY_DATA[slug];
  if (!city || !data) notFound();

  const leadServices = data.marketEmphasis
    .slice(0, 3)
    .map((s) =>
      s
        .replace('exterior-repairs', 'exteriors')
        .replace('general-repairs', 'repairs')
    )
    .join(' · ');

  return renderOgCard({
    eyebrow: 'Service Area',
    title: `${city.city}, ${city.state}`,
    subtitle: leadServices
      ? `Premium contracting — ${leadServices}.`
      : 'Premium remodeling and exterior contracting.',
  });
}

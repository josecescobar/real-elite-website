import { renderOgCard, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';

export const runtime = 'nodejs';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt =
  'Real Elite Contracting — Veteran-Owned · Built With Military Precision';

export default async function OG() {
  return renderOgCard({
    eyebrow: 'Veteran-Owned',
    title: 'Built With Military Precision.',
    subtitle:
      'Premium remodeling and exterior contracting across the WV–MD–VA region.',
  });
}

import { renderOgCard, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';

export const runtime = 'nodejs';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt =
  'Real Elite Contracting — family-run design-build remodeling for Loudoun County, VA';

export default async function OG() {
  return renderOgCard({
    eyebrow: 'Family-Run Design-Build',
    title: 'Design-build remodeling for Loudoun homes.',
    subtitle:
      'Kitchens, primary suites, lower levels, additions and outdoor living — Leesburg, Ashburn, Middleburg and Hunt Country.',
  });
}

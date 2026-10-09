import type { ServiceArea } from '@/lib/constants';

const WASHINGTON_COUNTY_MD = new Set(['Hagerstown', 'Boonsboro', 'Sharpsburg', 'Williamsport']);

/** Positive service-area line for Maryland pages. No license sentence either way. */
export function mdServingLine(city: string): string {
  if (WASHINGTON_COUNTY_MD.has(city)) {
    return `Serving ${city} and Washington County, Maryland.`;
  }
  if (city === 'Mount Airy') {
    return 'Serving Mount Airy, on the Frederick and Carroll county line in Maryland.';
  }
  if (city === 'Frederick') {
    return 'Serving Frederick and Frederick County, Maryland.';
  }
  return `Serving ${city} and Frederick County, Maryland.`;
}

export type TrustBullet = {
  text: string;
  claims: readonly string[];
};

/** Only substantiated credentials and scope questions belong in this shared block. */
export function trustBullets(city: string, serviceTitle: string, state: string): readonly TrustBullet[] {
  return [
    { text: 'Family-run remodeling and exterior contracting.', claims: [] },
    { text: `Discuss the scope of your ${city} ${serviceTitle.toLowerCase()} project at the estimate.`, claims: [] },
    {
      text: state === 'MD'
        ? mdServingLine(city)
        : state === 'VA'
          ? 'Virginia Class A Contractor 2705198604 (HIC) — residential home improvement.'
          : 'WV Contractor License WV062432.',
      claims: [],
    },
  ];
}

export function selectTrustBullets(area: ServiceArea, _serviceSlug: string, serviceTitle: string): string[] {
  return trustBullets(area.city, serviceTitle, area.state).map((bullet) => bullet.text);
}

import type { ServiceArea } from '@/lib/constants';

export type TrustBullet = {
  text: string;
  claims: readonly string[];
};

/** Only substantiated credentials and scope questions belong in this shared block. */
export function trustBullets(city: string, serviceTitle: string, state: string): readonly TrustBullet[] {
  return [
    { text: 'Veteran-owned remodeling and exterior contracting.', claims: [] },
    { text: `Discuss the scope of your ${city} ${serviceTitle.toLowerCase()} project at the estimate.`, claims: [] },
    {
      text: state === 'MD'
        ? 'Frederick is a service-area location; no Maryland contractor license is claimed.'
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

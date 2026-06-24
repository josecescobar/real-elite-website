import JsonLd from './JsonLd';
import { BUSINESS } from '@/lib/constants';

type Props = {
  serviceType: string;
  serviceTitle: string;
  serviceSlug: string;
  description: string;
  areaServed: string[];
};

/**
 * Per-service Service JSON-LD. Provides the schema.org Service entity
 * linked to the GeneralContractor in the global layout.
 */
export default function ServiceSchema({
  serviceType,
  serviceTitle,
  serviceSlug,
  description,
  areaServed,
}: Props) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: serviceTitle,
    serviceType,
    description,
    provider: {
      '@type': 'GeneralContractor',
      name: BUSINESS.name,
      url: `${BUSINESS.url}/`,
      telephone: BUSINESS.phoneRaw,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Martinsburg',
        addressRegion: 'WV',
        postalCode: '25401',
        addressCountry: 'US',
      },
    },
    areaServed: areaServed.map((a) => ({ '@type': 'Place', name: a })),
    url: `${BUSINESS.url}/services/${serviceSlug}`,
  };

  return <JsonLd schema={schema} />;
}

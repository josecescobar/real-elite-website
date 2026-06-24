import type { Metadata } from 'next';
import { BUSINESS } from '@/lib/constants';
import { SERVICE_DATA } from '@/lib/services-data';
import ServicePageTemplate from '@/components/services/ServicePageTemplate';

const data = SERVICE_DATA.basements;

export const metadata: Metadata = {
  title: data.metaTitle,
  description: data.metaDescription,
  keywords: data.keywords,
  alternates: { canonical: `${BUSINESS.url}/services/${data.slug}` },
  openGraph: {
    title: data.metaTitle,
    description: data.metaDescription,
    url: `${BUSINESS.url}/services/${data.slug}`,
    type: 'website',
    images: [{ url: `${BUSINESS.url}/images/og-image.jpg`, width: 1200, height: 630 }],
  },
};

export default function BasementsPage() {
  return <ServicePageTemplate data={data} />;
}

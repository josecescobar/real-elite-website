import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { SERVICE_DATA } from '@/lib/services-data';
import ServicePageTemplate from '@/components/services/ServicePageTemplate';

const data = SERVICE_DATA['general-repairs'];

export const metadata: Metadata = buildMetadata({
  title: data.metaTitle,
  description: data.metaDescription,
  path: `/services/${data.slug}`,
  keywords: data.keywords,
});

export default function GeneralRepairsPage() {
  return <ServicePageTemplate data={data} />;
}

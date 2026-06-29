import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { SERVICE_DATA } from '@/lib/services-data';
import ServicePageTemplate from '@/components/services/ServicePageTemplate';

const data = SERVICE_DATA.decks;

export const metadata: Metadata = buildMetadata({
  title: data.metaTitle,
  description: data.metaDescription,
  path: `/services/${data.slug}`,
  keywords: data.keywords,
});

export default function DecksPage() {
  return <ServicePageTemplate data={data} />;
}

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BUSINESS } from '@/lib/constants';
import { getPavingService, PAVING_SERVICE_SLUGS } from '@/lib/paving-data';
import PavingServiceTemplate from '@/components/paving/PavingServiceTemplate';

export const dynamicParams = false;

type Params = { service: string };

export function generateStaticParams() {
  return PAVING_SERVICE_SLUGS.map((service) => ({ service }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { service: slug } = await params;
  const service = getPavingService(slug);
  if (!service) return { title: 'Not Found' };

  const title = `${service.metaTitle} | ${BUSINESS.name}`;
  return {
    title,
    description: service.metaDescription,
    keywords: service.keywords,
    alternates: { canonical: `${BUSINESS.url}/paving/${service.slug}` },
    openGraph: {
      title,
      description: service.metaDescription,
      url: `${BUSINESS.url}/paving/${service.slug}`,
      type: 'website',
    },
  };
}

export default async function PavingServicePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { service: slug } = await params;
  const service = getPavingService(slug);
  if (!service) notFound();
  return <PavingServiceTemplate service={service} />;
}

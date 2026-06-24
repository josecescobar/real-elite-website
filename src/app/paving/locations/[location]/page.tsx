import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BUSINESS } from '@/lib/constants';
import { getPavingLocation, PAVING_LOCATION_SLUGS } from '@/lib/paving-data';
import PavingLocationTemplate from '@/components/paving/PavingLocationTemplate';

export const dynamicParams = false;

type Params = { location: string };

export function generateStaticParams() {
  return PAVING_LOCATION_SLUGS.map((location) => ({ location }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { location: slug } = await params;
  const location = getPavingLocation(slug);
  if (!location) return { title: 'Not Found' };

  const title = `${location.metaTitle} | ${BUSINESS.name}`;
  return {
    title,
    description: location.metaDescription,
    keywords: location.keywords,
    alternates: { canonical: `${BUSINESS.url}/paving/locations/${location.slug}` },
    openGraph: {
      title,
      description: location.metaDescription,
      url: `${BUSINESS.url}/paving/locations/${location.slug}`,
      type: 'website',
    },
  };
}

export default async function PavingLocationPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { location: slug } = await params;
  const location = getPavingLocation(slug);
  if (!location) notFound();
  return <PavingLocationTemplate location={location} />;
}

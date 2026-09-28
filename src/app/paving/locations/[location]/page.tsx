import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BUSINESS } from '@/lib/constants';
import { buildMetadata, fitTitle } from '@/lib/seo';
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
  if (!location) return { title: 'Not Found', robots: { index: false } };

  const title = fitTitle(`${location.metaTitle} | ${BUSINESS.name}`);
  return {
    ...buildMetadata({
      path: `/paving/locations/${location.slug}`,
      title,
      description: location.metaDescription,
      keywords: location.keywords,
      omitSocialImage: true,
    }),
    title,
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

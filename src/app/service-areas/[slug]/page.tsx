import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  BUSINESS,
  ALL_SERVICE_AREAS,
  CITY_DATA,
} from '@/lib/constants';
import CityPageTemplate from '@/components/services/CityPageTemplate';

type Params = { slug: string };

export function generateStaticParams() {
  return ALL_SERVICE_AREAS.map((area) => ({ slug: area.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const city = ALL_SERVICE_AREAS.find((c) => c.slug === slug);
  if (!city) return { title: 'Not Found' };

  const title = `Contractor in ${city.city}, ${city.state} | ${BUSINESS.name}`;
  const description = `Bathroom remodels, kitchens, decks, roofing, and additions in ${city.city}, ${city.state}. Veteran-owned contractor — built with military precision. Free written estimate.`;

  return {
    title,
    description,
    keywords: [
      `${city.city} contractor`,
      `${city.city} general contractor`,
      `${city.city} bathroom remodel`,
      `${city.city} kitchen remodel`,
      `${city.city} roofing`,
      `${city.city} siding`,
      `${city.city} decks`,
      `${city.city} remodeling`,
      `${city.city} home additions`,
      `${city.state} contractor`,
    ],
    alternates: { canonical: `${BUSINESS.url}/service-areas/${slug}` },
    openGraph: {
      title,
      description,
      url: `${BUSINESS.url}/service-areas/${slug}`,
      type: 'website',
    },
  };
}

export default async function CityServicePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const city = ALL_SERVICE_AREAS.find((c) => c.slug === slug);
  const data = CITY_DATA[slug];

  if (!city || !data) notFound();

  return <CityPageTemplate city={city} data={data} />;
}

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  BUSINESS,
  ALL_SERVICE_AREAS,
  CITY_DATA,
  areaHeroLane,
  formatAreaPlace,
} from '@/lib/constants';
import { buildMetadata, fitTitle } from '@/lib/seo';
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
  if (!city) return { title: 'Not Found', robots: { index: false } };

  // formatAreaPlace, not `${city}, ${state}` — the region row is called
  // "Northern Virginia" and the generic form rendered "Northern Virginia, VA".
  const place = formatAreaPlace(city);
  // The premium (design-consultation) counties are searched as "remodeling
  // contractor <town>", so their title leads with that phrase and the
  // description names the rooms those pages sell. fitTitle drops to the short
  // brand when the long one would pass 60 characters. The Panhandle and other
  // home-market rows keep the original title and estimate-led description.
  const consultation = areaHeroLane(city) === 'consultation';
  const title = consultation
    ? fitTitle(`Remodeling Contractor in ${place} | ${BUSINESS.name}`)
    : `Contractor in ${place} | ${BUSINESS.name}`;
  // Kept under the 160-char SERP budget for the longest city name in the
  // catalog ("Berkeley Springs, WV" / "Prince William County, VA") — see
  // fitTitle/TITLE_MAX in src/lib/seo.ts for the sibling title rule, and
  // scripts/audit-site.mjs which enforces both.
  const description = consultation
    ? `Bathroom remodels, kitchens, decks, roofing and additions in ${place} — family-run, built with military precision. Free written estimate.`
    : `Bathroom remodels, kitchens, decks, roofing and additions in ${place} — family-run, built with military precision. Free written estimate.`;

  return {
    ...buildMetadata({
      path: `/service-areas/${slug}`,
      title,
      description,
      keywords: [
        ...(consultation
          ? [`remodeling contractor ${city.city}`, `design-build ${city.city}`]
          : []),
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
      omitSocialImage: true,
    }),
    title,
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

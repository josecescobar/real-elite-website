import Image from 'next/image';
import Link from 'next/link';
import { isStockImage, isVerifiedWorkImage } from '@/lib/stock-images';
import {
  FINANCING_DISCLAIMER,
  PROJECT_TRUST_PHOTOS,
  investmentCategoryFor,
  type ProjectTrustSlug,
  type TrustPhoto,
} from '@/lib/project-trust';

function PhotoGrid({ images }: { images: readonly TrustPhoto[] }) {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {images.map((image) => (
        <li key={image.src} className="relative aspect-[4/3] overflow-hidden rounded-lg">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 640px) 100vw, 30vw"
            className="object-cover"
          />
        </li>
      ))}
    </ul>
  );
}

/**
 * One link to the investment table, the three published ranges, and three photos.
 * Stock photos stay under "Design ideas" and are not called completed work.
 */
export default function ProjectInvestmentBand({ serviceSlug }: { serviceSlug: ProjectTrustSlug }) {
  const category = investmentCategoryFor(serviceSlug);
  const photos = PROJECT_TRUST_PHOTOS[serviceSlug];
  const work = photos.filter((photo) => isVerifiedWorkImage(photo.src));
  const ideas = photos.filter((photo) => isStockImage(photo.src));
  const tiers = category.tiers.slice(0, 3);

  return (
    <section className="bg-steel-50 rounded-lg border-t-4 border-brand-red p-7 md:p-10 space-y-8">
      <div>
        <p className="text-brand-red text-xs uppercase tracking-[0.18em] font-semibold mb-2">
          Typical investment
        </p>
        <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-navy-800">
          {category.title}
        </h2>
        <p className="text-charcoal-600 mt-3 leading-relaxed">
          <span className="text-xs uppercase tracking-[0.14em] text-charcoal-500 mr-2">Typically</span>
          {category.typical}. These are Loudoun County and Northern Virginia market ranges, not quotes.
        </p>
      </div>

      <dl className="divide-y divide-charcoal-200 border-y border-charcoal-200">
        {tiers.map((tier) => (
          <div key={tier.name} className="grid grid-cols-1 sm:grid-cols-2 gap-1 py-4">
            <dt className="font-heading text-navy-800 font-bold">{tier.name}</dt>
            <dd className="text-navy-800 font-semibold tabular-nums">{tier.range}</dd>
          </div>
        ))}
      </dl>

      {work.length > 0 ? (
        <div>
          <h3 className="font-heading text-xl font-extrabold text-navy-800 mb-4">
            Recent {category.title.toLowerCase()} photos
          </h3>
          <PhotoGrid images={work} />
        </div>
      ) : null}

      {ideas.length > 0 ? (
        <div>
          <p className="text-brand-red text-xs uppercase tracking-[0.18em] font-semibold mb-2">
            Design ideas
          </p>
          <PhotoGrid images={ideas} />
        </div>
      ) : null}

      <div className="flex flex-col gap-4">
        <Link
          href={`/investment#${category.slug}`}
          className="link-editorial inline-flex text-sm font-semibold text-navy-800"
        >
          See the investment table
        </Link>
        <p className="text-charcoal-600 text-sm leading-relaxed">{FINANCING_DISCLAIMER}</p>
        <Link href="/financing" className="link-editorial inline-flex text-sm font-semibold text-navy-800">
          Financing options
        </Link>
      </div>
    </section>
  );
}

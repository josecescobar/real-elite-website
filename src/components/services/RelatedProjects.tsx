import Image from 'next/image';
import type { ServiceImage } from '@/lib/services-data';
import { isStockImage } from '@/lib/stock-images';

type Props = {
  images: readonly ServiceImage[] | ServiceImage[];
  serviceTitle: string;
};

function Grid({ images }: { images: readonly ServiceImage[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((img) => (
        <div
          key={img.src}
          className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-md group"
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </div>
      ))}
    </div>
  );
}

/**
 * The service-page photo gallery. Only Real Elite's own photos appear under
 * "Recent … projects". Stock photography is split out under a labelled
 * "Design inspiration" heading, so it can never read as a completed job.
 */
export default function RelatedProjects({ images, serviceTitle }: Props) {
  if (!images || images.length === 0) return null;
  const work = images.filter((img) => !isStockImage(img.src));
  const inspiration = images.filter((img) => isStockImage(img.src));

  return (
    <section className="space-y-12">
      {work.length > 0 && (
        <div>
          <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-navy-800 mb-6">
            Recent {serviceTitle} projects
          </h2>
          <Grid images={work} />
        </div>
      )}
      {inspiration.length > 0 && (
        <div>
          <p className="text-brand-red text-xs uppercase tracking-[0.18em] font-semibold mb-2">
            Design inspiration
          </p>
          <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-navy-800 mb-3">
            {serviceTitle} ideas
          </h2>
          <p className="text-charcoal-600 text-sm mb-6 max-w-2xl">
            Stock photography for style reference. These are not Real Elite projects.
          </p>
          <Grid images={inspiration} />
        </div>
      )}
    </section>
  );
}

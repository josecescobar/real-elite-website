import Image from 'next/image';
import type { ServiceImage } from '@/lib/services-data';
import { isVerifiedWorkImage } from '@/lib/stock-images';

type Props = {
  images: readonly ServiceImage[] | ServiceImage[];
  serviceTitle: string;
};

/**
 * The service-page photo gallery. Only photos that pass `isVerifiedWorkImage`
 * appear. Stock is dropped, not relabeled.
 */
export default function RelatedProjects({ images, serviceTitle }: Props) {
  if (!images || images.length === 0) return null;
  const work = images.filter((img) => isVerifiedWorkImage(img.src));
  if (work.length === 0) return null;

  return (
    <section>
      <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-navy-800 mb-6">
        Recent {serviceTitle} projects
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {work.map((img) => (
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
    </section>
  );
}

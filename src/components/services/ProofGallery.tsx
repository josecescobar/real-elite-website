import Image from 'next/image';
import type { ProofPhoto } from '@/lib/proof-package';

/**
 * Real project photos with the caption under the image, not only in alt text.
 * Callers pass photos already limited to published, verified work.
 */
export default function ProofGallery({
  photos,
  heading,
}: {
  photos: readonly ProofPhoto[];
  heading: string;
}) {
  if (photos.length === 0) return null;

  return (
    <div>
      <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-navy-800 mb-3">
        {heading}
      </h2>
      <p className="text-charcoal-500 text-sm mb-6">
        Published Real Elite photos. A town is named only when that photo is tagged to the town.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {photos.map((img) => (
          <figure key={img.src} className="overflow-hidden rounded-md shadow-sm bg-white">
            <div className="relative aspect-[4/3]">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 100vw, 240px"
                className="object-cover"
              />
            </div>
            <figcaption className="px-3 py-2 text-sm text-charcoal-700 leading-snug">
              {img.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

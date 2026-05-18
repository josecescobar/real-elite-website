import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { GALLERY_IMAGES } from '@/lib/constants';

// One representative image per featured category, kept in order.
const FEATURED_CATEGORIES = [
  'Roofing',
  'Decks',
  'Exterior',
  'Remodeling',
  'New Construction',
  'Siding',
] as const;

const featuredImages = FEATURED_CATEGORIES.map((category) => {
  const image = GALLERY_IMAGES.find((img) => img.category === category);
  return image ? { ...image, category } : null;
}).filter((img): img is NonNullable<typeof img> => img !== null);

export const ProjectGallery = () => {
  return (
    <section className="w-full bg-gray-50 py-20 md:py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <p className="text-[#c0392b] font-semibold text-sm uppercase tracking-widest mb-3">
              Recent Work
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-[#1a2744]">
              Projects We&apos;re Proud Of
            </h2>
          </div>
          <Link
            href="/gallery"
            className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-[#1a2744] hover:text-[#c0392b] transition-colors"
          >
            View Full Gallery
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredImages.map((image) => (
            <Link
              key={image.src}
              href="/gallery"
              className="group relative rounded-xl overflow-hidden aspect-[4/3] block"
              aria-label={`View ${image.category} projects in the gallery`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a2744]/80 via-[#1a2744]/10 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-xs font-semibold uppercase tracking-widest text-white/80">
                  {image.category}
                </span>
                <p className="text-white font-semibold text-sm mt-1 line-clamp-2">
                  {image.alt}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center md:hidden">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#1a2744] hover:text-[#c0392b] transition-colors"
          >
            View Full Gallery
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProjectGallery;

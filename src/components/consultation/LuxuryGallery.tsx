import Image from 'next/image';
import { isVerifiedWorkImage, VERIFIED_CATEGORY_PHOTOS } from '@/lib/stock-images';

type Img = { src: string; alt: string; tag: string };

/** Real jobs only. Basement and addition stay off this gallery until a real photo exists. */
const WORK: Img[] = [
  { ...VERIFIED_CATEGORY_PHOTOS.kitchen, tag: 'Kitchen' },
  { ...VERIFIED_CATEGORY_PHOTOS.bathroom, tag: 'Primary Bath' },
  { ...VERIFIED_CATEGORY_PHOTOS.outdoor, tag: 'Outdoor Living' },
  { ...VERIFIED_CATEGORY_PHOTOS.living, tag: 'Whole-Home' },
];

type Props = {
  title?: string;
  subtitle?: string;
};

export default function LuxuryGallery({
  title = 'Recent work',
  subtitle = 'Kitchens, primary baths, outdoor living, and whole-home finishes from Real Elite jobs.',
}: Props) {
  const images = WORK.filter((img) => isVerifiedWorkImage(img.src));

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="max-w-3xl">
          <p className="text-brand-red text-xs uppercase tracking-[0.18em] font-semibold mb-3">
            Our work
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-navy-800 leading-tight">
            {title}
          </h2>
          <p className="text-charcoal-600 mt-3 text-base leading-relaxed">{subtitle}</p>
        </div>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-4">
          {images.map((img) => (
            <figure
              key={img.src}
              className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-card-elevated bg-charcoal-100 group"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 50vw, 40vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-navy-950/85 via-navy-900/30 to-transparent p-4">
                <span className="text-[0.65rem] uppercase tracking-[0.15em] text-brand-red font-bold">
                  {img.tag}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

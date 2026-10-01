import Image from 'next/image';
import { isStockImage, isVerifiedWorkImage } from '@/lib/stock-images';

// Stock photography for the consultation gallery. No caption. Verified work
// photos and unverified assets are left out of this gallery.

type Img = { src: string; alt: string; tag: string };

const INTERIOR_PHOTOS: Img[] = [
  {
    src: '/images/projects/kitchens/gray-marble-waterfall.jpg',
    alt: 'kitchen with gray-marble waterfall island and modern cabinetry',
    tag: 'Kitchen',
  },
  {
    src: '/images/projects/bathrooms/shower-stone-accent.jpg',
    alt: 'primary bath with stone-accent shower and marble tile',
    tag: 'Primary Bath',
  },
  {
    src: '/images/projects/kitchens/island-lantern-pendants.jpg',
    alt: 'kitchen with custom island and lantern pendants',
    tag: 'Kitchen',
  },
  {
    src: '/images/projects/bathrooms/tub-shower-tile.jpg',
    alt: 'primary bath with freestanding tub and large-format tile',
    tag: 'Primary Bath',
  },
  {
    src: '/images/projects/kitchens/two-tone-black-hood.jpg',
    alt: 'kitchen with two-tone cabinetry and matte-black hood',
    tag: 'Kitchen',
  },
  {
    src: '/images/projects/kitchens/white-island-chairs.jpg',
    alt: 'white kitchen with island seating',
    tag: 'Kitchen',
  },
];

const MORE_PHOTOS: Img[] = [
  {
    src: '/images/inspiration/luxury-bathroom-marble-tile.jpg',
    alt: 'luxury primary bath with marble tile and freestanding tub',
    tag: 'Primary Bath',
  },
  {
    src: '/images/inspiration/wholehome-kitchen-refresh.webp',
    alt: 'open-concept luxury kitchen with island and pendant lighting',
    tag: 'Kitchen',
  },
  {
    src: '/images/inspiration/basement-home-theater.jpg',
    alt: 'finished lower-level home theater with tiered seating',
    tag: 'Lower Level',
  },
  {
    src: '/images/inspiration/suite-spa-bath.jpg',
    alt: 'primary suite spa bath with double vanity',
    tag: 'Primary Bath',
  },
  {
    src: '/images/inspiration/kitchenette-refresh.webp',
    alt: 'compact kitchenette with white cabinetry, a sink, and a small refrigerator',
    tag: 'Lower Level',
  },
  {
    src: '/images/inspiration/wholehome-foyer-staircase.jpg',
    alt: 'luxury whole-home foyer and staircase',
    tag: 'Whole-Home',
  },
];

function stockOnly(images: readonly Img[]): Img[] {
  return images.filter((img) => isStockImage(img.src) && !isVerifiedWorkImage(img.src));
}

type Props = {
  /** Section title. The consultation page may pass its own. */
  title?: string;
  /** Subtitle / kicker. */
  subtitle?: string;
};

export default function LuxuryGallery({
  title = 'Kitchens, baths, and whole homes',
  subtitle = 'Explore kitchen, bathroom, and whole-home finishes for your consultation.',
}: Props) {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="max-w-3xl">
          <p className="text-brand-red text-xs uppercase tracking-[0.18em] font-semibold mb-3">
            Design Ideas
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-navy-800 leading-tight">
            {title}
          </h2>
          <p className="text-charcoal-600 mt-3 text-base leading-relaxed">{subtitle}</p>
        </div>

        <div className="mt-12">
          <div className="mb-5">
            <h3 className="font-heading text-lg md:text-xl font-bold text-navy-800">
              Kitchens and baths
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {stockOnly(INTERIOR_PHOTOS).map((img) => (
              <figure
                key={img.src}
                className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-card-elevated bg-charcoal-100 group"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 280px"
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

        <div className="mt-16">
          <div className="mb-5">
            <h3 className="font-heading text-lg md:text-xl font-bold text-navy-800">
              Lower levels and whole homes
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {stockOnly(MORE_PHOTOS).map((img) => (
              <figure
                key={img.src}
                className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-sm bg-charcoal-100 group"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 280px"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-navy-950/70 via-navy-900/20 to-transparent p-4">
                  <span className="text-[0.65rem] uppercase tracking-[0.15em] text-white font-bold">
                    {img.tag}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

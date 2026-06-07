import Image from 'next/image';

/* ─────────────────────────────────────────────────────────────────────────
 * LuxuryGallery
 *
 * Two clearly-distinguished bands of imagery:
 *
 *   1. RECENT WORK — actual Real Elite project photos pulled from
 *      /public/images/projects/* (kitchens, bathrooms, basements).
 *      Labeled as recent Real Elite work without naming specific clients.
 *
 *   2. DESIGN INSPIRATION — clearly-labeled inspiration imagery from
 *      /public/images/inspiration/* showing the kind of work the
 *      consultation can produce. Honest framing: this band is about
 *      possibilities, not portfolio claims. Critical to avoid
 *      misrepresentation in a luxury market where one credibility hit
 *      ends the deal.
 * ───────────────────────────────────────────────────────────────────── */

type Img = { src: string; alt: string; tag: string };

const RECENT_WORK: Img[] = [
  {
    src: '/images/projects/kitchens/gray-marble-waterfall.jpg',
    alt: 'Finished kitchen with gray-marble waterfall island and modern cabinetry',
    tag: 'Kitchen',
  },
  {
    src: '/images/projects/bathrooms/shower-stone-accent.jpg',
    alt: 'Finished primary bath with stone-accent shower and marble tile',
    tag: 'Primary Bath',
  },
  {
    src: '/images/projects/kitchens/island-lantern-pendants.jpg',
    alt: 'Finished kitchen with custom island and lantern pendants',
    tag: 'Kitchen',
  },
  {
    src: '/images/projects/bathrooms/tub-shower-tile.jpg',
    alt: 'Finished primary bath with freestanding tub and large-format tile',
    tag: 'Primary Bath',
  },
  {
    src: '/images/projects/kitchens/two-tone-black-hood.jpg',
    alt: 'Finished kitchen with two-tone cabinetry and matte-black hood',
    tag: 'Kitchen',
  },
  {
    src: '/images/projects/kitchens/white-island-chairs.jpg',
    alt: 'Finished white kitchen with island seating',
    tag: 'Kitchen',
  },
];

const INSPIRATION: Img[] = [
  {
    src: '/images/inspiration/luxury-bathroom-marble-tile.jpg',
    alt: 'Inspiration: luxury primary bath with marble tile and freestanding tub',
    tag: 'Primary Bath',
  },
  {
    src: '/images/inspiration/wholehome-open-kitchen.jpg',
    alt: 'Inspiration: open-concept luxury kitchen with island and pendant lighting',
    tag: 'Kitchen',
  },
  {
    src: '/images/inspiration/basement-home-theater.jpg',
    alt: 'Inspiration: finished lower-level home theater with tiered seating',
    tag: 'Lower Level',
  },
  {
    src: '/images/inspiration/suite-spa-bath.jpg',
    alt: 'Inspiration: primary suite spa bath with double vanity',
    tag: 'Primary Bath',
  },
  {
    src: '/images/inspiration/basement-wet-bar.jpg',
    alt: 'Inspiration: lower-level wet bar with stone counter and pendant lighting',
    tag: 'Lower Level',
  },
  {
    src: '/images/inspiration/wholehome-foyer-staircase.jpg',
    alt: 'Inspiration: luxury whole-home foyer and staircase',
    tag: 'Whole-Home',
  },
];

type Props = {
  /** Section title. Defaults to "Recent Work & Inspiration" but the
   * consultation page may want different copy. */
  title?: string;
  /** Subtitle / kicker. */
  subtitle?: string;
};

export default function LuxuryGallery({
  title = 'Recent Work & Design Inspiration',
  subtitle = 'A look at finished Real Elite projects (top) and the kind of work the consultation can produce (below).',
}: Props) {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="max-w-3xl">
          <p className="text-brand-red text-xs uppercase tracking-[0.18em] font-semibold mb-3">
            Portfolio
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-navy-800 leading-tight">
            {title}
          </h2>
          <p className="text-charcoal-600 mt-3 text-base leading-relaxed">{subtitle}</p>
        </div>

        {/* Recent Work — real Real Elite projects */}
        <div className="mt-12">
          <div className="flex items-baseline justify-between mb-5">
            <h3 className="font-heading text-lg md:text-xl font-bold text-navy-800">
              Recent Real Elite Work
            </h3>
            <span className="text-charcoal-500 text-xs uppercase tracking-[0.15em] font-semibold">
              Finished Projects
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {RECENT_WORK.map((img) => (
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

        {/* Design Inspiration — clearly labeled */}
        <div className="mt-16">
          <div className="flex items-baseline justify-between mb-5">
            <h3 className="font-heading text-lg md:text-xl font-bold text-navy-800">
              Design Inspiration
            </h3>
            <span className="text-charcoal-500 text-xs uppercase tracking-[0.15em] font-semibold">
              What&apos;s Possible
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {INSPIRATION.map((img) => (
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
                    {img.tag} · Inspiration
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="text-charcoal-500 text-xs mt-4 italic">
            Inspiration imagery — representative of the level of finish the consultation is
            calibrated to produce.
          </p>
        </div>
      </div>
    </section>
  );
}

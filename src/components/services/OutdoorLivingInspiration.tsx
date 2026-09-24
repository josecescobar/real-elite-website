import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import TrackedLink from '@/components/analytics/TrackedLink';
import { primaryCtaForService } from '@/lib/cta-intent';

/** Stock inspiration, kept separate from the completed-project gallery. */
export default function OutdoorLivingInspiration() {
  const consultation = primaryCtaForService('decks', {
    luxuryMarket: true,
    consultationType: 'outdoor-living',
  });

  return (
    <section
      aria-labelledby="outdoor-living-inspiration"
      className="rounded-xl border border-steel-200 bg-steel-50 p-6 md:p-8"
    >
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-brand-red">
        A place to gather
      </p>
      <h2
        id="outdoor-living-inspiration"
        className="font-heading text-3xl md:text-4xl font-extrabold text-navy-800"
      >
        Outdoor Living Inspiration
      </h2>
      <p className="mt-4 max-w-xl text-base leading-relaxed text-charcoal-700">
        A screened porch for slow mornings. A covered space for dinner outside.
        Explore ideas for the way you want to use your backyard.
      </p>

      <div className="mt-7 grid grid-cols-1 gap-6 md:grid-cols-[1.25fr_1fr]">
        <figure className="min-w-0">
          <Image
            src="/images/inspiration/loudoun-screened-porch.webp"
            alt="Screened porch with wood decking, lounge chairs, a ceiling fan, and an open kitchen pass-through"
            width={1440}
            height={960}
            sizes="(max-width: 767px) calc(100vw - 96px), (max-width: 1023px) 48vw, 30vw"
            loading="lazy"
            quality={82}
            className="h-auto w-full rounded-lg"
          />
          <figcaption className="mt-4">
            <h3 className="font-heading text-xl font-bold text-navy-800">
              Room for everyday moments
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-charcoal-700">
              Open views, a little shade, and an easy connection to the house.
            </p>
          </figcaption>
        </figure>

        <figure className="min-w-0">
          <Image
            src="/images/inspiration/loudoun-timber-porch.webp"
            alt="Covered porch with a vaulted timber ceiling, dining table, and screened views of trees"
            width={1440}
            height={960}
            sizes="(max-width: 767px) calc(100vw - 96px), (max-width: 1023px) 40vw, 24vw"
            loading="lazy"
            quality={82}
            className="h-auto w-full rounded-lg"
          />
          <figcaption className="mt-4">
            <h3 className="font-heading text-xl font-bold text-navy-800">
              Warm materials. Open air.
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-charcoal-700">
              Timber ceilings and natural textures bring character to a covered gathering space.
            </p>
          </figcaption>
        </figure>
      </div>

      <div className="mt-6 border-t border-steel-200 pt-6">
        <p className="mb-5 text-sm leading-relaxed text-charcoal-600">
          Inspiration photography. Explore Real Elite&apos;s completed work in the gallery below.
        </p>
        <TrackedLink
          href={consultation.href}
          eventName={consultation.eventName}
          eventParams={{ location: 'loudoun_outdoor_inspiration' }}
          className="focus-ring inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-brand-red px-5 py-3.5 text-center text-sm font-bold text-white transition-colors hover:bg-brand-red-dark sm:w-auto"
        >
          Discuss Your Outdoor Project
          <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
        </TrackedLink>
      </div>
    </section>
  );
}

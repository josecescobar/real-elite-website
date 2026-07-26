'use client';

import { useState } from 'react';

type Props = {
  lat: number;
  lng: number;
  /** Formatted address, used for the image's accessible name. */
  address: string;
};

/**
 * Satellite view of the roof we just measured.
 *
 * The measurement on its own is an assertion — a number the visitor is asked
 * to take on faith. Showing the actual roof next to it turns the claim into
 * something they can check with their own eyes, which is the entire reason
 * this exists.
 *
 * It is strictly additive: `/api/roof-aerial` answers 204 whenever imagery
 * is unavailable (no key, no Static Maps entitlement, upstream error), and
 * a 204 makes the browser fire `onError`, so the block unmounts itself and
 * the quote flow continues exactly as it did before. Nothing downstream
 * depends on an image ever loading.
 *
 * Deliberately a plain `<img>`, not `next/image`: the source is our own
 * proxy returning one uncacheable-by-URL-pattern binary per address, so the
 * optimizer would add a hop and a second cache for no gain. The size is
 * fixed and the aspect ratio is reserved in CSS, so there is no layout shift
 * to protect against either.
 */
export default function RoofAerial({ lat, lng, address }: Props) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (failed) return null;

  return (
    <figure className="mt-4 mb-6">
      <div className="relative w-full aspect-[16/10] overflow-hidden rounded-md bg-navy-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/api/roof-aerial?lat=${lat}&lng=${lng}`}
          alt={`Satellite view of the roof at ${address}`}
          width={1280}
          height={800}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
        {loaded && (
          <span className="absolute top-3 left-3 bg-navy-900/90 backdrop-blur-sm text-white text-[0.65rem] font-bold uppercase tracking-[0.15em] px-3 py-1.5 rounded-sm">
            Your roof
          </span>
        )}
      </div>
      {loaded && (
        <figcaption className="text-charcoal-500 text-xs mt-2 leading-relaxed">
          Satellite imagery of {address}. This is the roof the measurement above
          is taken from — not a mock-up or a rendering.
        </figcaption>
      )}
    </figure>
  );
}

/**
 * Proof package for ranking pages.
 *
 * Photos and reviews come only from records the site already publishes.
 * A caption names a town only when that photo is tagged to the town.
 * A review is shown only when its service (if set) matches the page.
 * Nothing here invents a job, a town, or a quote.
 */
import { GALLERY_IMAGES, getServiceArea, type AreaState } from '@/lib/constants';
import { SERVICE_DATA, type ServiceImage } from '@/lib/services-data';
import { isVerifiedWorkImage } from '@/lib/stock-images';
import { REVIEWS, type Review } from '@/lib/reviews';

export type ProofPhoto = {
  src: string;
  alt: string;
  caption: string;
};

const CATEGORY_BY_SERVICE: Record<string, string> = {
  kitchens: 'Kitchens',
  bathrooms: 'Bathrooms',
  decks: 'Decks',
  roofing: 'Roofing',
  siding: 'Exterior',
  remodeling: 'Remodeling',
};

function placeLabel(state?: AreaState, citySlug?: string): string | null {
  if (citySlug) {
    const area = getServiceArea(citySlug);
    if (area) return `${area.city}, ${area.state}`;
  }
  if (state === 'MD') return 'Maryland';
  if (state === 'VA') return 'Virginia';
  if (state === 'WV') return 'West Virginia';
  if (state === 'PA') return 'Pennsylvania';
  return null;
}

function captionFor(alt: string, state?: AreaState, citySlug?: string): string {
  const place = placeLabel(state, citySlug);
  return place ? `${alt} — ${place}` : alt;
}

function pushUnique(out: ProofPhoto[], seen: Set<string>, photo: ProofPhoto, limit: number) {
  if (out.length >= limit || seen.has(photo.src) || !isVerifiedWorkImage(photo.src)) return;
  seen.add(photo.src);
  out.push(photo);
}

/** Verified work photos already on the gallery or the service page, for this service. */
export function proofPhotosForService(serviceSlug: string, limit = 8): ProofPhoto[] {
  const category = CATEGORY_BY_SERVICE[serviceSlug];
  const service = SERVICE_DATA[serviceSlug];
  const seen = new Set<string>();
  const photos: ProofPhoto[] = [];

  if (category) {
    for (const img of GALLERY_IMAGES) {
      if (img.category !== category) continue;
      pushUnique(
        photos,
        seen,
        { src: img.src, alt: img.alt, caption: captionFor(img.alt, img.state, img.citySlug) },
        limit,
      );
    }
  }

  const extras: ServiceImage[] = [
    ...(service?.hero.image ? [service.hero.image] : []),
    ...(service?.overview.image ? [service.overview.image] : []),
    ...(service?.gallery ?? []),
  ];
  for (const img of extras) {
    pushUnique(photos, seen, { src: img.src, alt: img.alt, caption: img.alt }, limit);
  }

  return photos;
}

/** Verified gallery photos tagged to this town, else to its state. Never a guessed town. */
export function proofPhotosForArea(citySlug: string, state: AreaState, limit = 6): ProofPhoto[] {
  const verified = GALLERY_IMAGES.filter((img) => isVerifiedWorkImage(img.src));
  const byCity = verified.filter((img) => img.citySlug === citySlug);
  const pool = byCity.length > 0 ? byCity : verified.filter((img) => img.state === state);
  return pool.slice(0, limit).map((img) => ({
    src: img.src,
    alt: img.alt,
    caption: captionFor(img.alt, img.state, img.citySlug),
  }));
}

/**
 * Published reviews whose service and city, when set, match this page.
 * A roofing review does not appear on a kitchen page. A review with no city
 * is not described as that city's homeowners.
 */
export function proofReviewsFor(opts: { serviceSlug?: string; citySlug?: string }): Review[] {
  return REVIEWS.filter((review) => {
    if (opts.serviceSlug && review.serviceSlug && review.serviceSlug !== opts.serviceSlug) return false;
    if (opts.citySlug && review.citySlug && review.citySlug !== opts.citySlug) return false;
    if (opts.serviceSlug && !review.serviceSlug) return false;
    return true;
  });
}

export function reviewsMatchCity(reviews: readonly Review[], citySlug: string): boolean {
  return reviews.length > 0 && reviews.every((review) => review.citySlug === citySlug);
}

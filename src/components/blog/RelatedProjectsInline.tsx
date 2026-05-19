import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { GALLERY_IMAGES } from '@/lib/constants';

type Props = {
  /** Match against GALLERY_IMAGES.category — case-insensitive substring */
  categoryHint?: string;
  count?: number;
};

/**
 * Mid-article project teaser. Pulls relevant project photos from the
 * global GALLERY_IMAGES based on the post's category.
 */
export default function RelatedProjectsInline({ categoryHint, count = 3 }: Props) {
  const hint = (categoryHint || '').toLowerCase();
  let matches = GALLERY_IMAGES.filter((g) => g.category.toLowerCase().includes(hint));
  if (matches.length < count) {
    matches = matches.concat(
      GALLERY_IMAGES.filter((g) => !matches.includes(g)).slice(0, count - matches.length)
    );
  }
  const picks = matches.slice(0, count);
  if (picks.length === 0) return null;

  return (
    <aside className="not-prose my-12">
      <div className="flex items-end justify-between mb-5">
        <h3 className="font-heading text-xl md:text-2xl font-extrabold text-navy-800">
          See it built
        </h3>
        <Link
          href="/gallery"
          className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-navy-800 hover:text-brand-red transition-colors"
        >
          Full Gallery
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {picks.map((img) => (
          <div
            key={img.src}
            className="relative aspect-square overflow-hidden rounded-md shadow-sm"
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(max-width: 768px) 33vw, 200px"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </aside>
  );
}

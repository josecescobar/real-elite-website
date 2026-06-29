import Image from 'next/image';
import { OWNER } from '@/lib/constants';

/**
 * Owner credibility card — a face and a name behind the brand.
 *
 * When `OWNER.portrait` is set it renders the real headshot; until then it
 * renders a brand-safe monogram (initials) — never a broken image. Drop a
 * real portrait at /public/images/team/owner.jpg and set
 * `OWNER.portrait = '/images/team/owner.jpg'` in constants.ts to swap it in.
 */
function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

export default function OwnerCard({ className = '' }: { className?: string }) {
  return (
    <div
      className={`inline-flex items-center gap-4 bg-steel-50 border border-charcoal-100 rounded-lg p-5 ${className}`}
    >
      {OWNER.portrait ? (
        <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0">
          <Image
            src={OWNER.portrait}
            alt={`${OWNER.name} — ${OWNER.title}`}
            fill
            sizes="64px"
            className="object-cover"
          />
        </div>
      ) : (
        <div
          className="flex items-center justify-center w-16 h-16 rounded-full bg-navy-800 text-white font-heading text-xl font-extrabold shrink-0"
          aria-hidden="true"
        >
          {initials(OWNER.name)}
        </div>
      )}
      <div>
        <p className="font-heading text-navy-800 font-bold leading-tight">{OWNER.name}</p>
        <p className="text-charcoal-500 text-sm mt-1">{OWNER.title}</p>
      </div>
    </div>
  );
}

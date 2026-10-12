import Link from 'next/link';
import { permitGuideForArea } from '@/lib/permit-guide-links';

/** One in-body link from a town page to its county permit guide. Renders nothing when the town is uncovered. */
export default function PermitGuideLink({ areaSlug }: { areaSlug: string }) {
  const guide = permitGuideForArea(areaSlug);
  if (!guide) return null;

  return (
    <p className="mt-6 text-charcoal-700 text-base md:text-lg leading-relaxed" data-permit-guide-link="">
      For this area, see{' '}
      <Link
        href={guide.href}
        className="text-navy-800 underline decoration-charcoal-300 hover:text-brand-red"
      >
        Permits in {guide.county}: what to expect
      </Link>
      .
    </p>
  );
}

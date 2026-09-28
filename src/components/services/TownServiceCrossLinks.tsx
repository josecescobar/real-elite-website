import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import {
  TOWN_SERVICE_PAGES,
  townServicePath,
  type TownServicePage,
} from '@/lib/town-service-pages';

/**
 * Inbound links to the four town-first URLs. Those URLs stay canonicalized to
 * /services/{service}/{town} and out of the sitemap; these links are how a
 * reader reaches them. Do not point the primary service cards here.
 */
function LinkRow({ pages }: { pages: readonly TownServicePage[] }) {
  if (pages.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {pages.map((page) => (
        <Link
          key={townServicePath(page)}
          href={townServicePath(page)}
          className="inline-flex items-center gap-1.5 bg-steel-50 border border-charcoal-200 hover:border-brand-red text-navy-800 hover:text-brand-red rounded-md px-3 py-2 text-sm font-medium transition-colors"
        >
          {page.h1}
          <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      ))}
    </div>
  );
}

export function TownServiceLinksForTown({ townSlug }: { townSlug: string }) {
  const pages = TOWN_SERVICE_PAGES.filter((page) => page.townSlug === townSlug);
  if (pages.length === 0) return null;
  return (
    <div>
      <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-navy-800 mb-3">
        Basements and kitchens
      </h2>
      <p className="text-charcoal-600 text-sm mb-4">
        Permit path and the published cost ranges for this town.
      </p>
      <LinkRow pages={pages} />
    </div>
  );
}

export function TownServiceLinksForService({ serviceSlug }: { serviceSlug: string }) {
  const pages = TOWN_SERVICE_PAGES.filter((page) => page.serviceSlug === serviceSlug);
  if (pages.length === 0) return null;
  return (
    <div>
      <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-navy-800 mb-3">
        Ashburn and Leesburg
      </h2>
      <p className="text-charcoal-600 text-sm mb-4">
        Town pages for this service, with the local permit path.
      </p>
      <LinkRow pages={pages} />
    </div>
  );
}

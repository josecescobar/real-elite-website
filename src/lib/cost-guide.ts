/**
 * The free printable cost guide at /cost-guide.
 *
 * Built ONLY from figures the site already publishes, so the guide can never
 * disagree with the pages it summarises:
 *   - INVESTMENT_GUIDE (src/lib/investment-guide.ts), rendered on /investment
 *     and on the kitchen, bath and basement hubs.
 *   - SERVICE_DATA[*].investment for the service hubs that actually render it.
 *     Kitchens, bathrooms and basements render the investment-guide table
 *     instead (see isProjectTrustPage), so their SERVICE_DATA tiers are
 *     unpublished there and are left out here too.
 *   - Blog posts typed `cost-guide`, linked by title.
 *
 * Do not type a dollar figure into this file. cost-guide.test.ts checks every
 * figure the page renders against these sources.
 *
 * Delivery: a print-styled HTML page with a "Save as PDF" button
 * (window.print). Generating a real PDF at build time would need a headless
 * browser or a PDF library, which is a heavy dependency for one page, and a
 * committed PDF would drift from the data. The browser's own Save-as-PDF
 * produces the same document with no new dependency and no email gate.
 */
import { getAllPosts, type BlogPostMeta } from '@/lib/blog';
import { INVESTMENT_DISCLAIMER, INVESTMENT_GUIDE, type InvestmentCategory } from '@/lib/investment-guide';
import { isProjectTrustPage } from '@/lib/project-trust';
import { SERVICE_DATA, type ServiceData } from '@/lib/services-data';

export const COST_GUIDE_PATH = '/cost-guide';
export const COST_GUIDE_TITLE = 'The Real Elite Home Project Cost Guide';

export { INVESTMENT_DISCLAIMER };

/** Design-build categories, in the order /investment shows them. */
export function designBuildCategories(): readonly InvestmentCategory[] {
  return INVESTMENT_GUIDE;
}

export type ServiceRangeSection = {
  slug: string;
  title: string;
  href: string;
  startingAt: string;
  note?: string;
  tiers: { tier: string; range: string; notes?: string }[];
};

/** Service hubs whose own investment table is live on their page. */
export function serviceRangeSections(): ServiceRangeSection[] {
  return (Object.values(SERVICE_DATA) as ServiceData[])
    .filter((s) => s.investment && !isProjectTrustPage(s.slug))
    .map((s) => ({
      slug: s.slug,
      title: s.title,
      href: `/services/${s.slug}`,
      startingAt: s.investment!.startingAt,
      note: s.investment!.note,
      tiers: s.investment!.tiers.map((t) => ({ tier: t.tier, range: t.range, notes: t.notes })),
    }));
}

/** Published cost articles, newest first. */
export function costArticles(): BlogPostMeta[] {
  return getAllPosts().filter((p) => p.typeSlug === 'cost-guide');
}

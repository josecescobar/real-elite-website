import type { Metadata } from 'next';
import Container from '@/components/shared/Container';
import SalesCommandCenter from '@/components/admin/SalesCommandCenter';
import AnalyticsFreeDocumentGuard from '@/components/analytics/AnalyticsFreeDocumentGuard';
import { LEAD_BUCKETS, type LeadBucket } from '@/lib/sales/types';

export const metadata: Metadata = {
  title: 'Grokbot Command Center',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

const BUCKETS = new Set<string>(['all', ...LEAD_BUCKETS]);

/**
 * The access key is NOT read from the URL. `/sales?key=…` used to unlock
 * the page server-side, which leaked the key into analytics, Clarity,
 * browser history and request logs (security audit 2026-10-24, M1). The
 * client component now asks for the key and sends it in an
 * `Authorization: Bearer` header to /api/sales/leads.
 */
export default async function SalesCommandPage({
  searchParams,
}: {
  searchParams: Promise<{ bucket?: string }>;
}) {
  const params = await searchParams;
  const requested = params.bucket;
  const bucket = (requested && BUCKETS.has(requested) ? requested : 'all') as LeadBucket | 'all';

  return (
    <div className="bg-steel-50 py-12 md:py-16 min-h-[70vh]">
      <AnalyticsFreeDocumentGuard />
      <Container size="wide">
        <p className="text-brand-red text-xs uppercase tracking-[0.18em] font-bold mb-3">
          Internal · Grokbot · Safe Autopilot
        </p>
        <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-navy-800 mb-3">
          Sales command center
        </h1>
        <p className="text-charcoal-600 text-sm leading-relaxed mb-8 max-w-2xl">
          Thumbtack leads land here with a score and a drafted first reply.
          Approve, edit, or take over. Send stays stubbed until Thumbtack
          outbound OAuth is wired — Grokbot will not auto-commit price, dates,
          permits, or discounts.
        </p>
        <SalesCommandCenter initialBucket={bucket} />
      </Container>
    </div>
  );
}

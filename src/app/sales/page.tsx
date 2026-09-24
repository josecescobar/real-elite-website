import type { Metadata } from 'next';
import Container from '@/components/shared/Container';
import SalesCommandCenter from '@/components/admin/SalesCommandCenter';
import { authorizeAgent } from '@/lib/sales/agents/auth';
import { getSalesStore } from '@/lib/sales/store';
import type { Lead, LeadBucket } from '@/lib/sales/types';

export const metadata: Metadata = {
  title: 'Grokbot Command Center',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

type LeadRow = Lead & {
  customer?: { fullName?: string; phone?: string | null; email?: string | null } | null;
};

export default async function SalesCommandPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string; bucket?: string }>;
}) {
  const params = await searchParams;
  const key = params.key?.trim() ?? '';
  const bucket = (params.bucket as LeadBucket | 'all' | undefined) ?? 'all';

  let initialLeads: LeadRow[] = [];
  let initialError: string | null = null;

  if (key) {
    const auth = authorizeAgent(
      new Request('http://localhost/sales', {
        headers: { authorization: `Bearer ${key}` },
      }),
      { required: ['leads:read'] }
    );
    if (!auth.ok) {
      initialError = auth.error;
    } else {
      const store = getSalesStore();
      const leads = await store.listLeads({ bucket, limit: 100 });
      const customers = await Promise.all(leads.map((lead) => store.getCustomer(lead.customerId)));
      initialLeads = leads.map((lead, i) => ({ ...lead, customer: customers[i] }));
    }
  }

  return (
    <div className="bg-steel-50 py-12 md:py-16 min-h-[70vh]">
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
        <SalesCommandCenter
          initialKey={key}
          initialBucket={bucket}
          initialLeads={initialLeads}
          initialError={initialError}
        />
      </Container>
    </div>
  );
}

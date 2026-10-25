import { NextResponse } from 'next/server';
import { authorizeAgent } from '@/lib/sales/agents/auth';
import { getSalesStore } from '@/lib/sales/store';
import type { LeadBucket } from '@/lib/sales/types';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const url = new URL(request.url);
  // Header-only auth: a `?key=` query parameter is ignored (audit M1).
  const auth = authorizeAgent(request, { required: ['leads:read'] });
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const store = getSalesStore();
  const bucket = (url.searchParams.get('bucket') || 'all') as LeadBucket | 'all';
  const query = url.searchParams.get('q') ?? undefined;
  const leads = await store.listLeads({ bucket, query, limit: 100 });
  const customers = await Promise.all(leads.map((lead) => store.getCustomer(lead.customerId)));

  return NextResponse.json({
    leads: leads.map((lead, i) => ({
      ...lead,
      customer: customers[i],
    })),
  });
}

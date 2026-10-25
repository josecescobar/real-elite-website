import { NextResponse } from 'next/server';
import { agentGateDenied, authorizeAgentRequest } from '@/lib/sales/agents/guard';
import { customerView, filterLeadSearch, leadView } from '@/lib/sales/agents/redact';
import { getSalesStore } from '@/lib/sales/store';
import type { LeadBucket } from '@/lib/sales/types';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const url = new URL(request.url);
  // Header-only auth: a `?key=` query parameter is ignored (audit M1).
  const auth = await authorizeAgentRequest(request, { required: ['leads:read'] });
  if (agentGateDenied(auth)) return auth;

  const store = getSalesStore();
  const bucket = (url.searchParams.get('bucket') || 'all') as LeadBucket | 'all';
  const query = url.searchParams.get('q') ?? undefined;
  const leads = filterLeadSearch(
    await store.listLeads({ bucket, query, limit: 100 }),
    query,
    auth.scopes
  );
  // Customer records (email, phone) need `customers:read`; a leads:read-only
  // key gets the lead with contact fields stripped and `customer: null`.
  const customers = await Promise.all(leads.map((lead) => store.getCustomer(lead.customerId)));

  return NextResponse.json({
    leads: leads.map((lead, i) => ({
      ...leadView(lead, auth.scopes),
      customer: customerView(customers[i], auth.scopes),
    })),
  });
}

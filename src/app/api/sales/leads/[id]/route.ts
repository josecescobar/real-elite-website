import { NextResponse } from 'next/server';
import { agentGateDenied, authorizeAgentRequest } from '@/lib/sales/agents/guard';
import { getSalesStore } from '@/lib/sales/store';

export const runtime = 'nodejs';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  // Header-only auth: a `?key=` query parameter is ignored (audit M1).
  const auth = await authorizeAgentRequest(request, { required: ['leads:read'] });
  if (agentGateDenied(auth)) return auth;

  const { id } = await context.params;
  const store = getSalesStore();
  const lead = await store.getLead(id);
  if (!lead) return NextResponse.json({ error: 'Lead not found.' }, { status: 404 });

  const [customer, conversation, messages, followups] = await Promise.all([
    store.getCustomer(lead.customerId),
    store.getConversationByLead(lead.id),
    store.listMessages(lead.id),
    store.listFollowups(lead.id),
  ]);

  return NextResponse.json({ lead, customer, conversation, messages, followups });
}

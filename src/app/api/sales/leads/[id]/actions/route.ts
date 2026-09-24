import { NextResponse } from 'next/server';
import { authorizeAgent } from '@/lib/sales/agents/auth';
import { runAgentTool } from '@/lib/sales/agents/tools';
import { SALES_OWNER } from '@/lib/sales/company';
import { getSalesStore } from '@/lib/sales/store';

export const runtime = 'nodejs';

type Action = 'approve' | 'edit' | 'send' | 'pause' | 'takeover';

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const body = await request.json().catch(() => null);
  const auth = authorizeAgent(request, {
    required: ['leads:write'],
    bodyKey: body && typeof body === 'object' ? (body as { key?: unknown }).key : undefined,
  });
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id } = await context.params;
  const action = typeof body?.action === 'string' ? (body.action as Action) : null;
  if (!action) return NextResponse.json({ error: 'action is required.' }, { status: 400 });

  const store = getSalesStore();
  const lead = await store.getLead(id);
  if (!lead) return NextResponse.json({ error: 'Lead not found.' }, { status: 404 });

  if (action === 'edit' || action === 'approve') {
    const draft = typeof body.draft === 'string' ? body.draft : lead.draftReply;
    const updated = await store.updateLead(id, {
      draftReply: draft,
      draftStatus: action === 'approve' ? 'approved' : 'drafted',
    });
    return NextResponse.json({ ok: true, lead: updated });
  }

  if (action === 'pause') {
    await store.cancelFollowups(id, 'ai_paused');
    const updated = await store.updateLead(id, { aiPaused: true, status: 'paused', bucket: 'follow_up' });
    return NextResponse.json({ ok: true, lead: updated });
  }

  if (action === 'takeover') {
    await store.cancelFollowups(id, 'jose_takeover');
    const updated = await store.updateLead(id, {
      aiPaused: true,
      assignedTo: SALES_OWNER.firstName,
      escalationReasons: [...new Set([...lead.escalationReasons, 'jose_takeover' as const])],
    });
    return NextResponse.json({ ok: true, lead: updated });
  }

  if (action === 'send') {
    const result = await runAgentTool(
      { name: 'send_customer_reply', arguments: { leadId: id, body: body.draft } },
      auth.scopes
    );
    return NextResponse.json({ ok: result.ok, ...((result.data as object) ?? {}), error: result.error });
  }

  return NextResponse.json({ error: 'Unknown action.' }, { status: 400 });
}

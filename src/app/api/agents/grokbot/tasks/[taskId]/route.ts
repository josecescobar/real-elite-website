import { NextResponse } from 'next/server';
import { agentGateDenied, authorizeAgentRequest } from '@/lib/sales/agents/guard';
import { taskView } from '@/lib/sales/agents/redact';
import { getSalesStore } from '@/lib/sales/store';

export const runtime = 'nodejs';

export async function GET(
  request: Request,
  context: { params: Promise<{ taskId: string }> }
) {
  // Header-only auth: a `?key=` query parameter is ignored (audit M1).
  const auth = await authorizeAgentRequest(request, { required: ['leads:read'] });
  if (agentGateDenied(auth)) return auth;

  const { taskId } = await context.params;
  const task = await getSalesStore().getTask(taskId);
  if (!task) return NextResponse.json({ error: 'Task not found.' }, { status: 404 });
  // A task run by a full-scope key may hold contact data; redact per caller.
  return NextResponse.json({ task: taskView(task, auth.scopes) });
}

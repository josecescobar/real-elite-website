import { NextResponse } from 'next/server';
import { agentGateDenied, authorizeAgentRequest } from '@/lib/sales/agents/guard';
import { CHATGPT_TOOL_DEFINITIONS, createAndRunTask } from '@/lib/sales/agents/tasks';
import { getSalesStore } from '@/lib/sales/store';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const url = new URL(request.url);
  // Header-only auth on GET: a `?key=` query parameter is ignored (audit M1).
  const auth = await authorizeAgentRequest(request, { required: ['leads:read'] });
  if (agentGateDenied(auth)) return auth;
  if (url.searchParams.get('tools') === '1') {
    return NextResponse.json({ tools: CHATGPT_TOOL_DEFINITIONS });
  }

  const tasks = await getSalesStore().listTasks(50);
  return NextResponse.json({ tasks });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const record = body && typeof body === 'object' ? body : null;
  const auth = await authorizeAgentRequest(request, {
    required: ['tasks:write'],
    bodyKey: record && 'apiKey' in record ? (record as { apiKey?: unknown }).apiKey : undefined,
  });
  if (agentGateDenied(auth)) return auth;
  if (!record) {
    return NextResponse.json({ error: 'JSON object required.' }, { status: 400 });
  }

  const row = body as {
    taskId?: unknown;
    task_id?: unknown;
    requestingAgent?: unknown;
    requesting_agent?: unknown;
    instruction?: unknown;
    context?: unknown;
    permissions?: unknown;
    createdAt?: unknown;
    created_time?: unknown;
  };

  const instruction = typeof row.instruction === 'string' ? row.instruction : '';
  if (!instruction.trim()) {
    return NextResponse.json({ error: 'instruction is required.' }, { status: 400 });
  }

  const requestingAgent =
    (typeof row.requestingAgent === 'string' && row.requestingAgent) ||
    (typeof row.requesting_agent === 'string' && row.requesting_agent) ||
    'chatgpt';

  const task = await createAndRunTask(
    {
      taskId: typeof row.taskId === 'string' ? row.taskId : typeof row.task_id === 'string' ? row.task_id : undefined,
      requestingAgent,
      instruction,
      context: row.context,
      permissions: row.permissions,
      createdAt: typeof row.createdAt === 'string' ? row.createdAt : typeof row.created_time === 'string' ? row.created_time : undefined,
    },
    auth
  );

  return NextResponse.json({ ok: true, task }, { status: 201 });
}

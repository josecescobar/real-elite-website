import { NextResponse } from 'next/server';
import { authorizeAgent } from '@/lib/sales/agents/auth';
import { CHATGPT_TOOL_DEFINITIONS, createAndRunTask } from '@/lib/sales/agents/tasks';
import { getSalesStore } from '@/lib/sales/store';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const url = new URL(request.url);
  if (url.searchParams.get('tools') === '1') {
    const auth = authorizeAgent(request, { bodyKey: url.searchParams.get('key') });
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
    return NextResponse.json({ tools: CHATGPT_TOOL_DEFINITIONS });
  }

  const auth = authorizeAgent(request, { required: ['leads:read'], bodyKey: url.searchParams.get('key') });
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const tasks = await getSalesStore().listTasks(50);
  return NextResponse.json({ tasks });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'JSON object required.' }, { status: 400 });
  }

  const auth = authorizeAgent(request, {
    required: ['tasks:write'],
    bodyKey: (body as { apiKey?: unknown }).apiKey,
  });
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

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

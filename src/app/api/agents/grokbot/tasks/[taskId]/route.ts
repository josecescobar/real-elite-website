import { NextResponse } from 'next/server';
import { authorizeAgent } from '@/lib/sales/agents/auth';
import { getSalesStore } from '@/lib/sales/store';

export const runtime = 'nodejs';

export async function GET(
  request: Request,
  context: { params: Promise<{ taskId: string }> }
) {
  const url = new URL(request.url);
  const auth = authorizeAgent(request, {
    required: ['leads:read'],
    bodyKey: url.searchParams.get('key'),
  });
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { taskId } = await context.params;
  const task = await getSalesStore().getTask(taskId);
  if (!task) return NextResponse.json({ error: 'Task not found.' }, { status: 404 });
  return NextResponse.json({ task });
}

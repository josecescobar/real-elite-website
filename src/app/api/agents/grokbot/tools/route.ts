import { NextResponse } from 'next/server';
import { authorizeAgent } from '@/lib/sales/agents/auth';
import { TOOL_SCOPES } from '@/lib/sales/agents/scopes';
import { runAgentTool } from '@/lib/sales/agents/tools';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const auth = authorizeAgent(request);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  return NextResponse.json({
    tools: Object.entries(TOOL_SCOPES).map(([name, scopes]) => ({ name, scopes })),
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const auth = authorizeAgent(request, {
    bodyKey: body && typeof body === 'object' ? (body as { apiKey?: unknown }).apiKey : undefined,
  });
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const name = typeof body?.tool === 'string' ? body.tool : typeof body?.name === 'string' ? body.name : '';
  if (!name) return NextResponse.json({ error: 'tool is required.' }, { status: 400 });

  const result = await runAgentTool(
    { name, arguments: (body?.arguments as Record<string, unknown>) ?? {} },
    auth.scopes
  );
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}

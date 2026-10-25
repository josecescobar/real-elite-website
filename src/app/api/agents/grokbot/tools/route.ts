import { NextResponse } from 'next/server';
import { agentGateDenied, authorizeAgentRequest } from '@/lib/sales/agents/guard';
import { TOOL_SCOPES } from '@/lib/sales/agents/scopes';
import { runAgentTool } from '@/lib/sales/agents/tools';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const auth = await authorizeAgentRequest(request, { required: ['leads:read'] });
  if (agentGateDenied(auth)) return auth;
  return NextResponse.json({
    tools: Object.entries(TOOL_SCOPES).map(([name, scopes]) => ({ name, scopes })),
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const name = typeof body?.tool === 'string' ? body.tool : typeof body?.name === 'string' ? body.name : '';
  const required = TOOL_SCOPES[name] ?? ['leads:read' as const];
  const auth = await authorizeAgentRequest(request, {
    required: [...required],
    bodyKey: body && typeof body === 'object' ? (body as { apiKey?: unknown }).apiKey : undefined,
  });
  if (agentGateDenied(auth)) return auth;
  if (!name) return NextResponse.json({ error: 'tool is required.' }, { status: 400 });

  const result = await runAgentTool(
    { name, arguments: (body?.arguments as Record<string, unknown>) ?? {} },
    auth.scopes
  );
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}

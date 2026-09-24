import { NextResponse } from 'next/server';
import { STUB_CONNECTORS } from '@/lib/sales/connectors/stubs';
import { currentSalesMode, thumbtackOutboundReady } from '@/lib/sales/mode';
import { salesStoreKind } from '@/lib/sales/store';
import { thumbtackAuthConfigured } from '@/lib/sales/webhook-auth';
import { env } from '@/lib/env';

export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: 'grokbot-sales',
    agent: 'grokbot',
    mode: currentSalesMode(),
    store: salesStoreKind(),
    thumbtack: {
      webhookAuthConfigured: thumbtackAuthConfigured(),
      outboundReady: thumbtackOutboundReady(),
      webhookPath: '/api/webhooks/thumbtack',
    },
    bridge: {
      tasksPath: '/api/agents/grokbot/tasks',
      apiKeyConfigured: Boolean(env.grokbotApiKey()),
    },
    commandCenter: {
      path: '/sales',
      adminKeyConfigured: Boolean(env.adminToolsKey()),
    },
    llm: {
      xaiConfigured: Boolean(env.xaiApiKey()),
      openaiConfigured: Boolean(env.openaiApiKey()),
    },
    stubs: STUB_CONNECTORS.map((c) => ({ name: c.name, status: c.status })),
  });
}

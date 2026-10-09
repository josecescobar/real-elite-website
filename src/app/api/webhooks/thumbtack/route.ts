import { NextResponse } from 'next/server';
import { buildThumbtackLeadWebhookPayload, postLeadWebhook } from '@/lib/lead-webhook';
import { parseThumbtackPayload } from '@/lib/sales/connectors/thumbtack';
import { currentSalesMode } from '@/lib/sales/mode';
import { ingestInboundLead } from '@/lib/sales/pipeline';
import { salesStoreKind } from '@/lib/sales/store';
import type { InboundLead } from '@/lib/sales/types';
import { authorizeThumbtackWebhook, thumbtackAuthConfigured } from '@/lib/sales/webhook-auth';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

export const runtime = 'nodejs';

const RATE_LIMIT = { max: 60, windowMs: 10 * 60 * 1000 };

export async function GET() {
  const authConfigured = thumbtackAuthConfigured();
  return NextResponse.json({
    ok: true,
    service: 'thumbtack-webhook',
    mode: currentSalesMode(),
    store: salesStoreKind(),
    // Posts are never accepted without auth. This boolean is status only.
    authRequired: true,
    authConfigured,
    acceptingPosts: authConfigured,
    acceptedEvents: [
      'NegotiationCreatedV4',
      'MessageCreatedV4',
      'ReviewCreatedV4',
      'NegotiationUpdatedV4',
      'NegotiationStatusUpdatedV4',
    ],
  });
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limit = await rateLimit(`thumbtack:${ip}`, RATE_LIMIT.max, RATE_LIMIT.windowMs);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } }
    );
  }

  const raw = await request.text();
  const auth = authorizeThumbtackWebhook(request, raw);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  let payload: unknown = null;
  if (raw.trim()) {
    try {
      payload = JSON.parse(raw);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 });
    }
  }
  if (!payload || typeof payload !== 'object') {
    return NextResponse.json({ error: 'JSON object required.' }, { status: 400 });
  }

  const inbound = parseThumbtackPayload(payload);
  if (!inbound) {
    return NextResponse.json({ error: 'Unrecognized Thumbtack payload.' }, { status: 400 });
  }

  try {
    // Never auto-reply. Drafts may be stored; sendThumbtackMessage is not called.
    const result = await ingestInboundLead(inbound, { send: false });
    // NegotiationCreatedV4 is the new-lead event. MessageCreatedV4 is not
    // forwarded: Job Board intake has no timeline-note field, and a repeat
    // call_sid is an idempotent no-op, not a note. ReviewCreatedV4 is stored
    // here and is not posted publicly. Forward failures are logged, not thrown.
    if (inbound.eventType === 'NegotiationCreatedV4') {
      await forwardThumbtackLead(inbound);
    }
    return NextResponse.json({
      ok: true,
      duplicate: result.duplicate,
      eventId: result.eventId,
      lead: result.lead,
      customerId: result.customerId,
      draftReply: result.draftReply,
      send: result.send,
      mode: currentSalesMode(),
      store: salesStoreKind(),
    });
  } catch (err) {
    console.error('Thumbtack webhook pipeline failed', err);
    return NextResponse.json({ error: 'Failed to process lead.' }, { status: 500 });
  }
}

async function forwardThumbtackLead(lead: InboundLead): Promise<void> {
  if (!lead.sourceLeadId) {
    console.error('[thumbtack-webhook] negotiation id missing; lead not forwarded');
    return;
  }
  await postLeadWebhook(
    buildThumbtackLeadWebhookPayload({
      negotiationId: lead.sourceLeadId,
      name: lead.customer.fullName,
      phone: lead.customer.phone,
      email: lead.customer.email,
      address: lead.customer.address,
      city: lead.customer.city,
      state: lead.customer.state,
      zip: lead.customer.zip,
      category: lead.projectType,
      message: lead.message || lead.projectSummary,
      receivedAt: lead.receivedAt,
      urgency: lead.urgency,
    }),
  );
}

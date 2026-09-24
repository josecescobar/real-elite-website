import { NextResponse } from 'next/server';
import { parseThumbtackPayload } from '@/lib/sales/connectors/thumbtack';
import { currentSalesMode } from '@/lib/sales/mode';
import { ingestInboundLead } from '@/lib/sales/pipeline';
import { salesStoreKind } from '@/lib/sales/store';
import { authorizeThumbtackWebhook, thumbtackAuthConfigured } from '@/lib/sales/webhook-auth';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

export const runtime = 'nodejs';

const RATE_LIMIT = { max: 60, windowMs: 10 * 60 * 1000 };

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: 'thumbtack-webhook',
    mode: currentSalesMode(),
    store: salesStoreKind(),
    authRequired: thumbtackAuthConfigured(),
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
    const result = await ingestInboundLead(inbound);
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

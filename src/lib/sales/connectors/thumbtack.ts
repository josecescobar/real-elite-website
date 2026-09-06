import { env } from '@/lib/env';
import type { InboundLead } from '../types';
import type { LeadConnector } from './types';

/**
 * Thumbtack Partner Platform (v4) documented webhook event types:
 *   NegotiationCreatedV4, MessageCreatedV4, ReviewCreatedV4
 *
 * Auth on the webhook is HTTP Basic (username/password) when the partner
 * registers the hook. Thumbtack Pro "paste a URL" is not a documented
 * public API — we still accept a shared Bearer token so Jose can point
 * a receiver here before partner OAuth is approved.
 *
 * Outbound send requires THUMBTACK_ACCESS_TOKEN + THUMBTACK_BUSINESS_ID
 * (OAuth). Until those exist, send is stubbed.
 */

export const THUMBTACK_EVENT_TYPES = [
  'NegotiationCreatedV4',
  'MessageCreatedV4',
  'ReviewCreatedV4',
  // Forward-compatible — not in the public webhook examples.
  'NegotiationUpdatedV4',
  'NegotiationStatusUpdatedV4',
] as const;

type Loose = Record<string, unknown>;

function asRecord(value: unknown): Loose | null {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as Loose) : null;
}

function str(...values: unknown[]): string | undefined {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return undefined;
}

function centsFromUnknown(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value > 10_000 ? Math.round(value) : Math.round(value * 100);
  }
  if (typeof value === 'string') {
    const n = Number(value.replace(/[^0-9.]/g, ''));
    if (Number.isFinite(n) && n > 0) return Math.round(n * 100);
  }
  return undefined;
}

function pickData(payload: Loose): Loose {
  return asRecord(payload.data) ?? asRecord(payload.negotiation) ?? asRecord(payload.lead) ?? payload;
}

export function thumbtackEventId(payload: unknown): string | null {
  const root = asRecord(payload);
  if (!root) return null;
  return (
    str(root.eventID, root.eventId, root.event_id, root.id, root.webhookEventID) ??
    null
  );
}

export function thumbtackEventType(payload: unknown): string {
  const root = asRecord(payload);
  if (!root) return 'Unknown';
  return (
    str(root.eventType, root.event_type, root.type) ??
    (root.review || root.reviewID ? 'ReviewCreatedV4' : null) ??
    (root.message || root.messageID || root.text ? 'MessageCreatedV4' : null) ??
    'NegotiationCreatedV4'
  );
}

export function parseThumbtackPayload(payload: unknown): InboundLead | null {
  const root = asRecord(payload);
  if (!root) return null;
  const data = pickData(root);
  const request = asRecord(data.request) ?? asRecord(data.job) ?? asRecord(root.request) ?? {};
  const customer =
    asRecord(data.customer) ??
    asRecord(data.consumer) ??
    asRecord(root.customer) ??
    asRecord(request.customer) ??
    {};
  const location =
    asRecord(request.location) ??
    asRecord(data.location) ??
    asRecord(customer.location) ??
    asRecord(root.location) ??
    {};
  const messageObj = asRecord(data.message) ?? asRecord(root.message) ?? {};
  const reviewObj = asRecord(data.review) ?? asRecord(root.review) ?? {};

  const eventType = thumbtackEventType(root);
  const sourceLeadId = str(
    data.negotiationID,
    data.negotiationId,
    data.leadID,
    data.leadId,
    root.negotiationID,
    root.leadID,
    request.negotiationID
  );
  const message = str(
    messageObj.text,
    messageObj.body,
    data.messageText,
    root.messageText,
    request.description,
    data.description,
    root.description,
    root.message
  );
  const projectType = str(
    request.category,
    request.categoryName,
    data.category,
    data.categoryName,
    root.category,
    root.projectType
  );
  const projectSummary = str(
    request.description,
    request.title,
    data.description,
    data.title,
    root.projectSummary,
    root.description
  );

  const fullName = str(
    customer.name,
    customer.fullName,
    [customer.firstName, customer.lastName].filter((p) => typeof p === 'string').join(' '),
    root.customerName,
    root.fullName
  );
  const email = str(customer.email, root.email);
  const phone = str(customer.phone, customer.phoneNumber, root.phone);
  const zip = str(location.zipCode, location.zip, customer.zip, root.zip);
  const city = str(location.city, customer.city, root.city);
  const state = str(location.state, customer.state, root.state);
  const address = str(location.address, location.street, customer.address, root.address);

  if (!sourceLeadId && !fullName && !message && !projectType && !projectSummary) {
    return null;
  }

  const statusUpdate = str(data.status, data.negotiationStatus, root.status);
  const ratingRaw = reviewObj.rating ?? data.rating ?? root.rating;
  const reviewText = str(reviewObj.reviewText, reviewObj.text, data.reviewText);
  const review =
    ratingRaw != null || reviewText
      ? { rating: typeof ratingRaw === 'number' ? ratingRaw : Number(ratingRaw) || undefined, text: reviewText }
      : undefined;

  return {
    source: 'thumbtack',
    sourceLeadId,
    eventId: thumbtackEventId(root) ?? undefined,
    eventType,
    customer: { fullName, email, phone, zip, city, state, address },
    projectType,
    projectSummary,
    estimatedValueCents: centsFromUnknown(
      data.estimatedValue ?? data.budget ?? request.budget ?? root.estimatedValue ?? root.budget
    ),
    urgency: str(data.urgency, request.urgency, root.urgency, data.timeline, request.timeline),
    message,
    review,
    statusUpdate: statusUpdate && !/created/i.test(eventType) ? statusUpdate : undefined,
    receivedAt:
      str(root.createdAt, root.createTime, data.createTime, data.createdAt) ?? new Date().toISOString(),
    raw: payload,
  };
}

export async function sendThumbtackMessage(input: {
  sourceLeadId: string;
  body: string;
}): Promise<{ sent: boolean; reason: string; externalId?: string }> {
  const token = env.thumbtackAccessToken();
  const businessId = env.thumbtackBusinessId();
  if (!token || !businessId) {
    return { sent: false, reason: 'thumbtack_outbound_not_configured' };
  }

  try {
    const res = await fetch(
      `https://api.thumbtack.com/api/v4/negotiations/${encodeURIComponent(input.sourceLeadId)}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: input.body, businessID: businessId }),
        signal: AbortSignal.timeout(8000),
      }
    );
    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      console.error('Thumbtack send failed', { status: res.status, detail });
      return { sent: false, reason: `thumbtack_http_${res.status}` };
    }
    const json = (await res.json().catch(() => ({}))) as { messageID?: string; id?: string };
    return { sent: true, reason: 'sent', externalId: json.messageID ?? json.id };
  } catch (err) {
    console.error('Thumbtack send error', err);
    return { sent: false, reason: 'thumbtack_network_error' };
  }
}

export const thumbtackConnector: LeadConnector = {
  name: 'thumbtack',
  capabilities: ['ingest_leads', 'receive_messages', 'receive_reviews', 'receive_status', 'send_messages'],
  parseInbound: parseThumbtackPayload,
  sendMessage: sendThumbtackMessage,
};

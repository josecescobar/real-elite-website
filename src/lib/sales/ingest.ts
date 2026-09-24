import { parseThumbtackPayload, thumbtackConnector } from './connectors/thumbtack';
import type { LeadConnector } from './connectors/types';
import type { InboundLead, LeadSource } from './types';

const CONNECTORS: Record<string, LeadConnector> = {
  thumbtack: thumbtackConnector,
};

/**
 * Generic lead ingestion. Thumbtack is the first live connector; others
 * call the same normalize → pipeline path with source set.
 */
export function parseConnectorPayload(
  source: LeadSource | string,
  payload: unknown
): InboundLead | null {
  const connector = CONNECTORS[source];
  if (connector) return connector.parseInbound(payload);
  if (source === 'thumbtack') return parseThumbtackPayload(payload);
  return parseGenericLead(source, payload);
}

export function parseGenericLead(source: string, payload: unknown): InboundLead | null {
  if (!payload || typeof payload !== 'object') return null;
  const row = payload as Record<string, unknown>;
  const customer = (row.customer as Record<string, unknown> | undefined) ?? {};
  const fullName = typeof customer.fullName === 'string' ? customer.fullName : typeof row.fullName === 'string' ? row.fullName : undefined;
  const projectType = typeof row.projectType === 'string' ? row.projectType : undefined;
  const message = typeof row.message === 'string' ? row.message : undefined;
  if (!fullName && !projectType && !message) return null;
  return {
    source: source === 'website' || source === 'phone' || source === 'manual' ? source : 'other',
    sourceLeadId: typeof row.sourceLeadId === 'string' ? row.sourceLeadId : undefined,
    eventId: typeof row.eventId === 'string' ? row.eventId : undefined,
    eventType: typeof row.eventType === 'string' ? row.eventType : 'LeadCreated',
    customer: {
      fullName,
      email: typeof customer.email === 'string' ? customer.email : undefined,
      phone: typeof customer.phone === 'string' ? customer.phone : undefined,
      zip: typeof customer.zip === 'string' ? customer.zip : typeof row.zip === 'string' ? row.zip : undefined,
      city: typeof customer.city === 'string' ? customer.city : undefined,
      state: typeof customer.state === 'string' ? customer.state : undefined,
    },
    projectType,
    projectSummary: typeof row.projectSummary === 'string' ? row.projectSummary : message,
    estimatedValueCents: typeof row.estimatedValueCents === 'number' ? row.estimatedValueCents : undefined,
    urgency: typeof row.urgency === 'string' ? row.urgency : undefined,
    message,
    receivedAt: typeof row.receivedAt === 'string' ? row.receivedAt : new Date().toISOString(),
    raw: payload,
  };
}

export function getConnector(name: string): LeadConnector | undefined {
  return CONNECTORS[name];
}

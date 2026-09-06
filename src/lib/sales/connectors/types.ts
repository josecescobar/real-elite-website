import type { ConnectorName, InboundLead } from '../types';

export type ConnectorCapability =
  | 'ingest_leads'
  | 'receive_messages'
  | 'receive_reviews'
  | 'receive_status'
  | 'send_messages'
  | 'create_estimate'
  | 'create_invoice'
  | 'create_calendar_event';

export type LeadConnector = {
  name: ConnectorName;
  capabilities: ConnectorCapability[];
  parseInbound(payload: unknown, headers?: Headers): InboundLead | null;
  sendMessage?(input: {
    sourceLeadId: string;
    body: string;
  }): Promise<{ sent: boolean; reason: string; externalId?: string }>;
};

export type StubConnector = {
  name: ConnectorName;
  capabilities: ConnectorCapability[];
  status: 'stub';
  notes: string;
  requiredEnv: string[];
};

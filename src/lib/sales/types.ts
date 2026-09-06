/**
 * Real Elite sales-ops domain types.
 *
 * Lifecycle (conceptual): Customer → Lead → Conversation → Opportunity →
 * Estimate → Job → Invoice. This module persists the first four plus
 * estimate drafts; Job/Invoice stay connector stubs until QBO is wired.
 */

export const SALES_AGENT_MODES = ['draft_only', 'safe_autopilot', 'full_autopilot'] as const;
export type SalesAgentMode = (typeof SALES_AGENT_MODES)[number];

export const LEAD_SOURCES = ['thumbtack', 'website', 'phone', 'manual', 'other'] as const;
export type LeadSource = (typeof LEAD_SOURCES)[number];

export const LEAD_STATUSES = [
  'new',
  'qualifying',
  'awaiting_customer',
  'follow_up',
  'won',
  'lost',
  'paused',
] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_BUCKETS = ['hot', 'new', 'awaiting', 'follow_up', 'won', 'lost'] as const;
export type LeadBucket = (typeof LEAD_BUCKETS)[number];

export const ESCALATION_REASONS = [
  'pricing_commitment',
  'firm_date',
  'permits',
  'discount',
  'legal',
  'out_of_area',
  'license',
  'jose_takeover',
] as const;
export type EscalationReason = (typeof ESCALATION_REASONS)[number];

export type PreferredContact = 'call' | 'text' | 'email' | 'visit';

export type ConversationFacts = {
  fullName?: string;
  firstName?: string;
  email?: string;
  phone?: string;
  zip?: string;
  city?: string;
  state?: string;
  address?: string;
  projectType?: string;
  projectDetails?: string;
  budget?: string;
  timeline?: string;
  photosOffered?: boolean;
  preferredContact?: PreferredContact;
  availability?: string;
  hiredElsewhere?: boolean;
  stopContact?: boolean;
};

export type ScoreBreakdown = {
  geo: number;
  projectType: number;
  value: number;
  urgency: number;
  intent: number;
  completeness: number;
  travel: number;
};

export type Customer = {
  id: string;
  createdAt: string;
  updatedAt: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  zip: string | null;
  city: string | null;
  state: string | null;
  source: LeadSource;
  externalIds: Record<string, string>;
  notes: string | null;
};

export type Lead = {
  id: string;
  createdAt: string;
  updatedAt: string;
  customerId: string;
  conversationId: string;
  source: LeadSource;
  sourceLeadId: string | null;
  status: LeadStatus;
  bucket: LeadBucket;
  projectType: string | null;
  projectSummary: string | null;
  estimatedValueCents: number | null;
  urgency: string | null;
  zip: string | null;
  city: string | null;
  state: string | null;
  score: number;
  scoreBreakdown: ScoreBreakdown;
  aiMode: SalesAgentMode;
  aiPaused: boolean;
  assignedTo: string | null;
  escalationReasons: EscalationReason[];
  facts: ConversationFacts;
  draftReply: string | null;
  draftStatus: 'none' | 'drafted' | 'approved' | 'sent' | 'blocked';
  opportunityId: string | null;
  raw: unknown;
};

export type Conversation = {
  id: string;
  leadId: string;
  customerId: string;
  createdAt: string;
  updatedAt: string;
  facts: ConversationFacts;
};

export type MessageDirection = 'inbound' | 'outbound' | 'internal';

export type Message = {
  id: string;
  createdAt: string;
  conversationId: string;
  leadId: string;
  direction: MessageDirection;
  channel: string;
  body: string;
  status: 'received' | 'drafted' | 'approved' | 'sent' | 'failed' | 'internal';
  author: string | null;
  externalId: string | null;
  meta: Record<string, unknown> | null;
};

export type WebhookEvent = {
  id: string;
  createdAt: string;
  connector: string;
  eventId: string;
  eventType: string;
  payload: unknown;
  processed: boolean;
  leadId: string | null;
};

export type Followup = {
  id: string;
  createdAt: string;
  leadId: string;
  dueAt: string;
  kind: string;
  status: 'scheduled' | 'done' | 'cancelled';
  note: string | null;
  cancelledReason: string | null;
};

export type AgentTaskStatus = 'queued' | 'running' | 'completed' | 'failed';

export type AgentTask = {
  id: string;
  createdAt: string;
  updatedAt: string;
  requestingAgent: string;
  instruction: string;
  context: unknown;
  permissions: string[];
  status: AgentTaskStatus;
  result: unknown;
  error: string | null;
};

export type EstimateDraft = {
  id: string;
  createdAt: string;
  leadId: string;
  customerId: string;
  title: string;
  lineItems: Array<{ label: string; amountCents?: number; notes?: string }>;
  notes: string | null;
  status: 'draft';
  createdBy: string;
};

export type Opportunity = {
  id: string;
  createdAt: string;
  leadId: string;
  customerId: string;
  title: string;
  valueCents: number | null;
  stage: 'qualified' | 'estimate' | 'proposed' | 'won' | 'lost';
};

export type InboundLead = {
  source: LeadSource;
  sourceLeadId?: string;
  eventId?: string;
  eventType?: string;
  customer: {
    fullName?: string;
    email?: string;
    phone?: string;
    zip?: string;
    city?: string;
    state?: string;
    address?: string;
  };
  projectType?: string;
  projectSummary?: string;
  estimatedValueCents?: number;
  urgency?: string;
  message?: string;
  review?: { rating?: number; text?: string };
  statusUpdate?: string;
  receivedAt: string;
  raw: unknown;
};

export type ConnectorName =
  | 'thumbtack'
  | 'website'
  | 'quickbooks'
  | 'calendar'
  | 'gmail'
  | 'twilio'
  | 'manual';

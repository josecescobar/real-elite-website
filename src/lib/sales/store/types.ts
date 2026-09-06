import type {
  AgentTask,
  Conversation,
  Customer,
  EstimateDraft,
  Followup,
  Lead,
  LeadBucket,
  Message,
  Opportunity,
  WebhookEvent,
} from '../types';

export type SalesStoreKind = 'memory' | 'supabase';

export type LeadFilters = {
  bucket?: LeadBucket | 'all';
  query?: string;
  limit?: number;
};

export type SalesStore = {
  kind: SalesStoreKind;
  recordWebhookEvent(input: {
    connector: string;
    eventId: string;
    eventType: string;
    payload: unknown;
  }): Promise<{ event: WebhookEvent; duplicate: boolean }>;
  markWebhookProcessed(eventId: string, connector: string, leadId: string | null): Promise<void>;

  upsertCustomer(input: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Promise<Customer>;
  getCustomer(id: string): Promise<Customer | null>;

  createLead(input: Omit<Lead, 'createdAt' | 'updatedAt'>): Promise<Lead>;
  updateLead(id: string, patch: Partial<Lead>): Promise<Lead | null>;
  getLead(id: string): Promise<Lead | null>;
  findLeadBySource(source: string, sourceLeadId: string): Promise<Lead | null>;
  listLeads(filters?: LeadFilters): Promise<Lead[]>;
  searchLeads(query: string): Promise<Lead[]>;

  upsertConversation(input: Omit<Conversation, 'createdAt' | 'updatedAt'>): Promise<Conversation>;
  getConversation(id: string): Promise<Conversation | null>;
  getConversationByLead(leadId: string): Promise<Conversation | null>;

  addMessage(input: Omit<Message, 'id' | 'createdAt'> & { id?: string }): Promise<Message>;
  listMessages(leadId: string): Promise<Message[]>;

  addFollowups(rows: Array<Omit<Followup, 'id'> & { id?: string }>): Promise<Followup[]>;
  listFollowups(leadId: string): Promise<Followup[]>;
  cancelFollowups(leadId: string, reason: string): Promise<void>;

  createOpportunity(input: Omit<Opportunity, 'id' | 'createdAt'> & { id?: string }): Promise<Opportunity>;
  createEstimateDraft(input: Omit<EstimateDraft, 'id' | 'createdAt'> & { id?: string }): Promise<EstimateDraft>;
  listEstimateDrafts(leadId: string): Promise<EstimateDraft[]>;

  createTask(input: Omit<AgentTask, 'createdAt' | 'updatedAt'>): Promise<AgentTask>;
  updateTask(id: string, patch: Partial<AgentTask>): Promise<AgentTask | null>;
  getTask(id: string): Promise<AgentTask | null>;
  listTasks(limit?: number): Promise<AgentTask[]>;
};

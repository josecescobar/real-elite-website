import type {
  AgentTask,
  Conversation,
  Customer,
  EstimateDraft,
  Followup,
  Lead,
  Message,
  Opportunity,
  WebhookEvent,
} from '../types';
import type { LeadFilters, SalesStore } from './types';

function nowIso(): string {
  return new Date().toISOString();
}

function matchesQuery(lead: Lead, customer: Customer | undefined, query: string): boolean {
  const q = query.toLowerCase();
  const hay = [
    lead.projectType,
    lead.projectSummary,
    lead.city,
    lead.zip,
    lead.sourceLeadId,
    customer?.fullName,
    customer?.email,
    customer?.phone,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return hay.includes(q);
}

export function createMemoryStore(): SalesStore {
  const customers = new Map<string, Customer>();
  const leads = new Map<string, Lead>();
  const conversations = new Map<string, Conversation>();
  const messages = new Map<string, Message>();
  const webhookEvents = new Map<string, WebhookEvent>();
  const followups = new Map<string, Followup>();
  const opportunities = new Map<string, Opportunity>();
  const estimates = new Map<string, EstimateDraft>();
  const tasks = new Map<string, AgentTask>();

  const webhookKey = (connector: string, eventId: string) => `${connector}:${eventId}`;

  const store: SalesStore = {
    kind: 'memory',

    async recordWebhookEvent(input) {
      const key = webhookKey(input.connector, input.eventId);
      const existing = webhookEvents.get(key);
      if (existing) return { event: existing, duplicate: true };
      const event: WebhookEvent = {
        id: crypto.randomUUID(),
        createdAt: nowIso(),
        connector: input.connector,
        eventId: input.eventId,
        eventType: input.eventType,
        payload: input.payload,
        processed: false,
        leadId: null,
      };
      webhookEvents.set(key, event);
      return { event, duplicate: false };
    },

    async markWebhookProcessed(eventId, connector, leadId) {
      const key = webhookKey(connector, eventId);
      const event = webhookEvents.get(key);
      if (event) webhookEvents.set(key, { ...event, processed: true, leadId });
    },

    async upsertCustomer(input) {
      const existing = [...customers.values()].find((c) => {
        if (input.id && c.id === input.id) return true;
        if (input.phone && c.phone && c.phone === input.phone) return true;
        if (input.email && c.email && c.email.toLowerCase() === input.email.toLowerCase()) return true;
        const ext = Object.entries(input.externalIds);
        return ext.some(([k, v]) => c.externalIds[k] === v);
      });
      const ts = nowIso();
      if (existing) {
        const next: Customer = {
          ...existing,
          ...input,
          id: existing.id,
          createdAt: existing.createdAt,
          updatedAt: ts,
          externalIds: { ...existing.externalIds, ...input.externalIds },
        };
        customers.set(existing.id, next);
        return next;
      }
      const row: Customer = {
        id: input.id ?? crypto.randomUUID(),
        createdAt: ts,
        updatedAt: ts,
        ...input,
      };
      customers.set(row.id, row);
      return row;
    },

    async getCustomer(id) {
      return customers.get(id) ?? null;
    },

    async createLead(input) {
      const ts = nowIso();
      const row: Lead = { ...input, createdAt: ts, updatedAt: ts };
      leads.set(row.id, row);
      return row;
    },

    async updateLead(id, patch) {
      const current = leads.get(id);
      if (!current) return null;
      const next = { ...current, ...patch, id, updatedAt: nowIso() };
      leads.set(id, next);
      return next;
    },

    async getLead(id) {
      return leads.get(id) ?? null;
    },

    async findLeadBySource(source, sourceLeadId) {
      return [...leads.values()].find((l) => l.source === source && l.sourceLeadId === sourceLeadId) ?? null;
    },

    async listLeads(filters: LeadFilters = {}) {
      let rows = [...leads.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      if (filters.bucket && filters.bucket !== 'all') {
        rows = rows.filter((l) => l.bucket === filters.bucket);
      }
      if (filters.query) {
        const q = filters.query;
        rows = rows.filter((l) => matchesQuery(l, customers.get(l.customerId), q));
      }
      return rows.slice(0, filters.limit ?? 100);
    },

    async searchLeads(query) {
      return store.listLeads({ query, limit: 50 });
    },

    async upsertConversation(input) {
      const existing = conversations.get(input.id) ?? [...conversations.values()].find((c) => c.leadId === input.leadId);
      const ts = nowIso();
      const row: Conversation = {
        ...(existing ?? input),
        ...input,
        id: existing?.id ?? input.id,
        createdAt: existing?.createdAt ?? ts,
        updatedAt: ts,
        facts: { ...(existing?.facts ?? {}), ...input.facts },
      };
      conversations.set(row.id, row);
      return row;
    },

    async getConversation(id) {
      return conversations.get(id) ?? null;
    },

    async getConversationByLead(leadId) {
      return [...conversations.values()].find((c) => c.leadId === leadId) ?? null;
    },

    async addMessage(input) {
      const row: Message = {
        ...input,
        id: input.id ?? crypto.randomUUID(),
        createdAt: nowIso(),
      };
      messages.set(row.id, row);
      return row;
    },

    async listMessages(leadId) {
      return [...messages.values()]
        .filter((m) => m.leadId === leadId)
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    },

    async addFollowups(rows) {
      return rows.map((input) => {
        const row: Followup = { ...input, id: input.id ?? crypto.randomUUID() };
        followups.set(row.id, row);
        return row;
      });
    },

    async listFollowups(leadId) {
      return [...followups.values()].filter((f) => f.leadId === leadId);
    },

    async cancelFollowups(leadId, reason) {
      for (const [id, row] of followups) {
        if (row.leadId === leadId && row.status === 'scheduled') {
          followups.set(id, { ...row, status: 'cancelled', cancelledReason: reason });
        }
      }
    },

    async createOpportunity(input) {
      const row: Opportunity = {
        ...input,
        id: input.id ?? crypto.randomUUID(),
        createdAt: nowIso(),
      };
      opportunities.set(row.id, row);
      return row;
    },

    async createEstimateDraft(input) {
      const row: EstimateDraft = {
        ...input,
        id: input.id ?? crypto.randomUUID(),
        createdAt: nowIso(),
      };
      estimates.set(row.id, row);
      return row;
    },

    async listEstimateDrafts(leadId) {
      return [...estimates.values()].filter((e) => e.leadId === leadId);
    },

    async createTask(input) {
      const ts = nowIso();
      const row: AgentTask = { ...input, createdAt: ts, updatedAt: ts };
      tasks.set(row.id, row);
      return row;
    },

    async updateTask(id, patch) {
      const current = tasks.get(id);
      if (!current) return null;
      const next = { ...current, ...patch, id, updatedAt: nowIso() };
      tasks.set(id, next);
      return next;
    },

    async getTask(id) {
      return tasks.get(id) ?? null;
    },

    async listTasks(limit = 50) {
      return [...tasks.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, limit);
    },
  };

  return store;
}

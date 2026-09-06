import { env } from '@/lib/env';
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

const TIMEOUT_MS = 4000;

function creds(): { url: string; key: string } | null {
  const url = env.supabaseUrl();
  const key = env.supabaseServiceRoleKey();
  if (!url || !key) return null;
  return { url: url.replace(/\/$/, ''), key };
}

async function rest<T>(
  path: string,
  init: RequestInit & { search?: string } = {}
): Promise<{ ok: boolean; status: number; data: T | null; text: string }> {
  const c = creds();
  if (!c) return { ok: false, status: 0, data: null, text: 'supabase_not_configured' };
  const url = `${c.url}/rest/v1/${path}${init.search ?? ''}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      apikey: c.key,
      Authorization: `Bearer ${c.key}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...(init.headers ?? {}),
    },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  const text = await res.text().catch(() => '');
  let data: T | null = null;
  if (text) {
    try {
      data = JSON.parse(text) as T;
    } catch {
      data = null;
    }
  }
  return { ok: res.ok, status: res.status, data, text };
}

function first<T>(data: T | T[] | null): T | null {
  if (!data) return null;
  return Array.isArray(data) ? (data[0] ?? null) : data;
}

function customerFromRow(row: Record<string, unknown>): Customer {
  return {
    id: String(row.id),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
    fullName: String(row.full_name ?? ''),
    email: (row.email as string) ?? null,
    phone: (row.phone as string) ?? null,
    zip: (row.zip as string) ?? null,
    city: (row.city as string) ?? null,
    state: (row.state as string) ?? null,
    source: row.source as Customer['source'],
    externalIds: (row.external_ids as Record<string, string>) ?? {},
    notes: (row.notes as string) ?? null,
  };
}

function leadFromRow(row: Record<string, unknown>): Lead {
  return {
    id: String(row.id),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
    customerId: String(row.customer_id),
    conversationId: String(row.conversation_id),
    source: row.source as Lead['source'],
    sourceLeadId: (row.source_lead_id as string) ?? null,
    status: row.status as Lead['status'],
    bucket: row.bucket as Lead['bucket'],
    projectType: (row.project_type as string) ?? null,
    projectSummary: (row.project_summary as string) ?? null,
    estimatedValueCents: (row.estimated_value_cents as number) ?? null,
    urgency: (row.urgency as string) ?? null,
    zip: (row.zip as string) ?? null,
    city: (row.city as string) ?? null,
    state: (row.state as string) ?? null,
    score: Number(row.score ?? 0),
    scoreBreakdown: (row.score_breakdown as Lead['scoreBreakdown']) ?? {
      geo: 0,
      projectType: 0,
      value: 0,
      urgency: 0,
      intent: 0,
      completeness: 0,
      travel: 0,
    },
    aiMode: row.ai_mode as Lead['aiMode'],
    aiPaused: Boolean(row.ai_paused),
    assignedTo: (row.assigned_to as string) ?? null,
    escalationReasons: (row.escalation_reasons as Lead['escalationReasons']) ?? [],
    facts: (row.facts as Lead['facts']) ?? {},
    draftReply: (row.draft_reply as string) ?? null,
    draftStatus: (row.draft_status as Lead['draftStatus']) ?? 'none',
    opportunityId: (row.opportunity_id as string) ?? null,
    raw: row.raw ?? null,
  };
}

function conversationFromRow(row: Record<string, unknown>): Conversation {
  return {
    id: String(row.id),
    leadId: String(row.lead_id),
    customerId: String(row.customer_id),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
    facts: (row.facts as Conversation['facts']) ?? {},
  };
}

function messageFromRow(row: Record<string, unknown>): Message {
  return {
    id: String(row.id),
    createdAt: String(row.created_at),
    conversationId: String(row.conversation_id),
    leadId: String(row.lead_id),
    direction: row.direction as Message['direction'],
    channel: String(row.channel),
    body: String(row.body),
    status: row.status as Message['status'],
    author: (row.author as string) ?? null,
    externalId: (row.external_id as string) ?? null,
    meta: (row.meta as Record<string, unknown>) ?? null,
  };
}

function webhookFromRow(row: Record<string, unknown>): WebhookEvent {
  return {
    id: String(row.id),
    createdAt: String(row.created_at),
    connector: String(row.connector),
    eventId: String(row.event_id),
    eventType: String(row.event_type),
    payload: row.payload,
    processed: Boolean(row.processed),
    leadId: (row.lead_id as string) ?? null,
  };
}

function followupFromRow(row: Record<string, unknown>): Followup {
  return {
    id: String(row.id),
    createdAt: String(row.created_at),
    leadId: String(row.lead_id),
    dueAt: String(row.due_at),
    kind: String(row.kind),
    status: row.status as Followup['status'],
    note: (row.note as string) ?? null,
    cancelledReason: (row.cancelled_reason as string) ?? null,
  };
}

function taskFromRow(row: Record<string, unknown>): AgentTask {
  return {
    id: String(row.id),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
    requestingAgent: String(row.requesting_agent),
    instruction: String(row.instruction),
    context: row.context,
    permissions: (row.permissions as string[]) ?? [],
    status: row.status as AgentTask['status'],
    result: row.result,
    error: (row.error as string) ?? null,
  };
}

function leadToRow(lead: Lead): Record<string, unknown> {
  return {
    id: lead.id,
    created_at: lead.createdAt,
    updated_at: lead.updatedAt,
    customer_id: lead.customerId,
    conversation_id: lead.conversationId,
    source: lead.source,
    source_lead_id: lead.sourceLeadId,
    status: lead.status,
    bucket: lead.bucket,
    project_type: lead.projectType,
    project_summary: lead.projectSummary,
    estimated_value_cents: lead.estimatedValueCents,
    urgency: lead.urgency,
    zip: lead.zip,
    city: lead.city,
    state: lead.state,
    score: lead.score,
    score_breakdown: lead.scoreBreakdown,
    ai_mode: lead.aiMode,
    ai_paused: lead.aiPaused,
    assigned_to: lead.assignedTo,
    escalation_reasons: lead.escalationReasons,
    facts: lead.facts,
    draft_reply: lead.draftReply,
    draft_status: lead.draftStatus,
    opportunity_id: lead.opportunityId,
    raw: lead.raw,
  };
}

export function createSupabaseStore(): SalesStore {
  return {
    kind: 'supabase',

    async recordWebhookEvent(input) {
      const existing = await rest<Record<string, unknown>[]>(
        'sales_webhook_events',
        {
          method: 'GET',
          search: `?connector=eq.${encodeURIComponent(input.connector)}&event_id=eq.${encodeURIComponent(input.eventId)}&select=*`,
        }
      );
      const found = first(existing.data);
      if (found) return { event: webhookFromRow(found), duplicate: true };

      const row = {
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        connector: input.connector,
        event_id: input.eventId,
        event_type: input.eventType,
        payload: input.payload,
        processed: false,
        lead_id: null,
      };
      const inserted = await rest<Record<string, unknown>[]>('sales_webhook_events', {
        method: 'POST',
        headers: { Prefer: 'return=representation,resolution=ignore-duplicates' },
        body: JSON.stringify(row),
      });
      if (!inserted.ok) {
        const again = await rest<Record<string, unknown>[]>('sales_webhook_events', {
          method: 'GET',
          search: `?connector=eq.${encodeURIComponent(input.connector)}&event_id=eq.${encodeURIComponent(input.eventId)}&select=*`,
        });
        const dup = first(again.data);
        if (dup) return { event: webhookFromRow(dup), duplicate: true };
        throw new Error(`sales_webhook_events insert failed: ${inserted.status} ${inserted.text}`);
      }
      return { event: webhookFromRow(first(inserted.data) ?? row), duplicate: false };
    },

    async markWebhookProcessed(eventId, connector, leadId) {
      await rest('sales_webhook_events', {
        method: 'PATCH',
        search: `?connector=eq.${encodeURIComponent(connector)}&event_id=eq.${encodeURIComponent(eventId)}`,
        body: JSON.stringify({ processed: true, lead_id: leadId }),
      });
    },

    async upsertCustomer(input) {
      if (input.phone) {
        const byPhone = await rest<Record<string, unknown>[]>('sales_customers', {
          method: 'GET',
          search: `?phone=eq.${encodeURIComponent(input.phone)}&select=*`,
        });
        const found = first(byPhone.data);
        if (found) {
          const merged = {
            full_name: input.fullName || found.full_name,
            email: input.email ?? found.email,
            zip: input.zip ?? found.zip,
            city: input.city ?? found.city,
            state: input.state ?? found.state,
            external_ids: { ...((found.external_ids as object) ?? {}), ...input.externalIds },
            updated_at: new Date().toISOString(),
          };
          const patched = await rest<Record<string, unknown>[]>('sales_customers', {
            method: 'PATCH',
            search: `?id=eq.${found.id}`,
            body: JSON.stringify(merged),
          });
          return customerFromRow(first(patched.data) ?? { ...found, ...merged });
        }
      }
      const row = {
        id: input.id ?? crypto.randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        full_name: input.fullName,
        email: input.email,
        phone: input.phone,
        zip: input.zip,
        city: input.city,
        state: input.state,
        source: input.source,
        external_ids: input.externalIds,
        notes: input.notes,
      };
      const inserted = await rest<Record<string, unknown>[]>('sales_customers', {
        method: 'POST',
        body: JSON.stringify(row),
      });
      if (!inserted.ok) throw new Error(`sales_customers insert failed: ${inserted.status}`);
      return customerFromRow(first(inserted.data) ?? row);
    },

    async getCustomer(id) {
      const res = await rest<Record<string, unknown>[]>('sales_customers', {
        method: 'GET',
        search: `?id=eq.${encodeURIComponent(id)}&select=*`,
      });
      const row = first(res.data);
      return row ? customerFromRow(row) : null;
    },

    async createLead(input) {
      const row = leadToRow({ ...input, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
      const inserted = await rest<Record<string, unknown>[]>('sales_leads', {
        method: 'POST',
        body: JSON.stringify(row),
      });
      if (!inserted.ok) throw new Error(`sales_leads insert failed: ${inserted.status} ${inserted.text}`);
      return leadFromRow(first(inserted.data) ?? row);
    },

    async updateLead(id, patch) {
      const current = await this.getLead(id);
      if (!current) return null;
      const next = { ...current, ...patch, id, updatedAt: new Date().toISOString() };
      const inserted = await rest<Record<string, unknown>[]>('sales_leads', {
        method: 'PATCH',
        search: `?id=eq.${encodeURIComponent(id)}`,
        body: JSON.stringify(leadToRow(next)),
      });
      if (!inserted.ok) throw new Error(`sales_leads update failed: ${inserted.status}`);
      return leadFromRow(first(inserted.data) ?? leadToRow(next));
    },

    async getLead(id) {
      const res = await rest<Record<string, unknown>[]>('sales_leads', {
        method: 'GET',
        search: `?id=eq.${encodeURIComponent(id)}&select=*`,
      });
      const row = first(res.data);
      return row ? leadFromRow(row) : null;
    },

    async findLeadBySource(source, sourceLeadId) {
      const res = await rest<Record<string, unknown>[]>('sales_leads', {
        method: 'GET',
        search: `?source=eq.${encodeURIComponent(source)}&source_lead_id=eq.${encodeURIComponent(sourceLeadId)}&select=*`,
      });
      const row = first(res.data);
      return row ? leadFromRow(row) : null;
    },

    async listLeads(filters: LeadFilters = {}) {
      const params = new URLSearchParams();
      params.set('select', '*');
      params.set('order', 'created_at.desc');
      params.set('limit', String(filters.limit ?? 100));
      if (filters.bucket && filters.bucket !== 'all') params.set('bucket', `eq.${filters.bucket}`);
      const res = await rest<Record<string, unknown>[]>('sales_leads', {
        method: 'GET',
        search: `?${params.toString()}`,
      });
      let rows = (res.data ?? []).map(leadFromRow);
      if (filters.query) {
        const q = filters.query.toLowerCase();
        rows = rows.filter((l) =>
          [l.projectType, l.projectSummary, l.city, l.zip, l.sourceLeadId]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
            .includes(q)
        );
      }
      return rows;
    },

    async searchLeads(query) {
      return this.listLeads({ query, limit: 50 });
    },

    async upsertConversation(input) {
      const row = {
        id: input.id,
        lead_id: input.leadId,
        customer_id: input.customerId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        facts: input.facts,
      };
      const inserted = await rest<Record<string, unknown>[]>('sales_conversations', {
        method: 'POST',
        headers: { Prefer: 'return=representation,resolution=merge-duplicates' },
        body: JSON.stringify(row),
      });
      if (!inserted.ok) throw new Error(`sales_conversations upsert failed: ${inserted.status}`);
      return conversationFromRow(first(inserted.data) ?? row);
    },

    async getConversation(id) {
      const res = await rest<Record<string, unknown>[]>('sales_conversations', {
        method: 'GET',
        search: `?id=eq.${encodeURIComponent(id)}&select=*`,
      });
      const row = first(res.data);
      return row ? conversationFromRow(row) : null;
    },

    async getConversationByLead(leadId) {
      const res = await rest<Record<string, unknown>[]>('sales_conversations', {
        method: 'GET',
        search: `?lead_id=eq.${encodeURIComponent(leadId)}&select=*`,
      });
      const row = first(res.data);
      return row ? conversationFromRow(row) : null;
    },

    async addMessage(input) {
      const row = {
        id: input.id ?? crypto.randomUUID(),
        created_at: new Date().toISOString(),
        conversation_id: input.conversationId,
        lead_id: input.leadId,
        direction: input.direction,
        channel: input.channel,
        body: input.body,
        status: input.status,
        author: input.author,
        external_id: input.externalId,
        meta: input.meta,
      };
      const inserted = await rest<Record<string, unknown>[]>('sales_messages', {
        method: 'POST',
        body: JSON.stringify(row),
      });
      if (!inserted.ok) throw new Error(`sales_messages insert failed: ${inserted.status}`);
      return messageFromRow(first(inserted.data) ?? row);
    },

    async listMessages(leadId) {
      const res = await rest<Record<string, unknown>[]>('sales_messages', {
        method: 'GET',
        search: `?lead_id=eq.${encodeURIComponent(leadId)}&select=*&order=created_at.asc`,
      });
      return (res.data ?? []).map(messageFromRow);
    },

    async addFollowups(rows) {
      const payload = rows.map((input) => ({
        id: input.id ?? crypto.randomUUID(),
        created_at: input.createdAt,
        lead_id: input.leadId,
        due_at: input.dueAt,
        kind: input.kind,
        status: input.status,
        note: input.note,
        cancelled_reason: input.cancelledReason,
      }));
      const inserted = await rest<Record<string, unknown>[]>('sales_followups', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (!inserted.ok) throw new Error(`sales_followups insert failed: ${inserted.status}`);
      return (inserted.data ?? payload).map(followupFromRow);
    },

    async listFollowups(leadId) {
      const res = await rest<Record<string, unknown>[]>('sales_followups', {
        method: 'GET',
        search: `?lead_id=eq.${encodeURIComponent(leadId)}&select=*`,
      });
      return (res.data ?? []).map(followupFromRow);
    },

    async cancelFollowups(leadId, reason) {
      await rest('sales_followups', {
        method: 'PATCH',
        search: `?lead_id=eq.${encodeURIComponent(leadId)}&status=eq.scheduled`,
        body: JSON.stringify({ status: 'cancelled', cancelled_reason: reason }),
      });
    },

    async createOpportunity(input) {
      const row = {
        id: input.id ?? crypto.randomUUID(),
        created_at: new Date().toISOString(),
        lead_id: input.leadId,
        customer_id: input.customerId,
        title: input.title,
        value_cents: input.valueCents,
        stage: input.stage,
      };
      const inserted = await rest<Record<string, unknown>[]>('sales_opportunities', {
        method: 'POST',
        body: JSON.stringify(row),
      });
      if (!inserted.ok) throw new Error(`sales_opportunities insert failed: ${inserted.status}`);
      return {
        id: String(row.id),
        createdAt: String(row.created_at),
        leadId: input.leadId,
        customerId: input.customerId,
        title: input.title,
        valueCents: input.valueCents,
        stage: input.stage,
      };
    },

    async createEstimateDraft(input) {
      const row = {
        id: input.id ?? crypto.randomUUID(),
        created_at: new Date().toISOString(),
        lead_id: input.leadId,
        customer_id: input.customerId,
        title: input.title,
        line_items: input.lineItems,
        notes: input.notes,
        status: input.status,
        created_by: input.createdBy,
      };
      const inserted = await rest<Record<string, unknown>[]>('sales_estimate_drafts', {
        method: 'POST',
        body: JSON.stringify(row),
      });
      if (!inserted.ok) throw new Error(`sales_estimate_drafts insert failed: ${inserted.status}`);
      return {
        id: String(row.id),
        createdAt: String(row.created_at),
        leadId: input.leadId,
        customerId: input.customerId,
        title: input.title,
        lineItems: input.lineItems,
        notes: input.notes,
        status: 'draft',
        createdBy: input.createdBy,
      };
    },

    async listEstimateDrafts(leadId) {
      const res = await rest<Record<string, unknown>[]>('sales_estimate_drafts', {
        method: 'GET',
        search: `?lead_id=eq.${encodeURIComponent(leadId)}&select=*`,
      });
      return (res.data ?? []).map((row) => ({
        id: String(row.id),
        createdAt: String(row.created_at),
        leadId: String(row.lead_id),
        customerId: String(row.customer_id),
        title: String(row.title ?? ''),
        lineItems: (row.line_items as EstimateDraft['lineItems']) ?? [],
        notes: (row.notes as string) ?? null,
        status: 'draft' as const,
        createdBy: String(row.created_by ?? ''),
      }));
    },

    async createTask(input) {
      const row = {
        id: input.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        requesting_agent: input.requestingAgent,
        instruction: input.instruction,
        context: input.context,
        permissions: input.permissions,
        status: input.status,
        result: input.result,
        error: input.error,
      };
      const inserted = await rest<Record<string, unknown>[]>('sales_agent_tasks', {
        method: 'POST',
        body: JSON.stringify(row),
      });
      if (!inserted.ok) throw new Error(`sales_agent_tasks insert failed: ${inserted.status}`);
      return taskFromRow(first(inserted.data) ?? row);
    },

    async updateTask(id, patch) {
      const current = await this.getTask(id);
      if (!current) return null;
      const next = { ...current, ...patch, id, updatedAt: new Date().toISOString() };
      const inserted = await rest<Record<string, unknown>[]>('sales_agent_tasks', {
        method: 'PATCH',
        search: `?id=eq.${encodeURIComponent(id)}`,
        body: JSON.stringify({
          requesting_agent: next.requestingAgent,
          instruction: next.instruction,
          context: next.context,
          permissions: next.permissions,
          status: next.status,
          result: next.result,
          error: next.error,
          updated_at: next.updatedAt,
        }),
      });
      if (!inserted.ok) throw new Error(`sales_agent_tasks update failed: ${inserted.status}`);
      return taskFromRow(first(inserted.data) ?? {
        id,
        created_at: next.createdAt,
        updated_at: next.updatedAt,
        requesting_agent: next.requestingAgent,
        instruction: next.instruction,
        context: next.context,
        permissions: next.permissions,
        status: next.status,
        result: next.result,
        error: next.error,
      });
    },

    async getTask(id) {
      const res = await rest<Record<string, unknown>[]>('sales_agent_tasks', {
        method: 'GET',
        search: `?id=eq.${encodeURIComponent(id)}&select=*`,
      });
      const row = first(res.data);
      return row ? taskFromRow(row) : null;
    },

    async listTasks(limit = 50) {
      const res = await rest<Record<string, unknown>[]>('sales_agent_tasks', {
        method: 'GET',
        search: `?select=*&order=created_at.desc&limit=${limit}`,
      });
      return (res.data ?? []).map(taskFromRow);
    },
  };
}

export function supabaseConfigured(): boolean {
  return creds() !== null;
}

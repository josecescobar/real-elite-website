import type {
  AgentTask,
  Conversation,
  ConversationFacts,
  Customer,
  Followup,
  Lead,
  Message,
} from '../types';
import type { AgentScope } from './scopes';

/**
 * Customer contact data sits behind `customers:read`. A key that only holds
 * `leads:read` still sees the lead (project, score, coarse location, status)
 * but not who the customer is or how to reach them. Contact fields also live
 * in `lead.facts`, `conversation.facts`, the raw inbound payload and the
 * author of inbound messages (the customer's name), so those are stripped
 * too. Message bodies and drafts stay: they are the lead conversation.
 */
export function canReadCustomers(scopes: readonly AgentScope[]): boolean {
  return scopes.includes('customers:read');
}

const CONTACT_FACTS = ['fullName', 'firstName', 'email', 'phone', 'address'] as const;

function redactFacts(facts: ConversationFacts): ConversationFacts {
  const next = { ...facts };
  for (const field of CONTACT_FACTS) delete next[field];
  return next;
}

export function leadView(lead: Lead, scopes: readonly AgentScope[]): Lead;
export function leadView(lead: Lead | null, scopes: readonly AgentScope[]): Lead | null;
export function leadView(lead: Lead | null, scopes: readonly AgentScope[]): Lead | null {
  if (!lead || canReadCustomers(scopes)) return lead;
  return { ...lead, facts: redactFacts(lead.facts ?? {}), raw: null };
}

/**
 * The store's search also matches customer name, email and phone. Without
 * `customers:read` a hit on those would confirm contact details, so results
 * are kept only when the query matches a field the caller can see.
 */
const VISIBLE_SEARCH_FIELDS = [
  'id',
  'source',
  'sourceLeadId',
  'status',
  'projectType',
  'projectSummary',
  'city',
  'state',
  'zip',
] as const;

export function filterLeadSearch(
  leads: Lead[],
  query: string | undefined,
  scopes: readonly AgentScope[]
): Lead[] {
  const needle = query?.trim().toLowerCase();
  if (!needle || canReadCustomers(scopes)) return leads;
  return leads.filter((lead) =>
    VISIBLE_SEARCH_FIELDS.some((field) => {
      const value = lead[field];
      return typeof value === 'string' && value.toLowerCase().includes(needle);
    })
  );
}

export function conversationView(
  conversation: Conversation | null,
  scopes: readonly AgentScope[]
): Conversation | null {
  if (!conversation || canReadCustomers(scopes)) return conversation;
  return { ...conversation, facts: redactFacts(conversation.facts ?? {}) };
}

export function messagesView(messages: Message[], scopes: readonly AgentScope[]): Message[] {
  if (canReadCustomers(scopes)) return messages;
  return messages.map((m) => (m.direction === 'inbound' ? { ...m, author: null } : m));
}

/** Without `customers:read` the customer record is withheld entirely. */
export function customerView(
  customer: Customer | null,
  scopes: readonly AgentScope[]
): Customer | null {
  return canReadCustomers(scopes) ? customer : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

/** Free text written by staff or agents can name the customer. */
export const WITHHELD_TEXT = '[withheld: requires customers:read]';

export function followupView(followup: Followup, scopes: readonly AgentScope[]): Followup {
  if (canReadCustomers(scopes)) return followup;
  return {
    ...followup,
    note: followup.note === null ? null : WITHHELD_TEXT,
    cancelledReason: followup.cancelledReason === null ? null : WITHHELD_TEXT,
  };
}

export function followupsView(followups: Followup[], scopes: readonly AgentScope[]): Followup[] {
  return followups.map((followup) => followupView(followup, scopes));
}

function estimateView(estimate: Record<string, unknown>): Record<string, unknown> {
  const lineItems = Array.isArray(estimate.lineItems) ? estimate.lineItems : [];
  return {
    id: estimate.id,
    createdAt: estimate.createdAt,
    leadId: estimate.leadId,
    status: estimate.status,
    title: WITHHELD_TEXT,
    notes: estimate.notes == null ? null : WITHHELD_TEXT,
    lineItems: lineItems.filter(isRecord).map((item) => ({
      label: item.label,
      amountCents: item.amountCents,
    })),
  };
}

/**
 * Redact the `data` of a live tool result. This is an allowlist: each known
 * key is passed through its view, and any key not listed here is dropped, so
 * a new tool field stays hidden from a narrow key until it is reviewed.
 * Message bodies and drafts stay: they are the lead conversation.
 */
export function redactToolData(data: unknown, scopes: readonly AgentScope[]): unknown {
  if (!isRecord(data) || canReadCustomers(scopes)) return data;
  const next: Record<string, unknown> = {};
  if (isRecord(data.lead)) next.lead = leadView(data.lead as Lead, scopes);
  if (Array.isArray(data.leads)) {
    next.leads = data.leads.filter(isRecord).map((lead) => leadView(lead as Lead, scopes));
  }
  if (isRecord(data.conversation)) {
    next.conversation = conversationView(data.conversation as Conversation, scopes);
  }
  if (Array.isArray(data.messages)) {
    next.messages = messagesView(data.messages.filter(isRecord) as Message[], scopes);
  }
  if ('customer' in data) next.customer = null;
  if (isRecord(data.followup)) next.followup = followupView(data.followup as Followup, scopes);
  if (isRecord(data.estimate)) next.estimate = estimateView(data.estimate);
  for (const key of ['draft', 'body', 'escalationReasons', 'sent', 'reason'] as const) {
    if (key in data) next[key] = data[key];
  }
  return next;
}

/**
 * A task's instruction, context and stored result are written by whoever
 * created it and can carry customer contact details anywhere in them, so a
 * caller without `customers:read` sees only the task's status metadata. It
 * can still run the tools itself and get their redacted views.
 */
export const WITHHELD_TASK_TEXT = WITHHELD_TEXT;

export function taskView(task: AgentTask, scopes: readonly AgentScope[]): AgentTask {
  if (canReadCustomers(scopes)) return task;
  return {
    ...task,
    instruction: WITHHELD_TEXT,
    context: null,
    result: null,
    error: task.error === null ? null : WITHHELD_TEXT,
  };
}

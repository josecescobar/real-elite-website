import type { AgentTask, Conversation, ConversationFacts, Customer, Lead, Message } from '../types';
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

/**
 * Redact the `data` of a tool result (or a stored task result) by shape:
 * `lead`, `leads`, `conversation`, `messages` and `customer` keys. Used for
 * live tool calls and for task results read back later, since a task run by
 * a full-scope key can be fetched by a narrower one.
 */
export function redactToolData(data: unknown, scopes: readonly AgentScope[]): unknown {
  if (!isRecord(data) || canReadCustomers(scopes)) return data;
  const next: Record<string, unknown> = { ...data };
  if (isRecord(next.lead)) next.lead = leadView(next.lead as Lead, scopes);
  if (Array.isArray(next.leads)) {
    next.leads = next.leads.map((lead) => (isRecord(lead) ? leadView(lead as Lead, scopes) : lead));
  }
  if (isRecord(next.conversation)) {
    next.conversation = conversationView(next.conversation as Conversation, scopes);
  }
  if (Array.isArray(next.messages)) {
    next.messages = messagesView(next.messages.filter(isRecord) as Message[], scopes);
  }
  if ('customer' in next) next.customer = null;
  return next;
}

export function taskView(task: AgentTask, scopes: readonly AgentScope[]): AgentTask {
  if (canReadCustomers(scopes) || !isRecord(task.result)) return task;
  const tools = task.result.tools;
  if (!Array.isArray(tools)) return task;
  return {
    ...task,
    result: {
      ...task.result,
      tools: tools.map((entry) =>
        isRecord(entry) ? { ...entry, data: redactToolData(entry.data, scopes) } : entry
      ),
    },
  };
}

import { getSalesStore } from '../store';
import type { AgentTask } from '../types';
import { parseRequestedScopes, type AgentAuth } from './auth';
import { ALL_SCOPES, type AgentScope } from './scopes';
import { runAgentTool, type ToolResult } from './tools';

export type CreateTaskInput = {
  taskId?: string;
  requestingAgent: string;
  instruction: string;
  context?: unknown;
  permissions?: unknown;
  createdAt?: string;
};

function inferTool(instruction: string, context: Record<string, unknown>): { name: string; arguments: Record<string, unknown> }[] {
  const text = instruction.toLowerCase();
  const leadId = typeof context.leadId === 'string' ? context.leadId : undefined;
  const calls: { name: string; arguments: Record<string, unknown> }[] = [];

  if (/(search|find|list) lead/.test(text) || text.includes('hot leads')) {
    calls.push({ name: 'search_leads', arguments: { query: instruction, bucket: context.bucket } });
  }
  if (leadId && /(get|show|load) (the )?lead/.test(text)) {
    calls.push({ name: 'get_lead', arguments: { leadId } });
  }
  if (leadId && /conversation|messages/.test(text)) {
    calls.push({ name: 'get_conversation', arguments: { leadId } });
  }
  if (leadId && /draft/.test(text)) {
    calls.push({ name: 'draft_customer_reply', arguments: { leadId, instruction } });
  }
  if (leadId && /\bsend\b/.test(text)) {
    calls.push({ name: 'send_customer_reply', arguments: { leadId } });
  }
  if (leadId && /follow-?up/.test(text)) {
    calls.push({ name: 'create_followup', arguments: { leadId, note: instruction } });
  }
  if (leadId && /assign/.test(text)) {
    calls.push({ name: 'assign_lead', arguments: { leadId } });
  }
  if (leadId && /estimate/.test(text)) {
    calls.push({ name: 'create_estimate_draft', arguments: { leadId, notes: instruction } });
  }
  if (leadId && /status/.test(text)) {
    const status = /\bwon\b/.test(text) ? 'won' : /\blost\b/.test(text) ? 'lost' : 'qualifying';
    calls.push({ name: 'update_lead_status', arguments: { leadId, status } });
  }
  if (leadId && calls.length === 0) {
    calls.push({ name: 'get_lead', arguments: { leadId } });
    calls.push({ name: 'draft_customer_reply', arguments: { leadId, instruction } });
  }
  if (calls.length === 0) {
    calls.push({ name: 'search_leads', arguments: { query: instruction } });
  }
  return calls;
}

export async function createAndRunTask(
  input: CreateTaskInput,
  auth: Extract<AgentAuth, { ok: true }>
): Promise<AgentTask> {
  const store = getSalesStore();
  const id = input.taskId?.trim() || crypto.randomUUID();
  const permissions = parseRequestedScopes(input.permissions).filter((scope) =>
    auth.scopes.includes(scope)
  );
  const created = await store.createTask({
    id,
    requestingAgent: input.requestingAgent.trim() || 'chatgpt',
    instruction: input.instruction.trim(),
    context: input.context ?? null,
    permissions,
    status: 'running',
    result: null,
    error: null,
  });

  try {
    const context =
      input.context && typeof input.context === 'object' ? (input.context as Record<string, unknown>) : {};
    const calls = inferTool(input.instruction, context);
    const granted = (permissions.length ? permissions : ALL_SCOPES) as AgentScope[];
    const results: ToolResult[] = [];
    for (const call of calls) {
      results.push(await runAgentTool(call, granted));
    }
    const failed = results.find((r) => !r.ok);
    return (
      (await store.updateTask(created.id, {
        status: failed ? 'failed' : 'completed',
        result: { tools: results },
        error: failed?.error ?? null,
      })) ?? created
    );
  } catch (err) {
    return (
      (await store.updateTask(created.id, {
        status: 'failed',
        error: err instanceof Error ? err.message : 'Task failed',
      })) ?? created
    );
  }
}

export const CHATGPT_TOOL_DEFINITIONS = [
  {
    type: 'function',
    function: {
      name: 'grokbot_create_task',
      description:
        'Hand a sales/ops task to Grokbot (Real Elite Contracting). Use for Thumbtack leads, drafts, follow-ups, and status updates. Grokbot stays in Safe Autopilot — it will not commit price, dates, permits, or discounts.',
      parameters: {
        type: 'object',
        additionalProperties: false,
        properties: {
          taskId: { type: 'string', description: 'Optional client-generated UUID for idempotent retries.' },
          requestingAgent: { type: 'string', description: 'Always "chatgpt" when calling from ChatGPT.' },
          instruction: { type: 'string', description: 'What Grokbot should do, in plain English.' },
          context: {
            type: 'object',
            description: 'Optional structured context (leadId, bucket, customer name, etc).',
          },
          permissions: {
            type: 'array',
            items: { type: 'string' },
            description:
              'Optional scope list: leads:read, leads:write, leads:draft, leads:send, customers:read, estimates:write.',
          },
        },
        required: ['requestingAgent', 'instruction'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'grokbot_get_task',
      description: 'Fetch status and result for a Grokbot task by id.',
      parameters: {
        type: 'object',
        additionalProperties: false,
        properties: {
          taskId: { type: 'string' },
        },
        required: ['taskId'],
      },
    },
  },
];

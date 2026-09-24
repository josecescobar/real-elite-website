import { SALES_OWNER } from '../company';
import { sendThumbtackMessage } from '../connectors/thumbtack';
import { draftCustomerReply } from '../draft';
import { getSalesStore } from '../store';
import type { LeadStatus } from '../types';
import { LEAD_STATUSES } from '../types';
import { TOOL_SCOPES, type AgentScope } from './scopes';

export type ToolCall = {
  name: string;
  arguments?: Record<string, unknown>;
};

export type ToolResult = {
  ok: boolean;
  tool: string;
  data?: unknown;
  error?: string;
};

function str(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function hasScope(granted: AgentScope[], tool: string): boolean {
  const needed = TOOL_SCOPES[tool] ?? [];
  return needed.every((scope) => granted.includes(scope));
}

export async function runAgentTool(
  call: ToolCall,
  granted: AgentScope[]
): Promise<ToolResult> {
  const tool = call.name;
  if (!TOOL_SCOPES[tool]) return { ok: false, tool, error: `Unknown tool: ${tool}` };
  if (!hasScope(granted, tool)) {
    return { ok: false, tool, error: `Missing scope for ${tool}` };
  }

  const store = getSalesStore();
  const args = call.arguments ?? {};

  switch (tool) {
    case 'search_leads': {
      const query = str(args.query) ?? '';
      const bucket = str(args.bucket);
      const leads = await store.listLeads({
        query: query || undefined,
        bucket: bucket as never,
        limit: typeof args.limit === 'number' ? args.limit : 25,
      });
      return { ok: true, tool, data: { leads } };
    }
    case 'get_lead': {
      const id = str(args.leadId) ?? str(args.id);
      if (!id) return { ok: false, tool, error: 'leadId is required' };
      const lead = await store.getLead(id);
      if (!lead && str(args.sourceLeadId)) {
        const found = await store.findLeadBySource(str(args.source) ?? 'thumbtack', str(args.sourceLeadId)!);
        return { ok: true, tool, data: { lead: found } };
      }
      return { ok: true, tool, data: { lead } };
    }
    case 'get_conversation': {
      const leadId = str(args.leadId);
      const conversationId = str(args.conversationId);
      const conversation = conversationId
        ? await store.getConversation(conversationId)
        : leadId
          ? await store.getConversationByLead(leadId)
          : null;
      const messages = conversation ? await store.listMessages(conversation.leadId) : [];
      return { ok: true, tool, data: { conversation, messages } };
    }
    case 'get_customer': {
      const id = str(args.customerId) ?? str(args.id);
      if (!id) return { ok: false, tool, error: 'customerId is required' };
      return { ok: true, tool, data: { customer: await store.getCustomer(id) } };
    }
    case 'draft_customer_reply': {
      const id = str(args.leadId);
      if (!id) return { ok: false, tool, error: 'leadId is required' };
      const lead = await store.getLead(id);
      if (!lead) return { ok: false, tool, error: 'Lead not found' };
      const customer = await store.getCustomer(lead.customerId);
      const draft = draftCustomerReply({
        lead,
        customerName: customer?.fullName,
        facts: lead.facts,
        inboundMessage: str(args.instruction) ?? lead.projectSummary,
      });
      const updated = await store.updateLead(id, {
        draftReply: draft.body,
        draftStatus: 'drafted',
        escalationReasons: draft.escalationReasons,
      });
      return { ok: true, tool, data: { draft: draft.body, escalationReasons: draft.escalationReasons, lead: updated } };
    }
    case 'send_customer_reply': {
      const id = str(args.leadId);
      if (!id) return { ok: false, tool, error: 'leadId is required' };
      const lead = await store.getLead(id);
      if (!lead) return { ok: false, tool, error: 'Lead not found' };
      const body = str(args.body) ?? lead.draftReply;
      if (!body) return { ok: false, tool, error: 'No draft to send' };
      if (!lead.sourceLeadId || lead.source !== 'thumbtack') {
        await store.updateLead(id, { draftReply: body, draftStatus: 'approved' });
        return {
          ok: true,
          tool,
          data: { sent: false, reason: 'thumbtack_outbound_not_configured', body },
        };
      }
      const result = await sendThumbtackMessage({ sourceLeadId: lead.sourceLeadId, body });
      if (result.sent) {
        await store.updateLead(id, { draftReply: body, draftStatus: 'sent', status: 'awaiting_customer', bucket: 'awaiting' });
      }
      return { ok: true, tool, data: { ...result, body } };
    }
    case 'create_followup': {
      const leadId = str(args.leadId);
      if (!leadId) return { ok: false, tool, error: 'leadId is required' };
      const dueAt = str(args.dueAt) ?? new Date(Date.now() + 24 * 3600_000).toISOString();
      const rows = await store.addFollowups([
        {
          createdAt: new Date().toISOString(),
          leadId,
          dueAt,
          kind: str(args.kind) ?? 'manual',
          status: 'scheduled',
          note: str(args.note) ?? null,
          cancelledReason: null,
        },
      ]);
      return { ok: true, tool, data: { followup: rows[0] } };
    }
    case 'update_lead_status': {
      const id = str(args.leadId);
      const status = str(args.status) as LeadStatus | undefined;
      if (!id || !status) return { ok: false, tool, error: 'leadId and status are required' };
      if (!LEAD_STATUSES.includes(status)) return { ok: false, tool, error: 'Invalid status' };
      const bucket =
        status === 'won' ? 'won' : status === 'lost' ? 'lost' : status === 'follow_up' ? 'follow_up' : undefined;
      const updated = await store.updateLead(id, { status, ...(bucket ? { bucket } : {}) });
      if (status === 'won' || status === 'lost' || status === 'paused') {
        await store.cancelFollowups(id, `status_${status}`);
      }
      return { ok: true, tool, data: { lead: updated } };
    }
    case 'assign_lead': {
      const id = str(args.leadId);
      if (!id) return { ok: false, tool, error: 'leadId is required' };
      const assignedTo = str(args.assignedTo) ?? SALES_OWNER.firstName;
      const updated = await store.updateLead(id, { assignedTo });
      return { ok: true, tool, data: { lead: updated } };
    }
    case 'create_estimate_draft': {
      const leadId = str(args.leadId);
      if (!leadId) return { ok: false, tool, error: 'leadId is required' };
      const lead = await store.getLead(leadId);
      if (!lead) return { ok: false, tool, error: 'Lead not found' };
      const draft = await store.createEstimateDraft({
        leadId,
        customerId: lead.customerId,
        title: str(args.title) ?? lead.projectType ?? 'Estimate draft',
        lineItems: Array.isArray(args.lineItems) ? (args.lineItems as never) : [],
        notes: str(args.notes) ?? 'Draft only — Jose must review before customer delivery.',
        status: 'draft',
        createdBy: str(args.createdBy) ?? 'grokbot',
      });
      return { ok: true, tool, data: { estimate: draft } };
    }
    default:
      return { ok: false, tool, error: `Unhandled tool: ${tool}` };
  }
}

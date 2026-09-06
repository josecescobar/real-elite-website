export const AGENT_SCOPES = [
  'leads:read',
  'leads:write',
  'leads:draft',
  'leads:send',
  'customers:read',
  'estimates:write',
  'tasks:write',
] as const;

export type AgentScope = (typeof AGENT_SCOPES)[number];

export const TOOL_SCOPES: Record<string, AgentScope[]> = {
  search_leads: ['leads:read'],
  get_lead: ['leads:read'],
  get_conversation: ['leads:read'],
  get_customer: ['customers:read'],
  draft_customer_reply: ['leads:draft'],
  send_customer_reply: ['leads:send'],
  create_followup: ['leads:write'],
  update_lead_status: ['leads:write'],
  assign_lead: ['leads:write'],
  create_estimate_draft: ['estimates:write'],
};

export const ALL_SCOPES = [...AGENT_SCOPES];

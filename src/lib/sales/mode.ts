import { env } from '@/lib/env';
import { mustEscalate } from './guardrails';
import { SALES_AGENT_MODES, type EscalationReason, type SalesAgentMode } from './types';

export function currentSalesMode(): SalesAgentMode {
  const raw = (env.salesAgentMode() || 'safe_autopilot').toLowerCase();
  return (SALES_AGENT_MODES as readonly string[]).includes(raw)
    ? (raw as SalesAgentMode)
    : 'safe_autopilot';
}

export function thumbtackOutboundReady(): boolean {
  return Boolean(env.thumbtackAccessToken() && env.thumbtackBusinessId());
}

/**
 * Safe Autopilot may auto-send only routine, non-escalated replies, and
 * only when Thumbtack outbound is actually wired. Until then the path
 * still runs and records a draft — it does not pretend a send happened.
 */
export function decideSend(input: {
  mode?: SalesAgentMode;
  escalationReasons: EscalationReason[];
  aiPaused?: boolean;
  outboundReady?: boolean;
}): { send: boolean; reason: string } {
  const mode = input.mode ?? currentSalesMode();
  if (input.aiPaused) return { send: false, reason: 'ai_paused' };
  if (mustEscalate(input.escalationReasons)) return { send: false, reason: 'escalated_to_jose' };
  if (mode === 'draft_only') return { send: false, reason: 'draft_only' };
  if (!(input.outboundReady ?? thumbtackOutboundReady())) {
    return { send: false, reason: 'thumbtack_outbound_not_configured' };
  }
  if (mode === 'safe_autopilot' || mode === 'full_autopilot') {
    return { send: true, reason: mode };
  }
  return { send: false, reason: 'draft_only' };
}

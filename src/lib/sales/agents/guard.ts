import { NextResponse } from 'next/server';
import { getClientIp, rateLimit, rateLimitPeek } from '@/lib/rate-limit';
import { authorizeAgent, type AgentAuth } from './auth';
import type { AgentScope } from './scopes';

/** 20 requests / 10 minutes / IP, shared by every agent and admin sales route. */
export const AGENT_RATE_MAX = 20;
export const AGENT_RATE_WINDOW_MS = 10 * 60 * 1000;
/** Failed authentications in that same window before the IP is locked out. */
export const AGENT_AUTH_FAIL_MAX = 5;

const RATE_ERROR = 'Too many requests. Please try again later.';
const LOCK_ERROR = 'Too many failed authentication attempts. Try again later.';

export type AgentAccess = Extract<AgentAuth, { ok: true }>;

function clientKey(request: Request, kind: 'burst' | 'fail'): string {
  return `agent-${kind}:${getClientIp(request)}`;
}

function tooMany(error: string, retryAfter: number): NextResponse {
  return NextResponse.json(
    { error },
    { status: 429, headers: { 'Retry-After': String(Math.max(1, retryAfter || 1)) } }
  );
}

export function agentGateDenied(result: AgentAccess | NextResponse): result is NextResponse {
  return result instanceof Response;
}

/**
 * Rate limit, then authenticate. A 401 is counted toward a per-IP lockout.
 * The next request from that IP is 429 until the window resets, even when
 * the key is valid. Key comparison stays in `authorizeAgent` (hashed,
 * constant-time). Lockout is checked before the burst counter so a locked
 * IP is not also charged against the 20-request budget.
 */
export async function authorizeAgentRequest(
  request: Request,
  opts: { required?: AgentScope[]; bodyKey?: unknown } = {}
): Promise<AgentAccess | NextResponse> {
  const failKey = clientKey(request, 'fail');
  const locked = await rateLimitPeek(failKey, AGENT_AUTH_FAIL_MAX, AGENT_RATE_WINDOW_MS);
  if (!locked.allowed) return tooMany(LOCK_ERROR, locked.retryAfter);

  const burst = await rateLimit(clientKey(request, 'burst'), AGENT_RATE_MAX, AGENT_RATE_WINDOW_MS);
  if (!burst.allowed) return tooMany(RATE_ERROR, burst.retryAfter);

  const auth = authorizeAgent(request, opts);
  if (!auth.ok) {
    if (auth.status === 401) {
      await rateLimit(failKey, AGENT_AUTH_FAIL_MAX, AGENT_RATE_WINDOW_MS);
    }
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  return auth;
}

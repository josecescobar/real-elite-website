import { createHash, timingSafeEqual } from 'crypto';
import { env } from '@/lib/env';
import { ALL_SCOPES, type AgentScope } from './scopes';

/** Grokbot default. `leads:send` stays off until GROKBOT_SCOPES names it. */
export const DEFAULT_GROKBOT_SCOPES: readonly AgentScope[] = ALL_SCOPES.filter(
  (scope) => scope !== 'leads:send'
);

function isAgentScope(value: string): value is AgentScope {
  return (ALL_SCOPES as readonly string[]).includes(value);
}

/**
 * Scopes for GROKBOT_API_KEY. Blank or unset → reduced default.
 * A non-blank value is the allow-list (unknown tokens dropped). If none
 * of the tokens are real scopes, the key gets nothing.
 */
export function grokbotScopes(): AgentScope[] {
  const raw = env.grokbotScopes();
  if (raw === undefined || raw.trim() === '') return [...DEFAULT_GROKBOT_SCOPES];
  const seen = new Set<AgentScope>();
  for (const part of raw.split(',')) {
    const token = part.trim();
    if (isAgentScope(token)) seen.add(token);
  }
  return [...seen];
}

function scopesFor(via: 'grokbot' | 'admin'): AgentScope[] {
  if (via === 'admin') return [...ALL_SCOPES];
  return grokbotScopes();
}

export type AgentAuth = {
  ok: true;
  scopes: AgentScope[];
  via: 'grokbot' | 'admin';
} | { ok: false; status: number; error: string };

function hashEq(a: string, b: string): boolean {
  const left = createHash('sha256').update(a).digest();
  const right = createHash('sha256').update(b).digest();
  return timingSafeEqual(left, right);
}

/**
 * Keys are accepted ONLY from request headers or a POST body the route
 * parsed itself (`bodyKey`). The query string is never read: `?key=` URLs
 * leak into analytics page_location, Clarity recordings, browser history
 * and Vercel request logs (security audit 2026-10-24, finding M1).
 */
function bearerFrom(request: Request, bodyKey?: unknown): string | null {
  const header = request.headers.get('authorization');
  if (header?.toLowerCase().startsWith('bearer ')) return header.slice(7).trim();
  const alt =
    request.headers.get('x-admin-key') ??
    request.headers.get('x-api-key') ??
    request.headers.get('x-grokbot-key');
  if (alt) return alt.trim();
  if (typeof bodyKey === 'string' && bodyKey.trim()) return bodyKey.trim();
  return null;
}

export function authorizeAgent(
  request: Request,
  /** `bodyKey` must come from a parsed POST body — never from searchParams. */
  opts: { required?: AgentScope[]; bodyKey?: unknown } = {}
): AgentAuth {
  const provided = bearerFrom(request, opts.bodyKey);
  const grokbot = env.grokbotApiKey();
  const admin = env.adminToolsKey();

  if (!grokbot && !admin) {
    return {
      ok: false,
      status: 503,
      error: 'Agent API not configured: set GROKBOT_API_KEY (or ADMIN_TOOLS_KEY for the command center).',
    };
  }
  if (!provided) {
    return { ok: false, status: 401, error: 'Missing Bearer token.' };
  }

  let via: 'grokbot' | 'admin' | null = null;
  if (grokbot && hashEq(provided, grokbot)) via = 'grokbot';
  else if (admin && hashEq(provided, admin)) via = 'admin';
  if (!via) return { ok: false, status: 401, error: 'Invalid access key.' };

  const scopes = scopesFor(via);
  if (opts.required?.some((scope) => !scopes.includes(scope))) {
    return { ok: false, status: 403, error: 'Insufficient scope.' };
  }
  return { ok: true, scopes, via };
}

export function parseRequestedScopes(value: unknown): AgentScope[] {
  if (!Array.isArray(value)) return [...ALL_SCOPES];
  const wanted = value.filter((v): v is AgentScope => typeof v === 'string' && ALL_SCOPES.includes(v as AgentScope));
  return wanted.length ? wanted : [...ALL_SCOPES];
}

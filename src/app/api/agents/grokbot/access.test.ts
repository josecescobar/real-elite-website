import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { resetSalesStore } from '@/lib/sales/store';
import { GET as listLeads } from '@/app/api/sales/leads/route';
import { GET as getLead } from '@/app/api/sales/leads/[id]/route';
import { POST as leadAction } from '@/app/api/sales/leads/[id]/actions/route';
import { GET as listTasks, POST as createTask } from '@/app/api/agents/grokbot/tasks/route';
import { GET as getTask } from '@/app/api/agents/grokbot/tasks/[taskId]/route';
import { GET as listTools, POST as callTool } from '@/app/api/agents/grokbot/tools/route';

const ADMIN = 'test-admin-key-value';
const GROK = 'test-grokbot-key-value';

beforeEach(() => {
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.UPSTASH_REDIS_REST_TOKEN;
  delete process.env.GROKBOT_SCOPES;
  process.env.ADMIN_TOOLS_KEY = ADMIN;
  process.env.GROKBOT_API_KEY = GROK;
  resetSalesStore();
});

afterEach(() => {
  delete process.env.ADMIN_TOOLS_KEY;
  delete process.env.GROKBOT_API_KEY;
  delete process.env.GROKBOT_SCOPES;
  resetSalesStore();
});

function authed(url: string, ip: string, key: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  headers.set('x-forwarded-for', ip);
  headers.set('authorization', `Bearer ${key}`);
  return new Request(url, { ...init, headers });
}

const leadCtx = { params: Promise.resolve({ id: 'missing-lead' }) };
const taskCtx = { params: Promise.resolve({ taskId: 'missing-task' }) };

describe('agent and admin API rate limit and lockout (audit M4)', () => {
  it('returns 429 after 20 requests per 10 minutes per IP on every agent route', async () => {
    const ip = '203.0.113.20';
    for (let i = 0; i < 20; i++) {
      const res = await listLeads(authed('http://localhost/api/sales/leads', ip, ADMIN));
      expect(res.status).toBe(200);
    }

    const blocked = await listLeads(authed('http://localhost/api/sales/leads', ip, ADMIN));
    expect(blocked.status).toBe(429);
    expect(blocked.headers.get('Retry-After')).toMatch(/^[1-9]\d*$/);
    expect(await blocked.json()).toEqual({ error: 'Too many requests. Please try again later.' });

    const alsoBlocked = [
      await getLead(authed('http://localhost/api/sales/leads/missing-lead', ip, ADMIN), leadCtx),
      await leadAction(
        authed('http://localhost/api/sales/leads/missing-lead/actions', ip, ADMIN, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ action: 'pause' }),
        }),
        leadCtx
      ),
      await listTasks(authed('http://localhost/api/agents/grokbot/tasks', ip, ADMIN)),
      await createTask(
        authed('http://localhost/api/agents/grokbot/tasks', ip, ADMIN, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ requestingAgent: 'chatgpt', instruction: 'list leads' }),
        })
      ),
      await getTask(authed('http://localhost/api/agents/grokbot/tasks/missing-task', ip, ADMIN), taskCtx),
      await listTools(authed('http://localhost/api/agents/grokbot/tools', ip, ADMIN)),
      await callTool(
        authed('http://localhost/api/agents/grokbot/tools', ip, ADMIN, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ tool: 'search_leads', arguments: {} }),
        })
      ),
    ];
    for (const res of alsoBlocked) expect(res.status).toBe(429);

    const otherIp = await listLeads(authed('http://localhost/api/sales/leads', '203.0.113.21', ADMIN));
    expect(otherIp.status).toBe(200);
  });

  it('locks the IP out after repeated 401s, including a later valid key', async () => {
    const ip = '203.0.113.50';
    for (let i = 0; i < 5; i++) {
      const res = await listLeads(authed('http://localhost/api/sales/leads', ip, 'wrong-key'));
      expect(res.status).toBe(401);
    }

    const locked = await listLeads(authed('http://localhost/api/sales/leads', ip, ADMIN));
    expect(locked.status).toBe(429);
    expect(locked.headers.get('Retry-After')).toMatch(/^[1-9]\d*$/);
    expect(await locked.json()).toEqual({
      error: 'Too many failed authentication attempts. Try again later.',
    });

    const otherIp = await listLeads(authed('http://localhost/api/sales/leads', '203.0.113.51', ADMIN));
    expect(otherIp.status).toBe(200);
  });

  it('returns 403 when the grokbot key calls a leads:send route', async () => {
    const ip = '203.0.113.60';
    const grokSend = await callTool(
      authed('http://localhost/api/agents/grokbot/tools', ip, GROK, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ tool: 'send_customer_reply', arguments: { leadId: 'x' } }),
      })
    );
    expect(grokSend.status).toBe(403);
    expect(await grokSend.json()).toEqual({ error: 'Insufficient scope.' });

    const adminSend = await callTool(
      authed('http://localhost/api/agents/grokbot/tools', '203.0.113.61', ADMIN, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ tool: 'send_customer_reply', arguments: {} }),
      })
    );
    expect(adminSend.status).toBe(400);

    const grokAction = await leadAction(
      authed('http://localhost/api/sales/leads/missing-lead/actions', '203.0.113.62', GROK, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ action: 'send' }),
      }),
      leadCtx
    );
    expect(grokAction.status).toBe(403);

    const adminAction = await leadAction(
      authed('http://localhost/api/sales/leads/missing-lead/actions', '203.0.113.63', ADMIN, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ action: 'send' }),
      }),
      leadCtx
    );
    expect(adminAction.status).toBe(404);
  });
});

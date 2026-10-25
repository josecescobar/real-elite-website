import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ingestInboundLead } from '@/lib/sales/pipeline';
import { resetSalesStore } from '@/lib/sales/store';
import { GET as listLeads } from '@/app/api/sales/leads/route';
import { GET as getLead } from '@/app/api/sales/leads/[id]/route';
import { POST as leadAction } from '@/app/api/sales/leads/[id]/actions/route';
import { GET as listTasks, POST as createTask } from '@/app/api/agents/grokbot/tasks/route';
import { GET as getTask } from '@/app/api/agents/grokbot/tasks/[taskId]/route';
import { POST as callTool } from '@/app/api/agents/grokbot/tools/route';

const ADMIN = 'test-admin-key-value';
const GROK = 'test-grokbot-key-value';

// Synthetic customer. Reserved 555-01xx number and example.com address.
const EMAIL = 'pat.sample@example.com';
const PHONE = '5555550142';
const NAME = 'Pat Sample';
const ADDRESS = '100 Example Lane';

let ipCounter = 0;
function nextIp() {
  ipCounter += 1;
  return `198.51.100.${ipCounter}`;
}

function authed(url: string, key: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  headers.set('x-forwarded-for', nextIp());
  headers.set('authorization', `Bearer ${key}`);
  return new Request(url, { ...init, headers });
}

function postJson(url: string, key: string, body: unknown) {
  return authed(url, key, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

function leaksContact(payload: unknown): boolean {
  const text = JSON.stringify(payload);
  return [EMAIL, PHONE, NAME, ADDRESS].some((value) => text.includes(value));
}

async function seedLead(): Promise<string> {
  const result = await ingestInboundLead(
    {
      source: 'thumbtack',
      sourceLeadId: 'tt-synthetic-1',
      eventId: 'evt-synthetic-1',
      customer: {
        fullName: NAME,
        email: EMAIL,
        phone: PHONE,
        zip: '20147',
        city: 'Ashburn',
        state: 'VA',
        address: ADDRESS,
      },
      projectType: 'Bathroom remodel',
      projectSummary: 'Primary bath refresh',
      message: 'Looking to redo the primary bath this spring.',
      receivedAt: new Date().toISOString(),
      raw: { customer: { name: NAME, email: EMAIL, phone: PHONE } },
    },
    { send: false }
  );
  return result.lead!.id;
}

beforeEach(() => {
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.UPSTASH_REDIS_REST_TOKEN;
  process.env.ADMIN_TOOLS_KEY = ADMIN;
  process.env.GROKBOT_API_KEY = GROK;
  process.env.GROKBOT_SCOPES = 'leads:read';
  resetSalesStore();
});

afterEach(() => {
  delete process.env.ADMIN_TOOLS_KEY;
  delete process.env.GROKBOT_API_KEY;
  delete process.env.GROKBOT_SCOPES;
  resetSalesStore();
});

describe('customers:read gates customer contact data on lead endpoints', () => {
  it('GET /api/sales/leads strips contact data for a leads:read-only key', async () => {
    await seedLead();
    const res = await listLeads(authed('http://localhost/api/sales/leads', GROK));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.leads).toHaveLength(1);
    expect(body.leads[0].customer).toBeNull();
    expect(body.leads[0].raw).toBeNull();
    expect(body.leads[0].facts.email).toBeUndefined();
    expect(body.leads[0].facts.phone).toBeUndefined();
    expect(body.leads[0].projectType).toBe('Bathroom remodel');
    expect(leaksContact(body)).toBe(false);
  });

  it('GET /api/sales/leads still returns the customer to the full admin key', async () => {
    await seedLead();
    const res = await listLeads(authed('http://localhost/api/sales/leads', ADMIN));
    const body = await res.json();
    expect(body.leads[0].customer).toMatchObject({ email: EMAIL, phone: PHONE });
    expect(body.leads[0].facts).toMatchObject({ email: EMAIL, phone: PHONE });
  });

  it('GET /api/sales/leads/[id] strips customer, facts, raw and inbound authors', async () => {
    const id = await seedLead();
    const ctx = { params: Promise.resolve({ id }) };
    const res = await getLead(authed(`http://localhost/api/sales/leads/${id}`, GROK), ctx);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.customer).toBeNull();
    expect(body.conversation.facts.email).toBeUndefined();
    expect(body.messages.length).toBeGreaterThan(0);
    expect(leaksContact(body)).toBe(false);

    const full = await getLead(
      authed(`http://localhost/api/sales/leads/${id}`, ADMIN),
      { params: Promise.resolve({ id }) }
    );
    const fullBody = await full.json();
    expect(fullBody.customer).toMatchObject({ email: EMAIL, phone: PHONE });
    expect(fullBody.conversation.facts).toMatchObject({ email: EMAIL, phone: PHONE });
  });

  it('lead actions strip contact data from the returned lead without customers:read', async () => {
    process.env.GROKBOT_SCOPES = 'leads:read,leads:write';
    const id = await seedLead();
    const res = await leadAction(
      postJson(`http://localhost/api/sales/leads/${id}/actions`, GROK, { action: 'pause' }),
      { params: Promise.resolve({ id }) }
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.lead.aiPaused).toBe(true);
    expect(leaksContact(body)).toBe(false);

    const full = await leadAction(
      postJson(`http://localhost/api/sales/leads/${id}/actions`, ADMIN, { action: 'takeover' }),
      { params: Promise.resolve({ id }) }
    );
    expect((await full.json()).lead.facts).toMatchObject({ email: EMAIL, phone: PHONE });
  });

  it('grokbot tools strip contact data from lead and conversation results', async () => {
    const id = await seedLead();
    for (const [tool, args] of [
      ['search_leads', {}],
      ['get_lead', { leadId: id }],
      ['get_conversation', { leadId: id }],
    ] as const) {
      const res = await callTool(
        postJson('http://localhost/api/agents/grokbot/tools', GROK, { tool, arguments: args })
      );
      expect(res.status).toBe(200);
      expect(leaksContact(await res.json())).toBe(false);
    }

    const getCustomer = await callTool(
      postJson('http://localhost/api/agents/grokbot/tools', GROK, {
        tool: 'get_customer',
        arguments: { customerId: 'x' },
      })
    );
    expect(getCustomer.status).toBe(403);

    const full = await callTool(
      postJson('http://localhost/api/agents/grokbot/tools', ADMIN, {
        tool: 'get_lead',
        arguments: { leadId: id },
      })
    );
    expect((await full.json()).data.lead.facts).toMatchObject({ email: EMAIL, phone: PHONE });
  });

  it('redacts a full-scope task result when a leads:read-only key reads it back', async () => {
    const id = await seedLead();
    const created = await createTask(
      postJson('http://localhost/api/agents/grokbot/tasks', ADMIN, {
        requestingAgent: 'chatgpt',
        instruction: 'show the lead conversation',
        context: { leadId: id },
      })
    );
    expect(created.status).toBe(201);
    const { task } = await created.json();
    expect(leaksContact(task)).toBe(true);

    const ctx = { params: Promise.resolve({ taskId: task.id }) };
    const restricted = await getTask(
      authed(`http://localhost/api/agents/grokbot/tasks/${task.id}`, GROK),
      ctx
    );
    expect(restricted.status).toBe(200);
    expect(leaksContact(await restricted.json())).toBe(false);

    const list = await listTasks(authed('http://localhost/api/agents/grokbot/tasks', GROK));
    const listBody = await list.json();
    expect(listBody.tasks).toHaveLength(1);
    expect(leaksContact(listBody)).toBe(false);

    const full = await getTask(
      authed(`http://localhost/api/agents/grokbot/tasks/${task.id}`, ADMIN),
      { params: Promise.resolve({ taskId: task.id }) }
    );
    expect(leaksContact(await full.json())).toBe(true);
  });

  it('withholds task instruction and context that carry contact details', async () => {
    const id = await seedLead();
    const created = await createTask(
      postJson('http://localhost/api/agents/grokbot/tasks', ADMIN, {
        requestingAgent: 'chatgpt',
        instruction: `call ${NAME} at ${PHONE} or email ${EMAIL} about ${ADDRESS}`,
        context: { leadId: id, note: `${NAME} ${EMAIL} ${PHONE}` },
      })
    );
    expect(created.status).toBe(201);
    const { task } = await created.json();

    const restricted = await getTask(
      authed(`http://localhost/api/agents/grokbot/tasks/${task.id}`, GROK),
      { params: Promise.resolve({ taskId: task.id }) }
    );
    expect(restricted.status).toBe(200);
    const restrictedBody = await restricted.json();
    expect(leaksContact(restrictedBody)).toBe(false);
    expect(restrictedBody.task.context).toBeNull();

    const list = await listTasks(authed('http://localhost/api/agents/grokbot/tasks', GROK));
    expect(leaksContact(await list.json())).toBe(false);

    const full = await getTask(
      authed(`http://localhost/api/agents/grokbot/tasks/${task.id}`, ADMIN),
      { params: Promise.resolve({ taskId: task.id }) }
    );
    const fullBody = await full.json();
    expect(fullBody.task.instruction).toContain(EMAIL);
    expect(fullBody.task.context).toMatchObject({ leadId: id });
  });

  it('redacts task results run under an explicit permissions list without customers:read', async () => {
    const id = await seedLead();
    const created = await createTask(
      postJson('http://localhost/api/agents/grokbot/tasks', ADMIN, {
        requestingAgent: 'chatgpt',
        instruction: 'show the lead',
        context: { leadId: id },
        permissions: ['leads:read'],
      })
    );
    expect(created.status).toBe(201);
    expect(leaksContact(await created.json())).toBe(false);
  });
});

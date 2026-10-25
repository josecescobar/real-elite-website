import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { resetSalesStore } from '@/lib/sales/store';
import { ingestInboundLead } from '@/lib/sales/pipeline';
import { parseThumbtackPayload } from '@/lib/sales/connectors/thumbtack';

async function loadRoute() {
  return import('./route');
}

beforeEach(() => {
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  process.env.GROKBOT_API_KEY = 'test-grokbot-key-value';
  resetSalesStore();
});

afterEach(() => {
  delete process.env.GROKBOT_API_KEY;
  vi.restoreAllMocks();
  resetSalesStore();
});

describe('POST /api/agents/grokbot/tasks', () => {
  it('rejects missing auth', async () => {
    const { POST } = await loadRoute();
    const res = await POST(
      new Request('http://localhost/api/agents/grokbot/tasks', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ requestingAgent: 'chatgpt', instruction: 'list leads' }),
      })
    );
    expect(res.status).toBe(401);
  });

  it('runs a task and returns a result', async () => {
    const inbound = parseThumbtackPayload({
      eventID: 'evt_task',
      eventType: 'NegotiationCreatedV4',
      data: {
        negotiationID: 'neg_task',
        customer: { name: 'Sam Neighbor' },
        request: {
          category: 'Kitchen Remodel',
          description: 'Need new cabinets in Leesburg',
          location: { zipCode: '20176', city: 'Leesburg', state: 'VA' },
        },
      },
    });
    const seeded = await ingestInboundLead(inbound!);

    const { POST } = await loadRoute();
    const res = await POST(
      new Request('http://localhost/api/agents/grokbot/tasks', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: 'Bearer test-grokbot-key-value',
        },
        body: JSON.stringify({
          taskId: 'task_sim_1',
          requestingAgent: 'chatgpt',
          instruction: 'Draft a reply for this kitchen lead',
          context: { leadId: seeded.lead?.id },
          permissions: ['leads:read', 'leads:draft'],
          createdAt: '2026-09-06T13:05:00Z',
        }),
      })
    );
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.task.id).toBe('task_sim_1');
    expect(json.task.status).toBe('completed');
    expect(json.task.requestingAgent).toBe('chatgpt');
    expect(JSON.stringify(json.task.result)).toMatch(/Kitchen|cabinets|Leesburg/i);
  });

  it('does not let an explicit leads:send permission escalate the grokbot key', async () => {
    const inbound = parseThumbtackPayload({
      eventID: 'evt_send_scope',
      eventType: 'NegotiationCreatedV4',
      data: {
        negotiationID: 'neg_send_scope',
        customer: { name: 'Sam Neighbor' },
        request: {
          category: 'Kitchen Remodel',
          description: 'Need new cabinets in Leesburg',
          location: { zipCode: '20176', city: 'Leesburg', state: 'VA' },
        },
      },
    });
    const seeded = await ingestInboundLead(inbound!);

    const { POST } = await loadRoute();
    const res = await POST(
      new Request('http://localhost/api/agents/grokbot/tasks', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: 'Bearer test-grokbot-key-value',
          'x-forwarded-for': '198.51.100.77',
        },
        body: JSON.stringify({
          requestingAgent: 'chatgpt',
          instruction: 'Send the reply to this lead',
          context: { leadId: seeded.lead?.id },
          permissions: ['leads:send'],
        }),
      })
    );
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.task.status).toBe('failed');
    expect(json.task.error).toMatch(/Missing scope/);
  });
});

describe('GET /api/agents/grokbot/tasks — header-only auth (audit M1)', () => {
  it('returns 401 for ?key= with no header (task list and tool definitions)', async () => {
    const { GET } = await loadRoute();
    for (const url of [
      'http://localhost/api/agents/grokbot/tasks?key=test-grokbot-key-value',
      'http://localhost/api/agents/grokbot/tasks?tools=1&key=test-grokbot-key-value',
    ]) {
      const res = await GET(new Request(url));
      expect(res.status).toBe(401);
    }
  });

  it('still serves callers that send Authorization: Bearer', async () => {
    const { GET } = await loadRoute();
    const list = await GET(
      new Request('http://localhost/api/agents/grokbot/tasks', {
        headers: { authorization: 'Bearer test-grokbot-key-value' },
      })
    );
    expect(list.status).toBe(200);
    const tools = await GET(
      new Request('http://localhost/api/agents/grokbot/tasks?tools=1', {
        headers: { authorization: 'Bearer test-grokbot-key-value' },
      })
    );
    expect(tools.status).toBe(200);
    expect(Array.isArray((await tools.json()).tools)).toBe(true);
  });
});

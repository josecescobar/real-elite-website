import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { resetSalesStore } from '@/lib/sales/store';

const payload = {
  eventID: 'evt_sim_walkin_shower_001',
  eventType: 'NegotiationCreatedV4',
  createdAt: '2026-09-06T13:00:00Z',
  data: {
    negotiationID: 'neg_sim_25401_bath',
    customer: { name: 'Jane Homeowner', phone: '6815550142', email: 'jane@example.com' },
    request: {
      category: 'Bathroom Remodel',
      description: 'Need a walk-in shower in the hall bath. Tile is cracked and the pan leaks.',
      location: { zipCode: '25401', city: 'Martinsburg', state: 'WV' },
    },
    estimatedValue: 12000,
    urgency: 'this month',
  },
};

async function loadRoute() {
  resetSalesStore();
  return import('./route');
}

function post(body: unknown, headers: Record<string, string> = {}) {
  return new Request('http://localhost/api/webhooks/thumbtack', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': '203.0.113.50', ...headers },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  delete process.env.THUMBTACK_WEBHOOK_TOKEN;
  delete process.env.THUMBTACK_WEBHOOK_USER;
  delete process.env.THUMBTACK_WEBHOOK_PASSWORD;
  delete process.env.THUMBTACK_ACCESS_TOKEN;
  delete process.env.SALES_AGENT_MODE;
  resetSalesStore();
});

afterEach(() => {
  vi.restoreAllMocks();
  resetSalesStore();
});

describe('POST /api/webhooks/thumbtack', () => {
  it('stores a lead, conversation, and drafted reply without sending', async () => {
    const { POST } = await loadRoute();
    const res = await POST(post(payload));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.duplicate).toBe(false);
    expect(json.lead.source).toBe('thumbtack');
    expect(json.lead.score).toBeGreaterThanOrEqual(70);
    expect(json.draftReply).toMatch(/walk-in shower|hall bath/i);
    expect(json.draftReply.toLowerCase()).not.toMatch(/how can we help/);
    expect(json.send.sent).toBe(false);
    expect(json.send.reason).toMatch(/thumbtack_outbound_not_configured|draft_only|escalated/);
  });

  it('is idempotent on the same event id', async () => {
    const { POST } = await loadRoute();
    const first = await POST(post(payload));
    const a = await first.json();
    const second = await POST(post(payload));
    const b = await second.json();
    expect(b.duplicate).toBe(true);
    expect(b.lead.id).toBe(a.lead.id);
  });

  it('rejects bad JSON', async () => {
    const { POST } = await loadRoute();
    const res = await POST(
      new Request('http://localhost/api/webhooks/thumbtack', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-forwarded-for': '203.0.113.51' },
        body: '{not-json',
      })
    );
    expect(res.status).toBe(400);
  });

  it('enforces webhook token when configured', async () => {
    process.env.THUMBTACK_WEBHOOK_TOKEN = 'test-webhook-token';
    const { POST } = await loadRoute();
    const denied = await POST(post(payload));
    expect(denied.status).toBe(401);
    const allowed = await POST(post(payload, { authorization: 'Bearer test-webhook-token' }));
    expect(allowed.status).toBe(200);
  });
});

describe('GET /api/webhooks/thumbtack', () => {
  it('returns a health handshake', async () => {
    const { GET } = await loadRoute();
    const res = await GET();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.acceptedEvents).toContain('NegotiationCreatedV4');
  });
});

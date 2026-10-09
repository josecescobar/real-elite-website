import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getSalesStore, resetSalesStore } from '@/lib/sales/store';

const TOKEN = 'test-webhook-token';

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

const marylandPayload = {
  eventID: 'evt_sim_frederick_deck_001',
  eventType: 'NegotiationCreatedV4',
  createdAt: '2026-10-09T15:00:00Z',
  data: {
    negotiationID: 'neg_sim_21701_deck',
    customer: { name: 'Alex Rivera', phone: '3015550142', email: 'alex@example.com' },
    request: {
      category: 'Deck Construction',
      description: 'New deck in Frederick.',
      location: { zipCode: '21701', city: 'Frederick', state: 'MD', address: '10 Market St' },
    },
  },
};

async function loadRoute() {
  resetSalesStore();
  return import('./route');
}

function post(
  body: unknown,
  headers: Record<string, string> = {},
  ip = '203.0.113.50',
) {
  const raw = typeof body === 'string' ? body : JSON.stringify(body);
  return new Request('http://localhost/api/webhooks/thumbtack', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': ip, ...headers },
    body: raw,
  });
}

function authed(body: unknown, headers: Record<string, string> = {}, ip = '203.0.113.50') {
  return post(body, { authorization: `Bearer ${TOKEN}`, ...headers }, ip);
}

function useToken() {
  process.env.THUMBTACK_WEBHOOK_TOKEN = TOKEN;
}

function leadWebhookCalls(fetchMock: ReturnType<typeof vi.fn>) {
  return fetchMock.mock.calls.filter(([url]) => url === 'https://job-board.example/api/leads');
}

beforeEach(() => {
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  delete process.env.THUMBTACK_WEBHOOK_TOKEN;
  delete process.env.THUMBTACK_WEBHOOK_USER;
  delete process.env.THUMBTACK_WEBHOOK_PASSWORD;
  delete process.env.THUMBTACK_WEBHOOK_SECRET;
  delete process.env.THUMBTACK_ACCESS_TOKEN;
  delete process.env.THUMBTACK_BUSINESS_ID;
  delete process.env.SALES_AGENT_MODE;
  delete process.env.LEAD_WEBHOOK_URL;
  delete process.env.LEAD_WEBHOOK_SECRET;
  resetSalesStore();
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  resetSalesStore();
});

describe('POST /api/webhooks/thumbtack', () => {
  it('rejects when Thumbtack auth is not configured and does not store or forward', async () => {
    process.env.LEAD_WEBHOOK_URL = 'https://job-board.example/api/leads';
    process.env.LEAD_WEBHOOK_SECRET = 'board-secret';
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const { POST } = await loadRoute();
    const res = await POST(post(payload, {}, '203.0.113.60'));
    expect(res.status).toBe(503);
    const json = await res.json();
    expect(json.error).toBe('Thumbtack webhook auth is not configured.');
    expect(JSON.stringify(json)).not.toMatch(/THUMBTACK_WEBHOOK_|board-secret/);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(await getSalesStore().listLeads()).toHaveLength(0);
  });

  it('rejects incomplete Basic auth instead of accepting the post', async () => {
    process.env.THUMBTACK_WEBHOOK_USER = 'thumbtack-user';
    const { POST } = await loadRoute();
    const res = await POST(post(payload, {}, '203.0.113.61'));
    expect(res.status).toBe(503);
  });

  it('stores a lead, conversation, and drafted reply without sending', async () => {
    useToken();
    const { POST } = await loadRoute();
    const res = await POST(authed(payload, {}, '203.0.113.62'));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.duplicate).toBe(false);
    expect(json.lead.source).toBe('thumbtack');
    expect(json.lead.score).toBeGreaterThanOrEqual(70);
    expect(json.draftReply).toMatch(/walk-in shower|hall bath/i);
    expect(json.draftReply.toLowerCase()).not.toMatch(/how can we help/);
    expect(json.send.sent).toBe(false);
    expect(json.send.attempted).toBe(false);
    expect(json.send.reason).toBe('auto_reply_disabled');
  });

  it('does not call the Thumbtack API even when outbound and autopilot are configured', async () => {
    useToken();
    process.env.THUMBTACK_ACCESS_TOKEN = 'outbound-token';
    process.env.THUMBTACK_BUSINESS_ID = 'biz_sim';
    process.env.SALES_AGENT_MODE = 'safe_autopilot';
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const { POST } = await loadRoute();
    const res = await POST(authed(payload, {}, '203.0.113.63'));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.send.sent).toBe(false);
    expect(json.send.attempted).toBe(false);
    expect(fetchMock.mock.calls.some(([url]) => String(url).includes('api.thumbtack.com'))).toBe(false);
  });

  it('is idempotent on the same event id', async () => {
    useToken();
    const { POST } = await loadRoute();
    const first = await POST(authed(payload, {}, '203.0.113.64'));
    const a = await first.json();
    const second = await POST(authed(payload, {}, '203.0.113.64'));
    const b = await second.json();
    expect(b.duplicate).toBe(true);
    expect(b.lead.id).toBe(a.lead.id);
  });

  it('rejects bad JSON when auth is configured', async () => {
    useToken();
    const { POST } = await loadRoute();
    const res = await POST(authed('{not-json', {}, '203.0.113.65'));
    expect(res.status).toBe(400);
  });

  it('enforces webhook token when configured', async () => {
    useToken();
    const { POST } = await loadRoute();
    const denied = await POST(post(payload, {}, '203.0.113.66'));
    expect(denied.status).toBe(401);
    const allowed = await POST(authed(payload, {}, '203.0.113.66'));
    expect(allowed.status).toBe(200);
  });

  it('forwards a NegotiationCreatedV4 lead, including a Maryland town, and does not invent SMS consent', async () => {
    useToken();
    process.env.LEAD_WEBHOOK_URL = 'https://job-board.example/api/leads';
    process.env.LEAD_WEBHOOK_SECRET = 'board-secret';
    const fetchMock = vi.fn().mockResolvedValue(new Response('{"ok":true}', { status: 201 }));
    vi.stubGlobal('fetch', fetchMock);
    const { POST } = await loadRoute();
    const res = await POST(authed(marylandPayload, {}, '203.0.113.67'));
    expect(res.status).toBe(200);
    const calls = leadWebhookCalls(fetchMock);
    expect(calls).toHaveLength(1);
    expect(calls[0][1].headers.Authorization).toBe('Bearer board-secret');
    const forwarded = JSON.parse(calls[0][1].body as string);
    expect(forwarded).toMatchObject({
      source: 'thumbtack',
      how_heard: 'thumbtack',
      call_sid: 'tt-neg_sim_21701_deck',
      name: 'Alex Rivera',
      phone: '3015550142',
      email: 'alex@example.com',
      zip: '21701',
      town: 'Frederick, MD',
      state: 'MD',
      address: '10 Market St',
      job_type: 'Deck Construction',
      summary: 'New deck in Frederick.',
      company_name: 'Real Elite Contracting',
    });
    expect(forwarded.consent).toBeUndefined();
    expect(forwarded.consent_text).toBeUndefined();
    expect(JSON.stringify(forwarded)).not.toMatch(/license/i);
  });

  it('does not forward MessageCreatedV4 or ReviewCreatedV4 to the Job Board', async () => {
    useToken();
    process.env.LEAD_WEBHOOK_URL = 'https://job-board.example/api/leads';
    process.env.LEAD_WEBHOOK_SECRET = 'board-secret';
    const fetchMock = vi.fn().mockResolvedValue(new Response('{"ok":true}', { status: 201 }));
    vi.stubGlobal('fetch', fetchMock);
    const { POST } = await loadRoute();
    const message = await POST(
      authed(
        {
          eventID: 'evt_sim_msg_001',
          eventType: 'MessageCreatedV4',
          negotiationID: 'neg_sim_21701_deck',
          message: { text: 'Can you start next month?' },
        },
        {},
        '203.0.113.68',
      ),
    );
    const review = await POST(
      authed(
        {
          eventID: 'evt_sim_review_001',
          eventType: 'ReviewCreatedV4',
          negotiationID: 'neg_sim_21701_deck',
          review: { rating: 5, text: 'Solid work on the deck.' },
        },
        {},
        '203.0.113.69',
      ),
    );
    expect(message.status).toBe(200);
    expect(review.status).toBe(200);
    expect(leadWebhookCalls(fetchMock)).toHaveLength(0);
    const reviewJson = await review.json();
    expect(reviewJson.send.sent).toBe(false);
    expect(reviewJson.lead).toBeTruthy();
  });

  it('still returns 200 when the Job Board forward fails', async () => {
    useToken();
    process.env.LEAD_WEBHOOK_URL = 'https://job-board.example/api/leads';
    const fetchMock = vi.fn().mockRejectedValue(new Error('webhook down'));
    vi.stubGlobal('fetch', fetchMock);
    const { POST } = await loadRoute();
    const res = await POST(authed(payload, {}, '203.0.113.70'));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.send.sent).toBe(false);
  });

  it('does not call the Job Board when LEAD_WEBHOOK_URL is unset', async () => {
    useToken();
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const { POST } = await loadRoute();
    const res = await POST(authed(payload, {}, '203.0.113.71'));
    expect(res.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('GET /api/webhooks/thumbtack', () => {
  it('reports status without leaking configured secret values', async () => {
    process.env.THUMBTACK_WEBHOOK_TOKEN = 'super-secret-token-value';
    process.env.THUMBTACK_WEBHOOK_PASSWORD = 'super-secret-password-value';
    process.env.THUMBTACK_WEBHOOK_USER = 'thumbtack-user';
    const { GET } = await loadRoute();
    const res = await GET();
    expect(res.status).toBe(200);
    const text = await res.text();
    const json = JSON.parse(text);
    expect(json.ok).toBe(true);
    expect(json.authRequired).toBe(true);
    expect(json.authConfigured).toBe(true);
    expect(json.acceptingPosts).toBe(true);
    expect(json.acceptedEvents).toContain('NegotiationCreatedV4');
    expect(text).not.toContain('super-secret-token-value');
    expect(text).not.toContain('super-secret-password-value');
    expect(text).not.toContain('thumbtack-user');
  });

  it('reports that posts are not accepted when auth is unset', async () => {
    const { GET } = await loadRoute();
    const res = await GET();
    const json = await res.json();
    expect(json.authRequired).toBe(true);
    expect(json.authConfigured).toBe(false);
    expect(json.acceptingPosts).toBe(false);
  });
});

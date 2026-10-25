import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { resetSalesStore } from '@/lib/sales/store';

const ADMIN = 'test-admin-key-value';
const GROK = 'test-grokbot-key-value';

beforeEach(() => {
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  process.env.ADMIN_TOOLS_KEY = ADMIN;
  process.env.GROKBOT_API_KEY = GROK;
  resetSalesStore();
});

afterEach(() => {
  delete process.env.ADMIN_TOOLS_KEY;
  delete process.env.GROKBOT_API_KEY;
  resetSalesStore();
});

const ctx = (id: string) => ({ params: Promise.resolve({ id }) });

describe('GET /api/sales/leads — header-only auth (audit M1)', () => {
  it('returns 401 for ?key= with no header', async () => {
    const { GET } = await import('./route');
    for (const key of [ADMIN, GROK]) {
      const res = await GET(new Request(`http://localhost/api/sales/leads?bucket=all&key=${key}`));
      expect(res.status).toBe(401);
    }
  });

  it('returns 200 with Authorization: Bearer', async () => {
    const { GET } = await import('./route');
    const res = await GET(
      new Request('http://localhost/api/sales/leads?bucket=all', {
        headers: { authorization: `Bearer ${ADMIN}` },
      })
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ leads: [] });
  });
});

describe('GET /api/sales/leads/[id] — header-only auth (audit M1)', () => {
  it('returns 401 for ?key= with no header', async () => {
    const { GET } = await import('./[id]/route');
    const res = await GET(new Request(`http://localhost/api/sales/leads/abc?key=${ADMIN}`), ctx('abc'));
    expect(res.status).toBe(401);
  });

  it('passes auth with a header (404 for an unknown lead)', async () => {
    const { GET } = await import('./[id]/route');
    const res = await GET(
      new Request('http://localhost/api/sales/leads/abc', { headers: { 'x-admin-key': ADMIN } }),
      ctx('abc')
    );
    expect(res.status).toBe(404);
  });
});

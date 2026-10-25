import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { resetSalesStore } from '@/lib/sales/store';

const GROK = 'test-grokbot-key-value';
const ctx = { params: Promise.resolve({ taskId: 'missing' }) };

beforeEach(() => {
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  process.env.GROKBOT_API_KEY = GROK;
  resetSalesStore();
});

afterEach(() => {
  delete process.env.GROKBOT_API_KEY;
  resetSalesStore();
});

describe('GET /api/agents/grokbot/tasks/[taskId] — header-only auth (audit M1)', () => {
  it('returns 401 for ?key= with no header', async () => {
    const { GET } = await import('./route');
    const res = await GET(new Request(`http://localhost/api/agents/grokbot/tasks/missing?key=${GROK}`), ctx);
    expect(res.status).toBe(401);
  });

  it('passes auth with Authorization: Bearer (404 for an unknown task)', async () => {
    const { GET } = await import('./route');
    const res = await GET(
      new Request('http://localhost/api/agents/grokbot/tasks/missing', {
        headers: { authorization: `Bearer ${GROK}` },
      }),
      ctx
    );
    expect(res.status).toBe(404);
  });
});

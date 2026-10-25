import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { GET } from './route';

describe('GET /api/sales/health', () => {
  beforeEach(() => {
    process.env.ADMIN_TOOLS_KEY = 'test-admin-key-value';
    process.env.GROKBOT_API_KEY = 'test-grokbot-key-value';
  });

  afterEach(() => {
    delete process.env.ADMIN_TOOLS_KEY;
    delete process.env.GROKBOT_API_KEY;
  });

  it('returns only the public liveness signal without admin authorization', async () => {
    const res = await GET(new Request('http://localhost/api/sales/health'));
    expect(await res.json()).toEqual({ ok: true });
  });

  it('does not accept alternate key headers or the Grokbot key for detailed status', async () => {
    const alternateHeader = await GET(new Request('http://localhost/api/sales/health', {
      headers: { 'x-api-key': 'test-admin-key-value' },
    }));
    const grokbotKey = await GET(new Request('http://localhost/api/sales/health', {
      headers: { authorization: 'Bearer test-grokbot-key-value' },
    }));

    expect(await alternateHeader.json()).toEqual({ ok: true });
    expect(await grokbotKey.json()).toEqual({ ok: true });
  });

  it('reports detailed status only for the admin Bearer key', async () => {
    const res = await GET(new Request('http://localhost/api/sales/health', {
      headers: { authorization: 'Bearer test-admin-key-value' },
    }));
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.agent).toBe('grokbot');
    expect(json.thumbtack.webhookPath).toBe('/api/webhooks/thumbtack');
    expect(json.bridge.tasksPath).toBe('/api/agents/grokbot/tasks');
    expect(json.store).toMatch(/memory|supabase/);
    expect(JSON.stringify(json)).not.toMatch(/sk-|Bearer |password/i);
  });
});

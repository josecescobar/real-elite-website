import { describe, expect, it } from 'vitest';
import { GET } from './route';

describe('GET /api/sales/health', () => {
  it('reports grokbot status without secrets', async () => {
    const res = await GET();
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.agent).toBe('grokbot');
    expect(json.thumbtack.webhookPath).toBe('/api/webhooks/thumbtack');
    expect(json.bridge.tasksPath).toBe('/api/agents/grokbot/tasks');
    expect(JSON.stringify(json)).not.toMatch(/sk-|Bearer |password/i);
  });
});

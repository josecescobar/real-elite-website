import { afterEach, describe, expect, it, vi } from 'vitest';
import { postLeadWebhook } from './lead-webhook';

describe('postLeadWebhook error logging', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    delete process.env.LEAD_WEBHOOK_URL;
  });

  it('returns false when unconfigured and true on a 2xx', async () => {
    expect(await postLeadWebhook({})).toBe(false);
    process.env.LEAD_WEBHOOK_URL = 'https://job-board.example/api/leads';
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status: 200 })));
    expect(await postLeadWebhook({})).toBe(true);
  });

  it('redacts the full body before truncating, so values across the 500-char cut never leak', async () => {
    process.env.LEAD_WEBHOOK_URL = 'https://job-board.example/api/leads';
    const phone = '+16815550142';
    const email = 'jane.doe@example.com';
    // The phone straddles character 500; the email follows right after it.
    const body = `${'x'.repeat(495)}${phone} ${email} tail`;
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(body, { status: 422 })));
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(await postLeadWebhook({})).toBe(false);
    const logged = JSON.stringify(error.mock.calls);
    expect(logged).toContain('Lead webhook failed');
    expect(logged).not.toMatch(/68155|55501|5550142/);
    expect(logged).not.toContain('jane');
    expect(logged).not.toContain('example.com');
  });
});

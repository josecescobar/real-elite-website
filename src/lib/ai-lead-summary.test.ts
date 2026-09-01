import { describe, it, expect, vi, afterEach } from 'vitest';
import { summarizeLead } from '@/lib/ai-lead-summary';

const baseInput = {
  fullName: 'Jane Homeowner',
  service: 'Roofing — Instant Quote',
};

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  delete process.env.AI_GATEWAY_API_KEY;
});

describe('summarizeLead', () => {
  it('resolves to null (no fetch) when AI_GATEWAY_API_KEY is absent', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    await expect(summarizeLead(baseInput)).resolves.toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('posts to the AI Gateway with auth headers and returns the trimmed summary', async () => {
    process.env.AI_GATEWAY_API_KEY = 'test_key';
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({ choices: [{ message: { content: '  A short summary.  ' } }] }),
        { status: 200 }
      )
    );
    vi.stubGlobal('fetch', fetchMock);

    const result = await summarizeLead({ ...baseInput, message: 'Storm damage last week.' });

    expect(result).toBe('A short summary.');
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, opts] = fetchMock.mock.calls[0];
    expect(url).toBe('https://ai-gateway.vercel.sh/v1/chat/completions');
    expect(opts.headers.Authorization).toBe('Bearer test_key');
    const body = JSON.parse(opts.body as string);
    expect(body.model).toBe('minimax/minimax-m3-free');
    expect(body.messages[1].content).toContain('Storm damage last week.');
  });

  it('resolves to null (never throws) when the request rejects', async () => {
    process.env.AI_GATEWAY_API_KEY = 'test_key';
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network')));
    await expect(summarizeLead(baseInput)).resolves.toBeNull();
  });

  it('resolves to null and logs when the Gateway returns a non-ok status', async () => {
    process.env.AI_GATEWAY_API_KEY = 'test_key';
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('bad', { status: 500 })));
    await expect(summarizeLead(baseInput)).resolves.toBeNull();
    expect(errSpy).toHaveBeenCalled();
  });

  it('resolves to null when the response has no usable content', async () => {
    process.env.AI_GATEWAY_API_KEY = 'test_key';
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(JSON.stringify({ choices: [] }), { status: 200 }))
    );
    await expect(summarizeLead(baseInput)).resolves.toBeNull();
  });
});

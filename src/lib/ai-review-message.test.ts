import { describe, it, expect, vi, afterEach } from 'vitest';
import { draftReviewMessage } from '@/lib/ai-review-message';

const LINK = 'https://search.google.com/local/writereview?placeid=abc123';
const baseInput = { firstName: 'Sarah', link: LINK };

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  delete process.env.AI_GATEWAY_API_KEY;
});

describe('draftReviewMessage', () => {
  it('resolves to null (no fetch) when AI_GATEWAY_API_KEY is absent', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    await expect(draftReviewMessage(baseInput)).resolves.toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('posts to the AI Gateway with auth headers and returns a valid draft', async () => {
    process.env.AI_GATEWAY_API_KEY = 'test_key';
    const draft = `Hi Sarah, thanks for trusting us with the kitchen remodel! ${LINK}`;
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ choices: [{ message: { content: `  ${draft}  ` } }] }), {
        status: 200,
      })
    );
    vi.stubGlobal('fetch', fetchMock);

    const result = await draftReviewMessage({ ...baseInput, jobType: 'kitchen remodel' });

    expect(result).toBe(draft);
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, opts] = fetchMock.mock.calls[0];
    expect(url).toBe('https://ai-gateway.vercel.sh/v1/chat/completions');
    expect(opts.headers.Authorization).toBe('Bearer test_key');
    const body = JSON.parse(opts.body as string);
    expect(body.model).toBe('minimax/minimax-m3-free');
    expect(body.messages[1].content).toContain('kitchen remodel');
    expect(body.messages[1].content).toContain(LINK);
  });

  it('resolves to null when the draft drops or alters the review link', async () => {
    process.env.AI_GATEWAY_API_KEY = 'test_key';
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            choices: [{ message: { content: 'Hi Sarah, thanks! Leave us a review sometime.' } }],
          }),
          { status: 200 }
        )
      )
    );
    await expect(draftReviewMessage(baseInput)).resolves.toBeNull();
    expect(errSpy).toHaveBeenCalled();
  });

  it('resolves to null when the draft is absurdly long', async () => {
    process.env.AI_GATEWAY_API_KEY = 'test_key';
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const longDraft = `Hi Sarah, ${'thanks so much for everything! '.repeat(30)}${LINK}`;
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ choices: [{ message: { content: longDraft } }] }), {
          status: 200,
        })
      )
    );
    await expect(draftReviewMessage(baseInput)).resolves.toBeNull();
  });

  it('resolves to null (never throws) when the request rejects', async () => {
    process.env.AI_GATEWAY_API_KEY = 'test_key';
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network')));
    await expect(draftReviewMessage(baseInput)).resolves.toBeNull();
  });

  it('resolves to null and logs when the Gateway returns a non-ok status', async () => {
    process.env.AI_GATEWAY_API_KEY = 'test_key';
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('bad', { status: 500 })));
    await expect(draftReviewMessage(baseInput)).resolves.toBeNull();
    expect(errSpy).toHaveBeenCalled();
  });

  it('resolves to null when the response has no usable content', async () => {
    process.env.AI_GATEWAY_API_KEY = 'test_key';
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(JSON.stringify({ choices: [] }), { status: 200 }))
    );
    await expect(draftReviewMessage(baseInput)).resolves.toBeNull();
  });
});

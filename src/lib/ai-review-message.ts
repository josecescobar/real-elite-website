/**
 * AI-personalized review-request SMS text, generated via Vercel AI
 * Gateway's free `minimax/minimax-m3-free` model — same service used for
 * the "heads up" lead summary (see ai-lead-summary.ts).
 *
 * The review-request tool at /review-request is a manual, admin-triggered
 * action: Jose or Miguel enters a customer's first name (and, when they
 * have it, the job type / address) right after a job wraps and presses
 * Send. This module tries to turn that into a short, warm, specific
 * thank-you instead of the generic template — referencing the job/address
 * when given — while leaving the actual review ask (the link) untouched.
 *
 * Same fail-safe contract as ai-lead-summary.ts: with `AI_GATEWAY_API_KEY`
 * unset, `draftReviewMessage` resolves to `null` immediately with no
 * network call. When set, it NEVER throws — any failure (bad response,
 * network error, timeout, malformed JSON) is caught and logged, resolving
 * to `null`. On top of that, this is a real outbound customer message, so
 * the draft is rejected (-> null) unless it verbatim contains the exact
 * review link and stays within a safe SMS length — the caller falls back
 * to the plain `buildReviewMessage` template in every `null` case.
 */

import { env } from '@/lib/env';

const AI_GATEWAY_URL = 'https://ai-gateway.vercel.sh/v1/chat/completions';
const MODEL = 'minimax/minimax-m3-free';

/** Fail fast: the admin "Send" click is awaited, so don't make Jose wait. */
const TIMEOUT_MS = 4000;

/** ~3 SMS segments — generous, but a hard ceiling against a runaway draft. */
const MAX_LENGTH = 480;

const SYSTEM_PROMPT =
  'You write a single short text message sent on behalf of Jose, co-owner ' +
  "of Real Elite Contracting, a veteran-owned residential contractor. It's " +
  'sent right after a job wraps, thanking the customer by first name and ' +
  'asking them to leave a quick Google review. Rules: ' +
  '(1) 1-3 short sentences, sound like a real text from Jose, not an ad. ' +
  '(2) If a job type and/or address/area is given, reference it naturally ' +
  '(e.g. "your kitchen remodel" or "the deck on Oak Street") — otherwise ' +
  'keep it warm but general, do not invent details that were not given. ' +
  '(3) Include the exact review link given to you, character-for-character, ' +
  'exactly once, near the end. ' +
  '(4) No markdown, no emoji, no hashtags, no greeting like "Dear", no sign-off. ' +
  '(5) Output ONLY the finished text message body, nothing else.';

/** Everything about the send that's useful context for personalizing it. */
export type ReviewMessageInput = {
  firstName: string;
  link: string;
  jobType?: string;
  address?: string;
};

function buildUserContent(input: ReviewMessageInput): string {
  return [
    `Customer first name: ${input.firstName}`,
    input.jobType ? `Job type: ${input.jobType}` : null,
    input.address ? `Job address/area: ${input.address}` : null,
    `Review link (include exactly, once): ${input.link}`,
  ]
    .filter(Boolean)
    .join('\n');
}

/**
 * Draft a personalized review-request SMS. Returns `null` (never throws)
 * when `AI_GATEWAY_API_KEY` is unset, the call fails/times out/returns
 * something unusable, or the draft fails the link/length safety checks —
 * in every `null` case the caller should send the standard template instead.
 */
export async function draftReviewMessage(
  input: ReviewMessageInput
): Promise<string | null> {
  const apiKey = env.aiGatewayApiKey();
  if (!apiKey) return null;

  try {
    const res = await fetch(AI_GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.4,
        max_tokens: 200,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: buildUserContent(input) },
        ],
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      console.error('AI review message request failed', { status: res.status, body });
      return null;
    }

    const data = await res.json().catch(() => null);
    const text = data?.choices?.[0]?.message?.content;
    if (typeof text !== 'string' || !text.trim()) return null;

    const draft = text.trim();

    // Safety checks on a real outbound customer message: the review ask
    // (the link) must survive verbatim, and the draft must not blow past a
    // sane SMS length. Either failure falls back to the fixed template.
    if (!draft.includes(input.link)) {
      console.error('AI review message dropped/altered the review link — using fallback');
      return null;
    }
    if (draft.length > MAX_LENGTH) {
      console.error('AI review message too long — using fallback', { length: draft.length });
      return null;
    }

    return draft;
  } catch (err) {
    // Network error, timeout/abort, or malformed response — the caller
    // always has the plain template to fall back to.
    console.error('AI review message error', err);
    return null;
  }
}

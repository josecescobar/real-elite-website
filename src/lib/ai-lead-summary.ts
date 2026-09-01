/**
 * AI "heads up" lead summary — a short, plain-English blurb describing what
 * a visitor is asking for, generated via Vercel AI Gateway's free
 * `minimax/minimax-m3-free` model so Jose/Miguel can skim it in the lead
 * email/ledger before they call back.
 *
 * Purely additive, same env-gated pattern as Twilio/Supabase elsewhere in
 * this codebase: with `AI_GATEWAY_API_KEY` unset (today's default),
 * `summarizeLead` resolves to `null` immediately without a network call.
 * When set, it NEVER throws — any failure (bad response, network error,
 * timeout, malformed JSON) is caught and logged, resolving to `null` so the
 * caller's email/SMS/ledger flow is never blocked or broken by an AI outage.
 */

import { env } from '@/lib/env';

const AI_GATEWAY_URL = 'https://ai-gateway.vercel.sh/v1/chat/completions';
const MODEL = 'minimax/minimax-m3-free';

/** Fail fast: a lead email/ledger write should never wait long on this. */
const TIMEOUT_MS = 4000;

const SYSTEM_PROMPT =
  'You write short internal "heads up" notes for the two owners of a small ' +
  'residential contracting company, summarizing an inbound lead before they ' +
  'call the customer back. In 2-4 plain-English sentences, describe what the ' +
  'visitor wants, the property if mentioned, and anything notable (damage, ' +
  'urgency, budget sensitivity, a specific ask). Be concrete and skip filler. ' +
  'No greeting, no sign-off, no markdown, no bullet points — plain prose only.';

/** Everything about a lead that's useful context for the summary. */
export type LeadSummaryInput = {
  fullName: string;
  service: string;
  message?: string;
  propertyType?: string;
  timeline?: string;
  budgetRange?: string;
  zip?: string;
};

function buildUserContent(input: LeadSummaryInput): string {
  return [
    `Service requested: ${input.service}`,
    input.propertyType ? `Property type: ${input.propertyType}` : null,
    input.zip ? `ZIP code: ${input.zip}` : null,
    input.timeline ? `Timeline: ${input.timeline}` : null,
    input.budgetRange ? `Budget range: ${input.budgetRange}` : null,
    input.message ? `Message from visitor: ${input.message}` : null,
  ]
    .filter(Boolean)
    .join('\n');
}

/**
 * Generate a short AI summary of a lead. Returns `null` (never throws) when
 * `AI_GATEWAY_API_KEY` is unset or the call fails/times out/returns
 * something unusable.
 */
export async function summarizeLead(input: LeadSummaryInput): Promise<string | null> {
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
        temperature: 0.3,
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
      console.error('AI lead summary request failed', { status: res.status, body });
      return null;
    }

    const data = await res.json().catch(() => null);
    const text = data?.choices?.[0]?.message?.content;
    if (typeof text !== 'string' || !text.trim()) return null;
    return text.trim();
  } catch (err) {
    // Network error, timeout/abort, or malformed response — the owner email
    // and ledger write already carry the raw lead details either way.
    console.error('AI lead summary error', err);
    return null;
  }
}

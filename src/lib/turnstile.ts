/**
 * Cloudflare Turnstile siteverify. Shared by /api/estimate and, later,
 * /api/roof-estimate. Inert when TURNSTILE_SECRET_KEY is unset: the lead
 * path keeps working and a single warning is logged per process.
 */

import { env } from './env';

export const TURNSTILE_SITEVERIFY_URL =
  'https://challenges.cloudflare.com/turnstile/v0/siteverify';

/** Short on purpose: a hung siteverify must not stall lead capture. */
export const TURNSTILE_TIMEOUT_MS = 4_000;

export type TurnstileVerdict =
  | { ok: true; enforced: false }
  | { ok: true; enforced: true }
  | { ok: false; enforced: true; reason: 'missing' | 'invalid' };

let warnedSecretUnset = false;

/**
 * Verify a Turnstile token with Cloudflare.
 * `token` is the `cf-turnstile-response` value posted by the widget.
 * `ip` is the client address (omitted when unknown).
 */
export async function verifyTurnstile(
  token: string | null | undefined,
  ip?: string | null
): Promise<TurnstileVerdict> {
  const secret = env.turnstileSecretKey()?.trim();
  if (!secret) {
    if (!warnedSecretUnset) {
      warnedSecretUnset = true;
      console.warn('turnstile: TURNSTILE_SECRET_KEY unset; verification skipped');
    }
    return { ok: true, enforced: false };
  }

  const responseToken = typeof token === 'string' ? token.trim() : '';
  if (!responseToken) {
    return { ok: false, enforced: true, reason: 'missing' };
  }

  const body = new URLSearchParams({ secret, response: responseToken });
  if (ip && ip !== 'unknown') body.set('remoteip', ip);

  try {
    const res = await fetch(TURNSTILE_SITEVERIFY_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body,
      signal: AbortSignal.timeout(TURNSTILE_TIMEOUT_MS),
      cache: 'no-store',
    });
    if (!res.ok) return { ok: false, enforced: true, reason: 'invalid' };
    const data = (await res.json()) as { success?: boolean };
    if (data.success === true) return { ok: true, enforced: true };
    return { ok: false, enforced: true, reason: 'invalid' };
  } catch {
    console.error('turnstile: siteverify failed');
    return { ok: false, enforced: true, reason: 'invalid' };
  }
}

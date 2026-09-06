import { createHmac, timingSafeEqual } from 'crypto';
import { env } from '@/lib/env';

export type WebhookAuthResult = { ok: true } | { ok: false; status: number; error: string };

function safeEq(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function thumbtackAuthConfigured(): boolean {
  return Boolean(
    (env.thumbtackWebhookUser() && env.thumbtackWebhookPassword()) ||
      env.thumbtackWebhookToken() ||
      env.thumbtackWebhookSecret()
  );
}

export function authorizeThumbtackWebhook(request: Request, rawBody: string): WebhookAuthResult {
  const user = env.thumbtackWebhookUser();
  const pass = env.thumbtackWebhookPassword();
  const token = env.thumbtackWebhookToken();
  const secret = env.thumbtackWebhookSecret();

  // First deploy / local simulate: no auth env means accept, so Jose can
  // POST a test payload before Thumbtack Pro credentials exist.
  if (!user && !pass && !token && !secret) return { ok: true };

  if (user && pass) {
    const header = request.headers.get('authorization') ?? '';
    if (header.startsWith('Basic ')) {
      const decoded = Buffer.from(header.slice(6), 'base64').toString('utf8');
      const sep = decoded.indexOf(':');
      const providedUser = sep >= 0 ? decoded.slice(0, sep) : decoded;
      const providedPass = sep >= 0 ? decoded.slice(sep + 1) : '';
      if (safeEq(providedUser, user) && safeEq(providedPass, pass)) return { ok: true };
    }
  }

  if (token) {
    const header = request.headers.get('authorization') ?? '';
    const bearer = header.toLowerCase().startsWith('bearer ') ? header.slice(7).trim() : '';
    const alt = request.headers.get('x-webhook-token') ?? '';
    if ((bearer && safeEq(bearer, token)) || (alt && safeEq(alt, token))) return { ok: true };
  }

  if (secret) {
    const signature =
      request.headers.get('x-thumbtack-signature') ?? request.headers.get('x-webhook-signature') ?? '';
    if (signature) {
      const digest = createHmac('sha256', secret).update(rawBody).digest('hex');
      const provided = signature.replace(/^sha256=/, '');
      if (safeEq(digest, provided)) return { ok: true };
    }
  }

  return { ok: false, status: 401, error: 'Unauthorized webhook.' };
}

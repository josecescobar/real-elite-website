import { z } from 'zod';
import { env } from './env';

/**
 * Startup validation for the env catalog in `env.ts`.
 *
 * Every var here is optional at the type level (see env.ts) — the app is
 * designed to degrade gracefully when one is absent (estimate form 503s,
 * SMS step no-ops, etc). This module's job is narrower: catch the cases
 * that look like *misconfiguration* rather than an intentional absence —
 * a malformed value, or a var set alone when its docs say it only works
 * paired with others — and warn loudly so a bad deploy doesn't fail
 * silently. It never throws; a warning here must never break a build.
 */

const e164 = /^\+[1-9]\d{1,14}$/;

const schema = z.object({
  estimateToEmail: z.string().email().optional(),
  twilioAccountSid: z
    .string()
    .regex(/^AC[a-zA-Z0-9]{32}$/, 'expected Twilio Account SID format (starts with "AC", 34 chars)')
    .optional(),
  twilioFromNumber: z.string().regex(e164, 'expected E.164 format, e.g. +15551234567').optional(),
  twilioToNumber: z.string().regex(e164, 'expected E.164 format, e.g. +15551234567').optional(),
  twilioWebhookBaseUrl: z.string().url().optional(),
  missedCallForwardNumber: z
    .string()
    .regex(e164, 'expected E.164 format, e.g. +15551234567')
    .optional(),
  adminToolsKey: z.string().min(16, 'should be a long random string, not a guessable value').optional(),
  googleReviewLink: z.string().url().optional(),
  upstashRedisUrl: z.string().url().optional(),
  gtmId: z.string().regex(/^GTM-[A-Z0-9]+$/, 'expected format GTM-XXXXXXX').optional(),
});

/** Reads env.ts's accessors and warns about malformed or incomplete config. Safe to call multiple times. */
export function validateEnv(): void {
  const values = {
    estimateToEmail: env.estimateToEmail(),
    twilioAccountSid: env.twilioAccountSid(),
    twilioAuthToken: env.twilioAuthToken(),
    twilioFromNumber: env.twilioFromNumber(),
    twilioToNumber: env.twilioToNumber(),
    twilioWebhookBaseUrl: env.twilioWebhookBaseUrl(),
    missedCallForwardNumber: env.missedCallForwardNumber(),
    adminToolsKey: env.adminToolsKey(),
    googleReviewLink: env.googleReviewLink(),
    upstashRedisUrl: env.upstashRedisUrl(),
    upstashRedisToken: env.upstashRedisToken(),
    gtmId: env.gtmId(),
  };

  const result = schema.safeParse(values);
  if (!result.success) {
    for (const issue of result.error.issues) {
      console.warn(`[env] ${issue.path.join('.')}: ${issue.message}`);
    }
  }

  // Documented all-or-nothing groups (see .env.example) — partial config
  // means the feature silently no-ops, which reads exactly like a bug.
  const twilioSetCount = [
    values.twilioAccountSid,
    values.twilioAuthToken,
    values.twilioFromNumber,
    values.twilioToNumber,
  ].filter(Boolean).length;
  if (twilioSetCount > 0 && twilioSetCount < 4) {
    console.warn(
      '[env] Twilio speed-to-lead SMS is only partially configured — TWILIO_ACCOUNT_SID, ' +
        'TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER, and TWILIO_TO_NUMBER must all be set, or the ' +
        'SMS step silently no-ops.'
    );
  }

  const upstashSetCount = [values.upstashRedisUrl, values.upstashRedisToken].filter(Boolean).length;
  if (upstashSetCount === 1) {
    console.warn(
      '[env] Upstash rate limiting is only partially configured — both UPSTASH_REDIS_REST_URL ' +
        'and UPSTASH_REDIS_REST_TOKEN are required, or it silently falls back to in-memory limits.'
    );
  }
}

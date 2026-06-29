/**
 * Typed, centralized access to environment variables.
 *
 * Before this module, `process.env.X` was read raw in ~8 files with the
 * variable names spelled out as bare strings and defaults applied ad hoc.
 * This is the single catalog of every env var the app reads, with a typed
 * return for each and a one-line note on what it powers. The contract
 * mirrors `.env.example`.
 *
 * Behavior is intentionally identical to the previous inline reads:
 *
 *  - Every accessor reads `process.env` LIVE on each call (it does not cache
 *    a value at import time). Call sites that previously read at module scope
 *    still read at module scope; call sites that read per-request (e.g.
 *    `sendSms`, the /api/voice handler) still read per-request. This keeps
 *    the existing tests — which mutate `process.env` between cases — green.
 *  - Accessors return the raw value (`string | undefined`). Existing `||`
 *    defaults are intentionally left at their call sites so this migration is
 *    a pure in-place substitution with no semantic change.
 *
 * Server-only: most of these are secrets (Resend, Twilio, Upstash). Do not
 * import this module into a Client Component. The `NEXT_PUBLIC_*` accessors
 * reference the literal `process.env.NEXT_PUBLIC_*` so Next.js can still
 * statically inline them at build time.
 */

export const env = {
  /** Vercel-injected deploy environment: 'production' | 'preview' | 'development'. */
  vercelEnv: (): string | undefined => process.env.VERCEL_ENV,

  // ── Analytics (public, env-gated) ────────────────────────────────────────
  /**
   * GA4 measurement ID. GA loads ONLY in Vercel production so local dev and
   * preview deploys never pollute real analytics; `NEXT_PUBLIC_GA_ID`
   * overrides the built-in default. Outside production it returns whatever
   * `NEXT_PUBLIC_GA_ID` is set to (usually undefined → GA does not load).
   */
  gaMeasurementId: (): string | undefined =>
    process.env.VERCEL_ENV === 'production'
      ? process.env.NEXT_PUBLIC_GA_ID ?? 'G-W9QH965H3Y'
      : process.env.NEXT_PUBLIC_GA_ID,
  /** Google Tag Manager container ID. No-op until set. */
  gtmId: (): string | undefined => process.env.NEXT_PUBLIC_GTM_ID,
  /** Microsoft Clarity project ID (heatmaps + session recordings). */
  clarityId: (): string | undefined => process.env.NEXT_PUBLIC_CLARITY_ID,

  // ── Resend (estimate / lead email) ───────────────────────────────────────
  /** Resend API key. When absent the estimate route returns 503 gracefully. */
  resendApiKey: (): string | undefined => process.env.RESEND_API_KEY,
  /** Override inbox for estimate emails (call sites apply the default). */
  estimateToEmail: (): string | undefined => process.env.ESTIMATE_TO_EMAIL,

  // ── Twilio (speed-to-lead SMS + missed-call routing) ─────────────────────
  twilioAccountSid: (): string | undefined => process.env.TWILIO_ACCOUNT_SID,
  twilioAuthToken: (): string | undefined => process.env.TWILIO_AUTH_TOKEN,
  twilioFromNumber: (): string | undefined => process.env.TWILIO_FROM_NUMBER,
  twilioToNumber: (): string | undefined => process.env.TWILIO_TO_NUMBER,
  /** Overrides header reconstruction for Twilio webhook signature checks. */
  twilioWebhookBaseUrl: (): string | undefined =>
    process.env.TWILIO_WEBHOOK_BASE_URL,
  /** Number the inbound call forwards to before it counts as missed. */
  missedCallForwardNumber: (): string | undefined =>
    process.env.MISSED_CALL_FORWARD_NUMBER,

  // ── Review engine ────────────────────────────────────────────────────────
  /** Gate for the internal review-request tool. */
  adminToolsKey: (): string | undefined => process.env.ADMIN_TOOLS_KEY,
  /** Review destination link (call site falls back to BUSINESS.social.google). */
  googleReviewLink: (): string | undefined => process.env.GOOGLE_REVIEW_LINK,

  // ── Google Solar (instant roof quote) ────────────────────────────────────
  googleSolarApiKey: (): string | undefined => process.env.GOOGLE_SOLAR_API_KEY,

  // ── Upstash Redis (durable rate limiting) ────────────────────────────────
  upstashRedisUrl: (): string | undefined => process.env.UPSTASH_REDIS_REST_URL,
  upstashRedisToken: (): string | undefined =>
    process.env.UPSTASH_REDIS_REST_TOKEN,
} as const;

import { env } from '@/lib/env';
import { toE164 } from '@/lib/review-request';
import { SMS_CONSENT_TEXT_VERSION, type StoredSmsConsent } from '@/lib/sms-consent';
import { sendSms } from '@/lib/twilio';

/**
 * One-time enrollment text. Sent only after a stored opt-in whose text
 * version matches the checkbox the visitor saw. Verbatim CEO copy from
 * REA-830 — do not paraphrase.
 */
export const SMS_CONFIRMATION_TEXT =
  'Real Elite Contracting: You are subscribed to texts about your project, including estimate scheduling and updates. You can text photos of your project to this number. Msg frequency varies. Msg & data rates may apply. Reply HELP for help or STOP to opt out.';

export type SmsConfirmationResult =
  | { skipped: true; reason: 'disabled' }
  | { skipped: true; reason: 'no_consent' }
  | { skipped: true; reason: 'text_version_mismatch' }
  | { skipped: true; reason: 'invalid_phone' }
  | { skipped: true; reason: 'unconfigured'; status: 503 }
  | { skipped: false; sent: true }
  | { skipped: false; sent: false; error: 'twilio_error' };

function confirmationEnabled(): boolean {
  const raw = env.smsConsentConfirmationEnabled()?.trim().toLowerCase();
  return raw === 'true' || raw === '1';
}

function twilioConfigured(): boolean {
  return Boolean(
    env.twilioAccountSid() && env.twilioAuthToken() && env.twilioFromNumber()
  );
}

/**
 * Send the enrollment confirmation once. Never throws.
 *
 * `SMS_CONSENT_CONFIRMATION_ENABLED` defaults off. Missing Twilio env is the
 * same condition `/api/review-request` answers with 503: record it and send
 * nothing. Callers must invoke this once per submission.
 */
export async function sendSmsConsentConfirmation(input: {
  phone: string;
  consent: StoredSmsConsent;
}): Promise<SmsConfirmationResult> {
  if (!confirmationEnabled()) {
    const result = { skipped: true, reason: 'disabled' } as const;
    console.info('sms-consent-confirmation', result);
    return result;
  }

  if (input.consent.textVersion !== SMS_CONSENT_TEXT_VERSION) {
    return { skipped: true, reason: 'text_version_mismatch' };
  }

  if (!input.consent.consent) {
    return { skipped: true, reason: 'no_consent' };
  }

  if (!twilioConfigured()) {
    const result = { skipped: true, reason: 'unconfigured', status: 503 } as const;
    console.error('sms-consent-confirmation', result);
    return result;
  }

  const to = toE164(input.phone);
  if (!to) {
    return { skipped: true, reason: 'invalid_phone' };
  }

  try {
    const sent = await sendSms(to, SMS_CONFIRMATION_TEXT);
    if (!sent) return { skipped: false, sent: false, error: 'twilio_error' };
    return { skipped: false, sent: true };
  } catch (err) {
    console.error('sms-consent-confirmation unexpected error', err);
    return { skipped: false, sent: false, error: 'twilio_error' };
  }
}

/** Fire-and-forget. A Twilio failure never rejects the caller. */
export function enqueueSmsConsentConfirmation(input: {
  phone: string;
  consent: StoredSmsConsent;
}): void {
  void sendSmsConsentConfirmation(input).catch((err) => {
    console.error('sms-consent-confirmation unexpected error', err);
  });
}

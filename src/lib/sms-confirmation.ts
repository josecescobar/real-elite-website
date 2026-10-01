import { env } from '@/lib/env';
import { toE164 } from '@/lib/review-request';
import { SMS_CONSENT_TEXT_VERSION, type StoredSmsConsent } from '@/lib/sms-consent';
import {
  claimSmsEnrollmentSend,
  customerSmsAllowed,
  explicitSmsFlagOn,
  finishSmsEnrollmentSend,
  storeSmsConsentEvidence,
} from '@/lib/sms-enrollment';
import { sendSmsDetailed } from '@/lib/twilio';

/**
 * One-time enrollment text. Sent only after the lead ledger echoed a consent
 * id, that id was stored again as consent evidence, and the claim function
 * returned this caller as the single winner. Exact sample-5 body — do not paraphrase.
 */
export const SMS_CONFIRMATION_TEXT =
  'Real Elite Contracting: You are subscribed to texts about your project, including estimate scheduling and updates. Message frequency varies. Msg & data rates may apply. Reply HELP for help or STOP to opt out. Support: (681) 534-5515.';

export type SmsConfirmationSkipReason =
  | 'disabled'
  | 'no_consent'
  | 'text_version_mismatch'
  | 'invalid_phone'
  | 'no_durable_consent'
  | 'persistence_failed'
  | 'already_enrolled'
  | 'opted_out';

export type SmsConfirmationResult =
  | { skipped: true; reason: SmsConfirmationSkipReason }
  | { skipped: true; reason: 'unconfigured'; status: 503 }
  | { skipped: false; sent: true }
  | { skipped: false; sent: false; error: 'twilio_error' };

function twilioConfigured(): boolean {
  return Boolean(env.twilioAccountSid() && env.twilioAuthToken() && env.twilioFromNumber());
}

function skip(reason: SmsConfirmationSkipReason): SmsConfirmationResult {
  return { skipped: true, reason };
}

/**
 * Send the enrollment confirmation at most once per phone until STOP and a
 * new affirmative consent. Never throws.
 *
 * `SMS_CONSENT_CONFIRMATION_ENABLED` defaults off. A missing `consentId`
 * means the lead ledger did not echo stored consent, so nothing is sent.
 * `replay` does not send another text. A provider failure marks the claim
 * `failed` so a later affirmative consent can try once. `claimed` and
 * `accepted` do not send again.
 */
export async function sendSmsConsentConfirmation(input: {
  phone: string;
  consent: StoredSmsConsent;
  consentId?: string | null;
}): Promise<SmsConfirmationResult> {
  if (!explicitSmsFlagOn(env.smsConsentConfirmationEnabled())) {
    const result = skip('disabled');
    console.info('sms-consent-confirmation', result);
    return result;
  }

  if (input.consent.textVersion !== SMS_CONSENT_TEXT_VERSION) {
    return skip('text_version_mismatch');
  }

  if (!input.consent.consent) {
    return skip('no_consent');
  }

  if (!input.consentId) {
    return skip('no_durable_consent');
  }

  if (!twilioConfigured()) {
    const result = { skipped: true, reason: 'unconfigured', status: 503 } as const;
    console.error('sms-consent-confirmation', result);
    return result;
  }

  const to = toE164(input.phone);
  if (!to) {
    return skip('invalid_phone');
  }

  try {
    const stored = await storeSmsConsentEvidence({
      evidenceId: input.consentId,
      phoneE164: to,
      consent: input.consent,
    });
    if (!stored) return skip('persistence_failed');

    const claim = await claimSmsEnrollmentSend({
      phoneE164: to,
      evidenceId: input.consentId,
      textVersion: input.consent.textVersion,
    });
    if (!claim.claimed) {
      if (claim.reason === 'replay') return skip('already_enrolled');
      if (claim.reason === 'stopped') return skip('opted_out');
      return skip('persistence_failed');
    }

    const stillAllowed = await customerSmsAllowed(to);
    if (!stillAllowed.allowed) {
      await finishSmsEnrollmentSend({
        phoneE164: to,
        evidenceId: input.consentId,
        ok: false,
        providerSid: null,
      });
      if (stillAllowed.reason === 'stopped') return skip('opted_out');
      return skip('persistence_failed');
    }

    const sent = await sendSmsDetailed(to, SMS_CONFIRMATION_TEXT);
    await finishSmsEnrollmentSend({
      phoneE164: to,
      evidenceId: input.consentId,
      ok: sent.ok,
      providerSid: sent.ok ? sent.sid ?? null : null,
    });
    if (!sent.ok) return { skipped: false, sent: false, error: 'twilio_error' };
    return { skipped: false, sent: true };
  } catch (err) {
    console.error('sms-consent-confirmation unexpected error', err);
    return { skipped: false, sent: false, error: 'twilio_error' };
  }
}

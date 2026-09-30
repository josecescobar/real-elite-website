import { BUSINESS } from '@/lib/constants';

/**
 * Prefilled text the contact page already uses. Sticky and header SMS
 * links must stay on this exact body so every phone opens the same draft.
 */
export const ESTIMATE_SMS_BODY = "Hi, I'd like a free estimate from Real Elite Contracting.";

export const ESTIMATE_SMS_HREF = `sms:${BUSINESS.phoneRaw}?&body=${encodeURIComponent(ESTIMATE_SMS_BODY)}`;

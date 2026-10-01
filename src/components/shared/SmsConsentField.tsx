'use client';

import Link from 'next/link';
import { SMS_CONSENT_TEXT } from '@/lib/sms-consent';

type Props = {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

const TERMS_LABEL = 'SMS Terms';
const PRIVACY_LABEL = 'Privacy Policy';

function consentLabelParts(text: string) {
  const termsAt = text.indexOf(TERMS_LABEL);
  const privacyAt = text.indexOf(PRIVACY_LABEL);
  if (termsAt < 0 || privacyAt < termsAt) {
    return { beforeTerms: text, between: '', afterPrivacy: '' };
  }
  return {
    beforeTerms: text.slice(0, termsAt),
    between: text.slice(termsAt + TERMS_LABEL.length, privacyAt),
    afterPrivacy: text.slice(privacyAt + PRIVACY_LABEL.length),
  };
}

/**
 * Optional, unchecked-by-default SMS consent under a phone field.
 * Not required to submit a quote.
 */
export default function SmsConsentField({
  id = 'sms-consent',
  checked,
  onChange,
}: Props) {
  const { beforeTerms, between, afterPrivacy } = consentLabelParts(SMS_CONSENT_TEXT);
  return (
    <div className="mt-3 flex items-start gap-3">
      <input
        id={id}
        name="smsConsent"
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-5 w-5 shrink-0 rounded-sm border-2 border-charcoal-300 text-navy-800 focus:ring-2 focus:ring-navy-400"
      />
      <label htmlFor={id} className="text-sm text-charcoal-600 leading-relaxed">
        {beforeTerms}
        <Link
          href="/sms-terms"
          className="font-semibold text-navy-800 underline underline-offset-2 hover:text-brand-red transition-colors"
        >
          {TERMS_LABEL}
        </Link>
        {between}
        <Link
          href="/privacy"
          className="font-semibold text-navy-800 underline underline-offset-2 hover:text-brand-red transition-colors"
        >
          {PRIVACY_LABEL}
        </Link>
        {afterPrivacy}
      </label>
    </div>
  );
}

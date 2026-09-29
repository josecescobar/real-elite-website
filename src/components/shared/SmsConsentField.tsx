'use client';

import Link from 'next/link';
import { SMS_CONSENT_TEXT } from '@/lib/sms-consent';

type Props = {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

/**
 * Optional, unchecked-by-default consent under a phone field.
 * Not required to submit a quote.
 */
export default function SmsConsentField({
  id = 'sms-consent',
  checked,
  onChange,
}: Props) {
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
        {SMS_CONSENT_TEXT}{' '}
        <Link
          href="/privacy"
          className="font-semibold text-navy-800 underline underline-offset-2 hover:text-brand-red transition-colors"
        >
          Privacy Policy
        </Link>
      </label>
    </div>
  );
}

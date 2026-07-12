import Link from 'next/link';

type PrivacyNoticeProps = {
  subject?: 'estimate' | 'consultation' | 'request';
  className?: string;
};

/** Shared disclosure for every public form that collects contact details. */
export default function PrivacyNotice({
  subject = 'request',
  className = 'text-xs text-charcoal-500 mt-5 leading-relaxed',
}: PrivacyNoticeProps) {
  return (
    <p className={className}>
      By submitting, you agree that Real Elite Contracting may contact you about this {subject}.
      We never sell your information. See our{' '}
      <Link
        href="/privacy"
        className="font-semibold text-navy-800 underline underline-offset-2 hover:text-brand-red transition-colors"
      >
        Privacy Policy
      </Link>
      .
    </p>
  );
}

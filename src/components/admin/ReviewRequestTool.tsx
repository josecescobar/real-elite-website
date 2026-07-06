'use client';

import { useState, useSyncExternalStore } from 'react';
import { Check, Send } from 'lucide-react';
import { BUSINESS } from '@/lib/constants';
import { buildReviewMessage, toE164 } from '@/lib/review-request';

const KEY_STORAGE = 'realelite-admin-key';

// One-time hydration-safe localStorage read (server snapshot: null).
const noopSubscribe = () => () => {};
const readSavedKey = () => window.localStorage.getItem(KEY_STORAGE);

const inputClass =
  'w-full px-4 py-3 border-2 rounded-md bg-white text-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-navy-400 transition-colors border-charcoal-200 hover:border-charcoal-300';

export default function ReviewRequestTool() {
  // Remember the key on this device so daily use is two fields, not
  // three: typedKey === null means "untouched", fall back to storage.
  const savedKey = useSyncExternalStore(noopSubscribe, readSavedKey, () => null);
  const [typedKey, setTypedKey] = useState<string | null>(null);
  const accessKey = typedKey ?? savedKey ?? '';

  const [firstName, setFirstName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);

  const normalizedPhone = toE164(phone);
  const previewName = firstName.trim() || 'Sarah';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);

    if (!accessKey.trim()) {
      setResult({ ok: false, text: 'Enter the access key.' });
      return;
    }
    if (!firstName.trim()) {
      setResult({ ok: false, text: 'Enter the customer’s first name.' });
      return;
    }
    if (!normalizedPhone) {
      setResult({ ok: false, text: 'Enter a valid 10-digit US phone number.' });
      return;
    }

    setIsSending(true);
    try {
      const res = await fetch('/api/review-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: accessKey.trim(),
          firstName: firstName.trim(),
          phone: normalizedPhone,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setResult({ ok: false, text: data?.error || 'Something went wrong.' });
        return;
      }
      window.localStorage.setItem(KEY_STORAGE, accessKey.trim());
      setResult({ ok: true, text: data?.message || 'Review request sent.' });
      setFirstName('');
      setPhone('');
    } catch {
      setResult({ ok: false, text: 'Network error — try again.' });
    } finally {
      setIsSending(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-card-elevated p-6 sm:p-8"
      noValidate
    >
      <div className="space-y-5">
        <div>
          <label htmlFor="rr-key" className="block text-sm font-semibold text-navy-800 mb-2">
            Access key
          </label>
          <input
            id="rr-key"
            type="password"
            autoComplete="off"
            value={accessKey}
            onChange={(e) => setTypedKey(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="rr-name" className="block text-sm font-semibold text-navy-800 mb-2">
            Customer first name
          </label>
          <input
            id="rr-name"
            type="text"
            maxLength={40}
            placeholder="Sarah"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="rr-phone" className="block text-sm font-semibold text-navy-800 mb-2">
            Customer phone
          </label>
          <input
            id="rr-phone"
            type="tel"
            placeholder={BUSINESS.phone}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputClass}
          />
          {phone && !normalizedPhone && (
            <p className="text-brand-red text-sm mt-2">
              Needs to be a 10-digit US number.
            </p>
          )}
        </div>

        <div className="rounded-md bg-navy-900 text-white px-4 py-4">
          <p className="text-[0.65rem] uppercase tracking-[0.18em] font-bold text-charcoal-300 mb-2">
            They&apos;ll receive
          </p>
          <p className="text-sm leading-relaxed text-charcoal-100">
            {buildReviewMessage(previewName, BUSINESS.social.google)}
          </p>
        </div>

        {result && (
          <div
            role="alert"
            className={`rounded-md p-4 text-sm flex items-start gap-2 ${
              result.ok
                ? 'bg-navy-50 border border-navy-200 text-navy-800'
                : 'bg-brand-red/10 border border-brand-red/30 text-brand-red'
            }`}
          >
            {result.ok && <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />}
            {result.text}
          </div>
        )}

        <button
          type="submit"
          disabled={isSending}
          className="w-full inline-flex items-center justify-center gap-2 bg-brand-red text-white px-7 py-3.5 rounded-md font-bold text-sm hover:bg-brand-red-dark transition-colors shadow-lg shadow-brand-red/20 disabled:opacity-60 disabled:cursor-not-allowed focus-ring"
        >
          {isSending ? 'Sending…' : 'Send Review Request'}
          {!isSending && <Send className="w-4 h-4" />}
        </button>
      </div>
    </form>
  );
}

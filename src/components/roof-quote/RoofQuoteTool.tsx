'use client';

import { useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  MapPin,
  Loader2,
  Info,
  RotateCcw,
} from 'lucide-react';
import {
  ROOF_MATERIALS,
  getMaterial,
  estimateRange,
  formatUsd,
  squaresFromAnswers,
  HOME_SIZE_OPTIONS,
  STORIES_OPTIONS,
  COMPLEXITY_OPTIONS,
  type MaterialSlug,
  type FallbackAnswers,
} from '@/lib/roof-estimate';
import { trackEvent } from '@/lib/analytics';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[\d\s\-+().]{7,30}$/;

type Phase = 'address' | 'fallback' | 'material' | 'lead' | 'success';

const inputBase =
  'w-full px-4 py-3 border-2 rounded-md bg-white text-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-navy-400 transition-colors';

export default function RoofQuoteTool() {
  const [phase, setPhase] = useState<Phase>('address');

  // measurement
  const [address, setAddress] = useState('');
  const [addressError, setAddressError] = useState<string | null>(null);
  const [isMeasuring, setIsMeasuring] = useState(false);

  const [squares, setSquares] = useState<number | null>(null);
  const [resolvedAddress, setResolvedAddress] = useState('');
  const [source, setSource] = useState<'auto' | 'manual'>('auto');

  // quick-question fallback
  const [fb, setFb] = useState<FallbackAnswers>({ homeSize: '', stories: '', complexity: '' });
  const [fbError, setFbError] = useState<string | null>(null);

  // material
  const [material, setMaterial] = useState<MaterialSlug | null>(null);

  // lead capture
  const [lead, setLead] = useState({ fullName: '', phone: '', email: '' });
  const [leadErrors, setLeadErrors] = useState<{ fullName?: string; phone?: string; email?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const mat = material ? getMaterial(material) : undefined;
  const range = mat && squares != null ? estimateRange(squares, mat) : null;

  /* ---------------------------- measurement ---------------------------- */

  async function handleMeasure(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = address.trim();
    if (trimmed.length < 5) {
      setAddressError('Enter your full street address.');
      return;
    }
    setAddressError(null);
    setIsMeasuring(true);
    try {
      const res = await fetch('/api/roof-estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: trimmed }),
      });
      if (res.status === 429) {
        setAddressError('A few too many tries — give it a minute and go again.');
        return;
      }
      const data = await res.json().catch(() => null);
      if (data?.covered) {
        setSquares(data.squares);
        setResolvedAddress(data.formattedAddress || trimmed);
        setSource('auto');
        trackEvent('roof_quote_measure', { result: 'auto' });
        setPhase('material');
      } else {
        // No satellite coverage (or no key yet) — fall back to quick questions.
        setResolvedAddress(trimmed);
        trackEvent('roof_quote_measure', { result: 'fallback', reason: data?.reason ?? 'unknown' });
        setPhase('fallback');
      }
    } catch {
      setResolvedAddress(trimmed);
      setPhase('fallback');
    } finally {
      setIsMeasuring(false);
    }
  }

  function handleFallbackSubmit(e: React.FormEvent) {
    e.preventDefault();
    const sq = squaresFromAnswers(fb);
    if (sq == null) {
      setFbError('Pick one option from each question.');
      return;
    }
    setFbError(null);
    setSquares(sq);
    setSource('manual');
    trackEvent('roof_quote_measure', { result: 'manual' });
    setPhase('material');
  }

  function startOver() {
    setPhase('address');
    setSquares(null);
    setMaterial(null);
    setFb({ homeSize: '', stories: '', complexity: '' });
    setAddressError(null);
    setFbError(null);
  }

  /* ------------------------------- lead -------------------------------- */

  async function handleLeadSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const errs: typeof leadErrors = {};
    if (!lead.fullName.trim()) errs.fullName = 'Name is required.';
    if (!lead.phone.trim()) errs.phone = 'Phone is required.';
    else if (!PHONE_RE.test(lead.phone)) errs.phone = 'Enter a valid phone number.';
    if (!lead.email.trim()) errs.email = 'Email is required.';
    else if (!EMAIL_RE.test(lead.email)) errs.email = 'Enter a valid email.';
    setLeadErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const honeypot =
      (e.currentTarget.elements.namedItem('website') as HTMLInputElement | null)?.value ?? '';

    const summary = [
      '--- Instant Roof Quote lead ---',
      `Address: ${resolvedAddress}`,
      squares != null
        ? `Roof size: ~${Math.round(squares)} squares (${
            source === 'auto' ? 'auto-measured from satellite imagery' : 'estimated from homeowner answers'
          })`
        : null,
      mat
        ? mat.slug === 'other'
          ? 'Material: Other / Not sure — NEEDS A MANUAL QUOTE (no price was shown to the customer)'
          : `Material: ${mat.label}`
        : null,
      range ? `Estimate shown to customer: ${formatUsd(range.low)} – ${formatUsd(range.high)}` : null,
      'Note: this range excludes any rotted decking / board replacement found after tear-off.',
    ]
      .filter(Boolean)
      .join('\n');

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch('/api/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: lead.fullName,
          email: lead.email,
          phone: lead.phone,
          service: 'Roofing — Instant Quote',
          message: summary,
          website: honeypot,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || 'Failed to send');
      }
      trackEvent('roof_quote_submit', { material: material ?? 'unknown' });
      setPhase('success');
    } catch {
      setSubmitError(
        'Something went wrong sending your request. Please call (681) 534-5515 or try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  /* ------------------------------ render ------------------------------- */

  return (
    <div className="bg-white rounded-lg shadow-card-elevated p-6 sm:p-8 md:p-10">
      {/* ---------------------------- ADDRESS ---------------------------- */}
      {phase === 'address' && (
        <form onSubmit={handleMeasure} noValidate>
          <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-navy-800 mb-2">
            Let&apos;s find your roof.
          </h2>
          <p className="text-charcoal-600 text-sm mb-6">
            Enter your home address and we&apos;ll measure the roof from satellite imagery — no
            ladder, no appointment.
          </p>

          <label htmlFor="rq-address" className="block text-sm font-semibold text-navy-800 mb-2">
            Home address
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <MapPin className="w-5 h-5 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="rq-address"
                type="text"
                autoComplete="street-address"
                placeholder="123 Main St, Martinsburg, WV 25401"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  if (addressError) setAddressError(null);
                }}
                className={`${inputBase} pl-10 ${
                  addressError ? 'border-brand-red' : 'border-charcoal-200 hover:border-charcoal-300'
                }`}
              />
            </div>
            <button
              type="submit"
              disabled={isMeasuring}
              className="inline-flex items-center justify-center gap-2 bg-brand-red text-white px-6 py-3 rounded-md font-bold text-sm hover:bg-brand-red-dark transition-colors shadow-lg shadow-brand-red/20 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-red whitespace-nowrap"
            >
              {isMeasuring ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Measuring…
                </>
              ) : (
                <>
                  Measure My Roof
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
          {addressError && <p className="text-brand-red text-sm mt-2">{addressError}</p>}
          <p className="text-charcoal-500 text-xs mt-3 leading-relaxed">
            If your address isn&apos;t covered by satellite data, we&apos;ll ask a couple of quick
            questions instead. Either way, it takes about a minute.
          </p>
        </form>
      )}

      {/* ---------------------------- FALLBACK --------------------------- */}
      {phase === 'fallback' && (
        <form onSubmit={handleFallbackSubmit} noValidate>
          <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-navy-800 mb-2">
            A couple of quick questions.
          </h2>
          <p className="text-charcoal-600 text-sm mb-6">
            We couldn&apos;t pull this roof from satellite data automatically — answer these and
            we&apos;ll estimate it.
          </p>

          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold text-navy-800 mb-2">
                Roughly how big is your home?
              </p>
              <div className="grid grid-cols-2 gap-2">
                {HOME_SIZE_OPTIONS.map((o) => (
                  <OptionButton
                    key={o.value}
                    selected={fb.homeSize === o.value}
                    onClick={() => setFb((p) => ({ ...p, homeSize: o.value }))}
                  >
                    {o.label}
                  </OptionButton>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-navy-800 mb-2">How many stories?</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {STORIES_OPTIONS.map((o) => (
                  <OptionButton
                    key={o.value}
                    selected={fb.stories === o.value}
                    onClick={() => setFb((p) => ({ ...p, stories: o.value }))}
                  >
                    {o.label}
                  </OptionButton>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-navy-800 mb-2">
                How complex is the roof shape?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {COMPLEXITY_OPTIONS.map((o) => (
                  <OptionButton
                    key={o.value}
                    selected={fb.complexity === o.value}
                    onClick={() => setFb((p) => ({ ...p, complexity: o.value }))}
                  >
                    <span className="block font-semibold">{o.label}</span>
                    <span className="block text-xs opacity-80 mt-0.5">{o.hint}</span>
                  </OptionButton>
                ))}
              </div>
            </div>
          </div>

          {fbError && <p className="text-brand-red text-sm mt-4">{fbError}</p>}

          <div className="mt-8 flex items-center justify-between gap-4">
            <BackLink onClick={startOver} label="Start over" />
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-brand-red text-white px-7 py-3.5 rounded-md font-bold text-sm hover:bg-brand-red-dark transition-colors shadow-lg shadow-brand-red/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-red"
            >
              See My Estimate
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* ---------------------------- MATERIAL --------------------------- */}
      {phase === 'material' && squares != null && (
        <div>
          <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-navy-800 mb-2">
            Pick your roofing material.
          </h2>

          {/* Roof size summary */}
          <div className="mt-4 mb-6 flex items-start gap-3 rounded-md bg-navy-900 text-white px-4 py-3">
            <Check className="w-5 h-5 text-brand-red flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <span className="font-bold">
                Roof size: ~{Math.round(squares)} squares ({(Math.round(squares) * 100).toLocaleString()}{' '}
                sq ft)
              </span>
              <span className="block text-charcoal-300 text-xs mt-0.5">
                {source === 'auto'
                  ? `Measured from satellite imagery — ${resolvedAddress}`
                  : 'Estimated from your answers'}
              </span>
            </div>
          </div>

          {/* Material cards */}
          <div className="space-y-2.5">
            {ROOF_MATERIALS.map((m) => {
              const selected = material === m.slug;
              return (
                <button
                  key={m.slug}
                  type="button"
                  onClick={() => selectMaterial(m.slug)}
                  aria-pressed={selected}
                  className={`w-full text-left rounded-md border-2 p-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-400 ${
                    selected
                      ? 'border-navy-800 bg-navy-50'
                      : 'border-charcoal-200 hover:border-navy-400'
                  }`}
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-heading text-base font-bold text-navy-800">
                      {m.label}
                    </span>
                    <span
                      className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${
                        m.recommended
                          ? 'bg-brand-red text-white'
                          : 'bg-charcoal-100 text-charcoal-600'
                      }`}
                    >
                      {m.tagline}
                    </span>
                  </div>
                  <p className="text-charcoal-600 text-sm mt-1 leading-relaxed">{m.blurb}</p>
                </button>
              );
            })}
          </div>

          {/* Estimate panel — priced material */}
          {mat && range && (
            <div className="mt-6 rounded-lg border-2 border-navy-800 overflow-hidden">
              <div className="bg-navy-900 text-white px-5 py-5 text-center">
                <p className="text-xs uppercase tracking-[0.18em] text-charcoal-300 font-semibold">
                  Estimated {mat.label} roof
                </p>
                <p className="font-heading text-3xl md:text-4xl font-extrabold mt-1">
                  {formatUsd(range.low)} – {formatUsd(range.high)}
                </p>
                <p className="text-charcoal-300 text-xs mt-1">
                  Ballpark range — your written estimate is free and exact.
                </p>
              </div>
              <div className="bg-white px-5 py-5">
                <p className="text-sm font-semibold text-navy-800 mb-2">What this range covers</p>
                <ul className="text-sm text-charcoal-600 space-y-1.5">
                  {[
                    'Tear-off & haul-away of your old roof',
                    `New ${mat.label.toLowerCase()}`,
                    'Underlayment, drip edge & flashing',
                    'Ridge cap & ventilation',
                    'Full cleanup & magnetic nail sweep',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-brand-red flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>

                {/* Board / decking replacement disclaimer — disclosed, not priced */}
                <div className="mt-4 flex items-start gap-2.5 rounded-md bg-charcoal-100 px-4 py-3">
                  <Info className="w-4 h-4 text-navy-700 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-charcoal-600 leading-relaxed">
                    <span className="font-semibold text-navy-800">One thing to know:</span> this
                    range assumes the wood decking under your shingles is solid. If we tear off the
                    old roof and find boards rotted from a past leak, replacing them is a small
                    additional per-board cost — and we&apos;ll always show you what we find and get
                    your OK first. If your roof hasn&apos;t had leaks, this usually won&apos;t come
                    up.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Estimate panel — "Other" material */}
          {mat && mat.slug === 'other' && (
            <div className="mt-6 rounded-lg border-2 border-navy-800 bg-navy-50 px-5 py-6">
              <p className="font-heading text-lg font-bold text-navy-800">
                We&apos;ll price this one with you personally.
              </p>
              <p className="text-charcoal-600 text-sm mt-1.5 leading-relaxed">
                Cedar shake, tile, flat roofing, or still deciding — these are best priced after a
                quick conversation. Leave your info and a project lead will reach out within 24
                business hours to talk options.
              </p>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between gap-4">
            <BackLink onClick={startOver} label="Start over" />
            <button
              type="button"
              disabled={!material}
              onClick={() => setPhase('lead')}
              className="inline-flex items-center gap-2 bg-brand-red text-white px-7 py-3.5 rounded-md font-bold text-sm hover:bg-brand-red-dark transition-colors shadow-lg shadow-brand-red/20 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-red"
            >
              {mat?.slug === 'other' ? 'Continue' : 'Get This In Writing'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------ LEAD ----------------------------- */}
      {phase === 'lead' && (
        <form onSubmit={handleLeadSubmit} noValidate>
          {/* Honeypot */}
          <div
            aria-hidden="true"
            style={{ position: 'absolute', left: '-10000px', width: '1px', height: '1px', overflow: 'hidden' }}
          >
            <label htmlFor="website">Website</label>
            <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
          </div>

          <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-navy-800 mb-2">
            {range ? 'Where do we send your written estimate?' : 'Where can we reach you?'}
          </h2>
          <p className="text-charcoal-600 text-sm mb-6">
            Real person, no spam. A project lead reaches out within 24 business hours
            {range ? ' to confirm your free, exact estimate.' : '.'}
          </p>

          <div className="space-y-5">
            <Field
              id="rq-name"
              label="Full name"
              value={lead.fullName}
              error={leadErrors.fullName}
              autoComplete="name"
              placeholder="John Smith"
              onChange={(v) => {
                setLead((p) => ({ ...p, fullName: v }));
                if (leadErrors.fullName) setLeadErrors((p) => ({ ...p, fullName: undefined }));
              }}
            />
            <Field
              id="rq-phone"
              label="Phone"
              type="tel"
              value={lead.phone}
              error={leadErrors.phone}
              autoComplete="tel"
              placeholder="(681) 534-5515"
              onChange={(v) => {
                setLead((p) => ({ ...p, phone: v }));
                if (leadErrors.phone) setLeadErrors((p) => ({ ...p, phone: undefined }));
              }}
            />
            <Field
              id="rq-email"
              label="Email"
              type="email"
              value={lead.email}
              error={leadErrors.email}
              autoComplete="email"
              placeholder="john@example.com"
              onChange={(v) => {
                setLead((p) => ({ ...p, email: v }));
                if (leadErrors.email) setLeadErrors((p) => ({ ...p, email: undefined }));
              }}
            />
          </div>

          {submitError && (
            <div className="mt-5 bg-brand-red/10 border border-brand-red/30 rounded-md p-4 text-sm text-brand-red">
              {submitError}
            </div>
          )}

          <p className="text-xs text-charcoal-500 mt-5 leading-relaxed">
            By submitting, you agree we may contact you about this estimate. We&apos;ll never sell
            your info. Licensed &amp; insured across WV, MD, VA.
          </p>

          <div className="mt-7 flex items-center justify-between gap-4">
            <BackLink onClick={() => setPhase('material')} label="Back" icon="arrow" />
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 bg-brand-red text-white px-7 py-3.5 rounded-md font-bold text-sm hover:bg-brand-red-dark transition-colors shadow-lg shadow-brand-red/20 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-red"
            >
              {isSubmitting ? 'Sending…' : 'Send My Request'}
              {!isSubmitting && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </form>
      )}

      {/* ---------------------------- SUCCESS ---------------------------- */}
      {phase === 'success' && (
        <div className="text-center py-4">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-brand-red text-white mb-5">
            <Check className="w-7 h-7" />
          </div>
          <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-navy-800 mb-3">
            Request received.
          </h2>
          <p className="text-charcoal-600 leading-relaxed max-w-md mx-auto">
            Thanks — we&apos;ve got your details{range ? ' and your ballpark range' : ''}. A project
            lead will reach out within 24 business hours to schedule your free, no-obligation
            on-site estimate.
          </p>
        </div>
      )}
    </div>
  );

  function selectMaterial(slug: MaterialSlug) {
    setMaterial(slug);
    trackEvent('roof_quote_material_select', { material: slug });
  }
}

/* ----------------------------- subcomponents ---------------------------- */

function OptionButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`px-4 py-3 rounded-md text-sm text-left border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-400 ${
        selected
          ? 'border-navy-800 bg-navy-800 text-white'
          : 'border-charcoal-200 text-navy-800 hover:border-navy-400'
      }`}
    >
      {children}
    </button>
  );
}

function BackLink({
  onClick,
  label,
  icon = 'reset',
}: {
  onClick: () => void;
  label: string;
  icon?: 'reset' | 'arrow';
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 text-sm font-semibold text-charcoal-600 hover:text-navy-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-400 rounded-sm px-2 py-1"
    >
      {icon === 'reset' ? <RotateCcw className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
      {label}
    </button>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = 'text',
  placeholder,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-navy-800 mb-2">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-3 border-2 rounded-md bg-white text-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-navy-400 transition-colors ${
          error ? 'border-brand-red' : 'border-charcoal-200 hover:border-charcoal-300'
        }`}
      />
      {error && <p className="text-brand-red text-sm mt-2">{error}</p>}
    </div>
  );
}

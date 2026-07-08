'use client';

import { useState } from 'react';
import { ArrowRight, ArrowLeft, Check, Info, RotateCcw } from 'lucide-react';
import {
  DECK_MATERIALS,
  getDeckMaterial,
  estimateDeckRange,
  formatUsd,
  ELEVATION_OPTIONS,
  PRESET_SIZES,
  DECK_MIN_DIM,
  DECK_MAX_DIM,
  type DeckMaterialSlug,
  type ElevationValue,
} from '@/lib/deck-estimate';
import { trackEvent } from '@/lib/analytics';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[\d\s\-+().]{7,30}$/;

type Phase = 'size' | 'material' | 'lead' | 'success';

export default function DeckQuoteTool() {
  const [phase, setPhase] = useState<Phase>('size');

  // size
  const [width, setWidth] = useState('');
  const [length, setLength] = useState('');
  const [elevation, setElevation] = useState<ElevationValue | ''>('');
  const [sizeError, setSizeError] = useState<string | null>(null);

  // material
  const [material, setMaterial] = useState<DeckMaterialSlug | null>(null);

  // lead
  const [lead, setLead] = useState({ fullName: '', phone: '', email: '' });
  const [leadErrors, setLeadErrors] = useState<{ fullName?: string; phone?: string; email?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const w = parseInt(width, 10);
  const l = parseInt(length, 10);
  const area = Number.isFinite(w) && Number.isFinite(l) ? w * l : 0;
  const elevationOpt = ELEVATION_OPTIONS.find((o) => o.value === elevation);
  const mat = material ? getDeckMaterial(material) : undefined;
  const range =
    mat && elevationOpt && area > 0
      ? estimateDeckRange(area, elevationOpt.factor, mat)
      : null;

  /* ------------------------------- size -------------------------------- */

  function handleSizeSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!Number.isFinite(w) || !Number.isFinite(l)) {
      setSizeError('Enter the deck width and length in feet.');
      return;
    }
    if (
      w < DECK_MIN_DIM || w > DECK_MAX_DIM ||
      l < DECK_MIN_DIM || l > DECK_MAX_DIM
    ) {
      setSizeError(`Each side should be between ${DECK_MIN_DIM} and ${DECK_MAX_DIM} feet.`);
      return;
    }
    if (!elevation) {
      setSizeError('Pick how high the deck sits.');
      return;
    }
    setSizeError(null);
    trackEvent('deck_quote_size', { area, elevation });
    setPhase('material');
  }

  function startOver() {
    setPhase('size');
    setMaterial(null);
    setSizeError(null);
  }

  function selectMaterial(slug: DeckMaterialSlug) {
    setMaterial(slug);
    trackEvent('deck_quote_material_select', { material: slug });
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
      '--- Instant Deck Quote lead ---',
      `Deck size: ${w} x ${l} ft (${area.toLocaleString()} sq ft)`,
      elevationOpt ? `Elevation: ${elevationOpt.label} (${elevationOpt.hint})` : null,
      mat
        ? mat.slug === 'other'
          ? 'Material: Other / Not sure — NEEDS A MANUAL QUOTE (no price was shown to the customer)'
          : `Material: ${mat.label}`
        : null,
      range ? `Estimate shown to customer: ${formatUsd(range.low)} – ${formatUsd(range.high)}` : null,
      'Note: assumes a standard new build; old-deck tear-out or difficult site conditions are extra.',
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
          service: 'Decks — Instant Quote',
          message: summary,
          website: honeypot,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || 'Failed to send');
      }
      trackEvent('deck_quote_submit', { material: material ?? 'unknown' });
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
      {/* ------------------------------ SIZE ----------------------------- */}
      {phase === 'size' && (
        <form onSubmit={handleSizeSubmit} noValidate>
          <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-navy-800 mb-2">
            How big is your deck?
          </h2>
          <p className="text-charcoal-600 text-sm mb-6">
            Enter the size you have in mind — or tap a common size to start.
          </p>

          {/* Preset chips */}
          <div className="flex flex-wrap gap-2 mb-5">
            {PRESET_SIZES.map((s) => {
              const active = w === s.w && l === s.l;
              return (
                <button
                  key={`${s.w}x${s.l}`}
                  type="button"
                  onClick={() => {
                    setWidth(String(s.w));
                    setLength(String(s.l));
                    if (sizeError) setSizeError(null);
                  }}
                  aria-pressed={active}
                  className={`px-3.5 py-2 rounded-md text-sm font-semibold border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-400 ${
                    active
                      ? 'border-navy-800 bg-navy-800 text-white'
                      : 'border-charcoal-200 text-navy-800 hover:border-navy-400'
                  }`}
                >
                  {s.w} × {s.l}
                </button>
              );
            })}
          </div>

          {/* Dimension inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="dq-width" className="block text-sm font-semibold text-navy-800 mb-2">
                Width (ft)
              </label>
              <input
                id="dq-width"
                type="text"
                inputMode="numeric"
                maxLength={2}
                placeholder="12"
                value={width}
                onChange={(e) => {
                  setWidth(e.target.value.replace(/\D/g, ''));
                  if (sizeError) setSizeError(null);
                }}
                className="w-full px-4 py-3 border-2 border-charcoal-200 hover:border-charcoal-300 rounded-md bg-white text-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-navy-400 transition-colors"
              />
            </div>
            <div>
              <label htmlFor="dq-length" className="block text-sm font-semibold text-navy-800 mb-2">
                Length (ft)
              </label>
              <input
                id="dq-length"
                type="text"
                inputMode="numeric"
                maxLength={2}
                placeholder="16"
                value={length}
                onChange={(e) => {
                  setLength(e.target.value.replace(/\D/g, ''));
                  if (sizeError) setSizeError(null);
                }}
                className="w-full px-4 py-3 border-2 border-charcoal-200 hover:border-charcoal-300 rounded-md bg-white text-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-navy-400 transition-colors"
              />
            </div>
          </div>
          {area > 0 && (
            <p className="text-charcoal-600 text-sm mt-2.5 font-semibold">
              Deck size: {area.toLocaleString()} sq ft
            </p>
          )}

          {/* Elevation */}
          <div className="mt-6">
            <p className="text-sm font-semibold text-navy-800 mb-2">How high does it sit?</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {ELEVATION_OPTIONS.map((o) => {
                const selected = elevation === o.value;
                return (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => {
                      setElevation(o.value);
                      if (sizeError) setSizeError(null);
                    }}
                    aria-pressed={selected}
                    className={`px-4 py-3 rounded-md text-sm text-left border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-400 ${
                      selected
                        ? 'border-navy-800 bg-navy-800 text-white'
                        : 'border-charcoal-200 text-navy-800 hover:border-navy-400'
                    }`}
                  >
                    <span className="block font-semibold">{o.label}</span>
                    <span className="block text-xs opacity-80 mt-0.5">{o.hint}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {sizeError && <p className="text-brand-red text-sm mt-4">{sizeError}</p>}

          <div className="mt-8 flex justify-end">
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
      {phase === 'material' && elevationOpt && (
        <div>
          <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-navy-800 mb-2">
            Pick your decking material.
          </h2>

          {/* Size summary */}
          <div className="mt-4 mb-6 flex items-start gap-3 rounded-md bg-navy-900 text-white px-4 py-3">
            <Check className="w-5 h-5 text-brand-red flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <span className="font-bold">
                {w} × {l} ft deck — {area.toLocaleString()} sq ft
              </span>
              <span className="block text-charcoal-300 text-xs mt-0.5">
                {elevationOpt.label} · {elevationOpt.hint}
              </span>
            </div>
          </div>

          {/* Material cards */}
          <div className="space-y-2.5">
            {DECK_MATERIALS.map((m) => {
              const selected = material === m.slug;
              return (
                <button
                  key={m.slug}
                  type="button"
                  onClick={() => selectMaterial(m.slug)}
                  aria-pressed={selected}
                  className={`w-full text-left rounded-md border-2 p-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-400 ${
                    selected ? 'border-navy-800 bg-navy-50' : 'border-charcoal-200 hover:border-navy-400'
                  }`}
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-heading text-base font-bold text-navy-800">{m.label}</span>
                    <span
                      className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${
                        m.recommended ? 'bg-brand-red text-white' : 'bg-charcoal-100 text-charcoal-600'
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
                  Estimated {mat.label} deck
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
                    'Concrete footings & framing',
                    `${mat.label} deck boards`,
                    'Railing & basic stairs where needed',
                    'Hidden fasteners & hardware',
                    'Cleanup & debris haul-away',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-brand-red flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>

                {/* Site-conditions disclaimer — disclosed, not priced */}
                <div className="mt-4 flex items-start gap-2.5 rounded-md bg-charcoal-100 px-4 py-3">
                  <Info className="w-4 h-4 text-navy-700 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-charcoal-600 leading-relaxed">
                    <span className="font-semibold text-navy-800">One thing to know:</span> this
                    range assumes a standard new deck on accessible, stable ground. Tearing out an
                    old deck, tricky site access, steep slopes, or rocky digging can affect the
                    final number — we&apos;ll confirm everything on-site before any work begins.
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
                Cedar, hardwood, or a full outdoor-living build with a pergola and lighting — these
                are best priced after a quick conversation. Leave your info and a project lead will
                reach out within 24 business hours.
              </p>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={startOver}
              className="inline-flex items-center gap-2 text-sm font-semibold text-charcoal-600 hover:text-navy-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-400 rounded-sm px-2 py-1"
            >
              <RotateCcw className="w-4 h-4" />
              Start over
            </button>
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
            <DeckField
              id="dq-name"
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
            <DeckField
              id="dq-phone"
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
            <DeckField
              id="dq-email"
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
            <button
              type="button"
              onClick={() => setPhase('material')}
              className="inline-flex items-center gap-2 text-sm font-semibold text-charcoal-600 hover:text-navy-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-400 rounded-sm px-2 py-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
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
}

/* ----------------------------- subcomponent ----------------------------- */

function DeckField({
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

'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { trackEvent, trackEstimateStep } from '@/lib/analytics';

/* ─────────────────────────────────────────────────────────────────────────
 * LuxuryConsultationForm
 *
 * Dedicated intake for $50k+ design-build projects across our luxury
 * NoVA markets (McLean, Great Falls, Vienna, Reston, Old Town Alexandria,
 * Middleburg, the upper-tier Loudoun pockets, etc.).
 *
 * Differs from MultiStepEstimateForm:
 *   - Single-page, refined layout (no "step 1 of 3" progress bar — luxury
 *     buyers expect to read the whole intake at a glance).
 *   - Pre-qualifies on project type, budget tier, timeline, and designer
 *     status — fields a serious project lead needs before the in-home
 *     visit so the conversation starts ahead of the curve.
 *   - POSTs to the existing /api/estimate route with a "[Luxury
 *     Consultation]" service prefix so Jose sees the high-value tag in
 *     the inbox without us building a parallel pipe.
 * ───────────────────────────────────────────────────────────────────── */

const PROJECT_TYPES = [
  { value: 'kitchen', label: 'Kitchen Renovation' },
  { value: 'bathroom', label: 'Primary Bath / Suite' },
  { value: 'basement', label: 'Lower-Level Finishing' },
  { value: 'whole-home', label: 'Whole-Home Renovation' },
  { value: 'addition', label: 'Addition or Expansion' },
  { value: 'other', label: 'Other Premium Project' },
] as const;

const BUDGET_TIERS = [
  { value: '50-100', label: '$50k – $100k' },
  { value: '100-200', label: '$100k – $200k' },
  { value: '200-500', label: '$200k – $500k' },
  { value: '500-plus', label: '$500k+' },
  { value: 'unsure', label: 'Not sure yet' },
] as const;

const TIMELINES = [
  { value: 'asap', label: 'As soon as possible' },
  { value: '3-6', label: '3–6 months' },
  { value: '6-12', label: '6–12 months' },
  { value: '12-plus', label: '12+ months' },
  { value: 'exploring', label: 'Exploring' },
] as const;

const DESIGNER_OPTIONS = [
  { value: 'have', label: 'Yes, already engaged' },
  { value: 'need', label: 'No, need a recommendation' },
  { value: 'undecided', label: 'Undecided / open to it' },
] as const;

const CALL_WINDOWS = [
  { value: 'asap', label: 'As soon as possible' },
  { value: 'today-pm', label: 'Today, afternoon (1–5 PM)' },
  { value: 'tomorrow-am', label: 'Tomorrow morning (8 AM–12 PM)' },
  { value: 'tomorrow-pm', label: 'Tomorrow afternoon (1–5 PM)' },
  { value: 'this-week', label: 'Sometime this week' },
  { value: 'next-week', label: 'Sometime next week' },
  { value: 'evening', label: 'Evenings after 5 PM' },
] as const;

type ProjectType = (typeof PROJECT_TYPES)[number]['value'];
type Budget = (typeof BUDGET_TIERS)[number]['value'];
type Timeline = (typeof TIMELINES)[number]['value'];
type Designer = (typeof DESIGNER_OPTIONS)[number]['value'];
type CallWindow = (typeof CALL_WINDOWS)[number]['value'];

interface FormData {
  projectType: ProjectType | '';
  budget: Budget | '';
  timeline: Timeline | '';
  designer: Designer | '';
  callWindow: CallWindow | '';
  zip: string;
  fullName: string;
  phone: string;
  email: string;
  scope: string;
}

const INITIAL: FormData = {
  projectType: '',
  budget: '',
  timeline: '',
  designer: '',
  callWindow: '',
  zip: '',
  fullName: '',
  phone: '',
  email: '',
  scope: '',
};

const ZIP_RE = /^\d{5}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[\d\s\-+().]{7,30}$/;

const labelFor = <T extends { value: string; label: string }>(
  options: readonly T[],
  value: string
) => options.find((o) => o.value === value)?.label ?? value;

type Props = {
  /** Pre-fill the project type when embedded on a service-specific page. */
  initialProjectType?: ProjectType;
};

export default function LuxuryConsultationForm({ initialProjectType }: Props) {
  const [data, setData] = useState<FormData>({
    ...INITIAL,
    projectType: initialProjectType ?? '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const hasStarted = useRef(false);
  const hasSubmitted = useRef(false);

  useEffect(() => {
    trackEstimateStep('view', 1);
  }, []);

  // Abandonment tracking
  useEffect(() => {
    const onLeave = () => {
      if (hasStarted.current && !hasSubmitted.current) {
        trackEstimateStep('abandon', 1);
      }
    };
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') onLeave();
    });
    window.addEventListener('pagehide', onLeave);
    return () => window.removeEventListener('pagehide', onLeave);
  }, []);

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    if (!hasStarted.current) hasStarted.current = true;
    setData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!data.projectType) e.projectType = 'Select the project type.';
    if (!data.budget) e.budget = 'Select a budget tier.';
    if (!data.timeline) e.timeline = 'Select a timeline.';
    if (!data.designer) e.designer = 'Let us know your designer status.';
    if (!data.callWindow) e.callWindow = 'When should we call?';
    if (!data.zip.trim()) e.zip = 'ZIP code is required.';
    else if (!ZIP_RE.test(data.zip.trim())) e.zip = 'Enter a 5-digit ZIP.';
    if (!data.fullName.trim()) e.fullName = 'Name is required.';
    if (!data.phone.trim()) e.phone = 'Phone is required.';
    else if (!PHONE_RE.test(data.phone)) e.phone = 'Enter a valid phone number.';
    if (!data.email.trim()) e.email = 'Email is required.';
    else if (!EMAIL_RE.test(data.email)) e.email = 'Enter a valid email.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError(null);
    const honeypot =
      (e.currentTarget.elements.namedItem('website') as HTMLInputElement | null)?.value ?? '';

    try {
      const response = await fetch('/api/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          service: `[Luxury Consultation] ${labelFor(PROJECT_TYPES, data.projectType)}`,
          zip: data.zip,
          propertyType: `Designer: ${labelFor(DESIGNER_OPTIONS, data.designer)} · Call window: ${labelFor(CALL_WINDOWS, data.callWindow)}`,
          timeline: labelFor(TIMELINES, data.timeline),
          budgetRange: labelFor(BUDGET_TIERS, data.budget),
          message: data.scope,
          website: honeypot,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.error || 'Failed to send consultation request');
      }

      hasSubmitted.current = true;
      trackEvent('form_submit', {
        form: 'luxury_consultation',
        projectType: data.projectType,
        budget: data.budget,
      });
      trackEstimateStep('submit', 1, {
        projectType: data.projectType,
        budget: data.budget,
      });
      setIsSuccess(true);
    } catch (err) {
      console.error('Luxury consultation submission error:', err);
      setSubmitError(
        "Something went wrong. Please call (681) 534-5515 or try again in a moment."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-white rounded-lg shadow-card-elevated p-8 md:p-12 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-brand-red text-white mb-5">
          <Check className="w-7 h-7" />
        </div>
        <h3 className="font-heading text-2xl md:text-3xl font-extrabold text-navy-800 mb-3">
          We&apos;ll call you.
        </h3>
        <p className="text-charcoal-600 leading-relaxed max-w-md mx-auto">
          Thank you. A project lead will call within your requested window. The first
          conversation is a 20–30 minute phone consultation — we&apos;ll review the project
          brief together, answer your questions, and only schedule an in-home visit if the fit
          is right.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-card-elevated p-6 sm:p-8 md:p-10"
      noValidate
    >
      {/* Honeypot */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '-10000px',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
        }}
      >
        <label htmlFor="website">Website</label>
        <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="space-y-6">
        {/* Project type */}
        <fieldset>
          <legend className="block text-sm font-semibold text-navy-800 mb-3">
            Project type
          </legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PROJECT_TYPES.map((opt) => {
              const selected = data.projectType === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => update('projectType', opt.value)}
                  aria-pressed={selected}
                  className={`px-4 py-3 rounded-md text-sm font-medium text-left border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-400 ${
                    selected
                      ? 'border-navy-800 bg-navy-800 text-white'
                      : 'border-charcoal-200 text-navy-800 hover:border-navy-400'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
          {errors.projectType && (
            <p role="alert" className="text-brand-red text-sm mt-2">
              {errors.projectType}
            </p>
          )}
        </fieldset>

        {/* Budget */}
        <div>
          <label htmlFor="budget" className="block text-sm font-semibold text-navy-800 mb-2">
            Investment range
          </label>
          <select
            id="budget"
            name="budget"
            aria-invalid={errors.budget ? true : undefined}
            value={data.budget}
            onChange={(e) => update('budget', e.target.value as Budget)}
            className={`w-full px-4 py-3 border-2 rounded-md bg-white text-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-navy-400 transition-colors ${
              errors.budget ? 'border-brand-red' : 'border-charcoal-200 hover:border-charcoal-300'
            }`}
          >
            <option value="">Select an investment tier…</option>
            {BUDGET_TIERS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {errors.budget && (
            <p role="alert" className="text-brand-red text-sm mt-2">
              {errors.budget}
            </p>
          )}
        </div>

        {/* Timeline */}
        <div>
          <label htmlFor="timeline" className="block text-sm font-semibold text-navy-800 mb-2">
            Project timeline
          </label>
          <select
            id="timeline"
            name="timeline"
            aria-invalid={errors.timeline ? true : undefined}
            value={data.timeline}
            onChange={(e) => update('timeline', e.target.value as Timeline)}
            className={`w-full px-4 py-3 border-2 rounded-md bg-white text-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-navy-400 transition-colors ${
              errors.timeline ? 'border-brand-red' : 'border-charcoal-200 hover:border-charcoal-300'
            }`}
          >
            <option value="">Select a timeline…</option>
            {TIMELINES.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {errors.timeline && (
            <p role="alert" className="text-brand-red text-sm mt-2">
              {errors.timeline}
            </p>
          )}
        </div>

        {/* Designer status */}
        <fieldset>
          <legend className="block text-sm font-semibold text-navy-800 mb-3">
            Are you working with a designer or architect?
          </legend>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {DESIGNER_OPTIONS.map((opt) => {
              const selected = data.designer === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => update('designer', opt.value)}
                  aria-pressed={selected}
                  className={`px-4 py-3 rounded-md text-sm font-medium text-left border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-400 ${
                    selected
                      ? 'border-navy-800 bg-navy-800 text-white'
                      : 'border-charcoal-200 text-navy-800 hover:border-navy-400'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
          {errors.designer && (
            <p role="alert" className="text-brand-red text-sm mt-2">
              {errors.designer}
            </p>
          )}
        </fieldset>

        {/* Preferred call window */}
        <div>
          <label
            htmlFor="callWindow"
            className="block text-sm font-semibold text-navy-800 mb-2"
          >
            When&apos;s a good time to call?
          </label>
          <select
            id="callWindow"
            name="callWindow"
            aria-invalid={errors.callWindow ? true : undefined}
            value={data.callWindow}
            onChange={(e) => update('callWindow', e.target.value as CallWindow)}
            className={`w-full px-4 py-3 border-2 rounded-md bg-white text-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-navy-400 transition-colors ${
              errors.callWindow
                ? 'border-brand-red'
                : 'border-charcoal-200 hover:border-charcoal-300'
            }`}
          >
            <option value="">Pick a window…</option>
            {CALL_WINDOWS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {errors.callWindow && (
            <p role="alert" className="text-brand-red text-sm mt-2">
              {errors.callWindow}
            </p>
          )}
        </div>

        {/* ZIP */}
        <div>
          <label htmlFor="zip" className="block text-sm font-semibold text-navy-800 mb-2">
            Project ZIP code
          </label>
          <input
            id="zip"
            name="zip"
            aria-invalid={errors.zip ? true : undefined}
            type="text"
            inputMode="numeric"
            maxLength={5}
            autoComplete="postal-code"
            placeholder="22101"
            value={data.zip}
            onChange={(e) => update('zip', e.target.value.replace(/\D/g, ''))}
            className={`w-full px-4 py-3 border-2 rounded-md bg-white text-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-navy-400 transition-colors ${
              errors.zip ? 'border-brand-red' : 'border-charcoal-200 hover:border-charcoal-300'
            }`}
          />
          {errors.zip && (
            <p role="alert" className="text-brand-red text-sm mt-2">
              {errors.zip}
            </p>
          )}
        </div>

        {/* Contact */}
        <div className="pt-2 border-t border-charcoal-100">
          <p className="text-brand-red text-[0.65rem] uppercase tracking-[0.18em] font-bold mb-4 pt-4">
            Your contact
          </p>

          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-navy-800 mb-2">
                Full name
              </label>
              <input
                id="fullName"
                name="fullName"
                aria-invalid={errors.fullName ? true : undefined}
                type="text"
                autoComplete="name"
                value={data.fullName}
                onChange={(e) => update('fullName', e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-md bg-white text-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-navy-400 transition-colors ${
                  errors.fullName ? 'border-brand-red' : 'border-charcoal-200 hover:border-charcoal-300'
                }`}
              />
              {errors.fullName && (
                <p role="alert" className="text-brand-red text-sm mt-2">
                  {errors.fullName}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-navy-800 mb-2">
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                aria-invalid={errors.phone ? true : undefined}
                type="tel"
                autoComplete="tel"
                value={data.phone}
                onChange={(e) => update('phone', e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-md bg-white text-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-navy-400 transition-colors ${
                  errors.phone ? 'border-brand-red' : 'border-charcoal-200 hover:border-charcoal-300'
                }`}
              />
              {errors.phone && (
                <p role="alert" className="text-brand-red text-sm mt-2">
                  {errors.phone}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-navy-800 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                aria-invalid={errors.email ? true : undefined}
                type="email"
                autoComplete="email"
                value={data.email}
                onChange={(e) => update('email', e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-md bg-white text-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-navy-400 transition-colors ${
                  errors.email ? 'border-brand-red' : 'border-charcoal-200 hover:border-charcoal-300'
                }`}
              />
              {errors.email && (
                <p role="alert" className="text-brand-red text-sm mt-2">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="scope" className="block text-sm font-semibold text-navy-800 mb-2">
                Project brief{' '}
                <span className="text-charcoal-400 font-normal">(optional)</span>
              </label>
              <textarea
                id="scope"
                name="scope"
                rows={4}
                maxLength={2000}
                placeholder="The vision, the address, anything we should know before the in-home consultation."
                value={data.scope}
                onChange={(e) => update('scope', e.target.value)}
                className="w-full px-4 py-3 border-2 border-charcoal-200 hover:border-charcoal-300 rounded-md bg-white text-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-navy-400 transition-colors resize-none"
              />
            </div>
          </div>
        </div>

        {submitError && (
          <div
            role="alert"
            className="bg-brand-red/10 border border-brand-red/30 rounded-md p-4 text-sm text-brand-red"
          >
            {submitError}
          </div>
        )}

        <p className="text-xs text-charcoal-500 leading-relaxed">
          By submitting, you agree we may contact you about this consultation. We never sell your
          information. Licensed and insured across VA, MD, and WV.
        </p>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex items-center justify-center gap-2 bg-brand-red text-white px-7 py-4 rounded-md font-bold text-sm hover:bg-brand-red-dark transition-colors shadow-lg shadow-brand-red/20 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-red"
        >
          {isSubmitting ? 'Sending…' : 'Request Phone Consultation'}
          {!isSubmitting && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </form>
  );
}

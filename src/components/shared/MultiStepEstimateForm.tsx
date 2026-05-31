'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { trackEvent, trackEstimateStep } from '@/lib/analytics';

/* -------------------------------- options -------------------------------- */

const SERVICE_OPTIONS = [
  { value: 'bathroom-remodel', label: 'Bathroom Remodel' },
  { value: 'kitchen-remodel', label: 'Kitchen Remodel' },
  { value: 'basement-finish', label: 'Basement Finishing' },
  { value: 'whole-home-remodel', label: 'Whole-Home Remodel' },
  { value: 'decks-outdoor', label: 'Decks & Outdoor Living' },
  { value: 'roofing', label: 'Roofing' },
  { value: 'siding', label: 'Siding & Exterior' },
  { value: 'paving', label: 'Paving & Seal Coating' },
  { value: 'addition', label: 'Home Addition' },
  { value: 'repairs', label: 'Repairs / Handyman' },
  { value: 'other', label: 'Something else' },
] as const;

const PROPERTY_OPTIONS = [
  { value: 'single-family', label: 'Single-family home' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'condo', label: 'Condo' },
  { value: 'other', label: 'Other' },
] as const;

const TIMELINE_OPTIONS = [
  { value: 'asap', label: 'ASAP / Within a month' },
  { value: '1-3-months', label: '1–3 months' },
  { value: '3-6-months', label: '3–6 months' },
  { value: '6plus-months', label: '6+ months' },
  { value: 'exploring', label: 'Just exploring' },
] as const;

const BUDGET_OPTIONS = [
  { value: 'under-10k', label: 'Under $10k' },
  { value: '10k-25k', label: '$10k – $25k' },
  { value: '25k-50k', label: '$25k – $50k' },
  { value: '50k-100k', label: '$50k – $100k' },
  { value: '100k-plus', label: '$100k+' },
  { value: 'unsure', label: 'Not sure yet' },
] as const;

type ServiceValue = (typeof SERVICE_OPTIONS)[number]['value'];
type PropertyValue = (typeof PROPERTY_OPTIONS)[number]['value'];
type TimelineValue = (typeof TIMELINE_OPTIONS)[number]['value'];
type BudgetValue = (typeof BUDGET_OPTIONS)[number]['value'];

interface FormData {
  service: ServiceValue | '';
  zip: string;
  propertyType: PropertyValue | '';
  scope: string;
  timeline: TimelineValue | '';
  budgetRange: BudgetValue | '';
  fullName: string;
  phone: string;
  email: string;
}

type Errors = Partial<Record<keyof FormData, string>>;

const INITIAL: FormData = {
  service: '',
  zip: '',
  propertyType: '',
  scope: '',
  timeline: '',
  budgetRange: '',
  fullName: '',
  phone: '',
  email: '',
};

/* -------------------------------- helpers -------------------------------- */

const labelFor = <T extends { value: string; label: string }>(
  options: readonly T[],
  value: string
) => options.find((o) => o.value === value)?.label ?? value;

const ZIP_RE = /^\d{5}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[\d\s\-+().]{7,30}$/;

/* -------------------------------- component ------------------------------ */

type Props = {
  /** Pre-select a service (used when embedding on a service page). */
  initialService?: ServiceValue;
};

export default function MultiStepEstimateForm({ initialService }: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [data, setData] = useState<FormData>({
    ...INITIAL,
    service: initialService ?? '',
  });
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Track interaction so abandonment fires only after the user starts
  const hasStarted = useRef(false);
  const hasSubmitted = useRef(false);
  const stepRef = useRef(step);
  const stepHeadingRef = useRef<HTMLLegendElement>(null);
  const isFirstStepRender = useRef(true);

  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  // Step view tracking
  useEffect(() => {
    trackEstimateStep('view', step);
  }, [step]);

  // Move focus to the step heading when advancing/going back so screen-reader
  // and keyboard users land on the new step (skip the initial mount).
  useEffect(() => {
    if (isFirstStepRender.current) {
      isFirstStepRender.current = false;
      return;
    }
    stepHeadingRef.current?.focus();
  }, [step]);

  // Abandonment: fire on tab hide / unload if started but not submitted
  useEffect(() => {
    const onLeave = () => {
      if (hasStarted.current && !hasSubmitted.current) {
        trackEstimateStep('abandon', stepRef.current);
      }
    };
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') onLeave();
    });
    window.addEventListener('pagehide', onLeave);
    return () => {
      window.removeEventListener('pagehide', onLeave);
    };
  }, []);

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    if (!hasStarted.current) hasStarted.current = true;
    setData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validateStep = (current: 1 | 2 | 3): boolean => {
    const e: Errors = {};
    if (current === 1) {
      if (!data.service) e.service = 'Pick the service that fits best.';
      if (!data.zip.trim()) e.zip = 'ZIP code is required.';
      else if (!ZIP_RE.test(data.zip.trim())) e.zip = 'Enter a 5-digit ZIP.';
    }
    if (current === 2) {
      if (!data.propertyType) e.propertyType = 'Pick a property type.';
      if (!data.timeline) e.timeline = 'Roughly when?';
    }
    if (current === 3) {
      if (!data.fullName.trim()) e.fullName = 'Name is required.';
      if (!data.phone.trim()) e.phone = 'Phone is required.';
      else if (!PHONE_RE.test(data.phone)) e.phone = 'Enter a valid phone number.';
      if (!data.email.trim()) e.email = 'Email is required.';
      else if (!EMAIL_RE.test(data.email)) e.email = 'Enter a valid email.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validateStep(step)) return;
    trackEstimateStep('advance', step);
    setStep((s) => (s === 1 ? 2 : 3));
  };

  const back = () => setStep((s) => (s === 3 ? 2 : 1));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    setSubmitError(null);
    const honeypot = (e.currentTarget.elements.namedItem('website') as HTMLInputElement | null)?.value ?? '';

    try {
      const response = await fetch('/api/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          service: labelFor(SERVICE_OPTIONS, data.service),
          zip: data.zip,
          propertyType: labelFor(PROPERTY_OPTIONS, data.propertyType),
          timeline: labelFor(TIMELINE_OPTIONS, data.timeline),
          budgetRange: data.budgetRange ? labelFor(BUDGET_OPTIONS, data.budgetRange) : '',
          message: data.scope,
          website: honeypot,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.error || 'Failed to send estimate request');
      }

      hasSubmitted.current = true;
      trackEvent('form_submit', { form: 'estimate_multistep', service: data.service });
      trackEstimateStep('submit', 3, { service: data.service });
      setIsSuccess(true);
    } catch (err) {
      console.error('Multi-step estimate submission error:', err);
      setSubmitError(
        "Something went wrong. Please call (681) 534-5515 or try again in a moment."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ----------------------------- success view ---------------------------- */

  if (isSuccess) {
    return (
      <div className="bg-white rounded-lg shadow-card-elevated p-8 md:p-12 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-brand-red text-white mb-5">
          <Check className="w-7 h-7" />
        </div>
        <h3 className="font-heading text-2xl md:text-3xl font-extrabold text-navy-800 mb-3">
          Request received.
        </h3>
        <p className="text-charcoal-600 leading-relaxed">
          Thanks — we&apos;ve got your details. A project lead will reach out within
          24 business hours to schedule your free on-site estimate.
        </p>
      </div>
    );
  }

  /* ------------------------------- form ---------------------------------- */

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-card-elevated p-6 sm:p-8 md:p-10"
      noValidate
    >
      {/* Honeypot */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: '1px', height: '1px', overflow: 'hidden' }}>
        <label htmlFor="website">Website</label>
        <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {/* Progress */}
      <div className="mb-7 sm:mb-9">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.15em] text-charcoal-500 mb-3">
          <span>Step {step} of 3</span>
          <span>About 60 seconds</span>
        </div>
        <div className="h-1.5 bg-charcoal-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-red transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={3}
            aria-valuenow={step}
            aria-label="Estimate form progress"
          />
        </div>
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <fieldset>
          <legend ref={stepHeadingRef} tabIndex={-1} className="font-heading text-2xl md:text-3xl font-extrabold text-navy-800 mb-2 focus:outline-none">
            What can we build for you?
          </legend>
          <p className="text-charcoal-600 text-sm mb-6">
            Pick the service that fits best — we&apos;ll dial in the rest after.
          </p>

          <div>
            <label htmlFor="service" className="block text-sm font-semibold text-navy-800 mb-2">
              Service
            </label>
            <select
              id="service"
              name="service"
              aria-invalid={errors.service ? true : undefined}
              aria-describedby={errors.service ? 'service-error' : undefined}
              value={data.service}
              onChange={(e) => update('service', e.target.value as ServiceValue)}
              className={`w-full px-4 py-3 border-2 rounded-md bg-white text-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-navy-400 transition-colors ${
                errors.service ? 'border-brand-red' : 'border-charcoal-200 hover:border-charcoal-300'
              }`}
            >
              <option value="">Select a service…</option>
              {SERVICE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {errors.service && <p id="service-error" role="alert" className="text-brand-red text-sm mt-2">{errors.service}</p>}
          </div>

          <div className="mt-5">
            <label htmlFor="zip" className="block text-sm font-semibold text-navy-800 mb-2">
              Project ZIP code
            </label>
            <input
              id="zip"
              name="zip"
              aria-invalid={errors.zip ? true : undefined}
              aria-describedby={errors.zip ? 'zip-error' : undefined}
              type="text"
              inputMode="numeric"
              maxLength={5}
              autoComplete="postal-code"
              placeholder="25401"
              value={data.zip}
              onChange={(e) => update('zip', e.target.value.replace(/\D/g, ''))}
              className={`w-full px-4 py-3 border-2 rounded-md bg-white text-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-navy-400 transition-colors ${
                errors.zip ? 'border-brand-red' : 'border-charcoal-200 hover:border-charcoal-300'
              }`}
            />
            {errors.zip && <p id="zip-error" role="alert" className="text-brand-red text-sm mt-2">{errors.zip}</p>}
            <p className="text-charcoal-500 text-xs mt-2">
              We serve the WV–MD–VA region. If you&apos;re outside, we&apos;ll let you know upfront.
            </p>
          </div>
        </fieldset>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <fieldset>
          <legend ref={stepHeadingRef} tabIndex={-1} className="font-heading text-2xl md:text-3xl font-extrabold text-navy-800 mb-2 focus:outline-none">
            A few project details.
          </legend>
          <p className="text-charcoal-600 text-sm mb-6">
            This helps us match the right project lead and bring the right notes to the walk-through.
          </p>

          <div>
            <label className="block text-sm font-semibold text-navy-800 mb-2">Property type</label>
            <div className="grid grid-cols-2 gap-2">
              {PROPERTY_OPTIONS.map((opt) => {
                const selected = data.propertyType === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => update('propertyType', opt.value)}
                    className={`px-4 py-3 rounded-md text-sm font-medium text-left border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-400 ${
                      selected
                        ? 'border-navy-800 bg-navy-800 text-white'
                        : 'border-charcoal-200 text-navy-800 hover:border-navy-400'
                    }`}
                    aria-pressed={selected}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
            {errors.propertyType && <p id="propertyType-error" role="alert" className="text-brand-red text-sm mt-2">{errors.propertyType}</p>}
          </div>

          <div className="mt-5">
            <label htmlFor="timeline" className="block text-sm font-semibold text-navy-800 mb-2">
              Timeline
            </label>
            <select
              id="timeline"
              name="timeline"
              aria-invalid={errors.timeline ? true : undefined}
              aria-describedby={errors.timeline ? 'timeline-error' : undefined}
              value={data.timeline}
              onChange={(e) => update('timeline', e.target.value as TimelineValue)}
              className={`w-full px-4 py-3 border-2 rounded-md bg-white text-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-navy-400 transition-colors ${
                errors.timeline ? 'border-brand-red' : 'border-charcoal-200 hover:border-charcoal-300'
              }`}
            >
              <option value="">When would you like to start?</option>
              {TIMELINE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {errors.timeline && <p id="timeline-error" role="alert" className="text-brand-red text-sm mt-2">{errors.timeline}</p>}
          </div>

          <div className="mt-5">
            <label htmlFor="budgetRange" className="block text-sm font-semibold text-navy-800 mb-2">
              Budget range <span className="text-charcoal-400 font-normal">(optional, helps us scope)</span>
            </label>
            <select
              id="budgetRange"
              name="budgetRange"
              value={data.budgetRange}
              onChange={(e) => update('budgetRange', e.target.value as BudgetValue)}
              className="w-full px-4 py-3 border-2 border-charcoal-200 hover:border-charcoal-300 rounded-md bg-white text-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-navy-400 transition-colors"
            >
              <option value="">Prefer not to say</option>
              {BUDGET_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="mt-5">
            <label htmlFor="scope" className="block text-sm font-semibold text-navy-800 mb-2">
              Tell us about the project <span className="text-charcoal-400 font-normal">(optional)</span>
            </label>
            <textarea
              id="scope"
              name="scope"
              rows={4}
              maxLength={2000}
              placeholder="What you're picturing, any concerns, what's prompting the project…"
              value={data.scope}
              onChange={(e) => update('scope', e.target.value)}
              className="w-full px-4 py-3 border-2 border-charcoal-200 hover:border-charcoal-300 rounded-md bg-white text-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-navy-400 transition-colors resize-none"
            />
          </div>
        </fieldset>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <fieldset>
          <legend ref={stepHeadingRef} tabIndex={-1} className="font-heading text-2xl md:text-3xl font-extrabold text-navy-800 mb-2 focus:outline-none">
            Where do we send your estimate?
          </legend>
          <p className="text-charcoal-600 text-sm mb-6">
            Real person, no spam. We&apos;ll reach out within 24 business hours.
          </p>

          <div>
            <label htmlFor="fullName" className="block text-sm font-semibold text-navy-800 mb-2">Full name</label>
            <input
              id="fullName"
              name="fullName"
              aria-invalid={errors.fullName ? true : undefined}
              aria-describedby={errors.fullName ? 'fullName-error' : undefined}
              type="text"
              autoComplete="name"
              placeholder="John Smith"
              value={data.fullName}
              onChange={(e) => update('fullName', e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-md bg-white text-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-navy-400 transition-colors ${
                errors.fullName ? 'border-brand-red' : 'border-charcoal-200 hover:border-charcoal-300'
              }`}
            />
            {errors.fullName && <p id="fullName-error" role="alert" className="text-brand-red text-sm mt-2">{errors.fullName}</p>}
          </div>

          <div className="mt-5">
            <label htmlFor="phone" className="block text-sm font-semibold text-navy-800 mb-2">Phone</label>
            <input
              id="phone"
              name="phone"
              aria-invalid={errors.phone ? true : undefined}
              aria-describedby={errors.phone ? 'phone-error' : undefined}
              type="tel"
              autoComplete="tel"
              placeholder="(681) 534-5515"
              value={data.phone}
              onChange={(e) => update('phone', e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-md bg-white text-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-navy-400 transition-colors ${
                errors.phone ? 'border-brand-red' : 'border-charcoal-200 hover:border-charcoal-300'
              }`}
            />
            {errors.phone && <p id="phone-error" role="alert" className="text-brand-red text-sm mt-2">{errors.phone}</p>}
          </div>

          <div className="mt-5">
            <label htmlFor="email" className="block text-sm font-semibold text-navy-800 mb-2">Email</label>
            <input
              id="email"
              name="email"
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? 'email-error' : undefined}
              type="email"
              autoComplete="email"
              placeholder="john@example.com"
              value={data.email}
              onChange={(e) => update('email', e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-md bg-white text-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-navy-400 transition-colors ${
                errors.email ? 'border-brand-red' : 'border-charcoal-200 hover:border-charcoal-300'
              }`}
            />
            {errors.email && <p id="email-error" role="alert" className="text-brand-red text-sm mt-2">{errors.email}</p>}
          </div>

          {submitError && (
            <div role="alert" className="mt-5 bg-brand-red/10 border border-brand-red/30 rounded-md p-4 text-sm text-brand-red">
              {submitError}
            </div>
          )}

          <p className="text-xs text-charcoal-500 mt-5 leading-relaxed">
            By submitting, you agree we may contact you about this estimate. We&apos;ll
            never sell your info. Licensed &amp; insured across WV, MD, VA.
          </p>
        </fieldset>
      )}

      {/* Footer nav */}
      <div className="mt-8 flex items-center justify-between gap-4">
        {step > 1 ? (
          <button
            type="button"
            onClick={back}
            className="inline-flex items-center gap-2 text-sm font-semibold text-charcoal-600 hover:text-navy-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-400 rounded-sm px-2 py-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        ) : (
          <span />
        )}

        {step < 3 ? (
          <button
            type="button"
            onClick={next}
            className="inline-flex items-center gap-2 bg-navy-800 text-white px-7 py-3.5 rounded-md font-semibold text-sm hover:bg-navy-900 transition-colors shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-navy-400"
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 bg-brand-red text-white px-7 py-3.5 rounded-md font-bold text-sm hover:bg-brand-red-dark transition-colors shadow-lg shadow-brand-red/20 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-red"
          >
            {isSubmitting ? 'Sending…' : 'Get My Free Estimate'}
            {!isSubmitting && <ArrowRight className="w-4 h-4" />}
          </button>
        )}
      </div>
    </form>
  );
}

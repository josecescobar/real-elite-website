'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { trackEvent, trackEstimateStep, trackLead } from '@/lib/analytics';
import { attributionPayload } from '@/lib/attribution';
import { BUSINESS } from '@/lib/constants';
import {
  CONSULTATION_PROJECT_TYPES as PROJECT_TYPES,
  type ConsultationFormProjectType as ProjectType,
} from '@/lib/cta-intent';
import SuccessNextSteps from '@/components/shared/SuccessNextSteps';
import PrivacyNotice from '@/components/shared/PrivacyNotice';
import SmsConsentField from '@/components/shared/SmsConsentField';
import { smsConsentPayload } from '@/lib/sms-consent';

/* ─────────────────────────────────────────────────────────────────────────
 * LuxuryConsultationForm
 *
 * The qualifying intake for design-build projects, Loudoun County first.
 *
 * What it asks, and why:
 *   - Project type, town, budget band, timeline, designer status: the five
 *     facts a project lead needs to know whether a site visit makes sense.
 *   - How they heard about us: the attribution the ad and referral budget is
 *     decided on.
 *   - A preferred call window, so the first contact is a call inside a window
 *     the homeowner chose.
 *
 * Budget bands start at "Under $50K" on purpose. The consultation is
 * calibrated for roughly $50K and up, but a smaller lead is routed (to the
 * standard estimate) rather than rejected: choosing that band shows a note,
 * and the submission still goes through.
 *
 * Submission contract: POSTs to /api/estimate with the "[Luxury Consultation]"
 * service prefix the pipeline already keys on. The new `town` and
 * `referralSource` fields are optional on the API side, so an older client
 * or another form omitting them still works.
 * ───────────────────────────────────────────────────────────────────────── */

export const BUDGET_TIERS = [
  { value: 'under-50', label: 'Under $50K' },
  { value: '50-100', label: '$50K – $100K' },
  { value: '100-200', label: '$100K – $200K' },
  { value: '200-400', label: '$200K – $400K' },
  { value: '400-plus', label: '$400K+' },
  { value: 'unsure', label: 'Not sure yet' },
] as const;

export const TOWNS = [
  { value: 'leesburg', label: 'Leesburg' },
  { value: 'ashburn', label: 'Ashburn' },
  { value: 'brambleton', label: 'Brambleton' },
  { value: 'lansdowne', label: 'Lansdowne' },
  { value: 'middleburg', label: 'Middleburg' },
  { value: 'purcellville', label: 'Purcellville' },
  { value: 'round-hill', label: 'Round Hill' },
  { value: 'waterford', label: 'Waterford' },
  { value: 'loudoun-other', label: 'Elsewhere in Loudoun County' },
  { value: 'fairfax', label: 'Fairfax County' },
  { value: 'panhandle', label: 'Eastern Panhandle, WV' },
  { value: 'other', label: 'Somewhere else' },
] as const;

export const REFERRAL_SOURCES = [
  { value: 'referral', label: 'A friend or neighbor' },
  { value: 'agent', label: 'A real estate agent' },
  { value: 'designer', label: 'A designer or architect' },
  { value: 'search', label: 'Google search' },
  { value: 'social', label: 'Instagram or Facebook' },
  { value: 'houzz', label: 'Houzz' },
  { value: 'jobsite', label: 'Saw a job site or a truck' },
  { value: 'other', label: 'Other' },
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

type Budget = (typeof BUDGET_TIERS)[number]['value'];
type Town = (typeof TOWNS)[number]['value'];
type Referral = (typeof REFERRAL_SOURCES)[number]['value'];
type Timeline = (typeof TIMELINES)[number]['value'];
type Designer = (typeof DESIGNER_OPTIONS)[number]['value'];
type CallWindow = (typeof CALL_WINDOWS)[number]['value'];

interface FormData {
  projectType: ProjectType | '';
  town: Town | '';
  budget: Budget | '';
  timeline: Timeline | '';
  designer: Designer | '';
  referral: Referral | '';
  callWindow: CallWindow | '';
  zip: string;
  fullName: string;
  phone: string;
  email: string;
  scope: string;
}

const INITIAL: FormData = {
  projectType: '',
  town: '',
  budget: '',
  timeline: '',
  designer: '',
  referral: '',
  callWindow: '',
  zip: '',
  fullName: '',
  phone: '',
  email: '',
  scope: '',
};

// Matches the server-side rule in /api/estimate (ZIP+4 allowed).
const ZIP_RE = /^\d{5}(?:-\d{4})?$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[\d\s\-+().]{7,30}$/;

const labelFor = <T extends { value: string; label: string }>(
  options: readonly T[],
  value: string
) => options.find((o) => o.value === value)?.label ?? value;

const FIELD_CLASS =
  'w-full px-4 py-3 border rounded-md bg-white text-navy-900 placeholder:text-charcoal-400 focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-navy-400 transition-colors';
const fieldClass = (hasError: boolean) =>
  `${FIELD_CLASS} ${hasError ? 'border-brand-red' : 'border-steel-300 hover:border-charcoal-400'}`;
const LABEL_CLASS = 'block text-sm font-medium text-navy-900 mb-2';

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
  const [smsConsent, setSmsConsent] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const successRef = useRef<HTMLDivElement>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (isSuccess) successRef.current?.focus();
  }, [isSuccess]);

  const hasStarted = useRef(false);
  const hasSubmitted = useRef(false);

  useEffect(() => {
    trackEstimateStep('view', 1, 'luxury_consultation');
  }, []);

  // Abandonment tracking
  useEffect(() => {
    const onLeave = () => {
      if (hasStarted.current && !hasSubmitted.current) {
        trackEstimateStep('abandon', 1, 'luxury_consultation');
      }
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') onLeave();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('pagehide', onLeave);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('pagehide', onLeave);
    };
  }, []);

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    // First real interaction with a field — the engagement signal that `view`
    // (which fires on mount) is not.
    if (!hasStarted.current) {
      hasStarted.current = true;
      trackEstimateStep('start', 1, 'luxury_consultation');
    }
    setData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!data.projectType) e.projectType = 'Select the project type.';
    if (!data.town) e.town = 'Tell us where the house is.';
    if (!data.budget) e.budget = 'Select an investment range.';
    if (!data.timeline) e.timeline = 'Select a timeline.';
    if (!data.designer) e.designer = 'Let us know your designer status.';
    if (!data.callWindow) e.callWindow = 'When should we call?';
    if (!data.zip.trim()) e.zip = 'ZIP code is required.';
    else if (!ZIP_RE.test(data.zip.trim())) e.zip = 'Enter a valid ZIP code.';
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
          town: labelFor(TOWNS, data.town),
          propertyType: `Designer: ${labelFor(DESIGNER_OPTIONS, data.designer)} · Call window: ${labelFor(CALL_WINDOWS, data.callWindow)}`,
          timeline: labelFor(TIMELINES, data.timeline),
          budgetRange: labelFor(BUDGET_TIERS, data.budget),
          ...(data.referral ? { referralSource: labelFor(REFERRAL_SOURCES, data.referral) } : {}),
          message: data.scope,
          ...attributionPayload(),
          ...smsConsentPayload(smsConsent),
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
        town: data.town,
      });
      trackLead({
        lead_type: 'luxury_consultation',
        service: data.projectType ? labelFor(PROJECT_TYPES, data.projectType) : undefined,
        value_band: data.budget ? labelFor(BUDGET_TIERS, data.budget) : undefined,
      });
      trackEstimateStep('submit', 1, 'luxury_consultation', {
        projectType: data.projectType,
        budget: data.budget,
        town: data.town,
      });
      setIsSuccess(true);
    } catch (err) {
      console.error('Luxury consultation submission error:', err);
      setSubmitError(
        `Something went wrong. Please call ${BUSINESS.phone} or try again in a moment.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div
        ref={successRef}
        role="status"
        aria-live="polite"
        tabIndex={-1}
        className="bg-white rounded-lg border border-steel-200 shadow-card-elevated p-8 md:p-12 text-center focus:outline-none"
      >
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-navy-900 text-white mb-5">
          <Check className="w-7 h-7" />
        </div>
        <h3 className="font-heading text-3xl text-navy-900 mb-3">
          {smsConsent ? "We'll call you." : 'Request received.'}
        </h3>
        <p className="text-charcoal-600 leading-relaxed max-w-md mx-auto">
          {smsConsent
            ? 'Thank you. A project lead will call within your requested window. The first conversation is a short call to review the brief together, answer your questions and decide whether a site visit is the right next step.'
            : "Thank you. A project lead will review your brief and reply by email. We won't call or text this number unless you checked the consent box."}
        </p>
        <SuccessNextSteps guideHref="/investment" guideLabel="Read the Loudoun investment guide" />
      </div>
    );
  }

  const choiceClass = (selected: boolean) =>
    `px-4 py-3 rounded-md text-sm font-medium text-left border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-400 ${
      selected
        ? 'border-navy-900 bg-navy-900 text-white'
        : 'border-steel-300 text-navy-900 hover:border-charcoal-500'
    }`;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg border border-steel-200 shadow-card-elevated p-6 sm:p-8 md:p-10"
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

      <div className="space-y-7">
        {/* Project type */}
        <fieldset>
          <legend className="block text-sm font-medium text-navy-900 mb-3">Project type</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PROJECT_TYPES.map((opt) => {
              const selected = data.projectType === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => update('projectType', opt.value)}
                  aria-pressed={selected}
                  className={choiceClass(selected)}
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

        {/* Town + ZIP */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-8">
            <label htmlFor="town" className={LABEL_CLASS}>
              Where is the house?
            </label>
            <select
              id="town"
              name="town"
              aria-invalid={errors.town ? true : undefined}
              aria-describedby={errors.town ? 'town-error' : undefined}
              value={data.town}
              onChange={(e) => update('town', e.target.value as Town)}
              className={fieldClass(Boolean(errors.town))}
            >
              <option value="">Select a town or area…</option>
              {TOWNS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.town && (
              <p id="town-error" role="alert" className="text-brand-red text-sm mt-2">
                {errors.town}
              </p>
            )}
          </div>
          <div className="sm:col-span-4">
            <label htmlFor="zip" className={LABEL_CLASS}>
              Project ZIP code
            </label>
            <input
              id="zip"
              name="zip"
              aria-invalid={errors.zip ? true : undefined}
              aria-describedby={errors.zip ? 'zip-error' : undefined}
              type="text"
              inputMode="numeric"
              maxLength={10}
              autoComplete="postal-code"
              placeholder="20176"
              value={data.zip}
              onChange={(e) => update('zip', e.target.value.replace(/[^\d-]/g, ''))}
              className={fieldClass(Boolean(errors.zip))}
            />
            {errors.zip && (
              <p id="zip-error" role="alert" className="text-brand-red text-sm mt-2">
                {errors.zip}
              </p>
            )}
          </div>
        </div>

        {/* Budget + Timeline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="budget" className={LABEL_CLASS}>
              Investment range
            </label>
            <select
              id="budget"
              name="budget"
              aria-invalid={errors.budget ? true : undefined}
              aria-describedby={errors.budget ? 'budget-error' : data.budget === 'under-50' ? 'budget-note' : undefined}
              value={data.budget}
              onChange={(e) => update('budget', e.target.value as Budget)}
              className={fieldClass(Boolean(errors.budget))}
            >
              <option value="">Select an investment range…</option>
              {BUDGET_TIERS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.budget && (
              <p id="budget-error" role="alert" className="text-brand-red text-sm mt-2">
                {errors.budget}
              </p>
            )}
            {!errors.budget && data.budget === 'under-50' && (
              <p id="budget-note" className="text-charcoal-600 text-sm mt-2 leading-relaxed">
                Projects under about $50K usually move faster through our{' '}
                <Link href="/estimate" className="font-medium text-navy-900 underline underline-offset-2">
                  standard estimate
                </Link>
                . You are welcome to send this anyway; we will route it to the right path.
              </p>
            )}
          </div>

          <div>
            <label htmlFor="timeline" className={LABEL_CLASS}>
              Project timeline
            </label>
            <select
              id="timeline"
              name="timeline"
              aria-invalid={errors.timeline ? true : undefined}
              aria-describedby={errors.timeline ? 'timeline-error' : undefined}
              value={data.timeline}
              onChange={(e) => update('timeline', e.target.value as Timeline)}
              className={fieldClass(Boolean(errors.timeline))}
            >
              <option value="">Select a timeline…</option>
              {TIMELINES.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.timeline && (
              <p id="timeline-error" role="alert" className="text-brand-red text-sm mt-2">
                {errors.timeline}
              </p>
            )}
          </div>
        </div>

        {/* Designer status */}
        <fieldset>
          <legend className="block text-sm font-medium text-navy-900 mb-3">
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
                  className={choiceClass(selected)}
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

        {/* How they heard + call window */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="referral" className={LABEL_CLASS}>
              How did you hear about us?{' '}
              <span className="text-charcoal-400 font-normal">(optional)</span>
            </label>
            <select
              id="referral"
              name="referral"
              value={data.referral}
              onChange={(e) => update('referral', e.target.value as Referral)}
              className={fieldClass(false)}
            >
              <option value="">Select one…</option>
              {REFERRAL_SOURCES.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="callWindow" className={LABEL_CLASS}>
              When&apos;s a good time to call?
            </label>
            <select
              id="callWindow"
              name="callWindow"
              aria-invalid={errors.callWindow ? true : undefined}
              aria-describedby={errors.callWindow ? 'callWindow-error' : undefined}
              value={data.callWindow}
              onChange={(e) => update('callWindow', e.target.value as CallWindow)}
              className={fieldClass(Boolean(errors.callWindow))}
            >
              <option value="">Pick a window…</option>
              {CALL_WINDOWS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.callWindow && (
              <p id="callWindow-error" role="alert" className="text-brand-red text-sm mt-2">
                {errors.callWindow}
              </p>
            )}
          </div>
        </div>

        {/* Contact */}
        <div className="pt-2 border-t border-steel-200">
          <p className="text-brand-red text-[0.65rem] uppercase tracking-[0.2em] font-semibold mb-4 pt-5">
            Your contact
          </p>

          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className={LABEL_CLASS}>
                Full name
              </label>
              <input
                id="fullName"
                name="fullName"
                aria-invalid={errors.fullName ? true : undefined}
                aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                type="text"
                autoComplete="name"
                value={data.fullName}
                onChange={(e) => update('fullName', e.target.value)}
                className={fieldClass(Boolean(errors.fullName))}
              />
              {errors.fullName && (
                <p id="fullName-error" role="alert" className="text-brand-red text-sm mt-2">
                  {errors.fullName}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone" className={LABEL_CLASS}>
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  aria-invalid={errors.phone ? true : undefined}
                  aria-describedby={errors.phone ? 'phone-error' : undefined}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={data.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  className={fieldClass(Boolean(errors.phone))}
                />
                {errors.phone && (
                  <p id="phone-error" role="alert" className="text-brand-red text-sm mt-2">
                    {errors.phone}
                  </p>
                )}
                <SmsConsentField
                  id="luxury-sms-consent"
                  checked={smsConsent}
                  onChange={setSmsConsent}
                />
              </div>

              <div>
                <label htmlFor="email" className={LABEL_CLASS}>
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  aria-invalid={errors.email ? true : undefined}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  type="email"
                  autoComplete="email"
                  value={data.email}
                  onChange={(e) => update('email', e.target.value)}
                  className={fieldClass(Boolean(errors.email))}
                />
                {errors.email && (
                  <p id="email-error" role="alert" className="text-brand-red text-sm mt-2">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="scope" className={LABEL_CLASS}>
                Project brief <span className="text-charcoal-400 font-normal">(optional)</span>
              </label>
              <textarea
                id="scope"
                name="scope"
                rows={4}
                maxLength={2000}
                placeholder="The rooms, the house, what is not working, and anything we should know before a site visit."
                value={data.scope}
                onChange={(e) => update('scope', e.target.value)}
                className={`${fieldClass(false)} resize-none`}
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

        <PrivacyNotice subject="consultation" className="text-xs text-charcoal-500 leading-relaxed" />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex items-center justify-center gap-2 bg-navy-900 text-white px-7 py-4 rounded-md font-semibold text-sm hover:bg-brand-red transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus-ring"
        >
          {isSubmitting ? 'Sending…' : 'Request Phone Consultation'}
          {!isSubmitting && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </form>
  );
}

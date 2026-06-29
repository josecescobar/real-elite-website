import { NextResponse } from 'next/server';
import { BUSINESS } from '@/lib/constants';
import { env } from '@/lib/env';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

const RESEND_API_KEY = env.resendApiKey();
const TO_EMAIL = env.estimateToEmail() || 'info@realelitecontracting.com';

// Speed-to-lead: Twilio SMS notification to the owner the second a
// qualified inquiry lands. All four vars must be set or the SMS step
// is silently skipped (the form still works on email alone). Setup
// guide: docs/SPEED_TO_LEAD_SETUP.md
const TWILIO_ACCOUNT_SID = env.twilioAccountSid();
const TWILIO_AUTH_TOKEN = env.twilioAuthToken();
const TWILIO_FROM_NUMBER = env.twilioFromNumber();
const TWILIO_TO_NUMBER = env.twilioToNumber();

const MAX = {
  fullName: 100,
  email: 200,
  phone: 30,
  service: 80,
  message: 2000,
  zip: 12,
  propertyType: 200,
  timeline: 60,
  budgetRange: 60,
};
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[\d\s\-+().]{7,30}$/;
const ZIP_RE = /^\d{5}(?:-\d{4})?$/;

const RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000 };

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

type Field = keyof typeof MAX;
const REQUIRED: Field[] = ['fullName', 'email', 'phone', 'service'];
const OPTIONAL: Field[] = ['message', 'zip', 'propertyType', 'timeline', 'budgetRange'];

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);

    const limit = await rateLimit(`estimate:${ip}`, RATE_LIMIT.max, RATE_LIMIT.windowMs);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } }
      );
    }

    const body = await request.json();
    const website = body?.website;

    // Honeypot: silently succeed so bots don't retry
    if (typeof website === 'string' && website.length > 0) {
      return NextResponse.json({ message: 'Estimate request sent successfully' }, { status: 200 });
    }

    // Collect + validate fields
    const values: Partial<Record<Field, string>> = {};
    for (const key of REQUIRED) {
      const v = body?.[key];
      if (typeof v !== 'string' || !v.trim()) {
        return NextResponse.json({ error: 'Required fields are missing' }, { status: 400 });
      }
      if (v.length > MAX[key]) {
        return NextResponse.json({ error: `${key} is too long` }, { status: 400 });
      }
      values[key] = v.trim();
    }
    for (const key of OPTIONAL) {
      const v = body?.[key];
      if (v === undefined || v === null || v === '') continue;
      if (typeof v !== 'string') {
        return NextResponse.json({ error: `${key} is invalid` }, { status: 400 });
      }
      if (v.length > MAX[key]) {
        return NextResponse.json({ error: `${key} is too long` }, { status: 400 });
      }
      values[key] = v.trim();
    }

    if (!EMAIL_RE.test(values.email!)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }
    if (!PHONE_RE.test(values.phone!)) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
    }
    if (values.zip && !ZIP_RE.test(values.zip)) {
      return NextResponse.json({ error: 'Invalid ZIP code' }, { status: 400 });
    }

    if (!RESEND_API_KEY) {
      console.error(
        'RESEND_API_KEY is not set — add it in Vercel project settings ' +
          '(see docs/DEPLOYMENT_CHECKLIST.md). Falling back to a graceful ' +
          'user message instead of a hard 500.'
      );
      return NextResponse.json(
        {
          error: `We couldn't send the request automatically. Please call ${BUSINESS.phone} and we'll take it from there.`,
        },
        { status: 503 }
      );
    }

    // HTML-safe values
    const safe: Partial<Record<Field, string>> = {};
    for (const [key, value] of Object.entries(values)) {
      safe[key as Field] =
        key === 'message'
          ? escapeHtml(value as string).replace(/\n/g, '<br>')
          : escapeHtml(value as string);
    }

    const rows: { label: string; html: string }[] = [
      { label: 'Name', html: safe.fullName ?? '' },
      { label: 'Email', html: `<a href="mailto:${safe.email}">${safe.email}</a>` },
      { label: 'Phone', html: `<a href="tel:${safe.phone}">${safe.phone}</a>` },
      { label: 'Service', html: safe.service ?? '' },
    ];
    if (safe.zip) rows.push({ label: 'ZIP', html: safe.zip });
    if (safe.propertyType) rows.push({ label: 'Property', html: safe.propertyType });
    if (safe.timeline) rows.push({ label: 'Timeline', html: safe.timeline });
    if (safe.budgetRange) rows.push({ label: 'Budget', html: safe.budgetRange });

    const rowsHtml = rows
      .map(
        (r) => `
        <tr>
          <td style="padding: 12px 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #1a2744; width: 130px;">${r.label}</td>
          <td style="padding: 12px 8px; border-bottom: 1px solid #e2e8f0; color: #1a2744;">${r.html}</td>
        </tr>`
      )
      .join('');

    const messageBlock = safe.message
      ? `
        <div style="margin-top: 20px; padding: 16px; background-color: white; border-radius: 8px; border: 1px solid #e2e8f0;">
          <h3 style="color: #1a2744; margin: 0 0 8px 0; font-size: 14px;">Project Details</h3>
          <p style="margin: 0; color: #333; line-height: 1.6;">${safe.message}</p>
        </div>`
      : '';

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Real Elite Contracting <info@realelitecontracting.com>',
        to: [TO_EMAIL],
        subject: `New Estimate Request: ${values.service} — ${values.fullName}`,
        reply_to: values.email,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #1a2744; padding: 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 22px; letter-spacing: 0.5px;">New Estimate Request</h1>
              <p style="color: #c0392b; margin: 4px 0 0; font-size: 11px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase;">Built With Military Precision</p>
            </div>
            <div style="padding: 24px; background-color: #f8f9fa; border: 1px solid #e2e8f0;">
              <table style="width: 100%; border-collapse: collapse;">${rowsHtml}</table>
              ${messageBlock}
            </div>
            <div style="padding: 16px; text-align: center; color: #718096; font-size: 12px;">
              <p>This estimate request was submitted via realelitecontracting.com</p>
            </div>
          </div>
        `,
      }),
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.json().catch(() => ({}));
      console.error('Resend API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    // Speed-to-lead SMS — env-gated; no-op (with a debug log) when keys
    // aren't set. Fire-and-forget on a non-blocking promise so a Twilio
    // outage never breaks the lead-capture happy path.
    if (
      TWILIO_ACCOUNT_SID &&
      TWILIO_AUTH_TOKEN &&
      TWILIO_FROM_NUMBER &&
      TWILIO_TO_NUMBER
    ) {
      const isLuxury = (values.service ?? '').startsWith('[Luxury Consultation]');
      const smsBody = [
        isLuxury ? '🔔 LUXURY LEAD' : '🔔 New Lead',
        `${values.fullName} · ${values.service}`,
        values.budgetRange ? `Budget: ${values.budgetRange}` : null,
        values.timeline ? `Timeline: ${values.timeline}` : null,
        values.zip ? `ZIP: ${values.zip}` : null,
        `📞 ${values.phone}`,
        '— Real Elite',
      ]
        .filter(Boolean)
        .join('\n');

      const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
      const twilioAuth = Buffer.from(
        `${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`
      ).toString('base64');

      const twilioForm = new URLSearchParams({
        From: TWILIO_FROM_NUMBER,
        To: TWILIO_TO_NUMBER,
        Body: smsBody,
      });

      fetch(twilioUrl, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${twilioAuth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: twilioForm.toString(),
      })
        .then((res) => {
          if (!res.ok) {
            return res
              .text()
              .then((body) =>
                console.error('Twilio SMS failed', { status: res.status, body })
              );
          }
        })
        .catch((err) => {
          console.error('Twilio SMS network error', err);
        });
    }

    return NextResponse.json(
      { message: 'Estimate request sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Estimate form error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

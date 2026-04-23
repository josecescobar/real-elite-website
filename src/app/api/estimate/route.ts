import { NextResponse } from 'next/server';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const TO_EMAIL = process.env.ESTIMATE_TO_EMAIL || 'info@realelitecontracting.com';

const MAX = { fullName: 100, email: 200, phone: 30, service: 50, message: 2000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[\d\s\-+().]{7,30}$/;

const RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000 };
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimit(ip: string) {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || entry.resetAt < now) {
    hits.set(ip, { count: 1, resetAt: now + RATE_LIMIT.windowMs });
    return { allowed: true, retryAfter: 0 };
  }
  if (entry.count >= RATE_LIMIT.max) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }
  entry.count += 1;
  return { allowed: true, retryAfter: 0 };
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    const limit = rateLimit(ip);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } }
      );
    }

    const body = await request.json();
    const { fullName, email, phone, service, message, website } = body ?? {};

    // Honeypot: silently succeed so bots don't retry
    if (typeof website === 'string' && website.length > 0) {
      return NextResponse.json({ message: 'Estimate request sent successfully' }, { status: 200 });
    }

    const fields = { fullName, email, phone, service, message };
    for (const [key, value] of Object.entries(fields)) {
      if (typeof value !== 'string' || !value.trim()) {
        return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
      }
      if (value.length > MAX[key as keyof typeof MAX]) {
        return NextResponse.json({ error: `${key} is too long` }, { status: 400 });
      }
    }

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }
    if (!PHONE_RE.test(phone)) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
    }

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Email service is not configured' },
        { status: 500 }
      );
    }

    const safe = {
      fullName: escapeHtml(fullName.trim()),
      email: escapeHtml(email.trim()),
      phone: escapeHtml(phone.trim()),
      service: escapeHtml(service.trim()),
      message: escapeHtml(message.trim()).replace(/\n/g, '<br>'),
    };

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Real Elite Contracting <info@realelitecontracting.com>',
        to: [TO_EMAIL],
        subject: `New Estimate Request: ${service.trim()} — ${fullName.trim()}`,
        reply_to: email.trim(),
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #1a365d; padding: 20px; text-align: center;">
              <h1 style="color: #d4a853; margin: 0; font-size: 24px;">New Estimate Request</h1>
            </div>
            <div style="padding: 24px; background-color: #f8f9fa; border: 1px solid #e2e8f0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #1a365d; width: 120px;">Name</td>
                  <td style="padding: 12px 8px; border-bottom: 1px solid #e2e8f0;">${safe.fullName}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #1a365d;">Email</td>
                  <td style="padding: 12px 8px; border-bottom: 1px solid #e2e8f0;"><a href="mailto:${safe.email}">${safe.email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 12px 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #1a365d;">Phone</td>
                  <td style="padding: 12px 8px; border-bottom: 1px solid #e2e8f0;"><a href="tel:${safe.phone}">${safe.phone}</a></td>
                </tr>
                <tr>
                  <td style="padding: 12px 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #1a365d;">Service</td>
                  <td style="padding: 12px 8px; border-bottom: 1px solid #e2e8f0;">${safe.service}</td>
                </tr>
              </table>
              <div style="margin-top: 20px; padding: 16px; background-color: white; border-radius: 8px; border: 1px solid #e2e8f0;">
                <h3 style="color: #1a365d; margin: 0 0 8px 0; font-size: 14px;">Project Details</h3>
                <p style="margin: 0; color: #333; line-height: 1.6;">${safe.message}</p>
              </div>
            </div>
            <div style="padding: 16px; text-align: center; color: #718096; font-size: 12px;">
              <p>This estimate request was submitted via realelitecontracting.com</p>
            </div>
          </div>
        `,
      }),
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.json();
      console.error('Resend API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
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

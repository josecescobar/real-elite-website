import { timingSafeEqual, createHash } from 'crypto';
import { NextResponse } from 'next/server';
import { BUSINESS } from '@/lib/constants';
import { env } from '@/lib/env';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { buildReviewMessage, toE164 } from '@/lib/review-request';
import { draftReviewMessage } from '@/lib/ai-review-message';

/**
 * Review-request SMS — the engine behind /review-request (internal tool).
 *
 * When a job wraps, Jose enters the customer's first name + phone (and,
 * when he has them, the job type / address) and this endpoint texts them
 * a thank-you with the direct Google review link. Consistent review
 * velocity is the main ranking input for the Google map pack, which is
 * where most local contractor searches convert.
 *
 * The text itself is drafted by AI when possible — see ai-review-message.ts
 * — to sound like a specific, personal note from Jose instead of a fixed
 * template, referencing the job/address when given. That draft is
 * validated (must contain the exact review link, must not be absurdly
 * long) and used only if it passes; every other case (AI Gateway unset,
 * the call failing, or a draft that fails validation) falls back to the
 * exact same fixed `buildReviewMessage` template this route always used —
 * this is a real outbound customer text and must never be blocked or
 * degraded by an AI outage. Note: the /review-request tool page's preview
 * shows that fixed template; the text actually sent may read a little
 * warmer/more specific when AI personalization kicks in.
 *
 * Env-gated twice:
 *  - ADMIN_TOOLS_KEY must be set AND match the key sent by the tool
 *    page, or the endpoint refuses to send anything.
 *  - The same three Twilio vars as speed-to-lead must be set
 *    (TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN / TWILIO_FROM_NUMBER).
 *
 * GOOGLE_REVIEW_LINK can override the default profile share link with
 * a direct write-review URL (https://search.google.com/local/writereview?placeid=…).
 */

const ADMIN_TOOLS_KEY = env.adminToolsKey();
const TWILIO_ACCOUNT_SID = env.twilioAccountSid();
const TWILIO_AUTH_TOKEN = env.twilioAuthToken();
const TWILIO_FROM_NUMBER = env.twilioFromNumber();
const REVIEW_LINK = env.googleReviewLink() || BUSINESS.social.google;

const RATE_LIMIT = { max: 30, windowMs: 10 * 60 * 1000 };

/** Constant-time key comparison; hashing first equalizes lengths. */
function keyMatches(provided: string): boolean {
  if (!ADMIN_TOOLS_KEY) return false;
  const a = createHash('sha256').update(provided).digest();
  const b = createHash('sha256').update(ADMIN_TOOLS_KEY).digest();
  return timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limit = await rateLimit(`review:${ip}`, RATE_LIMIT.max, RATE_LIMIT.windowMs);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } }
      );
    }

    if (!ADMIN_TOOLS_KEY) {
      return NextResponse.json(
        { error: 'Tool not configured: set ADMIN_TOOLS_KEY in Vercel env settings.' },
        { status: 503 }
      );
    }

    const body = await request.json().catch(() => null);
    const key = typeof body?.key === 'string' ? body.key : '';
    if (!key || !keyMatches(key)) {
      return NextResponse.json({ error: 'Invalid access key.' }, { status: 401 });
    }

    const firstName =
      typeof body?.firstName === 'string' ? body.firstName.trim() : '';
    if (!firstName || firstName.length > 40) {
      return NextResponse.json({ error: 'Enter the customer’s first name.' }, { status: 400 });
    }

    const phone = typeof body?.phone === 'string' ? toE164(body.phone) : null;
    if (!phone) {
      return NextResponse.json(
        { error: 'Enter a valid US phone number (10 digits).' },
        { status: 400 }
      );
    }

    // Optional context for the AI-personalized draft — plain, best-effort
    // strings; absent/invalid values just mean a more generic (but still
    // AI-warmed, or template) message. Never required to send.
    const jobType =
      typeof body?.jobType === 'string' && body.jobType.trim()
        ? body.jobType.trim().slice(0, 80)
        : undefined;
    const address =
      typeof body?.address === 'string' && body.address.trim()
        ? body.address.trim().slice(0, 100)
        : undefined;

    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM_NUMBER) {
      return NextResponse.json(
        {
          error:
            'Twilio is not configured: set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_FROM_NUMBER (see docs/SPEED_TO_LEAD_SETUP.md).',
        },
        { status: 503 }
      );
    }

    // Unlike speed-to-lead this send is awaited: the person clicking
    // "Send" needs to know whether the text actually went out.
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
    const twilioAuth = Buffer.from(
      `${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`
    ).toString('base64');

    const aiDraft = await draftReviewMessage({
      firstName,
      link: REVIEW_LINK,
      jobType,
      address,
    });
    const messageBody = aiDraft ?? buildReviewMessage(firstName, REVIEW_LINK);

    const res = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${twilioAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        From: TWILIO_FROM_NUMBER,
        To: phone,
        Body: messageBody,
      }).toString(),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      console.error('Review-request SMS failed', { status: res.status, detail });
      return NextResponse.json(
        { error: 'Twilio rejected the message. Check the number and try again.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ message: `Review request sent to ${firstName}.` });
  } catch (err) {
    console.error('Review-request error:', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}

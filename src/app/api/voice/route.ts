import { NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { validateTwilioSignature, webhookUrl, sendSms, twiml, escapeXml } from '@/lib/twilio';
import { callerTextBack, ownerMissedAlert, wasAnswered } from '@/lib/missed-call';

export const runtime = 'nodejs';

/**
 * Missed-call text-back — Twilio Voice webhook.
 *
 * Activation (see docs/MISSED_CALL_TEXTBACK_SETUP.md): point a Twilio
 * number's Voice "A call comes in" webhook at POST /api/voice and route
 * your advertised line to that Twilio number. Until then this route is
 * dormant — nothing calls it.
 *
 * Flow:
 *  1. Inbound call → greet, then <Dial> the owner's cell with an action
 *     callback to this same route.
 *  2. Dial finishes → if the owner didn't answer, text the caller back
 *     ("sorry we missed you") AND alert the owner with the caller's
 *     number so they can return the call.
 *
 * Every request is verified against X-Twilio-Signature first — this is a
 * public endpoint that can send SMS, so an unsigned request is rejected.
 */

const FORWARD_TO =
  env.missedCallForwardNumber() || env.twilioToNumber();
const OWNER_ALERT_TO = env.twilioToNumber();
const DIAL_TIMEOUT = 18; // seconds before we treat the call as missed

export async function POST(request: Request) {
  const authToken = env.twilioAuthToken();
  // Refuse unless FULLY wired. The signature check needs the auth token,
  // and both SMS sends — the caller text-back and the owner alert — need
  // the account SID, the from-number, and the owner number. A partial
  // config would answer the call and dial out but then silently drop the
  // promised text-back, which is worse than not answering at all.
  if (
    !authToken ||
    !env.twilioAccountSid() ||
    !env.twilioFromNumber() ||
    !OWNER_ALERT_TO ||
    !FORWARD_TO
  ) {
    return twiml('<Response><Reject/></Response>', 503);
  }

  // Twilio posts application/x-www-form-urlencoded.
  const form = await request.formData().catch(() => null);
  if (!form) return twiml('<Response><Reject/></Response>', 400);

  const params: Record<string, string> = {};
  for (const [key, value] of form.entries()) {
    if (typeof value === 'string') params[key] = value;
  }

  const valid = validateTwilioSignature({
    authToken,
    signature: request.headers.get('x-twilio-signature'),
    url: webhookUrl(request, '/api/voice'),
    params,
  });
  if (!valid) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
  }

  // Second leg: the <Dial> finished and Twilio is reporting the result.
  if (params.DialCallStatus !== undefined) {
    if (!wasAnswered(params.DialCallStatus)) {
      const caller = params.From;
      if (caller) {
        await Promise.all([
          sendSms(caller, callerTextBack()),
          OWNER_ALERT_TO ? sendSms(OWNER_ALERT_TO, ownerMissedAlert(caller)) : Promise.resolve(false),
        ]);
      }
    }
    // Nothing more to say; end the call cleanly.
    return twiml('<Response></Response>');
  }

  // First leg: inbound call. Greet, then ring the owner's phone.
  const action = escapeXml(webhookUrl(request, '/api/voice'));
  const dialTarget = escapeXml(FORWARD_TO);
  const twilioFromNumber = env.twilioFromNumber();
  const callerId = twilioFromNumber
    ? ` callerId="${escapeXml(twilioFromNumber)}"`
    : '';

  return twiml(
    `<Response>` +
      `<Say voice="Polly.Joanna">Thanks for calling Real Elite Contracting. Please hold while we connect you.</Say>` +
      `<Dial timeout="${DIAL_TIMEOUT}" answerOnBridge="true"${callerId} action="${action}" method="POST">` +
      `<Number>${dialTarget}</Number>` +
      `</Dial>` +
      `</Response>`
  );
}

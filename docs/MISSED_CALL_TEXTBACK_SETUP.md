# Missed-Call Text-Back — Setup

**The first contractor to respond wins ~70% of jobs.** When you're on a
roof and can't pick up, this makes sure the caller still hears from you
within seconds — and you get a nudge to call them back. No more leads
lost to voicemail.

## What happens

1. Someone calls your line.
2. Twilio answers, plays a brief greeting, and rings your cell.
3. **If you pick up** — normal call, nothing else happens.
4. **If you miss it** — the caller instantly gets:
   > Hi, this is Real Elite Contracting — sorry we missed your call!
   > We're likely out on a job site. Reply here with your name and what
   > you need and we'll get right back to you, or call us at
   > (681) 534-5515.

   …and **you** get a text: `📞 Missed call from +1XXXXXXXXXX — call
   them when you're free.`

## Prerequisites

- The same Twilio account/number used for speed-to-lead SMS
  (`TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`,
  `TWILIO_TO_NUMBER` set in Vercel — see `docs/SPEED_TO_LEAD_SETUP.md`).
- A decision about how calls reach Twilio (next section). This is the
  one piece that touches your phone setup.

## Routing your calls through Twilio

The webhook only fires for calls that arrive at a Twilio number. Two ways
to make that happen — pick one:

- **Forward your existing number (no number change).** In your current
  carrier's settings, set "no-answer / busy forwarding" to your Twilio
  number. Callers still dial your real number; only unanswered calls
  spill into the text-back flow. Simplest, fully reversible.
- **Publish a Twilio number as your main line (or port your number into
  Twilio).** Best experience and full control, but it's a bigger change —
  do this only when you're ready.

`MISSED_CALL_FORWARD_NUMBER` is where Twilio rings you (defaults to
`TWILIO_TO_NUMBER`, your cell). It must be **different** from the Twilio
number callers reach, or the call will loop.

## Wire up the webhook (2 minutes)

1. Twilio Console → Phone Numbers → your number → **Voice Configuration**.
2. "A call comes in" → Webhook →
   `https://www.realelitecontracting.com/api/voice` → HTTP **POST**.
3. Save. Place a test call and let it ring out — you should get both
   texts within a few seconds.

## Security

Every request to `/api/voice` is verified against Twilio's
`X-Twilio-Signature` using your auth token, so nobody can spoof the
endpoint to send texts on your dime. Unsigned or tampered requests are
rejected, and the route refuses to run at all until the Twilio env vars
are set. If signature checks ever fail behind a proxy, set
`TWILIO_WEBHOOK_BASE_URL` to your exact public origin.

## Optional next step: two-way replies

The caller's text invites them to reply. To have those replies land on
your phone, add a Messaging webhook that forwards inbound SMS to your
cell — ask to have that built when you want it. Until then, you still get
the missed-call alert with their number, so no lead is lost.

# Speed-to-Lead SMS Setup

**Owner:** Real Elite Contracting · Jose Escobar
**Purpose:** Get an SMS to Jose's phone the second a qualified lead submits the form, so we can respond first and win the job.

---

## Why this matters

The single best-supported finding in contractor lead-conversion research:

> The first contractor to reach a homeowner wins about **70% of jobs**.
> Five-minute response time produces **2–3× higher conversion** than ten-minute response.
> Reactive-only roofers pay **$110+/lead**. Always-on operators pay $45–$75.

If a $250k luxury kitchen lead lands in Jose's inbox at 11:42 AM and he sees it after the 3 PM job-site walk, two other contractors have already called. Email alone loses. **SMS the moment the form submits, and Jose calls back in 90 seconds while he's still standing on the gutter cleat.** That's the difference between a lead and a closed contract.

---

## What is Twilio?

Twilio is the standard SMS-sending service for business apps. It's how every "click here, we'll text you" workflow on the internet works. Pay-as-you-go pricing:

- **~$1.15/month** to rent a phone number (the "from" number)
- **~$0.0083 per SMS sent** in the US
- **No subscription, no commitment** — just pay for what you use

Realistic math: if Real Elite gets 50 leads/month, that's **$1.15 + ($0.0083 × 50) = $1.57/month**. The cost of converting **one extra lead per year** pays for Twilio for the next century.

---

## Setup — about 10 minutes

### 1. Create a Twilio account

1. Go to **https://www.twilio.com/try-twilio**
2. Sign up (email + phone). They'll send you a verification code.
3. Twilio gives you a free **$15 credit** on signup. That's enough to send ~1,800 SMS or run the service for ~9 months at low volume before you ever pay a dime.

### 2. Buy a phone number

1. In the Twilio Console, click **Phone Numbers → Manage → Buy a Number**.
2. Filter by **United States**, capability **SMS**, area code: **304** (West Virginia) or **571** (Northern Virginia) — pick one that fits the Real Elite brand.
3. Click **Buy** on a number you like. About $1.15/month.

This is your **`TWILIO_FROM_NUMBER`** — write it down in `+1XXXXXXXXXX` format.

### 3. Verify Jose's phone (free-trial requirement)

While the account is on the free trial, Twilio only sends SMS to phone numbers you've explicitly verified.

1. In the Console, click **Phone Numbers → Manage → Verified Caller IDs**.
2. Click **Add a new Caller ID** → enter Jose's mobile number.
3. Twilio calls or texts a code. Enter it. Done.

This is your **`TWILIO_TO_NUMBER`** — same `+1XXXXXXXXXX` format.

*(Once you upgrade out of the free trial — adding any payment method does it — you can text any US number without verifying first.)*

### 4. Grab the Account SID and Auth Token

1. Go to the Console home page (**twilio.com/console**).
2. Under **Account Info**, copy:
   - **Account SID** (starts with `AC…`) → this is `TWILIO_ACCOUNT_SID`
   - **Auth Token** (click "View" to reveal) → this is `TWILIO_AUTH_TOKEN`

### 5. Add the four env vars to Vercel

1. Go to **vercel.com → Real Elite project → Settings → Environment Variables**.
2. Add each of these four — set **Production**, **Preview**, and **Development** all checked:

| Variable | Value |
|---|---|
| `TWILIO_ACCOUNT_SID` | `AC...` from step 4 |
| `TWILIO_AUTH_TOKEN` | the auth token from step 4 |
| `TWILIO_FROM_NUMBER` | `+1...` the number you bought in step 2 |
| `TWILIO_TO_NUMBER` | `+1...` Jose's verified number from step 3 |

3. Click **Save**.
4. Trigger a fresh deploy (push any commit, or in Vercel UI click **Deployments → ⋯ → Redeploy** on the most recent build).

### 6. Test it

1. Open https://www.realelitecontracting.com/design-consultation
2. Submit the form with real-ish info — your own name, your own phone.
3. **Jose's phone should buzz within 5 seconds.**

The SMS will look like:

```
🔔 LUXURY LEAD
Jose Escobar · [Luxury Consultation] Kitchen Renovation
Budget: $200k – $500k
Timeline: 3–6 months
ZIP: 22101
📞 (555) 123-4567
— Real Elite
```

---

## How it behaves if a variable is missing

- All four set → SMS fires
- One or more missing → SMS step is silently skipped, email still works
- Twilio API fails (rare) → Error logged to Vercel, email still works

Lead capture is never blocked by SMS problems. That's deliberate.

---

## What this unlocks next

Once SMS is live, two natural follow-ons:

1. **Two-way SMS** — let homeowners text the same number to reach Jose directly. Twilio routes inbound SMS to a webhook; we can forward it to Jose's personal phone.
2. **Pre-built reply templates** — when Jose's slammed, he can text back "RING" to auto-call the lead via Twilio Voice, or "MORN" to schedule a morning call, etc.

Both are 1–2 hour build-outs once the foundation is in place.

---

**Total cost to get speed-to-lead live: ~$1.15 setup + the 10 minutes above. Expected ROI: at least one additional booked project per quarter.**

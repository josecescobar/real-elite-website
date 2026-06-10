# Review Engine — Setup & Daily Use

Google ranks the local map pack mostly on **review count, review
velocity, and recency** — and the map pack is where the majority of
"contractor near me" searches convert. This tool makes asking for a
review a 15-second habit instead of a thing that gets forgotten.

## What it does

After a job wraps, open **realelitecontracting.com/review-request** on
your phone, type the customer's first name and phone number, hit Send.
They get this text from the business Twilio number:

> Hi Sarah, it's Jose with Real Elite Contracting. Thank you for
> trusting us with your project! If you were happy with our work, would
> you take 60 seconds to leave us a quick Google review? It means the
> world to our veteran-owned team: [review link]

The page is not linked anywhere on the site, is excluded from the
sitemap, tells search engines not to index it, and the API behind it
refuses to send anything without the access key.

## One-time setup (≈5 minutes)

1. **Twilio** — already required for speed-to-lead SMS. If
   `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_FROM_NUMBER`
   are set in Vercel, nothing more to do. Otherwise follow
   `docs/SPEED_TO_LEAD_SETUP.md` first.

2. **Access key** — in Vercel → Settings → Environment Variables, add
   `ADMIN_TOOLS_KEY` set to a long random string (a password manager
   generated one is perfect). You'll type it once per device; the tool
   remembers it after the first successful send.

3. **Direct review link (recommended)** — by default the text uses the
   Google profile share link. A *direct write-review* link converts
   better because it opens the review box immediately:
   - Find the Place ID at
     https://developers.google.com/maps/documentation/places/web-service/place-id
     (search "Real Elite Contracting Martinsburg").
   - Set `GOOGLE_REVIEW_LINK` in Vercel to
     `https://search.google.com/local/writereview?placeid=YOUR_PLACE_ID`.

4. Redeploy (Vercel → Deployments → Redeploy) so the env vars load.

## Daily habit

- Send the text **the same day the job closes** — response rates fall
  off a cliff after 48 hours.
- Send to every customer, not just the thrilled ones. (Don't pre-filter
  by asking "were you happy?" first — Google considers review gating a
  policy violation. The message already frames it as optional.)
- Bookmark `/review-request` on your phone's home screen.

## Why this wins the Panhandle

Most local competitors sit at 15–40 reviews with months between them.
At even 4–6 jobs a month with a ~30% review response rate, this adds
15–20 fresh reviews a year — consistent *velocity*, which Google
weights more heavily than a one-time burst. Within 12–18 months that
typically moves a profile into the 3-pack for the big-money searches
("roofing contractor martinsburg wv", "kitchen remodel eastern
panhandle") that the website's organic pages can't reach on their own.

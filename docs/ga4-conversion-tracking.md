# GA4 is not counting your leads — verified 2026-09-17

**Property:** Real Elite Contracting (`529942883`) · one web stream, `G-W9QH965H3Y`, created 2026-03-25.

## The finding

GA4 has three key events configured:

| Key event | Created | Fired by the site? |
| --- | --- | --- |
| `purchase` | 2026-03-25 | no |
| `close_convert_lead` | 2026-03-25 | no |
| `qualify_lead` | 2026-03-25 | no |

All three were created at property setup and are GA4's stock e-commerce /
CRM lead-stage defaults. None of the three appears anywhere in the site's
source. The event the site actually fires on a completed form is
`generate_lead`, and it is **not** marked as a key event.

Consequence: **key events over the 90 days to 2026-09-16 = 0**, across all
channels. The dashboard has been reporting zero conversions the whole time.

## The tracking itself works

Raw event counts, 2026-06-19 → 2026-09-16:

| Event | Count |
| --- | --- |
| `page_view` | 770 |
| `session_start` | 479 |
| `estimate_step_view` | 425 |
| `first_visit` | 399 |
| `user_engagement` | 326 |
| `scroll` | 66 |
| `form_start` (GA4 enhanced measurement) | 10 |
| `estimate_cta_click` | 7 |
| `estimate_step_advance` | 6 |
| `generate_lead` | **3** |
| `form_submit` | 3 |
| `estimate_step_submit` | 3 |
| `phone_click` | 2 |
| `post_lead_click` | 2 |
| `estimate_step_abandon` | 2 |

Three real leads. GA4 counted none of them.

## Fix (2 minutes, and only you can do it)

Read access to GA4 is not write access to GA4 configuration, so this one is
yours:

1. GA4 → **Admin** → **Data display** → **Key events** → **New key event**
2. Type `generate_lead` → Save
3. Repeat for `phone_click`

Typing the name directly is more reliable than the toggle on the Events
list, which only shows events seen in the last 48 hours.

Optional cleanup: `close_convert_lead` and `qualify_lead` are deletable and
will never fire — removing them stops the key-events report filling with
zero rows. `purchase` is a GA4 default and can be left alone.

This is not retroactive. GA4 starts counting from the moment you flip it;
the three leads already banked stay uncounted.

## Two things the numbers actually say

**`estimate_step_view` is not an engagement metric.** It fires when the form
renders, not when someone touches it — 425 views against 6 advances is a
measure of how many pages embed the form, not of drop-off. The
`estimate_step_start` event added on 2026-09-16 fires on first interaction
and is the honest top of that funnel; it postdates this window, so the next
pull is the first that can read it.

**The form is not the problem.** GA4's own `form_start` → `form_submit` is
10 → 3, a 30% completion rate once someone actually begins. The constraint
is upstream: 399 users in 90 days, about 4 a day. Traffic, not conversion.

## Why `phone_click` read 2

Because 34 of the site's 41 phone links fired nothing — every page template
behind the service, city, project, paving and combo pages rendered a bare
`<a href="tel:...">`. Fixed by routing all of them through `PhoneLink`; a
guard test now fails the build if a bare one comes back. Expect this number
to jump, and treat pre-2026-09-17 phone data as a floor, not a count.

---

## Re-verified 2026-09-18 — unchanged, and worse than stated above

Read again a day later against the live property. Nothing has moved, and one
figure above understates the problem:

- The three key events are still `purchase`, `close_convert_lead` and
  `qualify_lead`. Still none of them appear in the site's source.
- The finding above says "key events over the 90 days to 2026-09-16 = 0". The
  true figure is **0 over the property's entire lifetime**, 2026-03-25 →
  2026-09-17, all channels. There has never been a counted conversion on this
  property — not one that lapsed, one that never existed.
- Property health is otherwise clean: one web stream, `G-W9QH965H3Y`, enhanced
  measurement on, **zero configuration issues**, 41 organic sessions and 32
  users in the 48 days to 2026-09-17 at a 56% engagement rate.

That last point is the one worth holding on to: **the tag is fine and the data
is flowing.** This is a two-minute mapping error in the admin UI, not a
tracking implementation problem, and it is the single cheapest unblock
available anywhere in this project.

The baseline that depends on it is frozen in
`docs/phase-5-baseline-2026-09-18.md`. Until this is fixed, the 2026-12-15
Phase 5 read can compare impressions and positions but not leads.

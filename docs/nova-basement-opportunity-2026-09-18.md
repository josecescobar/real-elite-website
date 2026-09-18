# The demand is regional, not municipal — 2026-09-18

**Source:** DataForSEO via OpenSEO, US market, pulled 2026-09-18. Search Console
and Google Ads figures carried from `search-traffic-reality-2026-09-17.md` and
`where-the-demand-actually-is.md`.

This is the brief for the architecture session. It contradicts the altitude the
site is currently built at, so read it before planning pages.

## The finding

| Keyword | Volume/mo | KD | Competition | CPC |
| --- | --- | --- | --- | --- |
| `basement remodeling northern virginia` | 110 | 0 | LOW | $31.11 |
| `basement finishing northern virginia` | 90 | 0 | LOW | $99.19 |
| `basement remodeling fairfax va` | 70 | 0 | LOW | $132.16 |
| `basement remodeling mclean va` | 30 | 0 | LOW | — |

Queried in the same call and returning **no data** — volume below the reporting
floor: `basement finishing vienna va`, `basement finishing reston va`,
`basement finishing great falls va`, `basement finishing ashburn va`,
`basement finishing loudoun county`, `finished basement contractor northern
virginia`.

For scale, from the Ads pull: `basement finishing martinsburg wv` is **10/mo**.

## What that means

**The site is built one level below the demand.** `src/lib/constants.ts` carries
60+ service areas and `service-city-content.ts` carries per-town basement copy
for Vienna, Reston, Great Falls, Clifton, McLean, Alexandria and Burke. Every
one of those town-level basement terms is below the reporting floor. The
searches happen at **region** level — "northern virginia", "fairfax va" — and
the site has no page at that level. Verified: nothing under `src/app` targets
the region.

**The CPC is the strongest signal in any of these audits.** Keyword difficulty
and competition are cheap numbers. $132.16 a click is advertisers pricing the
job behind the click, with their own money, in the most competitive contractor
market in the country. Nobody pays that for a lead worth a Martinsburg basement.

**KD 0 and LOW competition on a $132 CPC is an anomaly worth acting on.** The
usual reading is that the term is underserved: paid demand is real, organic
supply is thin.

## What this does not change

**The local pack is still out of reach, and that is geometry.** The listing has
no street address (`location_address_locality` is null), so it ranks from its
pin. It sits at 0 of 25 grid points around Martinsburg. The Vienna SERP pulled
2026-09-18 puts a local pack in ranks 1–3 — Panorama Remodeling (Vienna),
BasementRemodeling.com (Arlington), My Kitchen and Bath (Vienna) — all
physically in-market. A Fairfax 3-pack cannot be won from an Eastern Panhandle
pin, and the 2026-09-17 service-area rebalance did not cost anything here: those
rankings are organic, which the service area does not touch.

This also means the four free service-area slots are still best spent near the
pin (Berkeley County first). GBP is a local-pack tool; the local pack is bound
to a thin market. **GBP is not the lever for the NoVA money.**

## The Vienna SERP, for page design

Organic ranks under the pack: basementremodeling.com (4), Yelp (5), Facebook
(7), all-renovations.com (8), maxhouseprice.com (9), primecustom.com (10),
bowersdesignbuild.com (11), Angi (12), oakhillbuilding.com (13), Houzz (16).

Two things to take from it:

1. **The page type is right.** Ranks 8, 10 and 13 are competitors' service-area
   pages — the same shape the site already builds.
2. **Five of the top 16 are directories** (Yelp, Facebook, Angi, Houzz,
   BuildZoom). Claiming and completing those profiles is usually cheaper than
   outranking them, and they are how this market's buyers shortlist.
3. Rank 11 is a **project profile** — one finished Vienna basement with photos.
   The repo's project records still carry `TODO(owner)` on city and date, so
   there is no verified NoVA project page to compete with it.

## Open question that gates the content

The existing NoVA pages in `service-city-content.ts` assert: a **written
workmanship warranty**, **one named project lead**, **daily progress photos**,
**clean job site every evening**, a **same-day response standard**, and
timelines of **8–14 weeks** (Vienna, Reston) and **14–22 weeks** (Great Falls).

CLAUDE.md requires owner confirmation for claims about how the business
operates. These have not been confirmed in this session. At Eastern Panhandle
prices an overstatement is survivable; against a $250,000–$350,000 Great Falls
basement it is contract-dispute material. **Confirm or remove before building
more pages on the same template.**

## Recommended build

1. A **Northern Virginia basement** page targeting the regional terms, with
   **Fairfax** beneath it. Not more town pages.
2. Reduce the town pages to internal links into the regional page rather than
   standalone ranking attempts, or leave them and stop adding to them.
3. Verified NoVA project pages with real photos, to compete with rank 11.
4. Directory profiles — Angi, Houzz, Yelp, BuildZoom — as a parallel track.
5. **Consider paid.** At 270 regional searches a month with a $99–$132 CPC, this
   is a market where Google Ads is a legitimate test rather than a substitute
   for ranking. The math is the owner's call, not this document's.

## Measurement is still broken

GA4's **conversion reporting** counts none of this. The three key events
configured are stock defaults the site never fires; `generate_lead` and
`phone_click` are not key events, so key events over 90 days = 0 while the site
fired three leads and two phone clicks. See `ga4-conversion-tracking.md`.
Owner-only fix, two minutes, not retroactive.

Corrected 2026-09-18: this section previously opened "none of the above is
readable until GA4 counts conversions." **Raw event counts are queryable
without the key-event flag** — it governs conversion reporting, not whether an
event is recorded — so the figures above can be read against leads today. The
flag still needs setting for the owner's dashboard and for Ads.

Do this before spending on anything above, or the spend cannot be evaluated.

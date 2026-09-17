# Where the demand actually is — 2026-09-17

Search volumes from Google Ads data via DataForSEO, US, September 2026.

This answers a question the earlier analysis left open: is the demand base small
because the *market* is small, or because the site targets the wrong queries?
It decides whether writing more pages is worth anything.

## The ratio that settles it

| Query | Monthly volume |
| --- | --- |
| `roofers near me` | **165,000** |
| `roofing companies near me` | **165,000** |
| `roofing companies martinsburg wv` | **110** |
| `roofing contractor martinsburg wv` | **10** |
| `roofing charles town wv` | **10** |

**Fifteen hundred to one.** The site is built almost entirely on the right-hand
side of that table.

A "near me" search has no text for a page to match. Google answers it from the
searcher's location and the local pack — which is the Google Business Profile,
not this repository. That is why the profile outranks the website in importance,
stated as a number rather than an opinion.

## The whole home market, measured

Every geo-modified term for the Eastern Panhandle that returned a volume:

| Keyword | Volume | KD |
| --- | --- | --- |
| `handyman martinsburg wv` | 140 | 0 |
| `contractors martinsburg wv` | 110 | 6 |
| `general contractor martinsburg wv` | 110 | 5 |
| `roofing companies martinsburg wv` | 110 | 0 |
| `bathroom remodeling martinsburg wv` | 50 | 1 |
| `roof repair martinsburg wv` | 40 | 16 |
| `deck builder martinsburg wv` | 30 | 0 |
| `home remodeling martinsburg wv` | 20 | — |
| `kitchen remodeling martinsburg wv` | 20 | — |
| `basement finishing martinsburg wv` | 10 | — |
| `roofing contractor martinsburg wv` | 10 | 6 |
| `roofing charles town wv` | 10 | 0 |
| `paving hagerstown md` | 10 | — |
| `paving winchester va` | 10 | — |
| `driveway paving martinsburg wv` | **no record** | — |

Roughly **660 searches a month, across every trade the business does.** Winning
first place on all of it, at a generous 30% CTR, is about 200 visits a month.

That is the ceiling on the query shape this site is built for. The earlier read
— that no amount of on-page work makes this base large — was checked against
this data rather than assumed, and it holds. It is now a measurement instead of
an assertion.

## Where the volume is instead

| Keyword | Volume | KD | CPC |
| --- | --- | --- | --- |
| `gutter installation near me` | 33,100 | 0 | $26.38 |
| `roof replacement cost` | 18,100 | 25 | $19.96 |
| `asphalt driveway cost` | **12,100** | **0** | $7.94 |
| `new roof cost` | 9,900 | 10 | $18.02 |
| `sealcoating near me` | 9,900 | 2 | $10.32 |
| `driveway paving near me` | 8,100 | **1** | $12.71 |
| `driveway sealing near me` | 8,100 | 12 | $8.26 |
| `asphalt paving near me` | 8,100 | 15 | $10.62 |
| `asphalt vs concrete driveway` | 4,400 | 0 | $5.09 |
| `chip seal driveway` | 4,400 | 0 | $9.30 |
| `driveway repair near me` | 4,400 | 0 | $15.70 |
| `storm damage roof repair` | 3,600 | 0 | **$47.01** |
| `basement finishing near me` | 3,600 | 0 | $22.20 |
| `tar and chip driveway` | 2,900 | 0 | $7.60 |

Two shapes, and they need different answers:

**"Near me" terms** — big, transactional, and won in the local pack. Nothing in
this repository competes for them. This is the profile's job.

**Informational terms** — big and genuinely low-difficulty, but national and
early-intent. Worth being honest about what that traffic is: the driveway
comparison guide already wins one of these, and it produces 36% of all site
clicks while scoring the **lowest business value in the whole opportunity
report** — 0.06, on 48% engagement across 29 sessions. More of that traffic is
not obviously more jobs.

## The one clean gap

`asphalt driveway cost` — **12,100 a month, difficulty 0.**

The site already publishes the answer in three places: `$4–$7 per square foot
installed, $4,000–$10,000 typical` appears in the driveways guide's
`seoDescription`, in its body, and in the FAQ on `/paving/driveway-paving`.
Nothing targets the phrase. The adjacent comparison guide already holds
position 4–5 on `chip seal vs asphalt vs concrete` at 10% CTR, so the authority
to rank for it is demonstrably there.

**It belongs on the guide side, not the service page.** The obvious move —
retitling `/paving/driveway-paving` around "cost" — would be a downgrade: that
page's better target is `driveway paving near me`, 8,100 a month at difficulty
1 and **transactional**. Trading a transactional term for an informational one
to chase a bigger number is the wrong trade.

## A caveat on difficulty scores

`storm damage roof repair` reads difficulty **0** on 3,600 searches at a
**$47.01** CPC — the highest-value keyword in the set, and on paper a gift. The
site's own post targets that exact phrase and sits at **position 19.6**.

Difficulty understates competition on terms where national aggregators and
insurance sites hold the results. Do not pick targets on KD alone; check where
the site already sits first.

## Corroboration, incidentally

The opportunity report joins Search Console to GA4 per page. **Every row reads
`keyEvents: 0`** — including the homepage's 25 sessions. Independent
confirmation of `docs/ga4-conversion-tracking.md`: the leads are real and the
dashboard cannot see them.

## What this means

1. **The profile is the growth lever, and the ratio is 1,500:1.** Reviews,
   categories and service area are not housekeeping; they are the strategy.
2. **The organic ceiling for geo-modified terms is ~660 searches a month.** Any
   plan that assumes more from "{service} {town}" pages is assuming demand that
   does not exist.
3. **The informational cluster is real traffic but weak intent.** Worth pursuing
   only with eyes open about what it converts at, which the GA4 fix will finally
   make measurable.
4. **`asphalt driveway cost` is the single best content target available** —
   volume, zero difficulty, an answer already written, and proven ranking
   ability on adjacent terms. As a guide, not by retitling the service page.

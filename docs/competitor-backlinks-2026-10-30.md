# Competitor backlinks — 2026-10-30

**Source:** OpenSEO / DataForSEO Backlinks API, pulled 2026-10-30, `hideSpam`
on, one row per referring domain. Competitors picked from SERP-overlap checks
across 55 money keywords in the Eastern Panhandle, Winchester, Loudoun and
Fairfax, plus five DC-area luxury design-build firms chosen by name.
57 competitors, 8,477 link rows, 5,325 referring domains. Roughly 2,600
OpenSEO credits in total.

The opportunity list is `competitor-backlinks-2026-10-30.csv` beside this
file. It holds 791 referring domains. The 2,213 spam and link-farm domains are
left out, and so are the 2,300 single-competitor domains that nobody reviewed.

## The finding

**Total link count does not separate the leaders. Earned links do.**

| Competitor | Clean referring domains | Earned (awards, press, chambers, certifications) |
| --- | --- | --- |
| casedesign.com (luxury) | 312 | 27 |
| anthonywilder.com (luxury) | 148 | 23 |
| sundesigninc.com (luxury) | 110 | 21 |
| bowa.com (luxury) | 192 | 20 |
| mossbuildinganddesign.com | 259 | 13 |
| fosterremodeling.com (luxury) | 111 | 11 |
| cenvarroofing.com | 329 | 3 |
| adhrinc.com | 273 | 1 |
| valerbuilders.com | 72 | 0 |
| **realelitecontracting.com** | **2** | **0** |

Cenvar and ADHR have more links than BOWA and have almost none of the earned
ones. The links themselves are mostly directories, paid guest posts and
press-release syndication. The luxury firms are set apart by a short list of
sources that only pick firms with finished, photographed, award-quality work.

The site has three referring domains: `findlocalexperts.com`,
`homeservicelookup.com`, and `global-website.pages.dev`, which is a link farm.
That gap is larger than anything a page could close.

## Where the money is (keyword pull, same day)

| Keyword | Volume/mo | CPC | KD |
| --- | --- | --- | --- |
| bathroom remodeling fairfax va | 210 | $111.88 | 0 |
| kitchen remodeling fairfax va | 390 | $54.89 | 11 |
| kitchen remodeling northern virginia | 210 | $97.66 | 0 |
| bathroom remodeling northern virginia | 260 | $61.12 | 0 |
| kitchen remodel ashburn va | 480 | $25.97 | 0 |
| kitchen remodeling frederick md | 140 | $70.05 | 0 |
| roof replacement fairfax va | 70 | $78.43 | 0 |
| deck builder fairfax va | 590 | — | 7 |
| basement remodeling northern virginia | 70 | — | 0 |
| basement remodeling fairfax va | 30 | — | 0 |

Correction to `nova-basement-opportunity-2026-09-18.md`, which reported
`basement remodeling northern virginia` at 110/mo and `basement remodeling
fairfax va` at 70/mo with a $132.16 CPC. The 2026-10-30 pull returns 70 and
30, with no CPC for either. Basements are still a fit, but kitchen and bath
carry the money in Northern Virginia now. That doc is left as written; its
figures were right for the date they were pulled.

## The luxury playbook, by link source

How many of the five luxury firms carry each link (BOWA, Case, Sun Design,
Anthony Wilder, Foster):

| Source | Luxury firms | Others | What earns it |
| --- | --- | --- | --- |
| Northern Virginia Magazine (Best Home Experts + features) | 5/5 | 17 | Selection; editorial features on finished projects |
| Chrysalis Awards | 5/5 | Moss | Submitting photographed projects |
| PRO Mid-Atlantic Remodeler of the Year | 4/5 | Moss, Bowers | Submitting projects |
| NARI Remodeling Done Right / Remodeler of the Year | 3/5 | Bowers | NARI Capital chapter membership + submissions |
| Washingtonian remodeling guide | 3/5 | — | Editorial selection |
| Trade press and podcasts (Pro Remodeler, Remodelers Advantage, Tim Faller Show) | 4/5 | Bowers, Moss | The owner talking about how the business runs |
| Design press (Architectural Digest, Dwell, Homedit, Decoist) | 3–4/5 | a few | Professional project photography that gets picked up |
| Local papers (Connection Newspapers, Tysons Today, Tysons Reporter, Patch) | 3/5 | a few | Local stories, awards announcements |
| ASID design finder, HBA of Virginia | 2/5 | — | Designer partnerships, association membership |

Every row in that table needs finished, photographed projects first. The five
project records in `src/lib/projects/data/` still carry `TODO(owner)` on city
and date, so the portfolio is the gate. Links come after it.

## What is available now, without a portfolio

| Link | Who has it | Needs |
| --- | --- | --- |
| Loudoun County Chamber (two directory hosts, dofollow) | BasementRemodeling.com, Virginia K&B, LDN Decks | Membership |
| Martinsburg–Berkeley County Chamber (three hosts, dofollow) | Minghini's, Mountaineer K&B | Membership |
| Hagerstown / Washington County MD chambers | High Point Roofing | Membership |
| McLean, Arlington, Fauquier chambers | Virginia K&B, Marshall Roofing, others | Membership |
| Trex find-a-builder, CertainTeed profile, cabinetry dealer lists | ProDeck, Winchester Roofing, Mountaineer K&B | Manufacturer certification the owner holds |
| Reveal NoVA, Viva Reston/Tysons best-of, Hometown Guru (Panhandle, Loudoun, Winchester) | 3–8 competitors each | Listing or outreach |
| Willowsford partner page (`strollmag.com`), City Lifestyle | Pond Roofing; BOWA, Velero, Virginia K&B | Community partnership or advertising |
| Local race sponsorship (`runsignup.com`) | Sun Design, Moss, Battlefield Decks | Sponsoring a 5K |

Each of these needs the owner's money, signature or certification. None can be
done from this repo.

## Do not copy

- **Paid press-release syndication.** 278 domains, mostly `signalnews*`,
  `lifestyle.*` and `pressadvantage`. GBC and Valer lean on these heavily, and
  neither has the earned links above.
- **Paid guest posts** on generic "news" and "magazine" sites (SB Builders,
  Cenvar, High Point). SB Builders has 142 clean domains and none of them are
  earned.
- **Link farms.** These are Telegram "darksidelinks"/"quarterlinks" networks,
  2,001 `blogspot` scraper blogs, and `*.pages.dev`/`*.web.app` pages. One of
  them already links to this site.

## Caveats

- One row per referring domain, capped at 400 per competitor. BOWA, Case,
  BasementRemodeling.com, Fairfax K&B, Moss, GBC, Virginia K&B and Cenvar have
  more referring domains than that, so their lowest-rank domains are missing.
  The earned sources rank high and are not affected.
- Palmer Construction (`palmerconstruction.net`) is a Pennsylvania commercial
  firm that ranks for one Martinsburg query. It is not a real competitor.
- Categories come from domain-pattern rules. The CSV's `review: other` rows
  (301) have not been looked at.
- Mighty Dog Roofing (franchise) and lead-gen and directory sites were
  excluded as targets. Their links come from the brand, not the market.

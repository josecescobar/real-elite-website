# Loudoun planning guides source check, September 27, 2026

These are the next three pieces from `AI-SHARED/ventures/LOUDOUN-SEO-CONTENT-PLAN.md`, items 1–3 in its "Ten pieces to publish next" list. Each one links to the six PR #165 guides and does not repeat their tables. Branch `content/loudoun-next-three-2026-09`, based on `origin/main` at `6c8e149`. PRs #167 and #169 were open, and none of the files they change is touched here.

The six PR #165 guides, and the slug each of these three articles links:

| Guide | Slug |
|---|---|
| Kitchen remodel cost | `kitchen-remodel-cost-loudoun-county-2026` |
| Primary bathroom cost | `primary-bathroom-remodel-cost-loudoun-county-2026` |
| Basement remodeling cost | `basement-remodeling-cost-ashburn-leesburg-2026` |
| Home addition cost | `home-addition-cost-loudoun-county-2026` |
| Covered patio and outdoor living cost | `covered-patio-outdoor-living-cost-loudoun-county-2026` |
| HOA approval | `hoa-approval-remodels-brambleton-lansdowne-ashburn-farm-2026` |

The covered-patio guide is linked from the closing paragraph of each article. The other five are linked in the body where the topic comes up, and again from the closing when that article had not already named them.

## How answer-block citations render

The three `answer:` blocks cite with markdown links. `GuideTemplate` used to print `post.answer` as plain text, so those links would have stayed as raw markdown. The change is `AnswerText`: it turns `[label](https://…)` and `[label](/…)` in that one paragraph into anchors, and leaves every other answer block as plain text. Body citations stay ordinary markdown, which MDX already renders as links.

All source pages were opened on September 27, 2026. "Verified" means the publisher prints the figure or rule for the scope described. It does not mean an independent audit, a Loudoun average, or a Real Elite quote.

| Article | Slug | Target keyword |
|---|---|---|
| Basement Bathroom and Egress in Ashburn and Leesburg (2026) | `basement-bathroom-egress-ashburn-leesburg-2026` | `basement bathroom cost` |
| How Long a Kitchen Remodel Takes in Ashburn and Leesburg (2026) | `kitchen-remodel-timeline-ashburn-leesburg-2026` | `kitchen remodel ashburn va` |
| A Basement In-Law Suite or a Home Addition in Loudoun County (2026) | `basement-in-law-suite-vs-home-addition-loudoun-county-2026` | `in law suite addition cost` |

## Cost figures

| Figure used | Source | Notes |
|---|---|---|
| Basement bath: $10,000–$18,000 half bath, $18,000–$30,000 full bath with shower, $25,000–$40,000 with tub. Egress about $2,500–$5,000 per window. "For any legal bedroom below grade, an egress window is required." | [Mayflower Virginia](https://mayflowerva.com/blog/how-much-does-a-basement-remodel-cost-in-northern-virginia/), published July 9, 2026 | Labeled as one Northern Virginia contractor's ranges. |
| Adding a bathroom in a basement: $10,000–$60,000 | [Fixr](https://www.fixr.com/costs/bathroom-addition), updated January 22, 2026 | National. |
| Ejector pump: $850–$3,500, average $2,300 | [HomeAdvisor](https://www.homeadvisor.com/cost/plumbing/install-ejector-pump/), updated June 20, 2026 | National. |
| Egress window: $2,723–$5,877, most around $4,229. Window well $500–$1,000, excavation $1,500–$3,000 per window | [HomeAdvisor](https://www.homeadvisor.com/cost/doors-and-windows/install-egress-windows/), updated June 17, 2026 | The same page also shows a $4,244 average, and its title says "2025 Data". The article uses the "most homeowners" figure. HomeAdvisor's basement page gives $200–$950 per egress window, which contradicts this page, so that figure is not used. |
| Main-level bedroom and bath suite, 400–600 sq ft: $180,000–$350,000. Garage conversion $60,000–$130,000. Basement finish, 800–1,200 sq ft: $60,000–$180,000. Appraisal note. | [EA Home Design](https://eahomedesign.com/home-additions-loudoun-county/), dated August 22, 2026 | The table says the prices include design, engineering, permits, and inspections. The same page also gives $150,000–$300,000 for "a main level family room or bedroom suite." The article quotes the table row and points out the inconsistency. |
| $225–$275/sq ft to convert a basement, attic, or garage. About $300/sq ft for an addition. | [Denny + Gardner](https://www.dennyandgardner.com/blog/in-law-suite-cost-northern-va), dated July 3, 2021 | Labeled as a 2021 figure about Fairfax and D.C. Its value claim is attributed to them, not repeated as fact. |

No range was built by combining sources. No Loudoun average, ROI percentage, or per-square-foot basement-with-bath rate is published.

## Durations (kitchen article)

Real Elite has not confirmed any job durations (see `CLAUDE.md` and `src/lib/claims.ts`, `active-work-timeline`), so every duration names its publisher. The durations were checked against the fetched page text on September 27.

- [EA Home Design 2026 NoVA kitchen guide](https://eahomedesign.com/how-much-does-a-kitchen-remodel-cost-in-northern-virginia-2026-price-guide/), June 13, 2026:
  - 6 to 12 weeks from demolition to completion.
  - Phases: design 2 to 6 weeks, permitting 1 to 4 weeks, demolition 2 to 4 days, rough-in 1 to 2 weeks, cabinets and counters 2 to 4 weeks, finishes 1 to 2 weeks, punch list a few days.
  - "order them early."
- [Denny + Gardner kitchen timeline](https://www.dennyandgardner.com/blog/kitchen-remodel-timeline-virginia-and-dc), September 18, 2022:
  - 6 to 8 weeks for construction when components are replaced in place.
  - 10 to 12 weeks for a layout change.
  - 4 to 8 weeks of planning before that.
- [Fixr](https://www.fixr.com/articles/how-long-does-a-kitchen-remodel-take), January 13, 2025:
  - 6 to 12 weeks for an average remodel.
  - 3 to 8 months with structural, plumbing, or custom-cabinet work.
  - Cabinet lead times: stock, one to two weeks for delivery; semi-custom, four to eight weeks; custom, three to six months or longer.
- [Cambria](https://www.cambriausa.com/cambria-style/blog/cambria-quartz-countertop-installation), no date shown: fabrication takes approximately two weeks, and installation two to five hours.
- [Loudoun residential permits dashboard](https://www.loudoun.gov/6084/Residential-Permits-Processing-Dashboard), "Timelines" tab:
  - Alteration: building review 15 days, zoning 10 days. Trades: 2 days.
  - The page does not say whether these are business or calendar days, so the article says it doesn't.
  - Intake: up to ten business days for other residential permits.

All three articles were run through `claimsFoundIn()` from `src/lib/claims.ts` and return no operational-claim matches.

## Rules and permits

- [Loudoun Finished Basements](https://www.loudoun.gov/1172/Finished-Basements):
  - When typical details may be used instead of plans, and the exclusion for bearing walls, exterior walls, beams, and posts.
  - What full plans must show for bedroom egress: sill height, opening size, and window well size.
  - Fees: 1% of construction cost excluding trades, $65 minimum, plus $130 plan review.
  - $165 zoning fee for a personal kitchen.
  - A plumbing permit for all plumbing fixtures, and separate electrical, gas, and mechanical permits.
  - Town zoning for property inside a town.
- [Loudoun Typical Finished Basement Details](http://www.loudoun.gov/DocumentCenter/View/897), footer dated 04.16.2025:
  - Sleeping rooms need an escape or rescue opening: 24 in minimum clear height, 20 in minimum width, 44 in maximum sill height.
  - Ceilings: 7 ft minimum for habitable space, with lower clearances under projections and in baths and halls.
  - Bath exhaust fan unless there is 3 sq ft of openable window.
  - Showers at least 30 × 30 in.
  - **Discrepancy:** the drawing labels the net clear opening as 5 sq ft, while Fairfax's 2021 VRC detail lists 5.7 sq ft. The article states both, says to plan to the larger figure, and says to confirm with the Loudoun reviewer. The ceiling text in the PDF reads "6"-8"", probably a typo for 6'-8", so the article gives no exact figure for those areas.
- [Fairfax County Typical Finished Basement Details](https://www.fairfaxcounty.gov/landdevelopment/sites/landdevelopment/files/assets/documents/pdf/publications/basement-details.pdf), "Based on the 2021 Virginia Residential Code", version 7/14/2024:
  - 5.7 sq ft opening, 44 in sill.
  - Window well of at least 9 sq ft, and a ladder when the well is deeper than 44 in.
  - Escape opening required in basements of houses built after October 1, 2003, and in all basement bedrooms.
  - Used as a Virginia code reference. The article says it is Fairfax's document and asks readers to confirm the Loudoun application.
- [Virginia DHCD](https://www.dhcd.virginia.gov/codes): the 2021 USBC has been effective since January 18, 2024.
- [Loudoun permit FAQ](https://www.loudoun.gov/FAQ.aspx?QID=1464): a contractor must be properly licensed to obtain a permit, and the owner signs the application.
- [Loudoun Residential Additions and Alterations](https://www.loudoun.gov/5387/Residential-Additions-and-Alterations):
  - Alteration fee: 1% plus $130.
  - Addition fees: $395 up to 1,000 sq ft; above that, 1% plus $335 and county zoning.
  - Plat required for additions, and structural plans.
  - Separate trade permits, and gas plans review from October 1, 2025.
  - Screened porches count as additions.
  - Health Department approval for adding a bedroom on well and septic.
  - Town zoning for property inside a town.
- [Loudoun Health Clearances](https://www.loudoun.gov/5770/Health-Clearances): $25 clearance fee per application reviewed.
- [Loudoun Zoning Ordinance](https://www.loudoun.gov/1755/Zoning-Ordinance): adopted and effective December 13, 2023, and does not apply inside the seven incorporated towns.
- [Zoning Ordinance text](https://online.encodeplus.com/regs/loudouncounty-va-zo/), §4.02.01 Accessory Dwellings:
  - Size caps: suburban 50% or 1,200 sq ft; transition, rural, and JLMA 70% or 2,500 sq ft.
  - Health Department approval on individual sewage systems.
  - One accessory dwelling on a lot under 20 acres.
  - May be inside the main structure. An attached one follows the main structure's yard rules.
  - Also: the Table 7.06.02-1 parking minimum of 1 per dwelling unit, the §3.03.C.6 same-ownership rule, and the Ch. 12 definition of a dwelling unit. No owner-occupancy or separate-entrance rule was found, and the article says so rather than asserting either.
- [Loudoun Affordable Dwelling Unit Program](https://www.loudoun.gov/1813/Affordable-Dwelling-Unit-Program): "ADU" means the county's affordable housing program.
- [Loudoun County Historic Districts](https://www.loudoun.gov/2370/County-Historic-Districts) and [Certificate of Appropriateness](https://www.loudoun.gov/5163/Certificate-Of-Appropriateness): most exterior changes in Aldie need HDRC review. A CAPP does not issue a zoning permit automatically, and it lapses if work does not begin within five years.
- [Purcellville Permits and Applications](https://www.purcellvilleva.gov/1174/Permits-and-Applications) and [Purcellville FAQ](https://purcellvilleva.gov/FAQ.aspx?QID=66):
  - A town zoning permit is required before the county building permit.
  - A finished basement also needs a residential occupancy permit with an inspection, and a basement backflow statement.
- [Middleburg Planning & Zoning](https://www.middleburgva.gov/179/Planning-Zoning): a Zoning Location Permit for work that needs a county building permit.
- [Town of Leesburg Community Development FAQs](https://www.leesburgva.gov/departments/community-development/community-development-faqs):
  - A town zoning permit is required for almost any construction, including interior alterations such as finishing a basement or remodeling a kitchen, with a drawing that need not be professionally prepared.
  - The county reviews the building code for the town.
  - BAR review applies in the H-1 and H-2 districts.
  - **Access note:** leesburgva.gov returned HTTP 403 to automated fetches. The text was read from the Wayback Machine copy dated July 16, 2026 (`web.archive.org/web/20260716194429/…`). Recheck it on the live page before merging.
- [Virginia USBC §108.2](https://law.lis.virginia.gov/admincode/title13/agency5/chapter63/section80/): no permit for replacing cabinetry or trim, floor finishes, paint, or plumbing fixtures without altering the piping. Items 14.2, 14.7, 14.9, and 14.10. §108.1 requires a permit for adding or removing walls, water supply work, and wiring. Countertops are not listed, and the article says so.
- [18VAC50-22-30](https://law.lis.virginia.gov/admincode/title18/agency50/chapter22/section30/): HIC covers improvements to existing dwellings. It excludes electrical, plumbing, HVAC, and gas fitting, and "new construction functions beyond the existing building structure" other than certain decks, patios, driveways, and outbuildings. [18VAC50-22-20](https://law.lis.virginia.gov/admincode/title18/agency50/chapter22/section20/): RBC covers construction of dwellings.

## Inline citations added for repeated claims

Each figure below was already in the source list above. The link is the citation a reader sees. No new Real Elite project, history, founding-year, tenure, headcount, or veteran-owned wording was added.

| Claim | Where | Source linked |
|---|---|---|
| 6 to 12 weeks from demolition, plus 2 to 6 weeks of design and 1 to 4 weeks of permitting | Kitchen answer | [EA Home Design 2026 NoVA kitchen guide](https://eahomedesign.com/how-much-does-a-kitchen-remodel-cost-in-northern-virginia-2026-price-guide/) |
| Custom cabinets, three to six months | Kitchen answer | [Fixr kitchen timeline](https://www.fixr.com/articles/how-long-does-a-kitchen-remodel-take) |
| Stock, semi-custom, and custom cabinet lead times | Kitchen body, cabinet section | Same Fixr page |
| Half bath $10,000–$18,000, full bath with shower $18,000–$30,000, with tub $25,000–$40,000, egress about $2,500–$5,000 | Basement-bath answer | [Mayflower Virginia](https://mayflowerva.com/blog/how-much-does-a-basement-remodel-cost-in-northern-virginia/) |
| Basement bedroom needs a compliant emergency escape opening | Basement-bath answer, and the egress-dimension section | [Loudoun typical finished basement details](http://www.loudoun.gov/DocumentCenter/View/897) |
| New plumbing fixtures need a plumbing permit | Basement-bath answer | [Loudoun Finished Basements](https://www.loudoun.gov/1172/Finished-Basements) |
| Main-level suite $180,000–$350,000; basement finish $60,000–$180,000 | In-law answer | [EA Home Design Loudoun additions](https://eahomedesign.com/home-additions-loudoun-county/) |
| A new wing needs a plat, setbacks, and possibly Health Department review | In-law answer, and the septic-bedroom FAQ | [Loudoun Residential Additions and Alterations](https://www.loudoun.gov/5387/Residential-Additions-and-Alterations) |
| A new wing needs a contractor licensed for new construction | In-law answer | [18VAC50-22-30](https://law.lis.virginia.gov/admincode/title18/agency50/chapter22/section30/) |
| Basement permit fee 1% excluding trades, $65 minimum, plus $130 plan review | In-law body, after the kitchen-fee bullet | [Loudoun Finished Basements](https://www.loudoun.gov/1172/Finished-Basements) |
| A dwelling unit is defined by independent cooking, sanitation, and sleeping | In-law FAQ | [Zoning ordinance text](https://online.encodeplus.com/regs/loudouncounty-va-zo/) |
| $165 zoning fee for a personal kitchen | In-law FAQ | [Loudoun Finished Basements](https://www.loudoun.gov/1172/Finished-Basements) |

## License statement

The in-law article states "Virginia Class A contractor license 2705198604 with the HIC specialty." That matches `CONTRACTOR_LICENSES` in `src/lib/claims.ts` and `AI-SHARED/VENTURES.md` ("VA Class A 2705198604, specialty HIC only (residential), exp 2028-06-30"). The article says HIC fits work inside an existing house, and that a new wing needs a contractor whose classification covers new construction. It does not present an addition or a second story as Real Elite's own build. It also repeats the existing statement that Real Elite does not take electrical work. No WV license detail is used. There is no Maryland content.

## Left out for lack of a source

- The grade-floor 5.0 sq ft egress exception (seen only in a search snippet) and the text of VRC R305 and R310 themselves (codes.iccsafe.org returned 403). The county handouts are cited instead.
- Angi, HomeGuide, This Old House, and the HomeAdvisor kitchen timeline figures (all blocked or not found).
- A Leesburg zoning review time, and a Loudoun list of work that needs no permit.
- Any Real Elite duration, project, photo, review, award, or resale percentage.

## Images

No Real Elite photo exists for a finished basement bath, a kitchen, or an addition. `docs/PROJECT-PHOTO-SOURCES-2026-09-27.md` on `feat/projects-better-images` says the owner still needs to supply these. The only real bath photos are from a Frederick, MD job, which would be wrong on a Loudoun article. Each article therefore uses a new typographic cover in `public/images/guides/`: navy ground, a grid, the title, and "Real Elite Contracting". They were drawn with ImageMagick. They are not photographs, not stock, and not AI imagery. There are no inline images.

## Syndication

`/rss.xml` and the sitemap both build from `getAllPosts()` and the app routes, as set up in PR #165. The new posts appear automatically, and no config change is needed.

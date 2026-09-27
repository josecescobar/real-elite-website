# Loudoun guide editorial source check — September 27, 2026

REA-77 publishes edited versions of the six drafts in `AI-SHARED/ventures/blog-drafts` on `content/loudoun-cost-guides`, based on freshly fetched `origin/main` at `729a5c6`. The original drafts remain untouched. Source pages were opened and read on September 27, 2026.

## Cost verification

All retained dollar figures and fee percentages, including the answer blocks, were checked against the pages linked beside them. “Verified” here means the cited publisher actually prints the figure for the described scope; it does not mean independently audited transaction data or a Real Elite quote.

| Article | Retained cost evidence | Editorial treatment |
|---|---|---|
| Kitchen | [HomeAdvisor](https://www.homeadvisor.com/cost/kitchens/remodel-a-kitchen/), headline and Total Kitchen Makeover section; [Four Seasons](https://www.4seasonshome.com/resources/the-dmv-home-renovation-roi-report-2025-data-driven-insights-on-the-upgrades-that-maximize-property-value), kitchen section | Kept national headline/makeover figures and two attributed regional benchmarks. Disclosed source's 2025 heading versus June 2026 update. Removed component-cost catalogue, extrapolated local premiums, and ROI claims. |
| Primary bath | [Boss Design Center](https://bossdesigncenter.com/bathroom-remodeling-cost-dc-metro-area/), Cost by Bathroom Type table | Kept only the primary-bath row. Preserved its Northwest DC/Montgomery County geography. Removed secondhand Fixr/Angi/Remodeling numbers, fixture catalogue, and resale claims. |
| Basement | [Mayflower Virginia](https://mayflowerva.com/blog/how-much-does-a-basement-remodel-cost-in-northern-virginia/), tier table and bathroom example; [Denny + Gardner](https://www.dennyandgardner.com/blog/basement-remodel-cost-northern-va), overall range | Kept attributed tiers and separate example. Removed the draft's incorrect implication that its per-square-foot starting range equals the bathroom example. Removed component catalogue and unsupported assertion that different egress prices necessarily describe different scopes. |
| Addition | [EA Home Design](https://eahomedesign.com/home-additions-loudoun-county/), Types of Home Additions table | Kept five relevant project ranges, with publisher's stated inclusions. Removed generalized site/septic adders, construction schedules, generic setbacks, and categorical extra-cost assumptions. |
| Outdoor living | [Four Seasons](https://www.4seasonshome.com/resources/the-dmv-home-renovation-roi-report-2025-data-driven-insights-on-the-upgrades-that-maximize-property-value), Porches & Decks/Sunrooms; [EA Home Design](https://eahomedesign.com/home-additions-loudoun-county/), sunroom row | Kept attributed project benchmarks. Explicitly rejected inferring a covered-patio range between unrelated deck and enclosed-room scopes. Removed ROI and unrelated pool costs. |
| HOA | No dollar figure retained | Removed contractor-supplied association review-time guesses and all duplicated county cost tables. |

## Permit and association sources

- [Loudoun additions and alterations](https://www.loudoun.gov/5387/Residential-Additions-and-Alterations): checked addition and alteration fee formulas, the inclusive addition size boundary, separate trade permits, town zoning, and Health Department requirements. Fee lists stay with their relevant articles instead of being repeated throughout the series.
- [Loudoun finished basements](https://www.loudoun.gov/1172/Finished-Basements): checked the fee exclusions/minimum, plan-review addition, personal-kitchen zoning charge, and typical-detail limitations. Bedroom copy asks for a compliant escape assessment rather than making an unconditional window-only code claim.
- [Loudoun decks](https://www.loudoun.gov/1166/Decks): checked fees for decks strictly below the size threshold outside towns; distinguished these from the addition threshold. Roofed-patio classification must be confirmed from its design.
- [Loudoun fee payment guidance](https://www.loudoun.gov/5126/Fee-Schedules): current intake-payment wording differs from the basement page. Article flags the discrepancy and directs readers to their application instructions.
- [Brambleton Design Review](https://brambletonhoa.com/252/Design-Review): verified exterior-review scope, deadline, meeting convention, and decision-letter interval. No approval guarantee.
- [Ashburn Farm resale guidance](https://www.ashburnfarmassociation.org/resalepacket): official confirmation of the exterior alteration approval requirement. Resale fees and timing are explicitly not presented as architectural-review fees/timing.
- [Lansdowne on the Potomac](https://lansdownehoa.com/) and [Lansdowne Village Greens document portal](https://lvghoa.frontsteps.com/public/folders/Yet5rrWbtnDGDcqE5o7zaeAssMtfj3Dqswrr): distinct associations; no invented common palette, fee, or calendar.

## Publishing choices

Preserved the existing frontmatter fields, draft slugs, category/type conventions, author, date, and existing image paths. Used native Markdown cost lists because the existing MDX renderer does not enable pipe tables. Shortened answer blocks to the established direct-answer format. Each article links to `/investment`, `/design-consultation`, relevant services, and town pages. No new project, review, credential, warranty, staffing, or construction-duration claim is introduced. Electrical work is explicitly outside Real Elite's scope.

The fetched site had no RSS route. Added static `/rss.xml` using the same `getAllPosts()` source as the site, canonical production article URLs, XML escaping, publication dates, and global feed discovery. The feed itself is excluded from the HTML sitemap. Tests cover the feed's corpus, dates, canonical URLs, and reserved-character round trips.

## Verification

Final command results and preview handoff are recorded on REA-77. The required gates are `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`, and `npm run test:built`; `gitleaks git --log-opts='origin/main..HEAD'` must pass before the branch push.

Local verification completed:

- `npm run typecheck`: passed.
- `npm run lint`: passed; three existing `no-img-element` warnings in test fixtures.
- `npm test`: 51 files, 813 tests passed, including RSS and source claims tests.
- `npm run build`: passed; final content rebuilt after replacing unsupported Markdown pipe tables with native lists. Two existing dynamic-filesystem tracing warnings in `src/lib/sales/store/memory.ts` remain.
- `npm run test:built`: 19 passed, one intentionally skipped snapshot-update test. Includes retracted-claim and internal-link checks.
- Parsed generated sitemap and RSS: all six article URLs present, each once in RSS; feed has all 37 published articles. Feed discovery appears in all six built articles.
- Playwright at 390 × 844 against the final local production build: all six article responses were 200; no horizontal document overflow, no broken visible images, and cost lists rendered. `/rss.xml` returned 200 with `application/rss+xml`.

The full-site browser audit is additional scope; its result and branch secret-scan result are recorded in the task's final handoff rather than inferred from these checks.

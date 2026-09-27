# REA-55 — Trust and claims audit

Date: 2026-09-27. Handoff: local branch `feat/luxury-claims` in `Real-Elite/real-elite-website-claims`. No push, merge, or deployment.

The supplied task facts and Jose's board comment `59567b88-735e-4421-a02e-f471706aa905` are the evidence for published credentials. This audit does not represent a fresh government-license lookup. Canonical shared profiles and the two Loudoun research briefs were read; the newer task and board instructions take precedence over older approved marketing language.

| Claim | Where | Action taken |
| --- | --- | --- |
| 40+ years / combined experience | Audited source, editorial content, built pages | No current published tenure claim found. Added a regression ban; no combined-experience figure invented. |
| GAF Master Elite / manufacturer certification | Roofing city copy; capability and veterans pages | Removed badge names, including unnecessary denial copy. Product-brand references remain product choices, not certifications. |
| SDVOSB / Certified VOSB | Veterans title, keywords, capability copy, schema | Removed SDVOSB from the title and certification-oriented keywords; removed pending certification from the schema award field. Existing in-progress language is explicitly pending. |
| Veteran-owned | Shared trust surfaces | Retained the user-authorized business description. No owner's personal identity or specific Virginia veteran-program certification published. |
| SAM.gov registration | Capability statement and veterans page | Published Jose's confirmed wording: Registered in SAM.gov (UEI UZPDY2HUR9, CAGE 21N7T2). |
| NAICS classifications | Capability statement and veterans page | Primary 236220; additional 238160, 238320, 238330, 238990, 236118. Removed unsupported older codes. Registration does not establish veteran certification or broaden state license specialties. |
| WV and VA contractor credentials | Footer, About, shared trust bullets | Added exact disclosure: WV Contractor License WV062432 · Virginia Class A Contractor 2705198604 (HIC). VA HIC described as residential. |
| Maryland licensing | Shared components, area/service templates, paving copy, metadata, blogs, estimate email, sales draft, llms.txt | Removed direct and indirect MD licensing claims. Frederick remains a service-area reference; the template no longer derives licensing from a location's state. |
| Commercial paving authorization from VA HIC | Paving FAQ and location copy | Removed blanket licensed-to-pave answer; require project scope and actual paving-contractor credentials to be established. |
| Workers' compensation | Shared and standalone licensing FAQs | Removed unsupported coverage claim; retained the supplied general-liability fact and a request for current documents. |
| Best Contractor 2024 / Martinsburg Chamber / Top-Rated on Google | Audited source, editorial content, built pages | No current published award or Google-ranking claim found. Added regression bans. |
| Most trusted / five-star social preview | Global metadata, business tagline, blog footer, old social-card asset | Replaced the superlative. Metadata uses the existing generated OG card; the old `/images/og-image.jpg` URL redirects to it with 301. The old file is retained, not deleted. |
| Universal warranty, daily updates/photos, named lead, same-crew and fixed response-time promises | Home, About, process, FAQs, consultation, shared templates, services, city copy and blog marketing paragraphs | Retracted recurring unsupported promises; replaced them with scope, supervision, communication, and coverage questions to settle in the project agreement. Reduced source inventories instead of enlarging allowlists. |
| Fixed active-work durations | Service/city marketing and perimeter package | Removed registered recurring duration promises; schedules depend on scope, approvals, materials, trades, and weather. General editorial planning discussion is distinguished from a company delivery commitment. |
| Established designer/architect relationships and in-house engineering | Consultation, service and city copy | Removed unsupported history and in-house engineering claims; ask the client to bring plans and establish professional responsibilities. |
| Six completed case studies | Project data and public portfolio queries | All six records held as drafts. Five explicitly contain placeholder city/date notes; the sixth is an exemplary system record without corroborating job evidence. Old URLs 301 to `/projects`; source and photography remain intact. |
| Three testimonial quotes and their displayed average | Review corpus, homepage, reviews page, project pages | Retained drafts; withheld publication until source and consent evidence are recorded. Removed the unsourced aggregate display. Google profile link remains. No review/rating schema emitted. |
| `/about.html` | Next redirects | Changed the existing 308 redirect to the requested HTTP 301 pointing to `/about`. |
| Hagerstown service area | Existing catalog and redirects | Already retired in the starting branch. Preserved that state. |

## Needs Jose to confirm before reinstatement or expansion

- Which veteran program the company is enrolled in (SBA VetCert, Virginia SWaM, DVS, or another program), its exact status, and approval documentation. SAM registration is confirmed; veteran certification is a separate question.
- Any substantiated combined trade tenure, manufacturer credentials, awards, rankings, or third-party badges.
- Current license documents, qualifier identity, insurance certificates, and any broader specialties or paving-partner qualifications. Do not imply a Maryland license or commercial authority from residential HIC.
- Written warranty terms, manufacturer registration responsibilities, staffing/crew continuity, update cadence, response commitments, and scheduling evidence before those promises return.
- Actual designer/architect/engineer relationships and responsibility for each professional service.
- Real job locations, completion dates, scope, budgets, durations, and permission for each of the six held project records.
- Source and customer publication permission for the three held testimonial quotes.
- Any lender relationship and approved financing terms before adding a lender endorsement or specific company financing offer. Existing general planning material is not proof of a lending partnership.

These are evidence requirements for future publication, not follow-up issues or blockers to this removal task.

## Verification

Final command results and rendered-claim inventory counts are recorded below before handoff. The production build uses Next's webpack backend because the runner rejects Turbopack's CSS-worker port binding. Configured Google Fonts require network access. No environment-file contents were read or copied.

- `npm ci --cache "$PAPERCLIP_RUN_SCRATCH_DIR/npm-cache" --fetch-retries=0 --fetch-timeout=30000`: passed; 579 packages installed, zero reported vulnerabilities.
- `npm run build -- --webpack`: passed, including generated routes and sitemap. The default Turbopack invocation hit the runner's port-binding restriction; no application workaround was committed.
- `npm run typecheck`: passed.
- `npm run lint`: passed with three existing `next/no-img-element` warnings in test mocks.
- `npm test -- --maxWorkers=2`: 49 files, 793 tests passed. Limiting workers avoided a timeout while another worktree was also running its suite.
- `UPDATE_CLAIM_PAGES=1 npm run test:built -- --maxWorkers=2`, followed by `npm run test:built -- --maxWorkers=2`: passed; final run 19 passed, one intentionally skipped snapshot-update test.
- Built route manifest confirms `/about.html` → `/about` is 301, the obsolete social-image redirect is 301, and all six held case-study URLs redirect to `/projects` with 301.
- The rendered register fell from 550 claim/route pairs to 3, with no newly introduced claim routes. All retracted credential/ranking categories and the six recurring warranty/staffing/communication categories are empty. The three retained matches are general editorial timing estimates in the Frederick basement guide, Frederick permits/costs guide, and spring deck guide; they remain explicitly inventoried rather than being silently marked verified.
- Rendered tests confirm the SAM identifiers and all six NAICS codes on both requested pages, the license numbers on Home/About, no certification in page titles, no published case-study routes, and no review/aggregate-rating schema.
- `git diff --check`: passed. Source changes stayed inside the assigned worktree; no environment-file contents read, no git identity/config changes, and no push.

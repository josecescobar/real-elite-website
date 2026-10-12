# SEO round 15: top luxury ZIP service gaps and sources

Audited against fetched `origin/main` at `8c1f208` on 2026-10-11. The repo's `CONTENT` keys and generated sitemap are the publication checks; the earlier candidates file predates recent merges. Six services were checked for every requested town. `Present` means an authored service key exists at `/services/<service>/<slug>` on the baseline. All ten named towns already have area pages, so this round adds no area page.

| Town (slug) | Kitchens | Bathrooms | Basements | Additions | Decks | Outdoor living |
|---|---|---|---|---|---|---|
| Fairfax Station 22039 (`fairfax-station-va`) | Present | Present | Present | Present | Present | Present |
| Oakton 22124 (`oakton-va`) | Present | Present | Present | Present | Present | Present |
| Clifton 20124 (`clifton-va`) | Present | Present | Present | Present | Present | Present |
| Fort Hunt 22308 (`fort-hunt-va`) | Present | Present | Present | **Missing → added** | **Missing → added** | **Missing → added** |
| Dunn Loring 22027 (`dunn-loring-va`) | Present | Present | Present | Present | Present | Present |
| Clarksville 21029 (`clarksville-md`) | Present | Present | Present | Present | Present | Present |
| Potomac (`potomac-md`) | Present | Present | Present | Present | Present | Present |
| McLean (`mclean-va`) | Present | Present | Present | Present | Present | Present |
| Great Falls, VA (`great-falls-va`) | Present | Present | Present | Present | Present | Present |
| Bethesda (`bethesda-md`) | Present | Present | Present | Present | Present | Present |

Only three of the 60 requested service combinations were absent on the baseline, so the 16-page cap leaves 13 unused slots. Clarksville additions, decks, and outdoor living arrived in round 14. The Clifton and Fairfax Station kitchen, bathroom, and basement `CONTENT` keys also exist on this baseline, while the task's retirement note describes an older state; this round leaves all existing keys and redirects untouched. No Middleburg, Burke, or Brambleton page was added. Great Falls refers to the Virginia service area.

## Official jurisdiction and permit sources checked

| Towns / new-page sentence supported | Official page opened 2026-10-11 | Basis |
|---|---|---|
| Fort Hunt: Alexandria mailing name does not set permit jurisdiction | [City of Alexandria, determining city residence](https://alexandriava.gov/taxes/tax-guide-for-new-city-residents) | The city explicitly notes that some Alexandria postal addresses are in Fairfax County; 22308 is not listed among ZIPs wholly within the city. A [Fairfax County parcel report for a Fort Hunt Road 22308 address](https://www.fairfaxcounty.gov/gisapps/ParcelInfoReportJade/ParcelInfoReport.aspx?ParcelID=1112030011) confirms the local example. Confirm each actual job parcel. |
| Fort Hunt additions: county building office and online filing | [Fairfax County LDS residential addition/alteration guide](https://www.fairfaxcounty.gov/landdevelopment/permit-library/addition-alteration-residential) | LDS identifies additions as residential work and directs applicants to the PLUS Building tab. |
| Fort Hunt decks: county residential addition permit | [Fairfax County LDS permit-required guide](https://www.fairfaxcounty.gov/landdevelopment/when-permit-required) and [residential addition/alteration guide](https://www.fairfaxcounty.gov/landdevelopment/permit-library/addition-alteration-residential) | A new deck is within the county's new-addition permit guidance and is a distinct addition/alteration work type. |
| Fort Hunt screened porches and sunrooms: county residential addition review | [Fairfax County LDS permit-required guide](https://www.fairfaxcounty.gov/landdevelopment/when-permit-required) and [residential addition/alteration guide](https://www.fairfaxcounty.gov/landdevelopment/permit-library/addition-alteration-residential) | Both are named in the county's residential addition guidance. Scope and site conditions must be reviewed by parcel. |
| Fairfax Station, Oakton, Clifton-area, Dunn Loring, McLean, Great Falls: unincorporated parcel route | [Fairfax County LDS residential addition/alteration guide](https://www.fairfaxcounty.gov/landdevelopment/permit-library/addition-alteration-residential) | LDS handles building permits for Fairfax County parcels; place names and ZIPs do not substitute for checking the property record. |
| Incorporated Town of Clifton exception | [Town of Clifton FAQ](https://www.cliftonva.gov/town_administration/faqs.php) | Inside town limits, the town describes use and architectural approvals before the Fairfax County building permit. The exact town approvals depend on the project and parcel. |
| Incorporated Town of Vienna exception for any Oakton or Dunn Loring parcel actually inside town limits | [Town of Vienna residential projects](https://www.viennava.gov/Town-Departments/Planning-Zoning/Permits-Applications/Residential-Projects) | Town residential review can apply to additions, decks and related work; Fairfax County remains building official. Check the parcel boundary first. |
| Clarksville | [Howard County Department of Inspections, Licenses and Permits](https://www.howardcountymd.gov/inspections-licenses-permits) | DILP processes county construction permits. Its three exterior service pages already exist. |
| Potomac and Bethesda; potential incorporated Montgomery municipalities | [Montgomery County DPS municipalities page](https://www.montgomerycountymd.gov/department-permitting-services/homeowners/municipalities-page) | County building permits can coexist with municipal requirements in places including Chevy Chase, Somerset, and Glen Echo; apply municipal review only after parcel verification. The county page was indexed by search but direct page open was restricted by its robots policy on this audit, so no new customer copy relies on its details. |
| A parcel actually within the City of Alexandria | [City of Alexandria permits](https://www.alexandriava.gov/Permits) | City permitting applies by city jurisdiction. The new Fort Hunt pages discuss Fairfax County parcels; the city route remains a parcel-specific exception rather than a claim about all Alexandria mailing addresses. |

The three new pages paraphrase these sources and avoid government review checklists in customer copy. No driving route, travel time, census figure, license caveat, estimate fee, or unverified job photo was added.

## Verification

The production build generated 507 unique sitemap URLs, consistent with 504 baseline URLs plus three Fort Hunt service pages. Each of the three new `/services/.../fort-hunt-va` URLs occurs once. A sentence comparison of new string literals against all authored TypeScript/TSX strings in `src` and all Markdown/MDX in `content` found 41 new sentences of at least 35 normalized characters, zero repeats among the new sentences, and zero matches in the existing corpus. The new metadata titles are distinct and 39–40 characters, under `TITLE_MAX = 60`.

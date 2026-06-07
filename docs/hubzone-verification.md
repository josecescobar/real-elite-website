# HUBZone Status — Verification Notes

**Owner:** Real Elite Contracting LLC
**HQ Address:** Martinsburg, WV 25401 (Berkeley County)
**Date checked:** May 2026
**Status:** **UNVERIFIED — requires manual address lookup**

---

## Why this is unverified

The SBA HUBZone map (https://maps.certify.sba.gov/hubzone/map) is an interactive JavaScript application. Address-level qualification cannot be confirmed without manually entering the exact street address into the map. Web scraping and search-engine queries do not return tract-level designations.

## What we know from open research

1. **HUBZone map last refreshed July 1, 2023.** Designations stay in force until **July 1, 2028.**
2. **Redesignated Areas expire July 1, 2026.** If Real Elite's HQ tract is currently a Redesignated Area, qualification ends this summer unless other criteria (Qualified Non-Metropolitan County, Indian Reservation, BRAC, Governor-Designated, Qualified Disaster Area) still apply.
3. **Berkeley County, WV is part of the Hagerstown–Martinsburg, MD–WV Metropolitan Statistical Area.** Berkeley County is therefore generally **NOT** eligible under the "Qualified Non-Metropolitan County" criterion alone — qualification, if any, must come via Qualified Census Tract, Indian Reservation, BRAC, Governor-Designated, or Qualified Disaster Area criteria.
4. **Some West Virginia census tracts qualify.** The WV Department of Commerce maintains a HUBZone reference page at https://commerce.wv.gov/hubzones/ (blocked automated fetch — manually accessible).

## The actual qualification value

If Real Elite's HQ census tract **is** HUBZone-qualified:
- **+10% price evaluation preference** on federal contracts where the SDVOSB or HUBZone set-aside competition allows
- Eligibility for **HUBZone-only set-asides** (a distinct lane from SDVOSB)
- Both certifications can be held simultaneously — they stack

If Real Elite's HQ census tract **is not** qualified:
- The HQ would need to relocate to a qualified tract (impractical short-term)
- OR Real Elite can pursue HUBZone via the Governor-Designated Covered Area path if applicable
- The SDVOSB application remains the primary federal-track lever regardless

## Manual verification steps (15 minutes, one-time)

1. Visit https://maps.certify.sba.gov/hubzone/map
2. Enter the exact street address of Real Elite's HQ in Martinsburg
3. The map will color-code the result:
   - **Yellow** = Qualified Census Tract (good)
   - **Olive/dark yellow** = Redesignated Area (qualifies until July 1, 2026, then expires)
   - **Green** = Qualified Non-Metropolitan County
   - **Other colors** = check legend
   - **Uncolored** = NOT qualified
4. Screenshot the result + the legend
5. Save to `/docs/hubzone-status-confirmed.md` with the date checked
6. If qualified, ALSO check the **35% employee residency** requirement — at least 35% of employees must live in any HUBZone (not necessarily the same one as the HQ). For a small crew this is usually easy in the Eastern Panhandle.

## Tertiary fallback paths if HQ doesn't qualify

| Path | Lever | Effort | Realistic timeline |
|---|---|---|---|
| Move HQ to qualified tract | Relocation | High | 6–12 mo |
| Pursue Governor-Designated Covered Area | WV Governor application | Medium | 3–6 mo |
| Wait for July 2028 redesignation cycle | Time | Low | 2+ yr |
| Skip HUBZone, lean on SDVOSB | Single-track federal | Low | Active |

## Recommendation

Do the 15-minute manual map check **before** investing further in HUBZone-specific applications. If qualified, file the HUBZone application alongside SDVOSB. If not qualified, SDVOSB + SAM.gov + state veteran preferences remain the strongest federal-track stack and HUBZone can be revisited in 2028.

---

**Action owner:** Jose Escobar — 15-min manual lookup
**Next action:** screenshot result + update this file with confirmed status

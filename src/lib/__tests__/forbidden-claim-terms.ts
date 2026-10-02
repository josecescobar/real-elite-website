/**
 * Validation-only detectors for retracted certification and ownership claims.
 *
 * These strings must not be imported from application code. Next bundles every
 * module reachable from a page, and the release gate rejects a production
 * build that still contains the matcher literals. `npm test` imports this
 * module and applies the same patterns to source and built HTML.
 */
import type { OperationalClaim } from '@/lib/claims';

const emptyInventory = {
  comboKeys: [],
  serviceSlugs: [],
  templates: [],
} as const;

export const FORBIDDEN_VETERAN_CLAIMS: readonly OperationalClaim[] = [
  {
    id: 'unsupported-veteran-certification',
    label: 'Certification must not be represented as awarded',
    example: 'Certified VOSB',
    status: 'unconfirmed',
    note: 'Withdrawn by REA-55; require owner-supplied substantiation before publication.',
    patterns: [/certified (?:SDVOSB|VOSB)/i, /(?:SDVOSB|VOSB)[- ]certified/i],
    publishedIn: emptyInventory,
  },
  {
    id: 'unsupported-veteran-ownership',
    label: 'Veteran-owned status is not documented, and no VOSB or SDVOSB certification is held',
    example: 'veteran-owned',
    status: 'unconfirmed',
    note: 'Jose, 2026-09-28: family-run by brothers Jose and Miguel; Miguel is a U.S. military veteran; ownership split undocumented; no federal veteran certification is held. Do not publish an award that is not on file.',
    patterns: [/veteran[-\s]owned/i, /\bVOSBs?\b/i, /\bSDVOSBs?\b/i, /vetcert/i, /service-disabled/i],
    publishedIn: emptyInventory,
  },
  {
    id: 'unsupported-military-award',
    label: 'No military award is documented for publication',
    example: 'Purple Heart recipient',
    status: 'unconfirmed',
    note: 'Withdrawn pending owner-supplied substantiation. The family sentence may say Miguel is a U.S. military veteran.',
    patterns: [/Purple Heart/i],
    publishedIn: emptyInventory,
  },
  {
    id: 'unpublished-virginia-license-number',
    label: 'The Virginia license number is not published',
    example: 'Virginia Class A 2705198604',
    status: 'unconfirmed',
    note: 'The number was previously treated as owner-confirmed. This audit withholds it until Jose approves publication. Do not restate it in public copy.',
    patterns: [/2705198604/],
    publishedIn: emptyInventory,
  },
  {
    id: 'unsupported-directory-badges',
    label: 'BBB and Angi accreditation badges are not verified',
    example: 'BBB Accredited',
    status: 'unconfirmed',
    note: 'Both badges previously rendered with a null href. Removed from the public badge list.',
    patterns: [/BBB Accredited/i, /Angi Certified/i, /quality guaranteed/i],
    publishedIn: emptyInventory,
  },
  {
    id: 'unsupported-emergency-response',
    label: 'No standing emergency or after-hours response is documented',
    example: 'emergency tarping',
    status: 'unconfirmed',
    note: 'Does not match educational phrases such as emergency egress or an emergency fund.',
    patterns: [/emergency tarping/i, /standing emergency response/i, /24\/7 (?:emergency|service|availability)/i],
    publishedIn: emptyInventory,
  },
];

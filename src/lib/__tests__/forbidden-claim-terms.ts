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
    note: 'Jose, 2026-09-28: family-run by brothers Jose and Miguel; Miguel is a Purple Heart veteran; ownership split undocumented; no federal veteran certification is held.',
    patterns: [/veteran[-\s]owned/i, /\bVOSBs?\b/i, /\bSDVOSBs?\b/i, /vetcert/i, /service-disabled/i],
    publishedIn: emptyInventory,
  },
];

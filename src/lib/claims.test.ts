import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {
  OPERATIONAL_CLAIMS,
  UNCONFIRMED_CLAIMS,
  GUARDED_TEMPLATES,
  claimsFoundIn,
  type OperationalClaim,
} from '@/lib/claims';
import { CONTENT } from '@/lib/service-city-content';
import { SERVICE_DATA } from '@/lib/services-data';

/**
 * The guard described in src/lib/claims.ts. It is a RATCHET: green on the copy
 * that exists today, red the moment a new page, service or template inherits
 * an operational promise the owner has not confirmed.
 *
 * Read the header of src/lib/claims.ts before changing anything here. In
 * particular, the fix for a failure is never to add the new location to
 * `publishedIn` — that defeats the guard. It is either to remove the claim
 * from the new copy, or to get the claim confirmed and mark it 'verified'.
 */

/** Every combo key whose serialized content matches the claim. */
function comboKeysWith(claim: OperationalClaim): string[] {
  return Object.entries(CONTENT)
    .filter(([, entry]) => claim.patterns.some((p) => p.test(JSON.stringify(entry))))
    .map(([key]) => key);
}

/** Every service slug whose serialized data matches the claim. */
function serviceSlugsWith(claim: OperationalClaim): string[] {
  return Object.entries(SERVICE_DATA)
    .filter(([, entry]) => claim.patterns.some((p) => p.test(JSON.stringify(entry))))
    .map(([slug]) => slug);
}

const TEMPLATE_SOURCE = new Map<string, string>(
  GUARDED_TEMPLATES.map((rel) => [rel, fs.readFileSync(path.join(process.cwd(), rel), 'utf8')])
);

const howToFix =
  'Do NOT add it to publishedIn — that disables the guard. Either remove the claim from the new copy, or get the owner to confirm it and set status: "verified". See the header of src/lib/claims.ts.';

describe('operational claims register', () => {
  it('has unique ids and a plain-language label for every claim', () => {
    const ids = OPERATIONAL_CLAIMS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const claim of OPERATIONAL_CLAIMS) {
      expect(claim.id, 'claim id should be kebab-case').toMatch(/^[a-z0-9-]+$/);
      expect(claim.label.trim().length, claim.id).toBeGreaterThan(0);
      expect(claim.patterns.length, `${claim.id} has no detection patterns`).toBeGreaterThan(0);
    }
  });

  /**
   * Keeps the inventory from rotting into a list of keys that no longer exist,
   * which would quietly turn the ratchet into a no-op for that claim.
   */
  it('records only combo keys and service slugs that actually exist', () => {
    for (const claim of OPERATIONAL_CLAIMS) {
      for (const key of claim.publishedIn.comboKeys) {
        expect(CONTENT, `${claim.id} records unknown combo key "${key}"`).toHaveProperty(key);
      }
      for (const slug of claim.publishedIn.serviceSlugs) {
        expect(SERVICE_DATA, `${claim.id} records unknown service "${slug}"`).toHaveProperty(slug);
      }
      for (const rel of claim.publishedIn.templates) {
        expect(
          GUARDED_TEMPLATES as readonly string[],
          `${claim.id} records template "${rel}", which the guard does not watch`
        ).toContain(rel);
      }
    }
  });

  /**
   * A confirmed claim may appear anywhere, so its inventory is meaningless and
   * would go stale unnoticed. Emptying it is part of confirming the claim.
   */
  it('leaves no inventory behind on a claim marked verified', () => {
    for (const claim of OPERATIONAL_CLAIMS) {
      if (claim.status !== 'verified') continue;
      expect(claim.publishedIn.comboKeys, `${claim.id} is verified but still inventoried`).toEqual([]);
      expect(claim.publishedIn.serviceSlugs, `${claim.id} is verified but still inventoried`).toEqual([]);
      expect(claim.publishedIn.templates, `${claim.id} is verified but still inventoried`).toEqual([]);
    }
  });
});

describe('unconfirmed claims do not spread', () => {
  it.each(UNCONFIRMED_CLAIMS.map((c) => [c.id, c] as const))(
    '%s stays inside the service+city pages that already carry it',
    (_id, claim) => {
      const allowed = new Set(claim.publishedIn.comboKeys);
      const added = comboKeysWith(claim).filter((key) => !allowed.has(key));
      expect(
        added,
        `Unconfirmed claim "${claim.id}" (${claim.label}) appeared on new service+city page(s): ${added.join(', ')}. ${howToFix}`
      ).toEqual([]);
    }
  );

  it.each(UNCONFIRMED_CLAIMS.map((c) => [c.id, c] as const))(
    '%s stays inside the service pages that already carry it',
    (_id, claim) => {
      const allowed = new Set(claim.publishedIn.serviceSlugs);
      const added = serviceSlugsWith(claim).filter((slug) => !allowed.has(slug));
      expect(
        added,
        `Unconfirmed claim "${claim.id}" (${claim.label}) appeared on new service page(s): ${added.join(', ')}. ${howToFix}`
      ).toEqual([]);
    }
  );

  /**
   * The two templates are watched at file level because each wraps dozens of
   * pages: a claim added to either one lands on every market at once.
   */
  it.each(GUARDED_TEMPLATES.map((rel) => [rel] as const))(
    '%s gains no unconfirmed claim it did not already make',
    (rel) => {
      const source = TEMPLATE_SOURCE.get(rel)!;
      const found = claimsFoundIn(source)
        .filter((c) => c.status === 'unconfirmed')
        .filter((c) => !c.publishedIn.templates.includes(rel))
        .map((c) => c.id);
      expect(
        found,
        `Template ${rel} now makes unconfirmed claim(s) ${found.join(', ')} across every page it renders. ${howToFix}`
      ).toEqual([]);
    }
  );
});

describe('the altitude doc’s §9 worklist', () => {
  /**
   * Not a behavioural assertion — a visible count. The altitude recommendation
   * gates its Northern Virginia pages on the owner ruling on these claims, and
   * this makes the size of the outstanding decision impossible to lose track
   * of. Drop this test once every claim is resolved.
   */
  it('still has claims awaiting an owner decision', () => {
    const outstanding = UNCONFIRMED_CLAIMS.map((c) => c.id);
    expect(outstanding.length).toBe(7);
    expect(outstanding).toEqual([
      'written-workmanship-warranty',
      'named-project-lead',
      'daily-progress-photos',
      'daily-updates',
      'clean-job-site',
      'same-day-response',
      'active-work-timeline',
    ]);
  });
});

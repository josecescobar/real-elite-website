import { describe, it, expect } from 'vitest';
import { trustBullets, selectTrustBullets } from '@/lib/trust-bullets';
import { claimsFoundIn } from '@/lib/claims';
import { ALL_SERVICE_AREAS, getServiceArea } from '@/lib/constants';
import { CONTENT, unconfirmedClaimIdsInCombo } from '@/lib/service-city-content';

/**
 * Tests `selectTrustBullets` — the function the route actually calls.
 *
 * ## What the previous version of this file got wrong
 *
 * It replayed the route's filter and asserted on the replay. Codex found two
 * faults, both verified before this rewrite:
 *
 *   1. The central assertion was VACUOUS BY CONSTRUCTION. It computed
 *      `renders = claims.every(present)` and `introduced = claims.filter(absent)`
 *      and failed on `renders && introduced.length` — which cannot both hold.
 *      The test could not fail for any input.
 *   2. Even written correctly, a replay says nothing about the route. Changing
 *      the route's filter from `every` to `some` left the whole file green.
 *      Confirmed by doing exactly that.
 *
 * That is the sixth "assertion weaker than its name" in this feature and the
 * worst of them, because an unfalsifiable test reads as coverage.
 *
 * ## How this version avoids it
 *
 * The rule now lives in `trust-bullets.ts` and the route only calls it, so
 * there is one implementation to test. And the assertions run OUTPUT → REGISTER
 * → page copy: take the strings the selector returned, ask `claimsFoundIn`
 * what claims they publish, and require the page's own copy to already make
 * each one. Nothing here re-derives the predicate, so weakening it fails here.
 */

/** The claim ids a bullet's text actually publishes, per the register. */
function claimsPublishedBy(text: string): string[] {
  return claimsFoundIn(text)
    .filter((c) => c.status === 'unconfirmed')
    .map((c) => c.id)
    .sort();
}

const SAMPLE = trustBullets('McLean', 'Bathroom Remodeling', 'VA');

describe('trust bullet claim annotations', () => {
  /**
   * The annotations are the rule's input and are hand-written, so they are
   * checked against the register rather than trusted. An annotation that
   * UNDERSTATES a bullet would wave it onto a page that must not carry it.
   */
  it.each(SAMPLE.map((b, i) => [i, b] as const))(
    'bullet %i annotates exactly the unconfirmed claims its text makes',
    (_i, bullet) => {
      expect(
        [...bullet.claims].sort(),
        `annotation drifted from the register for: "${bullet.text}"`
      ).toEqual(claimsPublishedBy(bullet.text));
    }
  );

  it('keeps the verified licensing bullet claim-free so it always publishes', () => {
    const licensing = SAMPLE.find((b) => b.text.startsWith('Licensed and insured'));
    expect(licensing, 'the licensing bullet went missing').toBeDefined();
    expect(licensing!.claims).toEqual([]);
    expect(claimsPublishedBy(licensing!.text)).toEqual([]);
  });

  it('covers all four claims the block is known to publish', () => {
    expect(SAMPLE.flatMap((b) => b.claims).sort()).toEqual(
      ['clean-job-site', 'daily-updates', 'named-project-lead', 'written-workmanship-warranty'].sort()
    );
  });

  it('has a bullet carrying two claims, which is why the rule uses every()', () => {
    expect(SAMPLE.some((b) => b.claims.length > 1)).toBe(true);
  });
});

describe('selectTrustBullets', () => {
  /**
   * THE load-bearing assertion, and the one the previous version faked.
   *
   * For every premium combo, every claim published by every string the
   * selector returned must already appear in that page's own copy. It reads
   * the selector's output and consults the register — it does not reconstruct
   * the filter — so `some` in place of `every`, or no filter at all, fails
   * here, naming the page and the claim.
   */
  it('never publishes a claim a premium page does not already make', () => {
    const offenders: string[] = [];

    for (const key of Object.keys(CONTENT)) {
      const area = ALL_SERVICE_AREAS.find((a) => key.endsWith(`-${a.slug}`));
      if (!area || area.market !== 'premium') continue;
      const serviceSlug = key.slice(0, key.length - area.slug.length - 1);
      const own = new Set(unconfirmedClaimIdsInCombo(serviceSlug, area.slug));

      for (const text of selectTrustBullets(area, serviceSlug, 'Bathroom Remodeling')) {
        for (const id of claimsPublishedBy(text)) {
          if (!own.has(id)) offenders.push(`${key} publishes "${id}" via: ${text}`);
        }
      }
    }

    expect(offenders, offenders.join('; ')).toEqual([]);
  });

  /**
   * The new-page boundary, which is the rule's whole remaining purpose. The
   * regional page's copy was written clean, so it must receive only the
   * verified licensing line.
   */
  it('gives the regional page only the verified licensing line', () => {
    const region = getServiceArea('northern-virginia')!;
    const rendered = selectTrustBullets(region, 'basements', 'Basement Finishing');

    expect(rendered).toHaveLength(1);
    expect(rendered[0]).toContain('Licensed and insured');
  });

  /**
   * The case that refuted the any-claim predicate: copy carrying
   * `active-work-timeline` and none of the block's four.
   */
  it('gives a page carrying only an unrelated claim the licensing line only', () => {
    const ashburn = getServiceArea('ashburn-va')!;
    expect(unconfirmedClaimIdsInCombo('bathrooms', 'ashburn-va')).toContain('active-work-timeline');

    const rendered = selectTrustBullets(ashburn, 'bathrooms', 'Bathroom Remodeling');
    expect(rendered).toHaveLength(1);
    expect(rendered[0]).toContain('Licensed and insured');
  });

  /**
   * The home market is unchanged by any of this, which is the other half of
   * "reduces exposure where it can, changes nothing where it cannot".
   */
  it('publishes every bullet on the home market', () => {
    const martinsburg = getServiceArea('martinsburg-wv')!;
    expect(martinsburg.market).toBe('home');
    expect(selectTrustBullets(martinsburg, 'roofing', 'Roofing')).toHaveLength(4);
  });

  /**
   * A premium page whose copy does make the claims keeps its bullets. Without
   * this, the rule could satisfy every other test by returning the licensing
   * line and nothing else on all premium pages — which is the over-broad gate
   * that two earlier rounds removed.
   */
  it('keeps the bullets a premium page already earns', () => {
    const mclean = getServiceArea('mclean-va')!;
    const rendered = selectTrustBullets(mclean, 'bathrooms', 'Bathroom Remodeling');

    expect(rendered.length).toBeGreaterThan(1);
    expect(rendered.some((t) => t.includes('named project lead'))).toBe(true);
  });
});

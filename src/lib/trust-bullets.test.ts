import { describe, it, expect } from 'vitest';
import { trustBullets } from '@/app/services/[service]/[city]/page';
import { claimsFoundIn } from '@/lib/claims';
import { ALL_SERVICE_AREAS } from '@/lib/constants';
import { CONTENT, unconfirmedClaimIdsInCombo } from '@/lib/service-city-content';

/**
 * The combo template gates each trust bullet on the claims that bullet would
 * introduce, using the `claims` annotation beside its text. Those annotations
 * are hand-written, so they can drift from the register's own patterns — and an
 * annotation that UNDERSTATES a bullet waves it onto a page that should not
 * carry it. That is worse than having no gate, because the gate is then a
 * false assurance.
 *
 * So the annotations are checked against `claimsFoundIn` rather than trusted.
 */
const SAMPLE = trustBullets('McLean', 'Bathroom Remodeling', 'VA');

/** The four claims the block publishes, per the register. */
const BULLET_CLAIMS = [
  'named-project-lead',
  'daily-updates',
  'clean-job-site',
  'written-workmanship-warranty',
];

describe('trust bullet claim annotations', () => {
  it.each(SAMPLE.map((b, i) => [i, b] as const))(
    'bullet %i annotates exactly the unconfirmed claims its text makes',
    (_i, bullet) => {
      const detected = claimsFoundIn(bullet.text)
        .filter((c) => c.status === 'unconfirmed')
        .map((c) => c.id)
        .sort();
      expect(
        [...bullet.claims].sort(),
        `annotation drifted from the register for: "${bullet.text}"`
      ).toEqual(detected);
    }
  );

  it('keeps the verified licensing bullet claim-free so it always renders', () => {
    const licensing = SAMPLE.find((b) => b.text.startsWith('Licensed and insured'));
    expect(licensing, 'the licensing bullet went missing').toBeDefined();
    expect(licensing!.claims).toEqual([]);
    expect(claimsFoundIn(licensing!.text).filter((c) => c.status === 'unconfirmed')).toEqual([]);
  });

  it('covers all four claims the block is known to publish', () => {
    const annotated = SAMPLE.flatMap((b) => b.claims).sort();
    expect(annotated).toEqual([...BULLET_CLAIMS].sort());
  });

  /**
   * A bullet carrying two claims must need BOTH already present: half its copy
   * being pre-existing does not license the other half. Pinned because
   * collapsing it to `some` would silently reopen the hole.
   */
  it('has a bullet carrying two claims, which is why the gate uses every()', () => {
    expect(SAMPLE.some((b) => b.claims.length > 1)).toBe(true);
  });
});

describe('the gate the annotations feed', () => {
  /**
   * Replays the route's filter over every premium combo, so the invariant that
   * matters is asserted rather than reasoned about: no premium page is handed
   * a bullet whose claims its own copy does not already make.
   *
   * This is the assertion whose absence let two earlier predicates ship. The
   * first two rounds were argued, not measured.
   */
  it('never hands a premium page a claim its own copy does not already make', () => {
    const offenders: string[] = [];

    for (const key of Object.keys(CONTENT)) {
      const area = ALL_SERVICE_AREAS.find((a) => key.endsWith(`-${a.slug}`));
      if (!area || area.market !== 'premium') continue;
      const service = key.slice(0, key.length - area.slug.length - 1);
      const own = new Set(unconfirmedClaimIdsInCombo(service, area.slug));

      for (const bullet of trustBullets(area.city, 'Bathroom Remodeling', area.state)) {
        const renders = bullet.claims.every((id) => own.has(id));
        const introduced = bullet.claims.filter((id) => !own.has(id));
        if (renders && introduced.length) {
          offenders.push(`${key} would be handed ${introduced.join(', ')}`);
        }
      }
    }

    expect(offenders, offenders.join('; ')).toEqual([]);
  });

  /**
   * The new-page boundary, stated as a test rather than as a comment. The
   * regional page's copy is clean, so it must receive no claim-bearing bullet
   * at all — only the verified licensing line.
   */
  it('gives the regional page only the verified licensing line', () => {
    const own = new Set(unconfirmedClaimIdsInCombo('basements', 'northern-virginia'));
    const rendered = trustBullets('Northern Virginia', 'Basement Finishing', 'VA')
      .filter((b) => b.claims.every((id) => own.has(id)))
      .map((b) => b.text);

    expect(rendered).toHaveLength(1);
    expect(rendered[0]).toContain('Licensed and insured');
  });

  /**
   * The case that refuted the previous predicate. bathrooms-ashburn-va carries
   * `active-work-timeline` and none of the block's four, so it must get the
   * licensing line only — under the any-claim predicate it got all four.
   */
  it('gives a page carrying only an unrelated claim the licensing line only', () => {
    const own = new Set(unconfirmedClaimIdsInCombo('bathrooms', 'ashburn-va'));
    expect(own.has('active-work-timeline')).toBe(true);

    const rendered = trustBullets('Ashburn', 'Bathroom Remodeling', 'VA')
      .filter((b) => b.claims.every((id) => own.has(id)))
      .map((b) => b.text);

    expect(rendered).toHaveLength(1);
    expect(rendered[0]).toContain('Licensed and insured');
  });
});

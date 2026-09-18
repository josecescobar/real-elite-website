import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { runtimeTextOfFile } from '@/lib/runtime-text';
import {
  OPERATIONAL_CLAIMS,
  UNCONFIRMED_CLAIMS,
  GUARDED_TEMPLATES,
  UNGUARDED_CLAIM_SOURCES,
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

/**
 * RUNTIME text per guarded file — string literals, template spans and JSX
 * text — NOT raw source.
 *
 * It was raw source, and that made both guards unsound: a COMMENT mentioning a
 * claim counted as publishing it. `CityPageTemplate.tsx`'s own docblock
 * explaining the gate contains "named project lead", "daily updates / clean
 * job site" and "written workmanship warranty", so removing the rendered
 * strings from that file would have left its inventory entries passing and the
 * retraction worklist wrong — the precise failure the inventory guard below
 * was written to catch, reintroduced by the comment I wrote to explain it.
 * Codex found it on #148.
 *
 * See src/lib/runtime-text.ts for why this uses the TypeScript AST rather than
 * stripping comments with a regex.
 */
const TEMPLATE_SOURCE = new Map<string, string>(
  GUARDED_TEMPLATES.map((rel) => [rel, runtimeTextOfFile(path.join(process.cwd(), rel))])
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
   * An inventoried template must ACTUALLY publish the claim.
   *
   * This is the guard whose absence let a real break ship. Extracting the
   * per-market trust bullets out of the combo route and into
   * `src/lib/trust-bullets.ts` moved four claims to a new file and left every
   * `publishedIn.templates` entry pointing at the route — which then matched
   * none of them. Two consequences, both worse than a stale comment:
   *
   *   1. The retraction worklist became WRONG. An owner following it would
   *      edit the route, find nothing, and every home-market combo would keep
   *      publishing the bullets.
   *   2. The new file was not in GUARDED_TEMPLATES, so the ratchet did not
   *      watch it at all. Verified by injecting `daily progress photos` and
   *      `same-day response` into trust-bullets.ts: the whole claims suite
   *      stayed green, 22 of 22.
   *
   * Codex caught it on #147, after that PR had merged. A test catches it now:
   * the register may not name a file that does not carry the claim, so moving
   * the strings without moving the inventory fails here.
   *
   * It also found a pre-existing over-listing — `named-project-lead` claimed
   * `constants.ts`, whose "a project lead assigned" and "your project lead"
   * match none of that claim's patterns.
   */
  it('inventories only templates that actually publish the claim', () => {
    const stale: string[] = [];
    for (const claim of OPERATIONAL_CLAIMS) {
      for (const rel of claim.publishedIn.templates) {
        const source = TEMPLATE_SOURCE.get(rel);
        if (source === undefined) continue; // covered by the test above
        const published = claimsFoundIn(source).some((c) => c.id === claim.id);
        if (!published) {
          stale.push(
            `${claim.id} inventories ${rel}, which matches none of its patterns — if the copy moved, move the inventory with it; if it never carried the claim, drop the entry`
          );
        }
      }
    }
    expect(stale, stale.join('; ')).toEqual([]);
  });

  /**
   * The other direction: a watched file that publishes an unconfirmed claim no
   * inventory records is already covered by the ratchet's per-template test
   * below. This pair means the register and the source cannot disagree in
   * either direction without something going red.
   */
  it('watches every file an inventory names', () => {
    for (const claim of OPERATIONAL_CLAIMS) {
      for (const rel of claim.publishedIn.templates) {
        expect(
          GUARDED_TEMPLATES as readonly string[],
          `${claim.id} inventories "${rel}" but the guard does not watch it, so a claim added there would not trip`
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

describe('every claim-bearing file is accounted for', () => {
  /**
   * INDEPENDENT DISCOVERY, and the hole it closes.
   *
   * The inventory guard above iterates `publishedIn.templates` — the very list
   * it validates. So a refactor that moves claim copy into a NEW module and
   * drops the old inventory entry passes it, and the per-template ratchet never
   * scans the new file because it is absent from GUARDED_TEMPLATES. That is
   * exactly the blind spot #147 shipped, recreated despite the new guard.
   * Codex named it on #148.
   *
   * So this does not consult the inventory at all. It walks `src`, reads the
   * RUNTIME text of every module, and requires each file that publishes an
   * unconfirmed claim to be classified as one of:
   *
   *   - watched at file level (GUARDED_TEMPLATES), or
   *   - explicitly out of scope with a reason (UNGUARDED_CLAIM_SOURCES).
   *
   * An unclassified file fails. The default is failure, which is the only
   * default that closes a discovery hole rather than narrowing it.
   */
  const walk = (dir: string, out: string[] = []): string[] => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!entry.name.startsWith('.') && entry.name !== 'node_modules') walk(full, out);
      } else if (/\.(ts|tsx)$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name)) {
        out.push(full);
      }
    }
    return out;
  };

  const modules = walk('src');

  /**
   * The assertions below pass trivially if the walk finds nothing or the
   * scanner reads no claims. Two unfalsifiable tests have already shipped in
   * this feature, so the scan proves itself first.
   */
  it('actually walks the source tree and reads its runtime text', () => {
    expect(modules.length).toBeGreaterThan(50);

    // The scan must prove itself WITHOUT requiring that any claim still be
    // unconfirmed. A floor on claim-bearing files fails once the owner has
    // retracted enough copy, which is the outcome this register exists to
    // reach — the same error the built-output guard had, in the file I did not
    // fix when I fixed that one. Codex found it on #148.
    //
    // So: the extractor returns real text from a real module, and the matcher
    // recognises a claim's own label when handed it. Neither depends on the
    // site still publishing anything.
    expect(runtimeTextOfFile('src/lib/constants.ts').length).toBeGreaterThan(2000);
    // The matcher is exercised only when there IS a claim to match. An empty
    // register is the all-retracted terminal state — the documented workflow
    // deletes the entry — and indexing [0] there throws, so the fix for one
    // terminal state blocked the other. Codex found it on #148, in code I had
    // written one round earlier to stop exactly this kind of blocking, and
    // duplicated across two files in the same commit where I wrote about
    // duplication.
    //
    // Guarding rather than asserting is honest here: with no claims registered
    // there is nothing for the matcher to find, and a synthetic fixture would
    // test a pattern the register does not contain.
    const [sample] = OPERATIONAL_CLAIMS;
    if (sample) {
      expect(claimsFoundIn(sample.label).map((c) => c.id)).toContain(sample.id);
    }
    // And the runtime scanner must be reading strings, not comments: the combo
    // route carries claim text ONLY in comments now, so it must NOT register.
    expect(
      claimsFoundIn(runtimeTextOfFile('src/app/services/[service]/[city]/page.tsx'))
        .filter((c) => c.status === 'unconfirmed'),
      'the combo route holds these claims only in comments, so runtime text must find none'
    ).toEqual([]);
  });

  it('classifies every file whose runtime text publishes an unconfirmed claim', () => {
    const watched = new Set<string>(GUARDED_TEMPLATES);
    const declared = new Set(Object.keys(UNGUARDED_CLAIM_SOURCES));
    const unclassified: string[] = [];

    for (const file of modules) {
      const ids = claimsFoundIn(runtimeTextOfFile(file))
        .filter((c) => c.status === 'unconfirmed')
        .map((c) => c.id);
      if (ids.length === 0) continue;
      if (watched.has(file) || declared.has(file)) continue;
      unclassified.push(
        `${file} publishes ${ids.join(', ')} but is neither in GUARDED_TEMPLATES nor in UNGUARDED_CLAIM_SOURCES. Watch it (and inventory the claims), or declare it out of scope with a reason — do not leave it unclassified, which is how the #147 blind spot happened`
      );
    }

    expect(unclassified, unclassified.join('; ')).toEqual([]);
  });

  /**
   * The reverse: a declared exemption for a file that no longer publishes
   * anything is dead weight that makes the scope list lie about itself.
   */
  it('declares no exemption for a file that publishes nothing', () => {
    const stale: string[] = [];
    for (const [file, reason] of Object.entries(UNGUARDED_CLAIM_SOURCES)) {
      if (!fs.existsSync(file)) {
        stale.push(`${file} is exempted ("${reason}") but does not exist`);
        continue;
      }
      const publishes = claimsFoundIn(runtimeTextOfFile(file)).some(
        (c) => c.status === 'unconfirmed'
      );
      if (!publishes) {
        stale.push(`${file} is exempted ("${reason}") but publishes no unconfirmed claim — drop the entry`);
      }
    }
    expect(stale, stale.join('; ')).toEqual([]);
  });

  it('never exempts and watches the same file', () => {
    const both = GUARDED_TEMPLATES.filter((f) => f in UNGUARDED_CLAIM_SOURCES);
    expect(both, `${both.join(', ')} is both watched and exempted`).toEqual([]);
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
   * Every claim still awaiting a decision must be ACTIONABLE — the owner needs
   * to know what was promised, where it is published, and why it matters.
   *
   * This replaces a test that pinned the list to exactly seven ids. That
   * version failed on the FIRST confirmation, not merely the last, and its own
   * docblock said "drop this test once every claim is resolved" — which is a
   * known blocker handed to the owner as a chore. The visibility it was for is
   * better served now by tests/claim-pages.json, which names all 603 affected
   * pages, and by §8 of the altitude doc.
   */
  it('gives the owner what they need to rule on each outstanding claim', () => {
    for (const claim of UNCONFIRMED_CLAIMS) {
      expect(claim.label.trim().length, `${claim.id} has no label`).toBeGreaterThan(0);
      expect(claim.patterns.length, `${claim.id} has no patterns`).toBeGreaterThan(0);
      expect(claim.note?.trim().length ?? 0, `${claim.id} has no note`).toBeGreaterThan(0);
      expect(claim.publishedIn, `${claim.id} records nowhere it is published`).toBeDefined();
    }
    // The outstanding set is exactly the register's unconfirmed entries — no
    // frozen count, so resolving claims is progress rather than a failure.
    expect(UNCONFIRMED_CLAIMS.map((c) => c.id)).toEqual(
      OPERATIONAL_CLAIMS.filter((c) => c.status === 'unconfirmed').map((c) => c.id)
    );
  });
});

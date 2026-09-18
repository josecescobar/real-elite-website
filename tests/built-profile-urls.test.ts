import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { BUSINESS, VERIFIED_PROFILE_URLS } from '../src/lib/constants';

/**
 * No unverified social profile URL may reach a rendered page, by any route.
 *
 * ## Why this is a built-output test rather than a source one
 *
 * The bug this replaces was not a missing rule. `constants.ts` already carried
 * the rule — the 404'd LinkedIn and Thumbtack URLs were removed specifically
 * "to avoid broken sameAs references in JSON-LD" — and Yelp was kept as an
 * explicit exception BECAUSE it could not be verified. What failed was that
 * the rule was enforced in one place and the value had two consumers:
 * `layout.tsx` put it in the sitewide LocalBusiness `sameAs` regardless, so
 * the one URL the repo flags as unconfirmed was asserting profile ownership on
 * every page.
 *
 * Fixing that produced the same shape of error one layer up. `sameAs` was
 * gated on `VERIFIED_PROFILE_URLS` and the comment claimed verifying a profile
 * was one edit enabling the footer and the structured data together — while
 * `Footer.tsx` still built its links from a separate hard-coded array that
 * never consulted the list. A gate applied in one of two places, described as
 * if it covered both. Codex found it on #151.
 *
 * Twice, the defect was a second consumer nobody enumerated. So the guard does
 * not enumerate consumers: it reads what the browser receives. A third
 * consumer added tomorrow — an About page, a JSON-LD Organization block, a
 * social icon row in a template — is covered without anyone remembering this
 * file exists. That is the same reasoning `built-claims.test.ts` documents for
 * the claims register, and it was learned the same way.
 *
 * ## What "verified" means
 *
 * A URL in `VERIFIED_PROFILE_URLS` is one a human has opened and confirmed
 * belongs to Real Elite. Everything else in `BUSINESS.social` is a URL we hold
 * but have not confirmed — currently Yelp alone, which 403s automated checks.
 *
 * ## When this fails
 *
 * Either a page started publishing an unverified URL (fix the page, or verify
 * the profile and move it), or a profile was verified and the URL added to
 * `VERIFIED_PROFILE_URLS` without this test being re-run. Do not add an
 * exception: the point is that there is no exception.
 */

const ROOT = '.next/server/app';

function builtPages(): string[] {
  const out: string[] = [];
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.html')) out.push(full);
    }
  };
  walk(ROOT);
  return out;
}

function routeOf(file: string): string {
  const route = file.slice(ROOT.length).replace(/\.html$/, '');
  return route === '/index' || route === '' ? '/' : route;
}

/** Held but not confirmed — the set that must never reach a page. */
const UNVERIFIED_PROFILE_URLS = Object.values(BUSINESS.social).filter(
  (url) => !(VERIFIED_PROFILE_URLS as readonly string[]).includes(url)
);

describe('unverified profile URLs in rendered pages', () => {
  const pages = builtPages();

  it('has built output to read', () => {
    // A suite that silently passes on a missing build is worse than no suite.
    expect(pages.length).toBeGreaterThan(0);
  });

  it('holds at least one unverified URL, so the check is not vacuous', () => {
    // If every URL were verified this suite would pass by having nothing to
    // look for. That is a legitimate end state — but it should be a visible
    // one, reached by deliberately deleting this test, not by it quietly
    // asserting nothing.
    expect(UNVERIFIED_PROFILE_URLS.length).toBeGreaterThan(0);
  });

  it('never publishes an unverified profile URL on any page', () => {
    const offenders: string[] = [];

    for (const file of pages) {
      const html = fs.readFileSync(file, 'utf8');
      for (const url of UNVERIFIED_PROFILE_URLS) {
        if (html.includes(url)) offenders.push(`${routeOf(file)} → ${url}`);
      }
    }

    expect(offenders).toEqual([]);
  });

  it('publishes every verified URL somewhere, so the gate is not over-tight', () => {
    // The opposite failure: gating so hard that confirmed profiles stop
    // rendering anywhere. Withdrawing an unverified claim is the goal;
    // withdrawing the verified ones too is a regression.
    const allHtml = pages.map((f) => fs.readFileSync(f, 'utf8')).join('');
    for (const url of VERIFIED_PROFILE_URLS) {
      expect(allHtml).toContain(url);
    }
  });
});

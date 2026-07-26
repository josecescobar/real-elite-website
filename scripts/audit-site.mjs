#!/usr/bin/env node
/**
 * Whole-site quality audit.
 *
 * Crawls every URL in the generated sitemap against a running server and
 * measures the things that quietly rot as a content site grows: SEO field
 * lengths, heading structure, alt text, form labelling, structured data,
 * internal link health, console errors and Core Web Vitals.
 *
 * It exists because none of this is visible from a green build. `npm test`
 * proves the code works; this proves the *site* is fit to ship.
 *
 * Usage:
 *   npm run build && npm start &        # serve a production build
 *   npm run audit                       # human-readable report
 *   npm run audit -- --json out.json    # machine-readable, for the loop
 *   npm run audit -- --base http://localhost:3000
 *   npm run audit -- --fail-on error    # non-zero exit when errors exist
 *
 * Findings are graded:
 *   error  — broken for users or crawlers (blocked embeds, 4xx/5xx, dead links)
 *   warn   — measurably degrades reach or conversion (truncated SERP copy)
 *   info   — worth knowing, not worth blocking a deploy
 *
 * Thresholds live in LIMITS below; they encode Google's documented display
 * budgets, not personal taste. Adjust there rather than at call sites.
 */
// playwright-core (not `playwright`) is deliberate: it ships no postinstall
// browser download, so adding it as a devDependency doesn't slow `npm ci` in
// CI. It needs an existing Chromium — see resolveChromium() below.
import { chromium } from 'playwright-core';
import { existsSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const LIMITS = {
  // Google truncates around 580px of title; ~60 chars is the safe proxy.
  titleMax: 60,
  // Meta descriptions display to ~155–160 chars; under ~70 wastes the slot.
  descMin: 70,
  descMax: 160,
  // Below this a page reads as thin to both users and crawlers.
  wordMin: 300,
  // Core Web Vitals "good" thresholds (field equivalents, measured warm here).
  lcpMs: 2500,
  cls: 0.1,
  // Minimum comfortable touch target, per the WCAG 2.2 "Target Size (Minimum)"
  // guidance and both platform HIGs. Measured on the mobile pass only.
  tapPx: 44,
  // A few px of slop before calling it horizontal overflow — sub-pixel layout
  // rounding routinely leaves scrollWidth a hair over clientWidth.
  overflowSlopPx: 2,
};

/** The mobile pass runs at a common small-phone width, the worst realistic case. */
const MOBILE = { width: 390, height: 844 };

const args = process.argv.slice(2);
const getArg = (flag, fallback) => {
  const i = args.indexOf(flag);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
};
const BASE = getArg('--base', 'http://127.0.0.1:3100').replace(/\/$/, '');
const JSON_OUT = getArg('--json', null);
const FAIL_ON = getArg('--fail-on', null); // 'error' | 'warn'
const LIMIT = Number(getArg('--limit', '0')) || 0;
/**
 * Find a Chromium to drive. Checked in order: an explicit override, any
 * Playwright-managed build under PLAYWRIGHT_BROWSERS_PATH (or its default
 * location), then a system Chrome/Chromium. Returns null to let
 * playwright-core try its own resolution and surface its own error.
 */
function resolveChromium() {
  if (process.env.PLAYWRIGHT_CHROMIUM_PATH) return process.env.PLAYWRIGHT_CHROMIUM_PATH;

  const roots = [process.env.PLAYWRIGHT_BROWSERS_PATH, '/opt/pw-browsers'].filter(Boolean);
  for (const root of roots) {
    if (!existsSync(root)) continue;
    try {
      const hit = execSync(
        `find ${JSON.stringify(root)} -maxdepth 3 -type f -name chrome -path '*chrome-linux*' 2>/dev/null | head -1`,
        { encoding: 'utf8' }
      ).trim();
      if (hit) return hit;
    } catch {
      /* fall through to the next candidate */
    }
  }
  for (const p of [
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/usr/bin/google-chrome',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ]) {
    if (existsSync(p)) return p;
  }
  return null;
}

const findings = [];
const add = (level, rule, route, detail) =>
  findings.push({ level, rule, route, detail });

async function main() {
  const executablePath = resolveChromium();
  let browser;
  try {
    browser = await chromium.launch(executablePath ? { executablePath } : {});
  } catch (e) {
    console.error(
      `Could not launch Chromium${executablePath ? ` at ${executablePath}` : ''}.\n` +
        `Set PLAYWRIGHT_CHROMIUM_PATH to a Chromium binary, or install one with:\n` +
        `  npx playwright install chromium\n\n${e}`
    );
    process.exitCode = 2;
    return;
  }

  // ---- discover routes from the generated sitemap ----
  const ctx0 = await browser.newContext();
  const p0 = await ctx0.newPage();
  let routes = [];
  try {
    await p0.goto(`${BASE}/sitemap-0.xml`, { waitUntil: 'domcontentloaded', timeout: 20000 });
    const xml = await p0.content();
    routes = [
      ...new Set(
        [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
          .map((m) => m[1].replace(/^https?:\/\/[^/]+/, ''))
          .map((r) => (r === '' ? '/' : r))
      ),
    ];
  } catch {
    console.error(
      `Could not read ${BASE}/sitemap-0.xml — is a production server running?\n` +
        `  npm run build && PORT=3100 npm start`
    );
    process.exitCode = 2;
    await browser.close();
    return;
  }
  await ctx0.close();
  if (LIMIT) routes = routes.slice(0, LIMIT);
  console.error(`auditing ${routes.length} routes at ${BASE}`);

  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (compatible; RealEliteSiteAudit/1.0)',
  });

  const pages = [];
  const linkTargets = new Set();

  for (const route of routes) {
    const page = await ctx.newPage();
    const consoleErrors = [];
    const cspViolations = [];
    page.on('console', (m) => {
      if (m.type() !== 'error') return;
      const t = m.text();
      if (/Content Security Policy/i.test(t)) cspViolations.push(t.slice(0, 200));
      else consoleErrors.push(t.slice(0, 200));
    });

    let status = 0;
    try {
      const resp = await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 45000 });
      status = resp ? resp.status() : 0;
    } catch (e) {
      add('error', 'page-load', route, String(e).split('\n')[0].slice(0, 120));
      await page.close();
      continue;
    }
    if (status >= 400) add('error', 'http-status', route, `HTTP ${status}`);

    const d = await page.evaluate(() => {
      const q = (s) => [...document.querySelectorAll(s)];
      const title = document.title || '';
      const desc = document.querySelector('meta[name="description"]')?.content || '';
      const headings = q('h1,h2,h3,h4,h5,h6').map((h) => Number(h.tagName[1]));
      let jumps = 0;
      for (let i = 1; i < headings.length; i++) if (headings[i] - headings[i - 1] > 1) jumps++;
      const fields = q('input, select, textarea').filter((f) => f.type !== 'hidden');
      const unlabeled = fields.filter((f) => {
        if (f.getAttribute('aria-label') || f.getAttribute('aria-labelledby')) return false;
        if (f.id && document.querySelector(`label[for="${CSS.escape(f.id)}"]`)) return false;
        return !f.closest('label');
      }).length;
      const ld = q('script[type="application/ld+json"]').map((s) => {
        try {
          const j = JSON.parse(s.textContent);
          return Array.isArray(j) ? j.map((x) => x['@type']).join('+') : j['@type'];
        } catch {
          return 'INVALID_JSON';
        }
      });
      return {
        title,
        titleLen: title.length,
        descLen: desc.length,
        canonical: document.querySelector('link[rel="canonical"]')?.href || '',
        h1Count: q('h1').length,
        headingJumps: jumps,
        imgCount: q('img').length,
        missingAlt: q('img').filter((i) => !i.hasAttribute('alt')).length,
        unlabeledFields: unlabeled,
        jsonLd: ld,
        wordCount: (document.body.innerText || '').trim().split(/\s+/).length,
        links: q('a[href]')
          .map((a) => a.getAttribute('href'))
          .filter((h) => h && h.startsWith('/') && !h.startsWith('//')),
      };
    });

    d.links.forEach((l) => linkTargets.add(l.split('#')[0].split('?')[0]));

    const vitals = await page.evaluate(
      () =>
        new Promise((resolve) => {
          let lcp = 0;
          let cls = 0;
          try {
            new PerformanceObserver((l) => {
              for (const e of l.getEntries()) lcp = Math.max(lcp, e.startTime);
            }).observe({ type: 'largest-contentful-paint', buffered: true });
            new PerformanceObserver((l) => {
              for (const e of l.getEntries()) if (!e.hadRecentInput) cls += e.value;
            }).observe({ type: 'layout-shift', buffered: true });
          } catch {
            /* observer unsupported — reported as 0 */
          }
          setTimeout(() => resolve({ lcp: Math.round(lcp), cls: Number(cls.toFixed(4)) }), 1200);
        })
    );

    // ---- grade this page ----
    if (cspViolations.length)
      add('error', 'csp-blocked', route, cspViolations[0]);
    if (consoleErrors.length)
      add('error', 'console-error', route, consoleErrors[0]);
    if (d.titleLen > LIMITS.titleMax)
      add('warn', 'title-too-long', route, `${d.titleLen} chars (max ${LIMITS.titleMax}): ${d.title}`);
    if (!d.titleLen) add('error', 'title-missing', route, 'no <title>');
    if (d.descLen > LIMITS.descMax)
      add('warn', 'desc-too-long', route, `${d.descLen} chars (max ${LIMITS.descMax})`);
    else if (d.descLen && d.descLen < LIMITS.descMin)
      add('warn', 'desc-too-short', route, `${d.descLen} chars (min ${LIMITS.descMin})`);
    else if (!d.descLen) add('error', 'desc-missing', route, 'no meta description');
    if (d.h1Count !== 1) add('warn', 'h1-count', route, `${d.h1Count} <h1> elements`);
    if (d.headingJumps) add('info', 'heading-order', route, `${d.headingJumps} level jump(s)`);
    if (d.missingAlt) add('error', 'img-alt-missing', route, `${d.missingAlt} <img> without alt`);
    if (d.unlabeledFields)
      add('error', 'form-label-missing', route, `${d.unlabeledFields} unlabelled field(s)`);
    if (!d.canonical) add('warn', 'canonical-missing', route, 'no canonical link');
    if (!d.jsonLd.length) add('info', 'no-structured-data', route, 'no JSON-LD block');
    if (d.jsonLd.includes('INVALID_JSON'))
      add('error', 'structured-data-invalid', route, 'JSON-LD failed to parse');
    if (d.wordCount < LIMITS.wordMin)
      add('info', 'thin-content', route, `${d.wordCount} words (min ${LIMITS.wordMin})`);
    if (vitals.lcp > LIMITS.lcpMs)
      add('warn', 'lcp-slow', route, `${vitals.lcp}ms (max ${LIMITS.lcpMs})`);
    if (vitals.cls > LIMITS.cls)
      add('warn', 'cls-high', route, `${vitals.cls} (max ${LIMITS.cls})`);

    const { links, ...rest } = d;
    pages.push({ route, status, ...rest, ...vitals });
    await page.close();
  }

  // ---- internal links that aren't themselves sitemap routes ----
  const known = new Set(routes);
  const extra = [...linkTargets].filter((l) => !known.has(l));
  const lp = await ctx.newPage();
  for (const t of extra) {
    try {
      const r = await lp.goto(BASE + t, { waitUntil: 'domcontentloaded', timeout: 20000 });
      const s = r ? r.status() : 0;
      if (s >= 400) add('error', 'broken-link', t, `HTTP ${s}`);
    } catch {
      add('error', 'broken-link', t, 'request failed');
    }
  }
  await lp.close();
  await ctx.close();

  // ---- mobile pass ----
  // Most traffic to a contractor site is a phone, and the failures that matter
  // there are invisible at 1440px: a page that scrolls sideways, or a control
  // too small to hit. Both are layout facts, so this pass only measures
  // geometry — everything content-shaped was already graded above.
  const mctx = await browser.newContext({
    viewport: MOBILE,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 ' +
      '(KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  });
  const mp = await mctx.newPage();

  for (const route of routes) {
    try {
      await mp.goto(BASE + route, { waitUntil: 'networkidle', timeout: 45000 });
    } catch {
      // The desktop pass already reported unreachable routes.
      continue;
    }

    const m = await mp.evaluate(
      ({ tapPx, slop }) => {
        const doc = document.documentElement;
        const overflowBy = doc.scrollWidth - doc.clientWidth;

        // Name the widest offenders so the fix has somewhere to start, rather
        // than reporting "something is too wide" for a whole page.
        const culprits = [];
        if (overflowBy > slop) {
          for (const el of document.querySelectorAll('body *')) {
            const r = el.getBoundingClientRect();
            if (r.width === 0 || r.height === 0) continue;
            if (r.right <= doc.clientWidth + slop) continue;
            // Skip elements that are wide only because an ancestor already is.
            const p = el.parentElement;
            if (p && p.getBoundingClientRect().right > doc.clientWidth + slop) continue;
            culprits.push(
              `${el.tagName.toLowerCase()}${
                el.className && typeof el.className === 'string'
                  ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.')
                  : ''
              } → ${Math.round(r.right)}px`
            );
            if (culprits.length >= 3) break;
          }
        }

        // Tap targets: controls rendered smaller than the minimum.
        //
        // WCAG 2.2's Target Size (Minimum) exempts targets presented "in a
        // sentence or block of text", which is most of what a content site
        // links. Flagging those buries the real finding, so this only grades
        // things that present as discrete controls:
        //   - `display: inline` is a text link in the flow → exempt
        //   - visually-hidden utilities (skip links, sr-only) collapse to ~0px
        //     until focused and are correct as authored → exempt
        //   - anything inside running prose → exempt
        const small = [];
        for (const el of document.querySelectorAll(
          'a[href], button, input:not([type=hidden]), select, textarea, [role=button]'
        )) {
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) continue; // not rendered
          if (r.width <= 4 || r.height <= 4) continue; // visually-hidden utility
          // Parked off-canvas (honeypot fields, closed drawers): not a target.
          if (r.right <= 0 || r.left >= window.innerWidth) continue;
          // Hidden from the accessibility tree, so not a target either.
          if (el.closest('[aria-hidden="true"]')) continue;
          if (el.closest('p, li, .prose-editorial')) continue; // inline text link
          const cs = getComputedStyle(el);
          if (cs.display === 'inline') continue; // flows as text, not a control
          if (cs.position === 'fixed' && r.top < 0) continue; // off-canvas drawer
          // Height is the dimension that decides whether a thumb lands on a
          // link in a vertically-scrolling page, so it carries the full
          // minimum. Width is only graded down to icon size: a breadcrumb
          // crumb is as wide as its word ("Paving" is 38px) and padding it to
          // 44 would put visible gaps in the trail for no real gain — WCAG 2.2
          // itself exempts undersized targets that have clearance around them.
          // Half-pixel tolerance because a box authored at exactly 44px
          // routinely measures 43.99 after layout rounding.
          const tallEnough = r.height >= tapPx - 0.5;
          const wideEnough = r.width >= 24 - 0.5;
          if (tallEnough && wideEnough) continue;
          small.push(
            `${el.tagName.toLowerCase()}"${(el.textContent || '').trim().slice(0, 24)}" ` +
              `${Math.round(r.width)}×${Math.round(r.height)}`
          );
          if (small.length >= 4) break;
        }
        return { overflowBy, culprits, small };
      },
      { tapPx: LIMITS.tapPx, slop: LIMITS.overflowSlopPx }
    );

    if (m.overflowBy > LIMITS.overflowSlopPx) {
      add(
        'error',
        'mobile-h-overflow',
        route,
        `page scrolls ${m.overflowBy}px sideways at ${MOBILE.width}px` +
          (m.culprits.length ? ` — widest: ${m.culprits.join('; ')}` : '')
      );
    }
    if (m.small.length) {
      add('warn', 'mobile-tap-target', route, `under ${LIMITS.tapPx}px: ${m.small.join('; ')}`);
    }
  }
  await mctx.close();
  await browser.close();

  // ---- report ----
  const counts = { error: 0, warn: 0, info: 0 };
  findings.forEach((f) => (counts[f.level] += 1));

  if (JSON_OUT) {
    writeFileSync(
      JSON_OUT,
      JSON.stringify({ base: BASE, routes: routes.length, counts, findings, pages }, null, 1)
    );
    console.error(`wrote ${JSON_OUT}`);
  }

  const byRule = findings.reduce((m, f) => {
    (m[f.rule] ||= []).push(f);
    return m;
  }, {});
  const order = { error: 0, warn: 1, info: 2 };
  const rules = Object.entries(byRule).sort(
    (a, b) => order[a[1][0].level] - order[b[1][0].level] || b[1].length - a[1].length
  );

  console.log(`\nSite audit — ${routes.length} routes at ${BASE}`);
  console.log(`${counts.error} error · ${counts.warn} warn · ${counts.info} info\n`);
  for (const [rule, list] of rules) {
    const lvl = list[0].level.toUpperCase().padEnd(5);
    console.log(`${lvl} ${rule} (${list.length})`);
    for (const f of list.slice(0, 8)) console.log(`        ${f.route} — ${f.detail}`);
    if (list.length > 8) console.log(`        …and ${list.length - 8} more`);
    console.log('');
  }
  if (!findings.length) console.log('No findings. Ship it.\n');

  if (FAIL_ON === 'error' && counts.error) process.exitCode = 1;
  if (FAIL_ON === 'warn' && (counts.error || counts.warn)) process.exitCode = 1;
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 2;
});

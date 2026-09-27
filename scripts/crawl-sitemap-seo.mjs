#!/usr/bin/env node
/**
 * Fetch every URL in sitemap-0.xml and report per page:
 * HTTP status, <title>, meta description, canonical, <h1> count,
 * and images with a missing or empty alt.
 *
 * Usage:
 *   node scripts/crawl-sitemap-seo.mjs
 *   node scripts/crawl-sitemap-seo.mjs --sitemap https://www.realelitecontracting.com/sitemap-0.xml
 *   node scripts/crawl-sitemap-seo.mjs --sitemap http://127.0.0.1:3456/sitemap-0.xml --json /tmp/after.json
 */
import { writeFileSync } from 'node:fs';

const args = process.argv.slice(2);
const getArg = (flag, fallback) => {
  const i = args.indexOf(flag);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
};

const SITEMAP = getArg(
  '--sitemap',
  'https://www.realelitecontracting.com/sitemap-0.xml'
);
const JSON_OUT = getArg('--json', '');
const BASE = getArg('--base', '').replace(/\/$/, '');
const CONCURRENCY = Number(getArg('--concurrency', '8')) || 8;
const WWW = 'https://www.realelitecontracting.com';

const decode = (value) =>
  value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, num) => String.fromCodePoint(Number(num)))
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();

const attr = (tag, name) => {
  const re = new RegExp(`\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, 'i');
  const match = tag.match(re);
  if (!match) return null;
  return decode(match[1] ?? match[2] ?? '');
};

function parseHtml(html) {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? decode(titleMatch[1]) : '';

  let description = '';
  const metaTags = html.match(/<meta\b[^>]*>/gi) ?? [];
  for (const tag of metaTags) {
    const name = (attr(tag, 'name') || attr(tag, 'property') || '').toLowerCase();
    if (name === 'description' || name === 'og:description') {
      const content = attr(tag, 'content');
      if (name === 'description' && content != null) description = content;
      if (!description && content != null) description = content;
    }
  }

  let canonical = '';
  const linkTags = html.match(/<link\b[^>]*>/gi) ?? [];
  for (const tag of linkTags) {
    const rel = (attr(tag, 'rel') || '').toLowerCase();
    if (rel.split(/\s+/).includes('canonical')) {
      canonical = attr(tag, 'href') || '';
      break;
    }
  }

  const h1 = (html.match(/<h1\b/gi) ?? []).length;

  const images = [];
  const imgTags = html.match(/<img\b[^>]*>/gi) ?? [];
  for (const tag of imgTags) {
    const alt = attr(tag, 'alt');
    const src = attr(tag, 'src') || '';
    if (alt == null || alt === '') {
      images.push({ src, alt: alt ?? '' });
    }
  }

  const schemaTypes = [];
  const ld = html.match(
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  );
  if (ld) {
    for (const block of ld) {
      const body = block.replace(/^<script[^>]*>/i, '').replace(/<\/script>$/i, '');
      try {
        const data = JSON.parse(body);
        const types = Array.isArray(data)
          ? data.map((d) => d['@type']).flat()
          : [data['@type']].flat();
        schemaTypes.push(...types.filter(Boolean));
      } catch {
        schemaTypes.push('INVALID_JSON');
      }
    }
  }

  return { title, description, canonical, h1, missingAlt: images, schemaTypes };
}

function canonicalPath(url) {
  try {
    const u = new URL(url);
    const path = u.pathname.replace(/\/$/, '') || '/';
    return `${u.origin}${path === '/' ? '/' : path}`;
  } catch {
    return url;
  }
}

async function fetchText(url) {
  const res = await fetch(url, {
    redirect: 'manual',
    headers: {
      'user-agent': 'RealEliteSitemapSeoCrawl/1.0',
      accept: 'text/html,application/xml;q=0.9,*/*;q=0.8',
    },
  });
  const text = await res.text();
  return { status: res.status, location: res.headers.get('location') || '', text };
}

async function mapPool(items, limit, worker) {
  const out = new Array(items.length);
  let next = 0;
  async function run() {
    while (next < items.length) {
      const i = next++;
      out[i] = await worker(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run));
  return out;
}

const sitemapRes = await fetchText(SITEMAP);
if (sitemapRes.status !== 200) {
  console.error(`Sitemap fetch failed: ${sitemapRes.status} ${SITEMAP}`);
  process.exit(1);
}

const urls = [
  ...new Set(
    [...sitemapRes.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => {
      const loc = decode(m[1]);
      if (!BASE) return loc;
      const path = new URL(loc).pathname || '/';
      return `${BASE}${path}`;
    })
  ),
];

console.error(`Crawling ${urls.length} URLs from ${SITEMAP}`);

const rows = await mapPool(urls, CONCURRENCY, async (url) => {
  try {
    const res = await fetchText(url);
    const parsed =
      res.status >= 200 && res.status < 300 ? parseHtml(res.text) : parseHtml('');
    const path = new URL(url).pathname || '/';
    const expected = canonicalPath(`${WWW}${path}`);
    const got = parsed.canonical ? canonicalPath(parsed.canonical) : '';
    const issues = [];
    if (res.status !== 200) issues.push(`status ${res.status}${res.location ? ` -> ${res.location}` : ''}`);
    if (!parsed.title) issues.push('missing title');
    if (!parsed.description) issues.push('missing description');
    else if (parsed.description.length > 160) {
      issues.push(`description ${parsed.description.length} chars`);
    }
    if (!parsed.canonical) issues.push('missing canonical');
    else if (!got.startsWith(`${WWW}/`) && got !== WWW && got !== `${WWW}/`) {
      issues.push(`canonical not www: ${parsed.canonical}`);
    } else if (got !== expected && !(expected === `${WWW}/` && (got === WWW || got === `${WWW}/`))) {
      issues.push(`canonical mismatch: ${parsed.canonical}`);
    }
    if (res.status === 200 && parsed.h1 !== 1) issues.push(`h1 count ${parsed.h1}`);
    if (parsed.missingAlt.length) issues.push(`images missing alt: ${parsed.missingAlt.length}`);
    return {
      url,
      path: new URL(url).pathname,
      status: res.status,
      title: parsed.title,
      titleLen: parsed.title.length,
      description: parsed.description,
      descLen: parsed.description.length,
      canonical: parsed.canonical,
      h1: parsed.h1,
      missingAlt: parsed.missingAlt.length,
      missingAltSrc: parsed.missingAlt.map((img) => img.src),
      schemaTypes: parsed.schemaTypes,
      issues,
    };
  } catch (error) {
    return {
      url,
      path: url,
      status: 0,
      title: '',
      titleLen: 0,
      description: '',
      descLen: 0,
      canonical: '',
      h1: 0,
      missingAlt: 0,
      missingAltSrc: [],
      schemaTypes: [],
      issues: [`fetch error: ${error instanceof Error ? error.message : String(error)}`],
    };
  }
});

const titleCounts = new Map();
for (const row of rows) {
  if (!row.title) continue;
  titleCounts.set(row.title, (titleCounts.get(row.title) || 0) + 1);
}
for (const row of rows) {
  if (row.title && titleCounts.get(row.title) > 1) {
    row.issues.push(`duplicate title (x${titleCounts.get(row.title)})`);
  }
}

const descCounts = new Map();
for (const row of rows) {
  if (!row.description) continue;
  descCounts.set(row.description, (descCounts.get(row.description) || 0) + 1);
}
for (const row of rows) {
  if (row.description && descCounts.get(row.description) > 1) {
    row.issues.push(`duplicate description (x${descCounts.get(row.description)})`);
  }
}

const flagged = rows.filter((r) => r.issues.length);
const summary = {
  sitemap: SITEMAP,
  crawled: rows.length,
  flagged: flagged.length,
  ok: rows.length - flagged.length,
};

const md = [];
md.push(`| path | status | title | desc | canonical | h1 | missing alt | issues |`);
md.push(`| --- | ---: | --- | ---: | --- | ---: | ---: | --- |`);
for (const row of rows) {
  const title = row.title.replace(/\|/g, '\\|').slice(0, 80);
  const canon = row.canonical ? 'yes' : 'no';
  const issues = row.issues.join('; ').replace(/\|/g, '\\|') || '—';
  md.push(
    `| ${row.path} | ${row.status} | ${title} | ${row.descLen || '—'} | ${canon} | ${row.h1} | ${row.missingAlt} | ${issues} |`
  );
}

const report = { summary, rows, markdown: md.join('\n') };
if (JSON_OUT) writeFileSync(JSON_OUT, JSON.stringify(report, null, 2));

console.log(JSON.stringify(summary));
console.log('');
console.log('## Flagged');
console.log('');
console.log('| path | issue |');
console.log('| --- | --- |');
for (const row of flagged) {
  console.log(`| ${row.path} | ${row.issues.join('; ').replace(/\|/g, '\\|')} |`);
}

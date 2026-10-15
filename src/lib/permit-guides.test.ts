import { describe, expect, it } from 'vitest';
import { ALL_SERVICE_AREAS, SERVICES } from '@/lib/constants';
import { getAllPosts } from '@/lib/blog';
import { BATCH2_PERMIT_GUIDES } from '@/lib/permit-guides-batch2';
import { BATCH3_PERMIT_GUIDES } from '@/lib/permit-guides-batch3';
import {
  PERMIT_GUIDES,
  PERMIT_SOURCES,
  getPermitGuide,
  plainPermitText,
  permitGuidePath,
  serviceLinkFor,
  sourceById,
} from '@/lib/permit-guides';

/** Official government hosts only. A new host needs a deliberate edit here. */
const OFFICIAL_HOST = (host: string): boolean =>
  /\.(gov|us)$/i.test(host) || ['www.wsscwater.com', 'www.townofchevychase.org', 'www.berkeleywv.org', 'www.cityofmartinsburg.org', 'www.jeffersoncountywv.org', 'www.charlestownwv.us', 'ransonwv.gov', 'www.shepherdstown.gov', 'www.harpersferrywv.us', 'www.washco-md.net', 'hagerstownmd.org', 'www.hagerstownmd.org', 'www.chambersburgpa.gov', 'www.fauquiercounty.gov', 'warrentonva.gov', 'www.warrentonva.gov', 'www.pwcva.gov', 'pwcaws.pwcva.gov', 'www.townofhaymarket.org', 'www.aacounty.org', 'www.carrollcountymd.gov', 'www.westminstermd.gov'].includes(host);

function allText(guide: (typeof PERMIT_GUIDES)[number]): string {
  return [
    guide.h1,
    guide.seoTitle,
    guide.description,
    guide.cardBlurb,
    plainPermitText(guide.answer),
    plainPermitText(guide.jurisdictionIntro),
    ...guide.issuers.flatMap((i) => [i.name, i.covers]),
    ...guide.jobs.flatMap((j) => [j.job, j.summary]),
    ...guide.steps.map((s) => s.text),
    guide.hoa.text,
    guide.historic.text,
    ...guide.faqs.flatMap((f) => [f.question, plainPermitText(f.answer)]),
  ].join('\n');
}

describe('permit guides', () => {
  it('covers all nineteen guide slugs, once each', () => {
    expect(PERMIT_GUIDES.map((g) => g.slug).sort()).toEqual(
      [
        'arlington-county-va',
        'berkeley-county-wv',
        'fauquier-county-va',
        'franklin-county-pa',
        'jefferson-county-wv',
        'prince-william-county-va',
        'washington-county-md',
        'fairfax-county-va',
        'frederick-county-md',
        'howard-county-md',
        'loudoun-county-va',
        'montgomery-county-md',
        'frederick-county-va',
        'clarke-county-va',
        'alexandria-va',
        'falls-church-city-of-fairfax-va',
        'anne-arundel-county-md',
        'carroll-county-md',
        'manassas-manassas-park-va',
      ].sort(),
    );
  });

  it('resolves every slug and builds the path', () => {
    for (const g of PERMIT_GUIDES) {
      expect(getPermitGuide(g.slug)).toBe(g);
      expect(permitGuidePath(g.slug)).toBe(`/permit-guides/${g.slug}`);
    }
    expect(getPermitGuide('brambleton-va')).toBeNull();
  });

  it('has unique titles and descriptions, and none collide with a blog post', () => {
    const blogTitles = new Set(getAllPosts().flatMap((p) => [p.title, p.seoTitle].filter(Boolean)));
    const titles = PERMIT_GUIDES.flatMap((g) => [g.h1, g.seoTitle]);
    expect(new Set(titles).size).toBe(titles.length);
    for (const t of titles) expect(blogTitles.has(t)).toBe(false);
    const descriptions = PERMIT_GUIDES.map((g) => g.description);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });

  it('keeps titles and descriptions inside the SERP budget', () => {
    for (const g of PERMIT_GUIDES) {
      expect(g.seoTitle.length, g.seoTitle).toBeLessThanOrEqual(60);
      expect(g.description.length, g.slug).toBeLessThanOrEqual(165);
      expect(g.description.length, g.slug).toBeGreaterThanOrEqual(90);
    }
  });

  it('cites only official https sources, and every cited id exists', () => {
    const ids = new Set(PERMIT_SOURCES.map((s) => s.id));
    expect(ids.size).toBe(PERMIT_SOURCES.length);
    for (const s of PERMIT_SOURCES) {
      const url = new URL(s.url);
      expect(url.protocol, s.url).toBe('https:');
      expect(OFFICIAL_HOST(url.hostname), s.url).toBe(true);
    }
    for (const g of PERMIT_GUIDES) {
      const cited = [
        ...g.issuers.flatMap((i) => i.sources),
        ...g.jobs.flatMap((j) => j.sources),
        ...g.steps.flatMap((s) => s.sources),
        ...g.hoa.sources,
        ...g.historic.sources,
      ];
      for (const id of [...cited, ...g.sourceIds]) {
        expect(sourceById(id), `${g.slug} cites unknown source ${id}`).toBeTruthy();
      }
      // Everything cited in the body is listed in the page's source block.
      for (const id of cited) expect(g.sourceIds, `${g.slug}: ${id}`).toContain(id);
    }
  });

  it('cites a source for every job, issuer, and step', () => {
    for (const g of PERMIT_GUIDES) {
      for (const j of g.jobs) expect(j.sources.length, `${g.slug}: ${j.job}`).toBeGreaterThan(0);
      for (const i of g.issuers) {
        if (/^Check with /i.test(i.covers)) continue;
        expect(i.sources.length, `${g.slug}: ${i.name}`).toBeGreaterThan(0);
      }
      for (const s of g.steps) expect(s.sources.length, `${g.slug}: ${s.text}`).toBeGreaterThan(0);
      expect(g.jobs.length).toBeGreaterThanOrEqual(6);
      expect(g.faqs.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('gives every batch-2 lead, intro, and FAQ an inline official https source listed on its page', () => {
    for (const guide of BATCH2_PERMIT_GUIDES) {
      for (const block of [guide.answer, guide.jurisdictionIntro, ...guide.faqs.map((f) => f.answer)]) {
        expect(typeof block, guide.slug).not.toBe('string');
        if (typeof block === 'string') continue;
        expect(block.length, guide.slug).toBeGreaterThan(0);
        expect(block.flatMap((part) => part.sources).length, guide.slug).toBeGreaterThan(0);
        for (const part of block) {
          for (const id of part.sources) {
            expect(guide.sourceIds, `${guide.slug}: ${id}`).toContain(id);
            expect(sourceById(id)?.url, `${guide.slug}: ${id}`).toMatch(/^https:\/\//);
          }
        }
      }
    }
  });

  it('keeps batch-3 leads, intros, and FAQs in cited spans or explicit check-with-office advice', () => {
    for (const guide of BATCH3_PERMIT_GUIDES) {
      for (const block of [guide.answer, guide.jurisdictionIntro, ...guide.faqs.map((f) => f.answer)]) {
        expect(typeof block, guide.slug).not.toBe('string');
        if (typeof block === 'string') continue;
        for (const part of block) {
          if (part.sources.length === 0) expect(part.text, guide.slug).toMatch(/check with|confirm/i);
          for (const id of part.sources) expect(guide.sourceIds, `${guide.slug}: ${id}`).toContain(id);
        }
      }
    }
  });

  it('cites Martinsburg facts and keeps Fauquier county advice separate from Warrenton sources', () => {
    const berkeley = BATCH2_PERMIT_GUIDES.find((guide) => guide.slug === 'berkeley-county-wv');
    const fauquier = BATCH2_PERMIT_GUIDES.find((guide) => guide.slug === 'fauquier-county-va');
    expect(berkeley).toBeDefined();
    expect(fauquier).toBeDefined();
    for (const [guide, blocks] of [
      [berkeley!, [berkeley!.answer, berkeley!.jurisdictionIntro, ...berkeley!.faqs.map((faq) => faq.answer)]],
    ] as const) {
      for (const block of blocks) {
        expect(typeof block).not.toBe('string');
        if (typeof block === 'string') continue;
        for (const part of block) {
          expect(part.sources.length, `${guide.slug}: ${part.text}`).toBeGreaterThan(0);
          for (const id of part.sources) {
            expect(guide.sourceIds, `${guide.slug}: ${part.text} (${id})`).toContain(id);
            expect(sourceById(id)?.url).toMatch(/^https:\/\//);
          }
        }
      }
    }
    for (const block of [fauquier!.answer, fauquier!.jurisdictionIntro, ...fauquier!.faqs.map((faq) => faq.answer)]) {
      expect(typeof block).not.toBe('string');
      if (typeof block === 'string') continue;
      for (const part of block) {
        if (part.text.includes('Check with the county') || part.text.includes('check with the county')) {
          expect(part.sources, part.text).toEqual([]);
        } else {
          expect(part.sources.length, part.text).toBeGreaterThan(0);
        }
      }
    }
    const townCited = [
      ...(typeof fauquier!.answer === 'string' ? [] : fauquier!.answer),
      ...(typeof fauquier!.jurisdictionIntro === 'string' ? [] : fauquier!.jurisdictionIntro),
      ...fauquier!.jobs.map((job) => ({ text: job.summary, sources: job.sources })),
      ...fauquier!.steps,
      ...fauquier!.faqs.flatMap((faq) => typeof faq.answer === 'string' ? [] : faq.answer),
    ];
    for (const part of townCited) {
      if (part.sources.some((id) => id.startsWith('warrenton-'))) {
        expect(part.text, part.text).not.toMatch(/Fauquier County|county parcel|check with the county/i);
      }
    }
  });

  it('links only to live service, area, and blog pages', () => {
    const serviceSlugs = new Set<string>(SERVICES.map((s) => s.slug));
    const areaSlugs = new Set(ALL_SERVICE_AREAS.map((a) => a.slug));
    const postSlugs = new Set(getAllPosts().map((p) => p.slug));
    for (const g of PERMIT_GUIDES) {
      for (const j of g.jobs) {
        if (j.service) {
          expect(serviceSlugs.has(j.service), j.service).toBe(true);
          expect(serviceLinkFor(j.service)).not.toBeNull();
        }
      }
      for (const a of g.areaSlugs) expect(areaSlugs.has(a), `${g.slug}: ${a}`).toBe(true);
      for (const p of g.relatedPosts) expect(postSlugs.has(p), `${g.slug}: ${p}`).toBe(true);
    }
  });

  it('follows the site copy rules', () => {
    for (const g of PERMIT_GUIDES) {
      const text = allText(g);
      // No prices or fee amounts; the official pages carry those.
      expect(text, g.slug).not.toMatch(/\$\s?\d/);
      // No turnaround promises.
      expect(text, g.slug).not.toMatch(/\b\d+\s*(?:-|–|to)?\s*\d*\s*(?:business\s+)?(?:days?|weeks?)\b/i);
      // Site visits are free; nothing reads as a paid estimate.
      expect(text, g.slug).not.toMatch(/estimate fee|consultation fee|trip charge/i);
      expect(text, g.slug).not.toMatch(/inspiration/i);
      // No Maryland license caveats and no invented credentials.
      expect(text, g.slug).not.toMatch(/MHIC|not licensed|unlicensed in|license pending|award-winning/i);
      if (g.state !== 'PA') expect(text, g.slug).not.toMatch(/certified/i);
      expect(text, g.slug).not.toMatch(/(?:we|our team|Real Elite) (?:are|is) certified/i);
      expect(text, g.slug).not.toMatch(/veteran[-\s]owned|VOSB/i);
    }
  });
});

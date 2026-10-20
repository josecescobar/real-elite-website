/**
 * The four quick wins from the 2026-10-20 competitor teardown:
 *   1. /warranty, built only from published, owner-approved wording.
 *   2. "Text us a photo" on the service hubs and the consultation page.
 *   3. More towns (Maryland, Arlington, Fairfax) in the consultation form.
 *   4. A free, ungated, printable cost guide at /cost-guide.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import fs from 'node:fs';
import path from 'node:path';
import { OPERATIONAL_CLAIMS } from '@/lib/claims';
import { FORBIDDEN_VETERAN_CLAIMS } from '@/lib/__tests__/forbidden-claim-terms';
import { ALL_SERVICE_AREAS, BUSINESS, UTILITY_LINKS } from '@/lib/constants';
import { ESTIMATE_SMS_HREF } from '@/lib/estimate-sms';
import { FREE_FIRST_VISIT_SENTENCE, isProjectTrustPage } from '@/lib/project-trust';
import { INVESTMENT_GUIDE } from '@/lib/investment-guide';
import { SERVICE_DATA } from '@/lib/services-data';
import { costArticles, serviceRangeSections } from '@/lib/cost-guide';
import { HANDOVER_PACKAGE } from '@/lib/warranty';
import { TOWNS } from '@/components/consultation/LuxuryConsultationForm';

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('@/lib/analytics', () => ({
  trackEvent: vi.fn(),
  trackEstimateStep: vi.fn(),
  trackLead: vi.fn(),
  trackCostGuideDownload: vi.fn(),
}));

afterEach(() => cleanup());

const ALL_CLAIMS = [...OPERATIONAL_CLAIMS, ...FORBIDDEN_VETERAN_CLAIMS];

/** Every registered or forbidden claim that matches the text. */
function claimsIn(text: string): string[] {
  return ALL_CLAIMS.filter((c) => c.patterns.some((p) => p.test(text))).map((c) => c.id);
}

/** Words that would turn the page into a term the owner has not set. */
const INVENTED_TERMS = [
  /\b\d+[- ](?:year|yr|month)s?\b/i,
  /\b(?:one|two|three|five|ten)[- ]years?\b/i,
  /lifetime/i,
  /guarantee/i,
  /\bwithin \d+/i,
  /inspiration/i,
  /brambleton/i,
  /estimate fee/i,
];

describe('/warranty', () => {
  it('publishes no registered, retracted or forbidden claim', async () => {
    const { default: WarrantyPage } = await import('@/app/warranty/page');
    const { container } = render(<WarrantyPage />);
    expect(claimsIn(container.textContent ?? '')).toEqual([]);
  });

  it('states no warranty length, guarantee or response window', async () => {
    const { default: WarrantyPage } = await import('@/app/warranty/page');
    const { container } = render(<WarrantyPage />);
    const text = container.textContent ?? '';
    for (const re of INVENTED_TERMS) expect(text, String(re)).not.toMatch(re);
  });

  it('points to the written agreement, the free visit and Maryland', async () => {
    const { default: WarrantyPage } = await import('@/app/warranty/page');
    const { container } = render(<WarrantyPage />);
    const text = container.textContent ?? '';
    expect(text).toContain('Review the proposed scope and warranty terms before signing.');
    expect(text).toContain(FREE_FIRST_VISIT_SENTENCE);
    expect(text).toContain('Maryland');
    for (const item of HANDOVER_PACKAGE) expect(text).toContain(item);
  });

  it('is linked from the footer and the process page', async () => {
    expect(UTILITY_LINKS.map((l) => l.href)).toContain('/warranty');
    const { default: ProcessPage } = await import('@/app/process/page');
    render(<ProcessPage />);
    expect(screen.getByRole('link', { name: /warranty page/i })).toHaveAttribute('href', '/warranty');
  });

  it('keeps the process handover list unchanged', async () => {
    const { default: ProcessPage } = await import('@/app/process/page');
    const { container } = render(<ProcessPage />);
    for (const item of HANDOVER_PACKAGE) expect(container.textContent).toContain(item);
  });
});

describe('Text us a photo', () => {
  const serviceSlugs = Object.keys(SERVICE_DATA).filter((slug) =>
    fs.existsSync(path.join(process.cwd(), 'src/app/services', slug, 'page.tsx')),
  );

  it('appears on every service hub, texting the number the site already advertises', async () => {
    expect(serviceSlugs.length).toBeGreaterThanOrEqual(10);
    const { default: ServicePageTemplate } = await import('@/components/services/ServicePageTemplate');
    for (const slug of serviceSlugs) {
      const pageSource = fs.readFileSync(path.join(process.cwd(), 'src/app/services', slug, 'page.tsx'), 'utf8');
      expect(pageSource, slug).toContain('<ServicePageTemplate');
      const el = await ServicePageTemplate({ data: SERVICE_DATA[slug] });
      const { unmount } = render(el);
      const heading = screen.getByRole('heading', { name: /text us a photo/i });
      const block = heading.closest('aside')!;
      const sms = Array.from(block.querySelectorAll('a')).find((a) => a.getAttribute('href')?.startsWith('sms:'));
      expect(sms, slug).toBeDefined();
      expect(sms!.getAttribute('href')).toBe(ESTIMATE_SMS_HREF);
      expect(sms!.textContent).toBe(BUSINESS.phone);
      unmount();
    }
  }, 60_000);

  it('appears on the design consultation page with a link to its form', async () => {
    const { default: DesignPage } = await import('@/app/design-consultation/page');
    render(<DesignPage />);
    const block = screen.getByRole('heading', { name: /text us a photo/i }).closest('aside')!;
    const hrefs = Array.from(block.querySelectorAll('a')).map((a) => a.getAttribute('href'));
    expect(hrefs).toContain(ESTIMATE_SMS_HREF);
    expect(hrefs).toContain('#consult-form');
  });

  it('makes no reply-time promise', async () => {
    const { default: SendPhotosBlock } = await import('@/components/shared/SendPhotosBlock');
    const { container } = render(<SendPhotosBlock location="test" />);
    const text = container.textContent ?? '';
    expect(claimsIn(text)).toEqual([]);
    expect(text).not.toMatch(/within|same[- ]day|minutes|hours|fastest/i);
  });
});

describe('consultation town list', () => {
  const ORIGINAL_2026_10_20 = [
    'leesburg', 'ashburn', 'brambleton', 'lansdowne', 'middleburg', 'purcellville',
    'round-hill', 'waterford', 'loudoun-other', 'fairfax', 'panhandle', 'other',
  ];
  const values = TOWNS.map((t) => t.value as string);

  it('keeps every original option', () => {
    for (const v of ORIGINAL_2026_10_20) expect(values).toContain(v);
  });

  it('has unique values', () => {
    expect(new Set(values).size).toBe(values.length);
  });

  it('adds Maryland towns, Arlington and Fairfax-area towns', () => {
    const labels = TOWNS.map((t) => t.label as string);
    expect(labels.filter((l) => l.endsWith(', MD')).length).toBeGreaterThanOrEqual(8);
    expect(labels).toContain('Arlington');
    expect(labels).toContain('City of Fairfax');
    expect(labels).toContain('Elsewhere in Maryland');
  });

  it('uses only towns that are already active in the service-area data', () => {
    const generic = /^(Elsewhere|Somewhere|Eastern Panhandle|Fairfax County$)/;
    for (const t of TOWNS) {
      const label = t.label as string;
      if (generic.test(label)) continue;
      const city = label.replace(/^City of /, '').replace(/, MD$/, '');
      const state = label.endsWith(', MD') ? 'MD' : 'VA';
      const match = ALL_SERVICE_AREAS.find((a) => a.city === city && a.state === state);
      expect(match, label).toBeDefined();
    }
  });

  it('adds no new Brambleton option', () => {
    expect(values.filter((v) => v.includes('brambleton'))).toEqual(['brambleton']);
  });
});

describe('/cost-guide', () => {
  const MONEY = /\$\d[\d,]*(?:\.\d+)?[Kk]?\+?/g;

  function publishedFigures(): Set<string> {
    const out = new Set<string>();
    const add = (s: string | undefined) => (s?.match(MONEY) ?? []).forEach((f) => out.add(f));
    for (const c of INVESTMENT_GUIDE) {
      add(c.typical);
      c.tiers.forEach((t) => {
        add(t.range);
        add(t.includes);
      });
      c.drivers.forEach(add);
      add(c.summary);
    }
    for (const s of Object.values(SERVICE_DATA)) {
      if (!s.investment || isProjectTrustPage(s.slug)) continue;
      add(s.investment.startingAt);
      add(s.investment.note);
      s.investment.tiers.forEach((t) => {
        add(t.range);
        add(t.notes);
      });
    }
    costArticles().forEach((a) => add(a.title));
    return out;
  }

  it('prints only dollar figures the site already publishes', async () => {
    const { default: CostGuidePage } = await import('@/app/cost-guide/page');
    const { container } = render(<CostGuidePage />);
    const allowed = publishedFigures();
    const shown = (container.textContent ?? '').match(MONEY) ?? [];
    expect(shown.length).toBeGreaterThan(20);
    for (const f of shown) expect(allowed.has(f), f).toBe(true);
  });

  it('skips SERVICE_DATA tiers that the kitchen, bath and basement hubs do not render', () => {
    const slugs = serviceRangeSections().map((s) => s.slug);
    expect(slugs).not.toContain('kitchens');
    expect(slugs).not.toContain('bathrooms');
    expect(slugs).not.toContain('basements');
    for (const s of serviceRangeSections()) {
      expect(fs.existsSync(path.join(process.cwd(), 'src/app/services', s.slug, 'page.tsx')), s.href).toBe(true);
    }
  });

  it('has no email gate and offers a direct Save as PDF', async () => {
    const print = vi.fn();
    vi.stubGlobal('print', print);
    const { default: CostGuidePage } = await import('@/app/cost-guide/page');
    const { container } = render(<CostGuidePage />);
    expect(container.querySelector('form, input[type="email"]')).toBeNull();
    fireEvent.click(screen.getAllByRole('button', { name: /download the pdf/i })[0]);
    expect(print).toHaveBeenCalledOnce();
    vi.unstubAllGlobals();
  });

  it('carries the free site visit message, Maryland, and no forbidden claims', async () => {
    const { default: CostGuidePage } = await import('@/app/cost-guide/page');
    const { container } = render(<CostGuidePage />);
    const text = container.textContent ?? '';
    expect(text).toContain(FREE_FIRST_VISIT_SENTENCE);
    expect(text).toContain('Maryland');
    expect(text).not.toMatch(/estimate fee|inspiration/i);
    expect(claimsIn(text)).toEqual([]);
  });

  it('links every published cost article and is offered from /investment and the footer', async () => {
    const { default: CostGuidePage } = await import('@/app/cost-guide/page');
    render(<CostGuidePage />);
    for (const a of costArticles()) {
      expect(screen.getByRole('link', { name: a.title })).toHaveAttribute('href', `/blog/${a.slug}`);
    }
    cleanup();
    expect(UTILITY_LINKS.map((l) => l.href)).toContain('/cost-guide');
    const { default: InvestmentPage } = await import('@/app/investment/page');
    render(<InvestmentPage />);
    expect(screen.getByRole('link', { name: /get the free cost guide/i })).toHaveAttribute('href', '/cost-guide');
  });
});

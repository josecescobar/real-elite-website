import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import CityPageTemplate from '@/components/services/CityPageTemplate';
import {
  ALL_SERVICE_AREAS,
  CITY_DATA,
  STAGED_SERVICE_AREAS,
  areaHeroLane,
  areaQuotesSameWeek,
  areaRegionLabel,
  getServiceArea,
} from '@/lib/constants';

vi.mock('next/link', () => ({
  default: ({ children, ...props }: { children: React.ReactNode; [k: string]: unknown }) => (
    <a {...props}>{children}</a>
  ),
}));

vi.mock('next/image', () => ({
  default: ({ alt }: { alt: string }) => <span role="img" aria-label={alt} />,
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
  notFound: vi.fn(),
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

const WV_TOWNS = ['harpers-ferry-wv', 'kearneysville-wv', 'bunker-hill-wv'] as const;

const HELD_OUT = ['gerrardstown-wv', 'shenandoah-junction-wv', 'summit-point-wv'] as const;

function pageMarkup(slug: string): { text: string; html: string } {
  const city = getServiceArea(slug);
  const data = CITY_DATA[slug];
  const { container } = render(<CityPageTemplate city={city!} data={data} />);
  return { text: container.textContent ?? '', html: container.innerHTML };
}

describe('West Virginia towns checked on REA-402', () => {
  it('publishes only the three checked towns', () => {
    for (const slug of WV_TOWNS) {
      const area = getServiceArea(slug);
      expect(area?.status, slug).toBe('active');
      expect(area?.state, slug).toBe('WV');
      expect(area?.market, slug).toBe('home');
      expect(areaRegionLabel(area!), slug).toBe('Eastern Panhandle');
      expect(areaHeroLane(area!), slug).toBe('estimate');
      expect(areaQuotesSameWeek(area!), slug).toBe(false);
      expect(ALL_SERVICE_AREAS.some((row) => row.slug === slug), slug).toBe(true);
      expect(STAGED_SERVICE_AREAS.some((row) => row.slug === slug), slug).toBe(false);
    }
    for (const slug of HELD_OUT) {
      expect(getServiceArea(slug), slug).toBeNull();
    }
  });

  it('keeps the three descriptions distinct and free of banned claims', () => {
    const descriptions = WV_TOWNS.map((slug) => CITY_DATA[slug].description);
    expect(new Set(descriptions).size).toBe(descriptions.length);
    for (const slug of WV_TOWNS) {
      const body = `${CITY_DATA[slug].description} ${CITY_DATA[slug].faqs?.map((faq) => faq.answer).join(' ')}`;
      expect(body, slug).not.toMatch(/veteran-owned|24\/7|years of experience|\bawards?\b/i);
      expect(body, slug).not.toMatch(/Sunridge|Powhatan|Dominion Valley/i);
    }
  });

  it('splits Harpers Ferry the town from ZIP 25425', () => {
    const { text, html } = pageMarkup('harpers-ferry-wv');
    expect(text).toContain('ZIP 25425');
    expect(text).toContain('13,332');
    expect(text).toContain('1986');
    expect(text).toContain('Jefferson County Office of Building Permits and Inspections');
    expect(text).toContain('(304) 725-2998');
    expect(text).toContain('Article 1701');
    expect(text).toContain('Historic Landmarks Commission');
    expect(text).toContain('National Park Service site is not the private-permit office');
    expect(text).toContain('WV Contractor License WV062432');
    expect(text).not.toContain('on-site visits are typically scheduled within the same week');
    expect(html).toContain('/blog/deck-permits-berkeley-jefferson-county-wv-2026');
  });

  it('treats Kearneysville as unincorporated Jefferson County', () => {
    const { text } = pageMarkup('kearneysville-wv');
    expect(text).toContain('not a town');
    expect(text).toContain('ZIP 25430');
    expect(text).toContain('8,954');
    expect(text).toContain('1987');
    expect(text).toContain('(304) 725-2998');
    expect(text).toContain('finished basements');
    expect(text).not.toContain('on-site visits are typically scheduled within the same week');
  });

  it('keeps Bunker Hill on the Berkeley County permit desk', () => {
    const { text, html } = pageMarkup('bunker-hill-wv');
    expect(text).toContain('ZIP 25413');
    expect(text).toContain('9,618');
    expect(text).toContain('2001');
    expect(text).toContain('400 West Stephen Street, Suite 202');
    expect(text).toContain('(304) 264-1966');
    expect(text).toContain('onestop.berkeleywv.org');
    expect(text).toContain('Not at the ZIP centroid');
    expect(text).not.toContain('on-site visits are typically scheduled within the same week');
    expect(html).toContain('/blog/deck-permits-berkeley-jefferson-county-wv-2026');
  });
});

import { describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach } from 'vitest';
import { INVESTMENT_GUIDE } from '@/lib/investment-guide';
import { SERVICE_DATA } from '@/lib/services-data';
import {
  FINANCING_DISCLAIMER,
  FREE_FIRST_VISIT_SENTENCE,
  PROJECT_TRUST_FAQ,
  PROJECT_TRUST_PHOTOS,
  PROJECT_TRUST_SLUGS,
  TIMELINE_ANSWER,
  costAnswerForService,
  faqPageSchema,
  financingCostAnswer,
  financingTrustFaqs,
  investmentCategoryFor,
} from '@/lib/project-trust';
import ProjectInvestmentBand from '@/components/services/ProjectInvestmentBand';
import Testimonials from '@/components/home/Testimonials';
import { BUSINESS } from '@/lib/constants';

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

afterEach(() => cleanup());

const MONEY = /\$\d[\d,]*(?:\.\d+)?[Kk]?\+?/g;

function figures(text: string): string[] {
  return text.match(MONEY) ?? [];
}

function allowedFigures(slug: (typeof PROJECT_TRUST_SLUGS)[number]): Set<string> {
  const category = investmentCategoryFor(slug);
  const allowed = new Set<string>();
  for (const figure of [...figures(category.typical), ...category.tiers.flatMap((tier) => figures(tier.range))]) {
    allowed.add(figure);
  }
  return allowed;
}

describe('project trust copy', () => {
  it('keeps the free-visit sentence and withholds an estimate fee', () => {
    expect(FREE_FIRST_VISIT_SENTENCE).toBe(
      'The call and the first site visit are at no charge. They exist to decide, on both sides, whether the project is a fit before anyone commits to a design phase.',
    );
    const blob = [
      FREE_FIRST_VISIT_SENTENCE,
      TIMELINE_ANSWER,
      FINANCING_DISCLAIMER,
      financingCostAnswer(),
      ...PROJECT_TRUST_SLUGS.map((slug) => costAnswerForService(slug)),
    ].join('\n');
    expect(blob).not.toMatch(/estimate fee|MHIC|Maryland license/i);
  });

  it('uses only investment-guide figures in the four answers', () => {
    for (const slug of PROJECT_TRUST_SLUGS) {
      const allowed = allowedFigures(slug);
      for (const figure of figures(costAnswerForService(slug))) {
        expect(allowed.has(figure), `${slug} ${figure}`).toBe(true);
      }
      expect(figures(PROJECT_TRUST_FAQ.visit.answer)).toEqual([]);
      expect(figures(PROJECT_TRUST_FAQ.permits.answer)).toEqual([]);
      expect(figures(TIMELINE_ANSWER)).toEqual([]);
      expect(TIMELINE_ANSWER).toContain('two to eight weeks');
      expect(TIMELINE_ANSWER).not.toMatch(/6[–-]12/);
    }
  });

  it('builds FAQPage schema whose answers match the visible questions', () => {
    const items = financingTrustFaqs();
    expect(items.map((item) => item.question)).toEqual([
      'What does a project usually cost?',
      'Is the first visit free?',
      'Do you pull the county and HOA permits?',
      'How long does a typical job take?',
    ]);
    const schema = faqPageSchema(items);
    expect(schema['@type']).toBe('FAQPage');
    expect(schema.mainEntity).toHaveLength(4);
    schema.mainEntity.forEach((node, index) => {
      expect(node['@type']).toBe('Question');
      expect(node.name).toBe(items[index].question);
      expect(node.acceptedAnswer['@type']).toBe('Answer');
      expect(node.acceptedAnswer.text).toBe(items[index].answer);
    });
    const guideText = INVESTMENT_GUIDE.filter((category) =>
      ['lower-levels', 'kitchens', 'primary-suites'].includes(category.slug),
    )
      .map((category) => `${category.title} ${category.typical}`)
      .join('; ');
    expect(items[0].answer).toContain(guideText);
  });
});

describe('project investment band', () => {
  it.each(PROJECT_TRUST_SLUGS)('%s shows three ranges, three photos, and one investment link', (slug) => {
    const category = investmentCategoryFor(slug);
    render(<ProjectInvestmentBand serviceSlug={slug} />);
    for (const tier of category.tiers.slice(0, 3)) {
      expect(screen.getByText(tier.name)).toBeInTheDocument();
      expect(screen.getByText(tier.range)).toBeInTheDocument();
    }
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(3);
    expect(images.map((image) => image.getAttribute('src'))).toEqual(
      PROJECT_TRUST_PHOTOS[slug].map((photo) => photo.src),
    );
    const investmentLinks = screen.getAllByRole('link', { name: 'See the investment table' });
    expect(investmentLinks).toHaveLength(1);
    expect(investmentLinks[0]).toHaveAttribute('href', `/investment#${category.slug}`);
    expect(screen.getByRole('link', { name: 'Financing options' })).toHaveAttribute('href', '/financing');
    expect(screen.queryByText(/design inspiration/i)).not.toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/\$15k|\$28k|\$35k|\$28,000|\$15,000|\$35,000/i);
  });
});

describe('service hub FAQs', () => {
  it('puts cost, free visit, permits, and timeline on kitchen, bath, and basement', () => {
    for (const slug of PROJECT_TRUST_SLUGS) {
      const faqs = SERVICE_DATA[slug].faqs;
      const text = faqs.map((faq) => `${faq.question} ${faq.answer}`).join('\n');
      expect(text).toContain(FREE_FIRST_VISIT_SENTENCE);
      expect(text).toContain('Do you pull the county and HOA permits?');
      expect(text).toContain('two to eight weeks');
      expect(text).toContain(costAnswerForService(slug));
      expect(text).not.toMatch(/6[–-]12 weeks/);
      const schema = faqPageSchema(faqs);
      expect(schema['@type']).toBe('FAQPage');
      expect(schema.mainEntity.length).toBe(faqs.length);
    }
  });
});

describe('homepage reviews line', () => {
  it('keeps the Thumbtack quote, links Google, and prints no star rating', () => {
    render(<Testimonials />);
    expect(screen.getByText(/Super fast & easy to schedule with/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'via Thumbtack' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Google reviews' })).toHaveAttribute(
      'href',
      BUSINESS.social.google,
    );
    expect(screen.queryByRole('img', { name: /out of 5 stars/i })).not.toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/repair of roof/);
  });
});

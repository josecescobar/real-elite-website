import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { FAQ_FINANCING_ANSWER, FINANCING, HOME_FAQ } from '@/lib/constants';
import {
  financingOfferAnswer,
  hasFinancingPartner,
  type FinancingPartnerConfig,
} from '@/lib/financing-copy';

const NO_PARTNER = {
  applyUrl: null,
  partnerName: null,
} as const;

const STUB_PARTNER = {
  applyUrl: 'https://example.com/apply',
  partnerName: 'GreenSky',
} as const;

const NAME_ONLY: FinancingPartnerConfig = { applyUrl: null, partnerName: 'GreenSky' };

const NEUTRAL =
  'We do not have a financing partner listed yet. Ask about payment options at your free estimate, and see the Financing page for current details.';

function homeFinancingAnswer(): string {
  const item = HOME_FAQ.find((faq) => faq.question === 'Do you offer financing?');
  if (!item) throw new Error('homepage financing FAQ is missing');
  return item.answer;
}

describe('financing offer answers', () => {
  it('does not claim partners when FINANCING has no partner', () => {
    expect(FINANCING.applyUrl).toBeNull();
    expect(FINANCING.partnerName).toBeNull();
    expect(hasFinancingPartner(NO_PARTNER)).toBe(false);

    const live = [FAQ_FINANCING_ANSWER, homeFinancingAnswer()];
    const evaluated = [
      financingOfferAnswer(NO_PARTNER, 'faq'),
      financingOfferAnswer(NO_PARTNER, 'home'),
    ];

    for (const text of [...live, ...evaluated]) {
      expect(text).toBe(NEUTRAL);
      expect(text).not.toContain('financing partners');
      expect(text).not.toContain('several');
    }

    const faqPage = readFileSync(path.join(process.cwd(), 'src/app/faq/page.tsx'), 'utf8');
    expect(faqPage).toContain('FAQ_FINANCING_ANSWER');
    expect(faqPage).not.toContain('financing partners');
    expect(faqPage).not.toContain('several');
  });

  it('names the partner on both answers when one is set', () => {
    expect(hasFinancingPartner(STUB_PARTNER)).toBe(true);
    expect(hasFinancingPartner(NAME_ONLY)).toBe(false);

    for (const surface of ['faq', 'home'] as const) {
      const text = financingOfferAnswer(STUB_PARTNER, surface);
      expect(text).toContain('GreenSky');
      expect(text).not.toContain('financing partners');
      expect(text).not.toContain('several');
    }

    expect(financingOfferAnswer(STUB_PARTNER, 'faq')).toContain(
      "We'll walk you through the options on the free estimate before you commit.",
    );
    expect(financingOfferAnswer(STUB_PARTNER, 'home')).toContain(
      "We'll walk you through the options on your free estimate so the numbers make sense before you commit.",
    );
  });
});

import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import DeckPermitHoaBlock from '@/components/services/DeckPermitHoaBlock';
import {
  deckPermitHoaBlocks,
  deckPermitHoaForCity,
  deckPermitHoaPlainText,
} from '@/lib/deck-permit-hoa';

const FORBIDDEN = /warranty|Trex|TimberTech|\$|MHIC|Maryland license/i;

describe('deck permit + HOA block', () => {
  it('renders on a deck page in a guided county and links that guide', () => {
    const block = deckPermitHoaForCity('mclean-va');
    expect(block?.guideHref).toBe('/permit-guides/fairfax-county-va');
    expect(deckPermitHoaForCity('burke-va')?.guideSlug).toBe('fairfax-county-va');
    render(<DeckPermitHoaBlock citySlug="mclean-va" />);
    expect(screen.getByRole('heading', { name: 'Deck permit + HOA steps' })).toBeInTheDocument();
    const link = screen.getByRole('link', { name: /Fairfax County permit guide/i });
    expect(link).toHaveAttribute('href', '/permit-guides/fairfax-county-va');
    expect(screen.getByText(/a county permit is not HOA approval/i)).toBeInTheDocument();
  });

  it('is absent for a town with no permit guide', () => {
    expect(deckPermitHoaForCity('winchester-va')).toBeNull();
    const { container } = render(<DeckPermitHoaBlock citySlug="winchester-va" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('omits the plat and footing line when the guide does not state them', () => {
    const montgomery = deckPermitHoaForCity('potomac-md');
    expect(montgomery?.guideSlug).toBe('montgomery-county-md');
    expect(montgomery?.platText).toBeNull();
    expect(montgomery?.footingText).toBeNull();
    render(<DeckPermitHoaBlock citySlug="potomac-md" />);
    expect(screen.getByRole('link', { name: /Montgomery County permit guide/i })).toHaveAttribute(
      'href',
      '/permit-guides/montgomery-county-md',
    );
    expect(screen.queryByText(/plat|plot plan|footing/i)).not.toBeInTheDocument();
  });

  it('includes a cited plat line, and a footing line only when that is a separate cited step', () => {
    const fairfax = deckPermitHoaForCity('vienna-va');
    expect(fairfax?.platText).toMatch(/plat/i);
    expect(fairfax?.footingText).toBeNull();

    const arlington = deckPermitHoaForCity('arlington-va');
    expect(arlington?.platText).toMatch(/plat/i);
    expect(arlington?.platText).toMatch(/footing/i);

    const loudoun = deckPermitHoaForCity('ashburn-va');
    expect(loudoun?.platText).toMatch(/plat/i);
    expect(loudoun?.footingText).toMatch(/footing/i);
  });

  it('does not use forbidden words in any county block', () => {
    for (const block of deckPermitHoaBlocks()) {
      expect(deckPermitHoaPlainText(block), block.guideSlug).not.toMatch(FORBIDDEN);
    }
    const { container } = render(<DeckPermitHoaBlock />);
    expect(container.textContent ?? '').not.toMatch(FORBIDDEN);
    expect(screen.getAllByRole('link').length).toBeGreaterThan(0);
  });
});

import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import AnswerText from './AnswerText';

describe('AnswerText', () => {
  it('renders an answer with no markdown as plain text', () => {
    render(<AnswerText text="A plain answer with no citation." />);
    expect(screen.getByText('A plain answer with no citation.')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('turns a markdown citation into a link', () => {
    render(
      <AnswerText text="[EA Home Design](https://eahomedesign.com/home-additions-loudoun-county/) publishes the range." />
    );
    const link = screen.getByRole('link', { name: 'EA Home Design' });
    expect(link).toHaveAttribute('href', 'https://eahomedesign.com/home-additions-loudoun-county/');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(screen.getByText(/publishes the range/)).toBeInTheDocument();
  });

  it('leaves an unsafe href as text', () => {
    const raw = 'See [this](javascript:alert(1)) later.';
    render(<AnswerText text={raw} />);
    expect(screen.getByText(raw)).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});

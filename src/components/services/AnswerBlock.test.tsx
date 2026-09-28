import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AnswerBlock from './AnswerBlock';

describe('AnswerBlock', () => {
  it('renders the answer text', () => {
    render(<AnswerBlock text="Family-run roofing across WV and VA." />);
    expect(
      screen.getByText('Family-run roofing across WV and VA.')
    ).toBeInTheDocument();
  });

  it('shows the default eyebrow inside an accessible region', () => {
    render(<AnswerBlock text="Some answer." />);
    expect(screen.getByText('In short')).toBeInTheDocument();
    expect(
      screen.getByRole('region', { name: /quick answer/i })
    ).toBeInTheDocument();
  });

  it('supports a custom eyebrow', () => {
    render(<AnswerBlock text="X" eyebrow="The short answer" />);
    expect(screen.getByText('The short answer')).toBeInTheDocument();
  });

  it('renders nothing when the answer text is empty or blank', () => {
    const { container: empty } = render(<AnswerBlock text="" />);
    expect(empty).toBeEmptyDOMElement();

    const { container: blank } = render(<AnswerBlock text="   " />);
    expect(blank).toBeEmptyDOMElement();
  });
});

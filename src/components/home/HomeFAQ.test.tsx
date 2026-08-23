import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import HomeFAQ from './HomeFAQ';
import { HOME_FAQ } from '@/lib/constants';

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('HomeFAQ', () => {
  it('renders questions as native details/summary (no client JS)', () => {
    const { container } = render(<HomeFAQ />);
    const items = container.querySelectorAll('details');
    expect(items.length).toBe(HOME_FAQ.length);
    expect(items[0]).toHaveAttribute('open');
    expect(screen.getByText(HOME_FAQ[0].question)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /all faqs/i })).toHaveAttribute('href', '/faq');
  });
});

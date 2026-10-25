import { afterEach, describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import type { ReactNode } from 'react';
import GoogleTagManager from './GoogleTagManager';

const nav = vi.hoisted(() => ({ pathname: '/' as string | null }));
vi.mock('next/navigation', () => ({ usePathname: () => nav.pathname }));
vi.mock('next/script', () => ({
  default: ({ id, children }: { id?: string; children?: ReactNode }) => (
    <script data-testid={id}>{children}</script>
  ),
}));

afterEach(() => {
  nav.pathname = '/';
});

describe('GoogleTagManager', () => {
  it('renders the container on marketing pages', () => {
    const { container } = render(<GoogleTagManager gtmId="GTM-TEST" />);
    expect(container.querySelector('[data-testid="gtm-init"]')?.textContent).toContain('GTM-TEST');
  });

  it.each(['/sales', '/review-request'])('renders nothing on %s (audit M1)', (path) => {
    nav.pathname = path;
    const { container } = render(<GoogleTagManager gtmId="GTM-TEST" />);
    expect(container.innerHTML).toBe('');
  });

  it('renders nothing without a container id', () => {
    const { container } = render(<GoogleTagManager />);
    expect(container.innerHTML).toBe('');
  });
});

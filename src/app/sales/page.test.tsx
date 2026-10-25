import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

const centerProps = vi.hoisted(() => ({ last: null as Record<string, unknown> | null }));
vi.mock('@/components/admin/SalesCommandCenter', () => ({
  default: (props: Record<string, unknown>) => {
    centerProps.last = props;
    return <div data-testid="center" />;
  },
}));

describe('/sales page (audit M1)', () => {
  it('is noindex', async () => {
    const { metadata } = await import('./page');
    expect(metadata.robots).toMatchObject({ index: false, follow: false });
  });

  it('ignores ?key= and preloads no leads server-side', async () => {
    const { default: SalesCommandPage } = await import('./page');
    const ui = await SalesCommandPage({ searchParams: Promise.resolve({ key: 'leaked', bucket: 'hot' } as { bucket?: string }) });
    render(ui);
    expect(screen.getByTestId('center')).toBeInTheDocument();
    expect(centerProps.last).toEqual({ initialBucket: 'hot' });
    expect(JSON.stringify(centerProps.last)).not.toContain('leaked');
  });

  it('falls back to "all" for an unknown bucket', async () => {
    const { default: SalesCommandPage } = await import('./page');
    render(await SalesCommandPage({ searchParams: Promise.resolve({ bucket: '<script>' }) }));
    expect(centerProps.last).toEqual({ initialBucket: 'all' });
  });
});

describe('/review-request page', () => {
  it('is noindex', async () => {
    const { metadata } = await import('../review-request/page');
    expect(metadata.robots).toMatchObject({ index: false, follow: false });
  });
});

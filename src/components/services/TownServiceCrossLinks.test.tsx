import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';

vi.mock('next/link', () => ({
  default: ({ children, ...props }: { children: React.ReactNode; [k: string]: unknown }) => (
    <a {...props}>{children}</a>
  ),
}));

const { TownServiceLinksForTown, TownServiceLinksForService } = await import(
  '@/components/services/TownServiceCrossLinks'
);

function hrefs(node: HTMLElement): string[] {
  return [...node.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')!);
}

describe('town-service cross links', () => {
  it('links Ashburn and Leesburg to their basement and kitchen pages', () => {
    const ashburn = render(<TownServiceLinksForTown townSlug="ashburn-va" />);
    expect(hrefs(ashburn.container).sort()).toEqual([
      '/service-areas/ashburn-va/basements',
      '/service-areas/ashburn-va/kitchens',
    ]);
    ashburn.unmount();

    const leesburg = render(<TownServiceLinksForTown townSlug="leesburg-va" />);
    expect(hrefs(leesburg.container).sort()).toEqual([
      '/service-areas/leesburg-va/basements',
      '/service-areas/leesburg-va/kitchens',
    ]);
    leesburg.unmount();
  });

  it('does not add the block on a town without these pages', () => {
    const { container } = render(<TownServiceLinksForTown townSlug="martinsburg-wv" />);
    expect(container.querySelector('a')).toBeNull();
  });

  it('links the basement and kitchen services to both towns', () => {
    const basements = render(<TownServiceLinksForService serviceSlug="basements" />);
    expect(hrefs(basements.container).sort()).toEqual([
      '/service-areas/ashburn-va/basements',
      '/service-areas/leesburg-va/basements',
    ]);
    basements.unmount();

    const kitchens = render(<TownServiceLinksForService serviceSlug="kitchens" />);
    expect(hrefs(kitchens.container).sort()).toEqual([
      '/service-areas/ashburn-va/kitchens',
      '/service-areas/leesburg-va/kitchens',
    ]);
    kitchens.unmount();
  });

  it('does not add the block on a service without these pages', () => {
    const { container } = render(<TownServiceLinksForService serviceSlug="roofing" />);
    expect(container.querySelector('a')).toBeNull();
  });
});

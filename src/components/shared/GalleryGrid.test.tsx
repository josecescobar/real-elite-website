import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GalleryGrid from './GalleryGrid';

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) => (
    <img src={src} alt={alt} {...props} />
  ),
}));

vi.mock('lucide-react', () => ({
  ArrowLeft: () => <span>←</span>,
  ArrowRight: () => <span>→</span>,
  X: () => <span>×</span>,
}));

vi.mock('./Container', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/lib/constants', () => ({
  GALLERY_IMAGES: [
    { src: '/img/roof1.jpg', alt: 'Roof project 1', category: 'Roofing' },
    { src: '/img/roof2.jpg', alt: 'Roof project 2', category: 'Roofing' },
    { src: '/img/deck1.jpg', alt: 'Deck project 1', category: 'Decks' },
    { src: '/img/siding1.jpg', alt: 'Siding project 1', category: 'Siding' },
  ],
}));

describe('GalleryGrid', () => {
  it('renders all images when "All" is selected (default)', () => {
    render(<GalleryGrid />);
    expect(screen.getAllByRole('img')).toHaveLength(4);
  });

  it('renders all category filter buttons', () => {
    render(<GalleryGrid />);
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Roofing' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Decks' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Siding' })).toBeInTheDocument();
  });

  it('filters to only Roofing images when Roofing is clicked', async () => {
    const user = userEvent.setup();
    render(<GalleryGrid />);

    await user.click(screen.getByRole('button', { name: 'Roofing' }));

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute('alt', 'Roof project 1');
    expect(images[1]).toHaveAttribute('alt', 'Roof project 2');
  });

  it('filters to only Decks images when Decks is clicked', async () => {
    const user = userEvent.setup();
    render(<GalleryGrid />);

    await user.click(screen.getByRole('button', { name: 'Decks' }));

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(1);
    expect(images[0]).toHaveAttribute('alt', 'Deck project 1');
  });

  it('shows all images again when "All" is clicked after filtering', async () => {
    const user = userEvent.setup();
    render(<GalleryGrid />);

    await user.click(screen.getByRole('button', { name: 'Roofing' }));
    expect(screen.getAllByRole('img')).toHaveLength(2);

    await user.click(screen.getByRole('button', { name: 'All' }));
    expect(screen.getAllByRole('img')).toHaveLength(4);
  });

  it('shows empty state when category has no images', async () => {
    const user = userEvent.setup();
    render(<GalleryGrid />);

    await user.click(screen.getByRole('button', { name: 'Exterior' }));

    expect(screen.queryAllByRole('img')).toHaveLength(0);
    expect(screen.getByText(/no projects in this category/i)).toBeInTheDocument();
  });

  it('sets aria-pressed on the active category button', async () => {
    const user = userEvent.setup();
    render(<GalleryGrid />);

    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Roofing' })).toHaveAttribute('aria-pressed', 'false');

    await user.click(screen.getByRole('button', { name: 'Roofing' }));

    expect(screen.getByRole('button', { name: 'Roofing' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'false');
  });
});

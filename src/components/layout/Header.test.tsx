import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from './Header';

vi.mock('next/link', () => ({
  default: ({ href, children, onClick, ...props }: { href: string; children: React.ReactNode; onClick?: () => void; [key: string]: unknown }) => (
    <a href={href} onClick={onClick} {...props}>{children}</a>
  ),
}));

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) => (
    <img src={src} alt={alt} {...props} />
  ),
}));

vi.mock('lucide-react', () => ({
  Menu: () => <span data-testid="menu-icon">Menu</span>,
  X: () => <span data-testid="x-icon">X</span>,
  ChevronDown: () => <span data-testid="chevron-icon">▼</span>,
}));

vi.mock('@/lib/analytics', () => ({
  trackEvent: vi.fn(),
  trackLead: vi.fn(),
}));

vi.mock('./MegaMenu', () => ({
  default: () => <div data-testid="mega-menu">MegaMenu</div>,
}));

vi.mock('@/lib/constants', () => ({
  NAV_LINKS: [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
  UTILITY_LINKS: [
    { label: 'Our Process', href: '/process' },
    { label: 'Photo Gallery', href: '/gallery' },
  ],
  BUSINESS: {
    phone: '(681) 534-5515',
    phoneRaw: '+16815345515',
  },
  SERVICES_MEGA_MENU: [
    {
      heading: 'Exteriors',
      items: [
        { label: 'Roofing', href: '/services/roofing', description: 'Roof work' },
        { label: 'Siding', href: '/services/siding', description: 'Siding work' },
      ],
    },
  ],
}));

describe('Header', () => {
  it('renders the logo and company name', () => {
    render(<Header />);
    expect(screen.getByAltText('Real Elite Contracting Logo')).toBeInTheDocument();
    expect(screen.getByText('Real Elite')).toBeInTheDocument();
    expect(screen.getByText('Contracting')).toBeInTheDocument();
  });

  it('renders desktop navigation links', () => {
    render(<Header />);
    expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: /about/i })).toHaveAttribute('href', '/about');
    expect(screen.getByRole('link', { name: /contact/i })).toHaveAttribute('href', '/contact');
  });

  it('renders phone call link', () => {
    render(<Header />);
    const callLinks = screen.getAllByRole('link', { name: /call|534-5515/i });
    expect(callLinks.length).toBeGreaterThan(0);
    expect(callLinks[0]).toHaveAttribute('href', 'tel:+16815345515');
  });

  it('renders Free Estimate button', () => {
    render(<Header />);
    const estimateLinks = screen.getAllByRole('link', { name: /free estimate/i });
    expect(estimateLinks.length).toBeGreaterThan(0);
  });

  describe('mobile menu', () => {
    it('does not show mobile menu by default', () => {
      render(<Header />);
      expect(screen.getByTestId('menu-icon')).toBeInTheDocument();
      expect(screen.getByLabelText(/toggle menu/i)).toHaveAttribute('aria-expanded', 'false');
    });

    it('opens mobile menu when toggle button is clicked', async () => {
      const user = userEvent.setup();
      render(<Header />);

      await user.click(screen.getByLabelText(/toggle menu/i));

      expect(screen.getByTestId('x-icon')).toBeInTheDocument();
      expect(screen.getByLabelText(/toggle menu/i)).toHaveAttribute('aria-expanded', 'true');
    });

    it('closes mobile menu when toggle button is clicked again', async () => {
      const user = userEvent.setup();
      render(<Header />);

      await user.click(screen.getByLabelText(/toggle menu/i));
      expect(screen.getByTestId('x-icon')).toBeInTheDocument();

      await user.click(screen.getByLabelText(/toggle menu/i));
      expect(screen.getByTestId('menu-icon')).toBeInTheDocument();
    });

    it('closes mobile menu when a non-Services link is clicked', async () => {
      const user = userEvent.setup();
      render(<Header />);

      await user.click(screen.getByLabelText(/toggle menu/i));
      expect(screen.getByTestId('x-icon')).toBeInTheDocument();

      const aboutLinks = screen.getAllByRole('link', { name: /about/i });
      await user.click(aboutLinks[aboutLinks.length - 1]);

      expect(screen.getByTestId('menu-icon')).toBeInTheDocument();
    });

    it('expands services submenu in mobile menu', async () => {
      const user = userEvent.setup();
      render(<Header />);

      await user.click(screen.getByLabelText(/toggle menu/i));
      await user.click(screen.getByLabelText(/toggle services menu/i));

      expect(screen.getByRole('link', { name: /roofing/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /siding/i })).toBeInTheDocument();
    });
  });
});

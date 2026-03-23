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

vi.mock('@/lib/constants', () => ({
  NAV_LINKS: [
    { label: 'Home', href: '/' },
    {
      label: 'Services',
      href: '/services',
      children: [
        { label: 'Roofing', href: '/services/roofing' },
        { label: 'Siding', href: '/services/siding' },
      ],
    },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
  BUSINESS: {
    phone: '(681) 534-5515',
    phoneRaw: '+16815345515',
  },
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

  it('renders phone call button', () => {
    render(<Header />);
    const callLinks = screen.getAllByRole('link', { name: /call|534-5515/i });
    expect(callLinks.length).toBeGreaterThan(0);
    expect(callLinks[0]).toHaveAttribute('href', 'tel:+16815345515');
  });

  it('renders Book Free Estimate button', () => {
    render(<Header />);
    const estimateLinks = screen.getAllByRole('link', { name: /book free estimate/i });
    expect(estimateLinks.length).toBeGreaterThan(0);
  });

  describe('mobile menu', () => {
    it('does not show mobile menu by default', () => {
      render(<Header />);
      // Mobile nav links are only rendered when menu is open
      // The desktop nav has the links, but mobile menu adds duplicates
      // Check that toggle button shows menu icon
      expect(screen.getByTestId('menu-icon')).toBeInTheDocument();
    });

    it('opens mobile menu when toggle button is clicked', async () => {
      const user = userEvent.setup();
      render(<Header />);

      await user.click(screen.getByLabelText(/toggle menu/i));

      // After opening, the X icon should appear
      expect(screen.getByTestId('x-icon')).toBeInTheDocument();
    });

    it('closes mobile menu when toggle button is clicked again', async () => {
      const user = userEvent.setup();
      render(<Header />);

      // Open
      await user.click(screen.getByLabelText(/toggle menu/i));
      expect(screen.getByTestId('x-icon')).toBeInTheDocument();

      // Close
      await user.click(screen.getByLabelText(/toggle menu/i));
      expect(screen.getByTestId('menu-icon')).toBeInTheDocument();
    });

    it('closes mobile menu when a non-Services link is clicked', async () => {
      const user = userEvent.setup();
      render(<Header />);

      await user.click(screen.getByLabelText(/toggle menu/i));
      expect(screen.getByTestId('x-icon')).toBeInTheDocument();

      // Click About link in mobile menu (get all About links, mobile is the last one)
      const aboutLinks = screen.getAllByRole('link', { name: /about/i });
      await user.click(aboutLinks[aboutLinks.length - 1]);

      expect(screen.getByTestId('menu-icon')).toBeInTheDocument();
    });

    it('expands services submenu in mobile menu', async () => {
      const user = userEvent.setup();
      render(<Header />);

      // Open mobile menu
      await user.click(screen.getByLabelText(/toggle menu/i));

      // Find and click the chevron button to expand services
      const chevronButtons = screen.getAllByTestId('chevron-icon');
      // The mobile chevron is wrapped in a button
      const expandButton = chevronButtons.find(
        (el) => el.closest('button') && !el.closest('nav.hidden')
      );
      expect(expandButton).toBeTruthy();
      await user.click(expandButton!.closest('button')!);

      // Now service children should be visible in mobile menu
      const roofingLinks = screen.getAllByRole('link', { name: /roofing/i });
      expect(roofingLinks.length).toBeGreaterThanOrEqual(2); // desktop dropdown + mobile expanded
    });
  });
});

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
  BUSINESS: {
    phone: '(681) 534-5515',
    phoneRaw: '+16815345515',
  },
}));

vi.mock('@/lib/navigation', () => ({
  PRIMARY_NAV: [
    { label: 'Design-Build', href: '/services', mega: true },
    { label: 'Portfolio', href: '/projects' },
    { label: 'Process', href: '/process' },
    { label: 'Investment', href: '/investment' },
    { label: 'Service Areas', href: '/service-areas' },
    { label: 'About', href: '/about' },
  ],
  NAV_CTA: { label: 'Consultation', href: '/design-consultation' },
  DESIGN_BUILD_MENU: [
    {
      heading: 'Signature Projects',
      items: [
        { label: 'Kitchens', href: '/services/kitchens', description: 'Kitchens' },
        { label: 'Lower Levels & Basements', href: '/services/basements', description: 'Basements' },
      ],
    },
    {
      heading: 'Exteriors & Repairs',
      items: [{ label: 'Roofing', href: '/services/roofing' }],
    },
  ],
  MOBILE_UTILITY_NAV: [
    { label: 'Contact', href: '/contact' },
    { label: 'Instant Roof Quote', href: '/instant-roof-quote' },
  ],
}));

describe('Header', () => {
  it('renders the logo and company name', () => {
    render(<Header />);
    expect(screen.getByAltText('Real Elite Contracting Logo')).toBeInTheDocument();
    expect(screen.getByText('Real Elite')).toBeInTheDocument();
  });

  it('leads the desktop navigation with Design-Build and ends with About', () => {
    render(<Header />);
    const primary = screen.getByRole('navigation', { name: 'Primary' });
    const labels = Array.from(primary.querySelectorAll('a')).map((a) => a.textContent?.trim());
    expect(labels).toEqual([
      'Design-Build▼',
      'Portfolio',
      'Process',
      'Investment',
      'Service Areas',
      'About',
    ]);
    expect(screen.getByRole('link', { name: /portfolio/i })).toHaveAttribute('href', '/projects');
    expect(screen.getByRole('link', { name: /^investment$/i })).toHaveAttribute('href', '/investment');
  });

  it('renders the mega-menu under the Design-Build trigger', () => {
    render(<Header />);
    expect(screen.getByTestId('mega-menu')).toBeInTheDocument();
    const primary = screen.getByRole('navigation', { name: 'Primary' });
    const trigger = Array.from(primary.querySelectorAll('a')).find((a) =>
      a.textContent?.includes('Design-Build')
    );
    expect(trigger).toHaveAttribute('aria-haspopup', 'true');
  });

  it('renders phone call link', () => {
    render(<Header />);
    const callLinks = screen.getAllByRole('link', { name: /call|534-5515/i });
    expect(callLinks.length).toBeGreaterThan(0);
    expect(callLinks[0]).toHaveAttribute('href', 'tel:+16815345515');
  });

  it('puts Text next to Call in the mobile header', () => {
    render(<Header />);
    const text = screen.getByRole('link', { name: /^text$/i });
    expect(text).toHaveAttribute('href', expect.stringContaining('sms:+16815345515'));
    expect(text.getAttribute('href')).toContain('free%20estimate');
  });

  it('renders the Consultation CTA, not a free-estimate button', () => {
    render(<Header />);
    const cta = screen.getAllByRole('link', { name: /consultation/i });
    expect(cta.length).toBeGreaterThan(0);
    expect(cta[0]).toHaveAttribute('href', '/design-consultation');
    expect(screen.queryByRole('link', { name: /free estimate/i })).not.toBeInTheDocument();
  });

  describe('mobile menu', () => {
    it('does not show mobile menu by default', () => {
      render(<Header />);
      expect(screen.getByTestId('menu-icon')).toBeInTheDocument();
      expect(screen.getByLabelText(/open menu/i)).toHaveAttribute('aria-expanded', 'false');
    });

    it('opens mobile menu when toggle button is clicked', async () => {
      const user = userEvent.setup();
      render(<Header />);

      await user.click(screen.getByLabelText(/open menu/i));

      expect(screen.getByTestId('x-icon')).toBeInTheDocument();
      expect(screen.getByLabelText(/close menu/i)).toHaveAttribute('aria-expanded', 'true');
    });

    it('closes mobile menu when toggle button is clicked again', async () => {
      const user = userEvent.setup();
      render(<Header />);

      await user.click(screen.getByLabelText(/open menu/i));
      expect(screen.getByTestId('x-icon')).toBeInTheDocument();

      await user.click(screen.getByLabelText(/close menu/i));
      expect(screen.getByTestId('menu-icon')).toBeInTheDocument();
    });

    it('closes mobile menu when a non-mega link is clicked', async () => {
      const user = userEvent.setup();
      render(<Header />);

      await user.click(screen.getByLabelText(/open menu/i));
      expect(screen.getByTestId('x-icon')).toBeInTheDocument();

      const aboutLinks = screen.getAllByRole('link', { name: /^about$/i });
      await user.click(aboutLinks[aboutLinks.length - 1]);

      expect(screen.getByTestId('menu-icon')).toBeInTheDocument();
    });

    it('expands the design-build submenu in the mobile menu', async () => {
      const user = userEvent.setup();
      render(<Header />);

      await user.click(screen.getByLabelText(/open menu/i));
      await user.click(screen.getByLabelText(/toggle design-build menu/i));

      expect(screen.getByRole('link', { name: /kitchens/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /roofing/i })).toBeInTheDocument();
    });

    it('keeps the secondary routes reachable from the drawer', async () => {
      const user = userEvent.setup();
      render(<Header />);

      await user.click(screen.getByLabelText(/open menu/i));

      expect(screen.getByRole('link', { name: /^contact$/i })).toHaveAttribute('href', '/contact');
      expect(screen.getByRole('link', { name: /instant roof quote/i })).toHaveAttribute(
        'href',
        '/instant-roof-quote'
      );
    });
  });
});

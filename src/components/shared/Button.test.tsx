import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

describe('Button', () => {
  describe('element rendering', () => {
    it('renders a <button> when no href is provided', () => {
      render(<Button>Click me</Button>);
      const el = screen.getByRole('button', { name: /click me/i });
      expect(el.tagName).toBe('BUTTON');
    });

    it('renders a Next.js Link (anchor) for internal paths', () => {
      render(<Button href="/about">About</Button>);
      const el = screen.getByRole('link', { name: /about/i });
      expect(el.tagName).toBe('A');
      expect(el).toHaveAttribute('href', '/about');
      expect(el).not.toHaveAttribute('target');
    });

    it('renders an external anchor with target="_blank" for http URLs', () => {
      render(<Button href="https://example.com">External</Button>);
      const el = screen.getByRole('link', { name: /external/i });
      expect(el).toHaveAttribute('target', '_blank');
      expect(el).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('renders a plain anchor for tel: links without target="_blank"', () => {
      render(<Button href="tel:+1234567890">Call</Button>);
      const el = screen.getByRole('link', { name: /call/i });
      expect(el).toHaveAttribute('href', 'tel:+1234567890');
      expect(el).not.toHaveAttribute('target');
    });

    it('renders a plain anchor for mailto: links without target="_blank"', () => {
      render(<Button href="mailto:test@example.com">Email</Button>);
      const el = screen.getByRole('link', { name: /email/i });
      expect(el).toHaveAttribute('href', 'mailto:test@example.com');
      expect(el).not.toHaveAttribute('target');
    });
  });

  describe('variant styles', () => {
    it('applies primary variant styles by default', () => {
      render(<Button>Primary</Button>);
      const el = screen.getByRole('button');
      expect(el.className).toContain('bg-brand-red');
    });

    it('applies secondary variant styles', () => {
      render(<Button variant="secondary">Secondary</Button>);
      const el = screen.getByRole('button');
      expect(el.className).toContain('bg-navy-800');
    });

    it('applies outline variant styles', () => {
      render(<Button variant="outline">Outline</Button>);
      const el = screen.getByRole('button');
      expect(el.className).toContain('border-2');
      expect(el.className).toContain('bg-transparent');
    });

    it('applies ghost variant styles', () => {
      render(<Button variant="ghost">Ghost</Button>);
      const el = screen.getByRole('button');
      expect(el.className).toContain('bg-transparent');
      expect(el.className).toContain('hover:bg-navy-50');
    });
  });

  describe('size styles', () => {
    it('applies medium size by default', () => {
      render(<Button>Medium</Button>);
      const el = screen.getByRole('button');
      expect(el.className).toContain('px-6');
      expect(el.className).toContain('py-3');
    });

    it('applies small size styles', () => {
      render(<Button size="sm">Small</Button>);
      const el = screen.getByRole('button');
      expect(el.className).toContain('px-4');
      expect(el.className).toContain('py-2');
    });

    it('applies large size styles', () => {
      render(<Button size="lg">Large</Button>);
      const el = screen.getByRole('button');
      expect(el.className).toContain('px-8');
      expect(el.className).toContain('py-4');
    });
  });

  describe('props forwarding', () => {
    it('merges custom className', () => {
      render(<Button className="custom-class">Custom</Button>);
      const el = screen.getByRole('button');
      expect(el.className).toContain('custom-class');
    });

    it('forwards onClick to button', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(<Button onClick={onClick}>Click</Button>);

      await user.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalledOnce();
    });

    it('forwards disabled to button', () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('forwards type attribute', () => {
      render(<Button type="submit">Submit</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });
  });
});

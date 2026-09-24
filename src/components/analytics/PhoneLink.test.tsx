import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import PhoneLink from './PhoneLink';
import { BUSINESS } from '@/lib/constants';
import { trackEvent } from '@/lib/analytics';

vi.mock('@/lib/analytics', () => ({ trackEvent: vi.fn() }));

describe('PhoneLink', () => {
  beforeEach(() => {
    vi.mocked(trackEvent).mockClear();
  });

  it('dials the business number', () => {
    render(<PhoneLink location="hero" />);
    expect(screen.getByRole('link')).toHaveAttribute('href', `tel:${BUSINESS.phoneRaw}`);
  });

  it('shows the number when given no children', () => {
    render(<PhoneLink location="hero" />);
    expect(screen.getByRole('link')).toHaveTextContent(BUSINESS.phone);
  });

  it('fires phone_click tagged with its location', async () => {
    render(<PhoneLink location="service_page_cta">Call us</PhoneLink>);
    await userEvent.click(screen.getByRole('link'));
    expect(trackEvent).toHaveBeenCalledWith('phone_click', { location: 'service_page_cta' });
  });

  it('still runs a caller-supplied onClick', async () => {
    // SuccessNextSteps rides its post_lead_click on top of the phone event.
    const onClick = vi.fn();
    render(
      <PhoneLink location="success_next_steps" onClick={onClick}>
        Call
      </PhoneLink>
    );
    await userEvent.click(screen.getByRole('link'));
    expect(trackEvent).toHaveBeenCalledWith('phone_click', { location: 'success_next_steps' });
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe('every rendered phone link is instrumented', () => {
  /**
   * Phone is the dominant conversion channel for a contractor, and a bare
   * `<a href="tel:...">` fires nothing. Over the 90 days to 2026-09-16 GA4
   * recorded 2 phone_click events against 41 phone links: only the header,
   * footer and two homepage CTAs were wired, and none of the templates behind
   * the service, city, project and paving pages — which is where search
   * traffic lands. Routing every phone link through PhoneLink is what fixed
   * it; this test is what keeps the next one from slipping through.
   *
   * The email template in src/app/api/estimate is deliberately out of scope:
   * a link in an outbound email cannot run gtag.
   */
  const SRC = join(process.cwd(), 'src');

  function walk(dir: string): string[] {
    return readdirSync(dir).flatMap((name) => {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) return walk(full);
      return full.endsWith('.tsx') && !full.includes('.test.') ? [full] : [];
    });
  }

  const offenders = walk(SRC)
    .filter((f) => !f.endsWith(join('analytics', 'PhoneLink.tsx')))
    .flatMap((f) =>
      readFileSync(f, 'utf8')
        .split('\n')
        .flatMap((line, i) =>
          /href=.*tel:/.test(line) ? [`${relative(process.cwd(), f)}:${i + 1}`] : []
        )
    );

  it('routes every tel: href through PhoneLink', () => {
    expect(
      offenders,
      'use <PhoneLink location="..."> instead of a bare <a href="tel:...">'
    ).toEqual([]);
  });
});

import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ESTIMATE_SMS_BODY, ESTIMATE_SMS_HREF } from '@/lib/estimate-sms';
import StickyMobileCTA from '@/components/layout/StickyMobileCTA';

vi.mock('next/navigation', () => ({
  usePathname: () => '/services/kitchens',
}));

function read(rel: string): string {
  return fs.readFileSync(path.resolve(rel), 'utf8');
}

describe('REA-790 site-audit copy', () => {
  it('replaces the paving three-state license sentence with the real license facts only', () => {
    const paving = read('src/app/paving/page.tsx');
    expect(paving).not.toContain('licensed in all three states');
    expect(paving).toContain('We are headquartered in Martinsburg. ${CONTRACTOR_LICENSES.summary}.');
    expect(paving).not.toContain('No Maryland contractor license');
    expect(paving).not.toMatch(/licensed in Maryland/i);
  });

  it('labels the contact region chip as a service area, not a license list', () => {
    const contact = read('src/app/contact/page.tsx');
    expect(contact).toContain('Serving WV, VA, MD, and PA');
    expect(contact).not.toContain('WV · MD · VA');
  });

  it('puts kitchens, bathrooms, and basements at the top of the footer and drops Exterior Repairs', () => {
    const footer = read('src/components/layout/Footer.tsx');
    const block = footer.slice(footer.indexOf('FEATURED_FOOTER_SERVICES'), footer.indexOf('export default function Footer'));
    expect(block.indexOf("'/services/bathrooms'")).toBeLessThan(block.indexOf("'/services/kitchens'"));
    expect(block.indexOf("'/services/kitchens'")).toBeLessThan(block.indexOf("'/services/basements'"));
    expect(block.indexOf("'/services/basements'")).toBeLessThan(block.indexOf("'/services/remodeling'"));
    expect(block).toContain('Bathroom Remodeling');
    expect(block).toContain('Kitchen Remodeling');
    expect(block).toContain('Basement Finishing');
    expect(block).not.toContain('Exterior Repairs');
  });

  it('keeps the homepage hero H1 and adds the Eastern Panhandle and estimate links under the buttons', () => {
    const hero = read('src/components/home/Hero.tsx');
    expect(hero).toContain('Design-build remodeling');
    expect(hero).toContain('for <em>Loudoun</em> homes.');
    expect(hero).toContain('href="/service-areas/martinsburg-wv"');
    expect(hero).toContain('href="/service-areas/charles-town-wv"');
    expect(hero).toContain('Charles Town, WV');
    expect(hero).toContain('href="/estimate"');
    expect(hero).toContain('Get an estimate');
    expect(hero).toContain('Schedule a design consultation');
  });

  it('does not label signature cards as stock', () => {
    const cards = read('src/components/home/SignatureServices.tsx');
    expect(cards.toLowerCase()).not.toContain('design inspiration');
    expect(cards).toContain('const photo = cat.image');
    const guide = read('src/lib/investment-guide.ts');
    expect(guide).toContain('VERIFIED_CATEGORY_PHOTOS.kitchen');
    expect(guide).toContain('VERIFIED_CATEGORY_PHOTOS.bathroom');
    expect(guide).toContain('VERIFIED_CATEGORY_PHOTOS.outdoor');
    expect(guide).toContain('VERIFIED_CATEGORY_PHOTOS.living');
  });

  it('keeps the app-wide loading boundary off static routes and on /sales', () => {
    expect(fs.existsSync('src/app/loading.tsx')).toBe(false);
    expect(fs.existsSync('src/app/sales/loading.tsx')).toBe(true);
    expect(read('src/app/sales/page.tsx')).toContain("dynamic = 'force-dynamic'");
  });

  it('uses the contact-page SMS body on the sticky bar', () => {
    expect(ESTIMATE_SMS_BODY).toBe("Hi, I'd like a free estimate from Real Elite Contracting.");
    expect(ESTIMATE_SMS_HREF).toContain(encodeURIComponent(ESTIMATE_SMS_BODY));
    render(<StickyMobileCTA />);
    expect(screen.getByRole('link', { name: 'Text (681) 534-5515' })).toHaveAttribute('href', ESTIMATE_SMS_HREF);
    expect(screen.getByRole('link', { name: 'Call (681) 534-5515' })).toHaveAttribute('href', 'tel:+16815345515');
    expect(screen.getByRole('link', { name: 'Free Estimate' })).toHaveAttribute('href', '#estimate');
  });
});

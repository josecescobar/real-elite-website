import { describe, expect, it } from 'vitest';
import { buildOwnerLeadSms, capSmsBody, OWNER_SMS_MAX_CHARS, sanitizeSmsText } from './owner-sms';

describe('sanitizeSmsText', () => {
  it('strips http(s) URLs, www hosts, and bare domains', () => {
    expect(sanitizeSmsText('Hi www.evil-site.com/claim there')).toBe('Hi there');
    expect(sanitizeSmsText('Visit https://phish.example/a now')).toBe('Visit now');
    expect(sanitizeSmsText('see http://evil.example and go')).toBe('see and go');
    expect(sanitizeSmsText('click evil-site.com/claim please')).toBe('click please');
  });

  it('leaves ordinary lead text alone', () => {
    expect(sanitizeSmsText('Jane Homeowner')).toBe('Jane Homeowner');
    expect(sanitizeSmsText('Bathroom Remodeling')).toBe('Bathroom Remodeling');
    expect(sanitizeSmsText('(681) 555-0142')).toBe('(681) 555-0142');
    expect(sanitizeSmsText('St. Louis')).toBe('St. Louis');
  });
});

describe('capSmsBody', () => {
  it('caps long bodies', () => {
    const capped = capSmsBody('A'.repeat(OWNER_SMS_MAX_CHARS + 50));
    expect(capped.length).toBeLessThanOrEqual(OWNER_SMS_MAX_CHARS);
    expect(capped.endsWith('…')).toBe(true);
  });
});

describe('buildOwnerLeadSms', () => {
  it('drops attacker URLs from every free-text field and caps the body', () => {
    const body = buildOwnerLeadSms({
      fullName: 'www.evil-site.com/claim Jane',
      service: 'Visit https://phish.example/a',
      town: 'evil-site.com/claim',
      budgetRange: 'http://spam.example',
      timeline: 'ASAP',
      zip: '25401',
      phone: '(681) 555-0142',
    });

    expect(body).toContain('🔔 New Lead');
    expect(body).toContain('Jane');
    expect(body).toContain('ASAP');
    expect(body).toContain('25401');
    expect(body).toContain('(681) 555-0142');
    expect(body).toContain('— Real Elite');
    expect(body).not.toMatch(/https?:\/\//);
    expect(body).not.toMatch(/evil-site/);
    expect(body).not.toMatch(/phish/);
    expect(body).not.toMatch(/www\./);
    expect(body.length).toBeLessThanOrEqual(OWNER_SMS_MAX_CHARS);
  });

  it('keeps the luxury label and substitutes a placeholder when the name is only a URL', () => {
    const body = buildOwnerLeadSms({
      fullName: 'https://evil.example/x',
      service: '[Luxury Consultation] Kitchen',
      phone: '6815550142',
    });
    expect(body.startsWith('🔔 LUXURY LEAD')).toBe(true);
    expect(body).toContain('New lead');
    expect(body).toContain('[Luxury Consultation] Kitchen');
    expect(body).not.toMatch(/evil\.example/);
  });

  it('caps a padded name', () => {
    const body = buildOwnerLeadSms({
      fullName: 'A'.repeat(800),
      service: 'Roofing',
      phone: '6815550142',
    });
    expect(body.length).toBeLessThanOrEqual(OWNER_SMS_MAX_CHARS);
    expect(body.endsWith('…')).toBe(true);
  });
});

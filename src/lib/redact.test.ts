import { describe, expect, it } from 'vitest';
import { redactForLog, redactPii } from './redact';

describe('redactPii', () => {
  it('masks phone numbers to the last 4 digits in common formats', () => {
    const out = redactPii(
      'To +16815550142, alt (681) 555-0199, 681.555.0123, encoded %2B16815550177'
    );
    expect(out).not.toMatch(/555/);
    expect(out).toContain('***0142');
    expect(out).toContain('***0199');
    expect(out).toContain('***0123');
    expect(out).toContain('***0177');
  });

  it('replaces email addresses', () => {
    expect(redactPii('reply to Jane.Doe+x@example.co.uk now')).toBe('reply to [email] now');
  });

  it('leaves short numbers such as status codes and ZIPs alone', () => {
    expect(redactPii('status 422 code 21211 zip 25401')).toBe('status 422 code 21211 zip 25401');
  });
});

describe('redactForLog', () => {
  it('redacts objects and errors and caps the length', () => {
    expect(redactForLog({ to: '+16815550142' })).toBe('{"to":"***0142"}');
    expect(redactForLog(new Error('bad a@b.com'))).toBe('Error: bad [email]');
    expect(redactForLog('x'.repeat(5000)).length).toBeLessThanOrEqual(2001);
  });
});

describe('redact before truncate', () => {
  it('never leaks a phone or email that straddles the truncation boundary', () => {
    const phone = '+16815550142';
    const email = 'jane.doe@example.com';
    // Put the cut (20 chars) in the middle of the phone, then of the email.
    const phoneCut = `${'x'.repeat(14)}${phone} tail`;
    const emailCut = `${'x'.repeat(12)}${email} tail`;
    for (const text of [phoneCut, emailCut]) {
      const out = redactForLog(text, 20);
      expect(out).not.toMatch(/6815550|55501/);
      expect(out).not.toContain('jane');
      expect(out).not.toContain('example.com');
      expect(out.length).toBeLessThanOrEqual(21);
    }
  });
});


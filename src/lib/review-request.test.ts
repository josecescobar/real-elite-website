import { describe, it, expect } from 'vitest';
import { buildReviewMessage, toE164 } from './review-request';

describe('toE164', () => {
  it('normalizes formatted 10-digit US numbers', () => {
    expect(toE164('(304) 555-0123')).toBe('+13045550123');
    expect(toE164('304-555-0123')).toBe('+13045550123');
    expect(toE164('3045550123')).toBe('+13045550123');
  });

  it('accepts 11 digits with leading 1', () => {
    expect(toE164('1 304 555 0123')).toBe('+13045550123');
    expect(toE164('+1 (304) 555-0123')).toBe('+13045550123');
  });

  it('rejects anything else', () => {
    expect(toE164('555-0123')).toBeNull();
    expect(toE164('23045550123')).toBeNull();
    expect(toE164('')).toBeNull();
    expect(toE164('not a phone')).toBeNull();
  });
});

describe('buildReviewMessage', () => {
  it('personalizes with name and includes the review link', () => {
    const msg = buildReviewMessage('Sarah', 'https://example.com/review');
    expect(msg).toContain('Hi Sarah');
    expect(msg).toContain('https://example.com/review');
    expect(msg).toContain('Real Elite Contracting');
  });

  it('stays within two SMS segments (~320 chars) for typical names', () => {
    const msg = buildReviewMessage(
      'Christopher',
      'https://search.google.com/local/writereview?placeid=ChIJAAAAAAAAAAAAAAAAAAAAAAA'
    );
    expect(msg.length).toBeLessThanOrEqual(320);
  });
});

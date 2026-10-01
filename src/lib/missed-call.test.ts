import { describe, it, expect } from 'vitest';
import { callerTextBack, ownerMissedAlert, wasAnswered } from './missed-call';
import { BUSINESS } from './constants';

describe('wasAnswered', () => {
  it('treats completed/answered as picked up', () => {
    expect(wasAnswered('completed')).toBe(true);
    expect(wasAnswered('answered')).toBe(true);
  });

  it('treats every other status as missed', () => {
    for (const s of ['no-answer', 'busy', 'failed', 'canceled', undefined]) {
      expect(wasAnswered(s)).toBe(false);
    }
  });
});

describe('callerTextBack', () => {
  it('includes the business name and callback number', () => {
    const msg = callerTextBack();
    expect(msg).toContain(BUSINESS.name);
    expect(msg).toContain(BUSINESS.phone);
  });
});

describe('ownerMissedAlert', () => {
  it('surfaces the caller number and whether the customer was texted', () => {
    const skipped = ownerMissedAlert('+13045550123');
    expect(skipped).toContain('+13045550123');
    expect(skipped).toContain('Missed call');
    expect(skipped).toContain('No auto-text was sent');
    const sent = ownerMissedAlert('+13045550123', true);
    expect(sent).toContain('They got an auto-text back');
  });
});

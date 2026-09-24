import { describe, expect, it } from 'vitest';
import { bucketForLead, scoreLead } from './score';

describe('scoreLead', () => {
  it('scores a preferred Martinsburg bath lead in the hot range', () => {
    const { score, breakdown } = scoreLead({
      zip: '25401',
      city: 'Martinsburg',
      state: 'WV',
      projectType: 'Bathroom Remodel',
      projectSummary: 'Walk-in shower, hall bath, ready for an estimate',
      estimatedValueCents: 1_200_000,
      urgency: 'this month',
      facts: { fullName: 'Jane Homeowner', phone: '6815550142' },
    });
    expect(breakdown.geo).toBe(25);
    expect(breakdown.projectType).toBe(20);
    expect(score).toBeGreaterThanOrEqual(70);
    expect(bucketForLead(score, 'new', false)).toBe('hot');
  });

  it('penalizes out-of-area work', () => {
    const { score, breakdown } = scoreLead({
      zip: '90210',
      city: 'Beverly Hills',
      state: 'CA',
      projectType: 'Handyman',
    });
    expect(breakdown.geo).toBe(0);
    expect(score).toBeLessThan(50);
  });
});

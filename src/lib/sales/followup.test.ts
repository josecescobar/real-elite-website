import { describe, expect, it } from 'vitest';
import { cadenceToMs, planFollowups, shouldStopFollowups } from './followup';

describe('follow-up cadence', () => {
  it('plans configurable stops from 2h/24h/3d/7d', () => {
    const start = new Date('2026-09-06T13:00:00.000Z');
    const rows = planFollowups('lead_1', start, ['2h', '24h', '3d', '7d']);
    expect(rows).toHaveLength(4);
    expect(rows[0].dueAt).toBe('2026-09-06T15:00:00.000Z');
    expect(cadenceToMs('3d')).toBe(3 * 86_400_000);
  });

  it('stops on won/lost/stop/hired/paused', () => {
    expect(shouldStopFollowups({ lead: { status: 'won', aiPaused: false, assignedTo: null }, facts: {} }).stop).toBe(true);
    expect(shouldStopFollowups({ lead: { status: 'new', aiPaused: true, assignedTo: 'Jose' }, facts: {} }).stop).toBe(true);
    expect(
      shouldStopFollowups({ lead: { status: 'qualifying', aiPaused: false, assignedTo: null }, facts: { stopContact: true } })
        .reason
    ).toBe('customer_stop');
    expect(
      shouldStopFollowups({ lead: { status: 'new', aiPaused: false, assignedTo: null }, facts: {} }).stop
    ).toBe(false);
  });
});

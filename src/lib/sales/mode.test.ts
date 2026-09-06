import { describe, expect, it } from 'vitest';
import { decideSend } from './mode';

describe('decideSend', () => {
  it('never auto-sends escalations or draft_only', () => {
    expect(
      decideSend({ mode: 'safe_autopilot', escalationReasons: ['pricing_commitment'], outboundReady: true }).send
    ).toBe(false);
    expect(decideSend({ mode: 'draft_only', escalationReasons: [], outboundReady: true }).send).toBe(false);
  });

  it('allows Safe Autopilot only when outbound is wired and nothing is escalated', () => {
    expect(decideSend({ mode: 'safe_autopilot', escalationReasons: [], outboundReady: false }).reason).toBe(
      'thumbtack_outbound_not_configured'
    );
    expect(decideSend({ mode: 'safe_autopilot', escalationReasons: [], outboundReady: true }).send).toBe(true);
  });
});

import { env } from '@/lib/env';
import type { ConversationFacts, Followup, Lead } from './types';

export const DEFAULT_CADENCE = ['2h', '24h', '3d', '7d'] as const;

const UNIT_MS: Record<string, number> = {
  m: 60_000,
  h: 3_600_000,
  d: 86_400_000,
};

export function parseCadence(raw?: string | null): string[] {
  const source = raw?.trim() || env.salesFollowupCadence() || DEFAULT_CADENCE.join(',');
  const parts = source
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean);
  return parts.length ? parts : [...DEFAULT_CADENCE];
}

export function cadenceToMs(token: string): number | null {
  const m = token.trim().match(/^(\d+)([mhd])$/i);
  if (!m) return null;
  const n = Number(m[1]);
  const unit = m[2].toLowerCase();
  const base = UNIT_MS[unit];
  if (!base || !Number.isFinite(n)) return null;
  return n * base;
}

export function shouldStopFollowups(input: {
  lead: Pick<Lead, 'status' | 'aiPaused' | 'assignedTo'>;
  facts: ConversationFacts;
}): { stop: boolean; reason: string | null } {
  if (input.lead.aiPaused) return { stop: true, reason: 'ai_paused' };
  if (input.lead.status === 'won') return { stop: true, reason: 'won' };
  if (input.lead.status === 'lost') return { stop: true, reason: 'lost' };
  if (input.lead.status === 'paused') return { stop: true, reason: 'paused' };
  if (input.facts.stopContact) return { stop: true, reason: 'customer_stop' };
  if (input.facts.hiredElsewhere) return { stop: true, reason: 'hired_elsewhere' };
  if (input.lead.assignedTo && input.lead.aiPaused) return { stop: true, reason: 'takeover' };
  return { stop: false, reason: null };
}

export function planFollowups(leadId: string, now = new Date(), cadence = parseCadence()): Omit<Followup, 'id'>[] {
  const rows: Omit<Followup, 'id'>[] = [];
  for (const token of cadence) {
    const ms = cadenceToMs(token);
    if (ms == null) continue;
    rows.push({
      createdAt: now.toISOString(),
      leadId,
      dueAt: new Date(now.getTime() + ms).toISOString(),
      kind: `cadence_${token}`,
      status: 'scheduled',
      note: `Automatic follow-up at +${token}`,
      cancelledReason: null,
    });
  }
  return rows;
}

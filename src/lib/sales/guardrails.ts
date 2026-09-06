import { classifyGeo } from './geo';
import type { ConversationFacts, EscalationReason } from './types';

const PATTERNS: Array<{ reason: EscalationReason; re: RegExp }> = [
  {
    reason: 'pricing_commitment',
    re: /\b(firm price|guaranteed price|not to exceed|won't (go|charge) (over|more)|lock(ed)? (in )?(the )?price|do it for \$?\d|can you do it for)\b/i,
  },
  {
    reason: 'firm_date',
    re: /\b(start (this |next )?(monday|tuesday|wednesday|thursday|friday|tomorrow|today)|guaranteed (start|finish)|be done by|finished by|hard date|have to start)\b/i,
  },
  {
    reason: 'permits',
    re: /\b(permit|permits|you'll pull|you will pull|inspection|hoa approval)\b/i,
  },
  {
    reason: 'discount',
    re: /\b(discount|cheaper than|price match|beat .+ price|senior discount|veteran discount|% off)\b/i,
  },
  {
    reason: 'legal',
    re: /\b(lawsuit|attorney|contract says|warranty for life|lifetime warranty|licensed in every|we guarantee legally)\b/i,
  },
  {
    reason: 'license',
    re: /\b(license number|are you licensed in|bonding|not licensed)\b/i,
  },
];

export function detectEscalations(input: {
  zip?: string | null;
  city?: string | null;
  state?: string | null;
  text?: string | null;
  facts?: ConversationFacts;
}): EscalationReason[] {
  const reasons = new Set<EscalationReason>();
  const geo = classifyGeo({ zip: input.zip, city: input.city, state: input.state });
  if (geo.tier === 'out_of_area') reasons.add('out_of_area');

  const hay = `${input.text ?? ''} ${input.facts?.projectDetails ?? ''} ${input.facts?.budget ?? ''}`;
  for (const { reason, re } of PATTERNS) {
    if (re.test(hay)) reasons.add(reason);
  }
  return [...reasons];
}

export function mustEscalate(reasons: EscalationReason[]): boolean {
  return reasons.length > 0;
}

/**
 * Strip phrases a draft must never say. Template drafts are written
 * without these; this is a last-line filter for optional LLM output.
 */
export function sanitizeDraft(text: string): { text: string; blocked: boolean } {
  const banned = [
    /we (can |will )?do it for \$?[\d,]+/i,
    /guaranteed (price|start|finish)/i,
    /\b\d{1,2}% off\b/i,
    /lifetime warranty/i,
    /we('ll| will) pull the permits/i,
    /we can start (tomorrow|monday|today)/i,
  ];
  let blocked = false;
  let next = text;
  for (const re of banned) {
    if (re.test(next)) {
      blocked = true;
      next = next.replace(re, '[removed — Jose must confirm]');
    }
  }
  return { text: next, blocked };
}

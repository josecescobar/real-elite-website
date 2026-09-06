import { PREFERRED_WORK, SMALL_JOB_WORK } from './company';
import { classifyGeo } from './geo';
import type { ConversationFacts, InboundLead, ScoreBreakdown } from './types';

export type ScoreInput = {
  zip?: string | null;
  city?: string | null;
  state?: string | null;
  projectType?: string | null;
  projectSummary?: string | null;
  estimatedValueCents?: number | null;
  urgency?: string | null;
  facts?: ConversationFacts;
  message?: string | null;
};

const GEO_POINTS: Record<string, number> = {
  core: 25,
  primary: 20,
  adjacent: 8,
  out_of_area: 0,
};

export function detectPreferredWork(text: string): string | null {
  const hay = text.toLowerCase();
  for (const work of PREFERRED_WORK) {
    if (work.labels.some((label) => hay.includes(label))) return work.key;
  }
  return null;
}

export function isSmallJob(text: string): boolean {
  const hay = text.toLowerCase();
  return SMALL_JOB_WORK.some((label) => hay.includes(label));
}

function projectTypePoints(text: string): number {
  if (detectPreferredWork(text)) return 20;
  if (isSmallJob(text)) return 8;
  if (text.trim()) return 12;
  return 4;
}

function valuePoints(cents: number | null | undefined, text: string): number {
  if (typeof cents === 'number' && cents > 0) {
    if (cents >= 1_500_000) return 15;
    if (cents >= 800_000) return 12;
    if (cents >= 400_000) return 8;
    return 4;
  }
  const hay = text.toLowerCase();
  if (/\b(\$ ?)?(1[5-9]|[2-9]\d)k\b/.test(hay) || /\$ ?1[5-9],?\d{3}/.test(hay)) return 15;
  if (/\b(\$ ?)?(8|9|1[0-4])k\b/.test(hay)) return 12;
  if (/\b(\$ ?)?[4-7]k\b/.test(hay)) return 8;
  if (/\$ ?\d/.test(hay)) return 6;
  return 6;
}

function urgencyPoints(urgency: string | null | undefined, text: string): number {
  const hay = `${urgency ?? ''} ${text}`.toLowerCase();
  if (/(asap|emergency|this week|right away|immediately|leak|storm)/.test(hay)) return 15;
  if (/(this month|next week|soon|2 weeks)/.test(hay)) return 12;
  if (/(1-3 month|within a month|spring|summer|fall)/.test(hay)) return 8;
  if (/(flexible|just looking|planning|next year)/.test(hay)) return 5;
  return 6;
}

function intentPoints(text: string, facts: ConversationFacts | undefined): number {
  const hay = text.toLowerCase();
  if (facts?.hiredElsewhere || /already (hired|booked)|went with another/.test(hay)) return 2;
  if (/(ready to (hire|start)|want (an )?estimate|come look|site visit|book)/.test(hay)) return 10;
  if (/(how much|quote|pricing|can you do)/.test(hay)) return 8;
  if (/(just looking|curious|maybe later)/.test(hay)) return 4;
  return 6;
}

function completenessPoints(input: ScoreInput): number {
  let n = 0;
  if (input.facts?.fullName || input.facts?.firstName) n += 2;
  if (input.facts?.phone || input.facts?.email) n += 2;
  if (input.zip || input.city) n += 2;
  if (input.projectType || input.projectSummary) n += 2;
  if (input.facts?.budget || input.estimatedValueCents || input.facts?.timeline) n += 2;
  return n;
}

function travelPoints(tier: string): number {
  if (tier === 'core') return 5;
  if (tier === 'primary') return 4;
  if (tier === 'adjacent') return 1;
  return 0;
}

export function scoreLead(input: ScoreInput): { score: number; breakdown: ScoreBreakdown } {
  const geo = classifyGeo({ zip: input.zip, city: input.city, state: input.state });
  const text = [input.projectType, input.projectSummary, input.message, input.facts?.projectDetails]
    .filter(Boolean)
    .join(' ');

  const breakdown: ScoreBreakdown = {
    geo: GEO_POINTS[geo.tier] ?? 0,
    projectType: projectTypePoints(text),
    value: valuePoints(input.estimatedValueCents, `${text} ${input.facts?.budget ?? ''}`),
    urgency: urgencyPoints(input.urgency, text),
    intent: intentPoints(text, input.facts),
    completeness: completenessPoints(input),
    travel: travelPoints(geo.tier),
  };

  const score = Math.max(
    0,
    Math.min(
      100,
      breakdown.geo +
        breakdown.projectType +
        breakdown.value +
        breakdown.urgency +
        breakdown.intent +
        breakdown.completeness +
        breakdown.travel
    )
  );

  return { score, breakdown };
}

export function bucketForLead(
  score: number,
  status: string,
  awaitingReply: boolean
): import('./types').LeadBucket {
  if (status === 'won') return 'won';
  if (status === 'lost') return 'lost';
  if (status === 'follow_up') return 'follow_up';
  if (awaitingReply || status === 'awaiting_customer') return 'awaiting';
  if (score >= 70) return 'hot';
  return 'new';
}

export function inboundToScoreInput(lead: InboundLead): ScoreInput {
  return {
    zip: lead.customer.zip,
    city: lead.customer.city,
    state: lead.customer.state,
    projectType: lead.projectType,
    projectSummary: lead.projectSummary,
    estimatedValueCents: lead.estimatedValueCents,
    urgency: lead.urgency,
    facts: {
      fullName: lead.customer.fullName,
      email: lead.customer.email,
      phone: lead.customer.phone,
      zip: lead.customer.zip,
      city: lead.customer.city,
      state: lead.customer.state,
      address: lead.customer.address,
      projectType: lead.projectType,
      projectDetails: lead.projectSummary,
    },
    message: lead.message,
  };
}

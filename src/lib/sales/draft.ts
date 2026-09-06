import { BUSINESS } from '@/lib/constants';
import { firstNameOf, SALES_OWNER } from './company';
import { detectEscalations, sanitizeDraft } from './guardrails';
import { unansweredPrompts } from './memory';
import type { ConversationFacts, EscalationReason, Lead } from './types';

export type DraftInput = {
  lead: Pick<
    Lead,
    'projectType' | 'projectSummary' | 'city' | 'state' | 'zip' | 'source' | 'urgency'
  >;
  customerName?: string | null;
  facts: ConversationFacts;
  inboundMessage?: string | null;
};

export type DraftResult = {
  body: string;
  escalationReasons: EscalationReason[];
  blocked: boolean;
};

function placeLabel(lead: DraftInput['lead'], facts: ConversationFacts): string {
  const city = facts.city || lead.city;
  const state = facts.state || lead.state;
  const zip = facts.zip || lead.zip;
  if (city && state) return `${city}, ${state}`;
  if (city) return city;
  if (zip) return `ZIP ${zip}`;
  return 'the Eastern Panhandle';
}

function projectLabel(lead: DraftInput['lead'], facts: ConversationFacts): string {
  return (
    facts.projectType ||
    lead.projectType ||
    facts.projectDetails ||
    lead.projectSummary ||
    'your project'
  );
}

function specificDetail(lead: DraftInput['lead'], facts: ConversationFacts, inbound?: string | null): string {
  const summary = (facts.projectDetails || lead.projectSummary || inbound || '').trim();
  if (summary && summary.length > 12 && summary.toLowerCase() !== projectLabel(lead, facts).toLowerCase()) {
    return summary.length > 220 ? `${summary.slice(0, 217)}…` : summary;
  }
  return '';
}

function nextStep(facts: ConversationFacts): string {
  const asks = unansweredPrompts(facts);
  if (facts.preferredContact === 'visit') {
    return asks.askPhotos
      ? 'I can come look in person — a couple of photos ahead of the visit help me show up with the right questions instead of a generic walkthrough.'
      : 'I can come look in person. What days this week or next work at the house?';
  }
  if (facts.preferredContact === 'call') {
    return 'Happy to call. What time window works today or tomorrow?';
  }
  if (facts.preferredContact === 'text') {
    return 'I can keep this on text. Reply with a couple of photos when you have them and I’ll tell you the next clean step.';
  }
  if (facts.preferredContact === 'email') {
    return 'Email is fine — send a couple of photos to this thread and I’ll follow up with a visit window.';
  }

  const bits: string[] = [];
  if (asks.askPhotos) {
    bits.push('a few photos of the work area (wide shot plus the problem spots)');
  }
  bits.push('a 10-minute call or a site visit so I can see the job instead of guessing from a form');
  return `Two things that help me give you a straight answer:\n1) ${bits[0]}\n2) ${bits[1] ?? 'a quick call or visit'}`;
}

/**
 * PM-quality first reply. Never generic "how can we help?" — always
 * names the project and asks for the next concrete step. Guardrails
 * keep price, dates, permits, and discounts off the page.
 */
export function draftCustomerReply(input: DraftInput): DraftResult {
  const { lead, facts } = input;
  const first = firstNameOf(input.customerName || facts.fullName || facts.firstName) || 'there';
  const project = projectLabel(lead, facts);
  const place = placeLabel(lead, facts);
  const detail = specificDetail(lead, facts, input.inboundMessage);
  const source =
    lead.source === 'thumbtack' ? 'your Thumbtack request' : 'your note';

  const escalationReasons = detectEscalations({
    zip: facts.zip || lead.zip,
    city: facts.city || lead.city,
    state: facts.state || lead.state,
    text: [lead.projectSummary, input.inboundMessage, facts.projectDetails].filter(Boolean).join('\n'),
    facts,
  });

  const greeting = `Hi ${first} — this is ${SALES_OWNER.firstName} with ${SALES_OWNER.company} in ${SALES_OWNER.homeMarket}.`;
  const hook = `I saw ${source} about ${project} in ${place}.`;
  const specificity = detail
    ? `I read what you wrote — ${detail} — and I want to look at that specifically rather than send a canned reply.`
    : `We do this kind of work across WV, MD, and Northern VA, and I want to look at your job specifically rather than guess from a form.`;

  let escalateNote = '';
  if (escalationReasons.includes('out_of_area')) {
    escalateNote =
      'I need to confirm we can cover that location before I commit to a visit — I’ll check coverage and follow up.';
  } else if (escalationReasons.length > 0) {
    escalateNote =
      'I don’t lock price, start dates, permits, or discounts over a first message — I’ll review that with you personally so we don’t over-promise.';
  }

  const body = [
    greeting,
    '',
    hook,
    specificity,
    escalateNote,
    '',
    nextStep(facts),
    '',
    `What’s the better next step for you?`,
    '',
    `— ${SALES_OWNER.firstName}, ${SALES_OWNER.company}`,
    BUSINESS.phone,
    'Veteran-owned · Licensed & insured in WV, MD, and VA',
  ]
    .filter((line, i, arr) => !(line === '' && arr[i - 1] === ''))
    .join('\n');

  const cleaned = sanitizeDraft(body);
  return {
    body: cleaned.text,
    escalationReasons,
    blocked: cleaned.blocked,
  };
}

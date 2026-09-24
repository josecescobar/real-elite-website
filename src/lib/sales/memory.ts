import { firstNameOf } from './company';
import type { ConversationFacts, Message } from './types';

const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const PHONE_RE = /(?:\+1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
const ZIP_RE = /\b(\d{5})(?:-\d{4})?\b/;
const BUDGET_RE = /\$\s?[\d,]+(?:\s?[-–]\s?\$?\s?[\d,]+)?|\b\d{1,3}\s?k\b/i;
const TIMELINE_RE =
  /\b(asap|this week|next week|this month|next month|spring|summer|fall|winter|in \d+ weeks?|in \d+ months?)\b/i;

/**
 * Merge newly observed facts into conversation memory. Never overwrites
 * a filled field with empty; inbound answers win over guesses.
 */
export function mergeFacts(
  current: ConversationFacts,
  incoming: ConversationFacts
): ConversationFacts {
  const next: ConversationFacts = { ...current };
  for (const [key, value] of Object.entries(incoming) as Array<
    [keyof ConversationFacts, ConversationFacts[keyof ConversationFacts]]
  >) {
    if (value === undefined || value === null || value === '') continue;
    next[key] = value as never;
  }
  if (next.fullName && !next.firstName) next.firstName = firstNameOf(next.fullName);
  return next;
}

export function extractFactsFromText(text: string): ConversationFacts {
  const facts: ConversationFacts = {};
  const email = text.match(EMAIL_RE)?.[0];
  if (email) facts.email = email;
  const phone = text.match(PHONE_RE)?.[0];
  if (phone) facts.phone = phone;
  const zip = text.match(ZIP_RE)?.[1];
  if (zip) facts.zip = zip;
  const budget = text.match(BUDGET_RE)?.[0];
  if (budget) facts.budget = budget;
  const timeline = text.match(TIMELINE_RE)?.[0];
  if (timeline) facts.timeline = timeline;

  if (/\b(photo|picture|pic|image)s?\b/i.test(text)) facts.photosOffered = true;
  if (/\b(come (by|out|look)|site visit|stop by|at the house)\b/i.test(text)) {
    facts.preferredContact = 'visit';
  } else if (/\b(call me|phone call|give me a call)\b/i.test(text)) {
    facts.preferredContact = 'call';
  } else if (/\b(text me|just text)\b/i.test(text)) {
    facts.preferredContact = 'text';
  } else if (/\bemail me\b/i.test(text)) {
    facts.preferredContact = 'email';
  }

  if (/\b(hired someone|already booked|went with another|no longer need|not interested)\b/i.test(text)) {
    facts.hiredElsewhere = true;
  }
  if (/\b(stop texting|do not contact|unsubscribe|remove me)\b/i.test(text)) {
    facts.stopContact = true;
  }

  return facts;
}

export function factsFromMessages(messages: Message[]): ConversationFacts {
  return messages.reduce<ConversationFacts>((acc, message) => {
    if (message.direction !== 'inbound') return acc;
    return mergeFacts(acc, extractFactsFromText(message.body));
  }, {});
}

/** Questions Grokbot must not repeat once the fact is known. */
export function unansweredPrompts(facts: ConversationFacts): {
  askPhotos: boolean;
  askCallOrVisit: boolean;
  askTimeline: boolean;
  askAddress: boolean;
} {
  return {
    askPhotos: facts.photosOffered !== true,
    askCallOrVisit: !facts.preferredContact,
    askTimeline: !facts.timeline,
    askAddress: !facts.address && !facts.zip,
  };
}

import { SALES_OWNER } from './company';
import { sendThumbtackMessage } from './connectors/thumbtack';
import { draftCustomerReply } from './draft';
import { planFollowups, shouldStopFollowups } from './followup';
import { classifyGeo } from './geo';
import { extractFactsFromText, mergeFacts } from './memory';
import { currentSalesMode, decideSend } from './mode';
import { bucketForLead, inboundToScoreInput, scoreLead } from './score';
import { getSalesStore } from './store';
import type { InboundLead, Lead, Message } from './types';

export type PipelineResult = {
  duplicate: boolean;
  lead: Lead | null;
  customerId: string | null;
  draftReply: string | null;
  send: { attempted: boolean; sent: boolean; reason: string };
  eventId: string;
};

function eventIdFor(inbound: InboundLead, fallbackPayload: unknown): string {
  if (inbound.eventId) return inbound.eventId;
  const raw = fallbackPayload && typeof fallbackPayload === 'object' ? (fallbackPayload as Record<string, unknown>) : {};
  const fromRaw = raw.eventID ?? raw.eventId ?? raw.event_id ?? raw.id;
  if (typeof fromRaw === 'string' && fromRaw.trim()) return fromRaw.trim();
  if (inbound.sourceLeadId && inbound.eventType) {
    return `${inbound.source}:${inbound.sourceLeadId}:${inbound.eventType}:${inbound.receivedAt}`;
  }
  return crypto.randomUUID();
}

export async function ingestInboundLead(inbound: InboundLead): Promise<PipelineResult> {
  const store = getSalesStore();
  const eventId = eventIdFor(inbound, inbound.raw);
  const eventType = inbound.eventType ?? 'LeadCreated';

  const recorded = await store.recordWebhookEvent({
    connector: inbound.source,
    eventId,
    eventType,
    payload: inbound.raw ?? inbound,
  });

  if (recorded.duplicate) {
    const existing = inbound.sourceLeadId
      ? await store.findLeadBySource(inbound.source, inbound.sourceLeadId)
      : recorded.event.leadId
        ? await store.getLead(recorded.event.leadId)
        : null;
    return {
      duplicate: true,
      lead: existing,
      customerId: existing?.customerId ?? null,
      draftReply: existing?.draftReply ?? null,
      send: { attempted: false, sent: false, reason: 'duplicate_event' },
      eventId,
    };
  }

  const customer = await store.upsertCustomer({
    fullName: inbound.customer.fullName?.trim() || 'Thumbtack customer',
    email: inbound.customer.email ?? null,
    phone: inbound.customer.phone ?? null,
    zip: inbound.customer.zip ?? null,
    city: inbound.customer.city ?? null,
    state: inbound.customer.state ?? null,
    source: inbound.source,
    externalIds: inbound.sourceLeadId ? { [inbound.source]: inbound.sourceLeadId } : {},
    notes: null,
  });

  const existingLead = inbound.sourceLeadId
    ? await store.findLeadBySource(inbound.source, inbound.sourceLeadId)
    : null;

  const inboundFacts = mergeFacts(
    {
      fullName: inbound.customer.fullName,
      email: inbound.customer.email,
      phone: inbound.customer.phone,
      zip: inbound.customer.zip,
      city: inbound.customer.city,
      state: inbound.customer.state,
      address: inbound.customer.address,
      projectType: inbound.projectType,
      projectDetails: inbound.projectSummary,
    },
    inbound.message ? extractFactsFromText(inbound.message) : {}
  );

  const scored = scoreLead({
    ...inboundToScoreInput(inbound),
    facts: mergeFacts(existingLead?.facts ?? {}, inboundFacts),
  });

  const conversationId = existingLead?.conversationId ?? crypto.randomUUID();
  const leadId = existingLead?.id ?? crypto.randomUUID();
  const mode = currentSalesMode();
  const geo = classifyGeo({
    zip: inbound.customer.zip,
    city: inbound.customer.city,
    state: inbound.customer.state,
  });

  const facts = mergeFacts(existingLead?.facts ?? {}, inboundFacts);
  const draft = draftCustomerReply({
    lead: {
      projectType: inbound.projectType ?? existingLead?.projectType ?? null,
      projectSummary: inbound.projectSummary ?? existingLead?.projectSummary ?? null,
      city: inbound.customer.city ?? existingLead?.city ?? null,
      state: inbound.customer.state ?? existingLead?.state ?? null,
      zip: inbound.customer.zip ?? existingLead?.zip ?? null,
      source: inbound.source,
      urgency: inbound.urgency ?? existingLead?.urgency ?? null,
    },
    customerName: customer.fullName,
    facts,
    inboundMessage: inbound.message,
  });

  let status = existingLead?.status ?? 'new';
  if (inbound.statusUpdate && /won|hired|accepted/i.test(inbound.statusUpdate)) status = 'won';
  if (inbound.statusUpdate && /lost|declined|closed/i.test(inbound.statusUpdate)) status = 'lost';
  if (inbound.message && status === 'new') status = 'qualifying';
  if (facts.stopContact || facts.hiredElsewhere) status = 'lost';

  const awaiting = Boolean(draft.body) && status !== 'won' && status !== 'lost';
  const bucket = bucketForLead(scored.score, status, awaiting && !existingLead);

  const leadFields = {
    customerId: customer.id,
    conversationId,
    source: inbound.source,
    sourceLeadId: inbound.sourceLeadId ?? existingLead?.sourceLeadId ?? null,
    status,
    bucket,
    projectType: inbound.projectType ?? existingLead?.projectType ?? null,
    projectSummary: inbound.projectSummary ?? existingLead?.projectSummary ?? null,
    estimatedValueCents: inbound.estimatedValueCents ?? existingLead?.estimatedValueCents ?? null,
    urgency: inbound.urgency ?? existingLead?.urgency ?? null,
    zip: inbound.customer.zip ?? existingLead?.zip ?? null,
    city: inbound.customer.city ?? existingLead?.city ?? null,
    state: inbound.customer.state ?? existingLead?.state ?? null,
    score: scored.score,
    scoreBreakdown: scored.breakdown,
    aiMode: mode,
    aiPaused: existingLead?.aiPaused ?? false,
    assignedTo: existingLead?.assignedTo ?? (draft.escalationReasons.length ? SALES_OWNER.firstName : null),
    escalationReasons: draft.escalationReasons,
    facts,
    draftReply: draft.body,
    draftStatus: draft.blocked ? ('blocked' as const) : ('drafted' as const),
    opportunityId: existingLead?.opportunityId ?? null,
    raw: inbound.raw ?? inbound,
  };

  let lead: Lead;
  if (existingLead) {
    lead = (await store.updateLead(existingLead.id, leadFields)) ?? { ...existingLead, ...leadFields };
  } else {
    lead = await store.createLead({ id: leadId, ...leadFields });
  }

  await store.upsertConversation({
    id: conversationId,
    leadId: lead.id,
    customerId: customer.id,
    facts,
  });

  if (inbound.message) {
    await store.addMessage({
      conversationId,
      leadId: lead.id,
      direction: 'inbound',
      channel: inbound.source,
      body: inbound.message,
      status: 'received',
      author: customer.fullName,
      externalId: inbound.eventId ?? null,
      meta: inbound.review ? { review: inbound.review } : null,
    });
  }

  if (inbound.review?.text) {
    await store.addMessage({
      conversationId,
      leadId: lead.id,
      direction: 'inbound',
      channel: `${inbound.source}:review`,
      body: `Review ${inbound.review.rating ?? '?'}/5 — ${inbound.review.text}`,
      status: 'received',
      author: customer.fullName,
      externalId: null,
      meta: { review: inbound.review },
    });
  }

  const draftMessage: Message = await store.addMessage({
    conversationId,
    leadId: lead.id,
    direction: 'outbound',
    channel: inbound.source,
    body: draft.body,
    status: 'drafted',
    author: 'grokbot',
    externalId: null,
    meta: { escalationReasons: draft.escalationReasons },
  });

  if (!existingLead) {
    const stop = shouldStopFollowups({ lead, facts });
    if (!stop.stop) {
      await store.addFollowups(planFollowups(lead.id));
    }
  } else if (shouldStopFollowups({ lead, facts }).stop) {
    await store.cancelFollowups(lead.id, shouldStopFollowups({ lead, facts }).reason ?? 'stop');
  }

  if (!lead.opportunityId && scored.score >= 60 && geo.tier !== 'out_of_area') {
    const opp = await store.createOpportunity({
      leadId: lead.id,
      customerId: customer.id,
      title: lead.projectType || lead.projectSummary || 'Qualified lead',
      valueCents: lead.estimatedValueCents,
      stage: 'qualified',
    });
    lead = (await store.updateLead(lead.id, { opportunityId: opp.id })) ?? { ...lead, opportunityId: opp.id };
  }

  const decision = decideSend({
    mode,
    escalationReasons: draft.escalationReasons,
    aiPaused: lead.aiPaused,
  });

  let send = { attempted: false, sent: false, reason: decision.reason };
  if (decision.send && inbound.source === 'thumbtack' && lead.sourceLeadId) {
    send = { attempted: true, sent: false, reason: decision.reason };
    const result = await sendThumbtackMessage({ sourceLeadId: lead.sourceLeadId, body: draft.body });
    send = { attempted: true, sent: result.sent, reason: result.reason };
    if (result.sent) {
      await store.updateLead(lead.id, { draftStatus: 'sent', status: 'awaiting_customer', bucket: 'awaiting' });
    }
  } else if (decision.send) {
    send = { attempted: true, sent: false, reason: 'send_channel_unavailable' };
  }

  await store.markWebhookProcessed(eventId, inbound.source, lead.id);
  void draftMessage;

  return {
    duplicate: false,
    lead: (await store.getLead(lead.id)) ?? lead,
    customerId: customer.id,
    draftReply: draft.body,
    send,
    eventId,
  };
}

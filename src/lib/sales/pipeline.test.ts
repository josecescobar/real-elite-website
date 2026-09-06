import { afterEach, describe, expect, it } from 'vitest';
import { parseThumbtackPayload } from './connectors/thumbtack';
import { ingestInboundLead } from './pipeline';
import { resetSalesStore } from './store';

afterEach(() => {
  resetSalesStore();
});

const payload = {
  eventID: 'evt_pipe_1',
  eventType: 'NegotiationCreatedV4',
  data: {
    negotiationID: 'neg_pipe_1',
    customer: { name: 'Jane Homeowner', phone: '6815550142' },
    request: {
      category: 'Bathroom Remodel',
      description: 'Walk-in shower, hall bath, pan leaks.',
      location: { zipCode: '25401', city: 'Martinsburg', state: 'WV' },
    },
  },
};

describe('ingestInboundLead', () => {
  it('persists customer, lead, messages and a draft', async () => {
    const inbound = parseThumbtackPayload(payload)!;
    const result = await ingestInboundLead(inbound);
    expect(result.duplicate).toBe(false);
    expect(result.lead?.customerId).toBeTruthy();
    expect(result.lead?.draftReply).toMatch(/Jose/);
    expect(result.draftReply).toBe(result.lead?.draftReply);

    const again = await ingestInboundLead(inbound);
    expect(again.duplicate).toBe(true);
    expect(again.lead?.id).toBe(result.lead?.id);
  });
});

import { describe, expect, it } from 'vitest';
import { parseThumbtackPayload, thumbtackEventId, thumbtackEventType } from './thumbtack';

const payload = {
  eventID: 'evt_1',
  eventType: 'NegotiationCreatedV4',
  data: {
    negotiationID: 'neg_99',
    customer: { name: 'Jane Homeowner', phone: '6815550142', email: 'jane@example.com' },
    request: {
      category: 'Bathroom Remodel',
      description: 'Walk-in shower in the hall bath',
      location: { zipCode: '25401', city: 'Martinsburg', state: 'WV' },
    },
    estimatedValue: 12000,
    urgency: 'ASAP',
  },
};

describe('parseThumbtackPayload', () => {
  it('normalizes a NegotiationCreatedV4 body', () => {
    const inbound = parseThumbtackPayload(payload);
    expect(inbound?.source).toBe('thumbtack');
    expect(inbound?.sourceLeadId).toBe('neg_99');
    expect(inbound?.customer.fullName).toBe('Jane Homeowner');
    expect(inbound?.customer.zip).toBe('25401');
    expect(inbound?.projectType).toBe('Bathroom Remodel');
    expect(inbound?.estimatedValueCents).toBe(1_200_000);
    expect(thumbtackEventId(payload)).toBe('evt_1');
    expect(thumbtackEventType(payload)).toBe('NegotiationCreatedV4');
  });

  it('accepts messages and reviews', () => {
    const message = parseThumbtackPayload({
      eventID: 'evt_msg',
      eventType: 'MessageCreatedV4',
      data: { negotiationID: 'neg_99', message: { text: 'I can send photos tonight' } },
    });
    expect(message?.message).toMatch(/photos/);

    const review = parseThumbtackPayload({
      eventID: 'evt_rev',
      eventType: 'ReviewCreatedV4',
      data: { negotiationID: 'neg_99', review: { rating: 5, reviewText: 'Great crew' } },
    });
    expect(review?.review?.rating).toBe(5);
  });
});

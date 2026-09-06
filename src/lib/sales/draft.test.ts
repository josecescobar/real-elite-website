import { describe, expect, it } from 'vitest';
import { draftCustomerReply } from './draft';
import { mergeFacts } from './memory';

const baseLead = {
  projectType: 'Bathroom Remodel',
  projectSummary: 'Need a walk-in shower in the hall bath. Tile is cracked and the pan leaks.',
  city: 'Martinsburg',
  state: 'WV',
  zip: '25401',
  source: 'thumbtack' as const,
  urgency: 'this month',
};

describe('draftCustomerReply', () => {
  it('writes a project-specific first reply, not a generic help line', () => {
    const draft = draftCustomerReply({
      lead: baseLead,
      customerName: 'Jane Homeowner',
      facts: { fullName: 'Jane Homeowner' },
      inboundMessage: baseLead.projectSummary,
    });
    expect(draft.body.toLowerCase()).not.toMatch(/how can we help/);
    expect(draft.body).toMatch(/Jane/);
    expect(draft.body).toMatch(/walk-in shower|hall bath|Bathroom/i);
    expect(draft.body).toMatch(/Martinsburg|25401|Eastern Panhandle/);
    expect(draft.body).toMatch(/photo/i);
    expect(draft.body).toMatch(/Jose/);
  });

  it('does not re-ask for photos once the customer already sent them', () => {
    const facts = mergeFacts({}, { photosOffered: true, preferredContact: 'call' });
    const draft = draftCustomerReply({
      lead: baseLead,
      customerName: 'Jane',
      facts,
    });
    expect(draft.body.toLowerCase()).not.toMatch(/a few photos of the work area/);
    expect(draft.body).toMatch(/call/i);
  });

  it('escalates out-of-area and pricing talk to Jose', () => {
    const draft = draftCustomerReply({
      lead: { ...baseLead, zip: '90210', city: 'Beverly Hills', state: 'CA' },
      customerName: 'Pat',
      facts: { zip: '90210', city: 'Beverly Hills', state: 'CA' },
      inboundMessage: 'Can you do it for $3000 and pull the permits?',
    });
    expect(draft.escalationReasons).toEqual(expect.arrayContaining(['out_of_area', 'permits']));
    expect(draft.body).toMatch(/confirm we can cover|don’t lock|don't lock|I don’t lock|I don't lock/i);
  });
});

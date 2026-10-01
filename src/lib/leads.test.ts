import { describe, it, expect, vi, afterEach } from 'vitest';
import { inferLeadType, recordLead } from '@/lib/leads';
import { SMS_CONSENT_TEXT, SMS_CONSENT_TEXT_VERSION } from '@/lib/sms-consent';

const baseInput = {
  leadType: 'estimate' as const,
  luxury: false,
  fullName: 'Jane Homeowner',
  email: 'jane@example.com',
  phone: '(681) 555-0142',
  service: 'Bathroom Remodeling',
};

function configureSupabase() {
  process.env.SUPABASE_URL = 'https://proj.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'service_key';
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
});

describe('inferLeadType', () => {
  it('detects the luxury consultation prefix', () => {
    expect(inferLeadType('[Luxury Consultation] Kitchen Renovation')).toBe('luxury_consultation');
  });

  it('detects the instant roof quote (case-insensitive)', () => {
    expect(inferLeadType('Roofing — Instant Quote')).toBe('roof_quote');
    expect(inferLeadType('roofing — instant quote')).toBe('roof_quote');
  });

  it('defaults to estimate', () => {
    expect(inferLeadType('Bathroom Remodeling')).toBe('estimate');
  });
});

describe('recordLead', () => {
  it('no-ops (no fetch) when Supabase env vars are absent', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    await recordLead(baseInput);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('POSTs the lead to Supabase with auth headers and a snake_case row', async () => {
    configureSupabase();
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 201 }));
    vi.stubGlobal('fetch', fetchMock);

    await recordLead({ ...baseInput, zip: '25401', attribution: { utmSource: 'google' } });

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, opts] = fetchMock.mock.calls[0];
    expect(url).toBe('https://proj.supabase.co/rest/v1/leads');
    expect(opts.method).toBe('POST');
    expect(opts.headers.apikey).toBe('service_key');
    expect(opts.headers.Authorization).toBe('Bearer service_key');

    const row = JSON.parse(opts.body as string);
    expect(row).toMatchObject({
      lead_type: 'estimate',
      luxury: false,
      full_name: 'Jane Homeowner',
      service: 'Bathroom Remodeling',
      zip: '25401',
      utm_source: 'google',
    });
    expect(typeof row.id).toBe('string');
    expect(row.ts).toBeTruthy();
    expect(row.sms_consent).toBeNull();
  });

  it('stores the TCPA consent record on the ledger row', async () => {
    configureSupabase();
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 201 }));
    vi.stubGlobal('fetch', fetchMock);

    await recordLead({
      ...baseInput,
      consent: {
        consent: true,
        timestamp: '2026-09-29T22:00:00.000Z',
        pageUrl: 'https://www.realelitecontracting.com/contact',
        textVersion: SMS_CONSENT_TEXT_VERSION,
        text: SMS_CONSENT_TEXT,
        ip: '203.0.113.9',
        userAgent: 'TestAgent',
      },
    });

    const row = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(row).toMatchObject({
      sms_consent: true,
      sms_consent_at: '2026-09-29T22:00:00.000Z',
      sms_consent_page_url: 'https://www.realelitecontracting.com/contact',
      sms_consent_text_version: SMS_CONSENT_TEXT_VERSION,
      client_ip: '203.0.113.9',
      user_agent: 'TestAgent',
    });
    expect(row.sms_consent_text).toMatch(/Reply STOP to opt out/);
  });

  it('resolves (never throws) when the insert rejects', async () => {
    configureSupabase();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network')));
    await expect(recordLead(baseInput)).resolves.toBeUndefined();
  });

  it('resolves and logs when Supabase returns a non-ok status', async () => {
    configureSupabase();
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('bad', { status: 400 })));
    await recordLead(baseInput);
    expect(errSpy).toHaveBeenCalled();
  });
});

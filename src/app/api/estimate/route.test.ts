import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BUSINESS } from '@/lib/constants';

/**
 * route.ts captures RESEND_API_KEY into a const at module-eval time, so each
 * test re-imports the module after setting the env it needs. vi.resetModules()
 * also gives every test a fresh in-memory rate-limit map.
 */
async function loadPOST(opts: { resendKey?: string | null } = {}) {
  vi.resetModules();
  if (opts.resendKey === null) {
    delete process.env.RESEND_API_KEY;
  } else {
    process.env.RESEND_API_KEY = opts.resendKey ?? 'test_resend_key';
  }
  return (await import('@/app/api/estimate/route')).POST;
}

function makeRequest(body: unknown, ip = '203.0.113.1') {
  return new Request('http://localhost/api/estimate', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

const validBody = {
  fullName: 'Jane Homeowner',
  email: 'jane@example.com',
  phone: '(681) 555-0142',
  service: 'Bathroom Remodeling',
};

function mockResendOk() {
  const fetchMock = vi.fn().mockResolvedValue(new Response('{"id":"e1"}', { status: 200 }));
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  delete process.env.LEAD_WEBHOOK_URL;
  delete process.env.LEAD_WEBHOOK_SECRET;
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  delete process.env.RESEND_API_KEY;
  delete process.env.LEAD_WEBHOOK_URL;
  delete process.env.LEAD_WEBHOOK_SECRET;
  delete process.env.SMS_CONSENT_CONFIRMATION_ENABLED;
  delete process.env.TWILIO_ACCOUNT_SID;
  delete process.env.TWILIO_AUTH_TOKEN;
  delete process.env.TWILIO_FROM_NUMBER;
  delete process.env.TWILIO_TO_NUMBER;
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
});

describe('POST /api/estimate — validation', () => {
  it('rejects a missing required field with 400', async () => {
    const POST = await loadPOST();
    const { fullName, ...noName } = validBody;
    void fullName;
    const res = await POST(makeRequest(noName, '203.0.113.10'));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('Required fields are missing');
  });

  it('rejects a blank (whitespace-only) required field with 400', async () => {
    const POST = await loadPOST();
    const res = await POST(makeRequest({ ...validBody, service: '   ' }, '203.0.113.11'));
    expect(res.status).toBe(400);
  });

  it('rejects an over-length required field with 400', async () => {
    const POST = await loadPOST();
    const res = await POST(
      makeRequest({ ...validBody, fullName: 'a'.repeat(101) }, '203.0.113.12')
    );
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('fullName is too long');
  });

  it('rejects an invalid email with 400', async () => {
    const POST = await loadPOST();
    const res = await POST(makeRequest({ ...validBody, email: 'not-an-email' }, '203.0.113.13'));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('Invalid email address');
  });

  it('rejects an invalid phone with 400', async () => {
    const POST = await loadPOST();
    const res = await POST(makeRequest({ ...validBody, phone: '123' }, '203.0.113.14'));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('Invalid phone number');
  });

  it('rejects an invalid ZIP with 400', async () => {
    const POST = await loadPOST();
    const res = await POST(makeRequest({ ...validBody, zip: 'ABCDE' }, '203.0.113.15'));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('Invalid ZIP code');
  });

  it('rejects an optional field of the wrong type with 400', async () => {
    const POST = await loadPOST();
    const res = await POST(makeRequest({ ...validBody, message: 12345 }, '203.0.113.16'));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('message is invalid');
  });

  it('rejects an over-length optional field with 400', async () => {
    const POST = await loadPOST();
    const res = await POST(
      makeRequest({ ...validBody, message: 'a'.repeat(2001) }, '203.0.113.17')
    );
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('message is too long');
  });

  it('accepts a 5-digit and a ZIP+4 ZIP code', async () => {
    mockResendOk();
    let POST = await loadPOST();
    expect((await POST(makeRequest({ ...validBody, zip: '25401' }, '203.0.113.18'))).status).toBe(
      200
    );
    POST = await loadPOST();
    expect(
      (await POST(makeRequest({ ...validBody, zip: '25401-1234' }, '203.0.113.19'))).status
    ).toBe(200);
  });

  it('returns 500 when the request body is not valid JSON', async () => {
    const POST = await loadPOST();
    const res = await POST(makeRequest('}{not json', '203.0.113.20'));
    expect(res.status).toBe(500);
  });
});

describe('POST /api/estimate — anti-spam', () => {
  it('silently succeeds (200) and sends nothing when the honeypot is filled', async () => {
    const fetchMock = mockResendOk();
    const POST = await loadPOST();
    const res = await POST(
      makeRequest({ ...validBody, website: 'http://spam.example' }, '203.0.113.30')
    );
    expect(res.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rate-limits after 5 requests from the same IP', async () => {
    mockResendOk();
    const POST = await loadPOST();
    const ip = '203.0.113.31';
    for (let i = 0; i < 5; i++) {
      expect((await POST(makeRequest(validBody, ip))).status).toBe(200);
    }
    const blocked = await POST(makeRequest(validBody, ip));
    expect(blocked.status).toBe(429);
    expect(blocked.headers.get('Retry-After')).toBeTruthy();
  });
});

describe('POST /api/estimate — delivery', () => {
  it('returns 503 with a graceful message when RESEND_API_KEY is not configured', async () => {
    const POST = await loadPOST({ resendKey: null });
    const res = await POST(makeRequest(validBody, '203.0.113.40'));
    expect(res.status).toBe(503);
    expect((await res.json()).error).toMatch(/call .*\(681\) 534-5515/i);
  });

  it('returns 500 when the Resend API call fails', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response('{"error":"bad"}', { status: 422 }));
    vi.stubGlobal('fetch', fetchMock);
    const POST = await loadPOST();
    const res = await POST(makeRequest(validBody, '203.0.113.41'));
    expect(res.status).toBe(500);
    expect((await res.json()).error).toBe('Failed to send email');
  });

  it('posts to the Resend API and returns 200 on a valid submission', async () => {
    const fetchMock = mockResendOk();
    const POST = await loadPOST();
    const res = await POST(makeRequest(validBody, '203.0.113.42'));
    expect(res.status).toBe(200);
    // Two emails: the owner lead notification, then the customer confirmation.
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0][0]).toBe('https://api.resend.com/emails');
    expect(fetchMock.mock.calls[1][0]).toBe('https://api.resend.com/emails');
  });

  it('sends a confirmation email addressed to the customer', async () => {
    const fetchMock = mockResendOk();
    const POST = await loadPOST();
    await POST(makeRequest(validBody, '203.0.113.44'));
    const confirmation = JSON.parse(fetchMock.mock.calls[1][1].body as string);
    expect(confirmation.to).toEqual([validBody.email]);
    expect(confirmation.from).toContain('no-reply@realelitecontracting.com');
    expect(confirmation.subject).toMatch(/what happens next/i);
    // Warm, on-voice, and personalized to the first name.
    expect(confirmation.html).toContain('Hi Jane');
    expect(confirmation.html).toContain(BUSINESS.phone);
    expect(confirmation.html).toContain('reply by email');
    expect(confirmation.html).not.toContain('will call you');
  });

  it('still returns 200 when the customer confirmation email fails', async () => {
    // First call (owner email) succeeds; second (confirmation) rejects.
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response('{"id":"e1"}', { status: 200 }))
      .mockRejectedValueOnce(new Error('network'));
    vi.stubGlobal('fetch', fetchMock);
    const POST = await loadPOST();
    const res = await POST(makeRequest(validBody, '203.0.113.45'));
    expect(res.status).toBe(200);
  });

  it('records the first-touch source in the owner email', async () => {
    const fetchMock = mockResendOk();
    const POST = await loadPOST();
    await POST(
      makeRequest(
        { ...validBody, utmSource: 'google', utmMedium: 'lsa', landingPath: '/services/roofing' },
        '203.0.113.46'
      )
    );
    const owner = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(owner.html).toContain('Source');
    expect(owner.html).toContain('google / lsa');
    expect(owner.html).toContain('/services/roofing');
  });

  it('labels the owner email source "(direct)" when no attribution is present', async () => {
    const fetchMock = mockResendOk();
    const POST = await loadPOST();
    await POST(makeRequest(validBody, '203.0.113.47'));
    const owner = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(owner.html).toContain('(direct)');
  });

  it('HTML-escapes user input in the email body to prevent injection', async () => {
    const fetchMock = mockResendOk();
    const POST = await loadPOST();
    const res = await POST(
      makeRequest(
        {
          ...validBody,
          fullName: '<script>alert(1)</script>',
          message: 'Line one\nLine two & <b>bold</b>',
        },
        '203.0.113.43'
      )
    );
    expect(res.status).toBe(200);
    const sent = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(sent.html).not.toContain('<script>');
    expect(sent.html).toContain('&lt;script&gt;');
    expect(sent.html).toContain('&amp;');
    expect(sent.html).toContain('Line one<br>Line two');
  });

  it('adds the AI heads-up block to the owner email when AI_GATEWAY_API_KEY is set', async () => {
    process.env.AI_GATEWAY_API_KEY = 'test_gateway_key';
    const fetchMock = vi.fn().mockImplementation((url: string) => {
      if (url === 'https://ai-gateway.vercel.sh/v1/chat/completions') {
        return Promise.resolve(
          new Response(
            JSON.stringify({ choices: [{ message: { content: 'Wants a quote this week.' } }] }),
            { status: 200 }
          )
        );
      }
      return Promise.resolve(new Response('{"id":"e1"}', { status: 200 }));
    });
    vi.stubGlobal('fetch', fetchMock);
    const POST = await loadPOST();
    const res = await POST(makeRequest(validBody, '203.0.113.48'));
    expect(res.status).toBe(200);

    const ownerCall = fetchMock.mock.calls.find(
      ([url]) => url === 'https://api.resend.com/emails'
    );
    const owner = JSON.parse(ownerCall![1].body as string);
    expect(owner.html).toContain('AI Heads-Up');
    expect(owner.html).toContain('Wants a quote this week.');
    delete process.env.AI_GATEWAY_API_KEY;
  });

  it('skips the Job Board webhook when LEAD_WEBHOOK_URL is unset', async () => {
    const fetchMock = mockResendOk();
    const POST = await loadPOST();
    const res = await POST(makeRequest(validBody, '203.0.113.50'));
    expect(res.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls.every(([url]) => url === 'https://api.resend.com/emails')).toBe(true);
  });

  it('POSTs the elite-agent lead shape, including consent, when the webhook is set', async () => {
    process.env.LEAD_WEBHOOK_URL = 'https://job-board.example/api/leads';
    process.env.LEAD_WEBHOOK_SECRET = 'board-secret';
    const fetchMock = mockResendOk();
    const POST = await loadPOST();
    const res = await POST(
      makeRequest(
        {
          ...validBody,
          message: 'Kitchen roof leak',
          zip: '25401',
          town: 'Martinsburg',
          smsConsent: true,
          smsConsentTextVersion: '2026-09-30',
          pageUrl: 'https://www.realelitecontracting.com/contact',
        },
        '203.0.113.51'
      )
    );
    expect(res.status).toBe(200);
    const webhookCall = fetchMock.mock.calls.find(
      ([url]) => url === 'https://job-board.example/api/leads'
    );
    expect(webhookCall).toBeTruthy();
    expect(webhookCall![1].headers.Authorization).toBe('Bearer board-secret');
    const payload = JSON.parse(webhookCall![1].body as string);
    expect(payload).toMatchObject({
      source: 'real_elite_contracting',
      company_name: 'Real Elite Contracting',
      name: 'Jane Homeowner',
      phone: '(681) 555-0142',
      callback_number: '(681) 555-0142',
      town: 'Martinsburg',
      zip: '25401',
      job_type: 'Bathroom Remodeling',
      summary: 'Kitchen roof leak',
      spam: false,
      urgent: false,
      outcome: 'website_form',
      recording_link: null,
      transcript_link: null,
      consent: true,
      consent_page_url: 'https://www.realelitecontracting.com/contact',
      consent_text_version: '2026-09-30',
      ip: '203.0.113.51',
    });
    expect(payload.consent_text).toMatch(/Reply STOP to opt out/);
    expect(payload.call_sid).toMatch(/^web-/);
    expect(payload.consent_timestamp).toBeTruthy();
    const owner = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(owner.html).toContain('Text consent');
    expect(owner.html).toContain('Yes (2026-09-30)');
    const confirmation = JSON.parse(
      fetchMock.mock.calls
        .filter(([url]) => url === 'https://api.resend.com/emails')
        .at(-1)![1].body as string
    );
    expect(confirmation.html).toContain('may text this number');
  });

  it('stores consent=false when the box is unchecked or the text version does not match', async () => {
    process.env.LEAD_WEBHOOK_URL = 'https://job-board.example/api/leads';
    process.env.LEAD_WEBHOOK_SECRET = 'board-secret';
    const fetchMock = mockResendOk();
    const POST = await loadPOST();
    await POST(
      makeRequest(
        { ...validBody, smsConsent: true, smsConsentTextVersion: '1999-01-01' },
        '203.0.113.52'
      )
    );
    const payload = JSON.parse(
      fetchMock.mock.calls.find(([url]) => url === 'https://job-board.example/api/leads')![1]
        .body as string
    );
    expect(payload.consent).toBe(false);
    expect(payload.consent_text_version).toBe('2026-09-30');
  });

  it('still returns 200 when the lead webhook fails', async () => {
    process.env.LEAD_WEBHOOK_URL = 'https://job-board.example/api/leads';
    const fetchMock = vi.fn().mockImplementation((url: string) => {
      if (url === 'https://job-board.example/api/leads') {
        return Promise.reject(new Error('webhook down'));
      }
      return Promise.resolve(new Response('{"id":"e1"}', { status: 200 }));
    });
    vi.stubGlobal('fetch', fetchMock);
    const POST = await loadPOST();
    const res = await POST(makeRequest(validBody, '203.0.113.53'));
    expect(res.status).toBe(200);
  });

  it('does not call the AI Gateway and omits the AI block when AI_GATEWAY_API_KEY is unset', async () => {
    const fetchMock = mockResendOk();
    const POST = await loadPOST();
    await POST(makeRequest(validBody, '203.0.113.49'));
    expect(fetchMock).toHaveBeenCalledTimes(2); // owner + confirmation only, no Gateway call
    const owner = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(owner.html).not.toContain('AI Heads-Up');
  });
});

describe('POST /api/estimate — SMS enrollment confirmation', () => {
  const SAMPLE_5 =
    'Real Elite Contracting: You are subscribed to texts about your project, including estimate scheduling and updates. Message frequency varies. Msg & data rates may apply. Reply HELP for help or STOP to opt out. Support: (681) 534-5515.';

  const optedIn = {
    ...validBody,
    smsConsent: true,
    smsConsentTextVersion: '2026-09-30',
    pageUrl: 'https://www.realelitecontracting.com/contact',
  };

  function enableConfirmation() {
    process.env.SMS_CONSENT_CONFIRMATION_ENABLED = 'true';
    process.env.TWILIO_ACCOUNT_SID = 'AC_test';
    process.env.TWILIO_AUTH_TOKEN = 'token_test';
    process.env.TWILIO_FROM_NUMBER = '+13045550100';
    process.env.SUPABASE_URL = 'https://proj.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service_key';
    delete process.env.TWILIO_TO_NUMBER;
  }

  function mockFlow(mode: 'ok' | 'ledger-fail' | 'twilio-reject' = 'ok') {
    let claims = 0;
    const fetchMock = vi.fn().mockImplementation(async (url: string, init?: RequestInit) => {
      const target = String(url);
      if (target.includes('/rest/v1/leads')) {
        if (mode === 'ledger-fail') return new Response('nope', { status: 500 });
        const sent = JSON.parse(String(init?.body)) as { id: string; sms_consent: boolean };
        return new Response(JSON.stringify([{ id: sent.id, sms_consent: sent.sms_consent }]), {
          status: 201,
        });
      }
      if (target.includes('/sms_consent_evidence')) {
        const sent = JSON.parse(String(init?.body)) as { id: string; phone_e164: string };
        return new Response(
          JSON.stringify([{ id: sent.id, consent: true, phone_e164: sent.phone_e164 }]),
          { status: 201 }
        );
      }
      if (target.includes('/rpc/claim_sms_enrollment_send')) {
        claims += 1;
        const evidenceId = (JSON.parse(String(init?.body)) as { p_evidence_id: string }).p_evidence_id;
        const body =
          claims === 1
            ? { claimed: true, reason: 'claimed', evidence_id: evidenceId }
            : { claimed: false, reason: 'replay' };
        return new Response(JSON.stringify(body), { status: 200 });
      }
      if (target.includes('/sms_phone_state') && init?.method !== 'PATCH') {
        return new Response(JSON.stringify([{ consent: true, stopped: false }]), { status: 200 });
      }
      if (target.includes('api.twilio.com')) {
        if (mode === 'twilio-reject') return new Response('rejected', { status: 400 });
        return new Response('{"sid":"SM1"}', { status: 201 });
      }
      return new Response('{"id":"e1"}', { status: 200 });
    });
    vi.stubGlobal('fetch', fetchMock);
    return fetchMock;
  }

  it('does not text the customer when the flag is off', async () => {
    delete process.env.SMS_CONSENT_CONFIRMATION_ENABLED;
    process.env.TWILIO_ACCOUNT_SID = 'AC_test';
    process.env.TWILIO_AUTH_TOKEN = 'token_test';
    process.env.TWILIO_FROM_NUMBER = '+13045550100';
    const fetchMock = mockResendOk();
    const POST = await loadPOST();
    const res = await POST(makeRequest(optedIn, '203.0.113.70'));
    expect(res.status).toBe(200);
    expect(fetchMock.mock.calls.some(([url]) => String(url).includes('api.twilio.com'))).toBe(
      false
    );
  });

  it('still texts the owner when the customer flag is off', async () => {
    delete process.env.SMS_CONSENT_CONFIRMATION_ENABLED;
    process.env.TWILIO_ACCOUNT_SID = 'AC_test';
    process.env.TWILIO_AUTH_TOKEN = 'token_test';
    process.env.TWILIO_FROM_NUMBER = '+13045550100';
    process.env.TWILIO_TO_NUMBER = '+13045559999';
    const fetchMock = mockResendOk();
    const POST = await loadPOST();
    const res = await POST(makeRequest(optedIn, '203.0.113.73'));
    expect(res.status).toBe(200);
    const twilioCalls = fetchMock.mock.calls.filter(([url]) =>
      String(url).includes('api.twilio.com')
    );
    expect(twilioCalls).toHaveLength(1);
    const params = new URLSearchParams(twilioCalls[0][1].body as string);
    expect(params.get('To')).toBe('+13045559999');
    expect(params.get('Body')).toContain('New Lead');
    expect(params.get('Body')).not.toContain('You are subscribed');
  });

  it('returns 200 and skips the customer text when consent storage fails', async () => {
    enableConfirmation();
    const fetchMock = mockFlow('ledger-fail');
    const POST = await loadPOST();
    const res = await POST(makeRequest(optedIn, '203.0.113.74'));
    expect(res.status).toBe(200);
    const twilioCalls = fetchMock.mock.calls.filter(([url]) =>
      String(url).includes('api.twilio.com')
    );
    expect(twilioCalls).toHaveLength(0);
    const emails = fetchMock.mock.calls.filter(([url]) => String(url).includes('api.resend.com'));
    expect(emails.length).toBeGreaterThanOrEqual(2);
  });

  it('sends sample 5 once on replay and still returns 200 when Twilio rejects it', async () => {
    enableConfirmation();
    const fetchMock = mockFlow('twilio-reject');
    const POST = await loadPOST();
    const first = await POST(makeRequest(optedIn, '203.0.113.71'));
    const second = await POST(makeRequest(optedIn, '203.0.113.72'));
    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    const twilioCalls = fetchMock.mock.calls.filter(([url]) =>
      String(url).includes('api.twilio.com')
    );
    expect(twilioCalls).toHaveLength(1);
    const params = new URLSearchParams(twilioCalls[0][1].body as string);
    expect(params.get('Body')).toBe(SAMPLE_5);
    expect(params.get('To')).toBe('+16815550142');
  });
});

describe('POST /api/estimate — consultation intake fields (town, referralSource)', () => {
  it('accepts the optional fields and puts them in the owner email', async () => {
    const fetchMock = mockResendOk();
    const POST = await loadPOST();
    const res = await POST(
      makeRequest(
        {
          ...validBody,
          service: '[Luxury Consultation] Kitchen Renovation',
          town: 'Ashburn',
          referralSource: 'A real estate agent',
        },
        '203.0.113.60'
      )
    );
    expect(res.status).toBe(200);
    const ownerEmail = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(ownerEmail.html).toContain('Ashburn');
    expect(ownerEmail.html).toContain('Heard about us');
    expect(ownerEmail.html).toContain('A real estate agent');
  });

  it('still accepts a body that omits them (backward compatible)', async () => {
    mockResendOk();
    const POST = await loadPOST();
    const res = await POST(makeRequest(validBody, '203.0.113.61'));
    expect(res.status).toBe(200);
  });

  it('rejects an over-length town with 400', async () => {
    const POST = await loadPOST();
    const res = await POST(makeRequest({ ...validBody, town: 'a'.repeat(81) }, '203.0.113.62'));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('town is too long');
  });
});

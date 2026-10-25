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
  delete process.env.TURNSTILE_SECRET_KEY;
  delete process.env.VERCEL_ENV;
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.UPSTASH_REDIS_REST_TOKEN;
  delete process.env.ESTIMATE_CONFIRM_DAILY_CAP;
  delete process.env.ESTIMATE_SMS_DAILY_CAP;
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
    // Generic greeting: the submitted name is never echoed in HTML or text.
    expect(confirmation.html).toContain('Hello,');
    expect(confirmation.html).not.toContain('Jane');
    expect(confirmation.html).not.toContain('Homeowner');
    expect(confirmation.text).toContain('Hello,');
    expect(confirmation.text).not.toContain('Jane');
    expect(confirmation.text).not.toContain('Homeowner');
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

function resendMessages(fetchMock: ReturnType<typeof vi.fn>) {
  return fetchMock.mock.calls
    .filter(([url]) => url === 'https://api.resend.com/emails')
    .map(([, init]) => JSON.parse((init as RequestInit).body as string) as { to: string[]; from: string; html: string; text?: string });
}

function enableOwnerSms() {
  process.env.TWILIO_ACCOUNT_SID = 'AC_test';
  process.env.TWILIO_AUTH_TOKEN = 'token_test';
  process.env.TWILIO_FROM_NUMBER = '+13045550100';
  process.env.TWILIO_TO_NUMBER = '+13045559999';
}

describe('POST /api/estimate — H1 abuse controls', () => {
  it('accepts a lead with no token when TURNSTILE_SECRET_KEY is unset', async () => {
    delete process.env.TURNSTILE_SECRET_KEY;
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const fetchMock = mockResendOk();
    const POST = await loadPOST();
    const res = await POST(makeRequest(validBody, '203.0.113.80'));
    expect(res.status).toBe(200);
    expect(resendMessages(fetchMock)).toHaveLength(2);
    expect(warn).toHaveBeenCalledWith(expect.stringMatching(/TURNSTILE_SECRET_KEY unset/));
  });

  it('returns 400 and sends nothing when the secret is set and the token is missing', async () => {
    process.env.TURNSTILE_SECRET_KEY = 'turnstile-secret';
    const fetchMock = mockResendOk();
    const POST = await loadPOST();
    const res = await POST(makeRequest(validBody, '203.0.113.81'));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/Verification failed/);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns 400 and sends nothing when Cloudflare rejects the token', async () => {
    process.env.TURNSTILE_SECRET_KEY = 'turnstile-secret';
    const fetchMock = vi.fn().mockImplementation((url: string) => {
      if (String(url).includes('siteverify')) {
        return Promise.resolve(new Response(JSON.stringify({ success: false }), { status: 200 }));
      }
      return Promise.resolve(new Response('{"id":"e1"}', { status: 200 }));
    });
    vi.stubGlobal('fetch', fetchMock);
    const POST = await loadPOST();
    const res = await POST(
      makeRequest({ ...validBody, turnstileToken: 'bad-token' }, '203.0.113.82')
    );
    expect(res.status).toBe(400);
    expect(resendMessages(fetchMock)).toHaveLength(0);
    expect(fetchMock.mock.calls.some(([url]) => String(url).includes('api.twilio.com'))).toBe(false);
  });

  it('sends the lead when Cloudflare accepts the token', async () => {
    process.env.TURNSTILE_SECRET_KEY = 'turnstile-secret';
    const fetchMock = vi.fn().mockImplementation((url: string) => {
      if (String(url).includes('siteverify')) {
        return Promise.resolve(new Response(JSON.stringify({ success: true }), { status: 200 }));
      }
      return Promise.resolve(new Response('{"id":"e1"}', { status: 200 }));
    });
    vi.stubGlobal('fetch', fetchMock);
    const POST = await loadPOST();
    const res = await POST(
      makeRequest({ ...validBody, turnstileToken: 'good-token' }, '203.0.113.83')
    );
    expect(res.status).toBe(200);
    expect(resendMessages(fetchMock)).toHaveLength(2);
  });

  it('still swallows a filled honeypot when Turnstile is enforced', async () => {
    process.env.TURNSTILE_SECRET_KEY = 'turnstile-secret';
    const fetchMock = mockResendOk();
    const POST = await loadPOST();
    const res = await POST(
      makeRequest({ ...validBody, website: 'http://spam.example' }, '203.0.113.84')
    );
    expect(res.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('skips the customer confirmation in production when Upstash is unset, and still sends the owner email, SMS, and webhook', async () => {
    process.env.VERCEL_ENV = 'production';
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    enableOwnerSms();
    process.env.LEAD_WEBHOOK_URL = 'https://job-board.example/api/leads';
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const fetchMock = mockResendOk();
    const POST = await loadPOST();
    const res = await POST(makeRequest(validBody, '203.0.113.85'));
    expect(res.status).toBe(200);
    const messages = resendMessages(fetchMock);
    expect(messages.filter((message) => message.from.includes('no-reply@'))).toHaveLength(0);
    expect(messages.filter((message) => message.from.includes('info@'))).toHaveLength(1);
    expect(fetchMock.mock.calls.some(([url]) => String(url).includes('api.twilio.com'))).toBe(true);
    expect(
      fetchMock.mock.calls.some(([url]) => url === 'https://job-board.example/api/leads')
    ).toBe(true);
    expect(warn).toHaveBeenCalledWith(expect.stringMatching(/UPSTASH_REDIS_REST_URL\/TOKEN unset/));
  });

  it('sends at most one customer confirmation per email and per phone in 24h', async () => {
    const fetchMock = mockResendOk();
    const POST = await loadPOST();
    const first = await POST(
      makeRequest(
        { ...validBody, email: 'Jane.Cap@example.com', phone: '(681) 555-0160' },
        '203.0.113.86'
      )
    );
    const sameEmail = await POST(
      makeRequest(
        { ...validBody, email: 'jane.cap@example.com', phone: '(681) 555-0161' },
        '203.0.113.87'
      )
    );
    const samePhone = await POST(
      makeRequest(
        { ...validBody, email: 'other@example.com', phone: '16815550160' },
        '203.0.113.88'
      )
    );
    expect(first.status).toBe(200);
    expect(sameEmail.status).toBe(200);
    expect(samePhone.status).toBe(200);
    const confirmations = resendMessages(fetchMock).filter((message) =>
      message.from.includes('no-reply@')
    );
    expect(confirmations).toHaveLength(1);
    expect(confirmations[0].to).toEqual(['Jane.Cap@example.com']);
    expect(resendMessages(fetchMock).filter((message) => message.from.includes('info@'))).toHaveLength(3);
  });

  it('skips customer confirmations after the daily cap and still accepts the lead', async () => {
    process.env.ESTIMATE_CONFIRM_DAILY_CAP = '1';
    const fetchMock = mockResendOk();
    const POST = await loadPOST();
    expect((await POST(makeRequest(
      { ...validBody, email: 'one@example.com', phone: '(681) 555-0170' },
      '203.0.113.89'
    ))).status).toBe(200);
    expect((await POST(makeRequest(
      { ...validBody, email: 'two@example.com', phone: '(681) 555-0171' },
      '203.0.113.90'
    ))).status).toBe(200);
    const messages = resendMessages(fetchMock);
    expect(messages.filter((message) => message.from.includes('no-reply@'))).toHaveLength(1);
    expect(messages.filter((message) => message.from.includes('info@'))).toHaveLength(2);
  });

  it('skips owner SMS after the daily cap and still accepts the lead', async () => {
    process.env.ESTIMATE_SMS_DAILY_CAP = '1';
    enableOwnerSms();
    const fetchMock = mockResendOk();
    const POST = await loadPOST();
    expect((await POST(makeRequest(
      { ...validBody, email: 'sms1@example.com', phone: '(681) 555-0180' },
      '203.0.113.91'
    ))).status).toBe(200);
    expect((await POST(makeRequest(
      { ...validBody, email: 'sms2@example.com', phone: '(681) 555-0181' },
      '203.0.113.92'
    ))).status).toBe(200);
    const twilioCalls = fetchMock.mock.calls.filter(([url]) => String(url).includes('api.twilio.com'));
    expect(twilioCalls).toHaveLength(1);
    expect(resendMessages(fetchMock).filter((message) => message.from.includes('info@'))).toHaveLength(2);
  });

  it('strips URLs from the owner SMS body', async () => {
    enableOwnerSms();
    const fetchMock = mockResendOk();
    const POST = await loadPOST();
    const res = await POST(
      makeRequest(
        {
          ...validBody,
          fullName: 'www.evil-site.com/claim Jane',
          service: 'Visit https://phish.example/a',
          town: 'evil-site.com/claim',
        },
        '203.0.113.93'
      )
    );
    expect(res.status).toBe(200);
    const twilioCall = fetchMock.mock.calls.find(([url]) => String(url).includes('api.twilio.com'));
    const params = new URLSearchParams(twilioCall![1].body as string);
    const sms = params.get('Body') ?? '';
    expect(sms).toContain('New Lead');
    expect(sms).toContain('Jane');
    expect(sms).not.toMatch(/https?:\/\//);
    expect(sms).not.toMatch(/evil-site/);
    expect(sms).not.toMatch(/phish/);
    expect(sms.length).toBeLessThanOrEqual(480);
  });
});

describe('POST /api/estimate — independent delivery channels and log redaction', () => {
  function mockChannels(opts: { resend: number; ledger: number; webhook: number; twilio: number; twilioBody?: string }) {
    const fetchMock = vi.fn().mockImplementation(async (url: string, init?: RequestInit) => {
      const target = String(url);
      if (target === 'https://api.resend.com/emails') {
        return new Response('{"message":"unavailable"}', { status: opts.resend });
      }
      if (target.includes('/rest/v1/leads')) {
        if (opts.ledger >= 300) return new Response('nope', { status: opts.ledger });
        const sent = JSON.parse(String(init?.body)) as { id: string; sms_consent: boolean };
        return new Response(JSON.stringify([{ id: sent.id, sms_consent: sent.sms_consent }]), {
          status: 201,
        });
      }
      if (target === 'https://job-board.example/api/leads') {
        return new Response('{}', { status: opts.webhook });
      }
      if (target.includes('api.twilio.com')) {
        return new Response(opts.twilioBody ?? '{"sid":"SM1"}', { status: opts.twilio });
      }
      return new Response('{}', { status: 200 });
    });
    vi.stubGlobal('fetch', fetchMock);
    return fetchMock;
  }

  function enableAllChannels() {
    enableOwnerSms();
    process.env.SUPABASE_URL = 'https://proj.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service_key';
    process.env.LEAD_WEBHOOK_URL = 'https://job-board.example/api/leads';
  }

  const attempted = (fetchMock: ReturnType<typeof vi.fn>, match: (url: string) => boolean) =>
    fetchMock.mock.calls.some(([url]) => match(String(url)));

  it('still attempts SMS, ledger and webhook and accepts the lead when Resend returns 503', async () => {
    enableAllChannels();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const fetchMock = mockChannels({ resend: 503, ledger: 201, webhook: 200, twilio: 201 });
    const POST = await loadPOST();
    const res = await POST(makeRequest(validBody, '203.0.113.120'));
    expect(res.status).toBe(200);
    expect(attempted(fetchMock, (u) => u.includes('api.twilio.com'))).toBe(true);
    expect(attempted(fetchMock, (u) => u.includes('/rest/v1/leads'))).toBe(true);
    expect(attempted(fetchMock, (u) => u === 'https://job-board.example/api/leads')).toBe(true);
  });

  it('accepts the lead when only the webhook succeeds', async () => {
    enableAllChannels();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    mockChannels({ resend: 503, ledger: 500, webhook: 200, twilio: 201 });
    const POST = await loadPOST();
    expect((await POST(makeRequest(validBody, '203.0.113.121'))).status).toBe(200);
  });

  it('returns 500 and sends no customer confirmation only when every durable channel failed', async () => {
    enableAllChannels();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const fetchMock = mockChannels({ resend: 503, ledger: 500, webhook: 502, twilio: 201 });
    const POST = await loadPOST();
    const res = await POST(makeRequest(validBody, '203.0.113.122'));
    expect(res.status).toBe(500);
    expect(attempted(fetchMock, (u) => u.includes('api.twilio.com'))).toBe(true);
    const confirmations = resendMessages(fetchMock).filter((m) => m.from.includes('no-reply@'));
    expect(confirmations).toHaveLength(0);
  });

  it('logs a Twilio error body with the phone number masked to the last 4 digits', async () => {
    enableOwnerSms();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockChannels({
      resend: 200,
      ledger: 201,
      webhook: 200,
      twilio: 400,
      twilioBody: '{"code":21211,"message":"The \'To\' number +16815550142 is not valid. Contact jane@example.com"}',
    });
    const POST = await loadPOST();
    expect((await POST(makeRequest(validBody, '203.0.113.123'))).status).toBe(200);
    await vi.waitFor(() => {
      expect(error).toHaveBeenCalledWith('Twilio SMS failed', expect.anything());
    });
    const logged = JSON.stringify(error.mock.calls);
    expect(logged).not.toContain('6815550142');
    expect(logged).not.toContain('jane@example.com');
    expect(logged).toContain('***0142');
  });
});

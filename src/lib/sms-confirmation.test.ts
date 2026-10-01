import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SMS_CONSENT_TEXT, SMS_CONSENT_TEXT_VERSION, type StoredSmsConsent } from '@/lib/sms-consent';
import { SMS_CONFIRMATION_TEXT, sendSmsConsentConfirmation } from '@/lib/sms-confirmation';

const SAMPLE_5 =
  'Real Elite Contracting: You are subscribed to texts about your project, including estimate scheduling and updates. Message frequency varies. Msg & data rates may apply. Reply HELP for help or STOP to opt out. Support: (681) 534-5515.';

const EVIDENCE_ID = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const PHONE = '+16815550142';

function consent(overrides: Partial<StoredSmsConsent> = {}): StoredSmsConsent {
  return {
    consent: true,
    timestamp: '2026-09-30T20:40:00.000Z',
    pageUrl: 'https://www.realelitecontracting.com/contact',
    textVersion: SMS_CONSENT_TEXT_VERSION,
    text: SMS_CONSENT_TEXT,
    ip: '203.0.113.1',
    userAgent: 'vitest',
    ...overrides,
  };
}

function enableTwilio() {
  process.env.TWILIO_ACCOUNT_SID = 'AC_test';
  process.env.TWILIO_AUTH_TOKEN = 'token_test';
  process.env.TWILIO_FROM_NUMBER = '+13045550100';
}

function enableStore() {
  process.env.SUPABASE_URL = 'https://proj.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'service_key';
}

function mockDurableSend(options?: {
  evidenceOk?: boolean;
  claim?: Record<string, unknown>;
  lookup?: unknown;
  twilioStatus?: number;
  onClaim?: () => Record<string, unknown>;
}) {
  const evidenceOk = options?.evidenceOk ?? true;
  const claim = options?.claim ?? {
    claimed: true,
    reason: 'claimed',
    evidence_id: EVIDENCE_ID,
  };
  const lookup = options?.lookup ?? [{ consent: true, stopped: false }];
  const twilioStatus = options?.twilioStatus ?? 201;
  const fetchMock = vi.fn().mockImplementation(async (url: string, init?: RequestInit) => {
    const target = String(url);
    if (target.includes('/sms_consent_evidence')) {
      const sent = JSON.parse(String(init?.body));
      if (!evidenceOk) return new Response('nope', { status: 500 });
      return new Response(
        JSON.stringify([
          { id: sent.id, consent: true, phone_e164: sent.phone_e164 },
        ]),
        { status: 201 }
      );
    }
    if (target.includes('/rpc/claim_sms_enrollment_send')) {
      return new Response(JSON.stringify(options?.onClaim ? options.onClaim() : claim), {
        status: 200,
      });
    }
    if (target.includes('/sms_phone_state') && init?.method !== 'PATCH') {
      return new Response(JSON.stringify(lookup), { status: 200 });
    }
    if (target.includes('/sms_phone_state')) {
      return new Response('[]', { status: 200 });
    }
    if (target.includes('api.twilio.com')) {
      return new Response(JSON.stringify({ sid: 'SM1' }), { status: twilioStatus });
    }
    return new Response('{}', { status: 200 });
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

function twilioCalls(fetchMock: ReturnType<typeof vi.fn>) {
  return fetchMock.mock.calls.filter(([url]) => String(url).includes('api.twilio.com'));
}

beforeEach(() => {
  vi.spyOn(console, 'info').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  delete process.env.SMS_CONSENT_CONFIRMATION_ENABLED;
  delete process.env.TWILIO_ACCOUNT_SID;
  delete process.env.TWILIO_AUTH_TOKEN;
  delete process.env.TWILIO_FROM_NUMBER;
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
});

describe('SMS confirmation copy', () => {
  it('matches sample 5 exactly', () => {
    expect(SMS_CONFIRMATION_TEXT).toBe(SAMPLE_5);
  });
});

describe('sendSmsConsentConfirmation', () => {
  it('defaults off and sends nothing', async () => {
    enableTwilio();
    enableStore();
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const result = await sendSmsConsentConfirmation({
      phone: '(681) 555-0142',
      consent: consent(),
      consentId: EVIDENCE_ID,
    });

    expect(result).toEqual({ skipped: true, reason: 'disabled' });
    expect(console.info).toHaveBeenCalledWith('sms-consent-confirmation', result);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('records unconfigured (503) and sends nothing when Twilio env is missing', async () => {
    process.env.SMS_CONSENT_CONFIRMATION_ENABLED = 'true';
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const result = await sendSmsConsentConfirmation({
      phone: '(681) 555-0142',
      consent: consent(),
      consentId: EVIDENCE_ID,
    });

    expect(result).toEqual({ skipped: true, reason: 'unconfigured', status: 503 });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('does not send when consent is false', async () => {
    process.env.SMS_CONSENT_CONFIRMATION_ENABLED = 'true';
    enableTwilio();
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const result = await sendSmsConsentConfirmation({
      phone: '(681) 555-0142',
      consent: consent({ consent: false }),
      consentId: EVIDENCE_ID,
    });

    expect(result).toEqual({ skipped: true, reason: 'no_consent' });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('does not send when the text version does not match', async () => {
    process.env.SMS_CONSENT_CONFIRMATION_ENABLED = 'true';
    enableTwilio();
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const result = await sendSmsConsentConfirmation({
      phone: '(681) 555-0142',
      consent: consent({ textVersion: '1999-01-01' }),
      consentId: EVIDENCE_ID,
    });

    expect(result).toEqual({ skipped: true, reason: 'text_version_mismatch' });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('does not send without an echoed consent id', async () => {
    process.env.SMS_CONSENT_CONFIRMATION_ENABLED = 'true';
    enableTwilio();
    enableStore();
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const result = await sendSmsConsentConfirmation({
      phone: '(681) 555-0142',
      consent: consent(),
      consentId: null,
    });

    expect(result).toEqual({ skipped: true, reason: 'no_durable_consent' });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('does not send when consent persistence fails', async () => {
    process.env.SMS_CONSENT_CONFIRMATION_ENABLED = 'true';
    enableTwilio();
    enableStore();
    const fetchMock = mockDurableSend({ evidenceOk: false });

    const result = await sendSmsConsentConfirmation({
      phone: '(681) 555-0142',
      consent: consent(),
      consentId: EVIDENCE_ID,
    });

    expect(result).toEqual({ skipped: true, reason: 'persistence_failed' });
    expect(twilioCalls(fetchMock)).toHaveLength(0);
  });

  it('does not send again when the claim says replay', async () => {
    process.env.SMS_CONSENT_CONFIRMATION_ENABLED = 'true';
    enableTwilio();
    enableStore();
    let claims = 0;
    const fetchMock = mockDurableSend({
      onClaim: () => {
        claims += 1;
        return claims === 1
          ? { claimed: true, reason: 'claimed', evidence_id: EVIDENCE_ID }
          : { claimed: false, reason: 'replay' };
      },
    });

    const first = await sendSmsConsentConfirmation({
      phone: '(681) 555-0142',
      consent: consent(),
      consentId: EVIDENCE_ID,
    });
    const second = await sendSmsConsentConfirmation({
      phone: '(681) 555-0142',
      consent: consent(),
      consentId: EVIDENCE_ID,
    });

    expect(first).toEqual({ skipped: false, sent: true });
    expect(second).toEqual({ skipped: true, reason: 'already_enrolled' });
    expect(twilioCalls(fetchMock)).toHaveLength(1);
    const params = new URLSearchParams(twilioCalls(fetchMock)[0][1].body as string);
    expect(params.get('To')).toBe(PHONE);
    expect(params.get('Body')).toBe(SAMPLE_5);
  });

  it('does not send when the phone is stopped', async () => {
    process.env.SMS_CONSENT_CONFIRMATION_ENABLED = 'true';
    enableTwilio();
    enableStore();
    const fetchMock = mockDurableSend({
      claim: { claimed: false, reason: 'stopped' },
    });

    const result = await sendSmsConsentConfirmation({
      phone: '(681) 555-0142',
      consent: consent(),
      consentId: EVIDENCE_ID,
    });

    expect(result).toEqual({ skipped: true, reason: 'opted_out' });
    expect(twilioCalls(fetchMock)).toHaveLength(0);
  });

  it('still sends the confirmation while send_status is claimed', async () => {
    process.env.SMS_CONSENT_CONFIRMATION_ENABLED = 'true';
    enableTwilio();
    enableStore();
    const fetchMock = mockDurableSend({
      lookup: [{ consent: true, stopped: false, send_status: 'claimed' }],
    });

    const result = await sendSmsConsentConfirmation({
      phone: '(681) 555-0142',
      consent: consent(),
      consentId: EVIDENCE_ID,
    });

    expect(result).toEqual({ skipped: false, sent: true });
    expect(twilioCalls(fetchMock)).toHaveLength(1);
    const params = new URLSearchParams(twilioCalls(fetchMock)[0][1].body as string);
    expect(params.get('Body')).toBe(SAMPLE_5);
  });

  it('sends the sample-5 body once when the claim wins', async () => {
    process.env.SMS_CONSENT_CONFIRMATION_ENABLED = '1';
    enableTwilio();
    enableStore();
    const fetchMock = mockDurableSend();

    const result = await sendSmsConsentConfirmation({
      phone: '(681) 555-0142',
      consent: consent(),
      consentId: EVIDENCE_ID,
    });

    expect(result).toEqual({ skipped: false, sent: true });
    expect(SMS_CONFIRMATION_TEXT).toBe(SAMPLE_5);
    expect(twilioCalls(fetchMock)).toHaveLength(1);
    expect(String(twilioCalls(fetchMock)[0][0])).toContain(
      'https://api.twilio.com/2010-04-01/Accounts/AC_test/Messages.json'
    );
    const params = new URLSearchParams(twilioCalls(fetchMock)[0][1].body as string);
    expect(params.get('To')).toBe(PHONE);
    expect(params.get('From')).toBe('+13045550100');
    expect(params.get('Body')).toBe(SAMPLE_5);
    const finish = fetchMock.mock.calls.find(
      ([url, init]) => String(url).includes('/sms_phone_state') && init?.method === 'PATCH'
    );
    expect(JSON.parse(String(finish?.[1].body))).toMatchObject({
      send_status: 'accepted',
      provider_sid: 'SM1',
    });
  });

  it('swallows a Twilio error and does not throw', async () => {
    process.env.SMS_CONSENT_CONFIRMATION_ENABLED = 'true';
    enableTwilio();
    enableStore();
    const fetchMock = mockDurableSend({ twilioStatus: 400 });

    await expect(
      sendSmsConsentConfirmation({
        phone: '(681) 555-0142',
        consent: consent(),
        consentId: EVIDENCE_ID,
      })
    ).resolves.toEqual({ skipped: false, sent: false, error: 'twilio_error' });
    expect(twilioCalls(fetchMock)).toHaveLength(1);
    const finish = fetchMock.mock.calls.find(
      ([url, init]) => String(url).includes('/sms_phone_state') && init?.method === 'PATCH'
    );
    expect(JSON.parse(String(finish?.[1].body)).send_status).toBe('failed');
  });
});

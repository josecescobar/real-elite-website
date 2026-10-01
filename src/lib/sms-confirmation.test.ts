import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SMS_CONSENT_TEXT, SMS_CONSENT_TEXT_VERSION, type StoredSmsConsent } from '@/lib/sms-consent';
import { SMS_CONFIRMATION_TEXT, sendSmsConsentConfirmation } from '@/lib/sms-confirmation';

const CONFIRMATION =
  'Real Elite Contracting: You are subscribed to texts about your project, including estimate scheduling and updates. You can text photos of your project to this number. Msg frequency varies. Msg & data rates may apply. Reply HELP for help or STOP to opt out.';

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
});

describe('sendSmsConsentConfirmation', () => {
  it('defaults off and sends nothing', async () => {
    enableTwilio();
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const result = await sendSmsConsentConfirmation({
      phone: '(681) 555-0142',
      consent: consent(),
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
    });

    expect(result).toEqual({ skipped: true, reason: 'text_version_mismatch' });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('sends the confirmation text exactly once when consent is true', async () => {
    process.env.SMS_CONSENT_CONFIRMATION_ENABLED = '1';
    enableTwilio();
    const fetchMock = vi.fn().mockResolvedValue(new Response('{"sid":"SM1"}', { status: 201 }));
    vi.stubGlobal('fetch', fetchMock);

    const result = await sendSmsConsentConfirmation({
      phone: '(681) 555-0142',
      consent: consent(),
    });

    expect(result).toEqual({ skipped: false, sent: true });
    expect(SMS_CONFIRMATION_TEXT).toBe(CONFIRMATION);
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(String(fetchMock.mock.calls[0][0])).toContain(
      'https://api.twilio.com/2010-04-01/Accounts/AC_test/Messages.json'
    );
    const params = new URLSearchParams(fetchMock.mock.calls[0][1].body as string);
    expect(params.get('To')).toBe('+16815550142');
    expect(params.get('From')).toBe('+13045550100');
    expect(params.get('Body')).toBe(CONFIRMATION);
  });

  it('swallows a Twilio error and does not throw', async () => {
    process.env.SMS_CONSENT_CONFIRMATION_ENABLED = 'true';
    enableTwilio();
    const fetchMock = vi.fn().mockResolvedValue(new Response('bad number', { status: 400 }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(
      sendSmsConsentConfirmation({
        phone: '(681) 555-0142',
        consent: consent(),
      })
    ).resolves.toEqual({ skipped: false, sent: false, error: 'twilio_error' });
    expect(fetchMock).toHaveBeenCalledOnce();
  });
});

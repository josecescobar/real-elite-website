import { describe, it, expect } from 'vitest';
import { createHmac } from 'crypto';
import { escapeXml, validateTwilioSignature, webhookUrl } from './twilio';

describe('escapeXml', () => {
  it('escapes the five XML metacharacters', () => {
    expect(escapeXml(`a & b < c > d " e ' f`)).toBe(
      'a &amp; b &lt; c &gt; d &quot; e &apos; f'
    );
  });
});

describe('validateTwilioSignature', () => {
  const authToken = 'test_auth_token';
  const url = 'https://www.realelitecontracting.com/api/voice';
  const params: Record<string, string> = {
    From: '+13045550123',
    To: '+16815345515',
    CallStatus: 'ringing',
  };

  // Build the signature exactly the way Twilio does.
  const sign = (u: string, p: Record<string, string>) => {
    const data = Object.keys(p)
      .sort()
      .reduce((acc, k) => acc + k + p[k], u);
    return createHmac('sha1', authToken).update(Buffer.from(data, 'utf-8')).digest('base64');
  };

  it('accepts a correctly signed request', () => {
    const signature = sign(url, params);
    expect(validateTwilioSignature({ authToken, signature, url, params })).toBe(true);
  });

  it('rejects a tampered parameter', () => {
    const signature = sign(url, params);
    const tampered = { ...params, From: '+19998887777' };
    expect(validateTwilioSignature({ authToken, signature, url, params: tampered })).toBe(false);
  });

  it('rejects a missing signature', () => {
    expect(validateTwilioSignature({ authToken, signature: null, url, params })).toBe(false);
  });

  it('rejects a signature made with the wrong token', () => {
    const data = Object.keys(params)
      .sort()
      .reduce((acc, k) => acc + k + params[k], url);
    const wrong = createHmac('sha1', 'not_the_token').update(data).digest('base64');
    expect(validateTwilioSignature({ authToken, signature: wrong, url, params })).toBe(false);
  });
});

describe('webhookUrl', () => {
  it('prefers TWILIO_WEBHOOK_BASE_URL when set', () => {
    process.env.TWILIO_WEBHOOK_BASE_URL = 'https://example.com/';
    const req = new Request('http://internal/api/voice');
    expect(webhookUrl(req, '/api/voice')).toBe('https://example.com/api/voice');
    delete process.env.TWILIO_WEBHOOK_BASE_URL;
  });

  it('falls back to forwarded host with https', () => {
    const req = new Request('http://internal/api/voice', {
      headers: { 'x-forwarded-host': 'www.realelitecontracting.com' },
    });
    expect(webhookUrl(req, '/api/voice')).toBe(
      'https://www.realelitecontracting.com/api/voice'
    );
  });
});

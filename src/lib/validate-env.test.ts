import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { validateEnv } from './validate-env';

const ENV_KEYS = [
  'ESTIMATE_TO_EMAIL',
  'TWILIO_ACCOUNT_SID',
  'TWILIO_AUTH_TOKEN',
  'TWILIO_FROM_NUMBER',
  'TWILIO_TO_NUMBER',
  'TWILIO_WEBHOOK_BASE_URL',
  'MISSED_CALL_FORWARD_NUMBER',
  'ADMIN_TOOLS_KEY',
  'GOOGLE_REVIEW_LINK',
  'UPSTASH_REDIS_REST_URL',
  'UPSTASH_REDIS_REST_TOKEN',
  'NEXT_PUBLIC_GTM_ID',
];

beforeEach(() => {
  for (const key of ENV_KEYS) delete process.env[key];
});

afterEach(() => {
  for (const key of ENV_KEYS) delete process.env[key];
  vi.restoreAllMocks();
});

describe('validateEnv', () => {
  it('warns about nothing when every var is unset', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    validateEnv();
    expect(warn).not.toHaveBeenCalled();
  });

  it('warns about nothing when all vars are well-formed', () => {
    process.env.ESTIMATE_TO_EMAIL = 'owner@example.com';
    process.env.TWILIO_ACCOUNT_SID = `AC${'a'.repeat(32)}`;
    process.env.TWILIO_AUTH_TOKEN = 'token';
    process.env.TWILIO_FROM_NUMBER = '+15551234567';
    process.env.TWILIO_TO_NUMBER = '+15557654321';
    process.env.TWILIO_WEBHOOK_BASE_URL = 'https://www.realelitecontracting.com';
    process.env.MISSED_CALL_FORWARD_NUMBER = '+15559876543';
    process.env.ADMIN_TOOLS_KEY = 'a-suitably-long-random-secret-value';
    process.env.GOOGLE_REVIEW_LINK = 'https://search.google.com/local/writereview?placeid=abc';
    process.env.UPSTASH_REDIS_REST_URL = 'https://redis.upstash.io';
    process.env.UPSTASH_REDIS_REST_TOKEN = 'a-token';
    process.env.NEXT_PUBLIC_GTM_ID = 'GTM-ABC1234';

    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    validateEnv();
    expect(warn).not.toHaveBeenCalled();
  });

  it('warns about a malformed value', () => {
    process.env.TWILIO_FROM_NUMBER = 'not-a-phone-number';
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    validateEnv();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('twilioFromNumber'));
  });

  it('warns when only some Twilio vars are set', () => {
    process.env.TWILIO_ACCOUNT_SID = `AC${'a'.repeat(32)}`;
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    validateEnv();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('speed-to-lead SMS is only partially configured'));
  });

  it('does not warn about incompleteness when all four Twilio vars are set', () => {
    process.env.TWILIO_ACCOUNT_SID = `AC${'a'.repeat(32)}`;
    process.env.TWILIO_AUTH_TOKEN = 'token';
    process.env.TWILIO_FROM_NUMBER = '+15551234567';
    process.env.TWILIO_TO_NUMBER = '+15557654321';
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    validateEnv();
    expect(warn).not.toHaveBeenCalledWith(expect.stringContaining('partially configured'));
  });

  it('warns when only one Upstash var is set', () => {
    process.env.UPSTASH_REDIS_REST_URL = 'https://redis.upstash.io';
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    validateEnv();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('Upstash rate limiting is only partially configured'));
  });
});

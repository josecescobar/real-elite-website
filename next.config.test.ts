import { describe, expect, it } from 'vitest';
import { buildContentSecurityPolicy } from './next.config';

describe('buildContentSecurityPolicy', () => {
  it('removes preview feedback origins from Vercel production', () => {
    const policy = buildContentSecurityPolicy({
      nodeEnv: 'production',
      vercelEnv: 'production',
    });

    expect(policy).not.toContain('vercel.live');
    expect(policy).not.toContain('wss://*.pusher.com');
    expect(policy).not.toContain("'unsafe-eval'");
  });

  it('keeps preview feedback origins on Vercel previews', () => {
    const policy = buildContentSecurityPolicy({
      nodeEnv: 'production',
      vercelEnv: 'preview',
    });

    expect(policy).toContain('https://vercel.live');
    expect(policy).toContain('wss://*.pusher.com');
    expect(policy).not.toContain("'unsafe-eval'");
  });
});

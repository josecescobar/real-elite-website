import { describe, expect, it } from 'vitest';
import nextConfig from '../../next.config';

describe('content security policy', () => {
  it('allows the Cloudflare Turnstile script, frame, and connect origins', async () => {
    const rules = await nextConfig.headers?.();
    const headers = rules?.[0]?.headers ?? [];
    const csp = headers.find((header) => header.key === 'Content-Security-Policy')?.value ?? '';
    for (const directive of ['script-src', 'frame-src', 'connect-src']) {
      const clause = csp.split(';').find((part) => part.trim().startsWith(directive));
      expect(clause, directive).toContain('https://challenges.cloudflare.com');
    }
  });
});

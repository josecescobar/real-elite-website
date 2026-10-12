import { describe, expect, it } from 'vitest';

type QueryRewrite = {
  source: string;
  destination: string;
  has?: { type: string; key: string }[];
};

describe('filtered index rewrites', () => {
  it('sends service and city queries to the dynamic routes before the static pages match', async () => {
    const { default: nextConfig } = await import('../../next.config');
    const rewrites = await nextConfig.rewrites?.();
    expect(Array.isArray(rewrites)).toBe(false);
    const beforeFiles = (rewrites as { beforeFiles?: QueryRewrite[] }).beforeFiles ?? [];
    expect(beforeFiles).toEqual([
      {
        source: '/reviews',
        has: [{ type: 'query', key: 'service' }],
        destination: '/reviews/filtered',
      },
      {
        source: '/projects',
        has: [{ type: 'query', key: 'service' }],
        destination: '/projects/filtered',
      },
      {
        source: '/projects',
        has: [{ type: 'query', key: 'city' }],
        destination: '/projects/filtered',
      },
    ]);
  });
});

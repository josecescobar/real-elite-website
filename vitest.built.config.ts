import { defineConfig } from 'vitest/config';

/**
 * The post-build suite. Separate from vitest.config.ts because these tests
 * read `.next/` and must not run as part of `npm test`, where there may be no
 * build output — a suite that silently passes on a missing build is worse than
 * no suite. Run with `npm run test:built` after `npm run build`.
 */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
});

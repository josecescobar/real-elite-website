import next from 'eslint-config-next';

/**
 * Flat ESLint config. Next.js 16 removed the built-in `next lint`
 * command, so linting now runs through the ESLint CLI directly
 * (see the `lint` script in package.json). `eslint-config-next`
 * bundles the core-web-vitals + TypeScript rule sets.
 */
const eslintConfig = [
  ...next,
  {
    ignores: [
      '.next/**',
      '.claude/**',
      'out/**',
      'node_modules/**',
      'next-env.d.ts',
      'next-sitemap.config.js',
      'public/**',
    ],
  },
];

export default eslintConfig;

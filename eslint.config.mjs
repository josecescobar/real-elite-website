import next from 'eslint-config-next/core-web-vitals';

/**
 * Next.js 16 removed the built-in `next lint` command, so linting now runs
 * through the ESLint CLI (`eslint .`) with this flat config. In v16,
 * `eslint-config-next/core-web-vitals` is already a flat-config array
 * (React, react-hooks, jsx-a11y, and the Next.js performance rules — the
 * set that protects rankings and accessibility on this site), so we spread
 * it directly.
 */
const eslintConfig = [
  ...next,
  {
    ignores: [
      '.next/**',
      'out/**',
      'coverage/**',
      'scripts/**',
      'next-sitemap.config.js',
      '.claude/**',
    ],
  },
];

export default eslintConfig;

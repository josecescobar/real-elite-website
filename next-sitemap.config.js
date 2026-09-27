/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.realelitecontracting.com',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
    ],
  },
  // Keep Next.js metadata routes (OG images, icons, manifest) out of the
  // sitemap — they aren't crawlable HTML pages and just add noise to the
  // Search Console coverage report.
  exclude: [
    '/apple-icon.png',
    '/icon',
    '/manifest.webmanifest',
    '/opengraph-image',
    '/*/opengraph-image',
    '/*/*/opengraph-image',
    '/*/*/*/opengraph-image',
    // Internal tools — noindexed, key-protected, never for crawlers.
    '/review-request',
    '/sales',
    // Legacy index; now a permanent redirect to /resources.
    '/blog',
    // Syndication feed, not an HTML landing page.
    '/rss.xml',
  ],
  // Ensure all pages are included
  changefreq: 'weekly',
  priority: 0.7,
  // A deployment timestamp is not a content modification date. Omit lastmod
  // until each content model exposes a reliable authored/updated value.
  autoLastmod: false,
  sitemapSize: 5000,
  // These pages read searchParams, so Next renders them on demand and
  // next-sitemap never sees them in the prerender manifest. They are
  // indexable HTML and belong in the sitemap. /sales and /review-request
  // stay out: they are noindexed internal tools listed in `exclude`.
  additionalPaths: async (config) => [
    await config.transform(config, '/projects'),
    await config.transform(config, '/reviews'),
  ],
};

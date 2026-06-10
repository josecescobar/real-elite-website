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
  ],
  // Ensure all pages are included
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
};

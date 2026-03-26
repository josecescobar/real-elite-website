/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.realelitecontracting.com',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
    ],
  },
  exclude: ['/apple-icon.png'],
  // Ensure all pages are included
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
};

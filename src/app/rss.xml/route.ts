import { getAllPosts } from '@/lib/blog';
import { BUSINESS } from '@/lib/constants';

export const dynamic = 'force-static';

function escapeXml(value: string): string {
  return value.replace(/[<>&"']/g, (char) => ({
    '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;',
  })[char]!);
}

export function GET() {
  const items = getAllPosts().map((post) => {
    const url = escapeXml(`${BUSINESS.url}/blog/${post.slug}`);
    return `<item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <pubDate>${new Date(`${post.date}T00:00:00Z`).toUTCString()}</pubDate>
      <category>${escapeXml(post.category)}</category>
    </item>`;
  }).join('\n');

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(BUSINESS.name)} Guides</title>
    <link>${BUSINESS.url}/resources</link>
    <description>Remodeling cost, planning, and permit guides from Real Elite Contracting.</description>
    <language>en-us</language>
    <atom:link href="${BUSINESS.url}/rss.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}

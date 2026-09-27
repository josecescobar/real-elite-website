import { describe, expect, it, vi } from 'vitest';
import { getAllPosts } from '@/lib/blog';
import { BUSINESS } from '@/lib/constants';
import { GET } from './route';

vi.mock('@/lib/blog', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/blog')>();
  return { ...actual, getAllPosts: vi.fn(actual.getAllPosts) };
});

function parseXml(xml: string) {
  const doc = new DOMParser().parseFromString(xml, 'application/xml');
  expect(doc.querySelector('parsererror')).toBeNull();
  return doc;
}

describe('RSS feed', () => {
  it('includes every published post once with canonical URLs and valid dates', async () => {
    const posts = getAllPosts();
    const response = GET();
    expect(response.headers.get('content-type')).toBe('application/rss+xml; charset=utf-8');
    const doc = parseXml(await response.text());
    const items = [...doc.querySelectorAll('item')];
    expect(items).toHaveLength(posts.length);
    expect(items.map((item) => item.querySelector('link')?.textContent)).toEqual(
      posts.map((post) => `${BUSINESS.url}/blog/${post.slug}`),
    );
    for (const [index, item] of items.entries()) {
      expect(item.querySelector('guid')?.textContent).toBe(item.querySelector('link')?.textContent);
      expect(item.querySelector('title')?.textContent).toBe(posts[index].title);
      expect(item.querySelector('description')?.textContent).toBe(posts[index].excerpt);
      expect(Date.parse(item.querySelector('pubDate')!.textContent!)).toBe(Date.parse(posts[index].date));
    }
  });

  it('escapes XML characters without turning article text into feed markup', async () => {
    const post = getAllPosts()[0];
    const text = `Kitchen & bath <planning> "guide" 'notes' ]]>`;
    vi.mocked(getAllPosts).mockReturnValueOnce([{ ...post, title: text, excerpt: text, category: text }]);
    const doc = parseXml(await GET().text());
    expect(doc.querySelectorAll('item')).toHaveLength(1);
    expect(doc.querySelector('item title')?.textContent).toBe(text);
    expect(doc.querySelector('item description')?.textContent).toBe(text);
    expect(doc.querySelector('item category')?.textContent).toBe(text);
  });
});

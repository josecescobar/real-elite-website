import { describe, it, expect } from 'vitest';
import {
  computeReadingTime,
  extractHeadings,
  formatDate,
  getAllPosts,
  getPostBySlug,
  getRecentPosts,
  getRelatedPosts,
  getPostsByCategorySlug,
  GUIDE_CATEGORIES,
} from '@/lib/blog';

const VALID_CATEGORY_SLUGS = GUIDE_CATEGORIES.map((c) => c.slug);

describe('computeReadingTime', () => {
  it('returns at least 1 minute for empty or trivial content', () => {
    expect(computeReadingTime('')).toBe(1);
    expect(computeReadingTime('a few words only')).toBe(1);
  });

  it('rounds to whole minutes at ~220 words per minute', () => {
    expect(computeReadingTime('word '.repeat(220))).toBe(1);
    expect(computeReadingTime('word '.repeat(660))).toBe(3);
  });

  it('excludes fenced code blocks from the word count', () => {
    const content = '```\n' + 'code '.repeat(500) + '\n```\n' + 'word '.repeat(220);
    expect(computeReadingTime(content)).toBe(1);
  });
});

describe('extractHeadings', () => {
  it('extracts H2 and H3 headings with slugified ids', () => {
    const headings = extractHeadings('## Introduction\nbody text\n### The Details');
    expect(headings).toEqual([
      { id: 'introduction', text: 'Introduction', level: 2 },
      { id: 'the-details', text: 'The Details', level: 3 },
    ]);
  });

  it('ignores headings inside fenced code blocks', () => {
    const md = ['## Real Heading', 'text', '```', '## Fake Heading', '```', '### After'].join(
      '\n'
    );
    const headings = extractHeadings(md);
    expect(headings.map((h) => h.text)).toEqual(['Real Heading', 'After']);
  });

  it('does not treat H1 as a TOC heading', () => {
    expect(extractHeadings('# Page Title\n## Section').map((h) => h.text)).toEqual(['Section']);
  });

  it('strips punctuation and trailing hashes from heading slugs', () => {
    expect(extractHeadings('## My Heading, Tested! ##')).toEqual([
      { id: 'my-heading-tested', text: 'My Heading, Tested!', level: 2 },
    ]);
  });

  it('returns an empty array when there are no headings', () => {
    expect(extractHeadings('just a paragraph\nand another line')).toEqual([]);
  });
});

describe('formatDate', () => {
  it('formats an ISO date as a long en-US date in UTC', () => {
    expect(formatDate('2026-05-19')).toBe('May 19, 2026');
  });
});

describe('GUIDE_CATEGORIES', () => {
  it('has unique, non-empty category slugs', () => {
    const slugs = GUIDE_CATEGORIES.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const c of GUIDE_CATEGORIES) {
      expect(c.slug).toMatch(/^[a-z0-9-]+$/);
      expect(c.name.length).toBeGreaterThan(0);
    }
  });
});

describe('getAllPosts', () => {
  const posts = getAllPosts();

  it('loads every blog post from content/blog', () => {
    expect(posts.length).toBeGreaterThan(0);
  });

  it('returns posts sorted newest-first by date', () => {
    const times = posts.map((p) => new Date(p.date).getTime());
    const sorted = [...times].sort((a, b) => b - a);
    expect(times).toEqual(sorted);
  });

  it('gives every post the required metadata fields', () => {
    for (const p of posts) {
      expect(p.slug.length).toBeGreaterThan(0);
      expect(p.title.length).toBeGreaterThan(0);
      expect(p.date.length).toBeGreaterThan(0);
      expect(p.excerpt.length).toBeGreaterThan(0);
      expect(p.author.length).toBeGreaterThan(0);
      expect(p.readingTimeMinutes).toBeGreaterThanOrEqual(1);
    }
  });

  it('normalizes every post category to a known guide-category slug', () => {
    for (const p of posts) {
      expect(VALID_CATEGORY_SLUGS).toContain(p.categorySlug);
    }
  });

  it('has a unique slug for every post', () => {
    const slugs = posts.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe('getPostBySlug', () => {
  it('returns a post with body content for a known slug', () => {
    const slug = getAllPosts()[0].slug;
    const post = getPostBySlug(slug);
    expect(post).not.toBeNull();
    expect(post?.slug).toBe(slug);
    expect((post?.content.length ?? 0)).toBeGreaterThan(0);
  });

  it('returns null for an unknown slug', () => {
    expect(getPostBySlug('this-post-does-not-exist')).toBeNull();
  });
});

describe('getRecentPosts', () => {
  it('returns the 3 most recent posts by default', () => {
    expect(getRecentPosts()).toEqual(getAllPosts().slice(0, 3));
  });

  it('respects an explicit count', () => {
    expect(getRecentPosts(2)).toHaveLength(2);
  });
});

describe('getPostsByCategorySlug', () => {
  it('returns only posts in the requested category', () => {
    for (const slug of VALID_CATEGORY_SLUGS) {
      for (const p of getPostsByCategorySlug(slug)) {
        expect(p.categorySlug).toBe(slug);
      }
    }
  });
});

describe('getRelatedPosts', () => {
  it('returns up to `count` posts and never includes the source post', () => {
    const slug = getAllPosts()[0].slug;
    const related = getRelatedPosts(slug, 3);
    expect(related.length).toBeLessThanOrEqual(3);
    expect(related.some((p) => p.slug === slug)).toBe(false);
  });

  it('falls back to recent posts for an unknown slug', () => {
    expect(getRelatedPosts('unknown-slug', 3)).toEqual(getAllPosts().slice(0, 3));
  });
});

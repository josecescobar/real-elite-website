import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import {
  getAllPosts,
  getPostBySlug,
  getRecentPosts,
  formatDate,
} from './blog';

const POSTS_DIR = path.join(process.cwd(), 'content/blog');

function knownSlugs(): string[] {
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx?$/, ''));
}

describe('getAllPosts', () => {
  it('returns one entry per markdown file in content/blog', () => {
    const posts = getAllPosts();
    expect(posts.length).toBe(knownSlugs().length);
    expect(posts.length).toBeGreaterThan(0);
  });

  it('populates every required frontmatter field', () => {
    for (const post of getAllPosts()) {
      expect(post.slug, `slug for ${post.slug}`).toMatch(/^[a-z0-9-]+$/);
      expect(post.title, `title for ${post.slug}`).toBeTruthy();
      expect(post.date, `date for ${post.slug}`).toBeTruthy();
      expect(post.excerpt, `excerpt for ${post.slug}`).toBeTruthy();
      expect(post.featuredImage, `featuredImage for ${post.slug}`).toBeTruthy();
      expect(post.category, `category for ${post.slug}`).toBeTruthy();
      expect(post.author, `author for ${post.slug}`).toBeTruthy();
      expect(Number.isNaN(new Date(post.date).getTime())).toBe(false);
    }
  });

  it('sorts posts by date, newest first', () => {
    const posts = getAllPosts();
    for (let i = 1; i < posts.length; i++) {
      const prev = new Date(posts[i - 1].date).getTime();
      const curr = new Date(posts[i].date).getTime();
      expect(prev).toBeGreaterThanOrEqual(curr);
    }
  });

  it('does not include content in the meta list', () => {
    const posts = getAllPosts() as unknown as Array<Record<string, unknown>>;
    for (const post of posts) {
      expect(post.content).toBeUndefined();
    }
  });
});

describe('getPostBySlug', () => {
  it('returns the full post (with content) for a known slug', () => {
    const [slug] = knownSlugs();
    const post = getPostBySlug(slug);
    expect(post).not.toBeNull();
    expect(post!.slug).toBe(slug);
    expect(typeof post!.content).toBe('string');
    expect(post!.content.length).toBeGreaterThan(0);
  });

  it('returns null for an unknown slug', () => {
    expect(getPostBySlug('this-slug-does-not-exist-anywhere')).toBeNull();
  });
});

describe('getRecentPosts', () => {
  it('returns at most `count` posts', () => {
    expect(getRecentPosts(3).length).toBeLessThanOrEqual(3);
    expect(getRecentPosts(1).length).toBe(1);
  });

  it('defaults to 3 when count is omitted', () => {
    expect(getRecentPosts().length).toBeLessThanOrEqual(3);
  });

  it('returns posts in the same order as getAllPosts', () => {
    const recent = getRecentPosts(3);
    const all = getAllPosts().slice(0, 3);
    expect(recent.map((p) => p.slug)).toEqual(all.map((p) => p.slug));
  });
});

describe('formatDate', () => {
  it('formats an ISO date in en-US long form, anchored to UTC', () => {
    // 2026-03-25 should format the same regardless of the host TZ
    expect(formatDate('2026-03-25')).toBe('March 25, 2026');
  });

  it('does not shift the day backward in TZs west of UTC', () => {
    // A midnight UTC date that would become the previous day in local time
    // if UTC anchoring were missing.
    expect(formatDate('2026-01-01')).toBe('January 1, 2026');
  });
});

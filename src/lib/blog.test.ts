import { describe, it, expect, vi, beforeEach } from 'vitest';
import path from 'path';
import { getAllPosts, getPostBySlug, getRecentPosts, formatDate } from './blog';

const mockReaddirSync = vi.fn();
const mockReadFileSync = vi.fn();
const mockExistsSync = vi.fn();

vi.mock('fs', () => ({
  default: {
    readdirSync: (...args: unknown[]) => mockReaddirSync(...args),
    readFileSync: (...args: unknown[]) => mockReadFileSync(...args),
    existsSync: (...args: unknown[]) => mockExistsSync(...args),
  },
  readdirSync: (...args: unknown[]) => mockReaddirSync(...args),
  readFileSync: (...args: unknown[]) => mockReadFileSync(...args),
  existsSync: (...args: unknown[]) => mockExistsSync(...args),
}));

vi.mock('gray-matter', () => ({
  default: (raw: string) => {
    const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) return { data: {}, content: raw };
    const data: Record<string, string> = {};
    match[1].split('\n').forEach((line) => {
      const [key, ...rest] = line.split(': ');
      if (key && rest.length) data[key.trim()] = rest.join(': ').replace(/^"|"$/g, '');
    });
    return { data, content: match[2] };
  },
}));

const makeFrontmatter = (overrides: Record<string, string> = {}) => {
  const defaults = {
    title: 'Test Post',
    date: '2025-01-15',
    excerpt: 'A test excerpt',
    featuredImage: '/images/test.jpg',
    category: 'Roofing',
    author: 'Test Author',
  };
  const merged = { ...defaults, ...overrides };
  const frontmatter = Object.entries(merged)
    .map(([k, v]) => `${k}: "${v}"`)
    .join('\n');
  return `---\n${frontmatter}\n---\nPost content here`;
};

describe('getAllPosts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns posts sorted by date descending', () => {
    mockReaddirSync.mockReturnValue(['old-post.md', 'new-post.md']);
    mockReadFileSync.mockImplementation((filePath: string) => {
      const name = path.basename(filePath);
      if (name === 'old-post.md') return makeFrontmatter({ title: 'Old Post', date: '2024-01-01' });
      return makeFrontmatter({ title: 'New Post', date: '2025-06-01' });
    });

    const posts = getAllPosts();
    expect(posts).toHaveLength(2);
    expect(posts[0].title).toBe('New Post');
    expect(posts[1].title).toBe('Old Post');
  });

  it('filters to only .md and .mdx files', () => {
    mockReaddirSync.mockReturnValue(['post.md', 'post2.mdx', 'image.png', 'notes.txt']);
    mockReadFileSync.mockReturnValue(makeFrontmatter());

    const posts = getAllPosts();
    expect(posts).toHaveLength(2);
  });

  it('extracts slug from filename without extension', () => {
    mockReaddirSync.mockReturnValue(['my-blog-post.md']);
    mockReadFileSync.mockReturnValue(makeFrontmatter());

    const posts = getAllPosts();
    expect(posts[0].slug).toBe('my-blog-post');
  });

  it('strips .mdx extension for slug', () => {
    mockReaddirSync.mockReturnValue(['mdx-post.mdx']);
    mockReadFileSync.mockReturnValue(makeFrontmatter());

    const posts = getAllPosts();
    expect(posts[0].slug).toBe('mdx-post');
  });

  it('parses all frontmatter fields correctly', () => {
    mockReaddirSync.mockReturnValue(['post.md']);
    mockReadFileSync.mockReturnValue(
      makeFrontmatter({
        title: 'My Title',
        date: '2025-03-10',
        excerpt: 'My excerpt',
        featuredImage: '/images/hero.jpg',
        category: 'Decks',
        author: 'Jane Doe',
      })
    );

    const posts = getAllPosts();
    expect(posts[0]).toEqual({
      slug: 'post',
      title: 'My Title',
      date: '2025-03-10',
      excerpt: 'My excerpt',
      featuredImage: '/images/hero.jpg',
      category: 'Decks',
      author: 'Jane Doe',
    });
  });

  it('returns empty array when no posts exist', () => {
    mockReaddirSync.mockReturnValue([]);

    const posts = getAllPosts();
    expect(posts).toEqual([]);
  });
});

describe('getPostBySlug', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns post with content for a valid .md slug', () => {
    mockExistsSync.mockImplementation((filePath: string) => filePath.endsWith('.md'));
    mockReadFileSync.mockReturnValue(makeFrontmatter({ title: 'Found Post' }));

    const post = getPostBySlug('my-post');
    expect(post).not.toBeNull();
    expect(post!.title).toBe('Found Post');
    expect(post!.slug).toBe('my-post');
    expect(post!.content).toContain('Post content here');
  });

  it('falls back to .mdx if .md does not exist', () => {
    mockExistsSync.mockImplementation((filePath: string) => filePath.endsWith('.mdx'));
    mockReadFileSync.mockReturnValue(makeFrontmatter({ title: 'MDX Post' }));

    const post = getPostBySlug('mdx-post');
    expect(post).not.toBeNull();
    expect(post!.title).toBe('MDX Post');
  });

  it('returns null when slug does not exist', () => {
    mockExistsSync.mockReturnValue(false);

    const post = getPostBySlug('nonexistent');
    expect(post).toBeNull();
  });
});

describe('getRecentPosts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockReaddirSync.mockReturnValue(['post-a.md', 'post-b.md', 'post-c.md', 'post-d.md']);
    mockReadFileSync.mockImplementation((filePath: string) => {
      const name = path.basename(filePath, '.md');
      const dates: Record<string, string> = {
        'post-a': '2025-01-01',
        'post-b': '2025-02-01',
        'post-c': '2025-03-01',
        'post-d': '2025-04-01',
      };
      return makeFrontmatter({ title: name, date: dates[name] || '2025-01-01' });
    });
  });

  it('defaults to 3 posts', () => {
    const posts = getRecentPosts();
    expect(posts).toHaveLength(3);
  });

  it('returns requested number of posts', () => {
    const posts = getRecentPosts(2);
    expect(posts).toHaveLength(2);
  });

  it('returns most recent posts first', () => {
    const posts = getRecentPosts(2);
    expect(posts[0].slug).toBe('post-d');
    expect(posts[1].slug).toBe('post-c');
  });

  it('returns all posts when count exceeds total', () => {
    const posts = getRecentPosts(10);
    expect(posts).toHaveLength(4);
  });
});

describe('formatDate', () => {
  it('formats a standard date string', () => {
    const result = formatDate('2025-03-10');
    expect(result).toBe('March 10, 2025');
  });

  it('formats a date with day padding', () => {
    const result = formatDate('2025-01-01');
    expect(result).toBe('January 1, 2025');
  });

  it('handles different months correctly', () => {
    expect(formatDate('2024-12-25')).toBe('December 25, 2024');
    expect(formatDate('2025-07-04')).toBe('July 4, 2025');
  });
});

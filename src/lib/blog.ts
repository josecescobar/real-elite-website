import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const POSTS_DIR = path.join(process.cwd(), 'content/blog');

export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  featuredImage: string;
  category: string;
  author: string;
}

export interface BlogPost extends BlogPostMeta {
  content: string;
}

export function getAllPosts(): BlogPostMeta[] {
  const files = fs.readdirSync(POSTS_DIR);

  return files
    .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
    .map((filename) => {
      const slug = filename.replace(/\.mdx?$/, '');
      const raw = fs.readFileSync(path.join(POSTS_DIR, filename), 'utf8');
      const { data } = matter(raw);
      return {
        slug,
        title: data.title as string,
        date: data.date as string,
        excerpt: data.excerpt as string,
        featuredImage: data.featuredImage as string,
        category: data.category as string,
        author: data.author as string,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | null {
  for (const ext of ['.md', '.mdx']) {
    const filePath = path.join(POSTS_DIR, `${slug}${ext}`);
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(raw);
      return {
        slug,
        title: data.title as string,
        date: data.date as string,
        excerpt: data.excerpt as string,
        featuredImage: data.featuredImage as string,
        category: data.category as string,
        author: data.author as string,
        content,
      };
    }
  }
  return null;
}

export function getRecentPosts(count = 3): BlogPostMeta[] {
  return getAllPosts().slice(0, count);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

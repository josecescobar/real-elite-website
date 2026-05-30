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
  /** Raw category as written in frontmatter */
  category: string;
  /** Normalized category slug — see CATEGORY_SLUG_MAP */
  categorySlug: string;
  author: string;
  readingTimeMinutes: number;
}

export interface BlogPost extends BlogPostMeta {
  content: string;
}

/* -------------------------------------------------------------------------- */
/*  Categories                                                                */
/* -------------------------------------------------------------------------- */

export const GUIDE_CATEGORIES = [
  {
    slug: 'bathrooms',
    name: 'Bathrooms',
    description:
      'Walk-in showers, tile work, primary-bath builds, and the homeowner questions we answer most.',
  },
  {
    slug: 'kitchens',
    name: 'Kitchens',
    description: 'Layout changes, cabinetry, countertops, and what a real kitchen remodel costs.',
  },
  {
    slug: 'decks',
    name: 'Decks & Outdoor Living',
    description:
      'Composite vs pressure-treated, permits, deck pricing, and outdoor-living builds.',
  },
  {
    slug: 'roofing',
    name: 'Roofing',
    description:
      'Replacement signs, material choices, storm-damage and insurance — practical homeowner roofing guidance.',
  },
  {
    slug: 'exteriors',
    name: 'Siding & Exteriors',
    description:
      'Siding, stone veneer, and curb-appeal upgrades — the highest-ROI improvements to a home\'s facade.',
  },
  {
    slug: 'remodeling',
    name: 'Remodeling',
    description:
      'Whole-home remodels, basement finishing, additions, and what to expect during construction.',
  },
  {
    slug: 'homeowner-guides',
    name: 'Homeowner Guides',
    description:
      'How to hire a contractor, what to ask before signing, license checks, and the practical homeowner playbook.',
  },
  {
    slug: 'financing',
    name: 'Financing',
    description: 'Monthly payments, project ranges, and how to think about funding a premium remodel.',
  },
  {
    slug: 'service-areas',
    name: 'Service Areas',
    description:
      'Localized articles for Frederick MD, Winchester VA, Loudoun County, and the Eastern Panhandle.',
  },
] as const;

export type GuideCategorySlug = (typeof GUIDE_CATEGORIES)[number]['slug'];

/**
 * Maps raw frontmatter category strings → normalized GuideCategory slug.
 * Add new mappings here as posts use new category labels.
 */
const CATEGORY_SLUG_MAP: Record<string, GuideCategorySlug> = {
  bathrooms: 'bathrooms',
  bathroom: 'bathrooms',
  'bathroom remodeling': 'bathrooms',

  kitchens: 'kitchens',
  kitchen: 'kitchens',
  'kitchen remodeling': 'kitchens',

  decks: 'decks',
  deck: 'decks',
  'decks & outdoor living': 'decks',
  'outdoor living': 'decks',

  roofing: 'roofing',
  roof: 'roofing',

  exteriors: 'exteriors',
  exterior: 'exteriors',
  'exterior repairs': 'exteriors',
  siding: 'exteriors',
  'siding & stone': 'exteriors',
  'siding & exteriors': 'exteriors',
  stone: 'exteriors',
  'stone veneer': 'exteriors',
  'curb appeal': 'exteriors',

  remodeling: 'remodeling',
  remodel: 'remodeling',
  basements: 'remodeling',
  basement: 'remodeling',
  additions: 'remodeling',
  addition: 'remodeling',

  'tips & advice': 'homeowner-guides',
  tips: 'homeowner-guides',
  'homeowner guides': 'homeowner-guides',
  homeowner: 'homeowner-guides',
  contractors: 'homeowner-guides',
  hiring: 'homeowner-guides',

  financing: 'financing',
  budgeting: 'financing',

  'service areas': 'service-areas',
  local: 'service-areas',
};

function normalizeCategory(category: string): GuideCategorySlug {
  if (!category) return 'homeowner-guides';
  const key = category.trim().toLowerCase();
  return CATEGORY_SLUG_MAP[key] ?? 'homeowner-guides';
}

/* -------------------------------------------------------------------------- */
/*  Reading time                                                              */
/* -------------------------------------------------------------------------- */

const AVG_WORDS_PER_MINUTE = 220;

export function computeReadingTime(content: string): number {
  const words = content
    .replace(/```[\s\S]*?```/g, '') // strip code fences
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / AVG_WORDS_PER_MINUTE));
}

/* -------------------------------------------------------------------------- */
/*  Headings / TOC                                                            */
/* -------------------------------------------------------------------------- */

export type GuideHeading = { id: string; text: string; level: 2 | 3 };

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

/**
 * Extracts H2 + H3 headings from MDX/Markdown content for the
 * Table of Contents. Naive but robust enough for our content.
 */
export function extractHeadings(content: string): GuideHeading[] {
  const headings: GuideHeading[] = [];
  const lines = content.split(/\r?\n/);
  let inCode = false;
  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      inCode = !inCode;
      continue;
    }
    if (inCode) continue;
    const h2 = /^##\s+(.+?)\s*#*\s*$/.exec(line);
    const h3 = /^###\s+(.+?)\s*#*\s*$/.exec(line);
    if (h2) {
      const text = h2[1];
      headings.push({ id: slugifyHeading(text), text, level: 2 });
    } else if (h3) {
      const text = h3[1];
      headings.push({ id: slugifyHeading(text), text, level: 3 });
    }
  }
  return headings;
}

/* -------------------------------------------------------------------------- */
/*  Queries                                                                   */
/* -------------------------------------------------------------------------- */

export function getAllPosts(): BlogPostMeta[] {
  const files = fs.readdirSync(POSTS_DIR);

  return files
    .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
    .map((filename) => {
      const slug = filename.replace(/\.mdx?$/, '');
      const raw = fs.readFileSync(path.join(POSTS_DIR, filename), 'utf8');
      const { data, content } = matter(raw);
      const category = (data.category as string) || 'Homeowner Guides';
      return {
        slug,
        title: data.title as string,
        date: data.date as string,
        excerpt: data.excerpt as string,
        featuredImage: data.featuredImage as string,
        category,
        categorySlug: normalizeCategory(category),
        author: (data.author as string) || 'Real Elite Contracting Team',
        readingTimeMinutes: computeReadingTime(content),
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
      const category = (data.category as string) || 'Homeowner Guides';
      return {
        slug,
        title: data.title as string,
        date: data.date as string,
        excerpt: data.excerpt as string,
        featuredImage: data.featuredImage as string,
        category,
        categorySlug: normalizeCategory(category),
        author: (data.author as string) || 'Real Elite Contracting Team',
        readingTimeMinutes: computeReadingTime(content),
        content,
      };
    }
  }
  return null;
}

export function getRecentPosts(count = 3): BlogPostMeta[] {
  return getAllPosts().slice(0, count);
}

export function getPostsByCategorySlug(categorySlug: GuideCategorySlug): BlogPostMeta[] {
  return getAllPosts().filter((p) => p.categorySlug === categorySlug);
}

/**
 * Related posts: same category first, then fall back to most recent
 * (excluding the current post). Returns up to `count` posts.
 */
export function getRelatedPosts(slug: string, count = 3): BlogPostMeta[] {
  const all = getAllPosts();
  const current = all.find((p) => p.slug === slug);
  if (!current) return all.slice(0, count);
  const sameCategory = all.filter(
    (p) => p.slug !== slug && p.categorySlug === current.categorySlug
  );
  const others = all.filter(
    (p) => p.slug !== slug && p.categorySlug !== current.categorySlug
  );
  return [...sameCategory, ...others].slice(0, count);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

/**
 * The Project — the foundational content object of Website v2.
 *
 * This is the PUBLIC LENS of the Project Object described in
 * docs/PROJECT-OBJECT-SPEC.md. A single project record powers the project
 * page, the gallery, related-project rails, and (later) service/location/blog
 * proof modules, AI search, and GEO/SEO — "author once, project everywhere."
 *
 * Public-lens by design: this type intentionally carries NO street address and
 * NO contract price. Location is a city slug; budget is an anonymized band; the
 * customer is referenced by first name only. Operational facets (margin, crew
 * pay, vendor pricing, internal notes) live in Mission Control, never here.
 *
 * Relationships are modeled as canonical slugs (`service`, `citySlug`,
 * `relatedGuideSlugs`) and validated against their source-of-truth catalogs at
 * test time (see projects.test.ts), so the corpus stays referentially correct
 * as it grows toward thousands of projects.
 */

/** A single image — kept minimal and structurally compatible with ServiceImage. */
export type ProjectImage = { src: string; alt: string };

/** A before/after pairing for the "reveal" — mirrors the shape of BEFORE_AFTER_PAIRS. */
export type ProjectBeforeAfter = {
  label: string;
  before: ProjectImage;
  after: ProjectImage;
};

/** A material/brand association — powers the spec panel and entity SEO. */
export type ProjectMaterial = { name: string; manufacturer?: string };

/** The linked customer review (provenance-linked social proof). First name only. */
export type ProjectReview = {
  author: string;
  location: string;
  /** 1–5. */
  rating: number;
  quote: string;
};

/** A question/answer — structurally compatible with ServiceFAQ / FAQSchema items. */
export type ProjectFAQ = { question: string; answer: string };

/** Only `published` projects are rendered or enumerated publicly. */
export type ProjectStatus = 'published' | 'draft';

/**
 * Anonymized budget band — the public stand-in for the real contract price.
 * Kept as a string so copy can read naturally (e.g. "$15k–$30k") without ever
 * exposing the actual figure.
 */
export type BudgetBand = string;

export type Project = {
  // ── Identity & classification ──────────────────────────────────────────
  slug: string;
  title: string;
  status: ProjectStatus;
  /** Surfaced on the homepage Proof Wall and featured rails. */
  featured?: boolean;

  // ── Relationships (validated against canonical catalogs) ───────────────
  /** Primary service slug — must exist in SERVICES (src/lib/constants). */
  service: string;
  /** Additional services touched on the job. */
  secondaryServices?: string[];
  /** City slug — must exist in ALL_SERVICE_AREAS (src/lib/constants). */
  citySlug: string;

  // ── Facts / spec panel ─────────────────────────────────────────────────
  /** ISO date (YYYY-MM-DD) the project completed; used for sorting + schema. */
  completedOn: string;
  durationLabel?: string;
  budgetBand?: BudgetBand;
  style?: string;
  materials?: ProjectMaterial[];

  // ── SEO ────────────────────────────────────────────────────────────────
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  /** The citable "answer block" summary AI engines and previews lift. */
  summary: string;

  // ── Story (the editorial narrative) ────────────────────────────────────
  hero: {
    eyebrow?: string;
    heading: string;
    sub: string;
    image: ProjectImage;
  };
  /** What the homeowners wanted, in human terms. */
  brief: string[];
  /** What made the job hard — where expertise becomes visible. */
  challenge?: string[];
  /** How Real Elite executed it (the "build"). */
  solution: string[];
  /** Outcome pull-quotes. */
  outcome?: string[];

  // ── Media ──────────────────────────────────────────────────────────────
  beforeAfter?: ProjectBeforeAfter[];
  gallery: ProjectImage[];

  // ── Proof & cross-links ────────────────────────────────────────────────
  review?: ProjectReview;
  faqs?: ProjectFAQ[];
  /** Blog/guide slugs to cross-link (validated against getAllPosts()). */
  relatedGuideSlugs?: string[];
};

import { redirect } from 'next/navigation';

/**
 * /blog redirects to /guides (the Phase 5 editorial hub).
 * Individual /blog/[slug] post URLs remain canonical and unchanged
 * for SEO equity — only the index page is redirected.
 */
export default function BlogIndexRedirect() {
  redirect('/guides');
}

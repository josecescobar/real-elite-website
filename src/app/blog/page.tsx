import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

/**
 * /blog redirects to /resources (the Resource Center knowledge hub).
 * Individual /blog/[slug] post URLs remain canonical and unchanged
 * for SEO equity — only the index page is redirected.
 *
 * The built document has no guide copy of its own: it is a redirect to
 * /resources, and the footer in that file is the visible company line.
 * This description uses those words only, so it does not repeat the homepage.
 */
export const metadata: Metadata = {
  description:
    'Resources from Real Elite Contracting. Premium remodeling and exterior contracting across the WV–MD–VA region. Family-run. Built with military precision.',
};

export default function BlogIndexRedirect() {
  redirect('/resources');
}

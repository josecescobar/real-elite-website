import { redirect } from 'next/navigation';

/**
 * /blog redirects to /resources (the Resource Center knowledge hub).
 * Individual /blog/[slug] post URLs remain canonical and unchanged
 * for SEO equity — only the index page is redirected.
 */
export default function BlogIndexRedirect() {
  redirect('/resources');
}

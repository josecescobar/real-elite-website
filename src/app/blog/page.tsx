import Link from 'next/link';
import Container from '@/components/shared/Container';
import { buildMetadata } from '@/lib/seo';

/**
 * Live requests for /blog are a permanent HTTP redirect to /resources
 * (next.config.ts). That redirect runs before this file is served.
 *
 * This module still has to prerender. `redirect()` produces a shell whose
 * visible body is empty, so a meta description on that shell cannot quote
 * the page. The paragraph below is the body the description uses. Every
 * claim in it is already on the site footer and the Resources nav label.
 */
const description =
  'Resources from Real Elite Contracting. Premium remodeling and exterior contracting across the WV–MD–VA region. Family-run. Built with military precision.';

export const metadata = buildMetadata({
  path: '/blog',
  title: 'Blog | Real Elite Contracting',
  description,
});

export default function BlogIndexPage() {
  return (
    <section className="bg-white py-16 md:py-24">
      <Container size="default">
        <h1 className="font-heading text-4xl font-extrabold text-navy-800">Blog</h1>
        <p className="mt-6 text-charcoal-600 text-lg leading-relaxed max-w-2xl">{description}</p>
        <p className="mt-6">
          <Link href="/resources" className="text-brand-red font-semibold">
            Resource Center
          </Link>
        </p>
      </Container>
    </section>
  );
}

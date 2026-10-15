import type { Metadata } from 'next';

/**
 * Live requests for /blog are a permanent redirect to /resources
 * (next.config.ts). This module still prerenders, and it does not add a
 * section, heading, paragraph, or link.
 *
 * Calling redirect() here builds an empty shell, so a description on that
 * shell has no visible body. Returning no page content leaves the root
 * layout in the built document. The description below is the footer
 * sentence, phone, and email already rendered by that layout.
 */
const description =
  'Premium remodeling and exterior contracting across the WV–MD–VA region. Family-run. Built with military precision. (681) 534-5515 info@realelitecontracting.com';

export const metadata: Metadata = {
  description,
};

export default function BlogIndexPage() {
  return null;
}

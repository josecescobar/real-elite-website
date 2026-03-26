import type { Metadata } from 'next';
import { BUSINESS } from '@/lib/constants';
import GalleryGrid from '@/components/shared/GalleryGrid';

export const metadata: Metadata = {
  title: `Project Gallery | ${BUSINESS.name}`,
  description:
    'Browse our portfolio of completed roofing, siding, deck, and remodeling projects throughout the Eastern Panhandle.',
  keywords: [
    'project gallery',
    'contractor portfolio',
    'completed projects',
    'before and after',
    'roofing projects',
    'deck construction',
  ],
  alternates: {
    canonical: `${BUSINESS.url}/gallery`,
  },
  openGraph: {
    title: `Project Gallery | ${BUSINESS.name}`,
    description:
      'See our portfolio of completed projects showcasing quality craftsmanship across all services.',
    url: `${BUSINESS.url}/gallery`,
    type: 'website',
  },
};

export default function GalleryPage() {
  return (
    <>
      {/* Hero Banner */}
      <section className="bg-navy-900 text-white py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-black mb-4">Project Gallery</h1>
          <p className="text-lg text-white max-w-2xl">
            Browse our portfolio of completed projects showcasing quality craftsmanship
          </p>
        </div>
      </section>

      <GalleryGrid />
    </>
  );
}

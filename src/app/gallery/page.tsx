import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { BUSINESS } from '@/lib/constants';
import Container from '@/components/shared/Container';
import GalleryGrid from '@/components/shared/GalleryGrid';
import AssurancesBand from '@/components/home/AssurancesBand';

export const metadata: Metadata = {
  title: `Our Work | Project Gallery | ${BUSINESS.name}`,
  description:
    'Real projects from across the WV–MD–VA region — roofing, decks, siding, stone exteriors, remodeling, and additions. Click any project to see it full-size.',
  keywords: [
    'project gallery',
    'contractor portfolio',
    'completed projects',
    'roofing projects',
    'deck construction',
    'stone veneer projects',
    'Eastern Panhandle gallery',
  ],
  alternates: { canonical: `${BUSINESS.url}/gallery` },
  openGraph: {
    title: `Our Work | ${BUSINESS.name}`,
    description:
      'Real Real Elite projects across the WV–MD–VA region — filter by category, click any image to view full-size.',
    url: `${BUSINESS.url}/gallery`,
    type: 'website',
  },
};

export default function GalleryPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy-900 text-white pt-16 pb-20 md:pt-24 md:pb-28">
        <Container size="wide">
          <div className="max-w-3xl">
            <p className="text-brand-red text-xs uppercase tracking-[0.18em] font-semibold mb-4">
              Our Work
            </p>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.05] tracking-tight">
              Real projects.
              <br />
              <span className="text-brand-red">Real homes.</span>
            </h1>
            <p className="text-charcoal-200 text-lg md:text-xl mt-6 leading-relaxed max-w-2xl">
              Browse Real Elite projects across the Eastern Panhandle, Frederick MD, Winchester VA,
              and Loudoun County. Filter by category. Click any image to view full-size.
            </p>
          </div>
        </Container>
      </section>

      {/* Gallery + Lightbox */}
      <GalleryGrid />

      {/* Assurances */}
      <AssurancesBand />

      {/* CTA */}
      <section className="bg-navy-900 text-white py-16 md:py-24">
        <Container size="default" className="text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-extrabold mb-5">
            Want one of these on your block?
          </h2>
          <p className="text-charcoal-300 mb-8 max-w-2xl mx-auto">
            Tell us what you&apos;re picturing. Free written estimate within 24 business hours.
          </p>
          <Link
            href="/contact#estimate"
            className="inline-flex items-center gap-2 bg-brand-red text-white px-8 py-4 rounded-md font-bold text-sm hover:bg-brand-red-dark transition-colors shadow-lg shadow-navy-950/40"
          >
            Get My Free Estimate
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Container>
      </section>
    </>
  );
}

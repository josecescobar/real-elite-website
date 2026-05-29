'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { GALLERY_IMAGES } from '@/lib/constants';
import Container from './Container';

const CATEGORIES = ['All', 'Roofing', 'Decks', 'Siding', 'Exterior', 'Remodeling', 'New Construction', 'Additions'];

export default function GalleryGrid() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const filtered = useMemo(
    () =>
      selectedCategory === 'All'
        ? GALLERY_IMAGES
        : GALLERY_IMAGES.filter((img) => img.category === selectedCategory),
    [selectedCategory]
  );

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightboxIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIdx(null);
      if (e.key === 'ArrowRight') setLightboxIdx((i) => (i === null ? null : (i + 1) % filtered.length));
      if (e.key === 'ArrowLeft') setLightboxIdx((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length));
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightboxIdx, filtered.length]);

  const active = lightboxIdx !== null ? filtered[lightboxIdx] : null;

  return (
    <>
      {/* Filter bar */}
      <section className="bg-white border-b border-charcoal-100 sticky top-[64px] lg:top-[72px] z-20">
        <Container size="wide" className="py-5">
          <div role="group" aria-label="Filter projects by category" className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  aria-pressed={isActive}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-400 ${
                    isActive
                      ? 'bg-navy-800 text-white'
                      : 'bg-steel-50 text-navy-800 hover:bg-charcoal-100'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Grid */}
      <section className="bg-steel-50 py-12 md:py-16">
        <Container size="wide">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {filtered.map((image, index) => (
              <button
                key={image.src}
                onClick={() => setLightboxIdx(index)}
                className="group relative aspect-square overflow-hidden rounded-md bg-navy-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-navy-400 cursor-zoom-in"
                aria-label={`Open project image: ${image.alt}`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div className="text-white text-left">
                    <p className="text-[0.65rem] uppercase tracking-[0.18em] font-semibold text-brand-red mb-1">
                      {image.category}
                    </p>
                    <p className="text-xs leading-snug line-clamp-2">{image.alt}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-charcoal-500">No projects in this category yet.</p>
            </div>
          )}
        </Container>
      </section>

      {/* Lightbox */}
      {active && lightboxIdx !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Project: ${active.alt}`}
          className="fixed inset-0 z-[80] bg-navy-950/95 flex items-center justify-center p-4 sm:p-8"
          onClick={() => setLightboxIdx(null)}
        >
          {/* Close */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIdx(null);
            }}
            aria-label="Close lightbox"
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Prev */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIdx((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length));
            }}
            aria-label="Previous image"
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Next */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIdx((i) => (i === null ? null : (i + 1) % filtered.length));
            }}
            aria-label="Next image"
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Image */}
          <div
            className="relative w-full max-w-5xl max-h-[80vh] aspect-[3/2]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={active.src}
              alt={active.alt}
              fill
              sizes="(max-width: 1280px) 100vw, 1024px"
              className="object-contain"
              priority
            />
          </div>

          {/* Caption */}
          <div className="absolute bottom-4 inset-x-0 text-center text-white px-4">
            <p className="text-[0.65rem] uppercase tracking-[0.18em] font-semibold text-brand-red mb-1">
              {active.category}
            </p>
            <p className="text-sm text-charcoal-200 max-w-2xl mx-auto leading-snug">
              {active.alt}
            </p>
            <p className="text-xs text-charcoal-400 mt-2">
              {lightboxIdx + 1} / {filtered.length}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import { BEFORE_AFTER_PAIRS } from '@/lib/constants';

type Pair = (typeof BEFORE_AFTER_PAIRS)[number];

function Slider({ pair }: { pair: Pair }) {
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback((clientX: number) => {
    const node = containerRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: PointerEvent) => updatePosition(e.clientX);
    const onUp = () => setIsDragging(false);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [isDragging, updatePosition]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setPosition((p) => Math.max(0, p - 5));
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      setPosition((p) => Math.min(100, p + 5));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[0.7rem] uppercase tracking-[0.18em] font-semibold text-brand-red">
          {pair.category}
        </p>
        <p className="text-sm text-charcoal-600 font-medium">{pair.label}</p>
      </div>
      <div
        ref={containerRef}
        className="relative w-full aspect-[16/10] overflow-hidden rounded-lg shadow-card-elevated bg-navy-900 select-none touch-pan-y"
        onPointerDown={(e) => {
          (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
          setIsDragging(true);
          updatePosition(e.clientX);
        }}
      >
        {/* Finished image (full bleed) */}
        <Image
          src={pair.after.src}
          alt={pair.after.alt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover pointer-events-none"
        />
        {/* Finished label */}
        <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm text-navy-800 text-[0.65rem] font-bold uppercase tracking-[0.15em] px-3 py-1.5 rounded-sm pointer-events-none">
          Finished
        </div>

        {/* In-progress image clipped */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <Image
            src={pair.before.src}
            alt={pair.before.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute top-4 left-4 bg-navy-900/90 backdrop-blur-sm text-white text-[0.65rem] font-bold uppercase tracking-[0.15em] px-3 py-1.5 rounded-sm">
            In Progress
          </div>
        </div>

        {/* Divider + handle */}
        <div
          role="slider"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(position)}
          aria-label={`Reveal slider — ${pair.label}`}
          tabIndex={0}
          onKeyDown={onKeyDown}
          className="absolute top-0 bottom-0 -translate-x-1/2 w-1 bg-white shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red"
          style={{ left: `${position}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-lg flex items-center justify-center text-navy-800">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
              <path d="M8.7 5.3L4 10l4.7 4.7-1.4 1.4L1.2 10l6.1-6.1 1.4 1.4zm6.6 0L20 10l-4.7 4.7 1.4 1.4L22.8 10l-6.1-6.1-1.4 1.4z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BeforeAfter() {
  const [featured, ...rest] = BEFORE_AFTER_PAIRS;

  return (
    <section className="bg-steel-50 py-20 md:py-28">
      <Container size="wide">
        <SectionHeader
          eyebrow="Build to Finished"
          title="In progress to finished, drag-to-reveal."
          subtitle="Real Real Elite project shots. Drag the slider to see what the work looks like during construction and what it becomes when the crew is done."
        />

        <div className="mt-12">
          <Slider pair={featured} />
        </div>

        {rest.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-10">
            {rest.map((pair) => (
              <Slider key={pair.label} pair={pair} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ProductHeroSlideshow({ slides, ctaLoginHref, ctaTrialHref }) {
  const [current, setCurrent] = useState(0);
  const goTo = useCallback((index) => {
    let i = index;
    if (i < 0) i = slides.length - 1;
    if (i >= slides.length) i = 0;
    setCurrent(i);
  }, [slides.length]);

  useEffect(() => {
    const t = setInterval(() => goTo(current + 1), 5000);
    return () => clearInterval(t);
  }, [current, goTo]);

  if (!slides?.length) return null;

  const slide = slides[current];
  const title = slide?.title || '';

  return (
    <section
      className="relative h-[78vh] min-h-[420px] max-h-[720px] flex flex-col overflow-hidden pt-24"
      aria-label="Hero slideshow"
    >
      {/* Full-bleed slides */}
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 z-0 transition-opacity duration-700 ease-in-out ${
            i === current ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          aria-hidden={i !== current}
        >
          <Image
            src={s.image}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            priority={i === 0}
          />
          <div className="absolute inset-0 bg-slate-900/40" aria-hidden />
        </div>
      ))}

      {/* Centered content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 text-center">
        <h2
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white max-w-4xl mx-auto drop-shadow-lg"
          aria-live="polite"
        >
          {title}
        </h2>
        {(ctaLoginHref || ctaTrialHref) && (
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {ctaLoginHref && (
              <Link
                href={ctaLoginHref}
                className="inline-flex px-8 py-4 rounded-xl bg-white/20 backdrop-blur border border-white/40 text-white font-semibold text-lg hover:bg-white/30 hover:border-white/60 transition-all duration-300"
              >
                Log in
              </Link>
            )}
            {ctaTrialHref && (
              <Link
                href={ctaTrialHref}
                className="inline-flex px-8 py-4 rounded-xl bg-teal text-white font-semibold text-lg hover:bg-teal-dark border-2 border-teal transition-all duration-300"
              >
                Start free trial
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Slide dots – same style as main page */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3"
        aria-label="Slide navigation"
      >
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              i === current ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === current ? 'true' : undefined}
          />
        ))}
      </div>

      {/* Prev / Next arrows – same style as main page */}
      <button
        type="button"
        onClick={() => goTo(current - 1)}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 backdrop-blur border border-white/40 text-white flex items-center justify-center hover:bg-white/30 hover:border-white/60 transition-all duration-300"
        aria-label="Previous slide"
      >
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => goTo(current + 1)}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 backdrop-blur border border-white/40 text-white flex items-center justify-center hover:bg-white/30 hover:border-white/60 transition-all duration-300"
        aria-label="Next slide"
      >
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Scroll hint – link to product content below */}
      <div className="absolute bottom-8 right-8 z-20 hidden sm:block">
        <a
          href="#product-content"
          className="text-white/50 hover:text-white transition-colors"
          aria-label="Scroll to content"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>
      </div>
    </section>
  );
}

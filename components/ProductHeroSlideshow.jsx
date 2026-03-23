'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

function overlayClassForSlide(slide) {
  const t = slide?.textTone === 'dark' ? 'dark' : 'light';
  return t === 'dark'
    ? 'bg-gradient-to-b from-slate-900/20 via-slate-900/30 to-slate-900/45'
    : 'bg-slate-900/50';
}

export default function ProductHeroSlideshow({ slides, ctaLoginHref, ctaTrialHref, ctaContactHref, ctaContactLabel }) {
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
  const title = typeof slide?.title === 'string' ? slide.title.trim() : '';
  const showTitle = title.length > 0;
  /** 'light' = white text on dark scrim; 'dark' = dark text on light panel (for bright screenshots) */
  const tone = slide?.textTone === 'dark' ? 'dark' : 'light';

  const titlePanel =
    tone === 'dark'
      ? 'bg-white/92 text-slate-900 border border-slate-200/90 shadow-xl shadow-slate-900/15'
      : 'bg-black/55 text-white border border-white/15 shadow-xl shadow-black/40';

  const titleText =
    tone === 'dark'
      ? 'text-slate-900 [text-shadow:none]'
      : 'text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.85),0_1px_3px_rgba(0,0,0,0.9)]';

  const ctaLoginClass =
    tone === 'dark'
      ? 'inline-flex px-8 py-4 rounded-xl bg-slate-800 text-white font-semibold text-lg border-2 border-slate-700 shadow-lg hover:bg-slate-700 hover:border-slate-600 transition-all duration-300'
      : 'inline-flex px-8 py-4 rounded-xl bg-white/20 backdrop-blur border border-white/40 text-white font-semibold text-lg hover:bg-white/30 hover:border-white/60 transition-all duration-300';

  const ctaTrialClass =
    tone === 'dark'
      ? 'inline-flex px-8 py-4 rounded-xl bg-teal text-white font-semibold text-lg hover:bg-teal-dark border-2 border-teal-dark shadow-lg transition-all duration-300'
      : 'inline-flex px-8 py-4 rounded-xl bg-teal text-white font-semibold text-lg hover:bg-teal-dark border-2 border-teal transition-all duration-300';

  const arrowBase =
    tone === 'dark'
      ? 'top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 backdrop-blur border border-slate-500/60 text-white shadow-lg flex items-center justify-center hover:bg-black/55 hover:border-slate-400 transition-all duration-300'
      : 'top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 backdrop-blur border border-white/40 text-white flex items-center justify-center hover:bg-white/30 hover:border-white/60 transition-all duration-300';
  const arrowLeftClass = `absolute left-2 sm:left-4 ${arrowBase}`;
  const arrowRightClass = `absolute right-2 sm:right-4 ${arrowBase}`;

  const scrollHintClass =
    tone === 'dark'
      ? 'text-slate-800/80 hover:text-slate-950 drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]'
      : 'text-white/50 hover:text-white';

  return (
    <section
      className="relative h-[min(78vh,720px)] min-h-[420px] flex flex-col overflow-hidden pt-32 sm:pt-40"
      aria-label="Hero slideshow"
    >
      {/* Full-bleed slides */}
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 z-0 bg-slate-900 transition-opacity duration-700 ease-in-out ${
            i === current ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          aria-hidden={i !== current}
        >
          <Image
            src={s.image}
            alt=""
            fill
            className="object-contain object-center p-2 sm:p-4"
            sizes="100vw"
            priority={i === 0}
          />
          <div className={`absolute inset-0 transition-opacity duration-700 ${overlayClassForSlide(s)}`} aria-hidden />
        </div>
      ))}

      {/* Centered content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 text-center translate-y-3 sm:translate-y-4">
        {showTitle && (
          <div
            className={`mx-auto max-w-5xl rounded-2xl px-5 sm:px-8 py-4 sm:py-5 backdrop-blur-md transition-colors duration-500 ${titlePanel}`}
          >
            <h2
              className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold max-w-4xl mx-auto leading-tight ${titleText}`}
              aria-live="polite"
            >
              {title}
            </h2>
          </div>
        )}
        {(ctaLoginHref || ctaTrialHref || ctaContactHref) && (
          <div className={`flex flex-wrap justify-center gap-4 ${showTitle ? 'mt-8' : ''}`}>
            {ctaLoginHref && (
              <Link href={ctaLoginHref} className={ctaLoginClass}>
                Log in
              </Link>
            )}
            {ctaContactHref ? (
              <a href={ctaContactHref} className={ctaTrialClass}>
                {ctaContactLabel || 'Contact us'}
              </a>
            ) : ctaTrialHref ? (
              <Link href={ctaTrialHref} className={ctaTrialClass}>
                Start free trial
              </Link>
            ) : null}
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
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 shadow-sm ${
              tone === 'dark'
                ? i === current
                  ? 'bg-slate-900 scale-125 ring-2 ring-white/90 shadow-md'
                  : 'bg-slate-700/50 hover:bg-slate-800/70 ring-1 ring-white/40'
                : i === current
                  ? 'bg-white scale-125'
                  : 'bg-white/50 hover:bg-white/70'
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
        className={arrowLeftClass}
        aria-label="Previous slide"
      >
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => goTo(current + 1)}
        className={arrowRightClass}
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
          className={`transition-colors ${scrollHintClass}`}
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

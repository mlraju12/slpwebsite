'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

function overlayClassForSlide(slide) {
  const t = slide?.textTone === 'dark' ? 'dark' : 'light';
  return t === 'dark'
    ? 'bg-gradient-to-b from-slate-900/20 via-slate-900/30 to-slate-900/45'
    : 'bg-gradient-to-b from-black/40 via-slate-950/55 to-black/65';
}

export default function ProductHeroSlideshow({
  slides,
  ctaLoginHref,
  ctaTrialHref,
  ctaContactHref,
  ctaContactLabel,
  ctaOpenAppHref,
  ctaOpenAppLabel,
  scrollToContentHref = '#product-content',
}) {
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
  const headline = typeof slide?.headline === 'string' ? slide.headline.trim() : '';
  const hasHeadline = headline.length > 0;
  const eyebrow = typeof slide?.eyebrow === 'string' ? slide.eyebrow.trim() : '';
  const subheadline = typeof slide?.subheadline === 'string' ? slide.subheadline.trim() : '';
  const showTitlePanel = hasHeadline || title.length > 0;
  const slideCtaLabel = typeof slide?.ctaLabel === 'string' ? slide.ctaLabel.trim() : '';
  const slideCtaHref = typeof slide?.ctaHref === 'string' ? slide.ctaHref.trim() : '';
  const showSlideCta = slideCtaLabel.length > 0 && slideCtaHref.length > 0;
  const bulletList = Array.isArray(slide?.bullets)
    ? slide.bullets.filter((b) => typeof b === 'string' && b.trim().length > 0)
    : [];
  /** 'light' = white text on dark scrim; 'dark' = dark text on light panel (for bright screenshots) */
  const tone = slide?.textTone === 'dark' ? 'dark' : 'light';

  /** No caption box—text floats on the art; shadows keep it readable */
  const titleText =
    tone === 'dark'
      ? 'text-slate-900 [text-shadow:0_1px_2px_rgba(255,255,255,0.95),0_0_20px_rgba(255,255,255,0.85),0_2px_8px_rgba(255,255,255,0.6)]'
      : 'text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.95),0_4px_24px_rgba(0,0,0,0.85),0_0_2px_rgba(0,0,0,1)]';

  const eyebrowClass =
    tone === 'dark'
      ? 'text-slate-800 [text-shadow:0_1px_2px_rgba(255,255,255,0.9),0_0_12px_rgba(255,255,255,0.7)]'
      : 'text-white [text-shadow:0_2px_6px_rgba(0,0,0,0.95),0_0_2px_rgba(0,0,0,1)]';

  const subheadClass =
    tone === 'dark'
      ? 'text-slate-800 [text-shadow:0_1px_2px_rgba(255,255,255,0.9),0_0_16px_rgba(255,255,255,0.65)]'
      : 'text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.9),0_0_2px_rgba(0,0,0,0.95)]';

  const bulletItemClassTone =
    tone === 'dark'
      ? 'text-slate-800 [text-shadow:0_1px_2px_rgba(255,255,255,0.85)]'
      : 'text-white [text-shadow:0_2px_6px_rgba(0,0,0,0.9)]';
  const bulletMarkerClassTone =
    tone === 'dark' ? 'text-teal-800 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]' : 'text-teal-200 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]';

  const ctaLoginClass =
    tone === 'dark'
      ? 'inline-flex px-8 py-4 rounded-xl bg-slate-800 text-white font-semibold text-lg border-2 border-slate-700 shadow-lg hover:bg-slate-700 hover:border-slate-600 transition-all duration-300'
      : 'inline-flex px-8 py-4 rounded-xl bg-white/20 backdrop-blur border border-white/40 text-white font-semibold text-lg hover:bg-white/30 hover:border-white/60 transition-all duration-300';

  const ctaTrialClass =
    tone === 'dark'
      ? 'inline-flex px-8 py-4 rounded-xl bg-teal text-white font-semibold text-lg hover:bg-teal-dark border-2 border-teal-dark shadow-lg transition-all duration-300'
      : 'inline-flex px-8 py-4 rounded-xl bg-teal text-white font-semibold text-lg hover:bg-teal-dark border-2 border-teal transition-all duration-300';

  const ctaOpenAppClass =
    tone === 'dark'
      ? 'inline-flex px-8 py-4 rounded-xl bg-slate-900/90 text-white font-semibold text-lg border-2 border-teal-dark shadow-lg hover:bg-slate-800 hover:border-teal transition-all duration-300'
      : 'inline-flex px-8 py-4 rounded-xl bg-teal/90 backdrop-blur text-white font-semibold text-lg border-2 border-white/50 hover:bg-teal hover:border-white transition-all duration-300';

  const slideCtaYellowClass =
    'inline-flex items-center justify-center px-8 py-3.5 sm:py-4 rounded-full bg-amber-400 text-slate-900 font-bold text-base sm:text-lg border-2 border-amber-600/90 shadow-lg shadow-black/25 hover:bg-amber-300 hover:border-amber-500 transition-all duration-300';

  const slideCtaButtonClass =
    slide?.ctaStyle === 'yellow' ? slideCtaYellowClass : ctaTrialClass;

  const ctaOnlyHero =
    showSlideCta &&
    !showTitlePanel &&
    !ctaLoginHref &&
    !ctaTrialHref &&
    !ctaContactHref &&
    !ctaOpenAppHref;

  const arrowBase =
    tone === 'dark'
      ? 'top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 backdrop-blur border border-slate-500/60 text-white shadow-lg flex items-center justify-center hover:bg-black/55 hover:border-slate-400 transition-all duration-300'
      : 'top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 backdrop-blur border border-white/40 text-white flex items-center justify-center hover:bg-white/30 hover:border-white/60 transition-all duration-300';
  const arrowLeftClass = `absolute left-2 sm:left-4 ${arrowBase}`;
  const arrowRightClass = `absolute right-2 sm:right-4 ${arrowBase}`;

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
          {typeof s.image === 'string' && s.image.endsWith('.svg') ? (
            // eslint-disable-next-line @next/next/no-img-element -- SVG hero art from /public
            <img
              src={s.image}
              alt=""
              className={`absolute inset-0 w-full h-full p-2 sm:p-4 ${
                s.imageFit === 'cover'
                  ? `object-cover ${s.imagePosition || 'object-center'}`
                  : 'object-contain object-center'
              }`}
            />
          ) : (
            <Image
              src={s.image}
              alt=""
              fill
              className={`${
                s.imageFit === 'cover'
                  ? `object-cover ${s.imagePosition || 'object-center'}`
                  : 'object-contain object-center p-2 sm:p-4'
              }`}
              sizes="100vw"
              priority={i === 0}
            />
          )}
          <div className={`absolute inset-0 transition-opacity duration-700 ${overlayClassForSlide(s)}`} aria-hidden />
        </div>
      ))}

      {/* Centered content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 text-center translate-y-3 sm:translate-y-4">
        {showTitlePanel && (
          <div className="mx-auto max-w-5xl px-5 sm:px-8 py-2 sm:py-3 transition-opacity duration-500">
            {eyebrow && (
              <p
                className={`text-xs sm:text-sm font-bold uppercase tracking-[0.18em] mb-2 max-w-4xl mx-auto ${eyebrowClass}`}
              >
                {eyebrow}
              </p>
            )}
            <h2
              className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold max-w-4xl mx-auto leading-tight ${titleText}`}
              aria-live="polite"
            >
              {hasHeadline ? headline : title}
            </h2>
            {subheadline && (
              <p
                className={`mt-3 sm:mt-4 text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-snug font-medium ${subheadClass}`}
              >
                {subheadline}
              </p>
            )}
            {bulletList.length > 0 && (
              <ul
                className={`mt-4 sm:mt-5 text-left max-w-xl mx-auto space-y-2 sm:space-y-2.5 list-none pl-0 ${bulletItemClassTone}`}
              >
                {bulletList.map((b) => {
                  const colon = b.indexOf(': ');
                  return (
                    <li key={b} className="flex gap-3 text-sm sm:text-base leading-snug items-start">
                      <span className={`shrink-0 mt-0.5 font-bold ${bulletMarkerClassTone}`} aria-hidden>
                        ✓
                      </span>
                      <span>
                        {colon === -1 ? (
                          b
                        ) : (
                          <>
                            <span className="font-semibold">{b.slice(0, colon + 1)}</span>
                            {b.slice(colon + 2)}
                          </>
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
        {(showSlideCta || ctaLoginHref || ctaTrialHref || ctaContactHref || ctaOpenAppHref) && (
          <div
            className={
              ctaOnlyHero
                ? 'absolute bottom-24 left-0 right-0 z-20 flex flex-wrap justify-center gap-4 px-4 pointer-events-auto'
                : `flex flex-wrap justify-center gap-4 ${showTitlePanel ? 'mt-8' : 'mt-4'}`
            }
          >
            {showSlideCta &&
              (slideCtaHref.startsWith('mailto:') ? (
                <a href={slideCtaHref} className={slideCtaButtonClass}>
                  {slideCtaLabel}
                </a>
              ) : (
                <Link href={slideCtaHref} className={slideCtaButtonClass}>
                  {slideCtaLabel}
                </Link>
              ))}
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
            {ctaOpenAppHref && (
              <a
                href={ctaOpenAppHref}
                target="_blank"
                rel="noopener noreferrer"
                className={ctaOpenAppClass}
              >
                {ctaOpenAppLabel || 'Open app'}
              </a>
            )}
          </div>
        )}
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

      {/* Slide dots */}
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

      {/* Scroll hint */}
      <div className="absolute bottom-8 right-8 z-20 hidden sm:block">
        <a
          href={scrollToContentHref}
          className={
            tone === 'dark'
              ? 'text-slate-800/90 hover:text-slate-950 drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]'
              : 'text-white/70 hover:text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]'
          }
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

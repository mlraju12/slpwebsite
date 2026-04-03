'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ContactTrigger from '@/components/ContactTrigger';

/** Per-slide text color schemes for hero wording (label, title, subtitle, body) */
const HERO_TEXT_SCHEMES = {
  white: {
    label: 'text-white/80',
    title: 'text-white',
    subtitle: 'text-white/95',
    subtitle2: 'text-white/85',
    body: 'text-white/90',
    sectionTitle: 'text-white',
    sectionBody: 'text-white/90',
    sectionBullet: 'text-white/90',
  },
  cream: {
    label: 'text-amber-100/90',
    title: 'text-white',
    subtitle: 'text-amber-50',
    subtitle2: 'text-amber-100/90',
    body: 'text-amber-50/95',
    sectionTitle: 'text-white',
    sectionBody: 'text-amber-50/90',
    sectionBullet: 'text-amber-50/90',
  },
  aqua: {
    label: 'text-cyan-100/90',
    title: 'text-white',
    subtitle: 'text-cyan-50',
    subtitle2: 'text-cyan-100/90',
    body: 'text-slate-100',
    sectionTitle: 'text-white',
    sectionBody: 'text-slate-100',
    sectionBullet: 'text-slate-100',
  },
  slate: {
    label: 'text-slate-300',
    title: 'text-white',
    subtitle: 'text-slate-200',
    subtitle2: 'text-slate-300',
    body: 'text-slate-200/95',
    sectionTitle: 'text-white',
    sectionBody: 'text-slate-200',
    sectionBullet: 'text-slate-200',
  },
};

const HERO_SLIDES = [
  {
    type: 'services',
    textScheme: 'white',
    title: 'Oracle Cloud Implementation',
    subtitle: 'Seamless Oracle Cloud Transformation',
    subtitle2: 'From Legacy to Leading-Edge Performance',
    body: 'Transitioning to the cloud is about more than just software; it\'s about evolving your business. From HCM and Payroll to full-scale ERP, we provide end-to-end implementation, migration, and ongoing support. With over 30 years of experience and a team of Oracle Certified Architects, Oracle isn\'t just a tool we use—it\'s in our DNA.',
    cta: 'Start your transformation now',
    href: '#contact',
    contactSubject: 'Oracle Cloud Transformation',
    ctaColor: 'teal',
    gradient: 'from-teal-sea to-teal-dark',
    image: '/oracle-cloud-implementation-bg.png',
    imageAlt: 'Oracle Cloud services',
  },
  {
    type: 'services',
    textScheme: 'cream',
    title: 'Managed Services & Consulting',
    subtitle: 'Sustaining Excellence: Oracle Managed Services',
    subtitle2: 'Beyond Hypercare—Ensuring Long-Term Stability & Growth',
    body: 'The true value of an Oracle Cloud investment is realized long after the initial go-live. Once the "Hypercare" phase concludes, many organizations struggle with maintenance, updates, and user adoption. Our Managed Services team steps in to ensure your system remains a high-performing asset, not a mounting overhead.',
    sections: [
      {
        title: 'Our Onboarding Process: The Health Check',
        intro: 'We don\'t just "take over" your environment; we master it. Before our team begins support, we perform a Comprehensive System Health Check.',
        bullets: [
          { label: 'Audit & Assessment', desc: 'We review your current configurations and custom integrations.' },
          { label: 'Gap Analysis', desc: 'We identify performance bottlenecks or security vulnerabilities left behind by previous implementations.' },
        ],
      },
      {
        title: 'Dedicated Expertise, 24/7',
        body: 'We provide a dedicated team of Oracle specialists who act as an extension of your internal IT department. You won\'t be speaking to a generic helpdesk; you\'ll be working with architects who understand your specific business logic.',
      },
    ],
    cta: 'View Solutions',
    href: '#services',
    ctaColor: 'aqua',
    gradient: 'from-teal to-teal-sea',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80',
    imageAlt: 'Team collaboration and strategy',
    overlayLessVisible: true,
  },
  {
    type: 'products',
    textScheme: 'aqua',
    title: 'AI-Powered Digital Solutions',
    subtitle: 'Intelligent workflows and next-gen technology to accelerate your business.',
    body: 'With 30 years of Oracle DNA, we lead the shift from traditional automation to Agentic AI. Our Oracle Certified architects specialize in deploying autonomous AI Agents within Oracle Cloud HCM that don\'t just answer employee queries—they execute end-to-end workflows. From AI Hiring Advisors that pre-screen and schedule candidates to Career Coaches that autonomously map internal mobility, we help you activate the \'digital workforce\' embedded in your system. By combining deep-dive health checks with agentic orchestration, we ensure your HR transformation moves beyond manual intervention and into a self-optimizing future.',
    cta: 'Explore Products',
    href: '#products',
    ctaColor: 'teal-sea',
    gradient: 'from-aqua to-teal',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1920&q=80',
    imageAlt: 'AI and digital technology',
    overlayLighter: true,
  },
  {
    type: 'products',
    textScheme: 'slate',
    title: 'Cloud-Native Products',
    subtitle: 'Streamline operations with enterprise-grade security, reliability, and scale.',
    body: 'Experience the future of data with CloudFish: our Prompt-Powered, agentic query tool designed to eliminate the complexity of Oracle Cloud databases. Built with 30 years of Oracle DNA, CloudFish empowers your team to bypass complex SQL and manual data modeling through a natural language interface that talks directly to your HCM and ERP records. Whether you are analyzing workforce trends or financial metrics, our AI-driven \'digital coworkers\' execute end-to-end data tasks—delivering clear, actionable insights and instant exports with fewer clicks. We don\'t just provide data; we provide agentic intelligence that lives exactly where your decisions are made.',
    cta: 'See Products',
    href: '#products',
    ctaColor: 'accent',
    gradient: 'from-teal-dark to-slate-900',
    image: '/cloud-native-products-bg.png',
    imageAlt: 'Cloud-native dashboard',
    overlayDarker: true,
  },
];

const HERO_CTA_STYLES = {
  teal: 'bg-teal hover:bg-teal-dark border-teal text-white',
  aqua: 'bg-aqua hover:bg-aqua-dark border-aqua text-white',
  'teal-sea': 'bg-teal-sea hover:bg-teal-dark border-teal-sea text-white',
  accent: 'bg-accent hover:bg-accent/90 border-accent text-white',
};

/** Logo slot for product buttons (object-contain scales each asset to fit) */
const PRODUCT_LOGO_BOX = 'flex h-[260px] w-full max-w-[400px] items-center justify-center sm:h-[300px] sm:max-w-[460px]';
/** Larger slot for Payroll Variance Monitor so arched text and graphic are clearly readable */
const PRODUCT_LOGO_BOX_LARGE = 'flex h-[320px] w-full max-w-[480px] items-center justify-center sm:h-[380px] sm:max-w-[560px]';

/** Product buttons under Products section – each with distinct color, shape, and entrance animation */
const PRODUCT_BUTTONS = [
  {
    name: 'CloudFish',
    href: '/products/cloudfish',
    external: false,
    color: 'bg-white hover:bg-slate-50 border-aqua',
    shape: 'rounded-xl',
    entrance: 'fish',
    logo: '/cloudfish-button-logo.png',
  },
  {
    name: 'TideSync',
    href: '/products/tidesync',
    external: false,
    color: 'bg-white hover:bg-slate-50 border-teal',
    shape: 'rounded-2xl',
    entrance: 'tide',
    logo: '/tidesync-product-logo.png',
    logoAlt: 'TideSync',
  },
  {
    name: 'CloudReports',
    href: '#products',
    external: false,
    color: 'bg-white hover:bg-slate-50 border-teal-sea',
    shape: 'rounded-3xl',
    entrance: 'right',
    logo: '/cloudreports-button-logo.png',
    wordmark: '/cloudreports-logo-ai.png',
    /** Stacked: main logo above, large Analytics AI below, tight vertical gap */
    wordmarkLargeStack: true,
    productStackTall: true,
  },
  {
    name: 'Payroll Variance Monitor',
    href: '#products',
    external: false,
    color: 'bg-white hover:bg-slate-50 border-teal',
    shape: 'rounded-lg',
    entrance: 'right',
    logo: '/payroll-variance-monitor-logo.png',
    logoLarge: true,
  },
];

/** Service push buttons under Services section – same size/style as product buttons */
const SERVICE_BUTTONS = [
  { name: 'Oracle Cloud Implementations', href: '#services', color: 'bg-teal hover:bg-teal-dark text-white border-teal' },
  { name: 'Managed Services', href: '#services', color: 'bg-teal-sea hover:bg-teal-dark text-white border-teal-sea' },
  { name: 'Data Solutions', href: '#services', color: 'bg-aqua hover:bg-aqua-dark text-white border-aqua' },
  { name: 'Reports & Analytics', href: '#services', color: 'bg-teal-dark hover:bg-slate-800 text-white border-teal-dark' },
  { name: 'Oracle Support Services', href: '#services', color: 'bg-accent hover:bg-accent/90 text-white border-accent' },
];

function useVisible(ref, rootMargin = '0px 0px -80px 0px') {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ob = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin, threshold: 0.1 });
    ob.observe(el);
    return () => ob.disconnect();
  }, [ref, rootMargin]);
  return visible;
}

export default function HomePage() {
  const heroRef = useRef(null);
  const productsRef = useRef(null);
  const servicesRef = useRef(null);
  const careersRef = useRef(null);
  const talentRef = useRef(null);
  const resourcesRef = useRef(null);
  const whoRef = useRef(null);
  const highlightsRef = useRef(null);
  const contactRef = useRef(null);

  const productsVisible = useVisible(productsRef);
  const servicesVisible = useVisible(servicesRef);
  const careersVisible = useVisible(careersRef);
  const talentVisible = useVisible(talentRef);
  const resourcesVisible = useVisible(resourcesRef);
  const whoVisible = useVisible(whoRef);
  const highlightsVisible = useVisible(highlightsRef);
  const contactVisible = useVisible(contactRef);

  const [heroSlide, setHeroSlide] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setHeroSlide((i) => (i + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(t);
  }, []);

  const goToSlide = (index) => setHeroSlide(index);

  return (
    <main className="scroll-smooth">
      {/* Full-screen hero slider – Services (2) + Products (2, one AI digital) */}
      <section
        ref={heroRef}
        className="relative h-screen flex flex-col overflow-hidden pt-24"
        aria-label="Hero slideshow"
      >
        {/* Wave decoration (single instance, behind slides) */}
        <div className="slp-waves-wrap pointer-events-none absolute inset-0 z-0" aria-hidden>
          <svg viewBox="0 0 200 800" preserveAspectRatio="xMaxYMid slice" className="w-full h-full opacity-40">
            <defs>
              <linearGradient id="slp-wave-blue" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#0369a1" />
              </linearGradient>
            </defs>
            <g fill="none" stroke="url(#slp-wave-blue)" strokeLinecap="round">
              <path className="slp-wave-left" strokeWidth="1.8" d="M-40 80 Q40 40 100 80 T240 80" />
              <path className="slp-wave-right" strokeWidth="1.8" d="M240 120 Q160 160 100 120 T-40 120" />
              <path className="slp-wave-left" strokeWidth="1.5" d="M-40 200 Q40 150 100 200 T240 200" />
              <path className="slp-wave-right" strokeWidth="1.5" d="M240 260 Q160 310 100 260 T-40 260" />
              <path className="slp-wave-left" strokeWidth="1.6" d="M-40 340 Q40 290 100 340 T240 340" />
              <path className="slp-wave-right" strokeWidth="1.6" d="M240 400 Q160 450 100 400 T-40 400" />
              <path className="slp-wave-left" strokeWidth="1.4" d="M-40 480 Q40 430 100 480 T240 480" />
              <path className="slp-wave-right" strokeWidth="1.4" d="M240 540 Q160 590 100 540 T-40 540" />
              <path className="slp-wave-left" strokeWidth="1.7" d="M-40 620 Q40 570 100 620 T240 620" />
              <path className="slp-wave-right" strokeWidth="1.7" d="M240 680 Q160 730 100 680 T-40 680" />
              <path className="slp-wave-left" strokeWidth="1.5" d="M-40 760 Q40 710 100 760 T240 760" />
              <path className="slp-wave-right" strokeWidth="1.5" d="M240 780 Q160 830 100 780 T-40 780" />
            </g>
          </svg>
        </div>

        {/* Slides */}
        {HERO_SLIDES.map((slide, index) => {
          const scheme = HERO_TEXT_SCHEMES[slide.textScheme] || HERO_TEXT_SCHEMES.white;
          return (
          <div
            key={index}
            className={`absolute inset-0 z-10 flex flex-col items-center justify-center text-white transition-opacity duration-700 ease-in-out px-4 ${
              index === heroSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            aria-hidden={index !== heroSlide}
          >
            {/* Full-bleed background image */}
            <div className="absolute inset-0">
              <Image
                src={slide.image}
                alt={slide.imageAlt}
                fill
                className="object-cover"
                sizes="100vw"
                priority={index === 0}
              />
              {/* Dark overlay for text readability – lighter so images show through more */}
              <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} ${slide.overlayLighter ? 'opacity-35' : slide.overlayDarker ? 'opacity-65' : slide.overlayLessVisible ? 'opacity-60' : 'opacity-50'}`} aria-hidden />
              <div className={`absolute inset-0 ${slide.overlayLighter ? 'bg-slate-900/15' : slide.overlayDarker ? 'bg-slate-900/45' : slide.overlayLessVisible ? 'bg-slate-900/40' : 'bg-slate-900/30'}`} aria-hidden />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto text-center">
              <p className={`text-sm uppercase tracking-widest ${scheme.label} mb-4`}>
                {slide.type === 'services' ? 'Services' : 'Products'}
              </p>
              <h1 className={`text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 ${scheme.title}`}>
                {slide.title}
              </h1>
              {slide.sections ? (
                <>
                  <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 text-left">
                    <div>
                      <p className={`text-xl sm:text-2xl font-semibold ${scheme.subtitle} mb-1`}>{slide.subtitle}</p>
                      {slide.subtitle2 && <p className={`text-lg ${scheme.subtitle2} mb-4`}>{slide.subtitle2}</p>}
                      <p className={`text-base sm:text-lg ${scheme.body} mb-6 leading-relaxed`}>
                        {slide.body}
                      </p>
                    </div>
                    <div>
                      {slide.sections[0] && (
                        <div className="mb-6">
                          <h3 className={`text-lg font-semibold ${scheme.sectionTitle} mb-2`}>{slide.sections[0].title}</h3>
                          {slide.sections[0].intro && <p className={`${scheme.sectionBody} text-sm mb-3`}>{slide.sections[0].intro}</p>}
                          {slide.sections[0].bullets && (
                            <ul className="space-y-2">
                              {slide.sections[0].bullets.map((b) => (
                                <li key={b.label} className={`flex gap-2 text-sm ${scheme.sectionBullet}`}>
                                  <span className={`${scheme.sectionTitle} shrink-0`}>•</span>
                                  <span><strong className={scheme.subtitle}>{b.label}:</strong> {b.desc}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                      {slide.sections[1] && (
                        <div className="mb-4">
                          <h3 className={`text-lg font-semibold ${scheme.sectionTitle} mb-2`}>{slide.sections[1].title}</h3>
                          {slide.sections[1].body && <p className={`${scheme.sectionBody} text-sm leading-relaxed`}>{slide.sections[1].body}</p>}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-center mt-6">
                    {slide.contactSubject ? (
                      <ContactTrigger
                        subject={slide.contactSubject}
                        className={`slp-hover-lift inline-flex px-8 py-4 rounded-xl border font-semibold text-lg transition-all duration-300 ${HERO_CTA_STYLES[slide.ctaColor] || 'bg-white/20 backdrop-blur border-white/40 text-white hover:bg-white/30 hover:border-white/60'}`}
                      >
                        {slide.cta}
                      </ContactTrigger>
                    ) : (
                      <a
                        href={slide.href}
                        className={`slp-hover-lift inline-flex px-8 py-4 rounded-xl border font-semibold text-lg transition-all duration-300 ${HERO_CTA_STYLES[slide.ctaColor] || 'bg-white/20 backdrop-blur border-white/40 text-white hover:bg-white/30 hover:border-white/60'}`}
                      >
                        {slide.cta}
                      </a>
                    )}
                  </div>
                </>
              ) : slide.body ? (
                <>
                  <p className={`text-xl sm:text-2xl font-semibold ${scheme.subtitle} mb-1`}>{slide.subtitle}</p>
                  {slide.subtitle2 && <p className={`text-lg ${scheme.subtitle2} mb-4`}>{slide.subtitle2}</p>}
                  <p className={`text-base sm:text-lg ${scheme.body} mb-8 max-w-2xl mx-auto leading-relaxed`}>
                    {slide.body}
                  </p>
                  {slide.contactSubject ? (
                    <ContactTrigger
                      subject={slide.contactSubject}
                      className={`slp-hover-lift inline-flex px-8 py-4 rounded-xl border font-semibold text-lg transition-all duration-300 ${HERO_CTA_STYLES[slide.ctaColor] || 'bg-white/20 backdrop-blur border-white/40 text-white hover:bg-white/30 hover:border-white/60'}`}
                    >
                      {slide.cta}
                    </ContactTrigger>
                  ) : (
                    <a
                      href={slide.href}
                      className={`slp-hover-lift inline-flex px-8 py-4 rounded-xl border font-semibold text-lg transition-all duration-300 ${HERO_CTA_STYLES[slide.ctaColor] || 'bg-white/20 backdrop-blur border-white/40 text-white hover:bg-white/30 hover:border-white/60'}`}
                    >
                      {slide.cta}
                    </a>
                  )}
                </>
              ) : (
                <>
                  <p className={`text-lg sm:text-xl ${scheme.body} mb-10 max-w-2xl mx-auto leading-relaxed`}>
                    {slide.subtitle}
                  </p>
                  {slide.contactSubject ? (
                    <ContactTrigger
                      subject={slide.contactSubject}
                      className={`slp-hover-lift inline-flex px-8 py-4 rounded-xl border font-semibold text-lg transition-all duration-300 ${HERO_CTA_STYLES[slide.ctaColor] || 'bg-white/20 backdrop-blur border-white/40 text-white hover:bg-white/30 hover:border-white/60'}`}
                    >
                      {slide.cta}
                    </ContactTrigger>
                  ) : (
                    <a
                      href={slide.href}
                      className={`slp-hover-lift inline-flex px-8 py-4 rounded-xl border font-semibold text-lg transition-all duration-300 ${HERO_CTA_STYLES[slide.ctaColor] || 'bg-white/20 backdrop-blur border-white/40 text-white hover:bg-white/30 hover:border-white/60'}`}
                    >
                      {slide.cta}
                    </a>
                  )}
                </>
              )}
            </div>
          </div>
          );
        })}

        {/* Slide indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3" aria-label="Slide navigation">
          {HERO_SLIDES.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goToSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === heroSlide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === heroSlide ? 'true' : undefined}
            />
          ))}
        </div>

        {/* Previous / Next arrows */}
        <button
          type="button"
          onClick={() => goToSlide((heroSlide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 backdrop-blur border border-white/40 text-white flex items-center justify-center hover:bg-white/30 hover:border-white/60 transition-all duration-300"
          aria-label="Previous slide"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => goToSlide((heroSlide + 1) % HERO_SLIDES.length)}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 backdrop-blur border border-white/40 text-white flex items-center justify-center hover:bg-white/30 hover:border-white/60 transition-all duration-300"
          aria-label="Next slide"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Scroll hint */}
        <div className="absolute bottom-8 right-8 z-20 hidden sm:block">
          <a href="#technical-highlights" className="text-white/50 hover:text-white transition-colors" aria-label="Scroll to content">
            <svg className="w-8 h-8 animate-float" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
        </div>
      </section>

      {/* Technical Highlights – 3-column grid, dark aquatic theme */}
      <section id="technical-highlights" ref={highlightsRef} className={`slp-section py-20 sm:py-28 px-4 bg-gradient-to-br from-teal-dark via-teal-sea to-aqua-dark ${highlightsVisible ? 'visible' : ''}`}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-4">Our Specialized Capabilities</h2>
          <p className="text-white/80 text-center mb-16 max-w-2xl mx-auto font-medium">
            Elite expertise for maximum impact—from UX evolution to tax migration and architectural integrity.
          </p>
          <div className={`grid sm:grid-cols-2 lg:grid-cols-3 gap-8 slp-stagger ${highlightsVisible ? 'visible' : ''}`}>
            <div className="slp-push-btn flex min-h-[220px] flex-col rounded-xl border-2 border-t-white/25 border-l-white/20 border-b-black/25 border-r-black/20 bg-teal-dark/95 p-8 shadow-[0_8px_0_0_rgba(0,0,0,0.3),0_6px_20px_rgba(0,0,0,0.2)] hover:shadow-[inset_0_4px_12px_rgba(0,0,0,0.35)] hover:translate-y-1.5 hover:border-aqua/40 active:shadow-[inset_0_6px_16px_rgba(0,0,0,0.45)] active:translate-y-2 active:scale-[0.98] transition-all duration-300 cursor-pointer">
              <h3 className="text-lg font-semibold text-aqua-light mb-3">UX Evolution</h3>
              <p className="text-white/85 leading-relaxed flex-1">
                Seamless transition from Oracle Classic to Responsive UI and full adoption of the Redwood Design System.
              </p>
            </div>
            <div className="slp-push-btn flex min-h-[220px] flex-col rounded-xl border-2 border-t-white/25 border-l-white/20 border-b-black/25 border-r-black/20 bg-teal-dark/95 p-8 shadow-[0_8px_0_0_rgba(0,0,0,0.3),0_6px_20px_rgba(0,0,0,0.2)] hover:shadow-[inset_0_4px_12px_rgba(0,0,0,0.35)] hover:translate-y-1.5 hover:border-teal/40 active:shadow-[inset_0_6px_16px_rgba(0,0,0,0.45)] active:translate-y-2 active:scale-[0.98] transition-all duration-300 cursor-pointer">
              <h3 className="text-lg font-semibold text-aqua-light mb-3">Tax & Compliance</h3>
              <p className="text-white/85 leading-relaxed flex-1">
                Proven methodology for migrating complex tax environments from Vertex to Oracle USOPTE.
              </p>
            </div>
            <div className="slp-push-btn flex min-h-[220px] flex-col rounded-xl border-2 border-t-white/25 border-l-white/20 border-b-black/25 border-r-black/20 bg-teal-sea/95 p-8 shadow-[0_8px_0_0_rgba(0,0,0,0.3),0_6px_20px_rgba(0,0,0,0.2)] hover:shadow-[inset_0_4px_12px_rgba(0,0,0,0.35)] hover:translate-y-1.5 hover:border-aqua/40 active:shadow-[inset_0_6px_16px_rgba(0,0,0,0.45)] active:translate-y-2 active:scale-[0.98] transition-all duration-300 cursor-pointer">
              <h3 className="text-lg font-semibold text-aqua-light mb-3">Architectural Integrity</h3>
              <p className="text-white/85 leading-relaxed flex-1">
                Strategy and oversight led exclusively by Oracle Certified Architects to ensure system stability.
              </p>
            </div>
            <div className="slp-push-btn flex min-h-[220px] flex-col rounded-xl border-2 border-t-white/25 border-l-white/20 border-b-black/25 border-r-black/20 bg-teal-sea/95 p-8 shadow-[0_8px_0_0_rgba(0,0,0,0.3),0_6px_20px_rgba(0,0,0,0.2)] hover:shadow-[inset_0_4px_12px_rgba(0,0,0,0.35)] hover:translate-y-1.5 hover:border-teal/40 active:shadow-[inset_0_6px_16px_rgba(0,0,0,0.45)] active:translate-y-2 active:scale-[0.98] transition-all duration-300 cursor-pointer">
              <h3 className="text-lg font-semibold text-aqua-light mb-3">Financial Performance</h3>
              <p className="text-white/85 leading-relaxed flex-1">
                Focused implementation frameworks designed to accelerate Time-to-Value and maximize ROI.
              </p>
            </div>
            <div className="slp-push-btn flex min-h-[220px] flex-col rounded-xl border-2 border-t-white/25 border-l-white/20 border-b-black/25 border-r-black/20 bg-aqua-dark/95 p-8 shadow-[0_8px_0_0_rgba(0,0,0,0.3),0_6px_20px_rgba(0,0,0,0.2)] hover:shadow-[inset_0_4px_12px_rgba(0,0,0,0.35)] hover:translate-y-1.5 hover:border-aqua-light/40 active:shadow-[inset_0_6px_16px_rgba(0,0,0,0.45)] active:translate-y-2 active:scale-[0.98] transition-all duration-300 cursor-pointer sm:col-span-2 lg:col-span-1">
              <h3 className="text-lg font-semibold text-aqua-light mb-3">Global Scale</h3>
              <p className="text-white/85 leading-relaxed flex-1">
                Multi-region deployment expertise with a focus on localized compliance and global data integrity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Oracle Partner badge */}
      <section className="py-8 bg-gradient-to-r from-teal to-teal-sea text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm uppercase tracking-widest font-semibold opacity-90">Official Oracle Partner</p>
          <p className="text-lg mt-1">Trusted implementation, support, and training across the Oracle Cloud ecosystem</p>
        </div>
      </section>

      {/* Products – four buttons with entrance animations: fish, tide, from right */}
      <section id="products" ref={productsRef} className={`slp-section py-24 px-4 ${productsVisible ? 'visible products-entrance-visible' : ''}`}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 text-center mb-4">Products</h2>
          <p className="text-slate-600 text-center mb-16 max-w-2xl mx-auto">
            Our cloud-native products power modern enterprises with reliability and scale.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {PRODUCT_BUTTONS.map((btn) => {
              const id = btn.name.toLowerCase().replace(/\s+/g, '');
              const shape = btn.shape || 'rounded-xl';
              const entrance = btn.entrance || 'right';
              const minHeightClass = btn.logoLarge || btn.productStackTall
                ? 'min-h-[360px] sm:min-h-[400px]'
                : 'min-h-[300px] sm:min-h-[320px]';
              const className = `slp-product-entrance-${entrance} flex items-center justify-center ${minHeightClass} ${shape} border-2 border-t-white/30 border-l-white/25 border-b-black/20 border-r-black/20 p-4 sm:p-6 text-xl font-semibold shadow-[0_8px_0_0_rgba(0,0,0,0.28),0_6px_20px_rgba(0,0,0,0.22)] hover:shadow-[inset_0_4px_12px_rgba(0,0,0,0.3)] hover:translate-y-1.5 active:shadow-[inset_0_6px_16px_rgba(0,0,0,0.4)] active:translate-y-2 active:scale-[0.98] transition-all duration-300 cursor-pointer ${btn.color}`;
              const logoBoxClass = btn.logoLarge ? PRODUCT_LOGO_BOX_LARGE : PRODUCT_LOGO_BOX;
              const logoW = btn.logoLarge ? 560 : 460;
              const logoH = btn.logoLarge ? 380 : 300;
              const stackGap = btn.wordmarkLargeStack ? 'gap-1' : 'gap-3';
              const inner = btn.logo ? (
                <span className={`${logoBoxClass} ${btn.wordmark ? `flex flex-col items-center ${stackGap}` : ''}`}>
                  <Image
                    src={btn.logo}
                    alt={btn.logoAlt ?? ''}
                    width={logoW}
                    height={logoH}
                    className={
                      btn.wordmarkLargeStack
                        ? 'max-h-[200px] w-auto max-w-full shrink-0 object-contain sm:max-h-[220px]'
                        : 'max-h-full max-w-full w-auto h-auto object-contain'
                    }
                  />
                  {btn.wordmark && (
                    <Image
                      src={btn.wordmark}
                      alt={btn.name}
                      width={btn.wordmarkLargeStack ? 640 : 240}
                      height={btn.wordmarkLargeStack ? 120 : 48}
                      className={
                        btn.wordmarkLargeStack
                          ? 'h-24 w-auto max-w-[95%] object-contain object-center sm:h-28 sm:max-w-full md:h-32'
                          : 'h-8 w-auto max-w-[200px] object-contain object-center sm:h-9 sm:max-w-[220px]'
                      }
                    />
                  )}
                </span>
              ) : (
                btn.name
              );
              return btn.external ? (
                <a
                  key={btn.name}
                  id={id}
                  href={btn.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={className}
                >
                  {inner}
                </a>
              ) : (
                <Link key={btn.name} id={id} href={btn.href} className={className}>
                  {inner}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services – five push buttons with Oracle-themed background image */}
      <section id="services" ref={servicesRef} className={`slp-section relative py-24 px-4 overflow-hidden ${servicesVisible ? 'visible' : ''}`}>
        {/* Background image – cloud / digital theme */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            priority={false}
          />
          <div className="absolute inset-0 bg-slate-900/60" aria-hidden />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-4">Services</h2>
          <p className="text-white/90 text-center mb-16 max-w-2xl mx-auto">
            End-to-end Oracle Cloud and consulting services tailored to your business.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-16">
            {SERVICE_BUTTONS.map((btn) => {
              const id = btn.name.toLowerCase().replace(/\s*&\s*/g, '-').replace(/\s+/g, '-');
              const className = `flex items-center justify-center min-h-[220px] rounded-xl border-2 border-t-white/30 border-l-white/25 border-b-black/20 border-r-black/20 p-8 text-lg font-semibold text-center shadow-[0_8px_0_0_rgba(0,0,0,0.28),0_6px_20px_rgba(0,0,0,0.22)] hover:shadow-[inset_0_4px_12px_rgba(0,0,0,0.3)] hover:translate-y-1.5 active:shadow-[inset_0_6px_16px_rgba(0,0,0,0.4)] active:translate-y-2 active:scale-[0.98] transition-all duration-300 cursor-pointer ${btn.color}`;
              return (
                <Link key={btn.name} id={id} href={btn.href} className={className}>
                  {btn.name}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Careers – light abstract background */}
      <section id="careers" ref={careersRef} className={`slp-section relative py-24 px-4 overflow-hidden ${careersVisible ? 'visible' : ''}`}>
        <div className="absolute inset-0 z-0">
          <Image
            src="/careers-bg.png"
            alt=""
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority={false}
          />
          <div className="absolute inset-0 bg-white/45" aria-hidden />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 drop-shadow-sm">Careers</h2>
          <p className="text-slate-700 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join a team that has been at the forefront of Oracle Cloud since 1999. We offer competitive roles
            in implementation, consulting, and product development.
          </p>
          <a href="#contact" className="inline-flex px-6 py-3 rounded-xl bg-teal text-white font-semibold hover:bg-teal-dark transition-colors shadow-md">
            View opportunities
          </a>
        </div>
      </section>

      {/* Talent Solutions – office environment background */}
      <section id="talent" ref={talentRef} className={`slp-section relative py-24 px-4 overflow-hidden ${talentVisible ? 'visible' : ''}`}>
        <div className="absolute inset-0 z-0">
          <Image
            src="/talent-solutions-bg.png"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            priority={false}
          />
          <div className="absolute inset-0 bg-slate-900/55" aria-hidden />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Talent Solutions</h2>
          <p className="text-white/90 mb-8">
            We connect organizations with certified Oracle Cloud experts. From contract to permanent placement,
            our talent network delivers the skills you need to succeed with Oracle Cloud.
          </p>
          <a href="#contact" className="inline-flex px-6 py-3 rounded-xl bg-aqua text-white font-semibold hover:bg-aqua-dark transition-colors">
            Get in touch
          </a>
        </div>
      </section>

      {/* Resources – ocean wave background */}
      <section id="resources" ref={resourcesRef} className={`slp-section relative py-24 px-4 overflow-hidden ${resourcesVisible ? 'visible' : ''}`}>
        <div className="absolute inset-0 z-0">
          <Image
            src="/resources-bg.png"
            alt=""
            fill
            className="object-cover object-center brightness-110"
            sizes="100vw"
            priority={false}
          />
          <div className="absolute inset-0 bg-white/45" aria-hidden />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 drop-shadow-sm">Resources</h2>
          <p className="text-slate-700 mb-8 max-w-2xl mx-auto leading-relaxed">
            Whitepapers, guides, and best practices for Oracle Cloud. Stay ahead with insights from our experts.
          </p>
          <a href="#contact" className="inline-flex px-6 py-3 rounded-xl bg-teal-sea text-white font-semibold hover:bg-teal-dark transition-colors shadow-md">
            Access resources
          </a>
        </div>
      </section>

      {/* About Us */}
      <section id="about-us" ref={whoRef} className={`slp-section py-24 px-4 bg-gradient-to-br from-slate-900 to-teal-sea text-white ${whoVisible ? 'visible' : ''}`}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">About Us</h2>
          <p className="text-white/90 text-lg mb-6">
            SLP Microsystems has been an Oracle Cloud IT business and consulting leader since 1999.
            As an Oracle Service Partner, we help organizations across every vertical adopt and optimize
            Oracle Cloud—from HCM and Payroll to ERP, analytics, and managed services.
          </p>
          <p className="text-white/80">
            Our clients rely on us for implementation, training, and ongoing support. We combine deep
            product expertise with a commitment to long-term partnerships.
          </p>
        </div>
      </section>

      {/* Contact – light water background */}
      <section
        id="contact"
        ref={contactRef}
        className={`slp-section relative py-24 px-4 overflow-hidden ${contactVisible ? 'visible' : ''}`}
      >
        <div className="absolute inset-0 z-0">
          <Image
            src="/contact-bg.png"
            alt=""
            fill
            className="object-cover object-center brightness-110"
            sizes="100vw"
            priority={false}
          />
          <div className="absolute inset-0 bg-white/40" aria-hidden />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Get in Touch</h2>
          <p className="text-slate-700 mb-8">
            Ready to transform your business with Oracle Cloud? Reach out for a conversation.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <ContactTrigger
              subject="General inquiry"
              className="px-6 py-3 rounded-xl bg-teal text-white font-semibold hover:bg-teal-dark transition-colors shadow-md"
            >
              Email us
            </ContactTrigger>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-teal-dark text-white/90 text-center text-sm">
        <div className="flex flex-col items-center gap-4">
          <img
            src="/oracle-service-partner-logo.png"
            alt="Oracle Service Partner"
            className="h-10 w-auto opacity-95"
            width={160}
            height={40}
          />
          <p>© {new Date().getFullYear()} SLP Microsystems. Oracle Service Partner since 1999.</p>
        </div>
      </footer>
    </main>
  );
}

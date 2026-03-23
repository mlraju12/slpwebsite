import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getProductBySlug, getAllProductSlugs } from '@/lib/products';
import ProductHeroSlideshow from '@/components/ProductHeroSlideshow';

/** Button-style plan cards (CloudFish pricing) */
const PLAN_VARIANT = {
  silver: {
    card: 'rounded-2xl border-2 border-slate-400 bg-gradient-to-b from-slate-100 to-slate-200 text-slate-900 shadow-[0_5px_0_0_#64748b] hover:shadow-[0_7px_0_0_#64748b] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_2px_0_0_#64748b] transition-all duration-150',
    muted: 'text-slate-600',
    bullet: 'text-slate-800',
    cta: 'bg-slate-700 text-white border-2 border-slate-900 shadow-[0_4px_0_0_#0f172a] hover:bg-slate-800 active:translate-y-0.5 active:shadow-[0_1px_0_0_#0f172a]',
  },
  gold: {
    card: 'rounded-2xl border-2 border-amber-500 bg-gradient-to-b from-amber-50 to-amber-200 text-amber-950 shadow-[0_5px_0_0_#d97706] hover:shadow-[0_7px_0_0_#d97706] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_2px_0_0_#d97706] transition-all duration-150',
    muted: 'text-amber-900/80',
    bullet: 'text-amber-950',
    cta: 'bg-amber-600 text-white border-2 border-amber-900 shadow-[0_4px_0_0_#92400e] hover:bg-amber-700 active:translate-y-0.5 active:shadow-[0_1px_0_0_#92400e]',
  },
  'gold-yearly': {
    card: 'rounded-2xl border-2 border-orange-500 bg-gradient-to-b from-orange-100 via-amber-50 to-amber-200 text-orange-950 shadow-[0_5px_0_0_#ea580c] hover:shadow-[0_7px_0_0_#ea580c] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_2px_0_0_#ea580c] transition-all duration-150',
    muted: 'text-orange-900/85',
    bullet: 'text-orange-950',
    cta: 'bg-orange-600 text-white border-2 border-orange-900 shadow-[0_4px_0_0_#9a3412] hover:bg-orange-700 active:translate-y-0.5 active:shadow-[0_1px_0_0_#9a3412]',
  },
  enterprise: {
    card: 'rounded-2xl border-2 border-violet-400 bg-gradient-to-b from-indigo-600 to-violet-800 text-white shadow-[0_5px_0_0_#5b21b6] hover:shadow-[0_7px_0_0_#5b21b6] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_2px_0_0_#5b21b6] transition-all duration-150',
    muted: 'text-indigo-100',
    bullet: 'text-white',
    cta: 'bg-white text-indigo-900 border-2 border-indigo-950 shadow-[0_4px_0_0_#1e1b4b] hover:bg-indigo-50 active:translate-y-0.5 active:shadow-[0_1px_0_0_#1e1b4b]',
  },
};

export async function generateStaticParams() {
  return getAllProductSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const product = getProductBySlug(params.slug);
  if (!product) return { title: 'Product | SLP Microsystems' };
  return {
    title: `${product.name} | SLP Microsystems`,
    description: product.tagline,
  };
}

export default function ProductPage({ params }) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const isCloudFish = params.slug === 'cloudfish';

  return (
    <main className={`min-h-screen pt-[4.5rem] flex flex-col ${isCloudFish ? '' : 'bg-white'}`}>
      {isCloudFish && (
        <div className="cloudfish-product-bg" aria-hidden="true">
          <div className="cloudfish-blob cloudfish-blob--1" />
          <div className="cloudfish-blob cloudfish-blob--2" />
          <div className="cloudfish-blob cloudfish-blob--3" />
          <div className="cloudfish-blob cloudfish-blob--4" />
          <div className="cloudfish-grid" />
        </div>
      )}
      <div className={isCloudFish ? 'relative z-10 flex flex-col flex-1' : 'flex flex-col flex-1'}>
      {product.heroSlides?.length > 0 && (
        <ProductHeroSlideshow
          slides={product.heroSlides}
          ctaLoginHref={product.ctaLoginHref}
          ctaTrialHref={product.ctaTrialHref}
        />
      )}
      {product.appPreview && (
        <section
          id="cloudfish-for-you"
          className="relative py-24 px-4 sm:px-6 min-h-[62vh] flex items-center bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${product.appPreview.image})` }}
          aria-labelledby="app-preview-title"
        >
          <div className="absolute inset-0 bg-white/60" aria-hidden />
          <div className="relative z-10 max-w-5xl mx-auto text-center">
            <h2 id="app-preview-title" className="text-3xl sm:text-4xl font-bold text-orange-500 mb-3 drop-shadow-sm">
              {product.appPreview.title}
            </h2>
            <p className="text-lg sm:text-xl text-orange-500 font-semibold max-w-3xl mx-auto slp-orange-pulse">
              {product.appPreview.subtitle}
            </p>
            <div className="mt-8 w-full max-w-6xl mx-auto rounded-xl overflow-hidden border-4 border-indigo-900 bg-white/85 shadow-2xl backdrop-blur-sm slp-image-float">
              <Image
                src="/cloudfish/cloudfish-for-you-center.png"
                alt="CloudFish app screenshot"
                width={1200}
                height={675}
                className="w-full h-auto object-contain"
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
            </div>
          </div>
        </section>
      )}
      {product.features && (
        <section
          id="features"
          className={`py-16 px-4 sm:px-6 relative overflow-hidden ${isCloudFish ? 'bg-cover bg-center bg-no-repeat' : 'bg-gradient-to-br from-teal-50 to-slate-100'}`}
          style={isCloudFish ? { backgroundImage: "url('/cloudfish/features-bg.png')" } : undefined}
          aria-labelledby="features-title"
        >
          {isCloudFish && <div className="absolute inset-0 bg-slate-900/80" aria-hidden />}
          <div className="max-w-6xl mx-auto relative z-10">
            <h2 id="features-title" className={`text-3xl sm:text-4xl font-bold text-center mb-3 ${isCloudFish ? 'text-white' : 'text-slate-900'}`}>
              {product.features.title}
            </h2>
            <p className={`text-lg sm:text-xl text-center mb-12 max-w-2xl mx-auto ${isCloudFish ? 'text-white/90' : 'text-slate-600'}`}>
              <strong>{product.features.subtitle}</strong>
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 list-none p-0 m-0">
              {product.features.items.map((item, i) => (
                <li
                  key={i}
                  className={`rounded-xl border-2 p-6 text-left transition-all duration-300 cursor-pointer ${
                    isCloudFish
                      ? `border-t-white/45 border-l-white/35 border-b-cyan-900/30 border-r-cyan-900/25 shadow-[0_10px_0_0_rgba(8,47,73,0.42),0_10px_24px_rgba(6,182,212,0.28)] hover:shadow-[inset_0_6px_16px_rgba(8,47,73,0.35)] hover:translate-y-2 active:shadow-[inset_0_8px_20px_rgba(8,47,73,0.45)] active:translate-y-3 active:scale-[0.97] ${
                        item.highlight ? 'bg-gradient-to-br from-cyan-200/95 to-sky-200/90 border-cyan-300/85' : 'bg-gradient-to-br from-cyan-50/95 to-teal-100/85 border-cyan-200/80'
                      }`
                      : `border-teal-200 bg-white shadow-md hover:shadow-lg hover:-translate-y-0.5 ${
                        item.highlight ? 'border-teal-400 bg-teal-50/80' : ''
                      }`
                  }`}
                >
                  <span className="text-2xl" aria-hidden>{item.icon}</span>
                  {item.badge && (
                    <span className="ml-2 inline-block text-xs font-semibold uppercase tracking-wide text-orange-600 bg-orange-100 px-2 py-0.5 rounded">
                      {item.badge}
                    </span>
                  )}
                  <h3 className="text-lg font-bold text-slate-900 mt-2 mb-2">{item.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
      {product.pricing && product.pricing.plans?.length > 0 && (
        <section id="choose-plan" className="py-16 px-4 sm:px-6 bg-white/95" aria-labelledby="choose-plan-title">
          <div className="max-w-6xl mx-auto">
            <h2 id="choose-plan-title" className="text-3xl sm:text-4xl font-bold text-slate-900 text-center mb-3">
              {product.pricing.title}
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 text-center mb-12 max-w-2xl mx-auto">
              <strong>{product.pricing.subtitle}</strong>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-7">
              {product.pricing.plans.map((plan) => {
                const v = PLAN_VARIANT[plan.variant] ?? PLAN_VARIANT.silver;
                const planId = plan.planId || (plan.variant === 'gold-yearly' ? 'gold_yearly' : plan.variant);
                const productSlug = params.slug;
                const buyHref = planId === 'free_trial'
                  ? `/login?next=${encodeURIComponent(`/cloudfish/purchase?plan=free_trial&product=${productSlug}`)}`
                  : plan.ctaHref || (product.pricing.loginHref
                    ? `${product.pricing.loginHref}?next=${encodeURIComponent(`/cloudfish/purchase?plan=${planId}&product=${productSlug}`)}`
                    : 'mailto:info@slpmicrosystems.com?subject=CloudFish%20Plan%20Inquiry');
                const ctaLabel = plan.ctaLabel || (planId === 'enterprise' ? 'Contact Us' : 'Buy Now');
                return (
                  <article key={plan.name} className={`flex flex-col p-6 sm:p-7 ${v.card}`}>
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <p className={`text-sm mt-1 mb-3 ${v.muted}`}>{plan.description}</p>
                    <div className="mb-1">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      {plan.period && <span className={`ml-1 ${v.muted}`}>{plan.period}</span>}
                    </div>
                    <p className={`text-xs mb-4 ${v.muted}`}>{plan.note}</p>
                    <ul className="space-y-2 mb-5 flex-1">
                      {plan.features.map((f) => (
                        <li key={f} className={`text-sm flex gap-2 ${v.bullet}`}>
                          <span className="opacity-80">•</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    {planId === 'enterprise' && !plan.ctaHref ? (
                      <a
                        href="mailto:info@slpmicrosystems.com?subject=CloudFish%20Enterprise%20Plan"
                        className={`inline-flex w-full justify-center px-4 py-3 rounded-xl font-semibold transition-colors ${v.cta}`}
                      >
                        Contact Us
                      </a>
                    ) : (
                      <Link href={buyHref} className={`inline-flex w-full justify-center px-4 py-3 rounded-xl font-semibold transition-colors ${v.cta}`}>
                        {ctaLabel}
                      </Link>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}
      <section className="relative mt-auto">
        <div className="bg-gradient-to-r from-indigo-300 via-amber-200 to-orange-300 border-t border-white/40">
          <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 text-center text-slate-800">
            <h3 className="text-xs sm:text-sm font-bold tracking-wide uppercase mb-2">Contact Us</h3>
            <p className="text-xs sm:text-sm">Tel: 419-322-0280 or 734-345-3433</p>
            <p className="text-xs sm:text-sm">Fax: 248-294-4459</p>
            <p className="text-xs sm:text-sm">
              <a href="mailto:info@slpmicrosystems.com" className="hover:underline">info@slpmicrosystems.com</a>
            </p>
            <p className="text-xs sm:text-sm">16801 Newburgh Road, Livonia, MI 48154</p>
            <div className="mt-3 flex flex-wrap justify-center gap-4 text-xs sm:text-sm">
              <a href="https://www.slpmicrosystems.com/" target="_blank" rel="noopener noreferrer" className="hover:underline">SLP Microsystems</a>
              <a href="https://cloudfish-frontend-5802cd04746c.herokuapp.com/" target="_blank" rel="noopener noreferrer" className="hover:underline">CloudFish app</a>
              <a href="mailto:info@slpmicrosystems.com" className="hover:underline">Contact</a>
            </div>
          </div>
        </div>
        <div className="bg-indigo-950 text-white/90">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <p className="text-xs sm:text-sm">
              By continuing to browse the site you are agreeing to our{' '}
              <a href="https://www.slpmicrosystems.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">
                privacy policy
              </a>{' '}
              and specifically our use of cookies.
            </p>
            <button type="button" className="shrink-0 px-4 py-1.5 rounded-lg bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-colors">
              OK
            </button>
          </div>
        </div>
      </section>
      </div>
    </main>
  );
}

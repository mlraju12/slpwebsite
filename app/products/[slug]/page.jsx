import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getProductBySlug, getAllProductSlugs } from '@/lib/products';
import ProductHeroSlideshow from '@/components/ProductHeroSlideshow';

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

  const scheduleDemoHref = `/#contact?subject=${encodeURIComponent('Schedule a Demo - ' + product.name)}`;
  const freeTrialHref = `mailto:info@slpmicrosystems.com?subject=${encodeURIComponent('Free Trial - ' + product.name)}`;
  const buyNowHref = `mailto:info@slpmicrosystems.com?subject=${encodeURIComponent('Buy Now - ' + product.name)}`;
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
          className="relative py-20 sm:py-24 px-4 sm:px-6 min-h-[min(80vh,800px)] flex flex-col justify-center bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${product.appPreview.image})` }}
          aria-labelledby="app-preview-title"
        >
          <div className="absolute inset-0 bg-white/75" aria-hidden />
          <div className="relative z-10 max-w-5xl mx-auto text-center">
            <h2 id="app-preview-title" className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
              {product.appPreview.title}
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
              {product.appPreview.subtitle}
            </p>
            <div className="relative w-full rounded-xl overflow-hidden shadow-xl border border-slate-200 bg-white/95 backdrop-blur-sm">
              <Image
                src={product.appPreview.image}
                alt="CloudFish app: connections, DB Browser, worksheets, SQL editor, and results"
                width={1200}
                height={720}
                className="w-full h-auto object-contain"
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
            </div>
            <a
              href={product.appPreview.ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-lg font-semibold bg-orange-500 text-white hover:bg-orange-600 transition-colors shadow-lg mt-8"
            >
              {product.appPreview.ctaLabel}
            </a>
          </div>
        </section>
      )}
      {product.features && (
        <section id="features" className="py-16 px-4 sm:px-6 bg-white relative overflow-hidden" aria-labelledby="features-title">
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]" aria-hidden>
            <p className="absolute right-0 top-1/4 text-6xl sm:text-8xl font-black text-slate-400 whitespace-nowrap select-none">ENTERPRISE CLOUD DATABASE</p>
          </div>
          <div className="max-w-6xl mx-auto relative z-10">
            <h2 id="features-title" className="text-3xl sm:text-4xl font-bold text-slate-900 text-center mb-3">
              {product.features.title}
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 text-center mb-12 max-w-2xl mx-auto">
              <strong>{product.features.subtitle}</strong>
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 list-none p-0 m-0">
              {product.features.items.map((item, i) => (
                <li
                  key={i}
                  className={`rounded-xl border border-slate-200 p-6 text-left shadow-sm transition-shadow hover:shadow-md ${
                    item.highlight ? 'bg-amber-50/80 border-amber-200/60' : 'bg-white'
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
      <section id="product-content" className="relative flex-1 flex flex-col justify-center bg-white px-6 sm:px-10 py-16 sm:py-20">
        {product.logo && (
          <div className="absolute top-6 right-6 sm:top-8 sm:right-8">
            <div className="bg-slate-50 rounded-lg shadow-md border border-slate-200 px-4 py-3 flex items-center justify-center">
              <Image
                src={product.logo}
                alt={product.name}
                width={320}
                height={100}
                className="h-auto w-full max-w-[260px] sm:max-w-[300px] object-contain"
                priority
              />
            </div>
          </div>
        )}
        <div className="max-w-4xl mx-auto w-full">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-3">{product.name}</h1>
          <p className="text-xl sm:text-2xl text-slate-600 mb-8">{product.tagline}</p>
          <p className="text-slate-700 leading-relaxed text-lg max-w-3xl">{product.description}</p>
        </div>
        <div className="max-w-4xl mx-auto w-full mt-12 flex flex-wrap gap-4">
          <Link
            href={scheduleDemoHref}
            className="inline-flex items-center justify-center px-8 py-4 rounded-lg text-lg font-semibold bg-teal text-white hover:bg-teal-dark transition-colors shadow-lg"
          >
            Schedule Demo
          </Link>
          <a
            href={freeTrialHref}
            className="inline-flex items-center justify-center px-8 py-4 rounded-lg text-lg font-semibold bg-white text-slate-700 border-2 border-slate-300 hover:bg-slate-50 transition-colors"
          >
            Free Trial
          </a>
          <a
            href={buyNowHref}
            className="inline-flex items-center justify-center px-8 py-4 rounded-lg text-lg font-semibold bg-accent text-white hover:bg-accent/90 transition-colors border-2 border-accent shadow-lg"
          >
            Buy Now
          </a>
        </div>
        <p className="max-w-4xl mx-auto w-full mt-12">
          <Link href="/#products" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
            ← Back to all products
          </Link>
        </p>
      </section>
      </div>
    </main>
  );
}

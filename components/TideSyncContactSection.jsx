'use client';

import ContactTrigger from './ContactTrigger';

export default function TideSyncContactSection({ title, subtitle, buttonLabel }) {
  return (
    <section id="contact-tidesync" className="py-16 px-4 sm:px-6 bg-gradient-to-br from-teal-50 to-slate-100" aria-labelledby="contact-tidesync-title">
      <div className="max-w-2xl mx-auto text-center">
        <h2 id="contact-tidesync-title" className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
          {title || 'Get in Touch'}
        </h2>
        <p className="text-lg text-slate-600 mb-8">
          {subtitle || 'Interested in TideSync? Contact us for pricing and a demo.'}
        </p>
        <ContactTrigger
          subject="TideSync inquiry"
          className="inline-flex px-8 py-4 rounded-xl bg-teal text-white font-semibold text-lg hover:bg-teal-dark transition-colors shadow-lg border-2 border-teal-dark"
        >
          {buttonLabel || 'Contact us'}
        </ContactTrigger>
      </div>
    </section>
  );
}

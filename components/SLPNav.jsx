'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import ContactTrigger from '@/components/ContactTrigger';

const NAV_LINKS = [
  {
    href: '/#products',
    label: 'Products',
    children: [
      { href: '/products/cloudfish', label: 'CloudFish' },
      { href: '/products/tidesync', label: 'TideSync' },
    ],
  },
  {
    href: '/#services',
    label: 'Services',
    children: [
      { href: '/#oracle-cloud-services', label: 'Oracle Cloud Services' },
      { href: '/#data-solutions', label: 'Data Solutions' },
      { href: '/#managed-services', label: 'Managed Services' },
    ],
  },
  { href: '/#talent', label: 'Talent Solutions' },
  { href: '/#careers', label: 'Careers' },
  { href: '/#resources', label: 'Resources' },
  { href: '/#who-we-are', label: 'Who We are | What We do' },
];

export default function SLPNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [activeSection, setActiveSection] = useState('');
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const check = () => setHasToken(typeof window !== 'undefined' && !!localStorage.getItem('token'));
    check();
    window.addEventListener('auth-change', check);
    return () => window.removeEventListener('auth-change', check);
  }, []);

  useEffect(() => {
    const sections = [];
    NAV_LINKS.forEach((item) => {
      const id = item.href.includes('#') ? item.href.split('#')[1] : null;
      if (id) sections.push(id);
      if (item.children && item.children.length > 0) {
        item.children.forEach((c) => {
          const cId = c.href.includes('#') ? c.href.split('#')[1] : null;
          if (cId) sections.push(cId);
        });
      }
    });
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = entry.target.id;
          if (id) {
            setActiveSection(id);
            break;
          }
        }
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <Link href="/" className="slp-logo-wrap shrink-0">
          <img
            src="/logo.png"
            alt="SLP Microsystems"
            className="slp-logo h-10 sm:h-12 w-auto max-h-14"
            width={180}
            height={48}
          />
        </Link>
        <nav className="hidden md:flex items-center gap-1 relative">
          {NAV_LINKS.map((item) => {
            const sectionId = item.href.includes('#') ? item.href.split('#')[1] : '';
            const isActive =
              activeSection === sectionId ||
              (item.children && item.children.some((c) => c.href.includes('#') && c.href.split('#')[1] === activeSection));
            const linkClass =
              'px-3 py-2 rounded-lg text-sm font-medium transition-colors ' +
              (isActive ? 'bg-aqua/15 text-teal-dark' : 'text-slate-700 hover:bg-aqua/10 hover:text-teal-dark');

            if (item.children && item.children.length > 0) {
              return (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => setDropdownOpen(item.href)}
                  onMouseLeave={() => setDropdownOpen(null)}
                >
                  <a href={item.href} className={'inline-flex items-center gap-0.5 ' + linkClass}>
                    {item.label}
                    <svg className="w-3.5 h-3.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </a>
                  {dropdownOpen === item.href && (
                    <div className="absolute top-full left-0 pt-1 min-w-[140px]">
                      <div className="rounded-lg border-2 border-orange-500 bg-white shadow-lg py-1">
                        {item.children.map((sub) => {
                          const isPath = sub.href.startsWith('/');
                          const isExternal = sub.href.startsWith('http');
                          return isPath ? (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              className="block px-4 py-2 text-sm text-slate-800 hover:bg-teal/15 hover:text-teal-dark font-medium rounded-none first:rounded-t-md last:rounded-b-md transition-colors"
                            >
                              {sub.label}
                            </Link>
                          ) : (
                            <a
                              key={sub.href}
                              href={sub.href}
                              {...(isExternal && { target: '_blank', rel: 'noopener noreferrer' })}
                              className="block px-4 py-2 text-sm text-slate-800 hover:bg-teal/15 hover:text-teal-dark font-medium rounded-none first:rounded-t-md last:rounded-b-md transition-colors"
                            >
                              {sub.label}
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            }
            return (
              <a key={item.href} href={item.href} className={linkClass}>
                {item.label}
              </a>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          <ContactTrigger
            subject="General inquiry"
            className="hidden sm:inline-flex px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-teal-dark hover:bg-aqua/10 transition-all"
          >
            Contact
          </ContactTrigger>
          {hasToken ? (
            <Link
              href="/account"
              className="hidden sm:inline-flex px-4 py-2 rounded-lg text-sm font-semibold bg-teal text-white hover:bg-teal-dark transition-all"
            >
              Account
            </Link>
          ) : (
            <Link
              href="/login"
              className="hidden sm:inline-flex px-4 py-2 rounded-lg text-sm font-semibold border-2 border-teal text-teal hover:bg-teal/10 transition-all"
            >
              Log in
            </Link>
          )}
          <img
            src="/oracle-service-partner-logo.png"
            alt="Oracle Service Partner"
            className="h-8 w-auto hidden sm:block"
            width={140}
            height={32}
          />
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-slate-700"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t shadow-lg py-4 px-4">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((item) => {
              if (item.children && item.children.length > 0) {
                return (
                  <div key={item.href}>
                    <a
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="px-4 py-3 rounded-lg text-slate-700 font-medium hover:bg-aqua/10 hover:text-teal-dark"
                    >
                      {item.label}
                    </a>
                    <div className="pl-4 flex flex-col gap-0.5 border-l-2 border-aqua/20 ml-4 my-1">
                      {item.children.map((sub) => {
                        const isPath = sub.href.startsWith('/');
                        const isExternal = sub.href.startsWith('http');
                        return isPath ? (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            onClick={() => setMobileOpen(false)}
                            className="px-3 py-2 text-sm text-slate-600 font-medium hover:bg-aqua/10 hover:text-teal-dark rounded-r-lg"
                          >
                            {sub.label}
                          </Link>
                        ) : (
                          <a
                            key={sub.href}
                            href={sub.href}
                            {...(isExternal && { target: '_blank', rel: 'noopener noreferrer' })}
                            onClick={() => setMobileOpen(false)}
                            className="px-3 py-2 text-sm text-slate-600 font-medium hover:bg-aqua/10 hover:text-teal-dark rounded-r-lg"
                          >
                            {sub.label}
                          </a>
                        );
                      })}
                    </div>
                  </div>
                );
              }
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 rounded-lg text-slate-700 font-medium hover:bg-aqua/10 hover:text-teal-dark"
                >
                  {item.label}
                </a>
              );
            })}
            <ContactTrigger
              subject="General inquiry"
              onClick={() => setMobileOpen(false)}
              className="mt-2 px-4 py-3 rounded-lg text-slate-700 font-semibold text-center block w-full hover:bg-aqua/10"
            >
              Contact
            </ContactTrigger>
            {hasToken ? (
              <Link
                href="/account"
                onClick={() => setMobileOpen(false)}
                className="mt-2 px-4 py-3 rounded-lg bg-teal text-white font-semibold text-center block"
              >
                Account
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="mt-2 px-4 py-3 rounded-lg border-2 border-teal text-teal font-semibold text-center block"
              >
                Log in
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

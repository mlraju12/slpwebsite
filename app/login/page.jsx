'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_CLOUDFISH_API_URL || 'https://cloudfish-backend-9d54cbd015c1.herokuapp.com/api';

export default function CentralLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const next = params.get('next');
    const token = localStorage.getItem('token');
    if (token && next) {
      window.location.href = next.startsWith('http') ? next : next.startsWith('/') ? next : `/${next}`;
      return;
    }
    if (token && !next) {
      window.location.href = '/account';
      return;
    }
    setChecking(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.access_token && data.user) {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('tok', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        const params = new URLSearchParams(window.location.search);
        const next = params.get('next');
        if (next) {
          window.location.href = next.startsWith('http') ? next : next.startsWith('/') ? next : `/${next}`;
        } else {
          window.location.href = '/account';
        }
      } else {
        setError(data.error || 'Login failed. Please check your credentials.');
      }
    } catch {
      setError('Cannot connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 pt-24">
        <div className="animate-pulse text-slate-500">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16 bg-slate-50 pt-24">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-slate-200 p-8">
        <Link href="/" className="text-slate-600 hover:text-teal text-sm mb-6 inline-block">
          ← Back to SLP Microsystems
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Log in</h1>
        <p className="text-slate-600 text-sm mb-6">
          Use this account for CloudFish, TideSync, and all SLP products. Same credentials everywhere.
        </p>
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@company.com"
              required
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-teal focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-teal focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-teal text-white font-semibold rounded-lg hover:bg-teal-dark disabled:opacity-60 transition-colors"
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-teal font-semibold hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </main>
  );
}

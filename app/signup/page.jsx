'use client';

import { useState } from 'react';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_CLOUDFISH_API_URL || 'https://cloudfish-backend-9d54cbd015c1.herokuapp.com/api';

export default function CentralSignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password, plan: 'free_trial' }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setSuccess(true);
      } else {
        setError(data.error || 'Signup failed. Please try again.');
      }
    } catch {
      setError('Cannot connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 py-16 bg-slate-50 pt-24">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-slate-200 p-8">
          <div className="text-5xl mb-4 text-teal">✓</div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Check Your Email</h1>
          <p className="text-slate-600 mb-4">
            We sent a verification link to <strong>{email}</strong>.
          </p>
          <p className="text-slate-600 text-sm mb-6">
            Click the link to verify your account. Then you can log in and purchase CloudFish, TideSync, or any SLP product with this account.
          </p>
          <Link
            href="/login"
            className="inline-block w-full py-3 px-4 bg-teal text-white font-semibold rounded-lg hover:bg-teal-dark text-center"
          >
            Go to Log in
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16 bg-slate-50 pt-24">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-slate-200 p-8">
        <Link href="/" className="text-slate-600 hover:text-teal text-sm mb-6 inline-block">
          ← Back to SLP Microsystems
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Create Account</h1>
        <p className="text-slate-600 text-sm mb-6">
          One account for CloudFish, TideSync, and all SLP products. Same login everywhere.
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
              placeholder="At least 6 characters"
              minLength={6}
              required
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-teal focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="confirm" className="block text-sm font-semibold text-slate-700 mb-1">Confirm Password</label>
            <input
              id="confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              minLength={6}
              required
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-teal focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-teal text-white font-semibold rounded-lg hover:bg-teal-dark disabled:opacity-60 transition-colors"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link href="/login" className="text-teal font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}

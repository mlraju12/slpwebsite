'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_CLOUDFISH_API_URL || 'https://cloudfish-backend-9d54cbd015c1.herokuapp.com/api';
const CLOUDFISH_APP_URL = 'https://cloudfish.slpmicrosystems.com';

export default function VerifyPage() {
  const [status, setStatus] = useState('loading'); // loading | success | error
  const [error, setError] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (!token) {
      setStatus('error');
      setError('No verification token found. Please use the link from your email.');
      return;
    }
    fetch(`${API_BASE}/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then(async (r) => {
        const data = await r.json().catch(() => ({}));
        if (r.ok && data.access_token && data.user) {
          localStorage.setItem('token', data.access_token);
          localStorage.setItem('tok', data.access_token);
          localStorage.setItem('user', JSON.stringify(data.user));
          window.dispatchEvent(new Event('auth-change'));
          setStatus('success');
          // Redirect to CloudFish with token in hash so it can auto-login
          window.location.href = `${CLOUDFISH_APP_URL}#auth_token=${encodeURIComponent(data.access_token)}`;
        } else {
          setStatus('error');
          setError(data.error || 'Verification failed. The link may have expired.');
        }
      })
      .catch(() => {
        setStatus('error');
        setError('Cannot connect to server. Please try again.');
      });
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-slate-50 pt-24">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-slate-200 p-8 text-center">
        <Link href="/" className="text-slate-600 hover:text-teal text-sm mb-6 inline-block">
          ← Back to SLP Microsystems
        </Link>
        {status === 'loading' && (
          <>
            <div className="animate-pulse text-2xl mb-4">⏳</div>
            <h1 className="text-xl font-bold text-slate-900 mb-2">Verifying your email...</h1>
            <p className="text-slate-600 text-sm">Please wait.</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="text-2xl mb-4">✓</div>
            <h1 className="text-xl font-bold text-slate-900 mb-2">Email verified!</h1>
            <p className="text-slate-600 text-sm mb-4">Redirecting you to CloudFish...</p>
            <a href={CLOUDFISH_APP_URL} className="text-teal font-semibold hover:underline">
              Click here if you are not redirected
            </a>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="text-2xl mb-4 text-red-500">✗</div>
            <h1 className="text-xl font-bold text-slate-900 mb-2">Verification failed</h1>
            <p className="text-slate-600 text-sm mb-4">{error}</p>
            <div className="flex flex-col gap-2">
              <Link href="/login" className="text-teal font-semibold hover:underline">
                Go to login
              </Link>
              <Link href="/signup" className="text-teal font-semibold hover:underline">
                Create a new account
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_CLOUDFISH_API_URL || 'https://cloudfish-backend-9d54cbd015c1.herokuapp.com/api';

const PLAN_NAMES = { free_trial: 'Free Trial', silver: 'Silver', gold: 'Gold', gold_yearly: 'Gold-Yearly' };

export default function CentralAccountPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login?next=/account';
      return;
    }
    fetch(`${API_BASE}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (r.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('tok');
          localStorage.removeItem('user');
          window.location.href = '/login?next=/account';
          return;
        }
        return r.json();
      })
      .then((data) => {
        if (data) setUser(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tok');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 pt-24">
        <div className="animate-pulse text-slate-500">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen px-4 py-16 bg-slate-50 pt-24">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-slate-600 hover:text-teal text-sm mb-6 inline-block">
          ← Back to SLP Microsystems
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">My Account</h1>
        <p className="text-slate-600 mb-8">{user.email}</p>

        <div className="bg-white rounded-xl shadow border border-slate-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Your Plans</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-slate-100">
              <span className="font-medium text-slate-800">CloudFish</span>
              <span className="text-teal font-semibold">{PLAN_NAMES[user.cloudfish_plan || user.plan] || PLAN_NAMES.free_trial}</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="font-medium text-slate-800">TideSync</span>
              <span className="text-slate-600">{PLAN_NAMES[user.tidesync_plan] || 'Not subscribed'}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link
            href="https://cloudfish.slpmicrosystems.com/"
            className="inline-flex px-6 py-3 bg-teal text-white font-semibold rounded-lg hover:bg-teal-dark"
          >
            Open CloudFish
          </Link>
          <Link
            href="/products/cloudfish#pricing"
            className="inline-flex px-6 py-3 bg-white border-2 border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50"
          >
            Upgrade CloudFish
          </Link>
          <button
            onClick={handleLogout}
            className="inline-flex px-6 py-3 text-slate-600 hover:text-slate-900 font-medium"
          >
            Log out
          </button>
        </div>
      </div>
    </main>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_CLOUDFISH_API_URL || 'https://cloudfish-backend-9d54cbd015c1.herokuapp.com/api';

const PLANS = {
  silver: { name: 'Silver', price: '$30/month', desc: '2 worksheets, 2 connections. Intellisense, SQL History, export to Excel/CSV/PDF.' },
  gold: { name: 'Gold', price: '$40/month', desc: 'Unlimited connections, unlimited worksheets. All Silver features.' },
  gold_yearly: { name: 'Gold-Yearly', price: '$450/year', desc: 'Unlimited everything. AI SideKick, Tables browser, Packages browser, REST API.' },
  enterprise: { name: 'Enterprise', price: 'Contact us', desc: 'Unlimited PODs, SSO, 24/7 support.' },
};

export default function CloudFishPurchasePage() {
  const [plan, setPlan] = useState('gold');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('token');
    if (!token) {
      const params = new URLSearchParams(window.location.search);
      const p = params.get('plan') || 'gold';
      window.location.replace(`/login?next=${encodeURIComponent(`/cloudfish/purchase?plan=${p}`)}`);
      return;
    }
    const params = new URLSearchParams(window.location.search);
    const p = params.get('plan');
    if (p && ['silver', 'gold', 'gold_yearly', 'enterprise'].includes(p)) {
      setPlan(p);
    }
    setChecking(false);
  }, []);

  const handleProceed = async () => {
    if (plan === 'enterprise') {
      window.location.href = '/#contact';
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.replace(`/login?next=${encodeURIComponent(`/cloudfish/purchase?plan=${plan}`)}`);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/stripe/create-checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ plan }),
      });
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('tok');
        localStorage.removeItem('user');
        window.location.replace(`/login?next=${encodeURIComponent(`/cloudfish/purchase?plan=${plan}`)}`);
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Error creating checkout');
        setLoading(false);
      }
    } catch {
      alert('Could not connect. Try again.');
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse text-slate-500">Loading...</div>
      </div>
    );
  }

  const planData = PLANS[plan] || PLANS.gold;

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16 bg-slate-50 pt-24">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg border border-slate-200 p-8">
        <Link href="/products/cloudfish#pricing" className="text-slate-600 hover:text-teal text-sm mb-6 inline-block">
          ← Back to plans
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Complete your purchase</h1>
        <div className="mb-4">
          <label htmlFor="plan-select" className="block text-sm font-semibold text-slate-600 mb-2">Select plan</label>
          <select
            id="plan-select"
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-teal focus:outline-none"
          >
            <option value="silver">Silver – $30/month</option>
            <option value="gold">Gold – $40/month</option>
            <option value="gold_yearly">Gold-Yearly – $450/year</option>
            <option value="enterprise">Enterprise – Contact us</option>
          </select>
        </div>
        <p className="text-lg font-semibold text-teal mb-1">{planData.name} – {planData.price}</p>
        <p className="text-slate-600 text-sm mb-6">{planData.desc}</p>
        <div className="mb-4">
          {plan === 'enterprise' ? (
            <Link
              href="/#contact"
              className="block w-full py-3 px-4 bg-teal text-white font-semibold rounded-lg hover:bg-teal-dark text-center"
            >
              Contact us for Enterprise
            </Link>
          ) : (
            <button
              onClick={handleProceed}
              disabled={loading}
              className="w-full py-3 px-4 bg-teal text-white font-semibold rounded-lg hover:bg-teal-dark disabled:opacity-60 transition-colors"
            >
              {loading ? 'Loading...' : 'Proceed to payment'}
            </button>
          )}
        </div>
        <p className="text-slate-500 text-sm">
          Your plan will be attached to your account after payment. Same login works in the CloudFish app.
        </p>
      </div>
    </main>
  );
}

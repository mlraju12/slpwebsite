'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_CLOUDFISH_API_URL || 'https://cloudfish-backend-9d54cbd015c1.herokuapp.com/api';

const PLANS = {
  free_trial: { name: 'Free Trial', price: '$0', desc: '1 connection, 1 worksheet. Full access for 7 days.' },
  silver: { name: 'Silver', price: '$30/month', desc: '2 worksheets, 2 connections. Intellisense, SQL History, export to Excel/CSV/PDF.' },
  gold: { name: 'Gold', price: '$40/month', desc: 'Unlimited connections, unlimited worksheets. All Silver features.' },
  gold_yearly: { name: 'Gold-Yearly', price: '$450/year', desc: 'Unlimited everything. AI SideKick, Tables browser, Packages browser, REST API.' },
  enterprise: { name: 'Enterprise', price: 'Contact us', desc: 'Unlimited PODs, SSO, 24/7 support.' },
};

/** TideSync product plans (see /products/tidesync#choose-plan) */
const TIDESYNC_PLANS = {
  tidesync_gold: {
    name: 'Gold',
    price: '$5,000 / 6 months',
    desc: 'Email support, export to CSV/Excel and more, multiple time collection devices, approved hours by employee, approved hours by date range.',
  },
  enterprise: {
    name: 'Enterprise',
    price: 'Contact us',
    desc: 'Custom pricing for your organization. Same capabilities as Gold with volume options and tailored support.',
  },
};

const PRODUCT_NAMES = { cloudfish: 'CloudFish', tidesync: 'TideSync' };

const CLOUDFISH_PLAN_IDS = ['free_trial', 'silver', 'gold', 'gold_yearly', 'enterprise'];
const TIDESYNC_PLAN_IDS = ['tidesync_gold', 'enterprise'];

export default function CloudFishPurchasePage() {
  const [plan, setPlan] = useState('gold');
  const [product, setProduct] = useState('cloudfish');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [alreadyClaimed, setAlreadyClaimed] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('token');
    const params = new URLSearchParams(window.location.search);
    let p = params.get('plan');
    const prod = params.get('product') || 'cloudfish';
    if (!token) {
      const defaultPlan = prod === 'tidesync' ? 'tidesync_gold' : 'gold';
      window.location.replace(`/login?next=${encodeURIComponent(`/cloudfish/purchase?plan=${p || defaultPlan}&product=${prod}`)}`);
      return;
    }
    if (prod === 'tidesync' && (p === 'free_trial' || p === 'gold')) {
      p = 'tidesync_gold';
    }
    if (prod === 'tidesync') {
      if (p && TIDESYNC_PLAN_IDS.includes(p)) {
        setPlan(p);
      } else {
        setPlan('tidesync_gold');
      }
    } else if (p && CLOUDFISH_PLAN_IDS.includes(p)) {
      setPlan(p);
    }
    if (prod && ['cloudfish', 'tidesync'].includes(prod)) {
      setProduct(prod);
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
      window.location.replace(`/login?next=${encodeURIComponent(`/cloudfish/purchase?plan=${plan}&product=${product}`)}`);
      return;
    }
    setLoading(true);
    setAlreadyClaimed(false);
    try {
      if (plan === 'free_trial' && product !== 'tidesync') {
        const res = await fetch(`${API_BASE}/account/claim-free-trial`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ product }),
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok) {
          window.location.href = '/account';
          return;
        }
        if (data.already_claimed) {
          setAlreadyClaimed(true);
          setLoading(false);
          return;
        }
        alert(data.error || 'Could not claim free trial.');
        setLoading(false);
        return;
      }
      const res = await fetch(`${API_BASE}/stripe/create-checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ plan, product }),
      });
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('tok');
        localStorage.removeItem('user');
        window.location.replace(`/login?next=${encodeURIComponent(`/cloudfish/purchase?plan=${plan}&product=${product}`)}`);
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

  const planData =
    product === 'tidesync'
      ? TIDESYNC_PLANS[plan] || TIDESYNC_PLANS.tidesync_gold
      : PLANS[plan] || PLANS.gold;
  const productName = PRODUCT_NAMES[product] || 'CloudFish';
  const isFreeTrial = plan === 'free_trial' && product !== 'tidesync';

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-slate-50 pt-24">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg border border-slate-200 p-8">
        <Link href={`/products/${product}#choose-plan`} className="text-slate-600 hover:text-teal text-sm mb-6 inline-block">
          ← Back to plans
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Complete your purchase</h1>
        <p className="text-sm text-slate-600 mb-6">
          for <span className="font-semibold text-teal">{productName}</span>
        </p>
        <div className="mb-4">
          <label htmlFor="plan-select" className="block text-sm font-semibold text-slate-600 mb-2">Select plan</label>
          <select
            id="plan-select"
            value={
              product === 'tidesync'
                ? plan === 'gold' || plan === 'free_trial'
                  ? 'tidesync_gold'
                  : plan
                : plan
            }
            onChange={(e) => setPlan(e.target.value)}
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-teal focus:outline-none"
          >
            {product === 'tidesync' ? (
              <>
                <option value="tidesync_gold">Gold – $5,000 / 6 months</option>
                <option value="enterprise">Enterprise – Contact us</option>
              </>
            ) : (
              <>
                <option value="free_trial">Free Trial – $0 (7 days)</option>
                <option value="silver">Silver – $30/month</option>
                <option value="gold">Gold – $40/month</option>
                <option value="gold_yearly">Gold-Yearly – $450/year</option>
                <option value="enterprise">Enterprise – Contact us</option>
              </>
            )}
          </select>
        </div>
        <p className="text-lg font-semibold text-teal mb-1">{planData.name} – {planData.price}</p>
        <p className="text-slate-600 text-sm mb-6">{planData.desc}</p>
        {alreadyClaimed && (
          <div className="mb-4 p-4 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-sm">
            You have already claimed your free trial for {productName}. Visit your <Link href="/account" className="font-semibold underline">account page</Link> to view your plans.
          </div>
        )}
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
              {loading ? 'Loading...' : isFreeTrial ? 'Claim free trial' : 'Proceed to payment'}
            </button>
          )}
        </div>
        <p className="text-slate-500 text-sm">
          {isFreeTrial
            ? `Your free trial will be attached to your account for ${productName}. One free trial per product.`
            : product === 'tidesync'
              ? 'Your plan will be attached to your account after payment. Use the same login for TideSync.'
              : 'Your plan will be attached to your account after payment. Same login works in the CloudFish app.'}
        </p>
      </div>
    </main>
  );
}

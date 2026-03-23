'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_CLOUDFISH_API_URL || 'https://cloudfish-backend-9d54cbd015c1.herokuapp.com/api';

const PLAN_NAMES = { free_trial: 'Free Trial', silver: 'Silver', gold: 'Gold', gold_yearly: 'Gold-Yearly' };

const PLAN_DESCRIPTIONS = {
  free_trial: '1 connection, 1 worksheet, run reports only.',
  silver: '2 connections, 2 worksheets, reports + HCM REST.',
  gold: 'Unlimited connections, unlimited worksheets, and all query types.',
  gold_yearly: 'Unlimited connections, worksheets, and AI Sidekick.',
};

const TIDESYNC_PLAN_DESCRIPTIONS = {
  free_trial: 'Unified data view, automated sync workflows, Oracle Cloud integration.',
  silver: null,
  gold: null,
  gold_yearly: null,
};

export default function CentralAccountPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [emailForm, setEmailForm] = useState({ newEmail: '', password: '' });
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [emailLoading, setEmailLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({ firstName: '', lastName: '', email: '', phone: '', message: '' });
  const [contactSending, setContactSending] = useState(false);

  const loadUser = () => {
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
  };

  useEffect(() => {
    loadUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tok');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('auth-change'));
    window.location.href = '/';
  };

  const handleChangeEmail = async (e) => {
    e.preventDefault();
    if (!emailForm.newEmail.trim()) {
      setMessage({ type: 'error', text: 'Enter new email' });
      return;
    }
    setEmailLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await fetch(`${API_BASE}/account/email`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ new_email: emailForm.newEmail.trim(), password: emailForm.password }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setUser((u) => (u ? { ...u, email: data.email || emailForm.newEmail.trim() } : u));
        setEmailForm({ newEmail: '', password: '' });
        setShowEmailForm(false);
        setMessage({ type: 'success', text: 'Email updated successfully.' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update email' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Cannot connect to server.' });
    } finally {
      setEmailLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.new !== passwordForm.confirm) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    if (passwordForm.new.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }
    setPasswordLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await fetch(`${API_BASE}/account/password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ current_password: passwordForm.current, new_password: passwordForm.new }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setPasswordForm({ current: '', new: '', confirm: '' });
        setShowPasswordForm(false);
        setMessage({ type: 'success', text: 'Password updated successfully.' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update password' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Cannot connect to server.' });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactForm.email?.trim() || !contactForm.message?.trim()) {
      setMessage({ type: 'error', text: 'Email and message are required' });
      return;
    }
    setContactSending(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          first_name: contactForm.firstName,
          last_name: contactForm.lastName,
          email: contactForm.email,
          phone: contactForm.phone,
          message: contactForm.message,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setContactForm({ firstName: '', lastName: '', email: '', phone: '', message: '' });
        setShowContactModal(false);
        setMessage({ type: 'success', text: 'Message sent. We\'ll respond as soon as possible.' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to send message' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Cannot connect to server.' });
    } finally {
      setContactSending(false);
    }
  };

  const cloudfishPlan = user?.cloudfish_plan ?? user?.plan ?? null;
  const tidesyncPlan = user?.tidesync_plan ?? null;
  const trialDays = user?.trial_days_remaining;
  const trialEnd = user?.trial_end;

  const TrialExpiry = ({ plan, product }) => {
    if (plan !== 'free_trial') return null;
    if (trialEnd && new Date(trialEnd) < new Date()) {
      return (
        <p className="text-sm text-amber-700 mt-1">
          Your {product} free trial expired on {new Date(trialEnd).toLocaleDateString()}.
        </p>
      );
    }
    if (trialDays != null && trialDays > 0) {
      return (
        <p className="text-sm text-slate-600 mt-1">
          Your free trial expires in {trialDays === 1 ? '1 day' : `${trialDays} days`}.
        </p>
      );
    }
    if (trialDays === 0) {
      return <p className="text-sm text-amber-700 mt-1">Your free trial expires today.</p>;
    }
    return null;
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
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Account Settings</h1>
        <p className="text-slate-600 mb-8">Manage your SLP products and account</p>

        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg text-sm ${
              message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-xl shadow border border-slate-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Email</h3>
          <p className="text-slate-700">{user.email}</p>
          {!showEmailForm ? (
            <button
              type="button"
              onClick={() => setShowEmailForm(true)}
              className="mt-2 text-sm text-teal font-semibold hover:underline"
            >
              Change email
            </button>
          ) : (
            <form onSubmit={handleChangeEmail} className="mt-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">New email</label>
                <input
                  type="email"
                  value={emailForm.newEmail}
                  onChange={(e) => setEmailForm((p) => ({ ...p, newEmail: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  value={emailForm.password}
                  onChange={(e) => setEmailForm((p) => ({ ...p, password: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={emailLoading}
                  className="px-4 py-2 bg-teal text-white font-semibold rounded-lg hover:bg-teal-dark disabled:opacity-60"
                >
                  {emailLoading ? 'Updating...' : 'Update email'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowEmailForm(false); setEmailForm({ newEmail: '', password: '' }); }}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="bg-white rounded-xl shadow border border-slate-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Password</h3>
          <p className="text-slate-600 text-sm">••••••••</p>
          {!showPasswordForm ? (
            <button
              type="button"
              onClick={() => setShowPasswordForm(true)}
              className="mt-2 text-sm text-teal font-semibold hover:underline"
            >
              Update password
            </button>
          ) : (
            <form onSubmit={handleChangePassword} className="mt-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Current password</label>
                <input
                  type="password"
                  value={passwordForm.current}
                  onChange={(e) => setPasswordForm((p) => ({ ...p, current: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">New password</label>
                <input
                  type="password"
                  value={passwordForm.new}
                  onChange={(e) => setPasswordForm((p) => ({ ...p, new: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  minLength={6}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Confirm new password</label>
                <input
                  type="password"
                  value={passwordForm.confirm}
                  onChange={(e) => setPasswordForm((p) => ({ ...p, confirm: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  minLength={6}
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="px-4 py-2 bg-teal text-white font-semibold rounded-lg hover:bg-teal-dark disabled:opacity-60"
                >
                  {passwordLoading ? 'Updating...' : 'Update password'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowPasswordForm(false); setPasswordForm({ current: '', new: '', confirm: '' }); }}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="bg-white rounded-xl shadow border border-slate-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Your Plans</h2>
          <div className="space-y-6">
            <div className="pb-4 border-b border-slate-100">
              <div className="flex justify-between items-center">
                <span className="font-medium text-slate-800">CloudFish</span>
                <span className="text-teal font-semibold">{cloudfishPlan ? PLAN_NAMES[cloudfishPlan] : 'Not subscribed'}</span>
              </div>
              <p className="text-sm text-slate-600 mt-1">{cloudfishPlan ? (PLAN_DESCRIPTIONS[cloudfishPlan] || '') : 'Claim your free trial to get started.'}</p>
              {!cloudfishPlan && (
                <Link href="/cloudfish/purchase?plan=free_trial&product=cloudfish" className="text-sm text-teal font-semibold hover:underline mt-1 inline-block">Claim free trial →</Link>
              )}
              <TrialExpiry plan={cloudfishPlan} product="CloudFish" />
            </div>
            <div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-slate-800">TideSync</span>
                <span className="text-teal font-semibold">{tidesyncPlan ? PLAN_NAMES[tidesyncPlan] : 'Not subscribed'}</span>
              </div>
              <p className="text-sm text-slate-600 mt-1">
                {tidesyncPlan ? (TIDESYNC_PLAN_DESCRIPTIONS[tidesyncPlan] || PLAN_DESCRIPTIONS[tidesyncPlan] || '') : 'Claim your free trial to get started.'}
              </p>
              {!tidesyncPlan && (
                <Link href="/cloudfish/purchase?plan=free_trial&product=tidesync" className="text-sm text-teal font-semibold hover:underline mt-1 inline-block">Claim free trial →</Link>
              )}
              <TrialExpiry plan={tidesyncPlan} product="TideSync" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow border border-slate-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Need help?</h3>
          <button
            type="button"
            onClick={() => {
              setContactForm((p) => ({ ...p, email: user?.email || p.email }));
              setShowContactModal(true);
            }}
            className="inline-flex px-4 py-2 border-2 border-teal text-teal font-semibold rounded-lg hover:bg-teal/10"
          >
            Contact us
          </button>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link
            href="https://cloudfish.slpmicrosystems.com/"
            className="inline-flex px-6 py-3 bg-teal text-white font-semibold rounded-lg hover:bg-teal-dark"
          >
            Open CloudFish
          </Link>
          <Link
            href="/products/cloudfish#choose-plan"
            className="inline-flex px-6 py-3 bg-white border-2 border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50"
          >
            Upgrade CloudFish
          </Link>
          <Link
            href="/products/tidesync#contact-tidesync"
            className="inline-flex px-6 py-3 bg-white border-2 border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50"
          >
            Contact for TideSync
          </Link>
          <button
            onClick={handleLogout}
            className="inline-flex px-6 py-3 text-slate-600 hover:text-slate-900 font-medium"
          >
            Log out
          </button>
        </div>
      </div>

      {showContactModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => !contactSending && setShowContactModal(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-900">Contact Us</h2>
              <button
                type="button"
                onClick={() => !contactSending && setShowContactModal(false)}
                className="text-slate-500 hover:text-slate-700 text-2xl leading-none"
              >
                ×
              </button>
            </div>
            <p className="text-slate-600 text-sm mb-4">Get in touch. We&apos;ll respond as soon as possible.</p>
            <form onSubmit={handleContactSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">First name</label>
                  <input
                    type="text"
                    value={contactForm.firstName}
                    onChange={(e) => setContactForm((p) => ({ ...p, firstName: e.target.value }))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Last name</label>
                  <input
                    type="text"
                    value={contactForm.lastName}
                    onChange={(e) => setContactForm((p) => ({ ...p, lastName: e.target.value }))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm((p) => ({ ...p, email: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm((p) => ({ ...p, phone: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Message *</label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm((p) => ({ ...p, message: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  rows={4}
                  required
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={contactSending}
                  className="px-4 py-2 bg-teal text-white font-semibold rounded-lg hover:bg-teal-dark disabled:opacity-60"
                >
                  {contactSending ? 'Sending...' : 'Send message'}
                </button>
                <button
                  type="button"
                  onClick={() => !contactSending && setShowContactModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

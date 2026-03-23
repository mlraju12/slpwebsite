'use client';

import { useState, useEffect } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_CLOUDFISH_API_URL || 'https://cloudfish-backend-9d54cbd015c1.herokuapp.com/api';

export default function ContactFormModal({ isOpen, onClose, subject = 'Website inquiry', prefilledEmail = '' }) {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: prefilledEmail, phone: '', message: '' });

  useEffect(() => {
    if (isOpen) {
      setForm({ firstName: '', lastName: '', email: prefilledEmail, phone: '', message: '' });
      setStatus(null);
    }
  }, [isOpen, prefilledEmail]);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email?.trim() || !form.message?.trim()) {
      setStatus({ type: 'error', text: 'Email and message are required.' });
      return;
    }
    setSending(true);
    setStatus(null);
    try {
      const res = await fetch(`${API_BASE}/contact-public`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: form.firstName,
          last_name: form.lastName,
          email: form.email.trim(),
          phone: form.phone,
          message: form.message.trim(),
          subject: subject || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setForm({ firstName: '', lastName: '', email: '', phone: '', message: '' });
        setStatus({ type: 'success', text: "Message sent. We'll respond as soon as possible." });
        setTimeout(() => {
          onClose();
          setStatus(null);
        }, 2000);
      } else {
        setStatus({ type: 'error', text: data.error || 'Failed to send. Please try again or email us directly.' });
      }
    } catch {
      setStatus({ type: 'error', text: 'Could not connect. Please try again or email us at info@slpmicrosystems.com.' });
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={() => !sending && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
    >
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 id="contact-modal-title" className="text-xl font-bold text-slate-900">
            Contact Us
          </h2>
          <button
            type="button"
            onClick={() => !sending && onClose()}
            className="text-slate-500 hover:text-slate-700 text-2xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <p className="text-slate-600 text-sm mb-4">
          Send us a message. We&apos;ll respond as soon as possible.
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">First name</label>
              <input
                type="text"
                value={form.firstName}
                onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Last name</label>
              <input
                type="text"
                value={form.lastName}
                onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Message *</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg"
              rows={4}
              required
            />
          </div>
          {status && (
            <p className={`text-sm ${status.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
              {status.text}
            </p>
          )}
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={sending}
              className="px-4 py-2 bg-teal text-white font-semibold rounded-lg hover:bg-teal-dark disabled:opacity-60"
            >
              {sending ? 'Sending...' : 'Send message'}
            </button>
            <button
              type="button"
              onClick={() => !sending && onClose()}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

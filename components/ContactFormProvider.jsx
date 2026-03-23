'use client';

import { useState, useEffect } from 'react';
import ContactFormModal from './ContactFormModal';

const EVENT_NAME = 'open-contact-form';

export function openContactForm({ subject = 'Website inquiry', prefilledEmail = '' } = {}) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { subject, prefilledEmail } }));
  }
}

export default function ContactFormProvider() {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState('Website inquiry');
  const [prefilledEmail, setPrefilledEmail] = useState('');

  useEffect(() => {
    const handler = (e) => {
      const { subject: s = 'Website inquiry', prefilledEmail: e2 = '' } = e.detail || {};
      setSubject(s);
      setPrefilledEmail(e2);
      setOpen(true);
    };
    window.addEventListener(EVENT_NAME, handler);
    return () => window.removeEventListener(EVENT_NAME, handler);
  }, []);

  return (
    <ContactFormModal
      isOpen={open}
      onClose={() => setOpen(false)}
      subject={subject}
      prefilledEmail={prefilledEmail}
    />
  );
}

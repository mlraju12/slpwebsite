'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const CLOUDFISH_APP_URL = 'https://cloudfish.slpmicrosystems.com';

export default function FreeTrialCta({ plan, fallbackHref, fallbackLabel, className }) {
  const [hasToken, setHasToken] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setHasToken(typeof window !== 'undefined' && !!localStorage.getItem('token'));
    setMounted(true);
  }, []);

  // When logged in and free trial: go to CloudFish app to USE the trial
  const href = mounted && hasToken && plan?.planId === 'free_trial'
    ? CLOUDFISH_APP_URL
    : (fallbackHref || '/login?next=/account');
  const label = mounted && hasToken && plan?.planId === 'free_trial'
    ? 'Open CloudFish'
    : (fallbackLabel || 'Start free trial');

  const isExternal = href.startsWith('http');
  if (isExternal) {
    return <a href={href} className={className} target="_blank" rel="noopener noreferrer">{label}</a>;
  }
  return <Link href={href} className={className}>{label}</Link>;
}

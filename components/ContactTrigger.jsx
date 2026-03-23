'use client';

import { openContactForm } from './ContactFormProvider';

export default function ContactTrigger({ subject = 'Website inquiry', prefilledEmail = '', className, children, as: Tag = 'button', onClick, ...props }) {
  const handleClick = (e) => {
    if (Tag === 'a') e.preventDefault();
    openContactForm({ subject, prefilledEmail });
    onClick?.(e);
  };

  return (
    <Tag
      type={Tag === 'button' ? 'button' : undefined}
      onClick={handleClick}
      className={className}
      {...props}
    >
      {children}
    </Tag>
  );
}

import React from 'react';
import { generateWhatsAppLink } from '@/lib/whatsapp';

interface WhatsAppButtonProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  message: string;
  phoneNumber?: string;
  children?: React.ReactNode;
}

export function WhatsAppButton({ 
  message, 
  phoneNumber, 
  children, 
  className = '',
  ...props 
}: WhatsAppButtonProps) {
  const href = generateWhatsAppLink(message, phoneNumber);
  
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer" 
      className={`btn btn-whatsapp ${className}`} 
      {...props}
    >
      {children || '💬 Chat on WhatsApp'}
    </a>
  );
}

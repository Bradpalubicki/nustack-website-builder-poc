'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ClickToCallVariant = 'button' | 'link' | 'prominent';

export interface ClickToCallProps {
  /** Phone number (will be cleaned for tel: link) */
  phoneNumber: string;
  /** Display text (defaults to phoneNumber) */
  displayText?: string;
  /** Tracking label for analytics */
  trackingLabel?: string;
  /** Location identifier for multi-location tracking */
  location?: string;
  /** Display variant */
  variant?: ClickToCallVariant;
  /** Show phone icon */
  icon?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Click callback for tracking */
  onClick?: (phoneNumber: string, location?: string) => void;
}

/**
 * Clean phone number for tel: link
 */
function cleanPhoneNumber(phone: string): string {
  return phone.replace(/[^\d+]/g, '');
}

/**
 * ClickToCall Component
 *
 * Phone number with tracking for multi-location practices.
 * Essential for local SEO and conversion tracking.
 */
export function ClickToCall({
  phoneNumber,
  displayText,
  trackingLabel,
  location,
  variant = 'button',
  icon = true,
  className,
  onClick,
}: ClickToCallProps) {
  const cleanNumber = cleanPhoneNumber(phoneNumber);
  const display = displayText || phoneNumber;

  const handleClick = () => {
    // Track the click
    onClick?.(phoneNumber, location);

    // Send event to GA4 if available
    if (typeof window !== 'undefined' && 'gtag' in window) {
      const gtag = (window as unknown as { gtag: (...args: unknown[]) => void }).gtag;
      gtag('event', 'click_to_call', {
        event_category: 'engagement',
        event_label: trackingLabel || location || phoneNumber,
        phone_number: phoneNumber,
        location: location,
      });
    }
  };

  if (variant === 'link') {
    return (
      <a
        href={`tel:${cleanNumber}`}
        onClick={handleClick}
        className={cn(
          'inline-flex items-center gap-1.5 text-primary hover:underline',
          className
        )}
        itemProp="telephone"
      >
        {icon && <Phone className="h-4 w-4" />}
        <span>{display}</span>
      </a>
    );
  }

  if (variant === 'prominent') {
    return (
      <a
        href={`tel:${cleanNumber}`}
        onClick={handleClick}
        className={cn(
          'inline-flex items-center gap-3 px-6 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-lg',
          className
        )}
        itemProp="telephone"
      >
        <div className="bg-white/20 p-3 rounded-full">
          <Phone className="h-6 w-6" />
        </div>
        <div>
          <div className="text-sm opacity-90">Call Now</div>
          <div className="text-xl font-bold">{display}</div>
        </div>
      </a>
    );
  }

  // Button variant (default)
  return (
    <Button asChild className={className}>
      <a href={`tel:${cleanNumber}`} onClick={handleClick} itemProp="telephone">
        {icon && <Phone className="h-4 w-4 mr-2" />}
        {display}
      </a>
    </Button>
  );
}

export default ClickToCall;

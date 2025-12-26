'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type LastUpdatedVariant = 'badge' | 'text' | 'timestamp';

export interface LastUpdatedBadgeProps {
  /** The date to display */
  date: string | Date;
  /** Label prefix */
  label?: 'Last updated' | 'Reviewed on' | 'Published' | 'Modified';
  /** Whether to show relative time (e.g., "3 days ago") */
  showRelativeTime?: boolean;
  /** Display variant */
  variant?: LastUpdatedVariant;
  /** Additional CSS classes */
  className?: string;
  /** Threshold in days after which content is considered stale */
  staleThresholdDays?: number;
}

/**
 * Calculate the number of days between two dates
 */
function daysBetween(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay));
}

/**
 * Format a date for display
 */
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Get relative time string
 */
function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffDays = daysBetween(now, date);

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
  return `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) > 1 ? 's' : ''} ago`;
}

/**
 * LastUpdatedBadge Component
 *
 * Shows content freshness for E-E-A-T compliance.
 * Helps users and search engines understand when content was last reviewed.
 */
export function LastUpdatedBadge({
  date,
  label = 'Last updated',
  showRelativeTime = true,
  variant = 'badge',
  className,
  staleThresholdDays = 365,
}: LastUpdatedBadgeProps) {
  const dateObj = date instanceof Date ? date : new Date(date);
  const now = new Date();
  const daysSinceUpdate = daysBetween(now, dateObj);
  const isStale = daysSinceUpdate > staleThresholdDays;
  const formattedDate = formatDate(dateObj);
  const relativeTime = getRelativeTime(dateObj);

  // Generate dateModified meta for schema
  const isoDate = dateObj.toISOString();

  if (variant === 'timestamp') {
    return (
      <time
        dateTime={isoDate}
        className={cn(
          'text-xs text-muted-foreground',
          isStale && 'text-amber-600',
          className
        )}
        itemProp="dateModified"
      >
        {formattedDate}
      </time>
    );
  }

  if (variant === 'text') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 text-sm text-muted-foreground',
          isStale && 'text-amber-600',
          className
        )}
      >
        {isStale ? (
          <AlertCircle className="h-4 w-4" />
        ) : (
          <Clock className="h-4 w-4" />
        )}
        <span>
          {label}:{' '}
          <time dateTime={isoDate} itemProp="dateModified">
            {showRelativeTime ? relativeTime : formattedDate}
          </time>
        </span>
        {showRelativeTime && (
          <span className="text-muted-foreground/70">({formattedDate})</span>
        )}
      </span>
    );
  }

  // Badge variant (default)
  return (
    <Badge
      variant={isStale ? 'destructive' : 'secondary'}
      className={cn(
        'gap-1.5',
        isStale ? 'bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200' : '',
        className
      )}
    >
      {isStale ? (
        <AlertCircle className="h-3 w-3" />
      ) : (
        <Calendar className="h-3 w-3" />
      )}
      <span>
        {label}:{' '}
        <time dateTime={isoDate} itemProp="dateModified">
          {showRelativeTime ? relativeTime : formattedDate}
        </time>
      </span>
      {isStale && <span className="font-normal">(needs review)</span>}
    </Badge>
  );
}

export default LastUpdatedBadge;

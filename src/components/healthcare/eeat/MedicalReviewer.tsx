'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Calendar, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

export type MedicalReviewerVariant = 'badge' | 'card' | 'inline';

export interface MedicalReviewerProps {
  /** Reviewer's full name */
  name: string;
  /** Professional credentials (e.g., "MD, FAAMFM") */
  credentials: string;
  /** Job title (e.g., "Medical Director") */
  title?: string;
  /** Profile image URL */
  imageUrl?: string;
  /** Date the content was reviewed */
  reviewDate: string;
  /** Institutional affiliation */
  institutionalAffiliation?: string;
  /** National Provider Identifier */
  npiNumber?: string;
  /** Display variant */
  variant?: MedicalReviewerVariant;
  /** Link to reviewer's bio page */
  profileUrl?: string;
  /** Show verified badge */
  showVerifiedBadge?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Get initials from a name
 */
function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Format a date string for display
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * MedicalReviewer Component
 *
 * A prominent badge showing who reviewed the medical content.
 * Important for E-E-A-T compliance on YMYL health content.
 */
export function MedicalReviewer({
  name,
  credentials,
  title,
  imageUrl,
  reviewDate,
  institutionalAffiliation,
  npiNumber,
  variant = 'badge',
  profileUrl,
  showVerifiedBadge = true,
  className,
}: MedicalReviewerProps) {
  const formattedDate = formatDate(reviewDate);
  const initials = getInitials(name);

  const ReviewerAvatar = (
    <Avatar className={cn('border-2 border-primary/20', variant === 'card' ? 'h-16 w-16' : 'h-10 w-10')}>
      <AvatarImage src={imageUrl} alt={`${name}, ${credentials}`} />
      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
        {initials}
      </AvatarFallback>
    </Avatar>
  );

  const ReviewerInfo = (
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground uppercase tracking-wide">
          Medically Reviewed by
        </span>
        {showVerifiedBadge && (
          <ShieldCheck className="h-4 w-4 text-green-600" aria-label="Verified medical professional" />
        )}
      </div>
      <div className="flex items-center gap-2">
        {profileUrl ? (
          <a
            href={profileUrl}
            className="font-semibold text-primary hover:underline inline-flex items-center gap-1"
          >
            {name}, {credentials}
            <ExternalLink className="h-3 w-3" />
          </a>
        ) : (
          <span className="font-semibold text-foreground">
            {name}, {credentials}
          </span>
        )}
      </div>
      {title && <span className="text-sm text-muted-foreground">{title}</span>}
      {institutionalAffiliation && (
        <span className="text-sm text-muted-foreground">{institutionalAffiliation}</span>
      )}
    </div>
  );

  const DateInfo = (
    <div className="flex items-center gap-1 text-sm text-muted-foreground">
      <Calendar className="h-3 w-3" />
      <span>Last updated {formattedDate}</span>
    </div>
  );

  // Generate schema.org structured data
  const schemaData = {
    '@type': 'Person',
    name: name,
    jobTitle: title || 'Medical Reviewer',
    ...(credentials && { hasCredential: credentials }),
    ...(institutionalAffiliation && {
      worksFor: {
        '@type': 'Organization',
        name: institutionalAffiliation,
      },
    }),
    ...(npiNumber && { identifier: npiNumber }),
  };

  if (variant === 'inline') {
    return (
      <div
        className={cn('inline-flex items-center gap-2 text-sm', className)}
        itemScope
        itemType="https://schema.org/Person"
      >
        <ShieldCheck className="h-4 w-4 text-green-600" />
        <span className="text-muted-foreground">Medically reviewed by</span>
        {profileUrl ? (
          <a
            href={profileUrl}
            className="font-medium text-primary hover:underline"
            itemProp="name"
          >
            {name}, {credentials}
          </a>
        ) : (
          <span className="font-medium" itemProp="name">
            {name}, {credentials}
          </span>
        )}
        <span className="text-muted-foreground">on {formattedDate}</span>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <Card
        className={cn('border-primary/20 bg-primary/5', className)}
        itemScope
        itemType="https://schema.org/Person"
      >
        <CardContent className="p-6">
          <div className="flex gap-4">
            {ReviewerAvatar}
            <div className="flex flex-col gap-2">
              {ReviewerInfo}
              {DateInfo}
              {npiNumber && (
                <span className="text-xs text-muted-foreground">NPI: {npiNumber}</span>
              )}
            </div>
          </div>
        </CardContent>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </Card>
    );
  }

  // Default: badge variant
  return (
    <div
      className={cn(
        'inline-flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3',
        className
      )}
      itemScope
      itemType="https://schema.org/Person"
    >
      {ReviewerAvatar}
      <div className="flex flex-col gap-0.5">
        {ReviewerInfo}
        {DateInfo}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
    </div>
  );
}

export default MedicalReviewer;

/**
 * FreshnessIndicator Component
 *
 * Displays content freshness information including publish date,
 * last update, and review schedule. Critical for E-E-A-T compliance.
 */

'use client';

import React from 'react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface FreshnessIndicatorProps {
  /** Original publication date */
  publishedAt: string;
  /** Last updated date */
  updatedAt?: string;
  /** Next scheduled review date */
  nextReviewAt?: string;
  /** Author who made the update */
  updatedBy?: {
    name: string;
    url?: string;
  };
  /** Reviewer who verified the content */
  reviewedBy?: {
    name: string;
    url?: string;
    credentials?: string;
  };
  /** Update frequency commitment */
  updateFrequency?: 'monthly' | 'quarterly' | 'annually' | 'as-needed';
  /** Show detailed changelog link */
  changelogUrl?: string;
  /** Display variant */
  variant?: 'minimal' | 'standard' | 'detailed';
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatShortDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

function getFreshnessStatus(dateString: string): {
  status: 'fresh' | 'recent' | 'aging' | 'stale';
  color: string;
  label: string;
} {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 30) {
    return { status: 'fresh', color: 'green', label: 'Recently Updated' };
  }
  if (diffDays < 90) {
    return { status: 'recent', color: 'blue', label: 'Up to Date' };
  }
  if (diffDays < 180) {
    return { status: 'aging', color: 'yellow', label: 'Review Scheduled' };
  }
  return { status: 'stale', color: 'red', label: 'Update Pending' };
}

// ============================================================================
// COMPONENT
// ============================================================================

export function FreshnessIndicator({
  publishedAt,
  updatedAt,
  nextReviewAt,
  updatedBy,
  reviewedBy,
  updateFrequency,
  changelogUrl,
  variant = 'standard',
  className = '',
}: FreshnessIndicatorProps) {
  const lastDate = updatedAt || publishedAt;
  const freshness = getFreshnessStatus(lastDate);

  // Generate Schema.org markup
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    datePublished: publishedAt,
    ...(updatedAt && { dateModified: updatedAt }),
    ...(updatedBy && {
      author: {
        '@type': 'Person',
        name: updatedBy.name,
        ...(updatedBy.url && { url: updatedBy.url }),
      },
    }),
  };

  // Clock icon
  const ClockIcon = () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );

  // Calendar icon
  const CalendarIcon = () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );

  // Refresh icon
  const RefreshIcon = () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  );

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'blue':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'yellow':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'red':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  if (variant === 'minimal') {
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
        <div
          className={`flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 ${className}`}
        >
          <ClockIcon />
          <span>
            {updatedAt ? 'Updated' : 'Published'} {getRelativeTime(lastDate)}
          </span>
        </div>
      </>
    );
  }

  if (variant === 'standard') {
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
        <div
          className={`flex flex-wrap items-center gap-4 text-sm ${className}`}
        >
          {/* Publication date */}
          <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
            <CalendarIcon />
            <span>Published: {formatShortDate(publishedAt)}</span>
          </div>

          {/* Last updated */}
          {updatedAt && (
            <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
              <RefreshIcon />
              <span>Updated: {formatShortDate(updatedAt)}</span>
            </div>
          )}

          {/* Freshness badge */}
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${getColorClasses(freshness.color)}`}
          >
            {freshness.label}
          </span>
        </div>
      </>
    );
  }

  // Detailed variant
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <div
        className={`bg-gray-50 dark:bg-gray-800 rounded-lg p-4 ${className}`}
      >
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-gray-900 dark:text-white text-sm">
            Content Freshness
          </h4>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${getColorClasses(freshness.color)}`}
          >
            {freshness.label}
          </span>
        </div>

        <div className="space-y-2 text-sm">
          {/* Published */}
          <div className="flex items-center justify-between">
            <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
              <CalendarIcon />
              Published
            </span>
            <span className="text-gray-900 dark:text-white">
              {formatDate(publishedAt)}
            </span>
          </div>

          {/* Last Updated */}
          {updatedAt && (
            <div className="flex items-center justify-between">
              <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                <RefreshIcon />
                Last Updated
              </span>
              <span className="text-gray-900 dark:text-white">
                {formatDate(updatedAt)}
                {updatedBy && (
                  <span className="text-gray-500 dark:text-gray-400">
                    {' '}
                    by{' '}
                    {updatedBy.url ? (
                      <a href={updatedBy.url} className="hover:underline">
                        {updatedBy.name}
                      </a>
                    ) : (
                      updatedBy.name
                    )}
                  </span>
                )}
              </span>
            </div>
          )}

          {/* Reviewed By */}
          {reviewedBy && (
            <div className="flex items-center justify-between">
              <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Reviewed By
              </span>
              <span className="text-gray-900 dark:text-white">
                {reviewedBy.url ? (
                  <a href={reviewedBy.url} className="hover:underline">
                    {reviewedBy.name}
                  </a>
                ) : (
                  reviewedBy.name
                )}
                {reviewedBy.credentials && (
                  <span className="text-gray-500 dark:text-gray-400">
                    , {reviewedBy.credentials}
                  </span>
                )}
              </span>
            </div>
          )}

          {/* Next Review */}
          {nextReviewAt && (
            <div className="flex items-center justify-between">
              <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                <ClockIcon />
                Next Review
              </span>
              <span className="text-gray-900 dark:text-white">
                {formatDate(nextReviewAt)}
              </span>
            </div>
          )}

          {/* Update Frequency */}
          {updateFrequency && (
            <div className="flex items-center justify-between">
              <span className="text-gray-500 dark:text-gray-400">
                Review Schedule
              </span>
              <span className="text-gray-900 dark:text-white capitalize">
                {updateFrequency.replace('-', ' ')}
              </span>
            </div>
          )}
        </div>

        {/* Changelog Link */}
        {changelogUrl && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <a
              href={changelogUrl}
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
            >
              View revision history
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </div>
        )}
      </div>
    </>
  );
}

export default FreshnessIndicator;

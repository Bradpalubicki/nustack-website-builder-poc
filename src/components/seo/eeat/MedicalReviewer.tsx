/**
 * MedicalReviewer Component
 *
 * Displays medical reviewer information for healthcare content.
 * Critical for E-E-A-T compliance in YMYL health content.
 */

'use client';

import React from 'react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface MedicalCredential {
  /** Credential abbreviation (e.g., "MD", "DO") */
  abbreviation: string;
  /** Full credential name */
  fullName: string;
  /** Board certification specialty */
  specialty?: string;
  /** Certifying board */
  board?: string;
}

export interface MedicalReviewerProps {
  /** Reviewer's full name */
  name: string;
  /** Reviewer's title */
  title: string;
  /** Reviewer's organization/practice */
  organization?: string;
  /** Reviewer's photo URL */
  photoUrl?: string;
  /** Medical credentials */
  credentials: MedicalCredential[];
  /** Medical specialty */
  specialty?: string;
  /** Years of practice */
  yearsPracticing?: number;
  /** Date content was reviewed */
  reviewDate: string;
  /** Reviewer's profile page URL */
  reviewerPageUrl?: string;
  /** Short bio */
  bio?: string;
  /** NPI number (optional, for verification) */
  npiNumber?: string;
  /** Display variant */
  variant?: 'inline' | 'badge' | 'full';
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function MedicalReviewer({
  name,
  title,
  organization,
  photoUrl,
  credentials,
  specialty,
  yearsPracticing,
  reviewDate,
  reviewerPageUrl,
  bio,
  npiNumber,
  variant = 'full',
  className = '',
}: MedicalReviewerProps) {
  // Format credentials
  const credentialString = credentials.map((c) => c.abbreviation).join(', ');
  const displayName = credentialString ? `${name}, ${credentialString}` : name;

  // Format review date
  const formattedDate = new Date(reviewDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Generate Schema.org markup for medical review
  const reviewSchema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    lastReviewed: reviewDate,
    reviewedBy: {
      '@type': 'Person',
      name: name,
      jobTitle: title,
      ...(organization && {
        worksFor: { '@type': 'MedicalOrganization', name: organization },
      }),
      ...(photoUrl && { image: photoUrl }),
      ...(specialty && { medicalSpecialty: specialty }),
      ...(credentials.length > 0 && {
        hasCredential: credentials.map((c) => ({
          '@type': 'EducationalOccupationalCredential',
          credentialCategory: c.fullName,
          ...(c.board && {
            recognizedBy: { '@type': 'Organization', name: c.board },
          }),
        })),
      }),
      ...(reviewerPageUrl && { url: reviewerPageUrl }),
    },
  };

  // Checkmark icon
  const CheckIcon = () => (
    <svg
      className="w-5 h-5 text-green-600 dark:text-green-400"
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
  );

  // Shield/medical icon
  const MedicalIcon = () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  );

  if (variant === 'inline') {
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
        />
        <p className={`text-sm text-gray-600 dark:text-gray-400 ${className}`}>
          <span className="inline-flex items-center gap-1">
            <CheckIcon />
            <span>Medically reviewed by </span>
            {reviewerPageUrl ? (
              <a
                href={reviewerPageUrl}
                className="font-medium text-gray-900 dark:text-white hover:underline"
              >
                {displayName}
              </a>
            ) : (
              <span className="font-medium text-gray-900 dark:text-white">
                {displayName}
              </span>
            )}
            <span> on {formattedDate}</span>
          </span>
        </p>
      </>
    );
  }

  if (variant === 'badge') {
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
        />
        <div
          className={`inline-flex items-center gap-3 px-4 py-2 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-full ${className}`}
        >
          <div className="flex-shrink-0">
            <CheckIcon />
          </div>
          <div className="text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Reviewed by{' '}
            </span>
            {reviewerPageUrl ? (
              <a
                href={reviewerPageUrl}
                className="font-medium text-gray-900 dark:text-white hover:underline"
              >
                {displayName}
              </a>
            ) : (
              <span className="font-medium text-gray-900 dark:text-white">
                {displayName}
              </span>
            )}
          </div>
        </div>
      </>
    );
  }

  // Full variant (default)
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
      />
      <div
        className={`bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 ${className}`}
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-green-100 dark:bg-green-800 rounded-full">
            <MedicalIcon />
          </div>
          <div>
            <h3 className="font-semibold text-green-800 dark:text-green-200">
              Medically Reviewed
            </h3>
            <p className="text-sm text-green-600 dark:text-green-400">
              Last reviewed: {formattedDate}
            </p>
          </div>
        </div>

        {/* Reviewer Info */}
        <div className="flex items-start gap-4">
          {photoUrl && (
            <img
              src={photoUrl}
              alt={name}
              className="w-16 h-16 rounded-full object-cover border-2 border-green-200 dark:border-green-700"
            />
          )}
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {reviewerPageUrl ? (
                <a href={reviewerPageUrl} className="hover:underline">
                  {displayName}
                </a>
              ) : (
                displayName
              )}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {title}
              {organization && ` at ${organization}`}
            </p>
            {specialty && (
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Specialty: {specialty}
              </p>
            )}
            {yearsPracticing && (
              <p className="text-sm text-gray-500 dark:text-gray-500">
                {yearsPracticing}+ years of practice
              </p>
            )}
          </div>
        </div>

        {/* Credentials */}
        {credentials.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {credentials.map((cred, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 text-xs rounded font-medium"
                title={cred.fullName}
              >
                {cred.specialty ? `${cred.abbreviation} - ${cred.specialty}` : cred.abbreviation}
              </span>
            ))}
          </div>
        )}

        {/* Bio */}
        {bio && (
          <p className="mt-4 text-sm text-gray-700 dark:text-gray-300">{bio}</p>
        )}

        {/* Verification badge */}
        <div className="mt-4 pt-4 border-t border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
            <CheckIcon />
            <span>
              This content has been reviewed by a qualified healthcare
              professional for medical accuracy.
            </span>
          </div>
          {npiNumber && (
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
              NPI: {npiNumber}
            </p>
          )}
        </div>

        {/* View Profile Link */}
        {reviewerPageUrl && (
          <a
            href={reviewerPageUrl}
            className="mt-4 inline-flex items-center gap-1 text-sm text-green-700 hover:text-green-900 dark:text-green-400 dark:hover:text-green-200"
          >
            View reviewer profile
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
        )}
      </div>
    </>
  );
}

export default MedicalReviewer;

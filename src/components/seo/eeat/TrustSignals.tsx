/**
 * TrustSignals Component
 *
 * Displays trust indicators for E-E-A-T compliance including
 * certifications, awards, security badges, and professional affiliations.
 */

'use client';

import React from 'react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface TrustBadge {
  /** Badge type */
  type:
    | 'certification'
    | 'award'
    | 'security'
    | 'affiliation'
    | 'verification'
    | 'review';
  /** Badge name/title */
  name: string;
  /** Issuing organization */
  issuer?: string;
  /** Badge image URL */
  imageUrl?: string;
  /** Link to verification */
  verificationUrl?: string;
  /** Year obtained */
  year?: number;
  /** Description */
  description?: string;
}

export interface ReviewStats {
  /** Average rating (1-5) */
  averageRating: number;
  /** Total number of reviews */
  totalReviews: number;
  /** Review platform name */
  platform: string;
  /** Platform URL */
  platformUrl?: string;
}

export interface TrustSignalsProps {
  /** Trust badges to display */
  badges?: TrustBadge[];
  /** Review statistics */
  reviews?: ReviewStats[];
  /** Years in business */
  yearsInBusiness?: number;
  /** Number of customers/patients served */
  customerCount?: number;
  /** Professional licenses */
  licenses?: {
    type: string;
    number?: string;
    state?: string;
    verificationUrl?: string;
  }[];
  /** Insurance/bonding info */
  insurance?: {
    type: string;
    provider?: string;
  }[];
  /** BBB rating */
  bbbRating?: {
    rating: string;
    accredited: boolean;
    url?: string;
  };
  /** Security certifications */
  securityCerts?: {
    name: string;
    imageUrl?: string;
  }[];
  /** Display variant */
  variant?: 'compact' | 'grid' | 'list';
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function TrustSignals({
  badges = [],
  reviews = [],
  yearsInBusiness,
  customerCount,
  licenses = [],
  insurance = [],
  bbbRating,
  securityCerts = [],
  variant = 'grid',
  className = '',
}: TrustSignalsProps) {
  // Star rating component
  const StarRating = ({ rating }: { rating: number }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${
              i < fullStars
                ? 'text-yellow-400'
                : i === fullStars && hasHalfStar
                  ? 'text-yellow-400'
                  : 'text-gray-300 dark:text-gray-600'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  // Shield icon for security/verification
  const ShieldIcon = () => (
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
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  );

  // Check badge icon
  const CheckBadgeIcon = () => (
    <svg
      className="w-5 h-5 text-blue-600 dark:text-blue-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
      />
    </svg>
  );

  // Trophy icon for awards
  const TrophyIcon = () => (
    <svg
      className="w-5 h-5 text-yellow-600 dark:text-yellow-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
      />
    </svg>
  );

  const getBadgeIcon = (type: TrustBadge['type']) => {
    switch (type) {
      case 'security':
      case 'verification':
        return <ShieldIcon />;
      case 'award':
        return <TrophyIcon />;
      default:
        return <CheckBadgeIcon />;
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M+`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K+`;
    return `${num}+`;
  };

  if (variant === 'compact') {
    return (
      <div
        className={`flex flex-wrap items-center gap-4 ${className}`}
      >
        {yearsInBusiness && (
          <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
            <CheckBadgeIcon />
            <span>{yearsInBusiness}+ years</span>
          </div>
        )}

        {reviews.length > 0 && (
          <div className="flex items-center gap-1.5 text-sm">
            <StarRating rating={reviews[0].averageRating} />
            <span className="text-gray-600 dark:text-gray-400">
              {reviews[0].averageRating.toFixed(1)} ({formatNumber(reviews[0].totalReviews)})
            </span>
          </div>
        )}

        {bbbRating && (
          <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
            <span className="font-semibold">BBB {bbbRating.rating}</span>
            {bbbRating.accredited && (
              <ShieldIcon />
            )}
          </div>
        )}

        {licenses.length > 0 && (
          <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
            <ShieldIcon />
            <span>Licensed & Insured</span>
          </div>
        )}
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className={`space-y-4 ${className}`}>
        {/* Quick Stats */}
        <div className="flex flex-wrap gap-6">
          {yearsInBusiness && (
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {yearsInBusiness}+
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Years in Business
              </div>
            </div>
          )}

          {customerCount && (
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatNumber(customerCount)}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Customers Served
              </div>
            </div>
          )}

          {reviews.length > 0 && (
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {reviews[0].averageRating.toFixed(1)}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Average Rating
              </div>
            </div>
          )}
        </div>

        {/* Badges List */}
        {badges.length > 0 && (
          <ul className="space-y-2">
            {badges.map((badge, index) => (
              <li
                key={index}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                {badge.imageUrl ? (
                  <img
                    src={badge.imageUrl}
                    alt={badge.name}
                    className="w-8 h-8 object-contain"
                  />
                ) : (
                  getBadgeIcon(badge.type)
                )}
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">
                    {badge.name}
                  </p>
                  {badge.issuer && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {badge.issuer}
                      {badge.year && ` (${badge.year})`}
                    </p>
                  )}
                </div>
                {badge.verificationUrl && (
                  <a
                    href={badge.verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400"
                  >
                    Verify
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  // Grid variant (default)
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Stats Row */}
      {(yearsInBusiness || customerCount || reviews.length > 0) && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {yearsInBusiness && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {yearsInBusiness}+
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Years in Business
              </div>
            </div>
          )}

          {customerCount && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatNumber(customerCount)}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Customers Served
              </div>
            </div>
          )}

          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center"
            >
              <div className="flex justify-center mb-1">
                <StarRating rating={review.averageRating} />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {review.averageRating.toFixed(1)}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {formatNumber(review.totalReviews)} {review.platform} Reviews
              </div>
            </div>
          ))}

          {bbbRating && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {bbbRating.rating}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                BBB Rating
                {bbbRating.accredited && (
                  <span className="ml-1 text-green-600 dark:text-green-400">
                    ✓ Accredited
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Badges Grid */}
      {badges.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
            Certifications & Awards
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map((badge, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center"
              >
                {badge.imageUrl ? (
                  <img
                    src={badge.imageUrl}
                    alt={badge.name}
                    className="w-12 h-12 mx-auto object-contain mb-2"
                  />
                ) : (
                  <div className="flex justify-center mb-2">
                    {getBadgeIcon(badge.type)}
                  </div>
                )}
                <p className="font-medium text-gray-900 dark:text-white text-sm">
                  {badge.name}
                </p>
                {badge.issuer && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {badge.issuer}
                  </p>
                )}
                {badge.verificationUrl && (
                  <a
                    href={badge.verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-xs text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Verify →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Licenses & Insurance */}
      {(licenses.length > 0 || insurance.length > 0) && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <ShieldIcon />
            <h4 className="font-medium text-green-800 dark:text-green-200">
              Licensed & Insured
            </h4>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {licenses.map((license, index) => (
              <div key={index} className="text-sm">
                <span className="text-gray-700 dark:text-gray-300">
                  {license.type}
                </span>
                {license.number && (
                  <span className="text-gray-500 dark:text-gray-400">
                    {' '}
                    #{license.number}
                  </span>
                )}
                {license.state && (
                  <span className="text-gray-500 dark:text-gray-400">
                    {' '}
                    ({license.state})
                  </span>
                )}
                {license.verificationUrl && (
                  <a
                    href={license.verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Verify
                  </a>
                )}
              </div>
            ))}
            {insurance.map((ins, index) => (
              <div key={index} className="text-sm text-gray-700 dark:text-gray-300">
                {ins.type}
                {ins.provider && (
                  <span className="text-gray-500 dark:text-gray-400">
                    {' '}
                    via {ins.provider}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security Badges */}
      {securityCerts.length > 0 && (
        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          {securityCerts.map((cert, index) => (
            <div
              key={index}
              className="flex items-center gap-2"
              title={cert.name}
            >
              {cert.imageUrl ? (
                <img
                  src={cert.imageUrl}
                  alt={cert.name}
                  className="h-8 object-contain"
                />
              ) : (
                <>
                  <ShieldIcon />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {cert.name}
                  </span>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TrustSignals;

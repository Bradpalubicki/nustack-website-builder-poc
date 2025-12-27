/**
 * AuthorBio Component
 *
 * Displays author information with credentials for E-E-A-T compliance.
 * Includes Schema.org Person markup for search engines.
 */

'use client';

import React from 'react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface AuthorCredential {
  /** Credential abbreviation (e.g., "MD", "PhD") */
  abbreviation: string;
  /** Full credential name */
  fullName: string;
  /** Issuing organization */
  issuedBy?: string;
  /** Year obtained */
  year?: number;
}

export interface AuthorSocialLink {
  platform: 'linkedin' | 'twitter' | 'website' | 'orcid' | 'researchgate';
  url: string;
}

export interface AuthorBioProps {
  /** Author's full name */
  name: string;
  /** Author's title/role */
  title: string;
  /** Author's organization */
  organization?: string;
  /** Author's photo URL */
  photoUrl?: string;
  /** Short bio (150-300 characters recommended) */
  bio: string;
  /** Professional credentials */
  credentials?: AuthorCredential[];
  /** Years of experience */
  yearsExperience?: number;
  /** Areas of expertise */
  expertise?: string[];
  /** Social/professional links */
  socialLinks?: AuthorSocialLink[];
  /** Author's dedicated page URL */
  authorPageUrl?: string;
  /** Display style */
  variant?: 'compact' | 'full' | 'card';
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function AuthorBio({
  name,
  title,
  organization,
  photoUrl,
  bio,
  credentials = [],
  yearsExperience,
  expertise = [],
  socialLinks = [],
  authorPageUrl,
  variant = 'full',
  className = '',
}: AuthorBioProps) {
  // Format credentials for display
  const credentialString = credentials.map((c) => c.abbreviation).join(', ');
  const displayName = credentialString ? `${name}, ${credentialString}` : name;

  // Generate Schema.org Person markup
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: name,
    jobTitle: title,
    ...(organization && { worksFor: { '@type': 'Organization', name: organization } }),
    ...(photoUrl && { image: photoUrl }),
    description: bio,
    ...(credentials.length > 0 && {
      hasCredential: credentials.map((c) => ({
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: c.fullName,
        ...(c.issuedBy && { recognizedBy: { '@type': 'Organization', name: c.issuedBy } }),
      })),
    }),
    ...(expertise.length > 0 && { knowsAbout: expertise }),
    ...(socialLinks.length > 0 && {
      sameAs: socialLinks.map((l) => l.url),
    }),
    ...(authorPageUrl && { url: authorPageUrl }),
  };

  // Social link icons
  const getSocialIcon = (platform: AuthorSocialLink['platform']) => {
    switch (platform) {
      case 'linkedin':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        );
      case 'twitter':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        );
      case 'website':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
        );
      case 'orcid':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 01-.947-.947c0-.525.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.025-5.325 5.025h-3.919V7.416zm1.444 1.303v7.444h2.297c3.272 0 4.022-2.484 4.022-3.722 0-2.016-1.284-3.722-4.097-3.722h-2.222z" />
          </svg>
        );
      case 'researchgate':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19.586 0c-.818 0-1.508.19-2.073.565-.563.377-.97.936-1.213 1.68a3.193 3.193 0 00-.112.437 8.365 8.365 0 00-.078.53 9 9 0 00-.05.727c-.01.282-.013.621-.013 1.016a31.121 31.121 0 00.014 1.017 9 9 0 00.05.727 7.946 7.946 0 00.078.53c.03.152.063.3.112.437.244.743.65 1.303 1.213 1.68.565.376 1.256.564 2.073.564.818 0 1.508-.188 2.073-.564.564-.377.97-.937 1.213-1.68.05-.137.082-.285.112-.437.031-.178.06-.351.078-.53.019-.238.035-.49.05-.727.011-.281.013-.62.013-1.016 0-.397-.002-.735-.014-1.017a9 9 0 00-.049-.727 7.946 7.946 0 00-.078-.53 3.193 3.193 0 00-.112-.437c-.244-.744-.65-1.303-1.213-1.68C21.094.19 20.403 0 19.586 0zm-7.586 3.375c-3.635 0-6.591 2.956-6.591 6.59 0 3.635 2.956 6.592 6.59 6.592s6.592-2.957 6.592-6.591c0-3.635-2.957-6.591-6.591-6.591z" />
          </svg>
        );
    }
  };

  if (variant === 'compact') {
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <div className={`flex items-center gap-3 ${className}`}>
          {photoUrl && (
            <img
              src={photoUrl}
              alt={name}
              className="w-10 h-10 rounded-full object-cover"
            />
          )}
          <div>
            <p className="font-medium text-gray-900 dark:text-white text-sm">
              {authorPageUrl ? (
                <a href={authorPageUrl} className="hover:underline">
                  {displayName}
                </a>
              ) : (
                displayName
              )}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {title}
              {organization && `, ${organization}`}
            </p>
          </div>
        </div>
      </>
    );
  }

  if (variant === 'card') {
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <div
          className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${className}`}
        >
          <div className="flex items-start gap-4">
            {photoUrl && (
              <img
                src={photoUrl}
                alt={name}
                className="w-20 h-20 rounded-full object-cover flex-shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                {authorPageUrl ? (
                  <a href={authorPageUrl} className="hover:underline">
                    {displayName}
                  </a>
                ) : (
                  displayName
                )}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {title}
                {organization && ` at ${organization}`}
              </p>
              {yearsExperience && (
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                  {yearsExperience}+ years of experience
                </p>
              )}
            </div>
          </div>

          <p className="mt-4 text-gray-700 dark:text-gray-300 text-sm">{bio}</p>

          {expertise.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                Areas of Expertise
              </p>
              <div className="flex flex-wrap gap-2">
                {expertise.map((area, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          )}

          {socialLinks.length > 0 && (
            <div className="mt-4 flex gap-3">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  aria-label={`${name} on ${link.platform}`}
                >
                  {getSocialIcon(link.platform)}
                </a>
              ))}
            </div>
          )}
        </div>
      </>
    );
  }

  // Full variant (default)
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <div
        className={`border-t border-gray-200 dark:border-gray-700 pt-6 mt-8 ${className}`}
      >
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
          About the Author
        </p>

        <div className="flex items-start gap-4">
          {photoUrl && (
            <img
              src={photoUrl}
              alt={name}
              className="w-16 h-16 rounded-full object-cover flex-shrink-0"
            />
          )}
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {authorPageUrl ? (
                <a href={authorPageUrl} className="hover:underline">
                  {displayName}
                </a>
              ) : (
                displayName
              )}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {title}
              {organization && ` at ${organization}`}
            </p>

            <p className="mt-2 text-gray-700 dark:text-gray-300 text-sm">{bio}</p>

            {credentials.length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  <span className="font-medium">Credentials:</span>{' '}
                  {credentials.map((c) => c.fullName).join(', ')}
                </p>
              </div>
            )}

            {socialLinks.length > 0 && (
              <div className="mt-3 flex gap-3">
                {socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    aria-label={`${name} on ${link.platform}`}
                  >
                    {getSocialIcon(link.platform)}
                  </a>
                ))}
              </div>
            )}

            {authorPageUrl && (
              <a
                href={authorPageUrl}
                className="mt-3 inline-block text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                View full profile →
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default AuthorBio;

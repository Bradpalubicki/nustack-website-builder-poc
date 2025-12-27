/**
 * AuthorPage Component
 *
 * Full author profile page template for E-E-A-T compliance.
 * Displays comprehensive author information with Schema.org markup.
 */

'use client';

import React from 'react';
import type { AuthorCredential, AuthorSocialLink } from './AuthorBio';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface AuthorArticle {
  /** Article title */
  title: string;
  /** Article URL */
  url: string;
  /** Publication date */
  publishedAt: string;
  /** Article excerpt */
  excerpt?: string;
  /** Article image */
  imageUrl?: string;
  /** Category/topic */
  category?: string;
}

export interface AuthorAward {
  /** Award name */
  name: string;
  /** Awarding organization */
  organization: string;
  /** Year received */
  year: number;
  /** Description */
  description?: string;
}

export interface AuthorEducation {
  /** Degree name */
  degree: string;
  /** Field of study */
  field: string;
  /** Institution name */
  institution: string;
  /** Year completed */
  year?: number;
}

export interface AuthorPageProps {
  /** Author's full name */
  name: string;
  /** Author's title/role */
  title: string;
  /** Author's organization */
  organization?: string;
  /** Author's photo URL */
  photoUrl?: string;
  /** Full bio */
  bio: string;
  /** Short tagline */
  tagline?: string;
  /** Professional credentials */
  credentials?: AuthorCredential[];
  /** Years of experience */
  yearsExperience?: number;
  /** Areas of expertise */
  expertise?: string[];
  /** Social/professional links */
  socialLinks?: AuthorSocialLink[];
  /** Education history */
  education?: AuthorEducation[];
  /** Awards and recognition */
  awards?: AuthorAward[];
  /** Published articles */
  articles?: AuthorArticle[];
  /** Speaking engagements or media appearances */
  mediaAppearances?: string[];
  /** Professional affiliations */
  affiliations?: string[];
  /** Contact email (optional, for display) */
  contactEmail?: string;
  /** Canonical URL for this page */
  canonicalUrl?: string;
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function AuthorPage({
  name,
  title,
  organization,
  photoUrl,
  bio,
  tagline,
  credentials = [],
  yearsExperience,
  expertise = [],
  socialLinks = [],
  education = [],
  awards = [],
  articles = [],
  mediaAppearances = [],
  affiliations = [],
  contactEmail,
  canonicalUrl,
  className = '',
}: AuthorPageProps) {
  // Format credentials for display
  const credentialString = credentials.map((c) => c.abbreviation).join(', ');
  const displayName = credentialString ? `${name}, ${credentialString}` : name;

  // Generate Schema.org Person markup
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: name,
    jobTitle: title,
    ...(organization && {
      worksFor: { '@type': 'Organization', name: organization },
    }),
    ...(photoUrl && { image: photoUrl }),
    description: bio,
    ...(tagline && { disambiguatingDescription: tagline }),
    ...(credentials.length > 0 && {
      hasCredential: credentials.map((c) => ({
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: c.fullName,
        ...(c.issuedBy && {
          recognizedBy: { '@type': 'Organization', name: c.issuedBy },
        }),
      })),
    }),
    ...(expertise.length > 0 && { knowsAbout: expertise }),
    ...(socialLinks.length > 0 && { sameAs: socialLinks.map((l) => l.url) }),
    ...(education.length > 0 && {
      alumniOf: education.map((e) => ({
        '@type': 'EducationalOrganization',
        name: e.institution,
      })),
    }),
    ...(awards.length > 0 && {
      award: awards.map((a) => a.name),
    }),
    ...(affiliations.length > 0 && {
      memberOf: affiliations.map((a) => ({
        '@type': 'Organization',
        name: a,
      })),
    }),
    ...(contactEmail && { email: contactEmail }),
    ...(canonicalUrl && { url: canonicalUrl }),
  };

  // Social link icons (same as AuthorBio)
  const getSocialIcon = (platform: AuthorSocialLink['platform']) => {
    switch (platform) {
      case 'linkedin':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        );
      case 'twitter':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        );
      case 'website':
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
            />
          </svg>
        );
      case 'orcid':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 01-.947-.947c0-.525.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.025-5.325 5.025h-3.919V7.416zm1.444 1.303v7.444h2.297c3.272 0 4.022-2.484 4.022-3.722 0-2.016-1.284-3.722-4.097-3.722h-2.222z" />
          </svg>
        );
      case 'researchgate':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19.586 0c-.818 0-1.508.19-2.073.565-.563.377-.97.936-1.213 1.68a3.193 3.193 0 00-.112.437 8.365 8.365 0 00-.078.53 9 9 0 00-.05.727c-.01.282-.013.621-.013 1.016a31.121 31.121 0 00.014 1.017 9 9 0 00.05.727 7.946 7.946 0 00.078.53c.03.152.063.3.112.437.244.743.65 1.303 1.213 1.68.565.376 1.256.564 2.073.564.818 0 1.508-.188 2.073-.564.564-.377.97-.937 1.213-1.68.05-.137.082-.285.112-.437.031-.178.06-.351.078-.53.019-.238.035-.49.05-.727.011-.281.013-.62.013-1.016 0-.397-.002-.735-.014-1.017a9 9 0 00-.049-.727 7.946 7.946 0 00-.078-.53 3.193 3.193 0 00-.112-.437c-.244-.744-.65-1.303-1.213-1.68C21.094.19 20.403 0 19.586 0zm-7.586 3.375c-3.635 0-6.591 2.956-6.591 6.59 0 3.635 2.956 6.592 6.59 6.592s6.592-2.957 6.592-6.591c0-3.635-2.957-6.591-6.591-6.591z" />
          </svg>
        );
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      <div className={`max-w-4xl mx-auto ${className}`}>
        {/* Header Section */}
        <header className="mb-12">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {photoUrl && (
              <img
                src={photoUrl}
                alt={name}
                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover shadow-lg"
              />
            )}
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                {displayName}
              </h1>
              <p className="mt-2 text-xl text-gray-600 dark:text-gray-400">
                {title}
                {organization && ` at ${organization}`}
              </p>
              {tagline && (
                <p className="mt-2 text-gray-500 dark:text-gray-500 italic">
                  {tagline}
                </p>
              )}
              {yearsExperience && (
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {yearsExperience}+ years of experience
                </p>
              )}

              {/* Social Links */}
              {socialLinks.length > 0 && (
                <div className="mt-4 flex justify-center md:justify-start gap-4">
                  {socialLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                      aria-label={`${name} on ${link.platform}`}
                    >
                      {getSocialIcon(link.platform)}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* About Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            About
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
              {bio}
            </p>
          </div>
        </section>

        {/* Expertise Section */}
        {expertise.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Areas of Expertise
            </h2>
            <div className="flex flex-wrap gap-2">
              {expertise.map((area, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                >
                  {area}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Credentials Section */}
        {credentials.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Credentials & Certifications
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {credentials.map((credential, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {credential.fullName} ({credential.abbreviation})
                  </p>
                  {credential.issuedBy && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {credential.issuedBy}
                      {credential.year && `, ${credential.year}`}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education Section */}
        {education.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Education
            </h2>
            <div className="space-y-4">
              {education.map((edu, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-gray-500 dark:text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {edu.degree} in {edu.field}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {edu.institution}
                      {edu.year && ` (${edu.year})`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Awards Section */}
        {awards.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Awards & Recognition
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {awards.map((award, index) => (
                <div
                  key={index}
                  className="p-4 border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg"
                >
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {award.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {award.organization}, {award.year}
                  </p>
                  {award.description && (
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
                      {award.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Affiliations Section */}
        {affiliations.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Professional Affiliations
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              {affiliations.map((affiliation, index) => (
                <li key={index}>{affiliation}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Recent Articles Section */}
        {articles.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Recent Articles
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {articles.slice(0, 6).map((article, index) => (
                <a
                  key={index}
                  href={article.url}
                  className="group block p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {article.imageUrl && (
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-40 object-cover rounded-lg mb-3"
                    />
                  )}
                  {article.category && (
                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                      {article.category}
                    </span>
                  )}
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 mt-1">
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {article.excerpt}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                    {new Date(article.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Contact Section */}
        {contactEmail && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Contact
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              For professional inquiries, please reach out at{' '}
              <a
                href={`mailto:${contactEmail}`}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {contactEmail}
              </a>
            </p>
          </section>
        )}
      </div>
    </>
  );
}

export default AuthorPage;

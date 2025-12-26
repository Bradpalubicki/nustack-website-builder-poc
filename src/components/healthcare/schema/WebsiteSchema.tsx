'use client';

import React from 'react';

export interface WebsiteSchemaProps {
  /** Website name */
  name: string;
  /** Website URL */
  url: string;
  /** Search action configuration */
  potentialAction?: {
    target: string;
    queryInput: string;
  };
  /** Website description */
  description?: string;
  /** Publisher organization */
  publisher?: {
    name: string;
    logo?: string;
  };
}

/**
 * WebsiteSchema Component
 *
 * Generates JSON-LD structured data for WebSite schema.
 * Use on homepage to define site-wide search functionality.
 */
export function WebsiteSchema({
  name,
  url,
  potentialAction,
  description,
  publisher,
}: WebsiteSchemaProps) {
  const schemaAction = potentialAction
    ? {
        '@type': 'SearchAction',
        target: potentialAction.target,
        'query-input': potentialAction.queryInput,
      }
    : undefined;

  const schemaPublisher = publisher
    ? {
        '@type': 'Organization',
        name: publisher.name,
        ...(publisher.logo && {
          logo: {
            '@type': 'ImageObject',
            url: publisher.logo,
          },
        }),
      }
    : undefined;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
    ...(schemaAction && { potentialAction: schemaAction }),
    ...(description && { description }),
    ...(schemaPublisher && { publisher: schemaPublisher }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
}

export default WebsiteSchema;

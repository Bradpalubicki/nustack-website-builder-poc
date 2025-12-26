/**
 * PersonSchema Component
 *
 * Renders JSON-LD structured data for people (authors, team members).
 * Useful for author pages and team member profiles.
 */

import React from 'react';
import {
  generatePersonSchema,
  serializeSchema,
} from '@/lib/seo/schema/generators';
import { validateSchema } from '@/lib/seo/schema/validator';
import type { TeamMember } from '@/lib/seo/schema/types';

export interface PersonSchemaProps {
  /** Team member data */
  member: TeamMember;
  /** Number of articles authored (optional, for author pages) */
  articleCount?: number;
  /** Enable validation in development */
  validateInDev?: boolean;
}

/**
 * PersonSchema Component
 *
 * Generates and renders Person structured data.
 * Includes credentials, education, and social links.
 */
export function PersonSchema({
  member,
  articleCount,
  validateInDev = true,
}: PersonSchemaProps): React.ReactElement | null {
  // Generate the schema
  const baseSchema = generatePersonSchema(member);

  // Add @context for standalone use
  const schema = {
    '@context': 'https://schema.org' as const,
    ...baseSchema,
  };

  // Validate in development
  if (validateInDev && process.env.NODE_ENV === 'development') {
    const validation = validateSchema(schema as unknown as Record<string, unknown>);
    if (!validation.valid) {
      console.warn('[PersonSchema] Validation errors:', validation.errors);
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: serializeSchema(schema),
      }}
    />
  );
}

export default PersonSchema;

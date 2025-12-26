/**
 * OrganizationSchema Component
 *
 * Renders JSON-LD structured data for organizations.
 * Suitable for homepage and about pages.
 */

import React from 'react';
import {
  generateOrganizationSchema,
  serializeSchema,
} from '@/lib/seo/schema/generators';
import { validateSchema } from '@/lib/seo/schema/validator';
import type { BusinessProfile } from '@/lib/seo/schema/types';

export interface OrganizationSchemaProps {
  /** Business profile data */
  business: BusinessProfile;
  /** Enable validation in development */
  validateInDev?: boolean;
}

/**
 * OrganizationSchema Component
 *
 * Generates and renders Organization structured data.
 * Uses MedicalOrganization for healthcare businesses.
 */
export function OrganizationSchema({
  business,
  validateInDev = true,
}: OrganizationSchemaProps): React.ReactElement | null {
  // Generate the schema
  const schema = generateOrganizationSchema(business);

  // Validate in development
  if (validateInDev && process.env.NODE_ENV === 'development') {
    const validation = validateSchema(schema as unknown as Record<string, unknown>);
    if (!validation.valid) {
      console.warn('[OrganizationSchema] Validation errors:', validation.errors);
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

export default OrganizationSchema;

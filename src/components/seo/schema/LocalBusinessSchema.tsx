/**
 * LocalBusinessSchema Component
 *
 * Renders JSON-LD structured data for local businesses.
 * Uses the appropriate Schema.org type based on industry.
 */

import React from 'react';
import {
  generateLocalBusinessSchema,
  serializeSchema,
} from '@/lib/seo/schema/generators';
import { validateSchema } from '@/lib/seo/schema/validator';
import type { BusinessProfile, Location } from '@/lib/seo/schema/types';

export interface LocalBusinessSchemaProps {
  /** Business profile data */
  business: BusinessProfile;
  /** Location data */
  location: Location;
  /** Review aggregate (optional) */
  reviews?: {
    rating: number;
    count: number;
  };
  /** Enable validation in development */
  validateInDev?: boolean;
}

/**
 * LocalBusinessSchema Component
 *
 * Generates and renders LocalBusiness structured data.
 * Automatically selects the most specific @type based on industry.
 */
export function LocalBusinessSchema({
  business,
  location,
  reviews,
  validateInDev = true,
}: LocalBusinessSchemaProps): React.ReactElement | null {
  // Generate the schema
  const schema = generateLocalBusinessSchema(business, location, reviews);

  // Validate in development
  if (validateInDev && process.env.NODE_ENV === 'development') {
    const validation = validateSchema(schema as unknown as Record<string, unknown>);
    if (!validation.valid) {
      console.warn('[LocalBusinessSchema] Validation errors:', validation.errors);
    }
    if (validation.warnings.length > 0) {
      console.info('[LocalBusinessSchema] Validation warnings:', validation.warnings);
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

export default LocalBusinessSchema;

/**
 * WebsiteSchema Component
 *
 * Renders JSON-LD structured data for the website.
 * Enables sitelinks search box if search URL is provided.
 */

import React from 'react';
import {
  generateWebsiteSchema,
  serializeSchema,
} from '@/lib/seo/schema/generators';
import { validateSchema } from '@/lib/seo/schema/validator';
import type { BusinessProfile } from '@/lib/seo/schema/types';

export interface WebsiteSchemaProps {
  /** Business profile data */
  business: BusinessProfile;
  /** Search URL template for enabling SearchAction
   *  Use {search_term_string} as placeholder for query
   *  Example: "https://example.com/search?q={search_term_string}"
   */
  searchUrl?: string;
  /** Enable validation in development */
  validateInDev?: boolean;
}

/**
 * WebsiteSchema Component
 *
 * Generates and renders WebSite structured data.
 * Includes potentialAction for site search if searchUrl is provided.
 */
export function WebsiteSchema({
  business,
  searchUrl,
  validateInDev = true,
}: WebsiteSchemaProps): React.ReactElement | null {
  // Generate the schema
  const schema = generateWebsiteSchema(business, searchUrl);

  // Validate in development
  if (validateInDev && process.env.NODE_ENV === 'development') {
    const validation = validateSchema(schema as unknown as Record<string, unknown>);
    if (!validation.valid) {
      console.warn('[WebsiteSchema] Validation errors:', validation.errors);
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

export default WebsiteSchema;

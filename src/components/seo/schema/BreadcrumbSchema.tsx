/**
 * BreadcrumbSchema Component
 *
 * Renders JSON-LD structured data for breadcrumb navigation.
 * Helps search engines understand site structure.
 */

import React from 'react';
import {
  generateBreadcrumbSchema,
  generateBreadcrumbSchemaFromPath,
  serializeSchema,
} from '@/lib/seo/schema/generators';
import { validateSchema } from '@/lib/seo/schema/validator';

export interface BreadcrumbItem {
  /** Display name */
  name: string;
  /** URL for the breadcrumb item */
  url: string;
}

export interface BreadcrumbSchemaProps {
  /** Breadcrumb items (if provided, used directly) */
  items?: BreadcrumbItem[];
  /** Base URL for generating from path */
  baseUrl?: string;
  /** Current path for auto-generation */
  path?: string;
  /** Label overrides for path segments */
  labels?: Record<string, string>;
  /** Enable validation in development */
  validateInDev?: boolean;
}

/**
 * BreadcrumbSchema Component
 *
 * Generates and renders BreadcrumbList structured data.
 * Can either use provided items or auto-generate from URL path.
 */
export function BreadcrumbSchema({
  items,
  baseUrl,
  path,
  labels,
  validateInDev = true,
}: BreadcrumbSchemaProps): React.ReactElement | null {
  // Generate schema based on input
  let schema;

  if (items && items.length > 0) {
    schema = generateBreadcrumbSchema(items);
  } else if (baseUrl && path) {
    schema = generateBreadcrumbSchemaFromPath(baseUrl, path, labels);
  } else {
    // No valid input
    return null;
  }

  // Validate in development
  if (validateInDev && process.env.NODE_ENV === 'development') {
    const validation = validateSchema(schema as unknown as Record<string, unknown>);
    if (!validation.valid) {
      console.warn('[BreadcrumbSchema] Validation errors:', validation.errors);
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

export default BreadcrumbSchema;

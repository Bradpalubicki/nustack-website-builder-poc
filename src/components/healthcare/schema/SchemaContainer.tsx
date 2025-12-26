'use client';

import React, { useMemo } from 'react';

export interface SchemaContainerProps {
  /** Schema data objects to render */
  schemas: Array<Record<string, unknown>>;
  /** Whether to combine schemas into a single script tag */
  combine?: boolean;
  /** Enable validation warnings in development */
  validate?: boolean;
}

/**
 * Validates a schema object for required fields
 */
function validateSchema(schema: Record<string, unknown>): string[] {
  const warnings: string[] = [];

  if (!schema['@type']) {
    warnings.push('Schema missing required @type property');
  }

  if (!schema['@context'] && schema['@type'] !== 'ListItem' && schema['@type'] !== 'Question') {
    warnings.push('Schema missing @context property (should be https://schema.org)');
  }

  // Type-specific validation
  const schemaType = schema['@type'] as string;

  if (schemaType === 'LocalBusiness' || schemaType === 'MedicalBusiness') {
    if (!schema.name) warnings.push(`${schemaType} missing required 'name' property`);
    if (!schema.address) warnings.push(`${schemaType} missing required 'address' property`);
    if (!schema.telephone) warnings.push(`${schemaType} missing 'telephone' property`);
  }

  if (schemaType === 'Article') {
    if (!schema.headline) warnings.push('Article missing required \'headline\' property');
    if (!schema.author) warnings.push('Article missing required \'author\' property');
    if (!schema.datePublished) warnings.push('Article missing required \'datePublished\' property');
  }

  if (schemaType === 'FAQPage') {
    if (!schema.mainEntity || !Array.isArray(schema.mainEntity)) {
      warnings.push('FAQPage missing required \'mainEntity\' array');
    }
  }

  return warnings;
}

/**
 * Removes duplicate schemas based on @type and identifying properties
 */
function deduplicateSchemas(
  schemas: Array<Record<string, unknown>>
): Array<Record<string, unknown>> {
  const seen = new Map<string, Record<string, unknown>>();

  for (const schema of schemas) {
    const type = schema['@type'] as string;
    const name = schema.name as string | undefined;
    const url = schema.url as string | undefined;

    // Create a unique key based on type and identifying properties
    const key = `${type}:${name || ''}:${url || ''}`;

    // Keep the more complete version (one with more properties)
    const existing = seen.get(key);
    if (!existing || Object.keys(schema).length > Object.keys(existing).length) {
      seen.set(key, schema);
    }
  }

  return Array.from(seen.values());
}

/**
 * SchemaContainer Component
 *
 * A wrapper component that:
 * - Deduplicates schema entries
 * - Validates schema before rendering (in development)
 * - Combines multiple schemas on a page
 * - Adds @context automatically if missing
 */
export function SchemaContainer({
  schemas,
  combine = false,
  validate = process.env.NODE_ENV === 'development',
}: SchemaContainerProps) {
  const processedSchemas = useMemo(() => {
    // Add @context if missing
    const withContext = schemas.map((schema) => ({
      '@context': 'https://schema.org',
      ...schema,
    }));

    // Deduplicate
    const deduplicated = deduplicateSchemas(withContext);

    // Validate in development
    if (validate) {
      deduplicated.forEach((schema, index) => {
        const warnings = validateSchema(schema);
        if (warnings.length > 0) {
          console.warn(`Schema validation warnings for schema ${index}:`, warnings);
        }
      });
    }

    return deduplicated;
  }, [schemas, validate]);

  if (processedSchemas.length === 0) {
    return null;
  }

  // Combine all schemas into a single @graph structure
  if (combine) {
    const combinedSchema = {
      '@context': 'https://schema.org',
      '@graph': processedSchemas.map(({ '@context': _, ...rest }) => rest),
    };

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedSchema, null, 2) }}
      />
    );
  }

  // Render each schema as a separate script tag
  return (
    <>
      {processedSchemas.map((schema, index) => (
        <script
          key={`schema-${index}-${schema['@type']}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
        />
      ))}
    </>
  );
}

export default SchemaContainer;

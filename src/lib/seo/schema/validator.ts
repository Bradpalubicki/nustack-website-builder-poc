/**
 * Schema.org Validation Utilities
 *
 * Validates JSON-LD schema for required fields, proper formats,
 * and common issues before rendering.
 *
 * @see https://developers.google.com/search/docs/appearance/structured-data
 * @see https://search.google.com/test/rich-results
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/** Validation result */
export interface ValidationResult {
  /** Whether the schema is valid */
  valid: boolean;
  /** Critical errors that will prevent rich results */
  errors: ValidationIssue[];
  /** Warnings that may affect rich result quality */
  warnings: ValidationIssue[];
  /** Informational suggestions */
  info: ValidationIssue[];
}

/** Individual validation issue */
export interface ValidationIssue {
  /** Error code */
  code: string;
  /** Human-readable message */
  message: string;
  /** Path to the problematic field */
  path?: string;
  /** The problematic value */
  value?: unknown;
  /** Suggested fix */
  suggestion?: string;
}

/** Schema type identifier */
type SchemaType = string;

// ============================================================================
// REQUIRED FIELDS BY SCHEMA TYPE
// ============================================================================

/**
 * Required fields for each Schema.org type
 *
 * Based on Google's structured data requirements for rich results.
 * @see https://developers.google.com/search/docs/appearance/structured-data
 */
const REQUIRED_FIELDS: Record<SchemaType, string[]> = {
  // Local Business types
  LocalBusiness: ['name', 'address', 'telephone'],
  MedicalClinic: ['name', 'address', 'telephone'],
  MedicalBusiness: ['name', 'address', 'telephone'],
  Restaurant: ['name', 'address', 'telephone'],
  LegalService: ['name', 'address', 'telephone'],
  Dentist: ['name', 'address', 'telephone'],
  Hotel: ['name', 'address'],

  // Content types
  Article: ['headline', 'image', 'datePublished', 'author'],
  BlogPosting: ['headline', 'image', 'datePublished', 'author'],
  NewsArticle: ['headline', 'image', 'datePublished', 'author'],

  // Product
  Product: ['name', 'image', 'offers'],

  // Organization
  Organization: ['name', 'url'],
  MedicalOrganization: ['name', 'url'],

  // Person
  Person: ['name'],

  // FAQ
  FAQPage: ['mainEntity'],

  // Breadcrumb
  BreadcrumbList: ['itemListElement'],

  // Website
  WebSite: ['name', 'url'],

  // Service
  Service: ['name', 'provider'],
};

/**
 * Recommended (but not required) fields for better SEO
 */
const RECOMMENDED_FIELDS: Record<SchemaType, string[]> = {
  LocalBusiness: ['image', 'description', 'openingHoursSpecification', 'geo', 'priceRange', 'aggregateRating'],
  Article: ['dateModified', 'publisher', 'description', 'wordCount'],
  Product: ['description', 'brand', 'aggregateRating', 'review'],
  Organization: ['logo', 'description', 'contactPoint', 'sameAs'],
  Person: ['image', 'jobTitle', 'description', 'sameAs'],
  FAQPage: [],
  BreadcrumbList: [],
  WebSite: ['description', 'potentialAction'],
  Service: ['description', 'offers', 'areaServed'],
};

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validate a schema object
 *
 * @param schema - The schema object to validate
 * @param type - Optional type override (otherwise uses @type)
 * @returns Validation result with errors and warnings
 */
export function validateSchema(
  schema: Record<string, unknown>,
  type?: string
): ValidationResult {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];
  const info: ValidationIssue[] = [];

  // Get schema type
  const schemaType = type || (schema['@type'] as string);

  if (!schemaType) {
    errors.push({
      code: 'MISSING_TYPE',
      message: 'Schema must have an @type property',
      path: '@type',
    });
    return { valid: false, errors, warnings, info };
  }

  // Check @context
  if (!schema['@context']) {
    warnings.push({
      code: 'MISSING_CONTEXT',
      message: 'Schema should have @context set to "https://schema.org"',
      path: '@context',
      suggestion: 'Add "@context": "https://schema.org"',
    });
  } else if (schema['@context'] !== 'https://schema.org') {
    warnings.push({
      code: 'INVALID_CONTEXT',
      message: '@context should be "https://schema.org"',
      path: '@context',
      value: schema['@context'],
    });
  }

  // Check required fields
  const requiredFields = REQUIRED_FIELDS[schemaType] || [];
  for (const field of requiredFields) {
    if (!hasField(schema, field)) {
      errors.push({
        code: 'MISSING_REQUIRED_FIELD',
        message: `Required field "${field}" is missing for ${schemaType}`,
        path: field,
      });
    } else {
      // Validate the field value
      const fieldErrors = validateFieldValue(schema, field, schemaType);
      errors.push(...fieldErrors);
    }
  }

  // Check recommended fields
  const recommendedFields = RECOMMENDED_FIELDS[schemaType] || [];
  for (const field of recommendedFields) {
    if (!hasField(schema, field)) {
      info.push({
        code: 'MISSING_RECOMMENDED_FIELD',
        message: `Recommended field "${field}" is missing`,
        path: field,
        suggestion: `Adding "${field}" can improve rich result quality`,
      });
    }
  }

  // Validate URLs
  validateUrls(schema, errors, warnings);

  // Validate dates
  validateDates(schema, errors, warnings);

  // Validate nested schemas
  validateNestedSchemas(schema, errors, warnings, info);

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    info,
  };
}

/**
 * Validate multiple schemas (e.g., for a page with multiple schema blocks)
 */
export function validateSchemas(
  schemas: Record<string, unknown>[]
): ValidationResult {
  const allErrors: ValidationIssue[] = [];
  const allWarnings: ValidationIssue[] = [];
  const allInfo: ValidationIssue[] = [];

  schemas.forEach((schema, index) => {
    const result = validateSchema(schema);

    // Add index to paths for identification
    result.errors.forEach((e) => {
      e.path = `[${index}].${e.path || ''}`;
      allErrors.push(e);
    });

    result.warnings.forEach((w) => {
      w.path = `[${index}].${w.path || ''}`;
      allWarnings.push(w);
    });

    result.info.forEach((i) => {
      i.path = `[${index}].${i.path || ''}`;
      allInfo.push(i);
    });
  });

  return {
    valid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
    info: allInfo,
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if schema has a field (handles nested paths)
 */
function hasField(schema: Record<string, unknown>, field: string): boolean {
  const parts = field.split('.');
  let current: unknown = schema;

  for (const part of parts) {
    if (current === null || current === undefined) {
      return false;
    }
    if (typeof current !== 'object') {
      return false;
    }
    current = (current as Record<string, unknown>)[part];
  }

  return current !== null && current !== undefined && current !== '';
}

/**
 * Validate a specific field value
 */
function validateFieldValue(
  schema: Record<string, unknown>,
  field: string,
  schemaType: string
): ValidationIssue[] {
  const errors: ValidationIssue[] = [];
  const value = schema[field];

  // Check for empty strings
  if (value === '') {
    errors.push({
      code: 'EMPTY_FIELD',
      message: `Field "${field}" cannot be empty`,
      path: field,
      value,
    });
  }

  // Special validations by field
  switch (field) {
    case 'telephone':
      if (typeof value === 'string' && !isValidPhoneNumber(value)) {
        errors.push({
          code: 'INVALID_PHONE',
          message: 'Telephone number format may not be recognized',
          path: field,
          value,
          suggestion: 'Use format: +1-XXX-XXX-XXXX or (XXX) XXX-XXXX',
        });
      }
      break;

    case 'email':
      if (typeof value === 'string' && !isValidEmail(value)) {
        errors.push({
          code: 'INVALID_EMAIL',
          message: 'Email address is not valid',
          path: field,
          value,
        });
      }
      break;

    case 'priceRange':
      if (typeof value === 'string' && !isValidPriceRange(value)) {
        errors.push({
          code: 'INVALID_PRICE_RANGE',
          message: 'Price range should use $ symbols (e.g., "$", "$$", "$$$")',
          path: field,
          value,
        });
      }
      break;

    case 'ratingValue':
      if (typeof value === 'number' && (value < 0 || value > 5)) {
        errors.push({
          code: 'INVALID_RATING',
          message: 'Rating value should be between 0 and 5',
          path: field,
          value,
        });
      }
      break;
  }

  return errors;
}

/**
 * Validate all URL fields in schema
 */
function validateUrls(
  schema: Record<string, unknown>,
  errors: ValidationIssue[],
  warnings: ValidationIssue[]
): void {
  const urlFields = ['url', '@id', 'image', 'logo', 'mainEntityOfPage'];

  for (const field of urlFields) {
    const value = schema[field];
    if (!value) continue;

    const url = typeof value === 'object' && value !== null
      ? (value as Record<string, unknown>).url as string
      : value as string;

    if (typeof url === 'string') {
      if (!isAbsoluteUrl(url) && field !== 'image') {
        warnings.push({
          code: 'RELATIVE_URL',
          message: `URL in "${field}" should be absolute`,
          path: field,
          value: url,
          suggestion: 'Use full URL including https://',
        });
      }

      if (url.startsWith('http://')) {
        warnings.push({
          code: 'INSECURE_URL',
          message: `URL in "${field}" should use HTTPS`,
          path: field,
          value: url,
        });
      }
    }
  }
}

/**
 * Validate all date fields in schema
 */
function validateDates(
  schema: Record<string, unknown>,
  errors: ValidationIssue[],
  warnings: ValidationIssue[]
): void {
  const dateFields = ['datePublished', 'dateModified', 'foundingDate', 'validFrom', 'validThrough'];

  for (const field of dateFields) {
    const value = schema[field];
    if (!value || typeof value !== 'string') continue;

    if (!isValidISO8601(value)) {
      errors.push({
        code: 'INVALID_DATE_FORMAT',
        message: `Date in "${field}" must be in ISO 8601 format`,
        path: field,
        value,
        suggestion: 'Use format: YYYY-MM-DD or YYYY-MM-DDTHH:mm:ssZ',
      });
    }
  }

  // Check that dateModified >= datePublished
  if (schema.datePublished && schema.dateModified) {
    const published = new Date(schema.datePublished as string);
    const modified = new Date(schema.dateModified as string);

    if (modified < published) {
      warnings.push({
        code: 'DATE_ORDER',
        message: 'dateModified should not be before datePublished',
        path: 'dateModified',
      });
    }
  }
}

/**
 * Validate nested schema objects
 */
function validateNestedSchemas(
  schema: Record<string, unknown>,
  errors: ValidationIssue[],
  warnings: ValidationIssue[],
  info: ValidationIssue[]
): void {
  const nestedFields = ['author', 'publisher', 'address', 'geo', 'aggregateRating', 'review', 'provider'];

  for (const field of nestedFields) {
    const value = schema[field];
    if (!value || typeof value !== 'object') continue;

    // Check for @type in nested objects
    const nested = value as Record<string, unknown>;
    if (!nested['@type']) {
      warnings.push({
        code: 'NESTED_MISSING_TYPE',
        message: `Nested object "${field}" should have @type`,
        path: field,
      });
    }

    // Validate nested author
    if (field === 'author' && nested['@type'] === 'Person') {
      if (!nested.name) {
        errors.push({
          code: 'AUTHOR_MISSING_NAME',
          message: 'Author must have a name',
          path: `${field}.name`,
        });
      }
    }

    // Validate nested address
    if (field === 'address' && nested['@type'] === 'PostalAddress') {
      const addressFields = ['streetAddress', 'addressLocality', 'addressRegion', 'postalCode'];
      for (const addrField of addressFields) {
        if (!nested[addrField]) {
          warnings.push({
            code: 'ADDRESS_INCOMPLETE',
            message: `Address should include ${addrField}`,
            path: `${field}.${addrField}`,
          });
        }
      }
    }
  }
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

function isValidPhoneNumber(phone: string): boolean {
  // Accept various phone formats
  const cleaned = phone.replace(/[\s\-\.\(\)]/g, '');
  return /^\+?1?\d{10,14}$/.test(cleaned);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPriceRange(range: string): boolean {
  return /^\$+$/.test(range);
}

function isAbsoluteUrl(url: string): boolean {
  return /^https?:\/\//.test(url);
}

function isValidISO8601(date: string): boolean {
  // Accept YYYY-MM-DD or full ISO format
  const iso8601 = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2})?(.\d+)?(Z|[+-]\d{2}:?\d{2})?)?$/;
  return iso8601.test(date);
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get a summary of validation results
 */
export function getValidationSummary(result: ValidationResult): string {
  if (result.valid) {
    if (result.warnings.length === 0) {
      return 'Schema is valid with no issues.';
    }
    return `Schema is valid with ${result.warnings.length} warning(s).`;
  }
  return `Schema has ${result.errors.length} error(s) that must be fixed.`;
}

/**
 * Format validation results for console output
 */
export function formatValidationResults(result: ValidationResult): string {
  const lines: string[] = [];

  if (result.errors.length > 0) {
    lines.push('ERRORS:');
    result.errors.forEach((e) => {
      lines.push(`  - [${e.code}] ${e.message}${e.path ? ` (at ${e.path})` : ''}`);
      if (e.suggestion) {
        lines.push(`    Suggestion: ${e.suggestion}`);
      }
    });
  }

  if (result.warnings.length > 0) {
    lines.push('WARNINGS:');
    result.warnings.forEach((w) => {
      lines.push(`  - [${w.code}] ${w.message}${w.path ? ` (at ${w.path})` : ''}`);
      if (w.suggestion) {
        lines.push(`    Suggestion: ${w.suggestion}`);
      }
    });
  }

  if (result.info.length > 0) {
    lines.push('INFO:');
    result.info.forEach((i) => {
      lines.push(`  - [${i.code}] ${i.message}${i.path ? ` (at ${i.path})` : ''}`);
    });
  }

  return lines.join('\n');
}

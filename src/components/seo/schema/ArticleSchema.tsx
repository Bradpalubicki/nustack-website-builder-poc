/**
 * ArticleSchema Component
 *
 * Renders JSON-LD structured data for articles.
 * Supports E-E-A-T signals like medical reviewer and citations.
 */

import React from 'react';
import {
  generateArticleSchema,
  serializeSchema,
} from '@/lib/seo/schema/generators';
import { validateSchema } from '@/lib/seo/schema/validator';
import type { Article, TeamMember, BusinessProfile } from '@/lib/seo/schema/types';

export interface ArticleSchemaProps {
  /** Article data */
  article: Article;
  /** Author information */
  author: TeamMember;
  /** Publisher (business) information */
  publisher: BusinessProfile;
  /** Medical reviewer for E-E-A-T (optional) */
  medicalReviewer?: TeamMember;
  /** Citations for credibility (optional) */
  citations?: Array<{ url: string; title: string }>;
  /** Enable validation in development */
  validateInDev?: boolean;
}

/**
 * ArticleSchema Component
 *
 * Generates and renders Article structured data.
 * Includes E-E-A-T signals when provided (reviewedBy, citations).
 */
export function ArticleSchema({
  article,
  author,
  publisher,
  medicalReviewer,
  citations,
  validateInDev = true,
}: ArticleSchemaProps): React.ReactElement | null {
  // Generate the schema
  const schema = generateArticleSchema(
    article,
    author,
    publisher,
    medicalReviewer,
    citations
  );

  // Validate in development
  if (validateInDev && process.env.NODE_ENV === 'development') {
    const validation = validateSchema(schema as unknown as Record<string, unknown>);
    if (!validation.valid) {
      console.warn('[ArticleSchema] Validation errors:', validation.errors);
    }
    if (validation.warnings.length > 0) {
      console.info('[ArticleSchema] Validation warnings:', validation.warnings);
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

export default ArticleSchema;

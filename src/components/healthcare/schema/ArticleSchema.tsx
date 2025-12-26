'use client';

import React from 'react';

export interface ArticleSchemaProps {
  /** Article headline/title */
  headline: string;
  /** Article description/excerpt */
  description: string;
  /** Article image(s) */
  image: string | string[];
  /** Date the article was published */
  datePublished: string;
  /** Date the article was last modified */
  dateModified: string;
  /** Author information */
  author: {
    name: string;
    type?: 'Person' | 'Organization';
    url?: string;
    image?: string;
    jobTitle?: string;
    description?: string;
  };
  /** Publisher information */
  publisher: {
    name: string;
    url?: string;
    logo: string;
  };
  /** Main entity URL of the page */
  mainEntityOfPage: string;
  /** Word count of the article */
  wordCount?: number;
  /** Article section/category */
  articleSection?: string;
  /** Speakable specification for voice search */
  speakable?: {
    cssSelector?: string[];
    xpath?: string[];
  };
  /** Article type */
  articleType?: 'Article' | 'MedicalWebPage' | 'HealthTopicContent' | 'BlogPosting' | 'NewsArticle';
}

/**
 * ArticleSchema Component
 *
 * Generates JSON-LD structured data for Article schema.
 * Supports medical/health content types for E-E-A-T compliance.
 */
export function ArticleSchema({
  headline,
  description,
  image,
  datePublished,
  dateModified,
  author,
  publisher,
  mainEntityOfPage,
  wordCount,
  articleSection,
  speakable,
  articleType = 'Article',
}: ArticleSchemaProps) {
  const schemaAuthor = {
    '@type': author.type || 'Person',
    name: author.name,
    ...(author.url && { url: author.url }),
    ...(author.image && { image: author.image }),
    ...(author.jobTitle && { jobTitle: author.jobTitle }),
    ...(author.description && { description: author.description }),
  };

  const schemaPublisher = {
    '@type': 'Organization',
    name: publisher.name,
    ...(publisher.url && { url: publisher.url }),
    logo: {
      '@type': 'ImageObject',
      url: publisher.logo,
    },
  };

  const schemaSpeakable = speakable
    ? {
        '@type': 'SpeakableSpecification',
        ...(speakable.cssSelector && { cssSelector: speakable.cssSelector }),
        ...(speakable.xpath && { xpath: speakable.xpath }),
      }
    : undefined;

  const schema = {
    '@context': 'https://schema.org',
    '@type': articleType,
    headline,
    description,
    image: Array.isArray(image) ? image : [image],
    datePublished,
    dateModified,
    author: schemaAuthor,
    publisher: schemaPublisher,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': mainEntityOfPage,
    },
    ...(wordCount && { wordCount }),
    ...(articleSection && { articleSection }),
    ...(schemaSpeakable && { speakable: schemaSpeakable }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
}

export default ArticleSchema;

'use client';

import React from 'react';

export interface ReviewSchemaProps {
  /** Reviewer/author name */
  author: string;
  /** Date the review was published */
  datePublished: string;
  /** Review content/body */
  reviewBody: string;
  /** Rating information */
  reviewRating: {
    ratingValue: number;
    bestRating?: number;
    worstRating?: number;
  };
  /** Item being reviewed */
  itemReviewed: {
    type: string;
    name: string;
    url?: string;
  };
  /** Optional review title */
  name?: string;
}

/**
 * ReviewSchema Component
 *
 * Generates JSON-LD structured data for individual Review schema.
 * Use for displaying patient testimonials with proper structured data.
 */
export function ReviewSchema({
  author,
  datePublished,
  reviewBody,
  reviewRating,
  itemReviewed,
  name,
}: ReviewSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Review',
    ...(name && { name }),
    author: {
      '@type': 'Person',
      name: author,
    },
    datePublished,
    reviewBody,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: reviewRating.ratingValue,
      bestRating: reviewRating.bestRating || 5,
      worstRating: reviewRating.worstRating || 1,
    },
    itemReviewed: {
      '@type': itemReviewed.type,
      name: itemReviewed.name,
      ...(itemReviewed.url && { url: itemReviewed.url }),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
}

export default ReviewSchema;

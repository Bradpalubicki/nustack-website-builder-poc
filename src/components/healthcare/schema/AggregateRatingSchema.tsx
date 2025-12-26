'use client';

import React from 'react';

export interface AggregateRatingSchemaProps {
  /** Average rating value */
  ratingValue: number;
  /** Total number of reviews */
  reviewCount: number;
  /** Best possible rating */
  bestRating?: number;
  /** Worst possible rating */
  worstRating?: number;
  /** Item being rated */
  itemReviewed: {
    type: string;
    name: string;
    url?: string;
  };
}

/**
 * AggregateRatingSchema Component
 *
 * Generates JSON-LD structured data for AggregateRating schema.
 * Use to display overall ratings for a business, service, or provider.
 */
export function AggregateRatingSchema({
  ratingValue,
  reviewCount,
  bestRating = 5,
  worstRating = 1,
  itemReviewed,
}: AggregateRatingSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': itemReviewed.type,
    name: itemReviewed.name,
    ...(itemReviewed.url && { url: itemReviewed.url }),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue,
      reviewCount,
      bestRating,
      worstRating,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
}

export default AggregateRatingSchema;

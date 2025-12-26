'use client';

import React from 'react';

export interface BreadcrumbItem {
  /** Display name of the breadcrumb item */
  name: string;
  /** URL of the breadcrumb item */
  url: string;
}

export interface BreadcrumbSchemaProps {
  /** Array of breadcrumb items */
  items: BreadcrumbItem[];
}

/**
 * BreadcrumbSchema Component
 *
 * Generates JSON-LD structured data for BreadcrumbList schema.
 * Helps search engines understand site structure and display breadcrumb trails.
 */
export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  if (!items || items.length === 0) {
    return null;
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
}

export default BreadcrumbSchema;

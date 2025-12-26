'use client';

import React from 'react';

export interface FAQPageSchemaProps {
  /** Array of FAQ items */
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  /** Main entity of the page URL */
  mainEntityOfPage?: string;
}

/**
 * FAQPageSchema Component
 *
 * Generates JSON-LD structured data for FAQPage schema.
 * Use this component on pages with frequently asked questions
 * to enable FAQ rich results in Google Search.
 */
export function FAQPageSchema({ faqs, mainEntityOfPage }: FAQPageSchemaProps) {
  if (!faqs || faqs.length === 0) {
    return null;
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    ...(mainEntityOfPage && { mainEntityOfPage }),
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
}

export default FAQPageSchema;

'use client';

import React from 'react';

export type ItemAvailability =
  | 'InStock'
  | 'OutOfStock'
  | 'PreOrder'
  | 'LimitedAvailability'
  | 'OnlineOnly'
  | 'InStoreOnly';

export interface OfferSchemaProps {
  /** Offer/product name */
  name: string;
  /** Offer description */
  description?: string;
  /** Price value */
  price: string;
  /** Currency (default: USD) */
  priceCurrency?: string;
  /** Date until price is valid */
  priceValidUntil?: string;
  /** Availability status */
  availability?: ItemAvailability;
  /** URL for the offer */
  url?: string;
  /** Seller information */
  seller?: {
    name: string;
    url?: string;
  };
  /** Item condition */
  itemCondition?: 'NewCondition' | 'UsedCondition' | 'RefurbishedCondition';
  /** Item being offered */
  itemOffered?: {
    type: string;
    name: string;
    description?: string;
  };
}

/**
 * OfferSchema Component
 *
 * Generates JSON-LD structured data for Offer schema.
 * Use for pricing information on service pages.
 */
export function OfferSchema({
  name,
  description,
  price,
  priceCurrency = 'USD',
  priceValidUntil,
  availability,
  url,
  seller,
  itemCondition,
  itemOffered,
}: OfferSchemaProps) {
  const schemaSeller = seller
    ? {
        '@type': 'Organization',
        name: seller.name,
        ...(seller.url && { url: seller.url }),
      }
    : undefined;

  const schemaItemOffered = itemOffered
    ? {
        '@type': itemOffered.type,
        name: itemOffered.name,
        ...(itemOffered.description && { description: itemOffered.description }),
      }
    : undefined;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Offer',
    name,
    ...(description && { description }),
    price,
    priceCurrency,
    ...(priceValidUntil && { priceValidUntil }),
    ...(availability && { availability: `https://schema.org/${availability}` }),
    ...(url && { url }),
    ...(schemaSeller && { seller: schemaSeller }),
    ...(itemCondition && { itemCondition: `https://schema.org/${itemCondition}` }),
    ...(schemaItemOffered && { itemOffered: schemaItemOffered }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
}

export default OfferSchema;

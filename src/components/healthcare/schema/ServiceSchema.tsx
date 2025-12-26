'use client';

import React from 'react';

export interface ServiceSchemaProps {
  /** Service name */
  name: string;
  /** Service description */
  description: string;
  /** Service provider organization */
  provider: {
    name: string;
    url?: string;
    telephone?: string;
  };
  /** Type of service */
  serviceType: string;
  /** Areas where service is available */
  areaServed?: string[];
  /** Pricing information */
  offers?: {
    price: string;
    priceCurrency?: string;
    priceValidUntil?: string;
    availability?: 'InStock' | 'OutOfStock' | 'PreOrder' | 'LimitedAvailability';
  };
  /** URL for the service page */
  url?: string;
  /** Service image */
  image?: string;
  /** Category/type for schema */
  schemaType?: 'Service' | 'MedicalProcedure' | 'MedicalTherapy';
}

/**
 * ServiceSchema Component
 *
 * Generates JSON-LD structured data for Service schema.
 * Use for describing medical services and treatments.
 */
export function ServiceSchema({
  name,
  description,
  provider,
  serviceType,
  areaServed,
  offers,
  url,
  image,
  schemaType = 'Service',
}: ServiceSchemaProps) {
  const schemaProvider = {
    '@type': 'MedicalOrganization',
    name: provider.name,
    ...(provider.url && { url: provider.url }),
    ...(provider.telephone && { telephone: provider.telephone }),
  };

  const schemaOffers = offers
    ? {
        '@type': 'Offer',
        price: offers.price,
        priceCurrency: offers.priceCurrency || 'USD',
        ...(offers.priceValidUntil && { priceValidUntil: offers.priceValidUntil }),
        ...(offers.availability && { availability: `https://schema.org/${offers.availability}` }),
      }
    : undefined;

  const schema = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name,
    description,
    provider: schemaProvider,
    serviceType,
    ...(areaServed && { areaServed }),
    ...(schemaOffers && { offers: schemaOffers }),
    ...(url && { url }),
    ...(image && { image }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
}

export default ServiceSchema;

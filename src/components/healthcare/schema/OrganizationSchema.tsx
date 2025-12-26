'use client';

import React from 'react';

export interface OrganizationSchemaProps {
  /** Organization name */
  name: string;
  /** Organization website URL */
  url: string;
  /** Organization logo URL */
  logo: string;
  /** Contact points */
  contactPoint?: Array<{
    telephone: string;
    contactType: string;
    areaServed?: string[];
    availableLanguage?: string[];
  }>;
  /** Social profile URLs */
  sameAs?: string[];
  /** Physical address */
  address?: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry?: string;
  };
  /** Founding date */
  foundingDate?: string;
  /** Founder(s) */
  founders?: Array<{
    name: string;
    jobTitle?: string;
  }>;
  /** Organization description */
  description?: string;
  /** Schema type */
  schemaType?: 'Organization' | 'MedicalOrganization' | 'Corporation';
}

/**
 * OrganizationSchema Component
 *
 * Generates JSON-LD structured data for Organization schema.
 * Use on homepage and about pages to establish business identity.
 */
export function OrganizationSchema({
  name,
  url,
  logo,
  contactPoint,
  sameAs,
  address,
  foundingDate,
  founders,
  description,
  schemaType = 'Organization',
}: OrganizationSchemaProps) {
  const schemaContactPoints = contactPoint?.map((point) => ({
    '@type': 'ContactPoint',
    telephone: point.telephone,
    contactType: point.contactType,
    ...(point.areaServed && { areaServed: point.areaServed }),
    ...(point.availableLanguage && { availableLanguage: point.availableLanguage }),
  }));

  const schemaAddress = address
    ? {
        '@type': 'PostalAddress',
        streetAddress: address.streetAddress,
        addressLocality: address.addressLocality,
        addressRegion: address.addressRegion,
        postalCode: address.postalCode,
        addressCountry: address.addressCountry || 'US',
      }
    : undefined;

  const schemaFounders = founders?.map((founder) => ({
    '@type': 'Person',
    name: founder.name,
    ...(founder.jobTitle && { jobTitle: founder.jobTitle }),
  }));

  const schema = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name,
    url,
    logo: {
      '@type': 'ImageObject',
      url: logo,
    },
    ...(schemaContactPoints && { contactPoint: schemaContactPoints }),
    ...(sameAs && { sameAs }),
    ...(schemaAddress && { address: schemaAddress }),
    ...(foundingDate && { foundingDate }),
    ...(schemaFounders && { founder: schemaFounders }),
    ...(description && { description }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
}

export default OrganizationSchema;

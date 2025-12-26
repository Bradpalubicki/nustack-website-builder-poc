'use client';

import React from 'react';
import type {
  SchemaPostalAddress,
  SchemaGeoCoordinates,
  SchemaOpeningHoursSpecification,
  SchemaAggregateRating,
  SchemaCredential,
} from '@/types/healthcare';

export interface MedicalServiceSchema {
  name: string;
  description?: string;
  procedureType?: string;
}

export interface MedicalBusinessSchemaProps {
  /** Business name */
  businessName: string;
  /** Type of medical business */
  businessType?: 'MedicalBusiness' | 'MedicalClinic' | 'Hospital' | 'DiagnosticLab';
  /** Business address */
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry?: string;
  };
  /** Primary phone number */
  phone: string;
  /** Email address */
  email?: string;
  /** Website URL */
  url: string;
  /** Business image URL */
  image?: string;
  /** Business logo URL */
  logo?: string;
  /** Geographic coordinates */
  geo?: {
    latitude: number;
    longitude: number;
  };
  /** Opening hours */
  openingHours?: Array<{
    dayOfWeek: string | string[];
    opens: string;
    closes: string;
  }>;
  /** Price range indicator */
  priceRange?: string;
  /** Medical specialties */
  medicalSpecialty: string[];
  /** Available medical services */
  availableService?: MedicalServiceSchema[];
  /** Whether accepting new patients */
  isAcceptingNewPatients?: boolean;
  /** Credentials and accreditations */
  hasCredential?: Array<{
    credentialCategory: string;
    name: string;
    recognizedBy?: string;
  }>;
  /** Aggregate rating */
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
  /** Social profiles */
  sameAs?: string[];
  /** Year established */
  foundingDate?: string;
  /** Service areas */
  areaServed?: string[];
}

/**
 * MedicalBusinessSchema Component
 *
 * Generates JSON-LD structured data for medical business schema.
 * Extends LocalBusiness with medical-specific properties.
 */
export function MedicalBusinessSchema({
  businessName,
  businessType = 'MedicalBusiness',
  address,
  phone,
  email,
  url,
  image,
  logo,
  geo,
  openingHours,
  priceRange,
  medicalSpecialty,
  availableService,
  isAcceptingNewPatients,
  hasCredential,
  aggregateRating,
  sameAs,
  foundingDate,
  areaServed,
}: MedicalBusinessSchemaProps) {
  const schemaAddress: SchemaPostalAddress = {
    '@type': 'PostalAddress',
    streetAddress: address.streetAddress,
    addressLocality: address.addressLocality,
    addressRegion: address.addressRegion,
    postalCode: address.postalCode,
    addressCountry: address.addressCountry || 'US',
  };

  const schemaGeo: SchemaGeoCoordinates | undefined = geo
    ? {
        '@type': 'GeoCoordinates',
        latitude: geo.latitude,
        longitude: geo.longitude,
      }
    : undefined;

  const schemaOpeningHours: SchemaOpeningHoursSpecification[] | undefined = openingHours?.map(
    (hours) => ({
      '@type': 'OpeningHoursSpecification' as const,
      dayOfWeek: hours.dayOfWeek,
      opens: hours.opens,
      closes: hours.closes,
    })
  );

  const schemaServices = availableService?.map((service) => ({
    '@type': 'MedicalProcedure',
    name: service.name,
    ...(service.description && { description: service.description }),
    ...(service.procedureType && { procedureType: service.procedureType }),
  }));

  const schemaCredentials: SchemaCredential[] | undefined = hasCredential?.map((cred) => ({
    '@type': 'EducationalOccupationalCredential',
    credentialCategory: cred.credentialCategory,
    name: cred.name,
    ...(cred.recognizedBy && {
      recognizedBy: {
        '@type': 'Organization',
        name: cred.recognizedBy,
      },
    }),
  }));

  const schemaAggregateRating: SchemaAggregateRating | undefined = aggregateRating
    ? {
        '@type': 'AggregateRating',
        ratingValue: aggregateRating.ratingValue,
        reviewCount: aggregateRating.reviewCount,
        bestRating: 5,
        worstRating: 1,
      }
    : undefined;

  const schema = {
    '@context': 'https://schema.org',
    '@type': businessType,
    name: businessName,
    address: schemaAddress,
    telephone: phone,
    ...(email && { email }),
    url,
    ...(image && { image }),
    ...(logo && { logo }),
    ...(schemaGeo && { geo: schemaGeo }),
    ...(schemaOpeningHours && { openingHoursSpecification: schemaOpeningHours }),
    ...(priceRange && { priceRange }),
    medicalSpecialty,
    ...(schemaServices && { availableService: schemaServices }),
    ...(typeof isAcceptingNewPatients === 'boolean' && { isAcceptingNewPatients }),
    ...(schemaCredentials && { hasCredential: schemaCredentials }),
    ...(schemaAggregateRating && { aggregateRating: schemaAggregateRating }),
    ...(sameAs && { sameAs }),
    ...(foundingDate && { foundingDate }),
    ...(areaServed && { areaServed }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
}

export default MedicalBusinessSchema;

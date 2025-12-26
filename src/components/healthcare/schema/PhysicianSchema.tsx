'use client';

import React from 'react';
import type { SchemaAggregateRating } from '@/types/healthcare';

export interface PhysicianSchemaProps {
  /** Physician's full name */
  name: string;
  /** Profile image URL */
  image?: string;
  /** Job title (e.g., "Medical Director") */
  jobTitle: string;
  /** Professional description/bio */
  description?: string;
  /** Medical specialties */
  medicalSpecialty: string[];
  /** Organization the physician works for */
  worksFor: {
    name: string;
    url?: string;
  };
  /** Educational background */
  alumniOf?: Array<{
    name: string;
    url?: string;
  }>;
  /** Professional credentials */
  hasCredential?: Array<{
    credentialCategory: string;
    name: string;
    recognizedBy?: string;
  }>;
  /** Services provided */
  availableService?: Array<{
    name: string;
    description?: string;
  }>;
  /** Aggregate rating */
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
  /** Profile page URL */
  url?: string;
  /** Social and professional profile URLs */
  sameAs?: string[];
  /** Known for/notable work */
  knowsAbout?: string[];
  /** Languages spoken */
  knowsLanguage?: string[];
}

/**
 * PhysicianSchema Component
 *
 * Generates JSON-LD structured data for Physician schema.
 * Important for E-E-A-T signals in healthcare content.
 */
export function PhysicianSchema({
  name,
  image,
  jobTitle,
  description,
  medicalSpecialty,
  worksFor,
  alumniOf,
  hasCredential,
  availableService,
  aggregateRating,
  url,
  sameAs,
  knowsAbout,
  knowsLanguage,
}: PhysicianSchemaProps) {
  const schemaWorksFor = {
    '@type': 'MedicalOrganization',
    name: worksFor.name,
    ...(worksFor.url && { url: worksFor.url }),
  };

  const schemaAlumniOf = alumniOf?.map((school) => ({
    '@type': 'EducationalOrganization',
    name: school.name,
    ...(school.url && { url: school.url }),
  }));

  const schemaCredentials = hasCredential?.map((cred) => ({
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

  const schemaServices = availableService?.map((service) => ({
    '@type': 'MedicalProcedure',
    name: service.name,
    ...(service.description && { description: service.description }),
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
    '@type': 'Physician',
    name,
    ...(image && { image }),
    jobTitle,
    ...(description && { description }),
    medicalSpecialty,
    worksFor: schemaWorksFor,
    ...(schemaAlumniOf && { alumniOf: schemaAlumniOf }),
    ...(schemaCredentials && { hasCredential: schemaCredentials }),
    ...(schemaServices && { availableService: schemaServices }),
    ...(schemaAggregateRating && { aggregateRating: schemaAggregateRating }),
    ...(url && { url }),
    ...(sameAs && { sameAs }),
    ...(knowsAbout && { knowsAbout }),
    ...(knowsLanguage && { knowsLanguage }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
}

export default PhysicianSchema;

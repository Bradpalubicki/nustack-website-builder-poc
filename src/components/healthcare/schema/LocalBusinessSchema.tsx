'use client';

import React from 'react';
import type {
  SchemaPostalAddress,
  SchemaGeoCoordinates,
  SchemaOpeningHoursSpecification,
  SchemaAggregateRating,
  SchemaReview,
} from '@/types/healthcare';

export interface LocalBusinessSchemaProps {
  /** Business name */
  businessName: string;
  /** Type of business for schema */
  businessType: 'LocalBusiness' | 'MedicalClinic' | 'MedicalBusiness' | 'Physician' | 'Dentist';
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
  /** Price range indicator ($, $$, $$$, $$$$) */
  priceRange?: string;
  /** Service areas */
  serviceArea?: string[];
  /** Aggregate rating */
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
    bestRating?: number;
    worstRating?: number;
  };
  /** Reviews */
  reviews?: Array<{
    author: string;
    datePublished: string;
    reviewBody: string;
    ratingValue: number;
  }>;
  /** Social profile URLs */
  sameAs?: string[];
  /** Medical specialties (for medical businesses) */
  medicalSpecialty?: string[];
}

/**
 * LocalBusinessSchema Component
 *
 * Generates JSON-LD structured data for local business schema.
 * Supports various business types including medical clinics.
 */
export function LocalBusinessSchema({
  businessName,
  businessType,
  address,
  phone,
  email,
  url,
  image,
  logo,
  geo,
  openingHours,
  priceRange,
  serviceArea,
  aggregateRating,
  reviews,
  sameAs,
  medicalSpecialty,
}: LocalBusinessSchemaProps) {
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

  const schemaAggregateRating: SchemaAggregateRating | undefined = aggregateRating
    ? {
        '@type': 'AggregateRating',
        ratingValue: aggregateRating.ratingValue,
        reviewCount: aggregateRating.reviewCount,
        bestRating: aggregateRating.bestRating || 5,
        worstRating: aggregateRating.worstRating || 1,
      }
    : undefined;

  const schemaReviews: SchemaReview[] | undefined = reviews?.map((review) => ({
    '@type': 'Review',
    author: {
      '@type': 'Person',
      name: review.author,
    },
    datePublished: review.datePublished,
    reviewBody: review.reviewBody,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.ratingValue,
      bestRating: 5,
      worstRating: 1,
    },
  }));

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
    ...(serviceArea && { areaServed: serviceArea }),
    ...(schemaAggregateRating && { aggregateRating: schemaAggregateRating }),
    ...(schemaReviews && { review: schemaReviews }),
    ...(sameAs && { sameAs }),
    ...(medicalSpecialty && { medicalSpecialty }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
}

export default LocalBusinessSchema;

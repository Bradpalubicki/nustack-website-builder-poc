/**
 * Schema.org JSON-LD Generators
 *
 * Functions that convert internal business types to valid Schema.org JSON-LD.
 * Each generator handles optional fields gracefully.
 *
 * @see https://developers.google.com/search/docs/appearance/structured-data
 */

import type {
  LocalBusinessSchema,
  OrganizationSchema,
  ArticleSchema,
  BreadcrumbSchema,
  BreadcrumbItem,
  PersonSchema,
  AggregateRating,
  FAQPageSchema,
  Question,
  PostalAddress,
  GeoCoordinates,
  OpeningHoursSpec,
  ImageObject,
  BusinessProfile,
  Location,
  TeamMember,
  Article,
  FAQ,
  ServiceSchema,
  WebsiteSchema,
  SearchAction,
} from './types';
import { getSchemaType, shouldUseMedicalOrganization } from './industry-types';

// ============================================================================
// BUSINESS & ORGANIZATION SCHEMAS
// ============================================================================

/**
 * Generate LocalBusiness schema from business and location data
 */
export function generateLocalBusinessSchema(
  business: BusinessProfile,
  location: Location,
  reviews?: { rating: number; count: number }
): LocalBusinessSchema {
  const schemaType = getSchemaType(business.industry, business.specialty);

  const schema: LocalBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    '@id': `${business.website}#${location.slug || 'location'}`,
    name: business.name,
    url: business.website,
    telephone: location.phone || business.phone,
    address: generatePostalAddress(location),
  };

  // Optional fields
  if (business.description) {
    schema.description = business.description;
  }

  if (business.email || location.email) {
    schema.email = location.email || business.email;
  }

  if (business.logoUrl) {
    schema.logo = generateImageObject(business.logoUrl, business.name + ' logo');
    schema.image = schema.logo;
  }

  if (location.coordinates) {
    schema.geo = generateGeoCoordinates(location.coordinates);
  }

  if (location.serviceAreas && location.serviceAreas.length > 0) {
    schema.areaServed = location.serviceAreas.map((area) => ({
      '@type': 'City' as const,
      name: area,
    }));
  }

  if (location.hours) {
    schema.openingHoursSpecification = generateOpeningHours(location.hours);
  }

  if (reviews && reviews.count > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: reviews.rating,
      reviewCount: reviews.count,
      bestRating: 5,
      worstRating: 1,
    };
  }

  if (business.socialProfiles) {
    schema.sameAs = getSocialUrls(business.socialProfiles);
  }

  if (business.foundingDate) {
    schema.foundingDate = business.foundingDate;
  }

  return schema;
}

/**
 * Generate Organization schema
 */
export function generateOrganizationSchema(business: BusinessProfile): OrganizationSchema {
  const useMedical = shouldUseMedicalOrganization(
    getSchemaType(business.industry, business.specialty)
  );

  const schema: OrganizationSchema = {
    '@context': 'https://schema.org',
    '@type': useMedical ? 'MedicalOrganization' : 'Organization',
    '@id': `${business.website}#organization`,
    name: business.name,
    url: business.website,
  };

  if (business.description) {
    schema.description = business.description;
  }

  if (business.logoUrl) {
    schema.logo = generateImageObject(business.logoUrl, business.name + ' logo');
    schema.image = schema.logo;
  }

  if (business.phone) {
    schema.telephone = business.phone;
  }

  if (business.email) {
    schema.email = business.email;
  }

  if (business.socialProfiles) {
    schema.sameAs = getSocialUrls(business.socialProfiles);
  }

  if (business.foundingDate) {
    schema.foundingDate = business.foundingDate;
  }

  return schema;
}

// ============================================================================
// CONTENT SCHEMAS
// ============================================================================

/**
 * Generate Article schema
 */
export function generateArticleSchema(
  article: Article,
  author: TeamMember,
  publisher: BusinessProfile,
  medicalReviewer?: TeamMember,
  citations?: Array<{ url: string; title: string }>
): ArticleSchema {
  const schema: ArticleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${publisher.website}/blog/${article.slug}#article`,
    headline: article.title,
    image: article.imageUrl || `${publisher.website}/og-image.jpg`,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: generatePersonSchema(author),
    publisher: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: publisher.name,
      url: publisher.website,
      logo: publisher.logoUrl
        ? generateImageObject(publisher.logoUrl, publisher.name + ' logo')
        : undefined,
    },
    mainEntityOfPage: `${publisher.website}/blog/${article.slug}`,
  };

  if (article.excerpt) {
    schema.description = article.excerpt;
  }

  if (article.wordCount) {
    schema.wordCount = article.wordCount;
  }

  if (article.category) {
    schema.articleSection = article.category;
  }

  if (article.tags && article.tags.length > 0) {
    schema.keywords = article.tags;
  }

  // E-E-A-T signals
  if (medicalReviewer) {
    schema.reviewedBy = generatePersonSchema(medicalReviewer);
  }

  if (citations && citations.length > 0) {
    schema.citation = citations.map((c) => c.url);
  }

  return schema;
}

/**
 * Generate Breadcrumb schema
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
): BreadcrumbSchema {
  const itemListElement: BreadcrumbItem[] = items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: index < items.length - 1 ? item.url : undefined, // Last item doesn't need URL
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  };
}

/**
 * Generate Breadcrumb schema from URL path
 */
export function generateBreadcrumbSchemaFromPath(
  baseUrl: string,
  path: string,
  labels?: Record<string, string>
): BreadcrumbSchema {
  const segments = path.split('/').filter(Boolean);
  const items: Array<{ name: string; url: string }> = [
    { name: 'Home', url: baseUrl },
  ];

  let currentPath = '';
  for (const segment of segments) {
    currentPath += `/${segment}`;
    const label = labels?.[segment] || formatSegmentLabel(segment);
    items.push({
      name: label,
      url: `${baseUrl}${currentPath}`,
    });
  }

  return generateBreadcrumbSchema(items);
}

// ============================================================================
// PERSON SCHEMAS
// ============================================================================

/**
 * Generate Person schema
 */
export function generatePersonSchema(member: TeamMember): PersonSchema {
  const schema: PersonSchema = {
    '@type': 'Person',
    name: member.name,
  };

  if (member.firstName) {
    schema.givenName = member.firstName;
  }

  if (member.lastName) {
    schema.familyName = member.lastName;
  }

  if (member.title) {
    schema.jobTitle = member.title;
  }

  if (member.bio) {
    schema.description = member.bio;
  }

  if (member.imageUrl) {
    schema.image = member.imageUrl;
  }

  if (member.email) {
    schema.email = member.email;
  }

  if (member.specialties && member.specialties.length > 0) {
    schema.knowsAbout = member.specialties;
  }

  if (member.education && member.education.length > 0) {
    schema.alumniOf = member.education.map((edu) => ({
      '@type': 'EducationalOrganization' as const,
      name: edu.institution,
    }));
  }

  if (member.credentials && member.credentials.length > 0) {
    schema.hasCredential = member.credentials.map((cred) => ({
      '@type': 'EducationalOccupationalCredential' as const,
      credentialCategory: 'certification',
      name: cred,
    }));
  }

  if (member.socialProfiles) {
    schema.sameAs = getSocialUrls(member.socialProfiles);
  }

  return schema;
}

// ============================================================================
// RATING & REVIEW SCHEMAS
// ============================================================================

/**
 * Generate AggregateRating schema
 */
export function generateAggregateRatingSchema(
  rating: number,
  count: number,
  bestRating: number = 5,
  worstRating: number = 1
): AggregateRating {
  return {
    '@type': 'AggregateRating',
    ratingValue: rating,
    reviewCount: count,
    bestRating,
    worstRating,
  };
}

// ============================================================================
// FAQ SCHEMAS
// ============================================================================

/**
 * Generate FAQPage schema
 *
 * NOTE: As of April 2023, FAQ rich results are restricted to
 * authoritative government and health websites only.
 * However, the schema is still valid for SEO purposes.
 */
export function generateFAQSchema(faqs: FAQ[]): FAQPageSchema {
  const mainEntity: Question[] = faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity,
  };
}

// ============================================================================
// WEBSITE SCHEMAS
// ============================================================================

/**
 * Generate Website schema
 */
export function generateWebsiteSchema(
  business: BusinessProfile,
  searchUrl?: string
): WebsiteSchema {
  const schema: WebsiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${business.website}#website`,
    name: business.name,
    url: business.website,
  };

  if (business.description) {
    schema.description = business.description;
  }

  // Add site search action if search URL provided
  if (searchUrl) {
    schema.potentialAction = generateSearchAction(searchUrl);
  }

  return schema;
}

/**
 * Generate SearchAction for site search
 */
export function generateSearchAction(searchUrl: string): SearchAction {
  return {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: searchUrl.includes('{search_term_string}')
        ? searchUrl
        : `${searchUrl}?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  };
}

// ============================================================================
// SERVICE SCHEMAS
// ============================================================================

/**
 * Generate Service schema
 */
export function generateServiceSchema(
  service: { name: string; description?: string; price?: string; url?: string },
  provider: BusinessProfile,
  serviceType?: string
): ServiceSchema {
  const schema: ServiceSchema = {
    '@type': 'Service',
    name: service.name,
    provider: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: provider.name,
      url: provider.website,
    },
  };

  if (service.description) {
    schema.description = service.description;
  }

  if (serviceType) {
    schema.serviceType = serviceType;
  }

  if (service.url) {
    schema.url = service.url;
  }

  if (service.price) {
    schema.offers = {
      '@type': 'Offer',
      priceRange: service.price,
    };
  }

  return schema;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generate PostalAddress from location
 */
function generatePostalAddress(location: Location): PostalAddress {
  return {
    '@type': 'PostalAddress',
    streetAddress: location.address.street2
      ? `${location.address.street}, ${location.address.street2}`
      : location.address.street,
    addressLocality: location.address.city,
    addressRegion: location.address.state,
    postalCode: location.address.zip,
    addressCountry: location.address.country || 'US',
  };
}

/**
 * Generate GeoCoordinates
 */
function generateGeoCoordinates(
  coords: { lat: number; lng: number }
): GeoCoordinates {
  return {
    '@type': 'GeoCoordinates',
    latitude: coords.lat,
    longitude: coords.lng,
  };
}

/**
 * Generate ImageObject
 */
function generateImageObject(url: string, caption?: string): ImageObject {
  return {
    '@type': 'ImageObject',
    url,
    caption,
  };
}

/**
 * Generate OpeningHoursSpecification array
 */
function generateOpeningHours(
  hours: Record<string, { open: string; close: string; closed?: boolean }>
): OpeningHoursSpec[] {
  const dayMapping: Record<string, string> = {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
  };

  return Object.entries(hours)
    .filter(([, h]) => !h.closed)
    .map(([day, h]) => ({
      '@type': 'OpeningHoursSpecification' as const,
      dayOfWeek: dayMapping[day.toLowerCase()] || day,
      opens: h.open,
      closes: h.close,
    }));
}

/**
 * Get social profile URLs from social profiles object
 */
function getSocialUrls(
  profiles: Record<string, string | undefined>
): string[] {
  return Object.values(profiles).filter((url): url is string => !!url);
}

/**
 * Format URL segment as label
 */
function formatSegmentLabel(segment: string): string {
  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Serialize schema to JSON-LD string
 */
export function serializeSchema(schema: object): string {
  return JSON.stringify(schema, null, 2);
}

/**
 * Create script tag HTML for schema
 */
export function createSchemaScriptTag(schema: object): string {
  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}

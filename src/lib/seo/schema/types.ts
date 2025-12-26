/**
 * Schema.org Type Definitions
 *
 * TypeScript interfaces for all supported Schema.org types.
 * These types generate rich results in Google Search.
 *
 * Note: As of 2024-2025:
 * - HowTo schema deprecated (Sept 2023)
 * - FAQ schema restricted to authoritative sites only
 * - INP replaced FID as Core Web Vital (March 2024)
 *
 * @see https://schema.org/
 * @see https://developers.google.com/search/docs/appearance/structured-data
 */

// ============================================================================
// BASE TYPES
// ============================================================================

/** Base thing - all Schema.org types extend this */
export interface SchemaThing {
  '@type': string;
  name?: string;
  description?: string;
  url?: string;
  image?: string | ImageObject;
  sameAs?: string[];
}

/** Postal address */
export interface PostalAddress {
  '@type': 'PostalAddress';
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: string;
}

/** Geographic coordinates */
export interface GeoCoordinates {
  '@type': 'GeoCoordinates';
  latitude: number;
  longitude: number;
}

/** Place for service areas */
export interface Place {
  '@type': 'Place' | 'City' | 'State' | 'AdministrativeArea';
  name: string;
  geo?: GeoCoordinates;
}

/** Image object with metadata */
export interface ImageObject {
  '@type': 'ImageObject';
  url: string;
  width?: number;
  height?: number;
  caption?: string;
}

/** Opening hours specification */
export interface OpeningHoursSpec {
  '@type': 'OpeningHoursSpecification';
  dayOfWeek: string | string[];
  opens: string;
  closes: string;
}

/** Aggregate rating */
export interface AggregateRating {
  '@type': 'AggregateRating';
  ratingValue: number;
  reviewCount: number;
  bestRating?: number;
  worstRating?: number;
}

/** Individual review */
export interface Review {
  '@type': 'Review';
  author: PersonSchema | string;
  datePublished: string;
  reviewBody: string;
  reviewRating: Rating;
}

/** Rating */
export interface Rating {
  '@type': 'Rating';
  ratingValue: number;
  bestRating?: number;
  worstRating?: number;
}

/** Offer (pricing) */
export interface Offer {
  '@type': 'Offer';
  price?: number | string;
  priceCurrency?: string;
  priceRange?: string;
  availability?: string;
  url?: string;
  validFrom?: string;
  validThrough?: string;
}

/** Contact point */
export interface ContactPoint {
  '@type': 'ContactPoint';
  telephone: string;
  contactType: string;
  email?: string;
  areaServed?: string | string[];
  availableLanguage?: string | string[];
}

// ============================================================================
// ORGANIZATION TYPES
// ============================================================================

/** Organization schema */
export interface OrganizationSchema {
  '@context': 'https://schema.org';
  '@type': 'Organization' | 'Corporation' | 'LocalBusiness' | 'MedicalOrganization';
  '@id'?: string;
  name: string;
  description?: string;
  url: string;
  logo?: string | ImageObject;
  image?: string | ImageObject;
  telephone?: string;
  email?: string;
  address?: PostalAddress;
  contactPoint?: ContactPoint[];
  sameAs?: string[];
  foundingDate?: string;
  founder?: PersonSchema;
  numberOfEmployees?: number;
}

/** Local business schema */
export interface LocalBusinessSchema {
  '@context': 'https://schema.org';
  '@type': string; // LocalBusiness, MedicalClinic, Restaurant, etc.
  '@id': string;
  name: string;
  description?: string;
  url: string;
  telephone: string;
  email?: string;
  image?: string | ImageObject;
  logo?: string | ImageObject;
  address: PostalAddress;
  geo?: GeoCoordinates;
  areaServed?: Place[];
  openingHoursSpecification?: OpeningHoursSpec[];
  priceRange?: string;
  aggregateRating?: AggregateRating;
  review?: Review[];
  sameAs?: string[];
  paymentAccepted?: string;
  currenciesAccepted?: string;
  foundingDate?: string;
  hasOfferCatalog?: OfferCatalog;
}

/** Offer catalog */
export interface OfferCatalog {
  '@type': 'OfferCatalog';
  name: string;
  itemListElement: OfferCatalogItem[];
}

/** Offer catalog item */
export interface OfferCatalogItem {
  '@type': 'Offer';
  itemOffered: ServiceSchema | ProductSchema;
}

// ============================================================================
// PERSON TYPES
// ============================================================================

/** Person schema */
export interface PersonSchema {
  '@context'?: 'https://schema.org';
  '@type': 'Person';
  '@id'?: string;
  name: string;
  givenName?: string;
  familyName?: string;
  jobTitle?: string;
  description?: string;
  image?: string | ImageObject;
  url?: string;
  email?: string;
  telephone?: string;
  address?: PostalAddress;
  worksFor?: OrganizationSchema;
  alumniOf?: EducationalOrganization[];
  hasCredential?: Credential[];
  knowsAbout?: string[];
  sameAs?: string[];
}

/** Educational organization */
export interface EducationalOrganization {
  '@type': 'EducationalOrganization' | 'CollegeOrUniversity';
  name: string;
  url?: string;
}

/** Credential */
export interface Credential {
  '@type': 'EducationalOccupationalCredential';
  credentialCategory: string;
  name: string;
  recognizedBy?: OrganizationSchema;
}

// ============================================================================
// CONTENT TYPES
// ============================================================================

/** Article schema */
export interface ArticleSchema {
  '@context': 'https://schema.org';
  '@type': 'Article' | 'NewsArticle' | 'BlogPosting' | 'MedicalWebPage';
  '@id'?: string;
  headline: string;
  description?: string;
  image: string | ImageObject | (string | ImageObject)[];
  datePublished: string;
  dateModified: string;
  author: PersonSchema | OrganizationSchema;
  publisher: OrganizationSchema;
  mainEntityOfPage: string;
  wordCount?: number;
  articleSection?: string;
  articleBody?: string;
  keywords?: string[];
  speakable?: SpeakableSpecification;
  reviewedBy?: PersonSchema;
  citation?: string[];
}

/** Speakable specification */
export interface SpeakableSpecification {
  '@type': 'SpeakableSpecification';
  cssSelector?: string[];
  xpath?: string[];
}

/** Breadcrumb list */
export interface BreadcrumbSchema {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: BreadcrumbItem[];
}

/** Breadcrumb item */
export interface BreadcrumbItem {
  '@type': 'ListItem';
  position: number;
  name: string;
  item?: string;
}

/**
 * FAQ Page schema
 *
 * NOTE: As of April 2023, Google restricts FAQ rich results to
 * "well-known, authoritative government and health websites."
 * However, the schema is still valid and can help with SEO.
 *
 * @see https://developers.google.com/search/docs/appearance/structured-data/faqpage
 */
export interface FAQPageSchema {
  '@context': 'https://schema.org';
  '@type': 'FAQPage';
  mainEntity: Question[];
}

/** Question for FAQ */
export interface Question {
  '@type': 'Question';
  name: string;
  acceptedAnswer: Answer;
}

/** Answer for FAQ */
export interface Answer {
  '@type': 'Answer';
  text: string;
}

// ============================================================================
// SERVICE & PRODUCT TYPES
// ============================================================================

/** Service schema */
export interface ServiceSchema {
  '@context'?: 'https://schema.org';
  '@type': 'Service' | 'MedicalService' | 'FinancialService' | 'ProfessionalService';
  '@id'?: string;
  name: string;
  description?: string;
  provider: OrganizationSchema | PersonSchema;
  areaServed?: Place | Place[];
  serviceType?: string;
  offers?: Offer | Offer[];
  image?: string | ImageObject;
  url?: string;
  aggregateRating?: AggregateRating;
}

/** Product schema */
export interface ProductSchema {
  '@context': 'https://schema.org';
  '@type': 'Product';
  '@id'?: string;
  name: string;
  description?: string;
  image: string | ImageObject | (string | ImageObject)[];
  brand?: Brand;
  sku?: string;
  gtin?: string;
  mpn?: string;
  offers: Offer | Offer[];
  aggregateRating?: AggregateRating;
  review?: Review[];
}

/** Brand */
export interface Brand {
  '@type': 'Brand';
  name: string;
  logo?: string | ImageObject;
}

// ============================================================================
// WEBSITE & WEBPAGE TYPES
// ============================================================================

/** Website schema */
export interface WebsiteSchema {
  '@context': 'https://schema.org';
  '@type': 'WebSite';
  '@id': string;
  name: string;
  url: string;
  description?: string;
  publisher?: OrganizationSchema;
  potentialAction?: SearchAction;
  inLanguage?: string;
}

/** Search action for site search */
export interface SearchAction {
  '@type': 'SearchAction';
  target: {
    '@type': 'EntryPoint';
    urlTemplate: string;
  };
  'query-input': string;
}

/** Web page schema */
export interface WebPageSchema {
  '@context': 'https://schema.org';
  '@type': 'WebPage' | 'AboutPage' | 'ContactPage' | 'ItemPage' | 'ProfilePage';
  '@id'?: string;
  name: string;
  description?: string;
  url: string;
  isPartOf?: WebsiteSchema;
  primaryImageOfPage?: ImageObject;
  datePublished?: string;
  dateModified?: string;
  breadcrumb?: BreadcrumbSchema;
}

// ============================================================================
// AGGREGATE TYPES
// ============================================================================

/** Review aggregate schema */
export interface AggregateRatingSchema {
  '@context': 'https://schema.org';
  '@type': 'AggregateRating';
  itemReviewed: LocalBusinessSchema | ProductSchema | ServiceSchema;
  ratingValue: number;
  reviewCount: number;
  bestRating?: number;
  worstRating?: number;
}

// ============================================================================
// BUSINESS PROFILE TYPES (for internal use)
// ============================================================================

/**
 * Business profile type used internally.
 * Maps to LocalBusinessSchema for schema generation.
 */
export interface BusinessProfile {
  id: string;
  name: string;
  description?: string;
  industry: string;
  specialty?: string;
  phone: string;
  email?: string;
  website: string;
  logoUrl?: string;
  foundingDate?: string;
  socialProfiles?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    youtube?: string;
  };
}

/**
 * Location type used internally.
 * Maps to PostalAddress and GeoCoordinates.
 */
export interface Location {
  id: string;
  name: string;
  slug: string;
  address: {
    street: string;
    street2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  coordinates?: {
    lat: number;
    lng: number;
  };
  phone: string;
  email?: string;
  hours?: {
    [day: string]: { open: string; close: string; closed?: boolean };
  };
  serviceAreas?: string[];
}

/**
 * Team member type used internally.
 * Maps to PersonSchema.
 */
export interface TeamMember {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  title: string;
  bio?: string;
  imageUrl?: string;
  email?: string;
  phone?: string;
  credentials?: string[];
  education?: Array<{ institution: string; degree: string; year?: number }>;
  specialties?: string[];
  socialProfiles?: {
    linkedin?: string;
    twitter?: string;
  };
}

/**
 * Article type used internally.
 * Maps to ArticleSchema.
 */
export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  publishedAt: string;
  updatedAt: string;
  authorId: string;
  reviewerId?: string;
  category?: string;
  tags?: string[];
  imageUrl?: string;
  wordCount?: number;
  citations?: Array<{ url: string; title: string }>;
}

/**
 * FAQ type used internally.
 * Maps to Question in FAQPageSchema.
 */
export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
  order?: number;
}

/**
 * Healthcare SEO Module - TypeScript Type Definitions
 *
 * This file contains all type definitions for the healthcare module including:
 * - Database types (matching Supabase schema)
 * - Schema.org types for structured data
 * - Component props types
 * - API request/response types
 * - Builder types
 */

// ============================================================================
// DATABASE TYPES (matching Supabase schema)
// ============================================================================

/** Medical practice specialty types */
export type MedicalSpecialtyType =
  | 'mens_health'
  | 'dermatology'
  | 'dental'
  | 'med_spa'
  | 'chiropractic'
  | 'physical_therapy'
  | 'weight_loss'
  | 'aesthetic';

/** Service category types */
export type ServiceCategory =
  | 'sexual_health'
  | 'hormone'
  | 'weight'
  | 'hair'
  | 'aesthetics'
  | 'preventive'
  | 'pain'
  | 'dental';

/** Content status types */
export type ContentStatus = 'draft' | 'review' | 'published';

/** SEO landing page types */
export type LandingPageType =
  | 'symptom'
  | 'near_me'
  | 'comparison'
  | 'cost'
  | 'condition_location';

/** Testimonial source types */
export type TestimonialSource = 'google' | 'healthgrades' | 'internal' | 'facebook' | 'yelp';

/** Business hours structure */
export interface BusinessHours {
  monday?: DayHours;
  tuesday?: DayHours;
  wednesday?: DayHours;
  thursday?: DayHours;
  friday?: DayHours;
  saturday?: DayHours;
  sunday?: DayHours;
}

export interface DayHours {
  open: string;
  close: string;
  closed?: boolean;
}

export interface HolidayHours {
  date: string;
  name: string;
  hours?: DayHours;
  closed?: boolean;
}

/** Citation structure for articles */
export interface Citation {
  url: string;
  title: string;
  source: string;
  accessedDate?: string;
  authors?: string[];
  publishedDate?: string;
  doi?: string;
}

/** Education entry for physician profiles */
export interface EducationEntry {
  institution: string;
  degree: string;
  year?: number;
  field?: string;
}

/** Certification entry for physician profiles */
export interface CertificationEntry {
  name: string;
  issuer: string;
  year?: number;
  expirationYear?: number;
  credentialId?: string;
}

/** Hero section configuration */
export interface HeroSection {
  headline?: string;
  subheadline?: string;
  backgroundImage?: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
}

/** FAQ item structure */
export interface FAQItem {
  question: string;
  answer: string;
}

// ============================================================================
// DATABASE ENTITY TYPES
// ============================================================================

/** Medical practice entity */
export interface MedicalPractice {
  id: string;
  projectId: string;
  name: string;
  specialty?: MedicalSpecialtyType;
  npiNumber?: string;
  medicalDirectorName?: string;
  medicalDirectorCredentials?: string;
  medicalDirectorImageUrl?: string;
  medicalDirectorBio?: string;
  yearEstablished?: number;
  accreditations?: string[];
  createdAt: string;
  updatedAt: string;
}

/** Practice location entity */
export interface PracticeLocation {
  id: string;
  practiceId: string;
  name: string;
  slug: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  stateFull?: string;
  zip: string;
  country: string;
  phone: string;
  fax?: string;
  email?: string;
  googleMapsEmbed?: string;
  googleBusinessUrl?: string;
  googlePlaceId?: string;
  latitude?: number;
  longitude?: number;
  serviceAreas?: string[];
  hours?: BusinessHours;
  holidayHours?: HolidayHours[];
  isPrimary: boolean;
  acceptsNewPatients: boolean;
  parkingInfo?: string;
  accessibilityInfo?: string;
  createdAt: string;
  updatedAt: string;
}

/** Medical service entity */
export interface MedicalService {
  id: string;
  practiceId: string;
  name: string;
  slug: string;
  shortName?: string;
  category?: ServiceCategory;
  parentServiceId?: string;
  description?: string;
  shortDescription?: string;
  benefits?: string[];
  idealCandidate?: string;
  procedureOverview?: string;
  recoveryTime?: string;
  resultsTimeline?: string;
  priceFrom?: number;
  priceTo?: number;
  priceNote?: string;
  duration?: string;
  icon?: string;
  heroImageUrl?: string;
  galleryImages?: string[];
  isFeatured: boolean;
  displayOrder: number;
  metaTitle?: string;
  metaDescription?: string;
  schemaType?: string;
  medicalSpecialty?: string;
  createdAt: string;
  updatedAt: string;
}

/** Treatment option entity */
export interface TreatmentOption {
  id: string;
  serviceId: string;
  name: string;
  slug: string;
  description?: string;
  howItWorks?: string;
  benefits?: string[];
  sideEffects?: string[];
  contraindications?: string[];
  sessionCount?: string;
  sessionDuration?: string;
  priceFrom?: number;
  priceTo?: number;
  fdaApproved: boolean;
  displayOrder: number;
  createdAt: string;
}

/** Location service junction entity */
export interface LocationService {
  id: string;
  locationId: string;
  serviceId: string;
  isAvailable: boolean;
  localPhone?: string;
  localPriceFrom?: number;
  localPriceTo?: number;
  waitTime?: string;
  createdAt: string;
}

/** Health article entity */
export interface HealthArticle {
  id: string;
  practiceId: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImageUrl?: string;
  featuredImageAlt?: string;
  authorName?: string;
  authorCredentials?: string;
  authorImageUrl?: string;
  authorBio?: string;
  medicalReviewerName?: string;
  medicalReviewerCredentials?: string;
  medicalReviewerImageUrl?: string;
  citations: Citation[];
  relatedServices?: string[];
  relatedArticles?: string[];
  category?: string;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  wordCount?: number;
  readingTime?: number;
  status: ContentStatus;
  publishedAt?: string;
  lastReviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

/** Article FAQ entity */
export interface ArticleFAQ {
  id: string;
  articleId: string;
  question: string;
  answer: string;
  displayOrder: number;
  createdAt: string;
}

/** SEO landing page entity */
export interface SEOLandingPage {
  id: string;
  practiceId: string;
  pageType: LandingPageType;
  title: string;
  slug: string;
  h1Heading?: string;
  targetKeywords?: string[];
  secondaryKeywords?: string[];
  content?: string;
  heroSection?: HeroSection;
  relatedServices?: string[];
  targetLocations?: string[];
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  noindex: boolean;
  status: ContentStatus;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

/** Testimonial entity */
export interface Testimonial {
  id: string;
  practiceId: string;
  locationId?: string;
  serviceId?: string;
  patientName: string;
  patientInitials?: string;
  patientLocation?: string;
  patientImageUrl?: string;
  rating: number;
  title?: string;
  content: string;
  treatmentReceived?: string;
  verified: boolean;
  source?: TestimonialSource;
  sourceUrl?: string;
  displayOnHomepage: boolean;
  displayOrder: number;
  publishedAt?: string;
  createdAt: string;
}

/** Physician profile entity */
export interface PhysicianProfile {
  id: string;
  practiceId: string;
  name: string;
  slug: string;
  credentials?: string;
  title?: string;
  specialties?: string[];
  bio?: string;
  education?: EducationEntry[];
  certifications?: CertificationEntry[];
  memberships?: string[];
  imageUrl?: string;
  acceptingPatients: boolean;
  locations?: string[];
  services?: string[];
  yearsExperience?: number;
  languages: string[];
  npiNumber?: string;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

/** Location service page entity */
export interface LocationServicePage {
  id: string;
  locationId: string;
  serviceId: string;
  slug: string;
  h1Heading?: string;
  content?: string;
  faqs: FAQItem[];
  metaTitle?: string;
  metaDescription?: string;
  schemaData?: Record<string, unknown>;
  status: ContentStatus;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// SCHEMA.ORG TYPES
// ============================================================================

/** Base Thing type for schema.org */
export interface SchemaThing {
  '@type': string;
  name?: string;
  description?: string;
  url?: string;
  image?: string | string[];
}

/** Postal address for schema.org */
export interface SchemaPostalAddress {
  '@type': 'PostalAddress';
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: string;
}

/** Geo coordinates for schema.org */
export interface SchemaGeoCoordinates {
  '@type': 'GeoCoordinates';
  latitude: number;
  longitude: number;
}

/** Opening hours specification */
export interface SchemaOpeningHoursSpecification {
  '@type': 'OpeningHoursSpecification';
  dayOfWeek: string | string[];
  opens: string;
  closes: string;
}

/** Contact point for schema.org */
export interface SchemaContactPoint {
  '@type': 'ContactPoint';
  telephone: string;
  contactType: string;
  areaServed?: string | string[];
  availableLanguage?: string | string[];
}

/** Person for schema.org */
export interface SchemaPerson {
  '@type': 'Person';
  name: string;
  image?: string;
  jobTitle?: string;
  description?: string;
  url?: string;
  sameAs?: string[];
  worksFor?: SchemaOrganization;
  alumniOf?: SchemaEducationalOrganization[];
  hasCredential?: SchemaCredential[];
}

/** Organization for schema.org */
export interface SchemaOrganization {
  '@type': 'Organization' | 'MedicalOrganization' | 'MedicalBusiness';
  name: string;
  url?: string;
  logo?: string;
  image?: string;
  description?: string;
  telephone?: string;
  email?: string;
  address?: SchemaPostalAddress;
  contactPoint?: SchemaContactPoint[];
  sameAs?: string[];
  foundingDate?: string;
  founder?: SchemaPerson[];
}

/** Educational organization for schema.org */
export interface SchemaEducationalOrganization {
  '@type': 'EducationalOrganization' | 'CollegeOrUniversity';
  name: string;
  url?: string;
}

/** Credential for schema.org */
export interface SchemaCredential {
  '@type': 'EducationalOccupationalCredential';
  credentialCategory: string;
  name: string;
  recognizedBy?: SchemaOrganization;
}

/** Aggregate rating for schema.org */
export interface SchemaAggregateRating {
  '@type': 'AggregateRating';
  ratingValue: number;
  reviewCount: number;
  bestRating?: number;
  worstRating?: number;
}

/** Review for schema.org */
export interface SchemaReview {
  '@type': 'Review';
  author: SchemaPerson | string;
  datePublished: string;
  reviewBody: string;
  reviewRating: {
    '@type': 'Rating';
    ratingValue: number;
    bestRating?: number;
    worstRating?: number;
  };
  itemReviewed?: SchemaThing;
}

/** Local business schema */
export interface LocalBusinessSchema extends SchemaThing {
  '@type': 'LocalBusiness' | 'MedicalBusiness' | 'MedicalClinic' | 'Physician' | 'Dentist';
  '@context': 'https://schema.org';
  name: string;
  address: SchemaPostalAddress;
  telephone: string;
  email?: string;
  url: string;
  image?: string;
  logo?: string;
  geo?: SchemaGeoCoordinates;
  openingHoursSpecification?: SchemaOpeningHoursSpecification[];
  priceRange?: string;
  areaServed?: string[];
  aggregateRating?: SchemaAggregateRating;
  review?: SchemaReview[];
  sameAs?: string[];
  medicalSpecialty?: string[];
}

/** Medical business schema */
export interface MedicalBusinessSchema extends LocalBusinessSchema {
  '@type': 'MedicalBusiness' | 'MedicalClinic';
  medicalSpecialty: string[];
  availableService?: SchemaMedicalProcedure[];
  isAcceptingNewPatients?: boolean;
  hasCredential?: SchemaCredential[];
}

/** Physician schema */
export interface PhysicianSchema extends Omit<SchemaPerson, '@type'> {
  '@context': 'https://schema.org';
  '@type': 'Physician';
  medicalSpecialty: string[];
  worksFor: SchemaOrganization;
  availableService?: SchemaService[];
  aggregateRating?: SchemaAggregateRating;
}

/** FAQ page schema */
export interface FAQPageSchema {
  '@context': 'https://schema.org';
  '@type': 'FAQPage';
  mainEntity: SchemaQuestion[];
}

/** Question for FAQ schema */
export interface SchemaQuestion {
  '@type': 'Question';
  name: string;
  acceptedAnswer: {
    '@type': 'Answer';
    text: string;
  };
}

/** Article schema */
export interface ArticleSchema {
  '@context': 'https://schema.org';
  '@type': 'Article' | 'MedicalWebPage' | 'HealthTopicContent';
  headline: string;
  description: string;
  image: string | string[];
  datePublished: string;
  dateModified: string;
  author: SchemaPerson | SchemaOrganization;
  publisher: SchemaOrganization;
  mainEntityOfPage: string;
  wordCount?: number;
  articleSection?: string;
  speakable?: SchemaSpeakable;
}

/** Speakable specification */
export interface SchemaSpeakable {
  '@type': 'SpeakableSpecification';
  cssSelector?: string[];
  xpath?: string[];
}

/** Breadcrumb schema */
export interface BreadcrumbSchema {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: SchemaBreadcrumbItem[];
}

/** Breadcrumb item */
export interface SchemaBreadcrumbItem {
  '@type': 'ListItem';
  position: number;
  name: string;
  item?: string;
}

/** Service schema */
export interface SchemaService {
  '@type': 'Service' | 'MedicalProcedure' | 'MedicalTherapy';
  name: string;
  description?: string;
  provider?: SchemaOrganization;
  serviceType?: string;
  areaServed?: string[];
  offers?: SchemaOffer;
}

/** Medical procedure schema */
export interface SchemaMedicalProcedure {
  '@type': 'MedicalProcedure' | 'SurgicalProcedure' | 'DiagnosticProcedure' | 'TherapeuticProcedure';
  name: string;
  description?: string;
  procedureType?: 'Surgical' | 'NoninvasiveProcedure' | 'PercutaneousProcedure';
  bodyLocation?: string;
  followup?: string;
  howPerformed?: string;
  preparation?: string;
  status?: 'EventScheduled' | 'EventCancelled' | 'EventPostponed' | 'EventRescheduled';
}

/** Offer schema */
export interface SchemaOffer {
  '@type': 'Offer';
  name?: string;
  description?: string;
  price: string;
  priceCurrency: string;
  priceValidUntil?: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder' | 'LimitedAvailability';
  url?: string;
}

/** Website schema */
export interface WebsiteSchema {
  '@context': 'https://schema.org';
  '@type': 'WebSite';
  name: string;
  url: string;
  potentialAction?: SchemaSearchAction;
}

/** Search action schema */
export interface SchemaSearchAction {
  '@type': 'SearchAction';
  target: string;
  'query-input': string;
}

// ============================================================================
// COMPONENT PROPS TYPES
// ============================================================================

/** E-E-A-T badge variant types */
export type EEATBadgeVariant = 'badge' | 'card' | 'inline';

/** E-E-A-T badge props */
export interface EEATBadgeProps {
  name: string;
  credentials: string;
  title?: string;
  imageUrl?: string;
  reviewDate: string;
  institutionalAffiliation?: string;
  npiNumber?: string;
  variant?: EEATBadgeVariant;
  profileUrl?: string;
}

/** Medical reviewer props */
export interface MedicalReviewerProps extends EEATBadgeProps {
  showVerifiedBadge?: boolean;
}

/** Citation display props */
export interface CitationProps {
  citations: Citation[];
  variant?: 'footnotes' | 'sidebar' | 'endnotes';
  showAccessedDate?: boolean;
}

/** Source quality indicator types */
export type SourceQualityType =
  | 'peer_reviewed'
  | 'government'
  | 'medical_institution'
  | 'news'
  | 'other';

/** Source quality indicator props */
export interface SourceQualityIndicatorProps {
  sourceType: SourceQualityType;
  sourceName: string;
}

/** Local SEO card props */
export interface LocalSEOCardProps {
  location: PracticeLocation;
  variant?: 'card' | 'compact' | 'hero';
  showMap?: boolean;
  showHours?: boolean;
  showServices?: boolean;
  showDirectionsButton?: boolean;
  showCallButton?: boolean;
}

/** Service schema component props */
export interface ServiceSchemaProps {
  service: MedicalService;
  practice: MedicalPractice;
  includeOffers?: boolean;
}

/** Location card props */
export interface LocationCardProps {
  location: PracticeLocation;
  variant?: 'card' | 'compact' | 'hero';
  showMap?: boolean;
  showHours?: boolean;
  showServices?: boolean;
  showDirectionsButton?: boolean;
  showCallButton?: boolean;
}

/** Location hero props */
export interface LocationHeroProps {
  location: PracticeLocation;
  service?: MedicalService;
  backgroundImage?: string;
  showBookingCTA?: boolean;
  showPhoneNumber?: boolean;
}

/** Testimonial display props */
export interface TestimonialDisplayProps {
  testimonials: Testimonial[];
  locationName?: string;
  maxDisplay?: number;
  variant?: 'carousel' | 'grid' | 'list';
  showRatingStars?: boolean;
}

/** Article card props */
export interface ArticleCardProps {
  article: HealthArticle;
  variant?: 'full' | 'compact' | 'horizontal';
  showExcerpt?: boolean;
  showReadTime?: boolean;
  showCategory?: boolean;
}

/** Author bio props */
export interface AuthorBioProps {
  name: string;
  credentials: string;
  imageUrl?: string;
  bio: string;
  role: string;
  socialLinks?: Array<{ platform: string; url: string }>;
  articlesWritten?: number;
  yearsExperience?: number;
  specialties?: string[];
}

// ============================================================================
// API REQUEST/RESPONSE TYPES
// ============================================================================

/** Generate local pages request */
export interface GenerateLocalPagesRequest {
  projectId: string;
  locationIds?: string[];
  serviceIds?: string[];
  overwrite?: boolean;
}

/** Generate local pages response */
export interface GenerateLocalPagesResponse {
  success: boolean;
  pagesGenerated: number;
  pages: Array<{
    locationId: string;
    serviceId: string;
    slug: string;
    status: 'created' | 'updated' | 'skipped';
  }>;
  errors?: Array<{
    locationId: string;
    serviceId: string;
    error: string;
  }>;
}

/** Generate article request */
export interface GenerateArticleRequest {
  projectId: string;
  topic: string;
  targetKeywords: string[];
  articleType: 'educational' | 'condition' | 'treatment' | 'comparison' | 'guide';
  wordCount?: number;
  relatedServices?: string[];
  customInstructions?: string;
}

/** Generate article response */
export interface GenerateArticleResponse {
  success: boolean;
  article: {
    id: string;
    title: string;
    slug: string;
    content: string;
    metaTitle: string;
    metaDescription: string;
    faqs: FAQItem[];
    suggestedCitations: Citation[];
  };
}

/** Generate landing page request */
export interface GenerateLandingPageRequest {
  projectId: string;
  pageType: LandingPageType;
  title: string;
  targetKeywords: string[];
  relatedServices?: string[];
  targetLocations?: string[];
  customInstructions?: string;
}

/** Generate landing page response */
export interface GenerateLandingPageResponse {
  success: boolean;
  page: {
    id: string;
    slug: string;
    h1: string;
    content: string;
    metaTitle: string;
    metaDescription: string;
    faqs: FAQItem[];
  };
}

/** Generate FAQs request */
export interface GenerateFAQsRequest {
  projectId: string;
  topic: string;
  pageType: string;
  count?: number;
  existingFaqs?: string[];
}

/** Generate FAQs response */
export interface GenerateFAQsResponse {
  success: boolean;
  faqs: FAQItem[];
}

/** Generate schema request */
export interface GenerateSchemaRequest {
  projectId: string;
  pageType: 'location' | 'service' | 'article' | 'physician' | 'faq' | 'testimonials';
  pageId: string;
  additionalData?: Record<string, unknown>;
}

/** Generate schema response */
export interface GenerateSchemaResponse {
  success: boolean;
  schema: Record<string, unknown>;
}

/** SEO issue severity */
export type SEOIssueSeverity = 'critical' | 'warning' | 'info';

/** SEO issue category */
export type SEOIssueCategory = 'technical' | 'content' | 'local_seo' | 'schema' | 'eeat';

/** SEO issue impact level */
export type SEOIssueImpact = 'high' | 'medium' | 'low';

/** SEO issue effort level */
export type SEOIssueEffort = 'low' | 'medium' | 'high';

/** SEO issue */
export interface SEOIssue {
  id: string;
  type: SEOIssueSeverity;
  category: SEOIssueCategory;
  code: string;
  title: string;
  description: string;
  affectedPages: string[];
  howToFix: string;
  autoFixAvailable: boolean;
  autoFixAction?: string;
  impact: SEOIssueImpact;
  effort: SEOIssueEffort;
  learnMoreUrl?: string;
}

/** SEO category result */
export interface SEOCategoryResult {
  score: number;
  weight: number;
  passed: number;
  failed: number;
  warnings: number;
  issues: SEOIssue[];
}

/** SEO recommendation */
export interface SEORecommendation {
  priority: number;
  title: string;
  description: string;
  expectedImpact: string;
  relatedIssues: string[];
}

/** SEO audit result */
export interface SEOAuditResult {
  score: number;
  timestamp: string;
  projectId: string;
  breakdown: {
    technical: SEOCategoryResult;
    content: SEOCategoryResult;
    localSeo: SEOCategoryResult;
    schema: SEOCategoryResult;
    eeat: SEOCategoryResult;
  };
  issues: SEOIssue[];
  recommendations: SEORecommendation[];
}

/** SEO audit request */
export interface SEOAuditRequest {
  projectId: string;
  scope?: ('full' | 'technical' | 'content' | 'local' | 'schema' | 'eeat')[];
}

/** Auto-fix request */
export interface AutoFixRequest {
  projectId: string;
  issueIds: string[];
}

/** Auto-fix response */
export interface AutoFixResponse {
  success: boolean;
  fixed: string[];
  failed: Array<{
    issueId: string;
    error: string;
  }>;
}

// ============================================================================
// BUILDER TYPES
// ============================================================================

/** Healthcare quick action */
export interface HealthcareQuickAction {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'local_seo' | 'content' | 'schema' | 'eeat' | 'audit';
  variables?: Array<{
    name: string;
    type: 'string' | 'number' | 'boolean' | 'select';
    label: string;
    placeholder?: string;
    options?: string[];
    required?: boolean;
  }>;
  action: string;
  endpoint?: string;
  requiresConfirmation?: boolean;
  estimatedTime?: string;
}

/** Local SEO page generation request */
export interface LocalSEOPageGenerationRequest {
  practiceId: string;
  locationId: string;
  serviceId: string;
  locationName: string;
  locationCity: string;
  locationState: string;
  serviceName: string;
  serviceSlug: string;
}

/** Healthcare template */
export interface HealthcareTemplate {
  id: string;
  name: string;
  description: string;
  industry: 'healthcare';
  subCategory: MedicalSpecialtyType;
  thumbnail: string;
  demoUrl?: string;
  features: string[];
  defaultServices: Array<{
    name: string;
    slug: string;
    category: ServiceCategory;
    treatments?: string[];
  }>;
  pages: Array<{
    path: string;
    name: string;
    description: string;
  }>;
  schemaTypes: string[];
  requiredIntegrations: string[];
  optionalIntegrations: string[];
  setupWizard: Array<{
    step: number;
    title: string;
    fields: string[];
    minimum?: number;
    canAddCustom?: boolean;
  }>;
}

/** Content generation prompt params */
export interface ContentGenerationParams {
  businessName: string;
  businessInfo: {
    name: string;
    specialty: string;
    phone: string;
    address: string;
    city: string;
    state: string;
  };
  medicalReviewer?: PhysicianProfile;
  existingContent?: string[];
}

/** Local SEO page params */
export interface LocalSEOPageParams extends ContentGenerationParams {
  locationData: PracticeLocation;
  serviceData: MedicalService;
}

/** Health article params */
export interface HealthArticleParams extends ContentGenerationParams {
  topic: string;
  targetKeywords: string[];
  articleType: 'educational' | 'condition' | 'treatment' | 'comparison' | 'guide';
  wordCount: number;
  existingArticles?: string[];
}

/** Symptom page params */
export interface SymptomPageParams extends ContentGenerationParams {
  symptom: string;
  relatedConditions: string[];
  relatedTreatments: MedicalService[];
  targetKeywords: string[];
}

/** Comparison page params */
export interface ComparisonPageParams extends ContentGenerationParams {
  treatment1: TreatmentOption;
  treatment2: TreatmentOption;
  targetKeywords: string[];
}

/** Cost page params */
export interface CostPageParams extends ContentGenerationParams {
  service: MedicalService;
  priceRange: { min: number; max: number };
  factors: string[];
  financingOptions?: string[];
}

/** FAQ generation params */
export interface FAQGenerationParams {
  topic: string;
  pageType: string;
  existingFaqs?: string[];
  count: number;
  targetKeywords?: string[];
}

/** Schema generation params */
export interface SchemaGenerationParams {
  pageType: 'location' | 'service' | 'article' | 'physician' | 'faq';
  pageData: Record<string, unknown>;
  businessInfo: ContentGenerationParams['businessInfo'];
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/** Database record with timestamps */
export interface WithTimestamps {
  createdAt: string;
  updatedAt: string;
}

/** Paginated response */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** API error response */
export interface APIErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

/** API success response */
export interface APISuccessResponse<T> {
  success: true;
  data: T;
}

/** Generic API response */
export type APIResponse<T> = APISuccessResponse<T> | APIErrorResponse;

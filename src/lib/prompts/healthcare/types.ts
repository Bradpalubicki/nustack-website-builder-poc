/**
 * Healthcare Prompt Types
 *
 * TypeScript interfaces for all AI prompt parameters.
 */

import type { PracticeLocation, MedicalService, TreatmentOption, PhysicianProfile } from '@/types/healthcare';

/**
 * Business information for prompts
 */
export interface BusinessInfo {
  name: string;
  specialty: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  stateFull?: string;
  yearEstablished?: number;
  medicalDirectorName?: string;
  medicalDirectorCredentials?: string;
}

/**
 * Base parameters for content generation
 */
export interface ContentGenerationParams {
  businessInfo: BusinessInfo;
  medicalReviewer?: PhysicianProfile;
  existingContent?: string[];
}

/**
 * Parameters for local SEO page generation
 */
export interface LocalSeoPageParams extends ContentGenerationParams {
  locationData: PracticeLocation;
  serviceData: MedicalService;
}

/**
 * Article types for health content
 */
export type HealthArticleType = 'educational' | 'condition' | 'treatment' | 'comparison' | 'guide';

/**
 * Parameters for health article generation
 */
export interface HealthArticleParams extends ContentGenerationParams {
  topic: string;
  targetKeywords: string[];
  articleType: HealthArticleType;
  wordCount: number;
  existingArticles?: string[];
}

/**
 * Parameters for symptom landing page generation
 */
export interface SymptomPageParams extends ContentGenerationParams {
  symptom: string;
  relatedConditions: string[];
  relatedTreatments: MedicalService[];
  targetKeywords: string[];
}

/**
 * Parameters for comparison page generation
 */
export interface ComparisonPageParams extends ContentGenerationParams {
  treatment1: TreatmentOption;
  treatment2: TreatmentOption;
  targetKeywords: string[];
}

/**
 * Parameters for cost page generation
 */
export interface CostPageParams extends ContentGenerationParams {
  service: MedicalService;
  priceRange: { min: number; max: number };
  factors: string[];
  financingOptions?: string[];
}

/**
 * Parameters for FAQ generation
 */
export interface FaqParams {
  topic: string;
  pageType: string;
  existingFaqs?: string[];
  count: number;
  targetKeywords?: string[];
}

/**
 * Page types for schema generation
 */
export type SchemaPageType = 'location' | 'service' | 'article' | 'physician' | 'faq';

/**
 * Parameters for schema generation
 */
export interface SchemaParams {
  pageType: SchemaPageType;
  pageData: Record<string, unknown>;
  businessInfo: BusinessInfo;
}

/**
 * Generated content result
 */
export interface GeneratedContent {
  title?: string;
  metaTitle: string;
  metaDescription: string;
  h1?: string;
  content: string;
  faqs?: Array<{ question: string; answer: string }>;
  suggestedCitations?: Array<{ title: string; source: string; url: string }>;
  internalLinks?: Array<{ text: string; url: string }>;
}

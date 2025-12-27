/**
 * SEO Module Exports
 *
 * Comprehensive SEO toolkit including:
 * - Core Web Vitals optimization
 * - Schema.org structured data
 * - AI Search Optimization (GEO)
 * - Local SEO Engine
 * - E-E-A-T compliance
 */

// Performance utilities (Core Web Vitals)
export * from './performance';

// Schema markup engine
export * from './schema';

// AI Search Optimization (GEO)
export * from './ai-search';

// Local SEO Engine (excluding conflicting exports)
export {
  // Aggregators
  PRIMARY_AGGREGATORS,
  SECONDARY_AGGREGATORS,
  INDUSTRY_AGGREGATORS,
  ALL_AGGREGATORS,
  getAggregatorsByTier,
  getAggregatorsByCategory,
  getAggregatorsForIndustry,
  getFreeAggregators,
  getPriorityAggregators,
  calculateCoverageScore,
  generateSubmissionChecklist,
  // NAP Manager
  normalizeName,
  normalizeAddress,
  normalizePhone,
  formatPhone,
  formatAddress,
  compareNames,
  compareAddresses,
  comparePhones,
  validateNAP,
  analyzeCitation,
  generateAuditResult,
  generateSchemaOrgNAP,
  // Service Area Generator
  generateLocationSlug,
  generatePageUrl,
  generateMetaTitle,
  generateMetaDescription,
  generateH1,
  generateIntro,
  generateServicesSection,
  generateNeighborhoodsSection,
  generateWhyChooseSection,
  generateServiceAreaPage,
  generateBatchPages,
  calculateAreaPriority,
  sortByPriority,
  // GBP Config
  GBP_CATEGORY_MAPPING,
  GBP_ATTRIBUTES,
  GBP_POST_TEMPLATES,
  calculateOptimizationScore,
  generateGBPDescription,
  getRecommendedCategories,
  getRecommendedAttributes,
} from './local';

// Re-export types from local (no conflicts)
export type {
  AggregatorTier,
  AggregatorCategory,
  DataAggregator,
  AggregatorSubmission,
  BusinessName,
  Address,
  PhoneNumber,
  NAPData,
  BusinessHours,
  DayHours,
  NAPCitation,
  NAPIssue,
  NAPAuditResult,
  ServiceArea,
  Service,
  ServiceAreaPageConfig,
  GeneratedPage,
  BatchGenerationResult,
  GBPCategory,
  GBPAttribute,
  GBPPostType,
  GBPPost,
  GBPOptimizationScore,
  GBPRecommendation,
  GBPConfig,
} from './local';

// E-E-A-T requirements
export * from './eeat';

// SEO Audit Engine
export * from './audit';

/**
 * SEO Audit Module
 *
 * Comprehensive SEO auditing for healthcare websites.
 */

// Types
export * from './types';

// Scoring
export {
  CATEGORY_WEIGHTS,
  SEVERITY_DEDUCTIONS,
  calculateCategoryScore,
  calculateCategoryResult,
  calculateOverallScore,
  getScoreGrade,
  getScoreColorClass,
  getSeverityClass,
} from './scoring';

/**
 * SEO Audit Scoring
 *
 * Score calculation logic for SEO audits.
 */

import type { CategoryResult, SEOIssue, SEOIssueSeverity } from './types';

/**
 * Category weights for overall score calculation
 */
export const CATEGORY_WEIGHTS = {
  technical: 0.25,
  content: 0.25,
  localSeo: 0.25,
  schema: 0.15,
  eeat: 0.10,
} as const;

/**
 * Point deductions per issue severity
 */
export const SEVERITY_DEDUCTIONS = {
  critical: 10,
  warning: 5,
  info: 1,
} as const;

/**
 * Calculate score for a category based on issues
 */
export function calculateCategoryScore(issues: SEOIssue[], totalChecks: number): number {
  let score = 100;

  for (const issue of issues) {
    score -= SEVERITY_DEDUCTIONS[issue.type];
  }

  // Ensure score doesn't go below 0
  return Math.max(0, score);
}

/**
 * Calculate category result from issues
 */
export function calculateCategoryResult(
  issues: SEOIssue[],
  totalChecks: number,
  weight: number
): CategoryResult {
  const score = calculateCategoryScore(issues, totalChecks);
  const failed = issues.filter((i) => i.type === 'critical').length;
  const warnings = issues.filter((i) => i.type === 'warning').length;
  const passed = totalChecks - failed - warnings;

  return {
    score,
    weight,
    passed: Math.max(0, passed),
    failed,
    warnings,
    issues,
  };
}

/**
 * Calculate overall score from category results
 */
export function calculateOverallScore(breakdown: {
  technical: CategoryResult;
  content: CategoryResult;
  localSeo: CategoryResult;
  schema: CategoryResult;
  eeat: CategoryResult;
}): number {
  const weightedScore =
    breakdown.technical.score * CATEGORY_WEIGHTS.technical +
    breakdown.content.score * CATEGORY_WEIGHTS.content +
    breakdown.localSeo.score * CATEGORY_WEIGHTS.localSeo +
    breakdown.schema.score * CATEGORY_WEIGHTS.schema +
    breakdown.eeat.score * CATEGORY_WEIGHTS.eeat;

  return Math.round(weightedScore);
}

/**
 * Get score grade based on numeric score
 */
export function getScoreGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

/**
 * Get score color class based on numeric score
 */
export function getScoreColorClass(score: number): string {
  if (score >= 90) return 'text-green-600 bg-green-100';
  if (score >= 80) return 'text-blue-600 bg-blue-100';
  if (score >= 70) return 'text-yellow-600 bg-yellow-100';
  if (score >= 60) return 'text-orange-600 bg-orange-100';
  return 'text-red-600 bg-red-100';
}

/**
 * Get severity badge class
 */
export function getSeverityClass(severity: SEOIssueSeverity): string {
  switch (severity) {
    case 'critical':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'warning':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'info':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

/**
 * SEO Audit Types
 *
 * TypeScript interfaces for the SEO audit system.
 */

/**
 * SEO issue severity levels
 */
export type SEOIssueSeverity = 'critical' | 'warning' | 'info';

/**
 * SEO issue categories
 */
export type SEOIssueCategory = 'technical' | 'content' | 'local_seo' | 'schema' | 'eeat';

/**
 * Impact level for issues
 */
export type ImpactLevel = 'high' | 'medium' | 'low';

/**
 * Effort level for fixes
 */
export type EffortLevel = 'low' | 'medium' | 'high';

/**
 * Individual SEO issue
 */
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
  impact: ImpactLevel;
  effort: EffortLevel;
  learnMoreUrl?: string;
}

/**
 * Category-specific audit result
 */
export interface CategoryResult {
  score: number;
  weight: number;
  passed: number;
  failed: number;
  warnings: number;
  issues: SEOIssue[];
}

/**
 * Prioritized recommendation
 */
export interface Recommendation {
  priority: number;
  title: string;
  description: string;
  expectedImpact: string;
  relatedIssues: string[];
}

/**
 * Complete SEO audit result
 */
export interface SEOAuditResult {
  score: number;
  timestamp: Date;
  projectId: string;
  breakdown: {
    technical: CategoryResult;
    content: CategoryResult;
    localSeo: CategoryResult;
    schema: CategoryResult;
    eeat: CategoryResult;
  };
  issues: SEOIssue[];
  recommendations: Recommendation[];
}

/**
 * Page data for auditing
 */
export interface PageData {
  url: string;
  path: string;
  title?: string;
  metaTitle?: string;
  metaDescription?: string;
  h1?: string;
  content?: string;
  wordCount?: number;
  images?: Array<{ src: string; alt?: string }>;
  internalLinks?: string[];
  externalLinks?: string[];
  schema?: Record<string, unknown>[];
  hasNAP?: boolean;
  hasFAQ?: boolean;
  hasMedicalReviewer?: boolean;
  lastUpdated?: Date;
}

/**
 * Check function result
 */
export interface CheckResult {
  passed: boolean;
  issue?: Omit<SEOIssue, 'id'>;
}

/**
 * Check function type
 */
export type CheckFunction = (pages: PageData[]) => CheckResult[];

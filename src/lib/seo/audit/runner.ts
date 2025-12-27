/**
 * SEO Audit Runner
 *
 * Executes audit checks and collects results.
 */

import {
  AllChecks,
  AuditCheck,
  AuditContext,
  CheckResult,
  AuditCheckCategory,
  getChecksByCategory,
  getCheckCategories,
} from './checks';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface AuditCheckResult extends CheckResult {
  /** Check ID */
  checkId: string;
  /** Check name */
  checkName: string;
  /** Check category */
  category: AuditCheckCategory;
  /** Check weight */
  weight: number;
  /** Check severity */
  severity: 'critical' | 'warning' | 'info';
  /** How to fix */
  fix?: string;
  /** Execution time in ms */
  executionTime: number;
}

export interface CategoryResults {
  /** Category name */
  category: AuditCheckCategory;
  /** Results for this category */
  results: AuditCheckResult[];
  /** Category score (0-100) */
  score: number;
  /** Number of passed checks */
  passed: number;
  /** Number of failed checks */
  failed: number;
  /** Number of warnings */
  warnings: number;
  /** Number of skipped checks */
  skipped: number;
}

export interface AuditResults {
  /** URL that was audited */
  url: string;
  /** Timestamp of the audit */
  timestamp: string;
  /** Overall score (0-100) */
  score: number;
  /** Overall status */
  status: 'pass' | 'fail' | 'warning';
  /** Results by category */
  categories: Record<AuditCheckCategory, CategoryResults>;
  /** All individual check results */
  checks: AuditCheckResult[];
  /** Summary statistics */
  summary: {
    total: number;
    passed: number;
    failed: number;
    warnings: number;
    skipped: number;
    critical: number;
  };
  /** Execution metadata */
  meta: {
    totalExecutionTime: number;
    checksRun: number;
    checksSkipped: number;
  };
}

export interface RunnerOptions {
  /** Categories to run (default: all) */
  categories?: AuditCheckCategory[];
  /** Specific check IDs to run */
  checkIds?: string[];
  /** Whether to run local SEO checks */
  checkLocal?: boolean;
  /** Whether to run E-E-A-T checks */
  checkEEAT?: boolean;
  /** Industry for industry-specific checks */
  industry?: string;
  /** Timeout per check in ms */
  checkTimeout?: number;
}

// ============================================================================
// RUNNER CLASS
// ============================================================================

export class AuditRunner {
  private checks: AuditCheck[];
  private options: RunnerOptions;

  constructor(options: RunnerOptions = {}) {
    this.options = {
      checkLocal: true,
      checkEEAT: true,
      checkTimeout: 5000,
      ...options,
    };

    // Determine which checks to run
    if (options.checkIds && options.checkIds.length > 0) {
      this.checks = AllChecks.filter((c) => options.checkIds!.includes(c.id));
    } else if (options.categories && options.categories.length > 0) {
      this.checks = AllChecks.filter((c) => options.categories!.includes(c.category));
    } else {
      this.checks = AllChecks;
    }
  }

  /**
   * Run all configured checks against the provided context
   */
  async run(context: AuditContext): Promise<AuditResults> {
    const startTime = Date.now();
    const results: AuditCheckResult[] = [];

    // Merge options into context
    const ctx: AuditContext = {
      ...context,
      options: {
        checkLocal: this.options.checkLocal,
        checkEEAT: this.options.checkEEAT,
        industry: this.options.industry,
        ...context.options,
      },
    };

    // Run each check
    for (const check of this.checks) {
      const checkStart = Date.now();
      let result: CheckResult;

      try {
        const checkResult = check.check(ctx);
        if (checkResult instanceof Promise) {
          result = await Promise.race([
            checkResult,
            new Promise<CheckResult>((_, reject) =>
              setTimeout(
                () => reject(new Error('Check timeout')),
                this.options.checkTimeout
              )
            ),
          ]);
        } else {
          result = checkResult;
        }
      } catch (error) {
        result = {
          passed: false,
          status: 'failed',
          details: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        };
      }

      const executionTime = Date.now() - checkStart;

      results.push({
        ...result,
        checkId: check.id,
        checkName: check.name,
        category: check.category,
        weight: check.weight,
        severity: check.severity,
        fix: check.fix,
        executionTime,
      });
    }

    // Organize results by category
    const categories = this.organizeByCategory(results);

    // Calculate overall score
    const score = this.calculateOverallScore(categories);

    // Determine status
    const criticalFails = results.filter(
      (r) => r.severity === 'critical' && !r.passed && r.status !== 'skipped'
    ).length;
    const status: 'pass' | 'fail' | 'warning' =
      criticalFails > 0 ? 'fail' : score >= 70 ? 'pass' : 'warning';

    // Build summary
    const summary = {
      total: results.length,
      passed: results.filter((r) => r.passed).length,
      failed: results.filter((r) => !r.passed && r.status === 'failed').length,
      warnings: results.filter((r) => r.status === 'warning').length,
      skipped: results.filter((r) => r.status === 'skipped').length,
      critical: criticalFails,
    };

    return {
      url: context.url,
      timestamp: new Date().toISOString(),
      score,
      status,
      categories,
      checks: results,
      summary,
      meta: {
        totalExecutionTime: Date.now() - startTime,
        checksRun: results.filter((r) => r.status !== 'skipped').length,
        checksSkipped: results.filter((r) => r.status === 'skipped').length,
      },
    };
  }

  /**
   * Organize results by category with scores
   */
  private organizeByCategory(
    results: AuditCheckResult[]
  ): Record<AuditCheckCategory, CategoryResults> {
    const categories = getCheckCategories();
    const organized: Record<AuditCheckCategory, CategoryResults> = {} as any;

    for (const category of categories) {
      const categoryResults = results.filter((r) => r.category === category);
      const nonSkipped = categoryResults.filter((r) => r.status !== 'skipped');

      // Calculate weighted score for category
      let categoryScore = 100;
      if (nonSkipped.length > 0) {
        const totalWeight = nonSkipped.reduce((sum, r) => sum + r.weight, 0);
        const passedWeight = nonSkipped
          .filter((r) => r.passed)
          .reduce((sum, r) => sum + r.weight, 0);
        categoryScore = totalWeight > 0 ? Math.round((passedWeight / totalWeight) * 100) : 100;
      }

      organized[category] = {
        category,
        results: categoryResults,
        score: categoryScore,
        passed: categoryResults.filter((r) => r.passed).length,
        failed: categoryResults.filter((r) => !r.passed && r.status === 'failed').length,
        warnings: categoryResults.filter((r) => r.status === 'warning').length,
        skipped: categoryResults.filter((r) => r.status === 'skipped').length,
      };
    }

    return organized;
  }

  /**
   * Calculate overall score from category scores
   */
  private calculateOverallScore(
    categories: Record<AuditCheckCategory, CategoryResults>
  ): number {
    // Use category weights from checks.ts
    const categoryWeights: Record<AuditCheckCategory, number> = {
      technical: 0.25,
      content: 0.20,
      local: 0.15,
      schema: 0.15,
      eeat: 0.15,
      'ai-search': 0.10,
    };

    let totalWeight = 0;
    let weightedScore = 0;

    for (const [category, weight] of Object.entries(categoryWeights)) {
      const cat = category as AuditCheckCategory;
      const categoryResult = categories[cat];

      // Only count categories with non-skipped checks
      const nonSkipped = categoryResult.results.filter((r) => r.status !== 'skipped');
      if (nonSkipped.length > 0) {
        totalWeight += weight;
        weightedScore += categoryResult.score * weight;
      }
    }

    return totalWeight > 0 ? Math.round(weightedScore / totalWeight) : 100;
  }
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Run a quick audit with default options
 */
export async function runQuickAudit(
  url: string,
  html: string
): Promise<AuditResults> {
  const runner = new AuditRunner();
  return runner.run({ url, html });
}

/**
 * Run a full audit with all options
 */
export async function runFullAudit(
  url: string,
  html: string,
  options: RunnerOptions = {}
): Promise<AuditResults> {
  const runner = new AuditRunner({
    checkLocal: true,
    checkEEAT: true,
    ...options,
  });
  return runner.run({ url, html, options });
}

/**
 * Run audit for specific categories only
 */
export async function runCategoryAudit(
  url: string,
  html: string,
  categories: AuditCheckCategory[]
): Promise<AuditResults> {
  const runner = new AuditRunner({ categories });
  return runner.run({ url, html });
}

/**
 * Run audit for local business
 */
export async function runLocalBusinessAudit(
  url: string,
  html: string,
  business: AuditContext['business']
): Promise<AuditResults> {
  const runner = new AuditRunner({
    checkLocal: true,
    categories: ['technical', 'local', 'schema', 'eeat'],
  });
  return runner.run({ url, html, business });
}

/**
 * Run healthcare-specific audit
 */
export async function runHealthcareAudit(
  url: string,
  html: string
): Promise<AuditResults> {
  const runner = new AuditRunner({
    checkEEAT: true,
    industry: 'healthcare',
  });
  return runner.run({
    url,
    html,
    options: { industry: 'healthcare', checkEEAT: true },
  });
}

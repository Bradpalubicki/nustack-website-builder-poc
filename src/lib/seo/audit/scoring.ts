/**
 * SEO Audit Scoring
 *
 * Calculate and interpret SEO audit scores with grades and benchmarks.
 */

import { AuditResults, CategoryResults } from './runner';
import { AuditCheckCategory } from './checks';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type ScoreGrade = 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';

export interface ScoreInterpretation {
  /** Numeric score (0-100) */
  score: number;
  /** Letter grade */
  grade: ScoreGrade;
  /** Human-readable label */
  label: string;
  /** Color for UI display */
  color: string;
  /** Tailwind color class */
  colorClass: string;
  /** Brief description */
  description: string;
}

export interface CategoryScore extends ScoreInterpretation {
  /** Category name */
  category: AuditCheckCategory;
  /** Category display name */
  categoryName: string;
  /** Number of checks passed */
  passed: number;
  /** Total checks in category */
  total: number;
  /** Improvement potential */
  improvementPotential: number;
}

export interface ScoreBreakdown {
  /** Overall score interpretation */
  overall: ScoreInterpretation;
  /** Scores by category */
  categories: CategoryScore[];
  /** Comparison to benchmarks */
  benchmarks: BenchmarkComparison;
  /** Priority improvements */
  priorities: string[];
}

export interface BenchmarkComparison {
  /** Industry average score */
  industryAverage: number;
  /** Comparison to industry */
  vsIndustry: 'above' | 'below' | 'average';
  /** Percentile ranking */
  percentile: number;
  /** Top performers score */
  topPerformers: number;
}

// ============================================================================
// GRADE THRESHOLDS
// ============================================================================

const GradeThresholds: { min: number; grade: ScoreGrade; label: string; color: string; colorClass: string; description: string }[] = [
  {
    min: 95,
    grade: 'A+',
    label: 'Excellent',
    color: '#10B981',
    colorClass: 'text-emerald-500',
    description: 'Outstanding SEO implementation',
  },
  {
    min: 85,
    grade: 'A',
    label: 'Great',
    color: '#22C55E',
    colorClass: 'text-green-500',
    description: 'Strong SEO with minor improvements possible',
  },
  {
    min: 70,
    grade: 'B',
    label: 'Good',
    color: '#84CC16',
    colorClass: 'text-lime-500',
    description: 'Solid foundation with room for improvement',
  },
  {
    min: 50,
    grade: 'C',
    label: 'Fair',
    color: '#EAB308',
    colorClass: 'text-yellow-500',
    description: 'Basic SEO in place, significant improvements needed',
  },
  {
    min: 30,
    grade: 'D',
    label: 'Poor',
    color: '#F97316',
    colorClass: 'text-orange-500',
    description: 'Major SEO issues affecting visibility',
  },
  {
    min: 0,
    grade: 'F',
    label: 'Critical',
    color: '#EF4444',
    colorClass: 'text-red-500',
    description: 'Critical SEO problems requiring immediate attention',
  },
];

// ============================================================================
// CATEGORY DISPLAY NAMES
// ============================================================================

const CategoryNames: Record<AuditCheckCategory, string> = {
  technical: 'Technical SEO',
  content: 'Content Quality',
  local: 'Local SEO',
  schema: 'Structured Data',
  eeat: 'E-E-A-T Signals',
  'ai-search': 'AI Search',
};

// ============================================================================
// INDUSTRY BENCHMARKS
// ============================================================================

interface IndustryBenchmark {
  average: number;
  topPerformers: number;
}

const IndustryBenchmarks: Record<string, IndustryBenchmark> = {
  healthcare: { average: 62, topPerformers: 88 },
  legal: { average: 58, topPerformers: 85 },
  ecommerce: { average: 65, topPerformers: 90 },
  financial: { average: 60, topPerformers: 87 },
  technology: { average: 70, topPerformers: 92 },
  real_estate: { average: 55, topPerformers: 82 },
  default: { average: 60, topPerformers: 85 },
};

// ============================================================================
// SCORING FUNCTIONS
// ============================================================================

/**
 * Get grade interpretation for a score
 */
export function getGradeForScore(score: number): ScoreInterpretation {
  const threshold = GradeThresholds.find((t) => score >= t.min) || GradeThresholds[GradeThresholds.length - 1];
  return {
    score,
    grade: threshold.grade,
    label: threshold.label,
    color: threshold.color,
    colorClass: threshold.colorClass,
    description: threshold.description,
  };
}

/**
 * Get category score interpretation
 */
export function getCategoryScore(
  category: AuditCheckCategory,
  categoryResult: CategoryResults
): CategoryScore {
  const interpretation = getGradeForScore(categoryResult.score);
  const total = categoryResult.results.filter((r) => r.status !== 'skipped').length;

  return {
    ...interpretation,
    category,
    categoryName: CategoryNames[category],
    passed: categoryResult.passed,
    total,
    improvementPotential: 100 - categoryResult.score,
  };
}

/**
 * Compare score to industry benchmarks
 */
export function compareToBenchmarks(
  score: number,
  industry?: string
): BenchmarkComparison {
  const benchmark = IndustryBenchmarks[industry || 'default'] || IndustryBenchmarks.default;

  let vsIndustry: 'above' | 'below' | 'average' = 'average';
  if (score > benchmark.average + 5) {
    vsIndustry = 'above';
  } else if (score < benchmark.average - 5) {
    vsIndustry = 'below';
  }

  // Estimate percentile (simplified)
  const range = benchmark.topPerformers - 30; // Assume bottom is ~30
  const position = Math.max(0, Math.min(100, ((score - 30) / range) * 100));
  const percentile = Math.round(position);

  return {
    industryAverage: benchmark.average,
    vsIndustry,
    percentile,
    topPerformers: benchmark.topPerformers,
  };
}

/**
 * Get full score breakdown
 */
export function getScoreBreakdown(
  results: AuditResults,
  industry?: string
): ScoreBreakdown {
  const overall = getGradeForScore(results.score);

  // Get category scores
  const categories: CategoryScore[] = Object.entries(results.categories)
    .map(([cat, result]) => getCategoryScore(cat as AuditCheckCategory, result))
    .sort((a, b) => a.score - b.score); // Sort by score ascending (worst first)

  // Get benchmarks
  const benchmarks = compareToBenchmarks(results.score, industry);

  // Determine priorities (lowest scoring categories with improvement potential)
  const priorities = categories
    .filter((c) => c.total > 0 && c.score < 80)
    .slice(0, 3)
    .map((c) => {
      if (c.score < 50) {
        return `Critical: Improve ${c.categoryName} (currently ${c.grade})`;
      }
      return `Improve ${c.categoryName} from ${c.grade} to ${getGradeForScore(Math.min(100, c.score + 20)).grade}`;
    });

  return {
    overall,
    categories,
    benchmarks,
    priorities,
  };
}

// ============================================================================
// SCORE DISPLAY UTILITIES
// ============================================================================

/**
 * Get color for score (for charts/visualizations)
 */
export function getScoreColor(score: number): string {
  if (score >= 90) return '#10B981'; // Emerald
  if (score >= 70) return '#22C55E'; // Green
  if (score >= 50) return '#EAB308'; // Yellow
  if (score >= 30) return '#F97316'; // Orange
  return '#EF4444'; // Red
}

/**
 * Get background color class for score
 */
export function getScoreBgClass(score: number): string {
  if (score >= 90) return 'bg-emerald-100 dark:bg-emerald-900/30';
  if (score >= 70) return 'bg-green-100 dark:bg-green-900/30';
  if (score >= 50) return 'bg-yellow-100 dark:bg-yellow-900/30';
  if (score >= 30) return 'bg-orange-100 dark:bg-orange-900/30';
  return 'bg-red-100 dark:bg-red-900/30';
}

/**
 * Get text color class for score
 */
export function getScoreTextClass(score: number): string {
  if (score >= 90) return 'text-emerald-600 dark:text-emerald-400';
  if (score >= 70) return 'text-green-600 dark:text-green-400';
  if (score >= 50) return 'text-yellow-600 dark:text-yellow-400';
  if (score >= 30) return 'text-orange-600 dark:text-orange-400';
  return 'text-red-600 dark:text-red-400';
}

/**
 * Format score as percentage
 */
export function formatScore(score: number): string {
  return `${Math.round(score)}%`;
}

/**
 * Get score trend indicator
 */
export function getScoreTrend(
  current: number,
  previous: number
): { direction: 'up' | 'down' | 'same'; change: number; label: string } {
  const change = current - previous;
  const direction = change > 0 ? 'up' : change < 0 ? 'down' : 'same';
  const label =
    direction === 'up'
      ? `+${change} points`
      : direction === 'down'
        ? `${change} points`
        : 'No change';

  return { direction, change: Math.abs(change), label };
}

// ============================================================================
// SCORE CALCULATION HELPERS
// ============================================================================

/**
 * Calculate weighted average score
 */
export function calculateWeightedScore(
  scores: { score: number; weight: number }[]
): number {
  const totalWeight = scores.reduce((sum, s) => sum + s.weight, 0);
  if (totalWeight === 0) return 0;

  const weightedSum = scores.reduce((sum, s) => sum + s.score * s.weight, 0);
  return Math.round(weightedSum / totalWeight);
}

/**
 * Normalize score to 0-100 range
 */
export function normalizeScore(value: number, min: number, max: number): number {
  if (max === min) return 100;
  return Math.round(Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100)));
}

/**
 * Calculate improvement from fixing issues
 */
export function calculateImprovementPotential(results: AuditResults): {
  maxScore: number;
  improvement: number;
  topFixes: { checkId: string; name: string; impact: number }[];
} {
  const failedChecks = results.checks.filter(
    (c) => !c.passed && c.status !== 'skipped'
  );

  // Calculate potential improvement for each failed check
  const fixes = failedChecks.map((check) => {
    // Estimate impact based on weight and severity
    let impact = check.weight;
    if (check.severity === 'critical') impact *= 1.5;
    if (check.severity === 'info') impact *= 0.5;
    return {
      checkId: check.checkId,
      name: check.checkName,
      impact: Math.round(impact),
    };
  });

  // Sort by impact
  fixes.sort((a, b) => b.impact - a.impact);

  // Estimate max achievable score
  const maxScore = Math.min(100, results.score + fixes.reduce((sum, f) => sum + f.impact, 0));

  return {
    maxScore,
    improvement: maxScore - results.score,
    topFixes: fixes.slice(0, 5),
  };
}

/**
 * Core Web Vitals Performance Thresholds
 *
 * These thresholds are based on Google's Core Web Vitals standards (2024-2025).
 * Google measures at the 75th percentile of page loads.
 *
 * @see https://web.dev/articles/vitals
 * @see https://web.dev/articles/inp
 */

// ============================================================================
// THRESHOLD CONSTANTS
// ============================================================================

/**
 * Core Web Vitals thresholds as defined by Google.
 *
 * - LCP (Largest Contentful Paint): Loading performance - ≤2.5s is good
 * - INP (Interaction to Next Paint): Responsiveness - ≤200ms is good (replaced FID March 2024)
 * - CLS (Cumulative Layout Shift): Visual stability - ≤0.1 is good
 * - TTFB (Time to First Byte): Server response - ≤800ms acceptable, ≤200ms optimal
 * - FCP (First Contentful Paint): Initial render - ≤1.8s is good
 */
export const CoreWebVitalsThresholds = {
  /** Largest Contentful Paint - measures loading performance */
  LCP: {
    /** Good: ≤2.5 seconds */
    good: 2500,
    /** Needs Improvement: >2.5s and ≤4s */
    needsImprovement: 4000,
  },
  /** Interaction to Next Paint - measures responsiveness (replaced FID March 2024) */
  INP: {
    /** Good: ≤200 milliseconds */
    good: 200,
    /** Needs Improvement: >200ms and ≤500ms */
    needsImprovement: 500,
  },
  /** Cumulative Layout Shift - measures visual stability */
  CLS: {
    /** Good: ≤0.1 */
    good: 0.1,
    /** Needs Improvement: >0.1 and ≤0.25 */
    needsImprovement: 0.25,
  },
  /** Time to First Byte - measures server response time */
  TTFB: {
    /** Optimal: ≤200 milliseconds */
    optimal: 200,
    /** Acceptable: ≤800 milliseconds */
    acceptable: 800,
  },
  /** First Contentful Paint - measures initial render time */
  FCP: {
    /** Good: ≤1.8 seconds */
    good: 1800,
    /** Needs Improvement: >1.8s and ≤3s */
    needsImprovement: 3000,
  },
} as const;

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/** Metric names for Core Web Vitals */
export type CoreWebVitalMetric = 'LCP' | 'INP' | 'CLS' | 'TTFB' | 'FCP';

/** Performance rating levels */
export type PerformanceRating = 'good' | 'needs_improvement' | 'poor';

/** Individual metric value with metadata */
export interface MetricValue {
  /** The metric name */
  name: CoreWebVitalMetric;
  /** The raw numeric value */
  value: number;
  /** The rating based on thresholds */
  rating: PerformanceRating;
  /** Delta from previous measurement (if available) */
  delta?: number;
  /** Entries contributing to this metric */
  entries?: PerformanceEntry[];
  /** Navigation type (navigate, reload, back_forward, prerender) */
  navigationType?: string;
}

/** Complete performance report */
export interface PerformanceReport {
  /** Timestamp when report was generated */
  timestamp: number;
  /** URL being measured */
  url: string;
  /** Device type */
  deviceType: 'mobile' | 'desktop';
  /** Connection type */
  connectionType?: string;
  /** Individual metrics */
  metrics: {
    LCP?: MetricValue;
    INP?: MetricValue;
    CLS?: MetricValue;
    TTFB?: MetricValue;
    FCP?: MetricValue;
  };
  /** Overall score (0-100) */
  overallScore: number;
  /** Overall rating */
  overallRating: PerformanceRating;
}

/** Performance entry from the browser */
export interface PerformanceEntry {
  name: string;
  entryType: string;
  startTime: number;
  duration: number;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get the performance rating for a given metric value
 */
export function getMetricRating(
  metric: CoreWebVitalMetric,
  value: number
): PerformanceRating {
  if (metric === 'TTFB') {
    // TTFB uses optimal/acceptable instead of good/needsImprovement
    const ttfbThresholds = CoreWebVitalsThresholds.TTFB;
    if (value <= ttfbThresholds.optimal) return 'good';
    if (value <= ttfbThresholds.acceptable) return 'needs_improvement';
    return 'poor';
  }

  // All other metrics use good/needsImprovement
  const thresholds = CoreWebVitalsThresholds[metric] as { good: number; needsImprovement: number };
  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.needsImprovement) return 'needs_improvement';
  return 'poor';
}

/**
 * Calculate overall performance score (0-100) based on Core Web Vitals
 *
 * Scoring weights (based on Lighthouse 10):
 * - LCP: 25%
 * - INP: 30%
 * - CLS: 25%
 * - FCP: 10%
 * - TTFB: 10%
 */
export function calculateOverallScore(metrics: PerformanceReport['metrics']): number {
  const weights = {
    LCP: 0.25,
    INP: 0.30,
    CLS: 0.25,
    FCP: 0.10,
    TTFB: 0.10,
  };

  let totalWeight = 0;
  let weightedScore = 0;

  for (const [metric, weight] of Object.entries(weights)) {
    const metricValue = metrics[metric as CoreWebVitalMetric];
    if (metricValue) {
      const score = getMetricScore(metric as CoreWebVitalMetric, metricValue.value);
      weightedScore += score * weight;
      totalWeight += weight;
    }
  }

  if (totalWeight === 0) return 0;
  return Math.round((weightedScore / totalWeight) * 100);
}

/**
 * Get a normalized score (0-1) for a metric value
 */
function getMetricScore(metric: CoreWebVitalMetric, value: number): number {
  let goodThreshold: number;
  let poorThreshold: number;

  if (metric === 'TTFB') {
    const ttfbThresholds = CoreWebVitalsThresholds.TTFB;
    goodThreshold = ttfbThresholds.optimal;
    poorThreshold = ttfbThresholds.acceptable;
  } else {
    const thresholds = CoreWebVitalsThresholds[metric] as { good: number; needsImprovement: number };
    goodThreshold = thresholds.good;
    poorThreshold = thresholds.needsImprovement;
  }

  if (value <= goodThreshold) {
    // Score 0.9-1.0 for good
    return 0.9 + (0.1 * (1 - value / goodThreshold));
  }
  if (value <= poorThreshold) {
    // Score 0.5-0.9 for needs improvement
    const range = poorThreshold - goodThreshold;
    const position = value - goodThreshold;
    return 0.9 - (0.4 * (position / range));
  }
  // Score 0-0.5 for poor
  const poorValue = value - poorThreshold;
  const maxPoor = poorThreshold * 2; // Assume 2x poor threshold is worst
  return Math.max(0, 0.5 - (0.5 * Math.min(poorValue / maxPoor, 1)));
}

/**
 * Get overall rating based on score
 */
export function getOverallRating(score: number): PerformanceRating {
  if (score >= 90) return 'good';
  if (score >= 50) return 'needs_improvement';
  return 'poor';
}

/**
 * Get color class for a rating
 */
export function getRatingColorClass(rating: PerformanceRating): string {
  switch (rating) {
    case 'good':
      return 'text-green-600';
    case 'needs_improvement':
      return 'text-orange-500';
    case 'poor':
      return 'text-red-600';
  }
}

/**
 * Format metric value for display
 */
export function formatMetricValue(metric: CoreWebVitalMetric, value: number): string {
  switch (metric) {
    case 'LCP':
    case 'FCP':
    case 'TTFB':
    case 'INP':
      // Time-based metrics: show in seconds or milliseconds
      if (value >= 1000) {
        return `${(value / 1000).toFixed(2)}s`;
      }
      return `${Math.round(value)}ms`;
    case 'CLS':
      // CLS is a unitless score
      return value.toFixed(3);
    default:
      return String(value);
  }
}

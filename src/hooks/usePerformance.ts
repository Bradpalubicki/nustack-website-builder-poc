'use client';

/**
 * usePerformance Hook
 *
 * Real-time Core Web Vitals tracking using the web-vitals library.
 * Reports metrics to analytics and provides current scores.
 *
 * @see https://github.com/GoogleChrome/web-vitals
 * @see https://web.dev/articles/vitals
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type {
  CoreWebVitalMetric,
  PerformanceRating,
  MetricValue,
  PerformanceReport,
} from '@/lib/seo/performance/thresholds';
import {
  getMetricRating,
  calculateOverallScore,
  getOverallRating,
} from '@/lib/seo/performance/thresholds';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/** Options for the usePerformance hook */
export interface UsePerformanceOptions {
  /** Whether to report metrics to analytics */
  reportToAnalytics?: boolean;
  /** Custom analytics callback */
  onMetric?: (metric: MetricValue) => void;
  /** GA4 measurement ID for automatic reporting */
  gaMeasurementId?: string;
  /** Debug mode - logs metrics to console */
  debug?: boolean;
}

/** Return type for the usePerformance hook */
export interface UsePerformanceReturn {
  /** Current metrics */
  metrics: PerformanceReport['metrics'];
  /** Overall performance score (0-100) */
  score: number;
  /** Overall performance rating */
  rating: PerformanceRating;
  /** Whether metrics are still loading */
  isLoading: boolean;
  /** Get status for a specific metric */
  getMetricStatus: (metric: CoreWebVitalMetric) => PerformanceRating | null;
  /** Force a manual report to analytics */
  reportNow: () => void;
}

// ============================================================================
// WEB VITALS TYPES (from web-vitals library)
// ============================================================================

interface WebVitalsMetric {
  name: 'CLS' | 'FCP' | 'LCP' | 'TTFB' | 'INP';
  value: number;
  delta: number;
  id: string;
  rating: 'good' | 'needs-improvement' | 'poor';
  entries: PerformanceEntry[];
  navigationType: string; // Various navigation types from the library
}

// ============================================================================
// HOOK IMPLEMENTATION
// ============================================================================

/**
 * usePerformance Hook
 *
 * Tracks Core Web Vitals in real-time and optionally reports to analytics.
 */
export function usePerformance(
  options: UsePerformanceOptions = {}
): UsePerformanceReturn {
  const {
    reportToAnalytics = true,
    onMetric,
    gaMeasurementId,
    debug = false,
  } = options;

  const [metrics, setMetrics] = useState<PerformanceReport['metrics']>({});
  const [isLoading, setIsLoading] = useState(true);
  const reportedRef = useRef<Set<string>>(new Set());

  // Convert web-vitals rating to our rating type
  const normalizeRating = useCallback((rating: string): PerformanceRating => {
    switch (rating) {
      case 'good':
        return 'good';
      case 'needs-improvement':
        return 'needs_improvement';
      case 'poor':
        return 'poor';
      default:
        return 'needs_improvement';
    }
  }, []);

  // Report metric to analytics
  const reportMetric = useCallback(
    (metric: MetricValue) => {
      // Call custom callback
      onMetric?.(metric);

      // Log in debug mode
      if (debug) {
        console.log('[Performance]', metric.name, metric.value, metric.rating);
      }

      // Report to GA4
      if (reportToAnalytics && typeof window !== 'undefined' && 'gtag' in window) {
        const gtag = (window as unknown as { gtag: (...args: unknown[]) => void }).gtag;
        gtag('event', metric.name, {
          event_category: 'Web Vitals',
          event_label: metric.rating,
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          metric_id: `${metric.name}-${Date.now()}`,
          metric_value: metric.value,
          metric_delta: metric.delta,
          non_interaction: true,
        });
      }
    },
    [onMetric, reportToAnalytics, debug]
  );

  // Handle incoming metric from web-vitals
  const handleMetric = useCallback(
    (webVitalMetric: WebVitalsMetric) => {
      const metricValue: MetricValue = {
        name: webVitalMetric.name as CoreWebVitalMetric,
        value: webVitalMetric.value,
        rating: normalizeRating(webVitalMetric.rating),
        delta: webVitalMetric.delta,
        entries: webVitalMetric.entries as unknown as MetricValue['entries'],
        navigationType: webVitalMetric.navigationType,
      };

      // Update state
      setMetrics((prev) => ({
        ...prev,
        [webVitalMetric.name]: metricValue,
      }));

      // Report if not already reported (web-vitals may call multiple times)
      const reportKey = `${webVitalMetric.name}-${webVitalMetric.id}`;
      if (!reportedRef.current.has(reportKey)) {
        reportedRef.current.add(reportKey);
        reportMetric(metricValue);
      }

      setIsLoading(false);
    },
    [normalizeRating, reportMetric]
  );

  // Initialize web-vitals
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let cleanup: (() => void) | undefined;

    // Dynamically import web-vitals to avoid SSR issues
    import('web-vitals')
      .then(({ onCLS, onFCP, onLCP, onTTFB, onINP }) => {
        // Register callbacks for each metric
        // Using type assertion to handle varying library types
        const handler = handleMetric as (metric: unknown) => void;
        onCLS(handler);
        onFCP(handler);
        onLCP(handler);
        onTTFB(handler);
        onINP(handler);
      })
      .catch((error) => {
        if (debug) {
          console.error('[Performance] Failed to load web-vitals:', error);
        }
        setIsLoading(false);
      });

    return () => {
      cleanup?.();
    };
  }, [handleMetric, debug]);

  // Calculate overall score
  const score = calculateOverallScore(metrics);
  const rating = getOverallRating(score);

  // Get status for a specific metric
  const getMetricStatus = useCallback(
    (metric: CoreWebVitalMetric): PerformanceRating | null => {
      const metricValue = metrics[metric];
      if (!metricValue) return null;
      return metricValue.rating;
    },
    [metrics]
  );

  // Force manual report
  const reportNow = useCallback(() => {
    Object.values(metrics).forEach((metric) => {
      if (metric) {
        reportMetric(metric);
      }
    });
  }, [metrics, reportMetric]);

  return {
    metrics,
    score,
    rating,
    isLoading,
    getMetricStatus,
    reportNow,
  };
}

// ============================================================================
// UTILITY HOOKS
// ============================================================================

/**
 * Hook to track a specific metric
 */
export function useMetric(metric: CoreWebVitalMetric): MetricValue | null {
  const { metrics } = usePerformance();
  return metrics[metric] || null;
}

/**
 * Hook to get current performance score
 */
export function usePerformanceScore(): { score: number; rating: PerformanceRating } {
  const { score, rating } = usePerformance();
  return { score, rating };
}

export default usePerformance;

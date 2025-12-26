'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import type { SEOAuditResult, SEOIssue, SEOCategoryResult } from '@/types/healthcare';
import {
  calculateOverallScore,
  getScoreGrade,
  getScoreColorClass,
  getSeverityClass,
  CATEGORY_WEIGHTS,
} from '@/lib/healthcare/seo-audit';

export interface UseSEOAuditOptions {
  projectId: string;
  autoRun?: boolean;
  cacheTime?: number;
}

export interface SEOAuditStats {
  totalIssues: number;
  criticalIssues: number;
  warningIssues: number;
  infoIssues: number;
  autoFixableIssues: number;
  quickWins: number;
}

export interface UseSEOAuditReturn {
  result: SEOAuditResult | null;
  isRunning: boolean;
  error: Error | null;
  stats: SEOAuditStats;
  grade: string;
  gradeColor: string;
  runAudit: (scope?: 'full' | 'quick') => Promise<SEOAuditResult>;
  getIssuesByCategory: (category: string) => SEOIssue[];
  getIssuesBySeverity: (severity: SEOIssue['type']) => SEOIssue[];
  getAutoFixableIssues: () => SEOIssue[];
  applyAutoFix: (issueId: string) => Promise<void>;
  applyAllAutoFixes: () => Promise<void>;
  dismissIssue: (issueId: string) => void;
  restoreDismissedIssue: (issueId: string) => void;
  dismissedIssues: string[];
}

/**
 * useSEOAudit Hook
 *
 * Hook for running and managing SEO audits.
 * Provides detailed analysis, filtering, and auto-fix capabilities.
 */
export function useSEOAudit({
  projectId,
  autoRun = false,
  cacheTime = 5 * 60 * 1000, // 5 minutes
}: UseSEOAuditOptions): UseSEOAuditReturn {
  const [result, setResult] = useState<SEOAuditResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [dismissedIssues, setDismissedIssues] = useState<string[]>([]);
  const [lastRunTime, setLastRunTime] = useState<number | null>(null);

  // Calculate stats from current result
  const stats = useMemo<SEOAuditStats>(() => {
    if (!result) {
      return {
        totalIssues: 0,
        criticalIssues: 0,
        warningIssues: 0,
        infoIssues: 0,
        autoFixableIssues: 0,
        quickWins: 0,
      };
    }

    const activeIssues = result.issues.filter((i) => !dismissedIssues.includes(i.id));

    return {
      totalIssues: activeIssues.length,
      criticalIssues: activeIssues.filter((i) => i.type === 'critical').length,
      warningIssues: activeIssues.filter((i) => i.type === 'warning').length,
      infoIssues: activeIssues.filter((i) => i.type === 'info').length,
      autoFixableIssues: activeIssues.filter((i) => i.autoFixAvailable).length,
      quickWins: activeIssues.filter((i) => i.impact === 'high' && i.effort === 'low').length,
    };
  }, [result, dismissedIssues]);

  // Calculate grade
  const grade = useMemo(() => {
    return result ? getScoreGrade(result.score) : 'N/A';
  }, [result]);

  const gradeColor = useMemo(() => {
    return result ? getScoreColorClass(result.score) : 'text-muted-foreground';
  }, [result]);

  // Run SEO audit
  const runAudit = useCallback(async (scope: 'full' | 'quick' = 'full'): Promise<SEOAuditResult> => {
    // Check cache
    if (lastRunTime && Date.now() - lastRunTime < cacheTime && result) {
      return result;
    }

    setIsRunning(true);
    setError(null);

    try {
      const response = await fetch(`/api/healthcare/seo-audit?projectId=${projectId}&scope=${scope}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to run SEO audit');
      }

      const data = await response.json();
      setResult(data.data);
      setLastRunTime(Date.now());
      return data.data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(error);
      throw error;
    } finally {
      setIsRunning(false);
    }
  }, [projectId, cacheTime, lastRunTime, result]);

  // Auto-run on mount if enabled
  useEffect(() => {
    if (autoRun && !result && !isRunning) {
      runAudit('quick').catch(console.error);
    }
  }, [autoRun, result, isRunning, runAudit]);

  // Get issues by category
  const getIssuesByCategory = useCallback((category: string): SEOIssue[] => {
    if (!result) return [];
    return result.issues.filter(
      (i) => i.category === category && !dismissedIssues.includes(i.id)
    );
  }, [result, dismissedIssues]);

  // Get issues by severity
  const getIssuesBySeverity = useCallback((severity: SEOIssue['type']): SEOIssue[] => {
    if (!result) return [];
    return result.issues.filter(
      (i) => i.type === severity && !dismissedIssues.includes(i.id)
    );
  }, [result, dismissedIssues]);

  // Get auto-fixable issues
  const getAutoFixableIssues = useCallback((): SEOIssue[] => {
    if (!result) return [];
    return result.issues.filter(
      (i) => i.autoFixAvailable && !dismissedIssues.includes(i.id)
    );
  }, [result, dismissedIssues]);

  // Apply auto-fix for a single issue
  const applyAutoFix = useCallback(async (issueId: string): Promise<void> => {
    const issue = result?.issues.find((i) => i.id === issueId);
    if (!issue || !issue.autoFixAvailable || !issue.autoFixAction) {
      throw new Error('Issue cannot be auto-fixed');
    }

    const response = await fetch(issue.autoFixAction, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, issueId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to apply auto-fix');
    }

    // Remove the issue from the list
    if (result) {
      setResult({
        ...result,
        issues: result.issues.filter((i) => i.id !== issueId),
      });
    }
  }, [projectId, result]);

  // Apply all auto-fixes
  const applyAllAutoFixes = useCallback(async (): Promise<void> => {
    const autoFixable = getAutoFixableIssues();
    if (autoFixable.length === 0) return;

    const response = await fetch('/api/healthcare/auto-fix', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId,
        issueIds: autoFixable.map((i) => i.id),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to apply auto-fixes');
    }

    // Re-run audit to get updated results
    await runAudit('full');
  }, [projectId, getAutoFixableIssues, runAudit]);

  // Dismiss an issue
  const dismissIssue = useCallback((issueId: string): void => {
    setDismissedIssues((prev) => [...prev, issueId]);
  }, []);

  // Restore a dismissed issue
  const restoreDismissedIssue = useCallback((issueId: string): void => {
    setDismissedIssues((prev) => prev.filter((id) => id !== issueId));
  }, []);

  return {
    result,
    isRunning,
    error,
    stats,
    grade,
    gradeColor,
    runAudit,
    getIssuesByCategory,
    getIssuesBySeverity,
    getAutoFixableIssues,
    applyAutoFix,
    applyAllAutoFixes,
    dismissIssue,
    restoreDismissedIssue,
    dismissedIssues,
  };
}

export default useSEOAudit;

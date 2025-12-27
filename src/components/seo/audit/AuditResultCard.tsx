/**
 * AuditResultCard Component
 *
 * Comprehensive display of SEO audit results with scores,
 * category breakdown, issues, and recommendations.
 */

'use client';

import React, { useState, useMemo } from 'react';
import {
  ChevronDown,
  ChevronUp,
  CheckCircle,
  AlertTriangle,
  Info,
  RefreshCw,
  Download,
  Clock,
} from 'lucide-react';
import { AuditResults, AuditCheckResult, CategoryResults } from '@/lib/seo/audit/runner';
import { AuditCheckCategory } from '@/lib/seo/audit/checks';
import {
  getGradeForScore,
  getScoreBreakdown,
  getScoreColor,
  getScoreBgClass,
} from '@/lib/seo/audit/scoring';
import {
  generateRecommendations,
  formatRecommendationsMarkdown,
  RecommendationReport,
} from '@/lib/seo/audit/recommendations';
import { ScoreCard } from './ScoreCard';
import { IssueCard } from './IssueCard';
import { RecommendationCard } from './RecommendationCard';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface AuditResultCardProps {
  /** Audit results */
  results: AuditResults;
  /** Industry for benchmarks */
  industry?: string;
  /** Show detailed issues */
  showIssues?: boolean;
  /** Show recommendations */
  showRecommendations?: boolean;
  /** On re-run audit */
  onRerun?: () => void;
  /** On export results */
  onExport?: (format: 'json' | 'markdown') => void;
  /** Is audit running */
  isRunning?: boolean;
  /** Additional class name */
  className?: string;
}

type ActiveTab = 'overview' | 'issues' | 'recommendations';

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function CategoryProgress({
  category,
  results,
}: {
  category: AuditCheckCategory;
  results: CategoryResults;
}) {
  const interpretation = getGradeForScore(results.score);
  const scoreColor = getScoreColor(results.score);

  const categoryLabels: Record<AuditCheckCategory, string> = {
    technical: 'Technical SEO',
    content: 'Content',
    local: 'Local SEO',
    schema: 'Structured Data',
    eeat: 'E-E-A-T',
    'ai-search': 'AI Search',
  };

  const nonSkipped = results.results.filter((r) => r.status !== 'skipped').length;
  if (nonSkipped === 0) return null;

  return (
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {categoryLabels[category]}
          </span>
          <span className="text-sm font-bold" style={{ color: scoreColor }}>
            {results.score}%
          </span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${results.score}%`, backgroundColor: scoreColor }}
          />
        </div>
        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-green-500" />
            {results.passed}
          </span>
          {results.warnings > 0 && (
            <span className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3 text-yellow-500" />
              {results.warnings}
            </span>
          )}
          {results.failed > 0 && (
            <span className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3 text-red-500" />
              {results.failed}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function AuditResultCard({
  results,
  industry,
  showIssues = true,
  showRecommendations = true,
  onRerun,
  onExport,
  isRunning = false,
  className = '',
}: AuditResultCardProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const scoreBreakdown = useMemo(
    () => getScoreBreakdown(results, industry),
    [results, industry]
  );

  const recommendations = useMemo(
    () => generateRecommendations(results),
    [results]
  );

  const failedChecks = useMemo(
    () =>
      results.checks.filter(
        (c) => !c.passed && c.status !== 'skipped'
      ),
    [results.checks]
  );

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const handleExport = (format: 'json' | 'markdown') => {
    if (onExport) {
      onExport(format);
    } else {
      // Default export behavior
      let content: string;
      let filename: string;
      let type: string;

      if (format === 'json') {
        content = JSON.stringify(results, null, 2);
        filename = `seo-audit-${new Date().toISOString().split('T')[0]}.json`;
        type = 'application/json';
      } else {
        content = formatRecommendationsMarkdown(recommendations);
        filename = `seo-audit-${new Date().toISOString().split('T')[0]}.md`;
        type = 'text/markdown';
      }

      const blob = new Blob([content], { type });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              SEO Audit Results
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <Clock className="h-3 w-3" />
              {new Date(results.timestamp).toLocaleString()}
              <span className="text-gray-300 dark:text-gray-600">•</span>
              {results.meta.checksRun} checks run
              {results.meta.checksSkipped > 0 && ` (${results.meta.checksSkipped} skipped)`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {onExport && (
              <div className="relative group">
                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                  <Download className="h-4 w-4" />
                </button>
                <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                  <button
                    onClick={() => handleExport('json')}
                    className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Export JSON
                  </button>
                  <button
                    onClick={() => handleExport('markdown')}
                    className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Export Markdown
                  </button>
                </div>
              </div>
            )}
            {onRerun && (
              <button
                onClick={onRerun}
                disabled={isRunning}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <RefreshCw className={`h-4 w-4 ${isRunning ? 'animate-spin' : ''}`} />
                {isRunning ? 'Running...' : 'Re-run'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Score Overview */}
      <div className="p-4 grid gap-4 md:grid-cols-4">
        <ScoreCard
          score={results.score}
          title="Overall Score"
          showGrade={true}
          showDescription={true}
          size="md"
        />
        <div className="md:col-span-3 space-y-3">
          {Object.entries(results.categories).map(([cat, catResults]) => (
            <CategoryProgress
              key={cat}
              category={cat as AuditCheckCategory}
              results={catResults}
            />
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t border-gray-200 dark:border-gray-700">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Overview
          </button>
          {showIssues && (
            <button
              onClick={() => setActiveTab('issues')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'issues'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Issues ({failedChecks.length})
            </button>
          )}
          {showRecommendations && (
            <button
              onClick={() => setActiveTab('recommendations')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'recommendations'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Recommendations ({recommendations.summary.total})
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="p-4">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Summary */}
              <div className="grid gap-4 md:grid-cols-3">
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-1">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm font-medium">Critical Issues</span>
                  </div>
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {results.summary.critical}
                  </div>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 mb-1">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm font-medium">Warnings</span>
                  </div>
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    {results.summary.warnings}
                  </div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-1">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Passed</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {results.summary.passed}
                  </div>
                </div>
              </div>

              {/* Top Priorities */}
              {scoreBreakdown.priorities.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Priority Actions
                  </h3>
                  <ul className="space-y-2">
                    {scoreBreakdown.priorities.map((priority, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg"
                      >
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium flex items-center justify-center">
                          {index + 1}
                        </span>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {priority}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Benchmark Comparison */}
              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Industry Benchmark
                </h3>
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-2xl font-bold" style={{ color: getScoreColor(results.score) }}>
                      {results.score}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                      Your Score
                    </span>
                  </div>
                  <div className="h-8 border-l border-gray-300 dark:border-gray-600" />
                  <div>
                    <span className="text-2xl font-bold text-gray-500">
                      {scoreBreakdown.benchmarks.industryAverage}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                      Industry Avg
                    </span>
                  </div>
                  <div className="h-8 border-l border-gray-300 dark:border-gray-600" />
                  <div>
                    <span className="text-2xl font-bold text-green-500">
                      {scoreBreakdown.benchmarks.topPerformers}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                      Top Performers
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'issues' && showIssues && (
            <div className="space-y-4">
              {failedChecks.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    No issues found! Your site is in great shape.
                  </p>
                </div>
              ) : (
                failedChecks.map((issue) => (
                  <IssueCard key={issue.checkId} issue={issue} />
                ))
              )}
            </div>
          )}

          {activeTab === 'recommendations' && showRecommendations && (
            <div className="space-y-4">
              {recommendations.topPriorities.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    No recommendations at this time. Keep up the great work!
                  </p>
                </div>
              ) : (
                recommendations.topPriorities.map((rec) => (
                  <RecommendationCard key={rec.id} recommendation={rec} />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuditResultCard;

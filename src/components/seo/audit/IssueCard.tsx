/**
 * IssueCard Component
 *
 * Displays an SEO audit issue with severity, affected pages, and fix actions.
 */

'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronUp,
  Wrench,
  ExternalLink,
  Clock,
  Target,
} from 'lucide-react';
import { AuditCheckResult } from '@/lib/seo/audit/runner';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface IssueCardProps {
  /** The issue/check result */
  issue: AuditCheckResult;
  /** Show detailed information */
  showDetails?: boolean;
  /** Show fix button */
  showFixButton?: boolean;
  /** On fix button click */
  onFix?: (issue: AuditCheckResult) => void;
  /** Is fix in progress */
  isFixing?: boolean;
  /** Additional class name */
  className?: string;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getSeverityConfig(severity: 'critical' | 'warning' | 'info') {
  switch (severity) {
    case 'critical':
      return {
        icon: AlertTriangle,
        color: 'text-red-500',
        bgColor: 'bg-red-100 dark:bg-red-900/30',
        borderColor: 'border-red-500',
        label: 'Critical',
      };
    case 'warning':
      return {
        icon: AlertCircle,
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
        borderColor: 'border-yellow-500',
        label: 'Warning',
      };
    case 'info':
      return {
        icon: Info,
        color: 'text-blue-500',
        bgColor: 'bg-blue-100 dark:bg-blue-900/30',
        borderColor: 'border-blue-500',
        label: 'Info',
      };
  }
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    technical: 'Technical SEO',
    content: 'Content',
    local: 'Local SEO',
    schema: 'Structured Data',
    eeat: 'E-E-A-T',
    'ai-search': 'AI Search',
  };
  return labels[category] || category;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function IssueCard({
  issue,
  showDetails = true,
  showFixButton = true,
  onFix,
  isFixing = false,
  className = '',
}: IssueCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const config = getSeverityConfig(issue.severity);
  const Icon = config.icon;

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}
    >
      {/* Header */}
      <div
        className={`border-l-4 ${config.borderColor} p-4`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className={`p-1.5 rounded-lg ${config.bgColor}`}>
              <Icon className={`h-4 w-4 ${config.color}`} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {issue.checkName}
                </h3>
                <span
                  className={`px-2 py-0.5 text-xs font-medium rounded-full ${config.bgColor} ${config.color}`}
                >
                  {config.label}
                </span>
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                  {getCategoryLabel(issue.category)}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {issue.details || 'Issue detected'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {showFixButton && issue.fix && onFix && (
              <button
                onClick={() => onFix(issue)}
                disabled={isFixing}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Wrench className="h-3.5 w-3.5" />
                {isFixing ? 'Fixing...' : 'Fix'}
              </button>
            )}
            {showDetails && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Impact/Effort Badges */}
        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <Target className="h-3 w-3" />
            <span>Weight: {issue.weight}/10</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <Clock className="h-3 w-3" />
            <span>Execution: {issue.executionTime}ms</span>
          </div>
          {issue.value !== undefined && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Value: <span className="font-mono">{String(issue.value)}</span>
              {issue.expected !== undefined && (
                <span> (expected: {String(issue.expected)})</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Expanded Details */}
      {showDetails && isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900/50">
          {/* How to Fix */}
          {issue.fix && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                How to Fix
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {issue.fix}
              </p>
            </div>
          )}

          {/* Data */}
          {issue.data && Object.keys(issue.data).length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Additional Data
              </h4>
              <div className="bg-gray-100 dark:bg-gray-800 rounded p-3 overflow-x-auto">
                <pre className="text-xs text-gray-600 dark:text-gray-400">
                  {JSON.stringify(issue.data, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default IssueCard;

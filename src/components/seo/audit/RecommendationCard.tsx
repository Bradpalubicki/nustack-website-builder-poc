/**
 * RecommendationCard Component
 *
 * Displays an SEO recommendation with priority, steps, and action buttons.
 */

'use client';

import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Zap,
  Target,
  ArrowRight,
  ExternalLink,
  Code,
} from 'lucide-react';
import { Recommendation, RecommendationPriority } from '@/lib/seo/audit/recommendations';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface RecommendationCardProps {
  /** The recommendation */
  recommendation: Recommendation;
  /** Show implementation steps */
  showSteps?: boolean;
  /** Show code example */
  showCodeExample?: boolean;
  /** On implement action */
  onImplement?: (recommendation: Recommendation) => void;
  /** Is implementing */
  isImplementing?: boolean;
  /** Additional class name */
  className?: string;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getPriorityConfig(priority: RecommendationPriority) {
  switch (priority) {
    case 'critical':
      return {
        color: 'text-red-500',
        bgColor: 'bg-red-100 dark:bg-red-900/30',
        borderColor: 'border-red-500',
        label: 'Critical',
        emoji: '🔴',
      };
    case 'high':
      return {
        color: 'text-orange-500',
        bgColor: 'bg-orange-100 dark:bg-orange-900/30',
        borderColor: 'border-orange-500',
        label: 'High',
        emoji: '🟠',
      };
    case 'medium':
      return {
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
        borderColor: 'border-yellow-500',
        label: 'Medium',
        emoji: '🟡',
      };
    case 'low':
      return {
        color: 'text-green-500',
        bgColor: 'bg-green-100 dark:bg-green-900/30',
        borderColor: 'border-green-500',
        label: 'Low',
        emoji: '🟢',
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

export function RecommendationCard({
  recommendation,
  showSteps = true,
  showCodeExample = true,
  onImplement,
  isImplementing = false,
  className = '',
}: RecommendationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const config = getPriorityConfig(recommendation.priority);

  const impactScore = Math.min(10, recommendation.impact);
  const effortScore = Math.min(10, recommendation.effort);
  const roi = impactScore / Math.max(1, effortScore);

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className={`border-l-4 ${config.borderColor} p-4`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span
                className={`px-2 py-0.5 text-xs font-medium rounded-full ${config.bgColor} ${config.color}`}
              >
                {config.label} Priority
              </span>
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                {getCategoryLabel(recommendation.category)}
              </span>
              {roi >= 2 && (
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                  Quick Win
                </span>
              )}
            </div>
            <h3 className="font-medium text-gray-900 dark:text-white">
              {recommendation.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {recommendation.description}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onImplement && (
              <button
                onClick={() => onImplement(recommendation)}
                disabled={isImplementing}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Zap className="h-3.5 w-3.5" />
                {isImplementing ? 'Implementing...' : 'Implement'}
              </button>
            )}
            {(showSteps || showCodeExample) && (
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

        {/* Impact/Effort Meters */}
        <div className="flex items-center gap-6 mt-4">
          <div className="flex-1">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
              <span className="flex items-center gap-1">
                <Target className="h-3 w-3" />
                Impact
              </span>
              <span>{impactScore}/10</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{ width: `${impactScore * 10}%` }}
              />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
              <span className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                Effort
              </span>
              <span>{effortScore}/10</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  effortScore <= 3
                    ? 'bg-green-500'
                    : effortScore <= 6
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                }`}
                style={{ width: `${effortScore * 10}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900/50">
          {/* Implementation Steps */}
          {showSteps && recommendation.steps.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Implementation Steps
              </h4>
              <ol className="space-y-2">
                {recommendation.steps.map((step, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400 pt-0.5">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Code Example */}
          {showCodeExample && recommendation.codeExample && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Code className="h-4 w-4" />
                Code Example
              </h4>
              <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-100">
                  <code>{recommendation.codeExample}</code>
                </pre>
              </div>
            </div>
          )}

          {/* Resources */}
          {recommendation.resources && recommendation.resources.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Resources
              </h4>
              <ul className="space-y-1">
                {recommendation.resources.map((resource, index) => (
                  <li key={index}>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
                    >
                      {resource.title}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default RecommendationCard;

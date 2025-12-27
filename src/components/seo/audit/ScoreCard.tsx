/**
 * ScoreCard Component
 *
 * Displays an SEO score with grade, color coding, and optional comparison.
 */

'use client';

import React from 'react';
import { getGradeForScore, getScoreColor, getScoreBgClass } from '@/lib/seo/audit/scoring';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface ScoreCardProps {
  /** The score (0-100) */
  score: number;
  /** Previous score for comparison */
  previousScore?: number;
  /** Card title */
  title?: string;
  /** Card subtitle */
  subtitle?: string;
  /** Show the grade badge */
  showGrade?: boolean;
  /** Show the score description */
  showDescription?: boolean;
  /** Show trend indicator */
  showTrend?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional class name */
  className?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function ScoreCard({
  score,
  previousScore,
  title = 'SEO Score',
  subtitle,
  showGrade = true,
  showDescription = false,
  showTrend = true,
  size = 'md',
  className = '',
}: ScoreCardProps) {
  const interpretation = getGradeForScore(score);
  const scoreColor = getScoreColor(score);
  const bgClass = getScoreBgClass(score);

  const trend = previousScore !== undefined ? score - previousScore : 0;
  const trendDirection = trend > 0 ? 'up' : trend < 0 ? 'down' : 'same';

  const sizeClasses = {
    sm: {
      container: 'p-3',
      score: 'text-3xl',
      title: 'text-xs',
      badge: 'text-xs px-1.5 py-0.5',
    },
    md: {
      container: 'p-4',
      score: 'text-5xl',
      title: 'text-sm',
      badge: 'text-sm px-2 py-1',
    },
    lg: {
      container: 'p-6',
      score: 'text-7xl',
      title: 'text-base',
      badge: 'text-base px-3 py-1.5',
    },
  };

  const classes = sizeClasses[size];

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${classes.container} ${className}`}
    >
      {/* Title */}
      {title && (
        <div className="mb-2">
          <h3 className={`font-medium text-gray-500 dark:text-gray-400 ${classes.title}`}>
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-gray-400 dark:text-gray-500">{subtitle}</p>
          )}
        </div>
      )}

      {/* Score Display */}
      <div className="flex items-center gap-4">
        <div
          className={`${classes.score} font-bold`}
          style={{ color: scoreColor }}
        >
          {Math.round(score)}
        </div>

        <div className="flex flex-col gap-1">
          {/* Grade Badge */}
          {showGrade && (
            <span
              className={`inline-flex items-center rounded-full font-medium ${bgClass} ${classes.badge}`}
              style={{ color: scoreColor }}
            >
              Grade: {interpretation.grade}
            </span>
          )}

          {/* Trend Indicator */}
          {showTrend && previousScore !== undefined && (
            <div className="flex items-center gap-1 text-xs">
              {trendDirection === 'up' && (
                <>
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">+{trend} pts</span>
                </>
              )}
              {trendDirection === 'down' && (
                <>
                  <TrendingDown className="h-3 w-3 text-red-500" />
                  <span className="text-red-500">{trend} pts</span>
                </>
              )}
              {trendDirection === 'same' && (
                <>
                  <Minus className="h-3 w-3 text-gray-400" />
                  <span className="text-gray-400">No change</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {showDescription && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {interpretation.description}
        </p>
      )}
    </div>
  );
}

export default ScoreCard;

/**
 * QuickActions Component
 *
 * Displays SEO quick actions with variable input support.
 * Supports filtering by category and search.
 */

'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  QuickAction,
  QuickActionCategory,
  QuickActionVariable,
  CategoryConfig,
  getAllQuickActions,
  getQuickActionsByCategory,
  searchQuickActions,
  getCategories,
  getFeaturedQuickActions,
} from '@/lib/seo/quick-actions/registry';
import * as Icons from 'lucide-react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface QuickActionsProps {
  /** Filter by category */
  category?: QuickActionCategory;
  /** Show featured actions only */
  featured?: boolean;
  /** Show search bar */
  showSearch?: boolean;
  /** Show category filter */
  showCategoryFilter?: boolean;
  /** Maximum actions to show */
  limit?: number;
  /** On action execute */
  onExecute?: (action: QuickAction, variables: Record<string, unknown>) => Promise<void>;
  /** Custom class name */
  className?: string;
  /** Layout variant */
  variant?: 'grid' | 'list' | 'compact';
}

interface VariableInputProps {
  variable: QuickActionVariable;
  value: unknown;
  onChange: (value: unknown) => void;
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function VariableInput({ variable, value, onChange }: VariableInputProps) {
  const baseInputClass =
    'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md ' +
    'bg-white dark:bg-gray-800 text-gray-900 dark:text-white ' +
    'focus:ring-2 focus:ring-blue-500 focus:border-transparent';

  switch (variable.type) {
    case 'string':
    case 'url':
      return (
        <input
          type={variable.type === 'url' ? 'url' : 'text'}
          value={(value as string) || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={variable.placeholder}
          className={baseInputClass}
          required={variable.required}
        />
      );

    case 'number':
      return (
        <input
          type="number"
          value={(value as number) || ''}
          onChange={(e) => onChange(Number(e.target.value))}
          placeholder={variable.placeholder}
          className={baseInputClass}
          required={variable.required}
        />
      );

    case 'boolean':
      return (
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={(value as boolean) || false}
            onChange={(e) => onChange(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {variable.label}
          </span>
        </label>
      );

    case 'select':
      return (
        <select
          value={(value as string) || (variable.defaultValue as string) || ''}
          onChange={(e) => onChange(e.target.value)}
          className={baseInputClass}
          required={variable.required}
        >
          <option value="">Select {variable.label}</option>
          {variable.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );

    case 'multiselect':
      const selectedValues = (value as string[]) || [];
      return (
        <div className="space-y-2">
          {variable.options?.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedValues.includes(opt.value)}
                onChange={(e) => {
                  if (e.target.checked) {
                    onChange([...selectedValues, opt.value]);
                  } else {
                    onChange(selectedValues.filter((v) => v !== opt.value));
                  }
                }}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      );

    default:
      return null;
  }
}

function ActionCard({
  action,
  onExecute,
  isExecuting,
}: {
  action: QuickAction;
  onExecute: (variables: Record<string, unknown>) => void;
  isExecuting: boolean;
}) {
  const [showVariables, setShowVariables] = useState(false);
  const [variables, setVariables] = useState<Record<string, unknown>>({});

  const categoryConfig = CategoryConfig[action.category];
  const IconComponent = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[action.icon] || Icons.Zap;

  const handleExecute = useCallback(() => {
    if (action.variables && action.variables.length > 0 && !showVariables) {
      setShowVariables(true);
      return;
    }
    onExecute(variables);
    setShowVariables(false);
    setVariables({});
  }, [action.variables, showVariables, variables, onExecute]);

  const handleVariableChange = useCallback((name: string, value: unknown) => {
    setVariables((prev) => ({ ...prev, [name]: value }));
  }, []);

  const canExecute = useMemo(() => {
    if (!action.variables) return true;
    return action.variables
      .filter((v) => v.required)
      .every((v) => {
        const value = variables[v.name];
        return value !== undefined && value !== '' && value !== null;
      });
  }, [action.variables, variables]);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${categoryConfig.bgColor}`}>
          <IconComponent className={`h-5 w-5 ${categoryConfig.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-gray-900 dark:text-white truncate">
              {action.name}
            </h3>
            {action.premium && (
              <span className="px-1.5 py-0.5 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 rounded">
                Pro
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {action.description}
          </p>
          {action.estimatedTime && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 flex items-center gap-1">
              <Icons.Clock className="h-3 w-3" />
              {action.estimatedTime}
            </p>
          )}
        </div>
      </div>

      {/* Variables Form */}
      {showVariables && action.variables && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
          {action.variables.map((variable) => (
            <div key={variable.name}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {variable.label}
                {variable.required && <span className="text-red-500 ml-0.5">*</span>}
              </label>
              <VariableInput
                variable={variable}
                value={variables[variable.name]}
                onChange={(value) => handleVariableChange(variable.name, value)}
              />
              {variable.helpText && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {variable.helpText}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Action Button */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={handleExecute}
          disabled={isExecuting || (showVariables && !canExecute)}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors
            ${
              isExecuting || (showVariables && !canExecute)
                ? 'bg-gray-100 text-gray-400 dark:bg-gray-800 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
        >
          {isExecuting ? (
            <>
              <Icons.Loader2 className="h-4 w-4 animate-spin" />
              Running...
            </>
          ) : showVariables ? (
            <>
              <Icons.Play className="h-4 w-4" />
              Execute
            </>
          ) : (
            <>
              <Icons.Zap className="h-4 w-4" />
              {action.variables?.length ? 'Configure' : 'Run'}
            </>
          )}
        </button>
        {showVariables && (
          <button
            onClick={() => {
              setShowVariables(false);
              setVariables({});
            }}
            className="px-4 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function QuickActions({
  category,
  featured = false,
  showSearch = true,
  showCategoryFilter = true,
  limit,
  onExecute,
  className = '',
  variant = 'grid',
}: QuickActionsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<QuickActionCategory | 'all'>(
    category || 'all'
  );
  const [executingAction, setExecutingAction] = useState<string | null>(null);

  const categories = getCategories();

  const actions = useMemo(() => {
    let result: QuickAction[];

    if (featured) {
      result = getFeaturedQuickActions();
    } else if (searchQuery) {
      result = searchQuickActions(searchQuery);
    } else if (selectedCategory !== 'all') {
      result = getQuickActionsByCategory(selectedCategory);
    } else {
      result = getAllQuickActions();
    }

    if (limit) {
      result = result.slice(0, limit);
    }

    return result;
  }, [featured, searchQuery, selectedCategory, limit]);

  const handleExecute = useCallback(
    async (action: QuickAction, variables: Record<string, unknown>) => {
      if (!onExecute) {
        console.log('Executing action:', action.id, variables);
        return;
      }

      setExecutingAction(action.id);
      try {
        await onExecute(action, variables);
      } finally {
        setExecutingAction(null);
      }
    },
    [onExecute]
  );

  const gridClass =
    variant === 'grid'
      ? 'grid gap-4 md:grid-cols-2 lg:grid-cols-3'
      : variant === 'list'
        ? 'space-y-4'
        : 'grid gap-3 md:grid-cols-2';

  return (
    <div className={className}>
      {/* Search and Filters */}
      {(showSearch || showCategoryFilter) && (
        <div className="mb-6 space-y-4">
          {showSearch && (
            <div className="relative">
              <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search actions..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          {showCategoryFilter && !category && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                  ${
                    selectedCategory === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
              >
                All
              </button>
              {categories.map((cat) => {
                const config = CategoryConfig[cat];
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                      ${
                        selectedCategory === cat
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                  >
                    {config.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Actions Grid/List */}
      {actions.length > 0 ? (
        <div className={gridClass}>
          {actions.map((action) => (
            <ActionCard
              key={action.id}
              action={action}
              onExecute={(variables) => handleExecute(action, variables)}
              isExecuting={executingAction === action.id}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Icons.Search className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            {searchQuery ? `No actions found for "${searchQuery}"` : 'No actions available'}
          </p>
        </div>
      )}
    </div>
  );
}

export default QuickActions;

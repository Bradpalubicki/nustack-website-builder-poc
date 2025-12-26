'use client';

import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Grid, List, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ArticleCard } from './ArticleCard';
import type { HealthArticle } from '@/types/healthcare';

export interface ArticleGridProps {
  /** Array of articles to display */
  articles: HealthArticle[];
  /** Number of columns (2, 3, or 4) */
  columns?: 2 | 3 | 4;
  /** Show category filters */
  showFilters?: boolean;
  /** Show pagination */
  showPagination?: boolean;
  /** Show search */
  showSearch?: boolean;
  /** Articles per page */
  perPage?: number;
  /** Current category filter */
  category?: string;
  /** Available categories */
  categories?: string[];
  /** Additional CSS classes */
  className?: string;
  /** Base URL for article links */
  baseUrl?: string;
  /** Allow grid/list toggle */
  allowLayoutToggle?: boolean;
}

/**
 * ArticleGrid Component
 *
 * Grid layout for article listings with filtering and pagination.
 */
export function ArticleGrid({
  articles,
  columns = 3,
  showFilters = true,
  showPagination = true,
  showSearch = true,
  perPage = 9,
  category,
  categories = [],
  className,
  baseUrl = '/health-library',
  allowLayoutToggle = false,
}: ArticleGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(category || '');
  const [currentPage, setCurrentPage] = useState(1);
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');

  // Derive unique categories from articles if not provided
  const allCategories = useMemo(() => {
    if (categories.length > 0) return categories;
    const cats = new Set<string>();
    articles.forEach((article) => {
      if (article.category) cats.add(article.category);
    });
    return Array.from(cats).sort();
  }, [articles, categories]);

  // Filter articles
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      // Category filter
      if (selectedCategory && article.category !== selectedCategory) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          article.title.toLowerCase().includes(query) ||
          article.excerpt?.toLowerCase().includes(query) ||
          article.tags?.some((tag) => tag.toLowerCase().includes(query))
        );
      }

      return true;
    });
  }, [articles, selectedCategory, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredArticles.length / perPage);
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  return (
    <div className={className}>
      {/* Filters and Search */}
      {(showSearch || showFilters || allowLayoutToggle) && (
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          {showSearch && (
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          )}

          {/* Category Filters */}
          {showFilters && allCategories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={selectedCategory === '' ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setSelectedCategory('')}
              >
                All
              </Badge>
              {allCategories.map((cat) => (
                <Badge
                  key={cat}
                  variant={selectedCategory === cat ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </Badge>
              ))}
            </div>
          )}

          {/* Layout Toggle */}
          {allowLayoutToggle && (
            <div className="flex gap-1 ml-auto">
              <Button
                variant={layout === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setLayout('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={layout === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setLayout('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Results Count */}
      <p className="text-sm text-muted-foreground mb-4">
        Showing {paginatedArticles.length} of {filteredArticles.length} articles
        {selectedCategory && ` in "${selectedCategory}"`}
        {searchQuery && ` matching "${searchQuery}"`}
      </p>

      {/* Articles Grid/List */}
      {paginatedArticles.length > 0 ? (
        <div
          className={cn(
            'gap-6',
            layout === 'grid' ? `grid grid-cols-1 ${gridCols[columns]}` : 'flex flex-col'
          )}
        >
          {paginatedArticles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              variant={layout === 'list' ? 'horizontal' : 'full'}
              baseUrl={baseUrl}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No articles found.</p>
          {(searchQuery || selectedCategory) && (
            <Button
              variant="link"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('');
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
      )}

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              // Show first, last, current, and adjacent pages
              const showPage =
                page === 1 ||
                page === totalPages ||
                Math.abs(page - currentPage) <= 1;

              if (!showPage) {
                // Show ellipsis for gaps
                if (page === 2 || page === totalPages - 1) {
                  return (
                    <span key={page} className="px-2 text-muted-foreground">
                      ...
                    </span>
                  );
                }
                return null;
              }

              return (
                <Button
                  key={page}
                  variant={currentPage === page ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              );
            })}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

export default ArticleGrid;

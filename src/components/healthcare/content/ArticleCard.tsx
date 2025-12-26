'use client';

import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { HealthArticle } from '@/types/healthcare';

export type ArticleCardVariant = 'full' | 'compact' | 'horizontal';

export interface ArticleCardProps {
  /** Article data */
  article: HealthArticle;
  /** Display variant */
  variant?: ArticleCardVariant;
  /** Show excerpt */
  showExcerpt?: boolean;
  /** Show reading time */
  showReadTime?: boolean;
  /** Show category */
  showCategory?: boolean;
  /** Show author */
  showAuthor?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Base URL for article links */
  baseUrl?: string;
}

/**
 * Get author initials
 */
function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Format date
 */
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * ArticleCard Component
 *
 * Card for displaying article listings with various variants.
 */
export function ArticleCard({
  article,
  variant = 'full',
  showExcerpt = true,
  showReadTime = true,
  showCategory = true,
  showAuthor = true,
  className,
  baseUrl = '/health-library',
}: ArticleCardProps) {
  const articleUrl = `${baseUrl}/${article.slug}`;

  if (variant === 'compact') {
    return (
      <a href={articleUrl} className={cn('group block', className)}>
        <div className="flex items-start gap-3">
          {article.featuredImageUrl && (
            <img
              src={article.featuredImageUrl}
              alt={article.featuredImageAlt || article.title}
              className="w-20 h-20 object-cover rounded flex-shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2">
              {article.title}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
              {article.publishedAt && (
                <span>{formatDate(article.publishedAt)}</span>
              )}
              {showReadTime && article.readingTime && (
                <>
                  <span>•</span>
                  <span>{article.readingTime} min</span>
                </>
              )}
            </div>
          </div>
        </div>
      </a>
    );
  }

  if (variant === 'horizontal') {
    return (
      <Card className={cn('group overflow-hidden', className)}>
        <a href={articleUrl} className="flex flex-col md:flex-row">
          {article.featuredImageUrl && (
            <div className="md:w-1/3 flex-shrink-0">
              <img
                src={article.featuredImageUrl}
                alt={article.featuredImageAlt || article.title}
                className="w-full h-48 md:h-full object-cover"
              />
            </div>
          )}
          <CardContent className="flex-1 p-6">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {showCategory && article.category && (
                <Badge variant="secondary">{article.category}</Badge>
              )}
              {showReadTime && article.readingTime && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {article.readingTime} min read
                </span>
              )}
            </div>
            <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
              {article.title}
            </h3>
            {showExcerpt && article.excerpt && (
              <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                {article.excerpt}
              </p>
            )}
            <div className="flex items-center justify-between mt-auto">
              {showAuthor && article.authorName && (
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={article.authorImageUrl} alt={article.authorName} />
                    <AvatarFallback>{getInitials(article.authorName)}</AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <p className="font-medium">{article.authorName}</p>
                    {article.publishedAt && (
                      <p className="text-xs text-muted-foreground">
                        {formatDate(article.publishedAt)}
                      </p>
                    )}
                  </div>
                </div>
              )}
              <span className="text-primary font-medium text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                Read more <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </CardContent>
        </a>
      </Card>
    );
  }

  // Full variant (default)
  return (
    <Card className={cn('group overflow-hidden h-full flex flex-col', className)}>
      <a href={articleUrl} className="flex flex-col h-full">
        {article.featuredImageUrl && (
          <div className="aspect-video overflow-hidden">
            <img
              src={article.featuredImageUrl}
              alt={article.featuredImageAlt || article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <CardContent className="flex-1 p-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {showCategory && article.category && (
              <Badge variant="secondary">{article.category}</Badge>
            )}
            {showReadTime && article.readingTime && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {article.readingTime} min read
              </span>
            )}
          </div>
          <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {article.title}
          </h3>
          {showExcerpt && article.excerpt && (
            <p className="text-muted-foreground text-sm line-clamp-3">{article.excerpt}</p>
          )}
        </CardContent>
        <CardFooter className="p-6 pt-0 mt-auto">
          <div className="flex items-center justify-between w-full">
            {showAuthor && article.authorName ? (
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={article.authorImageUrl} alt={article.authorName} />
                  <AvatarFallback>{getInitials(article.authorName)}</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-medium line-clamp-1">{article.authorName}</p>
                </div>
              </div>
            ) : (
              article.publishedAt && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {formatDate(article.publishedAt)}
                </div>
              )
            )}
            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>
        </CardFooter>
      </a>
    </Card>
  );
}

export default ArticleCard;

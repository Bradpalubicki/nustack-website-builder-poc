'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, ChevronDown, ChevronUp, BookOpen, Building2, FileText, Newspaper } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Citation {
  /** Citation title */
  title: string;
  /** Source name (e.g., "National Institutes of Health") */
  source: string;
  /** URL to the source */
  url: string;
  /** Date the source was accessed */
  accessedDate?: string;
  /** Author names */
  authors?: string[];
  /** Publication date */
  publishedDate?: string;
  /** DOI identifier */
  doi?: string;
}

export type CitationVariant = 'footnotes' | 'sidebar' | 'endnotes';

export interface ArticleCitationsProps {
  /** Array of citations */
  citations: Citation[];
  /** Display variant */
  variant?: CitationVariant;
  /** Whether to show the accessed date */
  showAccessedDate?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Maximum number to show before "Show more" */
  maxVisible?: number;
}

type SourceType = 'peer_reviewed' | 'government' | 'medical_institution' | 'news' | 'other';

/**
 * Determine the source type based on the source name or URL
 */
function getSourceType(source: string, url: string): SourceType {
  const lowerSource = source.toLowerCase();
  const lowerUrl = url.toLowerCase();

  // Government sources
  if (
    lowerSource.includes('nih') ||
    lowerSource.includes('cdc') ||
    lowerSource.includes('fda') ||
    lowerUrl.includes('.gov')
  ) {
    return 'government';
  }

  // Peer-reviewed / PubMed
  if (
    lowerSource.includes('pubmed') ||
    lowerSource.includes('journal') ||
    lowerUrl.includes('pubmed') ||
    lowerUrl.includes('ncbi.nlm.nih.gov')
  ) {
    return 'peer_reviewed';
  }

  // Medical institutions
  if (
    lowerSource.includes('mayo clinic') ||
    lowerSource.includes('cleveland clinic') ||
    lowerSource.includes('johns hopkins') ||
    lowerSource.includes('webmd') ||
    lowerSource.includes('healthline')
  ) {
    return 'medical_institution';
  }

  // News
  if (
    lowerSource.includes('news') ||
    lowerSource.includes('times') ||
    lowerSource.includes('post')
  ) {
    return 'news';
  }

  return 'other';
}

/**
 * Get icon and badge color for source type
 */
function getSourceBadge(sourceType: SourceType) {
  switch (sourceType) {
    case 'peer_reviewed':
      return {
        icon: BookOpen,
        label: 'Peer Reviewed',
        className: 'bg-green-100 text-green-800 border-green-200',
      };
    case 'government':
      return {
        icon: Building2,
        label: 'Government',
        className: 'bg-blue-100 text-blue-800 border-blue-200',
      };
    case 'medical_institution':
      return {
        icon: FileText,
        label: 'Medical Institution',
        className: 'bg-purple-100 text-purple-800 border-purple-200',
      };
    case 'news':
      return {
        icon: Newspaper,
        label: 'News',
        className: 'bg-orange-100 text-orange-800 border-orange-200',
      };
    default:
      return {
        icon: ExternalLink,
        label: 'Source',
        className: 'bg-gray-100 text-gray-800 border-gray-200',
      };
  }
}

/**
 * Format a date string
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Single citation item component
 */
function CitationItem({
  citation,
  index,
  showAccessedDate,
  variant,
}: {
  citation: Citation;
  index: number;
  showAccessedDate: boolean;
  variant: CitationVariant;
}) {
  const sourceType = getSourceType(citation.source, citation.url);
  const badge = getSourceBadge(sourceType);
  const IconComponent = badge.icon;

  return (
    <li className={cn('group', variant === 'sidebar' ? 'pb-3 border-b last:border-0' : '')}>
      <div className="flex items-start gap-2">
        {variant === 'footnotes' && (
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
            {index + 1}
          </span>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <Badge variant="outline" className={cn('text-xs', badge.className)}>
              <IconComponent className="h-3 w-3 mr-1" />
              {badge.label}
            </Badge>
            <span className="text-sm font-medium text-muted-foreground">{citation.source}</span>
          </div>
          <a
            href={citation.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1 break-words"
          >
            {citation.title}
            <ExternalLink className="h-3 w-3 flex-shrink-0" />
          </a>
          <div className="flex flex-wrap gap-2 mt-1 text-xs text-muted-foreground">
            {citation.authors && citation.authors.length > 0 && (
              <span>{citation.authors.join(', ')}</span>
            )}
            {citation.publishedDate && (
              <span>Published: {formatDate(citation.publishedDate)}</span>
            )}
            {showAccessedDate && citation.accessedDate && (
              <span>Accessed: {formatDate(citation.accessedDate)}</span>
            )}
            {citation.doi && (
              <a
                href={`https://doi.org/${citation.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                DOI: {citation.doi}
              </a>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}

/**
 * ArticleCitations Component
 *
 * Display authoritative source citations with credibility indicators.
 * Important for E-E-A-T compliance in health content.
 */
export function ArticleCitations({
  citations,
  variant = 'endnotes',
  showAccessedDate = true,
  className,
  maxVisible = 5,
}: ArticleCitationsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!citations || citations.length === 0) {
    return null;
  }

  const visibleCitations = isExpanded ? citations : citations.slice(0, maxVisible);
  const hasMore = citations.length > maxVisible;

  if (variant === 'sidebar') {
    return (
      <Card className={cn('', className)}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Sources & Citations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3 list-none">
            {visibleCitations.map((citation, index) => (
              <CitationItem
                key={`${citation.url}-${index}`}
                citation={citation}
                index={index}
                showAccessedDate={showAccessedDate}
                variant={variant}
              />
            ))}
          </ol>
          {hasMore && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full mt-3"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Show {citations.length - maxVisible} More
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  // Footnotes and endnotes variants
  return (
    <div className={cn('border-t pt-6 mt-8', className)}>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <BookOpen className="h-5 w-5" />
        {variant === 'footnotes' ? 'References' : 'Sources & Citations'}
      </h3>
      <ol
        className={cn(
          'space-y-4',
          variant === 'footnotes' ? 'list-none' : 'list-decimal list-inside'
        )}
      >
        {visibleCitations.map((citation, index) => (
          <CitationItem
            key={`${citation.url}-${index}`}
            citation={citation}
            index={index}
            showAccessedDate={showAccessedDate}
            variant={variant}
          />
        ))}
      </ol>
      {hasMore && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-4 w-4 mr-1" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-1" />
              Show All {citations.length} Sources
            </>
          )}
        </Button>
      )}
    </div>
  );
}

export default ArticleCitations;

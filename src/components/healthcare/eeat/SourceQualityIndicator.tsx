'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  BookOpen,
  Building2,
  FileText,
  Newspaper,
  Link,
  ShieldCheck,
  GraduationCap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type SourceQualityType =
  | 'peer_reviewed'
  | 'government'
  | 'medical_institution'
  | 'news'
  | 'academic'
  | 'other';

export interface SourceQualityIndicatorProps {
  /** Type of source */
  sourceType: SourceQualityType;
  /** Name of the source */
  sourceName: string;
  /** Display variant */
  variant?: 'badge' | 'inline' | 'tooltip';
  /** Additional CSS classes */
  className?: string;
  /** Show full explanation */
  showExplanation?: boolean;
}

interface SourceConfig {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
  className: string;
  trustLevel: 'high' | 'medium' | 'low';
}

/**
 * Get configuration for each source type
 */
function getSourceConfig(sourceType: SourceQualityType): SourceConfig {
  switch (sourceType) {
    case 'peer_reviewed':
      return {
        icon: BookOpen,
        label: 'Peer Reviewed',
        description:
          'This source has been reviewed by qualified experts in the field and published in a reputable scientific journal.',
        className: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
        trustLevel: 'high',
      };
    case 'government':
      return {
        icon: Building2,
        label: 'Government Source',
        description:
          'This information comes from an official government health agency like the NIH, CDC, or FDA.',
        className: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
        trustLevel: 'high',
      };
    case 'medical_institution':
      return {
        icon: ShieldCheck,
        label: 'Medical Institution',
        description:
          'This source is from a recognized medical institution or healthcare organization with established expertise.',
        className: 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200',
        trustLevel: 'high',
      };
    case 'academic':
      return {
        icon: GraduationCap,
        label: 'Academic Source',
        description:
          'This source comes from an accredited academic or research institution.',
        className: 'bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-200',
        trustLevel: 'high',
      };
    case 'news':
      return {
        icon: Newspaper,
        label: 'News Source',
        description:
          'This information comes from a news publication. Consider checking primary sources for medical claims.',
        className: 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200',
        trustLevel: 'medium',
      };
    case 'other':
    default:
      return {
        icon: Link,
        label: 'External Source',
        description:
          'This is an external source. Always verify health information with your healthcare provider.',
        className: 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200',
        trustLevel: 'low',
      };
  }
}

/**
 * Get trust level indicator
 */
function TrustIndicator({ level }: { level: 'high' | 'medium' | 'low' }) {
  return (
    <div className="flex items-center gap-1 mt-2">
      <span className="text-xs text-muted-foreground">Trust Level:</span>
      <div className="flex gap-0.5">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              'w-3 h-3 rounded-full',
              level === 'high' && 'bg-green-500',
              level === 'medium' && i <= 2 && 'bg-yellow-500',
              level === 'medium' && i > 2 && 'bg-gray-200',
              level === 'low' && i <= 1 && 'bg-orange-500',
              level === 'low' && i > 1 && 'bg-gray-200'
            )}
          />
        ))}
      </div>
      <span className="text-xs capitalize text-muted-foreground">{level}</span>
    </div>
  );
}

/**
 * SourceQualityIndicator Component
 *
 * Shows the quality/authority of a cited source.
 * Helps users understand the credibility of health information sources.
 */
export function SourceQualityIndicator({
  sourceType,
  sourceName,
  variant = 'badge',
  className,
  showExplanation = false,
}: SourceQualityIndicatorProps) {
  const config = getSourceConfig(sourceType);
  const IconComponent = config.icon;

  if (variant === 'inline') {
    return (
      <span
        className={cn('inline-flex items-center gap-1 text-sm', className)}
        title={config.description}
      >
        <IconComponent className="h-4 w-4" />
        <span className="font-medium">{sourceName}</span>
        <span className="text-muted-foreground">({config.label})</span>
      </span>
    );
  }

  const badgeContent = (
    <Badge variant="outline" className={cn('gap-1.5 cursor-help', config.className, className)}>
      <IconComponent className="h-3 w-3" />
      <span>{config.label}</span>
    </Badge>
  );

  if (variant === 'tooltip') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{badgeContent}</TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-xs">
            <p className="font-medium">{sourceName}</p>
            <p className="text-xs text-muted-foreground mt-1">{config.description}</p>
            <TrustIndicator level={config.trustLevel} />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Badge variant (default)
  return (
    <div className={cn('inline-flex flex-col gap-1', className)}>
      {badgeContent}
      {showExplanation && (
        <div className="text-xs text-muted-foreground max-w-xs">
          <p>{config.description}</p>
          <TrustIndicator level={config.trustLevel} />
        </div>
      )}
    </div>
  );
}

export default SourceQualityIndicator;

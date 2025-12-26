'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ServiceAreaVariant = 'list' | 'pills' | 'paragraph';

export interface ServiceAreaListProps {
  /** Array of service area names */
  serviceAreas: string[];
  /** Location name for context */
  locationName: string;
  /** Display variant */
  variant?: ServiceAreaVariant;
  /** Whether to show a map */
  showMap?: boolean;
  /** Links to area-specific pages (key = area name, value = URL) */
  areaLinks?: Record<string, string>;
  /** Additional CSS classes */
  className?: string;
  /** Custom intro text */
  introText?: string;
}

/**
 * ServiceAreaList Component
 *
 * Display service areas for local SEO.
 * Helps target "near me" keyword variations.
 */
export function ServiceAreaList({
  serviceAreas,
  locationName,
  variant = 'pills',
  showMap = false,
  areaLinks = {},
  className,
  introText,
}: ServiceAreaListProps) {
  if (!serviceAreas || serviceAreas.length === 0) {
    return null;
  }

  const intro =
    introText || `Proudly serving ${locationName} and the surrounding communities:`;

  if (variant === 'paragraph') {
    return (
      <div className={cn('text-muted-foreground', className)}>
        <p className="flex items-start gap-2">
          <MapPin className="h-4 w-4 mt-1 flex-shrink-0 text-primary" />
          <span>
            {intro.replace(':', '')} including{' '}
            {serviceAreas.map((area, index) => {
              const link = areaLinks[area];
              const isLast = index === serviceAreas.length - 1;
              const isSecondLast = index === serviceAreas.length - 2;

              const areaElement = link ? (
                <a key={area} href={link} className="text-primary hover:underline">
                  {area}
                </a>
              ) : (
                <span key={area}>{area}</span>
              );

              return (
                <React.Fragment key={area}>
                  {areaElement}
                  {!isLast && (isSecondLast ? ', and ' : ', ')}
                </React.Fragment>
              );
            })}
            .
          </span>
        </p>
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className={cn('space-y-3', className)}>
        <div className="flex items-center gap-2 text-sm font-medium">
          <MapPin className="h-4 w-4 text-primary" />
          <span>{intro}</span>
        </div>
        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {serviceAreas.map((area) => {
            const link = areaLinks[area];
            return (
              <li key={area}>
                {link ? (
                  <a
                    href={link}
                    className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {area}
                  </a>
                ) : (
                  <span className="text-sm text-muted-foreground inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
                    {area}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  // Pills variant (default)
  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center gap-2 text-sm font-medium">
        <MapPin className="h-4 w-4 text-primary" />
        <span>{intro}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {serviceAreas.map((area) => {
          const link = areaLinks[area];
          const badge = (
            <Badge
              key={area}
              variant="secondary"
              className={cn('cursor-default', link && 'cursor-pointer hover:bg-secondary/80')}
            >
              {area}
            </Badge>
          );

          return link ? (
            <a key={area} href={link}>
              {badge}
            </a>
          ) : (
            badge
          );
        })}
      </div>
    </div>
  );
}

export default ServiceAreaList;

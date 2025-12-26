'use client';

import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PracticeLocation, MedicalService } from '@/types/healthcare';

export interface LocationBreadcrumbProps {
  /** Location data */
  location: PracticeLocation;
  /** Service data (optional, for location+service pages) */
  service?: MedicalService;
  /** Whether to include home link */
  includeHome?: boolean;
  /** Base URL for home */
  homeUrl?: string;
  /** Base URL for locations */
  locationsUrl?: string;
  /** Practice name for home */
  practiceName?: string;
  /** Additional CSS classes */
  className?: string;
}

interface BreadcrumbItem {
  name: string;
  url: string;
  current?: boolean;
}

/**
 * LocationBreadcrumb Component
 *
 * Location-aware breadcrumb navigation with schema.org BreadcrumbList markup.
 * Essential for SEO and user navigation on location pages.
 */
export function LocationBreadcrumb({
  location,
  service,
  includeHome = true,
  homeUrl = '/',
  locationsUrl = '/locations',
  practiceName = 'Home',
  className,
}: LocationBreadcrumbProps) {
  const items: BreadcrumbItem[] = [];

  // Add home
  if (includeHome) {
    items.push({ name: practiceName, url: homeUrl });
  }

  // Add locations
  items.push({ name: 'Locations', url: locationsUrl });

  // Add this location
  items.push({
    name: location.city,
    url: `${locationsUrl}/${location.slug}`,
    current: !service,
  });

  // Add service if provided
  if (service) {
    items.push({
      name: service.shortName || service.name,
      url: `${locationsUrl}/${location.slug}/${service.slug}`,
      current: true,
    });
  }

  // Schema.org BreadcrumbList data
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${typeof window !== 'undefined' ? window.location.origin : ''}${item.url}`,
    })),
  };

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center text-sm', className)}
    >
      <ol className="flex items-center flex-wrap gap-1" itemScope itemType="https://schema.org/BreadcrumbList">
        {items.map((item, index) => (
          <li
            key={item.url}
            className="flex items-center"
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
          >
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-muted-foreground mx-1 flex-shrink-0" />
            )}
            {item.current ? (
              <span
                className="text-foreground font-medium truncate max-w-[200px]"
                aria-current="page"
                itemProp="name"
              >
                {item.name}
              </span>
            ) : (
              <a
                href={item.url}
                className="text-muted-foreground hover:text-foreground transition-colors truncate max-w-[150px] inline-flex items-center gap-1"
                itemProp="item"
              >
                {index === 0 && <Home className="h-3 w-3 flex-shrink-0" />}
                <span itemProp="name">{item.name}</span>
              </a>
            )}
            <meta itemProp="position" content={String(index + 1)} />
          </li>
        ))}
      </ol>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
    </nav>
  );
}

export default LocationBreadcrumb;

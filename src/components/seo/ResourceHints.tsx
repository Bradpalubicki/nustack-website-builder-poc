/**
 * Resource Hints Component
 *
 * Renders link elements for browser resource hints to improve page load performance.
 * These hints tell the browser about resources it will need soon.
 *
 * Types of hints:
 * - dns-prefetch: Resolve DNS for third-party domains early
 * - preconnect: Establish connections (DNS + TCP + TLS) to origins
 * - preload: Fetch critical resources immediately
 * - prefetch: Fetch resources for future navigation
 *
 * @see https://web.dev/articles/preconnect-and-dns-prefetch
 * @see https://web.dev/articles/preload-critical-assets
 */

import React from 'react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/** DNS prefetch configuration */
export interface DnsPrefetchHint {
  type: 'dns-prefetch';
  href: string;
}

/** Preconnect configuration */
export interface PreconnectHint {
  type: 'preconnect';
  href: string;
  crossOrigin?: 'anonymous' | 'use-credentials';
}

/** Preload configuration */
export interface PreloadHint {
  type: 'preload';
  href: string;
  as: 'script' | 'style' | 'font' | 'image' | 'document' | 'fetch';
  crossOrigin?: 'anonymous' | 'use-credentials';
  type_attr?: string; // MIME type
  imagesrcset?: string;
  imagesizes?: string;
}

/** Prefetch configuration */
export interface PrefetchHint {
  type: 'prefetch';
  href: string;
  as?: 'script' | 'style' | 'font' | 'image' | 'document';
}

/** Union of all hint types */
export type ResourceHint = DnsPrefetchHint | PreconnectHint | PreloadHint | PrefetchHint;

/** Props for ResourceHints component */
export interface ResourceHintsProps {
  /** Array of resource hints to render */
  hints?: ResourceHint[];
  /** Include common third-party hints automatically */
  includeCommonHints?: boolean;
  /** Custom domains to add DNS prefetch for */
  dnsPrefetchDomains?: string[];
  /** Custom origins to preconnect to */
  preconnectOrigins?: string[];
  /** Enable Google Fonts hints */
  googleFonts?: boolean;
  /** Enable Google Analytics hints */
  googleAnalytics?: boolean;
  /** Enable Google Maps hints */
  googleMaps?: boolean;
  /** Enable Facebook hints */
  facebook?: boolean;
}

// ============================================================================
// COMMON RESOURCE HINTS
// ============================================================================

/** Common third-party domains that benefit from early DNS resolution */
const COMMON_DNS_PREFETCH_DOMAINS = [
  'https://www.googletagmanager.com',
  'https://www.google-analytics.com',
  'https://connect.facebook.net',
  'https://platform.twitter.com',
  'https://cdn.jsdelivr.net',
];

/** Google Fonts preconnect origins */
const GOOGLE_FONTS_HINTS: ResourceHint[] = [
  {
    type: 'preconnect',
    href: 'https://fonts.googleapis.com',
  },
  {
    type: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
];

/** Google Analytics hints */
const GOOGLE_ANALYTICS_HINTS: ResourceHint[] = [
  {
    type: 'preconnect',
    href: 'https://www.googletagmanager.com',
  },
  {
    type: 'preconnect',
    href: 'https://www.google-analytics.com',
  },
];

/** Google Maps hints */
const GOOGLE_MAPS_HINTS: ResourceHint[] = [
  {
    type: 'preconnect',
    href: 'https://maps.googleapis.com',
  },
  {
    type: 'preconnect',
    href: 'https://maps.gstatic.com',
    crossOrigin: 'anonymous',
  },
];

/** Facebook hints */
const FACEBOOK_HINTS: ResourceHint[] = [
  {
    type: 'dns-prefetch',
    href: 'https://connect.facebook.net',
  },
  {
    type: 'dns-prefetch',
    href: 'https://www.facebook.com',
  },
];

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * ResourceHints Component
 *
 * Renders resource hints in the document head for improved performance.
 * Should be placed within Next.js <Head> component or app router metadata.
 */
export function ResourceHints({
  hints = [],
  includeCommonHints = false,
  dnsPrefetchDomains = [],
  preconnectOrigins = [],
  googleFonts = false,
  googleAnalytics = false,
  googleMaps = false,
  facebook = false,
}: ResourceHintsProps): React.ReactElement {
  // Collect all hints
  const allHints: ResourceHint[] = [...hints];

  // Add common DNS prefetch hints
  if (includeCommonHints) {
    COMMON_DNS_PREFETCH_DOMAINS.forEach((href) => {
      allHints.push({ type: 'dns-prefetch', href });
    });
  }

  // Add custom DNS prefetch domains
  dnsPrefetchDomains.forEach((href) => {
    allHints.push({ type: 'dns-prefetch', href: ensureHttps(href) });
  });

  // Add custom preconnect origins
  preconnectOrigins.forEach((href) => {
    allHints.push({ type: 'preconnect', href: ensureHttps(href) });
  });

  // Add service-specific hints
  if (googleFonts) {
    allHints.push(...GOOGLE_FONTS_HINTS);
  }

  if (googleAnalytics) {
    allHints.push(...GOOGLE_ANALYTICS_HINTS);
  }

  if (googleMaps) {
    allHints.push(...GOOGLE_MAPS_HINTS);
  }

  if (facebook) {
    allHints.push(...FACEBOOK_HINTS);
  }

  // Deduplicate hints by href and type
  const uniqueHints = deduplicateHints(allHints);

  return (
    <>
      {uniqueHints.map((hint, index) => (
        <ResourceHintLink key={`${hint.type}-${hint.href}-${index}`} hint={hint} />
      ))}
    </>
  );
}

/**
 * Individual resource hint link element
 */
function ResourceHintLink({ hint }: { hint: ResourceHint }): React.ReactElement {
  switch (hint.type) {
    case 'dns-prefetch':
      return <link rel="dns-prefetch" href={hint.href} />;

    case 'preconnect':
      return (
        <link
          rel="preconnect"
          href={hint.href}
          crossOrigin={hint.crossOrigin}
        />
      );

    case 'preload':
      return (
        <link
          rel="preload"
          href={hint.href}
          as={hint.as}
          crossOrigin={hint.crossOrigin}
          type={hint.type_attr}
          // @ts-expect-error - imagesrcset and imagesizes are valid for preload
          imagesrcset={hint.imagesrcset}
          imagesizes={hint.imagesizes}
        />
      );

    case 'prefetch':
      return (
        <link
          rel="prefetch"
          href={hint.href}
          as={hint.as}
        />
      );

    default:
      return <></>;
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Ensure URL has https protocol
 */
function ensureHttps(url: string): string {
  if (url.startsWith('//')) {
    return `https:${url}`;
  }
  if (!url.startsWith('http')) {
    return `https://${url}`;
  }
  return url;
}

/**
 * Deduplicate hints by type and href
 */
function deduplicateHints(hints: ResourceHint[]): ResourceHint[] {
  const seen = new Set<string>();
  return hints.filter((hint) => {
    const key = `${hint.type}:${hint.href}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Create a preload hint for a critical CSS file
 */
export function createCSSPreload(href: string): PreloadHint {
  return {
    type: 'preload',
    href,
    as: 'style',
  };
}

/**
 * Create a preload hint for a critical font
 */
export function createFontPreload(
  href: string,
  type: string = 'font/woff2'
): PreloadHint {
  return {
    type: 'preload',
    href,
    as: 'font',
    type_attr: type,
    crossOrigin: 'anonymous',
  };
}

/**
 * Create a preload hint for an LCP image
 */
export function createImagePreload(
  href: string,
  srcset?: string,
  sizes?: string
): PreloadHint {
  return {
    type: 'preload',
    href,
    as: 'image',
    imagesrcset: srcset,
    imagesizes: sizes,
  };
}

/**
 * Create preconnect hints for an origin
 */
export function createPreconnect(
  origin: string,
  crossOrigin?: 'anonymous' | 'use-credentials'
): PreconnectHint {
  return {
    type: 'preconnect',
    href: ensureHttps(origin),
    crossOrigin,
  };
}

/**
 * Create DNS prefetch hint for a domain
 */
export function createDnsPrefetch(domain: string): DnsPrefetchHint {
  return {
    type: 'dns-prefetch',
    href: ensureHttps(domain),
  };
}

export default ResourceHints;

/**
 * Image Optimization Utilities
 *
 * Provides utilities for optimizing images for Core Web Vitals performance.
 * Modern image formats provide significant size reductions:
 * - WebP: 25-34% smaller than JPEG at equivalent quality
 * - AVIF: 50%+ smaller than JPEG (best compression, but slower encoding)
 *
 * @see https://web.dev/articles/serve-images-webp
 * @see https://web.dev/articles/uses-responsive-images
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/** Supported image formats */
export type ImageFormat = 'avif' | 'webp' | 'jpeg' | 'png';

/** Responsive breakpoint configuration */
export interface ResponsiveBreakpoint {
  /** Width in pixels */
  width: number;
  /** Optional height for aspect ratio preservation */
  height?: number;
  /** Descriptor for srcset (e.g., "400w" or "2x") */
  descriptor: string;
}

/** Image optimization options */
export interface ImageOptimizationOptions {
  /** Base source URL */
  src: string;
  /** Alt text for accessibility */
  alt: string;
  /** Whether this is the LCP (Largest Contentful Paint) image */
  isLCP?: boolean;
  /** Custom breakpoints (defaults to standard set) */
  breakpoints?: ResponsiveBreakpoint[];
  /** Sizes attribute for responsive images */
  sizes?: string;
  /** Width of the image */
  width?: number;
  /** Height of the image */
  height?: number;
  /** CSS class name */
  className?: string;
  /** Image formats to generate (order matters - first supported wins) */
  formats?: ImageFormat[];
}

/** Props for optimized image loading */
export interface OptimizedImageProps {
  loading: 'lazy' | 'eager';
  fetchpriority?: 'high' | 'low' | 'auto';
  decoding: 'async' | 'sync' | 'auto';
}

/** Picture element with sources */
export interface PictureElement {
  sources: Array<{
    type: string;
    srcset: string;
    sizes?: string;
  }>;
  img: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    loading: 'lazy' | 'eager';
    fetchpriority?: 'high' | 'low' | 'auto';
    decoding: 'async' | 'sync' | 'auto';
    className?: string;
    sizes?: string;
  };
}

// ============================================================================
// CONSTANTS
// ============================================================================

/** Default responsive breakpoints for srcset */
export const DEFAULT_BREAKPOINTS: ResponsiveBreakpoint[] = [
  { width: 400, descriptor: '400w' },
  { width: 800, descriptor: '800w' },
  { width: 1200, descriptor: '1200w' },
];

/** Default sizes attribute for responsive images */
export const DEFAULT_SIZES = '(max-width: 400px) 400px, (max-width: 800px) 800px, 1200px';

/** MIME types for image formats */
export const FORMAT_MIME_TYPES: Record<ImageFormat, string> = {
  avif: 'image/avif',
  webp: 'image/webp',
  jpeg: 'image/jpeg',
  png: 'image/png',
};

/** Format file extensions */
export const FORMAT_EXTENSIONS: Record<ImageFormat, string> = {
  avif: '.avif',
  webp: '.webp',
  jpeg: '.jpg',
  png: '.png',
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get optimized image loading props based on whether it's an LCP image
 *
 * LCP images should:
 * - Load eagerly (not lazy)
 * - Have high fetch priority
 * - Decode synchronously for immediate display
 *
 * Non-LCP images should:
 * - Load lazily for performance
 * - Have auto fetch priority
 * - Decode asynchronously to not block main thread
 */
export function getImageOptimizationProps(isLCP: boolean = false): OptimizedImageProps {
  if (isLCP) {
    return {
      loading: 'eager',
      fetchpriority: 'high',
      decoding: 'sync',
    };
  }

  return {
    loading: 'lazy',
    fetchpriority: 'auto',
    decoding: 'async',
  };
}

/**
 * Generate srcset string for responsive images
 */
export function generateSrcset(
  baseSrc: string,
  breakpoints: ResponsiveBreakpoint[] = DEFAULT_BREAKPOINTS,
  format?: ImageFormat
): string {
  return breakpoints
    .map((bp) => {
      const url = getResizedImageUrl(baseSrc, bp.width, bp.height, format);
      return `${url} ${bp.descriptor}`;
    })
    .join(', ');
}

/**
 * Get a resized image URL
 *
 * This function generates URLs compatible with common image CDNs/services.
 * Adjust the URL pattern based on your image service (Cloudinary, Imgix, Vercel, etc.)
 */
export function getResizedImageUrl(
  src: string,
  width: number,
  height?: number,
  format?: ImageFormat
): string {
  // Check if it's already an optimized URL from a CDN
  if (src.includes('/_next/image')) {
    // Next.js Image Optimization API
    const url = new URL(src, 'http://localhost');
    url.searchParams.set('w', String(width));
    if (height) url.searchParams.set('h', String(height));
    return url.pathname + url.search;
  }

  // For external URLs or static files, use Next.js image optimization
  const params = new URLSearchParams({
    url: src,
    w: String(width),
    q: '75', // Quality
  });

  if (format && format !== 'jpeg' && format !== 'png') {
    // Next.js handles format automatically based on Accept header
    // But we can hint with query params for some CDNs
  }

  return `/_next/image?${params.toString()}`;
}

/**
 * Generate a responsive picture element configuration
 *
 * Returns the structure needed to render a <picture> element with
 * multiple <source> elements for different formats, plus a fallback <img>.
 */
export function generateResponsiveImage(
  options: ImageOptimizationOptions
): PictureElement {
  const {
    src,
    alt,
    isLCP = false,
    breakpoints = DEFAULT_BREAKPOINTS,
    sizes = DEFAULT_SIZES,
    width,
    height,
    className,
    formats = ['avif', 'webp', 'jpeg'],
  } = options;

  const loadingProps = getImageOptimizationProps(isLCP);

  // Generate source elements for each format (except fallback)
  const sources = formats
    .filter((format) => format !== 'jpeg' && format !== 'png')
    .map((format) => ({
      type: FORMAT_MIME_TYPES[format],
      srcset: generateSrcset(src, breakpoints, format),
      sizes,
    }));

  // Fallback image (JPEG or PNG)
  const fallbackFormat = formats.includes('jpeg') ? 'jpeg' : 'png';

  return {
    sources,
    img: {
      src: getResizedImageUrl(src, breakpoints[breakpoints.length - 1].width, undefined, fallbackFormat),
      alt,
      width,
      height,
      sizes,
      className,
      ...loadingProps,
    },
  };
}

/**
 * Generate React-compatible picture element JSX string
 *
 * Use this for server-side rendering or static generation.
 */
export function generatePictureElementHtml(options: ImageOptimizationOptions): string {
  const picture = generateResponsiveImage(options);

  const sourcesHtml = picture.sources
    .map(
      (source) =>
        `<source type="${source.type}" srcset="${source.srcset}" sizes="${source.sizes || ''}" />`
    )
    .join('\n    ');

  const imgAttrs = [
    `src="${picture.img.src}"`,
    `alt="${escapeHtml(picture.img.alt)}"`,
    picture.img.width ? `width="${picture.img.width}"` : '',
    picture.img.height ? `height="${picture.img.height}"` : '',
    `loading="${picture.img.loading}"`,
    picture.img.fetchpriority ? `fetchpriority="${picture.img.fetchpriority}"` : '',
    `decoding="${picture.img.decoding}"`,
    picture.img.sizes ? `sizes="${picture.img.sizes}"` : '',
    picture.img.className ? `class="${picture.img.className}"` : '',
  ]
    .filter(Boolean)
    .join(' ');

  return `<picture>
    ${sourcesHtml}
    <img ${imgAttrs} />
  </picture>`;
}

/**
 * Get preload link attributes for LCP image
 *
 * Use this to add a preload hint in the <head> for LCP images.
 */
export function getPreloadLinkAttrs(
  src: string,
  breakpoints: ResponsiveBreakpoint[] = DEFAULT_BREAKPOINTS
): {
  rel: 'preload';
  as: 'image';
  href: string;
  imagesrcset: string;
  imagesizes: string;
} {
  return {
    rel: 'preload',
    as: 'image',
    href: getResizedImageUrl(src, breakpoints[breakpoints.length - 1].width),
    imagesrcset: generateSrcset(src, breakpoints),
    imagesizes: DEFAULT_SIZES,
  };
}

/**
 * Check if an image URL is from an external domain
 */
export function isExternalImage(src: string): boolean {
  if (src.startsWith('/') || src.startsWith('./') || src.startsWith('../')) {
    return false;
  }
  try {
    const url = new URL(src);
    return url.hostname !== 'localhost' && !url.hostname.includes('127.0.0.1');
  } catch {
    return false;
  }
}

/**
 * Get recommended image dimensions based on container
 */
export function getRecommendedDimensions(
  containerWidth: number,
  aspectRatio: number = 16 / 9
): { width: number; height: number } {
  // Find the closest breakpoint that's larger than the container
  const breakpoint = DEFAULT_BREAKPOINTS.find((bp) => bp.width >= containerWidth);
  const width = breakpoint?.width || DEFAULT_BREAKPOINTS[DEFAULT_BREAKPOINTS.length - 1].width;
  const height = Math.round(width / aspectRatio);

  return { width, height };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Escape HTML special characters
 */
function escapeHtml(str: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return str.replace(/[&<>"']/g, (char) => htmlEscapes[char] || char);
}

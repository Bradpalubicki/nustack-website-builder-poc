/**
 * SEO Audit Checks
 *
 * Comprehensive SEO audit checks organized by category with weighted scoring.
 * Categories: Technical, Content, Local, Schema, E-E-A-T, AI Search
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type AuditCheckCategory =
  | 'technical'
  | 'content'
  | 'local'
  | 'schema'
  | 'eeat'
  | 'ai-search';

export type CheckSeverity = 'critical' | 'warning' | 'info';

export type CheckStatus = 'passed' | 'failed' | 'warning' | 'skipped' | 'info';

export interface AuditCheck {
  /** Unique check identifier */
  id: string;
  /** Check name */
  name: string;
  /** Check description */
  description: string;
  /** Category for grouping */
  category: AuditCheckCategory;
  /** Weight for scoring (1-10) */
  weight: number;
  /** Severity if check fails */
  severity: CheckSeverity;
  /** Check function - returns true if passed */
  check: (context: AuditContext) => CheckResult | Promise<CheckResult>;
  /** How to fix if failed */
  fix?: string;
  /** Link to documentation */
  docsUrl?: string;
}

export interface CheckResult {
  /** Did the check pass */
  passed: boolean;
  /** Status for nuanced results */
  status: CheckStatus;
  /** Details about what was found */
  details?: string;
  /** Specific value found (for display) */
  value?: string | number;
  /** Expected value */
  expected?: string | number;
  /** Data for recommendations */
  data?: Record<string, unknown>;
}

export interface AuditContext {
  /** The URL being audited */
  url: string;
  /** HTML content of the page */
  html: string;
  /** Parsed document (if available) */
  document?: Document;
  /** HTTP response headers */
  headers?: Record<string, string>;
  /** Business information */
  business?: {
    name: string;
    address?: string;
    phone?: string;
    industry?: string;
  };
  /** Page metadata */
  meta?: {
    title?: string;
    description?: string;
    canonical?: string;
  };
  /** Performance metrics (from Lighthouse/CrUX) */
  performance?: {
    lcp?: number;
    fid?: number;
    cls?: number;
    inp?: number;
    ttfb?: number;
  };
  /** Options for the audit */
  options?: {
    checkLocal?: boolean;
    checkEEAT?: boolean;
    industry?: string;
  };
}

// ============================================================================
// CATEGORY WEIGHTS
// ============================================================================

/**
 * Category weights for overall score calculation
 * These determine how much each category contributes to the final score
 */
export const CategoryWeights: Record<AuditCheckCategory, number> = {
  technical: 0.25,    // 25% - Core technical SEO
  content: 0.20,      // 20% - Content optimization
  local: 0.15,        // 15% - Local SEO (if applicable)
  schema: 0.15,       // 15% - Structured data
  eeat: 0.15,         // 15% - E-E-A-T signals
  'ai-search': 0.10,  // 10% - AI search optimization
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function extractMetaContent(html: string, name: string): string | null {
  const regex = new RegExp(
    `<meta[^>]*(?:name|property)=["']${name}["'][^>]*content=["']([^"']*)["']|<meta[^>]*content=["']([^"']*)["'][^>]*(?:name|property)=["']${name}["']`,
    'i'
  );
  const match = html.match(regex);
  return match ? match[1] || match[2] || null : null;
}

function extractTitle(html: string): string | null {
  const match = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return match ? match[1].trim() : null;
}

function extractCanonical(html: string): string | null {
  const match = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i);
  return match ? match[1] : null;
}

function countHeadings(html: string, level: number): number {
  const regex = new RegExp(`<h${level}[^>]*>`, 'gi');
  const matches = html.match(regex);
  return matches ? matches.length : 0;
}

function hasElement(html: string, selector: string): boolean {
  // Simple element detection for common patterns
  const tagMatch = selector.match(/^([a-z]+)/i);
  if (tagMatch) {
    const tag = tagMatch[1];
    return new RegExp(`<${tag}[^>]*>`, 'i').test(html);
  }
  return false;
}

// ============================================================================
// TECHNICAL SEO CHECKS
// ============================================================================

export const TechnicalChecks: AuditCheck[] = [
  {
    id: 'meta-title',
    name: 'Meta Title',
    description: 'Page has a meta title between 50-60 characters',
    category: 'technical',
    weight: 10,
    severity: 'critical',
    check: (ctx) => {
      const title = extractTitle(ctx.html);
      if (!title) {
        return {
          passed: false,
          status: 'failed',
          details: 'No title tag found',
        };
      }
      const length = title.length;
      if (length < 30) {
        return {
          passed: false,
          status: 'warning',
          details: `Title too short (${length} chars)`,
          value: length,
          expected: '50-60',
        };
      }
      if (length > 70) {
        return {
          passed: false,
          status: 'warning',
          details: `Title too long (${length} chars)`,
          value: length,
          expected: '50-60',
        };
      }
      return {
        passed: true,
        status: 'passed',
        value: length,
        details: `Title length: ${length} characters`,
      };
    },
    fix: 'Add a unique, descriptive title tag between 50-60 characters',
  },
  {
    id: 'meta-description',
    name: 'Meta Description',
    description: 'Page has a meta description between 150-160 characters',
    category: 'technical',
    weight: 9,
    severity: 'critical',
    check: (ctx) => {
      const description = extractMetaContent(ctx.html, 'description');
      if (!description) {
        return {
          passed: false,
          status: 'failed',
          details: 'No meta description found',
        };
      }
      const length = description.length;
      if (length < 120) {
        return {
          passed: false,
          status: 'warning',
          details: `Description too short (${length} chars)`,
          value: length,
          expected: '150-160',
        };
      }
      if (length > 170) {
        return {
          passed: false,
          status: 'warning',
          details: `Description too long (${length} chars)`,
          value: length,
          expected: '150-160',
        };
      }
      return {
        passed: true,
        status: 'passed',
        value: length,
        details: `Description length: ${length} characters`,
      };
    },
    fix: 'Add a compelling meta description between 150-160 characters',
  },
  {
    id: 'canonical-url',
    name: 'Canonical URL',
    description: 'Page has a canonical URL specified',
    category: 'technical',
    weight: 8,
    severity: 'warning',
    check: (ctx) => {
      const canonical = extractCanonical(ctx.html);
      if (!canonical) {
        return {
          passed: false,
          status: 'failed',
          details: 'No canonical URL found',
        };
      }
      return {
        passed: true,
        status: 'passed',
        value: canonical,
        details: `Canonical: ${canonical}`,
      };
    },
    fix: 'Add <link rel="canonical" href="..."> to specify the preferred URL',
  },
  {
    id: 'heading-h1',
    name: 'H1 Heading',
    description: 'Page has exactly one H1 heading',
    category: 'technical',
    weight: 8,
    severity: 'critical',
    check: (ctx) => {
      const h1Count = countHeadings(ctx.html, 1);
      if (h1Count === 0) {
        return {
          passed: false,
          status: 'failed',
          details: 'No H1 heading found',
          value: h1Count,
          expected: 1,
        };
      }
      if (h1Count > 1) {
        return {
          passed: false,
          status: 'warning',
          details: `Multiple H1 headings (${h1Count})`,
          value: h1Count,
          expected: 1,
        };
      }
      return {
        passed: true,
        status: 'passed',
        value: h1Count,
        details: 'Single H1 heading present',
      };
    },
    fix: 'Use exactly one H1 heading per page for the main title',
  },
  {
    id: 'heading-hierarchy',
    name: 'Heading Hierarchy',
    description: 'Headings follow proper hierarchy (H1 > H2 > H3)',
    category: 'technical',
    weight: 6,
    severity: 'warning',
    check: (ctx) => {
      const h1 = countHeadings(ctx.html, 1);
      const h2 = countHeadings(ctx.html, 2);
      const h3 = countHeadings(ctx.html, 3);

      if (h1 === 0) {
        return {
          passed: false,
          status: 'failed',
          details: 'No H1 heading found',
        };
      }
      if (h3 > 0 && h2 === 0) {
        return {
          passed: false,
          status: 'warning',
          details: 'H3 present without H2 - broken hierarchy',
        };
      }
      return {
        passed: true,
        status: 'passed',
        details: `Heading structure: H1(${h1}), H2(${h2}), H3(${h3})`,
      };
    },
    fix: 'Use headings in proper order: H1 first, then H2, then H3',
  },
  {
    id: 'image-alt',
    name: 'Image Alt Text',
    description: 'All images have alt attributes',
    category: 'technical',
    weight: 7,
    severity: 'warning',
    check: (ctx) => {
      const imgRegex = /<img[^>]*>/gi;
      const images = ctx.html.match(imgRegex) || [];
      const withoutAlt = images.filter((img) => !img.includes('alt='));

      if (images.length === 0) {
        return {
          passed: true,
          status: 'passed',
          details: 'No images found',
        };
      }
      if (withoutAlt.length > 0) {
        return {
          passed: false,
          status: 'failed',
          details: `${withoutAlt.length}/${images.length} images missing alt text`,
          value: withoutAlt.length,
          expected: 0,
        };
      }
      return {
        passed: true,
        status: 'passed',
        details: `All ${images.length} images have alt text`,
      };
    },
    fix: 'Add descriptive alt text to all images (use alt="" for decorative images)',
  },
  {
    id: 'viewport-meta',
    name: 'Viewport Meta Tag',
    description: 'Page has responsive viewport meta tag',
    category: 'technical',
    weight: 8,
    severity: 'critical',
    check: (ctx) => {
      const hasViewport = /<meta[^>]*name=["']viewport["'][^>]*>/i.test(ctx.html);
      if (!hasViewport) {
        return {
          passed: false,
          status: 'failed',
          details: 'No viewport meta tag found',
        };
      }
      return {
        passed: true,
        status: 'passed',
        details: 'Viewport meta tag present',
      };
    },
    fix: 'Add <meta name="viewport" content="width=device-width, initial-scale=1">',
  },
  {
    id: 'lang-attribute',
    name: 'Language Attribute',
    description: 'HTML element has lang attribute',
    category: 'technical',
    weight: 6,
    severity: 'warning',
    check: (ctx) => {
      const hasLang = /<html[^>]*lang=["'][a-z]{2,}["']/i.test(ctx.html);
      if (!hasLang) {
        return {
          passed: false,
          status: 'failed',
          details: 'No lang attribute on <html>',
        };
      }
      const match = ctx.html.match(/<html[^>]*lang=["']([a-z]{2,})["']/i);
      return {
        passed: true,
        status: 'passed',
        value: match?.[1],
        details: `Language: ${match?.[1] || 'unknown'}`,
      };
    },
    fix: 'Add lang attribute to <html> element (e.g., lang="en")',
  },
  {
    id: 'robots-meta',
    name: 'Robots Meta Tag',
    description: 'No blocking robots directives',
    category: 'technical',
    weight: 9,
    severity: 'critical',
    check: (ctx) => {
      const robotsContent = extractMetaContent(ctx.html, 'robots');
      if (!robotsContent) {
        return {
          passed: true,
          status: 'passed',
          details: 'No robots meta (default: index, follow)',
        };
      }
      const lower = robotsContent.toLowerCase();
      if (lower.includes('noindex') || lower.includes('nofollow')) {
        return {
          passed: false,
          status: 'warning',
          details: `Robots directive: ${robotsContent}`,
          value: robotsContent,
        };
      }
      return {
        passed: true,
        status: 'passed',
        value: robotsContent,
        details: `Robots: ${robotsContent}`,
      };
    },
    fix: 'Remove noindex/nofollow if page should be indexed',
  },
  {
    id: 'https',
    name: 'HTTPS',
    description: 'Page uses HTTPS',
    category: 'technical',
    weight: 10,
    severity: 'critical',
    check: (ctx) => {
      const isHttps = ctx.url.startsWith('https://');
      if (!isHttps) {
        return {
          passed: false,
          status: 'failed',
          details: 'Page not using HTTPS',
        };
      }
      return {
        passed: true,
        status: 'passed',
        details: 'HTTPS enabled',
      };
    },
    fix: 'Migrate to HTTPS and set up proper redirects',
  },
];

// ============================================================================
// CONTENT SEO CHECKS
// ============================================================================

export const ContentChecks: AuditCheck[] = [
  {
    id: 'content-length',
    name: 'Content Length',
    description: 'Page has sufficient content (500+ words)',
    category: 'content',
    weight: 8,
    severity: 'warning',
    check: (ctx) => {
      // Strip HTML tags and count words
      const textContent = ctx.html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      const wordCount = textContent.split(' ').filter((w) => w.length > 0).length;

      if (wordCount < 300) {
        return {
          passed: false,
          status: 'failed',
          details: `Thin content (${wordCount} words)`,
          value: wordCount,
          expected: '500+',
        };
      }
      if (wordCount < 500) {
        return {
          passed: false,
          status: 'warning',
          details: `Content could be more comprehensive (${wordCount} words)`,
          value: wordCount,
          expected: '500+',
        };
      }
      return {
        passed: true,
        status: 'passed',
        value: wordCount,
        details: `Word count: ${wordCount}`,
      };
    },
    fix: 'Add more comprehensive, valuable content to the page',
  },
  {
    id: 'keyword-in-title',
    name: 'Primary Keyword in Title',
    description: 'Main keyword appears in title tag',
    category: 'content',
    weight: 7,
    severity: 'warning',
    check: (ctx) => {
      // This check requires keyword context - mark as passed if no keyword specified
      return {
        passed: true,
        status: 'skipped',
        details: 'Keyword analysis requires target keyword input',
      };
    },
    fix: 'Include your primary keyword naturally in the title tag',
  },
  {
    id: 'internal-links',
    name: 'Internal Links',
    description: 'Page has internal links to other pages',
    category: 'content',
    weight: 6,
    severity: 'info',
    check: (ctx) => {
      const urlObj = new URL(ctx.url);
      const domain = urlObj.hostname;
      const linkRegex = /<a[^>]*href=["']([^"']*)["'][^>]*>/gi;
      const links = [...ctx.html.matchAll(linkRegex)];

      const internalLinks = links.filter((match) => {
        const href = match[1];
        if (href.startsWith('/') && !href.startsWith('//')) return true;
        if (href.includes(domain)) return true;
        return false;
      });

      if (internalLinks.length < 3) {
        return {
          passed: false,
          status: 'warning',
          details: `Only ${internalLinks.length} internal links`,
          value: internalLinks.length,
          expected: '3+',
        };
      }
      return {
        passed: true,
        status: 'passed',
        value: internalLinks.length,
        details: `${internalLinks.length} internal links`,
      };
    },
    fix: 'Add relevant internal links to improve site navigation and link equity',
  },
  {
    id: 'external-links',
    name: 'External Links',
    description: 'Page has relevant external links (authority signals)',
    category: 'content',
    weight: 4,
    severity: 'info',
    check: (ctx) => {
      const urlObj = new URL(ctx.url);
      const domain = urlObj.hostname;
      const linkRegex = /<a[^>]*href=["'](https?:\/\/[^"']*)["'][^>]*>/gi;
      const links = [...ctx.html.matchAll(linkRegex)];

      const externalLinks = links.filter((match) => {
        const href = match[1];
        return !href.includes(domain);
      });

      return {
        passed: true,
        status: 'passed',
        value: externalLinks.length,
        details: `${externalLinks.length} external links`,
      };
    },
  },
  {
    id: 'readable-urls',
    name: 'Readable URLs',
    description: 'URL is human-readable and descriptive',
    category: 'content',
    weight: 5,
    severity: 'info',
    check: (ctx) => {
      const urlObj = new URL(ctx.url);
      const path = urlObj.pathname;

      // Check for bad URL patterns
      const hasNumbers = /\d{5,}/.test(path); // Long number sequences
      const hasSpecialChars = /[%&=?]/.test(path); // Encoded or query chars
      const hasUnderscores = path.includes('_'); // Underscores instead of hyphens

      if (hasNumbers || hasSpecialChars) {
        return {
          passed: false,
          status: 'warning',
          details: 'URL contains complex patterns',
          value: path,
        };
      }
      if (hasUnderscores) {
        return {
          passed: false,
          status: 'info',
          details: 'URL uses underscores (prefer hyphens)',
          value: path,
        };
      }
      return {
        passed: true,
        status: 'passed',
        details: 'URL is clean and readable',
        value: path,
      };
    },
    fix: 'Use clean, readable URLs with hyphens instead of underscores',
  },
];

// ============================================================================
// LOCAL SEO CHECKS
// ============================================================================

export const LocalChecks: AuditCheck[] = [
  {
    id: 'nap-present',
    name: 'NAP Information',
    description: 'Name, Address, Phone visible on page',
    category: 'local',
    weight: 10,
    severity: 'critical',
    check: (ctx) => {
      if (!ctx.options?.checkLocal) {
        return { passed: true, status: 'skipped', details: 'Local SEO check disabled' };
      }

      const hasPhone = /(\(\d{3}\)\s*\d{3}[-.\s]?\d{4}|\d{3}[-.\s]\d{3}[-.\s]\d{4})/.test(ctx.html);
      const hasAddress = /(street|ave|avenue|blvd|road|rd|suite|ste|floor)\b/i.test(ctx.html);

      if (!hasPhone && !hasAddress) {
        return {
          passed: false,
          status: 'failed',
          details: 'No contact information found',
        };
      }
      if (!hasPhone) {
        return {
          passed: false,
          status: 'warning',
          details: 'Phone number not found',
        };
      }
      if (!hasAddress) {
        return {
          passed: false,
          status: 'warning',
          details: 'Address not found',
        };
      }
      return {
        passed: true,
        status: 'passed',
        details: 'NAP information present',
      };
    },
    fix: 'Display business name, address, and phone number prominently',
  },
  {
    id: 'local-schema',
    name: 'LocalBusiness Schema',
    description: 'LocalBusiness structured data present',
    category: 'local',
    weight: 9,
    severity: 'warning',
    check: (ctx) => {
      if (!ctx.options?.checkLocal) {
        return { passed: true, status: 'skipped', details: 'Local SEO check disabled' };
      }

      const hasLocalSchema = /LocalBusiness|Organization/.test(ctx.html);
      if (!hasLocalSchema) {
        return {
          passed: false,
          status: 'failed',
          details: 'No LocalBusiness schema found',
        };
      }
      return {
        passed: true,
        status: 'passed',
        details: 'LocalBusiness schema present',
      };
    },
    fix: 'Add LocalBusiness Schema.org structured data',
  },
  {
    id: 'google-maps',
    name: 'Google Maps Embed',
    description: 'Google Maps embed or link present',
    category: 'local',
    weight: 5,
    severity: 'info',
    check: (ctx) => {
      if (!ctx.options?.checkLocal) {
        return { passed: true, status: 'skipped', details: 'Local SEO check disabled' };
      }

      const hasMap = /maps\.google\.com|google\.com\/maps|goo\.gl\/maps/.test(ctx.html);
      if (!hasMap) {
        return {
          passed: false,
          status: 'info',
          details: 'No Google Maps embed found',
        };
      }
      return {
        passed: true,
        status: 'passed',
        details: 'Google Maps present',
      };
    },
    fix: 'Embed Google Maps or link to Google Maps location',
  },
  {
    id: 'service-areas',
    name: 'Service Area Mentions',
    description: 'Geographic service areas mentioned',
    category: 'local',
    weight: 6,
    severity: 'info',
    check: (ctx) => {
      if (!ctx.options?.checkLocal) {
        return { passed: true, status: 'skipped', details: 'Local SEO check disabled' };
      }

      // Basic check for geographic terms
      const geoTerms = /serving|service area|located in|based in|\b(city|county|region|area)\b/i;
      const hasGeo = geoTerms.test(ctx.html);

      return {
        passed: hasGeo,
        status: hasGeo ? 'passed' : 'info',
        details: hasGeo ? 'Service area content found' : 'No service area mentions',
      };
    },
    fix: 'Mention service areas and geographic locations you serve',
  },
];

// ============================================================================
// SCHEMA/STRUCTURED DATA CHECKS
// ============================================================================

export const SchemaChecks: AuditCheck[] = [
  {
    id: 'schema-present',
    name: 'Schema.org Markup',
    description: 'Page has Schema.org structured data',
    category: 'schema',
    weight: 8,
    severity: 'warning',
    check: (ctx) => {
      const hasSchema = /application\/ld\+json/.test(ctx.html);
      const hasMicrodata = /itemtype=.*schema\.org/i.test(ctx.html);

      if (!hasSchema && !hasMicrodata) {
        return {
          passed: false,
          status: 'failed',
          details: 'No Schema.org markup found',
        };
      }
      return {
        passed: true,
        status: 'passed',
        details: hasSchema ? 'JSON-LD schema present' : 'Microdata schema present',
      };
    },
    fix: 'Add Schema.org structured data in JSON-LD format',
  },
  {
    id: 'schema-organization',
    name: 'Organization Schema',
    description: 'Organization structured data present',
    category: 'schema',
    weight: 7,
    severity: 'info',
    check: (ctx) => {
      const hasOrg = /"@type"\s*:\s*"Organization"/i.test(ctx.html);
      if (!hasOrg) {
        return {
          passed: false,
          status: 'info',
          details: 'No Organization schema found',
        };
      }
      return {
        passed: true,
        status: 'passed',
        details: 'Organization schema present',
      };
    },
    fix: 'Add Organization Schema.org for your business',
  },
  {
    id: 'schema-breadcrumb',
    name: 'Breadcrumb Schema',
    description: 'BreadcrumbList structured data present',
    category: 'schema',
    weight: 5,
    severity: 'info',
    check: (ctx) => {
      const hasBreadcrumb = /"@type"\s*:\s*"BreadcrumbList"/i.test(ctx.html);
      if (!hasBreadcrumb) {
        return {
          passed: false,
          status: 'info',
          details: 'No breadcrumb schema found',
        };
      }
      return {
        passed: true,
        status: 'passed',
        details: 'Breadcrumb schema present',
      };
    },
    fix: 'Add BreadcrumbList Schema.org for navigation path',
  },
  {
    id: 'schema-faq',
    name: 'FAQ Schema',
    description: 'FAQPage structured data for FAQ content',
    category: 'schema',
    weight: 6,
    severity: 'info',
    check: (ctx) => {
      // Check if page has FAQ content
      const hasFAQContent = /faq|frequently asked|questions/i.test(ctx.html);
      const hasFAQSchema = /"@type"\s*:\s*"FAQPage"/i.test(ctx.html);

      if (hasFAQContent && !hasFAQSchema) {
        return {
          passed: false,
          status: 'warning',
          details: 'FAQ content found but no FAQPage schema',
        };
      }
      if (hasFAQSchema) {
        return {
          passed: true,
          status: 'passed',
          details: 'FAQPage schema present',
        };
      }
      return {
        passed: true,
        status: 'skipped',
        details: 'No FAQ content detected',
      };
    },
    fix: 'Add FAQPage Schema.org for FAQ sections',
  },
  {
    id: 'schema-article',
    name: 'Article Schema',
    description: 'Article/BlogPosting structured data for content',
    category: 'schema',
    weight: 6,
    severity: 'info',
    check: (ctx) => {
      const hasArticle = /"@type"\s*:\s*"(Article|BlogPosting|NewsArticle)"/i.test(ctx.html);
      // Check if it looks like an article page
      const isArticlePage = /<article[^>]*>/i.test(ctx.html) ||
        /published|posted|author/i.test(ctx.html);

      if (isArticlePage && !hasArticle) {
        return {
          passed: false,
          status: 'warning',
          details: 'Article content found but no Article schema',
        };
      }
      if (hasArticle) {
        return {
          passed: true,
          status: 'passed',
          details: 'Article schema present',
        };
      }
      return {
        passed: true,
        status: 'skipped',
        details: 'Not an article page',
      };
    },
    fix: 'Add Article or BlogPosting Schema.org for article pages',
  },
];

// ============================================================================
// E-E-A-T CHECKS
// ============================================================================

export const EEATChecks: AuditCheck[] = [
  {
    id: 'author-info',
    name: 'Author Information',
    description: 'Content has author attribution with credentials',
    category: 'eeat',
    weight: 9,
    severity: 'warning',
    check: (ctx) => {
      if (!ctx.options?.checkEEAT) {
        return { passed: true, status: 'skipped', details: 'E-E-A-T check disabled' };
      }

      const hasAuthor = /author|written by|by\s+[A-Z][a-z]+\s+[A-Z]/i.test(ctx.html);
      const hasAuthorSchema = /"@type"\s*:\s*"Person"/.test(ctx.html);

      if (!hasAuthor && !hasAuthorSchema) {
        return {
          passed: false,
          status: 'warning',
          details: 'No author attribution found',
        };
      }
      return {
        passed: true,
        status: 'passed',
        details: 'Author information present',
      };
    },
    fix: 'Add author name and credentials to content',
  },
  {
    id: 'publish-date',
    name: 'Publication Date',
    description: 'Content has visible publication date',
    category: 'eeat',
    weight: 7,
    severity: 'warning',
    check: (ctx) => {
      if (!ctx.options?.checkEEAT) {
        return { passed: true, status: 'skipped', details: 'E-E-A-T check disabled' };
      }

      const hasDate = /published|posted|updated|date/i.test(ctx.html);
      const hasDateSchema = /datePublished|dateModified/.test(ctx.html);

      if (!hasDate && !hasDateSchema) {
        return {
          passed: false,
          status: 'warning',
          details: 'No publication date found',
        };
      }
      return {
        passed: true,
        status: 'passed',
        details: 'Publication date present',
      };
    },
    fix: 'Display publication and last updated dates',
  },
  {
    id: 'sources-citations',
    name: 'Sources & Citations',
    description: 'Content cites authoritative sources (YMYL content)',
    category: 'eeat',
    weight: 8,
    severity: 'warning',
    check: (ctx) => {
      if (!ctx.options?.checkEEAT) {
        return { passed: true, status: 'skipped', details: 'E-E-A-T check disabled' };
      }

      // Check for citations or source links
      const hasCitations = /source|citation|reference|according to|study|research/i.test(ctx.html);
      const hasExternalLinks = /<a[^>]*href=["']https?:\/\/(?!.*(?:facebook|twitter|linkedin))/i.test(ctx.html);

      if (!hasCitations && !hasExternalLinks) {
        return {
          passed: false,
          status: 'info',
          details: 'No source citations detected',
        };
      }
      return {
        passed: true,
        status: 'passed',
        details: 'Sources/citations found',
      };
    },
    fix: 'Add citations to authoritative sources for factual claims',
  },
  {
    id: 'about-page-link',
    name: 'About Page Link',
    description: 'Link to About page visible',
    category: 'eeat',
    weight: 6,
    severity: 'info',
    check: (ctx) => {
      const hasAboutLink = /href=["'][^"']*about/i.test(ctx.html);
      if (!hasAboutLink) {
        return {
          passed: false,
          status: 'info',
          details: 'No About page link found',
        };
      }
      return {
        passed: true,
        status: 'passed',
        details: 'About page link present',
      };
    },
    fix: 'Add visible link to About page in navigation or footer',
  },
  {
    id: 'contact-info',
    name: 'Contact Information',
    description: 'Contact information or page link visible',
    category: 'eeat',
    weight: 7,
    severity: 'warning',
    check: (ctx) => {
      const hasContactLink = /href=["'][^"']*contact/i.test(ctx.html);
      const hasPhone = /(\(\d{3}\)\s*\d{3}[-.\s]?\d{4}|\d{3}[-.\s]\d{3}[-.\s]\d{4})/.test(ctx.html);
      const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(ctx.html);

      if (!hasContactLink && !hasPhone && !hasEmail) {
        return {
          passed: false,
          status: 'warning',
          details: 'No contact information found',
        };
      }
      return {
        passed: true,
        status: 'passed',
        details: 'Contact information present',
      };
    },
    fix: 'Add contact page link, phone, or email to footer',
  },
  {
    id: 'privacy-policy',
    name: 'Privacy Policy Link',
    description: 'Link to privacy policy visible',
    category: 'eeat',
    weight: 6,
    severity: 'warning',
    check: (ctx) => {
      const hasPrivacyLink = /href=["'][^"']*privacy/i.test(ctx.html);
      if (!hasPrivacyLink) {
        return {
          passed: false,
          status: 'warning',
          details: 'No privacy policy link found',
        };
      }
      return {
        passed: true,
        status: 'passed',
        details: 'Privacy policy link present',
      };
    },
    fix: 'Add link to privacy policy in footer',
  },
  {
    id: 'medical-review',
    name: 'Medical Review (Healthcare)',
    description: 'Medical content reviewed by healthcare professional',
    category: 'eeat',
    weight: 10,
    severity: 'critical',
    check: (ctx) => {
      if (ctx.options?.industry !== 'healthcare') {
        return { passed: true, status: 'skipped', details: 'Not healthcare content' };
      }

      const hasReview = /reviewed by|medical review|verified by|fact.?check/i.test(ctx.html);
      const hasCredentials = /\b(MD|DO|NP|RN|PA|PharmD|PhD)\b/.test(ctx.html);

      if (!hasReview) {
        return {
          passed: false,
          status: 'warning',
          details: 'No medical review indication found',
        };
      }
      if (!hasCredentials) {
        return {
          passed: false,
          status: 'warning',
          details: 'Reviewer credentials not displayed',
        };
      }
      return {
        passed: true,
        status: 'passed',
        details: 'Medical review with credentials present',
      };
    },
    fix: 'Add medical reviewer with credentials (MD, DO, NP, etc.)',
  },
];

// ============================================================================
// AI SEARCH CHECKS
// ============================================================================

export const AISearchChecks: AuditCheck[] = [
  {
    id: 'direct-answer',
    name: 'Direct Answer Format',
    description: 'Content starts with direct answer to likely queries',
    category: 'ai-search',
    weight: 7,
    severity: 'info',
    check: (ctx) => {
      // Check for direct answer patterns in first 500 chars
      const firstPart = ctx.html.slice(0, 2000);
      const hasDirectFormat = /is|are|means|refers to|defined as/i.test(firstPart);

      return {
        passed: hasDirectFormat,
        status: hasDirectFormat ? 'passed' : 'info',
        details: hasDirectFormat
          ? 'Content uses direct answer format'
          : 'Consider starting with direct answer',
      };
    },
    fix: 'Start content with direct answer to the main question',
  },
  {
    id: 'structured-content',
    name: 'Structured Content',
    description: 'Content uses headers, lists, and structured formatting',
    category: 'ai-search',
    weight: 6,
    severity: 'info',
    check: (ctx) => {
      const hasHeaders = /<h[2-4][^>]*>/i.test(ctx.html);
      const hasLists = /<[ou]l[^>]*>/i.test(ctx.html);
      const hasTables = /<table[^>]*>/i.test(ctx.html);

      const structureCount = [hasHeaders, hasLists, hasTables].filter(Boolean).length;

      if (structureCount === 0) {
        return {
          passed: false,
          status: 'warning',
          details: 'No structured content elements found',
        };
      }
      return {
        passed: true,
        status: 'passed',
        details: `${structureCount} structure types used`,
      };
    },
    fix: 'Add headers, lists, and structured formatting for AI comprehension',
  },
  {
    id: 'faq-format',
    name: 'FAQ Format',
    description: 'Content includes FAQ section for AI snippets',
    category: 'ai-search',
    weight: 5,
    severity: 'info',
    check: (ctx) => {
      const hasFAQ = /faq|frequently asked|common questions/i.test(ctx.html);
      const hasQAFormat = /\?[\s]*<\/h[2-4]>/i.test(ctx.html); // Questions in headings

      if (!hasFAQ && !hasQAFormat) {
        return {
          passed: false,
          status: 'info',
          details: 'No FAQ format detected',
        };
      }
      return {
        passed: true,
        status: 'passed',
        details: 'FAQ format present',
      };
    },
    fix: 'Add FAQ section with question-answer pairs',
  },
  {
    id: 'stat-claims',
    name: 'Statistics with Sources',
    description: 'Statistics and claims include sources',
    category: 'ai-search',
    weight: 6,
    severity: 'info',
    check: (ctx) => {
      // Check for statistics patterns
      const hasStats = /\d+%|\d+\s*(million|billion|thousand)/i.test(ctx.html);
      const hasSources = /source|according to|study|research|report/i.test(ctx.html);

      if (hasStats && !hasSources) {
        return {
          passed: false,
          status: 'warning',
          details: 'Statistics found without source attribution',
        };
      }
      return {
        passed: true,
        status: 'passed',
        details: hasStats ? 'Statistics with sources' : 'No statistics detected',
      };
    },
    fix: 'Add source attribution for all statistics and claims',
  },
  {
    id: 'semantic-html',
    name: 'Semantic HTML',
    description: 'Uses semantic HTML elements (article, section, nav, etc.)',
    category: 'ai-search',
    weight: 5,
    severity: 'info',
    check: (ctx) => {
      const hasArticle = /<article[^>]*>/i.test(ctx.html);
      const hasSection = /<section[^>]*>/i.test(ctx.html);
      const hasMain = /<main[^>]*>/i.test(ctx.html);
      const hasNav = /<nav[^>]*>/i.test(ctx.html);

      const semanticCount = [hasArticle, hasSection, hasMain, hasNav].filter(Boolean).length;

      if (semanticCount < 2) {
        return {
          passed: false,
          status: 'info',
          details: `Only ${semanticCount} semantic elements used`,
        };
      }
      return {
        passed: true,
        status: 'passed',
        details: `${semanticCount} semantic elements used`,
      };
    },
    fix: 'Use semantic HTML elements (article, section, main, nav)',
  },
];

// ============================================================================
// ALL CHECKS COMBINED
// ============================================================================

export const AllChecks: AuditCheck[] = [
  ...TechnicalChecks,
  ...ContentChecks,
  ...LocalChecks,
  ...SchemaChecks,
  ...EEATChecks,
  ...AISearchChecks,
];

/**
 * Get checks by category
 */
export function getChecksByCategory(category: AuditCheckCategory): AuditCheck[] {
  return AllChecks.filter((check) => check.category === category);
}

/**
 * Get all check categories
 */
export function getCheckCategories(): AuditCheckCategory[] {
  return ['technical', 'content', 'local', 'schema', 'eeat', 'ai-search'];
}

/**
 * Get check by ID
 */
export function getCheckById(id: string): AuditCheck | undefined {
  return AllChecks.find((check) => check.id === id);
}

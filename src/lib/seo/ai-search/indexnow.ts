/**
 * IndexNow Integration
 *
 * Instant indexing for Bing, Yandex, and other search engines.
 * Notifies search engines immediately when content is published or updated.
 *
 * @see https://www.indexnow.org/
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Supported IndexNow search engines
 */
export type IndexNowEngine = 'bing' | 'yandex' | 'seznam' | 'naver';

/**
 * IndexNow submission result
 */
export interface IndexNowResult {
  success: boolean;
  engine: IndexNowEngine;
  statusCode?: number;
  message?: string;
  submittedUrls: string[];
  timestamp: string;
}

/**
 * Batch submission result
 */
export interface IndexNowBatchResult {
  totalUrls: number;
  results: IndexNowResult[];
  summary: {
    successful: number;
    failed: number;
    engines: IndexNowEngine[];
  };
}

/**
 * IndexNow configuration
 */
export interface IndexNowConfig {
  /** API key (32-128 hex characters) */
  apiKey: string;
  /** Site host without protocol */
  host: string;
  /** Key location path (default: /{apiKey}.txt) */
  keyLocation?: string;
  /** Engines to submit to */
  engines?: IndexNowEngine[];
}

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * IndexNow API endpoints by engine
 */
export const INDEXNOW_ENDPOINTS: Record<IndexNowEngine, string> = {
  bing: 'https://www.bing.com/indexnow',
  yandex: 'https://yandex.com/indexnow',
  seznam: 'https://search.seznam.cz/indexnow',
  naver: 'https://searchadvisor.naver.com/indexnow',
};

/**
 * Default engines to submit to
 */
export const DEFAULT_ENGINES: IndexNowEngine[] = ['bing', 'yandex'];

/**
 * Maximum URLs per batch submission
 */
export const MAX_URLS_PER_BATCH = 10000;

/**
 * Rate limiting configuration
 */
export const RATE_LIMITS = {
  /** Maximum submissions per day */
  dailyLimit: 10000,
  /** Minimum delay between submissions (ms) */
  minDelay: 1000,
  /** Backoff multiplier for retries */
  backoffMultiplier: 2,
  /** Maximum retry attempts */
  maxRetries: 3,
};

// ============================================================================
// MAIN FUNCTIONS
// ============================================================================

/**
 * Submit a single URL to IndexNow
 *
 * @param url - Full URL to submit
 * @param config - IndexNow configuration
 * @returns Promise with submission results
 */
export async function submitUrl(
  url: string,
  config: IndexNowConfig
): Promise<IndexNowBatchResult> {
  return submitUrls([url], config);
}

/**
 * Submit multiple URLs to IndexNow
 *
 * @param urls - Array of full URLs to submit
 * @param config - IndexNow configuration
 * @returns Promise with batch submission results
 */
export async function submitUrls(
  urls: string[],
  config: IndexNowConfig
): Promise<IndexNowBatchResult> {
  // Validate URLs
  const validUrls = urls.filter((url) => isValidUrl(url, config.host));

  if (validUrls.length === 0) {
    return {
      totalUrls: 0,
      results: [],
      summary: {
        successful: 0,
        failed: 0,
        engines: [],
      },
    };
  }

  // Limit batch size
  const urlBatch = validUrls.slice(0, MAX_URLS_PER_BATCH);
  const engines = config.engines || DEFAULT_ENGINES;

  // Submit to all engines in parallel
  const results = await Promise.all(
    engines.map((engine) => submitToEngine(urlBatch, engine, config))
  );

  // Build summary
  const successful = results.filter((r) => r.success).length;

  return {
    totalUrls: urlBatch.length,
    results,
    summary: {
      successful,
      failed: results.length - successful,
      engines,
    },
  };
}

/**
 * Submit URLs to a specific search engine
 */
async function submitToEngine(
  urls: string[],
  engine: IndexNowEngine,
  config: IndexNowConfig
): Promise<IndexNowResult> {
  const endpoint = INDEXNOW_ENDPOINTS[engine];
  const timestamp = new Date().toISOString();

  // Build request body
  const body = {
    host: config.host,
    key: config.apiKey,
    keyLocation: config.keyLocation || `https://${config.host}/${config.apiKey}.txt`,
    urlList: urls,
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    // IndexNow returns various success codes
    const success = response.status >= 200 && response.status < 300;

    return {
      success,
      engine,
      statusCode: response.status,
      message: getStatusMessage(response.status),
      submittedUrls: urls,
      timestamp,
    };
  } catch (error) {
    return {
      success: false,
      engine,
      message: error instanceof Error ? error.message : 'Unknown error',
      submittedUrls: urls,
      timestamp,
    };
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Validate URL belongs to configured host
 */
function isValidUrl(url: string, host: string): boolean {
  try {
    const urlObj = new URL(url);
    const urlHost = urlObj.hostname.replace(/^www\./, '');
    const configHost = host.replace(/^www\./, '');
    return urlHost === configHost;
  } catch {
    return false;
  }
}

/**
 * Get human-readable status message
 */
function getStatusMessage(statusCode: number): string {
  const messages: Record<number, string> = {
    200: 'URL submitted successfully',
    202: 'URL received, pending processing',
    400: 'Invalid request format',
    403: 'Key not valid or not found',
    422: 'Invalid URL format',
    429: 'Rate limit exceeded',
  };

  return messages[statusCode] || `Status code: ${statusCode}`;
}

/**
 * Generate IndexNow API key
 * Must be 32-128 hexadecimal characters
 */
export function generateApiKey(length: number = 32): string {
  if (length < 32 || length > 128) {
    throw new Error('API key length must be between 32 and 128 characters');
  }

  const chars = '0123456789abcdef';
  let key = '';
  for (let i = 0; i < length; i++) {
    key += chars[Math.floor(Math.random() * chars.length)];
  }
  return key;
}

/**
 * Generate key verification file content
 * This file should be placed at /{apiKey}.txt on the site root
 */
export function generateKeyFile(apiKey: string): string {
  return apiKey;
}

// ============================================================================
// CONTENT CHANGE DETECTION
// ============================================================================

/**
 * Content change types that should trigger IndexNow
 */
export type ContentChangeType =
  | 'published'
  | 'updated'
  | 'deleted'
  | 'status_changed';

/**
 * Content change event
 */
export interface ContentChangeEvent {
  url: string;
  changeType: ContentChangeType;
  timestamp: string;
  previousUrl?: string; // For redirects
  metadata?: {
    title?: string;
    contentType?: string;
    author?: string;
  };
}

/**
 * Queue for batching IndexNow submissions
 */
export class IndexNowQueue {
  private queue: ContentChangeEvent[] = [];
  private config: IndexNowConfig;
  private flushTimeout: ReturnType<typeof setTimeout> | null = null;
  private flushInterval: number;

  constructor(config: IndexNowConfig, flushIntervalMs: number = 5000) {
    this.config = config;
    this.flushInterval = flushIntervalMs;
  }

  /**
   * Add a URL change to the queue
   */
  add(event: ContentChangeEvent): void {
    this.queue.push(event);
    this.scheduleFlush();
  }

  /**
   * Add multiple URL changes to the queue
   */
  addBatch(events: ContentChangeEvent[]): void {
    this.queue.push(...events);
    this.scheduleFlush();
  }

  /**
   * Schedule a flush if not already scheduled
   */
  private scheduleFlush(): void {
    if (this.flushTimeout) return;

    this.flushTimeout = setTimeout(() => {
      this.flush();
    }, this.flushInterval);
  }

  /**
   * Flush the queue and submit to IndexNow
   */
  async flush(): Promise<IndexNowBatchResult | null> {
    if (this.flushTimeout) {
      clearTimeout(this.flushTimeout);
      this.flushTimeout = null;
    }

    if (this.queue.length === 0) return null;

    // Get unique URLs (prioritize most recent changes)
    const urlMap = new Map<string, ContentChangeEvent>();
    for (const event of this.queue) {
      urlMap.set(event.url, event);
    }

    const urls = Array.from(urlMap.keys());
    this.queue = [];

    return submitUrls(urls, this.config);
  }

  /**
   * Get current queue size
   */
  get size(): number {
    return this.queue.length;
  }

  /**
   * Clear the queue without submitting
   */
  clear(): void {
    this.queue = [];
    if (this.flushTimeout) {
      clearTimeout(this.flushTimeout);
      this.flushTimeout = null;
    }
  }
}

// ============================================================================
// SITEMAP INTEGRATION
// ============================================================================

/**
 * Extract URLs from a sitemap for bulk submission
 *
 * @param sitemapUrl - URL of the sitemap
 * @returns Promise with array of URLs
 */
export async function extractUrlsFromSitemap(
  sitemapUrl: string
): Promise<string[]> {
  try {
    const response = await fetch(sitemapUrl);
    const xml = await response.text();

    // Simple XML parsing for <loc> tags
    const urlPattern = /<loc>([^<]+)<\/loc>/g;
    const urls: string[] = [];
    let match;

    while ((match = urlPattern.exec(xml)) !== null) {
      urls.push(match[1]);
    }

    return urls;
  } catch (error) {
    console.error('Failed to extract URLs from sitemap:', error);
    return [];
  }
}

/**
 * Submit all URLs from a sitemap to IndexNow
 *
 * @param sitemapUrl - URL of the sitemap
 * @param config - IndexNow configuration
 * @returns Promise with batch submission results
 */
export async function submitSitemap(
  sitemapUrl: string,
  config: IndexNowConfig
): Promise<IndexNowBatchResult> {
  const urls = await extractUrlsFromSitemap(sitemapUrl);
  return submitUrls(urls, config);
}

// ============================================================================
// NEXT.JS INTEGRATION HELPERS
// ============================================================================

/**
 * Create an IndexNow API route handler for Next.js
 *
 * @param config - IndexNow configuration
 * @returns API route handler
 */
export function createIndexNowHandler(config: IndexNowConfig) {
  return async function handler(request: Request): Promise<Response> {
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    try {
      const body = await request.json();
      const { urls } = body as { urls: string[] };

      if (!urls || !Array.isArray(urls)) {
        return new Response(
          JSON.stringify({ error: 'urls array is required' }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      const result = await submitUrls(urls, config);

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: error instanceof Error ? error.message : 'Unknown error',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  };
}

/**
 * Key verification route content
 * Returns the API key for search engine verification
 */
export function createKeyVerificationHandler(apiKey: string) {
  return function handler(): Response {
    return new Response(apiKey, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  };
}

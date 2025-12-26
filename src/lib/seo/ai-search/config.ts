/**
 * GEO (Generative Engine Optimization) Configuration
 *
 * Configuration for AI search platforms including Google AI Overviews,
 * ChatGPT/SearchGPT, and Perplexity AI.
 *
 * Key stats (2025):
 * - AI-referred sessions grew 527% (Jan-May 2025)
 * - Google AI Overviews appear in 16-25% of queries
 * - Content with citations gets 40% more AI citations
 *
 * @see https://www.searchenginejournal.com/ai-overviews-study/
 */

// ============================================================================
// GEO PLATFORM CONFIGURATIONS
// ============================================================================

/**
 * Configuration for major AI search platforms
 */
export const GEOConfig = {
  /**
   * Google AI Overviews (formerly SGE)
   */
  googleAIO: {
    description: 'Google AI Overviews',
    queryTriggers: [
      'Long-tail queries (8+ words) - 7x more likely to trigger',
      'Question-based queries',
      'Comparison queries',
      'Informational intent',
    ],
    stats: {
      /** Percentage of queries showing AI Overview */
      queryPresence: '16-25%',
      /** Average CTR drop when AIO present */
      averageCTRDrop: 34.5,
      /** Percentage of citations from first page results */
      citedFromFirstPage: 57,
      /** Percentage that match #1 organic result */
      matchesTopOrganic: 12,
    },
    optimization: [
      'Direct answer in first paragraph (40-60 words)',
      'Structured formatting: FAQs, numbered lists, tables',
      'Comprehensive schema markup',
      'Topic cluster authority',
      'Clear E-E-A-T signals',
    ],
  },

  /**
   * ChatGPT and SearchGPT
   */
  chatGPT: {
    description: 'ChatGPT/SearchGPT',
    searchIndex: 'Bing',
    /** Only 30-35% of queries trigger web search */
    searchTriggerRate: 35,
    preferredSources: [
      'Wikipedia (47.9% citation rate)',
      'Authoritative directories',
      'List-style long-form articles',
      'Media sources',
    ],
    optimization: [
      'Optimize for Bing first',
      'Build Wikipedia presence',
      'Create comprehensive list articles',
      'Ensure Foursquare listing (60-70% of local data)',
    ],
  },

  /**
   * Perplexity AI
   */
  perplexity: {
    description: 'Perplexity AI',
    stats: {
      /** Monthly query volume */
      monthlyQueries: '500M+',
      /** Percentage overlap with top Bing results */
      bingOverlap: 73,
      /** Conversion rate multiplier vs traditional search */
      conversionMultiplier: 6,
    },
    preferredSources: [
      'Reddit (46.7% of sources)',
      'User-generated content',
      'Forums and discussions',
      'Direct answer content',
    ],
    optimization: [
      'Create community-focused content',
      'Include Reddit-style discussion points',
      'Provide direct, factual answers',
      'Use conversational but authoritative tone',
    ],
  },
} as const;

// ============================================================================
// CONTENT OPTIMIZATION RULES
// ============================================================================

/**
 * Rules for optimizing content for AI search citations
 */
export const ContentOptimizationRules = {
  /**
   * Direct answer requirements
   * Content should immediately answer the main question
   */
  directAnswer: {
    requirement: 'Answer main question in first paragraph',
    wordCount: { min: 40, max: 60 },
    placement: 'Immediately after H1',
  },

  /**
   * Citation requirements for authority signals
   */
  citations: {
    minimum: 3,
    preferred: 5,
    authorityTypes: [
      '.edu domains',
      '.gov domains',
      'Peer-reviewed research',
      'Industry reports',
    ],
    /** Impact on AI citation likelihood */
    impact: '+40% AI citation likelihood',
  },

  /**
   * Statistics requirements
   * Specific data points increase credibility
   */
  statistics: {
    minimum: 5,
    preferred: 12,
    requirement: 'Each statistic must include source',
    format: 'Specific number + context + source attribution',
  },

  /**
   * Expert quote formatting
   */
  quotes: {
    format: '"Quote text" - Expert Name, Title, Organization',
    impact: 'Significant increase in AI citations',
  },

  /**
   * Structural requirements for AI parsing
   */
  structure: {
    required: [
      'Clear H1-H6 hierarchy',
      'Bullet points and numbered lists',
      'HTML tables for comparisons',
      'FAQ section',
      'Definition lists where applicable',
    ],
  },
} as const;

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/** GEO platform names */
export type GEOPlatform = 'googleAIO' | 'chatGPT' | 'perplexity';

/** Content optimization category */
export type OptimizationCategory =
  | 'directAnswer'
  | 'citations'
  | 'statistics'
  | 'quotes'
  | 'structure';

/** Platform statistics */
export interface PlatformStats {
  queryPresence?: string;
  averageCTRDrop?: number;
  citedFromFirstPage?: number;
  matchesTopOrganic?: number;
  monthlyQueries?: string;
  bingOverlap?: number;
  conversionMultiplier?: number;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get optimization tips for a specific platform
 */
export function getOptimizationTips(platform: GEOPlatform): readonly string[] {
  return GEOConfig[platform].optimization;
}

/**
 * Get all platforms that prioritize a specific content type
 */
export function getPlatformsForContentType(
  contentType: 'lists' | 'tables' | 'faqs' | 'statistics' | 'citations'
): GEOPlatform[] {
  const mapping: Record<string, GEOPlatform[]> = {
    lists: ['chatGPT', 'perplexity'],
    tables: ['googleAIO'],
    faqs: ['googleAIO'],
    statistics: ['googleAIO', 'perplexity'],
    citations: ['googleAIO', 'perplexity'],
  };
  return mapping[contentType] || [];
}

/**
 * Check if content meets minimum requirements for AI optimization
 */
export function meetsMinimumRequirements(metrics: {
  citationCount: number;
  statisticCount: number;
  hasDirectAnswer: boolean;
  hasLists: boolean;
  hasTables: boolean;
}): boolean {
  return (
    metrics.citationCount >= ContentOptimizationRules.citations.minimum &&
    metrics.statisticCount >= ContentOptimizationRules.statistics.minimum &&
    metrics.hasDirectAnswer &&
    (metrics.hasLists || metrics.hasTables)
  );
}

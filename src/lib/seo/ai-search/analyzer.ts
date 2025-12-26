/**
 * AI Search Content Analyzer
 *
 * Analyzes content for AI search optimization (GEO).
 * Checks for direct answers, citations, statistics, structure, and quotes.
 *
 * @see ./config.ts for optimization rules
 */

import { ContentOptimizationRules } from './config';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Complete AI search analysis result
 */
export interface AISearchAnalysis {
  /** Overall score (0-100) */
  score: number;

  /** Direct answer analysis */
  directAnswer: {
    present: boolean;
    wordCount: number;
    startsWithAnswer: boolean;
  };

  /** Citation analysis */
  citations: {
    count: number;
    authoritative: number;
    domains: string[];
  };

  /** Statistics analysis */
  statistics: {
    count: number;
    withSources: number;
    examples: string[];
  };

  /** Structure analysis */
  structure: {
    hasLists: boolean;
    hasTables: boolean;
    hasFAQ: boolean;
    headingHierarchy: boolean;
  };

  /** Quote analysis */
  quotes: {
    count: number;
    withAttribution: number;
  };

  /** Specific actionable recommendations */
  recommendations: string[];
}

/** Extracted statistic with source info */
export interface ExtractedStatistic {
  stat: string;
  hasSource: boolean;
}

/** Extracted citation with authority info */
export interface ExtractedCitation {
  url: string;
  isAuthoritative: boolean;
  domain: string;
}

/** Direct answer check result */
export interface DirectAnswerResult {
  present: boolean;
  wordCount: number;
  startsWithAnswer: boolean;
  firstParagraph: string;
}

// ============================================================================
// MAIN ANALYSIS FUNCTION
// ============================================================================

/**
 * Analyze content for AI search optimization
 *
 * @param content - Plain text or markdown content
 * @param html - Optional HTML for structure analysis
 * @returns Complete analysis with score and recommendations
 */
export function analyzeContentForAISearch(
  content: string,
  html?: string
): AISearchAnalysis {
  // Extract components
  const directAnswer = checkDirectAnswer(content);
  const citations = extractCitations(content);
  const statistics = extractStatistics(content);
  const quotes = extractQuotes(content);
  const structure = analyzeStructure(content, html);

  // Count authoritative citations
  const authoritativeCitations = citations.filter((c) => c.isAuthoritative);

  // Build analysis result
  const analysis: AISearchAnalysis = {
    score: 0, // Calculated below
    directAnswer: {
      present: directAnswer.present,
      wordCount: directAnswer.wordCount,
      startsWithAnswer: directAnswer.startsWithAnswer,
    },
    citations: {
      count: citations.length,
      authoritative: authoritativeCitations.length,
      domains: [...new Set(citations.map((c) => c.domain))],
    },
    statistics: {
      count: statistics.length,
      withSources: statistics.filter((s) => s.hasSource).length,
      examples: statistics.slice(0, 5).map((s) => s.stat),
    },
    structure,
    quotes: {
      count: quotes.count,
      withAttribution: quotes.withAttribution,
    },
    recommendations: [],
  };

  // Calculate score and generate recommendations
  analysis.score = calculateScore(analysis);
  analysis.recommendations = generateRecommendations(analysis);

  return analysis;
}

// ============================================================================
// EXTRACTION FUNCTIONS
// ============================================================================

/**
 * Extract statistics from content
 */
export function extractStatistics(content: string): ExtractedStatistic[] {
  const stats: ExtractedStatistic[] = [];

  // Pattern for percentages
  const percentagePattern = /(\d+(?:\.\d+)?%\s*(?:of\s+)?[^.]+)/gi;
  const percentMatches = content.match(percentagePattern) || [];
  percentMatches.forEach((match) => {
    stats.push({
      stat: match.trim(),
      hasSource: hasSourceAttribution(match, content),
    });
  });

  // Pattern for specific numbers with context
  const numberPattern =
    /(?:\$[\d,]+(?:\.\d{2})?|\d{1,3}(?:,\d{3})+|\d+(?:\.\d+)?)\s*(?:million|billion|thousand|M|B|K)?\s*[a-zA-Z]+/gi;
  const numberMatches = content.match(numberPattern) || [];
  numberMatches.forEach((match) => {
    // Avoid duplicates and very short matches
    if (match.length > 10 && !stats.some((s) => s.stat.includes(match))) {
      stats.push({
        stat: match.trim(),
        hasSource: hasSourceAttribution(match, content),
      });
    }
  });

  // Pattern for "X times" or "Xx" multipliers
  const multiplierPattern = /\d+(?:\.\d+)?(?:x|X|\s+times)\s+[^.]+/gi;
  const multiplierMatches = content.match(multiplierPattern) || [];
  multiplierMatches.forEach((match) => {
    if (!stats.some((s) => s.stat.includes(match))) {
      stats.push({
        stat: match.trim(),
        hasSource: hasSourceAttribution(match, content),
      });
    }
  });

  return stats;
}

/**
 * Extract citations from content
 */
export function extractCitations(content: string): ExtractedCitation[] {
  const citations: ExtractedCitation[] = [];

  // URL pattern
  const urlPattern = /https?:\/\/[^\s\)\]]+/gi;
  const urls = content.match(urlPattern) || [];

  urls.forEach((url) => {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname.replace(/^www\./, '');

      citations.push({
        url,
        domain,
        isAuthoritative: isAuthoritativeDomain(domain),
      });
    } catch {
      // Invalid URL, skip
    }
  });

  // Also check for markdown links
  const markdownLinkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;
  while ((match = markdownLinkPattern.exec(content)) !== null) {
    const url = match[2];
    if (!citations.some((c) => c.url === url)) {
      try {
        const urlObj = new URL(url);
        const domain = urlObj.hostname.replace(/^www\./, '');
        citations.push({
          url,
          domain,
          isAuthoritative: isAuthoritativeDomain(domain),
        });
      } catch {
        // Invalid URL, skip
      }
    }
  }

  return citations;
}

/**
 * Check for direct answer in first paragraph
 */
export function checkDirectAnswer(
  content: string,
  targetKeyword?: string
): DirectAnswerResult {
  // Get first paragraph (before first double newline or after first heading)
  const lines = content.split('\n').filter((l) => l.trim());
  let firstParagraph = '';

  for (const line of lines) {
    // Skip headings
    if (line.startsWith('#') || line.startsWith('<h')) continue;
    // Skip empty or very short lines
    if (line.trim().length < 20) continue;

    firstParagraph = line.trim();
    break;
  }

  const wordCount = firstParagraph.split(/\s+/).filter(Boolean).length;

  // Check if it starts with an answer (not a question or preamble)
  const preamblePatterns = [
    /^in this article/i,
    /^this guide/i,
    /^welcome to/i,
    /^today we/i,
    /^have you ever/i,
    /^are you looking/i,
    /^if you're/i,
    /^when it comes to/i,
  ];

  const startsWithPreamble = preamblePatterns.some((pattern) =>
    pattern.test(firstParagraph)
  );
  const startsWithQuestion = /^(what|why|how|when|where|who|is|are|do|does|can|could|should|would)\s/i.test(
    firstParagraph
  );

  const startsWithAnswer = !startsWithPreamble && !startsWithQuestion;

  // Check if word count is in optimal range
  const isOptimalLength =
    wordCount >= ContentOptimizationRules.directAnswer.wordCount.min &&
    wordCount <= ContentOptimizationRules.directAnswer.wordCount.max;

  return {
    present: startsWithAnswer && wordCount >= 20,
    wordCount,
    startsWithAnswer,
    firstParagraph,
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if a domain is authoritative (.edu, .gov, etc.)
 */
function isAuthoritativeDomain(domain: string): boolean {
  const authoritativePatterns = [
    /\.edu$/,
    /\.gov$/,
    /\.org$/,
    /pubmed\.ncbi\.nlm\.nih\.gov/,
    /scholar\.google/,
    /jstor\.org/,
    /sciencedirect\.com/,
    /nature\.com/,
    /nejm\.org/,
    /jamanetwork\.com/,
    /bmj\.com/,
    /lancet\.com/,
    /mayoclinic\.org/,
    /webmd\.com/,
    /healthline\.com/,
    /cdc\.gov/,
    /who\.int/,
    /nih\.gov/,
  ];

  return authoritativePatterns.some((pattern) => pattern.test(domain));
}

/**
 * Check if a statistic has source attribution nearby
 */
function hasSourceAttribution(stat: string, content: string): boolean {
  const statIndex = content.indexOf(stat);
  if (statIndex === -1) return false;

  // Check for source indicators within 200 characters after the stat
  const surroundingText = content.slice(statIndex, statIndex + 200);
  const sourceIndicators = [
    /\(source:/i,
    /according to/i,
    /per\s+[A-Z]/,
    /\([A-Z][a-z]+,?\s*\d{4}\)/,
    /study\s+(?:by|from)/i,
    /research\s+(?:by|from)/i,
    /report\s+(?:by|from)/i,
    /data\s+from/i,
  ];

  return sourceIndicators.some((pattern) => pattern.test(surroundingText));
}

/**
 * Extract quotes from content
 */
function extractQuotes(content: string): { count: number; withAttribution: number } {
  // Pattern for quoted text
  const quotePattern = /"[^"]{20,}"/g;
  const quotes = content.match(quotePattern) || [];

  let withAttribution = 0;
  quotes.forEach((quote) => {
    const quoteIndex = content.indexOf(quote);
    const afterQuote = content.slice(quoteIndex + quote.length, quoteIndex + quote.length + 100);
    // Check for attribution pattern: - Name, Title
    if (/\s*[-–—]\s*[A-Z][a-z]+\s+[A-Z][a-z]+/.test(afterQuote)) {
      withAttribution++;
    }
  });

  return { count: quotes.length, withAttribution };
}

/**
 * Analyze content structure
 */
function analyzeStructure(
  content: string,
  html?: string
): AISearchAnalysis['structure'] {
  const textToCheck = html || content;

  return {
    hasLists:
      /[-*]\s+.+\n/m.test(content) ||
      /^\d+\.\s+/m.test(content) ||
      /<[uo]l/i.test(textToCheck),
    hasTables: /<table/i.test(textToCheck) || /\|.+\|.+\|/m.test(content),
    hasFAQ:
      /faq/i.test(content) ||
      /<script type="application\/ld\+json"[^>]*>.*FAQPage/i.test(textToCheck) ||
      /##?\s*(faq|frequently asked questions)/i.test(content),
    headingHierarchy:
      /^#{1,6}\s/m.test(content) || /<h[1-6]/i.test(textToCheck),
  };
}

/**
 * Calculate overall score based on analysis
 */
function calculateScore(analysis: AISearchAnalysis): number {
  let score = 0;
  const weights = {
    directAnswer: 20,
    citations: 20,
    statistics: 20,
    structure: 20,
    quotes: 10,
    authoritativeSources: 10,
  };

  // Direct answer (20 points)
  if (analysis.directAnswer.present) {
    score += weights.directAnswer * 0.7;
    if (analysis.directAnswer.startsWithAnswer) {
      score += weights.directAnswer * 0.3;
    }
  }

  // Citations (20 points)
  const citationRatio = Math.min(
    analysis.citations.count / ContentOptimizationRules.citations.preferred,
    1
  );
  score += weights.citations * citationRatio;

  // Statistics (20 points)
  const statRatio = Math.min(
    analysis.statistics.count / ContentOptimizationRules.statistics.preferred,
    1
  );
  const withSourceRatio =
    analysis.statistics.count > 0
      ? analysis.statistics.withSources / analysis.statistics.count
      : 0;
  score += weights.statistics * (statRatio * 0.6 + withSourceRatio * 0.4);

  // Structure (20 points)
  const structurePoints = [
    analysis.structure.hasLists,
    analysis.structure.hasTables,
    analysis.structure.hasFAQ,
    analysis.structure.headingHierarchy,
  ].filter(Boolean).length;
  score += weights.structure * (structurePoints / 4);

  // Quotes (10 points)
  if (analysis.quotes.count > 0) {
    const quoteScore =
      analysis.quotes.count >= 2
        ? 1
        : analysis.quotes.count / 2;
    const attributionRatio =
      analysis.quotes.withAttribution / analysis.quotes.count;
    score += weights.quotes * (quoteScore * 0.5 + attributionRatio * 0.5);
  }

  // Authoritative sources (10 points)
  if (analysis.citations.authoritative >= 3) {
    score += weights.authoritativeSources;
  } else if (analysis.citations.authoritative > 0) {
    score += weights.authoritativeSources * (analysis.citations.authoritative / 3);
  }

  return Math.round(score);
}

/**
 * Generate specific recommendations based on analysis
 */
function generateRecommendations(analysis: AISearchAnalysis): string[] {
  const recommendations: string[] = [];

  // Direct answer recommendations
  if (!analysis.directAnswer.present) {
    recommendations.push(
      'Add a direct answer (40-60 words) in your first paragraph that immediately answers the main question'
    );
  } else if (!analysis.directAnswer.startsWithAnswer) {
    recommendations.push(
      'Remove preamble from first paragraph - start with a definitive statement'
    );
  }

  // Citation recommendations
  if (analysis.citations.count < ContentOptimizationRules.citations.minimum) {
    recommendations.push(
      `Add ${ContentOptimizationRules.citations.minimum - analysis.citations.count} more citations to authoritative sources`
    );
  }
  if (analysis.citations.authoritative < 2) {
    recommendations.push(
      'Include citations from .edu, .gov, or peer-reviewed sources for higher authority'
    );
  }

  // Statistics recommendations
  if (analysis.statistics.count < ContentOptimizationRules.statistics.minimum) {
    recommendations.push(
      `Add ${ContentOptimizationRules.statistics.minimum - analysis.statistics.count} more specific statistics with source attribution`
    );
  } else if (analysis.statistics.withSources < analysis.statistics.count * 0.8) {
    recommendations.push(
      'Add source attribution to your statistics (e.g., "according to [Source], [Year]")'
    );
  }

  // Structure recommendations
  if (!analysis.structure.hasLists) {
    recommendations.push(
      'Add bullet points or numbered lists for key information'
    );
  }
  if (!analysis.structure.hasTables) {
    recommendations.push(
      'Add an HTML table for comparisons or data presentation'
    );
  }
  if (!analysis.structure.hasFAQ) {
    recommendations.push(
      'Add an FAQ section with 5-7 common questions and concise answers'
    );
  }
  if (!analysis.structure.headingHierarchy) {
    recommendations.push(
      'Structure content with clear H2/H3 heading hierarchy'
    );
  }

  // Quote recommendations
  if (analysis.quotes.count < 2) {
    recommendations.push(
      'Add 2-3 expert quotes with full attribution (Name, Title, Organization)'
    );
  } else if (analysis.quotes.withAttribution < analysis.quotes.count) {
    recommendations.push(
      'Ensure all quotes include proper attribution (- Expert Name, Title, Organization)'
    );
  }

  return recommendations;
}

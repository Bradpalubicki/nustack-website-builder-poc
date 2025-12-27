/**
 * SEO Audit Recommendations
 *
 * Generate actionable recommendations based on audit results.
 */

import { AuditResults, AuditCheckResult } from './runner';
import { AuditCheckCategory } from './checks';
import { getGradeForScore, calculateImprovementPotential } from './scoring';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type RecommendationPriority = 'critical' | 'high' | 'medium' | 'low';

export interface Recommendation {
  /** Unique ID */
  id: string;
  /** Recommendation title */
  title: string;
  /** Detailed description */
  description: string;
  /** Priority level */
  priority: RecommendationPriority;
  /** Category */
  category: AuditCheckCategory;
  /** Related check IDs */
  relatedChecks: string[];
  /** Estimated impact (1-10) */
  impact: number;
  /** Estimated effort (1-10, lower is easier) */
  effort: number;
  /** Implementation steps */
  steps: string[];
  /** Resources/documentation links */
  resources?: { title: string; url: string }[];
  /** Code example if applicable */
  codeExample?: string;
}

export interface RecommendationGroup {
  /** Category name */
  category: AuditCheckCategory;
  /** Category display name */
  categoryName: string;
  /** Recommendations in this category */
  recommendations: Recommendation[];
  /** Category score */
  score: number;
}

export interface RecommendationReport {
  /** Summary of recommendations */
  summary: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  /** Quick wins (high impact, low effort) */
  quickWins: Recommendation[];
  /** All recommendations grouped by category */
  groups: RecommendationGroup[];
  /** Top priorities */
  topPriorities: Recommendation[];
  /** Improvement potential */
  potential: {
    currentScore: number;
    potentialScore: number;
    improvement: number;
  };
}

// ============================================================================
// RECOMMENDATION TEMPLATES
// ============================================================================

const RecommendationTemplates: Record<string, Partial<Recommendation>> = {
  // Technical SEO
  'meta-title': {
    title: 'Optimize Page Title',
    description: 'Add a descriptive, keyword-rich title between 50-60 characters.',
    steps: [
      'Identify the primary keyword for this page',
      'Create a compelling title that includes the keyword naturally',
      'Keep the title between 50-60 characters',
      'Make each page title unique',
    ],
    resources: [
      { title: 'Title Tag Best Practices', url: 'https://moz.com/learn/seo/title-tag' },
    ],
    codeExample: '<title>Your Primary Keyword - Brand Name</title>',
  },
  'meta-description': {
    title: 'Add Meta Description',
    description: 'Write a compelling meta description between 150-160 characters.',
    steps: [
      'Write a clear summary of the page content',
      'Include primary and secondary keywords naturally',
      'Add a call-to-action when appropriate',
      'Keep between 150-160 characters',
    ],
    codeExample: '<meta name="description" content="Your compelling description here...">',
  },
  'canonical-url': {
    title: 'Add Canonical URL',
    description: 'Specify the canonical URL to prevent duplicate content issues.',
    steps: [
      'Determine the preferred URL for this content',
      'Add the canonical link tag to the head section',
      'Ensure it points to the absolute URL',
    ],
    codeExample: '<link rel="canonical" href="https://example.com/page">',
  },
  'heading-h1': {
    title: 'Add/Fix H1 Heading',
    description: 'Each page should have exactly one H1 heading.',
    steps: [
      'Identify the main topic of the page',
      'Create a single H1 heading that summarizes the content',
      'Include the primary keyword naturally',
      'Move additional H1s to H2 or lower',
    ],
  },
  'image-alt': {
    title: 'Add Image Alt Text',
    description: 'All images should have descriptive alt text for accessibility and SEO.',
    steps: [
      'Review all images on the page',
      'Add descriptive alt text that explains the image',
      'Include keywords naturally where appropriate',
      'Use alt="" for purely decorative images',
    ],
    codeExample: '<img src="doctor.jpg" alt="Dr. Smith consulting with patient">',
  },

  // Content
  'content-length': {
    title: 'Expand Content',
    description: 'Add more comprehensive content to improve relevance signals.',
    steps: [
      'Research what topics competitors cover',
      'Identify gaps in your current content',
      'Add sections addressing user questions',
      'Aim for at least 500 words of valuable content',
    ],
  },
  'internal-links': {
    title: 'Add Internal Links',
    description: 'Link to other relevant pages on your site to improve navigation and SEO.',
    steps: [
      'Identify related content on your site',
      'Add contextual links within the content',
      'Use descriptive anchor text',
      'Aim for 3-5 internal links per page',
    ],
  },

  // Local SEO
  'nap-present': {
    title: 'Add NAP Information',
    description: 'Display Name, Address, and Phone number prominently.',
    steps: [
      'Add business name in a consistent format',
      'Display full street address',
      'Show phone number in clickable format',
      'Place in header, footer, or contact section',
    ],
    codeExample: `<address>
  Business Name<br>
  123 Main St, Suite 100<br>
  City, ST 12345<br>
  <a href="tel:+15551234567">(555) 123-4567</a>
</address>`,
  },
  'local-schema': {
    title: 'Add LocalBusiness Schema',
    description: 'Add structured data to help search engines understand your business.',
    steps: [
      'Create LocalBusiness JSON-LD markup',
      'Include name, address, phone, hours',
      'Add to the page head or body',
      'Validate using Google\'s Rich Results Test',
    ],
    resources: [
      { title: 'LocalBusiness Schema', url: 'https://schema.org/LocalBusiness' },
    ],
  },

  // Schema
  'schema-present': {
    title: 'Add Schema.org Markup',
    description: 'Implement structured data to enhance search appearance.',
    steps: [
      'Identify the type of content (Article, Product, etc.)',
      'Create JSON-LD structured data',
      'Include all required and recommended properties',
      'Test with Google Rich Results Test',
    ],
    resources: [
      { title: 'Schema.org', url: 'https://schema.org' },
      { title: 'Rich Results Test', url: 'https://search.google.com/test/rich-results' },
    ],
  },

  // E-E-A-T
  'author-info': {
    title: 'Add Author Information',
    description: 'Display author credentials to establish expertise and trust.',
    steps: [
      'Add author name and photo to content',
      'Include author credentials and qualifications',
      'Link to author bio page',
      'Add Person schema for the author',
    ],
  },
  'publish-date': {
    title: 'Display Publication Date',
    description: 'Show when content was published and last updated.',
    steps: [
      'Add visible publication date',
      'Show last updated date if content was revised',
      'Use datePublished and dateModified in schema',
    ],
  },
  'medical-review': {
    title: 'Add Medical Reviewer',
    description: 'Healthcare content should be reviewed by a qualified professional.',
    steps: [
      'Have content reviewed by a licensed healthcare professional',
      'Display reviewer name with credentials (MD, DO, NP, etc.)',
      'Show date of medical review',
      'Add reviewer information to schema',
    ],
  },

  // AI Search
  'structured-content': {
    title: 'Improve Content Structure',
    description: 'Use headers, lists, and structured formatting for AI comprehension.',
    steps: [
      'Break content into logical sections with H2/H3 headers',
      'Use bulleted or numbered lists for key points',
      'Add tables for comparative information',
      'Include FAQ sections for common questions',
    ],
  },
};

// ============================================================================
// RECOMMENDATION GENERATION
// ============================================================================

/**
 * Generate recommendations from a failed check
 */
function generateRecommendation(
  check: AuditCheckResult
): Recommendation | null {
  const template = RecommendationTemplates[check.checkId];

  // Determine priority based on severity and weight
  let priority: RecommendationPriority = 'medium';
  if (check.severity === 'critical' || check.weight >= 9) {
    priority = 'critical';
  } else if (check.severity === 'warning' || check.weight >= 7) {
    priority = 'high';
  } else if (check.weight <= 4) {
    priority = 'low';
  }

  // Estimate effort (inverse of weight - easier fixes for common issues)
  const effort = Math.max(1, Math.min(10, 11 - check.weight));

  const recommendation: Recommendation = {
    id: check.checkId,
    title: template?.title || `Fix: ${check.checkName}`,
    description: template?.description || check.fix || check.details || '',
    priority,
    category: check.category,
    relatedChecks: [check.checkId],
    impact: check.weight,
    effort,
    steps: template?.steps || (check.fix ? [check.fix] : ['Review and fix the issue']),
    resources: template?.resources,
    codeExample: template?.codeExample,
  };

  return recommendation;
}

/**
 * Generate all recommendations from audit results
 */
export function generateRecommendations(
  results: AuditResults,
  options: { limit?: number; minPriority?: RecommendationPriority } = {}
): RecommendationReport {
  const { limit, minPriority } = options;

  // Get failed checks (excluding skipped)
  const failedChecks = results.checks.filter(
    (c) => !c.passed && c.status !== 'skipped'
  );

  // Generate recommendations
  let recommendations = failedChecks
    .map(generateRecommendation)
    .filter((r): r is Recommendation => r !== null);

  // Filter by priority if specified
  if (minPriority) {
    const priorityOrder: RecommendationPriority[] = ['critical', 'high', 'medium', 'low'];
    const minIndex = priorityOrder.indexOf(minPriority);
    recommendations = recommendations.filter(
      (r) => priorityOrder.indexOf(r.priority) <= minIndex
    );
  }

  // Sort by priority and impact
  recommendations.sort((a, b) => {
    const priorityOrder: RecommendationPriority[] = ['critical', 'high', 'medium', 'low'];
    const priorityDiff = priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority);
    if (priorityDiff !== 0) return priorityDiff;
    return b.impact - a.impact;
  });

  // Apply limit if specified
  if (limit) {
    recommendations = recommendations.slice(0, limit);
  }

  // Group by category
  const categoryNames: Record<AuditCheckCategory, string> = {
    technical: 'Technical SEO',
    content: 'Content Quality',
    local: 'Local SEO',
    schema: 'Structured Data',
    eeat: 'E-E-A-T Signals',
    'ai-search': 'AI Search',
  };

  const groups: RecommendationGroup[] = Object.entries(results.categories)
    .map(([cat, catResult]) => {
      const category = cat as AuditCheckCategory;
      return {
        category,
        categoryName: categoryNames[category],
        recommendations: recommendations.filter((r) => r.category === category),
        score: catResult.score,
      };
    })
    .filter((g) => g.recommendations.length > 0)
    .sort((a, b) => a.score - b.score);

  // Identify quick wins (high impact, low effort)
  const quickWins = recommendations
    .filter((r) => r.impact >= 7 && r.effort <= 4)
    .slice(0, 5);

  // Summary
  const summary = {
    total: recommendations.length,
    critical: recommendations.filter((r) => r.priority === 'critical').length,
    high: recommendations.filter((r) => r.priority === 'high').length,
    medium: recommendations.filter((r) => r.priority === 'medium').length,
    low: recommendations.filter((r) => r.priority === 'low').length,
  };

  // Top priorities
  const topPriorities = recommendations.slice(0, 5);

  // Improvement potential
  const potential = calculateImprovementPotential(results);

  return {
    summary,
    quickWins,
    groups,
    topPriorities,
    potential: {
      currentScore: results.score,
      potentialScore: potential.maxScore,
      improvement: potential.improvement,
    },
  };
}

// ============================================================================
// RECOMMENDATION FORMATTING
// ============================================================================

/**
 * Format recommendations as markdown
 */
export function formatRecommendationsMarkdown(report: RecommendationReport): string {
  const lines: string[] = [
    '# SEO Audit Recommendations',
    '',
    `Current Score: **${report.potential.currentScore}** (${getGradeForScore(report.potential.currentScore).grade})`,
    `Potential Score: **${report.potential.potentialScore}** (+${report.potential.improvement} points)`,
    '',
  ];

  // Summary
  lines.push('## Summary');
  lines.push(`- Critical Issues: ${report.summary.critical}`);
  lines.push(`- High Priority: ${report.summary.high}`);
  lines.push(`- Medium Priority: ${report.summary.medium}`);
  lines.push(`- Low Priority: ${report.summary.low}`);
  lines.push('');

  // Quick wins
  if (report.quickWins.length > 0) {
    lines.push('## Quick Wins');
    lines.push('High impact improvements that are easy to implement:');
    lines.push('');
    report.quickWins.forEach((rec) => {
      lines.push(`### ${rec.title}`);
      lines.push(rec.description);
      lines.push('');
      lines.push('**Steps:**');
      rec.steps.forEach((step, i) => {
        lines.push(`${i + 1}. ${step}`);
      });
      if (rec.codeExample) {
        lines.push('');
        lines.push('```html');
        lines.push(rec.codeExample);
        lines.push('```');
      }
      lines.push('');
    });
  }

  // All recommendations by category
  lines.push('## All Recommendations');
  report.groups.forEach((group) => {
    lines.push(`### ${group.categoryName} (Score: ${group.score}%)`);
    lines.push('');
    group.recommendations.forEach((rec) => {
      const priorityEmoji =
        rec.priority === 'critical' ? '🔴' :
        rec.priority === 'high' ? '🟠' :
        rec.priority === 'medium' ? '🟡' : '🟢';
      lines.push(`#### ${priorityEmoji} ${rec.title}`);
      lines.push(rec.description);
      lines.push('');
    });
  });

  return lines.join('\n');
}

/**
 * Format recommendations as JSON for API response
 */
export function formatRecommendationsJSON(report: RecommendationReport): object {
  return {
    summary: report.summary,
    potential: report.potential,
    quickWins: report.quickWins.map((r) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      priority: r.priority,
      impact: r.impact,
      effort: r.effort,
    })),
    topPriorities: report.topPriorities.map((r) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      priority: r.priority,
      category: r.category,
      steps: r.steps,
    })),
    byCategory: report.groups.map((g) => ({
      category: g.category,
      name: g.categoryName,
      score: g.score,
      recommendationCount: g.recommendations.length,
    })),
  };
}

/**
 * Get priority recommendations for a specific category
 */
export function getCategoryRecommendations(
  results: AuditResults,
  category: AuditCheckCategory
): Recommendation[] {
  const report = generateRecommendations(results);
  const group = report.groups.find((g) => g.category === category);
  return group?.recommendations || [];
}

/**
 * Get single most important recommendation
 */
export function getTopRecommendation(results: AuditResults): Recommendation | null {
  const report = generateRecommendations(results, { limit: 1 });
  return report.topPriorities[0] || null;
}

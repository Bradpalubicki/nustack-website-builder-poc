/**
 * SEO Quick Actions Registry
 *
 * Comprehensive registry of SEO quick actions organized by category.
 * Includes actions for Technical SEO, Content, Local SEO, Schema,
 * E-E-A-T, AI Search, Compliance, and Audit.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type QuickActionCategory =
  | 'technical'
  | 'content'
  | 'local_seo'
  | 'schema'
  | 'eeat'
  | 'ai_search'
  | 'compliance'
  | 'audit';

export type VariableType = 'string' | 'number' | 'boolean' | 'select' | 'multiselect' | 'url';

export interface QuickActionVariable {
  /** Variable name (used in handler) */
  name: string;
  /** Variable type */
  type: VariableType;
  /** Display label */
  label: string;
  /** Placeholder text */
  placeholder?: string;
  /** Select/multiselect options */
  options?: Array<{ value: string; label: string }>;
  /** Is this field required */
  required?: boolean;
  /** Default value */
  defaultValue?: string | number | boolean;
  /** Help text */
  helpText?: string;
  /** Validation regex */
  validation?: string;
}

export interface QuickAction {
  /** Unique action ID */
  id: string;
  /** Display name */
  name: string;
  /** Description */
  description: string;
  /** Icon name (from lucide-react) */
  icon: string;
  /** Action category */
  category: QuickActionCategory;
  /** Input variables */
  variables?: QuickActionVariable[];
  /** API endpoint */
  endpoint?: string;
  /** Handler function name */
  handler?: string;
  /** Requires user confirmation */
  requiresConfirmation?: boolean;
  /** Estimated time to complete */
  estimatedTime?: string;
  /** Is this a premium feature */
  premium?: boolean;
  /** Tags for filtering */
  tags?: string[];
}

// ============================================================================
// CATEGORY CONFIGURATION
// ============================================================================

export const CategoryConfig: Record<QuickActionCategory, {
  label: string;
  icon: string;
  color: string;
  bgColor: string;
  description: string;
}> = {
  technical: {
    label: 'Technical SEO',
    icon: 'Code',
    color: 'text-blue-500',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    description: 'Core technical SEO optimizations',
  },
  content: {
    label: 'Content',
    icon: 'FileText',
    color: 'text-green-500',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    description: 'Content creation and optimization',
  },
  local_seo: {
    label: 'Local SEO',
    icon: 'MapPin',
    color: 'text-orange-500',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    description: 'Local search optimization',
  },
  schema: {
    label: 'Schema',
    icon: 'Braces',
    color: 'text-purple-500',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    description: 'Structured data markup',
  },
  eeat: {
    label: 'E-E-A-T',
    icon: 'Award',
    color: 'text-pink-500',
    bgColor: 'bg-pink-100 dark:bg-pink-900/30',
    description: 'Experience, Expertise, Authority, Trust',
  },
  ai_search: {
    label: 'AI Search',
    icon: 'Sparkles',
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-100 dark:bg-cyan-900/30',
    description: 'AI search engine optimization',
  },
  compliance: {
    label: 'Compliance',
    icon: 'Shield',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
    description: 'Regulatory compliance',
  },
  audit: {
    label: 'Audit',
    icon: 'Search',
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
    description: 'SEO audits and analysis',
  },
};

// ============================================================================
// QUICK ACTIONS REGISTRY
// ============================================================================

export const QuickActionsRegistry: QuickAction[] = [
  // ========================
  // TECHNICAL SEO
  // ========================
  {
    id: 'optimize-meta-tags',
    name: 'Optimize Meta Tags',
    description: 'Analyze and optimize title tags and meta descriptions',
    icon: 'FileType',
    category: 'technical',
    endpoint: '/api/seo/optimize-meta',
    estimatedTime: '30 seconds',
    tags: ['meta', 'title', 'description'],
  },
  {
    id: 'generate-sitemap',
    name: 'Generate Sitemap',
    description: 'Create or update XML sitemap',
    icon: 'Map',
    category: 'technical',
    endpoint: '/api/seo/sitemap',
    estimatedTime: '15 seconds',
    tags: ['sitemap', 'xml'],
  },
  {
    id: 'check-robots-txt',
    name: 'Check robots.txt',
    description: 'Analyze robots.txt for issues',
    icon: 'Bot',
    category: 'technical',
    endpoint: '/api/seo/robots-check',
    estimatedTime: '10 seconds',
    tags: ['robots', 'crawling'],
  },
  {
    id: 'fix-broken-links',
    name: 'Fix Broken Links',
    description: 'Find and fix broken internal/external links',
    icon: 'Link2Off',
    category: 'technical',
    endpoint: '/api/seo/broken-links',
    requiresConfirmation: true,
    estimatedTime: '1-2 minutes',
    tags: ['links', '404'],
  },
  {
    id: 'optimize-images',
    name: 'Optimize Images',
    description: 'Compress images and add missing alt text',
    icon: 'Image',
    category: 'technical',
    endpoint: '/api/seo/optimize-images',
    requiresConfirmation: true,
    estimatedTime: '2-5 minutes',
    tags: ['images', 'alt', 'performance'],
  },
  {
    id: 'add-canonical-urls',
    name: 'Add Canonical URLs',
    description: 'Add canonical URLs to prevent duplicate content',
    icon: 'Link',
    category: 'technical',
    endpoint: '/api/seo/canonicals',
    estimatedTime: '20 seconds',
    tags: ['canonical', 'duplicate'],
  },

  // ========================
  // CONTENT
  // ========================
  {
    id: 'generate-article',
    name: 'Generate Article',
    description: 'Create an E-E-A-T compliant article',
    icon: 'PenTool',
    category: 'content',
    variables: [
      {
        name: 'topic',
        type: 'string',
        label: 'Article Topic',
        placeholder: 'e.g., Benefits of Testosterone Therapy',
        required: true,
      },
      {
        name: 'type',
        type: 'select',
        label: 'Article Type',
        options: [
          { value: 'educational', label: 'Educational' },
          { value: 'condition', label: 'Condition Overview' },
          { value: 'treatment', label: 'Treatment Guide' },
          { value: 'comparison', label: 'Comparison' },
        ],
        required: true,
        defaultValue: 'educational',
      },
      {
        name: 'wordCount',
        type: 'select',
        label: 'Target Word Count',
        options: [
          { value: '800', label: '800 words' },
          { value: '1200', label: '1,200 words' },
          { value: '2000', label: '2,000 words' },
        ],
        defaultValue: '1200',
      },
    ],
    endpoint: '/api/content/generate-article',
    requiresConfirmation: true,
    estimatedTime: '3-5 minutes',
    tags: ['article', 'content', 'generation'],
  },
  {
    id: 'generate-faqs',
    name: 'Generate FAQs',
    description: 'Create FAQ section for a page',
    icon: 'HelpCircle',
    category: 'content',
    variables: [
      {
        name: 'topic',
        type: 'string',
        label: 'Topic',
        placeholder: 'e.g., ED Treatment',
        required: true,
      },
      {
        name: 'count',
        type: 'select',
        label: 'Number of FAQs',
        options: [
          { value: '5', label: '5 FAQs' },
          { value: '8', label: '8 FAQs' },
          { value: '10', label: '10 FAQs' },
        ],
        defaultValue: '5',
      },
    ],
    endpoint: '/api/content/generate-faqs',
    estimatedTime: '30 seconds',
    tags: ['faq', 'content'],
  },
  {
    id: 'improve-content',
    name: 'Improve Content',
    description: 'Enhance existing content for SEO',
    icon: 'Sparkles',
    category: 'content',
    variables: [
      {
        name: 'pageUrl',
        type: 'url',
        label: 'Page URL',
        placeholder: '/treatments/testosterone-therapy',
        required: true,
      },
      {
        name: 'focus',
        type: 'select',
        label: 'Focus Area',
        options: [
          { value: 'readability', label: 'Readability' },
          { value: 'keywords', label: 'Keyword Optimization' },
          { value: 'structure', label: 'Structure & Headers' },
          { value: 'comprehensive', label: 'Comprehensive' },
        ],
        defaultValue: 'comprehensive',
      },
    ],
    endpoint: '/api/content/improve',
    requiresConfirmation: true,
    estimatedTime: '1-2 minutes',
    tags: ['content', 'optimization'],
  },

  // ========================
  // LOCAL SEO
  // ========================
  {
    id: 'generate-local-pages',
    name: 'Generate Local Pages',
    description: 'Create location×service landing pages',
    icon: 'MapPin',
    category: 'local_seo',
    variables: [
      {
        name: 'locations',
        type: 'multiselect',
        label: 'Locations',
        helpText: 'Select locations to generate pages for',
      },
      {
        name: 'services',
        type: 'multiselect',
        label: 'Services',
        helpText: 'Select services to include',
      },
    ],
    endpoint: '/api/local/generate-pages',
    requiresConfirmation: true,
    estimatedTime: '2-5 minutes',
    tags: ['local', 'pages', 'generation'],
  },
  {
    id: 'audit-nap',
    name: 'Audit NAP Consistency',
    description: 'Check Name, Address, Phone consistency across pages',
    icon: 'ClipboardCheck',
    category: 'local_seo',
    endpoint: '/api/local/nap-audit',
    estimatedTime: '30 seconds',
    tags: ['nap', 'consistency', 'local'],
  },
  {
    id: 'generate-service-area-pages',
    name: 'Generate Service Area Pages',
    description: 'Create pages for each service area',
    icon: 'Globe',
    category: 'local_seo',
    variables: [
      {
        name: 'areas',
        type: 'string',
        label: 'Service Areas',
        placeholder: 'Austin, Round Rock, Cedar Park',
        helpText: 'Comma-separated list of cities/areas',
        required: true,
      },
    ],
    endpoint: '/api/local/service-area-pages',
    requiresConfirmation: true,
    estimatedTime: '2-3 minutes',
    tags: ['service-area', 'local'],
  },
  {
    id: 'optimize-gbp',
    name: 'Optimize Google Business',
    description: 'Get GBP optimization recommendations',
    icon: 'Store',
    category: 'local_seo',
    endpoint: '/api/local/gbp-optimize',
    estimatedTime: '20 seconds',
    tags: ['gbp', 'google', 'local'],
  },
  {
    id: 'submit-aggregators',
    name: 'Submit to Aggregators',
    description: 'Generate submission checklist for data aggregators',
    icon: 'Share2',
    category: 'local_seo',
    endpoint: '/api/local/aggregator-checklist',
    estimatedTime: '15 seconds',
    tags: ['aggregators', 'citations', 'local'],
  },

  // ========================
  // SCHEMA
  // ========================
  {
    id: 'add-local-business-schema',
    name: 'Add LocalBusiness Schema',
    description: 'Add LocalBusiness structured data',
    icon: 'Building',
    category: 'schema',
    endpoint: '/api/schema/local-business',
    estimatedTime: '15 seconds',
    tags: ['schema', 'local-business'],
  },
  {
    id: 'add-faq-schema',
    name: 'Add FAQ Schema',
    description: 'Add FAQPage structured data',
    icon: 'HelpCircle',
    category: 'schema',
    variables: [
      {
        name: 'pageUrl',
        type: 'url',
        label: 'Page URL',
        placeholder: '/treatments/ed',
        required: true,
      },
    ],
    endpoint: '/api/schema/faq',
    estimatedTime: '10 seconds',
    tags: ['schema', 'faq'],
  },
  {
    id: 'add-article-schema',
    name: 'Add Article Schema',
    description: 'Add Article/BlogPosting structured data',
    icon: 'FileText',
    category: 'schema',
    variables: [
      {
        name: 'pageUrl',
        type: 'url',
        label: 'Article URL',
        placeholder: '/health-library/article-name',
        required: true,
      },
    ],
    endpoint: '/api/schema/article',
    estimatedTime: '10 seconds',
    tags: ['schema', 'article'],
  },
  {
    id: 'add-service-schema',
    name: 'Add Service Schema',
    description: 'Add MedicalProcedure/Service structured data',
    icon: 'Stethoscope',
    category: 'schema',
    variables: [
      {
        name: 'serviceSlug',
        type: 'string',
        label: 'Service Slug',
        placeholder: 'testosterone-therapy',
        required: true,
      },
    ],
    endpoint: '/api/schema/service',
    estimatedTime: '10 seconds',
    tags: ['schema', 'service', 'medical'],
  },
  {
    id: 'add-breadcrumb-schema',
    name: 'Add Breadcrumb Schema',
    description: 'Add BreadcrumbList structured data',
    icon: 'ChevronRight',
    category: 'schema',
    endpoint: '/api/schema/breadcrumb',
    estimatedTime: '10 seconds',
    tags: ['schema', 'breadcrumb'],
  },
  {
    id: 'validate-schema',
    name: 'Validate Schema',
    description: 'Validate all structured data on site',
    icon: 'CheckCircle',
    category: 'schema',
    endpoint: '/api/schema/validate',
    estimatedTime: '30 seconds',
    tags: ['schema', 'validation'],
  },

  // ========================
  // E-E-A-T
  // ========================
  {
    id: 'add-author-bio',
    name: 'Add Author Bio',
    description: 'Add author attribution to content',
    icon: 'User',
    category: 'eeat',
    variables: [
      {
        name: 'authorId',
        type: 'select',
        label: 'Author',
        helpText: 'Select author to attribute',
        required: true,
      },
      {
        name: 'pageUrl',
        type: 'url',
        label: 'Page URL',
        required: true,
      },
    ],
    endpoint: '/api/eeat/author-bio',
    estimatedTime: '10 seconds',
    tags: ['author', 'eeat'],
  },
  {
    id: 'add-medical-reviewer',
    name: 'Add Medical Reviewer',
    description: 'Add medical reviewer badge to health content',
    icon: 'UserCheck',
    category: 'eeat',
    variables: [
      {
        name: 'reviewerId',
        type: 'select',
        label: 'Reviewer',
        helpText: 'Select medical reviewer',
        required: true,
      },
      {
        name: 'pageUrls',
        type: 'multiselect',
        label: 'Pages',
        helpText: 'Select pages to add reviewer to',
      },
    ],
    endpoint: '/api/eeat/medical-reviewer',
    estimatedTime: '15 seconds',
    tags: ['reviewer', 'medical', 'eeat'],
  },
  {
    id: 'add-freshness-dates',
    name: 'Add Freshness Dates',
    description: 'Add publish/update dates to content',
    icon: 'Calendar',
    category: 'eeat',
    endpoint: '/api/eeat/freshness-dates',
    estimatedTime: '20 seconds',
    tags: ['freshness', 'dates', 'eeat'],
  },
  {
    id: 'add-trust-signals',
    name: 'Add Trust Signals',
    description: 'Add certifications, awards, and trust badges',
    icon: 'Shield',
    category: 'eeat',
    variables: [
      {
        name: 'signalTypes',
        type: 'multiselect',
        label: 'Signal Types',
        options: [
          { value: 'certification', label: 'Certifications' },
          { value: 'award', label: 'Awards' },
          { value: 'membership', label: 'Memberships' },
          { value: 'security', label: 'Security Badges' },
        ],
      },
    ],
    endpoint: '/api/eeat/trust-signals',
    estimatedTime: '15 seconds',
    tags: ['trust', 'signals', 'eeat'],
  },
  {
    id: 'add-citations',
    name: 'Add Source Citations',
    description: 'Add citations to authoritative sources',
    icon: 'Quote',
    category: 'eeat',
    variables: [
      {
        name: 'pageUrl',
        type: 'url',
        label: 'Page URL',
        required: true,
      },
    ],
    endpoint: '/api/eeat/citations',
    requiresConfirmation: true,
    estimatedTime: '1-2 minutes',
    tags: ['citations', 'sources', 'eeat'],
  },

  // ========================
  // AI SEARCH
  // ========================
  {
    id: 'optimize-for-ai',
    name: 'Optimize for AI Search',
    description: 'Analyze content for AI search engines',
    icon: 'Bot',
    category: 'ai_search',
    variables: [
      {
        name: 'pageUrl',
        type: 'url',
        label: 'Page URL',
        required: true,
      },
    ],
    endpoint: '/api/ai-search/analyze',
    estimatedTime: '30 seconds',
    tags: ['ai', 'geo', 'optimization'],
  },
  {
    id: 'submit-indexnow',
    name: 'Submit to IndexNow',
    description: 'Notify Bing/Yandex of content changes',
    icon: 'Send',
    category: 'ai_search',
    variables: [
      {
        name: 'urls',
        type: 'string',
        label: 'URLs to Submit',
        placeholder: 'One URL per line',
        helpText: 'Enter URLs to submit (max 10,000)',
      },
    ],
    endpoint: '/api/ai-search/indexnow',
    estimatedTime: '5 seconds',
    tags: ['indexnow', 'bing', 'yandex'],
  },
  {
    id: 'add-speakable',
    name: 'Add Speakable Markup',
    description: 'Add speakable schema for voice assistants',
    icon: 'Mic',
    category: 'ai_search',
    variables: [
      {
        name: 'pageUrl',
        type: 'url',
        label: 'Page URL',
        required: true,
      },
    ],
    endpoint: '/api/ai-search/speakable',
    estimatedTime: '15 seconds',
    tags: ['speakable', 'voice', 'ai'],
  },
  {
    id: 'generate-ai-article',
    name: 'Generate AI-Optimized Article',
    description: 'Create article optimized for AI engines',
    icon: 'Sparkles',
    category: 'ai_search',
    variables: [
      {
        name: 'topic',
        type: 'string',
        label: 'Topic',
        required: true,
      },
      {
        name: 'targetPlatforms',
        type: 'multiselect',
        label: 'Target Platforms',
        options: [
          { value: 'chatgpt', label: 'ChatGPT' },
          { value: 'perplexity', label: 'Perplexity' },
          { value: 'gemini', label: 'Google Gemini' },
          { value: 'claude', label: 'Claude' },
        ],
      },
    ],
    endpoint: '/api/ai-search/generate-article',
    requiresConfirmation: true,
    estimatedTime: '3-5 minutes',
    tags: ['ai', 'article', 'generation'],
  },

  // ========================
  // COMPLIANCE
  // ========================
  {
    id: 'run-accessibility-audit',
    name: 'Run Accessibility Audit',
    description: 'Check WCAG 2.2 AA compliance',
    icon: 'Eye',
    category: 'compliance',
    endpoint: '/api/compliance/accessibility',
    estimatedTime: '30 seconds',
    tags: ['accessibility', 'wcag', 'a11y'],
  },
  {
    id: 'add-cookie-consent',
    name: 'Add Cookie Consent',
    description: 'Implement GDPR/CCPA cookie consent',
    icon: 'Cookie',
    category: 'compliance',
    endpoint: '/api/compliance/cookie-consent',
    requiresConfirmation: true,
    estimatedTime: '1 minute',
    tags: ['cookies', 'gdpr', 'ccpa'],
  },
  {
    id: 'check-hipaa',
    name: 'Check HIPAA Compliance',
    description: 'Verify healthcare privacy compliance',
    icon: 'ShieldCheck',
    category: 'compliance',
    endpoint: '/api/compliance/hipaa',
    estimatedTime: '30 seconds',
    tags: ['hipaa', 'healthcare', 'privacy'],
  },
  {
    id: 'add-disclaimers',
    name: 'Add Required Disclaimers',
    description: 'Add industry-specific disclaimers',
    icon: 'AlertCircle',
    category: 'compliance',
    variables: [
      {
        name: 'industry',
        type: 'select',
        label: 'Industry',
        options: [
          { value: 'healthcare', label: 'Healthcare (Medical)' },
          { value: 'legal', label: 'Legal' },
          { value: 'financial', label: 'Financial' },
          { value: 'general', label: 'General' },
        ],
        required: true,
      },
    ],
    endpoint: '/api/compliance/disclaimers',
    estimatedTime: '15 seconds',
    tags: ['disclaimers', 'compliance'],
  },

  // ========================
  // AUDIT
  // ========================
  {
    id: 'run-full-audit',
    name: 'Run Full SEO Audit',
    description: 'Comprehensive SEO analysis',
    icon: 'Search',
    category: 'audit',
    endpoint: '/api/seo-audit',
    estimatedTime: '1-2 minutes',
    tags: ['audit', 'full', 'analysis'],
  },
  {
    id: 'run-technical-audit',
    name: 'Run Technical Audit',
    description: 'Technical SEO checks only',
    icon: 'Code',
    category: 'audit',
    endpoint: '/api/seo-audit?category=technical',
    estimatedTime: '30 seconds',
    tags: ['audit', 'technical'],
  },
  {
    id: 'run-content-audit',
    name: 'Run Content Audit',
    description: 'Content quality analysis',
    icon: 'FileText',
    category: 'audit',
    endpoint: '/api/seo-audit?category=content',
    estimatedTime: '30 seconds',
    tags: ['audit', 'content'],
  },
  {
    id: 'run-local-audit',
    name: 'Run Local SEO Audit',
    description: 'Local SEO checks only',
    icon: 'MapPin',
    category: 'audit',
    endpoint: '/api/seo-audit?category=local',
    estimatedTime: '30 seconds',
    tags: ['audit', 'local'],
  },
  {
    id: 'run-eeat-audit',
    name: 'Run E-E-A-T Audit',
    description: 'E-E-A-T signal analysis',
    icon: 'Award',
    category: 'audit',
    endpoint: '/api/seo-audit?category=eeat',
    estimatedTime: '30 seconds',
    tags: ['audit', 'eeat'],
  },
  {
    id: 'competitor-analysis',
    name: 'Competitor Analysis',
    description: 'Analyze competitor SEO',
    icon: 'Users',
    category: 'audit',
    variables: [
      {
        name: 'competitorUrl',
        type: 'url',
        label: 'Competitor URL',
        placeholder: 'https://competitor.com',
        required: true,
      },
    ],
    endpoint: '/api/seo-audit/competitor',
    estimatedTime: '1-2 minutes',
    premium: true,
    tags: ['audit', 'competitor'],
  },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get all quick actions
 */
export function getAllQuickActions(): QuickAction[] {
  return QuickActionsRegistry;
}

/**
 * Get quick actions by category
 */
export function getQuickActionsByCategory(category: QuickActionCategory): QuickAction[] {
  return QuickActionsRegistry.filter((action) => action.category === category);
}

/**
 * Get quick action by ID
 */
export function getQuickActionById(id: string): QuickAction | undefined {
  return QuickActionsRegistry.find((action) => action.id === id);
}

/**
 * Search quick actions
 */
export function searchQuickActions(query: string): QuickAction[] {
  const lowerQuery = query.toLowerCase();
  return QuickActionsRegistry.filter(
    (action) =>
      action.name.toLowerCase().includes(lowerQuery) ||
      action.description.toLowerCase().includes(lowerQuery) ||
      action.tags?.some((tag) => tag.includes(lowerQuery))
  );
}

/**
 * Get all categories
 */
export function getCategories(): QuickActionCategory[] {
  return Object.keys(CategoryConfig) as QuickActionCategory[];
}

/**
 * Get featured quick actions (most commonly used)
 */
export function getFeaturedQuickActions(): QuickAction[] {
  const featuredIds = [
    'run-full-audit',
    'generate-local-pages',
    'add-schema-markup',
    'add-medical-reviewer',
    'generate-article',
    'optimize-for-ai',
  ];
  return featuredIds
    .map((id) => getQuickActionById(id))
    .filter((action): action is QuickAction => action !== undefined);
}

/**
 * Get quick wins (fast, high-impact actions)
 */
export function getQuickWins(): QuickAction[] {
  const quickWinIds = [
    'add-local-business-schema',
    'add-faq-schema',
    'add-freshness-dates',
    'submit-indexnow',
    'validate-schema',
  ];
  return quickWinIds
    .map((id) => getQuickActionById(id))
    .filter((action): action is QuickAction => action !== undefined);
}

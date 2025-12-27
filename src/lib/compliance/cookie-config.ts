/**
 * Cookie Configuration
 *
 * Configuration for cookie categories and consent-based script loading.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface CookieCategoryConfig {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Whether this category is required */
  required: boolean;
  /** Description */
  description: string;
  /** Example services */
  examples: string[];
}

// ============================================================================
// COOKIE CATEGORIES
// ============================================================================

/**
 * Standard cookie categories for GDPR compliance
 */
export const CookieCategories: CookieCategoryConfig[] = [
  {
    id: 'necessary',
    name: 'Strictly Necessary',
    required: true,
    description:
      'Essential for the website to function properly. These cannot be disabled.',
    examples: ['Session cookies', 'Authentication', 'Security', 'Load balancing'],
  },
  {
    id: 'analytics',
    name: 'Performance & Analytics',
    required: false,
    description:
      'Help us understand how visitors interact with our website by collecting anonymous information.',
    examples: ['Google Analytics', 'Hotjar', 'Microsoft Clarity'],
  },
  {
    id: 'functionality',
    name: 'Functionality',
    required: false,
    description: 'Remember your preferences and provide enhanced features.',
    examples: ['Language preferences', 'Region settings', 'Chat widgets'],
  },
  {
    id: 'marketing',
    name: 'Targeting & Advertising',
    required: false,
    description:
      'Used to deliver relevant advertisements and track their effectiveness.',
    examples: ['Google Ads', 'Facebook Pixel', 'LinkedIn Insight'],
  },
];

// ============================================================================
// SCRIPT CONFIGURATION
// ============================================================================

/**
 * Script loading configuration by consent category
 */
export const ScriptsByCategory: Record<string, string[]> = {
  necessary: [],
  analytics: [
    'google-analytics',
    'google-tag-manager',
    'hotjar',
    'microsoft-clarity',
    'plausible',
    'fathom',
    'simple-analytics',
  ],
  functionality: [
    'intercom',
    'zendesk',
    'drift',
    'crisp',
    'hubspot-chat',
    'tawk-to',
  ],
  marketing: [
    'google-ads',
    'facebook-pixel',
    'linkedin-insight',
    'twitter-pixel',
    'pinterest-tag',
    'tiktok-pixel',
    'snapchat-pixel',
  ],
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if a third-party script should be loaded based on consent
 */
export function shouldLoadScript(
  category: string,
  consents: Record<string, boolean> | null
): boolean {
  // If no consent data, don't load non-essential scripts
  if (!consents) return category === 'necessary';

  return consents[category] === true;
}

/**
 * Get the consent category for a script
 */
export function getScriptCategory(scriptId: string): string | null {
  for (const [category, scripts] of Object.entries(ScriptsByCategory)) {
    if (scripts.includes(scriptId)) {
      return category;
    }
  }
  return null;
}

/**
 * Check if a specific script should be loaded
 */
export function shouldLoadSpecificScript(
  scriptId: string,
  consents: Record<string, boolean> | null
): boolean {
  const category = getScriptCategory(scriptId);
  if (!category) return false;

  return shouldLoadScript(category, consents);
}

/**
 * Get all scripts that should be loaded based on consents
 */
export function getAllowedScripts(
  consents: Record<string, boolean> | null
): string[] {
  if (!consents) return ScriptsByCategory.necessary;

  const allowedScripts: string[] = [...ScriptsByCategory.necessary];

  for (const [category, scripts] of Object.entries(ScriptsByCategory)) {
    if (category !== 'necessary' && consents[category]) {
      allowedScripts.push(...scripts);
    }
  }

  return allowedScripts;
}

/**
 * Get cookie category by ID
 */
export function getCookieCategory(id: string): CookieCategoryConfig | undefined {
  return CookieCategories.find((cat) => cat.id === id);
}

/**
 * Get all required cookie categories
 */
export function getRequiredCategories(): CookieCategoryConfig[] {
  return CookieCategories.filter((cat) => cat.required);
}

/**
 * Get all optional cookie categories
 */
export function getOptionalCategories(): CookieCategoryConfig[] {
  return CookieCategories.filter((cat) => !cat.required);
}

// ============================================================================
// SCRIPT LOADER HELPERS
// ============================================================================

/**
 * Script configuration for common third-party scripts
 */
export const ScriptConfigs: Record<
  string,
  {
    name: string;
    category: string;
    loadType: 'async' | 'defer' | 'sync';
    url?: string;
  }
> = {
  'google-analytics': {
    name: 'Google Analytics',
    category: 'analytics',
    loadType: 'async',
    url: 'https://www.googletagmanager.com/gtag/js',
  },
  'google-tag-manager': {
    name: 'Google Tag Manager',
    category: 'analytics',
    loadType: 'async',
    url: 'https://www.googletagmanager.com/gtm.js',
  },
  hotjar: {
    name: 'Hotjar',
    category: 'analytics',
    loadType: 'async',
    url: 'https://static.hotjar.com/c/hotjar.js',
  },
  'microsoft-clarity': {
    name: 'Microsoft Clarity',
    category: 'analytics',
    loadType: 'async',
    url: 'https://www.clarity.ms/tag/',
  },
  'facebook-pixel': {
    name: 'Facebook Pixel',
    category: 'marketing',
    loadType: 'async',
    url: 'https://connect.facebook.net/en_US/fbevents.js',
  },
  'linkedin-insight': {
    name: 'LinkedIn Insight Tag',
    category: 'marketing',
    loadType: 'async',
    url: 'https://snap.licdn.com/li.lms-analytics/insight.min.js',
  },
  intercom: {
    name: 'Intercom',
    category: 'functionality',
    loadType: 'async',
    url: 'https://widget.intercom.io/widget/',
  },
  crisp: {
    name: 'Crisp Chat',
    category: 'functionality',
    loadType: 'async',
    url: 'https://client.crisp.chat/l.js',
  },
};

/**
 * Get script configuration
 */
export function getScriptConfig(scriptId: string) {
  return ScriptConfigs[scriptId];
}

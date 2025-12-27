/**
 * Data Aggregators Configuration
 *
 * Configuration for major data aggregators that distribute business
 * information to local directories, search engines, and navigation apps.
 *
 * @see https://moz.com/learn/seo/data-aggregators
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Data aggregator tier based on impact
 */
export type AggregatorTier = 'primary' | 'secondary' | 'tertiary';

/**
 * Data aggregator category
 */
export type AggregatorCategory =
  | 'general'
  | 'local_directory'
  | 'navigation'
  | 'social'
  | 'industry_specific'
  | 'review_platform';

/**
 * Data aggregator definition
 */
export interface DataAggregator {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Description */
  description: string;
  /** Website URL */
  url: string;
  /** Aggregator tier */
  tier: AggregatorTier;
  /** Aggregator category */
  category: AggregatorCategory;
  /** Industries this aggregator is important for */
  industries?: string[];
  /** Estimated monthly reach */
  reach?: string;
  /** Submission URL */
  submissionUrl?: string;
  /** Free or paid */
  pricing: 'free' | 'paid' | 'freemium';
  /** NAP fields supported */
  napFields: {
    name: boolean;
    address: boolean;
    phone: boolean;
    website: boolean;
    hours: boolean;
    categories: boolean;
    description: boolean;
    photos: boolean;
    attributes: boolean;
  };
  /** Update frequency */
  updateFrequency?: string;
  /** Notes */
  notes?: string;
}

/**
 * Aggregator submission status
 */
export interface AggregatorSubmission {
  aggregatorId: string;
  status: 'pending' | 'submitted' | 'verified' | 'needs_update' | 'error';
  submittedAt?: string;
  verifiedAt?: string;
  lastChecked?: string;
  listingUrl?: string;
  notes?: string;
}

// ============================================================================
// PRIMARY DATA AGGREGATORS
// ============================================================================

/**
 * Primary data aggregators (highest impact, distribute to most sources)
 */
export const PRIMARY_AGGREGATORS: DataAggregator[] = [
  {
    id: 'data_axle',
    name: 'Data Axle (formerly Infogroup)',
    description:
      'One of the largest data providers, feeding information to 70+ directories and search engines',
    url: 'https://www.data-axle.com/',
    tier: 'primary',
    category: 'general',
    reach: '70+ directories',
    submissionUrl: 'https://www.data-axle.com/business-solutions/',
    pricing: 'paid',
    napFields: {
      name: true,
      address: true,
      phone: true,
      website: true,
      hours: true,
      categories: true,
      description: true,
      photos: true,
      attributes: true,
    },
    updateFrequency: 'Monthly',
    notes: 'Feeds Bing, Apple Maps, Yelp, and many local directories',
  },
  {
    id: 'neustar_localeze',
    name: 'Neustar Localeze',
    description: 'Major data aggregator feeding information to search engines and directories',
    url: 'https://www.neustarlocaleze.biz/',
    tier: 'primary',
    category: 'general',
    reach: '100+ directories',
    submissionUrl: 'https://www.neustarlocaleze.biz/directory',
    pricing: 'paid',
    napFields: {
      name: true,
      address: true,
      phone: true,
      website: true,
      hours: true,
      categories: true,
      description: true,
      photos: false,
      attributes: true,
    },
    updateFrequency: 'Weekly',
    notes: 'Critical for GPS and navigation systems',
  },
  {
    id: 'foursquare',
    name: 'Foursquare',
    description: 'Location data platform powering Apple Maps, Uber, Twitter, and others',
    url: 'https://location.foursquare.com/',
    tier: 'primary',
    category: 'navigation',
    reach: '150+ apps and services',
    submissionUrl: 'https://foursquare.com/add-place',
    pricing: 'free',
    napFields: {
      name: true,
      address: true,
      phone: true,
      website: true,
      hours: true,
      categories: true,
      description: true,
      photos: true,
      attributes: true,
    },
    updateFrequency: 'Real-time',
    notes: 'Critical for Apple Maps and Uber location data',
  },
];

// ============================================================================
// SECONDARY DATA AGGREGATORS
// ============================================================================

/**
 * Secondary data aggregators (important for specific use cases)
 */
export const SECONDARY_AGGREGATORS: DataAggregator[] = [
  {
    id: 'google_business',
    name: 'Google Business Profile',
    description: 'Google\'s official business listing platform',
    url: 'https://www.google.com/business/',
    tier: 'secondary',
    category: 'general',
    reach: 'Google Search & Maps',
    submissionUrl: 'https://business.google.com/',
    pricing: 'free',
    napFields: {
      name: true,
      address: true,
      phone: true,
      website: true,
      hours: true,
      categories: true,
      description: true,
      photos: true,
      attributes: true,
    },
    updateFrequency: 'Real-time',
    notes: 'Most important single listing for local SEO',
  },
  {
    id: 'bing_places',
    name: 'Bing Places for Business',
    description: 'Microsoft\'s business listing platform',
    url: 'https://www.bingplaces.com/',
    tier: 'secondary',
    category: 'general',
    reach: 'Bing, Cortana, Edge',
    submissionUrl: 'https://www.bingplaces.com/',
    pricing: 'free',
    napFields: {
      name: true,
      address: true,
      phone: true,
      website: true,
      hours: true,
      categories: true,
      description: true,
      photos: true,
      attributes: true,
    },
    updateFrequency: 'Real-time',
    notes: 'Can import from Google Business Profile',
  },
  {
    id: 'apple_maps',
    name: 'Apple Maps Connect',
    description: 'Apple\'s business listing platform',
    url: 'https://mapsconnect.apple.com/',
    tier: 'secondary',
    category: 'navigation',
    reach: 'Apple devices',
    submissionUrl: 'https://mapsconnect.apple.com/',
    pricing: 'free',
    napFields: {
      name: true,
      address: true,
      phone: true,
      website: true,
      hours: true,
      categories: true,
      description: false,
      photos: true,
      attributes: true,
    },
    updateFrequency: 'Real-time',
    notes: 'Critical for iPhone/iPad users',
  },
  {
    id: 'yelp',
    name: 'Yelp for Business',
    description: 'Major review and discovery platform',
    url: 'https://business.yelp.com/',
    tier: 'secondary',
    category: 'review_platform',
    reach: '178M monthly visitors',
    submissionUrl: 'https://biz.yelp.com/',
    pricing: 'freemium',
    napFields: {
      name: true,
      address: true,
      phone: true,
      website: true,
      hours: true,
      categories: true,
      description: true,
      photos: true,
      attributes: true,
    },
    updateFrequency: 'Real-time',
    notes: 'Important for restaurants, retail, services',
  },
  {
    id: 'facebook',
    name: 'Facebook Business Page',
    description: 'Meta\'s business platform',
    url: 'https://www.facebook.com/business/',
    tier: 'secondary',
    category: 'social',
    reach: '2.9B monthly users',
    submissionUrl: 'https://www.facebook.com/pages/create/',
    pricing: 'free',
    napFields: {
      name: true,
      address: true,
      phone: true,
      website: true,
      hours: true,
      categories: true,
      description: true,
      photos: true,
      attributes: true,
    },
    updateFrequency: 'Real-time',
    notes: 'Important for social discovery and check-ins',
  },
];

// ============================================================================
// INDUSTRY-SPECIFIC AGGREGATORS
// ============================================================================

/**
 * Industry-specific aggregators
 */
export const INDUSTRY_AGGREGATORS: DataAggregator[] = [
  // Healthcare
  {
    id: 'healthgrades',
    name: 'Healthgrades',
    description: 'Healthcare provider directory and review platform',
    url: 'https://www.healthgrades.com/',
    tier: 'tertiary',
    category: 'industry_specific',
    industries: ['healthcare', 'medical', 'dental'],
    reach: '50M monthly visitors',
    submissionUrl: 'https://update.healthgrades.com/',
    pricing: 'freemium',
    napFields: {
      name: true,
      address: true,
      phone: true,
      website: true,
      hours: true,
      categories: true,
      description: true,
      photos: true,
      attributes: true,
    },
    notes: 'Critical for healthcare providers',
  },
  {
    id: 'zocdoc',
    name: 'Zocdoc',
    description: 'Healthcare appointment booking platform',
    url: 'https://www.zocdoc.com/',
    tier: 'tertiary',
    category: 'industry_specific',
    industries: ['healthcare', 'medical', 'dental'],
    reach: '6M monthly visitors',
    submissionUrl: 'https://www.zocdoc.com/join',
    pricing: 'paid',
    napFields: {
      name: true,
      address: true,
      phone: true,
      website: true,
      hours: true,
      categories: true,
      description: true,
      photos: true,
      attributes: true,
    },
    notes: 'Important for patient acquisition',
  },
  {
    id: 'vitals',
    name: 'Vitals',
    description: 'Doctor review and healthcare directory',
    url: 'https://www.vitals.com/',
    tier: 'tertiary',
    category: 'industry_specific',
    industries: ['healthcare', 'medical'],
    reach: '3M monthly visitors',
    submissionUrl: 'https://www.vitals.com/doctors/me',
    pricing: 'free',
    napFields: {
      name: true,
      address: true,
      phone: true,
      website: true,
      hours: true,
      categories: true,
      description: true,
      photos: true,
      attributes: false,
    },
    notes: 'Free to claim and update listing',
  },
  // Legal
  {
    id: 'avvo',
    name: 'Avvo',
    description: 'Legal directory and lawyer reviews',
    url: 'https://www.avvo.com/',
    tier: 'tertiary',
    category: 'industry_specific',
    industries: ['legal', 'attorney', 'lawyer'],
    reach: '8M monthly visitors',
    submissionUrl: 'https://www.avvo.com/for-lawyers',
    pricing: 'freemium',
    napFields: {
      name: true,
      address: true,
      phone: true,
      website: true,
      hours: false,
      categories: true,
      description: true,
      photos: true,
      attributes: true,
    },
    notes: 'Critical for lawyers, includes Avvo rating',
  },
  {
    id: 'findlaw',
    name: 'FindLaw',
    description: 'Legal information and attorney directory',
    url: 'https://www.findlaw.com/',
    tier: 'tertiary',
    category: 'industry_specific',
    industries: ['legal', 'attorney', 'lawyer'],
    reach: '10M monthly visitors',
    submissionUrl: 'https://www.findlaw.com/lawyers/',
    pricing: 'paid',
    napFields: {
      name: true,
      address: true,
      phone: true,
      website: true,
      hours: true,
      categories: true,
      description: true,
      photos: true,
      attributes: true,
    },
    notes: 'Premium legal directory with high authority',
  },
  // Home Services
  {
    id: 'home_advisor',
    name: 'HomeAdvisor',
    description: 'Home services marketplace',
    url: 'https://www.homeadvisor.com/',
    tier: 'tertiary',
    category: 'industry_specific',
    industries: ['home_services', 'contractor', 'plumber', 'electrician', 'hvac'],
    reach: '30M monthly visitors',
    submissionUrl: 'https://pro.homeadvisor.com/',
    pricing: 'paid',
    napFields: {
      name: true,
      address: true,
      phone: true,
      website: true,
      hours: true,
      categories: true,
      description: true,
      photos: true,
      attributes: true,
    },
    notes: 'Pay-per-lead model',
  },
  {
    id: 'angies_list',
    name: "Angi (Angie's List)",
    description: 'Home services reviews and marketplace',
    url: 'https://www.angi.com/',
    tier: 'tertiary',
    category: 'industry_specific',
    industries: ['home_services', 'contractor', 'plumber', 'electrician', 'hvac'],
    reach: '10M monthly visitors',
    submissionUrl: 'https://www.angi.com/pro/',
    pricing: 'freemium',
    napFields: {
      name: true,
      address: true,
      phone: true,
      website: true,
      hours: true,
      categories: true,
      description: true,
      photos: true,
      attributes: true,
    },
    notes: 'Merged with HomeAdvisor under ANGI Homeservices',
  },
  // Restaurants
  {
    id: 'tripadvisor',
    name: 'TripAdvisor',
    description: 'Travel and restaurant review platform',
    url: 'https://www.tripadvisor.com/',
    tier: 'tertiary',
    category: 'review_platform',
    industries: ['restaurant', 'hospitality', 'hotel', 'tourism'],
    reach: '460M monthly visitors',
    submissionUrl: 'https://www.tripadvisor.com/Owners',
    pricing: 'freemium',
    napFields: {
      name: true,
      address: true,
      phone: true,
      website: true,
      hours: true,
      categories: true,
      description: true,
      photos: true,
      attributes: true,
    },
    notes: 'Critical for restaurants and hospitality',
  },
];

// ============================================================================
// ALL AGGREGATORS
// ============================================================================

/**
 * All data aggregators combined
 */
export const ALL_AGGREGATORS: DataAggregator[] = [
  ...PRIMARY_AGGREGATORS,
  ...SECONDARY_AGGREGATORS,
  ...INDUSTRY_AGGREGATORS,
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get aggregators by tier
 */
export function getAggregatorsByTier(tier: AggregatorTier): DataAggregator[] {
  return ALL_AGGREGATORS.filter((a) => a.tier === tier);
}

/**
 * Get aggregators by category
 */
export function getAggregatorsByCategory(category: AggregatorCategory): DataAggregator[] {
  return ALL_AGGREGATORS.filter((a) => a.category === category);
}

/**
 * Get aggregators relevant to an industry
 */
export function getAggregatorsForIndustry(industry: string): DataAggregator[] {
  const normalizedIndustry = industry.toLowerCase();

  // Always include primary and secondary aggregators
  const generalAggregators = ALL_AGGREGATORS.filter(
    (a) => a.tier === 'primary' || a.tier === 'secondary'
  );

  // Add industry-specific aggregators
  const industryAggregators = ALL_AGGREGATORS.filter((a) => {
    if (!a.industries) return false;
    return a.industries.some(
      (ind) =>
        ind.toLowerCase().includes(normalizedIndustry) ||
        normalizedIndustry.includes(ind.toLowerCase())
    );
  });

  // Combine and deduplicate
  const combined = [...generalAggregators, ...industryAggregators];
  return Array.from(new Map(combined.map((a) => [a.id, a])).values());
}

/**
 * Get free aggregators only
 */
export function getFreeAggregators(): DataAggregator[] {
  return ALL_AGGREGATORS.filter((a) => a.pricing === 'free');
}

/**
 * Get priority-ordered aggregators for a business
 */
export function getPriorityAggregators(
  industry: string,
  budget: 'free' | 'low' | 'medium' | 'high' = 'low'
): DataAggregator[] {
  const aggregators = getAggregatorsForIndustry(industry);

  // Filter by budget
  const filtered = aggregators.filter((a) => {
    if (budget === 'free') return a.pricing === 'free';
    if (budget === 'low') return a.pricing !== 'paid';
    return true; // medium and high include all
  });

  // Sort by tier priority
  const tierOrder: Record<AggregatorTier, number> = {
    primary: 1,
    secondary: 2,
    tertiary: 3,
  };

  return filtered.sort((a, b) => tierOrder[a.tier] - tierOrder[b.tier]);
}

/**
 * Calculate aggregator coverage score
 */
export function calculateCoverageScore(
  submissions: AggregatorSubmission[],
  industry: string
): {
  score: number;
  total: number;
  verified: number;
  pending: number;
  missing: string[];
} {
  const relevantAggregators = getAggregatorsForIndustry(industry);
  const submissionMap = new Map(submissions.map((s) => [s.aggregatorId, s]));

  let verified = 0;
  let pending = 0;
  const missing: string[] = [];

  for (const aggregator of relevantAggregators) {
    const submission = submissionMap.get(aggregator.id);
    if (!submission) {
      missing.push(aggregator.name);
    } else if (submission.status === 'verified') {
      verified++;
    } else if (submission.status === 'pending' || submission.status === 'submitted') {
      pending++;
    }
  }

  const score = Math.round((verified / relevantAggregators.length) * 100);

  return {
    score,
    total: relevantAggregators.length,
    verified,
    pending,
    missing,
  };
}

/**
 * Generate submission checklist for an industry
 */
export function generateSubmissionChecklist(industry: string): {
  aggregator: DataAggregator;
  priority: 'critical' | 'high' | 'medium' | 'low';
  estimatedTime: string;
}[] {
  const aggregators = getPriorityAggregators(industry, 'high');

  return aggregators.map((aggregator) => {
    let priority: 'critical' | 'high' | 'medium' | 'low';
    let estimatedTime: string;

    if (aggregator.tier === 'primary') {
      priority = 'critical';
      estimatedTime = '30-60 min';
    } else if (aggregator.id === 'google_business') {
      priority = 'critical';
      estimatedTime = '15-30 min';
    } else if (aggregator.tier === 'secondary') {
      priority = 'high';
      estimatedTime = '10-20 min';
    } else if (aggregator.industries?.length) {
      priority = 'medium';
      estimatedTime = '10-15 min';
    } else {
      priority = 'low';
      estimatedTime = '5-10 min';
    }

    return {
      aggregator,
      priority,
      estimatedTime,
    };
  });
}

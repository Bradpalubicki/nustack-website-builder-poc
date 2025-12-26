/**
 * E-E-A-T Requirements
 *
 * Experience, Expertise, Authoritativeness, and Trustworthiness
 * requirements for different content types and industries.
 *
 * Based on Google's Quality Rater Guidelines and YMYL considerations.
 *
 * @see https://developers.google.com/search/docs/fundamentals/creating-helpful-content
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * E-E-A-T component weights (0-100)
 */
export interface EEATWeights {
  /** First-hand experience weight */
  experience: number;
  /** Subject matter expertise weight */
  expertise: number;
  /** Source/author authoritativeness weight */
  authoritativeness: number;
  /** Overall trustworthiness weight */
  trustworthiness: number;
}

/**
 * Content category for E-E-A-T requirements
 */
export type ContentCategory =
  | 'ymyl_health'
  | 'ymyl_financial'
  | 'ymyl_legal'
  | 'ymyl_news'
  | 'ymyl_safety'
  | 'educational'
  | 'commercial'
  | 'entertainment'
  | 'general';

/**
 * Author qualification level
 */
export type AuthorQualificationLevel =
  | 'professional' // Licensed/certified professional
  | 'expert' // Industry expert without formal license
  | 'experienced' // Significant hands-on experience
  | 'contributor'; // General contributor

/**
 * E-E-A-T requirement set for a content category
 */
export interface EEATRequirements {
  /** Content category */
  category: ContentCategory;
  /** Description of requirements */
  description: string;
  /** Is this YMYL content */
  isYMYL: boolean;
  /** E-E-A-T weights for this category */
  weights: EEATWeights;
  /** Required author qualifications */
  authorRequirements: {
    minimumLevel: AuthorQualificationLevel;
    requiredCredentials?: string[];
    preferredCredentials?: string[];
    bioRequired: boolean;
    photoRequired: boolean;
    linkedInRecommended: boolean;
  };
  /** Content requirements */
  contentRequirements: {
    citationsRequired: boolean;
    minimumCitations?: number;
    expertReviewRequired: boolean;
    medicalReviewRequired: boolean;
    legalReviewRequired: boolean;
    lastUpdatedRequired: boolean;
    updateFrequency?: 'monthly' | 'quarterly' | 'annually';
    disclosuresRequired: string[];
  };
  /** Trust signals required */
  trustSignals: {
    aboutPageRequired: boolean;
    contactInfoRequired: boolean;
    privacyPolicyRequired: boolean;
    termsRequired: boolean;
    physicalAddressRequired: boolean;
    professionalAffiliations?: boolean;
    awardsCredentials?: boolean;
  };
}

/**
 * E-E-A-T audit result
 */
export interface EEATAuditResult {
  /** Overall E-E-A-T score (0-100) */
  overallScore: number;
  /** Component scores */
  scores: {
    experience: number;
    expertise: number;
    authoritativeness: number;
    trustworthiness: number;
  };
  /** Category analyzed */
  category: ContentCategory;
  /** Issues found */
  issues: EEATIssue[];
  /** Recommendations */
  recommendations: string[];
  /** Critical gaps */
  criticalGaps: string[];
}

/**
 * E-E-A-T issue
 */
export interface EEATIssue {
  component: 'experience' | 'expertise' | 'authoritativeness' | 'trustworthiness';
  severity: 'critical' | 'major' | 'minor';
  description: string;
  recommendation: string;
}

// ============================================================================
// E-E-A-T REQUIREMENTS BY CATEGORY
// ============================================================================

/**
 * Healthcare (YMYL) E-E-A-T requirements
 */
export const HEALTHCARE_EEAT: EEATRequirements = {
  category: 'ymyl_health',
  description: 'Health and medical content that could impact physical or mental well-being',
  isYMYL: true,
  weights: {
    experience: 20,
    expertise: 35,
    authoritativeness: 25,
    trustworthiness: 20,
  },
  authorRequirements: {
    minimumLevel: 'professional',
    requiredCredentials: ['MD', 'DO', 'NP', 'PA', 'RN', 'PhD'],
    preferredCredentials: ['Board Certified', 'Fellowship Trained'],
    bioRequired: true,
    photoRequired: true,
    linkedInRecommended: true,
  },
  contentRequirements: {
    citationsRequired: true,
    minimumCitations: 3,
    expertReviewRequired: true,
    medicalReviewRequired: true,
    legalReviewRequired: false,
    lastUpdatedRequired: true,
    updateFrequency: 'quarterly',
    disclosuresRequired: [
      'Medical disclaimer',
      'Not a substitute for professional medical advice',
      'Consult your healthcare provider',
    ],
  },
  trustSignals: {
    aboutPageRequired: true,
    contactInfoRequired: true,
    privacyPolicyRequired: true,
    termsRequired: true,
    physicalAddressRequired: true,
    professionalAffiliations: true,
    awardsCredentials: true,
  },
};

/**
 * Financial (YMYL) E-E-A-T requirements
 */
export const FINANCIAL_EEAT: EEATRequirements = {
  category: 'ymyl_financial',
  description: 'Financial advice, investment, tax, or monetary decision content',
  isYMYL: true,
  weights: {
    experience: 25,
    expertise: 30,
    authoritativeness: 25,
    trustworthiness: 20,
  },
  authorRequirements: {
    minimumLevel: 'professional',
    requiredCredentials: ['CFA', 'CFP', 'CPA', 'EA', 'Series 7', 'Series 65'],
    preferredCredentials: ['Registered Investment Advisor', 'Fiduciary'],
    bioRequired: true,
    photoRequired: true,
    linkedInRecommended: true,
  },
  contentRequirements: {
    citationsRequired: true,
    minimumCitations: 2,
    expertReviewRequired: true,
    medicalReviewRequired: false,
    legalReviewRequired: false,
    lastUpdatedRequired: true,
    updateFrequency: 'quarterly',
    disclosuresRequired: [
      'Not financial advice',
      'Consult a licensed financial advisor',
      'Past performance disclaimer',
      'Risk disclosure',
    ],
  },
  trustSignals: {
    aboutPageRequired: true,
    contactInfoRequired: true,
    privacyPolicyRequired: true,
    termsRequired: true,
    physicalAddressRequired: true,
    professionalAffiliations: true,
    awardsCredentials: true,
  },
};

/**
 * Legal (YMYL) E-E-A-T requirements
 */
export const LEGAL_EEAT: EEATRequirements = {
  category: 'ymyl_legal',
  description: 'Legal advice, rights, or legal procedure content',
  isYMYL: true,
  weights: {
    experience: 25,
    expertise: 35,
    authoritativeness: 25,
    trustworthiness: 15,
  },
  authorRequirements: {
    minimumLevel: 'professional',
    requiredCredentials: ['JD', 'LLM', 'Esq.'],
    preferredCredentials: ['State Bar Member', 'Board Certified Specialist'],
    bioRequired: true,
    photoRequired: true,
    linkedInRecommended: true,
  },
  contentRequirements: {
    citationsRequired: true,
    minimumCitations: 2,
    expertReviewRequired: true,
    medicalReviewRequired: false,
    legalReviewRequired: true,
    lastUpdatedRequired: true,
    updateFrequency: 'annually',
    disclosuresRequired: [
      'Not legal advice',
      'Consult an attorney',
      'Laws vary by jurisdiction',
      'Attorney-client disclaimer',
    ],
  },
  trustSignals: {
    aboutPageRequired: true,
    contactInfoRequired: true,
    privacyPolicyRequired: true,
    termsRequired: true,
    physicalAddressRequired: true,
    professionalAffiliations: true,
    awardsCredentials: true,
  },
};

/**
 * News (YMYL) E-E-A-T requirements
 */
export const NEWS_EEAT: EEATRequirements = {
  category: 'ymyl_news',
  description: 'News and current events that impact civic decisions',
  isYMYL: true,
  weights: {
    experience: 20,
    expertise: 25,
    authoritativeness: 35,
    trustworthiness: 20,
  },
  authorRequirements: {
    minimumLevel: 'experienced',
    requiredCredentials: [],
    preferredCredentials: ['Journalism Degree', 'Press Credentials'],
    bioRequired: true,
    photoRequired: true,
    linkedInRecommended: true,
  },
  contentRequirements: {
    citationsRequired: true,
    minimumCitations: 2,
    expertReviewRequired: false,
    medicalReviewRequired: false,
    legalReviewRequired: false,
    lastUpdatedRequired: true,
    updateFrequency: 'monthly',
    disclosuresRequired: [
      'Editorial standards',
      'Corrections policy',
      'Fact-checking process',
    ],
  },
  trustSignals: {
    aboutPageRequired: true,
    contactInfoRequired: true,
    privacyPolicyRequired: true,
    termsRequired: true,
    physicalAddressRequired: true,
    professionalAffiliations: true,
    awardsCredentials: false,
  },
};

/**
 * Educational content E-E-A-T requirements
 */
export const EDUCATIONAL_EEAT: EEATRequirements = {
  category: 'educational',
  description: 'Educational and how-to content for learning',
  isYMYL: false,
  weights: {
    experience: 30,
    expertise: 30,
    authoritativeness: 20,
    trustworthiness: 20,
  },
  authorRequirements: {
    minimumLevel: 'experienced',
    requiredCredentials: [],
    preferredCredentials: ['Subject matter certification', 'Teaching credential'],
    bioRequired: true,
    photoRequired: false,
    linkedInRecommended: false,
  },
  contentRequirements: {
    citationsRequired: false,
    minimumCitations: 0,
    expertReviewRequired: false,
    medicalReviewRequired: false,
    legalReviewRequired: false,
    lastUpdatedRequired: true,
    updateFrequency: 'annually',
    disclosuresRequired: [],
  },
  trustSignals: {
    aboutPageRequired: true,
    contactInfoRequired: true,
    privacyPolicyRequired: true,
    termsRequired: false,
    physicalAddressRequired: false,
    professionalAffiliations: false,
    awardsCredentials: false,
  },
};

/**
 * Commercial/Product content E-E-A-T requirements
 */
export const COMMERCIAL_EEAT: EEATRequirements = {
  category: 'commercial',
  description: 'Product reviews, comparisons, and buying guides',
  isYMYL: false,
  weights: {
    experience: 40,
    expertise: 25,
    authoritativeness: 15,
    trustworthiness: 20,
  },
  authorRequirements: {
    minimumLevel: 'experienced',
    requiredCredentials: [],
    preferredCredentials: [],
    bioRequired: true,
    photoRequired: false,
    linkedInRecommended: false,
  },
  contentRequirements: {
    citationsRequired: false,
    minimumCitations: 0,
    expertReviewRequired: false,
    medicalReviewRequired: false,
    legalReviewRequired: false,
    lastUpdatedRequired: true,
    updateFrequency: 'quarterly',
    disclosuresRequired: [
      'Affiliate disclosure',
      'Sponsored content disclosure',
    ],
  },
  trustSignals: {
    aboutPageRequired: true,
    contactInfoRequired: true,
    privacyPolicyRequired: true,
    termsRequired: true,
    physicalAddressRequired: false,
    professionalAffiliations: false,
    awardsCredentials: false,
  },
};

/**
 * General content E-E-A-T requirements
 */
export const GENERAL_EEAT: EEATRequirements = {
  category: 'general',
  description: 'General informational content without specific YMYL impact',
  isYMYL: false,
  weights: {
    experience: 30,
    expertise: 25,
    authoritativeness: 20,
    trustworthiness: 25,
  },
  authorRequirements: {
    minimumLevel: 'contributor',
    requiredCredentials: [],
    preferredCredentials: [],
    bioRequired: false,
    photoRequired: false,
    linkedInRecommended: false,
  },
  contentRequirements: {
    citationsRequired: false,
    minimumCitations: 0,
    expertReviewRequired: false,
    medicalReviewRequired: false,
    legalReviewRequired: false,
    lastUpdatedRequired: false,
    disclosuresRequired: [],
  },
  trustSignals: {
    aboutPageRequired: true,
    contactInfoRequired: true,
    privacyPolicyRequired: true,
    termsRequired: false,
    physicalAddressRequired: false,
    professionalAffiliations: false,
    awardsCredentials: false,
  },
};

// ============================================================================
// REQUIREMENTS MAP
// ============================================================================

/**
 * All E-E-A-T requirements by category
 */
export const EEAT_REQUIREMENTS: Record<ContentCategory, EEATRequirements> = {
  ymyl_health: HEALTHCARE_EEAT,
  ymyl_financial: FINANCIAL_EEAT,
  ymyl_legal: LEGAL_EEAT,
  ymyl_news: NEWS_EEAT,
  ymyl_safety: HEALTHCARE_EEAT, // Similar requirements to health
  educational: EDUCATIONAL_EEAT,
  commercial: COMMERCIAL_EEAT,
  entertainment: GENERAL_EEAT,
  general: GENERAL_EEAT,
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get E-E-A-T requirements for a content category
 */
export function getRequirements(category: ContentCategory): EEATRequirements {
  return EEAT_REQUIREMENTS[category];
}

/**
 * Determine content category from industry
 */
export function getCategoryFromIndustry(industry: string): ContentCategory {
  const normalizedIndustry = industry.toLowerCase();

  if (
    normalizedIndustry.includes('health') ||
    normalizedIndustry.includes('medical') ||
    normalizedIndustry.includes('dental') ||
    normalizedIndustry.includes('pharma')
  ) {
    return 'ymyl_health';
  }

  if (
    normalizedIndustry.includes('financ') ||
    normalizedIndustry.includes('invest') ||
    normalizedIndustry.includes('bank') ||
    normalizedIndustry.includes('insurance') ||
    normalizedIndustry.includes('tax')
  ) {
    return 'ymyl_financial';
  }

  if (
    normalizedIndustry.includes('legal') ||
    normalizedIndustry.includes('law') ||
    normalizedIndustry.includes('attorney')
  ) {
    return 'ymyl_legal';
  }

  if (normalizedIndustry.includes('news') || normalizedIndustry.includes('media')) {
    return 'ymyl_news';
  }

  if (normalizedIndustry.includes('education') || normalizedIndustry.includes('training')) {
    return 'educational';
  }

  if (
    normalizedIndustry.includes('ecommerce') ||
    normalizedIndustry.includes('retail') ||
    normalizedIndustry.includes('shop')
  ) {
    return 'commercial';
  }

  return 'general';
}

/**
 * Check if content category is YMYL
 */
export function isYMYL(category: ContentCategory): boolean {
  return EEAT_REQUIREMENTS[category].isYMYL;
}

/**
 * Get minimum author level for category
 */
export function getMinimumAuthorLevel(category: ContentCategory): AuthorQualificationLevel {
  return EEAT_REQUIREMENTS[category].authorRequirements.minimumLevel;
}

/**
 * Check if author meets requirements
 */
export function authorMeetsRequirements(
  author: {
    credentials?: string[];
    qualificationLevel: AuthorQualificationLevel;
    hasBio: boolean;
    hasPhoto: boolean;
    hasLinkedIn: boolean;
  },
  category: ContentCategory
): { meets: boolean; gaps: string[] } {
  const requirements = EEAT_REQUIREMENTS[category].authorRequirements;
  const gaps: string[] = [];

  // Check qualification level
  const levelOrder: AuthorQualificationLevel[] = [
    'contributor',
    'experienced',
    'expert',
    'professional',
  ];
  const authorLevelIndex = levelOrder.indexOf(author.qualificationLevel);
  const requiredLevelIndex = levelOrder.indexOf(requirements.minimumLevel);

  if (authorLevelIndex < requiredLevelIndex) {
    gaps.push(
      `Author qualification level (${author.qualificationLevel}) below required (${requirements.minimumLevel})`
    );
  }

  // Check required credentials
  if (requirements.requiredCredentials?.length) {
    const hasRequiredCredential = requirements.requiredCredentials.some((cred) =>
      author.credentials?.some((ac) =>
        ac.toLowerCase().includes(cred.toLowerCase())
      )
    );
    if (!hasRequiredCredential) {
      gaps.push(
        `Missing required credentials: ${requirements.requiredCredentials.join(', ')}`
      );
    }
  }

  // Check bio
  if (requirements.bioRequired && !author.hasBio) {
    gaps.push('Author bio is required');
  }

  // Check photo
  if (requirements.photoRequired && !author.hasPhoto) {
    gaps.push('Author photo is required');
  }

  return {
    meets: gaps.length === 0,
    gaps,
  };
}

/**
 * Audit content for E-E-A-T compliance
 */
export function auditEEAT(
  content: {
    category: ContentCategory;
    hasAuthorBio: boolean;
    hasAuthorPhoto: boolean;
    hasAuthorCredentials: boolean;
    citationCount: number;
    hasExpertReview: boolean;
    hasMedicalReview: boolean;
    hasLegalReview: boolean;
    hasLastUpdated: boolean;
    hasAboutPage: boolean;
    hasContactInfo: boolean;
    hasPrivacyPolicy: boolean;
    hasDisclosures: boolean;
  }
): EEATAuditResult {
  const requirements = EEAT_REQUIREMENTS[content.category];
  const issues: EEATIssue[] = [];
  const recommendations: string[] = [];
  const criticalGaps: string[] = [];

  // Calculate component scores
  let experienceScore = 50; // Base score
  let expertiseScore = 50;
  let authoritativenessScore = 50;
  let trustworthinessScore = 50;

  // Experience scoring
  if (content.hasAuthorBio) experienceScore += 25;
  if (content.hasAuthorPhoto) experienceScore += 15;
  if (content.hasAuthorCredentials) experienceScore += 10;

  // Expertise scoring
  if (content.hasAuthorCredentials) expertiseScore += 20;
  if (content.hasExpertReview) expertiseScore += 15;
  if (content.hasMedicalReview) expertiseScore += 15;
  if (content.citationCount >= (requirements.contentRequirements.minimumCitations || 0)) {
    expertiseScore += 10;
  }

  // Authoritativeness scoring
  if (content.hasAboutPage) authoritativenessScore += 15;
  if (content.hasContactInfo) authoritativenessScore += 15;
  if (content.hasAuthorCredentials) authoritativenessScore += 20;

  // Trustworthiness scoring
  if (content.hasPrivacyPolicy) trustworthinessScore += 15;
  if (content.hasContactInfo) trustworthinessScore += 15;
  if (content.hasDisclosures) trustworthinessScore += 10;
  if (content.hasLastUpdated) trustworthinessScore += 10;

  // Cap scores at 100
  experienceScore = Math.min(experienceScore, 100);
  expertiseScore = Math.min(expertiseScore, 100);
  authoritativenessScore = Math.min(authoritativenessScore, 100);
  trustworthinessScore = Math.min(trustworthinessScore, 100);

  // Check for issues
  if (requirements.authorRequirements.bioRequired && !content.hasAuthorBio) {
    const severity = requirements.isYMYL ? 'critical' : 'major';
    issues.push({
      component: 'experience',
      severity,
      description: 'Missing author bio',
      recommendation: 'Add a detailed author bio with credentials and experience',
    });
    if (severity === 'critical') criticalGaps.push('Author bio required for YMYL content');
  }

  if (requirements.contentRequirements.citationsRequired) {
    const minCitations = requirements.contentRequirements.minimumCitations || 0;
    if (content.citationCount < minCitations) {
      issues.push({
        component: 'expertise',
        severity: 'major',
        description: `Insufficient citations (${content.citationCount} of ${minCitations} required)`,
        recommendation: `Add ${minCitations - content.citationCount} more authoritative citations`,
      });
    }
  }

  if (requirements.contentRequirements.medicalReviewRequired && !content.hasMedicalReview) {
    issues.push({
      component: 'expertise',
      severity: 'critical',
      description: 'Missing medical review',
      recommendation: 'Have content reviewed by a qualified medical professional',
    });
    criticalGaps.push('Medical review required for health content');
  }

  if (requirements.trustSignals.aboutPageRequired && !content.hasAboutPage) {
    issues.push({
      component: 'authoritativeness',
      severity: 'major',
      description: 'Missing about page',
      recommendation: 'Create a detailed about page with company/author information',
    });
  }

  // Generate recommendations
  if (!content.hasAuthorPhoto && requirements.authorRequirements.photoRequired) {
    recommendations.push('Add a professional author headshot photo');
  }
  if (!content.hasLastUpdated && requirements.contentRequirements.lastUpdatedRequired) {
    recommendations.push('Display last updated date on content');
  }
  if (!content.hasDisclosures && requirements.contentRequirements.disclosuresRequired.length > 0) {
    recommendations.push(
      `Add required disclosures: ${requirements.contentRequirements.disclosuresRequired.join(', ')}`
    );
  }

  // Calculate overall score
  const weights = requirements.weights;
  const overallScore = Math.round(
    (experienceScore * weights.experience +
      expertiseScore * weights.expertise +
      authoritativenessScore * weights.authoritativeness +
      trustworthinessScore * weights.trustworthiness) /
      (weights.experience + weights.expertise + weights.authoritativeness + weights.trustworthiness)
  );

  return {
    overallScore,
    scores: {
      experience: experienceScore,
      expertise: expertiseScore,
      authoritativeness: authoritativenessScore,
      trustworthiness: trustworthinessScore,
    },
    category: content.category,
    issues,
    recommendations,
    criticalGaps,
  };
}

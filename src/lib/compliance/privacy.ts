/**
 * Privacy Compliance
 *
 * CCPA/CPRA, GDPR, and state-specific privacy law compliance utilities.
 *
 * Requirements:
 * - "Do Not Sell or Share My Personal Information" link
 * - Honor Global Privacy Control (GPC) signal
 * - 15 business days to process opt-out requests
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface PrivacyRequirement {
  /** Requirement name */
  name: string;
  /** Description of the requirement */
  requirement: string;
  /** Implementation guidance */
  implementation: string;
  /** Applicable law */
  law?: string;
}

export interface PrivacyLawInfo {
  /** Law abbreviation */
  law: string;
  /** Full law name */
  fullName?: string;
  /** Effective date */
  effective: string;
  /** Business threshold for applicability */
  threshold: string;
  /** Key requirements */
  requirements?: PrivacyRequirement[];
}

// ============================================================================
// GPC DETECTION
// ============================================================================

/**
 * Check for Global Privacy Control signal
 * GPC is a legally binding opt-out signal in California
 */
export function detectGlobalPrivacyControl(): boolean {
  if (typeof window === 'undefined') return false;

  // Check for GPC signal (navigator.globalPrivacyControl)
  // Using type assertion since GPC is not yet in TypeScript definitions
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
  if (nav.globalPrivacyControl === true) {
    return true;
  }

  // Legacy: Check for DNT (Do Not Track) - less authoritative
  if (navigator.doNotTrack === '1') {
    return true;
  }

  return false;
}

/**
 * Check if user has opted out via any mechanism
 */
export function hasOptedOut(): boolean {
  if (typeof window === 'undefined') return false;

  // Check GPC signal
  if (detectGlobalPrivacyControl()) {
    return true;
  }

  // Check stored opt-out preference
  const stored = localStorage.getItem('privacy-opt-out');
  if (stored === 'true') {
    return true;
  }

  return false;
}

/**
 * Set opt-out preference
 */
export function setOptOut(optOut: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('privacy-opt-out', optOut.toString());
}

// ============================================================================
// CCPA REQUIREMENTS
// ============================================================================

/**
 * Generate the required CCPA "Do Not Sell" link
 */
export function generateDoNotSellLink(
  url: string = '/privacy/do-not-sell'
): string {
  return `<a href="${url}" class="do-not-sell-link">Do Not Sell or Share My Personal Information</a>`;
}

/**
 * CCPA/CPRA compliance requirements
 */
export const CCPARequirements = {
  doNotSellLink: {
    requirement: 'Required on homepage footer',
    text: 'Do Not Sell or Share My Personal Information',
    placement: 'Footer, visible without scrolling if possible',
  },
  gpcHonoring: {
    requirement: 'Legally binding opt-out signal in California',
    implementation: 'Check navigator.globalPrivacyControl on page load',
    action: 'If true, treat as opt-out of sale/sharing',
  },
  optOutProcessing: {
    requirement: '15 business days to process requests',
    implementation: 'Automated system recommended',
  },
  privacyPolicy: {
    requirement: 'Must disclose categories of personal info collected',
    sections: [
      'Categories of personal information collected',
      'Purposes for collection',
      'Categories of third parties shared with',
      'Consumer rights',
      'How to submit requests',
    ],
  },
};

// ============================================================================
// GDPR REQUIREMENTS
// ============================================================================

/**
 * GDPR compliance requirements
 */
export const GDPRRequirements = {
  priorConsent: {
    requirement: 'Consent BEFORE any non-essential cookies',
    implementation: 'Block all tracking scripts until consent given',
  },
  equalProminence: {
    requirement: 'Accept and Reject buttons must be equally prominent',
    prohibited: 'Dark patterns, pre-checked boxes, hidden reject options',
  },
  granularChoice: {
    requirement: 'Users can choose specific cookie categories',
    implementation: 'Expandable preferences panel',
  },
  easyWithdrawal: {
    requirement: 'As easy to withdraw as to give consent',
    implementation: 'Persistent "Cookie Settings" link in footer',
  },
  consentRecords: {
    requirement: 'Must be able to demonstrate valid consent',
    implementation: 'Store consent timestamp and choices',
  },
  reConsent: {
    requirement: 'Obtain fresh consent periodically',
    timeline: '12 months recommended',
  },
};

// ============================================================================
// US STATE PRIVACY LAWS
// ============================================================================

/**
 * US state-specific privacy laws
 */
export const USStatePrivacyLaws: Record<string, PrivacyLawInfo> = {
  california: {
    law: 'CCPA/CPRA',
    effective: 'January 1, 2020 / January 1, 2023',
    threshold:
      '$25M revenue OR 50k+ consumers OR 50%+ revenue from selling data',
  },
  virginia: {
    law: 'VCDPA',
    effective: 'January 1, 2023',
    threshold:
      '100k+ consumers OR 25k+ consumers with 50%+ revenue from data',
  },
  colorado: {
    law: 'CPA',
    effective: 'July 1, 2023',
    threshold: '100k+ consumers OR 25k+ consumers with revenue from data',
  },
  connecticut: {
    law: 'CTDPA',
    effective: 'July 1, 2023',
    threshold:
      '100k+ consumers OR 25k+ consumers with 25%+ revenue from data',
  },
  utah: {
    law: 'UCPA',
    effective: 'December 31, 2023',
    threshold:
      '$25M revenue AND 100k+ consumers OR 50%+ revenue from data',
  },
  texas: {
    law: 'TDPSA',
    effective: 'July 1, 2024',
    threshold: 'Businesses conducting business in Texas that process personal data',
  },
  oregon: {
    law: 'OCPA',
    effective: 'July 1, 2024',
    threshold:
      '100k+ consumers OR 25k+ consumers with 25%+ revenue from data',
  },
  montana: {
    law: 'MCDPA',
    effective: 'October 1, 2024',
    threshold: '50k+ consumers',
  },
};

// ============================================================================
// PRIVACY POLICY REQUIREMENTS
// ============================================================================

/**
 * Required sections for a comprehensive privacy policy
 */
export const PrivacyPolicySections = [
  {
    name: 'Information We Collect',
    description: 'Categories of personal information collected',
    required: true,
    laws: ['GDPR', 'CCPA'],
  },
  {
    name: 'How We Use Information',
    description: 'Purposes for processing personal data',
    required: true,
    laws: ['GDPR', 'CCPA'],
  },
  {
    name: 'Information Sharing',
    description: 'Third parties with whom data is shared',
    required: true,
    laws: ['GDPR', 'CCPA'],
  },
  {
    name: 'Your Rights',
    description: 'Consumer rights regarding personal data',
    required: true,
    laws: ['GDPR', 'CCPA'],
  },
  {
    name: 'Data Retention',
    description: 'How long data is kept',
    required: true,
    laws: ['GDPR'],
  },
  {
    name: 'Security Measures',
    description: 'How data is protected',
    required: true,
    laws: ['GDPR'],
  },
  {
    name: 'Cookie Policy',
    description: 'Types of cookies used and purposes',
    required: true,
    laws: ['GDPR', 'ePrivacy'],
  },
  {
    name: 'Contact Information',
    description: 'How to contact regarding privacy concerns',
    required: true,
    laws: ['GDPR', 'CCPA'],
  },
  {
    name: 'Updates to Policy',
    description: 'How policy changes are communicated',
    required: true,
    laws: ['GDPR'],
  },
  {
    name: 'International Transfers',
    description: 'Cross-border data transfers',
    required: false,
    laws: ['GDPR'],
  },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if a state has a comprehensive privacy law
 */
export function hasStatePrivacyLaw(state: string): boolean {
  return state.toLowerCase() in USStatePrivacyLaws;
}

/**
 * Get privacy law info for a state
 */
export function getStatePrivacyLaw(state: string): PrivacyLawInfo | null {
  return USStatePrivacyLaws[state.toLowerCase()] || null;
}

/**
 * Get all applicable privacy laws based on business characteristics
 */
export function getApplicableLaws(options: {
  hasEUUsers: boolean;
  hasUSUsers: boolean;
  usStates?: string[];
  annualRevenue?: number;
  consumerCount?: number;
}): string[] {
  const laws: string[] = [];

  if (options.hasEUUsers) {
    laws.push('GDPR');
  }

  if (options.hasUSUsers) {
    // Check state laws
    if (options.usStates) {
      for (const state of options.usStates) {
        if (hasStatePrivacyLaw(state)) {
          const law = getStatePrivacyLaw(state);
          if (law) {
            laws.push(`${state.toUpperCase()}: ${law.law}`);
          }
        }
      }
    }
  }

  return laws;
}

/**
 * Generate privacy compliance checklist
 */
export function generatePrivacyChecklist(options: {
  hasGDPR: boolean;
  hasCCPA: boolean;
}): { item: string; completed: boolean }[] {
  const checklist: { item: string; completed: boolean }[] = [];

  // Common requirements
  checklist.push(
    { item: 'Privacy policy published and accessible', completed: false },
    { item: 'Cookie consent banner implemented', completed: false },
    { item: 'Contact information for privacy inquiries', completed: false }
  );

  if (options.hasGDPR) {
    checklist.push(
      { item: 'Prior consent before non-essential cookies', completed: false },
      { item: 'Equal prominence Accept/Reject buttons', completed: false },
      { item: 'Granular cookie category choices', completed: false },
      { item: 'Data Processing Agreement with vendors', completed: false },
      { item: 'Record of Processing Activities', completed: false }
    );
  }

  if (options.hasCCPA) {
    checklist.push(
      {
        item: '"Do Not Sell or Share" link in footer',
        completed: false,
      },
      { item: 'Honor Global Privacy Control signal', completed: false },
      { item: 'Consumer rights request mechanism', completed: false },
      { item: 'Privacy policy updated for CCPA sections', completed: false }
    );
  }

  return checklist;
}

// ============================================================================
// DATA SUBJECT RIGHTS
// ============================================================================

/**
 * Data subject rights under various privacy laws
 */
export const DataSubjectRights = {
  gdpr: [
    'Right to access',
    'Right to rectification',
    'Right to erasure ("right to be forgotten")',
    'Right to restriction of processing',
    'Right to data portability',
    'Right to object',
    'Rights related to automated decision-making',
  ],
  ccpa: [
    'Right to know what personal information is collected',
    'Right to know if personal information is sold or shared',
    'Right to opt-out of sale/sharing',
    'Right to delete personal information',
    'Right to non-discrimination',
    'Right to correct inaccurate information',
    'Right to limit use of sensitive personal information',
  ],
};

/**
 * Get data subject rights for applicable laws
 */
export function getDataSubjectRights(laws: string[]): string[] {
  const rights: Set<string> = new Set();

  for (const law of laws) {
    if (law.toLowerCase().includes('gdpr')) {
      DataSubjectRights.gdpr.forEach((r) => rights.add(r));
    }
    if (
      law.toLowerCase().includes('ccpa') ||
      law.toLowerCase().includes('cpra')
    ) {
      DataSubjectRights.ccpa.forEach((r) => rights.add(r));
    }
  }

  return Array.from(rights);
}

/**
 * Industry-Specific Compliance Configuration
 *
 * Compliance requirements for regulated industries including
 * healthcare (HIPAA), legal (Bar Rules), e-commerce (PCI DSS),
 * and financial services (SEC/FINRA).
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface ComplianceRequirement {
  /** Requirement name */
  name: string;
  /** Description of the requirement */
  requirement: string;
  /** How to implement */
  implementation: string;
  /** Potential penalty for non-compliance */
  penalty?: string;
}

export interface IndustryComplianceConfig {
  /** Regulation name/abbreviation */
  name: string;
  /** Full regulation name */
  fullName: string;
  /** Deadline for compliance (if applicable) */
  deadline?: string;
  /** List of requirements */
  requirements: ComplianceRequirement[];
  /** Rules for form handling */
  formRules?: string[];
  /** Rules for content */
  contentRules?: string[];
  /** Required disclaimer text */
  disclaimer?: string;
}

// ============================================================================
// INDUSTRY COMPLIANCE CONFIGURATIONS
// ============================================================================

/**
 * Industry-specific compliance requirements
 */
export const IndustryCompliance: Record<string, IndustryComplianceConfig> = {
  healthcare: {
    name: 'HIPAA',
    fullName: 'Health Insurance Portability and Accountability Act',
    requirements: [
      {
        name: 'SSL/TLS Encryption',
        requirement: 'All data transmission must be encrypted',
        implementation: 'HTTPS everywhere, TLS 1.2+',
        penalty: 'Up to $50,000 per violation',
      },
      {
        name: 'Business Associate Agreement',
        requirement: 'BAA required with all vendors handling PHI',
        implementation:
          'Ensure Supabase, email provider, etc. have BAAs',
        penalty: 'Up to $50,000 per violation',
      },
      {
        name: 'Access Controls',
        requirement: 'MFA for admin access to PHI',
        implementation: 'Enable MFA on all admin accounts',
        penalty: 'Up to $50,000 per violation',
      },
      {
        name: 'No PHI in URLs',
        requirement: 'Protected Health Information cannot appear in URLs',
        implementation:
          'Use POST requests, no patient data in query strings',
        penalty: 'Up to $50,000 per violation',
      },
      {
        name: 'Audit Logging',
        requirement: 'Log all access to PHI',
        implementation: 'Database audit logging, access logs',
        penalty: 'Up to $50,000 per violation',
      },
      {
        name: 'Encryption at Rest',
        requirement: 'PHI must be encrypted when stored',
        implementation: 'Database encryption, encrypted backups',
        penalty: 'Up to $50,000 per violation',
      },
      {
        name: 'Minimum Necessary',
        requirement: 'Only access/display minimum PHI needed',
        implementation: 'Role-based access, data minimization',
        penalty: 'Up to $50,000 per violation',
      },
    ],
    formRules: [
      'All form submissions via secure POST over HTTPS',
      'Clear consent language before collecting health info',
      'Disclose data retention policies',
      'Provide patient rights information',
      'No auto-complete on PHI fields',
    ],
    contentRules: [
      'Medical review required for health content',
      'Citations to WHO, CDC, NIH, peer-reviewed sources',
      'Clear medical disclaimer on all health content',
      'Last reviewed date on medical pages',
      'Author credentials displayed (MD, DO, NP, etc.)',
    ],
    disclaimer: `This information is for educational purposes only and is not intended as medical advice.
Always consult with a qualified healthcare provider for medical advice, diagnosis, or treatment.
If you are experiencing a medical emergency, call 911 immediately.`,
  },

  legal: {
    name: 'Bar Rules',
    fullName: 'State Bar Association Rules of Professional Conduct',
    requirements: [
      {
        name: 'No Guarantees',
        requirement: 'Cannot guarantee case outcomes',
        implementation: 'Review all copy for guarantee language',
        penalty: 'Bar disciplinary action',
      },
      {
        name: 'Required Disclaimers',
        requirement: 'Past results disclaimer required',
        implementation:
          'Add disclaimer to testimonials and case results',
        penalty: 'Bar disciplinary action',
      },
      {
        name: 'No Specialist Claims',
        requirement:
          'Cannot claim "specialist" without board certification',
        implementation: 'Use "focuses on" or "experienced in" instead',
        penalty: 'Bar disciplinary action',
      },
      {
        name: 'State-Specific Rules',
        requirement:
          'Rules vary by state (CA, FL, TX, NY differ significantly)',
        implementation:
          'Review specific state bar rules for each attorney',
        penalty: 'Bar disciplinary action',
      },
      {
        name: 'Responsible Attorney',
        requirement: 'Name of attorney responsible for advertising',
        implementation: 'Include responsible attorney name and address',
        penalty: 'Bar disciplinary action',
      },
      {
        name: 'No Misleading Statements',
        requirement: 'All statements must be truthful and not misleading',
        implementation: 'Fact-check all claims, avoid superlatives',
        penalty: 'Bar disciplinary action',
      },
    ],
    contentRules: [
      'Clear identification of advertising material',
      'Attorney responsible for content named',
      'Office locations clearly stated',
      'Jurisdictions of practice disclosed',
      'Free consultation terms clearly stated',
    ],
    disclaimer: `The information on this website is for general informational purposes only and
does not constitute legal advice. No attorney-client relationship is formed by use of this website.
Past results do not guarantee future outcomes. Each case is different and must be evaluated on its own merits.`,
  },

  ecommerce: {
    name: 'PCI DSS v4.0',
    fullName: 'Payment Card Industry Data Security Standard',
    deadline: 'March 31, 2025 (mandatory compliance)',
    requirements: [
      {
        name: 'No Card Storage',
        requirement: 'Cannot store card data after authorization',
        implementation:
          'Use Stripe, Square, or similar - never handle raw card data',
        penalty: 'Fines up to $100,000/month, loss of processing ability',
      },
      {
        name: 'Strong Cryptography',
        requirement: 'TLS 1.2+ for all transmission',
        implementation: 'Ensure HTTPS everywhere, check TLS version',
        penalty: 'Fines up to $100,000/month',
      },
      {
        name: 'MFA for Admin',
        requirement: 'Multi-factor authentication for admin access',
        implementation: 'Enable MFA on all admin accounts',
        penalty: 'Fines up to $100,000/month',
      },
      {
        name: 'Security Testing',
        requirement: 'Regular vulnerability assessments',
        implementation: 'Quarterly scans, annual penetration testing',
        penalty: 'Fines up to $100,000/month',
      },
      {
        name: 'Access Logging',
        requirement: 'Log and monitor all access to cardholder data',
        implementation: 'Implement access logging, review regularly',
        penalty: 'Fines up to $100,000/month',
      },
      {
        name: 'Strong Passwords',
        requirement: 'Enforce password complexity and rotation',
        implementation: '12+ characters, complexity requirements, 90-day rotation',
        penalty: 'Fines up to $100,000/month',
      },
    ],
    contentRules: [
      'Clear pricing including all fees',
      'Return/refund policy easily accessible',
      'Shipping information before purchase',
      'Contact information visible',
      'Terms and conditions linked from checkout',
    ],
  },

  financial: {
    name: 'SEC/FINRA',
    fullName:
      'Securities and Exchange Commission / Financial Industry Regulatory Authority',
    requirements: [
      {
        name: 'Required Disclaimers',
        requirement: 'Investment risk disclaimers required',
        implementation: 'Add to all pages discussing investments',
        penalty: 'SEC enforcement action, fines',
      },
      {
        name: 'Form ADV Links',
        requirement: 'Link to Form ADV for registered advisors',
        implementation: 'Include in footer and about page',
        penalty: 'SEC enforcement action',
      },
      {
        name: 'Testimonial Rules',
        requirement: 'Specific rules for testimonials (changed 2024)',
        implementation: 'Disclose compensation, include disclaimers',
        penalty: 'SEC enforcement action',
      },
      {
        name: 'Performance Advertising',
        requirement: 'Strict rules on showing returns',
        implementation: 'Include all required disclosures',
        penalty: 'SEC enforcement action',
      },
      {
        name: 'Anti-Fraud',
        requirement: 'No misleading statements about services or results',
        implementation: 'Review all marketing materials carefully',
        penalty: 'SEC enforcement action, potential criminal charges',
      },
      {
        name: 'Books and Records',
        requirement: 'Maintain records of all client communications',
        implementation: 'Archive all emails, chat logs, documents',
        penalty: 'SEC enforcement action',
      },
    ],
    contentRules: [
      'Performance data must include specific time periods',
      'Benchmarks must be appropriate and disclosed',
      'Fees and expenses clearly disclosed',
      'Material risks prominently displayed',
      'CRS (Client Relationship Summary) accessible',
    ],
    disclaimer: `Investment advice is provided by [Firm Name], a registered investment advisor.
Past performance is not indicative of future results. Investing involves risk, including the potential
loss of principal. This is not an offer to buy or sell securities.`,
  },

  insurance: {
    name: 'State Insurance Regulations',
    fullName: 'State Department of Insurance Rules',
    requirements: [
      {
        name: 'License Display',
        requirement: 'Display license numbers prominently',
        implementation: 'Include license numbers in footer and about page',
        penalty: 'Fines, license suspension',
      },
      {
        name: 'No Rebating',
        requirement: 'Cannot offer rebates or inducements',
        implementation: 'Review all offers and promotions',
        penalty: 'Fines, license revocation',
      },
      {
        name: 'Fair Comparison',
        requirement: 'Product comparisons must be fair and accurate',
        implementation: 'Use same criteria for all compared products',
        penalty: 'Fines, enforcement action',
      },
      {
        name: 'Clear Disclosures',
        requirement: 'All material terms must be disclosed',
        implementation: 'Highlight limitations, exclusions, conditions',
        penalty: 'Fines, consumer complaints',
      },
    ],
    disclaimer: `Insurance products are offered by licensed insurance agents. Coverage options and
availability may vary by state. Not all products available in all states. Please review policy
documents for complete details.`,
  },

  real_estate: {
    name: 'Fair Housing / RESPA',
    fullName: 'Fair Housing Act / Real Estate Settlement Procedures Act',
    requirements: [
      {
        name: 'Equal Housing',
        requirement: 'Display Equal Housing Opportunity logo',
        implementation: 'Add logo to website footer and marketing materials',
        penalty: 'HUD enforcement action, fines',
      },
      {
        name: 'No Discrimination',
        requirement: 'No discriminatory language in listings',
        implementation: 'Review all listing descriptions',
        penalty: 'HUD enforcement action, lawsuits',
      },
      {
        name: 'RESPA Disclosures',
        requirement: 'Required disclosures for affiliated businesses',
        implementation: 'Disclose any affiliated title/mortgage companies',
        penalty: 'Fines, enforcement action',
      },
      {
        name: 'License Display',
        requirement: 'Display broker license information',
        implementation: 'Include in footer and agent profiles',
        penalty: 'State real estate commission action',
      },
    ],
    contentRules: [
      'No language describing neighborhood demographics',
      'Focus on property features, not neighborhood "character"',
      'Equal treatment in all marketing and listings',
      'ADA compliance for property accessibility info',
    ],
    disclaimer: `[Company Name] is an equal housing opportunity real estate firm. We do not
discriminate on the basis of race, color, religion, national origin, sex, disability, or familial status.`,
  },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get compliance requirements for an industry
 */
export function getComplianceRequirements(
  industry: string
): IndustryComplianceConfig | null {
  const normalizedIndustry = industry.toLowerCase().replace(/[^a-z]/g, '_');

  // Check exact match first
  if (normalizedIndustry in IndustryCompliance) {
    return IndustryCompliance[normalizedIndustry];
  }

  // Check partial matches
  for (const key of Object.keys(IndustryCompliance)) {
    if (normalizedIndustry.includes(key) || key.includes(normalizedIndustry)) {
      return IndustryCompliance[key];
    }
  }

  return null;
}

/**
 * Check if industry requires specific compliance
 */
export function requiresCompliance(industry: string): boolean {
  return getComplianceRequirements(industry) !== null;
}

/**
 * Get all industries with compliance requirements
 */
export function getRegulatedIndustries(): string[] {
  return Object.keys(IndustryCompliance);
}

/**
 * Get disclaimer for an industry
 */
export function getIndustryDisclaimer(industry: string): string | null {
  const config = getComplianceRequirements(industry);
  return config?.disclaimer || null;
}

/**
 * Get form rules for an industry
 */
export function getFormRules(industry: string): string[] {
  const config = getComplianceRequirements(industry);
  return config?.formRules || [];
}

/**
 * Get content rules for an industry
 */
export function getContentRules(industry: string): string[] {
  const config = getComplianceRequirements(industry);
  return config?.contentRules || [];
}

/**
 * Check compliance status
 */
export function checkComplianceStatus(
  industry: string,
  checks: Record<string, boolean>
): {
  compliant: boolean;
  passed: string[];
  failed: string[];
  total: number;
} {
  const config = getComplianceRequirements(industry);
  if (!config) {
    return { compliant: true, passed: [], failed: [], total: 0 };
  }

  const passed: string[] = [];
  const failed: string[] = [];

  for (const requirement of config.requirements) {
    if (checks[requirement.name]) {
      passed.push(requirement.name);
    } else {
      failed.push(requirement.name);
    }
  }

  return {
    compliant: failed.length === 0,
    passed,
    failed,
    total: config.requirements.length,
  };
}

/**
 * Generate compliance report
 */
export function generateComplianceReport(
  industry: string,
  checks: Record<string, boolean>
): string {
  const config = getComplianceRequirements(industry);
  if (!config) {
    return `No specific compliance requirements found for industry: ${industry}`;
  }

  const status = checkComplianceStatus(industry, checks);
  const lines: string[] = [
    `# ${config.name} Compliance Report`,
    `**Regulation:** ${config.fullName}`,
    '',
    `**Status:** ${status.compliant ? 'COMPLIANT' : 'NON-COMPLIANT'}`,
    `**Score:** ${status.passed.length}/${status.total}`,
    '',
  ];

  if (status.failed.length > 0) {
    lines.push('## Non-Compliant Items', '');
    for (const item of status.failed) {
      const req = config.requirements.find((r) => r.name === item);
      if (req) {
        lines.push(`### ${req.name}`);
        lines.push(`- Requirement: ${req.requirement}`);
        lines.push(`- Implementation: ${req.implementation}`);
        if (req.penalty) lines.push(`- Penalty: ${req.penalty}`);
        lines.push('');
      }
    }
  }

  if (status.passed.length > 0) {
    lines.push('## Compliant Items', '');
    status.passed.forEach((item) => {
      lines.push(`- ✓ ${item}`);
    });
  }

  return lines.join('\n');
}

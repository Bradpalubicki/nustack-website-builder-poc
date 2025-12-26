/**
 * NAP Consistency Manager
 *
 * Manages Name, Address, Phone (NAP) consistency across
 * all business listings and citations.
 *
 * NAP consistency is a critical local SEO ranking factor.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Business name with variations
 */
export interface BusinessName {
  /** Official legal name */
  legal: string;
  /** DBA (Doing Business As) name */
  dba?: string;
  /** Common variations to track */
  variations?: string[];
  /** Preferred display name */
  preferred: string;
}

/**
 * Physical address with structured components
 */
export interface Address {
  /** Street address line 1 */
  street1: string;
  /** Street address line 2 (suite, unit, etc.) */
  street2?: string;
  /** City */
  city: string;
  /** State/Province */
  state: string;
  /** ZIP/Postal code */
  zip: string;
  /** Country code (ISO 3166-1 alpha-2) */
  country: string;
  /** Neighborhood or district */
  neighborhood?: string;
  /** County */
  county?: string;
}

/**
 * Phone number with formatting
 */
export interface PhoneNumber {
  /** Raw phone number (digits only) */
  raw: string;
  /** Formatted phone number */
  formatted: string;
  /** Phone type */
  type: 'main' | 'mobile' | 'fax' | 'toll_free' | 'local';
  /** Is primary number */
  isPrimary: boolean;
}

/**
 * Complete NAP data for a business
 */
export interface NAPData {
  /** Business names */
  name: BusinessName;
  /** Business addresses (multi-location support) */
  addresses: Address[];
  /** Phone numbers */
  phones: PhoneNumber[];
  /** Website URL */
  website: string;
  /** Email address */
  email?: string;
  /** Business hours */
  hours?: BusinessHours;
}

/**
 * Business hours structure
 */
export interface BusinessHours {
  /** Regular hours by day */
  regular: {
    monday?: DayHours;
    tuesday?: DayHours;
    wednesday?: DayHours;
    thursday?: DayHours;
    friday?: DayHours;
    saturday?: DayHours;
    sunday?: DayHours;
  };
  /** Holiday hours */
  holidays?: {
    date: string;
    hours: DayHours | 'closed';
    name?: string;
  }[];
  /** Timezone */
  timezone: string;
}

/**
 * Hours for a single day
 */
export interface DayHours {
  open: string; // HH:MM format
  close: string; // HH:MM format
  breaks?: { start: string; end: string }[];
}

/**
 * NAP citation found in the wild
 */
export interface NAPCitation {
  /** Source name (e.g., "Yelp", "Yellow Pages") */
  source: string;
  /** Source URL */
  url: string;
  /** Found name */
  name: string;
  /** Found address */
  address: string;
  /** Found phone */
  phone: string;
  /** Found website */
  website?: string;
  /** Last checked date */
  lastChecked: string;
  /** Consistency score (0-100) */
  consistencyScore: number;
  /** Specific issues found */
  issues: NAPIssue[];
}

/**
 * NAP consistency issue
 */
export interface NAPIssue {
  field: 'name' | 'address' | 'phone' | 'website';
  expected: string;
  found: string;
  severity: 'critical' | 'major' | 'minor';
  description: string;
}

/**
 * NAP audit result
 */
export interface NAPAuditResult {
  /** Overall consistency score (0-100) */
  overallScore: number;
  /** Total citations found */
  totalCitations: number;
  /** Consistent citations */
  consistentCitations: number;
  /** Citations with issues */
  issuesFound: number;
  /** Detailed citation analysis */
  citations: NAPCitation[];
  /** Recommendations */
  recommendations: string[];
  /** Audit timestamp */
  auditedAt: string;
}

// ============================================================================
// NORMALIZATION FUNCTIONS
// ============================================================================

/**
 * Normalize a business name for comparison
 */
export function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    // Remove common suffixes
    .replace(/\s*(inc\.?|llc\.?|ltd\.?|corp\.?|co\.?|company|incorporated|limited)$/i, '')
    // Remove special characters
    .replace(/[^\w\s]/g, '')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Normalize an address for comparison
 */
export function normalizeAddress(address: Address | string): string {
  const addressStr = typeof address === 'string' ? address : formatAddress(address);

  return addressStr
    .toLowerCase()
    .trim()
    // Normalize street abbreviations
    .replace(/\bstreet\b/gi, 'st')
    .replace(/\bavenue\b/gi, 'ave')
    .replace(/\bboulevard\b/gi, 'blvd')
    .replace(/\bdrive\b/gi, 'dr')
    .replace(/\broad\b/gi, 'rd')
    .replace(/\blane\b/gi, 'ln')
    .replace(/\bcourt\b/gi, 'ct')
    .replace(/\bplace\b/gi, 'pl')
    .replace(/\bcircle\b/gi, 'cir')
    .replace(/\bhighway\b/gi, 'hwy')
    .replace(/\bparkway\b/gi, 'pkwy')
    // Normalize unit abbreviations
    .replace(/\bsuite\b/gi, 'ste')
    .replace(/\bapartment\b/gi, 'apt')
    .replace(/\bunit\b/gi, '#')
    .replace(/\bbuilding\b/gi, 'bldg')
    .replace(/\bfloor\b/gi, 'fl')
    // Normalize direction abbreviations
    .replace(/\bnorth\b/gi, 'n')
    .replace(/\bsouth\b/gi, 's')
    .replace(/\beast\b/gi, 'e')
    .replace(/\bwest\b/gi, 'w')
    .replace(/\bnortheast\b/gi, 'ne')
    .replace(/\bnorthwest\b/gi, 'nw')
    .replace(/\bsoutheast\b/gi, 'se')
    .replace(/\bsouthwest\b/gi, 'sw')
    // Remove periods
    .replace(/\./g, '')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Normalize a phone number for comparison
 */
export function normalizePhone(phone: string): string {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');

  // Handle US numbers
  if (digits.length === 10) {
    return digits;
  }
  if (digits.length === 11 && digits.startsWith('1')) {
    return digits.slice(1);
  }

  return digits;
}

/**
 * Format a phone number for display
 */
export function formatPhone(phone: string, format: 'us' | 'international' = 'us'): string {
  const digits = normalizePhone(phone);

  if (digits.length !== 10) {
    return phone; // Return original if not standard US format
  }

  if (format === 'us') {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  return `+1 ${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

/**
 * Format an address for display
 */
export function formatAddress(address: Address, format: 'single' | 'multi' = 'single'): string {
  const parts: string[] = [];

  parts.push(address.street1);
  if (address.street2) {
    parts.push(address.street2);
  }

  if (format === 'multi') {
    return [
      parts.join(', '),
      `${address.city}, ${address.state} ${address.zip}`,
    ].join('\n');
  }

  parts.push(`${address.city}, ${address.state} ${address.zip}`);
  return parts.join(', ');
}

// ============================================================================
// COMPARISON FUNCTIONS
// ============================================================================

/**
 * Compare two names and return similarity score (0-100)
 */
export function compareNames(name1: string, name2: string): number {
  const n1 = normalizeName(name1);
  const n2 = normalizeName(name2);

  if (n1 === n2) return 100;

  // Calculate Levenshtein distance-based similarity
  const distance = levenshteinDistance(n1, n2);
  const maxLength = Math.max(n1.length, n2.length);
  const similarity = Math.round((1 - distance / maxLength) * 100);

  return Math.max(0, similarity);
}

/**
 * Compare two addresses and return similarity score (0-100)
 */
export function compareAddresses(addr1: Address | string, addr2: Address | string): number {
  const a1 = normalizeAddress(addr1);
  const a2 = normalizeAddress(addr2);

  if (a1 === a2) return 100;

  // Calculate similarity
  const distance = levenshteinDistance(a1, a2);
  const maxLength = Math.max(a1.length, a2.length);
  const similarity = Math.round((1 - distance / maxLength) * 100);

  return Math.max(0, similarity);
}

/**
 * Compare two phone numbers and return similarity score (0-100)
 */
export function comparePhones(phone1: string, phone2: string): number {
  const p1 = normalizePhone(phone1);
  const p2 = normalizePhone(phone2);

  if (p1 === p2) return 100;

  // Partial match (e.g., area code matches)
  if (p1.slice(0, 3) === p2.slice(0, 3)) {
    return 50;
  }

  return 0;
}

/**
 * Levenshtein distance helper
 */
function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;
  const dp: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j - 1] + 1, // substitution
          dp[i - 1][j] + 1, // deletion
          dp[i][j - 1] + 1 // insertion
        );
      }
    }
  }

  return dp[m][n];
}

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validate NAP data completeness
 */
export function validateNAP(nap: NAPData): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Name validation
  if (!nap.name.preferred) {
    errors.push('Business name is required');
  }

  // Address validation
  if (nap.addresses.length === 0) {
    errors.push('At least one address is required');
  } else {
    nap.addresses.forEach((addr, i) => {
      if (!addr.street1) errors.push(`Address ${i + 1}: Street address is required`);
      if (!addr.city) errors.push(`Address ${i + 1}: City is required`);
      if (!addr.state) errors.push(`Address ${i + 1}: State is required`);
      if (!addr.zip) errors.push(`Address ${i + 1}: ZIP code is required`);
    });
  }

  // Phone validation
  if (nap.phones.length === 0) {
    errors.push('At least one phone number is required');
  } else {
    const primaryPhones = nap.phones.filter((p) => p.isPrimary);
    if (primaryPhones.length === 0) {
      warnings.push('No primary phone number designated');
    }
    if (primaryPhones.length > 1) {
      warnings.push('Multiple primary phone numbers designated');
    }
  }

  // Website validation
  if (!nap.website) {
    warnings.push('Website URL is recommended');
  } else {
    try {
      new URL(nap.website);
    } catch {
      errors.push('Invalid website URL format');
    }
  }

  // Hours validation
  if (!nap.hours) {
    warnings.push('Business hours are recommended for local SEO');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Analyze a citation for NAP consistency
 */
export function analyzeCitation(
  citation: Omit<NAPCitation, 'consistencyScore' | 'issues'>,
  canonical: NAPData
): NAPCitation {
  const issues: NAPIssue[] = [];

  // Check name consistency
  const nameScore = compareNames(citation.name, canonical.name.preferred);
  if (nameScore < 100) {
    issues.push({
      field: 'name',
      expected: canonical.name.preferred,
      found: citation.name,
      severity: nameScore < 70 ? 'critical' : 'major',
      description:
        nameScore < 70
          ? 'Business name significantly different'
          : 'Minor name variation detected',
    });
  }

  // Check address consistency (against primary address)
  const primaryAddress = canonical.addresses[0];
  if (primaryAddress) {
    const addressScore = compareAddresses(citation.address, primaryAddress);
    if (addressScore < 100) {
      issues.push({
        field: 'address',
        expected: formatAddress(primaryAddress),
        found: citation.address,
        severity: addressScore < 70 ? 'critical' : addressScore < 90 ? 'major' : 'minor',
        description:
          addressScore < 70
            ? 'Address significantly different'
            : 'Address formatting inconsistency',
      });
    }
  }

  // Check phone consistency
  const primaryPhone = canonical.phones.find((p) => p.isPrimary) || canonical.phones[0];
  if (primaryPhone) {
    const phoneScore = comparePhones(citation.phone, primaryPhone.raw);
    if (phoneScore < 100) {
      issues.push({
        field: 'phone',
        expected: primaryPhone.formatted,
        found: citation.phone,
        severity: phoneScore < 50 ? 'critical' : 'major',
        description:
          phoneScore < 50 ? 'Phone number is different' : 'Phone formatting inconsistency',
      });
    }
  }

  // Check website consistency
  if (citation.website) {
    const citationDomain = extractDomain(citation.website);
    const canonicalDomain = extractDomain(canonical.website);
    if (citationDomain !== canonicalDomain) {
      issues.push({
        field: 'website',
        expected: canonical.website,
        found: citation.website,
        severity: 'critical',
        description: 'Website URL points to different domain',
      });
    }
  }

  // Calculate overall consistency score
  const weights = { name: 30, address: 40, phone: 20, website: 10 };
  let totalWeight = 0;
  let weightedScore = 0;

  // Name score
  weightedScore += compareNames(citation.name, canonical.name.preferred) * weights.name;
  totalWeight += weights.name;

  // Address score
  if (primaryAddress) {
    weightedScore += compareAddresses(citation.address, primaryAddress) * weights.address;
    totalWeight += weights.address;
  }

  // Phone score
  if (primaryPhone) {
    weightedScore += comparePhones(citation.phone, primaryPhone.raw) * weights.phone;
    totalWeight += weights.phone;
  }

  // Website score
  if (citation.website) {
    const websiteMatch =
      extractDomain(citation.website) === extractDomain(canonical.website);
    weightedScore += (websiteMatch ? 100 : 0) * weights.website;
    totalWeight += weights.website;
  }

  const consistencyScore = Math.round(weightedScore / totalWeight);

  return {
    ...citation,
    consistencyScore,
    issues,
  };
}

/**
 * Extract domain from URL
 */
function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}

// ============================================================================
// AUDIT FUNCTIONS
// ============================================================================

/**
 * Generate NAP audit result from citations
 */
export function generateAuditResult(
  citations: NAPCitation[],
  canonical: NAPData
): NAPAuditResult {
  const consistentCitations = citations.filter((c) => c.consistencyScore >= 95);
  const issueCount = citations.filter((c) => c.issues.length > 0).length;

  // Calculate overall score
  const totalScore = citations.reduce((sum, c) => sum + c.consistencyScore, 0);
  const overallScore = citations.length > 0 ? Math.round(totalScore / citations.length) : 100;

  // Generate recommendations
  const recommendations: string[] = [];

  // Analyze common issues
  const nameIssues = citations.filter((c) => c.issues.some((i) => i.field === 'name'));
  const addressIssues = citations.filter((c) => c.issues.some((i) => i.field === 'address'));
  const phoneIssues = citations.filter((c) => c.issues.some((i) => i.field === 'phone'));

  if (nameIssues.length > 0) {
    recommendations.push(
      `Update business name on ${nameIssues.length} listing(s) to exactly: "${canonical.name.preferred}"`
    );
  }

  if (addressIssues.length > 0) {
    recommendations.push(
      `Correct address inconsistencies on ${addressIssues.length} listing(s). Use: "${formatAddress(canonical.addresses[0])}"`
    );
  }

  if (phoneIssues.length > 0) {
    const primaryPhone = canonical.phones.find((p) => p.isPrimary) || canonical.phones[0];
    recommendations.push(
      `Update phone number on ${phoneIssues.length} listing(s) to: ${primaryPhone.formatted}`
    );
  }

  if (overallScore < 80) {
    recommendations.push(
      'Consider using a citation management service to fix inconsistencies at scale'
    );
  }

  return {
    overallScore,
    totalCitations: citations.length,
    consistentCitations: consistentCitations.length,
    issuesFound: issueCount,
    citations,
    recommendations,
    auditedAt: new Date().toISOString(),
  };
}

/**
 * Generate canonical NAP for Schema.org markup
 */
export function generateSchemaOrgNAP(nap: NAPData): {
  name: string;
  address: object;
  telephone: string;
  url: string;
} {
  const primaryAddress = nap.addresses[0];
  const primaryPhone = nap.phones.find((p) => p.isPrimary) || nap.phones[0];

  return {
    name: nap.name.preferred,
    address: {
      '@type': 'PostalAddress',
      streetAddress: primaryAddress.street2
        ? `${primaryAddress.street1}, ${primaryAddress.street2}`
        : primaryAddress.street1,
      addressLocality: primaryAddress.city,
      addressRegion: primaryAddress.state,
      postalCode: primaryAddress.zip,
      addressCountry: primaryAddress.country,
    },
    telephone: formatPhone(primaryPhone.raw, 'international'),
    url: nap.website,
  };
}

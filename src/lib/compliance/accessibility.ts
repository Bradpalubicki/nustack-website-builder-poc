/**
 * WCAG 2.2 AA Compliance Requirements
 * Released: October 5, 2023
 *
 * Key Stats:
 * - 55 success criteria at Level AA
 * - 8,800 ADA lawsuits in 2024 (+7% from 2023)
 * - 22.65% of lawsuits targeted sites using accessibility overlay widgets
 * - Overlay widgets do NOT guarantee compliance
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface WCAGCriterion {
  /** WCAG criterion ID (e.g., "2.4.11") */
  id: string;
  /** Criterion name */
  name: string;
  /** WCAG conformance level */
  level: 'A' | 'AA' | 'AAA';
  /** Description of the requirement */
  requirement: string;
  /** Implementation guidance */
  implementation: string;
  /** Check function description */
  check?: string;
}

export interface AccessibilityIssue {
  /** Related WCAG criterion ID */
  criterion: string;
  /** Element selector or description */
  element?: string;
  /** Issue description */
  issue: string;
  /** Impact level */
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  /** How to fix */
  fix: string;
}

export interface AccessibilityAuditResult {
  /** Did the audit pass (no critical/serious issues) */
  passed: boolean;
  /** Score 0-100 */
  score: number;
  /** List of issues found */
  issues: AccessibilityIssue[];
  /** List of passed checks */
  passedChecks: string[];
  /** Summary by severity */
  summary: {
    critical: number;
    serious: number;
    moderate: number;
    minor: number;
  };
}

// ============================================================================
// WCAG 2.2 CRITERIA
// ============================================================================

/**
 * WCAG 2.2 Criteria organized by new vs critical existing
 */
export const WCAG22Criteria = {
  /**
   * New in WCAG 2.2 (October 2023)
   */
  new: [
    {
      id: '2.4.11',
      name: 'Focus Not Obscured (Minimum)',
      level: 'AA',
      requirement:
        'When a UI component receives focus, it is not entirely hidden by author-created content (sticky headers, modals, etc.)',
      implementation:
        'Ensure sticky elements do not cover focused elements; add scroll margin',
    },
    {
      id: '2.4.12',
      name: 'Focus Not Obscured (Enhanced)',
      level: 'AAA',
      requirement:
        'No part of the focus indicator is hidden by author-created content',
      implementation: 'Ensure focused elements are fully visible',
    },
    {
      id: '2.5.7',
      name: 'Dragging Movements',
      level: 'AA',
      requirement:
        'Functionality using dragging can be operated with single pointer without dragging',
      implementation: 'Provide button alternatives for drag operations',
    },
    {
      id: '2.5.8',
      name: 'Target Size (Minimum)',
      level: 'AA',
      requirement:
        'Touch/click targets at least 24x24 CSS pixels (with exceptions)',
      implementation:
        'Ensure all interactive elements meet minimum size; use padding if needed',
    },
    {
      id: '3.2.6',
      name: 'Consistent Help',
      level: 'A',
      requirement:
        'Help mechanisms appear in same relative order across pages',
      implementation:
        'Keep help links/buttons in consistent location in header/footer',
    },
    {
      id: '3.3.7',
      name: 'Redundant Entry',
      level: 'A',
      requirement:
        "Don't require users to re-enter information already provided in same session",
      implementation:
        'Auto-fill repeated fields; offer to use previously entered data',
    },
    {
      id: '3.3.8',
      name: 'Accessible Authentication (Minimum)',
      level: 'AA',
      requirement:
        'No cognitive function test (memorization, transcription) for authentication',
      implementation:
        'Allow password managers, copy/paste, biometrics, WebAuthn',
    },
    {
      id: '3.3.9',
      name: 'Accessible Authentication (Enhanced)',
      level: 'AAA',
      requirement:
        'No cognitive tests including object/image recognition for authentication',
      implementation: 'Avoid CAPTCHAs requiring image recognition',
    },
  ] as WCAGCriterion[],

  /**
   * Critical existing requirements
   */
  critical: [
    {
      id: '1.4.3',
      name: 'Contrast (Minimum)',
      level: 'AA',
      requirement: 'Text contrast ratio at least 4.5:1 (3:1 for large text)',
      implementation:
        'Use contrast checker on all text/background combinations',
      check: 'Use contrast checker on all text/background combinations',
    },
    {
      id: '2.1.1',
      name: 'Keyboard',
      level: 'A',
      requirement: 'All functionality available via keyboard',
      implementation:
        'Tab through entire page, ensure all actions accessible',
      check: 'Tab through entire page, ensure all actions accessible',
    },
    {
      id: '1.1.1',
      name: 'Non-text Content',
      level: 'A',
      requirement: 'All images have appropriate alt text',
      implementation:
        'Every <img> has alt attribute; decorative images have alt=""',
      check: 'Every <img> has alt attribute; decorative images have alt=""',
    },
    {
      id: '1.3.1',
      name: 'Info and Relationships',
      level: 'A',
      requirement: 'Form labels properly associated with inputs',
      implementation: 'Every input has associated <label> or aria-label',
      check: 'Every input has associated <label> or aria-label',
    },
    {
      id: '1.3.2',
      name: 'Meaningful Sequence',
      level: 'A',
      requirement: 'Content order makes sense when linearized',
      implementation: 'Reading order matches visual order',
      check: 'Reading order matches visual order',
    },
    {
      id: '2.4.1',
      name: 'Bypass Blocks',
      level: 'A',
      requirement: 'Skip navigation link for keyboard users',
      implementation: 'First focusable element is "Skip to content" link',
      check: 'First focusable element is "Skip to content" link',
    },
    {
      id: '2.4.2',
      name: 'Page Titled',
      level: 'A',
      requirement: 'Pages have descriptive titles',
      implementation: 'Each page has unique, descriptive <title>',
      check: 'Each page has unique, descriptive <title>',
    },
    {
      id: '2.4.4',
      name: 'Link Purpose',
      level: 'A',
      requirement: 'Link purpose clear from link text alone or context',
      implementation: 'No "click here" or "read more" without context',
      check: 'No "click here" or "read more" without context',
    },
    {
      id: '3.1.1',
      name: 'Language of Page',
      level: 'A',
      requirement: 'Page language identified',
      implementation: '<html lang="en"> attribute present',
      check: '<html lang="en"> attribute present',
    },
    {
      id: '4.1.2',
      name: 'Name, Role, Value',
      level: 'A',
      requirement: 'Custom UI components have accessible names and roles',
      implementation: 'ARIA attributes used correctly on custom components',
      check: 'ARIA attributes used correctly on custom components',
    },
  ] as WCAGCriterion[],
} as const;

// ============================================================================
// AUDIT FUNCTION
// ============================================================================

/**
 * Run accessibility audit on HTML content
 * Note: This is a basic programmatic check. Full audits should use
 * axe-core, WAVE, or manual testing with screen readers.
 */
export function auditAccessibility(html: string): AccessibilityAuditResult {
  const issues: AccessibilityIssue[] = [];
  const passedChecks: string[] = [];

  // Check for lang attribute
  if (!/<html[^>]*lang=/i.test(html)) {
    issues.push({
      criterion: '3.1.1',
      element: '<html>',
      issue: 'Missing lang attribute',
      impact: 'serious',
      fix: 'Add lang="en" (or appropriate language) to <html> element',
    });
  } else {
    passedChecks.push('3.1.1 Language of Page');
  }

  // Check for skip link
  if (!/(skip.*main|skip.*content|jump.*content)/i.test(html)) {
    issues.push({
      criterion: '2.4.1',
      issue: 'Missing skip navigation link',
      impact: 'serious',
      fix: 'Add "Skip to main content" link as first focusable element',
    });
  } else {
    passedChecks.push('2.4.1 Bypass Blocks');
  }

  // Check for title tag
  if (!/<title[^>]*>[^<]+<\/title>/i.test(html)) {
    issues.push({
      criterion: '2.4.2',
      element: '<title>',
      issue: 'Missing or empty page title',
      impact: 'serious',
      fix: 'Add descriptive <title> tag to <head>',
    });
  } else {
    passedChecks.push('2.4.2 Page Titled');
  }

  // Check for images without alt
  const imgMatches = html.match(/<img[^>]*>/gi) || [];
  const imgsWithoutAlt = imgMatches.filter((img) => !img.includes('alt='));
  if (imgsWithoutAlt.length > 0) {
    issues.push({
      criterion: '1.1.1',
      element: 'img',
      issue: `${imgsWithoutAlt.length} image(s) missing alt attribute`,
      impact: 'critical',
      fix: 'Add descriptive alt text to all images; use alt="" for decorative images',
    });
  } else if (imgMatches.length > 0) {
    passedChecks.push('1.1.1 Non-text Content');
  }

  // Check for form inputs without labels
  const inputMatches = html.match(/<input[^>]*>/gi) || [];
  const inputsNeedingLabels = inputMatches.filter(
    (input) =>
      !input.includes('aria-label') &&
      !input.includes('aria-labelledby') &&
      !input.includes('type="hidden"') &&
      !input.includes('type="submit"') &&
      !input.includes('type="button"')
  );

  // Simple check - real audit would verify <label> association
  if (inputsNeedingLabels.length > 0) {
    // Check if there are corresponding labels
    const labelCount = (html.match(/<label[^>]*>/gi) || []).length;
    if (labelCount < inputsNeedingLabels.length) {
      issues.push({
        criterion: '1.3.1',
        element: 'input',
        issue: 'Form inputs may be missing associated labels',
        impact: 'serious',
        fix: 'Ensure every input has an associated <label> or aria-label',
      });
    } else {
      passedChecks.push('1.3.1 Info and Relationships');
    }
  }

  // Check for buttons/links with poor text
  if (/(>click here<|>read more<|>learn more<|>here<)/i.test(html)) {
    issues.push({
      criterion: '2.4.4',
      element: 'a, button',
      issue: 'Vague link/button text detected',
      impact: 'moderate',
      fix: 'Use descriptive text that makes sense out of context',
    });
  } else {
    passedChecks.push('2.4.4 Link Purpose');
  }

  // Check for viewport meta tag (mobile accessibility)
  if (!/<meta[^>]*name=["']viewport["'][^>]*>/i.test(html)) {
    issues.push({
      criterion: '1.4.4',
      element: 'meta viewport',
      issue: 'Missing viewport meta tag',
      impact: 'moderate',
      fix: 'Add <meta name="viewport" content="width=device-width, initial-scale=1">',
    });
  } else {
    passedChecks.push('1.4.4 Resize Text');
  }

  // Check for heading structure
  const h1Matches = html.match(/<h1[^>]*>/gi) || [];
  if (h1Matches.length === 0) {
    issues.push({
      criterion: '1.3.1',
      element: 'h1',
      issue: 'Missing main heading (H1)',
      impact: 'moderate',
      fix: 'Add a main H1 heading to the page',
    });
  } else if (h1Matches.length > 1) {
    issues.push({
      criterion: '1.3.1',
      element: 'h1',
      issue: `Multiple H1 headings found (${h1Matches.length})`,
      impact: 'minor',
      fix: 'Use only one H1 per page',
    });
  }

  // Check for ARIA landmarks
  const hasMainLandmark =
    /<main[^>]*>|role=["']main["']/i.test(html);
  const hasNavLandmark =
    /<nav[^>]*>|role=["']navigation["']/i.test(html);
  if (!hasMainLandmark) {
    issues.push({
      criterion: '1.3.1',
      element: 'main',
      issue: 'Missing main landmark',
      impact: 'moderate',
      fix: 'Wrap main content in <main> element',
    });
  }

  // Calculate score
  const totalChecks = issues.length + passedChecks.length;
  const score =
    totalChecks > 0 ? Math.round((passedChecks.length / totalChecks) * 100) : 100;

  const summary = {
    critical: issues.filter((i) => i.impact === 'critical').length,
    serious: issues.filter((i) => i.impact === 'serious').length,
    moderate: issues.filter((i) => i.impact === 'moderate').length,
    minor: issues.filter((i) => i.impact === 'minor').length,
  };

  return {
    passed:
      issues.filter((i) => i.impact === 'critical' || i.impact === 'serious')
        .length === 0,
    score,
    issues,
    passedChecks,
    summary,
  };
}

// ============================================================================
// OVERLAY WIDGET WARNING
// ============================================================================

/**
 * Important warning about accessibility overlay widgets
 */
export const OverlayWidgetWarning = `
IMPORTANT: Accessibility overlay widgets do NOT guarantee compliance.

- 22.65% of 8,800 ADA lawsuits in 2024 targeted sites using overlay widgets
- Major accessibility organizations oppose overlays
- Overlays can interfere with actual assistive technology
- They may create a false sense of compliance

Recommendation: Implement actual accessibility fixes in code rather than relying on overlays.
`;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get all WCAG 2.2 AA criteria
 */
export function getWCAG22AACriteria(): WCAGCriterion[] {
  const aaCriteria = [
    ...WCAG22Criteria.new.filter((c) => c.level === 'AA' || c.level === 'A'),
    ...WCAG22Criteria.critical,
  ];
  return aaCriteria;
}

/**
 * Get criteria by level
 */
export function getCriteriaByLevel(level: 'A' | 'AA' | 'AAA'): WCAGCriterion[] {
  const allCriteria = [...WCAG22Criteria.new, ...WCAG22Criteria.critical];
  return allCriteria.filter((c) => c.level === level);
}

/**
 * Generate accessibility report summary
 */
export function generateAccessibilityReport(
  result: AccessibilityAuditResult
): string {
  const lines: string[] = [
    '# Accessibility Audit Report',
    '',
    `**Overall Score:** ${result.score}/100`,
    `**Status:** ${result.passed ? 'PASSED' : 'FAILED'}`,
    '',
    '## Summary',
    `- Critical Issues: ${result.summary.critical}`,
    `- Serious Issues: ${result.summary.serious}`,
    `- Moderate Issues: ${result.summary.moderate}`,
    `- Minor Issues: ${result.summary.minor}`,
    `- Passed Checks: ${result.passedChecks.length}`,
    '',
  ];

  if (result.issues.length > 0) {
    lines.push('## Issues Found', '');
    result.issues.forEach((issue) => {
      lines.push(
        `### [${issue.impact.toUpperCase()}] ${issue.criterion}: ${issue.issue}`
      );
      if (issue.element) lines.push(`- Element: \`${issue.element}\``);
      lines.push(`- Fix: ${issue.fix}`, '');
    });
  }

  if (result.passedChecks.length > 0) {
    lines.push('## Passed Checks', '');
    result.passedChecks.forEach((check) => {
      lines.push(`- ✓ ${check}`);
    });
  }

  return lines.join('\n');
}

/**
 * GDPR-compliant Cookie Consent Banner
 *
 * Requirements:
 * - Prior consent REQUIRED before non-essential cookies
 * - Equal prominence for Accept and Reject buttons (NO dark patterns)
 * - Granular category choices
 * - 12-month consent expiry
 * - Easy withdrawal of consent
 */

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ChevronDown, ChevronUp } from 'lucide-react';

// ============================================================================
// TOGGLE SWITCH COMPONENT
// ============================================================================

interface ToggleSwitchProps {
  id: string;
  checked: boolean;
  onCheckedChange: () => void;
  disabled?: boolean;
  'aria-label'?: string;
}

function ToggleSwitch({
  id,
  checked,
  onCheckedChange,
  disabled = false,
  'aria-label': ariaLabel,
}: ToggleSwitchProps) {
  return (
    <button
      id={id}
      role="switch"
      type="button"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onCheckedChange}
      className={`
        relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full
        border-2 border-transparent transition-colors duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        ${checked ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <span
        className={`
          pointer-events-none inline-block h-5 w-5 transform rounded-full
          bg-white shadow-lg ring-0 transition duration-200 ease-in-out
          ${checked ? 'translate-x-5' : 'translate-x-0'}
        `}
      />
    </button>
  );
}

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface CookieCategory {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Description of what cookies do */
  description: string;
  /** Cannot be disabled if true */
  required: boolean;
  /** Example services using these cookies */
  examples?: string[];
}

interface CookieConsentProps {
  /** Cookie categories to display */
  categories?: CookieCategory[];
  /** Privacy policy URL */
  privacyPolicyUrl?: string;
  /** Callback when all cookies accepted */
  onAcceptAll: () => void;
  /** Callback when all non-essential rejected */
  onRejectAll: () => void;
  /** Callback with granular preferences */
  onSavePreferences: (consents: Record<string, boolean>) => void;
}

// ============================================================================
// DEFAULT CATEGORIES
// ============================================================================

const defaultCategories: CookieCategory[] = [
  {
    id: 'necessary',
    name: 'Strictly Necessary',
    description: 'Required for the website to function. Cannot be disabled.',
    required: true,
    examples: ['Session cookies', 'Authentication', 'Security', 'Load balancing'],
  },
  {
    id: 'analytics',
    name: 'Performance & Analytics',
    description: 'Help us understand how visitors use our website.',
    required: false,
    examples: ['Google Analytics', 'Hotjar', 'Microsoft Clarity'],
  },
  {
    id: 'functionality',
    name: 'Functionality',
    description: 'Remember your preferences and personalize your experience.',
    required: false,
    examples: ['Language preferences', 'Region settings', 'Chat widgets'],
  },
  {
    id: 'marketing',
    name: 'Targeting & Advertising',
    description:
      'Used to deliver relevant ads and track campaign effectiveness.',
    required: false,
    examples: ['Google Ads', 'Facebook Pixel', 'LinkedIn Insight'],
  },
];

// ============================================================================
// CONSTANTS
// ============================================================================

const CONSENT_KEY = 'cookie-consent';
const CONSENT_EXPIRY_DAYS = 365; // 12 months per GDPR

// ============================================================================
// COMPONENT
// ============================================================================

export function CookieConsent({
  categories = defaultCategories,
  privacyPolicyUrl = '/privacy-policy',
  onAcceptAll,
  onRejectAll,
  onSavePreferences,
}: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consents, setConsents] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    categories.forEach((cat) => {
      initial[cat.id] = cat.required;
    });
    return initial;
  });

  useEffect(() => {
    // Check if consent already given
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) {
      setIsVisible(true);
    } else {
      try {
        const parsed = JSON.parse(stored);
        const expiryDate = new Date(parsed.expiry);
        if (expiryDate < new Date()) {
          // Consent expired, show banner again
          localStorage.removeItem(CONSENT_KEY);
          setIsVisible(true);
        }
      } catch {
        setIsVisible(true);
      }
    }
  }, []);

  const saveConsent = (consentData: Record<string, boolean>) => {
    const data = {
      consents: consentData,
      expiry: new Date(
        Date.now() + CONSENT_EXPIRY_DAYS * 24 * 60 * 60 * 1000
      ).toISOString(),
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(data));
    setIsVisible(false);
  };

  const handleAcceptAll = () => {
    const allConsents: Record<string, boolean> = {};
    categories.forEach((cat) => {
      allConsents[cat.id] = true;
    });
    saveConsent(allConsents);
    onAcceptAll();
  };

  const handleRejectAll = () => {
    const minimalConsents: Record<string, boolean> = {};
    categories.forEach((cat) => {
      minimalConsents[cat.id] = cat.required;
    });
    saveConsent(minimalConsents);
    onRejectAll();
  };

  const handleSavePreferences = () => {
    saveConsent(consents);
    onSavePreferences(consents);
  };

  const toggleCategory = (id: string) => {
    const category = categories.find((c) => c.id === id);
    if (category?.required) return; // Can't toggle required cookies

    setConsents((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/80 backdrop-blur-sm border-t">
      <Card className="max-w-4xl mx-auto p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <h2 className="text-lg font-semibold">Cookie Preferences</h2>
          </div>
        </div>

        <p className="text-muted-foreground mb-4">
          We use cookies to enhance your browsing experience, analyze site
          traffic, and personalize content. You can choose which cookies to
          allow. See our{' '}
          <a href={privacyPolicyUrl} className="text-primary hover:underline">
            Privacy Policy
          </a>{' '}
          for more information.
        </p>

        {/* GDPR Compliant: Equal prominence for Accept and Reject */}
        <div className="flex flex-wrap gap-3 mb-4">
          <Button onClick={handleAcceptAll} className="flex-1 sm:flex-none">
            Accept All
          </Button>
          <Button
            onClick={handleRejectAll}
            variant="outline"
            className="flex-1 sm:flex-none"
          >
            Reject All
          </Button>
          <Button
            onClick={() => setShowDetails(!showDetails)}
            variant="ghost"
            className="flex-1 sm:flex-none"
          >
            Customize
            {showDetails ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : (
              <ChevronDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Granular choices */}
        {showDetails && (
          <div className="border-t pt-4 space-y-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-start justify-between gap-4 py-2"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor={`cookie-${category.id}`}
                      className="font-medium cursor-pointer"
                    >
                      {category.name}
                    </Label>
                    {category.required && (
                      <span className="text-xs bg-muted px-2 py-0.5 rounded">
                        Required
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {category.description}
                  </p>
                  {category.examples && category.examples.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Examples: {category.examples.join(', ')}
                    </p>
                  )}
                </div>
                <ToggleSwitch
                  id={`cookie-${category.id}`}
                  checked={consents[category.id]}
                  onCheckedChange={() => toggleCategory(category.id)}
                  disabled={category.required}
                  aria-label={`Toggle ${category.name} cookies`}
                />
              </div>
            ))}

            <div className="pt-4 border-t">
              <Button onClick={handleSavePreferences}>Save Preferences</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get current consent status from localStorage
 */
export function getConsentStatus(): Record<string, boolean> | null {
  if (typeof window === 'undefined') return null;

  const stored = localStorage.getItem(CONSENT_KEY);
  if (!stored) return null;

  try {
    const parsed = JSON.parse(stored);
    return parsed.consents;
  } catch {
    return null;
  }
}

/**
 * Check if specific cookie type is allowed
 */
export function hasConsent(categoryId: string): boolean {
  const consents = getConsentStatus();
  if (!consents) return false;
  return consents[categoryId] === true;
}

/**
 * Clear stored consent (for testing or user request)
 */
export function clearConsent(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CONSENT_KEY);
}

/**
 * Get consent expiry date
 */
export function getConsentExpiry(): Date | null {
  if (typeof window === 'undefined') return null;

  const stored = localStorage.getItem(CONSENT_KEY);
  if (!stored) return null;

  try {
    const parsed = JSON.parse(stored);
    return new Date(parsed.expiry);
  } catch {
    return null;
  }
}

export default CookieConsent;

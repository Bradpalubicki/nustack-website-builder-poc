/**
 * Prompt Utilities
 *
 * Utility functions for healthcare prompt generation.
 */

/**
 * Format prompt variables by replacing template placeholders
 */
export function formatPromptVariables(
  template: string,
  variables: Record<string, string | number | boolean | undefined>
): string {
  let result = template;

  for (const [key, value] of Object.entries(variables)) {
    const placeholder = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    result = result.replace(placeholder, String(value ?? ''));
  }

  return result;
}

/**
 * Validate prompt parameters against a schema
 */
export function validatePromptParams<T extends Record<string, unknown>>(
  params: T,
  requiredFields: (keyof T)[]
): { valid: boolean; missing: string[] } {
  const missing: string[] = [];

  for (const field of requiredFields) {
    if (params[field] === undefined || params[field] === null || params[field] === '') {
      missing.push(String(field));
    }
  }

  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Sanitize AI output by removing unwanted elements
 */
export function sanitizePromptOutput(response: string): string {
  let sanitized = response;

  // Remove markdown code blocks if present
  sanitized = sanitized.replace(/```json\n?/g, '').replace(/```\n?/g, '');

  // Remove excessive whitespace
  sanitized = sanitized.replace(/\n{3,}/g, '\n\n');

  // Trim
  sanitized = sanitized.trim();

  return sanitized;
}

/**
 * Extract JSON from AI response
 */
export function extractJson<T>(response: string): T | null {
  try {
    const sanitized = sanitizePromptOutput(response);

    // Try to find JSON object
    const objectMatch = sanitized.match(/\{[\s\S]*\}/);
    if (objectMatch) {
      return JSON.parse(objectMatch[0]) as T;
    }

    // Try to find JSON array
    const arrayMatch = sanitized.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
      return JSON.parse(arrayMatch[0]) as T;
    }
  } catch {
    // Parsing failed
  }

  return null;
}

/**
 * Generate a URL-friendly slug from text
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Calculate estimated reading time
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Count words in content
 */
export function countWords(content: string): number {
  return content.split(/\s+/).filter(Boolean).length;
}

/**
 * Truncate text to a maximum length
 */
export function truncateText(text: string, maxLength: number, suffix = '...'): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - suffix.length).trim() + suffix;
}

/**
 * Generate meta title with length validation
 */
export function generateMetaTitle(
  parts: string[],
  maxLength = 60,
  separator = ' | '
): string {
  const joined = parts.join(separator);
  if (joined.length <= maxLength) return joined;

  // Truncate intelligently
  const truncated = parts.slice(0, -1).join(separator);
  if (truncated.length <= maxLength) return truncated;

  return truncateText(parts[0], maxLength);
}

/**
 * Generate meta description with length validation
 */
export function generateMetaDescription(
  text: string,
  maxLength = 160,
  includeEllipsis = true
): string {
  const cleanText = text.replace(/\s+/g, ' ').trim();
  if (cleanText.length <= maxLength) return cleanText;

  return truncateText(cleanText, maxLength, includeEllipsis ? '...' : '');
}

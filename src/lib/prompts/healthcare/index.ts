/**
 * Healthcare Prompt Templates
 *
 * AI prompt templates for generating healthcare-specific content.
 */

// Types
export * from './types';

// Prompt Generators
export { generateLocalSeoPagePrompt, parseLocalSeoPageResponse } from './localSeoPage';
export { generateHealthArticlePrompt, parseHealthArticleResponse } from './healthArticle';
export { generateFaqPrompt, parseFaqResponse } from './faqGenerator';
export type { FAQItem } from './faqGenerator';

// Utilities
export {
  formatPromptVariables,
  validatePromptParams,
  sanitizePromptOutput,
  extractJson,
  generateSlug,
  calculateReadingTime,
  countWords,
  truncateText,
  generateMetaTitle,
  generateMetaDescription,
} from './utils';

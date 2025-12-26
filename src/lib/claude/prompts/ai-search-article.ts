/**
 * AI Search Article Prompt
 *
 * Prompt template for generating AI-search-optimized content.
 * Optimized for citations in Google AI Overviews, ChatGPT, and Perplexity.
 *
 * @see ../../../lib/seo/ai-search/config.ts for optimization rules
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Input for AI search article generation
 */
export interface AISearchArticleInput {
  /** Primary topic/keyword */
  topic: string;
  /** Target search query to answer */
  targetQuery: string;
  /** Industry context */
  industry: string;
  /** Target word count */
  wordCount?: number;
  /** Include expert quotes */
  includeExpertQuotes?: boolean;
  /** Number of statistics to include */
  statisticsCount?: number;
  /** Focus on local relevance */
  localFocus?: {
    city: string;
    state: string;
    region?: string;
  };
  /** Additional context or requirements */
  additionalContext?: string;
  /** Target audience */
  audience?: string;
  /** Content tone */
  tone?: 'professional' | 'conversational' | 'authoritative' | 'empathetic';
}

/**
 * Generated article structure
 */
export interface AISearchArticleOutput {
  /** Article title (H1) */
  title: string;
  /** Meta description (150-160 chars) */
  metaDescription: string;
  /** Direct answer paragraph (40-60 words) */
  directAnswer: string;
  /** Full article content in markdown */
  content: string;
  /** FAQ items */
  faq: Array<{
    question: string;
    answer: string;
  }>;
  /** Schema.org structured data */
  schemaMarkup: {
    article: object;
    faq: object;
  };
}

// ============================================================================
// PROMPT TEMPLATES
// ============================================================================

/**
 * System prompt for AI search optimization
 */
export const AI_SEARCH_SYSTEM_PROMPT = `You are an expert content strategist specializing in Generative Engine Optimization (GEO). Your content is designed to be cited by AI systems including Google AI Overviews, ChatGPT, Perplexity, and Claude.

## Core Principles

1. **Direct Answers First**: Every article MUST begin with a 40-60 word paragraph that directly answers the main query. No preambles, no "In this article..." openers.

2. **Quotation Optimization**: Include 2-3 expert quotes with full attribution (Name, Title, Organization). AI systems prefer citable quotes.

3. **Statistical Authority**: Include specific, sourced statistics. Use formats like "According to [Source], [Year], [specific number]..."

4. **Structured Clarity**: Use clear heading hierarchy (H2, H3), bullet points, numbered lists, and comparison tables. AI systems parse structured content better.

5. **Citation-Ready Statements**: Write declarative sentences that can stand alone as citations. Avoid hedging language.

6. **FAQ Section**: Always include 5-7 frequently asked questions with concise (30-50 word) answers.

## Formatting Requirements

- Use markdown formatting
- Include comparison tables where relevant
- Add bullet points for lists of 3+ items
- Use numbered lists for sequential steps
- Bold key terms and statistics
- Include "Key Takeaway" boxes

## Source Attribution

- Cite authoritative sources (.gov, .edu, .org, peer-reviewed journals)
- Include publication year for statistics
- Attribute quotes with full credentials
- Link to primary sources when possible`;

/**
 * Generate the main article prompt
 */
export function generateArticlePrompt(input: AISearchArticleInput): string {
  const wordCount = input.wordCount || 1500;
  const statsCount = input.statisticsCount || 8;
  const tone = input.tone || 'professional';

  let prompt = `## Content Brief

**Topic**: ${input.topic}
**Target Query**: "${input.targetQuery}"
**Industry**: ${input.industry}
**Word Count**: ${wordCount} words
**Tone**: ${tone}
${input.audience ? `**Target Audience**: ${input.audience}` : ''}
${input.additionalContext ? `**Additional Context**: ${input.additionalContext}` : ''}

${
  input.localFocus
    ? `## Local Focus
- City: ${input.localFocus.city}
- State: ${input.localFocus.state}
${input.localFocus.region ? `- Region: ${input.localFocus.region}` : ''}
Include local statistics, regulations, and considerations where relevant.`
    : ''
}

## Required Elements

### 1. Direct Answer (40-60 words)
Write a definitive opening paragraph that directly answers the query "${input.targetQuery}". This paragraph should:
- Start with a clear, declarative statement
- Include a specific statistic or fact
- Be citation-ready (can stand alone)
- NOT begin with "In this article..." or similar preambles

### 2. Article Body
Structure the content with:
- Clear H2 and H3 headings
- ${statsCount}+ specific statistics with source attribution
- 2-3 comparison tables where relevant
- Bullet points for key information
- Numbered lists for processes/steps

### 3. Expert Quotes
${
  input.includeExpertQuotes !== false
    ? `Include 2-3 expert quotes. For each quote:
- Use quotation marks
- Include attribution: "- [Name], [Title], [Organization]"
- Make quotes specific and insightful`
    : 'Expert quotes not required for this article.'
}

### 4. FAQ Section
Include 5-7 FAQs that:
- Address common questions about "${input.topic}"
- Provide concise answers (30-50 words each)
- Use natural question phrasing
- Include at least one local-specific question ${input.localFocus ? `about ${input.localFocus.city}` : ''}

### 5. Key Takeaways
End with a "Key Takeaways" section summarizing 3-5 main points.

## Output Format

Provide the article in markdown format with:
1. Title (H1)
2. Direct answer paragraph
3. Article body with proper heading hierarchy
4. FAQ section with ## FAQ heading
5. Key Takeaways section

Remember: Write for AI citation. Every major claim should be specific, sourced, and quotable.`;

  return prompt;
}

/**
 * Generate prompt for article outline
 */
export function generateOutlinePrompt(input: AISearchArticleInput): string {
  return `Create a detailed outline for an article about "${input.topic}" targeting the query "${input.targetQuery}".

## Outline Requirements

1. **Title Options** (3 variations)
   - Each should include the primary keyword
   - Mix of question and statement formats

2. **Direct Answer Preview**
   - A 1-sentence summary of what the opening paragraph will convey

3. **Main Sections** (5-7 sections)
   For each section provide:
   - H2 heading
   - 2-3 H3 subheadings
   - Key points to cover
   - Suggested statistics to include
   - Table/list opportunities

4. **FAQ Topics** (7 questions)
   - List the FAQ questions to address

5. **Expert Quote Opportunities**
   - 3 places where expert quotes would strengthen the content
   - Suggested quote topics

6. **Comparison Table Topics**
   - 2 comparison table ideas with column headers

Format the outline in markdown with clear hierarchy.`;
}

/**
 * Generate prompt for FAQ expansion
 */
export function generateFAQPrompt(
  topic: string,
  existingQuestions: string[] = []
): string {
  return `Generate 7 FAQs about "${topic}" optimized for AI search citation.

${
  existingQuestions.length > 0
    ? `## Existing Questions (avoid duplicates)
${existingQuestions.map((q) => `- ${q}`).join('\n')}`
    : ''
}

## FAQ Requirements

Each FAQ must:
1. Use natural question phrasing (how, what, why, when, who)
2. Have a concise answer (30-50 words)
3. Include a specific fact or statistic when possible
4. Be citation-ready (answer can stand alone)
5. Address real user concerns

## Question Types to Include
- Definition/explanation question
- Cost/pricing question
- Comparison question
- Process/timeline question
- Local/regional consideration
- Common misconception
- Best practice recommendation

## Output Format

Provide in this format:

### Q: [Question]
[Answer in 30-50 words]

---

[Repeat for all 7 questions]`;
}

/**
 * Generate prompt for statistics enhancement
 */
export function generateStatisticsPrompt(
  topic: string,
  industry: string
): string {
  return `Identify 10 key statistics that should be included in content about "${topic}" in the ${industry} industry.

## Statistics Requirements

For each statistic, provide:
1. **Statistic**: The specific number/percentage
2. **Context**: What it measures
3. **Source**: Authoritative source (.gov, .edu, research institution)
4. **Year**: Publication year
5. **Usage Example**: How to phrase it in content

## Types of Statistics Needed
- Industry size/growth
- Consumer behavior/preferences
- Cost/pricing data
- Success rates/outcomes
- Comparison metrics
- Regional/local data
- Trend data (year-over-year)
- Survey/study findings

## Output Format

1. **[Statistic]**
   - Context: [explanation]
   - Source: [organization name]
   - Year: [year]
   - Usage: "[Example sentence using this statistic]"

Prioritize recent statistics (2022-2024) from authoritative sources.`;
}

// ============================================================================
// PROMPT UTILITIES
// ============================================================================

/**
 * Build complete prompt with system and user messages
 */
export function buildCompletePrompt(input: AISearchArticleInput): {
  system: string;
  user: string;
} {
  return {
    system: AI_SEARCH_SYSTEM_PROMPT,
    user: generateArticlePrompt(input),
  };
}

/**
 * Estimate token count for prompt (rough approximation)
 */
export function estimateTokenCount(text: string): number {
  // Rough estimate: 1 token ≈ 4 characters
  return Math.ceil(text.length / 4);
}

/**
 * Validate article output meets GEO requirements
 */
export function validateArticleOutput(
  content: string
): { valid: boolean; issues: string[] } {
  const issues: string[] = [];

  // Check for direct answer (first non-heading paragraph)
  const paragraphs = content.split('\n\n').filter((p) => !p.startsWith('#'));
  if (paragraphs.length > 0) {
    const firstPara = paragraphs[0];
    const wordCount = firstPara.split(/\s+/).length;
    if (wordCount < 40) {
      issues.push('Direct answer paragraph is too short (< 40 words)');
    }
    if (wordCount > 70) {
      issues.push('Direct answer paragraph is too long (> 70 words)');
    }
    if (/^(in this article|this guide|welcome|today)/i.test(firstPara)) {
      issues.push('Direct answer starts with preamble - should be definitive');
    }
  }

  // Check for FAQ section
  if (!/##?\s*(faq|frequently asked)/i.test(content)) {
    issues.push('Missing FAQ section');
  }

  // Check for statistics
  const statPattern = /\d+(?:\.\d+)?%|\$[\d,]+|\d{1,3}(?:,\d{3})+/g;
  const stats = content.match(statPattern) || [];
  if (stats.length < 5) {
    issues.push(`Only ${stats.length} statistics found (minimum 5 recommended)`);
  }

  // Check for quotes
  const quotePattern = /"[^"]{20,}"/g;
  const quotes = content.match(quotePattern) || [];
  if (quotes.length < 2) {
    issues.push(`Only ${quotes.length} quotes found (2-3 recommended)`);
  }

  // Check for heading structure
  if (!/^#{2}\s/m.test(content)) {
    issues.push('Missing H2 headings');
  }

  // Check for lists
  if (!/^[-*]\s/m.test(content) && !/^\d+\.\s/m.test(content)) {
    issues.push('Missing bullet or numbered lists');
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

// ============================================================================
// INDUSTRY-SPECIFIC PROMPTS
// ============================================================================

/**
 * Industry-specific prompt additions
 */
export const INDUSTRY_PROMPT_ADDITIONS: Record<string, string> = {
  healthcare: `
## Healthcare Content Requirements
- Include HIPAA compliance considerations where relevant
- Reference authoritative medical sources (NIH, Mayo Clinic, CDC)
- Add medical disclaimer
- Use patient-first language
- Include insurance/coverage considerations
- Reference clinical guidelines when applicable`,

  legal: `
## Legal Content Requirements
- Include jurisdiction disclaimers
- Reference relevant statutes and regulations
- Use precise legal terminology with explanations
- Include "consult an attorney" recommendations
- Reference bar association resources
- Address common legal misconceptions`,

  financial: `
## Financial Content Requirements
- Include appropriate disclaimers (not financial advice)
- Reference regulatory bodies (SEC, FINRA, CFPB)
- Use precise financial terminology
- Include risk considerations
- Reference market data sources
- Address tax implications where relevant`,

  real_estate: `
## Real Estate Content Requirements
- Include local market context
- Reference MLS data and market reports
- Address regulatory requirements
- Include financing considerations
- Reference local real estate trends
- Address seasonal market variations`,

  home_services: `
## Home Services Content Requirements
- Include licensing/certification requirements
- Reference industry standards and codes
- Address safety considerations
- Include typical cost ranges
- Reference local building codes
- Address seasonal service considerations`,
};

/**
 * Get industry-specific prompt addition
 */
export function getIndustryAddition(industry: string): string {
  const normalizedIndustry = industry.toLowerCase().replace(/[^a-z]/g, '_');

  for (const [key, value] of Object.entries(INDUSTRY_PROMPT_ADDITIONS)) {
    if (normalizedIndustry.includes(key) || key.includes(normalizedIndustry)) {
      return value;
    }
  }

  return '';
}

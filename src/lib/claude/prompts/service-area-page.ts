/**
 * Service Area Page Prompt
 *
 * Prompt template for generating location-specific service pages
 * optimized for local SEO and AI search citation.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Input for service area page generation
 */
export interface ServiceAreaPromptInput {
  /** Business name */
  businessName: string;
  /** Business type/industry */
  industry: string;
  /** City name */
  city: string;
  /** State code */
  state: string;
  /** Neighborhoods to mention */
  neighborhoods?: string[];
  /** ZIP codes served */
  zipCodes?: string[];
  /** Services offered */
  services: {
    name: string;
    description: string;
  }[];
  /** Phone number */
  phone: string;
  /** Years in business (optional) */
  yearsInBusiness?: number;
  /** Unique selling points */
  uniqueSellingPoints?: string[];
  /** Local landmarks or context */
  localContext?: string;
  /** Competitor differentiation */
  competitorDifferentiation?: string;
  /** Include pricing information */
  includePricing?: boolean;
  /** Tone */
  tone?: 'professional' | 'friendly' | 'authoritative';
}

/**
 * Generated page output
 */
export interface ServiceAreaPromptOutput {
  /** Meta title */
  metaTitle: string;
  /** Meta description */
  metaDescription: string;
  /** H1 heading */
  h1: string;
  /** Page content in markdown */
  content: string;
  /** FAQ section */
  faq: {
    question: string;
    answer: string;
  }[];
}

// ============================================================================
// PROMPT TEMPLATES
// ============================================================================

/**
 * System prompt for local service area pages
 */
export const SERVICE_AREA_SYSTEM_PROMPT = `You are an expert local SEO content writer specializing in service area pages that rank for local search queries and earn AI citations.

## Core Principles

1. **Local Relevance**: Every page must feel authentically local, mentioning specific neighborhoods, landmarks, and local context. Generic content fails.

2. **Service Focus**: Lead with specific services, not generic company information. Users searching locally want to know what you do for them.

3. **Trust Signals**: Include licensing, insurance, years in business, and local credentials. Local customers need trust.

4. **Direct Value**: Start with clear value propositions. No fluff, no filler.

5. **Mobile Optimization**: Write for mobile-first users. Short paragraphs, scannable content, clear CTAs.

## Content Structure

1. **Opening (50-75 words)**
   - Direct statement of services + location
   - Primary value proposition
   - Immediate relevance to searcher

2. **Services Section**
   - Bullet points for each service
   - Brief description with local context
   - Include pricing ranges if available

3. **Why Choose Us**
   - Local expertise emphasis
   - Trust signals (licensing, insurance, reviews)
   - Differentiators from competitors

4. **Service Area Coverage**
   - Specific neighborhoods served
   - ZIP codes if helpful
   - Response time/availability

5. **FAQ Section (5-7 questions)**
   - Location-specific questions
   - Pricing/cost questions
   - Process/timeline questions
   - Trust/credential questions

## SEO Requirements

- Primary keyword in title, H1, first paragraph
- Location + service combinations throughout
- Natural keyword density (don't force it)
- Internal linking opportunities marked
- Schema.org ready content structure`;

/**
 * Generate the main service area page prompt
 */
export function generateServiceAreaPrompt(input: ServiceAreaPromptInput): string {
  const servicesList = input.services
    .map((s) => `- ${s.name}: ${s.description}`)
    .join('\n');

  const neighborhoodList = input.neighborhoods?.join(', ') || 'all neighborhoods';
  const tone = input.tone || 'professional';

  return `## Content Brief

**Business**: ${input.businessName}
**Industry**: ${input.industry}
**Target Location**: ${input.city}, ${input.state}
**Neighborhoods**: ${neighborhoodList}
${input.zipCodes?.length ? `**ZIP Codes**: ${input.zipCodes.join(', ')}` : ''}
**Phone**: ${input.phone}
${input.yearsInBusiness ? `**Years in Business**: ${input.yearsInBusiness}` : ''}
**Tone**: ${tone}

## Services Offered
${servicesList}

${
  input.uniqueSellingPoints?.length
    ? `## Unique Selling Points
${input.uniqueSellingPoints.map((usp) => `- ${usp}`).join('\n')}`
    : ''
}

${input.localContext ? `## Local Context\n${input.localContext}` : ''}

${input.competitorDifferentiation ? `## Competitive Differentiation\n${input.competitorDifferentiation}` : ''}

## Required Output

Generate a complete service area page with the following sections:

### 1. Meta Title (60 characters max)
Format: [Primary Service] in [City], [State] | [Business Name]

### 2. Meta Description (155 characters max)
Include: primary service, location, call-to-action, phone number

### 3. H1 Heading
Natural, keyword-rich heading for the page

### 4. Introduction (50-75 words)
- Start with a direct service statement
- Include location name in first sentence
- Mention key differentiator
- DO NOT start with "Welcome to..." or "Looking for..."

### 5. Our Services in [City] Section
- Bullet points for each service
- Brief local context for each
${input.includePricing ? '- Include price ranges where appropriate' : ''}

### 6. Areas We Serve Section
- List specific neighborhoods: ${neighborhoodList}
- Mention coverage area and response times
- Include any ZIP-specific information

### 7. Why Choose [Business Name] Section
- 4-5 bullet points with specific reasons
- Include: local expertise, licensing/insurance, customer service
${input.yearsInBusiness ? `- Mention ${input.yearsInBusiness} years of experience` : ''}

### 8. FAQ Section
Generate 5-7 FAQs covering:
- Services in ${input.city} specifically
- Pricing/cost questions
- Service area/availability questions
- Licensing/trust questions
- Process/timeline questions

Format each FAQ as:
**Q: [Question about ${input.city}]**
A: [Concise 30-50 word answer]

### 9. Call to Action
- Strong CTA with phone number
- Mention ${input.city} specifically
- Create urgency without being pushy

## Output Format

Provide all content in markdown format with clear section headings.
Mark internal linking opportunities with [LINK: description].`;
}

/**
 * Generate prompt for bulk service area pages
 */
export function generateBulkServiceAreaPrompt(
  input: Omit<ServiceAreaPromptInput, 'city' | 'state' | 'neighborhoods'>,
  locations: { city: string; state: string; neighborhoods?: string[] }[]
): string {
  return `## Bulk Service Area Page Generation

Generate unique content for ${locations.length} service area pages.

**Business**: ${input.businessName}
**Industry**: ${input.industry}
**Phone**: ${input.phone}

## Services (same for all locations)
${input.services.map((s) => `- ${s.name}: ${s.description}`).join('\n')}

## Locations to Generate

${locations
  .map(
    (loc, i) => `### Location ${i + 1}: ${loc.city}, ${loc.state}
Neighborhoods: ${loc.neighborhoods?.join(', ') || 'N/A'}`
  )
  .join('\n\n')}

## Requirements for Each Page

For EACH location, generate:
1. Meta Title (unique, location-specific)
2. Meta Description (unique, location-specific)
3. H1 Heading (unique variation)
4. Introduction paragraph (50-75 words, unique local angles)
5. 3 unique FAQs specific to that city

## Critical: Uniqueness

Each page MUST be unique. Do not use template-style fill-in-the-blank content.
Include local context, landmarks, or regional information where possible.
Vary sentence structure and word choice between pages.

## Output Format

Separate each location with a horizontal rule (---).
Use clear headings to delineate sections.`;
}

/**
 * Generate prompt for FAQ enhancement
 */
export function generateLocalFAQPrompt(
  city: string,
  state: string,
  industry: string,
  services: string[]
): string {
  return `Generate 10 highly specific FAQs for a ${industry} business serving ${city}, ${state}.

## Services Offered
${services.map((s) => `- ${s}`).join('\n')}

## FAQ Requirements

Each FAQ must:
1. Be specific to ${city}, ${state}
2. Include the city name in either the question or answer
3. Address real customer concerns
4. Have a concise answer (30-50 words)
5. Be unique (no generic questions)

## Question Types Needed

1. **Local Availability** (2 questions)
   - Service area coverage in ${city}
   - Response times/availability

2. **Pricing/Cost** (2 questions)
   - Specific to ${city} market rates
   - Payment/financing options

3. **Process/Timeline** (2 questions)
   - How services work in ${city}
   - Typical project timelines

4. **Trust/Credentials** (2 questions)
   - Licensing in ${state}
   - Insurance/bonding

5. **Local Considerations** (2 questions)
   - ${city}-specific regulations or requirements
   - Weather/seasonal factors

## Output Format

**Q: [Question]**
A: [Answer in 30-50 words]

---

[Repeat for all 10 questions]`;
}

/**
 * Generate prompt for local content enhancement
 */
export function generateLocalContentEnhancementPrompt(
  existingContent: string,
  city: string,
  state: string,
  neighborhoods?: string[]
): string {
  return `## Local Content Enhancement

Enhance the following content to be more locally relevant to ${city}, ${state}.

### Existing Content
${existingContent}

### Enhancement Requirements

1. **Add Local References**
   - Mention ${city} by name where natural
   - Reference specific neighborhoods: ${neighborhoods?.join(', ') || 'downtown, surrounding areas'}
   - Include local context or landmarks if relevant

2. **Improve Local SEO**
   - Ensure "${city}" appears in headings where appropriate
   - Add location + service keyword combinations
   - Maintain natural reading flow

3. **Add Local Trust Signals**
   - Local licensing mentions
   - Service area specifics
   - Local customer service emphasis

4. **Maintain Quality**
   - Keep the same tone and structure
   - Don't over-stuff keywords
   - Ensure changes feel natural

## Output

Provide the enhanced content in markdown format.
Mark changes with [ENHANCED] comments for review.`;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Build complete prompt with system and user messages
 */
export function buildCompleteServiceAreaPrompt(input: ServiceAreaPromptInput): {
  system: string;
  user: string;
} {
  return {
    system: SERVICE_AREA_SYSTEM_PROMPT,
    user: generateServiceAreaPrompt(input),
  };
}

/**
 * Validate service area prompt output
 */
export function validateServiceAreaOutput(
  content: string,
  city: string
): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  const cityLower = city.toLowerCase();

  // Check for city mentions
  const cityMentions = (content.toLowerCase().match(new RegExp(cityLower, 'g')) || []).length;
  if (cityMentions < 5) {
    issues.push(`City "${city}" mentioned only ${cityMentions} times (minimum 5 recommended)`);
  }

  // Check for meta title
  if (!content.includes('Meta Title') && !content.includes('# ')) {
    issues.push('Missing meta title section');
  }

  // Check for FAQ section
  if (!/faq|frequently asked/i.test(content)) {
    issues.push('Missing FAQ section');
  }

  // Check for services section
  if (!/services|what we offer/i.test(content)) {
    issues.push('Missing services section');
  }

  // Check for generic openers
  if (/^(welcome to|looking for|are you looking)/im.test(content)) {
    issues.push('Content starts with generic opener - should be more direct');
  }

  // Check minimum length
  const wordCount = content.split(/\s+/).length;
  if (wordCount < 500) {
    issues.push(`Content is only ${wordCount} words (minimum 500 recommended)`);
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

/**
 * Extract meta information from generated content
 */
export function extractMetaFromContent(content: string): {
  title: string | null;
  description: string | null;
  h1: string | null;
} {
  const titleMatch = content.match(/meta title[:\s]*(.+?)(?:\n|$)/i);
  const descMatch = content.match(/meta description[:\s]*(.+?)(?:\n|$)/i);
  const h1Match = content.match(/^#\s+(.+?)$/m) || content.match(/h1[:\s]*(.+?)(?:\n|$)/i);

  return {
    title: titleMatch?.[1]?.trim() || null,
    description: descMatch?.[1]?.trim() || null,
    h1: h1Match?.[1]?.trim() || null,
  };
}

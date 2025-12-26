/**
 * Local SEO Page Prompt Template
 *
 * Generates content for location + service pages optimized for local search.
 */

import type { LocalSeoPageParams, GeneratedContent } from './types';

/**
 * Generate a prompt for creating local SEO page content
 */
export function generateLocalSeoPagePrompt(params: LocalSeoPageParams): string {
  const { locationData, serviceData, businessInfo, existingContent = [] } = params;

  const location = locationData;
  const service = serviceData;
  const city = location.city;
  const state = location.stateFull || location.state;
  const serviceName = service.name;
  const shortServiceName = service.shortName || service.name;

  return `You are an expert healthcare SEO copywriter. Generate comprehensive, E-E-A-T compliant content for a local SEO landing page.

## Page Context
- Business: ${businessInfo.name}
- Service: ${serviceName} (short: ${shortServiceName})
- Location: ${city}, ${state}
- Address: ${location.addressLine1}, ${city}, ${state} ${location.zip}
- Phone: ${location.phone}
${location.serviceAreas ? `- Service Areas: ${location.serviceAreas.join(', ')}` : ''}

## Target Keywords
Primary: "${shortServiceName} in ${city}", "${shortServiceName} ${city} ${state}"
Secondary: "${shortServiceName} near me", "${shortServiceName} clinic ${city}", "best ${shortServiceName.toLowerCase()} ${city}"

## Existing Content to Avoid Duplicating
${existingContent.length > 0 ? existingContent.map((c) => `- ${c}`).join('\n') : 'None'}

## Requirements

### SEO Elements
1. Meta Title: 50-60 characters, include city + service + state
   Format: "${shortServiceName} in ${city}, ${state} | ${businessInfo.name}"

2. Meta Description: 150-160 characters
   - Include location
   - Include primary service
   - Include call-to-action
   - Include phone number

3. H1 Heading: Natural, includes city + service
   Format: "${serviceName} in ${city}, ${state}"

### Content Sections (1200-1500 words total)

1. **Hero Section** (50-75 words)
   - Empathetic opening addressing patient needs
   - Mention location prominently
   - Include primary service

2. **Service Overview** (150-200 words)
   - What the service is
   - How it helps patients
   - Localize content to ${city} area

3. **Why Choose Us in ${city}** (150-200 words)
   - Local expertise
   - Convenient location
   - Experienced team
   - Patient-focused care

4. **Treatment Options Available** (200-250 words)
   - List treatment variations
   - Brief descriptions
   - Mention availability at this location

5. **What to Expect** (150-200 words)
   - Consultation process
   - Treatment experience
   - Follow-up care

6. **Serving ${city} and Surrounding Areas** (100-150 words)
   - Mention service areas: ${location.serviceAreas?.join(', ') || 'surrounding communities'}
   - Local community commitment
   - Easy accessibility

7. **Call to Action** (50-75 words)
   - Clear next steps
   - Phone number: ${location.phone}
   - Booking encouragement

### FAQ Section (5-7 questions)
Location-specific FAQs such as:
- "Where is your ${city} office located?"
- "What are your hours in ${city}?"
- "Do you serve [nearby area]?"
- Service-specific questions with local context

### E-E-A-T Compliance
- Use hedging language ("may help", "studies suggest")
- Include "consult with your healthcare provider" recommendations
- Mention experience and expertise
- Avoid definitive medical claims

### Internal Linking Opportunities
Suggest 3-5 internal links to:
- Main service page: /treatments/${service.slug}
- Other location pages
- Related services
- Health library articles

### Schema Markup Requirements
Include LocalBusiness + MedicalBusiness schema elements:
- name, address, phone
- geo coordinates if available: ${location.latitude || 'N/A'}, ${location.longitude || 'N/A'}
- openingHours
- service offerings

## Output Format
Provide the content in a structured JSON format with:
{
  "metaTitle": "...",
  "metaDescription": "...",
  "h1": "...",
  "heroContent": "...",
  "sections": [
    { "heading": "...", "content": "..." }
  ],
  "faqs": [
    { "question": "...", "answer": "..." }
  ],
  "internalLinks": [
    { "text": "...", "url": "..." }
  ],
  "localBusinessSchema": { ... }
}

Remember: This page's primary goal is to rank for "${shortServiceName} in ${city}" and convert visitors into patients. Make the content genuinely helpful while optimizing for local search.`;
}

/**
 * Parse the AI response into structured content
 */
export function parseLocalSeoPageResponse(response: string): GeneratedContent {
  try {
    // Try to parse as JSON
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        metaTitle: parsed.metaTitle || '',
        metaDescription: parsed.metaDescription || '',
        h1: parsed.h1 || '',
        content: parsed.sections
          ? parsed.sections.map((s: { heading: string; content: string }) =>
              `## ${s.heading}\n\n${s.content}`
            ).join('\n\n')
          : parsed.heroContent || '',
        faqs: parsed.faqs || [],
        internalLinks: parsed.internalLinks || [],
      };
    }
  } catch {
    // If JSON parsing fails, return the raw content
  }

  return {
    metaTitle: '',
    metaDescription: '',
    content: response,
  };
}

export default generateLocalSeoPagePrompt;

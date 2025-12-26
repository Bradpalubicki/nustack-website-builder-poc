/**
 * FAQ Generator Prompt Template
 *
 * Generates FAQ content for any page type with proper medical compliance.
 */

import type { FaqParams } from './types';

/**
 * FAQ item structure
 */
export interface FAQItem {
  question: string;
  answer: string;
}

/**
 * Generate a prompt for creating FAQs
 */
export function generateFaqPrompt(params: FaqParams): string {
  const { topic, pageType, existingFaqs = [], count = 7, targetKeywords = [] } = params;

  return `You are an expert healthcare content writer. Generate ${count} frequently asked questions and answers about "${topic}" for a ${pageType} page.

## Requirements

### Question Guidelines
- Use natural question phrasing (how, what, why, when, who)
- Include variations of target keywords where appropriate
- Address genuine patient concerns
- Cover both basic and advanced questions
- Optimize for voice search

### Answer Guidelines
- Keep answers concise (50-150 words each)
- Use E-E-A-T compliant language
- Include hedging phrases ("typically", "in most cases", "may")
- Recommend consulting a healthcare provider when appropriate
- Be genuinely helpful, not promotional

### Target Keywords to Include Naturally
${targetKeywords.length > 0 ? targetKeywords.map((k) => `- ${k}`).join('\n') : '- (general topic keywords)'}

### Questions to Avoid (Already Covered)
${existingFaqs.length > 0 ? existingFaqs.map((q) => `- ${q}`).join('\n') : 'None - all topics available'}

### Question Categories to Cover
1. **Basic Understanding** (1-2 questions)
   - What is [topic]?
   - How does [treatment] work?

2. **Candidacy/Eligibility** (1-2 questions)
   - Am I a candidate for [treatment]?
   - Who should consider [treatment]?

3. **Process/Experience** (1-2 questions)
   - What happens during [treatment]?
   - How long does [treatment] take?

4. **Results/Expectations** (1-2 questions)
   - When will I see results?
   - How long do results last?

5. **Safety/Side Effects** (1 question)
   - Is [treatment] safe?
   - What are the side effects?

6. **Practical Concerns** (1-2 questions)
   - How much does [treatment] cost?
   - Is [treatment] covered by insurance?

## Medical Compliance
- Never make absolute claims about outcomes
- Include disclaimers where appropriate
- Recommend professional consultation
- Avoid contraindicated advice

## Output Format
Return a JSON array of FAQ objects:

[
  {
    "question": "What is [topic]?",
    "answer": "Concise, helpful answer with proper medical hedging..."
  },
  {
    "question": "How does [treatment] work?",
    "answer": "..."
  }
]

Generate exactly ${count} high-quality FAQs now.`;
}

/**
 * Parse the AI response into FAQ items
 */
export function parseFaqResponse(response: string): FAQItem[] {
  try {
    // Try to find JSON array in response
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (item) =>
            typeof item === 'object' &&
            typeof item.question === 'string' &&
            typeof item.answer === 'string'
        );
      }
    }
  } catch {
    // Parsing failed, try to extract manually
  }

  // Fallback: try to parse Q&A format
  const faqs: FAQItem[] = [];
  const qaPairs = response.split(/(?:^|\n)(?:Q:|Question:|\d+\.)/i);

  for (const pair of qaPairs) {
    const parts = pair.split(/(?:\n)(?:A:|Answer:)/i);
    if (parts.length >= 2) {
      const question = parts[0].trim().replace(/^\*+|\*+$/g, '').trim();
      const answer = parts[1].trim().replace(/^\*+|\*+$/g, '').trim();
      if (question && answer) {
        faqs.push({ question, answer });
      }
    }
  }

  return faqs;
}

export default generateFaqPrompt;

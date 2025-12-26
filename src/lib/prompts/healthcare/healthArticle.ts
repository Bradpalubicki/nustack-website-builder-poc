/**
 * Health Article Prompt Template
 *
 * Generates E-E-A-T compliant health content for the health library.
 */

import type { HealthArticleParams, GeneratedContent } from './types';

/**
 * Generate a prompt for creating health article content
 */
export function generateHealthArticlePrompt(params: HealthArticleParams): string {
  const {
    topic,
    targetKeywords,
    articleType,
    wordCount,
    businessInfo,
    medicalReviewer,
    existingArticles = [],
  } = params;

  const articleTypeGuidelines: Record<string, string> = {
    educational: `
    - Focus on explaining concepts clearly
    - Use analogies and examples
    - Build from basic to advanced understanding
    - Include "Key Takeaways" section`,
    condition: `
    - Start with symptoms and causes
    - Explain who is affected
    - Discuss risk factors
    - Cover treatment options available
    - Include when to see a doctor`,
    treatment: `
    - Explain how the treatment works
    - Cover benefits and potential risks
    - Discuss candidacy criteria
    - Include recovery expectations
    - Mention alternative options`,
    comparison: `
    - Present both options objectively
    - Use comparison tables
    - Discuss pros and cons of each
    - Help readers determine which is right for them
    - Avoid bias toward either option`,
    guide: `
    - Provide step-by-step information
    - Include practical tips
    - Cover common questions
    - Offer actionable advice
    - Include checklists where appropriate`,
  };

  return `You are an expert medical content writer creating E-E-A-T compliant health content. Generate a comprehensive, authoritative article that will rank well and provide genuine value to readers.

## Article Details
- Topic: ${topic}
- Type: ${articleType} article
- Target Word Count: ${wordCount} words
- Business: ${businessInfo.name}
${medicalReviewer ? `- Medical Reviewer: ${medicalReviewer.name}, ${medicalReviewer.credentials}` : ''}

## Target Keywords
Primary: ${targetKeywords[0]}
Secondary: ${targetKeywords.slice(1).join(', ')}

## Existing Articles to Avoid Duplicating
${existingArticles.length > 0 ? existingArticles.map((a) => `- ${a}`).join('\n') : 'None'}

## Article Type Guidelines
${articleTypeGuidelines[articleType] || articleTypeGuidelines.educational}

## E-E-A-T Requirements (Critical for YMYL Content)

### Experience
- Include first-person perspective where appropriate ("In our experience...")
- Reference real patient scenarios (anonymized)
- Discuss practical applications

### Expertise
- Demonstrate deep knowledge of the subject
- Use proper medical terminology with explanations
- Reference current medical understanding

### Authoritativeness
- Cite authoritative sources (NIH, Mayo Clinic, peer-reviewed journals)
- Include statistics and research findings
- Reference professional guidelines

### Trustworthiness
- Use hedging language ("may help", "studies suggest", "in many cases")
- Include medical disclaimers
- Recommend consulting healthcare providers
- Avoid definitive claims about outcomes

## Content Structure

### 1. SEO Title (50-60 characters)
- Include primary keyword
- Make it compelling and clickable
- Format for search intent

### 2. Meta Description (150-160 characters)
- Summarize the article value
- Include primary keyword naturally
- End with implicit call-to-action

### 3. Introduction (100-150 words)
- Hook the reader with relatable opening
- Establish the problem or question
- Preview what they'll learn
- Include primary keyword in first paragraph

### 4. Main Content Sections
Use H2 and H3 headings with keywords where natural
${articleType === 'comparison' ? '- Include comparison table' : ''}
${articleType === 'guide' ? '- Include numbered steps or checklist' : ''}

### 5. FAQ Section (5-7 questions)
- Use question format for voice search optimization
- Provide concise, authoritative answers
- Include variations of target keywords
- Address common patient concerns

### 6. Conclusion (100-150 words)
- Summarize key points
- Reinforce expertise
- Include call-to-action
- Mention ${businessInfo.name} as a resource

## Citation Requirements
Include 5-8 citations from authoritative sources:
- NIH/PubMed (preferred)
- Mayo Clinic
- Cleveland Clinic
- Johns Hopkins Medicine
- Professional medical associations
- Peer-reviewed journals

Format citations with:
- Title
- Source name
- URL
- Access date (today's date)

## Medical Disclaimer
Include at the end:
"This information is provided for educational purposes only and is not intended as medical advice. Always consult with a qualified healthcare provider before starting any treatment."

## Internal Linking
Suggest 3-5 internal links to:
- Related treatment pages on ${businessInfo.name}'s website
- Other relevant health library articles
- Location pages where services are available

## Output Format
{
  "title": "SEO-optimized title",
  "metaTitle": "50-60 char title for search",
  "metaDescription": "150-160 char description",
  "slug": "url-friendly-slug",
  "excerpt": "2-3 sentence summary",
  "content": "Full markdown content with H2/H3 headings",
  "faqs": [
    { "question": "...", "answer": "..." }
  ],
  "suggestedCitations": [
    { "title": "...", "source": "...", "url": "..." }
  ],
  "internalLinks": [
    { "text": "...", "url": "..." }
  ],
  "tags": ["keyword1", "keyword2"],
  "category": "conditions|treatments|wellness|news"
}

## Quality Checklist
Before finalizing, ensure:
- [ ] Primary keyword appears in title, H1, first paragraph, and throughout naturally
- [ ] Content is genuinely helpful and comprehensive
- [ ] Medical claims are properly hedged
- [ ] Sources are authoritative and cited
- [ ] Reading level is appropriate (aim for 8th-10th grade)
- [ ] Paragraphs are scannable (2-4 sentences each)
- [ ] All sections flow logically

Write the article now, targeting ${wordCount} words of substantive, helpful content.`;
}

/**
 * Parse the AI response into structured content
 */
export function parseHealthArticleResponse(response: string): GeneratedContent {
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        title: parsed.title,
        metaTitle: parsed.metaTitle || parsed.title || '',
        metaDescription: parsed.metaDescription || parsed.excerpt || '',
        content: parsed.content || '',
        faqs: parsed.faqs || [],
        suggestedCitations: parsed.suggestedCitations || [],
        internalLinks: parsed.internalLinks || [],
      };
    }
  } catch {
    // Parsing failed
  }

  return {
    metaTitle: '',
    metaDescription: '',
    content: response,
  };
}

export default generateHealthArticlePrompt;

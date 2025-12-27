/**
 * Claude AI Client
 *
 * Handles communication with the Anthropic Claude API.
 */

import Anthropic from '@anthropic-ai/sdk';

// Initialize the Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export type MessageRole = 'user' | 'assistant';

export interface Message {
  role: MessageRole;
  content: string;
}

export interface ChatOptions {
  model?: string;
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
}

const DEFAULT_MODEL = process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514';
const DEFAULT_MAX_TOKENS = parseInt(process.env.CLAUDE_MAX_TOKENS || '4096', 10);

/**
 * Send a message to Claude and get a response
 */
export async function sendMessage(
  messages: Message[],
  options: ChatOptions = {}
): Promise<string> {
  const {
    model = DEFAULT_MODEL,
    maxTokens = DEFAULT_MAX_TOKENS,
    temperature = 0.7,
    systemPrompt,
  } = options;

  try {
    const response = await anthropic.messages.create({
      model,
      max_tokens: maxTokens,
      temperature,
      system: systemPrompt,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    // Extract text from response
    const textBlock = response.content.find((block) => block.type === 'text');
    return textBlock?.type === 'text' ? textBlock.text : '';
  } catch (error) {
    console.error('Claude API error:', error);
    throw error;
  }
}

/**
 * Stream a message response from Claude
 */
export async function* streamMessage(
  messages: Message[],
  options: ChatOptions = {}
): AsyncGenerator<string> {
  const {
    model = DEFAULT_MODEL,
    maxTokens = DEFAULT_MAX_TOKENS,
    temperature = 0.7,
    systemPrompt,
  } = options;

  const stream = await anthropic.messages.stream({
    model,
    max_tokens: maxTokens,
    temperature,
    system: systemPrompt,
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  });

  for await (const event of stream) {
    if (
      event.type === 'content_block_delta' &&
      event.delta.type === 'text_delta'
    ) {
      yield event.delta.text;
    }
  }
}

/**
 * Get a simple completion from Claude
 */
export async function getCompletion(
  prompt: string,
  options: ChatOptions = {}
): Promise<string> {
  return sendMessage([{ role: 'user', content: prompt }], options);
}

/**
 * Builder-specific system prompt
 */
export const BUILDER_SYSTEM_PROMPT = `You are an expert web developer assistant helping users build websites. You can:

1. Generate HTML, CSS, and JavaScript code
2. Create React components with Tailwind CSS
3. Provide design suggestions and best practices
4. Help with SEO optimization
5. Assist with responsive design

When generating code:
- Use modern, clean code practices
- Include helpful comments
- Make code accessible (WCAG compliant)
- Use semantic HTML
- Optimize for performance

When discussing changes:
- Be specific about what files to modify
- Explain the reasoning behind suggestions
- Offer alternatives when appropriate

Always be helpful, concise, and focused on delivering working solutions.`;

/**
 * Healthcare-specific system prompt
 */
export const HEALTHCARE_SYSTEM_PROMPT = `You are an expert healthcare web developer assistant. You specialize in:

1. HIPAA-compliant website design
2. Medical practice websites
3. E-E-A-T compliant content creation
4. Healthcare SEO best practices
5. Medical schema.org structured data

When generating content:
- Always include appropriate medical disclaimers
- Cite authoritative sources
- Use patient-friendly language
- Follow healthcare industry compliance guidelines
- Ensure accessibility for all users

When generating code:
- Implement proper security measures
- Use healthcare-specific schema.org types
- Include required legal disclaimers
- Optimize for local SEO

Never provide actual medical advice. Always recommend consulting healthcare professionals.`;

export { anthropic };

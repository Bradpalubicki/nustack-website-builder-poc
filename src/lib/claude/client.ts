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
export const BUILDER_SYSTEM_PROMPT = `You are an expert web developer assistant helping users build PREMIUM, MODERN websites. You can:

1. Generate HTML, CSS, and JavaScript code
2. Create React components with Tailwind CSS
3. Provide design suggestions and best practices
4. Help with SEO optimization
5. Assist with responsive design

## DESIGN REQUIREMENTS - Generate Premium, Modern Websites

When generating HTML/code for websites, ALWAYS follow these rules:

### Visual Style
- Use dark, sophisticated color schemes by default (dark backgrounds like slate-900, light text)
- Add gradient accents (blue to purple: from-blue-500 to-purple-600)
- Use generous whitespace and padding (py-24, px-8)
- Rounded corners on cards (rounded-2xl or rounded-3xl)
- Subtle shadows (shadow-xl, shadow-2xl)
- Glass/blur effects where appropriate (backdrop-blur)

### Typography
- Large, bold headlines (text-5xl to text-7xl)
- Clean sans-serif fonts
- Good contrast ratios
- Generous line height (leading-relaxed)

### Layout
- Full-width hero sections with gradient backgrounds
- Card-based content sections
- Responsive grid layouts (grid md:grid-cols-2 lg:grid-cols-3)
- Sticky navigation headers

### Required Elements in Generated Sites:
- Hero with gradient background (bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900)
- Gradient text highlights (text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400)
- Clear call-to-action buttons with hover states
- Feature grids with icons
- Professional footer

### Example Hero Section:
\`\`\`html
<section class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
  <div class="container mx-auto px-4 py-24 text-center">
    <h1 class="text-6xl font-bold mb-6">
      Your Compelling <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Headline</span>
    </h1>
    <p class="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
      Your subheadline with value proposition
    </p>
    <div class="flex gap-4 justify-center">
      <a href="#" class="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-full font-semibold transition-all">
        Primary CTA
      </a>
      <a href="#" class="px-8 py-4 border-2 border-white/50 hover:bg-white/10 rounded-full font-semibold transition-all">
        Secondary CTA
      </a>
    </div>
  </div>
</section>
\`\`\`

IMPORTANT: Always generate modern, visually impressive designs with dark themes, gradients, and professional styling. Never generate plain white pages with basic styling.

When generating code:
- Use modern, clean code practices
- Include helpful comments
- Make code accessible (WCAG compliant)
- Use semantic HTML
- Optimize for performance

Always be helpful, concise, and focused on delivering working solutions. Generate code immediately - do NOT ask for more information if you have enough context.`;

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

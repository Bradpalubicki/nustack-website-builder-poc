/**
 * Context-Aware System Prompt Builder
 *
 * Builds comprehensive prompts based on project context, industry, and analysis data.
 */

import { getIndustryContext, type IndustryData } from './knowledge-base';
import {
  getDesignContext,
  sectionTemplates,
  designRules,
} from './design-standards';

export interface ProjectContext {
  projectName: string;
  businessName?: string;
  industry: string;
  location?: string;
  phone?: string;
  email?: string;
  services?: string[];
  features?: string[];
  existingWebsiteUrl?: string;
  analysisData?: {
    title?: string;
    description?: string;
    issues?: string[];
    strengths?: string[];
    hasBooking?: boolean;
    hasForms?: boolean;
    hasReviews?: boolean;
    socialLinks?: string[];
    currentDesignScore?: number;
    seoScore?: number;
    mobileScore?: number;
  };
  customInstructions?: string;
}

/**
 * Build initial AI message based on project context
 */
export function buildInitialMessage(context: ProjectContext): string {
  const industry = getIndustryContext(context.industry);
  const hasExistingSite = !!context.existingWebsiteUrl;
  const hasIssues = context.analysisData?.issues?.length;

  let message = '';

  if (hasExistingSite && context.analysisData) {
    // We analyzed their existing site
    message = `Great news! I've analyzed ${context.businessName || 'your website'} and I'm ready to build you a premium new site.\n\n`;

    // Show what we found
    if (context.analysisData.strengths?.length) {
      message += `**What's working well:**\n`;
      context.analysisData.strengths.slice(0, 3).forEach((strength) => {
        message += `✓ ${strength}\n`;
      });
      message += '\n';
    }

    // Show issues we'll fix
    if (hasIssues) {
      message += `**What I'll improve:**\n`;
      context.analysisData.issues!.slice(0, 5).forEach((issue) => {
        message += `• ${issue}\n`;
      });
      message += '\n';
    }

    // Recommend features based on industry
    message += `**Recommended features for ${industry.name}:**\n`;
    industry.requiredFeatures.forEach((feature) => {
      const hasIt = context.features?.includes(feature);
      message += hasIt ? `✓ ${formatFeature(feature)} (keeping)\n` : `+ ${formatFeature(feature)} (adding)\n`;
    });
    message += '\n';

    message += `I'll create a modern, high-converting website with:\n`;
    message += `• Dark, premium design with gradient accents\n`;
    message += `• Mobile-optimized responsive layout\n`;
    message += `• Strong calls-to-action for ${industry.primaryGoals[0].toLowerCase()}\n`;
    message += `• SEO-optimized structure\n\n`;

    message += `**Ready to start building?** Just say "build" and I'll generate your new site!`;
  } else {
    // New project without existing site
    message = `I'm ready to build a premium ${industry.name.toLowerCase()} website for ${context.businessName || 'you'}!\n\n`;

    message += `Based on your industry, I'll include:\n`;
    industry.requiredFeatures.forEach((feature) => {
      message += `• ${formatFeature(feature)}\n`;
    });
    message += '\n';

    message += `**Key features I'll build:**\n`;
    message += `• Modern dark theme with gradient accents\n`;
    message += `• Mobile-first responsive design\n`;
    message += `• Clear "${industry.effectiveCTAs[0]}" call-to-action\n`;
    message += `• ${industry.trustElements[0]} section\n\n`;

    if (context.services?.length) {
      message += `I'll feature your services: ${context.services.slice(0, 4).join(', ')}${context.services.length > 4 ? '...' : ''}\n\n`;
    }

    message += `**Ready?** Say "build" to generate your website, or tell me any specific requirements!`;
  }

  return message;
}

/**
 * Build comprehensive system prompt for website generation
 */
export function buildSystemPrompt(context: ProjectContext): string {
  const industry = getIndustryContext(context.industry);
  const design = getDesignContext(context.industry);

  let prompt = `You are an expert website builder AI creating a premium, high-converting website.

## PROJECT CONTEXT
- Business Name: ${context.businessName || 'Not specified'}
- Industry: ${industry.name}
- Location: ${context.location || 'Not specified'}
- Contact: ${context.phone || 'Not specified'} | ${context.email || 'Not specified'}

## INDUSTRY KNOWLEDGE
${getIndustryKnowledgeSection(industry)}

## DESIGN REQUIREMENTS
${getDesignRequirementsSection(design, context.industry)}

## CONTENT GUIDELINES
${getContentGuidelinesSection(industry, context)}

## CODE REQUIREMENTS
- Generate clean, semantic HTML with Tailwind CSS classes
- Ensure WCAG 2.1 accessibility compliance
- Optimize for Core Web Vitals
- Use proper heading hierarchy (h1 → h2 → h3)
- Include alt text for all images
- Make all interactive elements keyboard accessible

## SECTION TEMPLATES
When generating sections, use these proven patterns:

### Hero Section
${sectionTemplates.hero.structure}

### Features Section
${sectionTemplates.features.structure}

## OUTPUT FORMAT
When asked to "build" or generate a website:
1. Generate complete HTML/Tailwind code for each section
2. Include all necessary sections: Hero, Features/Services, About, Testimonials, CTA, Footer
3. Use placeholder images from /placeholder-hero.jpg, /placeholder-feature.jpg, etc.
4. Include proper navigation with smooth scroll anchors
5. Wrap everything in a proper HTML structure

IMPORTANT:
- ALWAYS generate premium, dark-themed websites
- NEVER ask unnecessary questions - use industry knowledge to fill gaps
- NEVER generate basic/plain websites
- Start generating immediately when user says "build"
`;

  // Add custom instructions if provided
  if (context.customInstructions) {
    prompt += `\n## CUSTOM REQUIREMENTS\n${context.customInstructions}\n`;
  }

  // Add analysis data if available
  if (context.analysisData) {
    prompt += `\n## EXISTING SITE ANALYSIS
${getAnalysisSection(context.analysisData)}
`;
  }

  return prompt;
}

/**
 * Build a focused prompt for specific tasks
 */
export function buildTaskPrompt(
  task: 'hero' | 'services' | 'about' | 'testimonials' | 'contact' | 'footer',
  context: ProjectContext
): string {
  const industry = getIndustryContext(context.industry);
  const design = getDesignContext(context.industry);

  const taskPrompts = {
    hero: `Generate a stunning hero section for ${context.businessName || industry.name}.
Use: ${industry.effectiveCTAs[0]} as primary CTA
Highlight: ${industry.primaryGoals[0]}
Style: ${design.adjustments.mood}
Include: Badge with status indicator, gradient headline, two CTA buttons`,

    services: `Generate a services section showcasing:
${context.services?.map((s) => `- ${s}`).join('\n') || industry.commonServices.slice(0, 6).map((s) => `- ${s}`).join('\n')}
Style: Card grid with hover effects
Include: Icons, brief descriptions, gradient accents`,

    about: `Generate an about section for ${context.businessName}.
Highlight: ${industry.trustElements.slice(0, 3).join(', ')}
Tone: ${design.adjustments.mood}
Include: Years in business, team info, mission statement`,

    testimonials: `Generate a testimonials section.
Include: 3-4 testimonials appropriate for ${industry.name}
Style: Card layout with star ratings and avatars
Focus: ${industry.primaryGoals[0]} outcomes`,

    contact: `Generate a contact section.
Business: ${context.businessName}
Phone: ${context.phone || '[Phone Number]'}
Email: ${context.email || '[Email Address]'}
Location: ${context.location || '[Location]'}
Include: Contact form, map placeholder, business hours`,

    footer: `Generate a footer for ${context.businessName}.
Include: Logo, quick links, contact info, social links
Style: Dark with subtle borders
Legal: Copyright ${new Date().getFullYear()}`,
  };

  return `${taskPrompts[task]}

Use these Tailwind classes for consistency:
- Buttons: ${design.components.button.primary}
- Cards: ${design.components.card.default}
- Inputs: ${design.components.input.default}

Follow the design rules:
${designRules.dos.slice(0, 5).map((rule) => `✓ ${rule}`).join('\n')}

Generate the code immediately without asking questions.`;
}

// Helper functions

function formatFeature(feature: string): string {
  const featureLabels: Record<string, string> = {
    'booking': 'Online Booking System',
    'location': 'Location & Hours',
    'reviews': 'Customer Reviews',
    'insurance-info': 'Insurance Information',
    'patient-portal': 'Patient Portal',
    'menu': 'Interactive Menu',
    'online-ordering': 'Online Ordering',
    'reservations': 'Table Reservations',
    'hours': 'Business Hours',
    'contact-form': 'Contact Form',
    'free-consultation-cta': 'Free Consultation CTA',
    'practice-areas': 'Practice Areas',
    'attorney-bios': 'Attorney Profiles',
    'click-to-call': 'Click-to-Call Button',
    'quote-form': 'Quote Request Form',
    'service-areas': 'Service Areas',
    'emergency-number': 'Emergency Contact',
    'property-listings': 'Property Listings',
    'market-reports': 'Market Reports',
    'agent-bio': 'Agent Profile',
    'service-menu': 'Service Menu & Pricing',
    'gallery': 'Photo Gallery',
    'about': 'About Section',
    'services': 'Services Overview',
  };
  return featureLabels[feature] || feature.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
}

function getIndustryKnowledgeSection(industry: IndustryData): string {
  return `
Target Audience: ${industry.targetAudience}
Primary Goals: ${industry.primaryGoals.join(', ')}
Trust Elements to Include: ${industry.trustElements.join(', ')}
Effective CTAs: ${industry.effectiveCTAs.join(' | ')}
SEO Focus Keywords: ${industry.seoKeywords.join(', ')}
Schema Types: ${industry.schemaTypes.join(', ')}
`;
}

function getDesignRequirementsSection(
  design: ReturnType<typeof getDesignContext>,
  industry: string
): string {
  return `
Color Scheme: ${design.adjustments.colorScheme}
Accent Gradient: ${design.adjustments.accentGradient}
Overall Mood: ${design.adjustments.mood}
Special Elements: ${design.adjustments.specialElements.join(', ')}

DO:
${designRules.dos.map((rule) => `• ${rule}`).join('\n')}

DON'T:
${designRules.donts.map((rule) => `• ${rule}`).join('\n')}
`;
}

function getContentGuidelinesSection(
  industry: IndustryData,
  context: ProjectContext
): string {
  const services = context.services?.length
    ? context.services
    : industry.commonServices.slice(0, 6);

  return `
Services to Feature:
${services.map((s) => `• ${s}`).join('\n')}

Trust Elements:
${industry.trustElements.map((t) => `• ${t}`).join('\n')}

Calls-to-Action:
Primary: ${industry.effectiveCTAs[0]}
Secondary: ${industry.effectiveCTAs[1] || 'Learn More'}

Tone: Professional, ${industry.name === 'Restaurant' ? 'appetizing' : 'trustworthy'}, welcoming
`;
}

function getAnalysisSection(analysis: ProjectContext['analysisData']): string {
  if (!analysis) return '';

  let section = '';

  if (analysis.issues?.length) {
    section += `Issues to Fix:\n${analysis.issues.map((i) => `- ${i}`).join('\n')}\n\n`;
  }

  if (analysis.strengths?.length) {
    section += `Strengths to Keep:\n${analysis.strengths.map((s) => `+ ${s}`).join('\n')}\n\n`;
  }

  section += `Current Scores:\n`;
  section += `- Design: ${analysis.currentDesignScore ?? 'Unknown'}/100\n`;
  section += `- SEO: ${analysis.seoScore ?? 'Unknown'}/100\n`;
  section += `- Mobile: ${analysis.mobileScore ?? 'Unknown'}/100\n`;

  return section;
}

/**
 * Generate smart follow-up based on conversation context
 */
export function generateSmartResponse(
  userMessage: string,
  context: ProjectContext
): { shouldGenerate: boolean; prompt?: string } {
  const lowerMessage = userMessage.toLowerCase();

  // Trigger words for immediate generation
  const buildTriggers = [
    'build',
    'generate',
    'create',
    'start',
    'make',
    'go',
    "let's do it",
    'ready',
    'yes',
  ];

  if (buildTriggers.some((trigger) => lowerMessage.includes(trigger))) {
    return {
      shouldGenerate: true,
      prompt: buildSystemPrompt(context),
    };
  }

  // Section-specific requests
  const sectionMatches: Record<string, Parameters<typeof buildTaskPrompt>[0]> = {
    'hero': 'hero',
    'header': 'hero',
    'service': 'services',
    'about': 'about',
    'testimonial': 'testimonials',
    'review': 'testimonials',
    'contact': 'contact',
    'footer': 'footer',
  };

  for (const [keyword, section] of Object.entries(sectionMatches)) {
    if (lowerMessage.includes(keyword)) {
      return {
        shouldGenerate: true,
        prompt: buildTaskPrompt(section, context),
      };
    }
  }

  return { shouldGenerate: false };
}

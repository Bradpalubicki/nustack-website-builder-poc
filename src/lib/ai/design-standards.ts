/**
 * Design Standards for AI Website Generation
 *
 * These standards ensure all AI-generated websites are premium quality.
 */

export interface ColorPalette {
  primary: string;
  primaryHover: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
}

export interface TypographyScale {
  hero: string;
  h1: string;
  h2: string;
  h3: string;
  body: string;
  small: string;
}

export interface SpacingScale {
  section: string;
  container: string;
  cardPadding: string;
  gap: string;
}

export interface DesignSystem {
  name: string;
  description: string;
  colors: {
    light: ColorPalette;
    dark: ColorPalette;
  };
  typography: TypographyScale;
  spacing: SpacingScale;
  borderRadius: string;
  shadows: string[];
  gradients: string[];
}

/**
 * Premium Dark Theme (Default)
 */
export const premiumDarkTheme: DesignSystem = {
  name: 'Premium Dark',
  description: 'Sophisticated dark theme with gradient accents',
  colors: {
    light: {
      primary: '#3B82F6',
      primaryHover: '#2563EB',
      accent: '#8B5CF6',
      background: '#FFFFFF',
      surface: '#F8FAFC',
      text: '#0F172A',
      textMuted: '#64748B',
      border: '#E2E8F0',
    },
    dark: {
      primary: '#3B82F6',
      primaryHover: '#60A5FA',
      accent: '#A78BFA',
      background: '#0F172A',
      surface: '#1E293B',
      text: '#F8FAFC',
      textMuted: '#94A3B8',
      border: '#334155',
    },
  },
  typography: {
    hero: 'text-5xl md:text-6xl lg:text-7xl font-bold',
    h1: 'text-4xl md:text-5xl font-bold',
    h2: 'text-3xl md:text-4xl font-bold',
    h3: 'text-xl md:text-2xl font-semibold',
    body: 'text-base md:text-lg',
    small: 'text-sm',
  },
  spacing: {
    section: 'py-20 md:py-32',
    container: 'container mx-auto px-4 md:px-6',
    cardPadding: 'p-6 md:p-8',
    gap: 'gap-6 md:gap-8',
  },
  borderRadius: 'rounded-2xl',
  shadows: ['shadow-lg', 'shadow-xl', 'shadow-2xl'],
  gradients: [
    'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
    'bg-gradient-to-r from-blue-500 to-purple-600',
    'bg-gradient-to-r from-blue-400 to-purple-400',
  ],
};

/**
 * Section Templates
 */
export const sectionTemplates = {
  hero: {
    structure: `
<section class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
  <!-- Background decoration -->
  <div class="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
  <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-purple-500/30 rounded-full blur-[120px]"></div>

  <div class="container mx-auto px-4 py-24 md:py-32 relative z-10">
    <div class="max-w-4xl mx-auto text-center">
      <div class="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-sm mb-8">
        <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
        {{BADGE_TEXT}}
      </div>

      <h1 class="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
        {{HEADLINE_PART1}} <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">{{HEADLINE_HIGHLIGHT}}</span>
      </h1>

      <p class="text-xl md:text-2xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
        {{SUBHEADLINE}}
      </p>

      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="{{CTA_PRIMARY_LINK}}" class="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-full font-semibold text-lg transition-all transform hover:scale-105 shadow-lg shadow-purple-500/25">
          {{CTA_PRIMARY_TEXT}}
        </a>
        <a href="{{CTA_SECONDARY_LINK}}" class="px-8 py-4 border-2 border-white/30 hover:bg-white/10 rounded-full font-semibold text-lg transition-all">
          {{CTA_SECONDARY_TEXT}}
        </a>
      </div>
    </div>
  </div>
</section>`,
    variables: [
      'BADGE_TEXT',
      'HEADLINE_PART1',
      'HEADLINE_HIGHLIGHT',
      'SUBHEADLINE',
      'CTA_PRIMARY_TEXT',
      'CTA_PRIMARY_LINK',
      'CTA_SECONDARY_TEXT',
      'CTA_SECONDARY_LINK',
    ],
  },

  features: {
    structure: `
<section class="py-24 bg-slate-900 text-white">
  <div class="container mx-auto px-4">
    <div class="text-center mb-16">
      <h2 class="text-4xl md:text-5xl font-bold mb-4">
        {{SECTION_TITLE}}
      </h2>
      <p class="text-xl text-slate-400 max-w-2xl mx-auto">
        {{SECTION_SUBTITLE}}
      </p>
    </div>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {{FEATURE_CARDS}}
    </div>
  </div>
</section>`,
    cardTemplate: `
<div class="group p-8 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-purple-500/50 transition-all hover:transform hover:-translate-y-1">
  <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
    {{ICON}}
  </div>
  <h3 class="text-xl font-semibold mb-3">{{TITLE}}</h3>
  <p class="text-slate-400">{{DESCRIPTION}}</p>
</div>`,
    variables: ['SECTION_TITLE', 'SECTION_SUBTITLE', 'FEATURE_CARDS'],
  },

  services: {
    structure: `
<section class="py-24 bg-gradient-to-b from-slate-900 to-slate-800 text-white">
  <div class="container mx-auto px-4">
    <div class="text-center mb-16">
      <span class="inline-block px-4 py-2 bg-purple-500/10 text-purple-400 rounded-full text-sm font-medium mb-4">
        {{SECTION_LABEL}}
      </span>
      <h2 class="text-4xl md:text-5xl font-bold mb-4">
        {{SECTION_TITLE}}
      </h2>
    </div>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {{SERVICE_CARDS}}
    </div>
  </div>
</section>`,
    cardTemplate: `
<div class="p-6 rounded-2xl bg-white/5 backdrop-blur border border-white/10 hover:border-white/20 transition-all">
  <h3 class="text-lg font-semibold mb-2">{{SERVICE_NAME}}</h3>
  <p class="text-slate-400 text-sm">{{SERVICE_DESCRIPTION}}</p>
</div>`,
    variables: ['SECTION_LABEL', 'SECTION_TITLE', 'SERVICE_CARDS'],
  },

  testimonials: {
    structure: `
<section class="py-24 bg-slate-800 text-white">
  <div class="container mx-auto px-4">
    <div class="text-center mb-16">
      <h2 class="text-4xl md:text-5xl font-bold mb-4">
        {{SECTION_TITLE}}
      </h2>
      <p class="text-xl text-slate-400">
        {{SECTION_SUBTITLE}}
      </p>
    </div>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {{TESTIMONIAL_CARDS}}
    </div>
  </div>
</section>`,
    cardTemplate: `
<div class="p-8 rounded-2xl bg-slate-700/50 border border-slate-600/50">
  <div class="flex gap-1 mb-4">
    {{STARS}}
  </div>
  <p class="text-slate-300 mb-6 italic">"{{QUOTE}}"</p>
  <div class="flex items-center gap-4">
    <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold">
      {{INITIALS}}
    </div>
    <div>
      <div class="font-semibold">{{NAME}}</div>
      <div class="text-sm text-slate-400">{{TITLE}}</div>
    </div>
  </div>
</div>`,
    variables: ['SECTION_TITLE', 'SECTION_SUBTITLE', 'TESTIMONIAL_CARDS'],
  },

  cta: {
    structure: `
<section class="py-24 bg-gradient-to-r from-blue-600 to-purple-600 text-white relative overflow-hidden">
  <div class="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
  <div class="container mx-auto px-4 relative z-10">
    <div class="max-w-3xl mx-auto text-center">
      <h2 class="text-4xl md:text-5xl font-bold mb-6">
        {{CTA_HEADLINE}}
      </h2>
      <p class="text-xl text-white/80 mb-10">
        {{CTA_SUBHEADLINE}}
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="{{CTA_PRIMARY_LINK}}" class="px-8 py-4 bg-white text-purple-600 hover:bg-slate-100 rounded-full font-semibold text-lg transition-all transform hover:scale-105">
          {{CTA_PRIMARY_TEXT}}
        </a>
        <a href="{{CTA_SECONDARY_LINK}}" class="px-8 py-4 border-2 border-white hover:bg-white/10 rounded-full font-semibold text-lg transition-all">
          {{CTA_SECONDARY_TEXT}}
        </a>
      </div>
    </div>
  </div>
</section>`,
    variables: [
      'CTA_HEADLINE',
      'CTA_SUBHEADLINE',
      'CTA_PRIMARY_TEXT',
      'CTA_PRIMARY_LINK',
      'CTA_SECONDARY_TEXT',
      'CTA_SECONDARY_LINK',
    ],
  },

  footer: {
    structure: `
<footer class="bg-slate-900 text-white py-16 border-t border-slate-800">
  <div class="container mx-auto px-4">
    <div class="grid md:grid-cols-4 gap-12 mb-12">
      <div class="md:col-span-2">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span class="font-bold text-lg">{{LOGO_INITIAL}}</span>
          </div>
          <span class="text-xl font-bold">{{BUSINESS_NAME}}</span>
        </div>
        <p class="text-slate-400 mb-6 max-w-sm">
          {{TAGLINE}}
        </p>
        <div class="flex gap-4">
          {{SOCIAL_LINKS}}
        </div>
      </div>

      <div>
        <h4 class="font-semibold mb-4">Quick Links</h4>
        <ul class="space-y-2 text-slate-400">
          {{NAV_LINKS}}
        </ul>
      </div>

      <div>
        <h4 class="font-semibold mb-4">Contact</h4>
        <ul class="space-y-2 text-slate-400">
          {{CONTACT_INFO}}
        </ul>
      </div>
    </div>

    <div class="pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
      <p>© {{YEAR}} {{BUSINESS_NAME}}. All rights reserved.</p>
    </div>
  </div>
</footer>`,
    variables: [
      'LOGO_INITIAL',
      'BUSINESS_NAME',
      'TAGLINE',
      'SOCIAL_LINKS',
      'NAV_LINKS',
      'CONTACT_INFO',
      'YEAR',
    ],
  },

  contact: {
    structure: `
<section class="py-24 bg-slate-900 text-white">
  <div class="container mx-auto px-4">
    <div class="grid lg:grid-cols-2 gap-16 items-center">
      <div>
        <span class="inline-block px-4 py-2 bg-purple-500/10 text-purple-400 rounded-full text-sm font-medium mb-4">
          {{SECTION_LABEL}}
        </span>
        <h2 class="text-4xl md:text-5xl font-bold mb-6">
          {{SECTION_TITLE}}
        </h2>
        <p class="text-xl text-slate-400 mb-8">
          {{SECTION_DESCRIPTION}}
        </p>

        <div class="space-y-6">
          {{CONTACT_ITEMS}}
        </div>
      </div>

      <div class="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-8">
        <form class="space-y-6">
          {{FORM_FIELDS}}
          <button type="submit" class="w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl font-semibold text-lg transition-all">
            {{SUBMIT_TEXT}}
          </button>
        </form>
      </div>
    </div>
  </div>
</section>`,
    variables: [
      'SECTION_LABEL',
      'SECTION_TITLE',
      'SECTION_DESCRIPTION',
      'CONTACT_ITEMS',
      'FORM_FIELDS',
      'SUBMIT_TEXT',
    ],
  },
};

/**
 * Component Classes
 */
export const componentClasses = {
  button: {
    primary:
      'px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg shadow-purple-500/25',
    secondary:
      'px-8 py-4 border-2 border-white/30 hover:bg-white/10 rounded-full font-semibold transition-all',
    ghost: 'px-6 py-3 hover:bg-white/5 rounded-lg font-medium transition-all',
  },
  card: {
    default:
      'p-8 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-purple-500/50 transition-all',
    glass:
      'p-8 rounded-2xl bg-white/5 backdrop-blur border border-white/10 hover:border-white/20 transition-all',
    elevated:
      'p-8 rounded-2xl bg-slate-800 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1',
  },
  input: {
    default:
      'w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all',
    textarea:
      'w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all min-h-[120px] resize-none',
  },
  badge: {
    default:
      'inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-sm',
    success:
      'inline-flex items-center gap-2 bg-green-500/10 text-green-400 px-4 py-2 rounded-full text-sm',
    warning:
      'inline-flex items-center gap-2 bg-yellow-500/10 text-yellow-400 px-4 py-2 rounded-full text-sm',
    error:
      'inline-flex items-center gap-2 bg-red-500/10 text-red-400 px-4 py-2 rounded-full text-sm',
  },
};

/**
 * Design Rules for AI
 */
export const designRules = {
  dos: [
    'Use dark backgrounds (slate-900, slate-800) as the primary base',
    'Add gradient accents (blue-500 to purple-600) for visual interest',
    'Use generous whitespace (py-24, gap-8, mb-6)',
    'Apply backdrop-blur for glass effects',
    'Use rounded corners (rounded-2xl, rounded-full for buttons)',
    'Add subtle hover animations (hover:scale-105, hover:-translate-y-1)',
    'Include shadow effects (shadow-xl, shadow-purple-500/25)',
    'Use gradient text for highlights (text-transparent bg-clip-text)',
    'Make CTAs prominent and actionable',
    'Ensure good contrast ratios for accessibility',
    'Use large, bold headlines (text-5xl to text-7xl)',
    'Add decorative elements (glows, grids, patterns)',
  ],
  donts: [
    'Never use plain white backgrounds',
    'Avoid flat, boring designs without gradients or depth',
    'Do not use tiny text or cramped spacing',
    'Avoid sharp corners on modern elements',
    'Never skip hover states on interactive elements',
    'Do not use low-contrast text',
    'Avoid cluttered layouts without visual hierarchy',
    'Never use outdated design patterns',
    'Do not forget mobile responsiveness',
    'Avoid generic, template-looking designs',
  ],
};

/**
 * Industry-specific design adjustments
 */
export const industryDesignAdjustments: Record<
  string,
  {
    colorScheme: string;
    accentGradient: string;
    mood: string;
    specialElements: string[];
  }
> = {
  dental: {
    colorScheme: 'Blues and teals for trust and cleanliness',
    accentGradient: 'from-blue-400 to-cyan-400',
    mood: 'Clean, professional, welcoming',
    specialElements: [
      'Before/after gallery',
      'Insurance badges',
      'Appointment booking',
      'Patient testimonials',
    ],
  },
  medical: {
    colorScheme: 'Blues and greens for trust and health',
    accentGradient: 'from-blue-400 to-emerald-400',
    mood: 'Professional, trustworthy, caring',
    specialElements: [
      'Doctor credentials',
      'Service descriptions',
      'Patient portal link',
      'HIPAA compliance note',
    ],
  },
  restaurant: {
    colorScheme: 'Warm colors (orange, red, gold) for appetite',
    accentGradient: 'from-orange-400 to-red-500',
    mood: 'Appetizing, inviting, vibrant',
    specialElements: [
      'Food photography',
      'Menu display',
      'Reservation form',
      'Hours/location',
    ],
  },
  legal: {
    colorScheme: 'Navy, gold for prestige and trust',
    accentGradient: 'from-blue-400 to-amber-400',
    mood: 'Professional, authoritative, trustworthy',
    specialElements: [
      'Practice areas',
      'Attorney profiles',
      'Case results',
      'Free consultation CTA',
    ],
  },
  homeServices: {
    colorScheme: 'Bold blues and oranges for reliability',
    accentGradient: 'from-blue-500 to-orange-500',
    mood: 'Reliable, professional, approachable',
    specialElements: [
      'Service areas',
      'Emergency contact',
      'Quote form',
      'License badges',
    ],
  },
  realEstate: {
    colorScheme: 'Sophisticated teals and golds',
    accentGradient: 'from-teal-400 to-amber-400',
    mood: 'Luxurious, trustworthy, professional',
    specialElements: [
      'Property listings',
      'Agent bio',
      'Market reports',
      'Search functionality',
    ],
  },
  beauty: {
    colorScheme: 'Elegant pinks and purples',
    accentGradient: 'from-pink-400 to-purple-500',
    mood: 'Elegant, luxurious, pampering',
    specialElements: [
      'Service menu',
      'Gallery',
      'Online booking',
      'Stylist profiles',
    ],
  },
  general: {
    colorScheme: 'Modern blues and purples',
    accentGradient: 'from-blue-400 to-purple-400',
    mood: 'Professional, modern, trustworthy',
    specialElements: [
      'Services overview',
      'About section',
      'Contact form',
      'Testimonials',
    ],
  },
};

/**
 * Get complete design context for an industry
 */
export function getDesignContext(industry: string): {
  theme: DesignSystem;
  adjustments: (typeof industryDesignAdjustments)[string];
  rules: typeof designRules;
  components: typeof componentClasses;
} {
  return {
    theme: premiumDarkTheme,
    adjustments:
      industryDesignAdjustments[industry] || industryDesignAdjustments.general,
    rules: designRules,
    components: componentClasses,
  };
}

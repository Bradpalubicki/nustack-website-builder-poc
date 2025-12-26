/**
 * Service Area Page Generator
 *
 * Generates optimized location/service area landing pages
 * for local SEO targeting specific cities, neighborhoods,
 * and service areas.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Service area definition
 */
export interface ServiceArea {
  /** City name */
  city: string;
  /** State/Province code */
  state: string;
  /** ZIP/Postal codes covered */
  zipCodes?: string[];
  /** Neighborhoods within the city */
  neighborhoods?: string[];
  /** County name */
  county?: string;
  /** Metro area name */
  metroArea?: string;
  /** Population (for prioritization) */
  population?: number;
  /** Distance from business (miles) */
  distanceFromBusiness?: number;
  /** Priority level */
  priority: 'primary' | 'secondary' | 'tertiary';
  /** Custom slug for URL */
  slug?: string;
}

/**
 * Service offered
 */
export interface Service {
  /** Service ID */
  id: string;
  /** Service name */
  name: string;
  /** Service description */
  description: string;
  /** Service category */
  category?: string;
  /** Keywords associated with service */
  keywords?: string[];
  /** Price range */
  priceRange?: {
    min: number;
    max: number;
    unit: 'flat' | 'hourly' | 'per_sqft';
  };
  /** Featured service */
  isFeatured?: boolean;
}

/**
 * Service area page configuration
 */
export interface ServiceAreaPageConfig {
  /** Business name */
  businessName: string;
  /** Business type/industry */
  industry: string;
  /** Service area */
  serviceArea: ServiceArea;
  /** Services offered */
  services: Service[];
  /** Primary phone number */
  phone: string;
  /** Business address */
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  /** Website URL */
  websiteUrl: string;
  /** Include FAQs */
  includeFAQ?: boolean;
  /** Include testimonials section */
  includeTestimonials?: boolean;
  /** Include map section */
  includeMap?: boolean;
  /** Custom content sections */
  customSections?: {
    heading: string;
    content: string;
  }[];
}

/**
 * Generated page content
 */
export interface GeneratedPage {
  /** Page URL slug */
  slug: string;
  /** Meta title */
  metaTitle: string;
  /** Meta description */
  metaDescription: string;
  /** H1 heading */
  h1: string;
  /** Introduction paragraph */
  intro: string;
  /** Main content sections */
  sections: {
    heading: string;
    content: string;
    type: 'text' | 'list' | 'table' | 'faq';
  }[];
  /** Schema.org markup */
  schema: object;
  /** Internal linking suggestions */
  internalLinks: {
    anchor: string;
    url: string;
    context: string;
  }[];
  /** Keywords targeted */
  targetKeywords: string[];
}

/**
 * Batch generation result
 */
export interface BatchGenerationResult {
  /** Successfully generated pages */
  pages: GeneratedPage[];
  /** Generation statistics */
  stats: {
    total: number;
    generated: number;
    skipped: number;
    errors: number;
  };
  /** Internal linking map */
  linkingStructure: Map<string, string[]>;
}

// ============================================================================
// URL AND SLUG GENERATION
// ============================================================================

/**
 * Generate URL-friendly slug from location
 */
export function generateLocationSlug(area: ServiceArea): string {
  if (area.slug) return area.slug;

  const citySlug = slugify(area.city);
  const stateSlug = area.state.toLowerCase();

  return `${citySlug}-${stateSlug}`;
}

/**
 * Generate service area page URL pattern
 */
export function generatePageUrl(
  area: ServiceArea,
  service?: Service,
  basePattern: string = '/service-areas/{location}'
): string {
  const locationSlug = generateLocationSlug(area);

  let url = basePattern.replace('{location}', locationSlug);

  if (service) {
    const serviceSlug = slugify(service.name);
    url = url.replace('{service}', serviceSlug);
    // If pattern doesn't have service, append it
    if (!basePattern.includes('{service}')) {
      url = `${url}/${serviceSlug}`;
    }
  }

  return url;
}

/**
 * Convert string to URL-friendly slug
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// ============================================================================
// CONTENT GENERATION
// ============================================================================

/**
 * Generate meta title for service area page
 */
export function generateMetaTitle(config: ServiceAreaPageConfig): string {
  const { businessName, serviceArea, services } = config;
  const primaryService = services.find((s) => s.isFeatured) || services[0];

  // Pattern: [Primary Service] in [City], [State] | [Business Name]
  return `${primaryService.name} in ${serviceArea.city}, ${serviceArea.state} | ${businessName}`;
}

/**
 * Generate meta description for service area page
 */
export function generateMetaDescription(config: ServiceAreaPageConfig): string {
  const { businessName, serviceArea, services, phone } = config;
  const serviceList = services.slice(0, 3).map((s) => s.name);

  // Keep under 160 characters
  const base = `Professional ${serviceList.join(', ')} in ${serviceArea.city}, ${serviceArea.state}. ${businessName} - Call ${phone} for a free estimate.`;

  return base.length <= 160 ? base : base.slice(0, 157) + '...';
}

/**
 * Generate H1 heading
 */
export function generateH1(config: ServiceAreaPageConfig): string {
  const { businessName, serviceArea, services, industry } = config;
  const primaryService = services.find((s) => s.isFeatured) || services[0];

  // Variations based on industry
  const patterns: Record<string, string> = {
    healthcare: `${primaryService.name} Services in ${serviceArea.city}, ${serviceArea.state}`,
    legal: `${serviceArea.city} ${primaryService.name} Attorney`,
    home_services: `${serviceArea.city} ${primaryService.name} Services`,
    default: `${primaryService.name} in ${serviceArea.city}, ${serviceArea.state}`,
  };

  const industryKey = Object.keys(patterns).find((k) =>
    industry.toLowerCase().includes(k)
  );

  return patterns[industryKey || 'default'];
}

/**
 * Generate introduction paragraph
 */
export function generateIntro(config: ServiceAreaPageConfig): string {
  const { businessName, serviceArea, services, industry } = config;
  const serviceNames = services.map((s) => s.name).join(', ');

  return `Looking for reliable ${serviceNames.toLowerCase()} in ${serviceArea.city}, ${serviceArea.state}? ${businessName} provides professional ${industry.toLowerCase()} services to residents and businesses throughout ${serviceArea.city}${serviceArea.neighborhoods?.length ? `, including ${serviceArea.neighborhoods.slice(0, 3).join(', ')}` : ''}. Our experienced team is committed to delivering exceptional results with every project.`;
}

/**
 * Generate services section content
 */
export function generateServicesSection(
  services: Service[],
  serviceArea: ServiceArea
): { heading: string; content: string; type: 'list' } {
  const listItems = services.map((service) => {
    let item = `**${service.name}**: ${service.description}`;
    if (service.priceRange) {
      const priceLabel =
        service.priceRange.unit === 'hourly'
          ? '/hour'
          : service.priceRange.unit === 'per_sqft'
            ? '/sq ft'
            : '';
      item += ` (Starting at $${service.priceRange.min}${priceLabel})`;
    }
    return item;
  });

  return {
    heading: `Our Services in ${serviceArea.city}`,
    content: listItems.join('\n'),
    type: 'list',
  };
}

/**
 * Generate neighborhoods section
 */
export function generateNeighborhoodsSection(
  serviceArea: ServiceArea,
  businessName: string
): { heading: string; content: string; type: 'text' } | null {
  if (!serviceArea.neighborhoods?.length) return null;

  const neighborhoodList = serviceArea.neighborhoods.join(', ');

  return {
    heading: `Areas We Serve in ${serviceArea.city}`,
    content: `${businessName} proudly serves all neighborhoods in ${serviceArea.city}, including: ${neighborhoodList}. Whether you're in the heart of downtown or in the surrounding suburbs, our team is ready to help with all your needs.`,
    type: 'text',
  };
}

/**
 * Generate why choose us section
 */
export function generateWhyChooseSection(
  config: ServiceAreaPageConfig
): { heading: string; content: string; type: 'list' } {
  const { businessName, serviceArea } = config;

  const reasons = [
    `**Local Expertise**: Deep knowledge of ${serviceArea.city} and surrounding areas`,
    '**Licensed & Insured**: Fully credentialed professionals you can trust',
    '**Fast Response**: Quick service when you need it most',
    '**Competitive Pricing**: Transparent pricing with no hidden fees',
    '**Satisfaction Guaranteed**: We stand behind our work 100%',
  ];

  return {
    heading: `Why Choose ${businessName} in ${serviceArea.city}?`,
    content: reasons.join('\n'),
    type: 'list',
  };
}

/**
 * Generate FAQ section
 */
export function generateFAQSection(
  config: ServiceAreaPageConfig
): { heading: string; content: string; type: 'faq' } {
  const { businessName, serviceArea, services, phone } = config;
  const primaryService = services[0];

  const faqs = [
    {
      q: `What ${primaryService.name.toLowerCase()} services do you offer in ${serviceArea.city}?`,
      a: `We offer comprehensive ${services.map((s) => s.name.toLowerCase()).join(', ')} services throughout ${serviceArea.city} and surrounding areas.`,
    },
    {
      q: `How quickly can you respond to service requests in ${serviceArea.city}?`,
      a: `We typically respond to ${serviceArea.city} service requests within 24-48 hours. For emergencies, call us directly at ${phone}.`,
    },
    {
      q: `Do you service all neighborhoods in ${serviceArea.city}?`,
      a: `Yes! ${businessName} serves all areas of ${serviceArea.city}${serviceArea.neighborhoods?.length ? `, including ${serviceArea.neighborhoods.slice(0, 3).join(', ')}` : ''}.`,
    },
    {
      q: `What are your rates for services in ${serviceArea.city}?`,
      a: `Our rates are competitive for the ${serviceArea.city} market. Contact us for a free estimate tailored to your specific needs.`,
    },
    {
      q: `Are you licensed and insured to work in ${serviceArea.state}?`,
      a: `Yes, ${businessName} is fully licensed and insured to provide services in ${serviceArea.state}.`,
    },
  ];

  const content = faqs
    .map((faq) => `### ${faq.q}\n${faq.a}`)
    .join('\n\n');

  return {
    heading: `Frequently Asked Questions About Our ${serviceArea.city} Services`,
    content,
    type: 'faq',
  };
}

// ============================================================================
// SCHEMA GENERATION
// ============================================================================

/**
 * Generate LocalBusiness schema for service area page
 */
export function generateLocalBusinessSchema(config: ServiceAreaPageConfig): object {
  const { businessName, address, phone, websiteUrl, serviceArea, services } = config;

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: businessName,
    description: generateMetaDescription(config),
    telephone: phone,
    url: websiteUrl,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address.street,
      addressLocality: address.city,
      addressRegion: address.state,
      postalCode: address.zip,
      addressCountry: 'US',
    },
    areaServed: {
      '@type': 'City',
      name: serviceArea.city,
      containedInPlace: {
        '@type': 'State',
        name: serviceArea.state,
      },
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Services',
      itemListElement: services.map((service, index) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service.name,
          description: service.description,
        },
        position: index + 1,
      })),
    },
  };
}

/**
 * Generate FAQPage schema
 */
export function generateFAQSchema(
  config: ServiceAreaPageConfig
): object {
  const faqSection = generateFAQSection(config);
  const faqPattern = /### (.+?)\n([\s\S]+?)(?=\n###|$)/g;
  const faqs: { question: string; answer: string }[] = [];

  let match;
  while ((match = faqPattern.exec(faqSection.content)) !== null) {
    faqs.push({
      question: match[1].trim(),
      answer: match[2].trim(),
    });
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// ============================================================================
// FULL PAGE GENERATION
// ============================================================================

/**
 * Generate complete service area page
 */
export function generateServiceAreaPage(config: ServiceAreaPageConfig): GeneratedPage {
  const { serviceArea, services } = config;

  const sections: GeneratedPage['sections'] = [];

  // Introduction is part of the main content, not a separate section
  const intro = generateIntro(config);

  // Services section
  sections.push(generateServicesSection(services, serviceArea));

  // Neighborhoods section (if applicable)
  const neighborhoodsSection = generateNeighborhoodsSection(
    serviceArea,
    config.businessName
  );
  if (neighborhoodsSection) {
    sections.push(neighborhoodsSection);
  }

  // Why choose us section
  sections.push(generateWhyChooseSection(config));

  // FAQ section (if enabled)
  if (config.includeFAQ !== false) {
    sections.push(generateFAQSection(config));
  }

  // Custom sections
  if (config.customSections) {
    config.customSections.forEach((section) => {
      sections.push({
        heading: section.heading,
        content: section.content,
        type: 'text',
      });
    });
  }

  // Generate target keywords
  const targetKeywords = generateTargetKeywords(config);

  // Generate internal linking suggestions
  const internalLinks = generateInternalLinkingSuggestions(config);

  // Combine schemas
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      generateLocalBusinessSchema(config),
      ...(config.includeFAQ !== false ? [generateFAQSchema(config)] : []),
    ],
  };

  return {
    slug: generateLocationSlug(serviceArea),
    metaTitle: generateMetaTitle(config),
    metaDescription: generateMetaDescription(config),
    h1: generateH1(config),
    intro,
    sections,
    schema,
    internalLinks,
    targetKeywords,
  };
}

/**
 * Generate target keywords for the page
 */
function generateTargetKeywords(config: ServiceAreaPageConfig): string[] {
  const { serviceArea, services, industry } = config;
  const keywords: string[] = [];

  // Location + service combinations
  services.forEach((service) => {
    keywords.push(`${service.name.toLowerCase()} ${serviceArea.city.toLowerCase()}`);
    keywords.push(
      `${serviceArea.city.toLowerCase()} ${service.name.toLowerCase()}`
    );
    keywords.push(
      `${service.name.toLowerCase()} in ${serviceArea.city.toLowerCase()} ${serviceArea.state.toLowerCase()}`
    );
  });

  // Industry + location
  keywords.push(`${industry.toLowerCase()} ${serviceArea.city.toLowerCase()}`);

  // Near me variations (for semantic targeting)
  services.forEach((service) => {
    keywords.push(`${service.name.toLowerCase()} near me`);
  });

  // Neighborhood-specific if available
  if (serviceArea.neighborhoods) {
    serviceArea.neighborhoods.slice(0, 3).forEach((neighborhood) => {
      keywords.push(
        `${services[0].name.toLowerCase()} ${neighborhood.toLowerCase()}`
      );
    });
  }

  return [...new Set(keywords)];
}

/**
 * Generate internal linking suggestions
 */
function generateInternalLinkingSuggestions(
  config: ServiceAreaPageConfig
): GeneratedPage['internalLinks'] {
  const { services, serviceArea } = config;
  const links: GeneratedPage['internalLinks'] = [];

  // Link to main service pages
  services.forEach((service) => {
    links.push({
      anchor: service.name,
      url: `/services/${slugify(service.name)}`,
      context: `Learn more about our ${service.name.toLowerCase()} services`,
    });
  });

  // Link to nearby service areas (placeholder - would need nearby areas data)
  links.push({
    anchor: `other areas we serve`,
    url: '/service-areas',
    context: `See all areas we serve near ${serviceArea.city}`,
  });

  // Link to contact page
  links.push({
    anchor: 'contact us',
    url: '/contact',
    context: `Contact us for ${serviceArea.city} service`,
  });

  return links;
}

// ============================================================================
// BATCH GENERATION
// ============================================================================

/**
 * Generate pages for multiple service areas
 */
export function generateBatchPages(
  serviceAreas: ServiceArea[],
  services: Service[],
  baseConfig: Omit<ServiceAreaPageConfig, 'serviceArea' | 'services'>
): BatchGenerationResult {
  const pages: GeneratedPage[] = [];
  const linkingStructure = new Map<string, string[]>();
  let skipped = 0;
  let errors = 0;

  for (const area of serviceAreas) {
    try {
      // Skip very low priority areas without enough data
      if (area.priority === 'tertiary' && !area.neighborhoods?.length) {
        skipped++;
        continue;
      }

      const config: ServiceAreaPageConfig = {
        ...baseConfig,
        serviceArea: area,
        services,
      };

      const page = generateServiceAreaPage(config);
      pages.push(page);

      // Build linking structure
      const slug = page.slug;
      const relatedSlugs: string[] = [];

      // Find geographically related pages
      serviceAreas.forEach((otherArea) => {
        if (otherArea.city !== area.city) {
          // Same state = related
          if (otherArea.state === area.state) {
            relatedSlugs.push(generateLocationSlug(otherArea));
          }
          // Same metro area = strongly related
          if (otherArea.metroArea && otherArea.metroArea === area.metroArea) {
            relatedSlugs.push(generateLocationSlug(otherArea));
          }
        }
      });

      linkingStructure.set(slug, relatedSlugs);
    } catch {
      errors++;
    }
  }

  return {
    pages,
    stats: {
      total: serviceAreas.length,
      generated: pages.length,
      skipped,
      errors,
    },
    linkingStructure,
  };
}

/**
 * Calculate priority score for service area
 */
export function calculateAreaPriority(area: ServiceArea): number {
  let score = 0;

  // Population-based scoring
  if (area.population) {
    if (area.population > 100000) score += 30;
    else if (area.population > 50000) score += 20;
    else if (area.population > 25000) score += 10;
  }

  // Priority level
  if (area.priority === 'primary') score += 40;
  else if (area.priority === 'secondary') score += 20;

  // Distance from business
  if (area.distanceFromBusiness !== undefined) {
    if (area.distanceFromBusiness < 10) score += 20;
    else if (area.distanceFromBusiness < 25) score += 10;
  }

  // Data richness
  if (area.neighborhoods?.length) score += 10;
  if (area.zipCodes?.length) score += 5;

  return score;
}

/**
 * Sort service areas by priority
 */
export function sortByPriority(areas: ServiceArea[]): ServiceArea[] {
  return [...areas].sort((a, b) => calculateAreaPriority(b) - calculateAreaPriority(a));
}

/**
 * Google Business Profile Configuration
 *
 * Configuration and utilities for optimizing Google Business Profile
 * (formerly Google My Business) listings for local SEO.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Google Business Profile categories
 */
export interface GBPCategory {
  /** Primary category ID */
  id: string;
  /** Display name */
  name: string;
  /** Parent category */
  parent?: string;
  /** Is primary category */
  isPrimary?: boolean;
}

/**
 * Business attributes
 */
export interface GBPAttribute {
  /** Attribute ID */
  id: string;
  /** Attribute name */
  name: string;
  /** Attribute value */
  value: boolean | string;
  /** Attribute category */
  category: 'accessibility' | 'amenities' | 'crowd' | 'payments' | 'service_options' | 'health_safety';
}

/**
 * GBP post type
 */
export type GBPPostType = 'whats_new' | 'event' | 'offer' | 'product';

/**
 * GBP post configuration
 */
export interface GBPPost {
  /** Post type */
  type: GBPPostType;
  /** Post title (for events/offers) */
  title?: string;
  /** Post content (1500 char max) */
  content: string;
  /** Call to action */
  cta?: {
    type: 'book' | 'order' | 'shop' | 'learn_more' | 'sign_up' | 'call';
    url?: string;
  };
  /** Event details */
  event?: {
    startDate: string;
    endDate: string;
    startTime?: string;
    endTime?: string;
  };
  /** Offer details */
  offer?: {
    couponCode?: string;
    termsConditions?: string;
    startDate: string;
    endDate: string;
  };
  /** Photo URL */
  photoUrl?: string;
}

/**
 * GBP optimization score
 */
export interface GBPOptimizationScore {
  /** Overall score (0-100) */
  overall: number;
  /** Section scores */
  sections: {
    basicInfo: number;
    categories: number;
    attributes: number;
    photos: number;
    posts: number;
    reviews: number;
    qa: number;
    products: number;
  };
  /** Recommendations */
  recommendations: GBPRecommendation[];
}

/**
 * GBP recommendation
 */
export interface GBPRecommendation {
  /** Priority level */
  priority: 'critical' | 'high' | 'medium' | 'low';
  /** Section affected */
  section: keyof GBPOptimizationScore['sections'];
  /** Recommendation text */
  text: string;
  /** Action to take */
  action: string;
  /** Estimated impact */
  impact: string;
}

/**
 * Complete GBP configuration
 */
export interface GBPConfig {
  /** Business name */
  name: string;
  /** Primary category */
  primaryCategory: GBPCategory;
  /** Secondary categories (up to 9) */
  secondaryCategories: GBPCategory[];
  /** Business description (750 char max) */
  description: string;
  /** Short description (250 char) */
  shortDescription?: string;
  /** Business attributes */
  attributes: GBPAttribute[];
  /** Opening date */
  openingDate?: string;
  /** Service area (for service area businesses) */
  serviceArea?: {
    type: 'radius' | 'regions';
    radius?: { value: number; unit: 'mi' | 'km' };
    regions?: string[];
  };
  /** Website URL */
  website: string;
  /** Phone number */
  phone: string;
  /** Address */
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  /** Business hours */
  hours: {
    [key: string]: { open: string; close: string } | 'closed';
  };
  /** Special hours */
  specialHours?: {
    date: string;
    hours: { open: string; close: string } | 'closed';
    name?: string;
  }[];
  /** Photos configuration */
  photos: {
    logo?: string;
    cover?: string;
    interior?: string[];
    exterior?: string[];
    team?: string[];
    products?: string[];
  };
  /** Products/Services */
  products?: {
    name: string;
    category: string;
    description: string;
    price?: { value: number; currency: string };
    photoUrl?: string;
  }[];
}

// ============================================================================
// CATEGORY MAPPINGS
// ============================================================================

/**
 * Common GBP categories by industry
 */
export const GBP_CATEGORY_MAPPING: Record<string, GBPCategory[]> = {
  healthcare: [
    { id: 'doctor', name: 'Doctor', isPrimary: true },
    { id: 'medical_clinic', name: 'Medical clinic' },
    { id: 'family_practice', name: 'Family practice physician' },
    { id: 'urgent_care', name: 'Urgent care center' },
  ],
  dental: [
    { id: 'dentist', name: 'Dentist', isPrimary: true },
    { id: 'dental_clinic', name: 'Dental clinic' },
    { id: 'cosmetic_dentist', name: 'Cosmetic dentist' },
    { id: 'orthodontist', name: 'Orthodontist' },
  ],
  legal: [
    { id: 'law_firm', name: 'Law firm', isPrimary: true },
    { id: 'attorney', name: 'Attorney' },
    { id: 'personal_injury', name: 'Personal injury attorney' },
    { id: 'family_law', name: 'Family law attorney' },
  ],
  plumber: [
    { id: 'plumber', name: 'Plumber', isPrimary: true },
    { id: 'plumbing_service', name: 'Plumbing service' },
    { id: 'drain_cleaning', name: 'Drain cleaning service' },
    { id: 'water_heater', name: 'Water heater installation' },
  ],
  hvac: [
    { id: 'hvac_contractor', name: 'HVAC contractor', isPrimary: true },
    { id: 'air_conditioning', name: 'Air conditioning contractor' },
    { id: 'heating_contractor', name: 'Heating contractor' },
    { id: 'furnace_repair', name: 'Furnace repair service' },
  ],
  electrician: [
    { id: 'electrician', name: 'Electrician', isPrimary: true },
    { id: 'electrical_contractor', name: 'Electrical contractor' },
    { id: 'lighting_store', name: 'Lighting store' },
    { id: 'solar_installation', name: 'Solar energy equipment supplier' },
  ],
  restaurant: [
    { id: 'restaurant', name: 'Restaurant', isPrimary: true },
    { id: 'american_restaurant', name: 'American restaurant' },
    { id: 'bar', name: 'Bar' },
    { id: 'cafe', name: 'Cafe' },
  ],
  real_estate: [
    { id: 'real_estate_agency', name: 'Real estate agency', isPrimary: true },
    { id: 'real_estate_agent', name: 'Real estate agent' },
    { id: 'property_management', name: 'Property management company' },
    { id: 'real_estate_appraiser', name: 'Real estate appraiser' },
  ],
  auto_repair: [
    { id: 'auto_repair', name: 'Auto repair shop', isPrimary: true },
    { id: 'auto_body', name: 'Auto body shop' },
    { id: 'tire_shop', name: 'Tire shop' },
    { id: 'oil_change', name: 'Oil change service' },
  ],
};

// ============================================================================
// ATTRIBUTE CONFIGURATIONS
// ============================================================================

/**
 * Common business attributes by category
 */
export const GBP_ATTRIBUTES: Record<string, GBPAttribute[]> = {
  accessibility: [
    { id: 'wheelchair_accessible_entrance', name: 'Wheelchair accessible entrance', value: true, category: 'accessibility' },
    { id: 'wheelchair_accessible_parking', name: 'Wheelchair accessible parking lot', value: true, category: 'accessibility' },
    { id: 'wheelchair_accessible_restroom', name: 'Wheelchair accessible restroom', value: true, category: 'accessibility' },
    { id: 'wheelchair_accessible_seating', name: 'Wheelchair accessible seating', value: true, category: 'accessibility' },
  ],
  payments: [
    { id: 'credit_cards', name: 'Credit cards accepted', value: true, category: 'payments' },
    { id: 'debit_cards', name: 'Debit cards accepted', value: true, category: 'payments' },
    { id: 'nfc_mobile_payments', name: 'NFC mobile payments', value: true, category: 'payments' },
    { id: 'checks', name: 'Checks accepted', value: true, category: 'payments' },
    { id: 'cash_only', name: 'Cash only', value: false, category: 'payments' },
  ],
  service_options: [
    { id: 'online_appointments', name: 'Online appointments', value: true, category: 'service_options' },
    { id: 'onsite_services', name: 'Onsite services', value: true, category: 'service_options' },
    { id: 'same_day_delivery', name: 'Same-day delivery', value: false, category: 'service_options' },
    { id: 'in_store_pickup', name: 'In-store pickup', value: false, category: 'service_options' },
    { id: 'curbside_pickup', name: 'Curbside pickup', value: false, category: 'service_options' },
  ],
  health_safety: [
    { id: 'mask_required', name: 'Mask required', value: false, category: 'health_safety' },
    { id: 'staff_wear_masks', name: 'Staff wear masks', value: false, category: 'health_safety' },
    { id: 'temperature_check', name: 'Temperature check required', value: false, category: 'health_safety' },
    { id: 'staff_vaccinated', name: 'Staff fully vaccinated', value: false, category: 'health_safety' },
  ],
  healthcare_specific: [
    { id: 'telehealth', name: 'Telehealth', value: true, category: 'service_options' },
    { id: 'online_care', name: 'Online care', value: true, category: 'service_options' },
    { id: 'appointment_required', name: 'Appointment required', value: true, category: 'service_options' },
    { id: 'walk_ins_welcome', name: 'Walk-ins welcome', value: false, category: 'service_options' },
  ],
  home_services_specific: [
    { id: 'emergency_service', name: '24-hour emergency service', value: true, category: 'service_options' },
    { id: 'free_estimates', name: 'Free estimates', value: true, category: 'service_options' },
    { id: 'licensed_insured', name: 'Licensed and insured', value: true, category: 'service_options' },
    { id: 'financing_available', name: 'Financing available', value: true, category: 'service_options' },
  ],
};

// ============================================================================
// POST TEMPLATES
// ============================================================================

/**
 * GBP post templates by type
 */
export const GBP_POST_TEMPLATES: Record<GBPPostType, { title: string; content: string }> = {
  whats_new: {
    title: 'Update from {businessName}',
    content: `We're excited to share some news with our {city} community! {content}

Call us at {phone} or visit our website to learn more.`,
  },
  event: {
    title: '{eventName}',
    content: `Join us for {eventName} at our {city} location!

📅 {date}
⏰ {time}
📍 {address}

{description}

Call {phone} to reserve your spot!`,
  },
  offer: {
    title: '{offerTitle}',
    content: `Special offer for our {city} customers!

🎉 {offerDescription}
📅 Valid: {startDate} - {endDate}
{couponCode}

Call {phone} or visit {website} to redeem!`,
  },
  product: {
    title: '{productName}',
    content: `Introducing {productName}!

{productDescription}

{price}

Available now at our {city} location. Call {phone} for more info!`,
  },
};

// ============================================================================
// OPTIMIZATION FUNCTIONS
// ============================================================================

/**
 * Calculate GBP optimization score
 */
export function calculateOptimizationScore(config: Partial<GBPConfig>): GBPOptimizationScore {
  const scores: GBPOptimizationScore['sections'] = {
    basicInfo: calculateBasicInfoScore(config),
    categories: calculateCategoriesScore(config),
    attributes: calculateAttributesScore(config),
    photos: calculatePhotosScore(config),
    posts: 0, // Would need post history
    reviews: 0, // Would need review data
    qa: 0, // Would need Q&A data
    products: calculateProductsScore(config),
  };

  const weights = {
    basicInfo: 0.25,
    categories: 0.15,
    attributes: 0.1,
    photos: 0.2,
    posts: 0.1,
    reviews: 0.1,
    qa: 0.05,
    products: 0.05,
  };

  const overall = Math.round(
    Object.entries(scores).reduce(
      (sum, [key, score]) => sum + score * weights[key as keyof typeof weights],
      0
    )
  );

  const recommendations = generateRecommendations(config, scores);

  return {
    overall,
    sections: scores,
    recommendations,
  };
}

/**
 * Calculate basic info score
 */
function calculateBasicInfoScore(config: Partial<GBPConfig>): number {
  let score = 0;
  const maxScore = 100;

  if (config.name) score += 15;
  if (config.description && config.description.length >= 250) score += 20;
  if (config.phone) score += 15;
  if (config.website) score += 15;
  if (config.address) score += 15;
  if (config.hours && Object.keys(config.hours).length >= 5) score += 20;

  return Math.min(score, maxScore);
}

/**
 * Calculate categories score
 */
function calculateCategoriesScore(config: Partial<GBPConfig>): number {
  let score = 0;

  if (config.primaryCategory) score += 50;
  if (config.secondaryCategories?.length) {
    score += Math.min(config.secondaryCategories.length * 10, 50);
  }

  return score;
}

/**
 * Calculate attributes score
 */
function calculateAttributesScore(config: Partial<GBPConfig>): number {
  if (!config.attributes?.length) return 0;

  const categories = new Set(config.attributes.map((a) => a.category));
  const categoryScore = categories.size * 20;
  const attributeScore = Math.min(config.attributes.length * 5, 50);

  return Math.min(categoryScore + attributeScore, 100);
}

/**
 * Calculate photos score
 */
function calculatePhotosScore(config: Partial<GBPConfig>): number {
  if (!config.photos) return 0;

  let score = 0;
  if (config.photos.logo) score += 20;
  if (config.photos.cover) score += 20;
  if (config.photos.interior?.length) score += Math.min(config.photos.interior.length * 5, 20);
  if (config.photos.exterior?.length) score += Math.min(config.photos.exterior.length * 5, 20);
  if (config.photos.team?.length) score += Math.min(config.photos.team.length * 5, 20);

  return Math.min(score, 100);
}

/**
 * Calculate products score
 */
function calculateProductsScore(config: Partial<GBPConfig>): number {
  if (!config.products?.length) return 0;

  const productCount = config.products.length;
  const withPhotos = config.products.filter((p) => p.photoUrl).length;
  const withPrices = config.products.filter((p) => p.price).length;

  let score = Math.min(productCount * 10, 40);
  score += (withPhotos / productCount) * 30;
  score += (withPrices / productCount) * 30;

  return Math.min(Math.round(score), 100);
}

/**
 * Generate recommendations based on scores
 */
function generateRecommendations(
  config: Partial<GBPConfig>,
  scores: GBPOptimizationScore['sections']
): GBPRecommendation[] {
  const recommendations: GBPRecommendation[] = [];

  // Basic info recommendations
  if (scores.basicInfo < 100) {
    if (!config.description || config.description.length < 250) {
      recommendations.push({
        priority: 'critical',
        section: 'basicInfo',
        text: 'Add a complete business description (minimum 250 characters)',
        action: 'Write a detailed description highlighting your services, experience, and unique value',
        impact: '+15-20% visibility in local search',
      });
    }
    if (!config.hours || Object.keys(config.hours).length < 5) {
      recommendations.push({
        priority: 'high',
        section: 'basicInfo',
        text: 'Complete your business hours',
        action: 'Add hours for all days of the week, including any special hours',
        impact: '+10% visibility, reduced user frustration',
      });
    }
  }

  // Category recommendations
  if (scores.categories < 100) {
    if (!config.secondaryCategories?.length || config.secondaryCategories.length < 3) {
      recommendations.push({
        priority: 'high',
        section: 'categories',
        text: 'Add more secondary categories',
        action: 'Add 3-5 relevant secondary categories to appear in more searches',
        impact: '+20-30% search impressions',
      });
    }
  }

  // Attributes recommendations
  if (scores.attributes < 60) {
    recommendations.push({
      priority: 'medium',
      section: 'attributes',
      text: 'Add more business attributes',
      action: 'Complete all applicable attributes (accessibility, payments, service options)',
      impact: '+5-10% click-through rate',
    });
  }

  // Photos recommendations
  if (scores.photos < 80) {
    if (!config.photos?.logo) {
      recommendations.push({
        priority: 'critical',
        section: 'photos',
        text: 'Add a business logo',
        action: 'Upload a high-quality logo (250x250px minimum)',
        impact: 'Essential for brand recognition',
      });
    }
    if (!config.photos?.cover) {
      recommendations.push({
        priority: 'high',
        section: 'photos',
        text: 'Add a cover photo',
        action: 'Upload an engaging cover photo (1024x576px recommended)',
        impact: '+35% more clicks to website',
      });
    }
    if (!config.photos?.interior?.length || config.photos.interior.length < 3) {
      recommendations.push({
        priority: 'medium',
        section: 'photos',
        text: 'Add more interior photos',
        action: 'Upload at least 3 interior photos showing your business',
        impact: '+10% engagement',
      });
    }
  }

  // Products recommendations
  if (scores.products < 50 && config.products?.length) {
    recommendations.push({
      priority: 'medium',
      section: 'products',
      text: 'Enhance product listings',
      action: 'Add photos and prices to all products/services',
      impact: '+15% conversion rate',
    });
  }

  // Posts recommendations
  recommendations.push({
    priority: 'medium',
    section: 'posts',
    text: 'Post regularly to your profile',
    action: 'Create weekly posts with updates, offers, or events',
    impact: '+5-10% engagement and visibility',
  });

  // Reviews recommendations
  recommendations.push({
    priority: 'high',
    section: 'reviews',
    text: 'Actively manage reviews',
    action: 'Respond to all reviews within 24-48 hours',
    impact: '+35% trust factor, improved rankings',
  });

  // Sort by priority
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return recommendations;
}

// ============================================================================
// DESCRIPTION GENERATOR
// ============================================================================

/**
 * Generate optimized GBP description
 */
export function generateGBPDescription(input: {
  businessName: string;
  industry: string;
  city: string;
  state: string;
  services: string[];
  yearsInBusiness?: number;
  uniquePoints?: string[];
}): string {
  const { businessName, industry, city, state, services, yearsInBusiness, uniquePoints } = input;

  const serviceList = services.slice(0, 5).join(', ');
  const experienceText = yearsInBusiness
    ? `With ${yearsInBusiness} years of experience, we`
    : 'We';

  let description = `${businessName} provides professional ${industry.toLowerCase()} services in ${city}, ${state}. ${experienceText} specialize in ${serviceList}.`;

  if (uniquePoints?.length) {
    description += ` ${uniquePoints.slice(0, 2).join('. ')}.`;
  }

  description += ` Contact us today for a free consultation!`;

  // Ensure under 750 characters
  if (description.length > 750) {
    description = description.slice(0, 747) + '...';
  }

  return description;
}

/**
 * Get recommended categories for industry
 */
export function getRecommendedCategories(industry: string): GBPCategory[] {
  const normalizedIndustry = industry.toLowerCase().replace(/[^a-z]/g, '_');

  for (const [key, categories] of Object.entries(GBP_CATEGORY_MAPPING)) {
    if (normalizedIndustry.includes(key) || key.includes(normalizedIndustry)) {
      return categories;
    }
  }

  return [];
}

/**
 * Get recommended attributes for industry
 */
export function getRecommendedAttributes(industry: string): GBPAttribute[] {
  const attributes = [
    ...GBP_ATTRIBUTES.accessibility,
    ...GBP_ATTRIBUTES.payments,
    ...GBP_ATTRIBUTES.service_options,
  ];

  const normalizedIndustry = industry.toLowerCase();

  if (normalizedIndustry.includes('health') || normalizedIndustry.includes('medical') || normalizedIndustry.includes('dental')) {
    attributes.push(...GBP_ATTRIBUTES.healthcare_specific);
  }

  if (
    normalizedIndustry.includes('plumb') ||
    normalizedIndustry.includes('hvac') ||
    normalizedIndustry.includes('electric') ||
    normalizedIndustry.includes('contractor')
  ) {
    attributes.push(...GBP_ATTRIBUTES.home_services_specific);
  }

  return attributes;
}

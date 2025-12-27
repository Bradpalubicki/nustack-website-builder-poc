/**
 * Industry Knowledge Base
 *
 * Contains industry-specific data for generating targeted websites.
 * The AI uses this to avoid asking redundant questions.
 */

export interface IndustryData {
  name: string;
  keywords: string[];
  targetAudience: string;
  primaryGoals: string[];
  commonServices: string[];
  requiredFeatures: string[];
  seoKeywords: string[];
  schemaTypes: string[];
  trustElements: string[];
  effectiveCTAs: string[];
  recommendedColors: {
    primary: string[];
    accent: string[];
    avoid: string[];
  };
}

export const industryKnowledge: Record<string, IndustryData> = {
  dental: {
    name: 'Dental Practice',
    keywords: ['dentist', 'dental', 'teeth', 'oral', 'smile', 'orthodont', 'invisalign'],
    targetAudience: 'Local patients seeking dental care (families, adults, seniors)',
    primaryGoals: ['Book appointments', 'Generate phone calls', 'Build trust'],
    commonServices: [
      'General Dentistry',
      'Cosmetic Dentistry',
      'Teeth Whitening',
      'Dental Implants',
      'Invisalign / Orthodontics',
      'Emergency Dental Care',
      'Pediatric Dentistry',
      'Root Canals',
      'Crowns & Bridges',
      'Dentures',
    ],
    requiredFeatures: ['booking', 'location', 'reviews', 'insurance-info'],
    seoKeywords: ['[city] dentist', 'dentist near me', 'family dentist', 'emergency dentist'],
    schemaTypes: ['Dentist', 'MedicalBusiness', 'LocalBusiness'],
    trustElements: [
      'Years in practice',
      'Number of patients served',
      'Google review rating',
      'Insurance accepted',
      'Before/after photos',
      'Doctor credentials',
    ],
    effectiveCTAs: [
      'Book Your Appointment',
      'Schedule a Free Consultation',
      'Call Now',
      'Request Appointment',
    ],
    recommendedColors: {
      primary: ['#0ea5e9', '#3b82f6', '#06b6d4'],
      accent: ['#10b981', '#22c55e'],
      avoid: ['#ef4444', '#f97316'],
    },
  },

  medical: {
    name: 'Medical Practice',
    keywords: ['medical', 'doctor', 'clinic', 'health', 'physician', 'treatment', 'therapy', 'medspa', 'wellness'],
    targetAudience: 'Patients seeking specialized medical care',
    primaryGoals: ['Book consultations', 'Generate leads', 'Educate patients'],
    commonServices: [
      'Primary Care',
      'Specialty Consultations',
      'Preventive Care',
      'Chronic Disease Management',
      'Telehealth',
      'Injections & Treatments',
    ],
    requiredFeatures: ['booking', 'patient-portal', 'location', 'insurance-info'],
    seoKeywords: ['[specialty] doctor near me', '[city] clinic', 'medical care [city]'],
    schemaTypes: ['MedicalBusiness', 'Physician', 'MedicalClinic'],
    trustElements: [
      'Board certifications',
      'Years of experience',
      'Patient testimonials',
      'Hospital affiliations',
      'Insurance accepted',
    ],
    effectiveCTAs: [
      'Book Consultation',
      'Request Appointment',
      'Call Our Office',
      'Get Started',
    ],
    recommendedColors: {
      primary: ['#0ea5e9', '#3b82f6', '#6366f1'],
      accent: ['#10b981', '#14b8a6'],
      avoid: ['#ef4444'],
    },
  },

  restaurant: {
    name: 'Restaurant',
    keywords: ['restaurant', 'food', 'dining', 'menu', 'cuisine', 'eat', 'chef', 'bar', 'grill'],
    targetAudience: 'Local diners, food enthusiasts, families',
    primaryGoals: ['Online orders', 'Reservations', 'Foot traffic'],
    commonServices: ['Dine-in', 'Takeout', 'Delivery', 'Catering', 'Private Events'],
    requiredFeatures: ['menu', 'online-ordering', 'reservations', 'hours', 'location'],
    seoKeywords: ['[cuisine] restaurant [city]', 'best [food] near me', 'restaurants open now'],
    schemaTypes: ['Restaurant', 'FoodEstablishment', 'LocalBusiness'],
    trustElements: [
      'Google/Yelp rating',
      'Food photos',
      'Chef credentials',
      'Awards',
      'Customer reviews',
    ],
    effectiveCTAs: ['Order Online', 'Make a Reservation', 'View Menu', 'Call to Order'],
    recommendedColors: {
      primary: ['#dc2626', '#ea580c', '#d97706'],
      accent: ['#65a30d', '#16a34a'],
      avoid: ['#3b82f6'],
    },
  },

  legal: {
    name: 'Law Firm',
    keywords: ['lawyer', 'attorney', 'law firm', 'legal', 'counsel', 'litigation'],
    targetAudience: 'Individuals and businesses needing legal representation',
    primaryGoals: ['Free consultations', 'Phone calls', 'Case inquiries'],
    commonServices: [
      'Personal Injury',
      'Family Law',
      'Criminal Defense',
      'Business Law',
      'Estate Planning',
      'Immigration',
    ],
    requiredFeatures: ['contact-form', 'free-consultation-cta', 'practice-areas', 'attorney-bios'],
    seoKeywords: ['[practice area] lawyer [city]', 'attorney near me', 'free legal consultation'],
    schemaTypes: ['LegalService', 'Attorney', 'LocalBusiness'],
    trustElements: [
      'Case results',
      'Years of experience',
      'Bar associations',
      'Client testimonials',
      'Awards/recognition',
    ],
    effectiveCTAs: [
      'Free Consultation',
      'Call Now',
      'Get Your Free Case Review',
      'Speak to an Attorney',
    ],
    recommendedColors: {
      primary: ['#1e3a5f', '#1e40af', '#312e81'],
      accent: ['#b45309', '#a16207'],
      avoid: ['#ec4899', '#8b5cf6'],
    },
  },

  homeServices: {
    name: 'Home Services',
    keywords: ['plumber', 'electrician', 'hvac', 'roofing', 'contractor', 'handyman', 'repair', 'remodel'],
    targetAudience: 'Homeowners needing repairs or improvements',
    primaryGoals: ['Phone calls', 'Quote requests', 'Emergency calls'],
    commonServices: ['Repairs', 'Installation', 'Maintenance', 'Emergency Services', 'Inspections'],
    requiredFeatures: ['click-to-call', 'quote-form', 'service-areas', 'emergency-number'],
    seoKeywords: ['[service] near me', '[city] [trade]', 'emergency [service]'],
    schemaTypes: ['HomeAndConstructionBusiness', 'LocalBusiness'],
    trustElements: [
      'Licensed & insured',
      'Years in business',
      'Google reviews',
      'Before/after photos',
      'Service guarantees',
    ],
    effectiveCTAs: ['Get a Free Quote', 'Call Now', 'Schedule Service', 'Emergency? Call 24/7'],
    recommendedColors: {
      primary: ['#ea580c', '#2563eb', '#16a34a'],
      accent: ['#fbbf24'],
      avoid: [],
    },
  },

  realEstate: {
    name: 'Real Estate',
    keywords: ['realtor', 'real estate', 'property', 'homes', 'houses', 'agent', 'broker'],
    targetAudience: 'Home buyers and sellers in the local market',
    primaryGoals: ['Lead generation', 'Property inquiries', 'Consultations'],
    commonServices: ['Buying', 'Selling', 'Rentals', 'Property Management', 'Investment'],
    requiredFeatures: ['property-listings', 'contact-form', 'market-reports', 'agent-bio'],
    seoKeywords: ['homes for sale [city]', '[city] realtor', 'real estate agent near me'],
    schemaTypes: ['RealEstateAgent', 'LocalBusiness'],
    trustElements: [
      'Homes sold',
      'Years of experience',
      'Client testimonials',
      'Awards',
      'Market expertise',
    ],
    effectiveCTAs: ['View Listings', 'Free Home Valuation', 'Schedule a Showing', 'Contact Agent'],
    recommendedColors: {
      primary: ['#1e3a5f', '#0d9488', '#7c3aed'],
      accent: ['#f59e0b', '#10b981'],
      avoid: [],
    },
  },

  beauty: {
    name: 'Beauty & Wellness',
    keywords: ['salon', 'spa', 'beauty', 'hair', 'nails', 'massage', 'skincare', 'esthetician'],
    targetAudience: 'Individuals seeking beauty and wellness services',
    primaryGoals: ['Book appointments', 'Showcase services', 'Build brand'],
    commonServices: ['Haircuts', 'Coloring', 'Facials', 'Massages', 'Nails', 'Waxing'],
    requiredFeatures: ['booking', 'service-menu', 'gallery', 'reviews'],
    seoKeywords: ['[service] near me', '[city] salon', 'best [service] [city]'],
    schemaTypes: ['BeautySalon', 'HealthAndBeautyBusiness', 'LocalBusiness'],
    trustElements: [
      'Before/after photos',
      'Client reviews',
      'Stylist portfolios',
      'Product brands used',
      'Awards',
    ],
    effectiveCTAs: ['Book Now', 'View Services', 'Book Your Appointment', 'Call Us'],
    recommendedColors: {
      primary: ['#ec4899', '#a855f7', '#14b8a6'],
      accent: ['#f59e0b', '#f472b6'],
      avoid: [],
    },
  },

  general: {
    name: 'Business',
    keywords: [],
    targetAudience: 'Customers interested in their products or services',
    primaryGoals: ['Generate leads', 'Build brand awareness', 'Drive conversions'],
    commonServices: [],
    requiredFeatures: ['contact-form', 'about', 'services'],
    seoKeywords: ['[business type] [city]', '[service] near me'],
    schemaTypes: ['LocalBusiness', 'Organization'],
    trustElements: ['Years in business', 'Customer reviews', 'Credentials', 'Awards'],
    effectiveCTAs: ['Get Started', 'Contact Us', 'Learn More', 'Request a Quote'],
    recommendedColors: {
      primary: ['#3b82f6', '#6366f1', '#0ea5e9'],
      accent: ['#10b981', '#f59e0b'],
      avoid: [],
    },
  },
};

/**
 * Detect industry from analysis data
 */
export function detectIndustry(analysis: {
  title?: string;
  description?: string;
  businessName?: string;
  services?: string[];
}): string {
  const content = `${analysis.businessName || ''} ${analysis.description || ''} ${analysis.title || ''} ${(analysis.services || []).join(' ')}`.toLowerCase();

  for (const [industry, data] of Object.entries(industryKnowledge)) {
    if (industry === 'general') continue;
    if (data.keywords.some(keyword => content.includes(keyword))) {
      return industry;
    }
  }

  return 'general';
}

/**
 * Get industry-specific context for AI
 */
export function getIndustryContext(industry: string): IndustryData {
  return industryKnowledge[industry] || industryKnowledge.general;
}

/**
 * Industry to Schema.org Type Mapper
 *
 * Maps business industries and specialties to the correct Schema.org @type.
 * Using the most specific type improves rich result eligibility.
 *
 * @see https://schema.org/LocalBusiness
 * @see https://developers.google.com/search/docs/appearance/structured-data/local-business
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/** Industry categories */
export type Industry =
  | 'healthcare'
  | 'legal'
  | 'restaurant'
  | 'home_services'
  | 'fitness'
  | 'automotive'
  | 'hospitality'
  | 'professional_services'
  | 'education'
  | 'retail'
  | 'construction';

/** Healthcare specialties */
export type HealthcareSpecialty =
  | 'medical_clinic'
  | 'dental'
  | 'veterinary'
  | 'chiropractic'
  | 'med_spa'
  | 'physical_therapy'
  | 'mental_health'
  | 'optometry'
  | 'urgent_care'
  | 'pharmacy'
  | 'hospital'
  | 'dermatology'
  | 'podiatry'
  | 'mens_health';

/** Legal specialties */
export type LegalSpecialty =
  | 'personal_injury'
  | 'family_law'
  | 'criminal_defense'
  | 'bankruptcy'
  | 'immigration'
  | 'estate_planning'
  | 'business_law'
  | 'real_estate_law';

/** Restaurant specialties */
export type RestaurantSpecialty =
  | 'cafe'
  | 'bar'
  | 'bakery'
  | 'fast_food'
  | 'fine_dining'
  | 'food_truck';

/** Home services specialties */
export type HomeServicesSpecialty =
  | 'hvac'
  | 'plumbing'
  | 'electrical'
  | 'roofing'
  | 'landscaping'
  | 'cleaning'
  | 'pest_control'
  | 'moving'
  | 'locksmith'
  | 'garage_door';

/** Fitness specialties */
export type FitnessSpecialty =
  | 'gym'
  | 'yoga'
  | 'pilates'
  | 'crossfit'
  | 'martial_arts'
  | 'swimming'
  | 'dance';

/** Automotive specialties */
export type AutomotiveSpecialty =
  | 'repair'
  | 'dealer'
  | 'body_shop'
  | 'tire_shop'
  | 'car_wash'
  | 'motorcycle';

/** Hospitality specialties */
export type HospitalitySpecialty =
  | 'hotel'
  | 'bnb'
  | 'motel'
  | 'resort'
  | 'hostel';

/** Professional services specialties */
export type ProfessionalServicesSpecialty =
  | 'accounting'
  | 'insurance'
  | 'real_estate'
  | 'marketing'
  | 'consulting'
  | 'photography'
  | 'financial_planning';

/** Education specialties */
export type EducationSpecialty =
  | 'tutoring'
  | 'driving_school'
  | 'music_school'
  | 'language_school'
  | 'preschool';

// ============================================================================
// SCHEMA TYPE MAPPING
// ============================================================================

/**
 * Complete mapping of industry:specialty to Schema.org @type
 */
const SCHEMA_TYPE_MAPPING: Record<string, string> = {
  // Healthcare
  'healthcare:medical_clinic': 'MedicalClinic',
  'healthcare:dental': 'Dentist',
  'healthcare:veterinary': 'VeterinaryCare',
  'healthcare:chiropractic': 'Chiropractor',
  'healthcare:med_spa': 'HealthAndBeautyBusiness',
  'healthcare:physical_therapy': 'MedicalClinic',
  'healthcare:mental_health': 'MedicalClinic',
  'healthcare:optometry': 'Optician',
  'healthcare:urgent_care': 'MedicalClinic',
  'healthcare:pharmacy': 'Pharmacy',
  'healthcare:hospital': 'Hospital',
  'healthcare:dermatology': 'MedicalClinic',
  'healthcare:podiatry': 'MedicalClinic',
  'healthcare:mens_health': 'MedicalClinic',
  'healthcare': 'MedicalBusiness',

  // Legal
  'legal:personal_injury': 'LegalService',
  'legal:family_law': 'LegalService',
  'legal:criminal_defense': 'LegalService',
  'legal:bankruptcy': 'LegalService',
  'legal:immigration': 'LegalService',
  'legal:estate_planning': 'LegalService',
  'legal:business_law': 'LegalService',
  'legal:real_estate_law': 'LegalService',
  'legal': 'LegalService',

  // Restaurant
  'restaurant:cafe': 'CafeOrCoffeeShop',
  'restaurant:bar': 'BarOrPub',
  'restaurant:bakery': 'Bakery',
  'restaurant:fast_food': 'FastFoodRestaurant',
  'restaurant:fine_dining': 'Restaurant',
  'restaurant:food_truck': 'FoodEstablishment',
  'restaurant': 'Restaurant',

  // Home Services
  'home_services:hvac': 'HVACBusiness',
  'home_services:plumbing': 'Plumber',
  'home_services:electrical': 'Electrician',
  'home_services:roofing': 'RoofingContractor',
  'home_services:landscaping': 'LandscapeArchitect',
  'home_services:cleaning': 'HousekeepingService',
  'home_services:pest_control': 'PestControlService',
  'home_services:moving': 'MovingCompany',
  'home_services:locksmith': 'Locksmith',
  'home_services:garage_door': 'HomeAndConstructionBusiness',
  'home_services': 'HomeAndConstructionBusiness',

  // Fitness
  'fitness:gym': 'ExerciseGym',
  'fitness:yoga': 'HealthClub',
  'fitness:pilates': 'HealthClub',
  'fitness:crossfit': 'ExerciseGym',
  'fitness:martial_arts': 'SportsActivityLocation',
  'fitness:swimming': 'SportsActivityLocation',
  'fitness:dance': 'DanceSchool',
  'fitness': 'SportsActivityLocation',

  // Automotive
  'automotive:repair': 'AutoRepair',
  'automotive:dealer': 'AutoDealer',
  'automotive:body_shop': 'AutoBodyShop',
  'automotive:tire_shop': 'TireShop',
  'automotive:car_wash': 'AutoWash',
  'automotive:motorcycle': 'MotorcycleDealer',
  'automotive': 'AutomotiveBusiness',

  // Hospitality
  'hospitality:hotel': 'Hotel',
  'hospitality:bnb': 'BedAndBreakfast',
  'hospitality:motel': 'Motel',
  'hospitality:resort': 'Resort',
  'hospitality:hostel': 'Hostel',
  'hospitality': 'LodgingBusiness',

  // Professional Services
  'professional_services:accounting': 'AccountingService',
  'professional_services:insurance': 'InsuranceAgency',
  'professional_services:real_estate': 'RealEstateAgent',
  'professional_services:marketing': 'ProfessionalService',
  'professional_services:consulting': 'ProfessionalService',
  'professional_services:photography': 'Photographer',
  'professional_services:financial_planning': 'FinancialService',
  'professional_services': 'ProfessionalService',

  // Education
  'education:tutoring': 'EducationalOrganization',
  'education:driving_school': 'DrivingSchool',
  'education:music_school': 'MusicSchool',
  'education:language_school': 'LanguageSchool',
  'education:preschool': 'Preschool',
  'education': 'EducationalOrganization',

  // Retail
  'retail': 'Store',

  // Construction
  'construction': 'GeneralContractor',
};

// ============================================================================
// FUNCTIONS
// ============================================================================

/**
 * Get the Schema.org @type for a given industry and specialty.
 *
 * @param industry - The business industry
 * @param specialty - Optional specialty within the industry
 * @returns The most specific Schema.org type
 */
export function getSchemaType(industry: string, specialty?: string): string {
  // Try specific combination first
  if (specialty) {
    const specificKey = `${industry}:${specialty}`;
    if (SCHEMA_TYPE_MAPPING[specificKey]) {
      return SCHEMA_TYPE_MAPPING[specificKey];
    }
  }

  // Fall back to industry-level type
  if (SCHEMA_TYPE_MAPPING[industry]) {
    return SCHEMA_TYPE_MAPPING[industry];
  }

  // Default to LocalBusiness
  return 'LocalBusiness';
}

/**
 * Get all supported specialties for an industry
 */
export function getIndustrySpecialties(industry: Industry): string[] {
  const prefix = `${industry}:`;
  return Object.keys(SCHEMA_TYPE_MAPPING)
    .filter((key) => key.startsWith(prefix))
    .map((key) => key.replace(prefix, ''));
}

/**
 * Check if a Schema.org type is a medical type
 */
export function isMedicalType(schemaType: string): boolean {
  const medicalTypes = [
    'MedicalBusiness',
    'MedicalClinic',
    'Dentist',
    'VeterinaryCare',
    'Chiropractor',
    'Pharmacy',
    'Hospital',
    'Optician',
  ];
  return medicalTypes.includes(schemaType);
}

/**
 * Check if a Schema.org type should use MedicalOrganization
 */
export function shouldUseMedicalOrganization(schemaType: string): boolean {
  return isMedicalType(schemaType);
}

/**
 * Get the parent type for a Schema.org type
 */
export function getParentType(schemaType: string): string {
  const parentTypes: Record<string, string> = {
    MedicalClinic: 'MedicalBusiness',
    Dentist: 'MedicalBusiness',
    Pharmacy: 'MedicalBusiness',
    Hospital: 'MedicalBusiness',
    Restaurant: 'FoodEstablishment',
    CafeOrCoffeeShop: 'FoodEstablishment',
    BarOrPub: 'FoodEstablishment',
    Bakery: 'FoodEstablishment',
    Hotel: 'LodgingBusiness',
    Motel: 'LodgingBusiness',
    BedAndBreakfast: 'LodgingBusiness',
  };

  return parentTypes[schemaType] || 'LocalBusiness';
}

/**
 * Get display name for a Schema.org type
 */
export function getSchemaTypeDisplayName(schemaType: string): string {
  const displayNames: Record<string, string> = {
    LocalBusiness: 'Local Business',
    MedicalClinic: 'Medical Clinic',
    MedicalBusiness: 'Medical Business',
    LegalService: 'Legal Service',
    Restaurant: 'Restaurant',
    CafeOrCoffeeShop: 'Cafe or Coffee Shop',
    BarOrPub: 'Bar or Pub',
    HVACBusiness: 'HVAC Business',
    ExerciseGym: 'Gym',
    AutoRepair: 'Auto Repair',
    Hotel: 'Hotel',
    BedAndBreakfast: 'Bed and Breakfast',
    AccountingService: 'Accounting Service',
    RealEstateAgent: 'Real Estate Agent',
  };

  return displayNames[schemaType] || schemaType.replace(/([A-Z])/g, ' $1').trim();
}

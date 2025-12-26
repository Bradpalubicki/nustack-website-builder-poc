/**
 * Healthcare Project Templates
 *
 * Pre-built templates for healthcare practices.
 */

export { mensHealthClinicTemplate } from './mensHealthClinic';

// Additional templates to be implemented:
// export { medSpaTemplate } from './medSpa';
// export { dentalPracticeTemplate } from './dentalPractice';
// export { chiropracticClinicTemplate } from './chiropracticClinic';
// export { physicalTherapyTemplate } from './physicalTherapy';

import { mensHealthClinicTemplate } from './mensHealthClinic';
import type { HealthcareTemplate } from '@/types/healthcare';

/**
 * All available healthcare templates
 */
export const healthcareTemplates: HealthcareTemplate[] = [
  mensHealthClinicTemplate,
  // Add more templates here as they're created
];

/**
 * Get template by ID
 */
export function getTemplateById(id: string): HealthcareTemplate | undefined {
  return healthcareTemplates.find((t) => t.id === id);
}

/**
 * Get templates by specialty
 */
export function getTemplatesBySpecialty(specialty: string): HealthcareTemplate[] {
  return healthcareTemplates.filter((t) => t.subCategory === specialty);
}

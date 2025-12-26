/**
 * Custom Hooks
 *
 * Exports all custom React hooks used in the application.
 */

// Toast hook
export { useToast, toast } from './use-toast';

// Healthcare hooks
export { useHealthcare } from './useHealthcare';
export type { UseHealthcareOptions, HealthcareData, UseHealthcareReturn } from './useHealthcare';

export { useSEOAudit } from './useSEOAudit';
export type { UseSEOAuditOptions, SEOAuditStats, UseSEOAuditReturn } from './useSEOAudit';

export { useLocalSEO } from './useLocalSEO';
export type { UseLocalSEOOptions, LocalSEOCoverage, UseLocalSEOReturn, NAPConsistencyReport } from './useLocalSEO';

// Performance hooks
export { usePerformance, useMetric, usePerformanceScore } from './usePerformance';
export type { UsePerformanceOptions, UsePerformanceReturn } from './usePerformance';

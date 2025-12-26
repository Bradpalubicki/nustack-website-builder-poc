/**
 * Healthcare Schema Components
 *
 * This module provides React components for generating JSON-LD structured data
 * that follows schema.org specifications. These components help improve SEO
 * and enable rich results in search engines.
 */

// Schema Components
export { LocalBusinessSchema } from './LocalBusinessSchema';
export type { LocalBusinessSchemaProps } from './LocalBusinessSchema';

export { FAQPageSchema } from './FAQPageSchema';
export type { FAQPageSchemaProps } from './FAQPageSchema';

export { ArticleSchema } from './ArticleSchema';
export type { ArticleSchemaProps } from './ArticleSchema';

export { MedicalBusinessSchema } from './MedicalBusinessSchema';
export type { MedicalBusinessSchemaProps, MedicalServiceSchema } from './MedicalBusinessSchema';

export { PhysicianSchema } from './PhysicianSchema';
export type { PhysicianSchemaProps } from './PhysicianSchema';

export { BreadcrumbSchema } from './BreadcrumbSchema';
export type { BreadcrumbSchemaProps, BreadcrumbItem } from './BreadcrumbSchema';

export { ReviewSchema } from './ReviewSchema';
export type { ReviewSchemaProps } from './ReviewSchema';

export { AggregateRatingSchema } from './AggregateRatingSchema';
export type { AggregateRatingSchemaProps } from './AggregateRatingSchema';

export { ServiceSchema } from './ServiceSchema';
export type { ServiceSchemaProps } from './ServiceSchema';

export { MedicalProcedureSchema } from './MedicalProcedureSchema';
export type { MedicalProcedureSchemaProps, ProcedureType } from './MedicalProcedureSchema';

export { OrganizationSchema } from './OrganizationSchema';
export type { OrganizationSchemaProps } from './OrganizationSchema';

export { WebsiteSchema } from './WebsiteSchema';
export type { WebsiteSchemaProps } from './WebsiteSchema';

export { OfferSchema } from './OfferSchema';
export type { OfferSchemaProps, ItemAvailability } from './OfferSchema';

// Container and Utilities
export { SchemaContainer } from './SchemaContainer';
export type { SchemaContainerProps } from './SchemaContainer';

export { useSchema } from './useSchema';
export type { SchemaEntry } from './useSchema';

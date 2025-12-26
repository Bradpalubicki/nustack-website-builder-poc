/**
 * E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) Components
 *
 * These components help demonstrate medical credibility for YMYL (Your Money or Your Life)
 * content and comply with Google's quality guidelines for healthcare websites.
 */

// Medical Reviewer Component
export { MedicalReviewer } from './MedicalReviewer';
export type { MedicalReviewerProps, MedicalReviewerVariant } from './MedicalReviewer';

// Article Citations Component
export { ArticleCitations } from './ArticleCitations';
export type { ArticleCitationsProps, Citation, CitationVariant } from './ArticleCitations';

// Medical Disclaimer Component
export { MedicalDisclaimer } from './MedicalDisclaimer';
export type { MedicalDisclaimerProps, DisclaimerVariant } from './MedicalDisclaimer';

// Last Updated Badge Component
export { LastUpdatedBadge } from './LastUpdatedBadge';
export type { LastUpdatedBadgeProps, LastUpdatedVariant } from './LastUpdatedBadge';

// Author Bio Component
export { AuthorBio } from './AuthorBio';
export type { AuthorBioProps, SocialLink } from './AuthorBio';

// Credentials Badge Component
export { CredentialsBadge } from './CredentialsBadge';
export type { CredentialsBadgeProps, Credential, CredentialVariant } from './CredentialsBadge';

// Trust Signals Component
export { TrustSignals } from './TrustSignals';
export type { TrustSignalsProps, RatingSource } from './TrustSignals';

// Source Quality Indicator Component
export { SourceQualityIndicator } from './SourceQualityIndicator';
export type { SourceQualityIndicatorProps, SourceQualityType } from './SourceQualityIndicator';

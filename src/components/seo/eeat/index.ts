/**
 * E-E-A-T Components
 *
 * React components for Experience, Expertise, Authoritativeness,
 * and Trustworthiness (E-E-A-T) compliance.
 */

export { AuthorBio } from './AuthorBio';
export type { AuthorBioProps, AuthorCredential, AuthorSocialLink } from './AuthorBio';

export { AuthorPage } from './AuthorPage';
export type {
  AuthorPageProps,
  AuthorArticle,
  AuthorAward,
  AuthorEducation,
} from './AuthorPage';

export { MedicalReviewer } from './MedicalReviewer';
export type { MedicalReviewerProps, MedicalCredential } from './MedicalReviewer';

export { FreshnessIndicator } from './FreshnessIndicator';
export type { FreshnessIndicatorProps } from './FreshnessIndicator';

export { TrustSignals } from './TrustSignals';
export type { TrustSignalsProps, TrustBadge, ReviewStats } from './TrustSignals';

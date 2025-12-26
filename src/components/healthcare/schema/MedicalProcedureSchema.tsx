'use client';

import React from 'react';

export type ProcedureType = 'Surgical' | 'NoninvasiveProcedure' | 'PercutaneousProcedure';

export interface MedicalProcedureSchemaProps {
  /** Procedure name */
  name: string;
  /** Procedure description */
  description?: string;
  /** Type of procedure */
  procedureType?: ProcedureType;
  /** Body location where procedure is performed */
  bodyLocation?: string;
  /** Follow-up information */
  followup?: string;
  /** How the procedure is performed */
  howPerformed?: string;
  /** Preparation required */
  preparation?: string;
  /** Procedure status */
  status?: 'EventScheduled' | 'EventCancelled' | 'EventPostponed' | 'EventRescheduled';
  /** Medical specialty */
  medicalSpecialty?: string;
  /** Risk/side effects */
  risk?: string[];
  /** Typical duration */
  procedureDuration?: string;
  /** Schema type */
  schemaType?: 'MedicalProcedure' | 'SurgicalProcedure' | 'DiagnosticProcedure' | 'TherapeuticProcedure';
  /** URL for procedure page */
  url?: string;
  /** Image of procedure/results */
  image?: string;
}

/**
 * MedicalProcedureSchema Component
 *
 * Generates JSON-LD structured data for MedicalProcedure schema.
 * Use for detailed medical treatment/procedure pages.
 */
export function MedicalProcedureSchema({
  name,
  description,
  procedureType,
  bodyLocation,
  followup,
  howPerformed,
  preparation,
  status,
  medicalSpecialty,
  risk,
  procedureDuration,
  schemaType = 'MedicalProcedure',
  url,
  image,
}: MedicalProcedureSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name,
    ...(description && { description }),
    ...(procedureType && { procedureType }),
    ...(bodyLocation && { bodyLocation }),
    ...(followup && { followup }),
    ...(howPerformed && { howPerformed }),
    ...(preparation && { preparation }),
    ...(status && { status }),
    ...(medicalSpecialty && { medicalSpecialty }),
    ...(risk && { risk: risk.join(', ') }),
    ...(procedureDuration && { procedureDuration }),
    ...(url && { url }),
    ...(image && { image }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
}

export default MedicalProcedureSchema;

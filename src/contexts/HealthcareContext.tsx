'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type {
  MedicalPractice,
  PracticeLocation,
  MedicalService,
  HealthcareQuickAction,
} from '@/types/healthcare';

export interface HealthcareContextValue {
  isHealthcareProject: boolean;
  practice: MedicalPractice | null;
  locations: PracticeLocation[];
  services: MedicalService[];
  quickActions: HealthcareQuickAction[];
  setPractice: (practice: MedicalPractice | null) => void;
  setLocations: (locations: PracticeLocation[]) => void;
  setServices: (services: MedicalService[]) => void;
  setIsHealthcareProject: (isHealthcare: boolean) => void;
  executeQuickAction: (actionId: string) => Promise<void>;
}

const HealthcareContext = createContext<HealthcareContextValue | null>(null);

const defaultQuickActions: HealthcareQuickAction[] = [
  {
    id: 'generate-local-pages',
    name: 'Generate Local SEO Pages',
    description: 'Create location×service landing pages for all combinations',
    icon: 'MapPin',
    category: 'local_seo',
    action: 'generate-local-pages',
    endpoint: '/api/healthcare/generate-local-pages',
    requiresConfirmation: true,
    estimatedTime: '2-5 minutes',
  },
  {
    id: 'add-schema-markup',
    name: 'Add Schema Markup',
    description: 'Automatically add appropriate schema.org markup to all pages',
    icon: 'Code',
    category: 'schema',
    action: 'add-schema-markup',
    endpoint: '/api/healthcare/auto-fix',
    requiresConfirmation: false,
    estimatedTime: '30 seconds',
  },
  {
    id: 'generate-faqs',
    name: 'Generate Service FAQs',
    description: 'Create FAQ sections for each service page',
    icon: 'HelpCircle',
    category: 'content',
    action: 'generate-faqs',
    endpoint: '/api/healthcare/generate-faqs',
    requiresConfirmation: true,
    estimatedTime: '1-2 minutes',
  },
  {
    id: 'add-medical-reviewer',
    name: 'Add Medical Reviewer',
    description: 'Add medical reviewer attribution to all health articles',
    icon: 'Award',
    category: 'eeat',
    action: 'add-medical-reviewer',
    endpoint: '/api/healthcare/auto-fix',
    requiresConfirmation: false,
    estimatedTime: '15 seconds',
  },
  {
    id: 'run-seo-audit',
    name: 'Run SEO Audit',
    description: 'Analyze your site for SEO issues and opportunities',
    icon: 'Search',
    category: 'audit',
    action: 'run-seo-audit',
    endpoint: '/api/healthcare/seo-audit',
    requiresConfirmation: false,
    estimatedTime: '30 seconds',
  },
  {
    id: 'generate-article',
    name: 'Generate Health Article',
    description: 'Create a new E-E-A-T compliant health article',
    icon: 'FileText',
    category: 'content',
    action: 'generate-article',
    endpoint: '/api/healthcare/generate-article',
    requiresConfirmation: true,
    estimatedTime: '3-5 minutes',
  },
];

export interface HealthcareProviderProps {
  children: React.ReactNode;
  projectId?: string;
  initialIsHealthcare?: boolean;
}

export function HealthcareProvider({
  children,
  projectId,
  initialIsHealthcare = false,
}: HealthcareProviderProps) {
  const [isHealthcareProject, setIsHealthcareProject] = useState(initialIsHealthcare);
  const [practice, setPractice] = useState<MedicalPractice | null>(null);
  const [locations, setLocations] = useState<PracticeLocation[]>([]);
  const [services, setServices] = useState<MedicalService[]>([]);

  const executeQuickAction = useCallback(async (actionId: string): Promise<void> => {
    const action = defaultQuickActions.find((a) => a.id === actionId);
    if (!action) {
      throw new Error(`Quick action not found: ${actionId}`);
    }

    if (!action.endpoint) {
      throw new Error(`Quick action has no endpoint: ${actionId}`);
    }

    const endpoint = action.endpoint;
    const response = await fetch(endpoint, {
      method: endpoint.includes('seo-audit') ? 'GET' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: endpoint.includes('seo-audit')
        ? undefined
        : JSON.stringify({ projectId, actionId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `Failed to execute action: ${actionId}`);
    }
  }, [projectId]);

  const value = useMemo<HealthcareContextValue>(() => ({
    isHealthcareProject,
    practice,
    locations,
    services,
    quickActions: defaultQuickActions,
    setPractice,
    setLocations,
    setServices,
    setIsHealthcareProject,
    executeQuickAction,
  }), [
    isHealthcareProject,
    practice,
    locations,
    services,
    executeQuickAction,
  ]);

  return (
    <HealthcareContext.Provider value={value}>
      {children}
    </HealthcareContext.Provider>
  );
}

export function useHealthcareContext(): HealthcareContextValue {
  const context = useContext(HealthcareContext);
  if (!context) {
    throw new Error('useHealthcareContext must be used within a HealthcareProvider');
  }
  return context;
}

export default HealthcareContext;

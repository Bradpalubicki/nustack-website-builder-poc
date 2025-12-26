'use client';

import { useState, useCallback, useMemo } from 'react';
import type {
  MedicalPractice,
  PracticeLocation,
  MedicalService,
  HealthArticle,
  PhysicianProfile,
  SEOAuditResult,
} from '@/types/healthcare';

export interface UseHealthcareOptions {
  projectId: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export interface HealthcareData {
  practice: MedicalPractice | null;
  locations: PracticeLocation[];
  services: MedicalService[];
  articles: HealthArticle[];
  physicians: PhysicianProfile[];
  seoAudit: SEOAuditResult | null;
}

export interface UseHealthcareReturn {
  data: HealthcareData;
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  updatePractice: (practice: Partial<MedicalPractice>) => Promise<void>;
  addLocation: (location: Omit<PracticeLocation, 'id' | 'practiceId' | 'createdAt' | 'updatedAt'>) => Promise<PracticeLocation>;
  updateLocation: (id: string, location: Partial<PracticeLocation>) => Promise<void>;
  deleteLocation: (id: string) => Promise<void>;
  addService: (service: Omit<MedicalService, 'id' | 'practiceId' | 'createdAt' | 'updatedAt'>) => Promise<MedicalService>;
  updateService: (id: string, service: Partial<MedicalService>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  runSEOAudit: (scope?: 'full' | 'quick') => Promise<SEOAuditResult>;
}

/**
 * useHealthcare Hook
 *
 * Main hook for managing healthcare practice data in the builder.
 * Provides CRUD operations and SEO audit functionality.
 */
export function useHealthcare({
  projectId,
  autoRefresh = false,
  refreshInterval = 30000,
}: UseHealthcareOptions): UseHealthcareReturn {
  const [data, setData] = useState<HealthcareData>({
    practice: null,
    locations: [],
    services: [],
    articles: [],
    physicians: [],
    seoAudit: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch all healthcare data for the project
      const [practiceRes, locationsRes, servicesRes, articlesRes, physiciansRes] = await Promise.all([
        fetch(`/api/healthcare/practice?projectId=${projectId}`),
        fetch(`/api/healthcare/locations?projectId=${projectId}`),
        fetch(`/api/healthcare/services?projectId=${projectId}`),
        fetch(`/api/healthcare/articles?projectId=${projectId}`),
        fetch(`/api/healthcare/physicians?projectId=${projectId}`),
      ]);

      const [practice, locations, services, articles, physicians] = await Promise.all([
        practiceRes.json(),
        locationsRes.json(),
        servicesRes.json(),
        articlesRes.json(),
        physiciansRes.json(),
      ]);

      setData({
        practice: practice.data || null,
        locations: locations.data || [],
        services: services.data || [],
        articles: articles.data || [],
        physicians: physicians.data || [],
        seoAudit: data.seoAudit,
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch healthcare data'));
    } finally {
      setIsLoading(false);
    }
  }, [projectId, data.seoAudit]);

  const updatePractice = useCallback(async (practice: Partial<MedicalPractice>) => {
    const response = await fetch(`/api/healthcare/practice?projectId=${projectId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(practice),
    });

    if (!response.ok) {
      throw new Error('Failed to update practice');
    }

    const result = await response.json();
    setData((prev) => ({ ...prev, practice: result.data }));
  }, [projectId]);

  const addLocation = useCallback(async (
    location: Omit<PracticeLocation, 'id' | 'practiceId' | 'createdAt' | 'updatedAt'>
  ): Promise<PracticeLocation> => {
    const response = await fetch(`/api/healthcare/locations?projectId=${projectId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(location),
    });

    if (!response.ok) {
      throw new Error('Failed to add location');
    }

    const result = await response.json();
    setData((prev) => ({ ...prev, locations: [...prev.locations, result.data] }));
    return result.data;
  }, [projectId]);

  const updateLocation = useCallback(async (id: string, location: Partial<PracticeLocation>) => {
    const response = await fetch(`/api/healthcare/locations/${id}?projectId=${projectId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(location),
    });

    if (!response.ok) {
      throw new Error('Failed to update location');
    }

    const result = await response.json();
    setData((prev) => ({
      ...prev,
      locations: prev.locations.map((l) => (l.id === id ? result.data : l)),
    }));
  }, [projectId]);

  const deleteLocation = useCallback(async (id: string) => {
    const response = await fetch(`/api/healthcare/locations/${id}?projectId=${projectId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete location');
    }

    setData((prev) => ({
      ...prev,
      locations: prev.locations.filter((l) => l.id !== id),
    }));
  }, [projectId]);

  const addService = useCallback(async (
    service: Omit<MedicalService, 'id' | 'practiceId' | 'createdAt' | 'updatedAt'>
  ): Promise<MedicalService> => {
    const response = await fetch(`/api/healthcare/services?projectId=${projectId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(service),
    });

    if (!response.ok) {
      throw new Error('Failed to add service');
    }

    const result = await response.json();
    setData((prev) => ({ ...prev, services: [...prev.services, result.data] }));
    return result.data;
  }, [projectId]);

  const updateService = useCallback(async (id: string, service: Partial<MedicalService>) => {
    const response = await fetch(`/api/healthcare/services/${id}?projectId=${projectId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(service),
    });

    if (!response.ok) {
      throw new Error('Failed to update service');
    }

    const result = await response.json();
    setData((prev) => ({
      ...prev,
      services: prev.services.map((s) => (s.id === id ? result.data : s)),
    }));
  }, [projectId]);

  const deleteService = useCallback(async (id: string) => {
    const response = await fetch(`/api/healthcare/services/${id}?projectId=${projectId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete service');
    }

    setData((prev) => ({
      ...prev,
      services: prev.services.filter((s) => s.id !== id),
    }));
  }, [projectId]);

  const runSEOAudit = useCallback(async (scope: 'full' | 'quick' = 'full'): Promise<SEOAuditResult> => {
    const response = await fetch(`/api/healthcare/seo-audit?projectId=${projectId}&scope=${scope}`);

    if (!response.ok) {
      throw new Error('Failed to run SEO audit');
    }

    const result = await response.json();
    setData((prev) => ({ ...prev, seoAudit: result.data }));
    return result.data;
  }, [projectId]);

  return {
    data,
    isLoading,
    error,
    refresh,
    updatePractice,
    addLocation,
    updateLocation,
    deleteLocation,
    addService,
    updateService,
    deleteService,
    runSEOAudit,
  };
}

export default useHealthcare;

'use client';

import { useState, useCallback, useMemo } from 'react';
import type {
  PracticeLocation,
  MedicalService,
  LocationServicePage,
  LocalSEOPageGenerationRequest,
} from '@/types/healthcare';

export interface UseLocalSEOOptions {
  projectId: string;
}

export interface LocalSEOCoverage {
  totalCombinations: number;
  coveredCombinations: number;
  missingCombinations: Array<{
    location: PracticeLocation;
    service: MedicalService;
  }>;
  coveragePercentage: number;
}

export interface UseLocalSEOReturn {
  locations: PracticeLocation[];
  services: MedicalService[];
  locationServicePages: LocationServicePage[];
  coverage: LocalSEOCoverage;
  isLoading: boolean;
  isGenerating: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  generatePage: (locationId: string, serviceId: string) => Promise<LocationServicePage>;
  generateAllMissingPages: () => Promise<LocationServicePage[]>;
  deletePage: (pageId: string) => Promise<void>;
  getPageForCombination: (locationId: string, serviceId: string) => LocationServicePage | undefined;
  getNAPConsistency: () => Promise<NAPConsistencyReport>;
}

export interface NAPConsistencyReport {
  isConsistent: boolean;
  issues: Array<{
    type: 'name' | 'address' | 'phone';
    location: string;
    expected: string;
    found: string;
    pages: string[];
  }>;
}

/**
 * useLocalSEO Hook
 *
 * Hook for managing local SEO functionality including
 * location×service page generation and NAP consistency.
 */
export function useLocalSEO({ projectId }: UseLocalSEOOptions): UseLocalSEOReturn {
  const [locations, setLocations] = useState<PracticeLocation[]>([]);
  const [services, setServices] = useState<MedicalService[]>([]);
  const [locationServicePages, setLocationServicePages] = useState<LocationServicePage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Calculate coverage
  const coverage = useMemo<LocalSEOCoverage>(() => {
    const totalCombinations = locations.length * services.length;
    const coveredCombinations = locationServicePages.length;

    const existingKeys = new Set(
      locationServicePages.map((page) => `${page.locationId}-${page.serviceId}`)
    );

    const missingCombinations: LocalSEOCoverage['missingCombinations'] = [];

    locations.forEach((location) => {
      services.forEach((service) => {
        const key = `${location.id}-${service.id}`;
        if (!existingKeys.has(key)) {
          missingCombinations.push({ location, service });
        }
      });
    });

    return {
      totalCombinations,
      coveredCombinations,
      missingCombinations,
      coveragePercentage: totalCombinations > 0
        ? Math.round((coveredCombinations / totalCombinations) * 100)
        : 0,
    };
  }, [locations, services, locationServicePages]);

  // Refresh data
  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [locationsRes, servicesRes, pagesRes] = await Promise.all([
        fetch(`/api/healthcare/locations?projectId=${projectId}`),
        fetch(`/api/healthcare/services?projectId=${projectId}`),
        fetch(`/api/healthcare/location-service-pages?projectId=${projectId}`),
      ]);

      const [locationsData, servicesData, pagesData] = await Promise.all([
        locationsRes.json(),
        servicesRes.json(),
        pagesRes.json(),
      ]);

      setLocations(locationsData.data || []);
      setServices(servicesData.data || []);
      setLocationServicePages(pagesData.data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch local SEO data'));
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  // Generate a single page
  const generatePage = useCallback(async (
    locationId: string,
    serviceId: string
  ): Promise<LocationServicePage> => {
    setIsGenerating(true);
    setError(null);

    try {
      const location = locations.find((l) => l.id === locationId);
      const service = services.find((s) => s.id === serviceId);

      if (!location || !service) {
        throw new Error('Location or service not found');
      }

      const request: LocalSEOPageGenerationRequest = {
        practiceId: projectId,
        locationId,
        serviceId,
        locationName: location.name,
        locationCity: location.city,
        locationState: location.state,
        serviceName: service.name,
        serviceSlug: service.slug,
      };

      const response = await fetch('/api/healthcare/generate-local-pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          pages: [request],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to generate page');
      }

      const result = await response.json();
      const newPage = result.data.generated[0];

      setLocationServicePages((prev) => [...prev, newPage]);
      return newPage;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, [projectId, locations, services]);

  // Generate all missing pages
  const generateAllMissingPages = useCallback(async (): Promise<LocationServicePage[]> => {
    if (coverage.missingCombinations.length === 0) {
      return [];
    }

    setIsGenerating(true);
    setError(null);

    try {
      const requests: LocalSEOPageGenerationRequest[] = coverage.missingCombinations.map(
        ({ location, service }) => ({
          practiceId: projectId,
          locationId: location.id,
          serviceId: service.id,
          locationName: location.name,
          locationCity: location.city,
          locationState: location.state,
          serviceName: service.name,
          serviceSlug: service.slug,
        })
      );

      const response = await fetch('/api/healthcare/generate-local-pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          pages: requests,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to generate pages');
      }

      const result = await response.json();
      const newPages = result.data.generated;

      setLocationServicePages((prev) => [...prev, ...newPages]);
      return newPages;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, [projectId, coverage.missingCombinations]);

  // Delete a page
  const deletePage = useCallback(async (pageId: string): Promise<void> => {
    const response = await fetch(`/api/healthcare/location-service-pages/${pageId}?projectId=${projectId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to delete page');
    }

    setLocationServicePages((prev) => prev.filter((p) => p.id !== pageId));
  }, [projectId]);

  // Get page for a specific combination
  const getPageForCombination = useCallback((
    locationId: string,
    serviceId: string
  ): LocationServicePage | undefined => {
    return locationServicePages.find(
      (page) => page.locationId === locationId && page.serviceId === serviceId
    );
  }, [locationServicePages]);

  // Check NAP consistency
  const getNAPConsistency = useCallback(async (): Promise<NAPConsistencyReport> => {
    const response = await fetch(`/api/healthcare/nap-check?projectId=${projectId}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to check NAP consistency');
    }

    const result = await response.json();
    return result.data;
  }, [projectId]);

  return {
    locations,
    services,
    locationServicePages,
    coverage,
    isLoading,
    isGenerating,
    error,
    refresh,
    generatePage,
    generateAllMissingPages,
    deletePage,
    getPageForCombination,
    getNAPConsistency,
  };
}

export default useLocalSEO;

'use client';

import { useEffect, useCallback, useState, useRef } from 'react';

export interface SchemaEntry {
  id: string;
  schema: Record<string, unknown>;
}

interface SchemaState {
  schemas: Map<string, Record<string, unknown>>;
  isReady: boolean;
}

/**
 * useSchema Hook
 *
 * A hook for dynamically adding/removing schema from pages.
 * Useful when schema data changes based on client-side state.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { addSchema, removeSchema, getSchemas } = useSchema();
 *
 *   useEffect(() => {
 *     const id = addSchema({
 *       '@type': 'LocalBusiness',
 *       name: 'My Business',
 *       // ... other properties
 *     });
 *
 *     return () => removeSchema(id);
 *   }, [addSchema, removeSchema]);
 *
 *   return <SchemaContainer schemas={getSchemas()} />;
 * }
 * ```
 */
export function useSchema() {
  const [state, setState] = useState<SchemaState>({
    schemas: new Map(),
    isReady: false,
  });

  const schemaIdCounter = useRef(0);

  // Mark as ready on mount
  useEffect(() => {
    setState((prev) => ({ ...prev, isReady: true }));
  }, []);

  /**
   * Generates a unique ID for a schema entry
   */
  const generateId = useCallback((): string => {
    schemaIdCounter.current += 1;
    return `schema-${Date.now()}-${schemaIdCounter.current}`;
  }, []);

  /**
   * Adds a schema to the page
   * @returns The ID of the added schema (used for removal)
   */
  const addSchema = useCallback((schema: Record<string, unknown>): string => {
    const id = generateId();

    setState((prev) => {
      const newSchemas = new Map(prev.schemas);
      newSchemas.set(id, {
        '@context': 'https://schema.org',
        ...schema,
      });
      return { ...prev, schemas: newSchemas };
    });

    return id;
  }, [generateId]);

  /**
   * Removes a schema from the page by ID
   */
  const removeSchema = useCallback((id: string): boolean => {
    let removed = false;

    setState((prev) => {
      if (prev.schemas.has(id)) {
        const newSchemas = new Map(prev.schemas);
        newSchemas.delete(id);
        removed = true;
        return { ...prev, schemas: newSchemas };
      }
      return prev;
    });

    return removed;
  }, []);

  /**
   * Updates an existing schema by ID
   */
  const updateSchema = useCallback(
    (id: string, schema: Record<string, unknown>): boolean => {
      let updated = false;

      setState((prev) => {
        if (prev.schemas.has(id)) {
          const newSchemas = new Map(prev.schemas);
          newSchemas.set(id, {
            '@context': 'https://schema.org',
            ...schema,
          });
          updated = true;
          return { ...prev, schemas: newSchemas };
        }
        return prev;
      });

      return updated;
    },
    []
  );

  /**
   * Gets all current schemas as an array
   */
  const getSchemas = useCallback((): Record<string, unknown>[] => {
    return Array.from(state.schemas.values());
  }, [state.schemas]);

  /**
   * Gets all schema entries with their IDs
   */
  const getSchemaEntries = useCallback((): SchemaEntry[] => {
    return Array.from(state.schemas.entries()).map(([id, schema]) => ({
      id,
      schema,
    }));
  }, [state.schemas]);

  /**
   * Clears all schemas
   */
  const clearSchemas = useCallback((): void => {
    setState((prev) => ({
      ...prev,
      schemas: new Map(),
    }));
  }, []);

  /**
   * Checks if a schema with the given ID exists
   */
  const hasSchema = useCallback(
    (id: string): boolean => {
      return state.schemas.has(id);
    },
    [state.schemas]
  );

  /**
   * Gets the count of current schemas
   */
  const schemaCount = state.schemas.size;

  return {
    addSchema,
    removeSchema,
    updateSchema,
    getSchemas,
    getSchemaEntries,
    clearSchemas,
    hasSchema,
    schemaCount,
    isReady: state.isReady,
  };
}

export default useSchema;

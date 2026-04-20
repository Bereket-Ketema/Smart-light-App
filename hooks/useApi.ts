// hooks/useApi.ts

import { useState, useCallback } from 'react';

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export function useApi(options?: UseApiOptions) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async <T>(apiCall: () => Promise<T>): Promise<T | null> => {
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await apiCall();
        options?.onSuccess?.(result);
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
        options?.onError?.(err as Error);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [options]
  );

  const clearError = () => setError(null);

  return { isLoading, error, execute, clearError };
}
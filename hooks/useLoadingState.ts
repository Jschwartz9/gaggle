import { useState, useEffect } from 'react';

interface UseLoadingStateProps {
  initialLoading?: boolean;
  loadingTime?: number;
}

/**
 * Custom hook for managing loading states with automatic timeout
 *
 * @param initialLoading - Whether to start in loading state (default: false)
 * @param loadingTime - How long to show loading in ms (default: 800)
 * @returns Object with loading state and setter
 */
export function useLoadingState({
  initialLoading = false,
  loadingTime = 800
}: UseLoadingStateProps = {}) {
  const [isLoading, setIsLoading] = useState(initialLoading);

  // Auto-hide loading after specified time
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, loadingTime);

      return () => clearTimeout(timer);
    }
  }, [isLoading, loadingTime]);

  // Function to trigger loading
  const startLoading = () => setIsLoading(true);

  // Function to stop loading immediately
  const stopLoading = () => setIsLoading(false);

  return {
    isLoading,
    startLoading,
    stopLoading,
    setIsLoading
  };
}

/**
 * Hook for managing dependency-based loading (when dependencies change)
 *
 * @param dependencies - Array of dependencies to watch
 * @param loadingTime - How long to show loading in ms
 * @returns loading state
 */
export function useDependencyLoading(dependencies: any[], loadingTime = 800) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, loadingTime);

    return () => clearTimeout(timer);
  }, dependencies);

  return isLoading;
}
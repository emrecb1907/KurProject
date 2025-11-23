import { QueryClient } from '@tanstack/react-query';

/**
 * React Query Client Configuration
 * 
 * Default options:
 * - staleTime: 5 minutes (data considered fresh for 5 min)
 * - gcTime: 10 minutes (unused data kept in cache for 10 min)
 * - retry: 3 attempts on failure
 * - refetchOnWindowFocus: true (refetch when app comes to foreground)
 */
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // How long data is considered fresh (no refetch needed)
            staleTime: 5 * 60 * 1000, // 5 minutes

            // How long unused data stays in cache (gcTime = garbage collection time)
            gcTime: 10 * 60 * 1000, // 10 minutes

            // Retry failed requests
            retry: 3,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

            // Refetch on window focus (app comes to foreground)
            refetchOnWindowFocus: true,

            // Refetch on reconnect
            refetchOnReconnect: true,

            // Don't refetch on mount if data is fresh
            refetchOnMount: true,
        },
        mutations: {
            // Retry mutations on failure
            retry: 1,
        },
    },
});

import { logger } from './logger';

/**
 * Centralized Error Handler
 * Provides consistent error handling across the application
 */

export interface ErrorHandlerOptions {
    showToUser?: boolean;
    logToConsole?: boolean;
    context?: string;
}

/**
 * Handle errors in a consistent way
 */
export function handleError(
    error: unknown,
    options: ErrorHandlerOptions = {}
): void {
    const {
        showToUser = false,
        logToConsole = true,
        context = 'Unknown',
    } = options;

    const errorMessage = error instanceof Error ? error.message : String(error);

    if (logToConsole) {
        logger.error(`[${context}] ${errorMessage}`, error);
    }

    // In production, you could:
    // 1. Send to error tracking service (Sentry, Firebase Crashlytics)
    // 2. Show user-friendly message
    // 3. Log to analytics

    if (showToUser) {
        // You could show a Toast or Alert here
        // Example: Toast.show({ type: 'error', text: errorMessage });
    }
}

/**
 * Async error wrapper - catches errors in async functions
 */
export async function asyncErrorHandler<T>(
    fn: () => Promise<T>,
    context: string,
    options: ErrorHandlerOptions = {}
): Promise<T | null> {
    try {
        return await fn();
    } catch (error) {
        handleError(error, { ...options, context });
        return null;
    }
}

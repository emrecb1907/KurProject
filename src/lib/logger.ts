/**
 * Centralized Logging Service
 * Provides consistent logging across the application
 */

const isDev = __DEV__;

export const logger = {
    /**
     * Log informational messages
     */
    info: (message: string, data?: any) => {
        if (isDev) {
            console.log(message, data || '');
        }
    },

    /**
     * Log success messages
     */
    success: (message: string, data?: any) => {
        if (isDev) {
            console.log(`✅ ${message}`, data || '');
        }
    },

    /**
     * Log warning messages
     */
    warn: (message: string, data?: any) => {
        if (isDev) {
            console.warn(`⚠️ ${message}`, data || '');
        }
    },

    /**
     * Log error messages
     */
    error: (message: string, error?: any) => {
        if (isDev) {
            console.error(`❌ ${message}`, error || '');
        }
        // In production, you could send to Sentry, Firebase Crashlytics, etc.
        // Example: Sentry.captureException(error);
    },

    /**
     * Log game events
     */
    game: (event: string, data?: any) => {
        if (isDev) {
            console.log(`🎮 [Game] ${event}`, data || '');
        }
    },

    /**
     * Log level up events
     */
    levelUp: (newLevel: number) => {
        if (isDev) {
            console.log(`🎉 Level Up! New level: ${newLevel}`);
        }
    },
};

import * as Sentry from '@sentry/react-native';
import { Alert } from 'react-native';

export enum ErrorSeverity {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    CRITICAL = 'critical',
}

export interface AppError {
    code: string;
    message: string;
    userMessage: string;
    severity: ErrorSeverity;
    context?: Record<string, any>;
    originalError?: Error | unknown;
}

class ErrorHandler {
    private static instance: ErrorHandler;
    private isInitialized = false;

    private constructor() {
        // Singleton
    }

    static getInstance(): ErrorHandler {
        if (!ErrorHandler.instance) {
            ErrorHandler.instance = new ErrorHandler();
        }
        return ErrorHandler.instance;
    }

    init() {
        if (this.isInitialized) return;

        const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;

        if (!dsn) {
            if (__DEV__) {
                console.warn('⚠️ Sentry DSN is missing. Error tracking will be disabled.');
            }
            return;
        }

        try {
            Sentry.init({
                dsn: dsn,
                debug: __DEV__, // Only debug in development
                enableInExpoDevelopment: true,
                tracesSampleRate: 0.2, // Adjust for production (e.g., 0.2)
            });

            this.isInitialized = true;
            if (__DEV__) {
                console.log('✅ ErrorHandler (Sentry) initialized');
            }
        } catch (error) {
            console.error('❌ Failed to initialize Sentry:', error);
        }
    }

    handleError(error: Error | AppError | unknown, context?: Record<string, any>) {
        const appError = this.normalizeError(error);

        // Log to console in development
        if (__DEV__) {
            console.error('[AppError]', {
                code: appError.code,
                message: appError.message,
                severity: appError.severity,
                context: { ...appError.context, ...context },
                original: appError.originalError
            });
        }

        // Send to Sentry
        if (this.isInitialized) {
            Sentry.captureException(appError.originalError || new Error(appError.message), {
                level: this.getSentryLevel(appError.severity),
                extra: {
                    code: appError.code,
                    userMessage: appError.userMessage,
                    ...appError.context,
                    ...context,
                },
                tags: {
                    severity: appError.severity,
                    code: appError.code,
                }
            });
        }

        // Show user-facing message (if critical or high severity)
        if (appError.severity === ErrorSeverity.HIGH ||
            appError.severity === ErrorSeverity.CRITICAL) {
            this.showUserError(appError.userMessage);
        }
    }

    private normalizeError(error: Error | AppError | unknown): AppError {
        if (this.isAppError(error)) {
            return error;
        }

        const err = error as Error;
        return {
            code: 'UNKNOWN_ERROR',
            message: err.message || 'Unknown error occurred',
            userMessage: 'Beklenmedik bir hata oluştu. Lütfen tekrar deneyin.',
            severity: ErrorSeverity.MEDIUM,
            originalError: error,
        };
    }

    private isAppError(error: any): error is AppError {
        return error && typeof error === 'object' && 'code' in error && 'severity' in error;
    }

    private getSentryLevel(severity: ErrorSeverity): Sentry.SeverityLevel {
        switch (severity) {
            case ErrorSeverity.LOW: return 'info';
            case ErrorSeverity.MEDIUM: return 'warning';
            case ErrorSeverity.HIGH: return 'error';
            case ErrorSeverity.CRITICAL: return 'fatal';
            default: return 'error';
        }
    }

    private showUserError(message: string) {
        // In the future, replace with a custom Toast or Modal
        Alert.alert('Hata', message);
    }
}

export const errorHandler = ErrorHandler.getInstance();

// Convenience functions
export function logError(error: Error | unknown, context?: Record<string, any>) {
    errorHandler.handleError(error, context);
}

export function logCritical(error: Error | unknown, context?: Record<string, any>) {
    const message = error instanceof Error ? error.message : String(error);

    const appError: AppError = {
        code: 'CRITICAL_ERROR',
        message: message,
        userMessage: 'Kritik bir hata oluştu. Lütfen uygulamayı yeniden başlatın.',
        severity: ErrorSeverity.CRITICAL,
        originalError: error,
    };
    errorHandler.handleError(appError, context);
}

import { TFunction } from 'i18next';

/**
 * Maps raw database/API error messages to user-friendly localized messages.
 * This prevents exposing technical error details to end users.
 * 
 * @param message - Raw error message from database/API
 * @param t - i18next translation function
 * @param fallback - Optional fallback message if no match found
 * @returns User-friendly localized error message
 */
export function mapDatabaseError(
    message: string | undefined | null,
    t: TFunction,
    fallback?: string
): string {
    if (!message) {
        return t('errors.database.general');
    }

    const lowerMessage = message.toLowerCase();

    // Duplicate key / Already exists errors
    if (
        lowerMessage.includes('duplicate') ||
        lowerMessage.includes('already exists') ||
        lowerMessage.includes('unique constraint') ||
        lowerMessage.includes('zaten kullanıl')
    ) {
        return t('errors.database.duplicate');
    }

    // Network / Connection errors
    if (
        lowerMessage.includes('network') ||
        lowerMessage.includes('connection') ||
        lowerMessage.includes('refused') ||
        lowerMessage.includes('bağlantı')
    ) {
        return t('errors.database.connection');
    }

    // Validation / Invalid input errors
    if (
        lowerMessage.includes('invalid') ||
        lowerMessage.includes('validation') ||
        lowerMessage.includes('geçersiz')
    ) {
        return t('errors.database.validation');
    }

    // Not found errors
    if (
        lowerMessage.includes('not found') ||
        lowerMessage.includes('bulunamadı')
    ) {
        return t('errors.database.notFound');
    }

    // Timeout errors
    if (
        lowerMessage.includes('timeout') ||
        lowerMessage.includes('zaman aşımı')
    ) {
        return t('errors.database.timeout');
    }

    // Default fallback
    return fallback || t('errors.database.general');
}

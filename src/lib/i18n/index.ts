import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import tr, { en } from './locales';

// Get device language (not used yet, but ready for future)
const deviceLanguage = getLocales()[0]?.languageCode ?? 'tr';

i18n
    .use(initReactI18next)
    .init({
        compatibilityJSON: 'v3', // For Android compatibility
        resources: {
            tr: { translation: tr },
            en: { translation: en },
        },
        lng: 'tr', // Default to Turkish
        fallbackLng: 'tr',
        interpolation: {
            escapeValue: false, // React already escapes values
        },
        react: {
            useSuspense: false, // Avoids issues on Android
        },
    });

// Export function to change language
export const changeLanguage = (lang: 'tr' | 'en') => {
    i18n.changeLanguage(lang);
};

export default i18n;

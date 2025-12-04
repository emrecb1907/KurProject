import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tr, { en } from './locales';

const LANGUAGE_KEY = '@app_language';

// Get device language (not used yet, but ready for future)
const deviceLanguage = getLocales()[0]?.languageCode ?? 'tr';

i18n
    .use(initReactI18next)
    .init({
        compatibilityJSON: 'v4', // For Android compatibility
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

// Load saved language from AsyncStorage
export const loadSavedLanguage = async (): Promise<'tr' | 'en'> => {
    try {
        const savedLang = await AsyncStorage.getItem(LANGUAGE_KEY);
        if (savedLang === 'tr' || savedLang === 'en') {
            i18n.changeLanguage(savedLang);
            return savedLang;
        }
    } catch (error) {
        console.error('Error loading saved language:', error);
    }
    return 'tr';
};

// Export function to change language and save to AsyncStorage
export const changeLanguage = async (lang: 'tr' | 'en'): Promise<void> => {
    try {
        await AsyncStorage.setItem(LANGUAGE_KEY, lang);
        i18n.changeLanguage(lang);
    } catch (error) {
        console.error('Error saving language:', error);
        i18n.changeLanguage(lang);
    }
};

// Get current language
export const getCurrentLanguage = (): 'tr' | 'en' => {
    return (i18n.language as 'tr' | 'en') || 'tr';
};

export default i18n;

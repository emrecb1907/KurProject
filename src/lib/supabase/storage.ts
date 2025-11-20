import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * Custom storage adapter for Supabase Auth using Expo Secure Store.
 * This ensures that authentication tokens are stored securely on the device.
 * 
 * Note: SecureStore is not available on web, so we fallback to localStorage or null.
 */
export const ExpoSecureStoreAdapter = {
    getItem: (key: string) => {
        if (Platform.OS === 'web') {
            if (typeof localStorage === 'undefined') return null;
            return localStorage.getItem(key);
        }
        return SecureStore.getItemAsync(key);
    },
    setItem: (key: string, value: string) => {
        if (Platform.OS === 'web') {
            if (typeof localStorage === 'undefined') return;
            localStorage.setItem(key, value);
            return;
        }
        return SecureStore.setItemAsync(key, value);
    },
    removeItem: (key: string) => {
        if (Platform.OS === 'web') {
            if (typeof localStorage === 'undefined') return;
            localStorage.removeItem(key);
            return;
        }
        return SecureStore.deleteItemAsync(key);
    },
};

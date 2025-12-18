import * as Haptics from 'expo-haptics';
import { useStore } from '@/store';

/**
 * Haptic feedback utility functions that respect user preferences.
 * These functions check hapticsEnabled before triggering vibration.
 */

export const hapticLight = () => {
    const hapticsEnabled = useStore.getState().hapticsEnabled;
    if (hapticsEnabled) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
};

export const hapticMedium = () => {
    const hapticsEnabled = useStore.getState().hapticsEnabled;
    if (hapticsEnabled) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
};

export const hapticHeavy = () => {
    const hapticsEnabled = useStore.getState().hapticsEnabled;
    if (hapticsEnabled) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
};

export const hapticSelection = () => {
    const hapticsEnabled = useStore.getState().hapticsEnabled;
    if (hapticsEnabled) {
        Haptics.selectionAsync();
    }
};

export const hapticNotification = (type: Haptics.NotificationFeedbackType) => {
    const hapticsEnabled = useStore.getState().hapticsEnabled;
    if (hapticsEnabled) {
        Haptics.notificationAsync(type);
    }
};

export const hapticSuccess = () => hapticNotification(Haptics.NotificationFeedbackType.Success);
export const hapticWarning = () => hapticNotification(Haptics.NotificationFeedbackType.Warning);
export const hapticError = () => hapticNotification(Haptics.NotificationFeedbackType.Error);

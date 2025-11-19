import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

const DEVICE_ID_KEY = '@quranlearn:device_id';

/**
 * Generate a unique device identifier
 * This is used for anonymous users
 */
function generateDeviceId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const platform = Platform.OS;
  return `${platform}_${timestamp}_${random}`;
}

/**
 * Get or create a device ID
 * Stored in AsyncStorage for persistence
 */
export async function getDeviceId(): Promise<string> {
  try {
    // Try to get existing device ID
    let deviceId = await AsyncStorage.getItem(DEVICE_ID_KEY);

    if (!deviceId) {
      // Generate new device ID
      deviceId = generateDeviceId();
      await AsyncStorage.setItem(DEVICE_ID_KEY, deviceId);
    }

    return deviceId;
  } catch (error) {
    console.error('Error getting device ID:', error);
    // Fallback to a temporary ID
    return generateDeviceId();
  }
}

/**
 * Clear device ID (used when user logs in)
 */
export async function clearDeviceId(): Promise<void> {
  try {
    await AsyncStorage.removeItem(DEVICE_ID_KEY);
  } catch (error) {
    console.error('Error clearing device ID:', error);
  }
}

/**
 * Get device information
 */
export async function getDeviceInfo() {
  return {
    brand: Device.brand,
    manufacturer: Device.manufacturer,
    modelName: Device.modelName,
    osName: Device.osName,
    osVersion: Device.osVersion,
    platform: Platform.OS,
    deviceType: Device.deviceType,
  };
}

/**
 * Check if device ID exists
 */
export async function hasDeviceId(): Promise<boolean> {
  try {
    const deviceId = await AsyncStorage.getItem(DEVICE_ID_KEY);
    return !!deviceId;
  } catch (error) {
    return false;
  }
}


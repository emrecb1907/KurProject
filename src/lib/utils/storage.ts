import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  USER_DATA: '@quranlearn:user_data',
  PROGRESS: '@quranlearn:progress',
  SETTINGS: '@quranlearn:settings',
  AD_REWARDS: '@quranlearn:ad_rewards',
  LAST_SYNC: '@quranlearn:last_sync',
} as const;

/**
 * Generic storage utility
 */
export const storage = {
  // Set item
  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('Error setting item:', error);
      throw error;
    }
  },

  // Get item
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error getting item:', error);
      return null;
    }
  },

  // Remove item
  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing item:', error);
      throw error;
    }
  },

  // Clear all
  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  },

  // Get multiple items
  async multiGet(keys: string[]): Promise<Record<string, any>> {
    try {
      const pairs = await AsyncStorage.multiGet(keys);
      const result: Record<string, any> = {};
      
      pairs.forEach(([key, value]) => {
        if (value) {
          try {
            result[key] = JSON.parse(value);
          } catch {
            result[key] = value;
          }
        }
      });
      
      return result;
    } catch (error) {
      console.error('Error getting multiple items:', error);
      return {};
    }
  },

  // Set multiple items
  async multiSet(keyValuePairs: [string, any][]): Promise<void> {
    try {
      const pairs = keyValuePairs.map(([key, value]) => [
        key,
        JSON.stringify(value),
      ]) as [string, string][];
      
      await AsyncStorage.multiSet(pairs);
    } catch (error) {
      console.error('Error setting multiple items:', error);
      throw error;
    }
  },
};

/**
 * User data storage
 */
export const userStorage = {
  async save(userData: any): Promise<void> {
    return storage.setItem(STORAGE_KEYS.USER_DATA, userData);
  },

  async get(): Promise<any> {
    return storage.getItem(STORAGE_KEYS.USER_DATA);
  },

  async clear(): Promise<void> {
    return storage.removeItem(STORAGE_KEYS.USER_DATA);
  },
};

/**
 * Progress storage
 */
export const progressStorage = {
  async save(progress: any): Promise<void> {
    return storage.setItem(STORAGE_KEYS.PROGRESS, progress);
  },

  async get(): Promise<any> {
    return storage.getItem(STORAGE_KEYS.PROGRESS);
  },

  async clear(): Promise<void> {
    return storage.removeItem(STORAGE_KEYS.PROGRESS);
  },
};

/**
 * Settings storage
 */
export const settingsStorage = {
  async save(settings: any): Promise<void> {
    return storage.setItem(STORAGE_KEYS.SETTINGS, settings);
  },

  async get(): Promise<any> {
    return storage.getItem(STORAGE_KEYS.SETTINGS);
  },

  async clear(): Promise<void> {
    return storage.removeItem(STORAGE_KEYS.SETTINGS);
  },
};

/**
 * Ad rewards storage (for tracking daily ad watches)
 */
export const adRewardsStorage = {
  async save(rewards: any): Promise<void> {
    return storage.setItem(STORAGE_KEYS.AD_REWARDS, rewards);
  },

  async get(): Promise<any> {
    return storage.getItem(STORAGE_KEYS.AD_REWARDS);
  },

  async clear(): Promise<void> {
    return storage.removeItem(STORAGE_KEYS.AD_REWARDS);
  },
};

/**
 * Last sync timestamp
 */
export const syncStorage = {
  async setLastSync(timestamp: string): Promise<void> {
    return storage.setItem(STORAGE_KEYS.LAST_SYNC, timestamp);
  },

  async getLastSync(): Promise<string | null> {
    return storage.getItem(STORAGE_KEYS.LAST_SYNC);
  },
};


/**
 * Data Migration Utility
 * 
 * Purpose: Migrate local user data (AsyncStorage) to Supabase
 * When: Called after user registers or logs in
 * 
 * Steps:
 * 1. Read local data from Zustand store (which persists to AsyncStorage)
 * 2. Update user record in Supabase with local data
 * 3. Clear local data (optional, or keep for offline access)
 */

import { database } from '@/lib/supabase/database';
import { useStore } from '@/store';

/**
 * Migrate local user data to database
 * @param userId - The authenticated user's ID
 */
export async function migrateLocalDataToDatabase(userId: string): Promise<void> {
  try {
    console.log('🔄 Starting data migration for user:', userId);

    // Get current local data from Zustand store
    const store = useStore.getState();
    const { totalXP, currentLives, streak, badges, boundUserId } = store;

    // SECURITY: Do not migrate if bound to a different user
    if (boundUserId && boundUserId !== userId) {
      console.warn('🔒 Security: Attempted to migrate data bound to different user. Aborting.');
      console.warn(`🔒 Bound: ${boundUserId}, Target: ${userId}`);
      return;
    }

    // Check if there's any local data to migrate
    const hasLocalData = totalXP > 0 || currentLives < 5 || streak > 0 || (badges && badges.length > 0);

    if (!hasLocalData) {
      console.log('ℹ️ No local data to migrate (fresh user)');
      return;
    }

    console.log('📦 Migrating local data:', {
      totalXP,
      currentLives,
      streak,
      badgesCount: badges ? badges.length : 0,
    });

    // Calculate current level from XP
    const currentLevel = calculateLevel(totalXP);

    // Update user record in database with local data
    const { error } = await database.users.update(userId, {
      total_xp: totalXP,
      current_level: currentLevel,
      current_lives: currentLives,
      streak_count: streak,
      // Note: We don't migrate badges yet (need badge system implementation)
    });

    if (error) {
      console.error('❌ Failed to migrate data:', error);
      throw error;
    }

    console.log('✅ Data migration successful!');
    console.log('📊 Migrated:', {
      totalXP,
      currentLevel,
      currentLives,
      streak,
    });

    // Optional: Clear local data after successful migration
    // Uncomment if you want to clear AsyncStorage after migration
    // await clearLocalData();
  } catch (error) {
    console.error('❌ Data migration error:', error);
    // Don't throw - migration failure shouldn't prevent login
    // User can continue with their database data or local data
  }
}

/**
 * Calculate level from total XP
 * Formula: required_xp = round(10 * level^1.4)
 */
function calculateLevel(totalXP: number): number {
  let level = 1;
  let requiredXP = 10;

  while (totalXP >= requiredXP) {
    level++;
    requiredXP = Math.round(10 * Math.pow(level, 1.4));
  }

  return level;
}

/**
 * Clear local data from AsyncStorage
 * Optional: Call after successful migration
 */
async function clearLocalData(): Promise<void> {
  try {
    const { resetUserData } = useStore.getState();
    resetUserData();
    console.log('🗑️ Local data cleared');
  } catch (error) {
    console.error('❌ Failed to clear local data:', error);
  }
}

/**
 * Check if user has local data that needs migration
 * Useful for showing "Login to save progress" prompt
 */
export function hasLocalDataToMigrate(): boolean {
  const { totalXP, streak, badges } = useStore.getState();
  return totalXP > 0 || streak > 0 || (badges && badges.length > 0);
}

/**
 * Get local data summary for display
 * Example: "You have 150 XP and 5 badges. Login to save!"
 */
export function getLocalDataSummary() {
  const { totalXP, streak, badges, currentLives } = useStore.getState();
  const currentLevel = calculateLevel(totalXP);

  return {
    totalXP,
    currentLevel,
    streak,
    badgesCount: badges ? badges.length : 0,
    currentLives,
    hasData: hasLocalDataToMigrate(),
  };
}


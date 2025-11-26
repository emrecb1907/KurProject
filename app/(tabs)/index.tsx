import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { useEffect, useCallback, useMemo, useState, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors } from '@/constants/colors';
import { useStatusBar } from '@/hooks/useStatusBar';
import { Heart, Star } from 'phosphor-react-native';
import { getXPProgress, formatXP } from '@/lib/utils/levelCalculations';
import { useUser, useAuth } from '@/store';
import { database } from '@/lib/supabase/database';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';

// Import new tab components
import { GenelTab } from '@/components/home/GenelTab';
import { DerslerTab } from '@/components/home/DerslerTab';
import { TestlerTab } from '@/components/home/TestlerTab';

export default function HomePage() {
  const { t } = useTranslation();
  const { statusBarStyle } = useStatusBar();
  const { themeVersion } = useTheme();

  // Get user data from Zustand store
  const { totalXP, currentLives, setTotalXP } = useUser();
  const { isAuthenticated, user } = useAuth();

  // Track last XP update time to avoid race conditions
  const lastXPUpdateRef = useRef<number>(0);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTotalXPRef = useRef<number>(totalXP);

  // 🔄 Sync XP from database for authenticated users (on focus)
  useFocusEffect(
    useCallback(() => {
      async function syncXPFromDB() {
        if (isAuthenticated && user?.id) {
          try {
            // Skip sync if we just updated XP (within last 2 seconds) to avoid race conditions
            const timeSinceLastUpdate = Date.now() - lastXPUpdateRef.current;
            if (timeSinceLastUpdate < 2000) {
              return;
            }

            const { data: userData } = await database.users.getById(user.id);
            if (userData) {
              const xpDifference = Math.abs(userData.total_xp - totalXP);
              const xpIncreased = totalXP > lastTotalXPRef.current;
              
              if (userData.total_xp > totalXP) {
                setTotalXP(userData.total_xp);
                lastTotalXPRef.current = userData.total_xp;
              } else if (userData.total_xp < totalXP) {
                // Only sync if difference is significant (more than 100 XP) to avoid cache timing issues
                // OR if XP didn't just increase (meaning it's a real sync issue, not cache)
                if (xpDifference > 100 || !xpIncreased) {
                  const { calculateLevel } = require('@constants/xp');
                  const newLevel = calculateLevel(totalXP);
                  const { error } = await database.users.update(user.id, {
                    total_xp: totalXP,
                    total_score: totalXP,
                    current_level: newLevel,
                  });
                  if (error) {
                    console.error('❌ Failed to sync local XP to DB:', error);
                  } else {
                    lastXPUpdateRef.current = Date.now();
                    lastTotalXPRef.current = totalXP;
                  }
                }
              } else {
                lastTotalXPRef.current = totalXP;
              }
            }
          } catch (error) {
            console.error('❌ Failed to sync XP from DB:', error);
          }
        }
      }

      // Clear any pending sync
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }

      // Debounce sync by 500ms to avoid rapid calls
      syncTimeoutRef.current = setTimeout(() => {
        syncXPFromDB();
      }, 500);

      return () => {
        if (syncTimeoutRef.current) {
          clearTimeout(syncTimeoutRef.current);
        }
      };
    }, [isAuthenticated, user?.id, totalXP])
  );

  // Calculate XP progress using the formula
  const xpProgress = getXPProgress(totalXP);

  // Animated XP bar width
  const animatedXPWidth = useSharedValue(xpProgress.progressPercentage);

  // Update animated width when XP changes
  useEffect(() => {
    animatedXPWidth.value = withTiming(xpProgress.progressPercentage, {
      duration: 300,
      easing: Easing.out(Easing.quad),
    });
  }, [xpProgress.progressPercentage]);

  const animatedXPStyle = useAnimatedStyle(() => {
    return {
      width: `${animatedXPWidth.value}%`,
    };
  });

  // Page Navigation State
  const [selectedCategory, setSelectedCategory] = useState<'genel' | 'dersler' | 'testler'>('genel');
  const screenWidth = Dimensions.get('window').width;

  // Handle category change
  const handleCategoryChange = (category: 'genel' | 'dersler' | 'testler') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCategory(category);
  };

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundDarker,
    },
    topBar: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 12,
      backgroundColor: colors.backgroundDarker,
      borderBottomWidth: 2,
      borderBottomColor: colors.primary,
    },
    statBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 16,
      gap: 4,
    },
    statValue: {
      fontSize: 14,
      fontWeight: 'bold',
      color: colors.textPrimary,
    },
    xpContainer: {
      flex: 1,
      marginHorizontal: 12,
      justifyContent: 'center',
    },
    xpBarBackground: {
      height: 32,
      backgroundColor: colors.surface,
      borderRadius: 16,
      overflow: 'hidden',
      borderWidth: 2,
      borderColor: colors.border,
      position: 'relative',
      justifyContent: 'center',
    },
    xpBarFill: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      backgroundColor: colors.primary,
      borderRadius: 14,
    },
    xpText: {
      fontSize: 12,
      fontWeight: 'bold',
      color: colors.textPrimary,
      textAlign: 'center',
      zIndex: 1,
    },
    categoryBar: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 12,
    },
    categoryButton: {
      flex: 1,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    categoryButtonActive: {
      backgroundColor: colors.success,
    },
    categoryButtonInactive: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    categoryButtonText: {
      fontSize: 14,
      fontWeight: '600',
    },
    categoryButtonTextActive: {
      color: colors.textOnPrimary,
    },
    categoryButtonTextInactive: {
      color: colors.textSecondary,
    },
    contentWrapper: {
      flex: 1,
      backgroundColor: colors.background,
    },
  }), [themeVersion]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style={statusBarStyle} />

      {/* Top Bar - Stats */}
      <View style={styles.topBar}>
        {/* Level Badge */}
        <View style={styles.statBadge}>
          <Star size={16} color={colors.primary} weight="fill" />
          <Text style={styles.statValue}>{xpProgress.currentLevel}</Text>
        </View>

        {/* XP Bar */}
        <View style={styles.xpContainer}>
          <View style={styles.xpBarBackground}>
            <Text style={styles.xpText}>
              {formatXP(xpProgress.currentLevelXP)} / {formatXP(xpProgress.requiredXP)} XP
            </Text>
            <Animated.View style={[styles.xpBarFill, animatedXPStyle]} />
          </View>
        </View>

        {/* Lives Badge */}
        <View style={styles.statBadge}>
          <Heart size={16} color={colors.error} weight="fill" />
          <Text style={styles.statValue}>{currentLives}</Text>
        </View>
      </View>

      {/* Category Selection Bar */}
      <View style={styles.categoryBar}>
        <Pressable
          style={[
            styles.categoryButton,
            selectedCategory === 'genel' ? styles.categoryButtonActive : styles.categoryButtonInactive
          ]}
          onPress={() => handleCategoryChange('genel')}
        >
          <Text style={[
            styles.categoryButtonText,
            selectedCategory === 'genel' ? styles.categoryButtonTextActive : styles.categoryButtonTextInactive
          ]}>
            {t('home.general')}
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.categoryButton,
            selectedCategory === 'dersler' ? styles.categoryButtonActive : styles.categoryButtonInactive
          ]}
          onPress={() => handleCategoryChange('dersler')}
        >
          <Text style={[
            styles.categoryButtonText,
            selectedCategory === 'dersler' ? styles.categoryButtonTextActive : styles.categoryButtonTextInactive
          ]}>
            {t('home.lessons')}
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.categoryButton,
            selectedCategory === 'testler' ? styles.categoryButtonActive : styles.categoryButtonInactive
          ]}
          onPress={() => handleCategoryChange('testler')}
        >
          <Text style={[
            styles.categoryButtonText,
            selectedCategory === 'testler' ? styles.categoryButtonTextActive : styles.categoryButtonTextInactive
          ]}>
            {t('home.tests')}
          </Text>
        </Pressable>
      </View>

      {/* Main Content Area */}
      <View style={styles.contentWrapper}>
        <View style={{ display: selectedCategory === 'genel' ? 'flex' : 'none', flex: 1 }}>
          <GenelTab screenWidth={screenWidth} />
        </View>
        <View style={{ display: selectedCategory === 'dersler' ? 'flex' : 'none', flex: 1 }}>
          <DerslerTab screenWidth={screenWidth} />
        </View>
        <View style={{ display: selectedCategory === 'testler' ? 'flex' : 'none', flex: 1 }}>
          <TestlerTab screenWidth={screenWidth} />
        </View>
      </View>
    </SafeAreaView>
  );
}

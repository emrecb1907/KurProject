import { View, Text, StyleSheet, ScrollView, Pressable, Alert, LayoutAnimation, Dimensions, PanResponder } from 'react-native';
import { useEffect, useCallback, useMemo, useState, useRef } from 'react';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  Easing,
  FadeInUp,
  FadeOutDown,
  runOnJS
} from 'react-native-reanimated';
import { colors } from '@constants/colors';
import { useStatusBar } from '@/hooks/useStatusBar';
import {
  Heart,
  BookOpen,
  BookBookmark,
  Lock,
  Star,
  Play
} from 'phosphor-react-native';
import { getXPProgress, formatXP } from '@/lib/utils/levelCalculations';
import { useUser, useAuth, useStore } from '@/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase/client';
import { database } from '@/lib/supabase/database';
import { WeeklyActivity } from '@/components/home/WeeklyActivity';
import { DailyHadith } from '@/components/home/DailyHadith';
import { HoverCard } from '@/components/ui/HoverCard';
import * as Haptics from 'expo-haptics';

import { useTranslation } from 'react-i18next';

export default function HomePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { statusBarStyle, activeTheme, themeVersion } = useStatusBar(); // Include themeVersion to trigger re-render

  // Get user data from Zustand store
  const { totalXP, currentLives, addXP, setTotalXP, resetUserData, addLives, removeLives } = useUser();
  const { isAuthenticated, user } = useAuth();

  // 🔄 Sync XP from database for authenticated users (on focus)
  useFocusEffect(
    useCallback(() => {
      async function syncXPFromDB() {
        if (isAuthenticated && user?.id) {
          try {
            console.log('🔄 Fetching latest XP from database...');
            const { data: userData } = await database.users.getById(user.id);
            if (userData) {
              if (userData.total_xp > totalXP) {
                console.log('🔄 XP updated from DB:', totalXP, '→', userData.total_xp);
                setTotalXP(userData.total_xp);
              } else if (userData.total_xp < totalXP) {
                console.log('⏳ Local XP is ahead of DB (pending sync):', totalXP, '>', userData.total_xp);
              } else {
                console.log('✅ XP already in sync:', userData.total_xp);
              }
            }
          } catch (error) {
            console.error('❌ Failed to sync XP from DB:', error);
          }
        } else {
          console.log('ℹ️ Anonymous user - using local XP:', totalXP);
        }
      }

      syncXPFromDB();

    }, [isAuthenticated, user?.id, totalXP])
  );

  // 🔄 Close lesson card when leaving the tab
  useFocusEffect(
    useCallback(() => {
      return () => {
        // When screen loses focus (navigating to another tab)
        setSelectedTest(null);
      };
    }, [])
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

  // 🧪 TEST: Add 100 XP
  const handleAddXP = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    addXP(100);

    // If authenticated, sync to database
    if (isAuthenticated && user?.id) {
      try {
        await database.users.updateXP(user.id, 100);
        console.log('✅ XP synced to database');
      } catch (error) {
        console.error('❌ Failed to sync XP to database:', error);
      }
    }

    Alert.alert(t('home.xpAdded'), `+100 XP!\n\n${t('common.success')}: ${formatXP(totalXP + 100)} XP`);
  };

  // 🧪 TEST: Add 1000 XP
  const handleAdd1000XP = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    addXP(1000);

    // If authenticated, sync to database
    if (isAuthenticated && user?.id) {
      try {
        await database.users.updateXP(user.id, 1000);
        console.log('✅ XP synced to database');
      } catch (error) {
        console.error('❌ Failed to sync XP to database:', error);
      }
    }

    Alert.alert('⚡ Bonus!', `+1000 XP!\n\n${t('common.success')}: ${formatXP(totalXP + 1000)} XP`);
  };

  // 🔄 TEST: Sync XP to Database (one-time fix)
  const handleSyncXP = async () => {
    if (!isAuthenticated || !user?.id) {
      Alert.alert(t('common.error'), t('errors.authRequired'));
      return;
    }

    try {
      const { database } = await import('@/lib/supabase/database');

      // Get current database XP
      const { data: userData } = await database.users.getById(user.id);
      const dbXP = userData?.total_xp || 0;
      const localXP = totalXP;

      console.log('🔄 Syncing XP:', { dbXP, localXP });

      if (localXP > dbXP) {
        // Update database with local XP
        await database.users.update(user.id, {
          total_xp: localXP,
          total_score: localXP,
        });

        Alert.alert(
          t('home.xpSynced'),
          `Database: ${formatXP(dbXP)} XP\nLocal: ${formatXP(localXP)} XP`
        );
        console.log('✅ XP synced successfully');
      } else if (dbXP > localXP) {
        // Database has more XP than local (shouldn't happen but handle it)
        setTotalXP(dbXP);
        Alert.alert(
          'ℹ️ Local XP Updated',
          `Local: ${formatXP(localXP)} XP\nDatabase: ${formatXP(dbXP)} XP`
        );
        console.log('✅ Local XP updated from database');
      } else {
        Alert.alert('ℹ️ Synced', t('home.xpSynced'));
      }
    } catch (error) {
      console.error('❌ Sync error:', error);
      Alert.alert(t('common.error'), 'Sync failed');
    }
  };

  // 🎨 TEST: Clear theme cache (reset to system default)
  const handleClearThemeCache = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await AsyncStorage.removeItem('quranlearn-theme');
      console.log('✅ Theme cache cleared');
      Alert.alert(
        t('home.themeCache'),
        'Cache cleared.',
        [
          {
            text: t('common.ok'),
            onPress: () => {
              router.replace('/');
            },
          },
        ]
      );
    } catch (error) {
      console.error('❌ Clear theme cache error:', error);
      Alert.alert(t('common.error'), 'Failed to clear cache');
    }
  };

  // 🧹 TEST: Clear all user progress (keep account, reset XP/Level/Lives)
  const handleClearData = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert(
      t('home.resetProgress'),
      'Are you sure?',
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.ok'),
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('🗑️ Resetting user progress...');

              // 1. Reset database user data (if authenticated) - BEFORE sign out!
              if (isAuthenticated && user?.id) {
                console.log('🔄 Resetting database progress for user:', user.id);
                await database.users.update(user.id, {
                  total_xp: 0,
                  current_level: 1,
                  total_score: 0,
                  current_lives: 5,
                  streak_count: 0,
                  updated_at: new Date().toISOString(),
                });
                console.log('✅ Database progress reset');
              }

              // 2. Sign out from Supabase Auth
              const { logout } = useStore.getState();
              await supabase.auth.signOut();
              console.log('✅ Signed out from Supabase');

              // 3. Clear AsyncStorage
              await AsyncStorage.clear();
              console.log('✅ AsyncStorage cleared');

              // 4. Reset Zustand store
              logout();
              resetUserData();
              console.log('✅ Zustand store reset');

              Alert.alert(t('common.success'), 'Reset complete', [
                {
                  text: t('common.ok'),
                  onPress: () => {
                    // Force reload app
                    router.replace('/');
                  },
                },
              ]);
            } catch (error) {
              console.error('❌ Reset progress error:', error);
              Alert.alert(t('common.error'), 'Reset failed');
            }
          },
        },
      ]
    );
  };

  // Lessons (Dersler) - Educational content
  const lessons = [
    {
      id: 1,
      title: 'Elif-Ba',
      description: 'Arapça harfleri öğren',
      level: 1,
      unlocked: true,
      color: colors.primary,
      borderColor: colors.buttonOrangeBorder,
      icon: BookOpen,
      route: '/lessons/elif-ba/1',
    },
    {
      id: 2,
      title: 'Harekeler',
      description: 'Üstün, Esre, Ötre',
      level: 1,
      unlocked: true,
      color: colors.secondary,
      borderColor: colors.buttonBlueBorder,
      icon: BookBookmark,
      route: '/lessons/harekeler/1',
    },
    {
      id: 3,
      title: 'Harflerin Konumu',
      description: 'Baş, orta, son konumları',
      level: 1,
      unlocked: true,
      color: colors.success,
      borderColor: colors.buttonGreenBorder,
      icon: BookBookmark,
      route: '/lessons/harflerin-konumu/1',
    },
    {
      id: 4,
      title: 'Üstün-1',
      description: 'Üstün harekesi ile kelimeler',
      level: 1,
      unlocked: true,
      color: colors.pink,
      borderColor: colors.buttonPinkBorder,
      icon: BookBookmark,
      route: '/lessons/ustun-1/1',
    },
  ];

  // Tests (Testler) - Games and quizzes
  const tests = [
    {
      id: 1,
      title: t('games.letters.title'),
      description: t('games.letters.description'),
      level: 1,
      unlocked: true,
      color: colors.primary,
      borderColor: colors.buttonOrangeBorder,
      icon: BookOpen,
      route: '/games/letters/1',
    },
    {
      id: 2,
      title: t('games.vocabulary.title'),
      description: t('games.vocabulary.description'),
      level: 1,
      unlocked: true,
      color: colors.secondary,
      borderColor: colors.buttonBlueBorder,
      icon: BookBookmark,
      route: '/games/vocabulary/1',
    },
    {
      id: 3,
      title: t('games.verses.title'),
      description: t('games.verses.description'),
      level: 2,
      unlocked: true,
      color: colors.success,
      borderColor: colors.buttonGreenBorder,
      icon: BookBookmark,
      route: '/games/verses/1',
    },
    {
      id: 4,
      title: t('games.quiz.title'),
      description: t('games.quiz.description'),
      level: 1,
      unlocked: true,
      color: colors.pink,
      borderColor: colors.buttonPinkBorder,
      icon: BookBookmark,
      route: '/games/quiz/1',
    },
    {
      id: 5,
      title: t('games.speed.title'),
      description: t('games.speed.description'),
      level: 10,
      unlocked: false,
      color: colors.locked,
      borderColor: colors.lockedBorder,
      icon: Lock,
    },
  ];

  const scrollViewRef = useRef<ScrollView>(null);
  const [selectedTest, setSelectedTest] = useState<typeof tests[0] | null>(null);
  const [cardPosition, setCardPosition] = useState({ left: 0, top: 0 });
  const [showDevTools, setShowDevTools] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'genel' | 'dersler' | 'testler'>('genel');
  const [isSwipeActive, setIsSwipeActive] = useState(false);
  const [isCarouselTouching, setIsCarouselTouching] = useState(false);
  
  // Animation values for swipe effect
  const screenWidth = Dimensions.get('window').width;
  const translateX = useSharedValue(0);
  const categoryIndex = useSharedValue(0); // 0: genel, 1: dersler, 2: testler

  const handleTestSelect = (test: typeof tests[0]) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (selectedTest?.id === test.id) {
      // If already selected, deselect
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setSelectedTest(null);
    } else {
      // Select new test
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setSelectedTest(test);

      // Calculate card position for overlay alignment
      const index = tests.findIndex(t => t.id === test.id);
      if (index !== -1) {
        const cardWidth = 280;
        const gap = 16;
        const padding = 16;
        const screenWidth = Dimensions.get('window').width;

        // Calculate position to center the card on screen
        const cardCenter = padding + (index * (cardWidth + gap)) + (cardWidth / 2);
        const targetScrollX = Math.max(0, cardCenter - (screenWidth / 2));

        // Calculate where the card will actually be on screen after scrolling
        // If we can scroll to center it, it will be at screen center
        // If we can't (first/last cards), calculate actual position
        let confirmationLeft;
        if (targetScrollX === 0) {
          // Can't scroll left - card is at its natural position
          confirmationLeft = padding + (index * (cardWidth + gap));
        } else {
          // Card will be centered
          confirmationLeft = (screenWidth - cardWidth) / 2;
        }

        setCardPosition({
          left: confirmationLeft,
          top: 10 // Keep same top position
        });

        // Scroll to center the selected test
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({
            x: targetScrollX,
            animated: true
          });
        }
      }
    }
  };

  const handleStartTest = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (!selectedTest) return;

    if (currentLives <= 0) {
      Alert.alert(t('errors.insufficientLives'), t('errors.insufficientLivesDesc'));
      return;
    }

    router.push((selectedTest.route || '/games/letters') as any);
    setSelectedTest(null);
  };

  const categories: ('genel' | 'dersler' | 'testler')[] = ['genel', 'dersler', 'testler'];
  
  const handleCategoryChange = useCallback((category: 'genel' | 'dersler' | 'testler') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedCategory(category);
    
    // Update animation value
    const newIndex = categories.indexOf(category);
    categoryIndex.value = newIndex;
    translateX.value = withTiming(-newIndex * screenWidth, {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    });
  }, []);

  // Initialize animation value based on selected category
  useEffect(() => {
    const index = categories.indexOf(selectedCategory);
    categoryIndex.value = index;
    translateX.value = -index * screenWidth;
  }, []);

  // Track if we're currently dragging
  const isDragging = useSharedValue(false);
  const startX = useSharedValue(0);

  // Swipe gesture for category navigation using PanResponder
  const panResponder = useMemo(() => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Don't respond if user is touching a carousel
        if (isCarouselTouching) {
          return false;
        }
        
        // Only respond to horizontal swipes
        const isHorizontal = Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 1.5;
        if (isHorizontal && Math.abs(gestureState.dx) > 10) {
          setIsSwipeActive(true);
          return true;
        }
        return false;
      },
      onPanResponderGrant: (evt) => {
        // Store the starting position and mark as dragging
        isDragging.value = true;
        startX.value = evt.nativeEvent.pageX;
      },
      onPanResponderMove: (evt, gestureState) => {
        if (!isDragging.value) return;
        
        const currentIndex = categoryIndex.value;
        const baseOffset = -currentIndex * screenWidth;
        const dragOffset = gestureState.dx;
        
        // Limit the drag to prevent over-scrolling
        const minOffset = -(categories.length - 1) * screenWidth;
        const maxOffset = 0;
        const newOffset = Math.max(minOffset, Math.min(maxOffset, baseOffset + dragOffset));
        
        // Update position in real-time
        translateX.value = newOffset;
      },
      onPanResponderRelease: (evt, gestureState) => {
        isDragging.value = false;
        
        const currentIndex = categoryIndex.value;
        const threshold = screenWidth * 0.3; // 30% of screen width
        
        let newIndex = currentIndex;
        
        // Determine if we should switch categories
        if (Math.abs(gestureState.dx) > threshold && Math.abs(gestureState.dy) < 100) {
          if (gestureState.dx > threshold && currentIndex > 0) {
            // Swipe right -> previous category
            newIndex = currentIndex - 1;
          } else if (gestureState.dx < -threshold && currentIndex < categories.length - 1) {
            // Swipe left -> next category
            newIndex = currentIndex + 1;
          }
        }
        
        // Animate to the final position
        categoryIndex.value = newIndex;
        translateX.value = withTiming(-newIndex * screenWidth, {
          duration: 300,
          easing: Easing.out(Easing.cubic),
        });
        
        // Update the selected category
        if (newIndex !== currentIndex) {
          runOnJS(handleCategoryChange)(categories[newIndex]);
        }
      },
      onPanResponderTerminate: () => {
        // Handle interruption (e.g., by another gesture)
        isDragging.value = false;
        const currentIndex = categoryIndex.value;
        translateX.value = withTiming(-currentIndex * screenWidth, {
          duration: 300,
          easing: Easing.out(Easing.cubic),
        });
      },
    });
  }, [categories, handleCategoryChange, screenWidth, isCarouselTouching]);

  // Reset scroll position when category changes
  useEffect(() => {
    scrollViewRef.current?.scrollTo({ x: 0, animated: false });
  }, [selectedCategory]);

  // Dynamic styles that update when theme changes
  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundDarker,
    },
    // ... (existing styles) ...
    startCardContainer: {
      position: 'absolute',
      width: 280,
      zIndex: 100,
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      borderWidth: 2,
      borderColor: colors.border,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
    },
    startCardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
      gap: 10,
    },
    startCardIcon: {
      width: 40,
      height: 40,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    startCardTitleContainer: {
      flex: 1,
    },
    startCardTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.textPrimary,
    },
    startCardSubtitle: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    startCardActions: {
      flexDirection: 'row',
      gap: 8,
    },
    startButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: 'center',
      borderBottomWidth: 3,
    },
    startButtonText: {
      fontSize: 15,
      fontWeight: 'bold',
      color: colors.textOnPrimary,
    },
    cancelButton: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cancelButtonText: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    // ... (rest of styles) ...

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
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingTop: 20,
      paddingBottom: 16,
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.textPrimary,
    },
    viewAllButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      backgroundColor: colors.surface,
    },
    viewAllButtonText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.primary,
    },
    carousel: {
      flexGrow: 0,
    },
    carouselContent: {
      paddingHorizontal: 16,
      paddingVertical: 24, // Increased to prevent clipping of hover effect
      gap: 16,
    },
    lessonCard: {
      width: 280,
      height: 220,
      borderRadius: 20,
      padding: 20,
      borderBottomWidth: 6,
      shadowColor: colors.shadowStrong,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius: 8,
      elevation: 8,
      justifyContent: 'space-between',
    },
    lessonCardLocked: {
      opacity: 0.6,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    cardIconContainer: {
      width: 56,
      height: 56,
      borderRadius: 16,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    levelBadge: {
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
    },
    levelBadgeText: {
      fontSize: 11,
      fontWeight: 'bold',
      color: colors.textOnPrimary,
    },
    cardContent: {
      flex: 1,
      justifyContent: 'center',
    },
    cardTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.textOnPrimary,
      marginBottom: 6,
    },
    cardDescription: {
      fontSize: 13,
      color: colors.textOnPrimary,
      opacity: 0.9,
      lineHeight: 18,
    },
    cardFooter: {
      marginTop: 12,
    },
    progressContainer: {
      gap: 6,
    },
    progressBar: {
      height: 6,
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      borderRadius: 3,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: colors.textOnPrimary,
      borderRadius: 3,
    },
    progressText: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.textOnPrimary,
      opacity: 0.9,
    },
    lockedBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    lockedBadgeText: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.textOnPrimary,
    },
    contentWrapper: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
    },
    bottomContent: {
      paddingHorizontal: 16,
      paddingTop: 24,
    },

    loginPrompt: {
      backgroundColor: colors.surface,
      padding: 20,
      borderRadius: 16,
      alignItems: 'center',
      borderBottomWidth: 4,
      borderBottomColor: colors.border,
    },
    promptIcon: {
      fontSize: 32,
      marginBottom: 8,
    },
    promptTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: 8,
    },
    promptText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 16,
      lineHeight: 20,
    },
    loginButton: {
      backgroundColor: colors.secondary,
      paddingVertical: 12,
      paddingHorizontal: 32,
      borderRadius: 12,
      borderBottomWidth: 4,
      borderBottomColor: colors.buttonBlueBorder,
    },
    loginButtonText: {
      color: colors.textOnPrimary,
      fontSize: 16,
      fontWeight: 'bold',
    },
    // 🧪 Test Buttons Styles
    testContainer: {
      backgroundColor: colors.backgroundDarker,
      padding: 16,
      borderRadius: 16,
      marginTop: 24,
      borderWidth: 2,
      borderColor: colors.warning,
    },
    testTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.warning,
      marginBottom: 12,
      textAlign: 'center',
    },
    testButtonRow: {
      flexDirection: 'row',
      gap: 10,
      marginBottom: 10,
    },
    testButton: {
      backgroundColor: colors.primary,
      paddingVertical: 14,
      paddingHorizontal: 20,
      borderRadius: 12,
      marginBottom: 10,
      borderBottomWidth: 4,
      borderBottomColor: colors.buttonOrangeBorder,
    },
    testButtonHalf: {
      flex: 1,
      marginBottom: 0,
    },
    testButtonSync: {
      backgroundColor: colors.secondary,
      paddingVertical: 14,
      paddingHorizontal: 20,
      borderRadius: 12,
      marginBottom: 10,
      borderBottomWidth: 4,
      borderBottomColor: colors.buttonBlueBorder,
    },
    testButtonDanger: {
      backgroundColor: colors.error,
      paddingVertical: 14,
      paddingHorizontal: 20,
      borderRadius: 12,
      marginBottom: 16,
      borderBottomWidth: 4,
      borderBottomColor: colors.errorDark,
    },
    testButtonText: {
      color: colors.textOnPrimary,
      fontSize: 15,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    testStats: {
      backgroundColor: colors.surface,
      padding: 12,
      borderRadius: 12,
      gap: 6,
    },
    testStatsText: {
      fontSize: 12,
      color: colors.textSecondary,
      fontFamily: 'monospace',
    },
    testStatsHighlight: {
      fontSize: 14,
      color: colors.xpGold,
      fontWeight: 'bold',
    },
    devToolsToggle: {
      backgroundColor: colors.surface,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
      marginTop: 16,
      borderWidth: 2,
      borderColor: colors.warning,
      alignItems: 'center',
    },
    devToolsToggleText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: colors.warning,
    },
  }), [themeVersion]); // Re-create styles when theme changes

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style={statusBarStyle} backgroundColor={colors.backgroundDarker} />
      {/* Top Stats Bar */}
      <View style={styles.topBar}>
        {/* Level Badge */}
        <View style={styles.statBadge}>
          <Star size={20} color={colors.xpGold} weight="fill" />
          <Text style={styles.statValue}>{xpProgress.currentLevel}</Text>
        </View>

        {/* XP Progress Bar */}
        <View style={styles.xpContainer}>
          <View style={styles.xpBarBackground}>
            <Animated.View style={[styles.xpBarFill, animatedXPStyle]} />
            <Text style={styles.xpText}>
              {formatXP(xpProgress.currentLevelXP)} / {formatXP(xpProgress.requiredXP)} {t('home.xp')}
            </Text>
          </View>
        </View>

        {/* Lives Badge */}
        <View style={styles.statBadge}>
          <Heart size={20} color={colors.error} weight="fill" />
          <Text style={styles.statValue}>{currentLives}</Text>
        </View>
      </View>



      {/* Content Wrapper with Swipe Gesture */}
      <View style={styles.contentWrapper} {...panResponder.panHandlers}>
        {/* Category Selection Bar - Fixed at top */}
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
                Genel
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
                Dersler
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
                Testler
              </Text>
            </Pressable>
            </View>

        {/* Animated Category Pages Container */}
        <Animated.View
          style={[
            {
              flex: 1,
              flexDirection: 'row',
              width: screenWidth * 3, // 3 categories
            },
            useAnimatedStyle(() => ({
              transform: [{ translateX: translateX.value }],
            })),
          ]}
        >
          {/* GENEL Category Page */}
          <View style={{ width: screenWidth, flex: 1 }}>
            <ScrollView
              style={styles.content}
              contentContainerStyle={{ paddingBottom: 100 }}
              showsVerticalScrollIndicator={false}
              scrollEnabled={!isSwipeActive}
            >
              <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
                <WeeklyActivity />
                <DailyHadith />

                {/* 🧪 Developer Tools Toggle */}
                <Pressable
                  style={styles.devToolsToggle}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setShowDevTools(!showDevTools);
                  }}
                >
                  <Text style={styles.devToolsToggleText}>
                    {showDevTools ? '🔽' : '🔼'} {t('home.devTools')}
                  </Text>
                </Pressable>

                {/* 🧪 TEST BUTTONS - Remove in production */}
                {showDevTools && (
                  <View style={styles.testContainer}>
                    <Text style={styles.testTitle}>🧪 {t('home.devTools')}</Text>

                    {/* Add XP Buttons */}
                    <View style={styles.testButtonRow}>
                      <Pressable style={[styles.testButton, styles.testButtonHalf]} onPress={handleAddXP}>
                        <Text style={styles.testButtonText}>➕ +100 {t('home.xp')}</Text>
                      </Pressable>

                      <Pressable style={[styles.testButton, styles.testButtonHalf]} onPress={handleAdd1000XP}>
                        <Text style={styles.testButtonText}>⚡ +1000 {t('home.xp')}</Text>
                      </Pressable>
                    </View>

                    {/* Lives Debug Buttons */}
                    <View style={styles.testButtonRow}>
                      <Pressable
                        style={[styles.testButton, styles.testButtonHalf, { backgroundColor: colors.error }]}
                        onPress={() => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          removeLives(1);
                        }}
                      >
                        <Text style={styles.testButtonText}>❤️ -1 {t('home.lives')}</Text>
                      </Pressable>

                      <Pressable
                        style={[styles.testButton, styles.testButtonHalf, { backgroundColor: colors.success }]}
                        onPress={() => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          addLives(1);
                        }}
                      >
                        <Text style={styles.testButtonText}>❤️ +1 {t('home.lives')}</Text>
                      </Pressable>
                    </View>

                    {/* Sync XP Button */}
                    <Pressable style={styles.testButtonSync} onPress={handleSyncXP}>
                      <Text style={styles.testButtonText}>🔄 {t('home.syncXP')}</Text>
                    </Pressable>

                    {/* Reset Progress Button */}
                    <Pressable style={styles.testButtonDanger} onPress={handleClearData}>
                      <Text style={styles.testButtonText}>🔄 {t('home.resetProgress')}</Text>
                    </Pressable>

                    {/* Reset XP Only Button */}
                    <Pressable style={[styles.testButtonDanger, { backgroundColor: colors.warning }]} onPress={async () => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      try {
                        setTotalXP(0);
                        if (isAuthenticated && user?.id) {
                          await database.users.update(user.id, {
                            total_xp: 0,
                            current_level: 1,
                            total_score: 0,
                            updated_at: new Date().toISOString(),
                          });
                        }
                        Alert.alert(t('common.success'), 'XP reset.');
                      } catch (error) {
                        console.error('❌ Reset XP error:', error);
                      }
                    }}>
                      <Text style={styles.testButtonText}>🔄 Reset XP Only</Text>
                    </Pressable>

                    {/* Logout Button */}
                    <Pressable style={[styles.testButtonDanger, { backgroundColor: colors.textSecondary }]} onPress={async () => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      try {
                        const { logout } = useStore.getState();
                        await supabase.auth.signOut();
                        logout();
                        resetUserData();
                        Alert.alert(t('common.success'), t('home.logout'));
                        router.replace('/(auth)/login');
                      } catch (error) {
                        console.error('❌ Logout error:', error);
                        Alert.alert(t('common.error'), 'Logout failed');
                      }
                    }}>
                      <Text style={styles.testButtonText}>🚪 {t('home.logout')}</Text>
                    </Pressable>
                  </View>
                )}
              </View>
            </ScrollView>
          </View>

          {/* DERSLER Category Page */}
          <View style={{ width: screenWidth, flex: 1 }}>
            <ScrollView
              style={styles.content}
              contentContainerStyle={{ paddingBottom: 100 }}
              showsVerticalScrollIndicator={false}
              scrollEnabled={!isSwipeActive}
            >
              {/* Section Title */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Dersler</Text>
                <Pressable style={styles.viewAllButton} onPress={() => { }}>
                  <Text style={styles.viewAllButtonText}>{t('common.viewAll')}</Text>
                </Pressable>
              </View>

              {/* Lesson Cards Carousel */}
              <ScrollView
                ref={scrollViewRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.carouselContent}
                style={styles.carousel}
                onTouchStart={() => setIsCarouselTouching(true)}
                onTouchEnd={() => setIsCarouselTouching(false)}
                onScrollBeginDrag={() => {
                  setIsCarouselTouching(true);
                  if (selectedTest) {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                    setSelectedTest(null);
                  }
                }}
                onScrollEndDrag={() => setIsCarouselTouching(false)}
              >
                {lessons.map((test) => (
                  <HoverCard
                    key={test.id}
                    style={[
                      styles.lessonCard,
                      {
                        backgroundColor: test.unlocked ? test.color : colors.locked,
                        borderBottomColor: test.unlocked ? test.borderColor : colors.lockedBorder,
                      },
                      !test.unlocked && styles.lessonCardLocked,
                    ]}
                    onPress={() => handleTestSelect(test)}
                    disabled={!test.unlocked}
                    lightColor="rgba(255, 255, 255, 0.3)"
                  >
                    {/* Card Header */}
                    <View style={styles.cardHeader}>
                      <View style={styles.cardIconContainer}>
                        <test.icon
                          size={32}
                          color={colors.textOnPrimary}
                          weight="fill"
                        />
                      </View>
                      {!test.unlocked && (
                        <View style={styles.levelBadge}>
                          <Text style={styles.levelBadgeText}>{t('home.level')} {test.level}</Text>
                        </View>
                      )}
                    </View>

                    {/* Card Content */}
                    <View style={styles.cardContent}>
                      <Text style={styles.cardTitle}>{test.title}</Text>
                      <Text style={styles.cardDescription}>{test.description}</Text>
                    </View>

                    {/* Card Footer - Progress or Status */}
                    <View style={styles.cardFooter}>
                      {test.unlocked ? (
                        <View style={styles.progressContainer}>
                          <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { width: '30%' }]} />
                          </View>
                          <Text style={styles.progressText}>3/10 {t('home.tests')}</Text>
                        </View>
                      ) : (
                        <View style={styles.lockedBadge}>
                          <Lock size={16} color={colors.textOnPrimary} weight="fill" />
                          <Text style={styles.lockedBadgeText}>{t('home.locked')}</Text>
                        </View>
                      )}
                    </View>
                  </HoverCard>
                ))}
              </ScrollView>
            </ScrollView>
          </View>

          {/* TESTLER Category Page */}
          <View style={{ width: screenWidth, flex: 1 }}>
            <ScrollView
              style={styles.content}
              contentContainerStyle={{ paddingBottom: 100 }}
              showsVerticalScrollIndicator={false}
              scrollEnabled={!isSwipeActive}
            >
              {/* Section Title */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{t('home.tests')}</Text>
                <Pressable style={styles.viewAllButton} onPress={() => { }}>
                  <Text style={styles.viewAllButtonText}>{t('common.viewAll')}</Text>
                </Pressable>
              </View>

              {/* Test Cards Carousel */}
              <ScrollView
                ref={scrollViewRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.carouselContent}
                style={styles.carousel}
                onTouchStart={() => setIsCarouselTouching(true)}
                onTouchEnd={() => setIsCarouselTouching(false)}
                onScrollBeginDrag={() => {
                  setIsCarouselTouching(true);
                  if (selectedTest) {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                    setSelectedTest(null);
                  }
                }}
                onScrollEndDrag={() => setIsCarouselTouching(false)}
              >
                {tests.map((test) => (
                  <HoverCard
                    key={test.id}
                    style={[
                      styles.lessonCard,
                      {
                        backgroundColor: test.unlocked ? test.color : colors.locked,
                        borderBottomColor: test.unlocked ? test.borderColor : colors.lockedBorder,
                      },
                      !test.unlocked && styles.lessonCardLocked,
                    ]}
                    onPress={() => handleTestSelect(test)}
                    disabled={!test.unlocked}
                    lightColor="rgba(255, 255, 255, 0.3)"
                  >
                    {/* Card Header */}
                    <View style={styles.cardHeader}>
                      <View style={styles.cardIconContainer}>
                        <test.icon
                          size={32}
                          color={colors.textOnPrimary}
                          weight="fill"
                        />
                      </View>
                      {!test.unlocked && (
                        <View style={styles.levelBadge}>
                          <Text style={styles.levelBadgeText}>{t('home.level')} {test.level}</Text>
                        </View>
                      )}
                    </View>

                    {/* Card Content */}
                    <View style={styles.cardContent}>
                      <Text style={styles.cardTitle}>{test.title}</Text>
                      <Text style={styles.cardDescription}>{test.description}</Text>
                    </View>

                    {/* Card Footer - Progress or Status */}
                    <View style={styles.cardFooter}>
                      {test.unlocked ? (
                        <View style={styles.progressContainer}>
                          <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { width: '30%' }]} />
                          </View>
                          <Text style={styles.progressText}>3/10 {t('home.tests')}</Text>
                        </View>
                      ) : (
                        <View style={styles.lockedBadge}>
                          <Lock size={16} color={colors.textOnPrimary} weight="fill" />
                          <Text style={styles.lockedBadgeText}>{t('home.locked')}</Text>
                        </View>
                      )}
                    </View>
                  </HoverCard>
                ))}
              </ScrollView>
            </ScrollView>
          </View>
        </Animated.View>

        {/* Bottom Section with Overlay */}
          <View style={styles.bottomContent}>

            {/* Test Start Confirmation Card (Overlay) */}
            {selectedTest && (
              <>
                {/* Backdrop to close on outside click */}
                <Pressable
                  style={{
                    position: 'absolute',
                    top: -2000, // Cover entire scrollable area
                    left: -1000,
                    right: -1000,
                    bottom: -2000,
                    zIndex: 99, // Just below the card (which is 100)
                    backgroundColor: 'transparent',
                  }}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                    setSelectedTest(null);
                  }}
                />

                <Animated.View
                  entering={FadeInUp.duration(300).easing(Easing.out(Easing.quad))}
                  exiting={FadeOutDown.duration(200)}
                  style={[
                    styles.startCardContainer,
                    {
                      left: cardPosition.left,
                      top: cardPosition.top,
                    }
                  ]}
                >
                  <View style={styles.startCardHeader}>
                    <View style={[styles.startCardIcon, { backgroundColor: selectedTest.color }]}>
                      <selectedTest.icon size={20} color={colors.textOnPrimary} weight="fill" />
                    </View>
                    <View style={styles.startCardTitleContainer}>
                      <Text style={styles.startCardTitle}>{selectedTest.title}</Text>
                      <Text style={styles.startCardSubtitle}>{selectedTest.description}</Text>
                    </View>
                  </View>

                  <View style={styles.startCardActions}>
                    <Pressable
                      style={[styles.startButton, { backgroundColor: selectedTest.color, borderBottomColor: selectedTest.borderColor }]}
                      onPress={handleStartTest}
                    >
                      <Text style={styles.startButtonText}>{t('common.start')}</Text>
                    </Pressable>

                    <Pressable
                      style={styles.cancelButton}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setSelectedTest(null);
                      }}
                    >
                      <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
                    </Pressable>
                  </View>
                </Animated.View>
              </>
            )}
          </View>
      </View>
    </SafeAreaView>
  );
}

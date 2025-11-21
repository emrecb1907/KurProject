import { View, Text, StyleSheet, ScrollView, Pressable, Alert, LayoutAnimation, Dimensions } from 'react-native';
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
  FadeOutDown
} from 'react-native-reanimated';
import { colors } from '@constants/colors';
import { useStatusBar } from '@/hooks/useStatusBar';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  Flag01Icon,
  FavouriteIcon,
  AlphabetArabicIcon,
  Book01Icon,
  Book02Icon,
  LockIcon,
  StarIcon
} from '@hugeicons/core-free-icons';
import { getXPProgress, formatXP } from '@/lib/utils/levelCalculations';
import { useUser, useAuth, useStore } from '@/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase/client';
import { database } from '@/lib/supabase/database';
import { WeeklyActivity } from '@/components/home/WeeklyActivity';
import { HoverCard } from '@/components/ui/HoverCard';
import * as Haptics from 'expo-haptics';

export default function HomePage() {
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
        setSelectedLesson(null);
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

    Alert.alert('✅ XP Eklendi!', `+100 XP kazandın!\n\nYeni Toplam: ${formatXP(totalXP + 100)} XP`);
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

    Alert.alert('⚡ Büyük XP Bonusu!', `+1000 XP kazandın!\n\nYeni Toplam: ${formatXP(totalXP + 1000)} XP`);
  };

  // 🔄 TEST: Sync XP to Database (one-time fix)
  const handleSyncXP = async () => {
    if (!isAuthenticated || !user?.id) {
      Alert.alert('⚠️ Hata', 'Giriş yapmış kullanıcılar için geçerli');
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
          '✅ XP Senkronize Edildi!',
          `Database güncellendi:\n\nEski: ${formatXP(dbXP)} XP\nYeni: ${formatXP(localXP)} XP\n\nLeaderboard'a git ve yenileme butonuna bas!`
        );
        console.log('✅ XP synced successfully');
        console.log('💡 Leaderboard tab\'ına git ve otomatik yenilenecek');
      } else if (dbXP > localXP) {
        // Database has more XP than local (shouldn't happen but handle it)
        setTotalXP(dbXP);
        Alert.alert(
          'ℹ️ Local XP Güncellendi',
          `Database daha yüksek XP içeriyordu:\n\nLocal: ${formatXP(localXP)} XP\nDatabase: ${formatXP(dbXP)} XP\n\nLocal storage güncellendi.`
        );
        console.log('✅ Local XP updated from database');
      } else {
        Alert.alert('ℹ️ Zaten Güncel', 'XP zaten senkronize');
      }
    } catch (error) {
      console.error('❌ Sync error:', error);
      Alert.alert('❌ Hata', 'XP senkronize edilemedi');
    }
  };

  // 🎨 TEST: Clear theme cache (reset to system default)
  const handleClearThemeCache = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await AsyncStorage.removeItem('quranlearn-theme');
      console.log('✅ Theme cache cleared');
      Alert.alert(
        '✅ Tema Cache Temizlendi!',
        'Tema tercihi sıfırlandı. Uygulama yeniden başlatılınca sistem temasıyla açılacak.',
        [
          {
            text: 'Tamam',
            onPress: () => {
              router.replace('/');
            },
          },
        ]
      );
    } catch (error) {
      console.error('❌ Clear theme cache error:', error);
      Alert.alert('Hata', 'Tema cache temizlenemedi.');
    }
  };

  // 🧹 TEST: Clear all user progress (keep account, reset XP/Level/Lives)
  const handleClearData = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert(
      '⚠️ İlerlemeyi Sıfırla',
      'Tüm ilerleme sıfırlanacak (XP, Level, Canlar, Streak). Hesap bilgilerin korunur. Emin misin?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sıfırla',
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

              Alert.alert('✅ Sıfırlandı!', 'İlerleme sıfırlandı. Hesabın korundu. Tekrar giriş yapabilirsin!', [
                {
                  text: 'Tamam',
                  onPress: () => {
                    // Force reload app
                    router.replace('/');
                  },
                },
              ]);
            } catch (error) {
              console.error('❌ Reset progress error:', error);
              Alert.alert('Hata', 'İlerleme sıfırlanırken bir hata oluştu.');
            }
          },
        },
      ]
    );
  };

  const lessons = [
    {
      id: 1,
      title: 'Arapça Harfler',
      description: 'Harf seslerini dinle ve doğru harfi seç',
      level: 1,
      unlocked: true,
      color: colors.primary,
      borderColor: colors.buttonOrangeBorder,
      icon: AlphabetArabicIcon,
      route: '/games/letters/1',
    },
    {
      id: 2,
      title: 'Kavram Kartları',
      description: 'İslami anahtar kelimeleri öğren',
      level: 1,
      unlocked: true,
      color: colors.secondary,
      borderColor: colors.buttonBlueBorder,
      icon: Book01Icon,
      route: '/games/vocabulary/1',
    },
    {
      id: 3,
      title: 'Ayet Tamamlama',
      description: 'Eksik kelimeleri bularak ayetleri tamamla',
      level: 2,
      unlocked: true,
      color: colors.success,
      borderColor: colors.buttonGreenBorder,
      icon: Book02Icon,
      route: '/games/verses/1',
    },
    {
      id: 4,
      title: 'İslami Soru-Cevap',
      description: 'İslami bilgini test et',
      level: 1,
      unlocked: true,
      color: colors.pink,
      borderColor: colors.buttonPinkBorder,
      icon: Book02Icon,
      route: '/games/quiz/1',
    },
    {
      id: 5,
      title: 'Hızlı Tur',
      description: 'Karışık sorularla hızlı pratik',
      level: 10,
      unlocked: false,
      color: colors.locked,
      borderColor: colors.lockedBorder,
      icon: LockIcon,
    },
  ];

  const scrollViewRef = useRef<ScrollView>(null);
  const [selectedLesson, setSelectedLesson] = useState<typeof lessons[0] | null>(null);
  const [cardPosition, setCardPosition] = useState({ left: 0, top: 0 });
  const [showDevTools, setShowDevTools] = useState(false);

  const handleLessonSelect = (lesson: typeof lessons[0]) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (selectedLesson?.id === lesson.id) {
      // If already selected, deselect
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setSelectedLesson(null);
    } else {
      // Select new lesson
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setSelectedLesson(lesson);

      // Calculate card position for overlay alignment
      const index = lessons.findIndex(l => l.id === lesson.id);
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

        // Scroll to center the selected lesson
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({
            x: targetScrollX,
            animated: true
          });
        }
      }
    }
  };

  const handleStartLesson = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (!selectedLesson) return;

    if (currentLives <= 0) {
      Alert.alert('Yetersiz Can', 'Canın kalmadı! Reklam izleyerek veya bekleyerek can kazanabilirsin.');
      return;
    }

    router.push((selectedLesson.route || '/games/letters') as any);
    setSelectedLesson(null);
  };

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
    sectionHeader: {
      paddingHorizontal: 16,
      paddingTop: 20,
      paddingBottom: 16,
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.textPrimary,
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
          <HugeiconsIcon icon={Flag01Icon} size={20} color={colors.textPrimary} />
          <Text style={styles.statValue}>{xpProgress.currentLevel}</Text>
        </View>

        {/* XP Progress Bar */}
        <View style={styles.xpContainer}>
          <View style={styles.xpBarBackground}>
            <Animated.View style={[styles.xpBarFill, animatedXPStyle]} />
            <Text style={styles.xpText}>
              {formatXP(xpProgress.currentLevelXP)} / {formatXP(xpProgress.requiredXP)} XP
            </Text>
          </View>
        </View>

        {/* Lives Badge */}
        <View style={styles.statBadge}>
          <HugeiconsIcon icon={FavouriteIcon} size={20} color={colors.error} variant="solid" />
          <Text style={styles.statValue}>{currentLives}</Text>
        </View>
      </View>

      {/* Content Wrapper */}
      <View style={styles.contentWrapper}>
        <ScrollView
          style={styles.content}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Section Title */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Dersler</Text>
          </View>

          {/* Lesson Cards Carousel */}
          <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContent}
            style={styles.carousel}
            onScrollBeginDrag={() => {
              // Dismiss confirmation card when user manually scrolls
              if (selectedLesson) {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                setSelectedLesson(null);
              }
            }}
          >
            {lessons.map((lesson) => (
              <HoverCard
                key={lesson.id}
                style={[
                  styles.lessonCard,
                  {
                    backgroundColor: lesson.unlocked ? lesson.color : colors.locked,
                    borderBottomColor: lesson.unlocked ? lesson.borderColor : colors.lockedBorder,
                  },
                  !lesson.unlocked && styles.lessonCardLocked,
                ]}
                onPress={() => handleLessonSelect(lesson)}
                disabled={!lesson.unlocked}
                lightColor="rgba(255, 255, 255, 0.3)"
              >
                {/* Card Header */}
                <View style={styles.cardHeader}>
                  <View style={styles.cardIconContainer}>
                    <HugeiconsIcon
                      icon={lesson.icon}
                      size={32}
                      color={colors.textOnPrimary}
                    />
                  </View>
                  {!lesson.unlocked && (
                    <View style={styles.levelBadge}>
                      <Text style={styles.levelBadgeText}>Lvl {lesson.level}</Text>
                    </View>
                  )}
                </View>

                {/* Card Content */}
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{lesson.title}</Text>
                  <Text style={styles.cardDescription}>{lesson.description}</Text>
                </View>

                {/* Card Footer - Progress or Status */}
                <View style={styles.cardFooter}>
                  {lesson.unlocked ? (
                    <View style={styles.progressContainer}>
                      <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: '30%' }]} />
                      </View>
                      <Text style={styles.progressText}>3/10 Ders</Text>
                    </View>
                  ) : (
                    <View style={styles.lockedBadge}>
                      <HugeiconsIcon icon={LockIcon} size={16} color={colors.textOnPrimary} />
                      <Text style={styles.lockedBadgeText}>Kilitli</Text>
                    </View>
                  )}
                </View>
              </HoverCard>
            ))}
          </ScrollView>

          {/* Bottom Section with Overlay */}
          <View style={styles.bottomContent}>
            {/* Weekly Activity / Daily Goal Card */}
            <WeeklyActivity />

            {/* Lesson Start Confirmation Card (Overlay) */}
            {selectedLesson && (
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
                    setSelectedLesson(null);
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
                    <View style={[styles.startCardIcon, { backgroundColor: selectedLesson.color }]}>
                      <HugeiconsIcon icon={selectedLesson.icon} size={20} color={colors.textOnPrimary} />
                    </View>
                    <View style={styles.startCardTitleContainer}>
                      <Text style={styles.startCardTitle}>{selectedLesson.title}</Text>
                      <Text style={styles.startCardSubtitle}>{selectedLesson.description}</Text>
                    </View>
                  </View>

                  <View style={styles.startCardActions}>
                    <Pressable
                      style={[styles.startButton, { backgroundColor: selectedLesson.color, borderBottomColor: selectedLesson.borderColor }]}
                      onPress={handleStartLesson}
                    >
                      <Text style={styles.startButtonText}>Başla</Text>
                    </Pressable>

                    <Pressable
                      style={styles.cancelButton}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setSelectedLesson(null);
                      }}
                    >
                      <Text style={styles.cancelButtonText}>Vazgeç</Text>
                    </Pressable>
                  </View>
                </Animated.View>
              </>
            )}

            {/* 🧪 Developer Tools Toggle */}
            <Pressable
              style={styles.devToolsToggle}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowDevTools(!showDevTools);
              }}
            >
              <Text style={styles.devToolsToggleText}>
                {showDevTools ? '🔽' : '🔼'} Geliştirici Araçları
              </Text>
            </Pressable>

            {/* 🧪 TEST BUTTONS - Remove in production */}
            {showDevTools && (
              <View style={styles.testContainer}>
                <Text style={styles.testTitle}>🧪 Geliştirici Araçları</Text>

                {/* Add XP Buttons */}
                <View style={styles.testButtonRow}>
                  <Pressable style={[styles.testButton, styles.testButtonHalf]} onPress={handleAddXP}>
                    <Text style={styles.testButtonText}>➕ +100 XP</Text>
                  </Pressable>

                  <Pressable style={[styles.testButton, styles.testButtonHalf]} onPress={handleAdd1000XP}>
                    <Text style={styles.testButtonText}>⚡ +1000 XP</Text>
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
                    <Text style={styles.testButtonText}>❤️ -1 Can</Text>
                  </Pressable>

                  <Pressable
                    style={[styles.testButton, styles.testButtonHalf, { backgroundColor: colors.success }]}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      addLives(1);
                    }}
                  >
                    <Text style={styles.testButtonText}>❤️ +1 Can</Text>
                  </Pressable>
                </View>

                {/* Clear Theme Cache Button */}
                <Pressable style={[styles.testButton, { backgroundColor: colors.secondary }]} onPress={handleClearThemeCache}>
                  <Text style={styles.testButtonText}>🎨 Tema Cache Temizle</Text>
                </Pressable>

                {/* Reset Progress Button */}
                <Pressable style={styles.testButtonDanger} onPress={handleClearData}>
                  <Text style={styles.testButtonText}>🔄 İlerlemeyi Sıfırla (Her Şey)</Text>
                </Pressable>

                {/* Reset XP Only Button */}
                <Pressable style={[styles.testButtonDanger, { backgroundColor: colors.warning }]} onPress={async () => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  try {
                    // Reset local store
                    setTotalXP(0);
                    // Reset DB if authenticated
                    if (isAuthenticated && user?.id) {
                      await database.users.update(user.id, {
                        total_xp: 0,
                        current_level: 1,
                        total_score: 0,
                        updated_at: new Date().toISOString(),
                      });
                    }
                    Alert.alert('✅ Sıfırlandı', 'XP sıfırlandı.');
                  } catch (error) {
                    console.error('❌ Reset XP error:', error);
                  }
                }}>
                  <Text style={styles.testButtonText}>🔄 Sadece XP Sıfırla</Text>
                </Pressable>

                {/* Logout Button */}
                <Pressable style={[styles.testButtonDanger, { backgroundColor: colors.textSecondary }]} onPress={async () => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  try {
                    const { logout } = useStore.getState();
                    await supabase.auth.signOut();
                    logout();
                    resetUserData();
                    Alert.alert('✅ Çıkış Yapıldı', 'Başarıyla çıkış yapıldı.');
                    router.replace('/(auth)/login');
                  } catch (error) {
                    console.error('❌ Logout error:', error);
                    Alert.alert('Hata', 'Çıkış yapılırken bir hata oluştu.');
                  }
                }}>
                  <Text style={styles.testButtonText}>🚪 Çıkış Yap</Text>
                </Pressable>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView >
  );
}

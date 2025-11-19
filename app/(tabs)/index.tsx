import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
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

export default function HomePage() {
  const router = useRouter();
  const { statusBarStyle, activeTheme, themeVersion } = useStatusBar(); // Include themeVersion to trigger re-render

  // Get user data from Zustand store
  const { totalXP, currentLives, addXP, setTotalXP, resetUserData } = useUser();
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
              if (userData.total_xp !== totalXP) {
                console.log('🔄 XP updated from DB:', totalXP, '→', userData.total_xp);
                setTotalXP(userData.total_xp);
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
  
  // Calculate XP progress using the formula
  const xpProgress = getXPProgress(totalXP);
  
  // Debug: Log auth state
  console.log('🏠 Home Auth State:', {
    isAuthenticated,
    hasUser: !!user,
    username: user?.username,
    email: user?.email,
    totalXP,
    source: isAuthenticated ? 'Database' : 'Local',
  });

  // 🧪 TEST: Add 100 XP
  const handleAddXP = async () => {
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
    },
    {
      id: 4,
      title: 'Hızlı Tur',
      description: 'Karışık sorularla hızlı pratik',
      level: 10,
      unlocked: false,
      color: colors.locked,
      borderColor: colors.lockedBorder,
      icon: LockIcon,
    },
  ];

  // Dynamic styles that update when theme changes
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
      paddingVertical: 8,
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
    infoCard: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      padding: 16,
      borderRadius: 16,
      marginBottom: 20,
      gap: 12,
      borderBottomWidth: 4,
      borderBottomColor: colors.border,
    },
    infoCardIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.backgroundLighter,
      justifyContent: 'center',
      alignItems: 'center',
    },
    infoCardIconText: {
      fontSize: 24,
    },
    infoCardContent: {
      flex: 1,
      justifyContent: 'center',
    },
    infoCardTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: 2,
    },
    infoCardText: {
      fontSize: 13,
      color: colors.textSecondary,
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
              <View style={[styles.xpBarFill, { width: `${xpProgress.progressPercentage}%` }]} />
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
        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Dersler</Text>
        </View>

        {/* Lesson Cards Carousel */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselContent}
          style={styles.carousel}
        >
        {lessons.map((lesson) => (
          <Pressable
            key={lesson.id}
            style={[
              styles.lessonCard,
              {
                backgroundColor: lesson.unlocked ? lesson.color : colors.locked,
                borderBottomColor: lesson.unlocked ? lesson.borderColor : colors.lockedBorder,
              },
              !lesson.unlocked && styles.lessonCardLocked,
            ]}
            onPress={() => lesson.unlocked && router.push('/games/letters')}
            disabled={!lesson.unlocked}
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
          </Pressable>
        ))}
        </ScrollView>

           {/* Bottom Section */}
           <ScrollView style={styles.content} contentContainerStyle={styles.bottomContent}>
             {/* Info Card */}
             <View style={styles.infoCard}>
               <View style={styles.infoCardIcon}>
                 <Text style={styles.infoCardIconText}>🎯</Text>
               </View>
               <View style={styles.infoCardContent}>
                 <Text style={styles.infoCardTitle}>Günlük Hedef</Text>
                 <Text style={styles.infoCardText}>Bugün henüz ders tamamlamadın!</Text>
               </View>
             </View>

              {/* 🧪 TEST BUTTONS - Remove in production */}
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

                {/* ✅ XP artık otomatik senkronize ediliyor! "Senkronize Et" butonu gereksiz */}
                {/* Acil durumlar için burada tutuluyor, gerekirse yorum satırından çıkar */}
                {/* {isAuthenticated && (
                  <Pressable style={styles.testButtonSync} onPress={handleSyncXP}>
                    <Text style={styles.testButtonText}>🔄 XP'yi Senkronize Et (Otomatik)</Text>
                  </Pressable>
                )} */}

                {/* Clear Theme Cache Button */}
                <Pressable style={[styles.testButton, { backgroundColor: colors.secondary }]} onPress={handleClearThemeCache}>
                  <Text style={styles.testButtonText}>🎨 Tema Cache Temizle</Text>
                </Pressable>

                {/* Reset Progress Button */}
                <Pressable style={styles.testButtonDanger} onPress={handleClearData}>
                  <Text style={styles.testButtonText}>🔄 İlerlemeyi Sıfırla</Text>
                </Pressable>

                {/* Current Stats Display */}
                <View style={styles.testStats}>
                  <Text style={[styles.testStatsText, styles.testStatsHighlight]}>
                    💎 Kümülatif XP: {formatXP(totalXP)} XP
                  </Text>
                  <Text style={styles.testStatsText}>
                    📊 Level: {xpProgress.currentLevel}
                  </Text>
                  <Text style={styles.testStatsText}>
                    📈 Bu seviye: {formatXP(xpProgress.currentLevelXP)} / {formatXP(xpProgress.requiredXP)} XP
                  </Text>
                  <Text style={styles.testStatsText}>
                    🎯 Sonraki seviyeye: {formatXP(xpProgress.xpToNextLevel)} XP
                  </Text>
                  <Text style={styles.testStatsText}>
                    🔐 Durum: {isAuthenticated ? '✅ Giriş Yapılmış' : '❌ Anonim'}
                  </Text>
                  {user && (
                    <Text style={styles.testStatsText}>
                      👤 {user.username || user.email || 'N/A'}
                    </Text>
                  )}
                </View>
              </View>

             <View style={{ height: 40 }} />
           </ScrollView>
      </View>
    </SafeAreaView>
  );
}

import { View, Text, StyleSheet, Pressable, Dimensions, Image } from 'react-native';
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
import { Heart, GraduationCap, Bell, User } from 'phosphor-react-native';
import { getXPProgress, formatXP } from '@/lib/utils/levelCalculations';
import { useUser, useAuth } from '@/store';
import { database } from '@/lib/supabase/database';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';

// Import new tab components
import { GenelTab, GenelTabRef } from '@/components/home/GenelTab';
import { DerslerTab, DerslerTabRef } from '@/components/home/DerslerTab';
import { TestlerTab, TestlerTabRef } from '@/components/home/TestlerTab';

export default function HomePage() {
    const { t } = useTranslation();
    const { statusBarStyle } = useStatusBar();
    const { themeVersion } = useTheme();

    // Get user data from Zustand store
    const { totalXP, currentLives, setTotalXP, checkDailyReset } = useUser();
    const { isAuthenticated, user } = useAuth();

    // Check daily reset on mount
    useEffect(() => {
        checkDailyReset();
    }, [checkDailyReset]);

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

    // Refs for tab components to control scroll
    const genelTabRef = useRef<GenelTabRef>(null);
    const derslerTabRef = useRef<DerslerTabRef>(null);
    const testlerTabRef = useRef<TestlerTabRef>(null);

    // Reset scroll when tab navigation changes (bottom tab menu)
    useFocusEffect(
        useCallback(() => {
            // Reset all tab scrolls when home tab is focused
            // Use a small delay to ensure refs are ready
            const timer = setTimeout(() => {
                genelTabRef.current?.scrollToTop();
                derslerTabRef.current?.scrollToTop();
                testlerTabRef.current?.scrollToTop();
            }, 50);

            return () => clearTimeout(timer);
        }, [])
    );

    // Handle category change
    const handleCategoryChange = (category: 'genel' | 'dersler' | 'testler') => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setSelectedCategory(category);

        // Reset scroll position for the newly selected tab
        setTimeout(() => {
            if (category === 'genel') {
                genelTabRef.current?.scrollToTop();
            } else if (category === 'dersler') {
                derslerTabRef.current?.scrollToTop();
            } else if (category === 'testler') {
                testlerTabRef.current?.scrollToTop();
            }
        }, 0);
    };

    const styles = useMemo(() => StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.backgroundDarker,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: 8,
        },
        userInfo: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
        },
        avatarContainer: {
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: colors.warning, // Yellow circle
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 2,
            borderColor: colors.warningDark,
        },
        greetingContainer: {
            justifyContent: 'center',
        },
        greetingText: {
            fontSize: 14,
            color: colors.textSecondary,
            fontWeight: '500',
        },
        userName: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.textPrimary,
        },
        notificationButton: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.surface,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 0.2,
            borderColor: 'rgba(255, 255, 255, 0.1)',
            // iOS 18 style shadow
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 16,
            elevation: 4,
        },
        statsRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            marginBottom: 12,
            marginTop: 8,
        },
        statBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.surface,
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 32, // Fully rounded
            gap: 8,
            borderWidth: 0.2,
            borderColor: 'rgba(255, 255, 255, 0.1)',
            // iOS 18 style shadow
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 16,
            elevation: 4,
        },
        statValue: {
            fontSize: 14,
            fontWeight: 'bold',
            color: colors.textPrimary,
        },
        xpContainer: {
            paddingHorizontal: 16,
            marginBottom: 14, // Reduced margin by ~30%
        },
        xpBarBackground: {
            height: 12,
            backgroundColor: colors.surface,
            borderRadius: 6,
            overflow: 'hidden',
            marginBottom: 6,
        },
        xpBarFill: {
            height: '100%',
            backgroundColor: colors.primary, // Orange bar
            borderRadius: 6,
        },
        xpText: {
            fontSize: 12,
            color: colors.textSecondary,
            textAlign: 'center',
            fontWeight: '500',
        },
        categoryBar: {
            flexDirection: 'row',
            marginHorizontal: 16,
            marginBottom: 6, // Reduced margin
            padding: 4,
            backgroundColor: colors.surface,
            borderRadius: 32,
            gap: 8,
            // Softer shadow for category bar
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 2,
            borderWidth: 0.2,
            borderColor: 'rgba(255, 255, 255, 0.1)',
        },
        categoryButton: {
            flex: 1,
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 24,
            alignItems: 'center',
            justifyContent: 'center',
        },
        categoryButtonActive: {
            backgroundColor: colors.primary, // Orange active
        },
        categoryButtonInactive: {
            backgroundColor: 'transparent',
        },
        categoryButtonText: {
            fontSize: 14,
            fontWeight: 'bold',
        },
        categoryButtonTextActive: {
            color: colors.background, // Text color matches background
        },
        categoryButtonTextInactive: {
            color: colors.textSecondary,
        },
        contentWrapper: {
            flex: 1,
            backgroundColor: colors.backgroundDarker,
        },
    }), [themeVersion]);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar style={statusBarStyle} />

            {/* Header Section */}
            <View style={styles.header}>
                <View style={styles.userInfo}>
                    <View style={styles.avatarContainer}>
                        {/* Placeholder for avatar - can be replaced with Image if available */}
                        <User size={24} color="#000" weight="fill" opacity={0.5} />
                    </View>
                    <View style={styles.greetingContainer}>
                        <Text style={styles.greetingText}>{t('home.welcome')},</Text>
                        <Text style={styles.userName}>{user?.username || user?.email?.split('@')[0] || 'Misafir'}</Text>
                    </View>
                </View>
                <Pressable style={styles.notificationButton} onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
                    <Bell size={20} color={colors.textPrimary} />
                </Pressable>
            </View>

            {/* Stats Row */}
            <View style={styles.statsRow}>
                <View style={styles.statBadge}>
                    <GraduationCap size={20} color={colors.warning} weight="fill" />
                    <Text style={styles.statValue}>Level {xpProgress.currentLevel}</Text>
                </View>
                <View style={styles.statBadge}>
                    <Heart size={20} color={colors.error} weight="fill" />
                    <Text style={styles.statValue}>{currentLives}/6</Text>
                </View>
            </View>

            {/* XP Bar Section */}
            <View style={styles.xpContainer}>
                <View style={styles.xpBarBackground}>
                    <Animated.View style={[styles.xpBarFill, animatedXPStyle]} />
                </View>
                <Text style={styles.xpText}>
                    {formatXP(xpProgress.currentLevelXP)}/{formatXP(xpProgress.requiredXP)} XP
                </Text>
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
                    <GenelTab key="genel" ref={genelTabRef} screenWidth={screenWidth} />
                </View>
                <View style={{ display: selectedCategory === 'dersler' ? 'flex' : 'none', flex: 1 }}>
                    <DerslerTab key="dersler" ref={derslerTabRef} screenWidth={screenWidth} />
                </View>
                <View style={{ display: selectedCategory === 'testler' ? 'flex' : 'none', flex: 1 }}>
                    <TestlerTab key="testler" ref={testlerTabRef} screenWidth={screenWidth} />
                </View>
            </View>
        </SafeAreaView>
    );
}

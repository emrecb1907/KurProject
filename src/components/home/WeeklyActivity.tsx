import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useEffect, useState, useCallback, useMemo, memo, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '@constants/colors';
import { Target, TreasureChest, Check, Fire, CheckCircle, LockKey } from 'phosphor-react-native';
import { database } from '@/lib/supabase/database';
import { useAuth, useUser } from '@/store';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { RewardModal } from './RewardModal';
import { BlurView } from 'expo-blur';

interface DayActivity {
    day: string;
    completed: boolean;
    isFuture: boolean;
    isToday: boolean;
}

export const WeeklyActivity = memo(function WeeklyActivity() {
    const { t } = useTranslation();
    const { user, isAuthenticated } = useAuth();
    const { addXP } = useUser();
    const { themeVersion, activeTheme } = useTheme();

    // Light theme specific border color
    const lightBorderColor = '#BCAAA4';
    const isLight = activeTheme === 'light';
    const [weekData, setWeekData] = useState<DayActivity[]>([]);
    const [todayCompleted, setTodayCompleted] = useState(false);
    const [streak, setStreak] = useState(0);
    const [rewardClaimed, setRewardClaimed] = useState(false);
    const [showRewardModal, setShowRewardModal] = useState(false);

    // Dynamic styles
    const styles = useMemo(() => StyleSheet.create({
        container: {
            backgroundColor: colors.surface,
            borderRadius: 24,
            padding: 10,
            marginBottom: 14,
            // iOS 18 style shadow - more depth, softer spread
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 16,
            elevation: 4,
            borderWidth: isLight ? 0.2 : 0,
            borderColor: isLight ? '#FFC800' : 'transparent',
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
            paddingBottom: 10,
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(255, 255, 255, 0.1)',
        },
        headerTextContainer: {
            flex: 1,
        },
        subtitle: {
            fontSize: 13,
            color: colors.textSecondary,
            marginBottom: 4,
            fontWeight: '500',
        },
        title: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.textPrimary,
            paddingLeft: 6,
        },
        iconContainer: {
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: 'rgba(255, 200, 0, 0.1)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        weekContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 20,
            gap: 4,
        },
        dayContainer: {
            alignItems: 'center',
            flex: 1,
        },
        dayLabel: {
            fontSize: 12,
            fontWeight: '600',
            color: colors.textSecondary,
            marginBottom: 8,
        },
        dayCircle: {
            width: 36,
            height: 36,
            borderRadius: 18,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.surfaceLight, // Visible gray for inactive/future days
        },
        dayCircleCompleted: {
            backgroundColor: colors.success,
        },
        dayCircleToday: {
            borderWidth: 2,
            borderColor: colors.xpGold,
        },
        dayCircleTodayCompleted: {
            backgroundColor: colors.xpGold,
            borderColor: colors.xpGold,
        },
        footer: {
            backgroundColor: 'rgba(88, 204, 2, 0.1)', // Light green bg
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 32, // Rounded pill shape
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
        },
        footerText: {
            fontSize: 14,
            fontWeight: '600',
            color: colors.success,
        },
        blurOverlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 24,
            overflow: 'hidden',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
        },
        loginPrompt: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            paddingVertical: 16,
            paddingHorizontal: 24,
            borderRadius: 16,
            alignItems: 'center',
            gap: 12,
        },
        loginPromptText: {
            fontSize: 16,
            fontWeight: '600',
            color: '#FFFFFF',
            textAlign: 'center',
        },
    }), [themeVersion, activeTheme]);

    // Get day names from translations (reactive to language changes)
    const dayNames = useMemo(() => [
        t('weeklyActivity.days.mon'),
        t('weeklyActivity.days.tue'),
        t('weeklyActivity.days.wed'),
        t('weeklyActivity.days.thu'),
        t('weeklyActivity.days.fri'),
        t('weeklyActivity.days.sat'),
        t('weeklyActivity.days.sun'),
    ], [t]);

    // Helper functions - defined early with useCallback
    const getDayName = useCallback((date: Date) => {
        const dayIndex = date.getDay(); // 0 = Sunday, 1 = Monday
        const mapIndex = dayIndex === 0 ? 6 : dayIndex - 1;
        // Safety check to prevent array index out of bounds
        if (mapIndex < 0 || mapIndex >= dayNames.length) {
            console.warn('⚠️ Invalid day index:', mapIndex, 'dayIndex:', dayIndex);
            return dayNames[0] || ''; // Fallback to first day or empty string
        }
        return dayNames[mapIndex] || '';
    }, [dayNames]);

    const getEmptyWeek = useCallback((): DayActivity[] => {
        const now = new Date();
        // Start from today if no data
        const startDate = new Date(now);
        startDate.setHours(0, 0, 0, 0);

        return Array.from({ length: 7 }).map((_, index) => {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + index);

            // Compare dates without time
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const checkDate = new Date(date);
            checkDate.setHours(0, 0, 0, 0);

            return {
                day: getDayName(date),
                completed: false,
                isFuture: checkDate > today,
                isToday: checkDate.getTime() === today.getTime(),
            };
        });
    }, [getDayName]);

    // Get streak message based on current streak
    const getStreakMessage = useCallback((currentStreak: number): string => {
        // Clamp streak between 1 and 91+
        const streakKey = currentStreak <= 0 ? 1 : currentStreak > 90 ? 'default' : String(currentStreak);
        return t(`weeklyActivity.streakMessages.${streakKey}`);
    }, [t]);

    const fetchWeeklyActivity = useCallback(async () => {
        if (!user?.id) return;

        try {
            const toLocalISOString = (date: Date) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            };

            const now = new Date();
            now.setHours(0, 0, 0, 0);

            // Get user's stats from users table
            const { data: stats } = await database.dailyActivity.getStats(user.id);

            if (!stats) {
                setWeekData(getEmptyWeek());
                return;
            }

            const currentStreak = stats.streak || 0;
            setStreak(currentStreak);
            const weeklyActivity = (stats.weekly_activity as string[]) || [];

            // Calculate Start Date
            const todayStr = toLocalISOString(now);
            const isTodayDone = weeklyActivity.includes(todayStr);

            // Calculate effective streak position in the 7-day cycle
            // If today is done, we are at 'currentStreak'.
            // If today is NOT done, we are at 'currentStreak + 1' (working on the next day of streak).
            const effectiveStreak = Math.max(1, isTodayDone ? currentStreak : currentStreak + 1);

            // Calculate how many days to go back to find the start of the current 7-day cycle
            const daysToGoBack = (effectiveStreak - 1) % 7;

            const startDate = new Date(now);
            startDate.setDate(now.getDate() - daysToGoBack);
            startDate.setHours(0, 0, 0, 0);

            const weekActivity: DayActivity[] = Array.from({ length: 7 }).map((_, index) => {
                const dayDate = new Date(startDate);
                dayDate.setDate(startDate.getDate() + index);
                const dateString = toLocalISOString(dayDate); // YYYY-MM-DD (Local)

                const isFuture = dayDate > now;
                const isToday = dayDate.getTime() === now.getTime();

                // Check if user has activity on this day
                const activeOnDay = weeklyActivity.includes(dateString);

                // isTodayDone is already calculated

                return {
                    day: getDayName(dayDate),
                    completed: activeOnDay,
                    isFuture,
                    isToday,
                };
            });

            setWeekData(weekActivity);
            setTodayCompleted(isTodayDone);
        } catch (error) {
            console.error('❌ Failed to fetch weekly activity:', error);
            setWeekData(getEmptyWeek());
        }
    }, [user?.id, getDayName, getEmptyWeek]);

    const checkRewardStatus = useCallback(async () => {
        if (!user?.id) return;
        try {
            const today = new Date().toISOString().split('T')[0];
            const lastRewardDate = await AsyncStorage.getItem(`last_reward_date_${user.id}`);

            if (lastRewardDate === today) {
                setRewardClaimed(true);
            } else {
                setRewardClaimed(false);
            }
        } catch (e) {
            console.error('Error checking reward status:', e);
        }
    }, [user?.id]);

    // Load data when screen comes into focus or user/auth changes
    useFocusEffect(
        useCallback(() => {
            if (isAuthenticated && user?.id) {
                fetchWeeklyActivity();
                checkRewardStatus();
            } else if (!isAuthenticated || !user?.id) {
                setWeekData(getEmptyWeek());
                setTodayCompleted(false);
                setStreak(0);
            }
        }, [user?.id, isAuthenticated, fetchWeeklyActivity, getEmptyWeek, checkRewardStatus])
    );

    const handleClaimReward = async () => {
        if (!user?.id || rewardClaimed) return;

        try {
            // Give 1000 XP reward
            const REWARD_AMOUNT = 1000;
            const { error } = await database.users.updateXP(user.id, REWARD_AMOUNT);

            if (error) throw error;

            addXP(REWARD_AMOUNT);

            // Save claim status persistently
            const today = new Date().toISOString().split('T')[0];
            await AsyncStorage.setItem(`last_reward_date_${user.id}`, today);

            setRewardClaimed(true);
            setShowRewardModal(true);
        } catch (error) {
            console.error('Error claiming reward:', error);
            Alert.alert("Hata", "Ödül alınırken bir sorun oluştu.");
        }
    };

    return (
        <View style={styles.container}>
            {/* Header - Always Visible */}
            <View style={styles.header}>
                <View style={styles.headerTextContainer}>
                    <Text style={styles.title}>{t('weeklyActivity.title')}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.xpGold }}>{streak} gün</Text>
                    <View style={styles.iconContainer}>
                        <Fire size={20} color={colors.xpGold} weight="fill" />
                    </View>
                </View>
            </View>

            {/* Content Container - Can be blurred */}
            <View style={{ position: 'relative' }}>
                {/* Week Days */}
                <View style={styles.weekContainer}>
                    {weekData.map((dayData, index) => (
                        <View key={index} style={styles.dayContainer}>
                            <Text style={styles.dayLabel}>{dayData.day}</Text>
                            <View
                                style={[
                                    styles.dayCircle,
                                    dayData.completed && styles.dayCircleCompleted,
                                    dayData.isToday && styles.dayCircleToday,
                                    (dayData.isToday && dayData.completed) && styles.dayCircleTodayCompleted,
                                ]}
                            >
                                {dayData.completed && (
                                    <Check
                                        size={18}
                                        color={dayData.isToday ? colors.textOnPrimary : colors.textOnPrimary} // Always white on completed
                                        weight="bold"
                                    />
                                )}
                            </View>
                        </View>
                    ))}
                </View>

                {/* Footer Text */}
                <View style={styles.footer}>
                    {todayCompleted ? (
                        <>
                            <CheckCircle size={20} color={colors.success} weight="fill" />
                            <Text style={styles.footerText}>
                                {getStreakMessage(streak)}
                            </Text>
                        </>
                    ) : (
                        <Text style={[styles.footerText, { color: colors.textSecondary }]}>
                            {t('weeklyActivity.todayNotCompleted')}
                        </Text>
                    )}
                </View>

                {/* Blur Overlay for Non-Authenticated Users - Only covers content */}
                {!isAuthenticated && (
                    <View style={styles.blurOverlay}>
                        <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill}>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <View style={styles.loginPrompt}>
                                    <LockKey size={32} color="#FFFFFF" weight="fill" />
                                    <Text style={styles.loginPromptText}>
                                        Bu özellik için giriş yapmalısınız.
                                    </Text>
                                </View>
                            </View>
                        </BlurView>
                    </View>
                )}
            </View>

            <RewardModal
                visible={showRewardModal}
                onClose={() => setShowRewardModal(false)}
                xpAmount={1000}
            />
        </View>
    );
});

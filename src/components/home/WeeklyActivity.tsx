import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useEffect, useState, useCallback, useMemo, memo, useRef } from 'react';
import { useFocusEffect } from 'expo-router';
import { colors } from '@constants/colors';
import { Target, TreasureChest, Check, Fire } from 'phosphor-react-native';
import { database } from '@/lib/supabase/database';
import { useAuth } from '@/store';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { RewardModal } from './RewardModal';

interface DayActivity {
    day: string;
    completed: boolean;
    isFuture: boolean;
    isToday: boolean;
}

export const WeeklyActivity = memo(function WeeklyActivity() {
    const { t } = useTranslation();
    const { user, isAuthenticated } = useAuth();
    const { themeVersion } = useTheme();
    const [weekData, setWeekData] = useState<DayActivity[]>([]);
    const [todayCompleted, setTodayCompleted] = useState(false);
    const [streak, setStreak] = useState(0);
    const [rewardClaimed, setRewardClaimed] = useState(false);
    const [showRewardModal, setShowRewardModal] = useState(false);

    // Dynamic styles
    const styles = useMemo(() => StyleSheet.create({
        container: {
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 16,
            marginBottom: 24,
            borderBottomWidth: 4,
            borderBottomColor: colors.border,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
        },
        titleContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        title: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.textPrimary,
        },
        streakText: {
            fontSize: 16,
            fontWeight: 'bold',
            color: colors.primary,
        },
        weekContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 16,
            gap: 4,
        },
        dayContainer: {
            alignItems: 'center',
            flex: 1,
        },
        dayLabel: {
            fontSize: 11,
            fontWeight: '600',
            color: colors.textSecondary,
            marginBottom: 16,
        },
        dayCircle: {
            width: 32,
            height: 32,
            borderRadius: 16,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 2,
            borderColor: colors.border,
        },
        todayCircle: {
            borderColor: colors.textPrimary,
        },
        footer: {
            backgroundColor: colors.backgroundLighter,
            padding: 12,
            borderRadius: 12,
            alignItems: 'center',
        },
        footerText: {
            fontSize: 14,
            fontWeight: '600',
            color: colors.textSecondary,
        },
    }), [themeVersion]);

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

    // Load data when screen comes into focus or user/auth changes
    useFocusEffect(
        useCallback(() => {
            if (isAuthenticated && user?.id) {
                fetchWeeklyActivity();
            } else {
                setWeekData(getEmptyWeek());
                setTodayCompleted(false);
                setStreak(0);
            }
        }, [user?.id, isAuthenticated, fetchWeeklyActivity, getEmptyWeek])
    );



    const handleClaimReward = async () => {
        if (!user?.id || rewardClaimed) return;

        try {
            // Give 1000 XP reward
            const REWARD_AMOUNT = 1000; // Updated REWARD_AMOUNT
            const { error } = await database.users.updateXP(user.id, REWARD_AMOUNT);

            if (error) throw error;

            setRewardClaimed(true);
            setShowRewardModal(true); // Updated to show modal instead of Alert
        } catch (error) {
            console.error('Error claiming reward:', error);
            Alert.alert("Hata", "Ödül alınırken bir sorun oluştu.");
        }
    };

    const getDayBackgroundColor = (dayData: DayActivity) => {
        if (dayData.isFuture) return colors.backgroundLighter;
        if (dayData.completed) {
            return colors.success;
        }
        return colors.error;
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Target size={24} color={colors.primary} weight="fill" />
                    <Text style={styles.title}>{t('weeklyActivity.title')}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Fire size={20} color={colors.primary} weight="fill" />
                    <Text style={styles.streakText}>{streak} {t('weeklyActivity.streak')}</Text>
                </View>
            </View>

            {/* Week Days */}
            <View style={styles.weekContainer}>
                {weekData.map((dayData, index) => (
                    <View key={index} style={styles.dayContainer}>
                        <Text style={styles.dayLabel}>{dayData.day}</Text>
                        {index === 6 ? (
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={handleClaimReward}
                                disabled={!dayData.completed || rewardClaimed}
                                style={[
                                    styles.dayCircle,
                                    { backgroundColor: 'transparent' }, // Keep border, transparent bg
                                    dayData.isToday && styles.todayCircle,
                                    dayData.completed && {
                                        width: 48,
                                        height: 48,
                                        borderRadius: 24,
                                        borderWidth: 3,
                                        borderColor: colors.warning, // Gold border
                                        backgroundColor: colors.secondary, // Blue background
                                        marginTop: -8,
                                        shadowColor: colors.warning,
                                        shadowOffset: { width: 0, height: 4 },
                                        shadowOpacity: 0.3,
                                        shadowRadius: 8,
                                        elevation: 8,
                                    },
                                    rewardClaimed && {
                                        opacity: 0.5, // Dim if already claimed
                                        backgroundColor: colors.surfaceLight
                                    }
                                ]}
                            >
                                <TreasureChest
                                    size={dayData.completed ? 32 : 24}
                                    color={dayData.completed ? colors.warning : colors.textSecondary}
                                    weight="fill"
                                />
                            </TouchableOpacity>
                        ) : (
                            <View
                                style={[
                                    styles.dayCircle,
                                    { backgroundColor: getDayBackgroundColor(dayData) },
                                    dayData.isToday && styles.todayCircle,
                                ]}
                            >
                                {!dayData.isFuture && (
                                    <Check
                                        size={16}
                                        color={colors.textOnPrimary}
                                        weight="bold"
                                    />
                                )}
                            </View>
                        )}
                    </View>
                ))}
            </View>

            {/* Footer Text */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    {todayCompleted
                        ? t('weeklyActivity.todayCompleted')
                        : t('weeklyActivity.todayNotCompleted')}
                </Text>
            </View>

            <RewardModal
                visible={showRewardModal}
                onClose={() => setShowRewardModal(false)}
                xpAmount={1000}
            />
        </View>
    );
});

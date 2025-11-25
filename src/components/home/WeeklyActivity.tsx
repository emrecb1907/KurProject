import { View, Text, StyleSheet } from 'react-native';
import { useEffect, useState, useCallback, useMemo, memo, useRef } from 'react';
import { colors } from '@constants/colors';
import { Target, Flag, Check, Fire } from 'phosphor-react-native';
import { database } from '@/lib/supabase/database';
import { useAuth } from '@/store';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

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
            marginBottom: 6,
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
        return dayNames[mapIndex];
    }, [dayNames]);

    const getEmptyWeek = useCallback((): DayActivity[] => {
        const now = new Date();
        // Default to Monday start if no data
        const dayOfWeek = now.getDay();
        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        const startDate = new Date(now);
        startDate.setDate(now.getDate() + mondayOffset);
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
            const startDate = new Date(now);
            if (currentStreak > 0) {
                // If streak exists, start from (Today - (Streak - 1))
                // But cap it at 6 days ago (so we show a 7-day window ending today or future)
                // Actually, if streak is 4, we want to show [Day-3, Day-2, Day-1, Today, +3 Future]
                // So we go back (streak - 1) days.
                // Max go back is 6 days (to show a full week ending today).
                const daysToGoBack = Math.min(currentStreak - 1, 6);
                startDate.setDate(now.getDate() - daysToGoBack);
            } else {
                // If no streak, default to this week's Monday
                const dayOfWeek = now.getDay();
                const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
                startDate.setDate(now.getDate() + mondayOffset);
            }
            startDate.setHours(0, 0, 0, 0);

            let isTodayDone = false;
            const todayStr = toLocalISOString(now);

            const weekActivity: DayActivity[] = Array.from({ length: 7 }).map((_, index) => {
                const dayDate = new Date(startDate);
                dayDate.setDate(startDate.getDate() + index);
                const dateString = toLocalISOString(dayDate); // YYYY-MM-DD (Local)

                const isFuture = dayDate > now;
                const isToday = dayDate.getTime() === now.getTime();

                // Check if user has activity on this day
                const activeOnDay = weeklyActivity.includes(dateString);

                if (isToday && activeOnDay) {
                    isTodayDone = true;
                }

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

    // Track if component has mounted to prevent unnecessary re-fetches on category changes
    const mountedRef = useRef(false);

    // Load data only on mount and when user/auth changes
    useEffect(() => {
        if (isAuthenticated && user?.id) {
            if (!mountedRef.current) {
                fetchWeeklyActivity();
                mountedRef.current = true;
            }
        } else {
            setWeekData(getEmptyWeek());
            setTodayCompleted(false);
            setStreak(0);
            mountedRef.current = false;
        }
    }, [user?.id, isAuthenticated, fetchWeeklyActivity, getEmptyWeek]);

    // Refresh data when language changes (but only if already mounted)
    useEffect(() => {
        if (isAuthenticated && user?.id && mountedRef.current) {
            fetchWeeklyActivity();
        }
    }, [dayNames, isAuthenticated, user?.id, fetchWeeklyActivity]);

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
                            <View style={[
                                styles.dayCircle,
                                { backgroundColor: 'transparent' }, // Keep border, transparent bg
                                dayData.isToday && styles.todayCircle
                            ]}>
                                <Flag
                                    size={24}
                                    color={dayData.completed ? colors.success : colors.textSecondary}
                                    weight="fill"
                                />
                            </View>
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
        </View>
    );
});

import { View, Text, StyleSheet } from 'react-native';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { colors } from '@constants/colors';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Tick01Icon, Target02Icon, Flag01Icon } from '@hugeicons/core-free-icons';
import { database } from '@/lib/supabase/database';
import { useAuth } from '@/store';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

interface DayActivity {
    day: string;
    completed: boolean;
    isFuture: boolean;
    isToday: boolean;
}

export function WeeklyActivity() {
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

    // Refresh data every time screen comes into focus
    useFocusEffect(
        useCallback(() => {
            if (isAuthenticated && user?.id) {
                fetchWeeklyActivity();
            } else {
                setWeekData(getEmptyWeek());
                setTodayCompleted(false);
                setStreak(0);
            }
        }, [user?.id, isAuthenticated])
    );

    // Refresh data when language changes
    useEffect(() => {
        if (isAuthenticated && user?.id) {
            fetchWeeklyActivity();
        } else {
            setWeekData(getEmptyWeek());
        }
    }, [dayNames]);

    const getEmptyWeek = (): DayActivity[] => {
        const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, ...
        const mondayIndex = today === 0 ? 6 : today - 1;

        return dayNames.map((day, index) => ({
            day,
            completed: false,
            isFuture: index > mondayIndex,
            isToday: index === mondayIndex,
        }));
    };

    const fetchWeeklyActivity = async () => {
        if (!user?.id) return;

        try {
            const toLocalISOString = (date: Date) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            };

            const now = new Date();
            const dayOfWeek = now.getDay();
            const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
            const monday = new Date(now);
            monday.setDate(now.getDate() + mondayOffset);
            monday.setHours(0, 0, 0, 0);

            // Get user's stats from users table
            const { data: stats } = await database.dailyActivity.getStats(user.id);

            if (!stats) {
                setWeekData(getEmptyWeek());
                return;
            }

            setStreak(stats.streak || 0);
            const weeklyActivity = (stats.weekly_activity as string[]) || [];

            let isTodayDone = false;
            const todayStr = toLocalISOString(now);

            const weekActivity: DayActivity[] = dayNames.map((day, index) => {
                const dayDate = new Date(monday);
                dayDate.setDate(monday.getDate() + index);
                const dateString = toLocalISOString(dayDate); // YYYY-MM-DD (Local)

                const todayIndex = now.getDay() === 0 ? 6 : now.getDay() - 1;
                const isFuture = index > todayIndex;
                const isToday = index === todayIndex;

                // Check if user has activity on this day
                const activeOnDay = weeklyActivity.includes(dateString);

                if (isToday && activeOnDay) {
                    isTodayDone = true;
                }

                return {
                    day,
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
    };

    const getDayBackgroundColor = (dayData: DayActivity) => {
        if (dayData.isFuture) return colors.backgroundLighter;
        if (dayData.completed) {
            return dayData.isToday ? colors.primary : colors.success;
        }
        return colors.error;
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <HugeiconsIcon icon={Target02Icon} size={24} color={colors.primary} />
                    <Text style={styles.title}>{t('weeklyActivity.title')}</Text>
                </View>
                <Text style={styles.streakText}>🔥 {streak} {t('weeklyActivity.streak')}</Text>
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
                                <HugeiconsIcon
                                    icon={Flag01Icon}
                                    size={24}
                                    color={dayData.completed ? colors.success : colors.textSecondary}
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
                                    <HugeiconsIcon
                                        icon={Tick01Icon}
                                        size={16}
                                        color={colors.textOnPrimary}
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
}

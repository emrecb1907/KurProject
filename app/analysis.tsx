import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ChartBar, Trophy, Fire, Target, BookOpen, Lightning, CheckCircle, XCircle, CaretLeft, CaretRight } from 'phosphor-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { colors } from '@constants/colors';
import { useStatusBar } from '@/hooks/useStatusBar';
import * as Haptics from 'expo-haptics';
import { useAuth } from '@/store';
import { useUserStats } from '@hooks';
import { HeaderButton } from '@/components/ui';
import { database } from '@/lib/supabase/database';
import { useQuery } from '@tanstack/react-query';

const SCREEN_WIDTH = Dimensions.get('window').width;

// Day names for display
const DAY_NAMES_TR = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
const DAY_NAMES_EN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Helper to get Monday of a given week
const getWeekStart = (date: Date): Date => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
};

// Helper to format date range for header
const formatWeekRange = (weekStart: Date, lang: string): string => {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const startDay = weekStart.getDate();
    const endDay = weekEnd.getDate();
    const monthNames = lang === 'tr'
        ? ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara']
        : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    if (weekStart.getMonth() === weekEnd.getMonth()) {
        return `${startDay} - ${endDay} ${monthNames[weekStart.getMonth()]}`;
    }
    return `${startDay} ${monthNames[weekStart.getMonth()]} - ${endDay} ${monthNames[weekEnd.getMonth()]}`;
};

// Test ID to readable name mapping - handles various formats
const TEST_NAMES: Record<string, { tr: string; en: string }> = {
    // Numeric IDs (from database test_id)
    '1': { tr: 'Harfler', en: 'Letters' },
    '2': { tr: 'Kelime Bilgisi', en: 'Vocabulary' },
    '3': { tr: 'Ayetler', en: 'Verses' },
    '4': { tr: 'Genel Quiz', en: 'General Quiz' },
    '5': { tr: 'İslam Tarihi', en: 'Islamic History' },
    '6': { tr: 'Namaz Bilgisi', en: 'Prayer Knowledge' },
    '7': { tr: 'Peygamberler Tarihi', en: 'Prophets History' },
    '8': { tr: 'Siyer', en: 'Siyer' },
    '9': { tr: 'İman Esasları', en: 'Pillars of Faith' },
    '10': { tr: 'Oruç Bilgisi', en: 'Fasting Knowledge' },
    '11': { tr: 'Ahlak ve Adap', en: 'Ethics & Manners' },
    '12': { tr: 'Abdest ve Temizlik', en: 'Ablution & Cleanliness' },
    // String IDs (fallback)
    'letters': { tr: 'Harfler', en: 'Letters' },
    'vocabulary': { tr: 'Kelime Bilgisi', en: 'Vocabulary' },
    'verses': { tr: 'Ayetler', en: 'Verses' },
    'quiz': { tr: 'Genel Quiz', en: 'General Quiz' },
    'islam-tarihi': { tr: 'İslam Tarihi', en: 'Islamic History' },
    'namaz-bilgisi': { tr: 'Namaz Bilgisi', en: 'Prayer Knowledge' },
    'peygamberlerTarihi': { tr: 'Peygamberler Tarihi', en: 'Prophets History' },
    'siyer': { tr: 'Siyer', en: 'Siyer' },
    'iman-esaslari': { tr: 'İman Esasları', en: 'Pillars of Faith' },
    'oruc-bilgisi': { tr: 'Oruç Bilgisi', en: 'Fasting Knowledge' },
    'ahlak-adap': { tr: 'Ahlak ve Adap', en: 'Ethics & Manners' },
    'abdest-temizlik': { tr: 'Abdest ve Temizlik', en: 'Ablution & Cleanliness' },
};

type TabType = 'general' | 'tests';

interface TestResult {
    id: string;
    test_id: string;
    correct_answer: number;
    total_question: number;
    percent: number;
    test_count: number;
    created_at: string;
}

interface DailyLog {
    log_date: string;
    tests_completed: number;
    questions_solved: number;
    correct_answers: number;
    xp_earned: number;
    lessons_completed: number;
}

export default function AnalysisScreen() {
    const { t, i18n } = useTranslation();
    const router = useRouter();
    const { activeTheme } = useTheme();
    const { statusBarStyle } = useStatusBar();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<TabType>('general');
    const [selectedWeekStart, setSelectedWeekStart] = useState<Date>(() => getWeekStart(new Date()));
    const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
    const [chartType, setChartType] = useState<'xp' | 'success' | 'questions'>('xp');

    const isDark = activeTheme === 'dark';
    const lang = i18n.language === 'en' ? 'en' : 'tr';
    const dayNames = lang === 'tr' ? DAY_NAMES_TR : DAY_NAMES_EN;

    // Get stats from single React Query source - same as profile page
    const { data: userStats, userData, isLoading } = useUserStats(user?.id);

    // Fetch daily logs for chart (last 28 days)
    const { data: dailyLogs, isLoading: isLoadingLogs } = useQuery({
        queryKey: ['dailyLogs', user?.id],
        queryFn: async () => {
            if (!user?.id) return [];
            const { data, error } = await database.dailyLogs.getMonth(user.id);
            if (error) throw error;
            return (data || []) as DailyLog[];
        },
        enabled: !!user?.id,
        staleTime: 60000,
    });

    // Fetch test results for Tests tab
    const { data: testResults, isLoading: isLoadingTests, error: testError } = useQuery({
        queryKey: ['testResults', user?.id],
        queryFn: async () => {
            if (!user?.id) return [];
            const { data, error } = await database.tests.getHistory(user.id);
            if (error) throw error;
            return (data || []) as TestResult[];
        },
        enabled: !!user?.id,
        staleTime: 30000,
    });

    // Generate weekly data from dailyLogs
    const weeklyData = useMemo(() => {
        const result: { day: string; xp: number; questions: number; date: string; tests: number; lessons: number; correct: number }[] = [];

        for (let i = 0; i < 7; i++) {
            const date = new Date(selectedWeekStart);
            date.setDate(date.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];

            const log = dailyLogs?.find(l => l.log_date === dateStr);

            result.push({
                day: dayNames[i],
                xp: log?.xp_earned || 0,
                questions: log?.questions_solved || 0,
                date: dateStr,
                tests: log?.tests_completed || 0,
                lessons: log?.lessons_completed || 0,
                correct: log?.correct_answers || 0,
            });
        }

        return result;
    }, [dailyLogs, selectedWeekStart, dayNames]);

    // Calculate max for chart scaling
    const maxChartValue = Math.max(...weeklyData.map(d => d.xp), 1);
    const weekTotalXP = weeklyData.reduce((sum, d) => sum + d.xp, 0);
    const weekTotalQuestions = weeklyData.reduce((sum, d) => sum + d.questions, 0);

    // Week navigation handlers
    const canGoNext = useMemo(() => {
        const today = getWeekStart(new Date());
        return selectedWeekStart < today;
    }, [selectedWeekStart]);

    const canGoPrev = useMemo(() => {
        // Allow going back up to 4 weeks
        const fourWeeksAgo = new Date();
        fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
        return selectedWeekStart > getWeekStart(fourWeeksAgo);
    }, [selectedWeekStart]);

    const goToPrevWeek = useCallback(() => {
        if (!canGoPrev) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        const newStart = new Date(selectedWeekStart);
        newStart.setDate(newStart.getDate() - 7);
        setSelectedWeekStart(newStart);
    }, [selectedWeekStart, canGoPrev]);

    const goToNextWeek = useCallback(() => {
        if (!canGoNext) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        const newStart = new Date(selectedWeekStart);
        newStart.setDate(newStart.getDate() + 7);
        setSelectedWeekStart(newStart);
    }, [selectedWeekStart, canGoNext]);

    // Check if selected week is current week
    const isCurrentWeek = useMemo(() => {
        const today = getWeekStart(new Date());
        return selectedWeekStart.getTime() === today.getTime();
    }, [selectedWeekStart]);

    // Use React Query data with fallbacks - avoid duplicate fetch
    const totalXP = userData?.total_xp ?? 0;
    const streak = userData?.streak ?? userData?.streak_count ?? 0;
    const correctAnswers = userStats?.correctAnswers ?? 0;
    const completedLessons = userData?.total_lessons_completed ?? userStats?.lessonsCompleted ?? 0;
    const completedTests = userStats?.total_tests_completed ?? userStats?.completedTests ?? 0;


    const getTestName = (testId: string): string => {
        // Try exact match first
        if (TEST_NAMES[testId]) {
            return TEST_NAMES[testId][lang];
        }

        // Clean the test_id and try various patterns
        const cleanId = testId
            .replace(/^\/?games\//, '') // Remove /games/ prefix
            .replace(/\/\d+$/, '')      // Remove trailing /1, /2, etc.
            .replace(/-\d+$/, '')       // Remove trailing -1, -2, etc.
            .replace(/[0-9]/g, '')       // Remove all numbers
            .replace(/[-_]/g, '-')       // Normalize separators
            .trim();

        if (TEST_NAMES[cleanId]) {
            return TEST_NAMES[cleanId][lang];
        }

        // Try first word
        const firstWord = cleanId.split('-')[0];
        if (TEST_NAMES[firstWord]) {
            return TEST_NAMES[firstWord][lang];
        }

        // Fallback: format the id nicely
        return testId.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const getPercent = (test: TestResult): number => {
        // Use stored percent if available, otherwise calculate
        if (test.percent > 0) return test.percent;
        if (test.total_question > 0) {
            return Math.round((test.correct_answer / test.total_question) * 100);
        }
        return 0;
    };

    const handleTabPress = (tab: TabType) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setActiveTab(tab);
    };

    const styles = useMemo(() => StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 16,
            paddingHorizontal: 20,
            position: 'relative',
        },
        backButtonContainer: {
            position: 'absolute',
            left: 16,
            zIndex: 10,
        },
        headerTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.textPrimary,
            textAlign: 'center',
        },
        // Tab styles
        tabContainer: {
            flexDirection: 'row',
            paddingHorizontal: 20,
            gap: 10,
            marginTop: 8,
            marginBottom: 12,
        },
        tab: {
            flex: 1,
            paddingVertical: 10,
            paddingHorizontal: 14,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
        },
        tabActive: {
            backgroundColor: colors.primary,
        },
        tabInactive: {
            backgroundColor: isDark ? colors.surface : colors.backgroundDarker,
            borderWidth: 1,
            borderColor: colors.border,
        },
        tabText: {
            fontSize: 13,
            fontWeight: '600',
        },
        tabTextActive: {
            color: isDark ? '#000' : '#FFF',
        },
        tabTextInactive: {
            color: colors.textSecondary,
        },
        content: {
            padding: 20,
        },
        summaryCard: {
            backgroundColor: colors.surface,
            borderRadius: 20,
            padding: 20,
            marginBottom: 24,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.05,
            shadowRadius: 12,
            elevation: 4,
        },
        summaryTitle: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.textSecondary,
            marginBottom: 16,
        },
        statsRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        statItem: {
            alignItems: 'center',
            flex: 1,
        },
        statValue: {
            fontSize: 24,
            fontWeight: 'bold',
            color: colors.textPrimary,
            marginBottom: 4,
        },
        statLabel: {
            fontSize: 12,
            color: colors.textSecondary,
        },
        chartContainer: {
            backgroundColor: colors.surface,
            borderRadius: 20,
            padding: 20,
            marginBottom: 24,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.05,
            shadowRadius: 12,
            elevation: 4,
        },
        chartHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
        },
        chartTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.textPrimary,
        },
        chart: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            height: 200,
            paddingTop: 20,
        },
        barContainer: {
            alignItems: 'center',
            flex: 1,
            gap: 8,
        },
        bar: {
            width: 12,
            borderRadius: 6,
            backgroundColor: colors.primaryLight,
        },
        barActive: {
            backgroundColor: colors.warning,
        },
        barLabel: {
            fontSize: 12,
            color: colors.textSecondary,
            fontWeight: '500',
        },
        detailsGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 16,
        },
        detailCard: {
            width: (SCREEN_WIDTH - 56) / 2,
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
        },
        detailIcon: {
            width: 40,
            height: 40,
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 12,
        },
        detailValue: {
            fontSize: 20,
            fontWeight: 'bold',
            color: colors.textPrimary,
            marginBottom: 4,
        },
        detailLabel: {
            fontSize: 13,
            color: colors.textSecondary,
        },
        // Tests tab styles
        testCard: {
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 16,
            marginBottom: 12,
            flexDirection: 'row',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
        },
        testIconContainer: {
            width: 48,
            height: 48,
            borderRadius: 24,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 16,
        },
        testInfo: {
            flex: 1,
        },
        testName: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.textPrimary,
            marginBottom: 4,
        },
        testStats: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
        },
        testStatItem: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
        },
        testStatText: {
            fontSize: 13,
            color: colors.textSecondary,
        },
        testPercentage: {
            fontSize: 18,
            fontWeight: 'bold',
        },
        emptyState: {
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 60,
        },
        emptyText: {
            fontSize: 16,
            color: colors.textSecondary,
            marginTop: 16,
        },
        loadingContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 60,
        },
    }), [activeTheme, isDark]);

    const renderGeneralTab = () => (
        <>
            {/* Top Summary */}
            <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>{t('premiumCenter.analysis.overview')}</Text>
                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Fire size={32} color={colors.primary} weight="fill" style={{ marginBottom: 8 }} />
                        <Text style={styles.statValue}>{streak}</Text>
                        <Text style={styles.statLabel}>{t('premiumCenter.analysis.streak')}</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Trophy size={32} color={colors.warning} weight="fill" style={{ marginBottom: 8 }} />
                        <Text style={styles.statValue}>{totalXP}</Text>
                        <Text style={styles.statLabel}>{t('premiumCenter.analysis.totalXP')}</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Target size={32} color={colors.success} weight="fill" style={{ marginBottom: 8 }} />
                        <Text style={styles.statValue}>%{userStats?.successRate || 0}</Text>
                        <Text style={styles.statLabel}>{t('premiumCenter.analysis.successRate')}</Text>
                    </View>
                </View>
            </View>

            {/* Weekly Chart */}
            <View style={styles.chartContainer}>
                {/* Chart Type Toggle */}
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: 8,
                    marginBottom: 16
                }}>
                    {[
                        { key: 'xp', label: lang === 'tr' ? 'XP' : 'XP' },
                        { key: 'success', label: lang === 'tr' ? 'Başarı %' : 'Success %' },
                        { key: 'questions', label: lang === 'tr' ? 'Soru' : 'Questions' },
                    ].map((type) => (
                        <TouchableOpacity
                            key={type.key}
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                setChartType(type.key as 'xp' | 'success' | 'questions');
                                setSelectedDayIndex(null);
                            }}
                            style={{
                                paddingVertical: 8,
                                paddingHorizontal: 16,
                                borderRadius: 20,
                                backgroundColor: chartType === type.key ? colors.primary : colors.backgroundDarker,
                                borderWidth: chartType === type.key ? 0 : 1,
                                borderColor: colors.border,
                            }}
                        >
                            <Text style={{
                                fontSize: 13,
                                fontWeight: '600',
                                color: chartType === type.key
                                    ? (isDark ? '#000' : '#FFF')
                                    : colors.textSecondary,
                            }}>
                                {type.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Chart Header with Navigation */}
                <View style={[styles.chartHeader, { marginBottom: 24 }]}>
                    <TouchableOpacity
                        onPress={goToPrevWeek}
                        disabled={!canGoPrev}
                        style={{ opacity: canGoPrev ? 1 : 0.3 }}
                    >
                        <CaretLeft size={24} color={colors.textPrimary} weight="bold" />
                    </TouchableOpacity>

                    <View style={{ alignItems: 'center', flex: 1 }}>
                        <Text style={styles.chartTitle}>
                            {isCurrentWeek
                                ? (lang === 'tr' ? 'Bu Hafta' : 'This Week')
                                : formatWeekRange(selectedWeekStart, lang)
                            }
                        </Text>
                        <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>
                            {chartType === 'xp' && `${weekTotalXP} XP`}
                            {chartType === 'success' && `${weekTotalQuestions > 0 ? Math.round((weeklyData.reduce((s, d) => s + d.correct, 0) / weekTotalQuestions) * 100) : 0}% ${lang === 'tr' ? 'ortalama' : 'average'}`}
                            {chartType === 'questions' && `${weekTotalQuestions} ${lang === 'tr' ? 'soru' : 'questions'}`}
                        </Text>
                    </View>

                    <TouchableOpacity
                        onPress={goToNextWeek}
                        disabled={!canGoNext}
                        style={{ opacity: canGoNext ? 1 : 0.3 }}
                    >
                        <CaretRight size={24} color={colors.textPrimary} weight="bold" />
                    </TouchableOpacity>
                </View>

                {/* Loading State */}
                {isLoadingLogs ? (
                    <View style={{ height: 200, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="small" color={colors.primary} />
                    </View>
                ) : (
                    <View style={styles.chart}>
                        {weeklyData.map((data, index) => {
                            // Calculate values based on chartType
                            let value = 0;
                            let maxValue = 1;
                            let displayLabel = '';
                            let barColor = colors.primaryLight;

                            if (chartType === 'xp') {
                                value = data.xp;
                                maxValue = maxChartValue;
                                displayLabel = `${value}`;
                                barColor = colors.warning;
                            } else if (chartType === 'success') {
                                value = data.questions > 0 ? Math.round((data.correct / data.questions) * 100) : 0;
                                maxValue = 100;
                                displayLabel = `%${value}`;
                                barColor = value >= 80 ? colors.success : value >= 50 ? colors.warning : value > 0 ? colors.error : colors.border;
                            } else if (chartType === 'questions') {
                                value = data.questions;
                                maxValue = Math.max(...weeklyData.map(d => d.questions), 1);
                                displayLabel = `${value}`;
                                barColor = colors.primary;
                            }

                            const heightPercentage = maxValue > 0
                                ? Math.max((value / maxValue) * 100, value > 0 ? 5 : 0)
                                : 0;

                            const today = new Date().toISOString().split('T')[0];
                            const isToday = data.date === today;
                            const hasActivity = value > 0;
                            const isSelected = selectedDayIndex === index;

                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.barContainer}
                                    onPress={() => {
                                        if (hasActivity) {
                                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                            setSelectedDayIndex(isSelected ? null : index);
                                        }
                                    }}
                                    activeOpacity={hasActivity ? 0.7 : 1}
                                >
                                    {/* Value Label on top of bar */}
                                    {hasActivity && (
                                        <Text style={{
                                            fontSize: 10,
                                            color: isSelected ? colors.primary : barColor,
                                            fontWeight: '600',
                                            marginBottom: 4
                                        }}>
                                            {displayLabel}
                                        </Text>
                                    )}

                                    <View
                                        style={[
                                            styles.bar,
                                            { height: `${heightPercentage}%`, minHeight: hasActivity ? 8 : 4 },
                                            { backgroundColor: isSelected ? colors.primary : barColor },
                                            !hasActivity && { backgroundColor: colors.border, opacity: 0.5 }
                                        ]}
                                    />

                                    {/* Day Label */}
                                    <Text style={[
                                        styles.barLabel,
                                        isToday && { color: colors.warning, fontWeight: 'bold' },
                                        isSelected && { color: colors.primary, fontWeight: 'bold' }
                                    ]}>
                                        {data.day}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                )}

                {/* Day Detail Tooltip */}
                {selectedDayIndex !== null && weeklyData[selectedDayIndex] && (
                    <View style={{
                        backgroundColor: isDark ? colors.surface : '#F5F5F5',
                        borderRadius: 12,
                        padding: 12,
                        marginTop: 16,
                        borderWidth: 1,
                        borderColor: colors.primary + '40',
                    }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.textPrimary }}>
                                {weeklyData[selectedDayIndex].day} - {weeklyData[selectedDayIndex].date.split('-').reverse().join('/')}
                            </Text>
                            <TouchableOpacity onPress={() => setSelectedDayIndex(null)}>
                                <XCircle size={20} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.warning }}>{weeklyData[selectedDayIndex].xp}</Text>
                                <Text style={{ fontSize: 11, color: colors.textSecondary }}>XP</Text>
                            </View>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.primary }}>{weeklyData[selectedDayIndex].questions}</Text>
                                <Text style={{ fontSize: 11, color: colors.textSecondary }}>{lang === 'tr' ? 'Soru' : 'Questions'}</Text>
                            </View>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.success }}>{weeklyData[selectedDayIndex].correct}</Text>
                                <Text style={{ fontSize: 11, color: colors.textSecondary }}>{lang === 'tr' ? 'Doğru' : 'Correct'}</Text>
                            </View>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.secondary }}>{weeklyData[selectedDayIndex].tests}</Text>
                                <Text style={{ fontSize: 11, color: colors.textSecondary }}>{lang === 'tr' ? 'Test' : 'Tests'}</Text>
                            </View>
                        </View>
                    </View>
                )}
            </View>

            {/* Detailed Stats Grid */}
            <View style={styles.detailsGrid}>
                <View style={styles.detailCard}>
                    <View style={[styles.detailIcon, { backgroundColor: '#E3F2FD' }]}>
                        <BookOpen size={24} color={colors.secondary} weight="fill" />
                    </View>
                    <Text style={styles.detailValue}>{completedLessons}</Text>
                    <Text style={styles.detailLabel}>{t('premiumCenter.analysis.completedLessons')}</Text>
                </View>

                <View style={styles.detailCard}>
                    <View style={[styles.detailIcon, { backgroundColor: '#FFF9C4' }]}>
                        <ChartBar size={24} color={colors.warning} weight="fill" />
                    </View>
                    <Text style={styles.detailValue}>{completedTests}</Text>
                    <Text style={styles.detailLabel}>{t('premiumCenter.analysis.completedTests')}</Text>
                </View>

                <View style={styles.detailCard}>
                    <View style={[styles.detailIcon, { backgroundColor: '#E8F5E9' }]}>
                        <Target size={24} color={colors.success} weight="fill" />
                    </View>
                    <Text style={styles.detailValue}>{correctAnswers}</Text>
                    <Text style={styles.detailLabel}>{t('premiumCenter.analysis.correctAnswers')}</Text>
                </View>

                <View style={styles.detailCard}>
                    <View style={[styles.detailIcon, { backgroundColor: '#FFEBEE' }]}>
                        <Lightning size={24} color={colors.error} weight="fill" />
                    </View>
                    <Text style={styles.detailValue}>12.5s</Text>
                    <Text style={styles.detailLabel}>{t('premiumCenter.analysis.averageTime')}</Text>
                </View>
            </View>
        </>
    );

    const renderTestsTab = () => {
        if (isLoadingTests) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            );
        }

        if (!testResults || testResults.length === 0) {
            return (
                <View style={styles.emptyState}>
                    <ChartBar size={64} color={colors.textDisabled} weight="light" />
                    <Text style={styles.emptyText}>
                        {lang === 'tr' ? 'Henüz test çözmedin' : 'No tests completed yet'}
                    </Text>
                </View>
            );
        }
        // Calculate totals
        const totalTestsSolved = testResults.reduce((sum, t) => sum + (t.test_count || 0), 0);
        const totalCorrect = testResults.reduce((sum, t) => sum + (t.correct_answer || 0), 0);
        const totalQuestions = testResults.reduce((sum, t) => sum + (t.total_question || 0), 0);
        const overallPercent = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

        return (
            <>
                {/* Total Analysis Summary */}
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryTitle}>
                        {lang === 'tr' ? 'Genel Test Analizi' : 'Overall Test Analysis'}
                    </Text>
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <ChartBar size={32} color={colors.warning} weight="fill" style={{ marginBottom: 8 }} />
                            <Text style={styles.statValue}>{totalTestsSolved}</Text>
                            <Text style={styles.statLabel}>
                                {lang === 'tr' ? 'Toplam Çözüm' : 'Total Solved'}
                            </Text>
                        </View>
                        <View style={styles.statItem}>
                            <Target size={32} color={colors.success} weight="fill" style={{ marginBottom: 8 }} />
                            <Text style={styles.statValue}>{totalCorrect}/{totalQuestions}</Text>
                            <Text style={styles.statLabel}>
                                {lang === 'tr' ? 'Doğru/Toplam' : 'Correct/Total'}
                            </Text>
                        </View>
                        <View style={styles.statItem}>
                            <Trophy size={32} color={colors.primary} weight="fill" style={{ marginBottom: 8 }} />
                            <Text style={styles.statValue}>%{overallPercent}</Text>
                            <Text style={styles.statLabel}>
                                {lang === 'tr' ? 'Başarı Oranı' : 'Success Rate'}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Individual Test Cards - sorted by percentage desc, then A-Z */}
                {[...testResults]
                    .sort((a, b) => {
                        const percentA = getPercent(a);
                        const percentB = getPercent(b);
                        if (percentB !== percentA) {
                            return percentB - percentA; // Higher percentage first
                        }
                        // Same percentage, sort alphabetically
                        return getTestName(a.test_id).localeCompare(getTestName(b.test_id), 'tr');
                    })
                    .map((test) => {
                        const percent = getPercent(test);
                        const isGood = percent >= 70;
                        const percentColor = percent >= 80 ? colors.success :
                            percent >= 50 ? colors.warning : colors.error;

                        return (
                            <View key={test.id} style={styles.testCard}>
                                <View style={[styles.testIconContainer, { backgroundColor: percentColor + '20' }]}>
                                    {isGood ? (
                                        <CheckCircle size={28} color={percentColor} weight="fill" />
                                    ) : (
                                        <XCircle size={28} color={percentColor} weight="fill" />
                                    )}
                                </View>
                                <View style={styles.testInfo}>
                                    <Text style={styles.testName}>{getTestName(test.test_id)}</Text>
                                    <View style={styles.testStats}>
                                        <View style={styles.testStatItem}>
                                            <Target size={14} color={colors.textSecondary} />
                                            <Text style={styles.testStatText}>
                                                {test.correct_answer}/{test.total_question}
                                            </Text>
                                        </View>
                                        <View style={styles.testStatItem}>
                                            <ChartBar size={14} color={colors.textSecondary} />
                                            <Text style={styles.testStatText}>
                                                {test.test_count}x {lang === 'tr' ? 'çözüldü' : 'solved'}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                <Text style={[styles.testPercentage, { color: percentColor }]}>
                                    %{percent}
                                </Text>
                            </View>
                        );
                    })}
            </>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <View style={styles.backButtonContainer}>
                    <HeaderButton
                        title={t('common.back')}
                        showIcon={true}
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            router.back();
                        }}
                        style={{ paddingHorizontal: 12, paddingVertical: 8 }}
                    />
                </View>
                <Text style={styles.headerTitle}>{t('premiumCenter.features.detailedAnalysis.title')}</Text>
            </View>

            {/* Tabs */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'general' ? styles.tabActive : styles.tabInactive]}
                    onPress={() => handleTabPress('general')}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.tabText, activeTab === 'general' ? styles.tabTextActive : styles.tabTextInactive]}>
                        {lang === 'tr' ? 'Genel' : 'General'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'tests' ? styles.tabActive : styles.tabInactive]}
                    onPress={() => handleTabPress('tests')}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.tabText, activeTab === 'tests' ? styles.tabTextActive : styles.tabTextInactive]}>
                        {lang === 'tr' ? 'Testler' : 'Tests'}
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {activeTab === 'general' ? renderGeneralTab() : renderTestsTab()}
            </ScrollView>
        </SafeAreaView>
    );
}

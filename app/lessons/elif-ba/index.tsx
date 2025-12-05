import React, { useMemo, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    Easing,
} from 'react-native-reanimated';
import {
    BookOpen,
    CaretRight,
    User,
    Bell,
    Heart,
    GraduationCap,
    ArrowLeft,
    CheckCircle,
} from 'phosphor-react-native';

import { colors } from '@/constants/colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useStatusBar } from '@/hooks/useStatusBar';
import { getXPProgress, formatXP } from '@/lib/utils/levelCalculations';
import { useUser, useAuth } from '@/store';

interface LessonItem {
    id: string;
    title: string;
    route: string;
}

export default function ElifBaLessonsListScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const { statusBarStyle } = useStatusBar();
    const { themeVersion } = useTheme();

    // Get user data from Zustand store
    const { totalXP, currentLives, completedLessons } = useUser();
    const { user } = useAuth();

    // Calculate XP progress
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

    const styles = useMemo(() => getStyles(), [themeVersion]);

    const lessons: LessonItem[] = [
        {
            id: '101',
            title: 'Elif-Ba',
            route: '/lessons/elif-ba/1',
        },
        {
            id: '102',
            title: 'Harekeler',
            route: '/lessons/harekeler/1',
        },
        {
            id: '103',
            title: 'Harflerin Konumu',
            route: '/lessons/harflerin-konumu/1',
        },
        {
            id: '104',
            title: 'Üstün-1',
            route: '/lessons/ustun-1/1',
        },
        {
            id: '105',
            title: 'Üstün-2',
            route: '/lessons/ustun-2/1',
        },
        {
            id: '106',
            title: 'Üstün-3',
            route: '/lessons/ustun-3/1',
        },
        {
            id: '107',
            title: 'Esre',
            route: '/lessons/esre/1',
        },
        {
            id: '108',
            title: 'Ötre',
            route: '/lessons/otre/1',
        },
    ];

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar style={statusBarStyle} />

            {/* Header Section */}
            <View style={styles.topHeader}>
                <View style={styles.userInfo}>
                    <View style={styles.avatarContainer}>
                        <User size={24} color="rgba(0, 0, 0, 0.5)" weight="fill" />
                    </View>
                    <View style={styles.greetingContainer}>
                        <Text style={styles.greetingText}>{t('home.welcome')},</Text>
                        <Text style={styles.userName}>{user?.email?.split('@')[0] || 'Misafir'}</Text>
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

            {/* Page Header */}
            <View style={styles.header}>
                <Pressable
                    style={styles.backButton}
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        router.back();
                    }}
                >
                    <ArrowLeft size={18} color={colors.textPrimary} weight="bold" />
                    <Text style={styles.backButtonText}>Geri</Text>
                </Pressable>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>Kur'an Öğrenimi</Text>
                </View>
                <View style={{ width: 100 }} />
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Section Title */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Dersler</Text>
                </View>

                {/* Lessons List */}
                <View style={styles.lessonsList}>
                    {lessons.map((lesson) => {
                        const isCompleted = completedLessons?.includes(lesson.id);
                        return (
                            <Pressable
                                key={lesson.id}
                                style={styles.lessonCard}
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    router.push(lesson.route as any);
                                }}
                            >
                                <View style={styles.cardContent}>
                                    {/* Icon */}
                                    <View style={[styles.iconContainer, { backgroundColor: 'rgba(160, 117, 40, 0.2)' }]}>
                                        <BookOpen
                                            size={24}
                                            color="#FFC800"
                                            weight="fill"
                                        />
                                    </View>

                                    {/* Text Info */}
                                    <View style={styles.textContainer}>
                                        <Text style={styles.cardTitle}>{lesson.title}</Text>
                                    </View>

                                    {isCompleted && (
                                        <View style={styles.completedBadge}>
                                            <CheckCircle size={12} color={colors.success} weight="fill" />
                                            <Text style={styles.completedText}>Tamamlandı</Text>
                                        </View>
                                    )}

                                    {/* Arrow */}
                                    <CaretRight
                                        size={20}
                                        color={colors.textSecondary}
                                        weight="bold"
                                    />
                                </View>
                            </Pressable>
                        );
                    })}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const getStyles = () => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundDarker,
    },
    topHeader: {
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
        backgroundColor: colors.warning,
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
        borderWidth: 1,
        borderColor: colors.border,
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
        borderRadius: 32,
        gap: 8,
        borderWidth: 1,
        borderColor: colors.border,
    },
    statValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    xpContainer: {
        paddingHorizontal: 16,
        marginBottom: 14,
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
        backgroundColor: colors.primary,
        borderRadius: 6,
    },
    xpText: {
        fontSize: 12,
        color: colors.textSecondary,
        textAlign: 'center',
        fontWeight: '500',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 12,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 24,
        backgroundColor: colors.surface,
    },
    backButtonText: {
        fontSize: 14,
        color: colors.textPrimary,
        fontWeight: 'bold',
    },
    headerTitleContainer: {
        flex: 1,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    content: {
        flex: 1,
    },
    sectionHeader: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    lessonsList: {
        paddingHorizontal: 16,
        gap: 12,
    },
    lessonCard: {
        backgroundColor: colors.surface,
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    completedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(88, 204, 2, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    completedText: {
        fontSize: 10,
        color: colors.success,
        fontWeight: '600',
    },
});


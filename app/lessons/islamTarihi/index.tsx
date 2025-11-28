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

export default function IslamTarihiLessonsListScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const { statusBarStyle } = useStatusBar();
    const { themeVersion } = useTheme();

    // Get user data from Zustand store
    const { totalXP, currentLives } = useUser();
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
            id: '1',
            title: 'Cahiliye dönemi',
            route: '/lessons/islamTarihi/cahiliye-donemi/1',
        },
        {
            id: '2',
            title: 'Peygamberlik Öncesi Hz.Muhammed',
            route: '/lessons/islamTarihi/PeyOncHzMuhammed/1',
        },
        {
            id: '3',
            title: 'Peygamberlik Dönemi (610-632)',
            route: '/lessons/islamTarihi/PeygamberlikDonemi/1',
        },
        {
            id: '4',
            title: 'Hulefâ-i Râşidîn Dönemi (632–661)',
            route: '/lessons/islamTarihi/hulefaiRasidin/1',
        },
        {
            id: '5',
            title: 'Erken İslam Devletleri ve Emevîler Dönemi (661–750)',
            route: '/lessons/islamTarihi/emeviler/1',
        },
        {
            id: '6',
            title: 'Abbâsîler Dönemi ve İslam\'ın Altın Çağı (750–1258)',
            route: '/lessons/islamTarihi/abbasiler/1',
        },
        {
            id: '7',
            title: 'Endülüs Emevîleri ve Avrupa ile Etkileşim (711–1492)',
            route: '/lessons/islamTarihi/endulusEmevileri/1',
        },
        {
            id: '8',
            title: 'Orta Çağ İslam Coğrafyasında Bölgesel Devletler',
            route: '/lessons/islamTarihi/ortaCagDevletleri/1',
        },
        {
            id: '9',
            title: 'Haçlı Seferleri Dönemi ve İslam Dünyasının Durumu (11.–13. yüzyıllar)',
            route: '/lessons/islamTarihi/hacliSeferleri/1',
        },
        {
            id: '10',
            title: 'Moğol İstilaları ve İslam Dünyasında Dönüşüm (13. yüzyıl)',
            route: '/lessons/islamTarihi/mogolIstila/1',
        },
        {
            id: '11',
            title: 'Geç Dönem İslam Devletleri (1300–1900)',
            route: '/lessons/islamTarihi/gecDonemIslam/1',
        },
        {
            id: '12',
            title: 'Modern Çağda İslam Dünyası (1800–Günümüz)',
            route: '/lessons/islamTarihi/gunumuzTarihi/1',
        },
        {
            id: '13',
            title: 'İslam Medeniyetinin Evrensel Katkıları',
            route: '/lessons/islamTarihi/islamMedeniyeti/1',
        },
    ];

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar style={statusBarStyle} />

            {/* Header Section */}
            <View style={styles.topHeader}>
                <View style={styles.userInfo}>
                    <View style={styles.avatarContainer}>
                        <User size={24} color="#000" weight="fill" opacity={0.5} />
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
                    <Text style={styles.headerTitle}>İslam Tarihi</Text>
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
                    {lessons.map((lesson) => (
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

                                {/* Arrow */}
                                <CaretRight
                                    size={20}
                                    color={colors.textSecondary}
                                    weight="bold"
                                />
                            </View>
                        </Pressable>
                    ))}
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
});


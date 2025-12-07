import React, { useMemo } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
    BookOpen,
    CaretRight,
    ArrowLeft,
    CheckCircle,
} from 'phosphor-react-native';

import { colors } from '@/constants/colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useStatusBar } from '@/hooks/useStatusBar';
import { useUser } from '@/store';
import { HomeHeader } from '@/components/home/HomeHeader';

interface LessonItem {
    id: string;
    title: string;
    route: string;
}

export default function ElifBaLessonsListScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const { statusBarStyle } = useStatusBar();
    const { themeVersion, activeTheme } = useTheme();

    // Get user data from Zustand store
    const { completedLessons } = useUser();

    const styles = useMemo(() => getStyles(activeTheme || 'light'), [themeVersion, activeTheme]);

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
        {
            id: '109',
            title: 'Harflerin Cezmli Okunuşu',
            route: '/lessons/cezmli-okunus/109',
        },
        {
            id: '110',
            title: 'Cezm',
            route: '/lessons/cezm/110',
        },
        {
            id: '111',
            title: 'Alıştırmalar - 1',
            route: '/lessons/alistirmalar-1/111',
        },
        {
            id: '112',
            title: 'Harflerin Uzatılarak Okunuşu',
            route: '/lessons/uzatilarak-okunus/112',
        },
        {
            id: '113',
            title: 'Med (Uzatma) Harfi: Elif',
            route: '/lessons/med-elif/113',
        },
        {
            id: '114',
            title: 'Med (Uzatma) Harfi: Yâ',
            route: '/lessons/med-ya/114',
        },
        {
            id: '115',
            title: 'Med (Uzatma) Harfi: Vâv',
            route: '/lessons/med-vav/115',
        },
    ];

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar style={statusBarStyle} />

            <HomeHeader />

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
                                style={[styles.lessonCard, isCompleted && { borderColor: colors.success }]}
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    router.push(lesson.route as any);
                                }}
                            >
                                <View style={styles.cardContent}>
                                    {/* Icon */}
                                    <View style={[styles.iconContainer, { backgroundColor: isCompleted ? 'rgba(88, 204, 2, 0.1)' : 'rgba(160, 117, 40, 0.2)' }]}>
                                        {isCompleted ? (
                                            <CheckCircle size={24} color={colors.success} weight="fill" />
                                        ) : (
                                            <BookOpen
                                                size={24}
                                                color="#FFC800"
                                                weight="fill"
                                            />
                                        )}
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
                        );
                    })}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const getStyles = (activeTheme: 'light' | 'dark') => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundDarker,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 24,
        backgroundColor: '#FFC800',
        // Softer shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    backButtonText: {
        fontSize: 14,
        color: '#000000',
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


import React, { useMemo } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';
import * as Network from 'expo-network';
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
import { islamicHistory } from '@/data/islamicHistory';
import { HomeHeader } from '@/components/home/HomeHeader';

interface LessonItem {
    id: string;
    title: string;
    route: string;
}

export default function IslamTarihiLessonsListScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const { statusBarStyle } = useStatusBar();
    const { themeVersion, activeTheme } = useTheme();

    // Get user data from Zustand store
    const { completedLessons } = useUser();

    // Use data from file
    const lessons = islamicHistory;

    const styles = useMemo(() => getStyles(activeTheme || 'light'), [themeVersion, activeTheme]);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar style={statusBarStyle} />

            <HomeHeader />

            {/* Page Header */}

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
                    <Text style={styles.headerTitle}>{t('lessons.islamTarihi.groupTitle', { defaultValue: 'İslam Tarihi' })}</Text>
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
                        const isCompleted = completedLessons?.includes(lesson.id.toString());

                        return (
                            <Pressable
                                key={lesson.id}
                                style={[styles.lessonCard, isCompleted && { borderColor: colors.success }]}
                                onPress={async () => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

                                    // 🛡️ NETWORK CHECK
                                    try {
                                        const networkState = await Network.getNetworkStateAsync();
                                        if (!networkState.isConnected) {
                                            Alert.alert(
                                                t('errors.noConnection'),
                                                t('errors.noConnectionDesc'),
                                                [{ text: t('common.ok') }]
                                            );
                                            return;
                                        }
                                    } catch (e) {
                                        console.warn('Network check failed:', e);
                                    }

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
                                                color={colors.primary}
                                                weight="fill"
                                            />
                                        )}
                                    </View>

                                    {/* Text Info */}
                                    <View style={styles.textContainer}>
                                        <Text style={styles.cardTitle}>{t(`lessons.islamTarihi.${lesson.id}.title`, { defaultValue: lesson.title })}</Text>
                                    </View>

                                    {/* Arrow */}
                                    <CaretRight
                                        size={20}
                                        color={colors.textSecondary}
                                        weight="bold"
                                    />
                                </View>
                            </Pressable>
                        )
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
        backgroundColor: colors.primary,
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
});


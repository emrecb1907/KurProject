import React, { useState, useEffect, useMemo, useRef } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
    Play,
    Pause,
    ArrowCounterClockwise, // Replay
    Info,
    Check
} from 'phosphor-react-native';

import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';

import { colors } from '@/constants/colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useStatusBar } from '@/hooks/useStatusBar';
import { useUser } from '@/store';
import { HeaderButton } from '@/components/ui/HeaderButton';
import { PrimaryButton } from '@/components/ui/PrimaryButton';

// Data imports
import { namazTemelDualar } from '@/data/namazTemelDualar';
import { namazKisaSureler } from '@/data/namazKisaSureler';
import { namazIleriDuzey } from '@/data/namazIleriDuzey';
import { namazEzberPekistirme } from '@/data/namazEzberPekistirme';

// Merge all for lookup
const allLessons = [
    ...namazTemelDualar,
    ...namazKisaSureler,
    ...namazIleriDuzey,
    ...namazEzberPekistirme
];

export default function NamazDualiDetailScreen() {
    const { t, i18n } = useTranslation();
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const { statusBarStyle } = useStatusBar();
    const { themeVersion, activeTheme } = useTheme();

    // User progress
    const { completedLessons, completeLesson } = useUser();

    // Find Lesson
    const lessonId = Number(id);
    const lesson = useMemo(() => allLessons.find(l => l.id === lessonId), [lessonId]);

    const styles = useMemo(() => getStyles(activeTheme || 'light'), [themeVersion, activeTheme]);

    // Audio Hooks
    const player = useAudioPlayer(lesson?.audio ?? null);
    const status = useAudioPlayerStatus(player);

    const isPlaying = status.playing;
    const duration = status.duration || 0;
    const currentTime = status.currentTime || 0;

    // Auto-reset when finished
    useEffect(() => {
        // If we reached the end (approx) and stopped, rewind to 0
        if (duration > 0 && Math.abs(currentTime - duration) < 0.1 && !isPlaying) {
            player.seekTo(0);
        }
    }, [currentTime, duration, isPlaying, player]);

    // Helpers
    const isTurkish = i18n.language === 'tr';

    // Cleanup handled automatically by useAudioPlayer hook


    // Format Helper (Input is MS)
    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const min = Math.floor(totalSeconds / 60);
        const sec = totalSeconds % 60;
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    };

    const handlePlayPause = () => {
        if (isPlaying) {
            player.pause();
        } else {
            player.play();
        }
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const handleReplay = () => {
        player.seekTo(0);
        player.play();
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    };

    const handleComplete = () => {
        player.pause();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        completeLesson(String(lessonId));
        router.back();
    };

    if (!lesson || !lesson.content) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={{ textAlign: 'center', marginTop: 50 }}>Lesson not found or content missing.</Text>
                <Pressable onPress={() => router.back()} style={{ marginTop: 20, alignSelf: 'center' }}>
                    <Text style={{ color: colors.primary }}>Go Back</Text>
                </Pressable>
            </SafeAreaView>
        );
    }

    const { content } = lesson;
    const isCompleted = completedLessons.includes(String(lessonId));

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar style={statusBarStyle} />

            {/* Custom Header */}
            <View style={styles.header}>
                <HeaderButton
                    title={t('common.back')}
                    onPress={() => router.back()}
                />
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle} numberOfLines={1}>
                        {t(`lessons.namazDualari.${lessonId}.title`, { defaultValue: lesson.title })}
                    </Text>
                    {/* Subtitle could be added here if needed */}
                </View>
                <View style={{ width: 80 }} />
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
                showsVerticalScrollIndicator={false}
            >
                {/* 1. Info Card */}
                {content.info && (
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Info size={20} color={colors.primary} weight="fill" />
                            <Text style={styles.cardTitle}>
                                {isTurkish ? "Bilgi" : "Information"}
                            </Text>
                        </View>
                        <Text style={styles.cardText}>
                            {isTurkish ? content.info.tr : content.info.en}
                        </Text>
                    </View>
                )}

                {/* 2. Arabic Card */}
                <View style={[styles.card, styles.arabicCard]}>
                    <Text style={styles.arabicText}>
                        {content.arabic}
                    </Text>
                </View>

                {/* 3. Audio Player */}
                <View style={styles.audioCard}>
                    {/* Progress Bar */}
                    <View style={styles.progressBarContainer}>
                        <View style={styles.progressBarBg}>
                            <View
                                style={[
                                    styles.progressBarFill,
                                    { width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }
                                ]}
                            />
                        </View>
                        <View style={styles.timeRow}>
                            <Text style={styles.timeText}>{formatTime(currentTime * 1000)}</Text>
                            <Text style={styles.timeText}>{formatTime(duration * 1000)}</Text>
                        </View>
                    </View>

                    {/* Controls */}
                    <View style={styles.controlsRow}>
                        {/* Replay */}
                        <Pressable
                            style={styles.controlButtonSmall}
                            onPress={handleReplay}
                        >
                            <ArrowCounterClockwise size={24} color={colors.textSecondary} weight="bold" />
                        </Pressable>

                        {/* Play */}
                        <Pressable
                            style={[styles.controlButtonLarge, isPlaying && styles.controlButtonDisabled]}
                            onPress={() => {
                                if (!isPlaying) handlePlayPause();
                            }}
                            disabled={isPlaying}
                        >
                            <Play size={32} color={isPlaying ? colors.textSecondary : "#FFFFFF"} weight="fill" style={{ marginLeft: 4 }} />
                        </Pressable>

                        {/* Pause */}
                        <Pressable
                            style={[styles.controlButtonLarge, !isPlaying && styles.controlButtonDisabled]}
                            onPress={() => {
                                if (isPlaying) handlePlayPause();
                            }}
                            disabled={!isPlaying}
                        >
                            <Pause size={32} color={!isPlaying ? colors.textSecondary : "#FFFFFF"} weight="fill" />
                        </Pressable>
                    </View>
                </View>

                {/* 4. Transliteration (Okunuş) */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>
                            {isTurkish ? "Türkçe Okunuş" : "English Transliteration"}
                        </Text>
                    </View>
                    <Text style={styles.transliterationText}>
                        {isTurkish ? content.transliteration?.tr : content.transliteration?.en}
                    </Text>
                </View>



                {/* 5. Meaning (Anlam) */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>
                            {isTurkish ? "Türkçe Anlam" : "English Meaning"}
                        </Text>
                    </View>
                    <Text style={styles.meaningText}>
                        {isTurkish ? content.meaning?.tr : content.meaning?.en}
                    </Text>
                </View>

                {/* Disclaimer Card */}
                <View style={[styles.card, { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 }]}>
                    <Info size={24} color={colors.primary} weight="fill" />
                    <Text style={[styles.cardText, { flex: 1, fontSize: 13, fontStyle: 'italic' }]}>
                        {isTurkish
                            ? "Bu uygulamada yer alan anlamlar, açıklayıcı niteliktedir ve resmi bir meal değildir."
                            : "The meanings provided are explanatory and do not represent an official translation."}
                    </Text>
                </View>

                {/* Footer Button using PrimaryButton */}
                <PrimaryButton
                    title={t('common.completeLesson')}
                    onPress={handleComplete}
                    style={{
                        marginTop: 24,
                        marginBottom: 16,
                        backgroundColor: colors.primary
                    }}
                />

            </ScrollView>
        </SafeAreaView>
    );
}

const getStyles = (activeTheme: 'light' | 'dark') => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background, // Standard background
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: colors.surface,
    },
    headerTitleContainer: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 16
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.textPrimary,
        textAlign: 'center',
    },
    content: {
        flex: 1,
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: colors.border, // Standard border
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    arabicCard: {
        alignItems: 'center',
        paddingVertical: 32,
        backgroundColor: activeTheme === 'dark' ? 'rgba(32, 34, 37, 0.6)' : colors.surface,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 8,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.primary,
    },
    cardText: {
        fontSize: 15,
        color: colors.textSecondary,
        lineHeight: 22,
    },
    arabicText: {
        fontSize: 32,
        color: colors.textPrimary,
        textAlign: 'center',
        lineHeight: 56,
        fontFamily: 'System', // Use specialized font if available
        fontWeight: 'bold',
    },
    transliterationText: {
        fontSize: 16,
        color: colors.textPrimary,
        lineHeight: 26,
        fontStyle: 'italic',
    },
    meaningText: {
        fontSize: 16,
        color: colors.textPrimary,
        lineHeight: 26,
    },

    // Audio Player
    audioCard: {
        backgroundColor: colors.surface,
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    progressBarContainer: {
        width: '100%',
        marginBottom: 16,
    },
    progressBarBg: {
        height: 6,
        backgroundColor: activeTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0,0,0,0.1)',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: colors.primary,
        borderRadius: 3,
    },
    timeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 6,
    },
    timeText: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    controlsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-evenly',
    },
    controlButtonSmall: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: activeTheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0,0,0,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    controlButtonLarge: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    controlButtonDisabled: {
        backgroundColor: activeTheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0,0,0,0.05)',
        shadowOpacity: 0,
        elevation: 0,
    },
});

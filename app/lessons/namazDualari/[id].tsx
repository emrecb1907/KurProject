import React, { useState, useEffect, useMemo, useRef } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
    ArrowLeft,
    Play,
    Pause,
    ArrowCounterClockwise, // Replay
    Info,
    Check
} from 'phosphor-react-native';
// @ts-ignore
import Slider from '@react-native-community/slider'; // Check if available, otherwise build custom bar
// Checking deps... user didn't have slider in package.json? 
// I will build a Custom Progress Bar if slider is missing to be safe, 
// OR I will assume I can use a simple View-based width bar for now.
// User requested "ses çaldıkça ilerleyen bir bar". A simple View bar is safer than missing dep.

import { createAudioPlayer, AudioPlayer } from 'expo-audio';

import { colors } from '@/constants/colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useStatusBar } from '@/hooks/useStatusBar';
import { useAuth } from '@/store';
import { HomeHeader } from '@/components/home/HomeHeader';
import { useCompletedLessons } from '@/hooks/queries';
import { useLessonComplete } from '@/hooks/mutations';

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

    // Auth
    const { user } = useAuth();

    // User progress - React Query hooks
    const { data: completedLessons = [] } = useCompletedLessons(user?.id);
    const lessonCompleteMutation = useLessonComplete();

    // Find Lesson
    const lessonId = Number(id);
    const lesson = useMemo(() => allLessons.find(l => l.id === lessonId), [lessonId]);

    const styles = useMemo(() => getStyles(activeTheme || 'light'), [themeVersion, activeTheme]);

    // Audio State
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    const playerRef = useRef<AudioPlayer | null>(null);

    // Helpers
    const isTurkish = i18n.language === 'tr';

    // Cleanup audio on unmount
    useEffect(() => {
        return () => {
            if (playerRef.current) {
                playerRef.current.remove(); // Release resources
                playerRef.current = null;
            }
        };
    }, []);

    // Load Audio
    useEffect(() => {
        if (!lesson?.audio) return;

        const loadAudio = async () => {
            // If player exists, clean it
            if (playerRef.current) {
                playerRef.current.remove();
            }

            // Create new player
            const player = createAudioPlayer(lesson.audio);
            playerRef.current = player;

            // Events
            player.addListener('playbackStatusUpdate', (status) => {
                setIsLoaded(status.isLoaded);
                setIsPlaying(status.isPlaying);

                if (status.isLoaded) {
                    setDuration(status.duration || 0);
                    setCurrentTime(status.currentTime || 0);

                    if (status.didJustFinish) {
                        setIsPlaying(false);
                        player.seekTo(0);
                        player.pause();
                        setCurrentTime(0);
                    }
                }
            });

            setIsLoaded(true); // Optimistic or wait for event? event is safer.
        };

        loadAudio();
    }, [lesson]);

    // Format Helper
    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const min = Math.floor(totalSeconds / 60);
        const sec = totalSeconds % 60;
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    };

    const handlePlayPause = () => {
        if (!playerRef.current) return;

        if (isPlaying) {
            playerRef.current.pause();
        } else {
            playerRef.current.play();
        }
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const handleReplay = () => {
        if (!playerRef.current) return;
        playerRef.current.seekTo(0);
        playerRef.current.play();
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    };

    const handleComplete = async () => {
        if (!completedLessons.includes(String(lessonId))) {
            try {
                // Server-side mutation handles XP and stats
                await lessonCompleteMutation.mutateAsync(String(lessonId));

                Alert.alert(t('common.congratulations'), t('lessons.lessonCompleted', { xp: 10 }));
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } catch (error) {
                console.error('Failed to complete lesson:', error);
            }
        }
        router.back();
    };

    if (!lesson || !lesson.content) {
        return (
            <SafeAreaView style={styles.container}>
                <HomeHeader />
                <Text style={{ color: 'white', textAlign: 'center', marginTop: 50 }}>Lesson not found or content missing.</Text>
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
            <HomeHeader />

            {/* Header */}
            <View style={styles.header}>
                <Pressable
                    style={styles.backButton}
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        router.back();
                    }}
                >
                    <ArrowLeft size={18} color="#FFFFFF" weight="bold" />
                    <Text style={styles.backButtonText}>{t('common.back')}</Text>
                </Pressable>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle} numberOfLines={1}>
                        {t(`lessons.namazDualari.${lessonId}.title`, { defaultValue: lesson.title })}
                    </Text>
                </View>
                <View style={{ width: 80 }} />
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
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
                        <Pressable
                            style={styles.controlButtonSmall}
                            onPress={handleReplay}
                        >
                            <ArrowCounterClockwise size={20} color={colors.textSecondary} weight="bold" />
                        </Pressable>

                        <Pressable
                            style={styles.controlButtonLarge}
                            onPress={handlePlayPause}
                        >
                            {isPlaying ? (
                                <Pause size={32} color="#FFFFFF" weight="fill" />
                            ) : (
                                <Play size={32} color="#FFFFFF" weight="fill" style={{ marginLeft: 4 }} />
                            )}
                        </Pressable>

                        {/* Placeholder for symmetry or next/prev if needed, using empty View */}
                        <View style={{ width: 40 }} />
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

            </ScrollView>

            {/* Footer Button */}
            <View style={styles.footer}>
                <Pressable
                    style={[styles.completeButton, isCompleted && styles.completedButton]}
                    onPress={handleComplete}
                >
                    {isCompleted && <Check size={20} color="#FFFFFF" weight="bold" style={{ marginRight: 8 }} />}
                    <Text style={styles.completeButtonText}>
                        {isCompleted ? t('common.completed') : t('common.completeLesson')}
                    </Text>
                </Pressable>
            </View>

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
        transform: [{ translateY: -5 }], // Consistent with others
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 24,
        backgroundColor: colors.primary,
        elevation: 2,
    },
    backButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 14,
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
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    arabicCard: {
        alignItems: 'center',
        paddingVertical: 32,
        backgroundColor: 'rgba(32, 34, 37, 0.6)', // Slightly darker
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
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    progressBarContainer: {
        width: '100%',
        marginBottom: 16,
    },
    progressBarBg: {
        height: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
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

    // Footer
    footer: {
        padding: 16,
        paddingBottom: 32, // Safe area padding
        backgroundColor: colors.backgroundDarker,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.05)',
    },
    completeButton: {
        backgroundColor: colors.primary,
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    completedButton: {
        backgroundColor: colors.success,
    },
    completeButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Modal as RNModal } from 'react-native';
import { colors } from '@constants/colors';
import { Gift, Check, Gear, X, BookOpen, Lightning, CheckCircle } from 'phosphor-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';
import { Modal } from '@components/ui/Modal';
import { useUser, useAuth } from '@/store';
import { database } from '@/lib/supabase/database';
import { useFocusEffect } from '@react-navigation/native';

interface DailyTasksProps {
    devToolsContent?: React.ReactNode;
}

interface Task {
    id: number;
    text: string;
    xp: number;
    current: number;
    target: number;
    completed: boolean;
    claimed: boolean;
}

export function DailyTasks({ devToolsContent }: DailyTasksProps) {
    const { t } = useTranslation();
    const { themeVersion, activeTheme } = useTheme();
    const { user, isAuthenticated } = useAuth();

    // Light theme specific border color
    const lightBorderColor = '#BCAAA4';
    const isLight = activeTheme === 'light';
    const [showDevToolsModal, setShowDevToolsModal] = useState(false);
    const [showRewardModal, setShowRewardModal] = useState(false);
    const [claimedReward, setClaimedReward] = useState<{ xp: number; taskName: string } | null>(null);

    // 🛡️ SERVER-SIDE PROGRESS STATE
    const [serverProgress, setServerProgress] = useState<{
        lessons_today: number;
        tests_today: number;
        lesson_claimed: boolean;
        test_claimed: boolean;
    } | null>(null);

    // Get user state and actions from store
    const {
        dailyProgress,
        claimDailyTask,
        checkDailyReset
    } = useUser();

    // Fetch server progress for authenticated users
    const fetchServerProgress = useCallback(async () => {
        if (!isAuthenticated || !user?.id) return;
        try {
            const { data, error } = await database.dailySnapshots.getProgress(user.id);
            if (data && !error) {
                setServerProgress(data as any);
            }
        } catch (e) {
            console.error('Failed to fetch server progress:', e);
        }
    }, [isAuthenticated, user?.id]);

    // Fetch on focus
    useFocusEffect(
        useCallback(() => {
            checkDailyReset();
            fetchServerProgress();
        }, [checkDailyReset, fetchServerProgress])
    );

    // Derive tasks - prefer server data for authenticated users
    const tasks: Task[] = useMemo(() => {
        const lessonsCompleted = serverProgress?.lessons_today ?? dailyProgress.lessonsCompleted;
        const testsCompleted = serverProgress?.tests_today ?? dailyProgress.testsCompleted;
        const lessonClaimed = serverProgress?.lesson_claimed ?? dailyProgress.claimedTasks.includes('lesson');
        const testClaimed = serverProgress?.test_claimed ?? dailyProgress.claimedTasks.includes('test');

        return [
            {
                id: 1, // 'lesson'
                text: t('home.dailyTasks.completeLessons', { count: 2 }),
                xp: 20,
                current: lessonsCompleted,
                target: 2,
                completed: lessonsCompleted >= 2,
                claimed: lessonClaimed
            },
            {
                id: 2, // 'test'
                text: t('home.dailyTasks.completeTests', { count: 3 }),
                xp: 30,
                current: testsCompleted,
                target: 3,
                completed: testsCompleted >= 3,
                claimed: testClaimed
            }
        ];
    }, [dailyProgress, serverProgress, t]);

    const handleClaimTaskReward = async (task: Task) => {
        if (task.completed && !task.claimed) {
            // Determine type based on ID (1=lesson, 2=test)
            const type = task.id === 1 ? 'lesson' : 'test';

            // Call server-first claim and check result
            const success = await claimDailyTask(type, task.xp);

            // Refresh server progress
            await fetchServerProgress();

            // Only show reward modal if claim was successful
            if (success) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                setClaimedReward({ xp: task.xp, taskName: task.text });
                setShowRewardModal(true);
            }
        }
    };

    // Dynamic styles
    const styles = useMemo(() => StyleSheet.create({
        container: {
            backgroundColor: colors.surface,
            borderRadius: 24,
            padding: 10,
            marginBottom: 18,
            // iOS 18 style shadow - more depth, softer spread
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 16,
            elevation: 4,
            borderWidth: isLight ? 0.2 : 0,
            borderColor: isLight ? '#FFC800' : 'transparent',
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
            paddingBottom: 10,
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(255, 255, 255, 0.1)',
        },
        headerTextContainer: {
            flex: 1,
        },
        title: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.textPrimary,
            paddingLeft: 6,
        },
        iconContainer: {
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: 'rgba(255, 200, 0, 0.1)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        tasksContainer: {
            gap: 0,
            marginBottom: 20,
        },
        taskItem: {
            flexDirection: 'row',
            alignItems: 'flex-end',
            backgroundColor: colors.backgroundLighter,
            padding: 10,
            borderRadius: 16,
            gap: 12,
            marginBottom: 8,
        },
        taskIconBox: {
            width: 40,
            height: 40,
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.surfaceLight,
            marginRight: 4,
            marginBottom: 3,
        },
        taskIconBoxCompleted: {
            backgroundColor: colors.success,
        },
        taskText: {
            fontSize: 15,
            color: colors.textPrimary,
            fontWeight: '600',
            marginBottom: 6,
        },
        taskInfo: {
            flex: 1,
        },
        progressRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        progressBarBg: {
            flex: 1,
            height: 6,
            backgroundColor: colors.border,
            borderRadius: 3,
            overflow: 'hidden',
        },
        progressBarFill: {
            height: '100%',
            backgroundColor: colors.warning,
            borderRadius: 3,
        },
        progressText: {
            fontSize: 11,
            color: colors.textSecondary,
            fontWeight: '600',
            minWidth: 30,
            textAlign: 'right',
        },
        xpButton: {
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 12,
            backgroundColor: colors.surfaceLight,
            borderWidth: 1,
            borderColor: 'transparent',
            marginBottom: 3,
        },
        xpButtonActive: {
            backgroundColor: colors.primary,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.6,
            shadowRadius: 8,
            elevation: 4,
            borderColor: colors.primaryLight,
        },
        xpButtonClaimed: {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: colors.border,
        },
        xpButtonText: {
            fontSize: 12,
            fontWeight: 'bold',
            color: colors.textDisabled,
        },
        xpButtonTextActive: {
            color: colors.textOnPrimary,
        },
        xpButtonTextClaimed: {
            color: colors.success,
        },
        settingsIconButton: {
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: 'rgba(100, 100, 100, 0.1)',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 8,
        },
        modalContent: {
            padding: 20,
            maxHeight: '80%',
        },
        modalTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: colors.textPrimary,
            marginBottom: 16,
            textAlign: 'center',
        },
        devToolButton: {
            backgroundColor: colors.surfaceLight,
            padding: 12,
            borderRadius: 8,
            marginBottom: 8,
            alignItems: 'center',
        },
        devToolButtonText: {
            color: colors.textPrimary,
            fontWeight: '600',
        },
        // Reward Modal Styles
        rewardModalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        rewardModalContent: {
            backgroundColor: colors.surface,
            borderRadius: 24,
            padding: 32,
            alignItems: 'center',
            width: '80%',
            maxWidth: 320,
        },
        rewardEmoji: {
            fontSize: 64,
            marginBottom: 16,
        },
        rewardTitle: {
            fontSize: 24,
            fontWeight: 'bold',
            color: colors.textPrimary,
            marginBottom: 8,
        },
        rewardXP: {
            fontSize: 48,
            fontWeight: 'bold',
            color: colors.warning,
            marginBottom: 8,
        },
        rewardTaskName: {
            fontSize: 16,
            color: colors.textSecondary,
            marginBottom: 24,
            textAlign: 'center',
        },
        rewardButton: {
            backgroundColor: colors.primary,
            paddingVertical: 12,
            paddingHorizontal: 32,
            borderRadius: 12,
            width: '100%',
        },
        rewardButtonText: {
            color: colors.textOnPrimary,
            fontSize: 16,
            fontWeight: 'bold',
            textAlign: 'center',
        },
    }), [themeVersion, activeTheme]);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerTextContainer}>
                    <Text style={styles.title}>{t('home.dailyTasks.title')}</Text>
                </View>

                {/* Settings Button */}
                <Pressable
                    style={styles.settingsIconButton}
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setShowDevToolsModal(true);
                    }}
                >
                    <Gear size={18} color={colors.textSecondary} weight="fill" />
                </Pressable>

                {/* Gift Icon */}
                <View style={styles.iconContainer}>
                    <Gift size={20} color={colors.warning} weight="fill" />
                </View>
            </View>

            {/* Tasks List */}
            <View style={styles.tasksContainer}>
                {tasks.map((task) => {
                    // Determine Icon based on task content (simple heuristic)
                    let TaskIcon = Gift;
                    if (task.text.toLowerCase().includes('ders') || task.text.toLowerCase().includes('lesson')) {
                        TaskIcon = BookOpen;
                    } else if (task.text.toLowerCase().includes('test') || task.text.toLowerCase().includes('quiz')) {
                        TaskIcon = Lightning;
                    }

                    const progressPercent = Math.min(100, Math.max(0, (task.current / task.target) * 100));

                    return (
                        <View key={task.id} style={styles.taskItem}>
                            {/* Icon Box */}
                            <View style={[
                                styles.taskIconBox,
                                task.completed && styles.taskIconBoxCompleted
                            ]}>
                                {task.completed ? (
                                    <Check size={20} color={colors.textOnPrimary} weight="bold" />
                                ) : (
                                    <TaskIcon size={20} color={colors.warning} weight="fill" />
                                )}
                            </View>

                            {/* Task Info & Progress */}
                            <View style={styles.taskInfo}>
                                <Text style={styles.taskText}>{task.text}</Text>

                                <View style={styles.progressRow}>
                                    <View style={styles.progressBarBg}>
                                        <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
                                    </View>
                                    <Text style={styles.progressText}>
                                        {task.current}/{task.target}
                                    </Text>
                                </View>
                            </View>

                            {/* XP Button - aligned at bottom with progress bar */}
                            <Pressable
                                style={({ pressed }) => [
                                    styles.xpButton,
                                    task.completed && !task.claimed && styles.xpButtonActive,
                                    task.claimed && styles.xpButtonClaimed,
                                    pressed && task.completed && !task.claimed && { opacity: 0.8 }
                                ]}
                                onPress={() => handleClaimTaskReward(task)}
                                disabled={!task.completed || task.claimed}
                            >
                                {task.claimed ? (
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                        <CheckCircle size={14} color={colors.success} weight="fill" />
                                        <Text style={styles.xpButtonTextClaimed}>
                                            {t('home.dailyTasks.claimed')}
                                        </Text>
                                    </View>
                                ) : (
                                    <Text style={[
                                        styles.xpButtonText,
                                        task.completed && styles.xpButtonTextActive,
                                    ]}>
                                        +{task.xp} XP
                                    </Text>
                                )}
                            </Pressable>
                        </View>
                    );
                })}
            </View>

            {/* Reward Modal */}
            <RNModal
                visible={showRewardModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowRewardModal(false)}
            >
                <Pressable
                    style={styles.rewardModalOverlay}
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setShowRewardModal(false);
                    }}
                >
                    <Pressable
                        style={styles.rewardModalContent}
                        onPress={(e) => e.stopPropagation()}
                    >
                        <Text style={styles.rewardEmoji}>🎉</Text>
                        <Text style={styles.rewardTitle}>{t('home.dailyTasks.reward.title')}</Text>
                        <Text style={styles.rewardXP}>+{claimedReward?.xp} XP</Text>
                        <Text style={styles.rewardTaskName}>{claimedReward?.taskName}</Text>
                        <Pressable
                            style={styles.rewardButton}
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                setShowRewardModal(false);
                            }}
                        >
                            <Text style={styles.rewardButtonText}>{t('home.dailyTasks.reward.button')}</Text>
                        </Pressable>
                    </Pressable>
                </Pressable>
            </RNModal>

            {/* Developer Tools Modal */}
            <Modal
                visible={showDevToolsModal}
                onClose={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setShowDevToolsModal(false);
                }}
                showCloseButton={true}
                transparent
            >
                <ScrollView
                    style={styles.modalContent}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20 }}
                >
                    <Text style={styles.modalTitle}>🧪 {t('home.devTools')}</Text>

                    <Text style={{ color: colors.textSecondary, marginBottom: 8 }}>{t('home.dailyTasks.devTools.title')}:</Text>

                    <Pressable
                        style={styles.devToolButton}
                        onPress={() => {
                            checkDailyReset();
                            setShowDevToolsModal(false);
                        }}
                    >
                        <Text style={styles.devToolButtonText}>🔄 Günlük Reset Kontrol</Text>
                    </Pressable>

                    <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 16 }} />

                    {devToolsContent}
                </ScrollView>
            </Modal>
        </View>
    );
}

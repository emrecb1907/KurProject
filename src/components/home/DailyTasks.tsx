import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Modal as RNModal } from 'react-native';
import { colors } from '@constants/colors';
import { Gift, Check, Gear, X } from 'phosphor-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';
import { Modal } from '@components/ui/Modal';
import { useUser } from '@/store';
import { database } from '@/lib/supabase/database';

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

    // Light theme specific border color
    const lightBorderColor = '#BCAAA4';
    const isLight = activeTheme === 'light';
    const [showDevToolsModal, setShowDevToolsModal] = useState(false);
    const [showRewardModal, setShowRewardModal] = useState(false);
    const [claimedReward, setClaimedReward] = useState<{ xp: number; taskName: string } | null>(null);

    // Get user state and actions from store
    const {
        dailyProgress,
        incrementDailyLessons,
        incrementDailyTests,
        claimDailyTask,
        boundUserId
    } = useUser();

    // We need to fetch tasks.
    const [dbTasks, setDbTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // const { boundUserId } = useUser(); // Removed duplicate

    React.useEffect(() => {
        if (!boundUserId) return;

        const fetchTasks = async () => {
            // Import database inside or top level? Top level is better.
            // Assume 'database' is imported.
            const { data } = await database.dailyTasks.get(boundUserId);
            if (data) {
                setDbTasks(data);
            }
            setLoading(false);
        };
        fetchTasks();
    }, [boundUserId]);

    // Derive tasks from store state (Local Optimistic) + DB Definitions
    const tasks: Task[] = useMemo(() => {
        // If DB tasks not loaded yet, show skeletons or empty?
        // Or fallback to hardcoded if DB fails?
        // Let's fallback to current Hardcoded if dbTasks is empty to avoid Flash of Empty.
        if (dbTasks.length === 0 && !loading) return []; // Or default?

        if (dbTasks.length === 0) {
            // Fallback/Initial Render
            return [
                {
                    id: 1,
                    text: t('home.dailyTasks.completeLessons', { count: 2 }),
                    xp: 50,
                    current: dailyProgress.lessonsCompleted,
                    target: 2,
                    completed: dailyProgress.lessonsCompleted >= 2,
                    claimed: dailyProgress.claimedTasks.includes('1')
                },
                {
                    id: 2,
                    text: t('home.dailyTasks.completeTests', { count: 3 }),
                    xp: 75,
                    current: dailyProgress.testsCompleted,
                    target: 3,
                    completed: dailyProgress.testsCompleted >= 3,
                    claimed: dailyProgress.claimedTasks.includes('2')
                }
            ];
        }

        return dbTasks.map(tData => {
            const isLesson = tData.task_type === 'lesson';
            const current = isLesson ? dailyProgress.lessonsCompleted : dailyProgress.testsCompleted;
            const completed = current >= tData.target_count;
            // Claimed if DB says so OR local optimistic says so
            const claimed = tData.is_claimed || dailyProgress.claimedTasks.includes(tData.id.toString()) || (tData.progress_id && dailyProgress.claimedTasks.includes(tData.progress_id.toString()));

            return {
                id: tData.id,
                text: t(tData.title_key, { count: tData.target_count }), // Use translation key from DB
                xp: tData.xp_reward,
                current: current,
                target: tData.target_count,
                completed: completed,
                claimed: claimed,
                progress_id: tData.progress_id // Keep for claiming
            };
        });
    }, [dailyProgress, dbTasks, loading, t]);

    const handleClaimTaskReward = (task: Task & { progress_id?: number }) => {
        if (task.completed && !task.claimed) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

            // Show reward modal
            setClaimedReward({ xp: task.xp, taskName: task.text });
            setShowRewardModal(true);

            // Update store (handles both claim and XP add + DB sync)
            // Pass progress_id if available, otherwise task.id?
            // userSlice expects taskId for local opt. and maybe for DB.
            // But we prefer progress_id for DB call.
            // userSlice has logic: if (!isNaN(taskId)) call dailyTasks.claim(taskId).
            // So we should pass the PROGRESS ID as the argument if we want userSlice to verify it?
            // Wait, userSlice logic `if (!isNaN(taskId))` assumes `taskId` IS the ID to claim.
            // If we pass `progress_id`, it works for DB.
            // But for local `claimedTasks` array, we want to store `task.id` (definition ID) or `progress_id`?
            // If we store `progress_id` in `claimedTasks`, then our check `includes` above needs to check progress_id.
            // But `dailyProgress.claimedTasks` is reset daily.

            // Let's pass `progress_id` (if exists) to claim.
            // Fallback: If no progress_id (rare), use task.id? No, DB claim needs progress row.

            const idToPass = task.progress_id ? task.progress_id.toString() : task.id.toString();

            // NOTE: This mismatch (task.id vs progress_id) is slightly messy.
            // Ideally claimedTasks should store Task IDs (definitions) to hide buttons.
            // But to claim on DB we need Progress ID.
            // Helper: We call userSlice.claimDailyTask(idToPass).
            // userSlice logic: Adds `idToPass` to claimedTasks. Calls DB claim(`idToPass`).
            // So if `idToPass` is `progress_id`, then `claimedTasks` has `progress_id`.
            // So UI check needs to check if `claimedTasks` includes `progress_id`.

            claimDailyTask(idToPass, task.xp);
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
            alignItems: 'center',
            backgroundColor: colors.backgroundLighter,
            padding: 10,
            borderRadius: 16,
            gap: 12,
            marginBottom: 8,
        },
        taskCircle: {
            width: 36,
            height: 36,
            borderRadius: 18,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.error,
        },
        taskCircleCompleted: {
            backgroundColor: colors.success,
        },
        taskInfo: {
            flex: 1,
        },
        taskText: {
            fontSize: 15,
            color: colors.textPrimary,
            fontWeight: '500',
            marginBottom: 2,
        },
        progressText: {
            fontSize: 12,
            color: colors.textSecondary,
            fontWeight: '600',
        },
        xpButton: {
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 12,
            backgroundColor: colors.surfaceLight,
            borderWidth: 1,
            borderColor: 'transparent',
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
                {tasks.map((task) => (
                    <View key={task.id} style={styles.taskItem}>
                        {/* Circle Icon */}
                        <View style={[
                            styles.taskCircle,
                            task.completed && styles.taskCircleCompleted
                        ]}>
                            {task.completed ? (
                                <Check size={18} color={colors.textOnPrimary} weight="bold" />
                            ) : (
                                <X size={18} color={colors.textOnPrimary} weight="bold" />
                            )}
                        </View>

                        {/* Task Info */}
                        <View style={styles.taskInfo}>
                            <Text style={styles.taskText}>{task.text}</Text>
                            <Text style={styles.progressText}>
                                {task.current}/{task.target} {t('home.dailyTasks.completed')}
                            </Text>
                        </View>

                        {/* XP Button */}
                        <Pressable
                            style={[
                                styles.xpButton,
                                task.completed && !task.claimed && styles.xpButtonActive,
                                task.claimed && styles.xpButtonClaimed
                            ]}
                            onPress={() => handleClaimTaskReward(task)}
                            disabled={!task.completed || task.claimed}
                        >
                            <Text style={[
                                styles.xpButtonText,
                                task.completed && !task.claimed && styles.xpButtonTextActive,
                                task.claimed && styles.xpButtonTextClaimed
                            ]}>
                                {task.claimed ? t('home.dailyTasks.claimed') : `+${task.xp} XP`}
                            </Text>
                        </Pressable>
                    </View>
                ))}
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
                        onPress={() => incrementDailyLessons()}
                    >
                        <Text style={styles.devToolButtonText}>{t('home.dailyTasks.devTools.completeLesson')}</Text>
                    </Pressable>

                    <Pressable
                        style={styles.devToolButton}
                        onPress={() => incrementDailyTests()}
                    >
                        <Text style={styles.devToolButtonText}>{t('home.dailyTasks.devTools.completeTest')}</Text>
                    </Pressable>

                    <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 16 }} />

                    {devToolsContent}
                </ScrollView>
            </Modal>
        </View>
    );
}

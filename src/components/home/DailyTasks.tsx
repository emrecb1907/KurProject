import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { useMemo, useState } from 'react';
import { colors } from '@constants/colors';
import { Gift, CheckCircle, Gear } from 'phosphor-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';
import { Modal } from '@components/ui/Modal';

interface DailyTasksProps {
    devToolsContent?: React.ReactNode;
}

export function DailyTasks({ devToolsContent }: DailyTasksProps) {
    const { t } = useTranslation();
    const { themeVersion } = useTheme();
    const [showDevToolsModal, setShowDevToolsModal] = useState(false);

    // Mock data for now
    const tasks = [
        { id: 1, text: 'Read 10 ayahs', xp: 10, completed: true },
        { id: 2, text: 'Complete a quiz', xp: 25, completed: true },
    ];

    // Dynamic styles
    const styles = useMemo(() => StyleSheet.create({
        container: {
            backgroundColor: colors.surface,
            borderRadius: 24,
            padding: 10,
            marginBottom: 22,
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
        subtitle: {
            fontSize: 13,
            color: colors.textSecondary,
            marginBottom: 4,
            fontWeight: '500',
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
            gap: 12,
            marginBottom: 20,
        },
        taskItem: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.backgroundLighter,
            padding: 16,
            borderRadius: 16,
            gap: 12,
        },
        taskIcon: {
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor: colors.success,
            justifyContent: 'center',
            alignItems: 'center',
        },
        taskText: {
            flex: 1,
            fontSize: 15,
            color: colors.textPrimary,
            fontWeight: '500',
        },
        xpText: {
            fontSize: 14,
            fontWeight: 'bold',
            color: colors.warning,
        },
        rewardButton: {
            backgroundColor: colors.primary,
            paddingVertical: 16,
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
        },
        rewardButtonText: {
            fontSize: 16,
            fontWeight: 'bold',
            color: colors.textOnPrimary, // White text on orange button
        },
        settingsButton: {
            position: 'absolute',
            top: 0,
            right: 50, // Next to icon
            width: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
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
    }), [themeVersion]);

    const handleRewardPress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        // Mockup - will be implemented later
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerTextContainer}>
                    <Text style={styles.title}>Günlük Görevler</Text>
                </View>

                {/* Dev Tools Button (Hidden/Subtle) */}
                <Pressable
                    style={styles.settingsButton}
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setShowDevToolsModal(true);
                    }}
                >
                    {/* <Gear size={20} color={colors.textSecondary} weight="fill" /> */}
                </Pressable>

                <View style={styles.iconContainer}>
                    <Gift size={20} color={colors.warning} weight="fill" />
                </View>
            </View>

            {/* Tasks List */}
            <View style={styles.tasksContainer}>
                {tasks.map((task) => (
                    <View key={task.id} style={styles.taskItem}>
                        <View style={styles.taskIcon}>
                            <CheckCircle size={16} color={colors.textOnPrimary} weight="fill" />
                        </View>
                        <Text style={styles.taskText}>{task.text}</Text>
                        <Text style={styles.xpText}>+{task.xp} XP</Text>
                    </View>
                ))}
            </View>

            {/* Reward Button */}
            <Pressable
                style={styles.rewardButton}
                onPress={handleRewardPress}
            >
                <Text style={styles.rewardButtonText}>Ödülünü Al</Text>
            </Pressable>

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
                    {devToolsContent}
                </ScrollView>
            </Modal>
        </View>
    );
}

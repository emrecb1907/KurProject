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
        { id: 1, text: 'Bugün 3 ders tamamla', completed: false },
        { id: 2, text: 'Bugün 3 test tamamla', completed: false },
    ];

    // Dynamic styles
    const styles = useMemo(() => StyleSheet.create({
        container: {
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 16,
            marginBottom: 24,
            borderBottomWidth: 4,
            borderBottomColor: colors.border,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            marginBottom: 16,
        },
        title: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.textPrimary,
        },
        tasksContainer: {
            gap: 12,
            marginBottom: 16,
        },
        taskItem: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            paddingVertical: 8,
        },
        taskCheckbox: {
            width: 24,
            height: 24,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: colors.border,
            justifyContent: 'center',
            alignItems: 'center',
        },
        taskCheckboxCompleted: {
            backgroundColor: colors.success,
            borderColor: colors.success,
        },
        taskText: {
            flex: 1,
            fontSize: 15,
            color: colors.textPrimary,
            fontWeight: '500',
        },
        taskTextCompleted: {
            color: colors.textSecondary,
            textDecorationLine: 'line-through',
        },
        buttonRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        settingsButton: {
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: colors.surface,
            borderWidth: 2,
            borderColor: colors.border,
            justifyContent: 'center',
            alignItems: 'center',
        },
        rewardButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            backgroundColor: colors.primary,
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 12,
            borderBottomWidth: 4,
            borderBottomColor: colors.buttonOrangeBorder,
            width: '50%',
            opacity: 0.6, // Deaktif için
        },
        rewardButtonText: {
            fontSize: 15,
            fontWeight: 'bold',
            color: colors.textOnPrimary,
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
        testContainer: {
            backgroundColor: colors.backgroundDarker,
            padding: 16,
            borderRadius: 16,
            marginTop: 8,
            borderWidth: 2,
            borderColor: colors.warning,
        },
        testButtonRow: {
            flexDirection: 'row',
            gap: 10,
            marginBottom: 10,
        },
        testButton: {
            backgroundColor: colors.primary,
            paddingVertical: 14,
            paddingHorizontal: 20,
            borderRadius: 12,
            marginBottom: 10,
            borderBottomWidth: 4,
            borderBottomColor: colors.buttonOrangeBorder,
        },
        testButtonHalf: {
            flex: 1,
            marginBottom: 0,
        },
        testButtonSync: {
            backgroundColor: colors.secondary,
            paddingVertical: 14,
            paddingHorizontal: 20,
            borderRadius: 12,
            marginBottom: 10,
            borderBottomWidth: 4,
            borderBottomColor: colors.buttonBlueBorder,
        },
        testButtonDanger: {
            backgroundColor: colors.error,
            paddingVertical: 14,
            paddingHorizontal: 20,
            borderRadius: 12,
            marginBottom: 10,
            borderBottomWidth: 4,
            borderBottomColor: colors.errorDark,
        },
        testButtonText: {
            color: colors.textOnPrimary,
            fontSize: 15,
            fontWeight: 'bold',
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
                <Gift size={24} color={colors.primary} weight="fill" />
                <Text style={styles.title}>Günlük Görevler</Text>
            </View>

            {/* Tasks List */}
            <View style={styles.tasksContainer}>
                {tasks.map((task) => (
                    <View key={task.id} style={styles.taskItem}>
                        <View style={[
                            styles.taskCheckbox,
                            task.completed && styles.taskCheckboxCompleted
                        ]}>
                            {task.completed && (
                                <CheckCircle size={16} color={colors.textOnPrimary} weight="fill" />
                            )}
                        </View>
                        <Text style={[
                            styles.taskText,
                            task.completed && styles.taskTextCompleted
                        ]}>
                            {task.text}
                        </Text>
                    </View>
                ))}
            </View>

            {/* Button Row */}
            <View style={styles.buttonRow}>
                {/* Settings Button */}
                <Pressable
                    style={styles.settingsButton}
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setShowDevToolsModal(true);
                    }}
                >
                    <Gear size={20} color={colors.textPrimary} weight="fill" />
                </Pressable>

                {/* Reward Button */}
                <Pressable
                    style={styles.rewardButton}
                    onPress={handleRewardPress}
                    disabled={true} // Mockup için disabled
                >
                    <Gift size={20} color={colors.textOnPrimary} weight="fill" />
                    <Text style={styles.rewardButtonText}>Ödülünü Al</Text>
                </Pressable>
            </View>

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


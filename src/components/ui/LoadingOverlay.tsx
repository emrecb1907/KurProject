import React from 'react';
import { View, Text, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors } from '@/constants/colors';
import { useTranslation } from 'react-i18next';

interface LoadingOverlayProps {
    visible: boolean;
    message?: string;
}

export function LoadingOverlay({ visible, message }: LoadingOverlayProps) {
    const { t } = useTranslation();

    if (!visible) return null;

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            statusBarTranslucent
        >
            <View style={styles.container}>
                <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
                <View style={styles.content}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={styles.message}>
                        {message || t('common.loading')}
                    </Text>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    content: {
        backgroundColor: colors.surface,
        padding: 24,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        minWidth: 150,
    },
    message: {
        marginTop: 16,
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
        textAlign: 'center',
    }
});

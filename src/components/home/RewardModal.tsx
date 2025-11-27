import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Modal } from '@components/ui/Modal';
import { colors } from '@constants/colors';
import { TreasureChest, Star, X } from 'phosphor-react-native';
import LottieView from 'lottie-react-native';

interface RewardModalProps {
    visible: boolean;
    onClose: () => void;
    xpAmount: number;
}

export function RewardModal({ visible, onClose, xpAmount }: RewardModalProps) {
    return (
        <Modal
            visible={visible}
            onClose={onClose}
            showCloseButton={false}
            transparent={true}
        >
            <View style={styles.container}>
                {/* Close Button */}
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <X size={24} color={colors.textSecondary} weight="bold" />
                </TouchableOpacity>

                {/* Animation Placeholder or Icon */}
                <View style={styles.iconContainer}>
                    <TreasureChest size={80} color={colors.warning} weight="fill" />
                    {/* If you have a Lottie animation for chest opening, put it here */}
                </View>

                {/* Title */}
                <Text style={styles.title}>Tebrikler! 🎉</Text>

                {/* Description */}
                <Text style={styles.description}>
                    Haftalık serini başarıyla tamamladın!
                </Text>

                {/* Reward Box */}
                <View style={styles.rewardBox}>
                    <Star size={32} color={colors.warning} weight="fill" />
                    <Text style={styles.rewardText}>+{xpAmount} XP</Text>
                </View>

                {/* Action Button */}
                <TouchableOpacity style={styles.button} onPress={onClose}>
                    <Text style={styles.buttonText}>Harika!</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: 8,
    },
    closeButton: {
        position: 'absolute',
        top: -10,
        right: -10,
        padding: 8,
        zIndex: 1,
    },
    iconContainer: {
        marginBottom: 24,
        alignItems: 'center',
        justifyContent: 'center',
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: colors.backgroundLighter,
        borderWidth: 4,
        borderColor: colors.warning,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: 8,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 24,
    },
    rewardBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.backgroundLighter,
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 16,
        marginBottom: 32,
        borderWidth: 2,
        borderColor: colors.warning,
        gap: 12,
    },
    rewardText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.warning,
    },
    button: {
        backgroundColor: colors.primary,
        paddingVertical: 16,
        paddingHorizontal: 48,
        borderRadius: 16,
        width: '100%',
        alignItems: 'center',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonText: {
        color: colors.textOnPrimary,
        fontSize: 18,
        fontWeight: 'bold',
    },
});

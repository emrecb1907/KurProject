import React, { useState, useMemo } from 'react';
import { View, Text, Pressable, StyleSheet, LayoutAnimation } from 'react-native';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Lock } from 'phosphor-react-native';
import Animated, { FadeInUp, FadeOutDown, Easing } from 'react-native-reanimated';
import type { IconProps } from 'phosphor-react-native';

import { colors } from '@/constants/colors';
import { HoverCard } from '@/components/ui/HoverCard';
import { useTheme } from '@/contexts/ThemeContext';

export interface CarouselCardProps {
    icon: React.ComponentType<IconProps>;
    title: string;
    description: string;
    unlocked: boolean;
    color: string;
    borderColor: string;
    level?: number;
    progress?: {
        current: number;
        total: number;
        label?: string;
    };
    route?: string;
    onPress?: (route?: string) => void;
    screenWidth?: number;
    size?: 'small' | 'large'; // 'small' = 135x243, 'large' = 280x220
}

export const CarouselCard: React.FC<CarouselCardProps> = ({
    icon: IconComponent,
    title,
    description,
    unlocked,
    color,
    borderColor,
    level,
    progress,
    route,
    onPress,
    screenWidth,
    size = 'small',
}) => {
    const { t } = useTranslation();
    const router = useRouter();
    const { themeVersion } = useTheme();
    const [isSelected, setIsSelected] = useState(false);
    const [cardPosition, setCardPosition] = useState({ top: 0, left: 0 });

    const styles = useMemo(() => getStyles(size), [themeVersion, size]);

    const handleCardPress = () => {
        if (!unlocked) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            return;
        }

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        // If custom onPress is provided, use it
        if (onPress) {
            onPress(route);
            return;
        }

        // Otherwise, show confirmation modal if screenWidth is provided
        if (screenWidth) {
            const cardWidth = size === 'large' ? 280 : 135;
            setCardPosition({
                top: 180,
                left: (screenWidth - cardWidth) / 2,
            });
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setIsSelected(true);
        } else if (route) {
            // Direct navigation if no screenWidth (no confirmation modal)
            router.push(route as any);
        }
    };

    const handleStart = () => {
        if (route) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push(route as any);
        }
        setIsSelected(false);
    };

    const handleCancel = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setIsSelected(false);
    };

    const progressPercentage = progress ? (progress.current / progress.total) * 100 : 0;
    const progressLabel = progress?.label || t('home.tests');

    return (
        <>
            <HoverCard
                style={[
                    styles.lessonCard,
                    {
                        backgroundColor: unlocked ? color : colors.locked,
                        borderBottomColor: unlocked ? borderColor : colors.lockedBorder,
                    },
                    !unlocked && styles.lessonCardLocked,
                ]}
                onPress={handleCardPress}
                disabled={!unlocked}
                lightColor="rgba(255, 255, 255, 0.3)"
            >
                {/* Card Header */}
                <View style={styles.cardHeader}>
                    <View style={styles.cardIconContainer}>
                        <IconComponent
                            size={size === 'large' ? 32 : 28.8}
                            color={colors.textOnPrimary}
                            weight="fill"
                        />
                    </View>
                    {!unlocked && level !== undefined && (
                        <View style={styles.levelBadge}>
                            <Text style={styles.levelBadgeText}>{t('home.level')} {level}</Text>
                        </View>
                    )}
                </View>

                {/* Card Content */}
                <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{title}</Text>
                    <Text style={styles.cardDescription}>{description}</Text>
                </View>

                {/* Card Footer - Progress or Status */}
                <View style={styles.cardFooter}>
                    {unlocked && progress ? (
                        <View style={styles.progressContainer}>
                            <View style={styles.progressBar}>
                                <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
                            </View>
                            <Text style={styles.progressText}>{progress.current}/{progress.total} {progressLabel}</Text>
                        </View>
                    ) : !unlocked ? (
                        <View style={styles.lockedBadge}>
                            <Lock size={size === 'large' ? 16 : 14.4} color={colors.textOnPrimary} weight="fill" />
                            <Text style={styles.lockedBadgeText}>{t('home.locked')}</Text>
                        </View>
                    ) : null}
                </View>
            </HoverCard>

            {/* Confirmation Modal (only shown if screenWidth is provided and no custom onPress) */}
            {isSelected && screenWidth && !onPress && (
                <>
                    {/* Backdrop to close on outside click */}
                    <Pressable
                        style={{
                            position: 'absolute',
                            top: -2000,
                            left: -1000,
                            right: -1000,
                            bottom: -2000,
                            zIndex: 99,
                            backgroundColor: 'transparent',
                        }}
                        onPress={handleCancel}
                    />

                    <Animated.View
                        entering={FadeInUp.duration(300).easing(Easing.out(Easing.quad))}
                        exiting={FadeOutDown.duration(200)}
                        style={[
                            styles.startCardContainer,
                            {
                                left: cardPosition.left,
                                top: cardPosition.top,
                            }
                        ]}
                    >
                        <View style={styles.startCardHeader}>
                            <View style={[styles.startCardIcon, { backgroundColor: color }]}>
                                <IconComponent size={20} color={colors.textOnPrimary} weight="fill" />
                            </View>
                            <View style={styles.startCardTitleContainer}>
                                <Text style={styles.startCardTitle}>{title}</Text>
                                <Text style={styles.startCardSubtitle}>{description}</Text>
                            </View>
                        </View>

                        <View style={styles.startCardActions}>
                            <Pressable
                                style={[styles.startButton, { backgroundColor: color, borderBottomColor: borderColor }]}
                                onPress={handleStart}
                            >
                                <Text style={styles.startButtonText}>{t('common.start')}</Text>
                            </Pressable>

                            <Pressable
                                style={styles.cancelButton}
                                onPress={handleCancel}
                            >
                                <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
                            </Pressable>
                        </View>
                    </Animated.View>
                </>
            )}
        </>
    );
};

const getStyles = (size: 'small' | 'large') => StyleSheet.create({
    lessonCard: {
        width: size === 'large' ? 280 : 135, // large: 280x220, small: 135x243
        height: size === 'large' ? 220 : 243,
        borderRadius: size === 'large' ? 20 : 18,
        padding: size === 'large' ? 20 : 18,
        borderBottomWidth: size === 'large' ? 6 : 5.4,
        shadowColor: colors.shadowStrong,
        shadowOffset: { width: 0, height: size === 'large' ? 4 : 3.6 },
        shadowOpacity: 0.5,
        shadowRadius: size === 'large' ? 8 : 7.2,
        elevation: size === 'large' ? 8 : 7.2,
        justifyContent: 'space-between',
    },
    lessonCardLocked: {
        opacity: 0.6,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    cardIconContainer: {
        width: size === 'large' ? 56 : 50.4,
        height: size === 'large' ? 56 : 50.4,
        borderRadius: size === 'large' ? 16 : 14.4,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    levelBadge: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        paddingHorizontal: size === 'large' ? 10 : 9,
        paddingVertical: size === 'large' ? 4 : 3.6,
        borderRadius: size === 'large' ? 12 : 10.8,
    },
    levelBadgeText: {
        fontSize: size === 'large' ? 11 : 9.9,
        fontWeight: 'bold',
        color: colors.textOnPrimary,
    },
    cardContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.textOnPrimary,
        marginBottom: 5.4,
        textAlign: 'center',
    },
    cardDescription: {
        fontSize: 11.7,
        color: colors.textOnPrimary,
        opacity: 0.9,
        lineHeight: 16.2,
        textAlign: 'center',
    },
    cardFooter: {
        marginTop: size === 'large' ? 12 : 10.8,
    },
    progressContainer: {
        gap: size === 'large' ? 6 : 5.4,
    },
    progressBar: {
        height: size === 'large' ? 6 : 5.4,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: size === 'large' ? 3 : 2.7,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: colors.textOnPrimary,
        borderRadius: size === 'large' ? 3 : 2.7,
    },
    progressText: {
        fontSize: size === 'large' ? 11 : 9.9,
        fontWeight: '600',
        color: colors.textOnPrimary,
        opacity: 0.9,
    },
    lockedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: size === 'large' ? 6 : 5.4,
    },
    lockedBadgeText: {
        fontSize: size === 'large' ? 13 : 11.7,
        fontWeight: '600',
        color: colors.textOnPrimary,
    },
    startCardContainer: {
        position: 'absolute',
        width: 280,
        zIndex: 100,
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 16,
        borderWidth: 2,
        borderColor: colors.border,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8,
    },
    startCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 10,
    },
    startCardIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    startCardTitleContainer: {
        flex: 1,
    },
    startCardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    startCardSubtitle: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    startCardActions: {
        flexDirection: 'row',
        gap: 8,
    },
    startButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        borderBottomWidth: 3,
    },
    startButtonText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: colors.textOnPrimary,
    },
    cancelButton: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.textSecondary,
    },
});


import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    Easing,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { Heart, GraduationCap, Bell, User } from 'phosphor-react-native';
import * as Haptics from 'expo-haptics';

import { colors } from '@/constants/colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useUser, useAuth } from '@/store';
import { getXPProgress, formatXP } from '@/lib/utils/levelCalculations';

export const HomeHeader = () => {
    const { t } = useTranslation();
    const { themeVersion, activeTheme } = useTheme();
    const { totalXP, currentLives } = useUser();
    const { user } = useAuth();

    // Calculate XP progress
    const xpProgress = getXPProgress(totalXP);

    // Animated XP bar width
    const animatedXPWidth = useSharedValue(xpProgress.progressPercentage);

    // Update animated width when XP changes
    useEffect(() => {
        animatedXPWidth.value = withTiming(xpProgress.progressPercentage, {
            duration: 300,
            easing: Easing.out(Easing.quad),
        });
    }, [xpProgress.progressPercentage]);

    const animatedXPStyle = useAnimatedStyle(() => {
        return {
            width: `${animatedXPWidth.value}%`,
        };
    });

    const styles = useMemo(() => StyleSheet.create({
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: 8,
        },
        userInfo: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
        },
        avatarContainer: {
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: colors.warning, // Yellow circle
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 2,
            borderColor: colors.warningDark,
        },
        greetingContainer: {
            justifyContent: 'center',
        },
        greetingText: {
            fontSize: 14,
            color: colors.textSecondary,
            fontWeight: '500',
        },
        userName: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.textPrimary,
        },
        notificationButton: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.surface,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 0.2,
            borderColor: 'rgba(255, 255, 255, 0.1)',
            // iOS 18 style shadow
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 16,
            elevation: 4,
        },
        statsRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            marginBottom: 8,
            marginTop: 8,
        },
        statBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.surface,
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 32,
            gap: 8,
            borderWidth: activeTheme === 'light' ? 0.2 : 0,
            borderColor: activeTheme === 'light' ? '#FFC800' : 'transparent',
            // iOS 18 style shadow
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 16,
            elevation: 4,
        },
        statValue: {
            fontSize: 14,
            fontWeight: 'bold',
            color: colors.textPrimary,
        },
        xpContainer: {
            paddingHorizontal: 16,
            marginBottom: 10,
        },
        xpBarBackground: {
            height: 12,
            backgroundColor: colors.surface,
            borderRadius: 6,
            overflow: 'hidden',
            marginBottom: 6,
            borderWidth: activeTheme === 'light' ? 0.2 : 0,
            borderColor: activeTheme === 'light' ? '#FFC800' : 'transparent',
        },
        xpBarFill: {
            height: '100%',
            backgroundColor: '#FFC800',
            borderRadius: 6,
        },
        xpText: {
            fontSize: 12,
            color: colors.textSecondary,
            textAlign: 'center',
            fontWeight: '500',
        },
    }), [themeVersion, activeTheme]);

    return (
        <View>
            {/* Header Section */}
            <View style={styles.header}>
                <View style={styles.userInfo}>
                    <View style={styles.avatarContainer}>
                        {/* Placeholder for avatar - can be replaced with Image if available */}
                        <User size={24} color="#000" weight="fill" style={{ opacity: 0.5 }} />
                    </View>
                    <View style={styles.greetingContainer}>
                        <Text style={styles.greetingText}>{t('home.welcome')},</Text>
                        <Text style={styles.userName}>{user?.username || user?.email?.split('@')[0] || 'Misafir'}</Text>
                    </View>
                </View>
                <Pressable style={styles.notificationButton} onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
                    <Bell size={20} color={colors.textPrimary} />
                </Pressable>
            </View>

            {/* Stats Row */}
            <View style={styles.statsRow}>
                <View style={styles.statBadge}>
                    <GraduationCap size={20} color={colors.warning} weight="fill" />
                    <Text style={styles.statValue}>Level {xpProgress.currentLevel}</Text>
                </View>
                <View style={styles.statBadge}>
                    <Heart size={20} color={colors.error} weight="fill" />
                    <Text style={styles.statValue}>{currentLives}/6</Text>
                </View>
            </View>

            {/* XP Bar Section */}
            <View style={styles.xpContainer}>
                <View style={styles.xpBarBackground}>
                    <Animated.View style={[styles.xpBarFill, animatedXPStyle]} />
                </View>
                <Text style={styles.xpText}>
                    {formatXP(xpProgress.currentLevelXP)}/{formatXP(xpProgress.requiredXP)} XP
                </Text>
            </View>
        </View>
    );
};

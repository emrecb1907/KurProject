import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    Easing,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { Heart, GraduationCap, Bell, User, Lightning } from 'phosphor-react-native';
import * as Haptics from 'expo-haptics';

import { colors } from '@/constants/colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useUser, useAuth } from '@/store';
import { getXPProgress, formatXP } from '@/lib/utils/levelCalculations';
import { getAvatarSource } from '@/constants/avatars';
import { useUserData, useEnergy } from '@/hooks/queries';

export const HomeHeader = () => {
    const { t } = useTranslation();
    const { themeVersion, activeTheme } = useTheme();
    const { user, isProfileReady } = useAuth();

    // UI State from Zustand
    const { selectedAvatar } = useUser();

    // Server data from React Query
    const { data: userData, isLoading: isUserDataLoading } = useUserData(user?.id);
    const { data: energyData, isLoading: isEnergyLoading } = useEnergy(user?.id);

    // Show skeleton if profile not ready or data is loading for first time
    const isLoading = !isProfileReady || (isUserDataLoading && !userData) || (isEnergyLoading && !energyData);

    // Extract values - use auth store user data as initial fallback, then React Query data
    // This prevents showing 0 values while React Query fetches
    const totalXP = userData?.total_xp ?? userData?.stats?.total_score ?? user?.total_xp ?? user?.total_score ?? 0;
    const currentLevel = userData?.current_level ?? user?.current_level ?? 1;
    const currentLives = energyData?.current_energy ?? user?.current_lives ?? 5;
    const maxLives = energyData?.max_energy ?? user?.max_lives ?? 6;

    // Calculate XP progress using the best available data
    const xpProgress = getXPProgress(totalXP);
    // Override level if we have direct data
    const displayLevel = userData?.current_level ?? currentLevel;

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
            width: 58,
            height: 58,
            borderRadius: 29,
            backgroundColor: colors.primary, // Orange circle
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 2,
            borderColor: colors.primaryDark,
            overflow: 'hidden',
        },
        avatarImage: {
            width: '100%',
            height: '100%',
            transform: [{ scale: 1.2 }, { translateX: -2 }],
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
            borderColor: activeTheme === 'light' ? '#FF9600' : 'transparent',
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
            borderColor: activeTheme === 'light' ? '#FF9600' : 'transparent',
        },
        xpBarFill: {
            height: '100%',
            backgroundColor: '#FF9600',
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
                        <Image
                            source={getAvatarSource(selectedAvatar)}
                            style={styles.avatarImage}
                            resizeMode="cover"
                        />
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
                    <GraduationCap size={20} color={colors.primary} weight="fill" />
                    <Text style={styles.statValue}>Level {displayLevel}</Text>
                </View>
                <View style={[styles.statBadge, { paddingHorizontal: 0, paddingVertical: 0, overflow: 'hidden', position: 'relative' }]}>
                    <View style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: `${Math.min((currentLives / (maxLives || 6)) * 100, 100)}%`,
                        backgroundColor: colors.primary,
                        opacity: 0.3,
                    }} />
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, gap: 8 }}>
                        <Lightning size={20} color={colors.primary} weight="fill" />
                        <Text style={styles.statValue}>{currentLives}/{maxLives || 6}</Text>
                    </View>
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

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { BadgeWithProgress } from '@/types/badge.types';
import { colors } from '@/constants/colors';
import { Lock } from 'phosphor-react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface BadgeItemProps {
    badge: BadgeWithProgress;
}

export const BadgeItem = ({ badge }: BadgeItemProps) => {
    const { activeTheme } = useTheme(); // Access current theme (light/dark)
    const isUnlocked = badge.user_progress?.is_claimed ?? false;
    const iconSource = badge.icon_url;

    // Dynamic styles based on theme
    const styles = useMemo(() => StyleSheet.create({
        container: {
            alignItems: 'center',
            margin: 8,
            width: 80,
        },
        lockedContainer: {
        },
        iconContainer: {
            width: 70,
            height: 70,
            borderRadius: 35,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            backgroundColor: colors.surface,
            borderWidth: 2,
            borderColor: colors.border,
            overflow: 'hidden',
        },
        badgeImage: {
            width: '100%',
            height: '100%',
            borderRadius: 35,
        },
        placeholderBadge: {
            width: '100%',
            height: '100%',
            backgroundColor: colors.surface,
        },
        lockedPlaceholder: {
            // Dark mode: Darker gray background to stand out from black lock
            // Light mode: Light gray (#E0E0E0)
            backgroundColor: activeTheme === 'dark' ? '#9CA3AF' : '#E0E0E0',
            opacity: 1,
        },
        lockOverlay: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: [{ translateX: -14 }, { translateY: -14 }],
            zIndex: 10,
        },
    }), [activeTheme]);

    return (
        <View style={[styles.container, !isUnlocked && styles.lockedContainer]}>
            <View style={styles.iconContainer}>
                {isUnlocked && iconSource ? (
                    <Image
                        source={iconSource as any}
                        style={styles.badgeImage}
                        resizeMode="contain"
                    />
                ) : (
                    <View style={[styles.placeholderBadge, !isUnlocked && styles.lockedPlaceholder]} />
                )}

                {!isUnlocked && (
                    <View style={styles.lockOverlay}>
                        {/* Dark mode: Black lock. Light mode: Dark gray lock. */}
                        <Lock
                            size={28}
                            color={activeTheme === 'dark' ? '#000000' : colors.textSecondary}
                            weight="fill"
                        />
                    </View>
                )}
            </View>
        </View>
    );
};

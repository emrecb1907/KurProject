import React, { useRef, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '@constants/colors';
import { useTheme } from '@/contexts/ThemeContext';
import { Vibrate, SpeakerSimpleHigh, Check } from 'phosphor-react-native';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { HeaderButton } from '@components/ui';
import { useUser } from '@/store';

export default function PreferencesScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const { themeVersion } = useTheme();
    const scrollViewRef = useRef<ScrollView>(null);

    const {
        hapticsEnabled,
        soundsEnabled,
        setHapticsEnabled,
        setSoundsEnabled
    } = useUser();

    useFocusEffect(
        useCallback(() => {
            scrollViewRef.current?.scrollTo({ y: 0, animated: false });
        }, [])
    );

    const handleToggleHaptics = () => {
        if (hapticsEnabled) {
            // If turning off, don't vibrate
            setHapticsEnabled(false);
        } else {
            // If turning on, vibrate to confirm
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            setHapticsEnabled(true);
        }
    };

    const handleToggleSounds = () => {
        if (hapticsEnabled) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        setSoundsEnabled(!soundsEnabled);
    };

    const styles = useMemo(() => StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 16,
            backgroundColor: colors.backgroundDarker,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        headerTitleContainer: {
            position: 'absolute',
            left: 0,
            right: 0,
            alignItems: 'center',
        },
        headerTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: colors.textPrimary,
            textAlign: 'center',
        },
        headerSpacer: {
            width: 40,
        },
        content: {
            flex: 1,
        },
        scrollContent: {
            padding: 24,
        },
        optionCard: {
            backgroundColor: colors.surface,
            borderRadius: 16,
            borderWidth: 2,
            borderColor: colors.border,
            marginBottom: 16,
            overflow: 'hidden',
        },
        optionRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 16,
        },
        optionLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            flex: 1,
        },
        iconContainer: {
            width: 44,
            height: 44,
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.primary + '20',
        },
        optionText: {
            flex: 1,
        },
        optionTitle: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.textPrimary,
            marginBottom: 4,
        },
        optionDescription: {
            fontSize: 13,
            color: colors.textSecondary,
        },
        checkbox: {
            width: 28,
            height: 28,
            borderRadius: 8,
            borderWidth: 2,
            borderColor: colors.border,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'transparent',
        },
        checkboxChecked: {
            backgroundColor: colors.primary,
            borderColor: colors.buttonOrangeBorder,
        },
    }), [themeVersion]);

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            {/* Header */}
            <View style={styles.header}>
                <HeaderButton
                    title={t('common.back')}
                    onPress={() => {
                        if (hapticsEnabled) {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }
                        router.back();
                    }}
                />
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>{t('profile.preferences.title')}</Text>
                </View>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView
                ref={scrollViewRef}
                style={styles.content}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Disable Haptics */}
                <Pressable style={styles.optionCard} onPress={handleToggleHaptics}>
                    <View style={styles.optionRow}>
                        <View style={styles.optionLeft}>
                            <View style={[styles.iconContainer, { backgroundColor: colors.secondary + '20' }]}>
                                <Vibrate size={24} color={colors.secondary} weight="fill" />
                            </View>
                            <View style={styles.optionText}>
                                <Text style={styles.optionTitle}>
                                    {t('profile.preferences.disableHaptics')}
                                </Text>
                                <Text style={styles.optionDescription}>
                                    {t('profile.preferences.disableHapticsDesc')}
                                </Text>
                            </View>
                        </View>
                        <View style={[styles.checkbox, !hapticsEnabled && styles.checkboxChecked]}>
                            {!hapticsEnabled && <Check size={18} color="#FFFFFF" weight="bold" />}
                        </View>
                    </View>
                </Pressable>

                {/* Disable Sounds */}
                <Pressable style={styles.optionCard} onPress={handleToggleSounds}>
                    <View style={styles.optionRow}>
                        <View style={styles.optionLeft}>
                            <View style={[styles.iconContainer, { backgroundColor: colors.success + '20' }]}>
                                <SpeakerSimpleHigh size={24} color={colors.success} weight="fill" />
                            </View>
                            <View style={styles.optionText}>
                                <Text style={styles.optionTitle}>
                                    {t('profile.preferences.disableSounds')}
                                </Text>
                                <Text style={styles.optionDescription}>
                                    {t('profile.preferences.disableSoundsDesc')}
                                </Text>
                            </View>
                        </View>
                        <View style={[styles.checkbox, !soundsEnabled && styles.checkboxChecked]}>
                            {!soundsEnabled && <Check size={18} color="#FFFFFF" weight="bold" />}
                        </View>
                    </View>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}

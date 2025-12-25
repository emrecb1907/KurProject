import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors } from '@constants/colors';
import { useTheme } from '@/contexts/ThemeContext';
import { X, Clock, Check, Warning } from 'phosphor-react-native';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/store';
import { database } from '@/lib/supabase/database';
import { HeaderButton } from '@/components/ui';

// Comprehensive timezone list with UTC offsets
const TIMEZONES = [
    { id: 'Pacific/Midway', offset: '-11:00', city: 'Midway', country: 'US Minor Outlying Islands' },
    { id: 'Pacific/Honolulu', offset: '-10:00', city: 'Honolulu', country: 'Hawaii' },
    { id: 'America/Anchorage', offset: '-09:00', city: 'Anchorage', country: 'Alaska' },
    { id: 'America/Los_Angeles', offset: '-08:00', city: 'Los Angeles', country: 'ABD' },
    { id: 'America/Denver', offset: '-07:00', city: 'Denver', country: 'ABD' },
    { id: 'America/Chicago', offset: '-06:00', city: 'Chicago', country: 'ABD' },
    { id: 'America/New_York', offset: '-05:00', city: 'New York', country: 'ABD' },
    { id: 'America/Caracas', offset: '-04:00', city: 'Caracas', country: 'Venezuela' },
    { id: 'America/Sao_Paulo', offset: '-03:00', city: 'São Paulo', country: 'Brezilya' },
    { id: 'Atlantic/South_Georgia', offset: '-02:00', city: 'South Georgia', country: 'UK' },
    { id: 'Atlantic/Azores', offset: '-01:00', city: 'Azores', country: 'Portekiz' },
    { id: 'Europe/London', offset: '+00:00', city: 'Londra', country: 'İngiltere' },
    { id: 'Europe/Paris', offset: '+01:00', city: 'Paris', country: 'Fransa' },
    { id: 'Europe/Berlin', offset: '+01:00', city: 'Berlin', country: 'Almanya' },
    { id: 'Europe/Istanbul', offset: '+03:00', city: 'İstanbul', country: 'Türkiye' },
    { id: 'Europe/Moscow', offset: '+03:00', city: 'Moskova', country: 'Rusya' },
    { id: 'Asia/Dubai', offset: '+04:00', city: 'Dubai', country: 'BAE' },
    { id: 'Asia/Karachi', offset: '+05:00', city: 'Karaçi', country: 'Pakistan' },
    { id: 'Asia/Kolkata', offset: '+05:30', city: 'Mumbai', country: 'Hindistan' },
    { id: 'Asia/Dhaka', offset: '+06:00', city: 'Dakka', country: 'Bangladeş' },
    { id: 'Asia/Bangkok', offset: '+07:00', city: 'Bangkok', country: 'Tayland' },
    { id: 'Asia/Singapore', offset: '+08:00', city: 'Singapur', country: 'Singapur' },
    { id: 'Asia/Shanghai', offset: '+08:00', city: 'Şanghay', country: 'Çin' },
    { id: 'Asia/Tokyo', offset: '+09:00', city: 'Tokyo', country: 'Japonya' },
    { id: 'Asia/Seoul', offset: '+09:00', city: 'Seul', country: 'Güney Kore' },
    { id: 'Australia/Sydney', offset: '+11:00', city: 'Sydney', country: 'Avustralya' },
    { id: 'Pacific/Auckland', offset: '+13:00', city: 'Auckland', country: 'Yeni Zelanda' },
];

export default function TimezoneSettingsScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const { themeVersion } = useTheme();
    const { user, isAuthenticated } = useAuth();

    const [currentTimezone, setCurrentTimezone] = useState<string>('UTC');
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);
    const [daysRemaining, setDaysRemaining] = useState<number>(0);
    const [canChange, setCanChange] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedTimezone, setSelectedTimezone] = useState<string>('');

    // Fetch current timezone info
    useEffect(() => {
        if (!user?.id) return;

        const fetchTimezone = async () => {
            try {
                const { data, error } = await database.timezone.get(user.id);
                if (data && !error) {
                    setCurrentTimezone(data.timezone || 'UTC');
                    setSelectedTimezone(data.timezone || 'UTC');

                    if (data.timezone_updated_at) {
                        setLastUpdated(data.timezone_updated_at);
                        // Calculate days since last change
                        const lastChange = new Date(data.timezone_updated_at);
                        const now = new Date();
                        const diffDays = Math.floor((now.getTime() - lastChange.getTime()) / (1000 * 60 * 60 * 24));
                        const remaining = Math.max(0, 30 - diffDays);
                        setDaysRemaining(remaining);
                        setCanChange(remaining === 0);
                    } else {
                        // Never updated, can change
                        setCanChange(true);
                        setDaysRemaining(0);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch timezone:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTimezone();
    }, [user?.id]);

    const handleSaveTimezone = async () => {
        if (!user?.id || selectedTimezone === currentTimezone) return;

        setIsSaving(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        try {
            const { data, error } = await database.timezone.change(user.id, selectedTimezone);

            if (error) {
                Alert.alert(t('common.error'), error.message);
                return;
            }

            const result = data as { success: boolean; error?: string; days_remaining?: number };

            if (!result.success) {
                if (result.error === 'cooldown') {
                    Alert.alert(
                        t('profile.settings.timezone.cooldownTitle', 'Bekleme Süresi'),
                        t('profile.settings.timezone.cooldownMessage', { days: result.days_remaining })
                    );
                } else {
                    Alert.alert(t('common.error'), result.error || 'Unknown error');
                }
                return;
            }

            // Success
            setCurrentTimezone(selectedTimezone);
            setLastUpdated(new Date().toISOString());
            setDaysRemaining(30);
            setCanChange(false);

            Alert.alert(
                t('common.success'),
                t('profile.settings.timezone.updateSuccess', 'Saat diliminiz güncellendi.')
            );
        } catch (error) {
            console.error('Failed to save timezone:', error);
            Alert.alert(t('common.error'), 'Failed to save timezone');
        } finally {
            setIsSaving(false);
        }
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
            paddingHorizontal: 16,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        backButton: {
            width: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
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
            position: 'absolute',
            left: 0,
            right: 0,
            zIndex: -1,
        },
        headerSpacer: {
            width: 40,
        },
        content: {
            flex: 1,
            padding: 16,
        },
        infoCard: {
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 16,
            marginBottom: 24,
        },
        infoRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            marginBottom: 12,
        },
        infoLabel: {
            fontSize: 14,
            color: colors.textSecondary,
        },
        infoValue: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.textPrimary,
        },
        warningCard: {
            backgroundColor: 'rgba(255, 152, 0, 0.1)',
            borderRadius: 12,
            padding: 12,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            marginBottom: 24,
        },
        warningText: {
            flex: 1,
            fontSize: 14,
            color: colors.warning,
        },
        sectionTitle: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.textPrimary,
            marginBottom: 12,
        },
        timezoneList: {
            gap: 8,
        },
        timezoneItem: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: colors.surface,
            paddingVertical: 14,
            paddingHorizontal: 16,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: 'transparent',
        },
        timezoneItemSelected: {
            borderColor: colors.primary,
            backgroundColor: 'rgba(255, 152, 0, 0.1)',
        },
        timezoneItemDisabled: {
            opacity: 0.5,
        },
        timezoneText: {
            fontSize: 15,
            color: colors.textPrimary,
        },
        saveButton: {
            backgroundColor: colors.primary,
            paddingVertical: 16,
            borderRadius: 30,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 24,
        },
        saveButtonDisabled: {
            opacity: 0.5,
        },
        saveButtonText: {
            fontSize: 16,
            fontWeight: 'bold',
            color: colors.textOnPrimary,
        },
        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
    }), [themeVersion]);

    if (!isAuthenticated) {
        return (
            <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
                <View style={styles.header}>
                    <HeaderButton title={t('common.back')} onPress={() => router.back()} style={{ marginLeft: -8 }} />
                    <Text style={styles.headerTitle}>{t('profile.settings.account.timezone', 'Saat Dilimi')}</Text>
                </View>
                <View style={styles.loadingContainer}>
                    <Text style={{ color: colors.textSecondary }}>{t('profile.settings.timezone.loginRequired')}</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
                <View style={styles.header}>
                    <HeaderButton title={t('common.back')} onPress={() => router.back()} style={{ marginLeft: -8 }} />
                    <Text style={styles.headerTitle}>{t('profile.settings.account.timezone', 'Saat Dilimi')}</Text>
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            {/* Header */}
            <View style={styles.header}>
                <HeaderButton
                    title={t('common.back')}
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        router.back();
                    }}
                    style={{ marginLeft: -8 }}
                />
                <Text style={styles.headerTitle}>{t('profile.settings.timezone.title')}</Text>
            </View>

            <ScrollView style={styles.content}>
                {/* Current Timezone Info */}
                <View style={styles.infoCard}>
                    <View style={styles.infoRow}>
                        <Clock size={24} color={colors.primary} weight="fill" />
                        <View>
                            <Text style={styles.infoLabel}>{t('profile.settings.timezone.current')}</Text>
                            <Text style={styles.infoValue}>{currentTimezone}</Text>
                        </View>
                    </View>
                </View>

                {/* Cooldown Warning */}
                {!canChange && daysRemaining > 0 && (
                    <View style={styles.warningCard}>
                        <Warning size={24} color={colors.warning} weight="fill" />
                        <Text style={styles.warningText}>
                            {t('profile.settings.timezone.cooldownWarning', { days: daysRemaining })}
                        </Text>
                    </View>
                )}

                {/* Timezone Picker */}
                <Text style={styles.sectionTitle}>{t('profile.settings.timezone.select')}</Text>
                <View style={styles.timezoneList}>
                    {TIMEZONES.map((tz) => (
                        <Pressable
                            key={tz.id}
                            style={[
                                styles.timezoneItem,
                                selectedTimezone === tz.id && styles.timezoneItemSelected,
                                !canChange && styles.timezoneItemDisabled,
                            ]}
                            onPress={() => {
                                if (canChange) {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    setSelectedTimezone(tz.id);
                                }
                            }}
                            disabled={!canChange}
                        >
                            <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                    <Text style={[styles.timezoneText, { fontWeight: '600' }]}>
                                        (UTC{tz.offset})
                                    </Text>
                                    <Text style={styles.timezoneText}>
                                        {tz.city}
                                    </Text>
                                </View>
                                <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>
                                    {tz.country}
                                </Text>
                            </View>
                            {selectedTimezone === tz.id && (
                                <Check size={20} color={colors.primary} weight="bold" />
                            )}
                        </Pressable>
                    ))}
                </View>

                {/* Save Button */}
                <Pressable
                    style={[
                        styles.saveButton,
                        (!canChange || selectedTimezone === currentTimezone || isSaving) && styles.saveButtonDisabled,
                    ]}
                    onPress={handleSaveTimezone}
                    disabled={!canChange || selectedTimezone === currentTimezone || isSaving}
                >
                    {isSaving ? (
                        <ActivityIndicator size="small" color={colors.textOnPrimary} />
                    ) : (
                        <Text style={styles.saveButtonText}>
                            {t('common.save', 'Kaydet')}
                        </Text>
                    )}
                </Pressable>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

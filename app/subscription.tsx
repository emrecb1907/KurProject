import React, { useRef, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Linking, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '@constants/colors';
import { useTheme } from '@/contexts/ThemeContext';
import { CreditCard, Calendar, ArrowsClockwise, Crown, ShoppingBag, Info } from 'phosphor-react-native';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { HeaderButton } from '@components/ui';
import { usePremium } from '@/contexts/AdaptyProvider';

export default function SubscriptionScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const { themeVersion } = useTheme();
    const { isPremium, isLoading, profile } = usePremium();

    const scrollViewRef = useRef<ScrollView>(null);

    useFocusEffect(
        useCallback(() => {
            scrollViewRef.current?.scrollTo({ y: 0, animated: false });
        }, [])
    );

    // Abonelik bilgilerini çıkar
    const subscriptionInfo = useMemo(() => {
        const premiumAccess = profile?.accessLevels?.premium;

        if (!premiumAccess?.isActive) {
            return null;
        }

        const activatedAt = premiumAccess.activatedAt ? new Date(premiumAccess.activatedAt) : null;
        const expiresAt = premiumAccess.expiresAt ? new Date(premiumAccess.expiresAt) : null;
        const renewedAt = premiumAccess.renewedAt ? new Date(premiumAccess.renewedAt) : null;
        const unsubscribedAt = premiumAccess.unsubscribedAt ? new Date(premiumAccess.unsubscribedAt) : null;

        // Plan tipini belirle
        let planType = 'unknown';
        if (premiumAccess.vendorProductId?.includes('monthly')) {
            planType = 'monthly';
        } else if (premiumAccess.vendorProductId?.includes('yearly')) {
            planType = 'yearly';
        } else if (premiumAccess.isLifetime) {
            planType = 'lifetime';
        }

        return {
            activatedAt,
            expiresAt,
            renewedAt,
            unsubscribedAt,
            willRenew: premiumAccess.willRenew ?? false,
            isLifetime: premiumAccess.isLifetime ?? false,
            store: premiumAccess.store || 'unknown',
            planType,
            vendorProductId: premiumAccess.vendorProductId,
            isInGracePeriod: premiumAccess.isInGracePeriod ?? false,
            cancellationReason: premiumAccess.cancellationReason,
            isCancelled: premiumAccess.willRenew === false && !premiumAccess.isLifetime,
        };
    }, [profile]);

    // Tarih formatlama (saat dahil)
    const formatDate = (date: Date | null) => {
        if (!date) return '-';
        return date.toLocaleDateString(t('common.locale', 'tr-TR'), {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Mağaza yönetimi URL'i
    const handleManageSubscription = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (Platform.OS === 'ios') {
            Linking.openURL('https://apps.apple.com/account/subscriptions');
        } else {
            Linking.openURL('https://play.google.com/store/account/subscriptions');
        }
    };

    const styles = StyleSheet.create({
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
        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        // Premium Badge
        premiumBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            backgroundColor: '#FF9600',
            paddingVertical: 16,
            paddingHorizontal: 24,
            borderRadius: 16,
            marginBottom: 24,
        },
        premiumBadgeText: {
            fontSize: 20,
            fontWeight: 'bold',
            color: '#000000',
        },
        // No Subscription
        noSubscription: {
            alignItems: 'center',
            padding: 32,
            backgroundColor: colors.surface,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: colors.border,
        },
        noSubscriptionText: {
            fontSize: 16,
            color: colors.textSecondary,
            textAlign: 'center',
            marginTop: 16,
        },
        // Info Card
        infoCard: {
            backgroundColor: colors.surface,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: colors.border,
            marginBottom: 16,
            overflow: 'hidden',
        },
        infoRow: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 16,
            paddingHorizontal: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        infoRowLast: {
            borderBottomWidth: 0,
        },
        infoIcon: {
            marginRight: 16,
        },
        infoContent: {
            flex: 1,
        },
        infoLabel: {
            fontSize: 14,
            color: colors.textSecondary,
            marginBottom: 4,
        },
        infoValue: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.textPrimary,
        },
        // Status Badge
        statusBadge: {
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20,
        },
        statusActive: {
            backgroundColor: '#E8F5E9',
        },
        statusInactive: {
            backgroundColor: '#FFEBEE',
        },
        statusText: {
            fontSize: 12,
            fontWeight: 'bold',
        },
        statusTextActive: {
            color: '#2E7D32',
        },
        statusTextInactive: {
            color: '#D32F2F',
        },
        // Manage Button
        manageButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            backgroundColor: colors.surface,
            borderWidth: 2,
            borderColor: colors.border,
            paddingVertical: 16,
            borderRadius: 30,
            marginTop: 8,
        },
        manageButtonText: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.textPrimary,
        },
        // Info Note
        infoNote: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: 12,
            backgroundColor: colors.surface,
            padding: 16,
            borderRadius: 12,
            marginTop: 24,
        },
        infoNoteText: {
            flex: 1,
            fontSize: 13,
            color: colors.textSecondary,
            lineHeight: 18,
        },
        // Cancellation Warning Banner
        cancelledBanner: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            backgroundColor: '#FFEBEE',
            padding: 16,
            borderRadius: 12,
            marginBottom: 16,
        },
        cancelledBannerText: {
            flex: 1,
            fontSize: 14,
            color: '#D32F2F',
            fontWeight: '500',
        },
    });

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
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
                />
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>{t('subscription.title')}</Text>
                </View>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView
                ref={scrollViewRef}
                style={styles.content}
                contentContainerStyle={styles.scrollContent}
            >
                {isPremium && subscriptionInfo ? (
                    <>
                        {/* Cancellation Warning Banner */}
                        {subscriptionInfo.isCancelled && (
                            <View style={styles.cancelledBanner}>
                                <Info size={20} color="#D32F2F" />
                                <Text style={styles.cancelledBannerText}>
                                    {t('subscription.cancelledWarning', { date: formatDate(subscriptionInfo.expiresAt) })}
                                </Text>
                            </View>
                        )}

                        {/* Premium Badge */}
                        <View style={styles.premiumBadge}>
                            <Crown size={28} color="#000000" weight="fill" />
                            <Text style={styles.premiumBadgeText}>{t('subscription.premiumActive')}</Text>
                        </View>

                        {/* Subscription Info Card */}
                        <View style={styles.infoCard}>
                            {/* Plan Type */}
                            <View style={styles.infoRow}>
                                <CreditCard size={24} color={colors.textSecondary} weight="fill" style={styles.infoIcon} />
                                <View style={styles.infoContent}>
                                    <Text style={styles.infoLabel}>{t('subscription.planType')}</Text>
                                    <Text style={styles.infoValue}>
                                        {subscriptionInfo.planType === 'monthly' && t('subscription.monthly')}
                                        {subscriptionInfo.planType === 'yearly' && t('subscription.yearly')}
                                        {subscriptionInfo.planType === 'lifetime' && t('subscription.lifetime')}
                                        {subscriptionInfo.planType === 'unknown' && '-'}
                                    </Text>
                                </View>
                            </View>

                            {/* Start Date */}
                            <View style={styles.infoRow}>
                                <Calendar size={24} color={colors.textSecondary} weight="fill" style={styles.infoIcon} />
                                <View style={styles.infoContent}>
                                    <Text style={styles.infoLabel}>{t('subscription.startDate')}</Text>
                                    <Text style={styles.infoValue}>{formatDate(subscriptionInfo.activatedAt)}</Text>
                                </View>
                            </View>

                            {/* Expiry/Renewal Date */}
                            {!subscriptionInfo.isLifetime && (
                                <View style={styles.infoRow}>
                                    <ArrowsClockwise size={24} color={colors.textSecondary} weight="fill" style={styles.infoIcon} />
                                    <View style={styles.infoContent}>
                                        <Text style={styles.infoLabel}>
                                            {subscriptionInfo.willRenew ? t('subscription.renewalDate') : t('subscription.expiryDate')}
                                        </Text>
                                        <Text style={styles.infoValue}>{formatDate(subscriptionInfo.expiresAt)}</Text>
                                    </View>
                                </View>
                            )}

                            {/* Auto Renewal Status */}
                            <View style={[styles.infoRow, styles.infoRowLast]}>
                                <ArrowsClockwise size={24} color={colors.textSecondary} weight="fill" style={styles.infoIcon} />
                                <View style={styles.infoContent}>
                                    <Text style={styles.infoLabel}>{t('subscription.autoRenewal')}</Text>
                                    <Text style={styles.infoValue}>
                                        {subscriptionInfo.isLifetime
                                            ? t('subscription.notApplicable')
                                            : subscriptionInfo.willRenew
                                                ? t('subscription.active')
                                                : t('subscription.inactive')}
                                    </Text>
                                </View>
                                {!subscriptionInfo.isLifetime && (
                                    <View style={[styles.statusBadge, subscriptionInfo.willRenew ? styles.statusActive : styles.statusInactive]}>
                                        <Text style={[styles.statusText, subscriptionInfo.willRenew ? styles.statusTextActive : styles.statusTextInactive]}>
                                            {subscriptionInfo.willRenew ? t('subscription.on') : t('subscription.off')}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>

                        {/* Manage Subscription Button */}
                        <View style={styles.manageButton} onTouchEnd={handleManageSubscription}>
                            <ShoppingBag size={20} color={colors.textPrimary} weight="fill" />
                            <Text style={styles.manageButtonText}>{t('subscription.manage')}</Text>
                        </View>

                        {/* Info Note */}
                        <View style={styles.infoNote}>
                            <Info size={20} color={colors.textSecondary} />
                            <Text style={styles.infoNoteText}>{t('subscription.manageNote')}</Text>
                        </View>
                    </>
                ) : (
                    /* No Subscription */
                    <View style={styles.noSubscription}>
                        <Crown size={48} color={colors.textSecondary} />
                        <Text style={styles.noSubscriptionText}>{t('subscription.noSubscription')}</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

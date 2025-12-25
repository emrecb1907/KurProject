import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, DeviceEventEmitter, TouchableOpacity, Platform, Alert, ActivityIndicator, Modal, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Sparkle, BookOpen, ArrowsClockwise, ChartBar, ProhibitInset, Check } from 'phosphor-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useStatusBar } from '@/hooks/useStatusBar';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import { HeaderButton } from '@/components/ui/HeaderButton';
import { useAuth } from '@/store';
import { usePremium } from '@/contexts/AdaptyProvider';
import PremiumCenterScreen from './premiumCenter';

export default function PremiumScreen() {
    const { activeTheme } = useTheme();
    const router = useRouter();
    const { t } = useTranslation();
    const { statusBarStyle } = useStatusBar();
    const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [isPurchasing, setIsPurchasing] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);
    const { isAnonymous, isAuthenticated } = useAuth();

    // Adapty Premium Hook
    const { isPremium, isLoading: isPremiumLoading, products, purchase, restore } = usePremium();

    // Dinamik ürün bilgileri - TÜM HOOKLAR CONDITIONAL RETURN'DEN ÖNCE OLMALI
    const { monthlyProduct, yearlyProduct, savingsPercent, trialInfo } = useMemo(() => {
        // Ürünleri ID'ye göre bul
        const monthly = products.find(p => p.vendorProductId === 'monthlyy_4_99');
        const yearly = products.find(p => p.vendorProductId === 'yearly_49_99');

        // Tasarruf yüzdesini hesapla
        let savings = 0;
        if (monthly?.price?.amount && yearly?.price?.amount) {
            const monthlyAnnual = monthly.price.amount * 12;
            savings = Math.round((1 - yearly.price.amount / monthlyAnnual) * 100);
        }

        // Trial bilgisini al - any type cast ile güvenli erişim
        const monthlyAny = monthly as any;
        const yearlyAny = yearly as any;
        const introOffer = monthlyAny?.subscription?.offer || yearlyAny?.subscription?.offer;
        const trialDays = introOffer?.phases?.[0]?.subscriptionPeriod?.numberOfUnits || 0;

        return {
            monthlyProduct: monthly,
            yearlyProduct: yearly,
            savingsPercent: savings,
            trialInfo: trialDays > 0 ? { days: trialDays } : null
        };
    }, [products]);

    // Reset scroll position when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            scrollViewRef.current?.scrollTo({ y: 0, animated: false });
        }, [])
    );

    // Scroll to top listener
    useEffect(() => {
        const subscription = DeviceEventEmitter.addListener('scrollToTopPremium', () => {
            scrollViewRef.current?.scrollTo({ y: 0, animated: true });
        });
        return () => subscription.remove();
    }, []);

    // Dynamic colors based on theme
    const premiumColors = useMemo(() => {
        const isDark = activeTheme === 'dark';
        return {
            background: isDark ? '#050B14' : '#F5F5F0', // Dark Blue/Black vs Light Beige
            cardBg: isDark ? '#121212' : '#FFFFFF', // Dark vs White
            gold: '#FF9600', // Always Gold (now Orange per user request)
            text: isDark ? '#FFFFFF' : '#1F2937', // White vs Dark Gray
            textSecondary: isDark ? '#A0A0A0' : '#6B7280', // Gray vs Medium Gray
            iconBg: isDark ? '#2A2A2A' : '#E5E7EB', // Dark Gray vs Light Gray
            planCardBg: isDark ? '#111827' : '#FFFFFF',
            planCardBorder: isDark ? 'transparent' : '#E5E7EB',
            selectedPlanBg: isDark ? '#1F2937' : '#FFF9F0', // Darker Gray vs Light Gold Tint
            featureIconBg: isDark ? '#3A2510' : '#FFF9C4', // Dark Brown vs Light Yellow
            closeIcon: isDark ? '#FFFFFF' : '#1F2937',
        };
    }, [activeTheme]);

    // Premium kullanıcıysa doğrudan Premium Center göster
    // NOT: Bu return TÜM HOOKLARDAN SONRA olmalı (Rules of Hooks)
    if (isPremium && !isPremiumLoading) {
        return <PremiumCenterScreen />;
    }

    const features = [
        {
            icon: <Sparkle size={24} weight="fill" color={premiumColors.gold} />,
            title: t('premiumpaywall.features.aiAssistant.title'),
            subtitle: t('premiumpaywall.features.aiAssistant.subtitle'),
            iconBg: premiumColors.featureIconBg
        },
        {
            icon: <BookOpen size={24} weight="fill" color={premiumColors.gold} />,
            title: t('premiumpaywall.features.allLessons.title'),
            subtitle: t('premiumpaywall.features.allLessons.subtitle'),
            iconBg: premiumColors.featureIconBg
        },
        {
            icon: <ArrowsClockwise size={24} weight="fill" color={premiumColors.gold} />,
            title: t('premiumpaywall.features.unlimitedPractice.title'),
            subtitle: t('premiumpaywall.features.unlimitedPractice.subtitle'),
            iconBg: premiumColors.featureIconBg
        },
        {
            icon: <ProhibitInset size={24} weight="fill" color={premiumColors.gold} />,
            title: t('premiumpaywall.features.noAds.title'),
            subtitle: t('premiumpaywall.features.noAds.subtitle'),
            iconBg: premiumColors.featureIconBg
        },
        {
            icon: <ChartBar size={24} weight="fill" color={premiumColors.gold} />,
            title: t('premiumpaywall.features.progressReport.title'),
            subtitle: t('premiumpaywall.features.progressReport.subtitle'),
            iconBg: premiumColors.featureIconBg
        }
    ];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: premiumColors.background }]} edges={['top', 'left', 'right']}>
            <StatusBar style={statusBarStyle} />

            {/* Header */}
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: premiumColors.text }]}>{t('premiumpaywall.headerTitle')}</Text>
            </View>

            <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollContent}>

                {/* Hero Title */}
                <View style={styles.heroSection}>
                    <Text style={[styles.heroTitle, { color: premiumColors.text }]}>{t('premiumpaywall.heroTitle1')}</Text>
                    <Text style={[styles.heroTitle, { color: premiumColors.text }]}>{t('premiumpaywall.heroTitle2')}</Text>
                </View>

                {/* Features List */}
                <View style={styles.featuresContainer}>
                    {features.map((feature, index) => (
                        <View key={index} style={styles.featureRow}>
                            <View style={[styles.iconContainer, { backgroundColor: feature.iconBg || premiumColors.iconBg }]}>
                                {feature.icon}
                            </View>
                            <View style={styles.featureTextContainer}>
                                <Text style={[styles.featureTitle, { color: premiumColors.text }]}>{feature.title}</Text>
                                <Text style={[styles.featureSubtitle, { color: premiumColors.textSecondary }]}>{feature.subtitle}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Subscription Options */}
                <View style={styles.plansContainer}>

                    {/* Trial Info Banner */}
                    {trialInfo && (
                        <View style={[styles.trialBanner, { backgroundColor: premiumColors.gold + '20' }]}>
                            <Text style={[styles.trialBannerText, { color: premiumColors.gold }]}>
                                🎁 {trialInfo.days} {t('premiumpaywall.trial.days')} {t('premiumpaywall.trial.free')}
                            </Text>
                        </View>
                    )}

                    {/* Monthly Plan */}
                    <TouchableOpacity
                        style={[
                            styles.planCard,
                            { backgroundColor: premiumColors.planCardBg, borderColor: premiumColors.planCardBorder },
                            selectedPlan === 'monthly' && { borderColor: premiumColors.gold, backgroundColor: premiumColors.selectedPlanBg }
                        ]}
                        onPress={() => setSelectedPlan('monthly')}
                        disabled={!monthlyProduct}
                    >
                        <View style={[styles.radioButton, selectedPlan === 'monthly' && styles.radioButtonChecked]}>
                            {selectedPlan === 'monthly' && <View style={styles.radioButtonInner} />}
                        </View>
                        <View style={styles.planInfo}>
                            <Text style={[styles.planName, { color: premiumColors.text }]}>{t('premiumpaywall.plans.monthly.title')}</Text>
                            <Text style={[styles.planPrice, { color: premiumColors.textSecondary }]}>
                                {monthlyProduct?.price?.localizedString || t('premiumpaywall.plans.monthly.price')} {t('premiumpaywall.plans.monthly.period')}
                            </Text>
                        </View>
                    </TouchableOpacity>

                    {/* Yearly Plan */}
                    <TouchableOpacity
                        style={[
                            styles.planCard,
                            styles.yearlyCardBase,
                            { backgroundColor: premiumColors.planCardBg, borderColor: premiumColors.planCardBorder },
                            selectedPlan === 'yearly' && { borderColor: premiumColors.gold, backgroundColor: activeTheme === 'dark' ? '#2D2410' : '#FFF9C4' }
                        ]}
                        onPress={() => setSelectedPlan('yearly')}
                        disabled={!yearlyProduct}
                    >
                        <View style={styles.saveBadge}>
                            <Text style={styles.saveBadgeText}>
                                {savingsPercent > 0 ? `%${savingsPercent} ${t('premiumpaywall.plans.yearly.save')}` : t('premiumpaywall.plans.yearly.save')}
                            </Text>
                        </View>

                        <View style={styles.planContentRow}>
                            <View style={[styles.radioButton, selectedPlan === 'yearly' && styles.radioButtonChecked]}>
                                {selectedPlan === 'yearly' && <Check size={14} color="#000" weight="bold" />}
                            </View>
                            <View style={styles.planInfo}>
                                <Text style={[styles.planName, { color: premiumColors.text }]}>{t('premiumpaywall.plans.yearly.title')}</Text>
                                <Text style={[styles.planPrice, { color: premiumColors.textSecondary }]}>
                                    {yearlyProduct?.price?.localizedString || t('premiumpaywall.plans.yearly.price')} {t('premiumpaywall.plans.yearly.period')}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                </View>

                {/* Subscribe Button */}
                <TouchableOpacity
                    style={[styles.subscribeButton, isPurchasing && styles.subscribeButtonDisabled]}
                    disabled={isPurchasing}
                    onPress={async () => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

                        // Kullanıcı giriş yapmamışsa auth modal göster
                        if (!isAuthenticated || isAnonymous) {
                            setShowAuthModal(true);
                            return;
                        }

                        // Zaten premium ise Premium Center'a yönlendir
                        if (isPremium) {
                            router.push('/premiumCenter');
                            return;
                        }

                        // Seçili plana göre ürün al
                        const selectedProduct = selectedPlan === 'yearly' ? yearlyProduct : monthlyProduct;

                        if (!selectedProduct) {
                            Alert.alert(
                                t('common.error'),
                                t('premiumpaywall.errors.noProducts')
                            );
                            return;
                        }

                        // Satın alma işlemini başlat
                        setIsPurchasing(true);
                        try {
                            const result = await purchase(selectedProduct);

                            if (result === 'success') {
                                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                                Alert.alert(
                                    t('premiumpaywall.success.title'),
                                    t('premiumpaywall.success.message'),
                                    [{
                                        text: t('common.ok'),
                                        onPress: () => router.push('/premiumCenter')
                                    }]
                                );
                            } else if (result === 'conflict') {
                                // Satın alma başarılı ama premium aktif değil
                                // Bu durum aboneliğin başka hesaba bağlı olduğunda oluşur
                                Alert.alert(
                                    t('premiumpaywall.errors.subscriptionConflictTitle'),
                                    t('premiumpaywall.errors.subscriptionConflictMessage'),
                                    [{ text: t('common.ok') }]
                                );
                            }
                            // 'cancelled' ve 'pending' için uyarı göstermiyoruz
                        } catch (error) {
                            console.error('Purchase error:', error);
                            Alert.alert(
                                t('common.error'),
                                t('premiumpaywall.errors.purchaseFailed')
                            );
                        } finally {
                            setIsPurchasing(false);
                        }
                    }}
                >
                    {isPurchasing ? (
                        <ActivityIndicator color={activeTheme === 'light' ? '#FFFFFF' : '#000000'} />
                    ) : (
                        <Text style={[styles.subscribeButtonText, { color: activeTheme === 'light' ? '#FFFFFF' : '#000000' }]}>
                            {isPremium ? t('premiumCenter.title') : t('premiumpaywall.cta')}
                        </Text>
                    )}
                </TouchableOpacity>

                {/* Footer Links */}
                <View style={styles.footerLinks}>
                    <TouchableOpacity>
                        <Text style={[styles.footerLinkText, { color: premiumColors.textSecondary }]}>{t('premiumpaywall.privacy')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text style={[styles.footerLinkText, { color: premiumColors.textSecondary }]}>{t('premiumpaywall.terms')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

                            // Apple-safe onay dialogu göster
                            Alert.alert(
                                t('premiumpaywall.restoreConfirm.title'),
                                t('premiumpaywall.restoreConfirm.message'),
                                [
                                    {
                                        text: t('premiumpaywall.restoreConfirm.cancel'),
                                        style: 'cancel'
                                    },
                                    {
                                        text: t('premiumpaywall.restoreConfirm.continue'),
                                        onPress: async () => {
                                            setIsPurchasing(true);
                                            try {
                                                const success = await restore();
                                                if (success) {
                                                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                                                    Alert.alert(
                                                        t('premiumpaywall.restoreResult.success.title'),
                                                        t('premiumpaywall.restoreResult.success.message'),
                                                        [{
                                                            text: t('common.ok'),
                                                            onPress: () => router.push('/premiumCenter')
                                                        }]
                                                    );
                                                } else {
                                                    Alert.alert(
                                                        t('premiumpaywall.restoreResult.noSubscription.title'),
                                                        t('premiumpaywall.restoreResult.noSubscription.message')
                                                    );
                                                }
                                            } catch (error) {
                                                console.error('Restore error:', error);
                                                Alert.alert(
                                                    t('common.error'),
                                                    t('premiumpaywall.errors.restoreFailed')
                                                );
                                            } finally {
                                                setIsPurchasing(false);
                                            }
                                        }
                                    }
                                ]
                            );
                        }}
                    >
                        <Text style={[styles.footerLinkText, { color: premiumColors.textSecondary }]}>{t('premiumpaywall.restore')}</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>

            {/* Auth Required Modal for Anonymous Users */}
            <Modal
                visible={showAuthModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowAuthModal(false)}
            >
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setShowAuthModal(false)}
                >
                    <Pressable
                        style={[styles.modalContent, { backgroundColor: premiumColors.cardBg }]}
                        onPress={(e) => e.stopPropagation()}
                    >
                        <Text style={[styles.modalTitle, { color: premiumColors.text }]}>
                            {t('premiumpaywall.authModal.title')}
                        </Text>
                        <Text style={[styles.modalDescription, { color: premiumColors.textSecondary }]}>
                            {t('premiumpaywall.authModal.description')}
                        </Text>

                        <TouchableOpacity
                            style={styles.modalPrimaryButton}
                            onPress={() => {
                                setShowAuthModal(false);
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                router.push('/(auth)/register');
                            }}
                        >
                            <Text style={styles.modalPrimaryButtonText}>
                                {t('premiumpaywall.authModal.registerButton')}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.modalSecondaryButton, { borderColor: premiumColors.gold }]}
                            onPress={() => {
                                setShowAuthModal(false);
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                router.push('/(auth)/login');
                            }}
                        >
                            <Text style={[styles.modalSecondaryButtonText, { color: premiumColors.gold }]}>
                                {t('premiumpaywall.authModal.loginButton')}
                            </Text>
                        </TouchableOpacity>
                    </Pressable>
                </Pressable>
            </Modal>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 4,
        paddingBottom: 40,
    },
    header: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 12,
    },
    closeButton: {
        padding: 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    heroSection: {
        marginBottom: 30,
        alignItems: 'center',
    },
    heroTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 34,
    },
    featuresContainer: {
        marginBottom: 30,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    featureTextContainer: {
        flex: 1,
    },
    featureTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    featureSubtitle: {
        fontSize: 14,
    },
    plansContainer: {
        marginBottom: 20,
    },
    planCard: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        height: 72,
    },
    yearlyCardBase: {
        height: 80,
        marginTop: 10,
        position: 'relative',
        overflow: 'visible',
    },
    radioButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#4B5563',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    radioButtonChecked: {
        backgroundColor: '#FF9600',
        borderColor: '#FF9600',
    },
    radioButtonInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#FF9600',
    },
    planInfo: {
        flex: 1,
    },
    planName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    planPrice: {
        fontSize: 14,
    },
    saveBadge: {
        position: 'absolute',
        top: -12,
        right: 16,
        backgroundColor: '#FF9600',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        zIndex: 10,
    },
    saveBadgeText: {
        color: '#000000',
        fontSize: 12,
        fontWeight: 'bold',
    },
    planContentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    subscribeButton: {
        backgroundColor: '#FF9600',
        borderRadius: 30,
        paddingVertical: 16,
        alignItems: 'center',
        marginBottom: 20,
    },
    subscribeButtonDisabled: {
        opacity: 0.7,
    },
    subscribeButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    footerLinks: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
    },
    footerLinkText: {
        fontSize: 12,
    },
    // Custom icon styles
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noAdsIcon: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#FF9600',
    },
    slashLine: {
        position: 'absolute',
        width: 24,
        height: 2,
        backgroundColor: '#000',
        transform: [{ rotate: '45deg' }],
        zIndex: 1,
    },
    circleIcon: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#FF9600',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        width: '100%',
        maxWidth: 340,
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 12,
    },
    modalDescription: {
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
    },
    modalPrimaryButton: {
        width: '100%',
        backgroundColor: '#FF9600',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 12,
    },
    modalPrimaryButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',
    },
    modalSecondaryButton: {
        width: '100%',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 2,
    },
    modalSecondaryButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    // Trial Banner Styles
    trialBanner: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 16,
        alignItems: 'center',
    },
    trialBannerText: {
        fontSize: 15,
        fontWeight: '600',
    },
});

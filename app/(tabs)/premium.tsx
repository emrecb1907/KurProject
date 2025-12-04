import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/contexts/ThemeContext';
import { colors } from '@constants/colors';
import { ArrowLeft, Check, LockKey, Heart, Star, ChartBar } from 'phosphor-react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useStatusBar } from '@/hooks/useStatusBar';

export default function PremiumScreen() {
    const { activeTheme } = useTheme();
    const router = useRouter();
    const { t } = useTranslation();
    const { statusBarStyle } = useStatusBar();
    const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');

    // Dynamic colors based on theme
    const premiumColors = useMemo(() => {
        const isDark = activeTheme === 'dark';
        return {
            background: isDark ? '#050B14' : '#F5F5F0', // Dark Blue/Black vs Light Beige
            cardBg: isDark ? '#121212' : '#FFFFFF', // Dark vs White
            gold: '#FFC800', // Always Gold
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

    const features = [
        {
            icon: <View style={[styles.iconCircle, { backgroundColor: premiumColors.iconBg }]}><View style={styles.noAdsIcon} /></View>,
            phosphorIcon: (props: any) => <View style={[styles.iconCircle, { backgroundColor: premiumColors.featureIconBg }]}><View style={styles.slashLine} /><View style={styles.circleIcon} /></View>,
            title: t('premiumpaywall.features.noAds.title'),
            subtitle: t('premiumpaywall.features.noAds.subtitle'),
            iconColor: premiumColors.gold
        },
        {
            icon: <LockKey size={24} weight="fill" color={premiumColors.gold} />,
            title: t('premiumpaywall.features.allLessons.title'),
            subtitle: t('premiumpaywall.features.allLessons.subtitle'),
            iconBg: premiumColors.featureIconBg
        },
        {
            icon: <Heart size={24} weight="fill" color={premiumColors.gold} />,
            title: t('premiumpaywall.features.unlimitedHearts.title'),
            subtitle: t('premiumpaywall.features.unlimitedHearts.subtitle'),
            iconBg: premiumColors.featureIconBg
        },
        {
            icon: <Star size={24} weight="fill" color={premiumColors.gold} />,
            title: t('premiumpaywall.features.offlineAccess.title'),
            subtitle: t('premiumpaywall.features.offlineAccess.subtitle'),
            iconBg: premiumColors.featureIconBg
        },
        {
            icon: <ChartBar size={24} weight="fill" color={premiumColors.gold} />,
            title: t('premiumpaywall.features.progressTracking.title'),
            subtitle: t('premiumpaywall.features.progressTracking.subtitle'),
            iconBg: premiumColors.featureIconBg
        }
    ];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: premiumColors.background }]}>
            <StatusBar style={statusBarStyle} />
            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Text style={styles.backButtonText}>{t('common.back')}</Text>
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: premiumColors.text }]}>{t('premiumpaywall.headerTitle')}</Text>
                    <View style={{ width: 80 }} />
                </View>

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
                                {/* Using Phosphor icons directly for consistency where possible */}
                                {index === 0 ? (
                                    <View style={{ position: 'relative', width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}>
                                        <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: premiumColors.gold }} />
                                        <View style={{ position: 'absolute', width: 24, height: 4, backgroundColor: activeTheme === 'dark' ? '#1A1A1A' : '#FFFFFF', transform: [{ rotate: '-45deg' }] }} />
                                    </View>
                                ) : feature.icon}
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

                    {/* Monthly Plan */}
                    <TouchableOpacity
                        style={[
                            styles.planCard,
                            { backgroundColor: premiumColors.planCardBg, borderColor: premiumColors.planCardBorder },
                            selectedPlan === 'monthly' && { borderColor: premiumColors.gold, backgroundColor: premiumColors.selectedPlanBg }
                        ]}
                        onPress={() => setSelectedPlan('monthly')}
                    >
                        <View style={[styles.radioButton, selectedPlan === 'monthly' && styles.radioButtonChecked]}>
                            {selectedPlan === 'monthly' && <View style={styles.radioButtonInner} />}
                        </View>
                        <View style={styles.planInfo}>
                            <Text style={[styles.planName, { color: premiumColors.text }]}>{t('premiumpaywall.plans.monthly.name')}</Text>
                            <Text style={[styles.planPrice, { color: premiumColors.textSecondary }]}>{t('premiumpaywall.plans.monthly.price')}</Text>
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
                    >
                        <View style={styles.saveBadge}>
                            <Text style={styles.saveBadgeText}>{t('premiumpaywall.plans.yearly.saveBadge')}</Text>
                        </View>

                        <View style={styles.planContentRow}>
                            <View style={[styles.radioButton, selectedPlan === 'yearly' && styles.radioButtonChecked]}>
                                {selectedPlan === 'yearly' && <Check size={14} color="#000" weight="bold" />}
                            </View>
                            <View style={styles.planInfo}>
                                <Text style={[styles.planName, { color: premiumColors.text }]}>{t('premiumpaywall.plans.yearly.name')}</Text>
                                <Text style={[styles.planPrice, { color: premiumColors.textSecondary }]}>{t('premiumpaywall.plans.yearly.price')}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                </View>

                {/* Subscribe Button */}
                <TouchableOpacity style={styles.subscribeButton}>
                    <Text style={styles.subscribeButtonText}>{t('premiumpaywall.subscribeButton')}</Text>
                </TouchableOpacity>

                {/* Footer Links */}
                <View style={styles.footerLinks}>
                    <TouchableOpacity>
                        <Text style={[styles.footerLinkText, { color: premiumColors.textSecondary }]}>{t('premiumpaywall.footer.privacy')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text style={[styles.footerLinkText, { color: premiumColors.textSecondary }]}>{t('premiumpaywall.footer.terms')}</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    closeButton: {
        padding: 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    backButton: {
        backgroundColor: '#FFC800',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    backButtonText: {
        color: '#000000',
        fontSize: 14,
        fontWeight: '600',
    },
    backText: {
        fontSize: 16,
        fontWeight: '500',
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '600',
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
        backgroundColor: '#FFC800',
        borderColor: '#FFC800',
    },
    radioButtonInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#FFC800',
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
        backgroundColor: '#FFC800',
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
        backgroundColor: '#FFC800',
        borderRadius: 30,
        paddingVertical: 16,
        alignItems: 'center',
        marginBottom: 20,
    },
    subscribeButtonText: {
        color: '#000000',
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
        backgroundColor: '#FFC800',
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
        backgroundColor: '#FFC800',
    }
});

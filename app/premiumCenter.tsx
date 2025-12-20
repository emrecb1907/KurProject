import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useStatusBar } from '@/hooks/useStatusBar';
import { Sparkle, CaretRight, X, ChartBar, GraduationCap, BatteryFull, Lightning, ArrowLeft, Crown, CheckCircle, ProhibitInset } from 'phosphor-react-native';
import { colors } from '@/constants/colors';
import * as Haptics from 'expo-haptics';
import { HeaderButton } from '@/components/ui';
import { useTranslation } from 'react-i18next';

export default function PremiumCenterScreen() {
    const { activeTheme } = useTheme();
    const router = useRouter();
    const { statusBarStyle } = useStatusBar();
    const { t } = useTranslation();

    const isDark = activeTheme === 'dark';

    const features = [
        {
            id: 'ai-assistant',
            icon: <Sparkle size={28} weight="fill" color={colors.warning} />,
            title: t('premiumCenter.features.aiAssistant.title'),
            subtitle: t('premiumCenter.features.aiAssistant.subtitle'),
            navigable: true,
        },
        {
            id: 'detailed-analysis',
            icon: <ChartBar size={28} weight="fill" color={colors.warning} />,
            title: t('premiumCenter.features.detailedAnalysis.title'),
            subtitle: t('premiumCenter.features.detailedAnalysis.subtitle'),
            navigable: true,
        },
        {
            id: 'all-lessons',
            icon: <GraduationCap size={28} weight="fill" color={colors.warning} />,
            title: t('premiumCenter.features.allLessons.title'),
            subtitle: t('premiumCenter.features.allLessons.subtitle'),
            navigable: false,
        },
        {
            id: 'energy-capacity',
            icon: <BatteryFull size={28} weight="fill" color={colors.warning} />,
            title: t('premiumCenter.features.energyCapacity.title'),
            subtitle: t('premiumCenter.features.energyCapacity.subtitle'),
            navigable: false,
        },
        {
            id: 'energy-regen',
            icon: <Lightning size={28} weight="fill" color={colors.warning} />,
            title: t('premiumCenter.features.energyRegen.title'),
            subtitle: t('premiumCenter.features.energyRegen.subtitle'),
            navigable: false,
        },
        {
            id: 'ad-free',
            icon: <ProhibitInset size={28} weight="fill" color={colors.warning} />,
            title: t('premiumCenter.features.adFree.title'),
            subtitle: t('premiumCenter.features.adFree.subtitle'),
            navigable: false,
        },
    ];

    const handleFeaturePress = (featureId: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        if (featureId === 'ai-assistant') {
            router.push('/aiChat');
        } else if (featureId === 'detailed-analysis') {
            router.push('/analysis');
        } else {
            // TODO: Navigate to other feature-specific pages
            console.log('Feature pressed:', featureId);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            <StatusBar style={statusBarStyle} />

            {/* Header - outside ScrollView like analysis page */}
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 10,
                paddingHorizontal: 16,
            }}>
                <HeaderButton
                    title={t('common.back')}
                    showIcon={true}
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        router.back();
                    }}
                    style={{ paddingHorizontal: 12, paddingVertical: 8 }}
                />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Premium Badge */}
                <View style={styles.badgeContainer}>
                    <View style={[styles.premiumBadge, { backgroundColor: isDark ? '#3A2510' : '#FFF9C4' }]}>
                        <Crown size={16} weight="fill" color={colors.warning} />
                        <Text style={[styles.badgeText, { color: colors.warning }]}>{t('premiumCenter.badge')}</Text>
                    </View>
                </View>

                {/* Title Section */}
                <View style={styles.titleSection}>
                    <Text style={[styles.title, { color: colors.textPrimary }]}>{t('premiumCenter.title')}</Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t('premiumCenter.subtitle')}</Text>
                </View>

                {/* Main Feature Card - AI Assistant */}
                <TouchableOpacity
                    style={[styles.mainFeatureCard, {
                        backgroundColor: colors.surface,
                        borderColor: isDark ? 'transparent' : colors.border,
                    }]}
                    onPress={() => handleFeaturePress('ai-assistant')}
                    activeOpacity={0.7}
                >
                    <View style={[styles.mainFeatureIconContainer, { backgroundColor: isDark ? '#3A2510' : '#FFF9C4' }]}>
                        <Sparkle size={32} weight="fill" color={colors.warning} />
                    </View>
                    <View style={styles.mainFeatureTextContainer}>
                        <Text style={[styles.mainFeatureTitle, { color: colors.textPrimary }]}>
                            {t('premiumCenter.features.aiAssistant.title')}
                        </Text>
                        <Text style={[styles.mainFeatureSubtitle, { color: colors.textSecondary }]}>
                            {t('premiumCenter.features.aiAssistant.subtitle')}
                        </Text>
                    </View>
                    <ArrowLeft
                        size={20}
                        color={colors.textSecondary}
                        weight="bold"
                        style={{ transform: [{ rotate: '180deg' }] }}
                    />
                </TouchableOpacity>

                {/* Main Feature Card - Detailed Analysis */}
                <TouchableOpacity
                    style={[styles.mainFeatureCard, {
                        backgroundColor: colors.surface,
                        borderColor: isDark ? 'transparent' : colors.border,
                    }]}
                    onPress={() => handleFeaturePress('detailed-analysis')}
                    activeOpacity={0.7}
                >
                    <View style={[styles.mainFeatureIconContainer, { backgroundColor: isDark ? '#3A2510' : '#FFF9C4' }]}>
                        <ChartBar size={32} weight="fill" color={colors.warning} />
                    </View>
                    <View style={styles.mainFeatureTextContainer}>
                        <Text style={[styles.mainFeatureTitle, { color: colors.textPrimary }]}>
                            {t('premiumCenter.features.detailedAnalysis.title')}
                        </Text>
                        <Text style={[styles.mainFeatureSubtitle, { color: colors.textSecondary }]}>
                            {t('premiumCenter.features.detailedAnalysis.subtitle')}
                        </Text>
                    </View>
                    <ArrowLeft
                        size={20}
                        color={colors.textSecondary}
                        weight="bold"
                        style={{ transform: [{ rotate: '180deg' }] }}
                    />
                </TouchableOpacity>

                {/* Feature Grid - Skip first 2 (main features) */}
                <View style={styles.featureGrid}>
                    {features.slice(2).map((feature, index) => {
                        const CardComponent = feature.navigable ? TouchableOpacity : View;
                        return (
                            <CardComponent
                                key={feature.id}
                                style={[styles.featureCard, {
                                    backgroundColor: colors.surface,
                                    borderColor: isDark ? 'transparent' : colors.border,
                                }]}
                                {...(feature.navigable && {
                                    onPress: () => handleFeaturePress(feature.id),
                                    activeOpacity: 0.7,
                                })}
                            >
                                <View style={[styles.featureIconContainer, { backgroundColor: isDark ? '#3A2510' : '#FFF9C4' }]}>
                                    {feature.icon}
                                </View>
                                <Text style={[styles.featureTitle, { color: colors.textPrimary }]}>
                                    {feature.title}
                                </Text>
                                <Text style={[styles.featureSubtitle, { color: colors.textSecondary }]}>
                                    {feature.subtitle}
                                </Text>
                                {feature.navigable && (
                                    <View style={styles.navigableIndicator}>
                                        <CaretRight size={18} weight="bold" color={colors.primary} />
                                    </View>
                                )}
                            </CardComponent>
                        );
                    })}
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
        marginBottom: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
    },
    badgeContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    premiumBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    badgeText: {
        fontSize: 14,
        fontWeight: '600',
    },
    titleSection: {
        marginBottom: 30,
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
    },
    mainFeatureCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        marginBottom: 20,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 4,
    },
    mainFeatureIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    mainFeatureTextContainer: {
        flex: 1,
    },
    mainFeatureTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    mainFeatureSubtitle: {
        fontSize: 14,
    },
    featureGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 30,
    },
    featureCard: {
        width: '48%',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 4,
        minHeight: 140,
    },
    featureIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    featureTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    featureSubtitle: {
        fontSize: 13,
    },
    footerBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
    },
    footerBadgeText: {
        fontSize: 14,
        fontWeight: '500',
    },
    navigableIndicator: {
        position: 'absolute',
        top: 12,
        right: 12,
    },
});

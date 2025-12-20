import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors } from '@constants/colors';
import { Trophy, Check, LockKey, Student, Medal } from 'phosphor-react-native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/store';
import { useUserStats } from '@hooks';
import { useBadges } from '@/hooks/useBadges';
import { getXPProgress } from '@/lib/utils/levelCalculations';
import { HeaderButton } from '@/components/ui/HeaderButton';
import { useTheme } from '@/contexts/ThemeContext';

const { width } = Dimensions.get('window');

export default function BadgesScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const { themeVersion } = useTheme(); // Use theme context

    // Dynamic styles
    const styles = useMemo(() => getStyles(), [themeVersion]);

    // Get user data from React Query (correct source of truth)
    const { user } = useAuth();
    const { data: userStats, userData } = useUserStats(user?.id);

    // Get totalXP from React Query, not Zustand!
    const totalXP = userData?.total_xp ?? 0;
    const xpProgress = getXPProgress(totalXP);

    // Custom hook to get fresh badge data
    const { badges } = useBadges(userStats, xpProgress.currentLevel);

    // Tabs state
    const [activeTab, setActiveTab] = useState<'all' | 'earned' | 'level' | 'lesson' | 'test'>('all');

    // Filter badges
    const filteredBadges = useMemo(() => {
        // Base list sorted by type: Level -> Lesson -> Test
        const sorted = [...badges].sort((a, b) => {
            const typeOrder = { 'level_reached': 1, 'lessons_completed': 2, 'tests_completed': 3 };
            const orderA = typeOrder[a.requirement_type as keyof typeof typeOrder] || 99;
            const orderB = typeOrder[b.requirement_type as keyof typeof typeOrder] || 99;
            if (orderA !== orderB) return orderA - orderB;
            // Secondary sort by requirement value
            return a.requirement_value - b.requirement_value;
        });

        if (activeTab === 'earned') {
            return sorted.filter(b => b.user_progress?.is_claimed);
        } else if (activeTab === 'level') {
            return sorted.filter(b => b.requirement_type === 'level_reached');
        } else if (activeTab === 'lesson') {
            return sorted.filter(b => b.requirement_type === 'lessons_completed');
        } else if (activeTab === 'test') {
            return sorted.filter(b => b.requirement_type === 'tests_completed');
        }

        return sorted;
    }, [badges, activeTab]);

    const earnedCount = badges.filter(b => b.user_progress?.is_claimed).length;
    const totalCount = badges.length;

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <HeaderButton title={t('badges.header.back')} showIcon={true} onPress={() => router.back()} />
                <Text style={styles.headerTitle}>{t('badges.header.title')}</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Status Section */}
                <View style={styles.statusSection}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.statusTitle}>{t('badges.status.title')}</Text>
                        <Text style={styles.statusSubtitle}>{t('badges.status.subtitle')}</Text>
                    </View>
                    <View style={styles.counterPill}>
                        <Trophy size={16} color={colors.warning} weight="fill" />
                        <Text style={styles.counterText}>
                            <Text style={styles.earnedText}>{earnedCount}</Text>
                            <Text style={styles.totalText}> / {totalCount}</Text>
                        </Text>
                    </View>
                </View>

                {/* Filter Tabs */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 24 }}
                    style={styles.tabsScrollView}
                >
                    <Pressable
                        style={[styles.tab, activeTab === 'all' && styles.activeTab]}
                        onPress={() => setActiveTab('all')}
                    >
                        <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>{t('badges.filters.all')}</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.tab, activeTab === 'earned' && styles.activeTab, { marginLeft: 6, backgroundColor: activeTab === 'earned' ? colors.warning : styles.tab.backgroundColor }]}
                        onPress={() => setActiveTab('earned')}
                    >
                        <Text style={[styles.tabText, activeTab === 'earned' && styles.activeTabText]}>{t('badges.filters.earned')}</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.tab, activeTab === 'level' && styles.activeTab, { marginLeft: 6, backgroundColor: activeTab === 'level' ? colors.warning : styles.tab.backgroundColor }]}
                        onPress={() => setActiveTab('level')}
                    >
                        <Text style={[styles.tabText, activeTab === 'level' && styles.activeTabText]}>{t('badges.filters.level')}</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.tab, activeTab === 'lesson' && styles.activeTab, { marginLeft: 6, backgroundColor: activeTab === 'lesson' ? colors.warning : styles.tab.backgroundColor }]}
                        onPress={() => setActiveTab('lesson')}
                    >
                        <Text style={[styles.tabText, activeTab === 'lesson' && styles.activeTabText]}>{t('badges.filters.lesson')}</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.tab, activeTab === 'test' && styles.activeTab, { marginLeft: 6, backgroundColor: activeTab === 'test' ? colors.warning : styles.tab.backgroundColor }]}
                        onPress={() => setActiveTab('test')}
                    >
                        <Text style={[styles.tabText, activeTab === 'test' && styles.activeTabText]}>{t('badges.filters.test')}</Text>
                    </Pressable>
                </ScrollView>

                {/* Badge List */}
                <View style={styles.listContainer}>
                    {filteredBadges.map((badge) => {
                        const isClaimed = badge.user_progress?.is_claimed ?? false;
                        const progress = badge.user_progress?.progress_percentage ?? 0;
                        const currentVal = badge.user_progress?.current_value ?? 0;
                        const requirementVal = badge.requirement_value;

                        // Format status text (e.g., "5/7 Gün", "2/10 Ders", "0%")
                        let statusText = `${currentVal}/${requirementVal}`;
                        if (badge.requirement_type === 'lessons_completed') statusText += ` ${t('badges.status_text.lesson')}`;
                        else if (badge.requirement_type === 'tests_completed') statusText += ` ${t('badges.status_text.test')}`;
                        else if (badge.requirement_type === 'streak_days') statusText += ` ${t('badges.status_text.day')}`;
                        else if (badge.requirement_type === 'level_reached') statusText = `%${Math.round(progress)}`; // Level badges often simpler as %

                        // Override for simple milestones or if logic differs
                        if (badge.requirement_type === 'level_reached') {
                            // For level, maybe showing current level vs target level is better? 
                            // Or just percentage. The image shows "0%". Let's stick to percentage for level if < 100.
                            statusText = `${Math.round(progress)}%`;
                        }

                        // Image source
                        const iconSource = badge.icon_url
                            ? badge.icon_url
                            : require('@assets/images/badges/1ders.webp'); // Fallback

                        // Get translated content
                        // Use defaultValue option for type safety
                        const translatedName = t(`badges.items.${badge.id}.name`, { defaultValue: badge.name });
                        const translatedDesc = t(`badges.items.${badge.id}.description`, { defaultValue: badge.description });

                        return (
                            <View key={badge.id} style={styles.card}>
                                {/* Icon Column */}
                                <View style={styles.iconColumn}>
                                    <View style={[styles.iconCircle, !isClaimed && styles.iconCircleLocked]}>
                                        {isClaimed ? (
                                            <Image source={iconSource} style={styles.badgeIcon} resizeMode="contain" />
                                        ) : (
                                            <View style={styles.lockedBadgePlaceholder}>
                                                <LockKey size={28} color={colors.textSecondary} weight="fill" />
                                            </View>
                                        )}
                                    </View>
                                </View>

                                {/* Info Column */}
                                <View style={styles.infoColumn}>
                                    <View style={styles.cardHeader}>
                                        <Text style={styles.cardTitle}>{translatedName}</Text>
                                        {!isClaimed ? (
                                            <Text style={styles.statusText}>{statusText}</Text>
                                        ) : (
                                            <View style={styles.completedBadge}>
                                                <Check size={12} color={colors.success} weight="bold" />
                                                <Text style={styles.completedBadgeText}>{t('badges.labels.completed')}</Text>
                                            </View>
                                        )}
                                    </View>

                                    <Text style={styles.cardDesc}>{translatedDesc}</Text>

                                    {/* Progress Bar (Only if not claimed) */}
                                    {!isClaimed && (
                                        <View style={styles.progressBarContainer}>
                                            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
                                        </View>
                                    )}
                                </View>
                            </View>
                        );
                    })}
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const getStyles = () => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundDarker, // Was #0F1322
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },

    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.textPrimary, // Was #fff
    },
    scrollContent: {
        paddingHorizontal: 20,
    },
    statusSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 8,
        marginBottom: 24,
    },
    statusTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.textPrimary, // Was #fff
        marginBottom: 4,
    },
    statusSubtitle: {
        fontSize: 14,
        color: colors.textSecondary, // Was #8F9BB3
    },
    counterPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface, // Was #1A2138
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.border, // Was #2E3A59
        gap: 8,
    },
    counterText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    earnedText: {
        color: colors.warning,
    },
    totalText: {
        color: colors.textSecondary, // Was #8F9BB3
        fontSize: 14,
    },
    tabsScrollView: {
        marginBottom: 24,
    },
    tab: {
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 20,
        backgroundColor: colors.surface, // Was #1A2138
        borderWidth: 1,
        borderColor: colors.border,
    },
    activeTab: {
        backgroundColor: colors.warning,
        borderColor: colors.warning,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textPrimary, // Was #fff
    },
    activeTabText: {
        color: colors.textOnPrimary, // Was #0F1322
    },
    listContainer: {
        gap: 16,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface, // Was #151B2E
        borderRadius: 24,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.border, // Was #232B43
        minHeight: 100,
    },
    iconColumn: {
        position: 'relative',
        marginRight: 16,
    },
    iconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: colors.background, // Was #1F2942
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border, // Was #2E3A59
    },
    iconCircleLocked: {
        backgroundColor: colors.border, // Gray background for locked
    },
    lockedBadgePlaceholder: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.border,
    },
    badgeIcon: {
        width: 60,
        height: 60,
    },

    infoColumn: {
        flex: 1,
        justifyContent: 'center',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.textPrimary, // Was #fff
        flex: 1,
    },
    statusText: {
        fontSize: 12,
        color: colors.warning,
        fontWeight: '600',
        marginLeft: 8,
    },
    completedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: colors.successGlow,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 20,
        marginLeft: 8,
    },
    completedBadgeText: {
        fontSize: 10,
        color: colors.success,
        fontWeight: 'bold',
    },
    cardDesc: {
        fontSize: 13,
        color: colors.textSecondary, // Was #8F9BB3
        lineHeight: 18,
        marginBottom: 8,
    },
    progressBarContainer: {
        height: 6,
        backgroundColor: colors.border, // Was #2E3A59
        borderRadius: 3,
        width: '100%',
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: colors.warning,
        borderRadius: 3,
    },
});

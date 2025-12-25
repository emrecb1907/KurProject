import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert, DeviceEventEmitter, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '@constants/colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useUser, useAuth } from '@/store';
import { useEnergy, useMissions, useClaimMilestone } from '@/hooks/queries';
import { Heart, Lightbulb, Video, ArrowLeft, Play, Gift, Calendar, Star, CaretDown, CaretUp } from 'phosphor-react-native';

import { useTranslation } from 'react-i18next';

import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { CheckCircle } from 'phosphor-react-native';

export default function ChestScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { themeVersion, activeTheme } = useTheme();
  const { user } = useAuth();


  // Get energy data from React Query
  const { data: energyData, refetch: refetchEnergy } = useEnergy(user?.id);
  const currentLives = energyData?.current_energy ?? 6;
  const maxLives = energyData?.max_energy ?? 6;
  const lastReplenishTime = energyData?.last_replenish_time
    ? new Date(energyData.last_replenish_time).getTime()
    : null;

  // Dynamic styles that update when theme changes
  const styles = useMemo(() => getStyles(activeTheme), [themeVersion, activeTheme]);

  const [now, setNow] = useState(Date.now());
  const [activeTab, setActiveTab] = useState<'energy' | 'lessons' | 'tests'>('energy');

  // ScrollView ref for resetting scroll position
  const scrollViewRef = useRef<ScrollView>(null);

  // Get missions data for Tests tab
  const { data: testMissions, refetch: refetchTestMissions } = useMissions(user?.id, 'test');
  const { data: lessonMissions, refetch: refetchLessonMissions } = useMissions(user?.id, 'lesson');
  const claimMilestone = useClaimMilestone();

  // Claim modal state
  const [claimModalVisible, setClaimModalVisible] = useState(false);
  const [claimResult, setClaimResult] = useState<{ xp: number; title: string | null } | null>(null);

  // Handle claim with modal
  const handleClaim = async (milestoneId: string, isPreviousClaimed: boolean) => {
    if (!user?.id) return;
    if (!isPreviousClaimed) {
      Alert.alert(t('rewards.error', 'Hata'), t('rewards.claimPreviousFirst', 'Önce önceki ödülü alın!'));
      return;
    }

    try {
      const result = await claimMilestone.mutateAsync({ userId: user.id, milestoneId });
      setClaimResult({ xp: result.xp_earned, title: result.title_earned });
      setClaimModalVisible(true);
    } catch (error: any) {
      if (error?.message?.includes('PREVIOUS_NOT_CLAIMED')) {
        Alert.alert(t('rewards.error', 'Hata'), t('rewards.claimPreviousFirst', 'Önce önceki ödülü alın!'));
      }
    }
  };

  // Reset scroll position when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
      refetchEnergy();
      refetchTestMissions();
      refetchLessonMissions();
    }, [refetchEnergy, refetchTestMissions, refetchLessonMissions])
  );

  // Scroll to top listener
  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('scrollToTopChest', () => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    });
    return () => subscription.remove();
  }, []);

  // Update timer every second
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getNextLifeTime = () => {
    if (!lastReplenishTime || currentLives >= maxLives) return '';

    const nextReplenishTime = lastReplenishTime + (4 * 60 * 60 * 1000);
    const diff = nextReplenishTime - now;

    if (diff <= 0) {
      // Timer expired - refetch energy from server
      refetchEnergy();
      return '⏳';
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };




  // Calculate progress percentage for lives
  const livesProgress = (currentLives / maxLives) * 100;


  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ width: 40 }} />
        <Text style={styles.headerTitle}>{t('rewards.title')}</Text>
        <View style={styles.headerBadge}>
          <Star weight="fill" color="#FFD700" size={16} />
          <Text style={styles.headerBadgeText}>
            {(testMissions?.groups?.reduce((acc, g) => acc + (g.milestones?.filter(m => m.is_claimed)?.length || 0), 0) || 0) +
              (lessonMissions?.groups?.reduce((acc, g) => acc + (g.milestones?.filter(m => m.is_claimed)?.length || 0), 0) || 0)}
          </Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <Pressable
          style={[styles.tab, activeTab === 'energy' && styles.activeTab]}
          onPress={() => setActiveTab('energy')}
        >
          <Text style={[styles.tabText, activeTab === 'energy' && styles.activeTabText]}>{t('rewards.tabs.energy')}</Text>
        </Pressable>

        <Pressable
          style={[styles.tab, activeTab === 'lessons' && styles.activeTab]}
          onPress={() => setActiveTab('lessons')}
        >
          <Text style={[styles.tabText, activeTab === 'lessons' && styles.activeTabText]}>{t('rewards.tabs.lessons')}</Text>
        </Pressable>

        <Pressable
          style={[styles.tab, activeTab === 'tests' && styles.activeTab]}
          onPress={() => setActiveTab('tests')}
        >
          <Text style={[styles.tabText, activeTab === 'tests' && styles.activeTabText]}>{t('rewards.tabs.tests')}</Text>
        </Pressable>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.content}
        contentContainerStyle={[styles.scrollContent, (activeTab === 'tests' || activeTab === 'lessons') && { paddingTop: 0 }]}
      >
        {activeTab === 'energy' ? (
          <>
            {/* Lives Status Card */}
            <View style={styles.statusCard}>
              <View style={styles.statusCardHeader}>
                <Text style={styles.statusCardTitle}>{t('rewards.livesStatus')}</Text>
                <View style={styles.statusCardHeartIcon}>
                  <Heart size={24} color={colors.error} weight="fill" />
                </View>
              </View>
              <Text style={styles.statusCardSubtitle}>
                {currentLives >= maxLives ? t('rewards.livesMax') : ''}
              </Text>
              <View style={styles.livesCountRow}>
                <Text style={styles.statusCardLivesCount}>
                  {t('rewards.livesCount', { current: currentLives, max: maxLives })}
                </Text>
                {currentLives < maxLives && (
                  <View style={styles.timerInline}>
                    <Text style={styles.timerLabel}>
                      {t('rewards.nextLife')}
                    </Text>
                    <Text style={styles.timerText}>
                      {getNextLifeTime()}
                    </Text>
                  </View>
                )}
              </View>
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBarBackground}>
                  <View style={[styles.progressBarFill, { width: `${livesProgress}%` }]} />
                </View>
                {currentLives >= maxLives && (
                  <View style={styles.fullBadge}>
                    <Text style={styles.fullBadgeText}>Full</Text>
                  </View>
                )}
              </View>
            </View>



            {/* Bonus Tasks Section */}
            <Text style={styles.sectionTitle}>{t('rewards.bonusTasks')}</Text>

            {/* Invite Friend */}
            <View style={styles.bonusCard}>
              <View style={[styles.bonusCardIcon, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
                <Gift size={24} color="#3B82F6" weight="fill" />
              </View>
              <View style={styles.bonusCardInfo}>
                <Text style={styles.bonusCardTitle}>{t('rewards.inviteFriend.title')}</Text>
                <Text style={styles.bonusCardReward}>{t('rewards.inviteFriend.reward')}</Text>
              </View>
              <PrimaryButton
                title={t('rewards.inviteFriend.button')}
                style={{ paddingVertical: 8, paddingHorizontal: 16, minWidth: 90, height: 36 }}
                textStyle={{ fontSize: 13 }}
              />
            </View>

            {/* 3 Day Consecutive Login */}
            <View style={styles.bonusCard}>
              <View style={[styles.bonusCardIcon, { backgroundColor: 'rgba(168, 85, 247, 0.1)' }]}>
                <Calendar size={24} color="#A855F7" weight="fill" />
              </View>
              <View style={styles.bonusCardInfo}>
                <Text style={styles.bonusCardTitle}>{t('rewards.consecutiveLogin.title')}</Text>
                <Text style={styles.bonusCardReward}>{t('rewards.consecutiveLogin.reward')}</Text>
              </View>
              <Pressable style={styles.bonusButtonClaimed}>
                <Text style={styles.bonusButtonClaimedText}>{t('rewards.consecutiveLogin.claimed')}</Text>
              </Pressable>
            </View>

            {/* Daily Task */}
            <View style={styles.bonusCard}>
              <View style={[styles.bonusCardIcon, { backgroundColor: 'rgba(234, 179, 8, 0.1)' }]}>
                <Star size={24} color="#EAB308" weight="fill" />
              </View>
              <View style={styles.bonusCardInfo}>
                <Text style={styles.bonusCardTitle}>{t('rewards.dailyTask.title')}</Text>
                <Text style={styles.bonusCardReward}>{t('rewards.dailyTask.reward')}</Text>
              </View>
              <PrimaryButton
                title={t('rewards.dailyTask.button')}
                style={{ paddingVertical: 8, paddingHorizontal: 16, minWidth: 90, height: 36 }}
                textStyle={{ fontSize: 13 }}
              />
            </View>



            {/* Bottom Spacing */}
            <View style={{ height: 40 }} />
          </>
        ) : activeTab === 'tests' ? (
          <View style={styles.testsContainer}>
            <View style={styles.descriptionCard}>
              <Text style={styles.testsSubDescription}>
                {t('rewards.testsTab.description', 'Testleri tamamla, yıldızları topla ve ödüllerini kazan.')}
              </Text>
            </View>

            {testMissions?.groups?.slice().sort((a, b) => {
              const aAllClaimed = a.milestones?.every(m => m.is_claimed);
              const bAllClaimed = b.milestones?.every(m => m.is_claimed);
              const aHasClaimable = a.milestones?.some(m => !m.is_claimed && (a.is_repeatable ? a.current_count >= m.target_count : testMissions.total_count >= m.target_count));
              const bHasClaimable = b.milestones?.some(m => !m.is_claimed && (b.is_repeatable ? b.current_count >= m.target_count : testMissions.total_count >= m.target_count));

              // Claimable first, then in-progress, then completed
              if (aHasClaimable && !bHasClaimable) return -1;
              if (!aHasClaimable && bHasClaimable) return 1;
              if (aAllClaimed && !bAllClaimed) return 1;
              if (!aAllClaimed && bAllClaimed) return -1;
              return a.order_number - b.order_number;
            }).map((group, groupIndex) => {
              const allClaimed = group.milestones?.every(m => m.is_claimed);
              const hasClaimable = group.milestones?.some(m => !m.is_claimed && (group.is_repeatable ? group.current_count >= m.target_count : testMissions.total_count >= m.target_count));
              const isLocked = !hasClaimable && !allClaimed && groupIndex > 0;
              const lastMilestone = group.milestones?.[group.milestones.length - 1];
              const maxTarget = lastMilestone?.target_count || 20;
              const progress = group.is_repeatable
                ? (group.current_count / maxTarget) * 100
                : Math.min((testMissions.total_count / maxTarget) * 100, 100);

              return (
                <View
                  key={group.id}
                  style={[
                    styles.testGroupCard,
                    isLocked && { opacity: 0.4 },
                    allClaimed && { opacity: 0.5 },
                    groupIndex > 0 && { marginTop: 24 }
                  ]}
                >
                  <Text style={styles.testGroupTitle}>
                    {t(`rewards.quests.${group.name}`, group.name)}
                  </Text>

                  <View style={styles.milestonesRow}>
                    {group.milestones?.map((milestone, milestoneIndex) => {
                      const isReached = group.is_repeatable
                        ? group.current_count >= milestone.target_count
                        : testMissions.total_count >= milestone.target_count;
                      const canClaim = isReached && !milestone.is_claimed;
                      const isPreviousClaimed = milestoneIndex === 0 || group.milestones[milestoneIndex - 1]?.is_claimed;

                      return (
                        <View key={milestone.id} style={styles.milestoneItem}>
                          <Text style={styles.milestoneText}>
                            {group.is_repeatable ? '+' : ''}{milestone.target_count} {t('rewards.testsTab.test')}
                          </Text>
                          <Pressable
                            onPress={() => canClaim && handleClaim(milestone.id, isPreviousClaimed)}
                            disabled={!canClaim || claimMilestone.isPending}
                            style={({ pressed }) => [{ opacity: pressed && canClaim ? 0.7 : 1 }]}
                          >
                            <View style={canClaim && isPreviousClaimed ? styles.starGlow : undefined}>
                              <Star
                                weight={!isReached && !milestone.is_claimed ? "regular" : "fill"}
                                color={milestone.is_claimed ? '#22C55E' : isReached ? '#FFA500' : colors.textSecondary}
                                size={32}
                                style={{ opacity: isReached || milestone.is_claimed ? 1 : 0.6 }}
                              />
                            </View>
                          </Pressable>
                          <Text style={styles.milestoneReward}>+{milestone.xp_reward} XP</Text>
                        </View>
                      );
                    })}
                  </View>

                  {/* Unlocked Title - centered above progress */}
                  {lastMilestone?.title_reward && (
                    <Text style={[styles.groupTitleReward, { color: allClaimed ? '#22C55E' : colors.textPrimary }]}>
                      {t('rewards.titleToUnlock', 'Açılacak Ünvan')}: {t(`rewards.titles.${lastMilestone.title_reward}`, lastMilestone.title_reward)}
                    </Text>
                  )}

                  {/* Progress Bar */}
                  <View style={styles.totalProgressContainer}>
                    <View style={styles.totalProgressHeader}>
                      <Text style={styles.totalProgressLabel}>{t('rewards.testsTab.totalProgress')}</Text>
                      <Text style={[styles.totalProgressValue, allClaimed && { color: '#22C55E' }]}>
                        {group.is_repeatable ? group.current_count : testMissions.total_count}/{maxTarget}
                      </Text>
                    </View>
                    <View style={styles.totalProgressBarBg}>
                      <View style={[styles.totalProgressBarFill, { width: `${Math.min(progress, 100)}%`, backgroundColor: allClaimed ? '#22C55E' : '#FFA500' }]} />
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        ) : activeTab === 'lessons' ? (
          <View style={styles.testsContainer}>
            <View style={styles.descriptionCard}>
              <Text style={styles.testsSubDescription}>
                {t('rewards.lessonsTab.description', 'Dersleri tamamla, yıldızları topla ve ödüllerini kazan.')}
              </Text>
            </View>
            {lessonMissions?.groups?.slice().sort((a, b) => {
              const aAllClaimed = a.milestones?.every(m => m.is_claimed);
              const bAllClaimed = b.milestones?.every(m => m.is_claimed);
              const aHasClaimable = a.milestones?.some(m => !m.is_claimed && (a.is_repeatable ? a.current_count >= m.target_count : lessonMissions.total_count >= m.target_count));
              const bHasClaimable = b.milestones?.some(m => !m.is_claimed && (b.is_repeatable ? b.current_count >= m.target_count : lessonMissions.total_count >= m.target_count));

              if (aHasClaimable && !bHasClaimable) return -1;
              if (!aHasClaimable && bHasClaimable) return 1;
              if (aAllClaimed && !bAllClaimed) return 1;
              if (!aAllClaimed && bAllClaimed) return -1;
              return a.order_number - b.order_number;
            }).map((group, groupIndex) => {
              const allClaimed = group.milestones?.every(m => m.is_claimed);
              const hasClaimable = group.milestones?.some(m => !m.is_claimed && (group.is_repeatable ? group.current_count >= m.target_count : lessonMissions.total_count >= m.target_count));
              const isLocked = !hasClaimable && !allClaimed && groupIndex > 0;
              const lastMilestone = group.milestones?.[group.milestones.length - 1];
              const maxTarget = lastMilestone?.target_count || 10;
              const progress = group.is_repeatable
                ? (group.current_count / maxTarget) * 100
                : Math.min((lessonMissions.total_count / maxTarget) * 100, 100);

              return (
                <View
                  key={group.id}
                  style={[
                    styles.testGroupCard,
                    isLocked && { opacity: 0.4 },
                    allClaimed && { opacity: 0.5 },
                    groupIndex > 0 && { marginTop: 24 }
                  ]}
                >
                  <Text style={styles.testGroupTitle}>
                    {t(`rewards.quests.${group.name}`, group.name)}
                  </Text>

                  <View style={styles.milestonesRow}>
                    {group.milestones?.map((milestone, milestoneIndex) => {
                      const isReached = group.is_repeatable
                        ? group.current_count >= milestone.target_count
                        : lessonMissions.total_count >= milestone.target_count;
                      const canClaim = isReached && !milestone.is_claimed;
                      const isPreviousClaimed = milestoneIndex === 0 || group.milestones[milestoneIndex - 1]?.is_claimed;

                      return (
                        <View key={milestone.id} style={styles.milestoneItem}>
                          <Text style={styles.milestoneText}>
                            {group.is_repeatable ? '+' : ''}{milestone.target_count} {t('rewards.lessonsTab.lesson', 'Ders')}
                          </Text>
                          <Pressable
                            onPress={() => canClaim && handleClaim(milestone.id, isPreviousClaimed)}
                            disabled={!canClaim || claimMilestone.isPending}
                            style={({ pressed }) => [{ opacity: pressed && canClaim ? 0.7 : 1 }]}
                          >
                            <View style={canClaim && isPreviousClaimed ? styles.starGlow : undefined}>
                              <Star
                                weight={!isReached && !milestone.is_claimed ? "regular" : "fill"}
                                color={milestone.is_claimed ? '#22C55E' : isReached ? '#FFA500' : colors.textSecondary}
                                size={32}
                                style={{ opacity: isReached || milestone.is_claimed ? 1 : 0.6 }}
                              />
                            </View>
                          </Pressable>
                          <Text style={styles.milestoneReward}>+{milestone.xp_reward} XP</Text>
                        </View>
                      );
                    })}
                  </View>

                  {/* Unlocked Title - centered above progress */}
                  {lastMilestone?.title_reward && (
                    <Text style={[styles.groupTitleReward, { color: allClaimed ? '#22C55E' : colors.textPrimary }]}>
                      {t('rewards.titleToUnlock', 'Açılacak Ünvan')}: {t(`rewards.titles.${lastMilestone.title_reward}`, lastMilestone.title_reward)}
                    </Text>
                  )}

                  <View style={styles.totalProgressContainer}>
                    <View style={styles.totalProgressHeader}>
                      <Text style={styles.totalProgressLabel}>{t('rewards.lessonsTab.totalProgress', 'Toplam İlerleme')}</Text>
                      <Text style={[styles.totalProgressValue, allClaimed && { color: '#22C55E' }]}>
                        {group.is_repeatable ? group.current_count : lessonMissions.total_count}/{maxTarget}
                      </Text>
                    </View>
                    <View style={styles.totalProgressBarBg}>
                      <View style={[styles.totalProgressBarFill, { width: `${Math.min(progress, 100)}%`, backgroundColor: allClaimed ? '#22C55E' : '#FFA500' }]} />
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 100 }}>
            <Text style={{ color: colors.textSecondary, fontSize: 16 }}>
              {t('rewards.noContent', 'İçerik bulunamadı')}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Claim Success Modal */}
      <Modal
        visible={claimModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setClaimModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Star weight="fill" color="#FFA500" size={64} />
            <Text style={styles.modalTitle}>{t('rewards.congratulations', 'Tebrikler!')}</Text>
            <Text style={styles.modalXP}>+{claimResult?.xp} XP</Text>
            {claimResult?.title && (
              <Text style={styles.modalTitle}>
                🏆 {t(`rewards.titles.${claimResult.title}`, claimResult.title)}
              </Text>
            )}
            <Pressable
              style={styles.modalButton}
              onPress={() => setClaimModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>{t('common.ok', 'Tamam')}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView >
  );
}

const getStyles = (activeTheme?: string) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDarker,
  },
  header: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12,
    backgroundColor: colors.backgroundDarker,
    position: 'relative', // Ensure relative positioning for absolute badge
  },
  headerBadge: {
    position: 'absolute',
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerBadgeText: {
    color: colors.textPrimary,
    fontWeight: 'bold',
    fontSize: 16,
  },

  // Deleted headerTitleContainer since it's not needed anymore

  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textAlign: 'center',
  },

  // Tabs
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Center tabs
    paddingVertical: 8,
    marginHorizontal: 16,
    marginBottom: 0,
    gap: 8, // Space between pills
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  activeTabText: {
    color: '#FFFFFF', // Use white for active text
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  testsContainer: {
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 20,
    alignItems: 'center',
  },
  descriptionCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 20,
    marginTop: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 24,
    alignItems: 'center',
  },
  testsDescription: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  testsSubDescription: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  testGroupCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
  },
  testGroupTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  milestonesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  milestoneItem: {
    alignItems: 'center',
    flex: 1,
  },
  milestoneText: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: 8,
  },
  milestoneCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#FFA500', // Orange border
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  milestoneReward: {
    color: colors.textPrimary,
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 8,
    marginBottom: 4,
  },
  milestoneTitle: {
    color: colors.textSecondary,
    fontSize: 10,
    textAlign: 'center',
  },
  groupTitleReward: {
    color: '#FFA500',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 0,
  },
  claimButton: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 8,
  },
  claimButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  starGlow: {
    shadowColor: '#FFA500',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 10,
  },
  totalProgressContainer: {
    width: '100%',
    marginTop: 32,
  },
  totalProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalProgressLabel: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  totalProgressValue: {
    color: '#FFA500', // Orange
    fontWeight: 'bold',
    fontSize: 14,
  },
  totalProgressBarBg: {
    height: 8,
    backgroundColor: colors.surfaceLight,
    borderRadius: 4,
    width: '100%',
    overflow: 'hidden',
  },
  totalProgressBarFill: {
    height: '100%',
    backgroundColor: '#FFA500',
    borderRadius: 4,
  },
  scrollContent: {
    padding: 16,
  },
  // Lives Status Card
  statusCard: {
    backgroundColor: colors.surface,
    padding: 16,
    marginBottom: 18,
    borderRadius: 16,
    // iOS 18 style shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: activeTheme === 'light' ? 0.2 : 0.2,
    borderColor: activeTheme === 'light' ? '#FF9600' : 'rgba(255, 255, 255, 0.1)',
  },
  statusCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  statusCardHeartIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusCardSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  livesCountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusCardLivesCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: colors.backgroundLighter,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#22C55E',
    borderRadius: 4,
  },
  fullBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  fullBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#22C55E',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 12,
    marginTop: 8,
  },
  // Ad Cards
  adCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    gap: 12,
    // iOS 18 style shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: activeTheme === 'light' ? 0.2 : 0.2,
    borderColor: activeTheme === 'light' ? '#FF9600' : 'rgba(255, 255, 255, 0.1)',
  },
  adCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF9600',
    justifyContent: 'center',
    alignItems: 'center',
  },
  adCardInfo: {
    flex: 1,
  },
  adCardTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  adCardDescription: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  adButtonUsed: {
    backgroundColor: colors.backgroundLighter,
  },
  adButtonDisabled: {
    opacity: 0.5,
  },
  adButtonUsedText: {
    color: colors.textSecondary,
  },

  // Bonus Cards
  bonusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    gap: 12,
    // iOS 18 style shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: activeTheme === 'light' ? 0.2 : 0.2,
    borderColor: activeTheme === 'light' ? '#FF9600' : 'rgba(255, 255, 255, 0.1)',
  },
  bonusCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bonusCardInfo: {
    flex: 1,
  },
  bonusCardTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  bonusCardReward: {
    fontSize: 12,
    color: colors.textSecondary,
  },

  bonusButtonClaimed: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 90,
    alignItems: 'center',
  },
  bonusButtonClaimedText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // How It Works
  howItWorksCard: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
    marginTop: 8,
    // iOS 18 style shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: activeTheme === 'light' ? 0.2 : 0.2,
    borderColor: activeTheme === 'light' ? '#FF9600' : 'rgba(255, 255, 255, 0.1)',
  },
  howItWorksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  howItWorksHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  howItWorksIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 150, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  howItWorksTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  howItWorksText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
    marginTop: 12,
  },
  // Timer
  timerInline: {
    alignItems: 'flex-end',
  },
  timerLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  timerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    fontFamily: 'monospace',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    minWidth: 280,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
  modalXP: {
    color: colors.primary,
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 8,
  },
  modalButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 16,
    marginTop: 24,
  },
  modalButtonText: {
    color: colors.textOnPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
});

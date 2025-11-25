import React, { useState, useRef, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, FlatList, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { BookOpen, BookBookmark, Lock, CaretRight } from 'phosphor-react-native';

import { colors } from '@/constants/colors';
import { CarouselCard } from '@/components/ui/CarouselCard';
import { lessons } from '@/data/lessons';
import { islamicHistory } from '@/data/islamicHistory';
import { useTheme } from '@/contexts/ThemeContext';

interface DerslerTabProps {
    screenWidth: number;
}

export const DerslerTab: React.FC<DerslerTabProps> = ({ screenWidth }) => {
    const { t } = useTranslation();
    const router = useRouter();
    const { themeVersion } = useTheme();
    const [lessonFilter, setLessonFilter] = useState<'arabic' | 'islamicHistory'>('arabic');
    const [isCarouselTouching, setIsCarouselTouching] = useState(false);

    const derslerPageScrollRef = useRef<FlatList>(null);
    const islamicHistoryScrollViewRef = useRef<ScrollView>(null);

    const styles = useMemo(() => getStyles(), [themeVersion]);

    return (
        <View style={{ width: screenWidth, flex: 1 }}>
            <FlatList
                ref={derslerPageScrollRef}
                data={lessonFilter === 'arabic' ? lessons : []}
                keyExtractor={(item) => item.id.toString()}
                style={styles.content}
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <>
                        {/* Category Filter Cards */}
                        <View style={styles.categoryFilterContainer}>
                            <Pressable
                                style={[
                                    styles.categoryFilterCard,
                                    {
                                        backgroundColor: colors.primary,
                                        borderBottomColor: colors.buttonOrangeBorder,
                                    },
                                    lessonFilter === 'arabic' && styles.categoryFilterCardActive
                                ]}
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    setLessonFilter('arabic');
                                }}
                            >
                                <BookOpen
                                    size={32}
                                    color={colors.textOnPrimary}
                                    weight="fill"
                                    style={styles.categoryFilterIcon}
                                />
                                <Text style={styles.categoryFilterTitle} numberOfLines={2}>Arapça Öğren</Text>
                            </Pressable>

                            <Pressable
                                style={[
                                    styles.categoryFilterCard,
                                    {
                                        backgroundColor: colors.secondary,
                                        borderBottomColor: colors.buttonBlueBorder,
                                    },
                                    lessonFilter === 'islamicHistory' && styles.categoryFilterCardActive
                                ]}
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    setLessonFilter('islamicHistory');
                                }}
                            >
                                <BookBookmark
                                    size={32}
                                    color={colors.textOnPrimary}
                                    weight="fill"
                                    style={styles.categoryFilterIcon}
                                />
                                <Text style={styles.categoryFilterTitle} numberOfLines={2}>İslam Tarihi</Text>
                            </Pressable>
                        </View>

                        {/* Section Title */}
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>
                                {lessonFilter === 'arabic' ? 'Arapça Dersler' : 'İslam Tarihi'}
                            </Text>
                            <Pressable style={styles.viewAllButton} onPress={() => { }}>
                                <Text style={styles.viewAllButtonText}>{t('common.viewAll')}</Text>
                            </Pressable>
                        </View>

                        {/* Islamic History Section - Show based on filter */}
                        {lessonFilter === 'islamicHistory' && (
                            <View style={{ position: 'relative', marginBottom: 24 }}>
                                <ScrollView
                                    ref={islamicHistoryScrollViewRef}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={styles.carouselContent}
                                    style={styles.carousel}
                                onTouchStart={() => setIsCarouselTouching(true)}
                                onTouchEnd={() => setIsCarouselTouching(false)}
                                onScrollBeginDrag={() => setIsCarouselTouching(true)}
                                onScrollEndDrag={() => setIsCarouselTouching(false)}
                            >
                                {islamicHistory.map((test) => (
                                    <CarouselCard
                                        key={test.id}
                                        icon={test.icon}
                                        title={test.title}
                                        description={test.description}
                                        unlocked={test.unlocked}
                                        color={test.color}
                                        borderColor={test.borderColor}
                                        level={test.level}
                                        progress={test.unlocked ? { current: 3, total: 10 } : undefined}
                                        route={test.route}
                                        screenWidth={screenWidth}
                                    />
                                ))}
                            </ScrollView>
                            </View>
                        )}
                    </>
                }
                renderItem={({ item: lesson, index }) => (
                    <View style={{ paddingHorizontal: 16 }}>
                        <Pressable
                            style={[
                                styles.verticalLessonCard,
                                {
                                    backgroundColor: lesson.unlocked ? lesson.color : colors.locked,
                                    borderBottomColor: lesson.unlocked ? lesson.borderColor : colors.lockedBorder,
                                },
                                !lesson.unlocked && styles.verticalLessonCardLocked,
                            ]}
                            onPress={() => {
                                if (lesson.unlocked) {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                    router.push((lesson.route || '/lessons/elif-ba/1') as any);
                                }
                            }}
                            disabled={!lesson.unlocked}
                        >
                            {/* Lesson Number */}
                            <View style={styles.verticalLessonIconContainer}>
                                <Text style={styles.verticalLessonNumber}>{index + 1}</Text>
                            </View>

                            {/* Content */}
                            <View style={styles.verticalLessonContent}>
                                <Text style={styles.verticalLessonTitle}>{lesson.title}</Text>
                                <Text style={styles.verticalLessonDescription}>{lesson.description}</Text>
                            </View>

                            {/* Chevron or Lock */}
                            {lesson.unlocked ? (
                                <CaretRight
                                    size={24}
                                    color={colors.textOnPrimary}
                                    weight="bold"
                                    style={styles.verticalLessonChevron}
                                />
                            ) : (
                                <Lock size={20} color={colors.textOnPrimary} weight="fill" />
                            )}
                        </Pressable>
                    </View>
                )}
                ItemSeparatorComponent={() => (
                    <View style={styles.separatorContainer}>
                        <View style={styles.separatorLine} />
                    </View>
                )}
            />
        </View>
    );
};

const getStyles = () => StyleSheet.create({
    content: {
        flex: 1,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 16,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    viewAllButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        backgroundColor: colors.surface,
    },
    viewAllButtonText: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.primary,
    },
    categoryFilterContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingTop: 16,
        gap: 12,
    },
    categoryFilterCard: {
        flex: 1,
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 4,
        height: 100,
        opacity: 0.7,
    },
    categoryFilterCardActive: {
        opacity: 1,
        transform: [{ scale: 1.02 }],
    },
    categoryFilterIcon: {
        marginBottom: 8,
    },
    categoryFilterTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.textOnPrimary,
        textAlign: 'center',
    },
    carousel: {
        flexGrow: 0,
    },
    carouselContent: {
        paddingHorizontal: 16,
        paddingVertical: 24,
        gap: 8, // Kartlar arası mesafe - yarı yarıya indirilmiş
    },
    verticalLessonCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary,
        padding: 16,
        borderRadius: 16,
        borderBottomWidth: 4,
        borderBottomColor: colors.buttonOrangeBorder,
        gap: 16,
    },
    verticalLessonCardLocked: {
        opacity: 0.6,
        backgroundColor: colors.locked,
        borderBottomColor: colors.lockedBorder,
    },
    verticalLessonIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    verticalLessonNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.textOnPrimary,
    },
    verticalLessonContent: {
        flex: 1,
        gap: 4,
    },
    verticalLessonTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.textOnPrimary,
    },
    verticalLessonDescription: {
        fontSize: 12,
        color: colors.textOnPrimary,
        opacity: 0.9,
    },
    verticalLessonChevron: {
        opacity: 0.8,
    },
    separatorContainer: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        alignItems: 'center',
    },
    separatorLine: {
        width: 1,
        height: 20,
        backgroundColor: colors.border,
    },
});

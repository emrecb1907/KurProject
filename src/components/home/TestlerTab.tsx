import React, { useState, useRef, useMemo, useImperativeHandle, forwardRef } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { colors } from '@/constants/colors';
import { CarouselCard } from '@/components/ui/CarouselCard';
import { getTests } from '@/data/tests';
import { useTheme } from '@/contexts/ThemeContext';

interface TestlerTabProps {
    screenWidth: number;
}

export interface TestlerTabRef {
    scrollToTop: () => void;
}

export const TestlerTab = forwardRef<TestlerTabRef, TestlerTabProps>(({ screenWidth }, ref) => {
    const { t } = useTranslation();
    const { themeVersion } = useTheme();
    const [isCarouselTouching, setIsCarouselTouching] = useState(false);

    const testlerPageScrollRef = useRef<ScrollView>(null);
    const testsScrollViewRef = useRef<ScrollView>(null);

    const tests = getTests(t);

    const styles = useMemo(() => getStyles(), [themeVersion]);

    useImperativeHandle(ref, () => ({
        scrollToTop: () => {
            testlerPageScrollRef.current?.scrollTo({ y: 0, animated: false });
        },
    }));

    return (
        <View style={{ width: screenWidth, flex: 1 }}>
            <ScrollView
                ref={testlerPageScrollRef}
                style={styles.content}
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Section Title */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>{t('home.tests')}</Text>
                    <Pressable style={styles.viewAllButton} onPress={() => { }}>
                        <Text style={styles.viewAllButtonText}>{t('common.viewAll')}</Text>
                    </Pressable>
                </View>

                {/* Test Cards Carousel */}
                <View style={{ position: 'relative' }}>
                    <ScrollView
                        ref={testsScrollViewRef}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.carouselContent}
                        style={styles.carousel}
                        onTouchStart={() => setIsCarouselTouching(true)}
                        onTouchEnd={() => setIsCarouselTouching(false)}
                        onScrollBeginDrag={() => setIsCarouselTouching(true)}
                        onScrollEndDrag={() => setIsCarouselTouching(false)}
                    >
                        {tests.map((test) => (
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
            </ScrollView>
        </View>
    );
});

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
    carousel: {
        flexGrow: 0,
    },
    carouselContent: {
        paddingHorizontal: 16,
        paddingVertical: 24,
        gap: 8, // Kartlar arası mesafe - yarı yarıya indirilmiş
    },
});

import React, { useRef, useMemo, useImperativeHandle, forwardRef } from 'react';
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

    const testlerPageScrollRef = useRef<ScrollView>(null);

    const tests = getTests(t);

    // Calculate card width for 2-column grid
    const gap = 16;
    const padding = 16;
    const availableWidth = screenWidth - (padding * 2) - gap; // Subtract gap for spacing between cards
    const cardWidth = availableWidth / 2;

    const styles = useMemo(() => getStyles(screenWidth, gap, padding), [themeVersion, screenWidth]);

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

                {/* Test Cards Grid - 2 columns */}
                <View style={styles.gridContainer}>
                    {tests.map((test, index) => {
                        // Check if this is the last item in a row (odd index means it's the second item in a row)
                        const isLastInRow = index % 2 === 1;
                        return (
                            <View 
                                key={test.id} 
                                style={[
                                    styles.cardWrapper,
                                    { 
                                        width: cardWidth,
                                        marginRight: isLastInRow ? 0 : gap,
                                    }
                                ]}
                            >
                                <CarouselCard
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
                                    width={cardWidth}
                                />
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
        </View>
    );
});

const getStyles = (screenWidth: number, gap: number, padding: number) => {
    return StyleSheet.create({
        content: {
            flex: 1,
        },
        sectionHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: padding,
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
        gridContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            paddingHorizontal: padding,
            paddingVertical: 8,
            overflow: 'visible',
        },
        cardWrapper: {
            marginBottom: gap,
            overflow: 'visible',
        },
    });
};

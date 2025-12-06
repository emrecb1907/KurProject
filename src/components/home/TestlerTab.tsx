import React, { useRef, useMemo, useImperativeHandle, forwardRef, useState } from 'react';
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
    const [selectedCardId, setSelectedCardId] = useState<number | null>(null);

    const testlerPageScrollRef = useRef<ScrollView>(null);
    const gridContainerY = useRef<number>(0);
    const cardLayouts = useRef<{ [key: number]: number }>({});

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

    const handleCardSelect = (index: number) => {
        setSelectedCardId(tests[index].id);
        const cardY = cardLayouts.current[index];
        if (cardY !== undefined) {
            // Scroll to the card position + grid container offset
            // Subtract some padding to give it some breathing room at the top
            const targetY = cardY + gridContainerY.current - 20;
            testlerPageScrollRef.current?.scrollTo({
                y: Math.max(0, targetY),
                animated: true
            });
        }
    };

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
                </View>

                {/* Test Cards Grid - 2 columns */}
                <View
                    style={styles.gridContainer}
                    onLayout={(e) => {
                        gridContainerY.current = e.nativeEvent.layout.y;
                    }}
                >
                    {tests.map((test, index) => {
                        // Check if this is the last item in a row (odd index means it's the second item in a row)
                        const isLastInRow = index % 2 === 1;
                        return (
                            <View
                                key={test.id}
                                onLayout={(e) => {
                                    cardLayouts.current[index] = e.nativeEvent.layout.y;
                                }}
                                style={[
                                    styles.cardWrapper,
                                    {
                                        width: cardWidth,
                                        marginRight: isLastInRow ? 0 : gap,
                                        zIndex: selectedCardId === test.id ? 100 : 1,
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
                                    route={test.route}
                                    onSelect={() => handleCardSelect(index)}
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

import React, { useMemo, useRef, useImperativeHandle, forwardRef } from 'react';
import { View, Text, ScrollView, TextInput, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import {
    BookOpen,
    HandPalm,
    BookBookmark,
    Bank,
    Star,
    MagnifyingGlass,
    IconProps
} from 'phosphor-react-native';

import { colors } from '@/constants/colors';
import { useTheme } from '@/contexts/ThemeContext';
import { CarouselCard } from '@/components/ui/CarouselCard';
import { useUser } from '@/store';
import { islamicHistory } from '@/data/islamicHistory';

interface DerslerTabProps {
    screenWidth: number;
}

export interface DerslerTabRef {
    scrollToTop: () => void;
}

interface CategoryItem {
    id: string;
    title: string;
    subtitle: string;
    count?: number;
    totalCount?: number;
    progress?: number;
    icon: React.ComponentType<IconProps>;
    color: string;
    borderColor: string;
    route?: string;
    unlocked: boolean;
    level?: number;
}

export const DerslerTab = forwardRef<DerslerTabRef, DerslerTabProps>(({ screenWidth }, ref) => {
    const { t } = useTranslation();
    const router = useRouter();
    const { themeVersion } = useTheme();
    const scrollViewRef = useRef<ScrollView>(null);

    // Calculate card width for 2-column grid
    const gap = 16;
    const padding = 16;
    const availableWidth = screenWidth - (padding * 2) - gap;
    const cardWidth = availableWidth / 2;

    const styles = useMemo(() => getStyles(gap, padding), [themeVersion]);

    useImperativeHandle(ref, () => ({
        scrollToTop: () => {
            scrollViewRef.current?.scrollTo({ y: 0, animated: false });
        },
    }));

    const { completedLessons } = useUser();

    // Calculate Kur'an Öğrenimi progress
    // IDs: 101-118 (Elif-Ba and initial lessons)
    const kuranIds = ['101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112', '113', '114', '115', '116', '117', '118', '119', '120', '121', '122', '123', '124'];
    const kuranTotal = kuranIds.length;
    const kuranCompleted = completedLessons.filter((id: string) => kuranIds.includes(id)).length;

    // Calculate İslam Tarihi progress
    // IDs: 401-413 (from islamicHistory data)
    const historyIds = islamicHistory.map((l: { id: number }) => l.id.toString());
    const historyTotal = historyIds.length;
    const historyCompleted = completedLessons.filter((id: string) => historyIds.includes(id)).length;

    const categories: CategoryItem[] = [
        {
            id: '1',
            title: "Kur'an Öğrenimi",
            subtitle: "Elif-Ba'dan tecvid temeline",
            count: kuranCompleted,
            totalCount: kuranTotal,
            progress: kuranTotal > 0 ? kuranCompleted / kuranTotal : 0,
            icon: BookOpen,
            color: colors.primary,
            borderColor: colors.buttonOrangeBorder,
            route: '/lessons/elif-ba',
            unlocked: true,
            level: 1
        },
        {
            id: '2',
            title: "Namaz Duaları",
            subtitle: "Sübhaneke, Ettehiyyatü...",
            count: 0,
            totalCount: 10,
            progress: 0,
            icon: HandPalm,
            color: colors.secondary,
            borderColor: colors.buttonBlueBorder,
            unlocked: true,
            level: 1
        },
        {
            id: '3',
            title: "Sureler",
            subtitle: "Kısa surelerden başlayarak",
            count: 0,
            totalCount: 15,
            progress: 0,
            icon: BookBookmark,
            color: colors.success,
            borderColor: colors.buttonGreenBorder,
            unlocked: true,
            level: 1
        },
        {
            id: '4',
            title: "İslam Tarihi",
            subtitle: "Peygamberlik öncesinden günümüze",
            count: historyCompleted,
            totalCount: historyTotal,
            progress: historyTotal > 0 ? historyCompleted / historyTotal : 0,
            icon: Bank,
            color: colors.pink,
            borderColor: colors.buttonPinkBorder,
            route: '/lessons/islamTarihi',
            unlocked: true,
            level: 1
        },
        {
            id: '5',
            title: "İslami Kavramlar",
            subtitle: "Temel kavramlar, terimler",
            count: 0,
            totalCount: 20,
            progress: 0,
            icon: Star,
            color: colors.warning,
            borderColor: colors.buttonOrangeBorder,
            unlocked: true,
            level: 1
        }
    ];

    const handleCardPress = (route?: string) => {
        if (route) {
            router.push(route as any);
        }
    };

    return (
        <View style={{ width: screenWidth, flex: 1 }}>
            <ScrollView
                ref={scrollViewRef}
                style={styles.content}
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchBar}>
                        <MagnifyingGlass size={20} color={colors.textSecondary} weight="bold" />
                        <TextInput
                            placeholder="Ders ara..."
                            placeholderTextColor={colors.textSecondary}
                            style={styles.searchInput}
                        />
                    </View>
                </View>

                {/* Section Title */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Tüm Kategoriler</Text>
                </View>

                {/* Categories Grid */}
                <View style={styles.gridContainer}>
                    {categories.map((category, index) => {
                        const isLastInRow = index % 2 === 1;
                        return (
                            <View
                                key={category.id}
                                style={[
                                    styles.cardWrapper,
                                    {
                                        width: cardWidth,
                                        marginRight: isLastInRow ? 0 : gap,
                                    }
                                ]}
                            >
                                <CarouselCard
                                    icon={category.icon}
                                    title={category.title}
                                    description={category.subtitle}
                                    unlocked={category.unlocked}
                                    color={category.color}
                                    borderColor={category.borderColor}
                                    level={category.level}
                                    progress={category.progress !== undefined ? {
                                        current: category.count || 0,
                                        total: category.totalCount || 100,
                                        label: 'Ders'
                                    } : undefined}
                                    route={category.route}
                                    onPress={() => handleCardPress(category.route)}
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

const getStyles = (gap: number, padding: number) => StyleSheet.create({
    content: {
        flex: 1,
    },
    searchContainer: {
        paddingHorizontal: padding,
        paddingTop: 16,
        paddingBottom: 8,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: colors.textPrimary,
        fontWeight: '500',
    },
    sectionHeader: {
        paddingHorizontal: padding,
        paddingTop: 16,
        paddingBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
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

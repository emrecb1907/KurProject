import React, { useMemo, useRef, useImperativeHandle, forwardRef } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, StyleSheet, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
    BookOpen,
    HandPalm,
    BookBookmark,
    Bank,
    Star,
    CaretRight,
    MagnifyingGlass
} from 'phosphor-react-native';

import { colors } from '@/constants/colors';
import { useTheme } from '@/contexts/ThemeContext';

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
    count?: string;
    progress?: number;
    icon: React.ElementType;
    color: string;
    route?: string;
}

export const DerslerTab = forwardRef<DerslerTabRef, DerslerTabProps>(({ screenWidth }, ref) => {
    const { t } = useTranslation();
    const router = useRouter();
    const { themeVersion } = useTheme();
    const scrollViewRef = useRef<ScrollView>(null);

    const styles = useMemo(() => getStyles(), [themeVersion]);

    useImperativeHandle(ref, () => ({
        scrollToTop: () => {
            scrollViewRef.current?.scrollTo({ y: 0, animated: false });
        },
    }));

    const categories: CategoryItem[] = [
        {
            id: '1',
            title: "Kur'an Öğrenimi",
            subtitle: "Elif-Ba'dan tecvid temeline",
            count: "(28 Ders)",
            progress: 0.65,
            icon: BookOpen,
            color: '#A07528', // Gold/Brownish
            route: '/lessons/elif-ba'
        },
        {
            id: '2',
            title: "Namaz Duaları",
            subtitle: "Sübhaneke, Ettehiyyatü, Rabbena...",
            icon: HandPalm,
            color: '#A07528',
        },
        {
            id: '3',
            title: "Sureler",
            subtitle: "Kısa surelerden başlayarak",
            icon: BookBookmark,
            color: '#A07528',
        },
        {
            id: '4',
            title: "İslam Tarihi",
            subtitle: "Peygamberlik öncesinden günümüze",
            icon: Bank,
            color: '#A07528',
        },
        {
            id: '5',
            title: "İslami Kavramlar",
            subtitle: "Temel kavramlar, terimler",
            icon: Star,
            color: '#A07528',
        }
    ];

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

                {/* Categories List */}
                <View style={styles.categoriesList}>
                    {categories.map((category, index) => (
                        <Pressable
                            key={category.id}
                            style={styles.categoryCard}
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                // Navigation will be implemented later as requested
                                if (category.route) {
                                    // router.push(category.route);
                                }
                            }}
                        >
                            <View style={styles.cardContent}>
                                {/* Icon */}
                                <View style={[styles.iconContainer, { backgroundColor: 'rgba(160, 117, 40, 0.2)' }]}>
                                    <category.icon
                                        size={24}
                                        color="#FFC800" // Bright yellow/gold for icon
                                        weight="fill"
                                    />
                                </View>

                                {/* Text Info */}
                                <View style={styles.textContainer}>
                                    <View style={styles.titleRow}>
                                        <Text style={styles.cardTitle}>{category.title}</Text>
                                        {category.count && (
                                            <Text style={styles.cardCount}>{category.count}</Text>
                                        )}
                                    </View>
                                    <Text style={styles.cardSubtitle} numberOfLines={1}>
                                        {category.subtitle}
                                    </Text>
                                </View>

                                {/* Arrow */}
                                <CaretRight
                                    size={20}
                                    color={colors.textSecondary}
                                    weight="bold"
                                />
                            </View>

                            {/* Progress Bar (Only if progress exists) */}
                            {category.progress !== undefined && (
                                <View style={styles.progressContainer}>
                                    <View style={styles.progressBarBg}>
                                        <View
                                            style={[
                                                styles.progressBarFill,
                                                { width: `${category.progress * 100}%` }
                                            ]}
                                        />
                                    </View>
                                    <Text style={styles.progressText}>
                                        {Math.round(category.progress * 100)}%
                                    </Text>
                                </View>
                            )}
                        </Pressable>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
});

const getStyles = () => StyleSheet.create({
    content: {
        flex: 1,
    },
    searchContainer: {
        paddingHorizontal: 16,
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
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    categoriesList: {
        paddingHorizontal: 16,
        gap: 12,
    },
    categoryCard: {
        backgroundColor: colors.surface,
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        gap: 4,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    cardCount: {
        fontSize: 14,
        color: colors.textSecondary,
        fontWeight: '500',
    },
    cardSubtitle: {
        fontSize: 13,
        color: colors.textSecondary,
        opacity: 0.8,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
        gap: 12,
    },
    progressBarBg: {
        flex: 1,
        height: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: colors.primary, // Orange
        borderRadius: 3,
    },
    progressText: {
        fontSize: 12,
        color: colors.textSecondary,
        fontWeight: '600',
        width: 32,
        textAlign: 'right',
    },
});


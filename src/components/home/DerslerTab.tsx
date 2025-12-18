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
    Sparkle,
    Sun,
    Scroll,
    Heart,
    Mosque,
    IconProps
} from 'phosphor-react-native';

import { colors } from '@/constants/colors';
import { useTheme } from '@/contexts/ThemeContext';
import { CarouselCard } from '@/components/ui/CarouselCard';
import { useUser } from '@/store';
import {
    KURAN_LESSON_IDS,
    NAMAZ_DUALARI_IDS,
    NAMAZ_BILGISI_IDS,
    ISLAM_TARIHI_IDS,
    ABDEST_VE_TEMIZLIK_IDS,
    SIYER_IDS,
    IMAN_ESASLARI_IDS,
    ORUC_BILGISI_IDS,
    PEYGAMBERLER_TARIHI_IDS,
    AHLAK_ADAP_IDS
} from '@/constants/lessonIds';

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
    const kuranTotal = KURAN_LESSON_IDS.length;
    const kuranCompleted = completedLessons.filter((id: string) => KURAN_LESSON_IDS.includes(id)).length;

    // Calculate Namaz Duaları progress
    const namazTotal = NAMAZ_DUALARI_IDS.length;
    const namazCompleted = completedLessons.filter((id: string) => NAMAZ_DUALARI_IDS.includes(id)).length;

    // Calculate Namaz Bilgisi progress
    const namazBilgisiTotal = NAMAZ_BILGISI_IDS.length;
    const namazBilgisiCompleted = completedLessons.filter((id: string) => NAMAZ_BILGISI_IDS.includes(id)).length;

    // Calculate Abdest ve Temizlik progress
    const abdestTotal = ABDEST_VE_TEMIZLIK_IDS.length;
    const abdestCompleted = completedLessons.filter((id: string) => ABDEST_VE_TEMIZLIK_IDS.includes(id)).length;

    // Calculate İslam Tarihi progress
    const historyTotal = ISLAM_TARIHI_IDS.length;
    const historyCompleted = completedLessons.filter((id: string) => ISLAM_TARIHI_IDS.includes(id)).length;

    // Calculate Siyer progress
    const siyerTotal = SIYER_IDS.length;
    const siyerCompleted = completedLessons.filter((id: string) => SIYER_IDS.includes(id)).length;

    // Calculate İman Esasları progress
    const imanTotal = IMAN_ESASLARI_IDS.length;
    const imanCompleted = completedLessons.filter((id: string) => IMAN_ESASLARI_IDS.includes(id)).length;

    // Calculate Oruç Bilgisi progress
    const orucTotal = ORUC_BILGISI_IDS.length;
    const orucCompleted = completedLessons.filter((id: string) => ORUC_BILGISI_IDS.includes(id)).length;

    // Calculate Peygamberler Tarihi progress
    const peygamberlerTotal = PEYGAMBERLER_TARIHI_IDS.length;
    const peygamberlerCompleted = completedLessons.filter((id: string) => PEYGAMBERLER_TARIHI_IDS.includes(id)).length;

    // Calculate Ahlak & Adap progress
    const ahlakTotal = AHLAK_ADAP_IDS.length;
    const ahlakCompleted = completedLessons.filter((id: string) => AHLAK_ADAP_IDS.includes(id)).length;

    const categories: CategoryItem[] = [
        {
            id: '1',
            title: t('lessons.kuranOgrenimi.groupTitle', { defaultValue: "Kur'an Öğrenimi" }),
            subtitle: t('lessons.kuranOgrenimi.groupDescription', { defaultValue: "Elif-Ba'dan tecvid temeline" }),
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
            title: t('lessons.namazDualari.groupTitle', { defaultValue: "Namaz Duaları" }),
            subtitle: t('lessons.namazDualari.groupDescription', { defaultValue: "Sübhaneke, Ettehiyyatü..." }),
            count: namazCompleted,
            totalCount: namazTotal,
            progress: namazTotal > 0 ? namazCompleted / namazTotal : 0,
            icon: HandPalm,
            color: colors.secondary,
            borderColor: colors.buttonBlueBorder,
            route: '/lessons/namazDualari',
            unlocked: true,
            level: 1
        },
        {
            id: '3',
            title: t('lessons.namazBilgisi.groupTitle', { defaultValue: 'Namaz Bilgisi' }),
            subtitle: t('lessons.namazBilgisi.groupDescription', { defaultValue: 'İbadetin temeli ve huşû' }),
            count: namazBilgisiCompleted,
            totalCount: namazBilgisiTotal,
            progress: namazBilgisiTotal > 0 ? namazBilgisiCompleted / namazBilgisiTotal : 0,
            icon: HandPalm,
            color: colors.success,
            borderColor: colors.buttonGreenBorder,
            route: '/lessons/namaz-bilgisi',
            unlocked: true,
            level: 1,
        },
        {
            id: '4',
            title: t('lessons.islamTarihi.groupTitle', { defaultValue: "İslam Tarihi" }),
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
            title: t('lessons.abdestVeTemizlik.groupTitle', { defaultValue: 'Abdest ve Temizlik' }),
            subtitle: t('lessons.abdestVeTemizlik.groupDescription', { defaultValue: 'Maddi ve manevi arınma' }),
            count: abdestCompleted,
            totalCount: abdestTotal,
            progress: abdestTotal > 0 ? abdestCompleted / abdestTotal : 0,
            icon: HandPalm,
            color: colors.warmyellow,
            borderColor: colors.buttonWarmyellowBorder,
            route: '/lessons/abdest-ve-temizlik',
            unlocked: true,
            level: 1,
        },
        {
            id: '6',
            title: t('lessons.siyer.groupTitle', { defaultValue: "Siyer" }),
            subtitle: t('lessons.siyer.groupDescription', { defaultValue: "Life of the Prophet" }),
            count: siyerCompleted,
            totalCount: siyerTotal,
            progress: siyerTotal > 0 ? siyerCompleted / siyerTotal : 0,
            icon: Mosque,
            color: colors.softpurple,
            borderColor: colors.buttonSoftpurpleBorder,
            route: '/lessons/siyer',
            unlocked: true,
            level: 1
        },
        {
            id: '7',
            title: t('lessons.imanEsaslari.groupTitle', { defaultValue: "İman Esasları" }),
            subtitle: t('lessons.imanEsaslari.groupDescription', { defaultValue: "The six pillars of belief" }),
            count: imanCompleted,
            totalCount: imanTotal,
            progress: imanTotal > 0 ? imanCompleted / imanTotal : 0,
            icon: Sparkle,
            color: colors.lightred,
            borderColor: colors.buttonLightredBorder,
            route: '/lessons/iman-esaslari',
            unlocked: true,
            level: 1
        },
        {
            id: '8',
            title: t('lessons.orucBilgisi.groupTitle', { defaultValue: "Oruç Bilgisi" }),
            subtitle: t('lessons.orucBilgisi.groupDescription', { defaultValue: "Rules and wisdom of fasting" }),
            count: orucCompleted,
            totalCount: orucTotal,
            progress: orucTotal > 0 ? orucCompleted / orucTotal : 0,
            icon: Sun,
            color: colors.caramel,
            borderColor: colors.buttonCaramelBorder,
            route: '/lessons/oruc-bilgisi',
            unlocked: true,
            level: 1
        },
        {
            id: '9',
            title: t('lessons.peygamberlerTarihi.groupTitle', { defaultValue: "Peygamberler Tarihi" }),
            subtitle: t('lessons.peygamberlerTarihi.groupDescription', { defaultValue: "Stories of the prophets" }),
            count: peygamberlerCompleted,
            totalCount: peygamberlerTotal,
            progress: peygamberlerTotal > 0 ? peygamberlerCompleted / peygamberlerTotal : 0,
            icon: Scroll,
            color: colors.gray,
            borderColor: colors.buttonGrayBorder,
            route: '/lessons/peygamberler-tarihi',
            unlocked: true,
            level: 1
        },
        {
            id: '10',
            title: t('lessons.ahlakAdap.groupTitle', { defaultValue: "Ahlak & Adap Bilgisi" }),
            subtitle: t('lessons.ahlakAdap.groupDescription', { defaultValue: "Character and etiquette" }),
            count: ahlakCompleted,
            totalCount: ahlakTotal,
            progress: ahlakTotal > 0 ? ahlakCompleted / ahlakTotal : 0,
            icon: Heart,
            color: colors.deepblue,
            borderColor: colors.buttonDeepblueBorder,
            route: '/lessons/ahlak-adap',
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
                            placeholder={t('lessons.common.searchPlaceholder', { defaultValue: "Ders ara..." })}
                            placeholderTextColor={colors.textSecondary}
                            style={styles.searchInput}
                        />
                    </View>
                </View>

                {/* Section Title */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>{t('lessons.common.allCategories', { defaultValue: "Tüm Kategoriler" })}</Text>
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

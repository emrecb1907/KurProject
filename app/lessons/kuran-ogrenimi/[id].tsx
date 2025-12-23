import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions, Image } from 'react-native';
import { useMemo, useEffect, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@constants/colors';
import { ArrowLeft, PlayCircle, CheckCircle, Info } from 'phosphor-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';
import { playSound, releaseAudioPlayer, useLessonAudio } from '@/utils/audio';
import { useLessonComplete } from '@/hooks/mutations/useLessonComplete';
import { lessons } from '@/data/lessons';
import { getLessonData } from '@/data/kuran';
import { KuranLessonContent } from '@/data/kuran/types';
import { useTranslation } from 'react-i18next';

// Lesson JSON imports for lessonInfo
import elifBaTr from '../../../assets/lessons/kuran-ogrenimi/elif-ba/tr.json';
import elifBaEn from '../../../assets/lessons/kuran-ogrenimi/elif-ba/en.json';
import harekelerTr from '../../../assets/lessons/kuran-ogrenimi/harekeler/tr.json';
import harekelerEn from '../../../assets/lessons/kuran-ogrenimi/harekeler/en.json';
import harflerinKonumuTr from '../../../assets/lessons/kuran-ogrenimi/harflerin-konumu/tr.json';
import harflerinKonumuEn from '../../../assets/lessons/kuran-ogrenimi/harflerin-konumu/en.json';
import ustun1Tr from '../../../assets/lessons/kuran-ogrenimi/ustun-1/tr.json';
import ustun1En from '../../../assets/lessons/kuran-ogrenimi/ustun-1/en.json';
import ustun2Tr from '../../../assets/lessons/kuran-ogrenimi/ustun-2/tr.json';
import ustun2En from '../../../assets/lessons/kuran-ogrenimi/ustun-2/en.json';
import ustun3Tr from '../../../assets/lessons/kuran-ogrenimi/ustun-3/tr.json';
import ustun3En from '../../../assets/lessons/kuran-ogrenimi/ustun-3/en.json';
import esreTr from '../../../assets/lessons/kuran-ogrenimi/esre/tr.json';
import esreEn from '../../../assets/lessons/kuran-ogrenimi/esre/en.json';
import otreTr from '../../../assets/lessons/kuran-ogrenimi/otre/tr.json';
import otreEn from '../../../assets/lessons/kuran-ogrenimi/otre/en.json';
import cezmliOkunusTr from '../../../assets/lessons/kuran-ogrenimi/cezmli-okunus/tr.json';
import cezmliOkunusEn from '../../../assets/lessons/kuran-ogrenimi/cezmli-okunus/en.json';
import cezmTr from '../../../assets/lessons/kuran-ogrenimi/cezm/tr.json';
import cezmEn from '../../../assets/lessons/kuran-ogrenimi/cezm/en.json';
import alistirmalar1Tr from '../../../assets/lessons/kuran-ogrenimi/alistirmalar-1/tr.json';
import alistirmalar1En from '../../../assets/lessons/kuran-ogrenimi/alistirmalar-1/en.json';
import uzatilarakOkunusTr from '../../../assets/lessons/kuran-ogrenimi/uzatilarak-okunus/tr.json';
import uzatilarakOkunusEn from '../../../assets/lessons/kuran-ogrenimi/uzatilarak-okunus/en.json';
import medElifTr from '../../../assets/lessons/kuran-ogrenimi/med-elif/tr.json';
import medElifEn from '../../../assets/lessons/kuran-ogrenimi/med-elif/en.json';
import medYaTr from '../../../assets/lessons/kuran-ogrenimi/med-ya/tr.json';
import medYaEn from '../../../assets/lessons/kuran-ogrenimi/med-ya/en.json';
import medVavTr from '../../../assets/lessons/kuran-ogrenimi/med-vav/tr.json';
import medVavEn from '../../../assets/lessons/kuran-ogrenimi/med-vav/en.json';
import alistirmalar2Tr from '../../../assets/lessons/kuran-ogrenimi/alistirmalar-2/tr.json';
import alistirmalar2En from '../../../assets/lessons/kuran-ogrenimi/alistirmalar-2/en.json';
import seddeTr from '../../../assets/lessons/kuran-ogrenimi/sedde/tr.json';
import seddeEn from '../../../assets/lessons/kuran-ogrenimi/sedde/en.json';
import seddeliOkunusTr from '../../../assets/lessons/kuran-ogrenimi/seddeli-okunus/tr.json';
import seddeliOkunusEn from '../../../assets/lessons/kuran-ogrenimi/seddeli-okunus/en.json';
import alistirmalar3Tr from '../../../assets/lessons/kuran-ogrenimi/alistirmalar-3/tr.json';
import alistirmalar3En from '../../../assets/lessons/kuran-ogrenimi/alistirmalar-3/en.json';
import ikiUstunTr from '../../../assets/lessons/kuran-ogrenimi/iki-ustun/tr.json';
import ikiUstunEn from '../../../assets/lessons/kuran-ogrenimi/iki-ustun/en.json';
import ikiEsreTr from '../../../assets/lessons/kuran-ogrenimi/iki-esre/tr.json';
import ikiEsreEn from '../../../assets/lessons/kuran-ogrenimi/iki-esre/en.json';
import ikiOtreTr from '../../../assets/lessons/kuran-ogrenimi/iki-otre/tr.json';
import ikiOtreEn from '../../../assets/lessons/kuran-ogrenimi/iki-otre/en.json';
import cekerTr from '../../../assets/lessons/kuran-ogrenimi/ceker/tr.json';
import cekerEn from '../../../assets/lessons/kuran-ogrenimi/ceker/en.json';
import vavYaElifTr from '../../../assets/lessons/kuran-ogrenimi/vav-ya-elif/tr.json';
import vavYaElifEn from '../../../assets/lessons/kuran-ogrenimi/vav-ya-elif/en.json';
import zamirTr from '../../../assets/lessons/kuran-ogrenimi/zamir/tr.json';
import zamirEn from '../../../assets/lessons/kuran-ogrenimi/zamir/en.json';
import elTakisiTr from '../../../assets/lessons/kuran-ogrenimi/el-takisi/tr.json';
import elTakisiEn from '../../../assets/lessons/kuran-ogrenimi/el-takisi/en.json';
import okunmayanElifTr from '../../../assets/lessons/kuran-ogrenimi/okunmayan-elif/tr.json';
import okunmayanElifEn from '../../../assets/lessons/kuran-ogrenimi/okunmayan-elif/en.json';
import lafzatullahTr from '../../../assets/lessons/kuran-ogrenimi/lafzatullah/tr.json';
import lafzatullahEn from '../../../assets/lessons/kuran-ogrenimi/lafzatullah/en.json';

import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { HeaderButton } from '@/components/ui/HeaderButton';

// Helper to get lessonInfo based on lesson ID
const getLessonInfoData = (lessonId: number, isEnglish: boolean): string[] | null => {
    const lessonDataMap: Record<number, { tr: { lessonInfo?: string[] }, en: { lessonInfo?: string[] } }> = {
        101: { tr: elifBaTr, en: elifBaEn },
        102: { tr: harekelerTr, en: harekelerEn },
        103: { tr: harflerinKonumuTr, en: harflerinKonumuEn },
        104: { tr: ustun1Tr, en: ustun1En },
        105: { tr: ustun2Tr, en: ustun2En },
        106: { tr: ustun3Tr, en: ustun3En },
        107: { tr: esreTr, en: esreEn },
        108: { tr: otreTr, en: otreEn },
        109: { tr: cezmliOkunusTr, en: cezmliOkunusEn },
        110: { tr: cezmTr, en: cezmEn },
        111: { tr: alistirmalar1Tr, en: alistirmalar1En },
        112: { tr: uzatilarakOkunusTr, en: uzatilarakOkunusEn },
        113: { tr: medElifTr, en: medElifEn },
        114: { tr: medYaTr, en: medYaEn },
        115: { tr: medVavTr, en: medVavEn },
        116: { tr: alistirmalar2Tr, en: alistirmalar2En },
        117: { tr: seddeTr, en: seddeEn },
        118: { tr: seddeliOkunusTr, en: seddeliOkunusEn },
        119: { tr: alistirmalar3Tr, en: alistirmalar3En },
        120: { tr: ikiUstunTr, en: ikiUstunEn },
        121: { tr: ikiEsreTr, en: ikiEsreEn },
        122: { tr: ikiOtreTr, en: ikiOtreEn },
        123: { tr: cekerTr, en: cekerEn },
        124: { tr: vavYaElifTr, en: vavYaElifEn },
        125: { tr: zamirTr, en: zamirEn },
        126: { tr: elTakisiTr, en: elTakisiEn },
        127: { tr: okunmayanElifTr, en: okunmayanElifEn },
        128: { tr: lafzatullahTr, en: lafzatullahEn },
    };

    const lessonData = lessonDataMap[lessonId];
    if (!lessonData) return null;

    const data = isEnglish ? lessonData.en : lessonData.tr;
    return data?.lessonInfo || null;
};

export default function UnifiedKuranLessonScreen() {
    const { id } = useLocalSearchParams();
    const lessonId = parseInt(id as string, 10);
    const router = useRouter();
    const { themeVersion } = useTheme();
    const { mutate: completeLesson } = useLessonComplete();

    // State
    const [playedItems, setPlayedItems] = useState<Set<number>>(new Set());

    const { t, i18n } = useTranslation();

    // Use the new audio hook for lesson sounds
    const { playAudio, stopAudio } = useLessonAudio();

    // Explanation Content (Dynamic for any lesson with lessonInfo)
    const explanationData = useMemo(() => {
        return getLessonInfoData(lessonId, i18n.language.startsWith('en'));
    }, [lessonId, i18n.language]);

    // Derived Data
    const lessonData = useMemo(() => getLessonData(lessonId), [lessonId]);
    const lessonInfo = useMemo(() => lessons.find(l => l.id === lessonId), [lessonId]);
    const allItemsPlayed = lessonData.length > 0 && playedItems.size === lessonData.length;

    // No cleanup needed - useAudioPlayer handles it automatically

    const styles = useMemo(() => StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
            backgroundColor: colors.surface,
        },
        titleContainer: {
            flex: 1,
            marginLeft: 12,
        },
        title: {
            fontSize: 20,
            fontWeight: 'bold',
            color: colors.textPrimary,
        },
        subtitle: {
            fontSize: 14,
            color: colors.textSecondary,
        },
        content: {
            padding: 16,
        },
        grid: {
            flexDirection: 'row-reverse',
            flexWrap: 'wrap',
            gap: 12, // Consistent gap
            justifyContent: 'center',
            paddingBottom: 20,
        },
        // Card styles (Unified)
        card: {
            // Dynamic width logic? Or fixed?
            // Existing image lessons used (w - 32 - 8) / 2
            // Existing text lessons (ElifBa) used (w - 32 - 24) / 3
            // Let's adapt based on content type roughly, OR stick to one size.
            // Image lessons look better with 2 columns. Text usually 3.
            // We can check lessonId or content type.
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 8,
            alignItems: 'center',
            justifyContent: 'center',
            borderBottomWidth: 4,
            borderBottomColor: colors.border,
            borderWidth: 1,
            borderColor: colors.border,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
        },
        cardPressed: {
            transform: [{ translateY: 2 }],
            borderBottomWidth: 2,
        },
        // Text specific styles
        textLarge: {
            fontSize: 32, // Adjusted for Harekeler/ElifBa
            fontFamily: 'Amiri_700Bold',
            color: colors.primary,
            marginBottom: 4,
            textAlign: 'center',
        },
        textLabel: {
            fontSize: 16,
            fontWeight: 'bold',
            color: colors.textPrimary,
            textAlign: 'center',
        },
        textSub: {
            fontSize: 12,
            color: colors.textSecondary,
            marginTop: 2,
            textAlign: 'center',
        },
        // Forms specific (Harekeler)
        formsContainer: {
            flexDirection: 'row-reverse',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            marginBottom: 8,
            paddingHorizontal: 4,
        },
        // Image specific
        imageContainer: {
            width: '100%',
            height: '100%',
            padding: 4,
            alignItems: 'center',
            justifyContent: 'center',
        },
        image: {
            width: '100%',
            height: '100%',
            resizeMode: 'contain',
            tintColor: colors.textPrimary,
        },
        // Icons
        iconContainer: {
            position: 'absolute',
            top: 6,
            right: 6,
            flexDirection: 'row',
            gap: 4,
            zIndex: 10,
        },
        playIcon: {
            opacity: 0.5,
        },
        checkIcon: {
            opacity: 1.0, // Full opacity for CheckCircle
        },
        infoCard: {
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 20,
            marginBottom: 24,
            borderWidth: 1,
            borderColor: colors.border,
            shadowColor: colors.shadow || '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
        },
        infoText: {
            fontSize: 16,
            lineHeight: 26,
            color: colors.textPrimary,
            marginBottom: 12,
        },
        instructionCard: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.surface,
            borderRadius: 12,
            padding: 12,
            marginBottom: 16,
            gap: 10,
            borderWidth: 1,
            borderColor: colors.border,
        },
        instructionText: {
            fontSize: 14,
            color: colors.primary,
            flex: 1,
        }
    }), [themeVersion]);

    const handlePress = (item: KuranLessonContent) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        try {
            if (item.audio) {
                playAudio(item.audio);
            } else {
                console.log(`No audio for item ${item.id}`);
            }

            setPlayedItems(prev => new Set(prev).add(item.id));
        } catch (error) {
            console.error('Error playing audio:', error);
        }
    };

    const handleComplete = () => {
        if (!allItemsPlayed) return;
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        completeLesson(String(lessonId));
        router.back();
    };

    // Calculate Grid Item Size
    const windowWidth = Dimensions.get('window').width;
    // Default to 2 columns for Image content (matches existing lessons like Zamir)
    // Default to 3 columns for Text content (matches existing ElifBa)
    // Harekeler (102) is Text but used 2 columns in previous impl.
    // Let's create a helper.
    const isTextContent = lessonData[0]?.type === 'text';
    // However, Harekeler (102) has long width due to forms.
    const isHarekeler = lessonId === 102;

    // Columns: ElifBa (101) -> 3, Harekeler (102) -> 2, Images (103+) -> 2
    const numColumns = (lessonId === 101) ? 3 : 2;

    // Calculate width
    // Gap = 12
    // Padding = 16 * 2 = 32
    // Total Gap = (numCol - 1) * 12
    const availableWidth = windowWidth - 32 - ((numColumns - 1) * 12);
    const cardWidth = availableWidth / numColumns;
    const cardHeight = isTextContent && !isHarekeler ? cardWidth * 0.85 : 120; // Harekeler and Images similar height?

    const renderCardContent = (item: KuranLessonContent) => {
        if (item.type === 'text') {
            // Special handling for Harekeler (Lesson 102)
            if (item.forms) {
                return (
                    <>
                        <View style={styles.iconContainer}>
                            {playedItems.has(item.id) && <View style={styles.checkIcon}><CheckCircle size={16} color={colors.success} weight="fill" /></View>}
                            <View style={styles.playIcon}><PlayCircle size={16} color={colors.primary} weight="fill" /></View>
                        </View>
                        <View style={styles.formsContainer}>
                            <Text style={styles.textLarge}>{item.forms.ustun}</Text>
                            <Text style={styles.textLarge}>{item.forms.esre}</Text>
                            <Text style={styles.textLarge}>{item.forms.otre}</Text>
                        </View>
                        <Text style={styles.textLabel}>{item.subText}</Text>
                    </>
                );
            }

            // Standard Text (ElifBa)
            return (
                <>
                    <View style={styles.iconContainer}>
                        {playedItems.has(item.id) && <View style={styles.checkIcon}><CheckCircle size={16} color={colors.success} weight="fill" /></View>}
                        <View style={styles.playIcon}><PlayCircle size={16} color={colors.primary} weight="fill" /></View>
                    </View>
                    <Text style={[styles.textLarge, { fontSize: 42 }]}>{item.text}</Text>
                    {item.subText && (
                        <Text style={styles.textLabel}>
                            {item.subText}
                            {item.transliteration && (
                                <Text style={{ fontWeight: 'normal', color: colors.textSecondary }}> - {item.transliteration}</Text>
                            )}
                        </Text>
                    )}
                </>
            );
        } else {
            // Image Content
            return (
                <>
                    <View style={styles.iconContainer}>
                        {playedItems.has(item.id) && <View style={styles.checkIcon}><CheckCircle size={12} color={colors.success} weight="fill" /></View>}
                        <View style={styles.playIcon}><PlayCircle size={12} color={colors.primary} weight="fill" /></View>
                    </View>
                    <View style={styles.imageContainer}>
                        <Image
                            source={item.image}
                            style={styles.image}
                        />
                    </View>
                    {/* Optional Caption if provided, though typically images have text inside */}
                    {(item.text || item.subText) && false && ( // Disabled by default unless required, typically not shown in prev impl
                        <Text style={styles.textSub}>{item.subText}</Text>
                    )}
                </>
            );
        }
    };

    if (!lessonData || lessonData.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={{ textAlign: 'center', marginTop: 20 }}>Ders verisi bulunamadı.</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <HeaderButton
                    title={t('common.back')}
                    onPress={() => router.back()}
                />
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{t(`lessons.kuranOgrenimi.${lessonId}.title`, { defaultValue: lessonInfo?.title || `Ders ${lessonId}` })}</Text>
                    <Text style={styles.subtitle}>{t(`lessons.kuranOgrenimi.${lessonId}.description`, { defaultValue: lessonInfo?.description || 'Kuran Öğrenimi' })}</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {explanationData && (
                    <View style={styles.infoCard}>
                        {explanationData.map((text: string, index: number) => (
                            <Text key={index} style={styles.infoText}>{text}</Text>
                        ))}
                    </View>
                )}
                <View style={styles.instructionCard}>
                    <Info size={20} color={colors.primary} weight="fill" />
                    <Text style={styles.instructionText}>
                        {i18n.language.startsWith('en')
                            ? 'Tap the cards to listen to the sounds.'
                            : 'Kartlara dokunarak sesleri dinleyebilirsin.'}
                    </Text>
                </View>
                <View style={styles.grid}>
                    {lessonData.map((item) => (
                        <Pressable
                            key={item.id}
                            style={({ pressed }) => [
                                styles.card,
                                { width: cardWidth, height: cardHeight },
                                pressed && styles.cardPressed
                            ]}
                            onPress={() => handlePress(item)}
                        >
                            {renderCardContent(item)}
                        </Pressable>
                    ))}
                </View>

                <PrimaryButton
                    title={t('common.completeLesson')}
                    disabled={!allItemsPlayed}
                    onPress={handleComplete}
                    style={{
                        marginHorizontal: 16,
                        marginTop: 24,
                        marginBottom: 16,
                        opacity: !allItemsPlayed ? 0.5 : 1,
                        backgroundColor: !allItemsPlayed ? colors.backgroundLighter : colors.primary
                    }}
                    textStyle={!allItemsPlayed && { color: colors.textSecondary }}
                />
            </ScrollView>
        </SafeAreaView>
    );
}

import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions, Image } from 'react-native';
import { useMemo, useEffect, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@constants/colors';
import { ArrowLeft, PlayCircle, CheckCircle } from 'phosphor-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';
import { playSound, releaseAudioPlayer } from '@/utils/audio';
import { useUser } from '@/store';
import { lessons } from '@/data/lessons';
import { getLessonData } from '@/data/kuran';
import { KuranLessonContent } from '@/data/kuran/types';
import { useTranslation } from 'react-i18next';

import elifBaTr from '../../../assets/lessons/kuran-ogrenimi/elif-ba/tr.json';
import elifBaEn from '../../../assets/lessons/kuran-ogrenimi/elif-ba/en.json';

import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { HeaderButton } from '@/components/ui/HeaderButton';

export default function UnifiedKuranLessonScreen() {
    const { id } = useLocalSearchParams();
    const lessonId = parseInt(id as string, 10);
    const router = useRouter();
    const { themeVersion } = useTheme();
    const { completeLesson } = useUser();

    // State
    const stopSoundRef = useRef<(() => void) | null>(null);
    const [playedItems, setPlayedItems] = useState<Set<number>>(new Set());

    const { t, i18n } = useTranslation();

    // Explanation Content (Specific to Lesson 101)
    const explanationData = useMemo(() => {
        if (lessonId !== 101) return null;
        const data = i18n.language.startsWith('en') ? elifBaEn : elifBaTr;
        return data.lessonInfo;
    }, [lessonId, i18n.language]);

    // Derived Data
    const lessonData = useMemo(() => getLessonData(lessonId), [lessonId]);
    const lessonInfo = useMemo(() => lessons.find(l => l.id === lessonId), [lessonId]);
    const allItemsPlayed = lessonData.length > 0 && playedItems.size === lessonData.length;

    // Cleanup audio on unmount - release the singleton player
    useEffect(() => {
        return () => {
            releaseAudioPlayer();
        };
    }, []);

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
        }
    }), [themeVersion]);

    const handlePress = (item: KuranLessonContent) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        try {
            // Let playSound handle the interruption for better overlap performance
            // if (stopSoundRef.current) ...

            if (item.audio) {
                const stop = playSound(item.audio);
                stopSoundRef.current = stop;
            } else {
                console.log(`No audio for item ${item.id}`);
            }

            setPlayedItems(prev => new Set(prev).add(item.id));
        } catch (error) {
            console.error('Error playing audio:', error);
            stopSoundRef.current = null;
        }
    };

    const handleComplete = () => {
        if (!allItemsPlayed) return;
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        completeLesson(String(lessonId));
        router.push('/(tabs)');
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

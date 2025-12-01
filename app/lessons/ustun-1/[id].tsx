import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions, Image } from 'react-native';
import { useMemo, useEffect, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@constants/colors';
import { ArrowLeft, PlayCircle, Check } from 'phosphor-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';
import { Audio } from 'expo-av';
import { USTUN_1_WORDS, USTUN_1_AUDIO_FILES, type Word } from '@/data/ustun1';
import { useUser } from '@/store';

// Configure audio mode once
Audio.setAudioModeAsync({
    playsInSilentModeIOS: true,
    staysActiveInBackground: false,
    shouldDuckAndroid: true,
}).catch(console.error);

export default function Ustun1LessonScreen() {
    const router = useRouter();
    const { themeVersion } = useTheme();
    const { incrementDailyLessons, completeLesson } = useUser();
    const soundRef = useRef<Audio.Sound | null>(null);
    const [playedItems, setPlayedItems] = useState<Set<number>>(new Set());

    // Check if all items have been played
    const allItemsPlayed = playedItems.size === USTUN_1_WORDS.length;

    // Cleanup audio when component unmounts
    useEffect(() => {
        return () => {
            if (soundRef.current) {
                soundRef.current.unloadAsync().catch(console.error);
            }
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
        backButton: {
            padding: 8,
            marginRight: 8,
            borderRadius: 12,
            backgroundColor: colors.backgroundLighter,
        },
        titleContainer: {
            flex: 1,
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
            gap: 8,
            justifyContent: 'center',
            paddingBottom: 20,
        },
        card: {
            width: (Dimensions.get('window').width - 32 - 8) / 2,
            height: 120,
            backgroundColor: colors.surface,
            borderRadius: 12,
            padding: 4,
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
        imageContainer: {
            width: '100%',
            height: '100%',
            padding: 8,
            alignItems: 'center',
            justifyContent: 'center',
        },
        iconContainer: {
            position: 'absolute',
            top: 6,
            right: 6,
            flexDirection: 'row',
            gap: 4,
            zIndex: 1,
        },
        playIcon: {
            opacity: 0.5,
        },
        checkIcon: {
            opacity: 0.8,
        },
        completeButton: {
            backgroundColor: colors.primary,
            paddingVertical: 16,
            paddingHorizontal: 24,
            borderRadius: 12,
            alignItems: 'center',
            marginHorizontal: 16,
            marginTop: 24,
            marginBottom: 16,
            borderBottomWidth: 4,
            borderBottomColor: colors.primaryDark,
        },
        completeButtonDisabled: {
            backgroundColor: colors.backgroundLighter,
            borderBottomColor: colors.border,
            opacity: 0.5,
        },
        completeButtonPressed: {
            transform: [{ translateY: 2 }],
            borderBottomWidth: 2,
        },
        completeButtonText: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.textOnPrimary,
        },
        completeButtonTextDisabled: {
            color: colors.textSecondary,
        }
    }), [themeVersion]);

    const handlePress = async (word: Word) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        try {
            // Stop and unload previous sound if exists
            const currentSound = soundRef.current;
            if (currentSound) {
                soundRef.current = null;
                try {
                    await currentSound.stopAsync();
                    await currentSound.unloadAsync();
                } catch (cleanupError: any) {
                    if (cleanupError?.message !== 'Seeking interrupted.') {
                        console.warn('Error cleaning up previous sound:', cleanupError);
                    }
                }
            }

            const audioPath = USTUN_1_AUDIO_FILES[word.id];

            // If audio exists, play it
            if (audioPath) {
                const { sound } = await Audio.Sound.createAsync(audioPath);
                soundRef.current = sound;
                await sound.playAsync();

                sound.setOnPlaybackStatusUpdate((status) => {
                    if (status.isLoaded && status.didJustFinish) {
                        sound.unloadAsync().catch(console.error);
                        if (soundRef.current === sound) {
                            soundRef.current = null;
                        }
                    }
                });
            } else {
                console.log(`No audio file for word ${word.id} (${word.arabic})`);
            }

            // Mark as played even if no audio
            setPlayedItems(prev => new Set(prev).add(word.id));

        } catch (error) {
            console.error('Error playing audio:', error);
            soundRef.current = null;
        }
    };

    const handleCompleteLesson = () => {
        if (!allItemsPlayed) return;

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        incrementDailyLessons();
        completeLesson('4'); // Mark Üstün-1 as completed
        router.push('/(tabs)');
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Pressable
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <ArrowLeft size={24} color={colors.textPrimary} weight="bold" />
                </Pressable>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Üstün - 1</Text>
                    <Text style={styles.subtitle}>Kelimeleri Öğren</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.grid}>
                    {USTUN_1_WORDS.map((word) => (
                        <Pressable
                            key={word.id}
                            style={({ pressed }) => [
                                styles.card,
                                pressed && styles.cardPressed
                            ]}
                            onPress={() => handlePress(word)}
                        >
                            <View style={styles.iconContainer}>
                                {playedItems.has(word.id) && (
                                    <View style={styles.checkIcon}>
                                        <Check size={12} color={colors.success} weight="fill" />
                                    </View>
                                )}
                                <View style={styles.playIcon}>
                                    <PlayCircle size={12} color={colors.primary} weight="fill" />
                                </View>
                            </View>

                            <View style={styles.imageContainer}>
                                <Image
                                    source={word.image}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        resizeMode: 'contain',
                                        tintColor: colors.textPrimary,
                                    }}
                                />
                            </View>
                        </Pressable>
                    ))}
                </View>

                <Pressable
                    disabled={!allItemsPlayed}
                    style={({ pressed }) => [
                        styles.completeButton,
                        !allItemsPlayed && styles.completeButtonDisabled,
                        pressed && allItemsPlayed && styles.completeButtonPressed
                    ]}
                    onPress={handleCompleteLesson}
                >
                    <Text style={[
                        styles.completeButtonText,
                        !allItemsPlayed && styles.completeButtonTextDisabled
                    ]}>
                        Dersi Tamamla!
                    </Text>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}

import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import { useMemo, useEffect, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@constants/colors';
import { ArrowLeft, PlayCircle, CheckCircle } from 'phosphor-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';
import { playSound, releaseAudioPlayer } from '@/utils/audio';
import { ARABIC_LETTERS, LETTER_AUDIO_FILES, type Letter } from '@/data/elifBaLetters';
import { useUser } from '@/store';

export default function ElifBaIntroductionScreen() {
    const router = useRouter();
    const { themeVersion } = useTheme();
    const { completeLesson } = useUser();
    const stopSoundRef = useRef<(() => void) | null>(null);
    const [playedLetters, setPlayedLetters] = useState<Set<number>>(new Set());

    // Check if all letters have been played
    const allLettersPlayed = playedLetters.size === ARABIC_LETTERS.length;

    // Cleanup audio when component unmounts - release the singleton player
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
            gap: 12,
            justifyContent: 'center',
        },
        card: {
            width: (Dimensions.get('window').width - 32 - 24) / 3,
            aspectRatio: 0.85,
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 12,
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
        arabicText: {
            fontSize: 42,
            fontFamily: 'Amiri_700Bold',
            color: colors.primary,
            marginBottom: 8,
        },
        nameText: {
            fontSize: 16,
            fontWeight: 'bold',
            color: colors.textPrimary,
        },
        transText: {
            fontSize: 12,
            color: colors.textSecondary,
            marginTop: 2,
        },
        iconContainer: {
            position: 'absolute',
            top: 8,
            right: 8,
            flexDirection: 'row',
            gap: 4,
        },
        playIcon: {
            opacity: 0.5,
        },
        checkIcon: {
            opacity: 1.0, // Full opacity for CheckCircle
        },
        completeButton: {
            backgroundColor: colors.primary,
            paddingVertical: 16,
            paddingHorizontal: 24,
            borderRadius: 12,
            alignItems: 'center',
            marginHorizontal: 16,
            marginTop: 16,
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

    const handlePress = (letter: Letter) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        try {
            // Let playSound handle the interruption
            // if (stopSoundRef.current) ...

            const audioPath = LETTER_AUDIO_FILES[letter.id];
            if (!audioPath) {
                console.warn(`Audio file not found for letter ${letter.id}`);
                return;
            }

            const stop = playSound(audioPath);
            stopSoundRef.current = stop;
            setPlayedLetters(prev => new Set(prev).add(letter.id));
        } catch (error) {
            console.error('Error playing audio:', error);
            stopSoundRef.current = null;
        }
    };

    const handleCompleteLesson = () => {
        if (!allLettersPlayed) return;

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        completeLesson('101'); // Mark Elif-Ba as completed
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
                    <Text style={styles.title}>Elif Ba: Giriş</Text>
                    <Text style={styles.subtitle}>Arapça Harfler</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.grid}>
                    {ARABIC_LETTERS.map((letter) => (
                        <Pressable
                            key={letter.id}
                            style={({ pressed }) => [
                                styles.card,
                                pressed && styles.cardPressed
                            ]}
                            onPress={() => handlePress(letter)}
                        >
                            <View style={styles.iconContainer}>
                                {playedLetters.has(letter.id) && (
                                    <View style={styles.checkIcon}>
                                        <CheckCircle size={16} color={colors.success} weight="fill" />
                                    </View>
                                )}
                                <View style={styles.playIcon}>
                                    <PlayCircle size={16} color={colors.primary} weight="fill" />
                                </View>
                            </View>
                            <Text style={styles.arabicText}>{letter.arabic}</Text>
                            <Text style={styles.nameText}>{letter.name}</Text>
                            <Text style={styles.transText}>{letter.trans}</Text>
                        </Pressable>
                    ))}
                </View>

                <Pressable
                    disabled={!allLettersPlayed}
                    style={({ pressed }) => [
                        styles.completeButton,
                        !allLettersPlayed && styles.completeButtonDisabled,
                        pressed && allLettersPlayed && styles.completeButtonPressed
                    ]}
                    onPress={handleCompleteLesson}
                >
                    <Text style={[
                        styles.completeButtonText,
                        !allLettersPlayed && styles.completeButtonTextDisabled
                    ]}>
                        Dersi Tamamla!
                    </Text>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}

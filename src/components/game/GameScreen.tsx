import { useState, useEffect, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert, ActivityIndicator, Modal } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { BackHandler } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, runOnJS } from 'react-native-reanimated';
import { QuestionCard } from './QuestionCard';
import { OptionButton } from './OptionButton';
import { Timer } from './Timer';
import { LifeIndicator } from './LifeIndicator';
import { Button } from '@components/ui';
import { useStore, useUser } from '@/store';
import { colors } from '@constants/colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { hapticSuccess, hapticError, hapticLight } from '@/utils/haptics';
import * as Haptics from 'expo-haptics';
import { GameQuestion, GameType } from '@/types/game.types';
import { useGameCompletion } from '@/hooks';
import { GAME_UI_CONFIG } from '@constants/game';
import { logger } from '@/lib/logger';
import { playSound } from '@/utils/audio';
import { LETTER_AUDIO_FILES } from '@/data/elifBaLetters';
import { getXPProgress, formatXP } from '@/lib/utils/levelCalculations';

// Sound effect files
const CORRECT_CHOICE_SOUND = require('../../../assets/audio/effects/CorrectChoice.mp3');
const WRONG_CHOICE_SOUND = require('../../../assets/audio/effects/WrongChoice.mp3');
const GAME_COMPLETE_SOUND = require('../../../assets/audio/effects/GameComplete.mp3');
const LEVEL_UP_SOUND = require('../../../assets/audio/effects/LevelUp.mp3');

interface GameScreenProps {
    lessonId: string;
    gameType: GameType;
    questions: GameQuestion[];
    timerDuration?: number;
    hasLatinToggle?: boolean;
    onComplete?: () => void;
    source?: 'lesson' | 'test'; // Track where the game was started from
}

export function GameScreen({
    lessonId,
    gameType,
    questions,
    timerDuration = 10,
    hasLatinToggle = false,
    onComplete,
    source = 'lesson', // Default to lesson for backward compatibility
}: GameScreenProps) {
    const { t } = useTranslation();
    const router = useRouter();
    const { currentLives, maxLives, removeLives } = useStore();
    const { totalXP } = useUser();
    const { themeVersion } = useTheme();
    const { completeGame, isSubmitting } = useGameCompletion();
    const navigation = useNavigation();

    // Disable gestures and hardware back button
    useEffect(() => {
        // Disable swipe back gesture (iOS/Android)
        navigation.setOptions({
            gestureEnabled: false,
            // Also disable the header back button just in case (though we hide header)
            headerLeft: () => null,
        });

        // Disable hardware back button (Android)
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            // Return true to prevent default behavior (exit)
            return true;
        });

        return () => backHandler.remove();
    }, [navigation]);

    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
    const [isGameComplete, setIsGameComplete] = useState(false);
    const [gameCompletedRef, setGameCompletedRef] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [showLatin, setShowLatin] = useState(false);
    const stopSoundRef = useRef<(() => Promise<void>) | null>(null);
    const stopEffectSoundRef = useRef<(() => Promise<void>) | null>(null);
    const stopGameCompleteSoundRef = useRef<(() => Promise<void>) | null>(null);

    // XP bar animation
    const animatedXPWidth = useSharedValue(0);
    const [xpBarInitialized, setXpBarInitialized] = useState(false);

    const currentQuestion = questions[currentQuestionIndex];
    const styles = useMemo(() => getStyles(), [themeVersion]);

    // Configure audio mode once
    // playsInSilentModeIOS: false means sounds won't play when device is in silent mode
    // Cleanup audio when component unmounts
    useEffect(() => {
        return () => {
            if (stopSoundRef.current) stopSoundRef.current();
            if (stopEffectSoundRef.current) stopEffectSoundRef.current();
            if (stopGameCompleteSoundRef.current) stopGameCompleteSoundRef.current();
        };
    }, []);

    // Stop audio when question changes
    useEffect(() => {
        if (stopSoundRef.current) {
            stopSoundRef.current();
            stopSoundRef.current = null;
        }
    }, [currentQuestionIndex]);

    // Check lives on mount
    useEffect(() => {
        logger.game(`${gameType} game loaded - Using generic GameScreen component`);

        if (currentLives <= 0) {
            Alert.alert(t('errors.insufficientLives'), t('errors.insufficientLivesDesc'), [
                {
                    text: t('common.ok'),
                    onPress: handleExit,
                },
            ]);
            return;
        }

        // Deduct life
        removeLives(1);
    }, []);

    const handleTimeUp = () => {
        handleAnswer(getCurrentOptions()[0], 0);
    };

    // Play sound effect (correct or wrong)
    // Note: Sounds will not play if device is in silent mode (playsInSilentModeIOS: false)
    // Play sound effect (correct or wrong)
    const playSoundEffect = async (isCorrect: boolean) => {
        try {
            // Stop previous effect sound
            if (stopEffectSoundRef.current) {
                await stopEffectSoundRef.current();
                stopEffectSoundRef.current = null;
            }

            // Get the appropriate sound file
            const soundFile = isCorrect ? CORRECT_CHOICE_SOUND : WRONG_CHOICE_SOUND;

            // Play the sound effect
            const stop = await playSound(soundFile);
            stopEffectSoundRef.current = stop;
        } catch (error) {
            console.error('Error playing sound effect:', error);
            stopEffectSoundRef.current = null;
        }
    };

    const handleAnswer = async (answer: string, timeTaken: number) => {
        if (isAnswered) return;

        setSelectedOption(answer);
        const correct = hasLatinToggle && showLatin
            ? answer === currentQuestion.correctAnswerLatin
            : answer === currentQuestion.correctAnswer;

        setIsCorrect(correct);
        setIsAnswered(true);

        if (correct) {
            hapticSuccess();
            setCorrectAnswersCount((prev) => prev + 1);
            // Play correct answer sound
            playSoundEffect(true);
        } else {
            hapticError();
            // Play wrong answer sound
            playSoundEffect(false);
        }
    };

    const handleNext = () => {
        hapticLight();
        setIsAnswered(false);
        setSelectedOption(null);
        setIsCorrect(null);

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setIsGameComplete(true);
        }
    };

    const handleExit = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/');
        }
    };

    const handleRetry = () => {
        hapticLight();
        setCurrentQuestionIndex(0);
        setCorrectAnswersCount(0);
        setIsGameComplete(false);
        setIsAnswered(false);
        setSelectedOption(null);
        setIsCorrect(null);
    };

    // Ref to prevent double submission (more reliable than state for rapid taps)
    const isSubmittingRef = useRef(false);

    const handleComplete = async () => {
        // Check both state and ref
        if (isSubmitting || isSubmittingRef.current) return;

        // Lock immediately
        isSubmittingRef.current = true;
        hapticLight();

        // Mark game as completed (this will trigger sound in useEffect)
        setGameCompletedRef(true);

        try {
            // Use the centralized completion hook
            await completeGame({
                lessonId,
                gameType,
                correctAnswers: correctAnswersCount,
                totalQuestions: questions.length,
                source, // Pass source to track lesson vs test
            });

            if (onComplete) {
                onComplete();
            }
            handleExit();
        } catch (error) {
            console.error('Game completion error:', error);
            // Unlock on error so user can retry
            isSubmittingRef.current = false;
        }
    };

    const getCurrentOptions = () => {
        if (hasLatinToggle && showLatin && currentQuestion.optionsLatin) {
            return currentQuestion.optionsLatin;
        }
        return currentQuestion.options;
    };

    const getCurrentQuestion = () => {
        if (hasLatinToggle && showLatin && currentQuestion.questionLatin) {
            return currentQuestion.questionLatin;
        }
        return currentQuestion.question;
    };

    // Handle audio playback for letters game
    const handlePlayAudio = async () => {
        if (gameType !== 'letters' || !currentQuestion.audioFileId) {
            return;
        }

        hapticLight();

        try {
            // Stop previous sound
            if (stopSoundRef.current) {
                await stopSoundRef.current();
                stopSoundRef.current = null;
            }

            // Get audio file
            const audioFile = LETTER_AUDIO_FILES[currentQuestion.audioFileId];
            if (!audioFile) {
                console.warn(`Audio file not found for letter ${currentQuestion.audioFileId}`);
                return;
            }

            // Play audio
            const stop = await playSound(audioFile);
            stopSoundRef.current = stop;
        } catch (error) {
            console.error('Error playing audio:', error);
            stopSoundRef.current = null;
        }
    };

    const getOptionState = (option: string) => {
        if (!isAnswered) {
            return selectedOption === option ? 'selected' : 'default';
        }

        const correctAnswer = hasLatinToggle && showLatin
            ? currentQuestion.correctAnswerLatin
            : currentQuestion.correctAnswer;

        if (option === correctAnswer) {
            return 'correct';
        }

        if (option === selectedOption && !isCorrect) {
            return 'incorrect';
        }

        return 'default';
    };

    // Calculate XP progress for completion screen
    const xpEarned = correctAnswersCount;
    const { currentXPProgress, newXPProgress, leveledUp } = useMemo(() => {
        const current = getXPProgress(totalXP);
        const newXP = totalXP + xpEarned;
        const newProgress = getXPProgress(newXP);
        const leveled = newProgress.currentLevel > current.currentLevel;
        return {
            currentXPProgress: current,
            newXPProgress: newProgress,
            leveledUp: leveled,
        };
    }, [totalXP, xpEarned]);
    const [showLevelUpModal, setShowLevelUpModal] = useState(false);

    // Track current displayed level for XP bar
    const [displayedLevel, setDisplayedLevel] = useState(() => currentXPProgress.currentLevel);
    const [displayedXP, setDisplayedXP] = useState(() => currentXPProgress.currentLevelXP);
    const [displayedRequiredXP, setDisplayedRequiredXP] = useState(() => currentXPProgress.requiredXP);

    // Helper functions for state updates in animation callbacks
    const updateDisplayedLevel = (level: number, xp: number, requiredXP: number) => {
        setDisplayedLevel(level);
        setDisplayedXP(xp);
        setDisplayedRequiredXP(requiredXP);
    };

    const showLevelUp = () => {
        setShowLevelUpModal(true);
    };

    // Play game complete or level up sound based on modal visibility
    // Note: Sound will not play if device is in silent mode (playsInSilentModeIOS: false)
    // If level up modal is shown, play LevelUp sound, otherwise play GameComplete sound
    // Play game complete or level up sound based on modal visibility
    useEffect(() => {
        if (isGameComplete) {
            const playCompletionSound = async () => {
                try {
                    // Stop previous sound
                    if (stopGameCompleteSoundRef.current) {
                        await stopGameCompleteSoundRef.current();
                        stopGameCompleteSoundRef.current = null;
                    }

                    // Choose sound based on level up modal visibility
                    const soundFile = showLevelUpModal ? LEVEL_UP_SOUND : GAME_COMPLETE_SOUND;

                    // Play sound
                    const stop = await playSound(soundFile);
                    stopGameCompleteSoundRef.current = stop;
                } catch (error) {
                    console.error('Error playing completion sound:', error);
                    stopGameCompleteSoundRef.current = null;
                }
            };

            // Wait a bit for modal state to be set
            const timer = setTimeout(() => {
                playCompletionSound();
            }, 100);

            return () => clearTimeout(timer);
        }

        // Cleanup when component unmounts or game is not complete
        return () => {
            if (stopGameCompleteSoundRef.current && !isGameComplete) {
                stopGameCompleteSoundRef.current();
                stopGameCompleteSoundRef.current = null;
            }
        };
    }, [isGameComplete, showLevelUpModal]);

    // Animate XP bar when game completes
    useEffect(() => {
        if (isGameComplete && !xpBarInitialized) {
            // Set initial value
            animatedXPWidth.value = currentXPProgress.progressPercentage;
            setXpBarInitialized(true);
            setDisplayedLevel(currentXPProgress.currentLevel);
            setDisplayedXP(currentXPProgress.currentLevelXP);
            setDisplayedRequiredXP(currentXPProgress.requiredXP);

            // Store values for animation callbacks
            const newLevel = newXPProgress.currentLevel;
            const newXP = newXPProgress.currentLevelXP;
            const newRequired = newXPProgress.requiredXP;
            const newProgress = newXPProgress.progressPercentage;
            const isLeveledUp = leveledUp;

            // Start animation after a small delay
            const timer = setTimeout(() => {
                if (isLeveledUp) {
                    // Two-stage animation: first fill current level to 100%, then fill new level
                    // Stage 1: Fill current level to 100%
                    animatedXPWidth.value = withTiming(100, {
                        duration: 400,
                        easing: Easing.out(Easing.quad),
                    }, (finished) => {
                        if (finished) {
                            // Update displayed values to new level
                            runOnJS(updateDisplayedLevel)(newLevel, newXP, newRequired);

                            // Stage 2: Reset to 0% and fill new level
                            animatedXPWidth.value = 0;
                            animatedXPWidth.value = withTiming(newProgress, {
                                duration: 400,
                                easing: Easing.out(Easing.quad),
                            }, (finished2) => {
                                if (finished2) {
                                    // Show level up modal after animation completes
                                    runOnJS(showLevelUp)();
                                }
                            });
                        }
                    });
                } else {
                    // Single animation: just fill to new percentage
                    animatedXPWidth.value = withTiming(newProgress, {
                        duration: 500,
                        easing: Easing.out(Easing.quad),
                    });
                    runOnJS(updateDisplayedLevel)(newLevel, newXP, newRequired);
                }
            }, 100);

            return () => clearTimeout(timer);
        }

        // Reset when game is not complete
        if (!isGameComplete) {
            setXpBarInitialized(false);
            animatedXPWidth.value = 0;
            setShowLevelUpModal(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isGameComplete]);

    const animatedXPStyle = useAnimatedStyle(() => {
        return {
            width: `${animatedXPWidth.value}%`,
        };
    });

    // Level up modal is controlled by showLevelUpModal state

    if (isGameComplete) {
        const isExcellent = correctAnswersCount >= GAME_UI_CONFIG.EXCELLENT_SCORE_THRESHOLD;

        return (
            <View style={styles.container}>
                <View style={styles.completeContainer}>
                    <Text style={styles.completeTitle}>{t('gameUI.gameComplete')}</Text>
                    <Text style={styles.completeText}>
                        {isExcellent ? t('gameUI.congratulations') : t('gameUI.goodJob')}
                    </Text>

                    <View style={styles.statsContainer}>
                        <Text style={styles.statText}>
                            {t('gameUI.question')}: {questions.length}
                        </Text>
                        <Text style={styles.statText}>
                            {t('gameUI.correctAnswers')}: {correctAnswersCount}
                        </Text>
                        <Text style={styles.statText}>XP: +{correctAnswersCount}</Text>
                    </View>

                    {/* XP Progress Bar */}
                    <View style={styles.xpBarContainer}>
                        <View style={styles.xpBarBackground}>
                            <Animated.View style={[styles.xpBarFill, animatedXPStyle]} />
                            <View style={styles.xpBarTextContainer}>
                                <Text style={styles.xpBarText}>
                                    {formatXP(displayedXP)} / {formatXP(displayedRequiredXP)} XP
                                </Text>
                            </View>
                        </View>
                        <Text style={styles.xpBarLabel}>
                            Seviye {displayedLevel} {xpEarned > 0 && `(+${xpEarned} XP)`}
                        </Text>
                    </View>

                    <Pressable
                        style={[styles.completeButton, isSubmitting && { opacity: 0.7 }]}
                        onPress={handleComplete}
                        disabled={isSubmitting}
                    >
                        {isSubmitting && (
                            <ActivityIndicator
                                size="small"
                                color={colors.textOnPrimary}
                                style={{ marginRight: 8 }}
                            />
                        )}
                        <Text style={styles.completeButtonText}>
                            {isSubmitting ? t('common.loading') : t('common.finish')}
                        </Text>
                    </Pressable>

                    {!isSubmitting && (
                        <Pressable
                            style={[
                                styles.completeButton,
                                {
                                    backgroundColor: colors.warning,
                                    marginTop: 12,
                                    borderBottomColor: colors.warningDark,
                                },
                            ]}
                            onPress={handleRetry}
                            disabled={isSubmitting}
                        >
                            <Text style={styles.completeButtonText}>
                                {t('gameUI.playAgain').toUpperCase()}
                            </Text>
                        </Pressable>
                    )}
                </View>

                {/* Level Up Modal */}
                {showLevelUpModal && leveledUp && (
                    <Modal
                        visible={true}
                        transparent={true}
                        animationType="fade"
                        onRequestClose={() => setShowLevelUpModal(false)}
                    >
                        <Pressable
                            style={styles.modalOverlay}
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                setShowLevelUpModal(false);
                            }}
                        >
                            <Pressable
                                style={styles.levelUpModal}
                                onPress={(e) => e.stopPropagation()}
                            >
                                <Text style={styles.levelUpEmoji}>🎉</Text>
                                <Text style={styles.levelUpTitle}>Level Atladınız!</Text>
                                <Text style={styles.levelUpMessage}>
                                    Tebrikler! Seviye {newXPProgress.currentLevel}'e ulaştınız!
                                </Text>
                                <Pressable
                                    style={styles.levelUpButton}
                                    onPress={() => {
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                        setShowLevelUpModal(false);
                                    }}
                                >
                                    <Text style={styles.levelUpButtonText}>{t('common.ok')}</Text>
                                </Pressable>
                            </Pressable>
                        </Pressable>
                    </Modal>
                )}
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={handleExit}>
                    <Text style={styles.backButton}>✕</Text>
                </Pressable>
                <LifeIndicator currentLives={currentLives} maxLives={maxLives} />
            </View>

            {/* Timer */}
            <Timer
                key={currentQuestionIndex}
                duration={timerDuration}
                onTimeUp={handleTimeUp}
                isActive={!isAnswered}
            />

            <ScrollView style={styles.content}>
                <View style={styles.questionContainer}>
                    {/* Question */}
                    <QuestionCard
                        questionNumber={currentQuestionIndex + 1}
                        totalQuestions={questions.length}
                        question={getCurrentQuestion()}
                        onPlayAudio={gameType === 'letters' && currentQuestion.audioFileId ? handlePlayAudio : undefined}
                    />

                    {/* Latin Toggle Button (only for verses) */}
                    {hasLatinToggle && (
                        <Button
                            title={showLatin ? t('common.showArabic') : t('common.showLatin')}
                            variant="outline"
                            size="small"
                            onPress={() => setShowLatin(!showLatin)}
                            style={styles.toggleButton}
                        />
                    )}
                </View>

                {/* Options */}
                <View style={styles.options}>
                    {getCurrentOptions().map((option, index) => (
                        <OptionButton
                            key={index}
                            option={option}
                            state={getOptionState(option)}
                            onPress={() => handleAnswer(option, 0)}
                            disabled={isAnswered}
                        />
                    ))}
                </View>
            </ScrollView>

            {/* Next Button Footer */}
            {isAnswered && (
                <View style={styles.footer}>
                    {isCorrect ? (
                        <>
                            <Text style={styles.footerTitle}>Tebrikler!</Text>
                            <Text style={styles.footerMessage}>Bravo, böyle devam et!</Text>
                        </>
                    ) : (
                        <>
                            <Text style={styles.footerTitle}>Yanlış Cevap</Text>
                            <Text style={styles.footerMessage}>Bir sonraki soruya geçelim!</Text>
                        </>
                    )}
                    <Pressable
                        style={[
                            styles.nextButton,
                            !isCorrect && styles.nextButtonError
                        ]}
                        onPress={handleNext}
                    >
                        <Text style={styles.nextButtonText}>
                            {currentQuestionIndex < questions.length - 1
                                ? t('common.nextQuestion')
                                : t('common.finish')}
                        </Text>
                    </Pressable>
                </View>
            )}
        </View>
    );
}

const getStyles = () =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
            paddingTop: 60,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 16,
            marginBottom: 16,
        },
        backButton: {
            fontSize: 24,
            color: colors.textPrimary,
            fontWeight: '600',
        },
        content: {
            flex: 1,
            paddingHorizontal: 16,
        },
        questionContainer: {
            marginBottom: 16,
        },
        toggleButton: {
            marginTop: 8,
        },
        options: {
            marginTop: 8,
            paddingBottom: GAME_UI_CONFIG.FOOTER_PADDING,
        },
        footer: {
            position: 'absolute',
            bottom: 20,
            left: 0,
            right: 0,
            padding: 16,
            paddingTop: 40,
            backgroundColor: colors.background,
            borderTopWidth: 1,
            borderTopColor: colors.border,
        },
        footerTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.textPrimary,
            textAlign: 'center',
            marginBottom: 4,
            marginTop: -28,
        },
        footerMessage: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.textPrimary,
            textAlign: 'center',
            marginBottom: 12,
        },
        nextButton: {
            backgroundColor: colors.success,
            paddingVertical: 16,
            borderRadius: 16,
            alignItems: 'center',
            borderBottomWidth: 4,
            borderBottomColor: colors.successDark,
            marginHorizontal: 20,
        },
        nextButtonError: {
            backgroundColor: colors.error,
            borderBottomColor: colors.errorDark,
        },
        nextButtonText: {
            color: colors.textOnPrimary,
            fontSize: 18,
            fontWeight: 'bold',
        },
        completeContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
        },
        completeTitle: {
            fontSize: 32,
            fontWeight: 'bold',
            color: colors.textPrimary,
            marginBottom: 16,
        },
        completeText: {
            fontSize: 18,
            color: colors.textSecondary,
            marginBottom: 32,
        },
        statsContainer: {
            backgroundColor: colors.surface,
            padding: 20,
            borderRadius: 16,
            width: '100%',
            marginBottom: 32,
            alignItems: 'center',
            gap: 12,
        },
        statText: {
            fontSize: 18,
            fontWeight: '600',
            color: colors.textPrimary,
        },
        completeButton: {
            backgroundColor: colors.success,
            paddingVertical: 16,
            paddingHorizontal: 48,
            borderRadius: 16,
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            borderBottomWidth: 4,
            borderBottomColor: colors.successDark,
        },
        completeButtonText: {
            color: colors.textOnPrimary,
            fontSize: 18,
            fontWeight: 'bold',
        },
        xpBarContainer: {
            width: '100%',
            marginBottom: 24,
            paddingHorizontal: 20,
        },
        xpBarBackground: {
            height: 40,
            backgroundColor: colors.surface,
            borderRadius: 20,
            overflow: 'hidden',
            borderWidth: 2,
            borderColor: colors.border,
            position: 'relative',
            justifyContent: 'center',
        },
        xpBarFill: {
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            backgroundColor: colors.xpGold,
            borderRadius: 18,
        },
        xpBarTextContainer: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1,
        },
        xpBarText: {
            fontSize: 14,
            fontWeight: 'bold',
            color: colors.textPrimary,
        },
        xpBarLabel: {
            fontSize: 12,
            color: colors.textSecondary,
            textAlign: 'center',
            marginTop: 8,
        },
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        levelUpModal: {
            backgroundColor: colors.surface,
            borderRadius: 24,
            padding: 32,
            alignItems: 'center',
            width: '85%',
            maxWidth: 400,
            borderBottomWidth: 6,
            borderBottomColor: colors.primary,
        },
        levelUpEmoji: {
            fontSize: 64,
            marginBottom: 16,
        },
        levelUpTitle: {
            fontSize: 28,
            fontWeight: 'bold',
            color: colors.textPrimary,
            marginBottom: 12,
            textAlign: 'center',
        },
        levelUpMessage: {
            fontSize: 16,
            color: colors.textSecondary,
            textAlign: 'center',
            marginBottom: 24,
            lineHeight: 24,
        },
        levelUpButton: {
            backgroundColor: colors.primary,
            paddingVertical: 14,
            paddingHorizontal: 32,
            borderRadius: 12,
            borderBottomWidth: 4,
            borderBottomColor: colors.buttonOrangeBorder,
            minWidth: 120,
        },
        levelUpButtonText: {
            color: colors.textOnPrimary,
            fontSize: 16,
            fontWeight: 'bold',
            textAlign: 'center',
        },
    });
